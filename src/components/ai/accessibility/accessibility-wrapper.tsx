"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const AccessibilityClient = dynamic(
  () => import('@/components/ai/accessibility/accessibility-client'),
  { ssr: false }
);

export default function AccessibilityWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Accessibility Settings...</div>}>
      <AccessibilityClient />
    </Suspense>
  );
}