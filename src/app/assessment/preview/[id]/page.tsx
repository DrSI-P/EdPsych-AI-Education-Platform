'use client';

import dynamic from 'next/dynamic';

const AssessmentPreviewPage = dynamic(
  () => import('./AssessmentPreviewPageClient'),
  { ssr: false }
);

export default AssessmentPreviewPage;