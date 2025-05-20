/**
 * Types for assessment-related features
 */

export interface PupilVoiceSurvey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed';
  questionCount: number;
  responseCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PupilVoiceSurveyQuestion {
  id: string;
  text: string;
  type: string;
  required: boolean;
  options?: any;
  order: number;
}

export interface PupilVoiceSurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: PupilVoiceSurveyAnswer[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PupilVoiceSurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  content: any;
  createdAt: string | Date;
  updatedAt: string | Date;
}