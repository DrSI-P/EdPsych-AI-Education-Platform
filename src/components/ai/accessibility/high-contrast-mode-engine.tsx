'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Eye, SunMoon, Moon, Sun, Contrast, Check, RefreshCw } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

interface HighContrastModeProps {
  onSettingsChange?: (settings: HighContrastSettings) => void;
  className?: string;
}

interface HighContrastSettings {
  enabled: boolean;
  mode: 'high-contrast' | 'dark-high-contrast' | 'yellow-black' | 'black-yellow' | 'blue-yellow' | 'custom';
  textSize: number;
  contrastLevel: number;
  reduceAnimations: boolean;
  customTextColor?: string;
  customBackgroundColor?: string;
  customLinkColor?: string;
}

export default function HighContrastModeEngine({
  onSettingsChange,
  className = '',
}: HighContrastModeProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // State for high contrast settings
  const [settings, setSettings] = useState<HighContrastSettings>({
    enabled: false,
    mode: 'high-contrast',
    textSize: 100,
    contrastLevel: 100,
    reduceAnimations: false,
    customTextColor: '#ffffff',
    customBackgroundColor: '#000000',
    customLinkColor: '#ffff00',
  });
  
  const [previewMode, setPreviewMode] = useState<'text' | 'ui' | 'content'>('text');
  const [isApplied, setIsApplied] = useState(false);
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      fetch('/api/ai/accessibility')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            // Update local settings from user preferences if available
            const userSettings = data.settings;
            if (userSettings.highContrastMode !== undefined) {
              setSettings(prev => ({
                ...prev,
                enabled: userSettings.highContrastMode,
                // Add other settings if available in the API response
                ...(userSettings.contrastMode && { mode: userSettings.contrastMode }),
                ...(userSettings.textSize && { textSize: userSettings.textSize }),
                ...(userSettings.contrastLevel && { contrastLevel: userSettings.contrastLevel }),
                ...(userSettings.reduceAnimations && { reduceAnimations: userSettings.reduceAnimations }),
              }));
              
              // If high contrast was already enabled, apply it
              if (userSettings.highContrastMode) {
                applyHighContrast({
                  ...settings,
                  enabled: userSettings.highContrastMode,
                  ...(userSettings.contrastMode && { mode: userSettings.contrastMode }),
                  ...(userSettings.textSize && { textSize: userSettings.textSize }),
                  ...(userSettings.contrastLevel && { contrastLevel: userSettings.contrastLevel }),
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
  
  // Apply high contrast settings to the page
  const applyHighContrast = (settingsToApply: HighContrastSettings) => {
    if (!settingsToApply.enabled) {
      // Remove high contrast styles
      document.documentElement.classList.remove(
        'high-contrast',
        'dark-high-contrast',
        'yellow-black',
        'black-yellow',
        'blue-yellow',
        'custom-contrast'
      );
      document.documentElement.style.removeProperty('--text-size-adjust');
      document.documentElement.style.removeProperty('--contrast-adjust');
      document.documentElement.style.removeProperty('--custom-text-colour');
      document.documentElement.style.removeProperty('--custom-background-colour');
      document.documentElement.style.removeProperty('--custom-link-colour');
      
      // Reset theme if needed
      if (theme === 'high-contrast') {
        setTheme('light');
      }
      
      return;
    }
    
    // Apply high contrast mode
    document.documentElement.classList.remove(
      'high-contrast',
      'dark-high-contrast',
      'yellow-black',
      'black-yellow',
      'blue-yellow',
      'custom-contrast'
    );
    
    // Add the appropriate class based on the selected mode
    document.documentElement.classList.add(settingsToApply.mode === 'custom' ? 'custom-contrast' : settingsToApply.mode);
    
    // Set CSS variables for text size and contrast level
    document.documentElement.style.setProperty('--text-size-adjust', `${settingsToApply.textSize}%`);
    document.documentElement.style.setProperty('--contrast-adjust', `${settingsToApply.contrastLevel}%`);
    
    // Set custom colors if in custom mode
    if (settingsToApply.mode === 'custom') {
      document.documentElement.style.setProperty('--custom-text-colour', settingsToApply.customTextColor || '#ffffff');
      document.documentElement.style.setProperty('--custom-background-colour', settingsToApply.customBackgroundColor || '#000000');
      document.documentElement.style.setProperty('--custom-link-colour', settingsToApply.customLinkColor || '#ffff00');
    }
    
    // Apply reduced animations if enabled
    if (settingsToApply.reduceAnimations) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
    
    // Update theme if needed
    if (settingsToApply.mode.includes('dark') && theme !== 'dark') {
      setTheme('dark');
    } else if (!settingsToApply.mode.includes('dark') && theme === 'dark') {
      setTheme('light');
    }
  };
  
  // Handle settings change
  const handleSettingsChange = (key: keyof HighContrastSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // If changing the enabled state, apply or remove high contrast immediately
      if (key === 'enabled' && isApplied) {
        applyHighContrast(newSettings);
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
    applyHighContrast(settings);
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
            highContrastMode: settings.enabled,
            contrastMode: settings.mode,
            textSize: settings.textSize,
            contrastLevel: settings.contrastLevel,
            reduceAnimations: settings.reduceAnimations,
            customTextColor: settings.customTextColor,
            customBackgroundColor: settings.customBackgroundColor,
            customLinkColor: settings.customLinkColor,
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Settings saved",
              description: "Your high contrast settings have been saved to your profile.",
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
        description: "High contrast settings have been applied. Sign in to save these preferences.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: HighContrastSettings = {
      enabled: false,
      mode: 'high-contrast',
      textSize: 100,
      contrastLevel: 100,
      reduceAnimations: false,
      customTextColor: '#ffffff',
      customBackgroundColor: '#000000',
      customLinkColor: '#ffff00',
    };
    
    setSettings(defaultSettings);
    applyHighContrast(defaultSettings);
    setIsApplied(true);
    
    toast({
      title: "Settings reset",
      description: "High contrast settings have been reset to defaults.",
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
            highContrastMode: false,
            contrastMode: 'high-contrast',
            textSize: 100,
            contrastLevel: 100,
            reduceAnimations: false,
          }
        }),
      }).catch(error => {
        console.error('Error resetting accessibility settings:', error);
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            <Contrast className="h-5 w-5" />
            High Contrast Mode
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Adjust contrast and colour settings to improve readability
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contrast Mode</Label>
                <RadioGroup 
                  value={settings.mode}
                  onValueChange={(value) => handleSettingsChange('mode', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="high-contrast" id="high-contrast" />
                    <Label htmlFor="high-contrast" className="flex items-centre gap-2">
                      <Contrast className="h-4 w-4" />
                      Black on White
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="dark-high-contrast" id="dark-high-contrast" />
                    <Label htmlFor="dark-high-contrast" className="flex items-centre gap-2">
                      <Moon className="h-4 w-4" />
                      White on Black
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="yellow-black" id="yellow-black" />
                    <Label htmlFor="yellow-black" className="flex items-centre gap-2">
                      <Sun className="h-4 w-4" />
                      Yellow on Black
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="black-yellow" id="black-yellow" />
                    <Label htmlFor="black-yellow" className="flex items-centre gap-2">
                      <SunMoon className="h-4 w-4" />
                      Black on Yellow
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="blue-yellow" id="blue-yellow" />
                    <Label htmlFor="blue-yellow" className="flex items-centre gap-2">
                      <Eye className="h-4 w-4" />
                      Blue on Yellow
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {settings.mode === 'custom' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="text-colour">Text Colour</Label>
                    <div className="flex items-centre gap-2">
                      <input 
                        type="colour" 
                        id="text-colour"
                        value={settings.customTextColor}
                        onChange={(e) => handleSettingsChange('customTextColor', e.target.value)}
                        className="w-10 h-10 rounded-md cursor-pointer"
                      />
                      <div className="text-sm font-mono">{settings.customTextColor}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background-colour">Background Colour</Label>
                    <div className="flex items-centre gap-2">
                      <input 
                        type="colour" 
                        id="background-colour"
                        value={settings.customBackgroundColor}
                        onChange={(e) => handleSettingsChange('customBackgroundColor', e.target.value)}
                        className="w-10 h-10 rounded-md cursor-pointer"
                      />
                      <div className="text-sm font-mono">{settings.customBackgroundColor}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link-colour">Link Colour</Label>
                    <div className="flex items-centre gap-2">
                      <input 
                        type="colour" 
                        id="link-colour"
                        value={settings.customLinkColor}
                        onChange={(e) => handleSettingsChange('customLinkColor', e.target.value)}
                        className="w-10 h-10 rounded-md cursor-pointer"
                      />
                      <div className="text-sm font-mono">{settings.customLinkColor}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="text-size">Text Size ({settings.textSize}%)</Label>
                </div>
                <Slider
                  id="text-size"
                  min={100}
                  max={200}
                  step={10}
                  value={[settings.textSize]}
                  onValueChange={(value) => handleSettingsChange('textSize', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contrast-level">Contrast Level ({settings.contrastLevel}%)</Label>
                </div>
                <Slider
                  id="contrast-level"
                  min={100}
                  max={200}
                  step={10}
                  value={[settings.contrastLevel]}
                  onValueChange={(value) => handleSettingsChange('contrastLevel', value[0])}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-animations">Reduce Animations</Label>
                  <p className="text-xs text-muted-foreground">
                    Minimize motion for users with vestibular disorders
                  </p>
                </div>
                <Switch 
                  id="reduce-animations"
                  checked={settings.reduceAnimations}
                  onCheckedChange={(checked) => handleSettingsChange('reduceAnimations', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <Label>Preview Type</Label>
                <Select
                  value={previewMode}
                  onValueChange={(value: 'text' | 'ui' | 'content') => setPreviewMode(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select preview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Sample</SelectItem>
                    <SelectItem value="ui">UI Elements</SelectItem>
                    <SelectItem value="content">Educational Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className={`preview-container p-4 rounded-md border ${settings.enabled ? 'preview-high-contrast' : ''}`}
                style={{
                  backgroundColor: settings.enabled && settings.mode === 'custom' ? settings.customBackgroundColor : '',
                  color: settings.enabled && settings.mode === 'custom' ? settings.customTextColor : '',
                  fontSize: settings.enabled ? `${settings.textSize / 100}rem` : '',
                }}
              >
                {previewMode === 'text' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Sample Text</h3>
                    <p>
                      This is a sample paragraph demonstrating how text will appear with your selected high contrast settings. 
                      Good contrast between text and background is essential for readability, especially for users with visual impairments.
                    </p>
                    <p>
                      <a href="#" style={{ color: settings.enabled && settings.mode === 'custom' ? settings.customLinkColor : '' }}>
                        This is a sample link that shows how links will appear.
                      </a>
                    </p>
                    <ul className="list-disc pl-5">
                      <li>List item one demonstrates bullet points</li>
                      <li>List item two shows spacing between items</li>
                      <li>List item three with slightly longer content to show wrapping</li>
                    </ul>
                  </div>
                )}
                
                {previewMode === 'ui' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">UI Elements</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="destructive">Destructive Button</Button>
                    </div>
                    <div className="flex items-centre space-x-2">
                      <Switch id="preview-switch" />
                      <Label htmlFor="preview-switch">Toggle Switch</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preview-slider">Slider Control</Label>
                      <Slider id="preview-slider" defaultValue={[50]} max={100} step={1} />
                    </div>
                  </div>
                )}
                
                {previewMode === 'content' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Educational Content Sample</h3>
                    <h4 className="text-lg font-semibold">The Water Cycle</h4>
                    <p>
                      The water cycle describes how water evaporates from the Earth's surface, rises into the atmosphere, cools and condenses into rain or snow, and falls again to the surface.
                    </p>
                    <p>
                      The water cycle involves several key processes:
                    </p>
                    <ul className="list-disc pl-5">
                      <li><strong>Evaporation:</strong> Water changes from liquid to gas</li>
                      <li><strong>Condensation:</strong> Water vapor cools and forms clouds</li>
                      <li><strong>Precipitation:</strong> Water falls as rain, snow, or hail</li>
                      <li><strong>Collection:</strong> Water returns to oceans, lakes, and rivers</li>
                    </ul>
                    <p>
                      <a href="#" style={{ color: settings.enabled && settings.mode === 'custom' ? settings.customLinkColor : '' }}>
                        Click here to learn more about the water cycle
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex items-centre gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button 
          onClick={handleApplySettings}
          className="flex items-centre gap-2"
          disabled={isApplied && JSON.stringify(settings) === JSON.stringify({
            enabled: document.documentElement.classList.contains('high-contrast') || 
                    document.documentElement.classList.contains('dark-high-contrast') ||
                    document.documentElement.classList.contains('yellow-black') ||
                    document.documentElement.classList.contains('black-yellow') ||
                    document.documentElement.classList.contains('blue-yellow') ||
                    document.documentElement.classList.contains('custom-contrast'),
            mode: document.documentElement.classList.contains('dark-high-contrast') ? 'dark-high-contrast' :
                  document.documentElement.classList.contains('yellow-black') ? 'yellow-black' :
                  document.documentElement.classList.contains('black-yellow') ? 'black-yellow' :
                  document.documentElement.classList.contains('blue-yellow') ? 'blue-yellow' :
                  document.documentElement.classList.contains('custom-contrast') ? 'custom' :
                  'high-contrast',
            textSize: parseInt(document.documentElement.style.getPropertyValue('--text-size-adjust') || '100'),
            contrastLevel: parseInt(document.documentElement.style.getPropertyValue('--contrast-adjust') || '100'),
            reduceAnimations: document.documentElement.classList.contains('reduce-animations'),
            customTextColor: document.documentElement.style.getPropertyValue('--custom-text-colour') || '#ffffff',
            customBackgroundColor: document.documentElement.style.getPropertyValue('--custom-background-colour') || '#000000',
            customLinkColor: document.documentElement.style.getPropertyValue('--custom-link-colour') || '#ffff00',
          })}
        >
          <Check className="h-4 w-4" />
          Apply Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
