'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize, 
  Minimize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home
} from 'lucide-react';

interface NavigationControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onPan?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onReset?: () => void;
  zoomLevel?: number;
  onZoomChange?: (value: number) => void;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  compact?: boolean;
  ariaLabels?: {
    zoomIn?: string;
    zoomOut?: string;
    rotateLeft?: string;
    rotateRight?: string;
    panUp?: string;
    panDown?: string;
    panLeft?: string;
    panRight?: string;
    reset?: string;
    zoomSlider?: string;
  };
}

/**
 * 3D Navigation Controls Component
 * 
 * Provides a comprehensive set of controls for navigating 3D content,
 * including zoom, rotation, and panning. Designed to be accessible
 * and responsive across different device sizes.
 */
export function NavigationControls({
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onPan,
  onReset,
  zoomLevel = 1,
  onZoomChange,
  minZoom = 0.5,
  maxZoom = 3,
  className = '',
  compact = false,
  ariaLabels = {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    panUp: 'Pan up',
    panDown: 'Pan down',
    panLeft: 'Pan left',
    panRight: 'Pan right',
    reset: 'Reset view',
    zoomSlider: 'Zoom level'
  }
}: NavigationControlsProps) {
  // Handle zoom slider change
  const handleZoomChange = (value: number[]) => {
    onZoomChange?.(value[0]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '+':
          onZoomIn?.();
          break;
        case '-':
          onZoomOut?.();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            onRotateLeft?.();
          } else {
            onPan?.('left');
          }
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            onRotateRight?.();
          } else {
            onPan?.('right');
          }
          break;
        case 'ArrowUp':
          onPan?.('up');
          break;
        case 'ArrowDown':
          onPan?.('down');
          break;
        case 'Home':
          onReset?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onPan, onReset]);

  return (
    <div className={`3d-navigation-controls ${className} ${compact ? 'compact' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 ${
          compact ? 'flex flex-col' : 'grid grid-cols-3 gap-2'
        }`}
      >
        {/* Zoom Controls */}
        <div className={`zoom-controls ${compact ? 'mb-2' : ''}`}>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomOut}
              aria-label={ariaLabels.zoomOut}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            {!compact && (
              <Slider
                value={[zoomLevel]}
                min={minZoom}
                max={maxZoom}
                step={0.1}
                onValueChange={handleZoomChange}
                aria-label={ariaLabels.zoomSlider}
                className="w-24 mx-2"
              />
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomIn}
              aria-label={ariaLabels.zoomIn}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          {compact && (
            <Slider
              value={[zoomLevel]}
              min={minZoom}
              max={maxZoom}
              step={0.1}
              onValueChange={handleZoomChange}
              aria-label={ariaLabels.zoomSlider}
              className="w-full mb-2"
            />
          )}
        </div>
        
        {/* Rotation Controls */}
        <div className={`rotation-controls ${compact ? 'mb-2' : ''}`}>
          <div className="flex items-center justify-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={onRotateLeft}
              aria-label={ariaLabels.rotateLeft}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              aria-label={ariaLabels.reset}
              className="h-8 w-8"
            >
              <Home className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onRotateRight}
              aria-label={ariaLabels.rotateRight}
              className="h-8 w-8"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Pan Controls */}
        <div className="pan-controls">
          <div className="grid grid-cols-3 gap-1">
            <div className="col-start-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPan?.('up')}
                aria-label={ariaLabels.panUp}
                className="h-8 w-8"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="col-start-1 row-start-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPan?.('left')}
                aria-label={ariaLabels.panLeft}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="col-start-3 row-start-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPan?.('right')}
                aria-label={ariaLabels.panRight}
                className="h-8 w-8"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="col-start-2 row-start-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPan?.('down')}
                aria-label={ariaLabels.panDown}
                className="h-8 w-8"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface ThreeDSceneProps {
  children: React.ReactNode;
  initialZoom?: number;
  initialRotation?: { x: number; y: number };
  initialPosition?: { x: number; y: number; z: number };
  className?: string;
  onSceneReady?: () => void;
  onSceneError?: (error: Error) => void;
  showControls?: boolean;
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  controlsCompact?: boolean;
}

/**
 * ThreeDScene Component
 * 
 * A container for 3D content with integrated navigation controls.
 * Handles zoom, rotation, and panning of the contained 3D elements.
 */
export function ThreeDScene({
  children,
  initialZoom = 1,
  initialRotation = { x: 0, y: 0 },
  initialPosition = { x: 0, y: 0, z: 0 },
  className = '',
  onSceneReady,
  onSceneError,
  showControls = true,
  controlsPosition = 'bottom-right',
  controlsCompact = false
}: ThreeDSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // State for scene transformations
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);
  const [position, setPosition] = useState(initialPosition);
  
  // Initialize scene
  useEffect(() => {
    try {
      // In a real implementation, this would initialize a 3D library like Three.js
      // For now, we'll just simulate the initialization
      const initializeScene = () => {
        // Simulate initialization delay
        setTimeout(() => {
          setIsReady(true);
          onSceneReady?.();
        }, 500);
      };
      
      initializeScene();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error initializing 3D scene');
      setError(error);
      onSceneError?.(error);
    }
  }, [onSceneReady, onSceneError]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle zoom change from slider
  const handleZoomChange = (value: number) => {
    setZoom(value);
  };
  
  // Handle rotation
  const handleRotateLeft = () => {
    setRotation(prev => ({ ...prev, y: prev.y - 15 }));
  };
  
  const handleRotateRight = () => {
    setRotation(prev => ({ ...prev, y: prev.y + 15 }));
  };
  
  // Handle panning
  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPosition(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: prev.y + 0.1 };
        case 'down':
          return { ...prev, y: prev.y - 0.1 };
        case 'left':
          return { ...prev, x: prev.x - 0.1 };
        case 'right':
          return { ...prev, x: prev.x + 0.1 };
        default:
          return prev;
      }
    });
  };
  
  // Handle reset
  const handleReset = () => {
    setZoom(initialZoom);
    setRotation(initialRotation);
    setPosition(initialPosition);
  };
  
  // Get controls position classes
  const getControlsPositionClasses = () => {
    switch (controlsPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  return (
    <div 
      ref={sceneRef}
      className={`three-d-scene relative overflow-hidden rounded-lg ${className}`}
      style={{ 
        minHeight: '300px',
        backgroundColor: '#f0f0f0' // Placeholder background
      }}
    >
      {/* Loading state */}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Loading 3D scene...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center max-w-md p-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load 3D scene</h3>
            <p className="text-sm text-red-600">{error.message}</p>
            <button 
              onClick={handleReset}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* 3D content container with transformations */}
      <div 
        className="scene-content w-full h-full"
        style={{
          transform: `
            scale(${zoom}) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
            translate3d(${position.x * 100}px, ${position.y * 100}px, ${position.z * 100}px)
          `,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
      
      {/* Navigation controls */}
      {showControls && isReady && !error && (
        <div className={`absolute ${getControlsPositionClasses()} z-10`}>
          <NavigationControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onPan={handlePan}
            onReset={handleReset}
            zoomLevel={zoom}
            onZoomChange={handleZoomChange}
            minZoom={0.5}
            maxZoom={3}
            compact={controlsCompact}
          />
        </div>
      )}
    </div>
  );
}
