'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Import the client component with SSR disabled
const ResourcesClient = dynamic(
  () => import('@/components/resources/resources-client'),
  { ssr: false }
);

export default function ResourcesWrapper() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Resource Library...</div>}>
      <ResourcesClient />
    </Suspense>
  );
}