"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const ImmersiveLearningWrapper = dynamic(
  () => import('@/components/immersive/immersive-learning-wrapper'),
  { ssr: false }
);

function ImmersiveLearningPage() {
  return <ImmersiveLearningWrapper />;
}

export default ImmersiveLearningPage;