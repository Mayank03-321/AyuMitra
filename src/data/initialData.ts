import {
  LanguageConfig,
  ClinicalQuestion,
  Patient,
  MedicalDocument,
  RedFlagAlert,
  MedicalTimelineEvent,
  ClinicalSummary,
  AIProviderStatus,
  ClinicalConflict,
} from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

export const QUESTION_BANK: ClinicalQuestion[] = [
  {
    id: 'q_cc_1',
    text: 'What brings you to the hospital today? Please describe your primary problem.',
    textHi: 'आज आप अस्पताल किस कारण से आए हैं? कृपया अपनी मुख्य समस्या बताएं।',
    category: 'CHIEF_COMPLAINT',
    targetField: 'chief_complaint',
    priority: 1,
    answerType: 'voice_or_touch',
    options: [
      { id: 'opt_chest_pain', label: 'Chest pain or discomfort', labelHi: 'सीने में दर्द या भारीपन', icon: 'Heart' },
      { id: 'opt_breathless', label: 'Difficulty breathing', labelHi: 'सांस लेने में तकलीफ', icon: 'Wind' },
      { id: 'opt_fever', label: 'Fever or chills', labelHi: 'बुखार या ठंड लगना', icon: 'Thermometer' },
      { id: 'opt_stomach', label: 'Stomach ache or digestion issues', labelHi: 'पेट दर्द या पाचन की समस्या', icon: 'Activity' },
      { id: 'opt_body_ache', label: 'Joint / Body pain', labelHi: 'जोड़ों या शरीर में दर्द', icon: 'User' },
    ],
  },
  {
    id: 'q_soc_site',
    text: 'Where exactly is the pain or discomfort located?',
    textHi: 'दर्द ठीक किस जगह पर हो रहा है?',
    category: 'SOCRATES',
    targetField: 'socrates.site',
    priority: 2,
    answerType: 'single_choice',
    options: [
      { id: 'site_center_chest', label: 'Center of chest / Sternum', labelHi: 'छाती के बीच में', icon: 'Target' },
      { id: 'site_left_chest', label: 'Left side of chest', labelHi: 'छाती के बाईं ओर', icon: 'Target' },
      { id: 'site_radiating_arm', label: 'Spreading to left arm or jaw', labelHi: 'बाएं हाथ या जबड़े तक फैल रहा है', icon: 'AlertTriangle' },
      { id: 'site_abdomen', label: 'Upper abdomen', labelHi: 'ऊपरी पेट में', icon: 'Target' },
    ],
  },
  {
    id: 'q_soc_onset',
    text: 'Since how many days or hours have you had this symptom?',
    textHi: 'यह लक्षण आपको कितने दिनों या घंटों से है?',
    category: 'SOCRATES',
    targetField: 'socrates.onset',
    priority: 3,
    answerType: 'single_choice',
    options: [
      { id: 'dur_today', label: 'Started today (<24 hours)', labelHi: 'आज ही शुरू हुआ (<24 घंटे)', icon: 'Clock' },
      { id: 'dur_2days', label: '2 days ago', labelHi: '2 दिन पहले से', icon: 'Clock' },
      { id: 'dur_1week', label: 'About a week ago', labelHi: 'लगभग 1 हफ्ते से', icon: 'Calendar' },
      { id: 'dur_chronic', label: 'More than a month', labelHi: '1 महीने से ज्यादा समय से', icon: 'Calendar' },
    ],
  },
  {
    id: 'q_soc_radiation',
    text: 'Does the pain spread anywhere else, such as your shoulder, arm, back, or neck?',
    textHi: 'क्या दर्द कंधे, बांह, पीठ या गर्दन की तरफ भी फैलता है?',
    category: 'SOCRATES',
    targetField: 'socrates.radiation',
    priority: 4,
    answerType: 'single_choice',
    options: [
      { id: 'rad_left_arm', label: 'Yes, radiates to left shoulder/arm', labelHi: 'हाँ, बाएं कंधे/हाथ में जाता है', icon: 'AlertCircle' },
      { id: 'rad_neck_jaw', label: 'Yes, to neck and jaw', labelHi: 'हाँ, गर्दन और जबड़े में', icon: 'AlertCircle' },
      { id: 'rad_none', label: 'No, stays in one place', labelHi: 'नहीं, एक ही जगह रहता है', icon: 'CheckCircle' },
    ],
  },
  {
    id: 'q_pmh_diabetes',
    text: 'Do you have any existing chronic conditions like Diabetes, High Blood Pressure, or Thyroid?',
    textHi: 'क्या आपको शुगर (डायबिटीज), बीपी (उच्च रक्तचाप) या थायरॉयड जैसी कोई पुरानी बीमारी है?',
    category: 'PAST_HISTORY',
    targetField: 'past_medical_history',
    priority: 5,
    answerType: 'multi_choice',
    options: [
      { id: 'pmh_t2d', label: 'Type 2 Diabetes (Sugar)', labelHi: 'डायबिटीज (शुगर)', icon: 'Check' },
      { id: 'pmh_htn', label: 'Hypertension (High BP)', labelHi: 'उच्च रक्तचाप (High BP)', icon: 'Check' },
      { id: 'pmh_heart', label: 'Prior Heart condition', labelHi: 'पुरानी हृदय समस्या', icon: 'Heart' },
      { id: 'pmh_none', label: 'None of the above', labelHi: 'इनमें से कोई नहीं', icon: 'X' },
    ],
  },
  {
    id: 'q_general_appetite',
    text: 'How is your appetite?',
    textHi: 'आपकी भूख कैसी है?',
    category: 'GENERAL',
    targetField: 'lifestyle.appetite',
    priority: 6,
    
    answerType: 'single_choice',
    options: [
      { id: 'agni_sama', label: 'Normal, healthy appetite', labelHi: 'सामान्य, उचित भूख', icon: 'Sun' },
      { id: 'agni_manda', label: 'Poor appetite or heaviness', labelHi: 'भूख में कमी या भारीपन', icon: 'Coffee' },
      { id: 'agni_tikshna', label: 'Intense hunger or acidity', labelHi: 'तेज़ भूख या एसिडिटी', icon: 'Zap' },
      { id: 'agni_vishama', label: 'Irregular or fluctuating appetite', labelHi: 'अनियमित भूख', icon: 'Activity' },
    ],
  },
  {
    id: 'q_general_sleep',
    text: 'How is your sleep quality?',
    textHi: 'आपकी नींद की गुणवत्ता कैसी है?',
    category: 'GENERAL',
    targetField: 'lifestyle.sleep',
    priority: 7,
    
    answerType: 'single_choice',
    options: [
      { id: 'sleep_disturbed', label: 'Fragmented or disturbed sleep', labelHi: 'टूट-टूट कर या अशांत नींद', icon: 'AlertTriangle' },
      { id: 'sleep_good', label: 'Sound and restful sleep', labelHi: 'गहरी और आरामदायक नींद', icon: 'CheckCircle' },
      { id: 'sleep_insomnia', label: 'Difficulty falling asleep', labelHi: 'नींद आने में कठिनाई', icon: 'Check' },
    ],
  },
];

