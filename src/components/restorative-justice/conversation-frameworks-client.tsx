'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Dynamically import the actual component with SSR disabled
const ConversationFrameworksContent = dynamic(
  () => import('@/components/restorative-justice/conversation-frameworks-content'),
  { ssr: false }
);

export default function ClientPage() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Loading conversation frameworks...</div>}>
      <ConversationFrameworksContent />
    </Suspense>
  );
}