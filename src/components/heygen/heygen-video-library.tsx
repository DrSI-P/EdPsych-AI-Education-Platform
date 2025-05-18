'use client';

import React, { useState, useEffect } from 'react';
import { HeyGenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Video } from 'lucide-react';
import Link from 'next/link';

/**
 * AI Avatar Video Library Component
 * 
 * This component displays all generated AI avatar videos and provides
 * search and filtering capabilities.
 */
export const HeyGenVideoLibrary: React.FC = () => {
  const [videos, setVideos] = useState<HeyGenVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<HeyGenVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Initialize HeyGen service
  const heygenService = HeyGenService.getInstance({
    apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo-api-key',
    baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
  });
  
  // Sample video data for demonstration
  const sampleVideos: HeyGenVideo[] = [
    {
      id: 'video_1',
      status: 'completed',
      url: '/sample-videos/executive-summary.mp4',
      thumbnailUrl: '/sample-videos/executive-summary-thumb.jpg',
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-05-15'),
      title: 'Executive Summary',
      category: 'Core Platform'
    },
    {
      id: 'video_2',
      status: 'completed',
      url: '/sample-videos/platform-features.mp4',
      thumbnailUrl: '/sample-videos/platform-features-thumb.jpg',
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-05-15'),
      title: 'Platform Features Overview',
      category: 'Core Platform'
    },
    {
      id: 'video_3',
      status: 'completed',
      url: '/sample-videos/educator-onboarding.mp4',
      thumbnailUrl: '/sample-videos/educator-onboarding-thumb.jpg',
      createdAt: new Date('2025-05-16'),
      updatedAt: new Date('2025-05-16'),
      title: 'Educator Onboarding',
      category: 'User Onboarding'
    },
    {
      id: 'video_4',
      status: 'completed',
      url: '/sample-videos/parent-onboarding.mp4',
      thumbnailUrl: '/sample-videos/parent-onboarding-thumb.jpg',
      createdAt: new Date('2025-05-16'),
      updatedAt: new Date('2025-05-16'),
      title: 'Parent Onboarding',
      category: 'User Onboarding'
    },
    {
      id: 'video_5',
      status: 'completed',
      url: '/sample-videos/student-ks2.mp4',
      thumbnailUrl: '/sample-videos/student-ks2-thumb.jpg',
      createdAt: new Date('2025-05-17'),
      updatedAt: new Date('2025-05-17'),
      title: 'Student Onboarding (Key Stage 2)',
      category: 'User Onboarding'
    },
    {
      id: 'video_6',
      status: 'completed',
      url: '/sample-videos/adaptive-complexity.mp4',
      thumbnailUrl: '/sample-videos/adaptive-complexity-thumb.jpg',
      createdAt: new Date('2025-05-17'),
      updatedAt: new Date('2025-05-17'),
      title: 'Adaptive Complexity System',
      category: 'Feature Demonstration'
    },
    {
      id: 'video_7',
      status: 'completed',
      url: '/sample-videos/voice-input.mp4',
      thumbnailUrl: '/sample-videos/voice-input-thumb.jpg',
      createdAt: new Date('2025-05-18'),
      updatedAt: new Date('2025-05-18'),
      title: 'Voice Input and Accessibility',
      category: 'Feature Demonstration'
    },
    {
      id: 'video_8',
      status: 'completed',
      url: '/sample-videos/immersive-learning.mp4',
      thumbnailUrl: '/sample-videos/immersive-learning-thumb.jpg',
      createdAt: new Date('2025-05-18'),
      updatedAt: new Date('2025-05-18'),
      title: 'Immersive Learning Environments',
      category: 'Feature Demonstration'
    }
  ];
  
  useEffect(() => {
    // Initialize HeyGen service and fetch videos
    const initService = async () => {
      try {
        await heygenService.initialize();
        
        // In a production environment, we would fetch videos from HeyGen
        // For now, we'll use our sample data
        setVideos(sampleVideos);
        setFilteredVideos(sampleVideos);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize HeyGen service:', error);
        // Still use sample data in case of error
        setVideos(sampleVideos);
        setFilteredVideos(sampleVideos);
        setLoading(false);
      }
    };
    
    initService();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredVideos(videos);
      return;
    }
    
    const filtered = videos.filter(video => 
      video.title?.toLowerCase().includes(query) || 
      video.category?.toLowerCase().includes(query)
    );
    
    setFilteredVideos(filtered);
  };
  
  // Group videos by category
  const videosByCategory = filteredVideos.reduce((acc, video) => {
    const category = video.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {} as Record<string, HeyGenVideo[]>);
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <Button asChild>
          <Link href="/ai-avatar-videos/generate">
            <Video className="mr-2 h-4 w-4" />
            Generate New Video
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No videos found matching your search.</p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(videosByCategory).map(([category, categoryVideos]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryVideos.map(video => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title || 'Video thumbnail'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="text-gray-400" size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button asChild variant="secondary">
                          <Link href={`/ai-avatar-videos/view/${video.id}`}>
                            Watch Video
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{video.title || 'Untitled Video'}</h3>
                      <p className="text-sm text-gray-500">
                        {video.createdAt?.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeyGenVideoLibrary;
