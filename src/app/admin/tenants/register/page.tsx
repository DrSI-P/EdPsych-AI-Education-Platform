'use client';

import dynamic from 'next/dynamic';

const TenantRegistrationPage = dynamic(
  () => import('./TenantRegistrationPageClient'),
  { ssr: false }
);

export default TenantRegistrationPage;