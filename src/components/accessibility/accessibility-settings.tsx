'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard, 
  Volume2, 
  Eye, 
  Sparkles, 
  Wand2, 
  Check,
  RefreshCw
} from 'lucide-react';

export default function AccessibilitySettings() {
  // Visual settings
  const [theme, setTheme] = useState('system');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  
  // Reading and navigation settings
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [cursorSize, setCursorSize] = useState('medium');
  
  // Cognitive settings
  const [simplifiedInterface, setSimplifiedInterface] = useState(false);
  const [extendedTimers, setExtendedTimers] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Apply settings to document
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const html = document.documentElement;
    
    // Apply font size
    html.style.fontSize = `${fontSize}%`;
    
    // Apply line spacing
    document.body.style.lineHeight = lineSpacing.toString();
    
    // Apply letter spacing
    document.body.style.letterSpacing = `${letterSpacing}px`;
    
    // Apply dyslexic font
    if (dyslexicFont) {
      html.style.fontFamily = "'OpenDyslexic', sans-serif";
    } else {
      html.style.fontFamily = '';
    }
    
    // Apply high contrast
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      html.classList.add('reduced-motion');
    } else {
      html.classList.remove('reduced-motion');
    }
    
    // Apply simplified interface
    if (simplifiedInterface) {
      html.classList.add('simplified-interface');
    } else {
      html.classList.remove('simplified-interface');
    }
    
    // Apply focus mode
    if (focusMode) {
      html.classList.add('focus-mode');
    } else {
      html.classList.remove('focus-mode');
    }
    
    // Apply keyboard navigation
    if (keyboardNavigation) {
      html.classList.add('keyboard-focus');
    } else {
      html.classList.remove('keyboard-focus');
    }
    
    // Apply cursor size
    switch (cursorSize) {
      case 'large':
        html.classList.add('cursor-large');
        html.classList.remove('cursor-medium', 'cursor-small');
        break;
      case 'medium':
        html.classList.add('cursor-medium');
        html.classList.remove('cursor-large', 'cursor-small');
        break;
      case 'small':
        html.classList.add('cursor-small');
        html.classList.remove('cursor-large', 'cursor-medium');
        break;
    }
    
    // Clean up on unmount
    return () => {
      html.style.fontSize = '';
      document.body.style.lineHeight = '';
      document.body.style.letterSpacing = '';
      html.style.fontFamily = '';
      html.classList.remove(
        'high-contrast', 
        'reduced-motion', 
        'simplified-interface', 
        'focus-mode', 
        'keyboard-focus',
        'cursor-large',
        'cursor-medium',
        'cursor-small'
      );
    };
  }, [
    fontSize, 
    lineSpacing, 
    letterSpacing, 
    dyslexicFont, 
    highContrast, 
    reducedMotion, 
    simplifiedInterface, 
    focusMode, 
    keyboardNavigation, 
    cursorSize
  ]);
  
  // Save settings to local storage
  const saveSettings = () => {
    const settings = {
      theme,
      highContrast,
      reducedMotion,
      fontSize,
      lineSpacing,
      letterSpacing,
      dyslexicFont,
      textToSpeech,
      readingGuide,
      readingSpeed,
      keyboardNavigation,
      cursorSize,
      simplifiedInterface,
      extendedTimers,
      focusMode
    };
    
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    toast("Settings Saved", {
      description: "Your accessibility settings have been saved.",
      duration: 3000,
    });
  };
  
  // Load settings from local storage
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const savedSettings = localStorage.getItem('accessibility-settings');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        setTheme(settings.theme || 'system');
        setHighContrast(settings.highContrast || false);
        setReducedMotion(settings.reducedMotion || false);
        setFontSize(settings.fontSize || 100);
        setLineSpacing(settings.lineSpacing || 1.5);
        setLetterSpacing(settings.letterSpacing || 0);
        setDyslexicFont(settings.dyslexicFont || false);
        setTextToSpeech(settings.textToSpeech || false);
        setReadingGuide(settings.readingGuide || false);
        setReadingSpeed(settings.readingSpeed || 1);
        setKeyboardNavigation(settings.keyboardNavigation || false);
        setCursorSize(settings.cursorSize || 'medium');
        setSimplifiedInterface(settings.simplifiedInterface || false);
        setExtendedTimers(settings.extendedTimers || false);
        setFocusMode(settings.focusMode || false);
      } catch (error) {
        console.error('Failed to parse saved accessibility settings:', error);
      }
    }
  }, []);
  
  // Reset settings to defaults
  const resetSettings = () => {
    setTheme('system');
    setHighContrast(false);
    setReducedMotion(false);
    setFontSize(100);
    setLineSpacing(1.5);
    setLetterSpacing(0);
    setDyslexicFont(false);
    setTextToSpeech(false);
    setReadingGuide(false);
    setReadingSpeed(1);
    setKeyboardNavigation(false);
    setCursorSize('medium');
    setSimplifiedInterface(false);
    setExtendedTimers(false);
    setFocusMode(false);
    
    localStorage.removeItem('accessibility-settings');
    
    toast("Settings Reset", {
      description: "Your accessibility settings have been reset to defaults.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Accessibility Settings</h1>
      
      <Tabs defaultValue="visual">
        <TabsList className="grid grid-cols-3 w-[400px] mb-6">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="reading">Reading & Navigation</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>
                Customise the visual appearance of the platform to suit your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-centre">
                        <Sun className="h-4 w-4 mr-2" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-centre">
                        <Moon className="h-4 w-4 mr-2" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-centre">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="block mb-1">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="reduced-motion" className="block mb-1">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-centre justify-between">
                  <Label htmlFor="font-size">Font Size ({fontSize}%)</Label>
                  <div className="flex items-centre">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(Math.max(70, fontSize - 10))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Slider
                  id="font-size"
                  min={70}
                  max={200}
                  step={10}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="line-spacing">Line Spacing ({lineSpacing})</Label>
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
                <Label htmlFor="letter-spacing">Letter Spacing ({letterSpacing}px)</Label>
                <Slider
                  id="letter-spacing"
                  min={0}
                  max={5}
                  step={0.5}
                  value={[letterSpacing]}
                  onValueChange={(value) => setLetterSpacing(value[0])}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="dyslexic-font" className="block mb-1">Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">
                    Use OpenDyslexic font for improved readability
                  </p>
                </div>
                <Switch
                  id="dyslexic-font"
                  checked={dyslexicFont}
                  onCheckedChange={setDyslexicFont}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reading">
          <Card>
            <CardHeader>
              <CardTitle>Reading & Navigation Settings</CardTitle>
              <CardDescription>
                Customise reading and navigation features to improve accessibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="text-to-speech" className="block mb-1">Text to Speech</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable text-to-speech for reading content aloud
                  </p>
                </div>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeech}
                  onCheckedChange={setTextToSpeech}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="reading-guide" className="block mb-1">Reading Guide</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a reading guide to help focus on current line
                  </p>
                </div>
                <Switch
                  id="reading-guide"
                  checked={readingGuide}
                  onCheckedChange={setReadingGuide}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reading-speed">Reading Speed ({readingSpeed}x)</Label>
                <Slider
                  id="reading-speed"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[readingSpeed]}
                  onValueChange={(value) => setReadingSpeed(value[0])}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="keyboard-navigation" className="block mb-1">Enhanced Keyboard Navigation</Label>
                  <p className="text-sm text-muted-foreground">
                    Improve focus indicators and keyboard shortcuts
                  </p>
                </div>
                <Switch
                  id="keyboard-navigation"
                  checked={keyboardNavigation}
                  onCheckedChange={setKeyboardNavigation}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cursor-size">Cursor Size</Label>
                <Select value={cursorSize} onValueChange={setCursorSize}>
                  <SelectTrigger id="cursor-size">
                    <SelectValue placeholder="Select cursor size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cognitive">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Support Settings</CardTitle>
              <CardDescription>
                Customise features to support different cognitive needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="simplified-interface" className="block mb-1">Simplified Interface</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce visual complexity and distractions
                  </p>
                </div>
                <Switch
                  id="simplified-interface"
                  checked={simplifiedInterface}
                  onCheckedChange={setSimplifiedInterface}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="extended-timers" className="block mb-1">Extended Timers</Label>
                  <p className="text-sm text-muted-foreground">
                    Provide additional time for timed activities
                  </p>
                </div>
                <Switch
                  id="extended-timers"
                  checked={extendedTimers}
                  onCheckedChange={setExtendedTimers}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div>
                  <Label htmlFor="focus-mode" className="block mb-1">Focus Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight active elements and reduce distractions
                  </p>
                </div>
                <Switch
                  id="focus-mode"
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
              
              <Separator />
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Recommended Settings</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">For ADHD:</p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Enable Focus Mode</li>
                      <li>Enable Reduced Motion</li>
                      <li>Enable Extended Timers</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">For Dyslexia:</p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Enable Dyslexia-Friendly Font</li>
                      <li>Increase Line Spacing (1.8+)</li>
                      <li>Enable Reading Guide</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">For Visual Processing:</p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Enable High Contrast</li>
                      <li>Increase Font Size (120%+)</li>
                      <li>Enable Simplified Interface</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={saveSettings}>
          <Check className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
