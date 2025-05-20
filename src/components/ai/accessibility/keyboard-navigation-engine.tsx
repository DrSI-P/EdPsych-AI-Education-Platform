'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Keyboard, Check, RefreshCw, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Info } from "lucide-react";
import { useSession } from 'next-auth/react';

interface KeyboardNavigationProps {
  onSettingsChange?: (settings: KeyboardNavigationSettings) => void;
  className?: string;
}

interface KeyboardNavigationSettings {
  enabled: boolean;
  highlightFocus: boolean;
  skipLinks: boolean;
  keyboardShortcuts: boolean;
  tabSize: 'normal' | 'large' | 'extra-large';
  focusIndicatorSize: number;
  focusIndicatorColor: 'blue' | 'yellow' | 'green' | 'purple' | 'custom';
  customFocusColor?: string;
}

export default function KeyboardNavigationEngine({
  onSettingsChange,
  className = '',
}: KeyboardNavigationProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for keyboard navigation settings
  const [settings, setSettings] = useState<KeyboardNavigationSettings>({
    enabled: false,
    highlightFocus: true,
    skipLinks: true,
    keyboardShortcuts: true,
    tabSize: 'normal',
    focusIndicatorSize: 3,
    focusIndicatorColor: 'blue',
    customFocusColor: '#0066cc',
  });
  
  const [isApplied, setIsApplied] = useState(false);
  const [currentFocusDemo, setCurrentFocusDemo] = useState(0);
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      fetch('/api/ai/accessibility')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            // Update local settings from user preferences if available
            const userSettings = data.settings;
            if (userSettings.keyboardNavigation !== undefined) {
              setSettings(prev => ({
                ...prev,
                enabled: userSettings.keyboardNavigation,
                // Add other settings if available in the API response
                ...(userSettings.highlightFocus !== undefined && { 
                  highlightFocus: userSettings.highlightFocus 
                }),
                ...(userSettings.skipLinks !== undefined && { 
                  skipLinks: userSettings.skipLinks 
                }),
                ...(userSettings.keyboardShortcuts !== undefined && { 
                  keyboardShortcuts: userSettings.keyboardShortcuts 
                }),
                ...(userSettings.tabSize && { 
                  tabSize: userSettings.tabSize 
                }),
                ...(userSettings.focusIndicatorSize && { 
                  focusIndicatorSize: userSettings.focusIndicatorSize 
                }),
                ...(userSettings.focusIndicatorColor && { 
                  focusIndicatorColor: userSettings.focusIndicatorColor 
                }),
                ...(userSettings.customFocusColor && { 
                  customFocusColor: userSettings.customFocusColor 
                }),
              }));
              
              // If keyboard navigation was already enabled, apply it
              if (userSettings.keyboardNavigation) {
                applyKeyboardNavigation({
                  ...settings,
                  enabled: userSettings.keyboardNavigation,
                  ...(userSettings.highlightFocus !== undefined && { 
                    highlightFocus: userSettings.highlightFocus 
                  }),
                  ...(userSettings.skipLinks !== undefined && { 
                    skipLinks: userSettings.skipLinks 
                  }),
                  ...(userSettings.keyboardShortcuts !== undefined && { 
                    keyboardShortcuts: userSettings.keyboardShortcuts 
                  }),
                  ...(userSettings.tabSize && { 
                    tabSize: userSettings.tabSize 
                  }),
                  ...(userSettings.focusIndicatorSize && { 
                    focusIndicatorSize: userSettings.focusIndicatorSize 
                  }),
                  ...(userSettings.focusIndicatorColor && { 
                    focusIndicatorColor: userSettings.focusIndicatorColor 
                  }),
                  ...(userSettings.customFocusColor && { 
                    customFocusColor: userSettings.customFocusColor 
                  }),
                });
                setIsApplied(true);
              }
            }
          }
        })
        .catch(error => {
          console.error('Error loading accessibility settings:', error);
        });
    }
  }, [session]);
  
  // Apply keyboard navigation settings to the page
  const applyKeyboardNavigation = (settingsToApply: KeyboardNavigationSettings) => {
    if (!settingsToApply.enabled) {
      // Remove keyboard navigation styles
      document.documentElement.classList.remove(
        'keyboard-navigation',
        'tab-size-normal',
        'tab-size-large',
        'tab-size-extra-large',
        'focus-color-blue',
        'focus-color-yellow',
        'focus-color-green',
        'focus-color-purple',
        'focus-color-custom'
      );
      document.documentElement.style.removeProperty('--focus-indicator-size');
      document.documentElement.style.removeProperty('--custom-focus-color');
      
      // Remove skip links if they exist
      const skipLink = document.getElementById('skip-to-content');
      if (skipLink) {
        skipLink.remove();
      }
      
      return;
    }
    
    // Apply keyboard navigation mode
    document.documentElement.classList.add('keyboard-navigation');
    
    // Apply tab size
    document.documentElement.classList.remove(
      'tab-size-normal',
      'tab-size-large',
      'tab-size-extra-large'
    );
    document.documentElement.classList.add(`tab-size-${settingsToApply.tabSize}`);
    
    // Apply focus indicator color
    document.documentElement.classList.remove(
      'focus-color-blue',
      'focus-color-yellow',
      'focus-color-green',
      'focus-color-purple',
      'focus-color-custom'
    );
    document.documentElement.classList.add(`focus-color-${settingsToApply.focusIndicatorColor}`);
    
    // Set CSS variables for focus indicator size
    document.documentElement.style.setProperty(
      '--focus-indicator-size', 
      `${settingsToApply.focusIndicatorSize}px`
    );
    
    // Set custom focus color if in custom mode
    if (settingsToApply.focusIndicatorColor === 'custom') {
      document.documentElement.style.setProperty(
        '--custom-focus-color', 
        settingsToApply.customFocusColor || '#0066cc'
      );
    }
    
    // Add skip links if enabled
    if (settingsToApply.skipLinks) {
      // Only add if it doesn't already exist
      if (!document.getElementById('skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.id = 'skip-to-content';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Ensure there's a main content target
        if (!document.getElementById('main-content')) {
          const mainContent = document.querySelector('main');
          if (mainContent) {
            mainContent.id = 'main-content';
          }
        }
      }
    } else {
      // Remove skip links if they exist
      const skipLink = document.getElementById('skip-to-content');
      if (skipLink) {
        skipLink.remove();
      }
    }
    
    // Apply keyboard shortcuts if enabled
    if (settingsToApply.keyboardShortcuts) {
      // This would typically be handled by a more comprehensive keyboard shortcuts system
      // For now, we'll just log that it's enabled
      console.log('Keyboard shortcuts enabled');
    }
  };
  
  // Handle settings change
  const handleSettingsChange = (key: keyof KeyboardNavigationSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // If changing the enabled state, apply or remove keyboard navigation immediately
      if (key === 'enabled' && isApplied) {
        applyKeyboardNavigation(newSettings);
      }
      
      // Call the callback if provided
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
      
      return newSettings;
    });
  };
  
  // Apply settings
  const handleApplySettings = () => {
    applyKeyboardNavigation(settings);
    setIsApplied(true);
    
    // Save settings to user profile if logged in
    if (session?.user) {
      fetch('/api/ai/accessibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            keyboardNavigation: settings.enabled,
            highlightFocus: settings.highlightFocus,
            skipLinks: settings.skipLinks,
            keyboardShortcuts: settings.keyboardShortcuts,
            tabSize: settings.tabSize,
            focusIndicatorSize: settings.focusIndicatorSize,
            focusIndicatorColor: settings.focusIndicatorColor,
            customFocusColor: settings.customFocusColor,
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Settings saved",
              description: "Your keyboard navigation settings have been saved to your profile.",
            });
          } else {
            throw new Error(data.error || 'Failed to save settings');
          }
        })
        .catch(error => {
          console.error('Error saving accessibility settings:', error);
          toast({
            title: "Error saving settings",
            description: "Your settings have been applied but could not be saved to your profile.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Settings applied",
        description: "Keyboard navigation settings have been applied. Sign in to save these preferences.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: KeyboardNavigationSettings = {
      enabled: false,
      highlightFocus: true,
      skipLinks: true,
      keyboardShortcuts: true,
      tabSize: 'normal',
      focusIndicatorSize: 3,
      focusIndicatorColor: 'blue',
      customFocusColor: '#0066cc',
    };
    
    setSettings(defaultSettings);
    applyKeyboardNavigation(defaultSettings);
    setIsApplied(true);
    
    toast({
      title: "Settings reset",
      description: "Keyboard navigation settings have been reset to defaults.",
    });
    
    // Save reset settings to user profile if logged in
    if (session?.user) {
      fetch('/api/ai/accessibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            keyboardNavigation: false,
            highlightFocus: true,
            skipLinks: true,
            keyboardShortcuts: true,
            tabSize: 'normal',
            focusIndicatorSize: 3,
            focusIndicatorColor: 'blue',
            customFocusColor: '#0066cc',
          }
        }),
      }).catch(error => {
        console.error('Error resetting accessibility settings:', error);
      });
    }
  };
  
  // Demo focus navigation
  const handleDemoFocusNavigation = (direction: 'next' | 'prev') => {
    const demoItems = 5; // Number of demo items
    
    if (direction === 'next') {
      setCurrentFocusDemo((prev) => (prev + 1) % demoItems);
    } else {
      setCurrentFocusDemo((prev) => (prev - 1 + demoItems) % demoItems);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Navigation
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Optimize navigation for keyboard-only users
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="highlight-focus">Highlight Focus</Label>
                  <p className="text-xs text-muted-foreground">
                    Enhance visibility of focused elements
                  </p>
                </div>
                <Switch 
                  id="highlight-focus"
                  checked={settings.highlightFocus}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('highlightFocus', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="skip-links">Skip Navigation Links</Label>
                  <p className="text-xs text-muted-foreground">
                    Add links to skip to main content
                  </p>
                </div>
                <Switch 
                  id="skip-links"
                  checked={settings.skipLinks}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('skipLinks', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyboard-shortcuts">Keyboard Shortcuts</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable navigation shortcuts
                  </p>
                </div>
                <Switch 
                  id="keyboard-shortcuts"
                  checked={settings.keyboardShortcuts}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('keyboardShortcuts', checked)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tab Target Size</Label>
                <RadioGroup 
                  value={settings.tabSize}
                  onValueChange={(value: 'normal' | 'large' | 'extra-large') => 
                    handleSettingsChange('tabSize', value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extra-large" id="extra-large" />
                    <Label htmlFor="extra-large">Extra Large</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="focus-indicator-size">
                    Focus Indicator Size ({settings.focusIndicatorSize}px)
                  </Label>
                </div>
                <Slider
                  id="focus-indicator-size"
                  min={1}
                  max={6}
                  step={1}
                  value={[settings.focusIndicatorSize]}
                  onValueChange={(value) => 
                    handleSettingsChange('focusIndicatorSize', value[0])
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Focus Indicator Color</Label>
                <RadioGroup 
                  value={settings.focusIndicatorColor}
                  onValueChange={(value: 'blue' | 'yellow' | 'green' | 'purple' | 'custom') => 
                    handleSettingsChange('focusIndicatorColor', value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blue" id="blue" />
                    <Label htmlFor="blue" className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      Blue
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yellow" id="yellow" />
                    <Label htmlFor="yellow" className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      Yellow
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="green" id="green" />
                    <Label htmlFor="green" className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      Green
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purple" id="purple" />
                    <Label htmlFor="purple" className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      Purple
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {settings.focusIndicatorColor === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-focus-color">Custom Focus Color</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      id="custom-focus-color"
                      value={settings.customFocusColor}
                      onChange={(e) => handleSettingsChange('customFocusColor', e.target.value)}
                      className="w-10 h-10 rounded-md cursor-pointer"
                    />
                    <div className="text-sm font-mono">{settings.customFocusColor}</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <Label>Focus Navigation Demo</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoFocusNavigation('prev')}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoFocusNavigation('next')}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Keyboard Focus Demo</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      variant={currentFocusDemo === 0 ? "default" : "outline"}
                      className={`
                        ${currentFocusDemo === 0 ? 'ring ring-offset-2' : ''}
                        ${settings.enabled && currentFocusDemo === 0 ? 
                          `ring-${settings.focusIndicatorColor === 'custom' ? 
                            'custom' : settings.focusIndicatorColor}-500 ring-offset-2` : 
                          ''}
                      `}
                      style={{
                        ...(settings.enabled && currentFocusDemo === 0 && settings.focusIndicatorColor === 'custom' ? 
                          { 
                            outlineColor: settings.customFocusColor,
                            ringColor: settings.customFocusColor,
                          } : {}),
                        ...(settings.enabled ? 
                          { outlineWidth: `${settings.focusIndicatorSize}px` } : {})
                      }}
                    >
                      Primary Button
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="demo-switch" 
                        checked={currentFocusDemo === 1}
                        className={`
                          ${currentFocusDemo === 1 ? 'ring ring-offset-2' : ''}
                          ${settings.enabled && currentFocusDemo === 1 ? 
                            `ring-${settings.focusIndicatorColor === 'custom' ? 
                              'custom' : settings.focusIndicatorColor}-500 ring-offset-2` : 
                            ''}
                        `}
                        style={{
                          ...(settings.enabled && currentFocusDemo === 1 && settings.focusIndicatorColor === 'custom' ? 
                            { 
                              outlineColor: settings.customFocusColor,
                              ringColor: settings.customFocusColor,
                            } : {}),
                          ...(settings.enabled ? 
                            { outlineWidth: `${settings.focusIndicatorSize}px` } : {})
                        }}
                      />
                      <Label htmlFor="demo-switch">Toggle Switch</Label>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Text input field"
                      className={`
                        px-3 py-2 border rounded-md
                        ${currentFocusDemo === 2 ? 'ring ring-offset-2' : ''}
                        ${settings.enabled && currentFocusDemo === 2 ? 
                          `ring-${settings.focusIndicatorColor === 'custom' ? 
                            'custom' : settings.focusIndicatorColor}-500 ring-offset-2` : 
                          ''}
                      `}
                      style={{
                        ...(settings.enabled && currentFocusDemo === 2 && settings.focusIndicatorColor === 'custom' ? 
                          { 
                            outlineColor: settings.customFocusColor,
                            ringColor: settings.customFocusColor,
                          } : {}),
                        ...(settings.enabled ? 
                          { outlineWidth: `${settings.focusIndicatorSize}px` } : {})
                      }}
                    />
                    
                    <select 
                      className={`
                        px-3 py-2 border rounded-md
                        ${currentFocusDemo === 3 ? 'ring ring-offset-2' : ''}
                        ${settings.enabled && currentFocusDemo === 3 ? 
                          `ring-${settings.focusIndicatorColor === 'custom' ? 
                            'custom' : settings.focusIndicatorColor}-500 ring-offset-2` : 
                          ''}
                      `}
                      style={{
                        ...(settings.enabled && currentFocusDemo === 3 && settings.focusIndicatorColor === 'custom' ? 
                          { 
                            outlineColor: settings.customFocusColor,
                            ringColor: settings.customFocusColor,
                          } : {}),
                        ...(settings.enabled ? 
                          { outlineWidth: `${settings.focusIndicatorSize}px` } : {})
                      }}
                    >
                      <option>Select dropdown</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                    
                    <a 
                      href="#" 
                      className={`
                        text-blue-600 underline
                        ${currentFocusDemo === 4 ? 'ring ring-offset-2' : ''}
                        ${settings.enabled && currentFocusDemo === 4 ? 
                          `ring-${settings.focusIndicatorColor === 'custom' ? 
                            'custom' : settings.focusIndicatorColor}-500 ring-offset-2` : 
                          ''}
                      `}
                      style={{
                        ...(settings.enabled && currentFocusDemo === 4 && settings.focusIndicatorColor === 'custom' ? 
                          { 
                            outlineColor: settings.customFocusColor,
                            ringColor: settings.customFocusColor,
                          } : {}),
                        ...(settings.enabled ? 
                          { outlineWidth: `${settings.focusIndicatorSize}px` } : {})
                      }}
                    >
                      Hyperlink example
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  This preview demonstrates how keyboard focus will appear with your selected settings.
                  Use the Previous and Next buttons to see focus styles on different elements.
                </p>
              </div>
              
              {settings.skipLinks && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" />
                    <h4 className="font-medium">Skip Links Preview</h4>
                  </div>
                  <p className="text-sm">
                    With skip links enabled, a "Skip to main content" link will appear when you first 
                    tab into a page. This allows keyboard users to bypass navigation menus and jump 
                    directly to the main content.
                  </p>
                  <div className="mt-2 p-2 border border-dashed rounded flex items-center justify-center">
                    <a 
                      href="#" 
                      className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded"
                    >
                      Skip to main content
                    </a>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button 
          onClick={handleApplySettings}
          className="flex items-center gap-2"
          disabled={isApplied && JSON.stringify(settings) === JSON.stringify({
            enabled: document.documentElement.classList.contains('keyboard-navigation'),
            highlightFocus: true, // This would need a more complex check in a real implementation
            skipLinks: !!document.getElementById('skip-to-content'),
            keyboardShortcuts: true, // This would need a more complex check in a real implementation
            tabSize: document.documentElement.classList.contains('tab-size-large') ? 'large' :
                    document.documentElement.classList.contains('tab-size-extra-large') ? 'extra-large' :
                    'normal',
            focusIndicatorSize: parseInt(document.documentElement.style.getPropertyValue('--focus-indicator-size') || '3'),
            focusIndicatorColor: document.documentElement.classList.contains('focus-color-yellow') ? 'yellow' :
                                document.documentElement.classList.contains('focus-color-green') ? 'green' :
                                document.documentElement.classList.contains('focus-color-purple') ? 'purple' :
                                document.documentElement.classList.contains('focus-color-custom') ? 'custom' :
                                'blue',
            customFocusColor: document.documentElement.style.getPropertyValue('--custom-focus-color') || '#0066cc',
          })}
        >
          <Check className="h-4 w-4" />
          Apply Settings
        </Button>
      </CardFooter>
    </Card>
  );
}

