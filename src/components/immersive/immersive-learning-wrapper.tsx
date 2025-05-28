'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Import the client component with SSR disabled
const ImmersiveLearningClient = dynamic(
  () => import('@/components/immersive/immersive-learning-client'),
  { ssr: false }
);

export default function ImmersiveLearningWrapper() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Immersive Learning Experiences...</div>}>
      <ImmersiveLearningClient />
    </Suspense>
  );
}