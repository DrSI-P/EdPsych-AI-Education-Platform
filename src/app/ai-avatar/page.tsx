"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const AIAvatarWrapper = dynamic(
  () => import('@/components/ai-avatar/ai-avatar-wrapper'),
  { ssr: false }
);

function AIAvatarPage() {
  return <AIAvatarWrapper />;
}

export default AIAvatarPage;