export const DEMO_PATIENT: Patient = {
  id: 'PAT-IND-2026-047',
  name: 'Ravi Kumar',
  age: 58,
  gender: 'male',
  phone: '+91 98765 43210',
  language: 'en',
  abhaAddress: 'ravikumar58@abdm',
  identity: {
    type: 'abha',
    idNumber: '91-4523-8871-0047',
    isVerified: true,
  },
};

export const DEMO_RED_FLAG: RedFlagAlert = {
  id: 'RF-ALERT-001',
  title: 'Acute Chest Discomfort with Dyspnoea',
  reason: 'Potential urgent symptom combination requiring clinician review.',
  evidence: [
    'Patient reports active chest pain for 2 days (Onset: 48 hours)',
    'Co-occurring acute shortness of breath (Dyspnoea)',
    'Known medical history: Type 2 Diabetes & Hypertension',
    'Rule: ISCHEMIC_SYMPTOM_CLUSTER_RULE (Confidence: 0.94)',
  ],
  riskLevel: 'CRITICAL',
  requiresImmediateTriage: true,
  ruleId: 'CARDIO_ISCHEMIA_RULE_V1',
  status: 'active',
  source: {
    type: 'SYSTEM_RULE',
    name: 'Clinical Deterministic Rule Engine',
    confidence: 0.94,
  },
};

