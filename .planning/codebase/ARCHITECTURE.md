# AyuMitra Architecture

## Overview
AyuMitra is an AI-powered clinical intake kiosk and doctor decision-support workstation built for hospital OPDs, adhering to ABDM (Ayushman Bharat Digital Mission) standards and AYUSH clinical integration protocols.

## High-Level Architecture

```
[ Patient Kiosk UI ] <-----> [ Express + Vite Dev/Prod Server ] <-----> [ PostgreSQL via Prisma ]
         |                                  |
         |                                  +-----> [ Google Gemini 2.0 API ]
         v                                  +-----> [ ABDM / HIS Mocks / Adapters ]
[ Doctor Dashboard UI ]
```

## Layers & Components

### 1. Frontend (`src/`)
* **Patient Kiosk (`src/components/patient/`)**:
  * `WelcomeScreen.tsx` - Kiosk landing, accessibility & language selection.
  * `IdentificationScreen.tsx` - ABHA ID, Aadhaar, Phone, Biometrics intake.
  * `ConsentScreen.tsx` - Granular ABDM compliant electronic consent.
  * `ChiefComplaintScreen.tsx` - Voice & text chief complaint recording.
  * `AyushIntakeScreen.tsx` - Prakriti, Agni, Koshtha, and AYUSH-specific history.
  * `DocumentScanScreen.tsx` - Camera/File OCR scanning for prescriptions & lab tests.
  * `AdaptiveQuestionsScreen.tsx` - Dynamic clinical follow-up questions.
  * `PatientReviewScreen.tsx` / `CompletionScreen.tsx` - Summary validation & queue token generation.
* **Doctor Dashboard (`src/components/doctor/`)**:
  * `DoctorDashboard.tsx` - Clinical summary review, red flags triage, verification & ABDM push.
  * `DoctorLoginScreen.tsx` - Physician authentication.
* **Common UI (`src/components/common/`)**:
  * `AudioVoiceButton.tsx` - Web Speech API voice recording helper.
  * `ConfidenceBadge.tsx` - AI confidence score indicator.

### 2. Backend & API (`server.ts`)
* **REST Endpoints**:
  * `POST /api/sessions/start` - Initialize new clinical intake session.
  * `POST /api/sessions/:id/consent` - Record patient consent.
  * `POST /api/sessions/:id/identify` - Register patient demographics.
  * `POST /api/sessions/:id/complaint` - Extract complaints & trigger triage rules.
  * `POST /api/sessions/:id/documents/scan` - OCR document processing.
  * `POST /api/sessions/:id/summary/generate` - Generate structured clinical summary with Gemini.
  * `POST /api/sessions/:id/verify` - Doctor sign-off and ABDM dispatch.
  * `GET /api/doctor/queue` - Active patient queue with priority flags.

### 3. Database (`prisma/schema.prisma`)
* Models: `Patient`, `Consent`, `Session`, `Document`, `Summary`, `RedFlag`, `AuditLog`.
