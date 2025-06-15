"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const AIAssessmentGeneratorWrapper = dynamic(
  () => import('@/components/assessment/ai-generate-wrapper'),
  { ssr: false }
);

function AIAssessmentGeneratorPage() {
  return <AIAssessmentGeneratorWrapper />;
}

export default AIAssessmentGeneratorPage;