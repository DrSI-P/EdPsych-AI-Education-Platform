'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';
/**
 * Content Creation Page with Voice Input
 * 
 * This page demonstrates the integration of voice-to-text functionality
 * in content creation areas of the platform.
 */

// Original component

const ContentCreationVoiceInput = dynamic(
  () => import('@/components/content/content-creation-voice-input')
);

function ContentCreationPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Content Creation</h1>
        <p className="text-gray-600 mb-8">
          Create various types of content using voice dictation. This feature helps students who
          struggle with typing to express their ideas more easily.
        </p>
        
        <ContentCreationVoiceInput />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}


// Client-side wrapper to ensure providers are properly mounted
const ContentCreationPageWrapper = dynamic(
  () => Promise.resolve(ContentCreationPage),
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

export default ContentCreationPageWrapper;