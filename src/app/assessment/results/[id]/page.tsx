'use client';

import dynamic from 'next/dynamic';

const AssessmentResultsPage = dynamic(
  () => import('./AssessmentResultsPageClient'),
  { ssr: false }
);

export default AssessmentResultsPage;