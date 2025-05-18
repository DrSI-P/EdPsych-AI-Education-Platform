'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { VrHeadset } from '@/components/icons/vr-headset';
import { Gamepad2, Maximize2, Minimize2, Eye, EyeOff, Volume2, VolumeX, Settings, HelpCircle, ArrowLeft } from 'lucide-react';

interface ImmersiveLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  isVR?: boolean;
  isAR?: boolean;
  is3D?: boolean;
  isLoading?: boolean;
  error?: string;
  onBack?: () => void;
  onToggleFullscreen?: () => void;
  onToggleVR?: () => void;
  className?: string;
}

/**
 * ImmersiveLayout - A responsive layout component for immersive learning experiences
 * 
 * This component provides a consistent layout for immersive learning experiences,
 * including VR, AR, and 3D content. It includes controls for fullscreen, VR mode,
 * accessibility options, and more.
 */
export function ImmersiveLayout({
  children,
  title,
  description,
  isVR = false,
  isAR = false,
  is3D = true,
  isLoading = false,
  error = '',
  onBack,
  onToggleFullscreen,
  onToggleVR,
  className = ''
}: ImmersiveLayoutProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for UI controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  
  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen().catch(err => {
        showToast({
          title: 'Error entering fullscreen',
          description: err.message,
          type: 'error'
        });
      });
    } else {
      document.exitFullscreen();
    }
    
    // Call the provided handler if available
    onToggleFullscreen?.();
  };
  
  // Update fullscreen state when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle VR mode toggle
  const handleToggleVR = () => {
    setVrMode(!vrMode);
    
    // Call the provided handler if available
    onToggleVR?.();
    
    if (!vrMode) {
      showToast({
        title: 'VR Mode Enabled',
        description: 'Please put on your VR headset now.',
        type: 'info'
      });
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  // Apply accessibility settings to content
  useEffect(() => {
    if (contentRef.current) {
      // Apply high contrast mode
      if (highContrastMode) {
        contentRef.current.classList.add('high-contrast-mode');
      } else {
        contentRef.current.classList.remove('high-contrast-mode');
      }
      
      // Apply reduced motion
      if (reducedMotion) {
        contentRef.current.classList.add('reduced-motion');
      } else {
        contentRef.current.classList.remove('reduced-motion');
      }
    }
  }, [highContrastMode, reducedMotion]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to exit fullscreen or VR mode
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (vrMode) {
          setVrMode(false);
          onToggleVR?.();
        }
      }
      
      // F key for fullscreen
      if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      }
      
      // H key to toggle controls
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(!showControls);
      }
      
      // M key to toggle audio
      if (e.key === 'm' || e.key === 'M') {
        setAudioEnabled(!audioEnabled);
      }
      
      // A key to toggle accessibility panel
      if (e.key === 'a' || e.key === 'A') {
        setShowAccessibilityPanel(!showAccessibilityPanel);
      }
      
      // ? key to toggle help panel
      if (e.key === '?') {
        setShowHelpPanel(!showHelpPanel);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showControls, audioEnabled, showAccessibilityPanel, showHelpPanel, vrMode, onToggleVR]);
  
  return (
    <div className={`immersive-layout relative w-full h-full min-h-[500px] ${className}`}>
      {/* Main content area */}
      <div 
        ref={contentRef}
        className={`immersive-content relative w-full h-full overflow-hidden rounded-lg ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
        } ${
          vrMode ? 'vr-mode' : ''
        } ${
          highContrastMode ? 'high-contrast-mode' : ''
        } ${
          reducedMotion ? 'reduced-motion' : ''
        }`}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Spinner size="lg" className="text-white" />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 p-4">
            <Alert variant="error" className="max-w-md">
              {error}
            </Alert>
          </div>
        )}
        
        {/* Actual content */}
        <div className={`immersive-scene w-full h-full ${isLoading || error ? 'opacity-50' : ''}`}>
          {children}
        </div>
        
        {/* Top controls bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 p-2 md:p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-20"
            >
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBack}
                  aria-label="Back"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="ml-2 text-white">
                  <h1 className="text-lg font-bold line-clamp-1">{title}</h1>
                  {description && (
                    <p className="text-xs text-white/70 line-clamp-1 hidden md:block">{description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Experience type indicator */}
                <div className="hidden md:flex items-center mr-2 px-2 py-1 bg-blue-500/70 text-white text-xs rounded-full">
                  {isVR && (
                    <>
                      <VrHeadset className="h-3 w-3 mr-1" />
                      <span>VR</span>
                    </>
                  )}
                  {isAR && (
                    <>
                      <Gamepad2 className="h-3 w-3 mr-1" />
                      <span>AR</span>
                    </>
                  )}
                  {is3D && !isVR && !isAR && (
                    <>
                      <span>3D</span>
                    </>
                  )}
                </div>
                
                {/* Audio toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
                  className="text-white hover:bg-white/20"
                >
                  {audioEnabled ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </Button>
                
                {/* Accessibility settings */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                  aria-label="Accessibility settings"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                {/* Help */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowHelpPanel(!showHelpPanel)}
                  aria-label="Help"
                  className="text-white hover:bg-white/20"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
                
                {/* Fullscreen toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleToggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </Button>
                
                {/* VR mode toggle (only if VR is supported) */}
                {isVR && (
                  <Button 
                    variant={vrMode ? "default" : "ghost"}
                    size="sm" 
                    onClick={handleToggleVR}
                    aria-label={vrMode ? "Exit VR mode" : "Enter VR mode"}
                    className={vrMode ? "bg-blue-500 text-white" : "text-white hover:bg-white/20"}
                  >
                    <VrHeadset className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">VR Mode</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bottom controls toggle */}
        <div className="absolute bottom-4 right-4 z-20">
          <Button 
            variant="default" 
            size="icon" 
            onClick={() => setShowControls(!showControls)}
            aria-label={showControls ? "Hide controls" : "Show controls"}
            className="rounded-full shadow-lg"
          >
            {showControls ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Accessibility panel */}
        <AnimatePresence>
          {showAccessibilityPanel && (
            <motion.div 
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 right-4 z-30 w-72"
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-4">Accessibility Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="high-contrast" className="text-sm font-medium">
                        High Contrast Mode
                      </label>
                      <input
                        id="high-contrast"
                        type="checkbox"
                        checked={highContrastMode}
                        onChange={() => setHighContrastMode(!highContrastMode)}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="reduced-motion" className="text-sm font-medium">
                        Reduced Motion
                      </label>
                      <input
                        id="reduced-motion"
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={() => setReducedMotion(!reducedMotion)}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="audio-enabled" className="text-sm font-medium">
                        Audio
                      </label>
                      <input
                        id="audio-enabled"
                        type="checkbox"
                        checked={audioEnabled}
                        onChange={() => setAudioEnabled(!audioEnabled)}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAccessibilityPanel(false)}
                        className="w-full"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Help panel */}
        <AnimatePresence>
          {showHelpPanel && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-md"
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-4">Keyboard Shortcuts</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">F</span>
                      <span>Toggle fullscreen</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">H</span>
                      <span>Toggle controls</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">M</span>
                      <span>Toggle audio</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">A</span>
                      <span>Accessibility settings</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">?</span>
                      <span>Show/hide this help</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ESC</span>
                      <span>Exit fullscreen or VR mode</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowHelpPanel(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
