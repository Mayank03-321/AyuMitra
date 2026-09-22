import React, { useState } from 'react';
import { MedicalDocument, LanguageCode, AccessibilityMode } from '../../types';
import { DEMO_PRESCRIPTION_DOC, DEMO_LAB_DOC } from '../../data/initialData';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface DocumentScanScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  documents: MedicalDocument[];
  onAddDocument: (doc: MedicalDocument) => void;
  onContinue: () => void;
}

export const DocumentScanScreen: React.FC<DocumentScanScreenProps> = ({
  language,
  accessibilityMode,
  documents,
  onAddDocument,
  onContinue,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('OCR Processing...');

  const handleSimulateScan = (docTemplate: MedicalDocument) => {
    setIsProcessing(true);
    setProcessingStage('PaddleOCR Document Digitization...');

    setTimeout(() => {
      setProcessingStage('Multilingual OCR & Text Recognition...');
      setTimeout(() => {
        setProcessingStage('Clinical NLP Entity Extraction & Normalization...');
        setTimeout(() => {
          setIsProcessing(false);
          onAddDocument(docTemplate);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'prescription' | 'lab_report') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStage('PaddleOCR Image Ingestion & Bounding Box Detection...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        setProcessingStage('PaddleOCR Text Extraction & Groq Clinical NLP...');

        try {
          const res = await fetch('/api/v1/sessions/SES-DEMO-2026-001/documents/ocr-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Data,
              fileName: file.name,
              fileType: file.type,
              docType,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const newDoc: MedicalDocument = {
              id: data.document.id,
              sessionId: data.document.sessionId || 'SES-DEMO-2026-001',
              fileName: data.document.fileName,
              fileType: data.document.fileType,
              docType: docType === 'prescription' ? 'PRESCRIPTION' : 'LAB_REPORT',
              uploadDate: new Date().toISOString(),
              status: 'READY',
              progressPercent: 100,
              ocrConfidence: data.document.ocrConfidence,
              extractedEntitiesCount: data.document.extractedEntitiesCount,
              rawOcrText: data.document.rawOcrText,
              extractedData: data.document.extractedData,
            };
            onAddDocument(newDoc);
          } else {
            handleSimulateScan(docType === 'prescription' ? DEMO_PRESCRIPTION_DOC : DEMO_LAB_DOC);
          }
        } catch {
          handleSimulateScan(docType === 'prescription' ? DEMO_PRESCRIPTION_DOC : DEMO_LAB_DOC);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsProcessing(false);
      handleSimulateScan(docType === 'prescription' ? DEMO_PRESCRIPTION_DOC : DEMO_LAB_DOC);
    }
  };

  const handleLoadBothDemoDocs = () => {
    onAddDocument(DEMO_PRESCRIPTION_DOC);
    onAddDocument(DEMO_LAB_DOC);
  };

  const audioDocGuide = isHindi
    ? 'अपनी पुरानी पर्ची या टेस्ट रिपोर्ट को स्कैनर पर रखें या अपलोड करें। हमारा सिस्टम दवाइयों और जांच के नतीजों को स्वतः पढ़ लेगा।'
    : 'Place your paper prescription or lab reports on the scanner. Our AI extracts medications and abnormal lab values for your doctor.';

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Title */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'पुरानी पर्ची व रिपोर्ट स्कैन करें' : 'Medical Document Digitization'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? 'डॉक्टर की पुरानी पर्ची, ब्लड टेस्ट रिपोर्ट या डिस्चार्ज समरी स्कैन करें।'
              : 'Scan or upload prescriptions, lab reports, and previous discharge summaries.'}
          </p>
        </div>

        <AudioVoiceButton
          text={audioDocGuide}
          language={language}
          label={isHindi ? 'निर्देश सुनें' : 'Listen'}
          variant="secondary"
        />
      </div>

      {/* Upload & Scanner Buttons Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Prescription Scanner Card */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-6 flex flex-col items-center text-center justify-between gap-4 hover:border-emerald-500 transition-all bg-emerald-50/20">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isHindi ? 'दवाइयों की पर्ची' : 'Doctor Prescription (Rx)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi
                ? 'हस्तलिखित व मुद्रित पर्ची से दवा का नाम व खुराक पढ़ना।'
                : 'Extracts drug name, dosage, frequency, and duration.'}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <label className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
              <Upload className="w-4 h-4" />
              <span>{isHindi ? 'फाइल अपलोड' : 'Upload File (OCR)'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                disabled={isProcessing}
                onChange={(e) => handleFileUpload(e, 'prescription')}
              />
            </label>
            <button
              id="btn-scan-prescription"
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulateScan(DEMO_PRESCRIPTION_DOC)}
              className="px-3 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              title="Use Sample Prescription"
            >
              <Camera className="w-4 h-4" />
              <span>{isHindi ? 'नमूना' : 'Sample'}</span>
            </button>
          </div>
        </div>

        {/* Lab Report Scanner Card */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-blue-300 p-6 flex flex-col items-center text-center justify-between gap-4 hover:border-blue-500 transition-all bg-blue-50/20">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isHindi ? 'लैब टेस्ट रिपोर्ट' : 'Laboratory Report'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi
                ? 'खून की जांच (HbA1c, शुगर, किडनी) के असामान्य परिणामों की पहचान।'
                : 'Identifies out-of-range values and references (e.g. HbA1c 7.2%).'}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <label className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
              <Upload className="w-4 h-4" />
              <span>{isHindi ? 'रिपोर्ट अपलोड' : 'Upload Report (OCR)'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                disabled={isProcessing}
                onChange={(e) => handleFileUpload(e, 'lab_report')}
              />
            </label>
            <button
              id="btn-scan-lab"
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulateScan(DEMO_LAB_DOC)}
              className="px-3 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              title="Use Sample Lab Report"
            >
              <Camera className="w-4 h-4" />
              <span>{isHindi ? 'नमूना' : 'Sample'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Fast-Action Demo Loader */}
      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Test Documents:</strong> Civil Hospital Prescription (Metformin 500mg) + Apex Lab Report (HbA1c 7.2%).
          </span>
        </div>
        <button
          type="button"
          onClick={handleLoadBothDemoDocs}
          className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg shrink-0 transition-all cursor-pointer"
        >
          Load Both Demo Docs
        </button>
      </div>

      {/* Live Processing Indicator */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs mb-6 text-center animate-pulse">
          <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm mb-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{processingStage}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-3/4 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Digitized Documents List & Intelligence Preview */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'स्कैन किए गए दस्तावेज' : 'Digitized Documents'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {documents.length} document{documents.length > 1 ? 's' : ''} processed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 truncate max-w-[200px]">
                      {doc.fileName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      OCR: {Math.round(doc.ocrConfidence * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">Type: {doc.docType}</div>

                  {/* Highlighted extracted entities */}
                  {doc.docType === 'PRESCRIPTION' && doc.extractedData?.medications && (
                    <div className="space-y-1.5 mt-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Extracted Medications:
                      </span>
                      {doc.extractedData.medications.map((m) => (
                        <div
                          key={m.id}
                          className="text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between"
                        >
                          <span className="font-bold text-slate-800">
                            {m.name} {m.dose}
                          </span>
                          <span className="text-emerald-700 font-medium">{m.frequency}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {doc.docType === 'LAB_REPORT' && doc.extractedData?.labs && (
                    <div className="space-y-1.5 mt-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Biochemistry Parameters:
                      </span>
                      {doc.extractedData.labs.map((l) => (
                        <div
                          key={l.id}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
                            l.isAbnormal
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <span className="font-bold">{l.testName}</span>
                          <span className="font-bold">
                            {l.value}{' '}
                            {l.isAbnormal && (
                              <span className="text-[10px] uppercase text-rose-700 ml-1 font-extrabold">
                                [Abnormal]
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Step */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500">
          {documents.length === 0
            ? isHindi
              ? 'यदि कोई पुरानी पर्ची नहीं है, तो आप सीधे आगे बढ़ सकते हैं।'
              : 'You can proceed even without prior documents.'
            : ''}
        </div>

        <button
          id="btn-confirm-documents"
          type="button"
          onClick={onContinue}
          className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
          }`}
        >
          <span>
            {isHindi ? 'परामर्श हेतु डॉक्टर चुनें' : 'Choose Doctor & Continue'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
