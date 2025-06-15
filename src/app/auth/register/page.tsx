'use client';

import dynamic from 'next/dynamic';

const RegisterPage = dynamic(
  () => import('./RegisterPageClient'),
  { ssr: false }
);

export default RegisterPage;