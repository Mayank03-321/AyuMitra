# External Integrations & APIs

## 1. Groq Cloud LLM Inference Engine (`src/services/aiService.ts`)
* **Model**: `qwen/qwen3.8-27b` / fast clinical inference
* **Capabilities**:
  * Multilingual Chief Complaint & HPI clinical NLP extraction (`/api/v1/ai/extract-complaint`).
  * Real-time emergency red flag safety evaluator (`/api/v1/ai/red-flags/evaluate`).
  * Dynamic adaptive clinical follow-up questioning (`/api/v1/ai/questions/adaptive`).
  * Full SOAP format clinical note & AYUSH/Prakriti summarization (`/api/v1/ai/summary/generate`).
* **Security & Key Management**:
  * Key stored securely in `.env` as `GROQ_API_KEY`.
  * `GROQ_API_KEY` is strictly server-side and never forwarded to client responses.

## 2. Supabase PostgreSQL Database (`src/db.ts`)
* **Host**: `aws-0-ap-northeast-2.pooler.supabase.com:5432`
* **Driver**: `@prisma/adapter-pg` with connection pooling and SSL encryption.
* **Security**:
  * Strict parameterization via Prisma ORM preventing SQL injection.
  * Audit logging for every patient, session, and doctor interaction (`AuditLog`).

## 3. OmniVoice Voice Dialogue Engine (`voice_service/`)
* **Repository**: Cloned into `voice_service/OmniVoice` (`k2-fsa/OmniVoice`).
* **Runner Script**: `voice_service/omnivoice_runner.py` for speech tokenization and audio processing.
* **Dialogue Engine**: `POST /api/v1/ai/voice-dialogue` powering empathetic continuous case-taking with Groq LLM and SpeechSynthesis TTS feedback.
* **OCR Flow Trigger**: Automatically detects when patient concludes symptom description, prompts confirmation, and directly navigates to the Document OCR Scanner page.

## 4. PaddleOCR Digitization Engine (`ocr_service/`)
* **Repository**: Cloned locally into `ocr_service/PaddleOCR`.
* **Runner Script**: `ocr_service/paddle_ocr_runner.py` for direct inference and bounding box recognition.
* **Bridge**: `src/services/ocrBridge.ts` invoking the OCR engine on prescription & lab images.
* **Extraction Pipeline**: Integrated with Groq LLM for entity extraction into `Document` and `Session` models in Supabase.

## 5. Ayushman Bharat Digital Mission (ABDM)
* **Purpose**: ABHA ID verification, patient identity lookup, and electronic consent architecture.
* **Status**: Simulated/Sandbox connection in dev mode (`CONNECTED_SANDBOX`).

## 6. Hospital Information System (HIS / EHR)
* **Purpose**: Ingestion of past records, live patient queue updates, and physician verified summary export.
* **Status**: Integrated mock adapter (`CONNECTED_DEMO`).
