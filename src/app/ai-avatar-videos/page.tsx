'use client';

import React from 'react';
import { HeyGenVideoLibrary } from '@/components/heygen/heygen-video-library';

/**
 * AI Avatar Videos Page
 * 
 * This page displays the library of AI avatar videos and provides
 * navigation to the video generation page.
 */
export default function AiAvatarVideosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">AI Avatar Video Library</h1>
      <p className="text-gray-600 mb-8">
        Browse and watch educational videos featuring Dr. Scott's AI avatar.
      </p>
      
      <HeyGenVideoLibrary />
    </div>
  );
}
