'use client';

// Floating Avatar Component for EdPsych Connect Platform
// Provides contextual guidance and support on every page

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { useAvatar } from './AvatarProvider';
import { AvatarVideoPlayerAdapter } from './AvatarVideoPlayerAdapter';

// Debug log to check component imports
console.log('FloatingAvatar: Importing AvatarVideoPlayerAdapter');

interface FloatingAvatarProps {
  className?: string;
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({ className = '' }) => {
  const {
    currentAvatar,
    isAvatarVisible,
    avatarPosition,
    hideAvatar,
    setAvatarPosition,
    getContextualScript
  } = useAvatar();
  
  const [isOpen, setIsOpen] = useState(false); // Start closed as a popup
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentScript, setCurrentScript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Safe default, will be updated in useEffect
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize position based on window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({ x: window.innerWidth - 400, y: 100 });
    }
  }, []); // Run only once on mount

  // Get current context from URL
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    let context = 'default-help';
    
    if (pathname === '/' || pathname === '/home') context = 'homepage-intro';
    else if (pathname.includes('/dashboard')) context = 'dashboard';
    else if (pathname.includes('/accessibility')) context = 'accessibility';
    else if (pathname.includes('/assessment')) context = 'assessment';
    else if (pathname.includes('/curriculum')) context = 'curriculum-planning';
    else if (pathname.includes('/family')) context = 'family-engagement';
    else if (pathname.includes('/voice')) context = 'voice-input';
    else if (pathname.includes('/sen')) context = 'sen-support';
    else if (pathname.includes('/restorative')) context = 'restorative-justice';
    else if (pathname.includes('/cpd')) context = 'professional-development';
    
    const script = getContextualScript(context, userRole);
    setCurrentScript(script);
  }, [getContextualScript, userRole]);

  if (!isAvatarVisible) {
    return null;
  }

  // If avatar is not open, show a floating action button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 p-4 group"
        aria-label="Open AI Assistant"
      >
        <div className="flex items-center space-x-2">
          <span className="text-2xl">👨‍⚕️</span>
          <span className="hidden group-hover:inline text-sm font-medium">Ask Dr. Scott</span>
        </div>
        {/* Pulse animation for attention */}
        <div className="absolute -inset-1 bg-blue-400 rounded-full animate-ping opacity-20"></div>
      </button>
    );
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const avatarInfo = {
    'dr-scott': {
      name: 'Dr. Scott I-Patrick',
      role: 'Educational Psychologist',
      color: 'blue',
      emoji: '👨‍⚕️'
    },
    'leila': {
      name: 'Leila',
      role: 'Student Guide',
      color: 'purple',
      emoji: '👩‍🎓'
    },
    'professor-maya': {
      name: 'Professor Maya',
      role: 'Educator Guide',
      color: 'green',
      emoji: '👩‍🏫'
    },
    'sarah': {
      name: 'Sarah',
      role: 'Parent Guide',
      color: 'pink',
      emoji: '👩‍👧‍👦'
    },
    'alex': {
      name: 'Alex',
      role: 'Accessibility Guide',
      color: 'orange',
      emoji: '🌟'
    },
    'maria': {
      name: 'Maria',
      role: 'Global Guide',
      color: 'teal',
      emoji: '🌍'
    },
    'jamal': {
      name: 'Jamal',
      role: 'Collaboration Guide',
      color: 'indigo',
      emoji: '🤝'
    }
  };

  const avatar = avatarInfo[currentAvatar as keyof typeof avatarInfo] || avatarInfo['dr-scott'];

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 500, e.clientY - dragOffset.y))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Avatar modal - no backdrop, can be moved */}
      <div
        className={`fixed z-50 ${className}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        role="dialog"
        aria-label={`${avatar.name} - ${avatar.role}`}
      >
      {/* Minimized State */}
      {isMinimized && (
        <div className="relative">
          <button
            onClick={() => setIsMinimized(false)}
            className={`w-16 h-16 bg-${avatar.color}-600 hover:bg-${avatar.color}-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-2xl`}
            aria-label={`Expand ${avatar.name}`}
          >
            {avatar.emoji}
          </button>
          
          {/* Notification Badge */}
          <div className={`absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse`}>
            !
          </div>
        </div>
      )}

      {/* Expanded State */}
      {!isMinimized && (
        <div className={`bg-white rounded-lg shadow-2xl border-2 border-${avatar.color}-200 ${isExpanded ? 'w-96 h-96' : 'w-80 h-auto'} transition-all duration-300`}>
          {/* Header - draggable area with visual indicators */}
          <div
            className={`bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between cursor-move hover:bg-blue-700 transition-colors relative`}
            onMouseDown={handleDragStart}
            title="Drag to move window"
          >
            {/* Drag indicator dots */}
            <div className="absolute inset-x-0 top-2 flex justify-center pointer-events-none">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3 pointer-events-none">
              <div className="text-2xl">{avatar.emoji}</div>
              <div>
                <h3 className="font-semibold text-sm">{avatar.name}</h3>
                <p className="text-xs opacity-90">{avatar.role}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/20 rounded pointer-events-auto"
                aria-label={isExpanded ? 'Minimize video' : 'Expand video'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded pointer-events-auto"
                aria-label="Minimize avatar"
              >
                <MessageCircle size={16} />
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-1 hover:bg-white/20 rounded pointer-events-auto"
                aria-label="Close avatar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Avatar Video Player */}
            <div className="mb-4">
              {/* Use the adapter component with the original props */}
              <AvatarVideoPlayerAdapter
                avatarId={currentAvatar}
                videoScript={currentScript}
                context="help"
                userRole={userRole}
                autoPlay={false}
                showControls={true}
                responsive={true}
                className="w-full"
              />
            </div>

            {/* Transcript Toggle */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`text-sm px-3 py-1 rounded-full border border-${avatar.color}-300 text-${avatar.color}-700 hover:bg-${avatar.color}-50 transition-colors`}
              >
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Volume2 size={12} />
                <span>Audio enabled</span>
              </div>
            </div>

            {/* Transcript */}
            {showTranscript && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
                <p className="italic">{currentScript}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const helpScript = getContextualScript('getting-started', userRole);
                  setCurrentScript(helpScript);
                }}
              >
                Getting Started
              </button>
              
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const securityScript = getContextualScript('security-overview', userRole);
                  setCurrentScript(securityScript);
                }}
              >
                Security Info
              </button>
              
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const accessibilityScript = getContextualScript('accessibility', userRole);
                  setCurrentScript(accessibilityScript);
                }}
              >
                Accessibility
              </button>
            </div>

            {/* Drag instruction with animation */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                <span className="animate-bounce">👆</span>
                <span><span className="font-medium">Tip:</span> Drag the blue header to move this window anywhere</span>
              </p>
            </div>
          </div>
        </div>
      )}

        {/* Accessibility Features */}
        <div className="sr-only" aria-live="polite">
          {isAvatarVisible && `${avatar.name} is available to help. Current context: ${currentScript.substring(0, 100)}...`}
        </div>
      </div>
    </>
  );
};

export default FloatingAvatar;