export const DEMO_PRESCRIPTION_DOC: MedicalDocument = {
  id: 'DOC-RX-8841',
  sessionId: 'SES-DEMO-2026-001',
  fileName: 'Dr_Sharma_CivilHospital_Rx.pdf',
  fileType: 'application/pdf',
  docType: 'PRESCRIPTION',
  uploadDate: '2026-09-08 09:15',
  status: 'READY',
  progressPercent: 100,
  ocrConfidence: 0.96,
  extractedEntitiesCount: 4,
  rawOcrText: `GOVT. DISTRICT CIVIL HOSPITAL, OPD
Date: 12-Feb-2026  Dr. A. Sharma, MD (Med)
Rx:
1. Tab. Metformin 500mg - 1 tab BD (Twice daily after meals) - 30 days
2. Tab. Telmisartan 40mg - 1 tab OD (Morning) - 30 days
3. Tab. Aspirin 75mg - 1 tab OD - 30 days
Advice: Check Fasting Blood Sugar, HbA1c, ECG. Review after 1 month.`,
  extractedData: {
    medications: [
      {
        id: 'med_1',
        name: 'Metformin',
        dose: '500 mg',
        route: 'oral',
        frequency: 'twice daily (BD)',
        duration: '30 days',
        status: 'current',
        source: {
          type: 'PRESCRIPTION',
          id: 'DOC-RX-8841',
          name: 'Civil Hospital OPD Rx',
          page: 1,
          confidence: 0.96,
        },
      },
      {
        id: 'med_2',
        name: 'Telmisartan',
        dose: '40 mg',
        route: 'oral',
        frequency: 'once daily (OD)',
        duration: '30 days',
        status: 'current',
        source: {
          type: 'PRESCRIPTION',
          id: 'DOC-RX-8841',
          name: 'Civil Hospital OPD Rx',
          page: 1,
          confidence: 0.95,
        },
      },
      {
        id: 'med_3',
        name: 'Aspirin',
        dose: '75 mg',
        route: 'oral',
        frequency: 'once daily (OD)',
        duration: '30 days',
        status: 'current',
        source: {
          type: 'PRESCRIPTION',
          id: 'DOC-RX-8841',
          name: 'Civil Hospital OPD Rx',
          page: 1,
          confidence: 0.92,
        },
      },
    ],
    diagnoses: [
      {
        id: 'diag_1',
        condition: 'Type 2 Diabetes Mellitus',
        status: 'current',
        source: { type: 'PRESCRIPTION', name: 'Prescription Rx notes', confidence: 0.91 },
      },
      {
        id: 'diag_2',
        condition: 'Essential Hypertension',
        status: 'current',
        source: { type: 'PRESCRIPTION', name: 'Prescription Rx notes', confidence: 0.89 },
      },
    ],
  },
};

