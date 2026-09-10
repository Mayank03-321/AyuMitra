# AyuMitra: Master Product & Technical Specification (PRD + TRD)
**Project Title**: AyuMitra — AI-Powered Multilingual Clinical Intake & Doctor Decision Support Workstation  
**Domain**: Healthcare Technology / Hospital OPD Automation / ABDM Compliance  
**Date**: September 2026  
**Document Version**: 1.0.0 (Production Release)

---

# Part 1: Product Requirements Document (PRD)

## 1. Executive Summary
In Indian outpatient departments (OPDs), doctors examine between 60 to 100+ patients in a single shift, spending under 2–3 minutes per consultation. Much of this time is consumed by manual data entry, deciphering past handwritten prescriptions, and overcoming linguistic diversity.

**AyuMitra** solves this crisis by deploying an intelligent, accessible pre-consultation kiosk and doctor workstation that:
1. Conducts **conversational voice case-taking** in Indian languages (Hindi, English, regional languages) powered by **OmniVoice** and **Groq LLM**.
2. Automatically transitions to **optical character recognition (PaddleOCR)** to digitize paper prescriptions and laboratory reports.
3. Automatically identifies **emergency clinical red flags** (e.g., acute coronary syndrome, severe respiratory distress) for immediate triage.
4. Integrates **dual Allopathic (SNOMED CT, ICD-10) and AYUSH (NAMASTE, Prakriti/Dosha)** clinical profiling.
5. Produces pre-structured, verified **SOAP clinical notes** and synchronizes with **ABDM** (Ayushman Bharat Digital Mission) and hospital EHR systems.

---

## 2. Target Personas & Stakeholders

| Persona | Role / Context | Key Needs & Pain Points |
|---|---|---|
| **Elderly / Rural Patient** | First-time visitor with low digital literacy or local dialect. | Needs voice-first hands-free interaction, large clear visuals, audio guidance in their mother tongue. |
| **Tech-Savvy Patient** | Urban patient with digital health records and ABHA ID. | Fast QR/ABHA identification, instant camera scanning of past medical records, transparent summary preview. |
| **Attending Physician / Doctor** | OPD specialist managing intense patient throughput. | Needs instant structured SOAP summary, high-visibility red-flag emergency alerts, one-click verification. |
| **Hospital Administrator / CMO** | Manages hospital workflow, queues, and regulatory audits. | Needs reduced patient wait times, DPDP Act 2023 compliant consent tracking, immutable audit trails. |

---

## 3. End-to-End User Flow

```
[ Kiosk Welcome & Language Preference ]
                 │
                 ▼
[ ABHA ID / Aadhaar / Phone Registration ]
                 │
                 ▼
[ Granular Electronic Consent (DPDP Act 2023) ]
                 │
                 ▼
[ OmniVoice + Groq LLM Conversational Intake ]
                 │
                 ▼
[ Voice Confirmation Prompt ]
                 │
                 ▼
[ PaddleOCR Document & Prescription Digitization ]
                 │
                 ▼
[ AYUSH / Prakriti & Clinical Profiling ]
                 │
                 ▼
[ Token Issued & Patient Enqueued ]
                 │
                 ▼
[ Doctor Workstation: Real-Time Triage & Sign-Off ]
                 │
                 ▼
[ ABDM & Hospital EHR Ingestion ]
```

---

## 4. Functional Requirements (FR)

### FR-1: Multilingual Voice Intake
* **FR-1.1**: Continuous real-time speech recognition and text-to-speech feedback supporting Indian languages.
* **FR-1.2**: Multilingual clinical entity extraction (chief complaint, duration, severity, anatomical location).
* **FR-1.3**: Automatic conversational intent detection to identify when the patient has finished describing symptoms.

### FR-2: Direct OCR Landing & Digitization
* **FR-2.1**: Automated transitional prompt post-voice intake with direct landing on the document scanning screen.
* **FR-2.2**: Camera capture and file upload for prescription images and PDF lab reports.
* **FR-2.3**: Multilingual optical character recognition (PaddleOCR) with bounding box confidence scoring.
* **FR-2.4**: Structured LLM extraction of drug names, dosages, frequency, duration, test values, and abnormal indicators.

### FR-3: Emergency Triage & Red-Flag Evaluator
* **FR-3.1**: Real-time evaluation of life-threatening symptoms (Cardiovascular, Respiratory, Sepsis, Neurological).
* **FR-3.2**: Immediate visual alert badges and automated priority queue escalation for critical patients.

### FR-4: Dual Modern & AYUSH Clinical Mapping
* **FR-4.1**: Standardized coding with SNOMED CT and ICD-10 terminologies.
* **FR-4.2**: Dedicated AYUSH assessment module capturing Prakriti (Vata/Pitta/Kapha), Agni, Koshtha, and traditional remedies.

