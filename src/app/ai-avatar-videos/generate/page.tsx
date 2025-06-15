'use client';

import dynamic from 'next/dynamic';

import React from 'react';

const HeyGenVideoGeneration = dynamic(
  () => import('@/components/heygen/heygen-video-generation')
);

const GenerateAIAvatarVideoPage = (): void => {
  return (
    <div className="min-h-screen bg-background">
      <HeyGenVideoGeneration />
    </div>
  );
};



export default GenerateAIAvatarVideoPage;
