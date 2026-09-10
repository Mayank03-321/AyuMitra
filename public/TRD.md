# Technical Requirements Document (TRD)
## Project: AyuMitra — Technical Architecture & Implementation Specification

---

## 1. System Architecture Overview

AyuMitra is built as a unified, high-performance web platform combining a reactive frontend Single Page Application (SPA), a secure Node.js/Express API backend, a PostgreSQL relational database on Supabase managed via Prisma ORM, and integrated AI inference engines (Groq Cloud LLM, PaddleOCR, and OmniVoice).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT TIER (Browser)                           │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │     Patient Kiosk Interface     │   │    Doctor Clinical Dashboard    │  │
│  │  (React 19, TS 5.8, Tailwindv4) │   │   (Triage, SOAP Note, Review)   │  │
│  └────────────────┬────────────────┘   └────────────────┬────────────────┘  │
└───────────────────┼─────────────────────────────────────┼───────────────────┘
                    │ HTTPS / REST                        │ HTTPS / REST
┌───────────────────▼─────────────────────────────────────▼───────────────────┐
│                       APPLICATION SERVER TIER (Node.js/Express)             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Security Layer: Helmet Headers, Rate Limiting, Sanitized Errors       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────┬────────────────────────┬──────────────────────┐ │
│  │   Session Controller   │   AI & Voice Service   │   OCR Bridge Service │ │
│  │  (Demographics, State) │ (Groq LLM / OmniVoice) │     (PaddleOCR)      │ │
│  └───────────┬────────────┴────────────┬───────────┴──────────┬───────────┘ │
└──────────────┼─────────────────────────┼──────────────────────┼─────────────┘
               │                         │                      │
┌──────────────▼──────────┐ ┌────────────▼──────────┐ ┌─────────▼───────────┐
│  DATABASE (PostgreSQL)  │ │   GROQ LLM INFERENCE  │ │  PYTHON OCR RUNNER  │
│  Supabase via Prisma    │ │    (qwen/qwen3.8-27b) │ │   (PaddleOCR CLI)   │
└─────────────────────────┘ └───────────────────────┘ └─────────────────────┘
```

---

## 2. Technology Stack & Specifications

| Layer | Component / Tool | Version | Responsibility |
|---|---|---|---|
| **Frontend Framework** | React | `^19.0.1` | Component lifecycle, interactive kiosk and physician views. |
| **Language** | TypeScript | `~5.8.2` | Static type safety across entire codebase. |
| **Styling & Icons** | Tailwind CSS v4 / Lucide React | `^4.1.14` / `^0.546.0` | High-performance CSS engine, accessible clinical icons. |
| **Animation Engine** | Motion | `^12.23.24` | Fluid screen transitions and live audio waveforms. |
| **Build & Dev Tool** | Vite | `^6.2.3` | Ultra-fast HMR and production asset bundling. |
| **Server Runtime** | Node.js / Express | `v22+` / `^4.21.2` | REST API routes, middleware, and process orchestration. |
| **Database & ORM** | PostgreSQL (Supabase) / Prisma | `^7.10.0` | Relational data persistence, pooling, schema migrations. |
| **AI LLM Engine** | Groq Cloud API | REST Endpoint | High-throughput clinical NLP, triage, and SOAP summaries. |
| **OCR Digitizer** | PaddlePaddle / PaddleOCR | Git Submodule / CLI | Prescription and lab report text extraction. |
| **Voice Dialogue** | k2-fsa / OmniVoice | Git Submodule / API | Speech recognition tokenization and audio processing. |

---

## 3. Database Schema & Prisma Data Models

The database schema is defined in [`prisma/schema.prisma`](file:///c:/Users/ASUS/Desktop/SIH/AyuMitra(2)%20-%20Copy/AyuMitra(2)%20-%20Copy/prisma/schema.prisma) and deployed to Supabase PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model Patient {
  id          String    @id @default(cuid())
  name        String
  age         Int
  gender      String
  phone       String?
  language    String
  abhaAddress String?
  identity    Json?     // { type, idNumber, isVerified }
  sessions    Session[]
  consents    Consent[]
}

model Consent {
  id        String    @id @default(cuid())
  consentId String    @unique
  patientId String
  sessionId String
  purpose   String
  scope     Json      // string[]
  status    String    // 'granted' | 'revoked' | 'pending'
  grantedAt DateTime  @default(now())
  revokedAt DateTime?
  version   String
  patient   Patient   @relation(fields: [patientId], references: [id])
}

model Session {
  id                String     @id @default(cuid())
  patientId         String
  language          String
  accessibilityMode String
  state             String     // 'CREATED' | 'IN_PROGRESS' | 'SUMMARY_READY' | 'VERIFIED'
  inputMode         String     // 'voice' | 'touch' | 'hybrid'
  startedAt         DateTime   @default(now())
  clinicalState     Json       // Chief complaints, HPI, medications, labs, AYUSH
  abdmStatus        String     // 'CONNECTED_SANDBOX' | 'SYNCED'
  hisStatus         String     // 'CONNECTED_DEMO' | 'SYNCED'
  patient           Patient    @relation(fields: [patientId], references: [id])
  documents         Document[]
  summary           Summary?
}

model Document {
  id                     String   @id @default(cuid())
  sessionId              String
  fileName               String
  fileType               String
  docType                String   // 'prescription' | 'lab_report'
  uploadDate             DateTime @default(now())
  status                 String   // 'READY' | 'OCR_PROCESSING'
  progressPercent        Int
  ocrConfidence          Float
  extractedEntitiesCount Int
  rawOcrText             String?
  extractedData          Json?    // { medications: [], labs: [], diagnoses: [] }
  session                Session  @relation(fields: [sessionId], references: [id])
}

model Summary {
  id                  String    @id @default(cuid())
  sessionId           String    @unique
  verificationStatus  String    // 'PENDING_PHYSICIAN_REVIEW' | 'VERIFIED'
  chiefComplaint      String?
  hpi                 String?
  pastMedicalHistory  Json?
  pastSurgicalHistory Json?
  medications         Json?
  allergies           Json?
  familyHistory       Json?
  personalHistory     Json?
  reviewOfSystems     Json?
  priorInvestigations Json?
  ayush               Json?
  priorityAlerts      Json?
  conflicts           Json?
  physicianNotes      String?
  verifiedByDoctor    String?
  verifiedAt          DateTime?
  generatedAt         DateTime  @default(now())
  auditTrail          Json?
  session             Session   @relation(fields: [sessionId], references: [id])
}

model RedFlag {
  id                      String   @id @default(cuid())
  title                   String
  reason                  String
  evidence                Json     // string[]
  riskLevel               String   // 'CRITICAL' | 'HIGH' | 'MODERATE'
  requiresImmediateTriage Boolean
  source                  Json
  ruleId                  String
  status                  String   // 'active' | 'acknowledged' | 'resolved'
}

model AuditLog {
  id        String   @id @default(cuid())
  actor     String
  action    String
  timestamp DateTime @default(now())
  resource  String
  sessionId String?
  metadata  Json?
}
```