### FR-5: Doctor Decision-Support Workstation
* **FR-5.1**: Live patient queue with arrival timestamp, triage tier, and document count.
* **FR-5.2**: Interactive SOAP summary viewer with entity confidence metrics.
* **FR-5.3**: Physician verification sign-off and electronic signature timestamping.

### FR-6: Patient Identity & ABDM Compliance
* **FR-6.1**: ABHA ID verification and demographic lookup.
* **FR-6.2**: Purpose-limited electronic consent record storage and revocability tracking.
* **FR-6.3**: Immutable audit logging for all patient record creations, views, and doctor modifications.

---

## 5. Non-Functional Requirements (NFR)

* **NFR-1 (Performance & Latency)**: Voice dialogue turn response time $< 800\text{ ms}$; OCR parsing completed in $< 5\text{ seconds}$.
* **NFR-2 (Security & Privacy)**: Zero exposure of AI API keys or database connection strings to the client; DPDP Act 2023 compliant data storage with SSL/TLS encryption.
* **NFR-3 (Availability & Resilience)**: 99.9% uptime target with offline-tolerant simulation fallbacks for external ABDM and HIS services.
* **NFR-4 (Accessibility)**: WCAG 2.1 AA compliant UI, high-contrast toggle, elderly font scaling, and voice-assisted prompts.

---
---

# Part 2: Technical Requirements Document (TRD)

## 6. Technical Architecture Overview

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

## 7. Technology Stack Specifications

* **Frontend**: React 19 (`react`, `react-dom`), TypeScript 5.8, Tailwind CSS v4, Lucide React, Motion animation library.
* **Build System**: Vite 6 with React compiler plugin and esbuild.
* **Backend Runtime**: Node.js v22+, Express 4, tsx.
* **Database & ORM**: Supabase PostgreSQL (`aws-0-ap-northeast-2.pooler.supabase.com:5432`) with Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`).
* **LLM Engine**: Groq Cloud API (`qwen/qwen3.8-27b` inference).
* **OCR Digitizer**: PaddlePaddle / PaddleOCR Python pipeline.
* **Voice Engine**: k2-fsa / OmniVoice + Web Speech API synthesis.

---

## 8. Database Schema (Prisma)

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
  identity    Json?
  sessions    Session[]
  consents    Consent[]
}

model Consent {
  id        String    @id @default(cuid())
  consentId String    @unique
  patientId String
  sessionId String
  purpose   String
  scope     Json
  status    String
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
  state             String
  inputMode         String
  startedAt         DateTime   @default(now())
  clinicalState     Json
  abdmStatus        String
  hisStatus         String
  patient           Patient    @relation(fields: [patientId], references: [id])
  documents         Document[]
  summary           Summary?
}

model Document {
  id                     String   @id @default(cuid())
  sessionId              String
  fileName               String
  fileType               String
  docType                String
  uploadDate             DateTime @default(now())
  status                 String
  progressPercent        Int
  ocrConfidence          Float
  extractedEntitiesCount Int
  rawOcrText             String?
  extractedData          Json?
  session                Session  @relation(fields: [sessionId], references: [id])
}

model Summary {
  id                  String    @id @default(cuid())
  sessionId           String    @unique
  verificationStatus  String
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
  evidence                Json
  riskLevel               String
  requiresImmediateTriage Boolean
  source                  Json
  ruleId                  String
  status                  String
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

## 9. API REST Contract Summary

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/ai/voice-dialogue` | `POST` | Real-time multilingual voice conversation & complaint extraction. |
| `/api/v1/sessions/:id/documents/ocr-scan` | `POST` | PaddleOCR scanning & Groq LLM medication/lab parsing. |
| `/api/v1/ai/extract-complaint` | `POST` | NLP symptom & HPI extraction from text. |
| `/api/v1/ai/red-flags/evaluate` | `POST` | Emergency clinical rule and safety evaluator. |
| `/api/v1/ai/summary/generate` | `POST` | Comprehensive SOAP clinical summary generator. |
| `/api/v1/physician/queue` | `GET` | Active OPD triage queue for doctors. |
| `/api/v1/triage/alerts` | `GET` | Active clinical red flags. |
| `/api/v1/patients` | `POST` | Patient demographic registration. |
| `/api/v1/sessions` | `POST` | Intake session initialization. |

---

## 10. Security Architecture

1. **Secret & Key Protection**: All sensitive tokens (`GROQ_API_KEY`, `DATABASE_URL`) stored in `.env` with `.gitignore` exclusion.
2. **SQL Injection Defense**: 100% of database interactions leverage Prisma typed queries with automatic parameterization.
3. **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-XSS-Protection`.
4. **Rate Limiting**: In-memory rate limiting middleware (120 req/min per IP).
5. **Sanitized Error Handling**: Masks database errors, internal paths, and stack traces.
