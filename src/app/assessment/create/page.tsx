'use client';

import dynamic from 'next/dynamic';

const CreateAssessmentPage = dynamic(
  () => import('./CreateAssessmentPageClient'),
  { ssr: false }
);

export default CreateAssessmentPage;