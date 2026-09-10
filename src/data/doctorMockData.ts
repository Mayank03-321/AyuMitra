export interface QueuePatient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  language: string;
  chiefComplaint: string;
  status: 'AI Ready & Structured' | 'AI Ready' | 'Transcribing' | 'Completed';
  priority: 'High Priority' | 'Medium' | 'Low';
  waitTime: string;
  statusColor: string;
  priorityColor: string;
}

export const MOCK_QUEUE: QueuePatient[] = [
  {
    id: 'MK-8492',
    name: 'Rahul Kumar',
    initials: 'RK',
    age: 42,
    gender: 'M',
    language: 'Hindi',
    chiefComplaint: 'Chest discomfort...',
    status: 'AI Ready & Structured',
    priority: 'High Priority',
    waitTime: '14m ago',
    statusColor: 'bg-emerald-100 text-emerald-800',
    priorityColor: 'text-red-600 bg-red-50 border-red-200'
  },
  {
    id: 'MK-8493',
    name: 'Priya Shah',
    initials: 'PS',
    age: 29,
    gender: 'F',
    language: 'Gujarati',
    chiefComplaint: 'Severe throbbing...',
    status: 'AI Ready',
    priority: 'Medium',
    waitTime: '22m ago',
    statusColor: 'bg-emerald-50 text-emerald-700',
    priorityColor: 'text-blue-600'
  },
  {
    id: 'MK-8494',
    name: 'Amit Patel',
    initials: 'AP',
    age: 56,
    gender: 'M',
    language: 'Marathi',
    chiefComplaint: 'High-grade fever with...',
    status: 'Transcribing',
    priority: 'Medium',
    waitTime: '5m ago',
    statusColor: 'bg-blue-50 text-blue-700',
    priorityColor: 'text-blue-600'
  },
  {
    id: 'MK-8495',
    name: 'Sunita Devi',
    initials: 'SD',
    age: 61,
    gender: 'F',
    language: 'Hindi',
    chiefComplaint: 'Chronic breathlessne...',
    status: 'AI Ready',
    priority: 'High Priority',
    waitTime: '31m ago',
    statusColor: 'bg-emerald-50 text-emerald-700',
    priorityColor: 'text-red-600 bg-red-50 border-red-200'
  },
  {
    id: 'MK-8496',
    name: 'Vikram Malhotra',
    initials: 'VM',
    age: 35,
    gender: 'M',
    language: 'English',
    chiefComplaint: 'Routine hypertension...',
    status: 'Completed',
    priority: 'Low',
    waitTime: '--',
    statusColor: 'bg-slate-100 text-slate-600',
    priorityColor: 'text-slate-500'
  }
];

export const MOCK_ALERTS = [
  {
    id: 1,
    type: 'Red Flag Detected',
    time: '10:42 AM',
    desc: 'Rahul Kumar: Chest discomfort + severe hypertension history identified via intake model.',
    color: 'bg-red-50 text-red-900 border-red-200',
    iconColor: 'text-red-500'
  },
  {
    id: 2,
    type: 'OCR Ingestion',
    time: '10:35 AM',
    desc: 'Extracted 4 lab values from Apollo Diagnostics PDF for Sunita Devi.',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    iconColor: 'text-blue-500'
  },
  {
    id: 3,
    type: 'Voice Translation',
    time: '10:28 AM',
    desc: 'Hindi audio transcribed & clinical entity tags verified for Amit Patel.',
    color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    iconColor: 'text-indigo-500'
  },
  {
    id: 4,
    type: 'Consultation Finalized',
    time: '10:15 AM',
    desc: 'Dr. Sharma verified case summary & signed prescription for Rajesh Verma.',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    iconColor: 'text-emerald-500'
  }
];
