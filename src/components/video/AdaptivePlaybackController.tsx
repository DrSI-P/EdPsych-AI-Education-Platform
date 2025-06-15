'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAdaptivePlaybackSpeed } from '@/lib/content-complexity-analyzer';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AdaptivePlaybackControllerProps {
  videoId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  userId: string;
  subjectId: string;
  transcript?: string;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const AdaptivePlaybackController: React.FC<AdaptivePlaybackControllerProps> = ({
  videoId,
  currentTime,
  duration,
  isPlaying,
  userId,
  subjectId,
  transcript,
  onSpeedChange,
  className = '',
}) => {
  // State
  const [isAdaptiveEnabled, setIsAdaptiveEnabled] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  const [recommendedSpeed, setRecommendedSpeed] = useState(1.0);
  const [confidence, setConfidence] = useState(0);
  const [reasoning, setReasoning] = useState('');
  const [showReasoningTooltip, setShowReasoningTooltip] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning'>('info');

  // Refs
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const ANALYSIS_INTERVAL = 10; // Analyze every 10 seconds
  const SPEED_CHANGE_THRESHOLD = 0.25; // Minimum change to trigger notification
  const SPEED_CHANGE_DELAY = 2000; // Delay before applying speed change (2 seconds)

  // Initialize adaptive playback
  useEffect(() => {
    if (isAdaptiveEnabled) {
      // Initial analysis
      analyzeContentComplexity();
      
      // Set up interval for periodic analysis
      analysisIntervalRef.current = setInterval(() => {
        // Only analyze if video is playing and enough time has passed since last analysis
        if (isPlaying && currentTime - lastAnalysisTime >= ANALYSIS_INTERVAL) {
          analyzeContentComplexity();
        }
      }, ANALYSIS_INTERVAL * 1000);
    } else {
      // Clear interval when adaptive playback is disabled
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }
    
    return () => {
      // Clean up interval on unmount
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      
      // Clean up timeout on unmount
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
      }
    };
  }, [isAdaptiveEnabled, isPlaying, currentTime, lastAnalysisTime]);

  // Analyze content complexity and get recommended playback speed
  const analyzeContentComplexity = (): void => {
    try {
      const recommendation = getAdaptivePlaybackSpeed(
        videoId,
        currentTime,
        userId,
        subjectId,
        transcript
      );
      
      setRecommendedSpeed(recommendation.recommendedSpeed);
      setConfidence(recommendation.confidence);
      setReasoning(recommendation.reasoning);
      setLastAnalysisTime(currentTime);
      
      // Check if recommended speed is significantly different from current speed
      if (Math.abs(recommendation.recommendedSpeed - currentSpeed) >= SPEED_CHANGE_THRESHOLD) {
        // Show notification about speed change
        setNotificationMessage(
          `Content complexity changed. Adjusting speed to ${recommendation.recommendedSpeed}x`
        );
        setNotificationType('info');
        setShowNotification(true);
        
        // Schedule speed change after delay (gives user time to opt out)
        if (speedChangeTimeoutRef.current) {
          clearTimeout(speedChangeTimeoutRef.current);
        }
        
        speedChangeTimeoutRef.current = setTimeout(() => {
          applyRecommendedSpeed();
        }, SPEED_CHANGE_DELAY);
      }
    } catch (error) {
      console.error('Error analyzing content complexity:', error);
    }
  };

  // Apply recommended speed
  const applyRecommendedSpeed = (): void => {
    setCurrentSpeed(recommendedSpeed);
    onSpeedChange(recommendedSpeed);
    
    // Show success notification
    setNotificationMessage(`Playback speed adjusted to ${recommendedSpeed}x`);
    setNotificationType('success');
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Toggle adaptive playback
  const toggleAdaptivePlayback = (): void => {
    setIsAdaptiveEnabled(!isAdaptiveEnabled);
    
    // Show notification
    setNotificationMessage(
      !isAdaptiveEnabled
        ? 'Adaptive playback enabled'
        : 'Adaptive playback disabled'
    );
    setNotificationType(!isAdaptiveEnabled ? 'success' : 'info');
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Cancel scheduled speed change
  const cancelSpeedChange = (): void => {
    if (speedChangeTimeoutRef.current) {
      clearTimeout(speedChangeTimeoutRef.current);
      speedChangeTimeoutRef.current = null;
    }
    
    setShowNotification(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Adaptive Playback Toggle */}
      <div className="flex items-center space-x-2 mb-2">
        <button
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            isAdaptiveEnabled
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={toggleAdaptivePlayback}
          aria-pressed={isAdaptiveEnabled}
        >
          {isAdaptiveEnabled ? 'Adaptive: On' : 'Adaptive: Off'}
        </button>
        
        {isAdaptiveEnabled && (
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-1">
              Current: {currentSpeed}x
            </span>
            
            <div className="relative">
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowReasoningTooltip(!showReasoningTooltip)}
                aria-label="Show recommendation details"
              >
                <Info className="h-4 w-4" />
              </button>
              
              {showReasoningTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-800 rounded-lg shadow-lg text-white text-xs w-64 z-10">
                  <p className="font-semibold mb-1">
                    Recommended: {recommendedSpeed}x
                    <span className="ml-2 text-gray-400">
                      ({Math.round(confidence * 100)}% confidence)
                    </span>
                  </p>
                  <p>{reasoning}</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Notification */}
      {showNotification && (
        <div className={`absolute top-0 left-0 right-0 p-2 rounded-md text-sm flex items-center justify-between ${
          notificationType === 'success' ? 'bg-green-600/20 border border-green-600' :
          notificationType === 'warning' ? 'bg-yellow-600/20 border border-yellow-600' :
          'bg-blue-600/20 border border-blue-600'
        }`}>
          <div className="flex items-center">
            {notificationType === 'success' ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : notificationType === 'warning' ? (
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            ) : (
              <Info className="h-4 w-4 mr-2 text-blue-500" />
            )}
            <span className="text-white">{notificationMessage}</span>
          </div>
          
          {speedChangeTimeoutRef.current && (
            <button
              className="text-white hover:text-gray-300 text-xs underline"
              onClick={cancelSpeedChange}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdaptivePlaybackController;