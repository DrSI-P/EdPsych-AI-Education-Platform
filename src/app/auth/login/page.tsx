'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(
  () => import('./LoginPageClient'),
  { ssr: false }
);

export default LoginPage;