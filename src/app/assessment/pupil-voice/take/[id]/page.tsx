'use client';

import dynamic from 'next/dynamic';

const TakePupilVoiceSurveyPage = dynamic(
  () => import('./TakePupilVoiceSurveyPageClient'),
  { ssr: false }
);

export default TakePupilVoiceSurveyPage;