'use client';

import dynamic from 'next/dynamic';

const PupilVoiceResultsPage = dynamic(
  () => import('./PupilVoiceResultsPageClient'),
  { ssr: false }
);

export default PupilVoiceResultsPage;