export const DEMO_LAB_DOC: MedicalDocument = {
  id: 'DOC-LAB-9923',
  sessionId: 'SES-DEMO-2026-001',
  fileName: 'NABL_Biochemistry_Report_HbA1c.pdf',
  fileType: 'application/pdf',
  docType: 'LAB_REPORT',
  uploadDate: '2026-09-08 09:18',
  status: 'READY',
  progressPercent: 100,
  ocrConfidence: 0.98,
  extractedEntitiesCount: 3,
  rawOcrText: `APEX DIAGNOSTIC PATHOLOGY LAB (NABL ACCREDITED)
Patient: Ravi Kumar | Age: 58 / M | Date: 15-Feb-2026
BIOCHEMISTRY REPORT
1. Glycated Hemoglobin (HbA1c): 7.2 % [High, Ref: < 5.7 % Non-diabetic, > 6.5 % Diabetic]
2. Fasting Plasma Glucose: 142 mg/dL [High, Ref: 70 - 100 mg/dL]
3. Serum Creatinine: 0.9 mg/dL [Normal, Ref: 0.7 - 1.2 mg/dL]`,
  extractedData: {
    labs: [
      {
        id: 'lab_1',
        testName: 'HbA1c (Glycated Hemoglobin)',
        value: '7.2 %',
        numericValue: 7.2,
        unit: '%',
        referenceRange: '< 5.7 % Normal',
        isAbnormal: true,
        date: '2026-02-15',
        source: {
          type: 'LAB_REPORT',
          id: 'DOC-LAB-9923',
          name: 'Apex Diagnostic Pathology Lab',
          confidence: 0.98,
        },
      },
      {
        id: 'lab_2',
        testName: 'Fasting Blood Glucose',
        value: '142 mg/dL',
        numericValue: 142,
        unit: 'mg/dL',
        referenceRange: '70 - 100 mg/dL',
        isAbnormal: true,
        date: '2026-02-15',
        source: {
          type: 'LAB_REPORT',
          id: 'DOC-LAB-9923',
          name: 'Apex Diagnostic Pathology Lab',
          confidence: 0.97,
        },
      },
      {
        id: 'lab_3',
        testName: 'Serum Creatinine',
        value: '0.9 mg/dL',
        numericValue: 0.9,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.2 mg/dL',
        isAbnormal: false,
        date: '2026-02-15',
        source: {
          type: 'LAB_REPORT',
          id: 'DOC-LAB-9923',
          name: 'Apex Diagnostic Pathology Lab',
          confidence: 0.99,
        },
      },
    ],
  },
};

export const DEMO_TIMELINE: MedicalTimelineEvent[] = [
  {
    eventId: 'EVT-2023-01',
    date: '2023-04-10',
    type: 'DIAGNOSIS',
    title: 'Diagnosed with Type 2 Diabetes Mellitus',
    description: 'Diagnosed at Primary Health Centre after routine checkup.',
    source: { type: 'PATIENT_STATEMENT', confidence: 0.95 },
  },
  {
    eventId: 'EVT-2024-02',
    date: '2024-08-15',
    type: 'PRESCRIPTION',
    title: 'Initiation of Antihypertensive therapy',
    description: 'Started Tab. Telmisartan 40mg once daily for borderline hypertension.',
    source: { type: 'DOCUMENT', name: 'Old prescription slip', confidence: 0.9 },
  },
  {
    eventId: 'EVT-2026-03',
    date: '2026-02-15',
    type: 'LAB_REPORT',
    title: 'Biochemistry Panel (Apex Diagnostics)',
    description: 'HbA1c elevated at 7.2 %, Fasting Blood Sugar 142 mg/dL. Renal profile normal.',
    source: { type: 'LAB_REPORT', name: 'DOC-LAB-9923', confidence: 0.98 },
  },
  {
    eventId: 'EVT-2026-04',
    date: '2026-09-08',
    type: 'CURRENT_VISIT',
    title: 'Current OPD Case Taking: Acute Chest Pain & Dyspnoea',
    description: 'Patient presented at AyuMitra with 2-day history of chest tightness and breathlessness.',
    source: { type: 'PATIENT_STATEMENT', confidence: 0.99 },
  },
];

