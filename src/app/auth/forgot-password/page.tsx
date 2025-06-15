'use client';

import dynamic from 'next/dynamic';

const ForgotPasswordForm = dynamic(
  () => import('./ForgotPasswordFormClient'),
  { ssr: false }
);

export default ForgotPasswordForm;