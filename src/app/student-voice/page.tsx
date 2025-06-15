"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const StudentVoiceWrapper = dynamic(
  () => import('@/components/student-voice/student-voice-wrapper'),
  { ssr: false }
);

function StudentVoicePage() {
  return <StudentVoiceWrapper />;
}

export default StudentVoicePage;