export const DEMO_CONFLICTS: ClinicalConflict[] = [
  {
    id: 'conf_1',
    field: 'medication.frequency (Metformin 500mg)',
    patientValue: 'Once daily (सुबह 1 बार)',
    documentValue: 'Twice daily BD (DOC-RX-8841)',
    requiresReview: true,
    isResolved: false,
  },
];

export const DEMO_CLINICAL_SUMMARY: ClinicalSummary = {
  id: 'SUMM-DEMO-001',
  sessionId: 'SES-DEMO-2026-001',
  verificationStatus: 'REVIEW_REQUIRED',
  chiefComplaint: 'Chest tightness and shortness of breath for 2 days ("मुझे दो दिन से सीने में दर्द हो रहा है और सांस लेने में तकलीफ है।")',
  hpi: 'A 58-year-old male with a history of T2DM and Hypertension presents with central chest pain that started 48 hours ago. Pain is described as a heavy pressure, radiating slightly to the left shoulder, associated with dyspnoea on mild exertion. No history of syncope, palpitation, or fever.',
  pastMedicalHistory: [
    'Type 2 Diabetes Mellitus (Diagnosed 2023)',
    'Essential Hypertension (Diagnosed 2024)',
  ],
  pastSurgicalHistory: ['None reported'],
  medications: [
    {
      id: 'm1',
      name: 'Metformin',
      dose: '500 mg',
      route: 'oral',
      frequency: 'twice daily (prescribed) vs once daily (patient reported)',
      duration: 'Ongoing',
      status: 'current',
      source: { type: 'PRESCRIPTION', name: 'DOC-RX-8841', confidence: 0.96 },
    },
    {
      id: 'm2',
      name: 'Telmisartan',
      dose: '40 mg',
      route: 'oral',
      frequency: 'once daily (morning)',
      duration: 'Ongoing',
      status: 'current',
      source: { type: 'PRESCRIPTION', name: 'DOC-RX-8841', confidence: 0.95 },
    },
    {
      id: 'm3',
      name: 'Aspirin',
      dose: '75 mg',
      route: 'oral',
      frequency: 'once daily',
      duration: 'Ongoing',
      status: 'current',
      source: { type: 'PRESCRIPTION', name: 'DOC-RX-8841', confidence: 0.92 },
    },
  ],
  allergies: [
    {
      id: 'all_1',
      allergen: 'No known drug allergies (NKDA)',
      source: { type: 'PATIENT_STATEMENT', confidence: 0.99 },
    },
  ],
  familyHistory: ['Father had ischemic heart disease (MI at age 62)'],
  personalHistory: {
    diet: 'Vegetarian, occasional high-salt snacks',
    smoking: 'Non-smoker',
    alcohol: 'Non-alcoholic',
    sleep: 'Disturbed sleep past 2 nights due to chest discomfort',
  },
  reviewOfSystems: {
    cardiovascular: 'Positive for chest pain and exertional dyspnoea. Negative for palpitations.',
    respiratory: 'Shortness of breath present. No cough, hemoptysis, or wheezing.',
    gastrointestinal: 'No abdominal pain, vomiting, or reflux symptoms.',
    neurological: 'Alert and oriented. No focal weakness or dizziness.',
  },
  priorInvestigations: [
    {
      id: 'inv_1',
      testName: 'HbA1c',
      value: '7.2 %',
      numericValue: 7.2,
      unit: '%',
      referenceRange: '< 5.7 %',
      isAbnormal: true,
      date: '2026-02-15',
      source: { type: 'LAB_REPORT', name: 'DOC-LAB-9923', confidence: 0.98 },
    },
    {
      id: 'inv_2',
      testName: 'Fasting Blood Sugar',
      value: '142 mg/dL',
      numericValue: 142,
      unit: 'mg/dL',
      referenceRange: '70 - 100 mg/dL',
      isAbnormal: true,
      date: '2026-02-15',
      source: { type: 'LAB_REPORT', name: 'DOC-LAB-9923', confidence: 0.97 },
    },
  ],
  ayush: {
    prakriti: 'Pitta-Vata',
    vikriti: 'Vata-Kapha Avarana (Pranavaha Srotas involved)',
    agni: 'manda',
    koshtha: 'krura',
    aharaVihara: {
      dietType: 'Guru (heavy), Ruksha (dry) foods recently',
      appetite: 'Reduced for past 2 days',
      sleepPattern: 'Anidra / Khandita (fragmented)',
    },
    nidana: ['Vegadharana (suppression of natural urges)', 'Chinta / Stress'],
    source: { type: 'SYSTEM_RULE', name: 'Ayush Dashavidha Pariksha Module', confidence: 0.91 },
  },
  priorityAlerts: [DEMO_RED_FLAG],
  conflicts: DEMO_CONFLICTS,
  generatedAt: '2026-09-08 09:25:10',
  auditTrail: [
    {
      timestamp: '2026-09-08 09:20:00',
      action: 'CONSENT_GRANTED',
      actor: 'Patient: Ravi Kumar (ABHA 91-4523-8871-0047)',
      detail: 'Audio + biometric consent for clinical interview and document OCR',
    },
    {
      timestamp: '2026-09-08 09:22:15',
      action: 'AI_CLINICAL_STATE_EXTRACTED',
      actor: 'System / NLP Pipeline',
      detail: 'Extracted chief complaint, negation checked, temporality parsed',
    },
    {
      timestamp: '2026-09-08 09:25:10',
      action: 'SUMMARY_GENERATED',
      actor: 'System / Summary Engine',
      detail: 'Structured clinical summary generated with source attribution',
    },
  ],
};

