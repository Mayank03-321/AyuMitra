import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { prisma } from './src/db.js';
import {
  extractClinicalEntities,
  evaluateRedFlags,
  generateAdaptiveFollowUp,
  generateClinicalSummary,
  extractEntitiesFromOcrText,
  voiceDialogueTurn,
  transcribeAudio,
} from './src/services/aiService.js';
import { runPaddleOcrOnImage } from './src/services/ocrBridge.js';
import {
  securityHeaders,
  rateLimiter,
  secureErrorHandler,
} from './src/middleware/security.js';
import {
  DEMO_PATIENT,
  DEMO_RED_FLAG,
  DEMO_PRESCRIPTION_DOC,
  DEMO_LAB_DOC,
  DEMO_CLINICAL_SUMMARY,
  INITIAL_AI_STATUS,
  QUESTION_BANK,
} from './src/data/initialData.js';

const app = express();
const PORT = 3000;

// Security Middlewares
app.use(securityHeaders);
app.use(rateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

async function recordAudit(actor: string, action: string, resource: string, sessionId?: string, metadata?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        actor,
        action,
        resource,
        sessionId,
        metadata: metadata ? metadata : undefined,
      }
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
}

async function seedInitialData() {
  try {
    const count = await prisma.patient.count();
    if (count > 0) return; // Already seeded

    console.log('Seeding initial data to PostgreSQL...');

    await prisma.patient.create({
      data: {
        id: DEMO_PATIENT.id,
        name: DEMO_PATIENT.name,
        age: DEMO_PATIENT.age,
        gender: DEMO_PATIENT.gender,
        language: DEMO_PATIENT.language,
        identity: DEMO_PATIENT.identity as any,
      }
    });

    const demoSession = await prisma.session.create({
      data: {
        id: 'SES-DEMO-2026-001',
        patientId: DEMO_PATIENT.id,
        language: 'hi',
        accessibilityMode: 'standard',
        state: 'SUMMARY_READY',
        inputMode: 'hybrid',
        abdmStatus: 'CONNECTED_SANDBOX',
        hisStatus: 'CONNECTED_DEMO',
        clinicalState: {
          chief_complaint: [
            { symptom: 'Chest pain and tightness', present: true, duration: '2 days', severity: 'severe', source: { type: 'PATIENT_STATEMENT', confidence: 0.98 } },
            { symptom: 'Breathlessness on mild exertion (Dyspnoea)', present: true, duration: '2 days', severity: 'severe', source: { type: 'PATIENT_STATEMENT', confidence: 0.96 } },
            { symptom: 'Fever', present: false, source: { type: 'PATIENT_STATEMENT', confidence: 0.99 } }
          ],
          hpi: { site: 'Central chest / sternum', onset: 'Sudden, 48 hours ago', radiation: 'Radiating to left shoulder' },
          past_medical_history: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
          medications: DEMO_PRESCRIPTION_DOC.extractedData?.medications || [],
          investigations: DEMO_LAB_DOC.extractedData?.labs || []
        } as any
      }
    });

    await prisma.document.createMany({
      data: [
        {
          id: DEMO_PRESCRIPTION_DOC.id,
          sessionId: demoSession.id,
          fileName: DEMO_PRESCRIPTION_DOC.fileName,
          fileType: DEMO_PRESCRIPTION_DOC.fileType,
          docType: DEMO_PRESCRIPTION_DOC.docType,
          status: DEMO_PRESCRIPTION_DOC.status,
          progressPercent: DEMO_PRESCRIPTION_DOC.progressPercent,
          ocrConfidence: DEMO_PRESCRIPTION_DOC.ocrConfidence,
          extractedEntitiesCount: DEMO_PRESCRIPTION_DOC.extractedEntitiesCount,
          rawOcrText: DEMO_PRESCRIPTION_DOC.rawOcrText,
          extractedData: DEMO_PRESCRIPTION_DOC.extractedData as any
        },
        {
          id: DEMO_LAB_DOC.id,
          sessionId: demoSession.id,
          fileName: DEMO_LAB_DOC.fileName,
          fileType: DEMO_LAB_DOC.fileType,
          docType: DEMO_LAB_DOC.docType,
          status: DEMO_LAB_DOC.status,
          progressPercent: DEMO_LAB_DOC.progressPercent,
          ocrConfidence: DEMO_LAB_DOC.ocrConfidence,
          extractedEntitiesCount: DEMO_LAB_DOC.extractedEntitiesCount,
          rawOcrText: DEMO_LAB_DOC.rawOcrText,
          extractedData: DEMO_LAB_DOC.extractedData as any
        }
      ]
    });

    await prisma.redFlag.create({
      data: {
        id: DEMO_RED_FLAG.id,
        title: DEMO_RED_FLAG.title,
        reason: DEMO_RED_FLAG.reason,
        evidence: DEMO_RED_FLAG.evidence,
        riskLevel: DEMO_RED_FLAG.riskLevel,
        requiresImmediateTriage: DEMO_RED_FLAG.requiresImmediateTriage,
        source: DEMO_RED_FLAG.source as any,
        ruleId: DEMO_RED_FLAG.ruleId,
        status: DEMO_RED_FLAG.status
      }
    });

    await prisma.summary.create({
      data: {
        sessionId: demoSession.id,
        verificationStatus: DEMO_CLINICAL_SUMMARY.verificationStatus,
        chiefComplaint: DEMO_CLINICAL_SUMMARY.chiefComplaint,
        hpi: DEMO_CLINICAL_SUMMARY.hpi,
        pastMedicalHistory: DEMO_CLINICAL_SUMMARY.pastMedicalHistory,
        pastSurgicalHistory: DEMO_CLINICAL_SUMMARY.pastSurgicalHistory,
        medications: DEMO_CLINICAL_SUMMARY.medications as any,
        allergies: DEMO_CLINICAL_SUMMARY.allergies as any,
        familyHistory: DEMO_CLINICAL_SUMMARY.familyHistory,
        personalHistory: DEMO_CLINICAL_SUMMARY.personalHistory as any,
        reviewOfSystems: DEMO_CLINICAL_SUMMARY.reviewOfSystems as any,
        priorInvestigations: DEMO_CLINICAL_SUMMARY.priorInvestigations as any,
        priorityAlerts: DEMO_CLINICAL_SUMMARY.priorityAlerts as any,
        conflicts: DEMO_CLINICAL_SUMMARY.conflicts as any,
        auditTrail: DEMO_CLINICAL_SUMMARY.auditTrail as any
      }
    });

    await prisma.consent.create({
      data: {
        consentId: 'CON-DEMO-001',
        patientId: DEMO_PATIENT.id,
        sessionId: demoSession.id,
        purpose: 'Digital OPD Clinical History Taking & Document OCR',
        scope: ['clinical_history', 'document_ocr', 'abdm_sync', 'physician_review'],
        status: 'granted',
        version: 'DPDP-2023-V1.0'
      }
    });

    await recordAudit('SYSTEM', 'SEED_DEMO_DATA', 'Database', demoSession.id, { seededPatient: DEMO_PATIENT.id });
    console.log('Seed complete.');
  } catch (seedErr) {
    console.warn('Initial seeding note:', (seedErr as any)?.message || seedErr);
  }
}

