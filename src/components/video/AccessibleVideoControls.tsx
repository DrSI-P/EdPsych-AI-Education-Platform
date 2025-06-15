"use client";

/**
 * Accessible Video Controls Component
 * 
 * This component provides enhanced accessibility features for the video player,
 * including keyboard navigation, screen reader support, and customizable captions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  SkipForward,
  SkipBack,
  Subtitles,
  Type,
  Eye,
  Keyboard
} from 'lucide-react';

export interface AccessibleVideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  playing: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  captionsVisible: boolean;
  captionStyle: {
    size: string;
    font: string;
    color: string;
    backgroundColor: string;
    textShadow: string;
  };
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onToggleFullscreen: () => void;
  onToggleCaptions: () => void;
  onCaptionStyleChange: (style: unknown) => void;
  onKeyboardShortcutToggle?: (enabled: boolean) => void;
  onHighContrastToggle?: (enabled: boolean) => void;
  onScreenReaderAnnounce?: (message: string) => void;
}

const AccessibleVideoControls: React.FC<AccessibleVideoControlsProps> = ({
  videoRef,
  playing,
  volume,
  currentTime,
  duration,
  captionsVisible,
  captionStyle,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onToggleFullscreen,
  onToggleCaptions,
  onCaptionStyleChange,
  onKeyboardShortcutToggle = () => {},
  onHighContrastToggle = () => {},
  onScreenReaderAnnounce = () => {}
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  
  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if not in an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          onPlayPause();
          onScreenReaderAnnounce(playing ? 'Paused' : 'Playing');
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          onSkipForward();
          onScreenReaderAnnounce('Skipped forward 10 seconds');
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          onSkipBackward();
          onScreenReaderAnnounce('Skipped backward 10 seconds');
          break;
        case 'm':
          e.preventDefault();
          onToggleMute();
          onScreenReaderAnnounce(volume === 0 ? 'Unmuted' : 'Muted');
          break;
        case 'f':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'c':
          e.preventDefault();
          onToggleCaptions();
          onScreenReaderAnnounce(captionsVisible ? 'Captions off' : 'Captions on');
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const percent = parseInt(e.key) * 10;
          const newTime = (duration * percent) / 100;
          onSeek(newTime);
          onScreenReaderAnnounce(`Jumped to ${percent}%`);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.addEventListener('keydown', handleKeyDown);
    };
  }, [
    keyboardShortcutsEnabled, 
    playing, 
    volume, 
    duration, 
    captionsVisible,
    onPlayPause,
    onSkipForward,
    onSkipBackward,
    onToggleMute,
    onToggleFullscreen,
    onToggleCaptions,
    onSeek,
    onScreenReaderAnnounce
  ]);
  
  // Toggle keyboard shortcuts
  const handleKeyboardShortcutsToggle = (enabled: boolean) => {
    setKeyboardShortcutsEnabled(enabled);
    onKeyboardShortcutToggle(enabled);
    onScreenReaderAnnounce(enabled ? 'Keyboard shortcuts enabled' : 'Keyboard shortcuts disabled');
  };
  
  // Toggle high contrast mode
  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrastMode(enabled);
    onHighContrastToggle(enabled);
    onScreenReaderAnnounce(enabled ? 'High contrast mode enabled' : 'High contrast mode disabled');
  };
  
  // Update caption style
  const updateCaptionStyle = (property: string, value: string) => {
    onCaptionStyleChange({
      ...captionStyle,
      [property]: value
    });
  };
  
  return (
    <>
      {/* Main Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 ${highContrastMode ? 'bg-black' : ''}`}
        role="region"
        aria-label="Video controls"
      >
        {/* Progress Bar */}
        <div 
          className="relative w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer"
          role="slider"
          aria-label="Video progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={duration ? (currentTime / duration) * 100 : 0}
          tabIndex={0}
          onClick={(e: any) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            onSeek(pos * duration);
          }}
          onKeyDown={(e: any) => {
            if (e.key === 'ArrowRight') {
              onSeek(Math.min(currentTime + 5, duration));
            } else if (e.key === 'ArrowLeft') {
              onSeek(Math.max(currentTime - 5, 0));
            }
          }}
        >
          {/* Playback Progress */}
          <div 
            className={`absolute top-0 left-0 h-full ${highContrastMode ? 'bg-white' : 'bg-primary'} rounded-full`}
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          ></div>
          
          {/* Seek Handle */}
          <div 
            className={`absolute top-1/2 h-4 w-4 ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-white'} rounded-full -translate-y-1/2 -translate-x-1/2`}
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause Button */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={highContrastMode ? "bg-white text-black" : "text-white hover:bg-white/20"}
              onClick={onPlayPause}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            {/* Skip Buttons */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={highContrastMode ? "bg-white text-black" : "text-white hover:bg-white/20"}
              onClick={onSkipBackward}
              aria-label="Skip backward 10 seconds"
            >
              <SkipBack size={20} />
            </Button>
            
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={highContrastMode ? "bg-white text-black" : "text-white hover:bg-white/20"}
              onClick={onSkipForward}
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward size={20} />
            </Button>
            
            {/* Volume Control */}
            <div className="relative flex items-center">
              <Button 
                variant={highContrastMode ? "default" : "ghost"} 
                size="sm" 
                className={highContrastMode ? "bg-white text-black" : "text-white hover:bg-white/20"}
                onClick={onToggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              {showVolumeSlider && (
                <div 
                  className={`absolute bottom-full left-0 mb-2 p-2 ${highContrastMode ? 'bg-black border-2 border-white' : 'bg-black bg-opacity-80'} rounded-md`}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <div className="h-24 w-6 flex items-center justify-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e: any) => onVolumeChange(parseFloat(e.target.value))}
                      className="w-24 -rotate-90"
                      aria-label="Volume"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Time Display */}
            <div className={`text-sm ${highContrastMode ? 'text-white bg-black px-2 rounded' : 'text-white'}`}>
              <span aria-label="Current time">{formatTime(currentTime)}</span>
              {" / "}
              <span aria-label="Total duration">{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Captions Toggle */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={`${highContrastMode ? 'bg-white text-black' : 'hover:bg-white/20'} ${captionsVisible ? 'text-primary' : 'text-white'}`}
              onClick={onToggleCaptions}
              aria-label={captionsVisible ? "Hide captions" : "Show captions"}
              aria-pressed={captionsVisible}
            >
              <Subtitles size={20} />
            </Button>
            
            {/* Accessibility Settings */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={`${highContrastMode ? 'bg-white text-black' : 'text-white hover:bg-white/20'} ${showAccessibilityPanel ? 'bg-primary/20' : ''}`}
              onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
              aria-label="Accessibility settings"
              aria-expanded={showAccessibilityPanel}
            >
              <Eye size={20} />
            </Button>
            
            {/* Settings */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={`${highContrastMode ? 'bg-white text-black' : 'text-white hover:bg-white/20'} ${showSettings ? 'bg-primary/20' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Video settings"
              aria-expanded={showSettings}
            >
              <Settings size={20} />
            </Button>
            
            {/* Fullscreen Toggle */}
            <Button 
              variant={highContrastMode ? "default" : "ghost"} 
              size="sm" 
              className={highContrastMode ? "bg-white text-black" : "text-white hover:bg-white/20"}
              onClick={onToggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Accessibility Panel */}
      {showAccessibilityPanel && (
        <div 
          className={`absolute bottom-16 right-4 ${highContrastMode ? 'bg-black border-2 border-white text-white' : 'bg-black bg-opacity-80'} rounded-md p-4 w-80`}
          role="dialogue"
          aria-label="Accessibility settings"
        >
          <Tabs defaultValue="captions">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="captions" className="flex-1">Captions</TabsTrigger>
              <TabsTrigger value="keyboard" className="flex-1">Keyboard</TabsTrigger>
              <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
            </TabsList>
            
            <TabsContent value="captions">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="caption-toggle" className="text-white">Show Captions</Label>
                    <Switch 
                      id="caption-toggle" 
                      checked={captionsVisible} 
                      onCheckedChange={onToggleCaptions}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Text Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['0.8rem', '1rem', '1.2rem'].map(size => (
                      <Button 
                        key={size}
                        variant="outline" 
                        size="sm"
                        className={`text-xs ${captionStyle.size === size ? 'bg-primary text-white' : 'text-white'}`}
                        onClick={() => updateCaptionStyle('size', size)}
                      >
                        {size === '0.8rem' ? 'Small' : size === '1rem' ? 'Medium' : 'Large'}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Text Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#ffffff', '#ffff00', '#00ffff', '#7cfc00'].map(color => (
                      <Button 
                        key={color}
                        variant="outline" 
                        size="sm"
                        className="h-8 w-full p-0"
                        style={{ backgroundColor: color }}
                        onClick={() => updateCaptionStyle('color', color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Background</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'rgba(0, 0, 0, 0.5)', 
                      'rgba(0, 0, 0, 0.8)', 
                      'rgba(0, 0, 0, 0)', 
                      'rgba(0, 0, 0, 1)'
                    ].map(bg => (
                      <Button 
                        key={bg}
                        variant="outline" 
                        size="sm"
                        className="h-8 w-full p-0"
                        style={{ backgroundColor: bg }}
                        onClick={() => updateCaptionStyle('backgroundColor', bg)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="keyboard-toggle" className="text-white">Enable Keyboard Shortcuts</Label>
                  <Switch 
                    id="keyboard-toggle" 
                    checked={keyboardShortcutsEnabled} 
                    onCheckedChange={handleKeyboardShortcutsToggle}
                  />
                </div>
                
                <div className="text-white text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Play/Pause</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">Space or K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skip Forward</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">→ or L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skip Backward</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">← or J</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mute/Unmute</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fullscreen</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Captions</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seek to %</span>
                    <span className="font-mono bg-gray-700 px-2 rounded">0-9</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="display">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="contrast-toggle" className="text-white">High Contrast Mode</Label>
                  <Switch 
                    id="contrast-toggle" 
                    checked={highContrastMode} 
                    onCheckedChange={handleHighContrastToggle}
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Playback Speed</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <Button 
                        key={speed}
                        variant="outline" 
                        size="sm"
                        className={`text-xs ${videoRef.current?.playbackRate === speed ? 'bg-primary text-white' : 'text-white'}`}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.playbackRate = speed;
                            onScreenReaderAnnounce(`Playback speed set to ${speed}x`);
                          }
                        }}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettings && (
        <div 
          className={`absolute bottom-16 right-4 ${highContrastMode ? 'bg-black border-2 border-white text-white' : 'bg-black bg-opacity-80'} rounded-md p-4 w-64`}
          role="dialogue"
          aria-label="Video settings"
        >
          <div className="text-white font-medium mb-2">Settings</div>
          
          {/* Playback Speed */}
          <div className="mb-4">
            <div className="text-white text-sm mb-1">Playback Speed</div>
            <div className="flex flex-wrap gap-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                <Button 
                  key={speed}
                  variant="outline" 
                  size="sm"
                  className={`text-xs ${videoRef.current?.playbackRate === speed ? 'bg-primary text-white' : 'text-white'}`}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.playbackRate = speed;
                      onScreenReaderAnnounce(`Playback speed set to ${speed}x`);
                    }
                  }}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quality Selection */}
          <div className="mb-4">
            <div className="text-white text-sm mb-1">Quality</div>
            <div className="flex flex-wrap gap-2">
              {['Auto', '720p', '1080p'].map(quality => (
                <Button 
                  key={quality}
                  variant="outline" 
                  size="sm"
                  className="text-xs text-white"
                >
                  {quality}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibleVideoControls;