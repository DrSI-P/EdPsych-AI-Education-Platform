'use client';

import dynamic from 'next/dynamic';

const CreateResource = dynamic(
  () => import('./CreateResourceClient'),
  { ssr: false }
);

export default CreateResource;