seedInitialData();

app.get('/health', (_req, res) => res.json({ status: 'UP', timestamp: new Date().toISOString() }));

// Direct Document Download Endpoints
app.get('/download/prd', (_req, res) => {
  res.download(path.join(process.cwd(), 'PRD.md'), 'AyuMitra_PRD.md');
});
app.get('/download/trd', (_req, res) => {
  res.download(path.join(process.cwd(), 'TRD.md'), 'AyuMitra_TRD.md');
});
app.get('/download/all', (_req, res) => {
  res.download(path.join(process.cwd(), 'AYUMITRA_PRD_AND_TRD.md'), 'AyuMitra_PRD_and_TRD.md');
});
app.get('/download/html', (_req, res) => {
  res.download(path.join(process.cwd(), 'AYUMITRA_SPECIFICATION.html'), 'AyuMitra_Specification.html');
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { username, role } = req.body;
  const userRole = role || (username?.includes('dr') ? 'PHYSICIAN' : 'PATIENT');
  await recordAudit(username || 'user', 'AUTH_LOGIN', 'AuthService', undefined, { role: userRole });
  res.json({ token: 'mock-jwt-token', user: { id: 'usr-001', name: username || 'Dr. Ananya Roy', role: userRole } });
});

app.post('/api/v1/patients', async (req, res, next) => {
  try {
    const patient = await prisma.patient.create({
      data: {
        name: req.body.name || 'Anonymous Patient',
        age: req.body.age ? Number(req.body.age) : 45,
        gender: req.body.gender || 'other',
        language: req.body.language || 'en',
        identity: req.body.identity || { type: 'new_patient', idNumber: 'GEN-000', isVerified: false },
        abhaAddress: req.body.abhaAddress,
      }
    });
    await recordAudit('KIOSK', 'PATIENT_REGISTERED', 'PatientRepository', undefined, { patientId: patient.id });
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/patients/:id', async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/sessions', async (req, res, next) => {
  try {
    const session = await prisma.session.create({
      data: {
        patientId: req.body.patientId,
        language: req.body.language || 'hi',
        accessibilityMode: req.body.accessibilityMode || 'standard',
        state: 'CREATED',
        inputMode: req.body.inputMode || 'voice',
        clinicalState: { chief_complaint: [], hpi: {}, past_medical_history: [], medications: [], allergies: [], investigations: [], ayush: {} },
        abdmStatus: 'NOT_SUBMITTED',
        hisStatus: 'NOT_SUBMITTED'
      }
    });
    await recordAudit('KIOSK', 'SESSION_CREATED', 'SessionManager', session.id);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/sessions/:id', async (req, res, next) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: { patient: true, documents: true, summary: true }
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/sessions/:id/start', async (req, res, next) => {
  try {
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: { state: 'IN_PROGRESS' }
    });
    await recordAudit('KIOSK', 'SESSION_STARTED', 'SessionManager', session.id);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/sessions/:id/submit', async (req, res, next) => {
  try {
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: { state: 'SUMMARY_READY' }
    });
    await recordAudit('PATIENT', 'SESSION_SUBMITTED_FOR_REVIEW', 'SessionManager', session.id);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// --- AI Endpoints (Groq LLM + Groq Whisper STT + OmniVoice Powered) ---

app.post('/api/v1/ai/stt', async (req, res, next) => {
  try {
    const { audioBase64, mimeType, language, sessionId } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required (base64)' });
    }

    const sttResult = await transcribeAudio(audioBase64, mimeType || 'audio/webm', language);
    await recordAudit('VOICE_ENGINE', 'STT_TRANSCRIPTION', 'Whisper_Large_v3_Turbo', sessionId, {
      confidence: sttResult.confidence,
      hasText: !!sttResult.transcript,
    });

    res.json(sttResult);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/ai/voice-dialogue', async (req, res, next) => {
  try {
    const { history, utterance, language, sessionId } = req.body;
    if (!utterance) {
      return res.status(400).json({ error: 'Patient utterance is required' });
    }

    const dialogueResult = await voiceDialogueTurn(
      history || [],
      utterance,
      language || 'en'
    );

    if (sessionId && dialogueResult.extractedComplaints?.length > 0) {
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      if (session) {
        const existingState = (session.clinicalState as any) || {};
        const mergedComplaints = [
          ...(existingState.chief_complaint || []),
          ...dialogueResult.extractedComplaints
        ];
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            clinicalState: {
              ...existingState,
              chief_complaint: mergedComplaints
            } as any
          }
        });
      }
    }

    await recordAudit('VOICE_ENGINE', 'VOICE_DIALOGUE_TURN', 'OmniVoice_Groq', sessionId, {
      isComplete: dialogueResult.isConversationComplete
    });

    res.json(dialogueResult);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/ai/extract-complaint', async (req, res, next) => {
  try {
    const { transcript, language, sessionId } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const extraction = await extractClinicalEntities(transcript, language || 'en');

    // If session ID provided, update session clinicalState and evaluate red flags
    if (sessionId) {
      const session = await prisma.session.findUnique({ where: { id: sessionId } });
      if (session) {
        const existingState = (session.clinicalState as any) || {};
        const updatedState = {
          ...existingState,
          chief_complaint: extraction.chiefComplaints || existingState.chief_complaint || [],
          hpi: extraction.hpi || existingState.hpi || {},
        };

        await prisma.session.update({
          where: { id: sessionId },
          data: { clinicalState: updatedState as any }
        });
      }

      // Check red flags if triage indicates emergency
      if (extraction.requiresEmergencyTriage) {
        await prisma.redFlag.create({
          data: {
            title: extraction.triageReason || 'Potential Critical Clinical Finding',
            reason: extraction.triageReason || 'Extracted severe clinical symptom requires urgent evaluation',
            evidence: [transcript],
            riskLevel: 'CRITICAL',
            requiresImmediateTriage: true,
            source: { type: 'VOICE_INTAKE_AI', confidence: 0.95 },
            ruleId: 'RULE-AI-TRIAGE-01',
            status: 'active'
          }
        });
      }
    }

    await recordAudit('AI_ENGINE', 'COMPLAINT_EXTRACTED', 'AIExtractor', sessionId, { extractedCount: extraction.chiefComplaints?.length });
    res.json(extraction);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/ai/red-flags/evaluate', async (req, res, next) => {
  try {
    const { clinicalData, sessionId } = req.body;
    const triage = await evaluateRedFlags(clinicalData);
    await recordAudit('AI_ENGINE', 'RED_FLAGS_EVALUATED', 'AIEvaluator', sessionId);
    res.json(triage);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/ai/questions/adaptive', async (req, res, next) => {
  try {
    const { complaints, language } = req.body;
    const nextQuestion = await generateAdaptiveFollowUp(complaints || [], language || 'en');
    res.json(nextQuestion);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/ai/summary/generate', async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { patient: true, documents: true }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const summaryData = await generateClinicalSummary(session);

    const savedSummary = await prisma.summary.upsert({
      where: { sessionId },
      update: {
        chiefComplaint: summaryData.chiefComplaint,
        hpi: summaryData.hpi,
        pastMedicalHistory: summaryData.pastMedicalHistory as any,
        pastSurgicalHistory: summaryData.pastSurgicalHistory as any,
        medications: summaryData.medications as any,
        allergies: summaryData.allergies as any,
        reviewOfSystems: summaryData.reviewOfSystems as any,
        ayush: summaryData.ayushFindings as any,
        priorityAlerts: summaryData.priorityAlerts as any,
        verificationStatus: 'PENDING_PHYSICIAN_REVIEW',
      },
      create: {
        sessionId,
        verificationStatus: 'PENDING_PHYSICIAN_REVIEW',
        chiefComplaint: summaryData.chiefComplaint,
        hpi: summaryData.hpi,
        pastMedicalHistory: summaryData.pastMedicalHistory as any,
        pastSurgicalHistory: summaryData.pastSurgicalHistory as any,
        medications: summaryData.medications as any,
        allergies: summaryData.allergies as any,
        reviewOfSystems: summaryData.reviewOfSystems as any,
        ayush: summaryData.ayushFindings as any,
        priorityAlerts: summaryData.priorityAlerts as any,
      }
    });

    await recordAudit('AI_ENGINE', 'SUMMARY_GENERATED', 'ClinicalSummary', sessionId);
    res.json(savedSummary);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/sessions/:id/documents/ocr-scan', async (req, res, next) => {
  try {
    const { image, fileName, fileType, docType } = req.body;
    const sessionId = req.params.id;

    if (!image) {
      return res.status(400).json({ error: 'Image file or base64 data required' });
    }

    // 1. Run PaddleOCR Text Extraction
    const ocrResult = await runPaddleOcrOnImage(image);

    // 2. Extract structured medical entities using Groq LLM
    const extractedData = await extractEntitiesFromOcrText(
      ocrResult.rawText || 'Prescription / medical record',
      docType || 'prescription'
    );

    // 3. Save Document in PostgreSQL via Prisma
    const docId = 'DOC-' + Date.now();
    const doc = await prisma.document.create({
      data: {
        id: docId,
        sessionId,
        fileName: fileName || 'scanned_document.jpg',
        fileType: fileType || 'image/jpeg',
        docType: docType || 'prescription',
        status: 'COMPLETED',
        progressPercent: 100,
        ocrConfidence: ocrResult.ocrConfidence || 0.92,
        extractedEntitiesCount: extractedData.extractedEntitiesCount || ((extractedData.medications?.length || 0) + (extractedData.labResults?.length || 0)),
        rawOcrText: ocrResult.rawText,
        extractedData: extractedData as any,
      }
    });

    // 4. Update session clinicalState with new medications/labs
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (session) {
      const existingState = (session.clinicalState as any) || {};
      const updatedMeds = [
        ...(existingState.medications || []),
        ...(extractedData.medications || [])
      ];
      const updatedLabs = [
        ...(existingState.investigations || []),
        ...(extractedData.labResults || [])
      ];

      await prisma.session.update({
        where: { id: sessionId },
        data: {
          clinicalState: {
            ...existingState,
            medications: updatedMeds,
            investigations: updatedLabs,
          } as any
        }
      });
    }

    await recordAudit('KIOSK', 'DOCUMENT_OCR_SCANNED', 'PaddleOCR_Engine', sessionId, {
      docId: doc.id,
      docType: doc.docType,
      engine: ocrResult.engine
    });

    res.status(201).json({
      document: doc,
      ocrResult,
      extractedData,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/sessions/:id/questions/next', async (req, res) => {
  const isAyush = req.query.ayush === 'true';
  const filtered = QUESTION_BANK.filter((q) => (isAyush ? true : !q.isAyushOnly));
  res.json({ nextQuestion: filtered[0] || null, allQuestions: filtered });
});

app.post('/api/v1/sessions/:id/answers', async (req, res) => {
  const { questionId, answer, mode } = req.body;
  await recordAudit('PATIENT', 'ANSWER_RECORDED', 'ConversationEngine', req.params.id, { questionId, mode });
  res.json({ success: true, processedAnswer: answer, stateUpdated: true });
});

app.get('/api/v1/sessions/:id/clinical-state', async (req, res, next) => {
  try {
    const session = await prisma.session.findUnique({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session.clinicalState);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/triage/alerts', async (_req, res, next) => {
  try {
    const flags = await prisma.redFlag.findMany({ orderBy: { id: 'desc' } });
    res.json(flags);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/physician/queue', async (_req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { patient: true, documents: true },
      orderBy: { startedAt: 'desc' }
    });
    
    const queue = sessions.map((s, index) => ({
      sessionId: s.id,
      patientId: s.patientId,
      patientName: s.patient?.name || 'Unknown',
      age: s.patient?.age || 0,
      gender: s.patient?.gender || 'unknown',
      tokenNumber: 'A-' + (100 + index),
      chiefComplaint: (s.clinicalState as any)?.chief_complaint?.[0]?.symptom || 'Not recorded',
      triageLevel: s.id === 'SES-DEMO-2026-001' ? 'CRITICAL' : 'ROUTINE',
      status: s.state,
      documentsCount: s.documents?.length || 0,
      arrivalTime: s.startedAt.toISOString(),
      languages: s.language
    }));
    res.json(queue);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/ai/status', (_req, res) => {
  res.json({
    ...INITIAL_AI_STATUS,
    provider: 'Groq Cloud Inference Engine',
    model: 'qwen/qwen3.8-27b',
    status: 'ACTIVE_HEALTHY'
  });
});

// Register Secure Error Handler
app.use(secureErrorHandler);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}
startServer();
