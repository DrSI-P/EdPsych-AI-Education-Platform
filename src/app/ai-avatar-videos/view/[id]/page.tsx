'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HeyGenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

/**
 * AI Avatar Video View Page
 * 
 * This page displays a single AI avatar video with playback controls
 * and related information.
 */
export default function VideoViewPage() {
  const params = useParams();
  const videoId = params?.id as string;
  
  const [video, setVideo] = useState<HeyGenVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize HeyGen service
  const heygenService = HeyGenService.getInstance({
    apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo-api-key',
    baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
  });
  
  // Sample video data for demonstration
  const sampleVideos: Record<string, HeyGenVideo> = {
    'video_1': {
      id: 'video_1',
      status: 'completed',
      url: '/sample-videos/executive-summary.mp4',
      thumbnailUrl: '/sample-videos/executive-summary-thumb.jpg',
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-05-15'),
      title: 'Executive Summary',
      category: 'Core Platform',
      description: 'A concise overview of EdPsych Connect, its mission, and core value proposition for all stakeholders.'
    },
    'video_2': {
      id: 'video_2',
      status: 'completed',
      url: '/sample-videos/platform-features.mp4',
      thumbnailUrl: '/sample-videos/platform-features-thumb.jpg',
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-05-15'),
      title: 'Platform Features Overview',
      category: 'Core Platform',
      description: 'A detailed walkthrough of all major platform components and what makes them unique.'
    },
    // Add more sample videos as needed
  };
  
  useEffect(() => {
    // Initialize HeyGen service and fetch video
    const fetchVideo = async () => {
      if (!videoId) {
        setError('Video ID not provided');
        setLoading(false);
        return;
      }
      
      try {
        await heygenService.initialize();
        
        // In a production environment, we would fetch the video from HeyGen
        // For now, we'll use our sample data
        const videoData = sampleVideos[videoId] || await heygenService.getVideoStatus(videoId);
        
        if (!videoData) {
          setError('Video not found');
        } else {
          setVideo(videoData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch video:', error);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [videoId]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/ai-avatar-videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Link>
          </Button>
        </div>
        
        <Card>
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/ai-avatar-videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Failed to load video'}</p>
            <Button asChild>
              <Link href="/ai-avatar-videos">
                Return to Video Library
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/ai-avatar-videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>
      
      <Card>
        <div className="aspect-video bg-black">
          <video 
            src={video.url} 
            controls 
            className="w-full h-full"
            poster={video.thumbnailUrl}
            autoPlay
          />
        </div>
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-2">{video.title || 'Untitled Video'}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {video.category} • {video.createdAt?.toLocaleDateString()}
          </p>
          
          <p className="text-gray-700 mb-6">
            {video.description || 'No description available.'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(sampleVideos)
            .filter(v => v.id !== video.id && v.category === video.category)
            .slice(0, 4)
            .map(relatedVideo => (
              <Card key={relatedVideo.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {relatedVideo.thumbnailUrl ? (
                    <img 
                      src={relatedVideo.thumbnailUrl} 
                      alt={relatedVideo.title || 'Video thumbnail'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/ai-avatar-videos/view/${relatedVideo.id}`}>
                        Watch
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{relatedVideo.title}</h3>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
