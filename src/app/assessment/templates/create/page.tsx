'use client';

import dynamic from 'next/dynamic';

const CreateAssessmentTemplatePage = dynamic(
  () => import('./CreateAssessmentTemplatePageClient'),
  { ssr: false }
);

export default CreateAssessmentTemplatePage;