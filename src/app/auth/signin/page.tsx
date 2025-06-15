'use client';

import dynamicImport from 'next/dynamic';

const SignInPage = dynamicImport(
  () => import('./SignInPageClient'),
  { ssr: false }
);

export default SignInPage;

// Force dynamic rendering
export const dynamic = 'force-dynamic';