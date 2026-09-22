import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode, AccessibilityMode, SymptomEntity } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import {
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  RefreshCw,
  Activity,
  Volume2,
  VolumeX,
  AlertCircle,
  Radio,
  Zap,
  Smartphone,
} from 'lucide-react';

interface DialogueTurn {
  id: string;
  speaker: 'ai' | 'patient';
  text: string;
  timestamp: string;
  isSummary?: boolean;
  isStt?: boolean;
}

interface ChiefComplaintScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onContinue: (transcript: string, entities: SymptomEntity[], method?: 'voice' | 'touch') => void;
  onProceedToOcr?: (transcript: string, entities: SymptomEntity[]) => void;
  onSwitchToTouch?: () => void;
}

export const ChiefComplaintScreen: React.FC<ChiefComplaintScreenProps> = ({
  language,
  accessibilityMode,
  onContinue,
  onProceedToOcr,
  onSwitchToTouch,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showOcrPrompt, setShowOcrPrompt] = useState(false);
  const [patientSummary, setPatientSummary] = useState<string>('');
  const [currentInputText, setCurrentInputText] = useState('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const [dialogueHistory, setDialogueHistory] = useState<DialogueTurn[]>([
    {
      id: 'turn-0',
      speaker: 'ai',
      text: isHindi
        ? 'नमस्ते! मैं आपका आयुमित्र AI सहायक हूँ। कृपया माइक दबाकर अपनी बीमारी या स्वास्थ्य समस्या के बारे में बताइए।'
        : 'Hello! I am your AyuMitra AI Assistant. Please tap the microphone and speak about your health problems or symptoms.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [extractedEntities, setExtractedEntities] = useState<SymptomEntity[]>([
    {
      id: 'sym_1',
      symptom: isHindi ? 'सीने में दर्द व भारीपन' : 'Chest pain & tightness',
      present: true,
      duration: isHindi ? '2 दिन' : '2 days',
      severity: 'severe',
      bodyPart: isHindi ? 'सीने का भाग' : 'Chest / Sternum',
      source: { type: 'PATIENT_STATEMENT', confidence: 0.98 },
    },
    {
      id: 'sym_2',
      symptom: isHindi ? 'सांस लेने में तकलीफ (Dyspnoea)' : 'Breathlessness on exertion (Dyspnoea)',
      present: true,
      duration: isHindi ? '2 दिन' : '2 days',
      severity: 'severe',
      bodyPart: isHindi ? 'श्वसन तंत्र' : 'Respiratory',
      source: { type: 'PATIENT_STATEMENT', confidence: 0.96 },
    },
  ]);

  // Audio Recording & WebSpeech Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isListeningRef = useRef(false);

  // Keep isListeningRef in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [dialogueHistory, isAiThinking, isTranscribing]);

  // Clean up media streams, speech synthesis, and timers on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Stop AI Speech immediately (Barge-in / Interrupt)
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  };

  // Text-To-Speech helper (plays natural voice with language-appropriate voice selection)
  const speakText = (text: string) => {
    if (isListeningRef.current || isListening) {
      // User is currently speaking or mic is live: do not speak over the user
      return;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
        utterance.rate = isElderly ? 0.85 : 0.95;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const match = voices.find(
            (v) =>
              (isHindi && (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant'))) ||
              (!isHindi && (v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-US') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('prabhat')))
          );
          if (match) {
            utterance.voice = match;
          }
        }

        utterance.onstart = () => {
          setIsAiSpeaking(true);
        };
        utterance.onend = () => {
          setIsAiSpeaking(false);
        };
        utterance.onerror = () => {
          setIsAiSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (ttsErr) {
        console.warn('SpeechSynthesis error:', ttsErr);
        setIsAiSpeaking(false);
      }
    }
  };

  // Start Audio Recording with resilient WebSpeech and MediaRecorder decoupling
  const startAudioRecording = async () => {
    // 1. Immediately silence AI speaking
    stopSpeaking();
    setMicPermissionError(null);
    audioChunksRef.current = [];
    let startedAny = false;

    // A. Start Browser Web Speech Recognition (Zero-Latency Native Engine)
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setMicPermissionError(null);
        };

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript + ' ';
          }
          const trimmed = fullText.trim();
          if (trimmed) {
            setCurrentInputText(trimmed);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('WebSpeech API notice:', e?.error);
          if (e?.error === 'not-allowed') {
            setMicPermissionError(
              isHindi
                ? 'ब्राउज़र में माइक्रोफ़ोन की अनुमति नहीं है। कृपया URL बार में लॉक आइकॉन पर क्लिक करके "Allow Microphone" चुनें।'
                : 'Microphone permission blocked. Please click the lock/settings icon in the browser address bar and choose "Allow Microphone".'
            );
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        startedAny = true;
      } catch (speechErr) {
        console.warn('SpeechRecognition initialization note:', speechErr);
      }
    }

    // B. Start MediaRecorder in parallel for high-accuracy Whisper STT (without crashing if unavailable)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        mediaStreamRef.current = stream;

        let recorderOptions: MediaRecorderOptions = {};
        let chosenMime = 'audio/webm';

        if (typeof MediaRecorder !== 'undefined') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            chosenMime = 'audio/webm;codecs=opus';
            recorderOptions = { mimeType: chosenMime };
          } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            chosenMime = 'audio/webm';
            recorderOptions = { mimeType: chosenMime };
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            chosenMime = 'audio/mp4';
            recorderOptions = { mimeType: chosenMime };
          }

          const mediaRecorder = new MediaRecorder(stream, recorderOptions);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            if (mediaStreamRef.current) {
              mediaStreamRef.current.getTracks().forEach((track) => track.stop());
              mediaStreamRef.current = null;
            }

            const audioBlob = new Blob(audioChunksRef.current, { type: chosenMime });
            if (audioBlob.size > 0) {
              await processAudioWithWhisperStt(audioBlob, chosenMime);
            } else if (currentInputText.trim()) {
              await handleSendMessage(currentInputText.trim(), false);
            }
          };

          mediaRecorder.start(250);
          startedAny = true;
        }
      } catch (mediaErr: any) {
        console.warn('MediaRecorder getUserMedia notice:', mediaErr);
        if (!startedAny) {
          const isDenied = mediaErr?.name === 'NotAllowedError' || mediaErr?.name === 'PermissionDeniedError';
          setMicPermissionError(
            isDenied
              ? isHindi
                ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें या नीचे बॉक्स में लिखें।'
                : 'Microphone permission was denied. Please allow microphone access in your browser or type symptoms below.'
              : isHindi
              ? 'माइक्रोफ़ोन हार्डवेयर उपलब्ध नहीं है। कृपया नीचे दिए गए विकल्पों का उपयोग करें या लिखें।'
              : 'Microphone hardware is not accessible. Please type symptoms or click quick test chips below.'
          );
        }
      }
    }

    if (startedAny) {
      setIsListening(true);
      setRecordingSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } else if (!micPermissionError) {
      setMicPermissionError(
        isHindi
          ? 'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया नीचे दिए गए विकल्पों से अपनी समस्या बताएं।'
          : 'Microphone could not be activated. Please use quick symptom options below or type your complaint.'
      );
    }
  };

  // Stop Audio Recording and auto-submit recognized voice transcript
  const stopAudioRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    } else if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsListening(false);

    // If text was recognized via WebSpeech, automatically send it after a brief pause
    setTimeout(() => {
      const textToSubmit = currentInputText.trim();
      if (textToSubmit && !isTranscribing) {
        handleSendMessage(textToSubmit, true);
      }
    }, 400);
  };

  // Convert Audio Blob to Base64 and send to Whisper STT API
  const processAudioWithWhisperStt = async (audioBlob: Blob, mimeType: string) => {
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1] || '';
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const audioBase64 = await base64Promise;

      const response = await fetch('/api/v1/ai/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          language: isHindi ? 'hi' : 'en',
          sessionId: 'SES-DEMO-2026-001',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const transcribedText = (data.transcript || '').trim();

        if (transcribedText) {
          setCurrentInputText(transcribedText);
          await handleSendMessage(transcribedText, true);
          return;
        }
      }

      // Fallback to interim text if Whisper yielded empty string
      if (currentInputText.trim()) {
        await handleSendMessage(currentInputText.trim(), false);
      }
    } catch (err) {
      console.error('Whisper STT transcription failed, using fallback:', err);
      if (currentInputText.trim()) {
        await handleSendMessage(currentInputText.trim(), false);
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleToggleListening = () => {
    // 1. Barge-in: immediately cancel any AI speaking
    stopSpeaking();

    if (isListening) {
      stopAudioRecording();
    } else {
      startAudioRecording();
    }
  };

  const handleSendMessage = async (customText?: string, fromStt = false) => {
    const textToSend = (customText || currentInputText).trim();
    if (!textToSend) return;

    // Immediately stop speaking and stop listening
    stopSpeaking();
    if (isListening) {
      stopAudioRecording();
    }

    // Append patient turn
    const patientTurn: DialogueTurn = {
      id: `turn-${Date.now()}`,
      speaker: 'patient',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStt: fromStt,
    };

    const newHistory = [...dialogueHistory, patientTurn];
    setDialogueHistory(newHistory);
    setCurrentInputText('');
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/v1/ai/voice-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory.map((t) => ({ speaker: t.speaker, text: t.text })),
          utterance: textToSend,
          language: isHindi ? 'hi' : 'en',
          sessionId: 'SES-DEMO-2026-001',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponseText =
          data.aiSpeechResponse ||
          (isHindi
            ? `आपका विवरण: "${textToSend}"। आपकी समस्या दर्ज कर ली गई है। क्या आप पुरानी पर्ची या रिपोर्ट स्कैन करना चाहते हैं?`
            : `Summary of your symptoms: "${textToSend}". We have recorded your complaints. Would you like to scan your prescriptions or lab reports now?`);

        const aiTurn: DialogueTurn = {
          id: `turn-${Date.now() + 1}`,
          speaker: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSummary: true,
        };

        setDialogueHistory((prev) => [...prev, aiTurn]);
        setPatientSummary(textToSend);

        // Play TTS ONLY if the user has not started a new voice recording in the meantime
        if (!isListeningRef.current) {
          speakText(aiResponseText);
        }

        if (data.extractedComplaints?.length > 0) {
          const newEntities: SymptomEntity[] = data.extractedComplaints.map(
            (item: any, idx: number) => ({
              id: `sym_extracted_${Date.now()}_${idx}`,
              symptom: item.symptom || 'Reported Symptom',
              present: item.present !== false,
              duration: item.duration || 'Recently',
              severity: item.severity || 'moderate',
              bodyPart: item.bodyPart || 'General',
              source: { type: 'PATIENT_STATEMENT', confidence: item.confidence || 0.95 },
            })
          );
          setExtractedEntities((prev) => [...prev, ...newEntities]);
        }

        setShowOcrPrompt(true);
      } else {
        fallbackResponse(textToSend);
      }
    } catch {
      fallbackResponse(textToSend);
    } finally {
      setIsAiThinking(false);
    }
  };

  const fallbackResponse = (textToSend: string) => {
    const summaryText = isHindi
      ? `आपका सारांश: "${textToSend}"। हमने आपकी समस्या दर्ज कर ली है। अब कृपया अपनी पुरानी पर्ची व टेस्ट रिपोर्ट स्कैन (OCR) करने के लिए आगे बढ़ें।`
      : `Summary of your complaints: "${textToSend}". Your symptoms are recorded. Please proceed to scan your past medical records and prescriptions with OCR.`;

    const aiTurn: DialogueTurn = {
      id: `turn-${Date.now() + 1}`,
      speaker: 'ai',
      text: summaryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSummary: true,
    };
    setDialogueHistory((prev) => [...prev, aiTurn]);
    setPatientSummary(textToSend);
    if (!isListeningRef.current) {
      speakText(summaryText);
    }
    setShowOcrPrompt(true);
  };

  const combinedTranscript =
    dialogueHistory
      .filter((t) => t.speaker === 'patient')
      .map((t) => t.text)
      .join(' ') || patientSummary;

  const handleProceedToOcr = () => {
    stopSpeaking();
    if (onProceedToOcr) {
      onProceedToOcr(
        combinedTranscript || (isHindi ? 'मरीज की मौखिक समस्या दर्ज' : 'Patient voice symptoms recorded'),
        extractedEntities
      );
    } else {
      onContinue(
        combinedTranscript || (isHindi ? 'मरीज की मौखिक समस्या दर्ज' : 'Patient voice symptoms recorded'),
        extractedEntities,
        'voice'
      );
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'अपनी मुख्य समस्या बताएं' : 'Voice Case-Taking & Symptoms'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? 'माइक दबाकर अपनी बीमारी बताएं — AI आपके लक्षण सुनेगा, सारांश लिखेगा और पर्ची स्कैन करने का विकल्प देगा।'
              : 'Speak your symptoms naturally — Whisper STT & OmniVoice AI transcribe, summarize, and guide you to scan documents.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onSwitchToTouch && (
            <button
              type="button"
              onClick={onSwitchToTouch}
              className="px-3 py-1.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHindi ? 'टच मोड पर जाएं' : 'Switch to Touch'}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Whisper Large v3 STT</span>
          </div>

          <AudioVoiceButton
            text={
              isHindi
                ? 'अपनी बीमारी बताने के लिए नीचे माइक बटन दबाएं।'
                : 'Tap the microphone below to speak and describe your symptoms.'
            }
            language={language}
            label={isHindi ? 'निर्देश सुनें' : 'Listen'}
            variant="secondary"
          />
        </div>
      </div>

      {micPermissionError && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{micPermissionError}</span>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Cols: Live OmniVoice Dialogue Box */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[540px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">OmniVoice Multilingual AI Intake</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isListening
                          ? 'bg-rose-500 animate-ping'
                          : isAiSpeaking
                          ? 'bg-teal-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    />
                    {isListening
                      ? isHindi
                        ? `मरीज बोल रहे हैं... (${formatTimer(recordingSeconds)})`
                        : `Recording patient voice... (${formatTimer(recordingSeconds)})`
                      : isTranscribing
                      ? isHindi
                        ? 'व्हिस्पर STT समझ रहा है...'
                        : 'Transcribing speech with Whisper STT...'
                      : isAiSpeaking
                      ? isHindi
                        ? 'AI बोल रहा है... (माइक दबाकर रोकें)'
                        : 'AI Speaking... (Tap mic anytime to interrupt)'
                      : isHindi
                      ? 'माइक तैयार है'
                      : 'Microphone Ready'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAiSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  title="Mute AI Voice"
                >
                  <VolumeX className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Mute</span>
                </button>
              )}

              {showOcrPrompt && (
                <button
                  type="button"
                  onClick={handleProceedToOcr}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'पर्ची स्कैन करें' : 'Proceed to OCR'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
            {dialogueHistory.map((turn) => (
              <div
                key={turn.id}
                className={`flex gap-3 ${turn.speaker === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                {turn.speaker === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-white border border-emerald-200 flex items-center justify-center shrink-0 mt-1 shadow-2xs p-0.5 overflow-hidden">
                    <img
                      src="/ayumitra-logo.png"
                      alt="AyuMitra AI"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    turn.speaker === 'patient'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : turn.isSummary
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 font-medium'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {turn.isSummary && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHindi ? 'लक्षण सारांश' : 'AI Symptom Summary'}</span>
                    </div>
                  )}
                  <p>{turn.text}</p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 text-[10px] opacity-85">
                    <span className="flex items-center gap-1 font-semibold">
                      {turn.speaker === 'ai' ? 'AyuMitra AI' : 'You (Patient)'}
                      {turn.isStt && <span className="bg-emerald-700/50 px-1 rounded text-[9px] text-white">Voice STT</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      {turn.speaker === 'ai' && (
                        <button
                          type="button"
                          onClick={() => speakText(turn.text)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer bg-white/70 px-1.5 py-0.5 rounded shadow-2xs hover:bg-white"
                          title="Listen to AI audio"
                        >
                          <Volume2 className="w-3 h-3 text-emerald-600" />
                          <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                        </button>
                      )}
                      <span>{turn.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTranscribing && (
              <div className="flex gap-3 justify-start items-center text-emerald-700 text-xs font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {isHindi
                    ? 'Groq Whisper Large v3 ऑडियो को सटीक टेक्स्ट में बदल रहा है...'
                    : 'Groq Whisper Large v3 is transcribing your voice with high clinical accuracy...'}
                </span>
              </div>
            )}

            {isAiThinking && !isTranscribing && (
              <div className="flex gap-3 justify-start items-center text-slate-500 text-xs italic bg-white p-3 rounded-2xl border border-slate-200">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {isHindi
                    ? 'AI लक्षण समझकर सारांश लिख रहा है...'
                    : 'OmniVoice AI is analyzing your symptoms and writing summary...'}
                </span>
              </div>
            )}

            {isAiSpeaking && (
              <div className="flex gap-2.5 items-center bg-teal-50/80 border border-teal-200 text-teal-800 px-3.5 py-2.5 rounded-2xl text-xs font-medium">
                <Volume2 className="w-4 h-4 text-teal-600 animate-pulse shrink-0" />
                <span className="flex-1">
                  {isHindi
                    ? 'AI सारांश बोल रहा है... बीच में बोलने के लिए माइक दबाएं।'
                    : 'AI is speaking aloud... Tap the mic anytime to interrupt and speak.'}
                </span>
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-2 py-0.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-md text-[11px] font-bold"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* OCR Callout Banner inside chat when completed */}
          {showOcrPrompt && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-b border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{isHindi ? 'लक्षण सारांश तैयार!' : 'Symptoms Summarized!'}</strong>{' '}
                  {isHindi
                    ? 'क्या आप पुरानी डॉक्टर की पर्ची या टेस्ट रिपोर्ट स्कैन करना चाहते हैं?'
                    : 'Do you want to scan your past medical records/prescriptions with OCR?'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleProceedToOcr}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isHindi ? 'दस्तावेज़ स्कैन (OCR) पर जाएं' : 'Move to OCR Scan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mic Permission / Connection Banner */}
          {micPermissionError && (
            <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{micPermissionError}</span>
              </div>
              <button
                type="button"
                onClick={startAudioRecording}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer shrink-0"
              >
                {isHindi ? 'पुनः प्रयास करें' : 'Retry Mic'}
              </button>
            </div>
          )}

          {/* Live Voice Input Controls */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <button
                id="btn-voice-mic"
                type="button"
                onClick={handleToggleListening}
                disabled={isTranscribing}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                    : isTranscribing
                    ? 'bg-amber-500 text-white'
                    : isAiSpeaking
                    ? 'bg-teal-600 hover:bg-rose-600 text-white shadow-teal-600/30 ring-4 ring-teal-200 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
                title={
                  isListening
                    ? 'Click to stop and transcribe'
                    : isAiSpeaking
                    ? 'Click to interrupt AI and speak'
                    : 'Click to record and speak your symptoms'
                }
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 animate-spin" />
                ) : isTranscribing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : isAiSpeaking ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              <div className="flex-1 relative">
                <input
                  id="input-voice-transcript"
                  type="text"
                  value={currentInputText}
                  onChange={(e) => setCurrentInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening
                      ? isHindi
                        ? `रिकॉर्ड हो रहा है (${formatTimer(recordingSeconds)})... बोलिए...`
                        : `Recording live (${formatTimer(recordingSeconds)})... Speak symptoms...`
                      : isTranscribing
                      ? isHindi
                        ? 'व्हिस्पर STT समझ रहा है...'
                        : 'Whisper STT transcribing...'
                      : isAiSpeaking
                      ? isHindi
                        ? 'AI बोल रहा है... माइक दबाकर अपनी बात शुरू करें'
                        : 'AI speaking... Tap mic anytime to speak'
                      : isHindi
                      ? 'माइक दबाकर बोलें या यहाँ लिखें...'
                      : 'Tap mic to speak or type your symptoms here...'
                  }
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-medium ${
                    isListening
                      ? 'border-rose-400 bg-rose-50/40 animate-pulse text-slate-900'
                      : isAiSpeaking
                      ? 'border-teal-300 bg-teal-50/30 text-slate-900'
                      : 'border-slate-200 text-slate-900'
                  }`}
                />
                {isListening && (
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-rose-600 animate-pulse flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5" />
                    REC
                  </span>
                )}
              </div>

              {isListening ? (
                <button
                  type="button"
                  onClick={stopAudioRecording}
                  className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  id="btn-send-utterance"
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!currentInputText.trim() || isTranscribing || isAiThinking}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  Send
                </button>
              )}
            </div>

            {/* Quick Sample Utterances for Instant Testing */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs text-slate-500">
              <span className="font-semibold text-[11px] text-slate-400 shrink-0">Try Voice Samples:</span>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    isHindi
                      ? 'मुझे दो दिन से सीने में तेज दर्द और सांस फूल रही है'
                      : 'I have severe chest pain and breathlessness for 2 days'
                  )
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg shrink-0 transition-all border border-slate-200 cursor-pointer"
              >
                {isHindi ? 'सीने में दर्द व सांस फूलना' : 'Chest Pain & Breathlessness'}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    isHindi
                      ? 'मुझे तीन दिन से तेज बुखार, कंपकंपी और सिरदर्द है'
                      : 'I have high fever with chills and headache for 3 days'
                  )
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg shrink-0 transition-all border border-slate-200 cursor-pointer"
              >
                {isHindi ? 'तेज बुखार व सिरदर्द' : 'Fever & Headache'}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    isHindi
                      ? 'पेट में तेज मरोड़ और उल्टी जैसा लग रहा है'
                      : 'I have severe abdominal cramps and nausea since yesterday'
                  )
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg shrink-0 transition-all border border-slate-200 cursor-pointer"
              >
                {isHindi ? 'पेट दर्द व उल्टी' : 'Stomach Pain & Nausea'}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    isHindi ? 'बस इतना ही है, कोई और समस्या नहीं है' : "That's all my symptoms"
                  )
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg shrink-0 transition-all border border-slate-200 cursor-pointer"
              >
                {isHindi ? 'बस इतना ही' : "That's all"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Structured Findings & OCR Transition */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>{isHindi ? 'निकाले गए लक्षण' : 'Extracted Symptoms'}</span>
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {extractedEntities.length} Detected
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              {isHindi ? 'संवाद से पहचाने गए मुख्य लक्षण:' : 'Real-time clinical NLP entities parsed from conversation:'}
            </p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {extractedEntities.map((entity) => (
                <div
                  key={entity.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h5 className="font-bold text-slate-900 text-xs">{entity.symptom}</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Duration: <strong>{entity.duration || '2 days'}</strong> • Severity:{' '}
                      <strong>{entity.severity || 'severe'}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {Math.round((entity.source.confidence || 0.95) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              id="btn-go-to-ocr"
              type="button"
              onClick={handleProceedToOcr}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? 'दस्तावेज़ स्कैन (OCR) पर जाएं' : 'Scan Documents (OCR)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
