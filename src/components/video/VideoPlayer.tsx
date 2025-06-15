'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Bookmark,
  MessageSquare,
  FileText,
  BarChart3,
  Brain
} from 'lucide-react';
import { usePredictiveCaching } from '@/lib/predictive-caching';
import AccessibleVideoControls from './AccessibleVideoControls';
import AdaptivePlaybackController from './AdaptivePlaybackController';
import BookmarkSuggestionOverlay from './BookmarkSuggestionOverlay';
import ContentDifficultyDisplay from './ContentDifficultyDisplay';
import LearningStyleAdaptationController from './LearningStyleAdaptationController';
import SharedAnnotationsPanel from './SharedAnnotationsPanel';
import GroupViewingPanel from './GroupViewingPanel';
import InstructorFeedbackPanel from './InstructorFeedbackPanel';
import { ContentComplexityMetrics } from '@/lib/content-complexity-analyzer';
import { ContentAdaptationSettings } from '@/lib/learning-style-adapter';
import { PlaybackControlAction } from '@/lib/group-viewing-service';

export interface VideoSource {
  src: string;
  type: string;
  quality?: string;
}

export interface Caption {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

export interface VideoQuestion {
  id: string;
  timeCode: number; // in seconds
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface VideoPlayerProps {
  sources: VideoSource[];
  poster?: string;
  captions?: Caption[];
  title?: string;
  description?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  questions?: VideoQuestion[];
  onQuestionAnswered?: (questionId: string, answer: string, correct: boolean) => void;
  onComplete?: () => void;
  onBookmark?: (timeCode: number, notes?: string) => void;
  className?: string;
  nextVideos?: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
  }[];
  // Adaptive playback props
  adaptivePlayback?: boolean;
  userId?: string;
  subjectId?: string;
  // Bookmark suggestion props
  bookmarkSuggestions?: boolean;
  // Content difficulty assessment props
  contentDifficultyAssessment?: boolean;
  // Learning style adaptation props
  learningStyleAdaptation?: boolean;
  // Shared annotations props
  sharedAnnotations?: boolean;
  userDisplayName?: string;
  userRole?: 'student' | 'instructor' | 'admin';
  groupId?: string;
  courseId?: string;
  // Group viewing props
  groupViewing?: boolean;
  // Instructor feedback props
  instructorFeedback?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sources,
  poster,
  captions,
  title,
  description,
  autoPlay = false,
  loop = false,
  muted = false,
  questions = [],
  onQuestionAnswered,
  onComplete,
  onBookmark,
  className = '',
  nextVideos = [],
  adaptivePlayback = false,
  userId = 'default-user',
  subjectId = 'default-subject',
  bookmarkSuggestions = false,
  contentDifficultyAssessment = false,
  learningStyleAdaptation = false,
  sharedAnnotations = false,
  userDisplayName = 'Anonymous User',
  userRole = 'student',
  groupId,
  courseId,
  groupViewing = false,
  instructorFeedback = false
}) => {
  // State for video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string | undefined>(
    sources.find(s => s.quality)?.quality
  );
  const [showCaptions, setShowCaptions] = useState(!!captions?.some(c => c.default));
  const [selectedCaption, setSelectedCaption] = useState<string | undefined>(
    captions?.find(c => c.default)?.srcLang
  );
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkNotes, setBookmarkNotes] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<VideoQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<{text: string, start: number, end: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showNextVideos, setShowNextVideos] = useState(false);
  const [isAdaptivePlaybackEnabled, setIsAdaptivePlaybackEnabled] = useState(adaptivePlayback);
  const [complexityMetrics, setComplexityMetrics] = useState<ContentComplexityMetrics>({
    speechRate: 0.5,
    informationDensity: 0.5,
    conceptDifficulty: 0.5,
    visualComplexity: 0.5,
    overallComplexity: 0.5
  });
  const [showDifficultyAssessment, setShowDifficultyAssessment] = useState(false);
  const [isLearningStyleAdaptationEnabled, setIsLearningStyleAdaptationEnabled] = useState(learningStyleAdaptation);
  const [showLearningStyleAdaptation, setShowLearningStyleAdaptation] = useState(false);
  const [adaptationSettings, setAdaptationSettings] = useState<ContentAdaptationSettings | null>(null);
  const [isSharedAnnotationsEnabled, setIsSharedAnnotationsEnabled] = useState(sharedAnnotations);
  const [showSharedAnnotations, setShowSharedAnnotations] = useState(false);
  const [isGroupViewingEnabled, setIsGroupViewingEnabled] = useState(groupViewing);
  const [showGroupViewing, setShowGroupViewing] = useState(false);
  const [isInstructorFeedbackEnabled, setIsInstructorFeedbackEnabled] = useState(instructorFeedback);
  const [showInstructorFeedback, setShowInstructorFeedback] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use predictive caching for next videos
  usePredictiveCaching(
    nextVideos.map(video => ({ 
      url: `/api/videos/${video.id}`, 
      priority: 'high' 
    }))
  );

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = (): void => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = (): void => {
      setCurrentTime(video.currentTime);
      checkForQuestions(video.currentTime);
      updateComplexityMetrics(video.currentTime);
    };

    const handleProgress = (): void => {
      setBuffered(video.buffered);
    };

    const handleEnded = (): void => {
      setIsPlaying(false);
      if (onComplete) onComplete();
      setShowNextVideos(true);
    };

    const handleError = (): void => {
      setError('An error occurred whilst loading the video.');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onComplete]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && !isHovering && !activeQuestion) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isHovering, activeQuestion]);

  // Load captions/transcript if available
  useEffect(() => {
    if (captions && selectedCaption) {
      const caption = captions.find(c => c.srcLang === selectedCaption);
      if (caption) {
        fetch(caption.src)
          .then(response => response.text())
          .then(text => {
            // Simple VTT parser - in production, use a proper VTT parser library
            const parsedTranscript = parseVTT(text);
            setTranscript(parsedTranscript);
          })
          .catch(err => {
            console.error('Error loading captions:', err);
          });
      }
    }
  }, [captions, selectedCaption]);

  // Simple VTT parser function
  const parseVTT = (vttText: string) => {
    const lines = vttText.split('\n');
    const result: {text: string, start: number, end: number}[] = [];
    let currentItem: {text: string, start: number, end: number} | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip WebVTT header and empty lines
      if (line === 'WEBVTT' || line === '') continue;
      
      // Check if line contains timestamp
      if (line.includes('-->')) {
        const [startTime, endTime] = line.split('-->').map(timeStr => {
          const [mins, secs] = timeStr.trim().split(':');
          return parseFloat(mins) * 60 + parseFloat(secs);
        });
        
        currentItem = { text: '', start: startTime, end: endTime };
      } else if (currentItem && !line.includes(':')) {
        // Add text content
        currentItem.text += (currentItem.text ? ' ' : '') + line;
        
        // Check if next line is empty or a new timestamp, indicating end of this caption
        if (!lines[i+1]?.trim() || lines[i+1]?.includes('-->')) {
          result.push(currentItem);
          currentItem = null;
        }
      }
    }
    
    return result;
  };

  // Check for questions at current time
  const checkForQuestions = (currentTimeCode: number) => {
    if (activeQuestion) return; // Don't check if a question is already active
    
    const question = questions.find(q => {
      // Check if we're within 0.5 seconds of the question timecode
      return Math.abs(q.timeCode - currentTimeCode) < 0.5;
    });
    
    if (question) {
      setActiveQuestion(question);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Play/pause toggle
  const togglePlay = (): void => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Mute toggle
  const toggleMute = (): void => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (!videoRef.current) return;
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Seek to position
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Toggle fullscreen
  const toggleFullscreen = (): void => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Change video quality
  const changeQuality = (quality: string) => {
    if (!videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;
    
    setSelectedQuality(quality);
    
    // This will trigger a reload of the video with the new source
    // We'll need to restore the current time and play state
    videoRef.current.addEventListener('loadedmetadata', function onceLoaded() {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) videoRef.current.play();
      }
      videoRef.current?.removeEventListener('loadedmetadata', onceLoaded);
    });
  };

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  // Handle adaptive playback speed change
  const handleAdaptiveSpeedChange = (speed: number) => {
    changePlaybackRate(speed);
  };
  
  // Handle learning style adaptation settings change
  const handleAdaptationSettingsChange = (settings: ContentAdaptationSettings) => {
    setAdaptationSettings(settings);
    
    // Apply adaptation settings to video playback
    if (settings && videoRef.current) {
      // Adjust playback rate based on auditory preference
      // Higher auditory preference = slower playback for better comprehension
      const audioPrefPlaybackRate = 1 - (settings.audioEmphasis * 0.3);
      changePlaybackRate(audioPrefPlaybackRate);
      
      // Adjust captions based on reading preference
      if (settings.transcriptVisibility > 0.6) {
        setShowCaptions(true);
      }
      
      // Other adaptations would be applied here in a full implementation
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Update complexity metrics based on current time
  const updateComplexityMetrics = (currentTimeCode: number) => {
    if (!contentDifficultyAssessment) return;
    
    // In a real implementation, this would use a more sophisticated algorithm
    // to analyze the content complexity at the current time
    // For this demo, we'll simulate changing complexity over time
    
    // Normalize time to create a repeating pattern
    const normalizedTime = currentTimeCode % 300; // Cycle every 5 minutes
    const section = Math.floor(normalizedTime / 60); // Each section is 1 minute
    
    // Base complexity values for each section
    const sectionComplexity = {
      0: { speech: 0.3, info: 0.2, concept: 0.2, visual: 0.3 }, // Introduction (simple)
      1: { speech: 0.5, info: 0.6, concept: 0.7, visual: 0.5 }, // Main concepts (moderate)
      2: { speech: 0.7, info: 0.8, concept: 0.9, visual: 0.7 }, // Complex explanation (difficult)
      3: { speech: 0.6, info: 0.7, concept: 0.8, visual: 0.6 }, // Examples (moderate-high)
      4: { speech: 0.4, info: 0.5, concept: 0.6, visual: 0.4 }  // Summary (moderate-low)
    };
    
    // Get complexity values for current section
    const currentSection = sectionComplexity[section as keyof typeof sectionComplexity];
    
    // Add some variation within each section based on exact timestamp
    const withinSectionProgress = (normalizedTime % 60) / 60;
    const variation = Math.sin(withinSectionProgress * Math.PI) * 0.2;
    
    // Calculate metrics with variation
    const speechRate = Math.min(1, Math.max(0, currentSection.speech + variation * 0.5));
    const informationDensity = Math.min(1, Math.max(0, currentSection.info + variation * 0.3));
    const conceptDifficulty = Math.min(1, Math.max(0, currentSection.concept + variation * 0.2));
    const visualComplexity = Math.min(1, Math.max(0, currentSection.visual + variation * 0.4));
    
    // Calculate overall complexity as weighted average
    const overallComplexity = (
      speechRate * 0.2 +
      informationDensity * 0.3 +
      conceptDifficulty * 0.4 +
      visualComplexity * 0.1
    );
    
    // Update complexity metrics
    setComplexityMetrics({
      speechRate,
      informationDensity,
      conceptDifficulty,
      visualComplexity,
      overallComplexity
    });
  };

  // Handlers for group viewing
  const handleToggleGroupViewing = (): void => {
    setShowGroupViewing(!showGroupViewing);
  };

  const handlePlaybackControl = (action: PlaybackControlAction, value?: number) => {
    if (!videoRef.current) return;
    
    switch (action) {
      case 'play':
        videoRef.current.play();
        setIsPlaying(true);
        break;
      case 'pause':
        videoRef.current.pause();
        setIsPlaying(false);
        break;
      case 'seek':
        if (typeof value === 'number') {
          videoRef.current.currentTime = value;
          setCurrentTime(value);
        }
        break;
    }
  };

  // Handlers for instructor feedback
  const handleToggleInstructorFeedback = (): void => {
    setShowInstructorFeedback(!showInstructorFeedback);
  };

  // Create bookmark
  const createBookmark = (): void => {
    if (!videoRef.current) return;
    
    if (showBookmarkDialog) {
      // Save the bookmark
      if (onBookmark) {
        onBookmark(videoRef.current.currentTime, bookmarkNotes);
      }
      setShowBookmarkDialog(false);
      setBookmarkNotes('');
    } else {
      // Show the bookmark dialogue
      setShowBookmarkDialog(true);
    }
  };
  
  // Create bookmark from suggestion
  const createBookmarkFromSuggestion = (timeCode: number, title: string, notes?: string) => {
    if (onBookmark) {
      onBookmark(timeCode, notes || title);
    }
  };

  // Handle question answer
  const handleAnswerQuestion = (answer: string) => {
    if (!activeQuestion || !onQuestionAnswered) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === activeQuestion.correctAnswer;
    onQuestionAnswered(activeQuestion.id, answer, isCorrect);
    setShowAnswer(true);
  };

  // Continue after question
  const continueAfterQuestion = (): void => {
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Get current source based on selected quality
  const getCurrentSource = (): VideoSource => {
    if (selectedQuality) {
      const source = sources.find(s => s.quality === selectedQuality);
      if (source) return source;
    }
    return sources[0]; // Default to first source
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
          <div className="text-white text-lg mb-2">Error loading video</div>
          <div className="text-gray-400 text-sm text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className="w-full h-full"
        onClick={togglePlay}
      >
        <source src={getCurrentSource().src} type={getCurrentSource().type} />
        
        {captions?.map((caption, index) => (
          <track 
            key={index}
            src={caption.src} 
            kind="subtitles" 
            srcLang={caption.srcLang} 
            label={caption.label}
            default={caption.default && showCaptions}
          />
        ))}
        
        Your browser does not support the video tag.
      </video>

      {/* Title and description overlay (shown briefly on load) */}
      {title && (
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${isPlaying && !isHovering ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-gray-200 text-sm mt-1">{description}</p>
          )}
        </div>
      )}

      {/* Video Controls */}
      <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <AccessibleVideoControls
          videoRef={videoRef}
          playing={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          captionsVisible={showCaptions}
          captionStyle={{
            size: '1rem',
            font: 'Arial, sans-serif',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
          }}
          onPlayPause={togglePlay}
          onToggleMute={toggleMute}
          onVolumeChange={(vol: number) => {
            if (!videoRef.current) return;
            
            videoRef.current.volume = vol;
            setVolume(vol);
            
            if (vol === 0) {
              videoRef.current.muted = true;
              setIsMuted(true);
            } else if (isMuted) {
              videoRef.current.muted = false;
              setIsMuted(false);
            }
          }}
          onSeek={(time: number) => {
            if (!videoRef.current) return;
            
            videoRef.current.currentTime = time;
            setCurrentTime(time);
          }}
          onSkipForward={() => skip(10)}
          onSkipBackward={() => skip(-10)}
          onToggleFullscreen={toggleFullscreen}
          onToggleCaptions={() => setShowCaptions(!showCaptions)}
          onCaptionStyleChange={(style) => console.log('Caption style changed:', style)}
          onKeyboardShortcutToggle={(enabled) => console.log('Keyboard shortcuts:', enabled ? 'enabled' : 'disabled')}
          onHighContrastToggle={(enabled) => console.log('High contrast mode:', enabled ? 'enabled' : 'disabled')}
          onScreenReaderAnnounce={(message) => console.log('Screen reader announcement:', message)}
        />
        
        {/* Adaptive Playback Controller */}
        {adaptivePlayback && (
          <div className="absolute bottom-40 left-4 z-10">
            <AdaptivePlaybackController
              videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              userId={userId}
              subjectId={subjectId}
              transcript={transcript.map(item => item.text).join(' ')}
              onSpeedChange={handleAdaptiveSpeedChange}
            />
          </div>
        )}
        
        {/* Bookmark Suggestion Overlay */}
        {bookmarkSuggestions && (
          <BookmarkSuggestionOverlay
            videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
            userId={userId}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            transcript={transcript.map(item => item.text).join(' ')}
            onCreateBookmark={createBookmarkFromSuggestion}
          />
        )}
        
        {/* Content Difficulty Assessment */}
        {contentDifficultyAssessment && (
          <div className="absolute bottom-16 right-4 z-10">
            <button
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${showDifficultyAssessment ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              onClick={() => setShowDifficultyAssessment(!showDifficultyAssessment)}
              aria-label={showDifficultyAssessment ? "Hide difficulty assessment" : "Show difficulty assessment"}
            >
              <BarChart3 className="h-3 w-3" />
              <span>Difficulty Assessment</span>
            </button>
            
            {showDifficultyAssessment && (
              <div className="mt-2 w-80">
                <ContentDifficultyDisplay
                  videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
                  transcript={transcript.map(item => item.text).join(' ')}
                  complexityMetrics={complexityMetrics}
                />
              </div>
            )}
            
            {/* Learning Style Adaptation */}
            {learningStyleAdaptation && (
              <div className="absolute bottom-16 left-4 z-10">
                <button
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${showLearningStyleAdaptation ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  onClick={() => setShowLearningStyleAdaptation(!showLearningStyleAdaptation)}
                  aria-label={showLearningStyleAdaptation ? "Hide learning style adaptation" : "Show learning style adaptation"}
                >
                  <Brain className="h-3 w-3" />
                  <span>Learning Style</span>
                </button>
                
                {showLearningStyleAdaptation && (
                  <div className="mt-2 w-80">
                    <LearningStyleAdaptationController
                      videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
                      userId={userId}
                      currentTime={currentTime}
                      duration={duration}
                      isPlaying={isPlaying}
                      onAdaptationChange={handleAdaptationSettingsChange}
                    />
                  </div>
                )}
                
                {/* Shared Annotations */}
                {sharedAnnotations && (
                  <div className="absolute right-4 top-4 z-10">
                    <button
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${showSharedAnnotations ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      onClick={() => setShowSharedAnnotations(!showSharedAnnotations)}
                      aria-label={showSharedAnnotations ? "Hide shared annotations" : "Show shared annotations"}
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Annotations</span>
                    </button>
                    
                    {showSharedAnnotations && (
                      <div className="mt-2 w-80">
                        <SharedAnnotationsPanel
                          videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
                          userId={userId}
                          userName={userDisplayName}
                          userRole={userRole}
                          currentTime={currentTime}
                          duration={duration}
                          isPlaying={isPlaying}
                          onSeek={(time) => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = time;
                              setCurrentTime(time);
                            }
                          }}
                          onPause={() => {
                            if (videoRef.current && isPlaying) {
                              videoRef.current.pause();
                              setIsPlaying(false);
                            }
                          }}
                          groupId={groupId}
                          courseId={courseId}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Group Viewing Panel */}
                {groupViewing && (
                  <div className="absolute left-4 top-4 z-10">
                    <button
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${showGroupViewing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      onClick={handleToggleGroupViewing}
                      aria-label={showGroupViewing ? "Hide group viewing" : "Show group viewing"}
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Group Viewing</span>
                    </button>
                    
                    {showGroupViewing && (
                      <div className="mt-2 w-80">
                        <GroupViewingPanel
                          videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
                          userId={userId}
                          userName={userDisplayName}
                          userRole={userRole}
                          currentTime={currentTime}
                          duration={duration}
                          isPlaying={isPlaying}
                          onPlaybackControl={handlePlaybackControl}
                          groupId={groupId}
                          courseId={courseId}
                        />
                      </div>
                    )}
                    
                    {/* Instructor Feedback Panel */}
                    {instructorFeedback && (
                      <div className="absolute right-4 bottom-4 z-10">
                        <button
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${showInstructorFeedback ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                          onClick={handleToggleInstructorFeedback}
                          aria-label={showInstructorFeedback ? "Hide instructor feedback" : "Show instructor feedback"}
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Instructor Feedback</span>
                        </button>
                        
                        {showInstructorFeedback && (
                          <div className="mt-2 w-80">
                            <InstructorFeedbackPanel
                              videoId={typeof sources[0].src === 'string' ? sources[0].src.split('/').pop() || 'unknown-video' : 'unknown-video'}
                              userId={userId}
                              userName={userDisplayName}
                              userRole={userRole}
                              currentTime={currentTime}
                              duration={duration}
                              isPlaying={isPlaying}
                              onSeek={(time) => {
                                if (videoRef.current) {
                                  videoRef.current.currentTime = time;
                                  setCurrentTime(time);
                                }
                              }}
                              onPause={() => {
                                if (videoRef.current && isPlaying) {
                                  videoRef.current.pause();
                                  setIsPlaying(false);
                                }
                              }}
                              studentId={userId !== 'default-user' ? userId : undefined}
                              studentName={userDisplayName !== 'Anonymous User' ? userDisplayName : undefined}
                              groupId={groupId}
                              courseId={courseId}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-16 right-4 bg-gray-900/90 rounded-lg p-4 text-white shadow-lg">
          <h4 className="text-sm font-semibold mb-2">Settings</h4>
          
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Playback Speed</p>
            <div className="flex space-x-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                <button
                  key={rate}
                  className={`px-2 py-1 text-xs rounded ${playbackRate === rate ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => changePlaybackRate(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
          
          {sources.length > 1 && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Quality</p>
              <div className="flex flex-col space-y-1">
                {sources
                  .filter(source => source.quality)
                  .map((source, index) => (
                    <button
                      key={index}
                      className={`px-2 py-1 text-xs rounded text-left ${selectedQuality === source.quality ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => changeQuality(source.quality || '')}
                    >
                      {source.quality}
                    </button>
                  ))}
              </div>
            </div>
          )}
          
          {captions && captions.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Captions</p>
              <div className="flex flex-col space-y-1">
                <button
                  className={`px-2 py-1 text-xs rounded text-left ${!showCaptions ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setShowCaptions(false)}
                >
                  Off
                </button>
                {captions.map((caption, index) => (
                  <button
                    key={index}
                    className={`px-2 py-1 text-xs rounded text-left ${showCaptions && selectedCaption === caption.srcLang ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => {
                      setShowCaptions(true);
                      setSelectedCaption(caption.srcLang);
                    }}
                  >
                    {caption.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookmark Dialogue */}
      {showBookmarkDialog && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 rounded-lg p-4 text-white shadow-lg w-80">
          <h4 className="text-lg font-semibold mb-2 flex items-center">
            <Bookmark className="h-5 w-5 mr-2" />
            Add Bookmark at {formatTime(currentTime)}
          </h4>
          
          <textarea
            className="w-full bg-gray-800 text-white rounded p-2 mb-3"
            rows={3}
            placeholder="Add notes (optional)"
            value={bookmarkNotes}
            onChange={(e: any) => setBookmarkNotes(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => setShowBookmarkDialog(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded"
              onClick={createBookmark}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* In-Video Question */}
      {activeQuestion && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-500" />
              Question
            </h4>
            
            <p className="text-white text-lg mb-6">{activeQuestion.question}</p>
            
            {!showAnswer ? (
              <div className="space-y-2 mb-6">
                {activeQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded ${
                      selectedAnswer === option 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => handleAnswerQuestion(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <div className={`p-4 rounded mb-4 ${
                  selectedAnswer === activeQuestion.correctAnswer
                    ? 'bg-green-600/20 border border-green-600'
                    : 'bg-red-600/20 border border-red-600'
                }`}>
                  <p className="font-semibold text-white mb-2">
                    {selectedAnswer === activeQuestion.correctAnswer
                      ? 'Correct!'
                      : 'Incorrect'}
                  </p>
                  <p className="text-gray-200">
                    {activeQuestion.explanation || 
                      (selectedAnswer === activeQuestion.correctAnswer
                        ? 'Well done! You selected the correct answer.'
                        : `The correct answer is: ${activeQuestion.correctAnswer}`
                      )
                    }
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              {showAnswer && (
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
                  onClick={continueAfterQuestion}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transcript Panel */}
      {showTranscript && (
        <div className="absolute top-0 right-0 bottom-16 bg-gray-900/90 w-1/3 overflow-y-auto p-4">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Transcript
          </h4>
          
          <div className="space-y-2">
            {transcript.map((item, index) => (
              <div 
                key={index}
                className={`p-2 rounded ${
                  currentTime >= item.start && currentTime <= item.end
                    ? 'bg-blue-600/30 border-l-4 border-blue-600'
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = item.start;
                    setCurrentTime(item.start);
                  }
                }}
              >
                <div className="text-gray-400 text-xs mb-1">{formatTime(item.start)}</div>
                <div className="text-white">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Videos Panel */}
      {showNextVideos && nextVideos.length > 0 && (
        <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h4 className="text-xl font-semibold text-white mb-6">Up Next</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {nextVideos.map((video, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => {
                    // In a real app, this would navigate to the next video
                    console.log(`Navigate to video: ${video.id}`);
                  }}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatTime(video.duration)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h5 className="text-white font-medium line-clamp-2">{video.title}</h5>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                onClick={() => setShowNextVideos(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
                onClick={() => {
                  // In a real app, this would navigate to the first next video
                  if (nextVideos.length > 0) {
                    console.log(`Navigate to video: ${nextVideos[0].id}`);
                  }
                }}
              >
                Play Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause overlay button (center of video) */}
      <button
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-black/50 rounded-full p-4 transition-opacity duration-300
                   ${isPlaying && !isHovering ? 'opacity-0' : 'opacity-100'}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-white" />
        ) : (
          <Play className="h-8 w-8 text-white" />
        )}
      </button>
    </div>
  );
};

export default VideoPlayer;