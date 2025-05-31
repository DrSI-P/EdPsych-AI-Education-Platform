import React from 'react';
import { LearningPathAssessment } from '@/components/learning-path/LearningPathAssessment';

interface PathAssessmentPageProps {
  params: {
    id: string;
  };
}

export default function PathAssessmentPage({ params }: PathAssessmentPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Path Assessment</h1>
      
      <LearningPathAssessment 
        userId="current-user-id" 
        pathId={params.id}
      />
    </div>
  );
}
