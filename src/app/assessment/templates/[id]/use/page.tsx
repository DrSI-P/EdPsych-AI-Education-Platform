'use client';

import dynamic from 'next/dynamic';

const UseAssessmentTemplatePage = dynamic(
  () => import('./UseAssessmentTemplatePageClient'),
  { ssr: false }
);

export default UseAssessmentTemplatePage;