'use client';

import dynamic from 'next/dynamic';

const RequestResetPage = dynamic(
  () => import('./RequestResetPageClient'),
  { ssr: false }
);

export default RequestResetPage;