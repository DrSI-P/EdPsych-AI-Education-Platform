'use client';

import dynamic from 'next/dynamic';

const CreateLearningPathPage = dynamic(
  () => import('./CreateLearningPathPageClient'),
  { ssr: false }
);

export default CreateLearningPathPage;