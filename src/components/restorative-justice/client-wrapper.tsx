'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Import the client component with SSR disabled
const RestorativeJusticeClient = dynamic(
  () => import('@/components/restorative-justice/restorative-justice-client'),
  { ssr: false }
);

export default function ClientWrapper() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Loading restorative justice frameworks...</div>}>
      <RestorativeJusticeClient />
    </Suspense>
  );
}