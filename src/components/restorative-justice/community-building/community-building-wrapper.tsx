'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Import the client component with SSR disabled
const CommunityBuildingActivities = dynamic(
  () => import('@/components/restorative-justice/community-building/community-building-activities'),
  { ssr: false }
);

export default function CommunityBuildingWrapper() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Community Building Activities...</div>}>
      <CommunityBuildingActivities />
    </Suspense>
  );
}