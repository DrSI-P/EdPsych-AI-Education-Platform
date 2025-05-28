"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface EnhancedCelebrationOverlayProps {
  className?: string;
  title?: string;
  message?: string;
  duration?: number;
  showConfetti?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
}

export const EnhancedCelebrationOverlay: React.FC<EnhancedCelebrationOverlayProps> = ({
  className,
  title = "Congratulations!",
  message = "You've achieved something amazing!",
  duration = 5000,
  showConfetti = true,
  onClose,
  autoClose = true,
  ...props
}) => {
  const [visible, setVisible] = useState(true);
  const [confettiElements, setConfettiElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  useEffect(() => {
    if (showConfetti) {
      // Create simulated confetti elements
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const newConfetti = Array.from({ length: 50 }).map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = `${Math.random() * 100}%`;
        const animationDelay = `${Math.random() * 2}s`;
        const size = `${Math.random() * 0.5 + 0.5}rem`;
        
        return (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left,
              top: '-20px',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              animationDelay,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        );
      });
      
      setConfettiElements(newConfetti);
    }
  }, [showConfetti]);

  if (!visible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden">
          {confettiElements}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md mx-4 relative animate-scale-in">
        {onClose && (
          <button 
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        )}
        
        <div className="text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
          
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCelebrationOverlay;
