"use client";

import React from 'react';

/**
 * HeyGenVideoLibrary component
 * This component provides an interface for browsing and managing HeyGen AI avatar videos
 */
export const HeyGenVideoLibrary = ({ 
  className = ''
}) => {
  const [videos, setVideos] = React.useState([
    { id: 'video-1', title: 'Introduction to Fractions', date: '2025-05-15', duration: '2:45' },
    { id: 'video-2', title: 'Understanding Photosynthesis', date: '2025-05-18', duration: '3:12' },
    { id: 'video-3', title: 'World War II Overview', date: '2025-05-20', duration: '4:30' },
  ]);
  
  return (
    <div className={`heygen-video-library ${className}`}>
      <h2 className="text-xl font-bold mb-4">AI Avatar Video Library</h2>
      
      <div className="grid gap-4">
        {videos.map(video => (
          <div key={video.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{video.title}</h3>
              <p className="text-sm text-gray-500">Created: {video.date} • Duration: {video.duration}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">View</button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
      
      {videos.length === 0 && (
        <p className="text-center py-8 text-gray-500">No videos found. Create your first AI avatar video.</p>
      )}
    </div>
  );
};



export default HeyGenVideoLibrary;