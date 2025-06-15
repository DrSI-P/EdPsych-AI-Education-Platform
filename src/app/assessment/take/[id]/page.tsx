'use client';

import dynamic from 'next/dynamic';

const AssessmentTakePage = dynamic(
  () => import('./AssessmentTakePageClient'),
  { ssr: false }
);

export default AssessmentTakePage;