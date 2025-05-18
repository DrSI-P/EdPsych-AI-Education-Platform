import React, { useState, useEffect } from 'react';

interface AccessibilityControlsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  initialFontSize?: number;
  initialContrast?: 'normal' | 'high' | 'dark';
  initialReduceMotion?: boolean;
  initialDyslexicFont?: boolean;
}

/**
 * AccessibilityControls component that provides user controls for accessibility features
 * including font size, contrast, motion reduction, and dyslexic-friendly font
 */
const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  position = 'bottom-right',
  initialFontSize = 16,
  initialContrast = 'normal',
  initialReduceMotion = false,
  initialDyslexicFont = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [contrast, setContrast] = useState(initialContrast);
  const [reduceMotion, setReduceMotion] = useState(initialReduceMotion);
  const [dyslexicFont, setDyslexicFont] = useState(initialDyslexicFont);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  // Apply accessibility settings
  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Apply contrast
    document.body.classList.remove('high-contrast', 'dark-contrast');
    if (contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else if (contrast === 'dark') {
      document.body.classList.add('dark-contrast');
    }
    
    // Apply reduced motion
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Apply dyslexic font
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
    
    // Save settings to localStorage
    localStorage.setItem('accessibility', JSON.stringify({
      fontSize,
      contrast,
      reduceMotion,
      dyslexicFont
    }));
  }, [fontSize, contrast, reduceMotion, dyslexicFont]);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || initialFontSize);
        setContrast(settings.contrast || initialContrast);
        setReduceMotion(settings.reduceMotion || initialReduceMotion);
        setDyslexicFont(settings.dyslexicFont || initialDyslexicFont);
      } catch (e) {
        console.error('Error loading accessibility settings:', e);
      }
    }
  }, [initialFontSize, initialContrast, initialReduceMotion, initialDyslexicFont]);

  return (
    <>
      {/* Global styles for accessibility */}
      <style jsx global>{`
        /* High contrast mode */
        body.high-contrast {
          background-color: white !important;
          color: black !important;
        }
        
        body.high-contrast a,
        body.high-contrast button {
          color: navy !important;
          border-color: navy !important;
        }
        
        body.high-contrast input,
        body.high-contrast textarea,
        body.high-contrast select {
          background-color: white !important;
          color: black !important;
          border: 2px solid black !important;
        }
        
        /* Dark contrast mode */
        body.dark-contrast {
          background-color: black !important;
          color: white !important;
        }
        
        body.dark-contrast a,
        body.dark-contrast button {
          color: yellow !important;
          border-color: yellow !important;
        }
        
        body.dark-contrast input,
        body.dark-contrast textarea,
        body.dark-contrast select {
          background-color: #333 !important;
          color: white !important;
          border: 2px solid white !important;
        }
        
        /* Reduced motion */
        body.reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
        
        /* Dyslexic-friendly font */
        body.dyslexic-font * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
          line-height: 1.5 !important;
        }
        
        /* Font for OpenDyslexic */
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('/fonts/OpenDyslexic-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      
      {/* Accessibility button */}
      <div className={`fixed z-50 ${positionClasses[position]}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Accessibility options"
          aria-expanded={isOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        
        {/* Accessibility panel */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Accessibility Options</h3>
            
            {/* Font size controls */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <div className="flex items-center">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="bg-gray-200 p-2 rounded-l hover:bg-gray-300"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <div className="px-3 py-2 bg-gray-100 text-center flex-grow">
                  {fontSize}px
                </div>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="bg-gray-200 p-2 rounded-r hover:bg-gray-300"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>
            
            {/* Contrast controls */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrast</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setContrast('normal')}
                  className={`p-2 rounded ${contrast === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setContrast('high')}
                  className={`p-2 rounded ${contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  High
                </button>
                <button
                  onClick={() => setContrast('dark')}
                  className={`p-2 rounded ${contrast === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Dark
                </button>
              </div>
            </div>
            
            {/* Toggle switches */}
            <div className="space-y-3">
              {/* Reduce motion toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Reduce Motion</label>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${reduceMotion ? 'bg-blue-600' : 'bg-gray-300'}`}
                  role="switch"
                  aria-checked={reduceMotion}
                >
                  <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              {/* Dyslexic font toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Dyslexic Font</label>
                <button
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${dyslexicFont ? 'bg-blue-600' : 'bg-gray-300'}`}
                  role="switch"
                  aria-checked={dyslexicFont}
                >
                  <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${dyslexicFont ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            
            {/* Reset button */}
            <button
              onClick={() => {
                setFontSize(initialFontSize);
                setContrast(initialContrast);
                setReduceMotion(initialReduceMotion);
                setDyslexicFont(initialDyslexicFont);
              }}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset to Defaults
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AccessibilityControls;
