'use client';

import dynamic from 'next/dynamic';

const SubscriptionCancelPage = dynamic(
  () => import('./SubscriptionCancelPageClient'),
  { ssr: false }
);

export default SubscriptionCancelPage;