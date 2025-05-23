'use client';

import React from 'react';
import { VoiceInputProvider } from '@/providers/voice-input-provider';
import { AccessibilityGlobalStyles } from '@/components/ui/accessibility-global-styles';

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VoiceInputProvider>
      <AccessibilityGlobalStyles />
      {children}
    </VoiceInputProvider>
  );
}

export default RootLayoutWrapper;
