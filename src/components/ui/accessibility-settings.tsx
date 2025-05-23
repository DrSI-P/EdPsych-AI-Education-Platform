'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className = '' }: AccessibilitySettingsProps) {
  // Visual settings
  const [theme, setTheme] = useState('system');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  
  // Reading & Navigation settings
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [enhancedKeyboard, setEnhancedKeyboard] = useState(false);
  const [cursorSize, setCursorSize] = useState('medium');
  
  // Cognitive Support settings
  const [simplifiedInterface, setSimplifiedInterface] = useState(false);
  const [extendedTimers, setExtendedTimers] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [presetProfile, setPresetProfile] = useState('none');
  
  // Apply settings to document
  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    
    // Apply font size
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    
    // Apply line spacing
    root.style.setProperty('--line-spacing', `${lineSpacing}`);
    
    // Apply letter spacing
    root.style.setProperty('--letter-spacing', `${letterSpacing}px`);
    
    // Apply dyslexia font
    if (dyslexiaFont) {
      root.style.setProperty('--font-family', '"OpenDyslexic", sans-serif');
    } else {
      root.style.setProperty('--font-family', 'var(--font-sans)');
    }
    
    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      root.style.setProperty('--reduce-motion', 'reduce');
    } else {
      root.style.setProperty('--reduce-motion', 'no-preference');
    }
    
    // Apply cursor size
    switch (cursorSize) {
      case 'small':
        root.style.setProperty('--cursor-size', '16px');
        break;
      case 'medium':
        root.style.setProperty('--cursor-size', '24px');
        break;
      case 'large':
        root.style.setProperty('--cursor-size', '32px');
        break;
      case 'x-large':
        root.style.setProperty('--cursor-size', '48px');
        break;
    }
    
    // Apply simplified interface
    if (simplifiedInterface) {
      document.body.classList.add('simplified-interface');
    } else {
      document.body.classList.remove('simplified-interface');
    }
    
    // Apply focus mode
    if (focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    
    // Save settings to localStorage
    const settings = {
      theme,
      highContrast,
      reducedMotion,
      fontSize,
      lineSpacing,
      letterSpacing,
      dyslexiaFont,
      textToSpeech,
      readingGuide,
      readingSpeed,
      enhancedKeyboard,
      cursorSize,
      simplifiedInterface,
      extendedTimers,
      focusMode,
      presetProfile
    };
    
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [
    theme,
    highContrast,
    reducedMotion,
    fontSize,
    lineSpacing,
    letterSpacing,
    dyslexiaFont,
    textToSpeech,
    readingGuide,
    readingSpeed,
    enhancedKeyboard,
    cursorSize,
    simplifiedInterface,
    extendedTimers,
    focusMode,
    presetProfile
  ]);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      setTheme(settings.theme || 'system');
      setHighContrast(settings.highContrast || false);
      setReducedMotion(settings.reducedMotion || false);
      setFontSize(settings.fontSize || 16);
      setLineSpacing(settings.lineSpacing || 1.5);
      setLetterSpacing(settings.letterSpacing || 0);
      setDyslexiaFont(settings.dyslexiaFont || false);
      setTextToSpeech(settings.textToSpeech || false);
      setReadingGuide(settings.readingGuide || false);
      setReadingSpeed(settings.readingSpeed || 1);
      setEnhancedKeyboard(settings.enhancedKeyboard || false);
      setCursorSize(settings.cursorSize || 'medium');
      setSimplifiedInterface(settings.simplifiedInterface || false);
      setExtendedTimers(settings.extendedTimers || false);
      setFocusMode(settings.focusMode || false);
      setPresetProfile(settings.presetProfile || 'none');
    }
  }, []);
  
  // Apply preset profiles
  const applyPresetProfile = (profile: string) => {
    setPresetProfile(profile);
    
    switch (profile) {
      case 'dyslexia':
        setDyslexiaFont(true);
        setFontSize(18);
        setLineSpacing(2);
        setLetterSpacing(1);
        setReadingGuide(true);
        break;
        
      case 'visual-impairment':
        setFontSize(20);
        setHighContrast(true);
        setTextToSpeech(true);
        setCursorSize('large');
        break;
        
      case 'adhd':
        setFocusMode(true);
        setSimplifiedInterface(true);
        setExtendedTimers(true);
        break;
        
      case 'motor-difficulties':
        setEnhancedKeyboard(true);
        setCursorSize('large');
        setExtendedTimers(true);
        break;
        
      case 'none':
        // Reset to defaults
        setDyslexiaFont(false);
        setFontSize(16);
        setLineSpacing(1.5);
        setLetterSpacing(0);
        setHighContrast(false);
        setTextToSpeech(false);
        setCursorSize('medium');
        setFocusMode(false);
        setSimplifiedInterface(false);
        setExtendedTimers(false);
        setEnhancedKeyboard(false);
        setReadingGuide(false);
        break;
    }
  };
  
  return (
    <div className={`accessibility-settings ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
          <CardDescription>
            Customize your experience to meet your accessibility needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="visual">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="reading">Reading & Navigation</TabsTrigger>
              <TabsTrigger value="cognitive">Cognitive Support</TabsTrigger>
            </TabsList>
            
            {/* Visual Settings Tab */}
            <TabsContent value="visual" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="line-spacing">Line Spacing: {lineSpacing}x</Label>
                </div>
                <Slider
                  id="line-spacing"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[lineSpacing]}
                  onValueChange={(value) => setLineSpacing(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="letter-spacing">Letter Spacing: {letterSpacing}px</Label>
                </div>
                <Slider
                  id="letter-spacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[letterSpacing]}
                  onValueChange={(value) => setLetterSpacing(value[0])}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-gray-500">Use OpenDyslexic font</p>
                </div>
                <Switch
                  id="dyslexia-font"
                  checked={dyslexiaFont}
                  onCheckedChange={setDyslexiaFont}
                />
              </div>
            </TabsContent>
            
            {/* Reading & Navigation Tab */}
            <TabsContent value="reading" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                  <p className="text-sm text-gray-500">Read text aloud when selected</p>
                </div>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeech}
                  onCheckedChange={setTextToSpeech}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reading-guide">Reading Guide</Label>
                  <p className="text-sm text-gray-500">Show a guide line when reading</p>
                </div>
                <Switch
                  id="reading-guide"
                  checked={readingGuide}
                  onCheckedChange={setReadingGuide}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="reading-speed">Reading Speed: {readingSpeed}x</Label>
                </div>
                <Slider
                  id="reading-speed"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[readingSpeed]}
                  onValueChange={(value) => setReadingSpeed(value[0])}
                  disabled={!textToSpeech}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enhanced-keyboard">Enhanced Keyboard Navigation</Label>
                  <p className="text-sm text-gray-500">Improved keyboard focus and shortcuts</p>
                </div>
                <Switch
                  id="enhanced-keyboard"
                  checked={enhancedKeyboard}
                  onCheckedChange={setEnhancedKeyboard}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cursor-size">Cursor Size</Label>
                <RadioGroup
                  id="cursor-size"
                  value={cursorSize}
                  onValueChange={setCursorSize}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="small" id="cursor-small" />
                    <Label htmlFor="cursor-small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="medium" id="cursor-medium" />
                    <Label htmlFor="cursor-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="large" id="cursor-large" />
                    <Label htmlFor="cursor-large">Large</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="x-large" id="cursor-x-large" />
                    <Label htmlFor="cursor-x-large">X-Large</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            {/* Cognitive Support Tab */}
            <TabsContent value="cognitive" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="simplified-interface">Simplified Interface</Label>
                  <p className="text-sm text-gray-500">Reduce visual complexity</p>
                </div>
                <Switch
                  id="simplified-interface"
                  checked={simplifiedInterface}
                  onCheckedChange={setSimplifiedInterface}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="extended-timers">Extended Timers</Label>
                  <p className="text-sm text-gray-500">Increase time limits for interactions</p>
                </div>
                <Switch
                  id="extended-timers"
                  checked={extendedTimers}
                  onCheckedChange={setExtendedTimers}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="focus-mode">Focus Mode</Label>
                  <p className="text-sm text-gray-500">Highlight active elements and reduce distractions</p>
                </div>
                <Switch
                  id="focus-mode"
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="preset-profile">Recommended Settings Profiles</Label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-500" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white dark:bg-gray-800 p-2 rounded shadow-lg text-sm w-64 z-50">
                      These profiles apply recommended settings for specific needs. You can further customize after applying.
                    </div>
                  </div>
                </div>
                <Select value={presetProfile} onValueChange={applyPresetProfile}>
                  <SelectTrigger id="preset-profile">
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Default Settings</SelectItem>
                    <SelectItem value="dyslexia">Dyslexia Support</SelectItem>
                    <SelectItem value="visual-impairment">Visual Impairment</SelectItem>
                    <SelectItem value="adhd">ADHD Support</SelectItem>
                    <SelectItem value="motor-difficulties">Motor Difficulties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AccessibilitySettings;
