'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';
/**
 * Voice-to-Text Test Page
 * 
 * This page provides a testing interface for the voice-to-text functionality,
 * allowing developers to validate dictation capabilities across different key stages.
 */

// Original component

const VoiceToTextTest = dynamic(
  () => import('@/components/voice-input/enhanced/voice-to-text-test')
);

function VoiceToTextTestPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice-to-Text System Test</h1>
        <p className="text-gray-600 mb-8">
          Use this page to test and validate the voice-to-text functionality, including
          dictation, punctuation commands, and age-appropriate vocabulary recognition.
        </p>
        
        <VoiceToTextTest />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}


// Client-side wrapper to ensure providers are properly mounted
const VoiceToTextTestPageWrapper = dynamic(
  () => Promise.resolve(VoiceToTextTestPage),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voice features...</p>
        </div>
      </div>
    )
  }
);

export default VoiceToTextTestPageWrapper;