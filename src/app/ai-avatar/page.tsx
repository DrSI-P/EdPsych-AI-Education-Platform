'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/enhanced-theme-provider';
import AvatarCreator from '@/components/ai-avatar/avatar-creator';
import VideoGenerator from '@/components/ai-avatar/video-generator';
import PageHeader from '@/components/ui/PageHeader';

/**
 * AI Avatar Video Creation Page
 * 
 * This page provides a user interface for creating AI avatars and generating
 * educational videos using those avatars.
 */
export default function AIAvatarPage() {
  const { ageGroup } = useTheme();
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  // Handle avatar creation
  const handleAvatarCreated = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
  };
  
  // Handle video generation
  const handleVideoGenerated = (videoUrl: string) => {
    setGeneratedVideoUrl(videoUrl);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="AI Avatar Video Creation" 
        description="Create educational videos featuring AI avatars for demonstrations and training"
      />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Step 1: Create Your Avatar</h2>
          <p className="text-grey-600 mb-6">
            Create an AI avatar that will represent you in educational videos. 
            You can customise the appearance, voice, and presentation style.
          </p>
          
          <AvatarCreator 
            onAvatarCreated={handleAvatarCreated}
            defaultAgeGroup={ageGroup}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Step 2: Generate Video</h2>
          <p className="text-grey-600 mb-6">
            Once you've created an avatar, you can generate educational videos by providing a script.
            The AI will bring your avatar to life, speaking your script with natural expressions and gestures.
          </p>
          
          {selectedAvatarId ? (
            <VideoGenerator 
              avatarProfileId={selectedAvatarId}
              onVideoGenerated={handleVideoGenerated}
            />
          ) : (
            <div className="bg-grey-50 border border-grey-200 rounded-lg p-6 text-centre">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-grey-900">Create an avatar first</h3>
              <p className="mt-2 text-sm text-grey-500">
                Please complete Step 1 to create an avatar before generating videos.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {generatedVideoUrl && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Generated Video</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video 
              src={generatedVideoUrl} 
              controls 
              className="w-full h-full"
              poster="/images/video-placeholder.jpg"
            />
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <a 
              href={generatedVideoUrl} 
              download 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Download Video
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(generatedVideoUrl);
                alert('Video URL copied to clipboard!');
              }}
              className="px-4 py-2 bg-grey-200 text-grey-800 rounded-md hover:bg-grey-300 transition-colors"
            >
              Copy Video URL
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">About AI Avatar Videos</h2>
        <div className="prose prose-blue max-w-none">
          <p>
            AI Avatar videos are a powerful tool for creating educational content without the need for traditional video production. 
            They're perfect for:
          </p>
          <ul>
            <li>Creating demonstrations of platform features</li>
            <li>Developing training materials for educators</li>
            <li>Producing instructional content for students</li>
            <li>Generating welcome messages and introductions</li>
            <li>Creating accessible content with consistent delivery</li>
          </ul>
          <p>
            All videos are generated using advanced AI technology that creates realistic speaking avatars from text scripts.
            The system supports multiple languages, accents, and presentation styles to suit different educational contexts.
          </p>
          <p>
            <strong>Note:</strong> This feature is currently in beta. Video generation may take several minutes depending on script length and server load.
          </p>
        </div>
      </div>
    </div>
  );
}
