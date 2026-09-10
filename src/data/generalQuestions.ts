export interface GeneralQuestion {
  id: string;
  term: string;
  termHi: string;
  description: string;
  descriptionHi: string;
  options: {
    id: string;
    label: string;
    labelHi: string;
  }[];
}

export const GENERAL_QUESTION_BANK: GeneralQuestion[] = [
  {
    id: 'current_medication',
    term: 'Current Medication',
    termHi: 'वर्तमान दवाएँ',
    description: 'Have you taken any medication for this problem recently?',
    descriptionHi: 'क्या आपने हाल ही में इस समस्या के लिए कोई दवा ली है?',
    options: [
      { id: 'meds_none', label: 'No medication taken', labelHi: 'कोई दवा नहीं ली' },
      { id: 'meds_otc', label: 'Over-the-counter (Pharmacy) medicine', labelHi: 'फार्मेसी से ली गई आम दवा' },
      { id: 'meds_prescribed', label: 'Prescribed medication from a doctor', labelHi: 'डॉक्टर द्वारा दी गई दवा' },
      { id: 'meds_home', label: 'Home remedies', labelHi: 'घरेलू उपचार' }
    ]
  },
  {
    id: 'aggravating_factors',
    term: 'Aggravating Factors',
    termHi: 'बढ़ाने वाले कारक',
    description: 'What makes your symptoms or pain worse?',
    descriptionHi: 'किस चीज़ से आपके लक्षण या दर्द बढ़ जाते हैं?',
    options: [
      { id: 'agg_activity', label: 'Physical activity or movement', labelHi: 'शारीरिक गतिविधि या चलने-फिरने से' },
      { id: 'agg_food', label: 'Eating or drinking specific foods', labelHi: 'कुछ खाने या पीने से' },
      { id: 'agg_rest', label: 'Lying down or resting', labelHi: 'लेटने या आराम करने से' },
      { id: 'agg_stress', label: 'Stress or lack of sleep', labelHi: 'तनाव या नींद की कमी से' }
    ]
  },
  {
    id: 'relieving_factors',
    term: 'Relieving Factors',
    termHi: 'आराम देने वाले कारक',
    description: 'What makes your symptoms or pain feel better?',
    descriptionHi: 'किस चीज़ से आपके लक्षण या दर्द में आराम मिलता है?',
    options: [
      { id: 'rel_rest', label: 'Resting or lying down', labelHi: 'आराम करने या लेटने से' },
      { id: 'rel_meds', label: 'Taking pain medication', labelHi: 'दर्द निवारक दवा लेने से' },
      { id: 'rel_heat_cold', label: 'Applying heat or cold packs', labelHi: 'गर्म या ठंडी सिकाई से' },
      { id: 'rel_none', label: 'Nothing seems to help', labelHi: 'किसी चीज़ से आराम नहीं मिलता' }
    ]
  },
  {
    id: 'systemic_symptoms',
    term: 'Associated Symptoms',
    termHi: 'संबंधित लक्षण',
    description: 'Are you experiencing any of these other symptoms?',
    descriptionHi: 'क्या आप इनमें से किसी अन्य लक्षण का भी अनुभव कर रहे हैं?',
    options: [
      { id: 'sys_fever', label: 'Fever or chills', labelHi: 'बुखार या ठंड लगना' },
      { id: 'sys_fatigue', label: 'Extreme fatigue or weakness', labelHi: 'अत्यधिक थकान या कमज़ोरी' },
      { id: 'sys_weight', label: 'Unexplained weight loss', labelHi: 'बिना कारण वजन कम होना' },
      { id: 'sys_none', label: 'None of these', labelHi: 'इनमें से कोई नहीं' }
    ]
  },
  {
    id: 'past_episodes',
    term: 'Past Episodes',
    termHi: 'पिछली घटनाएँ',
    description: 'Have you ever experienced this specific problem before?',
    descriptionHi: 'क्या आपने पहले कभी इस विशिष्ट समस्या का अनुभव किया है?',
    options: [
      { id: 'past_never', label: 'No, this is the first time', labelHi: 'नहीं, यह पहली बार है' },
      { id: 'past_once', label: 'Yes, happened once before', labelHi: 'हाँ, पहले एक बार हुआ था' },
      { id: 'past_frequent', label: 'Yes, it happens frequently', labelHi: 'हाँ, ऐसा अक्सर होता है' },
      { id: 'past_chronic', label: 'Yes, it is a chronic/ongoing issue', labelHi: 'हाँ, यह एक पुरानी/निरंतर समस्या है' }
    ]
  }
];
