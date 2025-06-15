'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { LearningPathAssessment } from '@/components/learning-path/LearningPathAssessment';

// This prevents Next.js from trying to statically generate this page

const AvatarVideo = dynamic(
  () => import('@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo')
);

function LearningPathAssessmentPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Learning Assessment</h1>
      
      <AvatarVideo 
        title="Learning Assessment"
        description="Assessments help us understand your current knowledge and skills, so we can personalize your learning path to meet your specific needs."
      />
      
      <LearningPathAssessment userId="current-user-id" />
    </div>
  );
}

export default LearningPathAssessmentPage;