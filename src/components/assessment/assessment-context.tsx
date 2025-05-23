'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the assessment context
export interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  duration: number;
  questId?: string;
  chapterId?: string;
  challengeIndex?: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: string;
  text: string;
  options?: string[];
  correctAnswer?: number | boolean | string;
  points: number;
  sampleAnswer?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  answers?: any[];
  skillBreakdown?: Record<string, number>;
}

export interface AssessmentContextType {
  assessments?: Assessment[];
  results?: AssessmentResult[];
  createAssessment: (assessment: Omit<Assessment, 'id'>) => Promise<Assessment>;
  startAssessment: (assessmentId: string) => Promise<void>;
  submitAssessment: (assessmentId: string, answers: any[]) => Promise<AssessmentResult>;
  getAssessmentResults: (assessmentId: string) => AssessmentResult | undefined;
}

// Create the context with a default value
const AssessmentContext = createContext<AssessmentContextType | null>(null);

// Mock data for development
const mockAssessments: Assessment[] = [
  {
    id: 'a1',
    title: 'Mathematics: Number and Place Value',
    description: 'Test your understanding of number systems and place value',
    subject: 'Mathematics',
    keyStage: 'KS2',
    duration: 20, // minutes
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: 'What is the value of the digit 7 in the number 3,724?',
        options: ['7', '70', '700', '7,000'],
        correctAnswer: 2, // 700
        points: 10
      },
      {
        id: 'q2',
        type: 'true_false',
        text: 'The number 3,724 is greater than 3,742.',
        correctAnswer: false,
        points: 5
      },
      {
        id: 'q3',
        type: 'short_answer',
        text: 'Write the number 3,724 in words.',
        sampleAnswer: 'Three thousand, seven hundred and twenty-four',
        points: 15
      }
    ]
  },
  {
    id: 'a2',
    title: 'English: Reading Comprehension',
    description: 'Test your reading comprehension skills',
    subject: 'English',
    keyStage: 'KS2',
    duration: 30, // minutes
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: 'What is the main idea of the passage?',
        options: [
          'The importance of reading',
          'The history of books',
          'How to write a story',
          'The benefits of libraries'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        id: 'q2',
        type: 'short_answer',
        text: 'What does the author mean by "reading is a journey"?',
        sampleAnswer: 'The author means that reading takes you to different places and experiences, like a journey.',
        points: 15
      }
    ]
  }
];

const mockResults: AssessmentResult[] = [
  {
    id: 'r1',
    assessmentId: 'a1',
    score: 20,
    maxScore: 30,
    completedAt: '2023-01-15T12:30:00Z',
    skillBreakdown: {
      'problem-solving': 80,
      'critical-thinking': 70,
      'application': 60
    }
  }
];

// Provider component
export const AssessmentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [results, setResults] = useState<AssessmentResult[]>(mockResults);
  
  // Function to create a new assessment
  const createAssessment = async (assessment: Omit<Assessment, 'id'>): Promise<Assessment> => {
    // In a real implementation, this would call an API
    console.log('Creating assessment', assessment);
    
    const newAssessment: Assessment = {
      ...assessment,
      id: `a${Date.now()}`
    };
    
    setAssessments(prev => [...prev, newAssessment]);
    
    return newAssessment;
  };
  
  // Function to start an assessment
  const startAssessment = async (assessmentId: string): Promise<void> => {
    // In a real implementation, this would call an API
    console.log(`Starting assessment: ${assessmentId}`);
  };
  
  // Function to submit an assessment
  const submitAssessment = async (assessmentId: string, answers: any[]): Promise<AssessmentResult> => {
    // In a real implementation, this would call an API
    console.log(`Submitting assessment: ${assessmentId}`, answers);
    
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }
    
    // Calculate score (simplified for mock)
    const maxScore = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const score = Math.round(maxScore * 0.8); // Mock score: 80%
    
    const result: AssessmentResult = {
      id: `r${Date.now()}`,
      assessmentId,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
      skillBreakdown: {
        'problem-solving': 80,
        'critical-thinking': 75,
        'application': 85
      }
    };
    
    setResults(prev => [...prev, result]);
    
    return result;
  };
  
  // Function to get assessment results
  const getAssessmentResults = (assessmentId: string): AssessmentResult | undefined => {
    return results.find(r => r.assessmentId === assessmentId);
  };
  
  return (
    <AssessmentContext.Provider 
      value={{ 
        assessments,
        results,
        createAssessment,
        startAssessment,
        submitAssessment,
        getAssessmentResults
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

// Custom hook to use the assessment context
export const useAssessment = () => useContext(AssessmentContext);

export default AssessmentContext;