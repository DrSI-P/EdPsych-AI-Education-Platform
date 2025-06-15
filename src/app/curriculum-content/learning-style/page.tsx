'use client';

import dynamic from 'next/dynamic';

import React from 'react';
// Dynamic import for LearningStyleAdaptation to prevent router issues
/**
 * Learning Style Adaptation Page
 * 
 * Renders the learning style adaptation component as a standalone page
 */

// Original component
const LearningStyleAdaptation = dynamic(
  () => import('@/components/curriculum-content/learning-style/LearningStyleAdaptation').then(mod => ({ default: mod.LearningStyleAdaptation }))
);

function LearningStyleAdaptationPage() {
  return <LearningStyleAdaptation />;
}


export default LearningStyleAdaptationPage;