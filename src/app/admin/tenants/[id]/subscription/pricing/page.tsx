'use client';

import dynamic from 'next/dynamic';

const SubscriptionPricingPage = dynamic(
  () => import('./SubscriptionPricingPageClient'),
  { ssr: false }
);

export default SubscriptionPricingPage;