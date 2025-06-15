// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";

import React from 'react';
import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Guided Restorative Conversation Frameworks | EdPsych Connect',
  description: 'Evidence-based frameworks for conducting restorative conversations based on restorative justice principles.',
};

const ClientWrapper = nextDynamic(() => import('@/components/restorative-justice/client-wrapper'));

function GuidedRestorativeConversationFrameworksPage() {
  return <ClientWrapper />;
}

export default GuidedRestorativeConversationFrameworksPage;
