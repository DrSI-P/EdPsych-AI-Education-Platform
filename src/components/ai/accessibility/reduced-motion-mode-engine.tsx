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
import { Activity, Check, RefreshCw, Play, Pause, AlertTriangle } from "lucide-react";
import { useSession } from 'next-auth/react';

interface ReducedMotionModeProps {
  onSettingsChange?: (settings: ReducedMotionSettings) => void;
  className?: string;
}

interface ReducedMotionSettings {
  enabled: boolean;
  level: 'minimal' | 'moderate' | 'strict' | 'custom';
  allowEssentialAnimations: boolean;
  allowHoverEffects: boolean;
  allowTransitions: boolean;
  transitionSpeed: number;
  allowAutoplay: boolean;
}

export default function ReducedMotionModeEngine({
  onSettingsChange,
  className = '',
}: ReducedMotionModeProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for reduced motion settings
  const [settings, setSettings] = useState<ReducedMotionSettings>({
    enabled: false,
    level: 'moderate',
    allowEssentialAnimations: true,
    allowHoverEffects: false,
    allowTransitions: true,
    transitionSpeed: 50,
    allowAutoplay: false,
  });
  
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      fetch('/api/ai/accessibility')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            // Update local settings from user preferences if available
            const userSettings = data.settings;
            if (userSettings.reduceMotion !== undefined) {
              setSettings(prev => ({
                ...prev,
                enabled: userSettings.reduceMotion,
                // Add other settings if available in the API response
                ...(userSettings.motionLevel && { level: userSettings.motionLevel }),
                ...(userSettings.allowEssentialAnimations !== undefined && { 
                  allowEssentialAnimations: userSettings.allowEssentialAnimations 
                }),
                ...(userSettings.allowHoverEffects !== undefined && { 
                  allowHoverEffects: userSettings.allowHoverEffects 
                }),
                ...(userSettings.allowTransitions !== undefined && { 
                  allowTransitions: userSettings.allowTransitions 
                }),
                ...(userSettings.transitionSpeed && { 
                  transitionSpeed: userSettings.transitionSpeed 
                }),
                ...(userSettings.allowAutoplay !== undefined && { 
                  allowAutoplay: userSettings.allowAutoplay 
                }),
              }));
              
              // If reduced motion was already enabled, apply it
              if (userSettings.reduceMotion) {
                applyReducedMotion({
                  ...settings,
                  enabled: userSettings.reduceMotion,
                  ...(userSettings.motionLevel && { level: userSettings.motionLevel }),
                  ...(userSettings.allowEssentialAnimations !== undefined && { 
                    allowEssentialAnimations: userSettings.allowEssentialAnimations 
                  }),
                  ...(userSettings.allowHoverEffects !== undefined && { 
                    allowHoverEffects: userSettings.allowHoverEffects 
                  }),
                  ...(userSettings.allowTransitions !== undefined && { 
                    allowTransitions: userSettings.allowTransitions 
                  }),
                  ...(userSettings.transitionSpeed && { 
                    transitionSpeed: userSettings.transitionSpeed 
                  }),
                  ...(userSettings.allowAutoplay !== undefined && { 
                    allowAutoplay: userSettings.allowAutoplay 
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
  
  // Apply reduced motion settings to the page
  const applyReducedMotion = (settingsToApply: ReducedMotionSettings) => {
    if (!settingsToApply.enabled) {
      // Remove reduced motion styles
      document.documentElement.classList.remove(
        'reduce-motion-minimal',
        'reduce-motion-moderate',
        'reduce-motion-strict',
        'reduce-motion-custom'
      );
      document.documentElement.style.removeProperty('--transition-speed-adjust');
      return;
    }
    
    // Apply reduced motion mode
    document.documentElement.classList.remove(
      'reduce-motion-minimal',
      'reduce-motion-moderate',
      'reduce-motion-strict',
      'reduce-motion-custom'
    );
    
    // Add the appropriate class based on the selected level
    document.documentElement.classList.add(
      settingsToApply.level === 'custom' 
        ? 'reduce-motion-custom' 
        : `reduce-motion-${settingsToApply.level}`
    );
    
    // Set CSS variables for transition speed
    document.documentElement.style.setProperty(
      '--transition-speed-adjust', 
      `${settingsToApply.transitionSpeed}%`
    );
    
    // Apply custom settings if in custom mode
    if (settingsToApply.level === 'custom') {
      if (!settingsToApply.allowEssentialAnimations) {
        document.documentElement.classList.add('reduce-motion-no-essential');
      } else {
        document.documentElement.classList.remove('reduce-motion-no-essential');
      }
      
      if (!settingsToApply.allowHoverEffects) {
        document.documentElement.classList.add('reduce-motion-no-hover');
      } else {
        document.documentElement.classList.remove('reduce-motion-no-hover');
      }
      
      if (!settingsToApply.allowTransitions) {
        document.documentElement.classList.add('reduce-motion-no-transitions');
      } else {
        document.documentElement.classList.remove('reduce-motion-no-transitions');
      }
      
      if (!settingsToApply.allowAutoplay) {
        document.documentElement.classList.add('reduce-motion-no-autoplay');
      } else {
        document.documentElement.classList.remove('reduce-motion-no-autoplay');
      }
    }
  };
  
  // Handle settings change
  const handleSettingsChange = (key: keyof ReducedMotionSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // If changing the enabled state, apply or remove reduced motion immediately
      if (key === 'enabled' && isApplied) {
        applyReducedMotion(newSettings);
      }
      
      // If changing the level, update other settings based on presets
      if (key === 'level' && value !== 'custom') {
        switch (value) {
          case 'minimal':
            newSettings.allowEssentialAnimations = true;
            newSettings.allowHoverEffects = true;
            newSettings.allowTransitions = true;
            newSettings.transitionSpeed = 75;
            newSettings.allowAutoplay = true;
            break;
          case 'moderate':
            newSettings.allowEssentialAnimations = true;
            newSettings.allowHoverEffects = false;
            newSettings.allowTransitions = true;
            newSettings.transitionSpeed = 50;
            newSettings.allowAutoplay = false;
            break;
          case 'strict':
            newSettings.allowEssentialAnimations = false;
            newSettings.allowHoverEffects = false;
            newSettings.allowTransitions = false;
            newSettings.transitionSpeed = 25;
            newSettings.allowAutoplay = false;
            break;
        }
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
    applyReducedMotion(settings);
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
            reduceMotion: settings.enabled,
            motionLevel: settings.level,
            allowEssentialAnimations: settings.allowEssentialAnimations,
            allowHoverEffects: settings.allowHoverEffects,
            allowTransitions: settings.allowTransitions,
            transitionSpeed: settings.transitionSpeed,
            allowAutoplay: settings.allowAutoplay,
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Settings saved",
              description: "Your reduced motion settings have been saved to your profile.",
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
        description: "Reduced motion settings have been applied. Sign in to save these preferences.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: ReducedMotionSettings = {
      enabled: false,
      level: 'moderate',
      allowEssentialAnimations: true,
      allowHoverEffects: false,
      allowTransitions: true,
      transitionSpeed: 50,
      allowAutoplay: false,
    };
    
    setSettings(defaultSettings);
    applyReducedMotion(defaultSettings);
    setIsApplied(true);
    
    toast({
      title: "Settings reset",
      description: "Reduced motion settings have been reset to defaults.",
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
            reduceMotion: false,
            motionLevel: 'moderate',
            allowEssentialAnimations: true,
            allowHoverEffects: false,
            allowTransitions: true,
            transitionSpeed: 50,
            allowAutoplay: false,
          }
        }),
      }).catch(error => {
        console.error('Error resetting accessibility settings:', error);
      });
    }
  };
  
  // Toggle animation for preview
  const toggleAnimation = () => {
    setIsAnimationPlaying(!isAnimationPlaying);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            <Activity className="h-5 w-5" />
            Reduced Motion Mode
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Minimize animations and motion effects for improved accessibility
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
                <Label>Motion Reduction Level</Label>
                <RadioGroup 
                  value={settings.level}
                  onValueChange={(value: 'minimal' | 'moderate' | 'strict' | 'custom') => 
                    handleSettingsChange('level', value)
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal" className="flex items-centre gap-2">
                      Minimal
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex items-centre gap-2">
                      Moderate
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="strict" id="strict" />
                    <Label htmlFor="strict" className="flex items-centre gap-2">
                      Strict
                    </Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {settings.level === 'custom' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="essential-animations">Allow Essential Animations</Label>
                      <p className="text-xs text-muted-foreground">
                        Permit animations that convey necessary information
                      </p>
                    </div>
                    <Switch 
                      id="essential-animations"
                      checked={settings.allowEssentialAnimations}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('allowEssentialAnimations', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="hover-effects">Allow Hover Effects</Label>
                      <p className="text-xs text-muted-foreground">
                        Permit subtle effects when hovering over elements
                      </p>
                    </div>
                    <Switch 
                      id="hover-effects"
                      checked={settings.allowHoverEffects}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('allowHoverEffects', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transitions">Allow Transitions</Label>
                      <p className="text-xs text-muted-foreground">
                        Permit smooth transitions between states
                      </p>
                    </div>
                    <Switch 
                      id="transitions"
                      checked={settings.allowTransitions}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('allowTransitions', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoplay">Allow Autoplay</Label>
                      <p className="text-xs text-muted-foreground">
                        Permit content that plays automatically
                      </p>
                    </div>
                    <Switch 
                      id="autoplay"
                      checked={settings.allowAutoplay}
                      onCheckedChange={(checked) => 
                        handleSettingsChange('allowAutoplay', checked)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="transition-speed">
                        Transition Speed ({settings.transitionSpeed}%)
                      </Label>
                    </div>
                    <Slider
                      id="transition-speed"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.transitionSpeed]}
                      onValueChange={(value) => 
                        handleSettingsChange('transitionSpeed', value[0])
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values mean slower transitions
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Preset Descriptions:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Minimal:</strong> Reduces only the most distracting animations while preserving essential motion</p>
                  <p><strong>Moderate:</strong> Balances accessibility with functionality by slowing transitions and removing non-essential animations</p>
                  <p><strong>Strict:</strong> Removes nearly all animations and motion effects for maximum motion reduction</p>
                  <p><strong>Custom:</strong> Allows detailed control over specific motion aspects</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="space-y-6">
              <div className="flex justify-between items-centre mb-4">
                <Label>Animation Preview</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAnimation}
                  className="flex items-centre gap-1"
                >
                  {isAnimationPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Animation Examples</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Transition Effect</Label>
                    <div 
                      className={`
                        h-16 w-full bg-primary/20 rounded-md flex items-centre justify-centre
                        transition-all duration-1000
                        ${isAnimationPlaying ? 'bg-primary/60' : 'bg-primary/20'}
                      `}
                      style={{
                        transitionDuration: settings.enabled ? 
                          `${2000 * (settings.transitionSpeed / 100)}ms` : 
                          '1000ms'
                      }}
                    >
                      <span>Colour Transition</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Movement Animation</Label>
                    <div className="h-16 w-full bg-muted rounded-md relative overflow-hidden">
                      <div 
                        className={`
                          absolute h-8 w-8 bg-blue-500 rounded-full top-4
                          transition-transform
                          ${isAnimationPlaying ? 'translate-x-full' : 'translate-x-0'}
                        `}
                        style={{
                          transitionDuration: settings.enabled ? 
                            `${3000 * (settings.transitionSpeed / 100)}ms` : 
                            '3000ms',
                          animation: isAnimationPlaying && !settings.enabled ? 
                            'bounce 3s infinite alternate' : 'none',
                          right: isAnimationPlaying ? '1rem' : 'auto',
                          left: isAnimationPlaying ? 'auto' : '1rem',
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Hover Effect</Label>
                    <Button 
                      variant="outline" 
                      className="w-full transition-all duration-300 hover:bg-primary/20"
                      style={{
                        transitionDuration: settings.enabled ? 
                          `${300 * (settings.transitionSpeed / 100)}ms` : 
                          '300ms'
                      }}
                    >
                      Hover over me
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  This preview demonstrates how animations and transitions will appear with your selected reduced motion settings.
                  The actual effect may vary depending on the specific content and animations on each page.
                </p>
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
            enabled: document.documentElement.classList.contains('reduce-motion-minimal') || 
                    document.documentElement.classList.contains('reduce-motion-moderate') ||
                    document.documentElement.classList.contains('reduce-motion-strict') ||
                    document.documentElement.classList.contains('reduce-motion-custom'),
            level: document.documentElement.classList.contains('reduce-motion-minimal') ? 'minimal' :
                  document.documentElement.classList.contains('reduce-motion-moderate') ? 'moderate' :
                  document.documentElement.classList.contains('reduce-motion-strict') ? 'strict' :
                  'custom',
            allowEssentialAnimations: !document.documentElement.classList.contains('reduce-motion-no-essential'),
            allowHoverEffects: !document.documentElement.classList.contains('reduce-motion-no-hover'),
            allowTransitions: !document.documentElement.classList.contains('reduce-motion-no-transitions'),
            allowAutoplay: !document.documentElement.classList.contains('reduce-motion-no-autoplay'),
            transitionSpeed: parseInt(document.documentElement.style.getPropertyValue('--transition-speed-adjust') || '50'),
          })}
        >
          <Check className="h-4 w-4" />
          Apply Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
