'use client';

import dynamic from 'next/dynamic';

const AccessibilitySettingsPage = dynamic(
  () => import('./AccessibilitySettingsPageClient'),
  { ssr: false }
);

export default AccessibilitySettingsPage;