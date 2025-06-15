'use client';

import dynamic from 'next/dynamic';

const ManualGradingPage = dynamic(
  () => import('./ManualGradingPageClient'),
  { ssr: false }
);

export default ManualGradingPage;