'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HeyGenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function VideoViewPage() {
  const params = useParams();
  const videoId = params?.id ? params.id as string : undefined;
  const [video, setVideo] = useState<HeyGenVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!videoId) {
          setError('Video ID is missing');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const heygenService = HeyGenService.getInstance({
          apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo-key',
          baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com',
        });
        
        await heygenService.initialize();
        const videoData = await heygenService.getVideoStatus(videoId);
        
        if (videoData) {
          setVideo(videoData);
        } else {
          setError('Video not found');
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/ai-avatar-videos" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Video Library
          </Link>
        </div>
        
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        
        <Skeleton className="h-[480px] w-full rounded-lg mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/ai-avatar-videos" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Video Library
          </Link>
        </div>
        
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The requested video could not be found'}</p>
            <Button asChild>
              <Link href="/ai-avatar-videos">Return to Video Library</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Link href="/ai-avatar-videos" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Video Library
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
        {video.description && (
          <p className="text-muted-foreground mb-8">{video.description}</p>
        )}
        
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-8">
          {video.url ? (
            <video 
              src={video.url} 
              controls 
              className="w-full h-full"
              poster={video.thumbnailUrl}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Video is still processing</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Video Details</h2>
              <p className="text-sm text-muted-foreground mb-1">Status: {video.status}</p>
              <p className="text-sm text-muted-foreground mb-1">Created: {new Date(video.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">Updated: {new Date(video.updatedAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Share</h2>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Video
              </Button>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Download</h2>
              <Button variant="outline" className="w-full" disabled={!video.url}>
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Related Videos</h2>
          <p className="text-muted-foreground">Explore more AI avatar videos from our educational library.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for related videos - would be dynamically populated in production */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Related Video</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">Educational Psychology Foundations</h3>
              <p className="text-sm text-muted-foreground mt-1">Learn about the core principles</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Related Video</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">Adaptive Learning Systems</h3>
              <p className="text-sm text-muted-foreground mt-1">Personalized education approaches</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Related Video</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">Voice Input Accessibility</h3>
              <p className="text-sm text-muted-foreground mt-1">Making education accessible</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
