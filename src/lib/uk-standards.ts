/**
 * UK Educational Standards Utility for EdPsych AI Education Platform
 * This utility ensures content aligns with UK Department for Education standards
 */

import { KeyStage } from '@/types';

// UK Key Stage age ranges
export const keyStageAgeRanges = {
  eyfs: { min: 3, max: 5, description: 'Early Years Foundation Stage' },
  ks1: { min: 5, max: 7, description: 'Key Stage 1' },
  ks2: { min: 7, max: 11, description: 'Key Stage 2' },
  ks3: { min: 11, max: 14, description: 'Key Stage 3' },
  ks4: { min: 14, max: 16, description: 'Key Stage 4' }
};

// UK National Curriculum subjects by Key Stage
export const ukNationalCurriculumSubjects = {
  eyfs: [
    { id: 'communication', name: 'Communication and Language' },
    { id: 'physical', name: 'Physical Development' },
    { id: 'personal', name: 'Personal, Social and Emotional Development' },
    { id: 'literacy', name: 'Literacy' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'understanding', name: 'Understanding the World' },
    { id: 'expressive', name: 'Expressive Arts and Design' }
  ],
  ks1: [
    { id: 'english', name: 'English' },
    { id: 'maths', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'art', name: 'Art and Design' },
    { id: 'computing', name: 'Computing' },
    { id: 'design', name: 'Design and Technology' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' },
    { id: 'music', name: 'Music' },
    { id: 'pe', name: 'Physical Education' }
  ],
  ks2: [
    { id: 'english', name: 'English' },
    { id: 'maths', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'art', name: 'Art and Design' },
    { id: 'computing', name: 'Computing' },
    { id: 'design', name: 'Design and Technology' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' },
    { id: 'languages', name: 'Languages' },
    { id: 'music', name: 'Music' },
    { id: 'pe', name: 'Physical Education' }
  ],
  ks3: [
    { id: 'english', name: 'English' },
    { id: 'maths', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'art', name: 'Art and Design' },
    { id: 'citizenship', name: 'Citizenship' },
    { id: 'computing', name: 'Computing' },
    { id: 'design', name: 'Design and Technology' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' },
    { id: 'languages', name: 'Languages' },
    { id: 'music', name: 'Music' },
    { id: 'pe', name: 'Physical Education' }
  ],
  ks4: [
    { id: 'english', name: 'English' },
    { id: 'maths', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'citizenship', name: 'Citizenship' },
    { id: 'pe', name: 'Physical Education' },
    // Plus optional GCSE subjects
    { id: 'computing', name: 'Computing' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' },
    { id: 'languages', name: 'Modern Foreign Languages' },
    { id: 'art', name: 'Art and Design' }
  ]
};

// UK spelling corrections (US -> UK)
export const ukSpellingCorrections: Record<string, string> = {
  'analyze': 'analyse',
  'behavior': 'behaviour',
  'center': 'centre',
  'color': 'colour',
  'customize': 'customise',
  'defense': 'defence',
  'dialog': 'dialogue',
  'enrollment': 'enrolment',
  'favorite': 'favourite',
  'fulfill': 'fulfil',
  'gray': 'grey',
  'honor': 'honour',
  'humor': 'humour',
  'labeled': 'labelled',
  'license': 'licence',
  'math': 'maths',
  'memorize': 'memorise',
  'organize': 'organise',
  'practice': 'practise',
  'program': 'programme',
  'recognize': 'recognise',
  'specialty': 'speciality',
  'standardize': 'standardise',
  'theater': 'theatre',
  'traveling': 'travelling',
  'visualization': 'visualisation'
};

/**
 * Convert text to use UK English spelling
 * @param text Text to convert
 * @returns Text with UK English spelling
 */
export function convertToUKSpelling(text: string): string {
  let ukText = text;
  
  // Replace whole words only (with word boundaries)
  Object.entries(ukSpellingCorrections).forEach(([us, uk]) => {
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    ukText = ukText.replace(regex, uk);
  });
  
  return ukText;
}

/**
 * Check if content is appropriate for the specified key stage
 * @param content Content to check
 * @param keyStage Target key stage
 * @returns Object with validation result and any issues found
 */
export function validateKeyStageAppropriateContent(
  content: string,
  keyStage: KeyStage
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Simple readability check based on sentence length and word complexity
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  
  // Check for long words (more than 3 syllables as a rough approximation)
  const longWords = content.match(/\b[a-z]{9,}\b/gi) || [];
  const longWordPercentage = (longWords.length / content.split(/\s+/).length) * 100;
  
  // Key stage appropriate thresholds
  const thresholds = {
    eyfs: { maxSentenceLength: 8, maxLongWordPercentage: 1 },
    ks1: { maxSentenceLength: 10, maxLongWordPercentage: 2 },
    ks2: { maxSentenceLength: 15, maxLongWordPercentage: 5 },
    ks3: { maxSentenceLength: 20, maxLongWordPercentage: 8 },
    ks4: { maxSentenceLength: 25, maxLongWordPercentage: 10 }
  };
  
  if (averageSentenceLength > thresholds[keyStage].maxSentenceLength) {
    issues.push(`Average sentence length (${averageSentenceLength.toFixed(1)} words) exceeds recommendation for ${keyStageAgeRanges[keyStage].description} (max ${thresholds[keyStage].maxSentenceLength} words)`);
  }
  
  if (longWordPercentage > thresholds[keyStage].maxLongWordPercentage) {
    issues.push(`Percentage of complex words (${longWordPercentage.toFixed(1)}%) exceeds recommendation for ${keyStageAgeRanges[keyStage].description} (max ${thresholds[keyStage].maxLongWordPercentage}%)`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Get curriculum objectives for a subject and key stage
 * @param subject Subject ID
 * @param keyStage Key stage
 * @returns Array of curriculum objectives
 */
export function getCurriculumObjectives(subject: string, keyStage: KeyStage): string[] {
  // This would ideally be populated from a comprehensive database of UK curriculum objectives
  // For now, returning placeholder examples for demonstration
  
  const curriculumMap: Record<string, Record<KeyStage, string[]>> = {
    'maths': {
      'eyfs': [
        'Count reliably with numbers from 1 to 20',
        'Place numbers in order',
        'Say which number is one more or one less than a given number',
        'Use quantities and objects to add and subtract two single-digit numbers'
      ],
      'ks1': [
        'Count to and across 100, forwards and backwards',
        'Read and write numbers to 100 in numerals',
        'Add and subtract one-digit and two-digit numbers to 20',
        'Recognise, find and name a half and a quarter'
      ],
      'ks2': [
        'Count in multiples of 6, 7, 9, 25 and 1000',
        'Use place value to add and subtract numbers',
        'Recall multiplication and division facts up to 12 × 12',
        'Convert between different units of measure'
      ],
      'ks3': [
        'Understand and use place value for decimals, measures and integers',
        'Use the concepts and vocabulary of prime numbers, factors and multiples',
        'Use standard units of mass, length, time, money and other measures',
        'Use algebraic methods to solve linear equations in one variable'
      ],
      'ks4': [
        'Apply systematic listing strategies including use of the product rule for counting',
        'Estimate powers and roots of any given positive number',
        'Calculate with roots, and with integer and fractional indices',
        'Understand and use standard mathematical formulae'
      ]
    },
    'english': {
      'eyfs': [
        'Listen attentively in a range of situations',
        'Express themselves effectively',
        'Develop their own narratives and explanations',
        'Read and understand simple sentences'
      ],
      'ks1': [
        'Apply phonic knowledge and skills to decode words',
        'Read accurately by blending sounds in unfamiliar words',
        'Write sentences by saying out loud what they are going to write about',
        'Use capital letters, full stops, question marks and exclamation marks'
      ],
      'ks2': [
        'Apply their growing knowledge of root words, prefixes and suffixes',
        'Read and discuss a wide range of fiction, poetry, plays, non-fiction and reference books',
        'Plan their writing by discussing writing similar to that which they are planning to write',
        'Use further organisational and presentational devices to structure text'
      ],
      'ks3': [
        'Develop an appreciation and love of reading through reading a wide range of fiction and non-fiction',
        'Write accurately, fluently, effectively and at length for pleasure and information',
        'Plan, draft, edit and proof-read their work',
        'Use Standard English confidently in their own writing and speech'
      ],
      'ks4': [
        'Read and appreciate the depth and power of the English literary heritage',
        'Write effectively and coherently using Standard English appropriately',
        'Use grammar correctly, punctuate and spell accurately',
        'Acquire and apply a wide vocabulary, alongside a knowledge and understanding of grammatical terminology'
      ]
    },
    'science': {
      'eyfs': [
        'Know about similarities and differences in relation to places, objects, materials and living things',
        'Talk about the features of their own immediate environment',
        'Make observations of animals and plants',
        'Explain why some things occur, and talk about changes'
      ],
      'ks1': [
        'Identify and name a variety of common wild and garden plants',
        'Identify and name a variety of common animals',
        'Distinguish between an object and the material from which it is made',
        'Observe changes across the four seasons'
      ],
      'ks2': [
        'Identify and describe the functions of different parts of flowering plants',
        'Identify that animals, including humans, need the right types and amount of nutrition',
        'Compare and group together different kinds of rocks',
        'Recognise that light appears to travel in straight lines'
      ],
      'ks3': [
        'Understand the structure and functions of living organisms',
        'Understand the interactions between organisms and their environment',
        'Understand the properties and changes of materials',
        'Understand energy changes and transfers'
      ],
      'ks4': [
        'Understand cells as the fundamental unit of living organisms',
        'Understand the process of natural selection and evolution',
        'Understand atomic structure and the periodic table',
        'Understand forces and motion'
      ]
    }
  };
  
  // Return objectives if they exist, otherwise empty array
  return curriculumMap[subject]?.[keyStage] || [];
}

/**
 * Check if content aligns with UK curriculum for the specified subject and key stage
 * @param content Content to check
 * @param subject Subject ID
 * @param keyStage Key stage
 * @returns Object with alignment score and suggestions
 */
export function checkCurriculumAlignment(
  content: string,
  subject: string,
  keyStage: KeyStage
): { alignmentScore: number; suggestions: string[] } {
  const objectives = getCurriculumObjectives(subject, keyStage);
  const suggestions: string[] = [];
  
  if (objectives.length === 0) {
    return { alignmentScore: 0, suggestions: ['No curriculum objectives available for this subject and key stage'] };
  }
  
  // Simple keyword matching for curriculum alignment
  let matchCount = 0;
  
  objectives.forEach(objective => {
    // Extract key terms from the objective
    const keyTerms = objective
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3);
    
    // Check if content contains these key terms
    const contentLower = content.toLowerCase();
    const matchedTerms = keyTerms.filter(term => contentLower.includes(term));
    
    if (matchedTerms.length > 0) {
      matchCount++;
    } else {
      suggestions.push(`Consider addressing: ${objective}`);
    }
  });
  
  const alignmentScore = (matchCount / objectives.length) * 100;
  
  return {
    alignmentScore,
    suggestions: suggestions.length > 0 ? suggestions : ['Content aligns well with curriculum objectives']
  };
}

/**
 * Get UK educational terminology alternatives for common terms
 * @returns Record of US/international terms mapped to UK educational terms
 */
export function getUKEducationalTerminology(): Record<string, string> {
  return {
    'grade': 'year',
    'elementary school': 'primary school',
    'middle school': 'secondary school',
    'high school': 'secondary school',
    'freshman': 'year 10 student',
    'sophomore': 'year 11 student',
    'junior': 'year 12 student',
    'senior': 'year 13 student',
    'report card': 'school report',
    'principal': 'headteacher',
    'vice principal': 'deputy head',
    'faculty': 'staff',
    'semester': 'term',
    'recess': 'break time',
    'parent-teacher conference': 'parents\' evening',
    'school district': 'local education authority',
    'special education': 'special educational needs',
    'individualized education program': 'education, health and care plan',
    'IEP': 'EHCP',
    'standardized test': 'national assessment',
    'GPA': 'attainment level',
    'honor roll': 'academic honours',
    'valedictorian': 'top student',
    'graduation ceremony': 'leavers\' ceremony',
    'commencement': 'graduation',
    'major': 'course',
    'minor': 'subsidiary subject',
    'college': 'university',
    'campus': 'university grounds',
    'dormitory': 'halls of residence',
    'tuition': 'fees',
    'scholarship': 'bursary',
    'alumni': 'former students',
    'freshman orientation': 'induction week',
    'tenure': 'permanent contract',
    'adjunct professor': 'associate lecturer',
    'teaching assistant': 'learning support assistant',
    'school counselor': 'school guidance counsellor',
    'math': 'maths',
    'social studies': 'humanities',
    'physical education': 'PE',
    'gym class': 'PE lesson',
    'homeroom': 'form group',
    'homeroom teacher': 'form tutor',
    'substitute teacher': 'supply teacher',
    'field trip': 'school trip',
    'extracurricular': 'extra-curricular',
    'student body': 'student population',
    'student council': 'school council',
    'prom': 'school formal',
    'detention': 'after-school detention',
    'in-school suspension': 'internal exclusion',
    'suspension': 'fixed-term exclusion',
    'expulsion': 'permanent exclusion'
  };
}

/**
 * Convert educational terminology to UK standards
 * @param text Text to convert
 * @returns Text with UK educational terminology
 */
export function convertToUKEducationalTerminology(text: string): string {
  let ukText = text;
  const terminology = getUKEducationalTerminology();
  
  // Replace whole words and phrases only (with word boundaries)
  Object.entries(terminology).forEach(([international, uk]) => {
    const regex = new RegExp(`\\b${international}\\b`, 'gi');
    ukText = ukText.replace(regex, uk);
  });
  
  return ukText;
}
