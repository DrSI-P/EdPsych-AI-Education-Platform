'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';
/**
 * Voice Input Test Page
 * 
 * This page provides a testing interface for the enhanced voice input system,
 * allowing developers to validate browser compatibility, accent recognition,
 * and age-appropriate command libraries.
 */

// Original component

const VoiceInputTest = dynamic(
  () => import('@/components/voice-input/enhanced/voice-input-test')
);

function VoiceInputTestPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice Input System Test</h1>
        <p className="text-gray-600 mb-8">
          Use this page to test and validate the enhanced voice input system, including
          browser compatibility, UK accent recognition, and age-appropriate commands.
        </p>
        
        <VoiceInputTest />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}


// Client-side wrapper to ensure providers are properly mounted
const VoiceInputTestPageWrapper = dynamic(
  () => Promise.resolve(VoiceInputTestPage),
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

export default VoiceInputTestPageWrapper;