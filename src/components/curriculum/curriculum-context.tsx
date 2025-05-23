'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the curriculum context
export interface CurriculumStandard {
  title?: string;
  description?: string;
  code: string;
  subject: string;
  keyStage: string;
  complexity?: number;
  scope?: number;
  link?: string;
  topic?: string;
  visualElements?: boolean;
  auditoryElements?: boolean;
  textualElements?: boolean;
  practicalElements?: boolean;
  objectives?: string[];
  prerequisites?: any[];
  units?: {
    title?: string;
    description?: string;
    challengeCount?: number;
  }[];
}

export interface CurriculumContextType {
  standards: CurriculumStandard[];
  subjects: string[];
  keyStages: string[];
  getCurriculumStandards?: (subject: string, keyStage: string) => CurriculumStandard[];
  viewStandard: (code: string) => void;
}

// Create the context with a default value
const CurriculumContext = createContext<CurriculumContextType | null>(null);

// Mock data for development
const mockStandards: CurriculumStandard[] = [
  {
    code: 'MA2-1',
    title: 'Number and Place Value',
    description: 'Understanding number systems and place value',
    subject: 'Mathematics',
    keyStage: 'KS2',
    complexity: 3,
    scope: 2,
    link: '/curriculum/mathematics/ks2/number',
    topic: 'Number',
    visualElements: true,
    textualElements: true,
    practicalElements: true,
    objectives: [
      'Count in multiples of 6, 7, 9, 25 and 1000',
      'Find 1000 more or less than a given number',
      'Count backwards through zero to include negative numbers',
      'Recognise the place value of each digit in a four-digit number'
    ]
  },
  {
    code: 'EN2-1',
    title: 'Reading - Word Reading',
    description: 'Apply phonic knowledge and skills to decode words',
    subject: 'English',
    keyStage: 'KS2',
    complexity: 2,
    scope: 3,
    link: '/curriculum/english/ks2/reading',
    topic: 'Reading',
    auditoryElements: true,
    textualElements: true,
    objectives: [
      'Apply their growing knowledge of root words, prefixes and suffixes',
      'Read aloud books closely matched to their improving phonic knowledge',
      'Read exception words, noting the unusual correspondences'
    ]
  },
  {
    code: 'SC2-1',
    title: 'Working Scientifically',
    description: 'Scientific methods and investigation skills',
    subject: 'Science',
    keyStage: 'KS2',
    complexity: 3,
    scope: 2,
    link: '/curriculum/science/ks2/methods',
    topic: 'Scientific Method',
    visualElements: true,
    practicalElements: true,
    objectives: [
      'Ask relevant questions and use different types of scientific enquiries to answer them',
      'Set up simple practical enquiries, comparative and fair tests',
      'Make systematic and careful observations',
      'Gather, record, classify and present data in a variety of ways'
    ]
  }
];

// Provider component
export const CurriculumProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [standards] = useState<CurriculumStandard[]>(mockStandards);
  
  // Extract unique subjects
  const subjects = Array.from(new Set(standards.map(standard => standard.subject)));
  
  // Extract unique key stages
  const keyStages = Array.from(new Set(standards.map(standard => standard.keyStage)));
  
  // Function to get curriculum standards by subject and key stage
  const getCurriculumStandards = (subject: string, keyStage: string): CurriculumStandard[] => {
    return standards.filter(
      standard => standard.subject === subject && standard.keyStage === keyStage
    );
  };
  
  // Function to view a specific standard (in a real app, this might navigate to a details page)
  const viewStandard = (code: string) => {
    console.log(`Viewing standard: ${code}`);
    // In a real implementation, this would navigate to a details page or open a modal
  };
  
  return (
    <CurriculumContext.Provider 
      value={{ 
        standards, 
        subjects, 
        keyStages, 
        getCurriculumStandards,
        viewStandard
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};

// Custom hook to use the curriculum context
export const useCurriculum = () => useContext(CurriculumContext);

export default CurriculumContext;