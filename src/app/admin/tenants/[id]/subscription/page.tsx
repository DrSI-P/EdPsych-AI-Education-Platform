'use client';

import dynamic from 'next/dynamic';

const SubscriptionManagementPage = dynamic(
  () => import('./SubscriptionManagementPageClient'),
  { ssr: false }
);

export default SubscriptionManagementPage;