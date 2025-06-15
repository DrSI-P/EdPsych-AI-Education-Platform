'use client';

import dynamic from 'next/dynamic';

const RequestVerificationPage = dynamic(
  () => import('./RequestVerificationPageClient'),
  { ssr: false }
);

export default RequestVerificationPage;