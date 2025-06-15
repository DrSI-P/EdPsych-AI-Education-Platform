'use client';

import dynamic from 'next/dynamic';

const CurriculumAlignmentPage = dynamic(
  () => import('./CurriculumAlignmentPageClient'),
  { ssr: false }
);

export default CurriculumAlignmentPage;