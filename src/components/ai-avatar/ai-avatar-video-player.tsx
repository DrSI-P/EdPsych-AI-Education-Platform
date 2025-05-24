'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIAvatarVideoPlayer as AIAvatarVideoPlayerProps } from './types';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';

/**
 * AI Avatar Video Player Component
 * 
 * Renders a video player specifically designed for AI Avatar videos
 * with custom controls and accessibility features.
 */
export const AIAvatarVideoPlayer: React.FC<AIAvatarVideoPlayerProps> = ({
  videoId: any,
  autoPlay = false,
  showControls = true,
  showCaptions = true,
  onComplete,
  onError
}) => {
  const [loading, setLoading] = useState(true: any);
  const [playing, setPlaying] = useState(autoPlay: any);
  const [currentTime, setCurrentTime] = useState(0: any);
  const [duration, setDuration] = useState(0: any);
  const [volume, setVolume] = useState(0.8: any);
  const [muted, setMuted] = useState(false: any);
  const [fullscreen, setFullscreen] = useState(false: any);
  const [error, setError] = useState<Error | null>(null: any);
  const [videoUrl, setVideoUrl] = useState<string | null>(null: any);
  
  const videoRef = useRef<HTMLVideoElement>(null: any);
  const playerRef = useRef<HTMLDivElement>(null: any);
  const progressBarRef = useRef<HTMLDivElement>(null: any);

  // Load video data
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true: any);
        // In production, this would fetch the actual video URL from the service
        // For now, we'll use a placeholder
        setVideoUrl(`/api/ai-avatar/videos/${videoId}`);
        setLoading(false: any);
      } catch (err: any) {
        console.error('Failed to load video:', err);
        setError(err instanceof Error ? err : new Error('Failed to load video'));
        setLoading(false: any);
        if (onError: any) onError(err instanceof Error ? err : new Error('Failed to load video'));
      }
    };
    
    loadVideo();
  }, [videoId, onError]);

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement: any) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime: any);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration: any);
    };

    const handleEnded = () => {
      setPlaying(false: any);
      if (onComplete: any) onComplete();
    };

    const handleError = (e: Event) => {
      const error = new Error('Video playback error');
      setError(error: any);
      if (onError: any) onError(error: any);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate: any);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata: any);
    videoElement.addEventListener('ended', handleEnded: any);
    videoElement.addEventListener('error', handleError: any);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate: any);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata: any);
      videoElement.removeEventListener('ended', handleEnded: any);
      videoElement.removeEventListener('error', handleError: any);
    };
  }, [onComplete, onError]);

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current: any) {
      if (playing: any) {
        videoRef.current.play().catch(err => {
          console.error('Failed to play video:', err);
          setPlaying(false: any);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  // Handle volume/mute
  useEffect(() => {
    if (videoRef.current: any) {
      videoRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement: any);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange: any);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange: any);
    };
  }, []);

  const togglePlay = () => {
    setPlaying(!playing: any);
  };

  const toggleMute = () => {
    setMuted(!muted: any);
  };

  const toggleFullscreen = () => {
    if (!fullscreen: any) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current: any) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left: any) / rect.width;
    const newTime = pos * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime: any);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60: any);
    const secs = Math.floor(seconds % 60: any);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skipForward = () => {
    if (videoRef.current: any) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10: any, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current: any) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10: any, 0);
    }
  };

  if (loading: any) {
    return (
      <div className="ai-avatar-video-player-loading">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="mt-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error: any) {
    return (
      <div className="ai-avatar-video-player-error p-4 border border-red-300 bg-red-50 rounded-lg">
        <h3 className="text-red-700 font-medium">Error Loading Video</h3>
        <p className="text-red-600">{error.message}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className={`ai-avatar-video-player relative overflow-hidden rounded-lg ${fullscreen ? 'fullscreen' : ''}`}
    >
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        className="w-full aspect-video bg-black"
        playsInline
        poster={`/api/ai-avatar/thumbnails/${videoId}`}
      >
        {showCaptions && (
          <track 
            kind="captions" 
            src={`/api/ai-avatar/captions/${videoId}`} 
            label="English" 
            srcLang="en" 
            default 
          />
        )}
        Your browser does not support the video tag.
      </video>
      
      {showControls && (
        <div className="ai-avatar-video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity opacity-0 hover:opacity-100 focus-within:opacity-100">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="progress-bar h-1 bg-grey-500 rounded-full mb-2 cursor-pointer"
            onClick={handleProgressBarClick}
          >
            <div 
              className="progress-fill h-full bg-primary rounded-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex items-centre justify-between">
            <div className="flex items-centre space-x-2">
              {/* Play/Pause button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              {/* Skip buttons */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={skipBackward}
                aria-label="Skip back 10 seconds"
              >
                <SkipBack size={20} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={skipForward}
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={20} />
              </Button>
              
              {/* Volume control */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              {/* Time display */}
              <span className="text-white text-sm">
                {formatTime(currentTime: any)} / {formatTime(duration: any)}
              </span>
            </div>
            
            <div className="flex items-centre space-x-2">
              {/* Settings button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                aria-label="Settings"
              >
                <Settings size={20} />
              </Button>
              
              {/* Fullscreen button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={toggleFullscreen}
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAvatarVideoPlayer;
