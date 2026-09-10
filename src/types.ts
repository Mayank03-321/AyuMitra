/**
 * AyuMitra Shared Clinical & System Types
 * Compliant with SIH Problem Statement 4: Patient Case-Taking Software
 */

export type LanguageCode = 'hi' | 'en' | 'ta' | 'te' | 'kn' | 'mr' | 'bn';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  greetingAudio?: string;
  flag: string;
}

export type AccessibilityMode = 'standard' | 'elderly' | 'low-literacy';

export type IdentificationType = 'abha' | 'hospital_id' | 'new_patient';

export interface PatientIdentity {
  type: IdentificationType;
  idNumber: string; // ABHA ID (e.g. 14-digit) or Hospital MRN
  isVerified: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  language: LanguageCode;
  identity: PatientIdentity;
  abhaAddress?: string;
}

export type ConsentStatus = 'granted' | 'revoked' | 'pending';

export interface ConsentRecord {
  consentId: string;
  patientId: string;
  sessionId: string;
  purpose: string;
  scope: string[]; // e.g. ['clinical_history', 'document_ocr', 'abdm_sync', 'physician_review']
  status: ConsentStatus;
  grantedAt: string;
  revokedAt?: string;
  version: string;
}

export type SessionState =
  | 'CREATED'
  | 'IDENTIFIED'
  | 'CONSENTED'
  | 'IN_PROGRESS'
  | 'DOCUMENT_PROCESSING'
  | 'SUMMARY_READY'
  | 'PHYSICIAN_REVIEW'
  | 'VERIFIED'
  | 'SUBMITTED'
  | 'COMPLETED'
  | 'TERMINATED';

export type InputMode = 'voice' | 'touch' | 'hybrid';

export type SourceType =
  | 'PATIENT_STATEMENT'
  | 'DOCUMENT'
  | 'LAB_REPORT'
  | 'PRESCRIPTION'
  | 'PHYSICIAN_ENTRY'
  | 'SYSTEM_RULE'
  | 'AI_INFERENCE';

export interface ClinicalSource {
  type: SourceType;
  id?: string;
  name?: string;
  page?: number;
  confidence: number; // 0.0 to 1.0
  timestamp?: string;
}

export interface SymptomEntity {
  id: string;
  symptom: string;
  present: boolean; // Negation handling: "I don't have fever" => present: false
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  onset?: string;
  bodyPart?: string;
  trigger?: string;
  source: ClinicalSource;
}

export interface MedicationEntity {
  id: string;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  duration?: string;
  status: 'current' | 'past' | 'discontinued';
  source: ClinicalSource;
}

export interface AllergyEntity {
  id: string;
  allergen: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'life-threatening';
  source: ClinicalSource;
}

export interface DiagnosisEntity {
  id: string;
  condition: string;
  status: 'current' | 'past' | 'recurring' | 'resolved' | 'suspected';
  diagnosedYear?: string;
  source: ClinicalSource;
}

export interface LabResultEntity {
  id: string;
  testName: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  date?: string;
  source: ClinicalSource;
}

export interface AyushAssessment {
  prakriti?: string; // Vata, Pitta, Kapha, or combinations
  vikriti?: string;  // Current doshic imbalance
  agni?: 'sama' | 'vishama' | 'tikshna' | 'manda'; // Digestive fire
  koshtha?: 'krura' | 'madhyama' | 'mridu'; // Bowel nature
  aharaVihara?: {
    dietType?: string;
    sleepPattern?: string;
    appetite?: string;
  };
  nidana?: string[]; // Causative factors
  source: ClinicalSource;
}

