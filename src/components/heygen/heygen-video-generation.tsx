"use client";

import React from 'react';

/**
 * HeyGenVideoGeneration component
 * This component provides an interface for generating HeyGen AI avatar videos
 */
export const HeyGenVideoGeneration = ({ 
  onVideoGenerated,
  className = ''
}) => {
  const [generating, setGenerating] = React.useState(false);
  const [script, setScript] = React.useState('');
  const [avatar, setAvatar] = React.useState('default');
  
  const handleGenerate = async () => {
    if (!script) return;
    
    setGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setGenerating(false);
      if (onVideoGenerated) {
        onVideoGenerated({
          id: `video-${Date.now()}`,
          url: 'https://example.com/sample-video.mp4',
          avatar,
          script
        });
      }
    }, 2000);
  };
  
  return (
    <div className={`heygen-video-generation ${className}`}>
      <h2 className="text-xl font-bold mb-4">Generate AI Avatar Video</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Avatar</label>
        <select 
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="default">Default Educator</option>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="casual">Casual</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="Enter your video script here..."
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={generating || !script}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {generating ? 'Generating...' : 'Generate Video'}
      </button>
    </div>
  );
};