---

## 4. API Endpoints & REST Interface

### 4.1 AI & Conversational Endpoints

#### `POST /api/v1/ai/voice-dialogue`
* **Description**: Processes real-time patient voice turns using OmniVoice + Groq LLM.
* **Request Payload**:
  ```json
  {
    "history": [{ "speaker": "ai", "text": "Hello!" }],
    "utterance": "मुझे 2 दिन से सीने में दर्द है",
    "language": "hi",
    "sessionId": "SES-DEMO-2026-001"
  }
  ```
* **Response Payload**:
  ```json
  {
    "aiSpeechResponse": "समझ गया। क्या दर्द बाएं हाथ की तरफ भी जा रहा है?",
    "isConversationComplete": false,
    "extractedComplaints": [
      {
        "symptom": "Chest pain",
        "duration": "2 days",
        "severity": "severe",
        "bodyPart": "Chest",
        "present": true,
        "confidence": 0.98
      }
    ],
    "suggestedNextAction": "continue_asking"
  }
  ```

#### `POST /api/v1/ai/extract-complaint`
* **Description**: NLP extraction of symptoms and HPI parameters from transcript.

#### `POST /api/v1/ai/red-flags/evaluate`
* **Description**: Evaluates critical emergency clinical indicators.

#### `POST /api/v1/ai/summary/generate`
* **Description**: Generates physician-grade SOAP summary and stores directly in database.

### 4.2 Document & OCR Endpoints

#### `POST /api/v1/sessions/:id/documents/ocr-scan`
* **Description**: Ingests image/base64 file, executes PaddleOCR subprocess, extracts medical entities via Groq, and updates session state.
* **Request Payload**:
  ```json
  {
    "image": "data:image/jpeg;base64,...",
    "fileName": "prescription_01.jpg",
    "fileType": "image/jpeg",
    "docType": "prescription"
  }
  ```

### 4.3 Physician & Queue Endpoints

* `GET /api/v1/physician/queue` — Returns active OPD patient queue with severity ranking.
* `GET /api/v1/triage/alerts` — Returns active red flag emergency alerts.
* `POST /api/v1/sessions/:id/submit` — Transitions session state to `SUMMARY_READY`.

---

## 5. Security & Privacy Architecture

```
[ Incoming Request ]
        │
        ├──► [ 1. Security Headers (NoSniff, FrameGuard DENY, HSTS, XSS) ]
        ├──► [ 2. Rate Limiter (120 req/min per IP protection) ]
        ├──► [ 3. Body Size Validation (max 10MB) ]
        ├──► [ 4. Express Controller with Parameterized Prisma Queries ]
        └──► [ 5. Global Error Handler (Masks DB internals & stack traces) ]
```

1. **Environment Secrets Protection**:
   * All sensitive tokens (`GROQ_API_KEY`, `DATABASE_URL`) stored in [`.env`](file:///c:/Users/ASUS/Desktop/SIH/AyuMitra(2)%20-%20Copy/AyuMitra(2)%20-%20Copy/.env) with strict `.gitignore` exclusion.
2. **SQL Injection Defense**:
   * 100% of database interactions leverage Prisma typed queries with automatic parameterization.
3. **Audit Trail**:
   * All clinical actions (patient registration, AI extractions, doctor verification) log immutable `AuditLog` records.

---

## 6. Build, Deployment & Operational Runbook

### 6.1 Prerequisites
* Node.js v22+
* Python 3.10+
* PostgreSQL / Supabase instance

### 6.2 Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Synchronize Prisma schema with Supabase
npx prisma generate
npx prisma db push

# 3. Development Server
npm run dev

# 4. Production Build & Execution
npm run build
npm start
```
