'use client';

import dynamic from 'next/dynamic';

const PupilVoicePage = dynamic(
  () => import('./PupilVoicePageClient'),
  { ssr: false }
);

export default PupilVoicePage;