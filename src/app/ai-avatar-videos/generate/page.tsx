'use client';

import React from 'react';
import { HeyGenAvatarCreation } from '@/components/heygen/heygen-avatar-creation';
import { HeyGenVideoGeneration } from '@/components/heygen/heygen-video-generation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * AI Avatar Video Generation Page
 * 
 * This page provides a user interface for creating custom AI avatars
 * and generating educational videos using HeyGen's AI video generation platform.
 */
export default function AiAvatarGeneratePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">AI Avatar Video Generation</h1>
      <p className="text-gray-600 mb-8">
        Create custom AI avatar videos for educational content using your face and voice.
      </p>
      
      <Tabs defaultValue="avatar" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="avatar">Create Avatar</TabsTrigger>
          <TabsTrigger value="video">Generate Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="avatar">
          <HeyGenAvatarCreation />
        </TabsContent>
        
        <TabsContent value="video">
          <HeyGenVideoGeneration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
