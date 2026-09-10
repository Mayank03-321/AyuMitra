# Project Requirements

## Functional Requirements
- [x] **FR-1: Multilingual Voice & Touch Intake**: Web Speech API and visual UI support in English, Hindi, and regional languages.
- [x] **FR-2: Patient Identity & ABHA Verification**: Support for ABHA ID, Aadhaar, Phone, and Demographic registration.
- [x] **FR-3: Electronic Consent Engine**: ABDM-compliant purpose-limited patient consent management.
- [x] **FR-4: Document OCR & Entity Extraction**: Ingest and extract medications, diagnoses, and lab results from uploaded images/PDFs.
- [x] **FR-5: AYUSH & Prakriti Profiling**: Dedicated questionnaire for Dosha balance, Agni, and traditional medicine history.
- [x] **FR-6: Real-time Red Flag & Emergency Triage**: Instant identification of critical clinical signs (e.g. acute coronary syndrome, severe respiratory distress).
- [x] **FR-7: Doctor Clinical Summary Workstation**: Interactive summary view with confidence metrics, editing, physician sign-off, and HIS export.

## Non-Functional Requirements
- [x] **NFR-1: Auditability**: Detailed audit logs (`AuditLog`) for all patient data access and actions.
- [x] **NFR-2: Resilience**: Mock/Sandbox fallbacks for external ABDM and HIS services.
- [x] **NFR-3: Performance**: Sub-second UI state transitions with responsive animations and feedback.
