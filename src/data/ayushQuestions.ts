export interface AyushQuestion {
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

export const AYUSH_QUESTION_BANK: AyushQuestion[] = [
  {
    id: 'prakriti',
    term: 'Prakriti (Body Constitution)',
    termHi: 'प्रकृति (शरीर का प्रकार)',
    description: 'What is your general body frame and physical tendency?',
    descriptionHi: 'आपके शरीर की सामान्य बनावट और शारीरिक प्रवृत्ति कैसी है?',
    options: [
      { id: 'vata_prakriti', label: 'Lean frame, quick movements, dry skin (Vata-dominant)', labelHi: 'पतला शरीर, चंचलता, रूखी त्वचा (वात-प्रधान)' },
      { id: 'pitta_prakriti', label: 'Medium frame, warm body, prone to acidity (Pitta-dominant)', labelHi: 'मध्यम शरीर, गर्मी लगना, एसिडिटी की प्रवृत्ति (पित्त-प्रधान)' },
      { id: 'kapha_prakriti', label: 'Heavy frame, calm, prone to weight gain (Kapha-dominant)', labelHi: 'भारी शरीर, शांत स्वभाव, वजन बढ़ने की प्रवृत्ति (कफ-प्रधान)' },
      { id: 'mixed_prakriti', label: 'Mixed / Balanced constitution', labelHi: 'मिश्रित / संतुलित प्रकृति' }
    ]
  },
  {
    id: 'vikriti',
    term: 'Vikriti (Current Imbalance)',
    termHi: 'विकृति (वर्तमान असंतुलन)',
    description: 'What major changes, discomforts, or new symptoms have you noticed recently?',
    descriptionHi: 'हाल ही में आपने अपने शरीर में क्या नए बदलाव, असुविधा या लक्षण महसूस किए हैं?',
    options: [
      { id: 'vata_vikriti', label: 'Increased pain, stiffness, dryness, or anxiety', labelHi: 'दर्द, अकड़न, रूखापन या घबराहट में वृद्धि' },
      { id: 'pitta_vikriti', label: 'Increased heat, burning sensation, or inflammation', labelHi: 'गर्मी, जलन या सूजन में वृद्धि' },
      { id: 'kapha_vikriti', label: 'Increased heaviness, congestion, or lethargy', labelHi: 'भारीपन, कफ (बलगम) या सुस्ती में वृद्धि' },
      { id: 'tridosha_vikriti', label: 'Multiple complex symptoms', labelHi: 'कई जटिल लक्षण एक साथ' }
    ]
  },
  {
    id: 'agni',
    term: 'Agni (Digestion & Appetite)',
    termHi: 'अग्नि (पाचन शक्ति)',
    description: 'How is your appetite and digestion currently?',
    descriptionHi: 'वर्तमान में आपकी भूख और पाचन शक्ति कैसी है?',
    options: [
      { id: 'agni_sama', label: 'Sama (Normal, healthy digestion)', labelHi: 'सम (सामान्य, उचित भूख व पाचन)' },
      { id: 'agni_manda', label: 'Manda (Slow digestion, heaviness after food)', labelHi: 'मन्द (सुस्त पाचन, भारीपन)' },
      { id: 'agni_tikshna', label: 'Tikshna (Intense hunger, acidity)', labelHi: 'तीक्ष्ण (तेज़ भूख, एसिडिटी/जलन)' },
      { id: 'agni_vishama', label: 'Vishama (Irregular, fluctuating appetite)', labelHi: 'विषम (अनियमित भूख, गैस)' }
    ]
  },
  {
    id: 'koshtha',
    term: 'Koshtha (Bowel Habits)',
    termHi: 'कोष्ठ (मल त्याग)',
    description: 'What is the regular nature of your bowel movements?',
    descriptionHi: 'आपके मल त्याग (शौच) की सामान्य प्रवृत्ति कैसी है?',
    options: [
      { id: 'koshtha_krura', label: 'Krura (Hard stools, prone to constipation)', labelHi: 'क्रूर (कठोर मल, कब्ज़ की प्रवृत्ति)' },
      { id: 'koshtha_madhyama', label: 'Madhyama (Normal, regular bowel movement)', labelHi: 'मध्यम (सामान्य, नियमित मल त्याग)' },
      { id: 'koshtha_mridu', label: 'Mridu (Soft stools, loose bowel easily)', labelHi: 'मृदु (मुलायम मल, जल्दी पेट साफ होना)' }
    ]
  },
  {
    id: 'ahara_vihara',
    term: 'Ahara Vihara (Diet & Lifestyle)',
    termHi: 'आहार-विहार (खान-पान व दिनचर्या)',
    description: 'Which of these best describes your recent diet and routine?',
    descriptionHi: 'इनमें से क्या आपके हालिया खान-पान और दिनचर्या का सबसे अच्छा वर्णन करता है?',
    options: [
      { id: 'av_kapha', label: 'Heavy, oily, or sweet foods with low physical activity', labelHi: 'भारी, तैलीय या मीठा भोजन और कम शारीरिक गतिविधि' },
      { id: 'av_pitta', label: 'Spicy, hot, or sour foods with high stress levels', labelHi: 'तीखा, गर्म या खट्टा भोजन और अधिक तनाव' },
      { id: 'av_vata', label: 'Dry, cold, or stale foods with irregular sleep/travel', labelHi: 'रूखा, ठंडा या बासी भोजन और अनियमित नींद/यात्रा' },
      { id: 'av_balanced', label: 'Balanced diet and healthy routine', labelHi: 'संतुलित आहार और स्वस्थ दिनचर्या' }
    ]
  },
  {
    id: 'nidana',
    term: 'Nidana (Causes & Triggers)',
    termHi: 'निदान (कारण / ट्रिगर)',
    description: 'What do you think triggered or worsened your current condition?',
    descriptionHi: 'आपको क्या लगता है कि किस कारण से आपकी समस्या शुरू या खराब हुई है?',
    options: [
      { id: 'nidana_weather', label: 'Weather changes or traveling', labelHi: 'मौसम में बदलाव या यात्रा' },
      { id: 'nidana_food', label: 'Specific foods, drinks, or eating habits', labelHi: 'विशिष्ट भोजन, पेय या खाने की आदतें' },
      { id: 'nidana_stress', label: 'Stress, emotional factors, or lack of sleep', labelHi: 'तनाव, मानसिक कारक या नींद की कमी' },
      { id: 'nidana_physical', label: 'Physical strain, overwork, or injury', labelHi: 'शारीरिक खिंचाव, अधिक काम या चोट' }
    ]
  },
  {
    id: 'samprapti',
    term: 'Samprapti (Progression)',
    termHi: 'सम्प्राप्ति (रोग का विकास)',
    description: 'How have your symptoms progressed over time?',
    descriptionHi: 'समय के साथ आपके लक्षण कैसे विकसित हुए हैं?',
    options: [
      { id: 'samp_sudden', label: 'Sudden onset and spreading quickly', labelHi: 'अचानक शुरू होकर तेजी से फैल रहे हैं' },
      { id: 'samp_gradual', label: 'Gradual onset, steadily worsening over time', labelHi: 'धीरे-धीरे शुरू होकर समय के साथ बढ़ रहे हैं' },
      { id: 'samp_fluctuating', label: 'Fluctuating, symptoms come and go', labelHi: 'उतार-चढ़ाव वाले, लक्षण आते-जाते रहते हैं' },
      { id: 'samp_stable', label: 'Stable, no major changes recently', labelHi: 'स्थिर, हाल ही में कोई बड़ा बदलाव नहीं' }
    ]
  }
];