export interface RedFlagAlert {
  id: string;
  title: string;
  reason: string;
  evidence: string[];
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE';
  requiresImmediateTriage: boolean;
  source: ClinicalSource;
  ruleId: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface ClinicalConflict {
  id: string;
  field: string;
  patientValue: string;
  documentValue: string;
  requiresReview: boolean;
  resolvedValue?: string;
  resolutionNote?: string;
  isResolved: boolean;
}

export interface MedicalTimelineEvent {
  eventId: string;
  date: string;
  type: 'DIAGNOSIS' | 'PRESCRIPTION' | 'LAB_REPORT' | 'SURGERY' | 'CURRENT_VISIT';
  title: string;
  description: string;
  source: ClinicalSource;
}

export type DocumentType =
  | 'PRESCRIPTION'
  | 'LAB_REPORT'
  | 'DISCHARGE_SUMMARY'
  | 'IMAGING_REPORT'
  | 'OTHER';

export type DocumentProcessingStatus =
  | 'UPLOADED'
  | 'VALIDATING'
  | 'PREPROCESSING'
  | 'OCR_PROCESSING'
  | 'EXTRACTING'
  | 'NORMALIZING'
  | 'READY'
  | 'FAILED'
  | 'NEEDS_REVIEW';

export interface MedicalDocument {
  id: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  docType: DocumentType;
  uploadDate: string;
  status: DocumentProcessingStatus;
  progressPercent: number;
  ocrConfidence: number;
  extractedEntitiesCount: number;
  rawOcrText?: string;
  extractedData?: {
    medications?: MedicationEntity[];
    labs?: LabResultEntity[];
    diagnoses?: DiagnosisEntity[];
  };
}

export type SummaryVerificationStatus =
  | 'DRAFT'
  | 'AI_GENERATED'
  | 'REVIEW_REQUIRED'
  | 'PHYSICIAN_EDITED'
  | 'PHYSICIAN_CONFIRMED'
  | 'REJECTED'
  | 'FINAL';

export interface ClinicalSummary {
  id: string;
  sessionId: string;
  verificationStatus: SummaryVerificationStatus;
  chiefComplaint: string;
  hpi: string;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  medications: MedicationEntity[];
  allergies: AllergyEntity[];
  familyHistory: string[];
  personalHistory: {
    smoking?: string;
    alcohol?: string;
    diet?: string;
    sleep?: string;
  };
  reviewOfSystems: {
    cardiovascular?: string;
    respiratory?: string;
    gastrointestinal?: string;
    neurological?: string;
  };
  priorInvestigations: LabResultEntity[];
  ayush?: AyushAssessment;
  priorityAlerts: RedFlagAlert[];
  conflicts: ClinicalConflict[];
  physicianNotes?: string;
  verifiedByDoctor?: string;
  verifiedAt?: string;
  generatedAt: string;
  auditTrail: {
    timestamp: string;
    action: string;
    actor: string;
    detail?: string;
  }[];
}

export interface QuestionOption {
  id: string;
  label: string;
  labelHi?: string;
  icon?: string;
}

export interface ClinicalQuestion {
  id: string;
  text: string;
  textHi: string;
  category: 'CHIEF_COMPLAINT' | 'SOCRATES' | 'PAST_HISTORY' | 'MEDS' | 'AYUSH' | 'GENERAL';
  targetField: string;
  priority: number;
  answerType: 'single_choice' | 'multi_choice' | 'free_text' | 'voice_or_touch' | 'scale';
  options?: QuestionOption[];
  isAyushOnly?: boolean;
}

export interface IntegrationSubmission {
  abdmStatus: 'NOT_SUBMITTED' | 'CONNECTED_SANDBOX' | 'FAILED' | 'SUCCESS';
  hisStatus: 'NOT_SUBMITTED' | 'CONNECTED_DEMO' | 'FAILED' | 'SUCCESS';
  fhirBundleId?: string;
  hisTransactionId?: string;
  submittedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  resource: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AIProviderStatus {
  service: 'LLM' | 'ASR' | 'TTS' | 'OCR' | 'NLP' | 'DRUG_INTERACTION' | 'TRANSLATION';
  providerName: string;
  status: 'AVAILABLE' | 'MOCK' | 'UNAVAILABLE' | 'ERROR';
  modelOrVersion: string;
  latencyMs: number;
}
