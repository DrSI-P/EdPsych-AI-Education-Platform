'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeyGenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Download, ExternalLink } from 'lucide-react';

const HeyGenVideoLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<HeyGenVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const heygenService = HeyGenService.getInstance({
          apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo_key',
          baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
        });
        
        await heygenService.initialize();
        const fetchedVideos = await heygenService.getAllVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  const getFilteredVideos = () => {
    switch (activeTab) {
      case 'completed':
        return videos.filter(video => video.status === 'completed');
      case 'processing':
        return videos.filter(video => video.status === 'pending' || video.status === 'processing');
      case 'failed':
        return videos.filter(video => video.status === 'failed');
      default:
        return videos;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Avatar Video Library</h1>
        <Button asChild>
          <a href="/ai-avatar-videos/generate">Create New Video</a>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading videos...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : getFilteredVideos().length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === 'all' 
              ? "You haven't created any AI avatar videos yet." 
              : `No ${activeTab} videos found.`}
          </p>
          <Button asChild>
            <a href="/ai-avatar-videos/generate">Create Your First Video</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredVideos().map(video => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                    {video.status === 'pending' || video.status === 'processing' ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <span className="text-muted-foreground">No preview available</span>
                    )}
                  </div>
                )}
                {video.status === 'completed' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Button asChild variant="secondary" size="icon">
                      <a href={`/ai-avatar-videos/view/${video.id}`}>
                        <Play className="h-6 w-6" />
                      </a>
                    </Button>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    video.status === 'completed' ? 'bg-green-100 text-green-800' :
                    video.status === 'processing' || video.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                <CardDescription>
                  Created: {formatDate(video.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description || 'No description provided'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={video.status !== 'completed'}
                  asChild
                >
                  <a href={video.url} download={video.title}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={video.status !== 'completed'}
                  asChild
                >
                  <a href={`/ai-avatar-videos/view/${video.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeyGenVideoLibrary;
