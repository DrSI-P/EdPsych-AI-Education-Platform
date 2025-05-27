'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the actual component with SSR disabled
const AdministrativeAutomationContent = dynamic(
  () => import('@/components/educator/administrative-automation-content'),
  { ssr: false }
);

export default function AdministrativeAutomationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading administrative automation tools...</div>}>
      <AdministrativeAutomationContent />
    </Suspense>
  );
}
