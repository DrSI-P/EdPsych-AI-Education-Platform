'use client';

import dynamic from 'next/dynamic';

const AssessmentTemplatesPage = dynamic(
  () => import('./AssessmentTemplatesPageClient'),
  { ssr: false }
);

export default AssessmentTemplatesPage;