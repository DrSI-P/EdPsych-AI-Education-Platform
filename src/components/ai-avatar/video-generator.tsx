"use client";

import React from 'react';

/**
 * VideoGenerator component
 * This component provides an interface for generating AI videos
 */
export const VideoGenerator = ({ 
  onVideoGenerated,
  className = ''
}) => {
  const [generating, setGenerating] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [script, setScript] = React.useState('');
  const [avatar, setAvatar] = React.useState('default');
  const [duration, setDuration] = React.useState('short');
  
  const handleGenerate = async () => {
    if (!title || !script) return;
    
    setGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setGenerating(false);
      if (onVideoGenerated) {
        onVideoGenerated({
          id: `video-${Date.now()}`,
          title,
          url: 'https://example.com/videos/sample.mp4',
          thumbnailUrl: 'https://example.com/thumbnails/sample.jpg',
          duration: duration === 'short' ? 60 : (duration === 'medium' ? 120 : 300),
          avatar,
          script
        });
      }
    }, 3000);
  };
  
  return (
    <div className={`video-generator ${className}`}>
      <h2 className="text-xl font-bold mb-4">Generate AI Video</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter video title"
        />
      </div>
      
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
        <label className="block text-sm font-medium mb-1">Duration</label>
        <select 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="short">Short (1 minute)</option>
          <option value="medium">Medium (2 minutes)</option>
          <option value="long">Long (5 minutes)</option>
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
        disabled={generating || !title || !script}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {generating ? 'Generating...' : 'Generate Video'}
      </button>
    </div>
  );
};


