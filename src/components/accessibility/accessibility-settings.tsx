'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({
  className = ''
}: AccessibilitySettingsProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Mock user accessibility settings
  const [settings, setSettings] = useState({
    textToSpeech: true,
    speechToText: true,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    readingGuide: false,
    dyslexiaFont: false,
    colourBlindMode: 'none',
    autoPlayVideos: false,
    captionsEnabled: true,
    readingSpeed: 'medium',
    soundEffects: true,
    notificationSounds: true,
    hapticFeedback: false,
    customTheme: 'default'
  });
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaved(false);
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      showToast({
        title: 'Accessibility settings saved',
        type: 'success'
      });
    }, 1000);
  };
  
  // Reset saved state when settings change
  useEffect(() => {
    setSaved(false);
  }, [settings]);
  
  const tabs = [
    {
      id: 'visual',
      label: 'Visual Settings',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Display Preferences</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="High contrast mode"
                  checked={settings.highContrast}
                  onChange={(checked) => handleSettingChange('highContrast', checked)}
                  description="Increases contrast between text and background for better readability"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Large text"
                  checked={settings.largeText}
                  onChange={(checked) => handleSettingChange('largeText', checked)}
                  description="Increases the default font size throughout the platform"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Reduced motion"
                  checked={settings.reducedMotion}
                  onChange={(checked) => handleSettingChange('reducedMotion', checked)}
                  description="Minimises animations and transitions"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Reading guide"
                  checked={settings.readingGuide}
                  onChange={(checked) => handleSettingChange('readingGuide', checked)}
                  description="Displays a reading guide to help focus on current text"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Use dyslexia-friendly font"
                  checked={settings.dyslexiaFont}
                  onChange={(checked) => handleSettingChange('dyslexiaFont', checked)}
                  description="Uses a font designed to be more readable for users with dyslexia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Colour blind mode</label>
                <Select
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'protanopia', label: 'Protanopia (red-blind)' },
                    { value: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
                    { value: 'tritanopia', label: 'Tritanopia (blue-blind)' },
                    { value: 'achromatopsia', label: 'Achromatopsia (monochromacy)' }
                  ]}
                  value={settings.colourBlindMode}
                  onChange={(value) => handleSettingChange('colourBlindMode', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts colours to be more distinguishable for different types of colour blindness</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Custom theme</label>
                <Select
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'blue', label: 'Blue (reduced blue light)' },
                    { value: 'sepia', label: 'Sepia (warm tones)' }
                  ]}
                  value={settings.customTheme}
                  onChange={(value) => handleSettingChange('customTheme', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Choose a theme that works best for your visual preferences</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Media Preferences</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Automatically play videos"
                  checked={settings.autoPlayVideos}
                  onChange={(checked) => handleSettingChange('autoPlayVideos', checked)}
                  description="Videos will play automatically when loaded"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Enable captions by default"
                  checked={settings.captionsEnabled}
                  onChange={(checked) => handleSettingChange('captionsEnabled', checked)}
                  description="Automatically enable captions for videos when available"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Reading speed preference</label>
                <Select
                  options={[
                    { value: 'slow', label: 'Slow' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'fast', label: 'Fast' }
                  ]}
                  value={settings.readingSpeed}
                  onChange={(value) => handleSettingChange('readingSpeed', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the default speed for text-to-speech and guided reading features</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'audio',
      label: 'Audio & Speech',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Speech Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable text-to-speech"
                  checked={settings.textToSpeech}
                  onChange={(checked) => handleSettingChange('textToSpeech', checked)}
                  description="Allows text content to be read aloud"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Enable speech-to-text"
                  checked={settings.speechToText}
                  onChange={(checked) => handleSettingChange('speechToText', checked)}
                  description="Allows voice input for text fields and search"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Screen reader compatibility mode"
                  checked={settings.screenReader}
                  onChange={(checked) => handleSettingChange('screenReader', checked)}
                  description="Optimises content for screen readers and assistive technologies"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Voice selection</label>
                <Select
                  options={[
                    { value: 'uk_female_1', label: 'UK English - Female 1' },
                    { value: 'uk_female_2', label: 'UK English - Female 2' },
                    { value: 'uk_male_1', label: 'UK English - Male 1' },
                    { value: 'uk_male_2', label: 'UK English - Male 2' },
                    { value: 'child_voice', label: 'Child Voice' }
                  ]}
                  value="uk_female_1"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Select the voice for text-to-speech features</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Speech rate</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Slow</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    defaultValue="1"
                    className="w-full" 
                  />
                  <span className="text-sm">Fast</span>
                </div>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Speech pitch</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Low</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    defaultValue="1"
                    className="w-full" 
                  />
                  <span className="text-sm">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Sound Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable sound effects"
                  checked={settings.soundEffects}
                  onChange={(checked) => handleSettingChange('soundEffects', checked)}
                  description="Play sound effects for interactions and achievements"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Enable notification sounds"
                  checked={settings.notificationSounds}
                  onChange={(checked) => handleSettingChange('notificationSounds', checked)}
                  description="Play sounds for notifications and alerts"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Sound volume</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Low</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1" 
                    defaultValue="80"
                    className="w-full" 
                  />
                  <span className="text-sm">High</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Test Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'interaction',
      label: 'Interaction',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Input Methods</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enhanced keyboard navigation"
                  checked={settings.keyboardNavigation}
                  onChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                  description="Improves keyboard navigation throughout the platform"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Haptic feedback"
                  checked={settings.hapticFeedback}
                  onChange={(checked) => handleSettingChange('hapticFeedback', checked)}
                  description="Provides tactile feedback for touch interactions (on supported devices)"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Keyboard shortcuts</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'enhanced', label: 'Enhanced' },
                    { value: 'custom', label: 'Custom' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Choose keyboard shortcut configuration</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Touch target size</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'large', label: 'Large' },
                    { value: 'extra_large', label: 'Extra Large' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the size of buttons and interactive elements</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Cursor size</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'large', label: 'Large' },
                    { value: 'extra_large', label: 'Extra Large' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the size of the cursor</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Timing & Pacing</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Interaction timeout</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'extended', label: 'Extended (1.5x)' },
                    { value: 'double', label: 'Double (2x)' },
                    { value: 'none', label: 'No timeout' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts how long interactive elements remain active</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Animation speed</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'slow', label: 'Slow' },
                    { value: 'very_slow', label: 'Very Slow' },
                    { value: 'none', label: 'No Animations' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the speed of animations and transitions</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Auto-advance timing</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'slow', label: 'Slow' },
                    { value: 'very_slow', label: 'Very Slow' },
                    { value: 'manual', label: 'Manual Only' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Controls timing for slideshows and auto-advancing content</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'cognitive',
      label: 'Cognitive Support',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Reading & Comprehension</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Simplified view"
                  checked={false}
                  onChange={() => {}}
                  description="Reduces visual complexity and distractions"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Focus mode"
                  checked={false}
                  onChange={() => {}}
                  description="Highlights active content and dims surrounding elements"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Reading ruler"
                  checked={false}
                  onChange={() => {}}
                  description="Displays a horizontal guide to help track lines of text"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Highlight text while speaking"
                  checked={true}
                  onChange={() => {}}
                  description="Highlights text as it's being read aloud"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Text complexity</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'simplified', label: 'Simplified' },
                    { value: 'very_simplified', label: 'Very Simplified' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the complexity of text content when available</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Learning Support</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Show additional explanations"
                  checked={true}
                  onChange={() => {}}
                  description="Provides additional context and explanations for complex concepts"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Visual aids for instructions"
                  checked={true}
                  onChange={() => {}}
                  description="Includes visual aids alongside text instructions"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Step-by-step guidance"
                  checked={true}
                  onChange={() => {}}
                  description="Breaks complex tasks into smaller, manageable steps"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Progress tracking"
                  checked={true}
                  onChange={() => {}}
                  description="Shows visual indicators of progress through content"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Learning pace</label>
                <Select
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'gradual', label: 'Gradual' },
                    { value: 'very_gradual', label: 'Very Gradual' },
                    { value: 'self_paced', label: 'Self-paced' }
                  ]}
                  value="standard"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts the pace of learning activities and assessments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Accessibility Settings</h2>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600">Settings saved</span>
          )}
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : 'Save Settings'}
          </Button>
        </div>
      </div>
      
      <Tabs tabs={tabs} />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Accessibility Profile</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You can save your accessibility settings as a profile to quickly apply them across devices.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Profile Name</label>
                <Input 
                  placeholder="e.g., My Accessibility Settings"
                  className="w-full"
                />
              </div>
              
              <div className="flex items-end gap-2">
                <Button variant="outline" className="flex-1">
                  Save as Profile
                </Button>
                <Button variant="outline">
                  Load Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
