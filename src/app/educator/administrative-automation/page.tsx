'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Dynamically import the actual component with SSR disabled
const AdministrativeAutomationContent = dynamic(
  () => import('@/components/educator/administrative-automation-content'),
  { ssr: false }
);

export default function AdministrativeAutomationPage() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading administrative automation tools...</div>}>
      <AdministrativeAutomationContent />
    </Suspense>
  );
}