export const INITIAL_AI_STATUS: AIProviderStatus[] = [
  {
    service: 'LLM',
    providerName: 'MockLLMProvider (Interface Ready for Gemini/Ollama/VLLM)',
    status: 'MOCK',
    modelOrVersion: 'gemini-2.5-flash / mock-adapter-v1',
    latencyMs: 120,
  },
  {
    service: 'ASR',
    providerName: 'MockASRProvider (Interface Ready for Bhashini / AI4Bharat / Whisper)',
    status: 'MOCK',
    modelOrVersion: 'bhashini-conformer-hi / mock-adapter-v1',
    latencyMs: 95,
  },
  {
    service: 'TTS',
    providerName: 'MockTTSProvider (Interface Ready for Bhashini / Google Cloud TTS)',
    status: 'MOCK',
    modelOrVersion: 'bhashini-tts-v2 / mock-adapter-v1',
    latencyMs: 80,
  },
  {
    service: 'OCR',
    providerName: 'MockOCRProvider (Interface Ready for Tesseract / Document AI / Surya)',
    status: 'MOCK',
    modelOrVersion: 'indic-multilingual-ocr-v3 / mock-adapter-v1',
    latencyMs: 240,
  },
  {
    service: 'NLP',
    providerName: 'MockClinicalNLPProvider (Interface Ready for MedCAT / ClinicalBERT)',
    status: 'MOCK',
    modelOrVersion: 'clinical-indic-ner-v2 / mock-adapter-v1',
    latencyMs: 65,
  },
  {
    service: 'DRUG_INTERACTION',
    providerName: 'MockDrugInteractionProvider (Interface Ready for RxNorm / CDSCO)',
    status: 'AVAILABLE',
    modelOrVersion: 'ruleset-v1.4',
    latencyMs: 15,
  },
  {
    service: 'TRANSLATION',
    providerName: 'MockTranslationProvider (Interface Ready for Bhashini / NLLB)',
    status: 'MOCK',
    modelOrVersion: 'indic-trans-v2',
    latencyMs: 110,
  },
];


