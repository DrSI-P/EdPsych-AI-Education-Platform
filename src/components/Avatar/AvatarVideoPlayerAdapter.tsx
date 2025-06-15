'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Mic, MicOff } from 'lucide-react';

// This adapter component provides avatar display with audio capabilities
interface AvatarVideoPlayerAdapterProps {
  avatarId: string;
  videoScript: string;
  context?: string;
  userRole?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  responsive?: boolean;
  className?: string;
}

export const AvatarVideoPlayerAdapter: React.FC<AvatarVideoPlayerAdapterProps> = ({
  avatarId,
  videoScript,
  context = 'help',
  userRole = 'student',
  autoPlay = false,
  showControls = true,
  responsive = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Avatar data
  const avatarInfo = {
    'dr-scott': {
      name: 'Dr. Scott I-Patrick',
      role: 'Educational Psychologist',
      color: 'blue',
      emoji: '👨‍⚕️',
      audioSample: '/audio/dr-scott-welcome.mp3'
    },
    'leila': {
      name: 'Leila',
      role: 'Student Guide',
      color: 'purple',
      emoji: '👩‍🎓',
      audioSample: '/audio/leila-welcome.mp3'
    },
    'professor-maya': {
      name: 'Professor Maya',
      role: 'Educator Guide',
      color: 'green',
      emoji: '👩‍🏫',
      audioSample: '/audio/maya-welcome.mp3'
    },
    'sarah': {
      name: 'Sarah',
      role: 'Parent Guide',
      color: 'pink',
      emoji: '👩‍👧‍👦',
      audioSample: '/audio/sarah-welcome.mp3'
    }
  };

  const avatar = avatarInfo[avatarId as keyof typeof avatarInfo] || avatarInfo['dr-scott'];

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = isMuted ? 0 : 1;
      
      // Set voice based on avatar
      const voices = window.speechSynthesis.getVoices();
      if (avatarId === 'dr-scott' || avatarId === 'jamal') {
        // Male voice
        const maleVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('David'));
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        // Female voice
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha'));
        if (femaleVoice) utterance.voice = femaleVoice;
      }
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play/pause functionality
  const togglePlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speakText(videoScript || "Welcome to EdPsych Connect! I'm here to guide you through our evidence-based platform.");
      }
    }
  };

  // Mute/unmute functionality
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Speech recognition for voice input
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Stop recognition
    } else {
      setIsListening(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('User said:', transcript);
        // Process user input here
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay && videoScript) {
      setTimeout(() => {
        speakText(videoScript);
      }, 1000);
    }
  }, [autoPlay, videoScript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className={`${responsive ? 'w-full' : ''} ${className}`}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        {/* Avatar Icon with animation when speaking */}
        <div className="flex items-center justify-center mb-4">
          <div className={`w-20 h-20 bg-gradient-to-br from-${avatar.color}-500 to-${avatar.color}-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all ${isPlaying ? 'animate-pulse' : ''}`}>
            {avatar.emoji}
          </div>
        </div>
        
        {/* Avatar Info */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {avatar.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {avatar.role}
          </p>
          
          {/* Script Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {videoScript || "Welcome to EdPsych Connect! I'm here to guide you through our evidence-based platform that transforms how we approach education. Feel free to ask me anything about our features or how to get started."}
            </p>
          </div>
          
          {/* Audio Controls */}
          {showControls && (
            <div className="flex items-center justify-center space-x-4 mb-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlayback}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              {/* Voice Input */}
              <button
                onClick={toggleListening}
                className={`p-2 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full transition-colors`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          )}
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 ${isPlaying ? 'bg-green-500' : 'bg-gray-400'} rounded-full ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isPlaying ? 'Speaking...' : isListening ? 'Listening...' : 'Available to help'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarVideoPlayerAdapter;