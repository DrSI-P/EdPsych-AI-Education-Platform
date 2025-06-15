"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const ExpansionWrapper = dynamic(
  () => import('@/components/student-voice/expansion/expansion-wrapper'),
  { ssr: false }
);

function StudentVoiceExpansionPage() {
  return <ExpansionWrapper />;
}

export default StudentVoiceExpansionPage;