'use client';

import React from 'react';
import dynamic from 'next/dynamic';

/**
 * Voice Input Integration Page
 *
 * This page provides access to the comprehensive voice input integration features
 * of the EdPsych-AI-Education-Platform, including cross-platform integration settings
 * and special educational needs support.
 */

// Use dynamic imports to prevent SSR issues
const VoiceInputProvider = dynamic(
  () => import('@/providers/voice-input-provider').then(mod => ({ default: mod.VoiceInputProvider })),
  { ssr: false }
);

const VoiceInputIntegrationManager = dynamic(
  () => import('@/components/voice-input/VoiceInputIntegrationManager').then(mod => ({ default: mod.VoiceInputIntegrationManager })),
  { ssr: false }
);

const VoiceInputPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Voice Input Integration</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive voice input capabilities across the platform with special educational needs support
      </p>
      
      <VoiceInputProvider>
        <VoiceInputIntegrationManager />
      </VoiceInputProvider>
    </div>
  );
};

export default VoiceInputPage;