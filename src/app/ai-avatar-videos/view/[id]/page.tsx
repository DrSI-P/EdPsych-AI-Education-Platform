'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeyGenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { Loader2, Download, ArrowLeft } from 'lucide-react';

const VideoViewPage = () => {
  const params = useParams();
  const videoId = params?.id as string || '';
  
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<HeyGenVideo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      
      try {
        const heygenService = HeyGenService.getInstance({
          apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo_key',
          baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
        });
        
        await heygenService.initialize();
        const fetchedVideo = await heygenService.getVideoStatus(videoId);
        setVideo(fetchedVideo);
      } catch (error) {
        console.error('Failed to fetch video:', error);
        setError('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [videoId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" className="mb-6" asChild>
        <a href="/ai-avatar-videos">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Video Library
        </a>
      </Button>
      
      {loading ? (
        <div className="flex justify-centre items-centre h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading video...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : !video ? (
        <div className="text-centre p-8 border border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">Video not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested video could not be found.
          </p>
          <Button asChild>
            <a href="/ai-avatar-videos">Return to Video Library</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {video.status === 'completed' && video.url ? (
                <video 
                  src={video.url} 
                  controls 
                  poster={video.thumbnailUrl} 
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-centre justify-centre">
                  {video.status === 'pending' || video.status === 'processing' ? (
                    <div className="text-centre">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p>Video is still processing...</p>
                    </div>
                  ) : (
                    <p className="text-destructive">Video generation failed</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
                <CardDescription>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    video.status === 'completed' ? 'bg-green-100 text-green-800' :
                    video.status === 'processing' || video.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {video.description || 'No description provided'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(video.createdAt)}
                  </p>
                </div>
                
                {video.updatedAt && (
                  <div>
                    <h3 className="text-sm font-medium">Last Updated</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(video.updatedAt)}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={video.status !== 'completed' || !video.url}
                  asChild
                >
                  <a href={video.url} download={video.title}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoViewPage;
