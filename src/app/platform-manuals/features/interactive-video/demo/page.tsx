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
  title: 'Interactive Video Demo | EdPsych AI Platform',
  description: 'Experience the interactive video features of the EdPsych AI Platform in action.',
};

const InteractiveVideoDemoClient = nextDynamic(
  () => import('./interactive-video-demo-client')
);

function InteractiveVideoDemoPage() {
  return <InteractiveVideoDemoClient />;
}

export default InteractiveVideoDemoPage;
