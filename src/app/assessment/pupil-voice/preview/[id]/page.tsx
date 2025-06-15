'use client';

import dynamic from 'next/dynamic';

const PreviewPupilVoiceSurveyPage = dynamic(
  () => import('./PreviewPupilVoiceSurveyPageClient'),
  { ssr: false }
);

export default PreviewPupilVoiceSurveyPage;