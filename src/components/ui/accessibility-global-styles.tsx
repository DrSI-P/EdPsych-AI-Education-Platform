'use client';

import React, { useState, useEffect } from 'react';
import { createSpeechRecognitionService } from '@/lib/accessibility/speechRecognition';

// Global styles for accessibility features
const globalStyles = `
  /* High contrast mode */
  body.high-contrast {
    --background: #000000;
    --foreground: #ffffff;
    --primary: #ffff00;
    --primary-foreground: #000000;
    --secondary: #00ffff;
    --secondary-foreground: #000000;
    --muted: #333333;
    --muted-foreground: #ffffff;
    --accent: #ff00ff;
    --accent-foreground: #000000;
    --destructive: #ff0000;
    --destructive-foreground: #ffffff;
    --border: #ffffff;
    --input: #333333;
    --ring: #ffff00;
  }
  
  /* Focus mode */
  body.focus-mode *:focus {
    outline: 3px solid var(--ring) !important;
    outline-offset: 2px !important;
  }
  
  body.focus-mode .focus-highlight:hover {
    box-shadow: 0 0 0 3px var(--ring) !important;
  }
  
  /* Simplified interface */
  body.simplified-interface {
    --radius: 0.25rem;
  }
  
  body.simplified-interface .simplified-hidden {
    display: none !important;
  }
  
  /* Font size adjustments */
  html {
    font-size: var(--base-font-size, 16px);
  }
  
  /* Line spacing */
  p, li, td, th, input, textarea, button, label, div {
    line-height: var(--line-spacing, 1.5) !important;
  }
  
  /* Letter spacing */
  body {
    letter-spacing: var(--letter-spacing, 0) !important;
    font-family: var(--font-family, var(--font-sans)) !important;
  }
  
  /* Cursor size */
  a, button, [role="button"], input, select, textarea {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='var(--cursor-size, 24)' height='var(--cursor-size, 24)' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z'/%3E%3Cpath d='m13 13 6 6'/%3E%3C/svg%3E") 0 0, pointer !important;
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  html[style*="--reduce-motion:reduce"] *, 
  html[style*="--reduce-motion:reduce"] *::before, 
  html[style*="--reduce-motion:reduce"] *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Reading guide */
  .reading-guide {
    position: absolute;
    height: 2rem;
    background-color: rgba(255, 255, 0, 0.2);
    pointer-events: none;
    z-index: 9999;
    left: 0;
    right: 0;
    display: none;
  }
  
  body[data-reading-guide="true"] .reading-guide {
    display: block;
  }
`;

export function AccessibilityGlobalStyles() {
  useEffect(() => {
    // Add global styles
    const styleElement = document.createElement('style');
    styleElement.id = 'accessibility-global-styles';
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    // Add reading guide element
    const readingGuide = document.createElement('div');
    readingGuide.className = 'reading-guide';
    document.body.appendChild(readingGuide);
    
    // Track mouse for reading guide
    const handleMouseMove = (e: MouseEvent) => {
      if (document.body.getAttribute('data-reading-guide') === 'true') {
        const guide = document.querySelector('.reading-guide') as HTMLElement;
        if (guide) {
          guide.style.top = `${e.clientY - 16}px`;
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Initialize text-to-speech functionality
    const initTextToSpeech = () => {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          
          if (settings.textToSpeech) {
            // Add click handler for text-to-speech
            const handleTextToSpeech = (e: MouseEvent) => {
              const target = e.target as HTMLElement;
              
              // Only read text content of paragraphs, headings, list items, etc.
              const validElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'DIV'];
              
              if (validElements.includes(target.tagName) && target.textContent) {
                const utterance = new SpeechSynthesisUtterance(target.textContent);
                utterance.lang = 'en-GB'; // Default to UK English
                utterance.rate = settings.readingSpeed || 1;
                
                window.speechSynthesis.cancel(); // Cancel any ongoing speech
                window.speechSynthesis.speak(utterance);
                
                // Add visual indication
                target.classList.add('speaking');
                utterance.onend = () => {
                  target.classList.remove('speaking');
                };
              }
            };
            
            document.addEventListener('click', handleTextToSpeech);
            
            // Add style for speaking elements
            const speakingStyle = document.createElement('style');
            speakingStyle.innerHTML = `
              .speaking {
                background-color: rgba(0, 123, 255, 0.1);
                border-radius: 0.25rem;
              }
            `;
            document.head.appendChild(speakingStyle);
            
            return () => {
              document.removeEventListener('click', handleTextToSpeech);
              document.head.removeChild(speakingStyle);
            };
          }
        } catch (error) {
          console.error('Error initializing text-to-speech:', error);
        }
      }
    };
    
    const textToSpeechCleanup = initTextToSpeech();
    
    // Watch for settings changes
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          
          // Update reading guide
          if (settings.readingGuide) {
            document.body.setAttribute('data-reading-guide', 'true');
          } else {
            document.body.removeAttribute('data-reading-guide');
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check for reading guide
    handleStorageChange();
    
    return () => {
      // Clean up
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
      
      if (readingGuide.parentNode) {
        document.body.removeChild(readingGuide);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('storage', handleStorageChange);
      
      if (textToSpeechCleanup) {
        textToSpeechCleanup();
      }
    };
  }, []);
  
  return null;
}

export default AccessibilityGlobalStyles;
