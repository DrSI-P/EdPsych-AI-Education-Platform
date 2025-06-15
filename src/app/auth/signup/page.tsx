'use client';

import dynamic from 'next/dynamic';

const SignUpForm = dynamic(
  () => import('./SignUpFormClient'),
  { ssr: false }
);

export default SignUpForm;