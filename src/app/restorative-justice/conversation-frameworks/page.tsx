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
  description: 'Evidence-based frameworks for facilitating restorative conversations and conferences in educational settings.',
};

const ClientPage = nextDynamic(
  () => import('@/components/restorative-justice/conversation-frameworks-client')
);

function RestorativeConversationFrameworksPage() {
  return <ClientPage />;
}

export default RestorativeConversationFrameworksPage;
