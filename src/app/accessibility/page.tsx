'use client';

import { useState } from 'react';
import { AccessibilityControls } from '@/components/ai/accessibility/accessibility-controls';

export default function AccessibilityPage() {
  const [settings, setSettings] = useState({
    highContrast: {
      enabled: false,
      contrastLevel: 75,
      boldText: false,
      largerText: false,
      highlightLinks: false,
      highlightButtons: false,
      customColors: false
    },
    keyboardNavigation: {
      enabled: false,
      highlightFocus: true,
      keyboardShortcuts: true,
      skipToContent: true,
      arrowNavigation: true,
      tabTrap: true
    },
    reducedMotion: {
      enabled: false,
      reduceAnimations: true,
      disableAutoplay: true,
      reduceTransitions: true,
      disableParallaxEffects: true,
      disableScrollEffects: false
    },
    screenReader: {
      enabled: false,
      verbosityLevel: 'medium',
      readImages: true,
      readLinks: true,
      readHeadings: true
    }
  });
  
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
        <p className="text-muted-foreground">
          Customise your experience to meet your individual needs and preferences. These settings will be applied across the entire platform.
        </p>
      </div>
      
      <AccessibilityControls 
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
