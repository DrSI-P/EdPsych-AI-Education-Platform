'use client';

import dynamic from 'next/dynamic';

const SubscriptionInvoicesPage = dynamic(
  () => import('./SubscriptionInvoicesPageClient'),
  { ssr: false }
);

export default SubscriptionInvoicesPage;