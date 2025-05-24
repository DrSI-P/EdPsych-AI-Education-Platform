'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Lightbulb,
  Zap
} from 'lucide-react';

interface FocusModeEngineProps {
  settings: {
    enabled: boolean;
    hideDistractions: boolean;
    highlightActiveElement: boolean;
    dimInactiveContent: boolean;
    focusTimer: number;
    breakReminders: boolean;
    breakInterval: number;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const FocusModeEngine: React.FC<FocusModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [optimizationStatus, setOptimizationStatus] = React.useState<string>('idle');
  const [optimizationProgress, setOptimizationProgress] = React.useState<number>(0);
  const [focusTimerActive, setFocusTimerActive] = React.useState<boolean>(false);
  const [focusTimeRemaining, setFocusTimeRemaining] = React.useState<number>(settings.focusTimer * 60);
  const [breakTimerActive, setBreakTimerActive] = React.useState<boolean>(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = React.useState<number>(5 * 60); // 5 minutes break
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Apply focus mode optimizations
  const applyFocusModeOptimizations = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsApplying(true);
    setOptimizationStatus('processing');
    setOptimizationProgress(0);
    
    // Simulate optimization process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setOptimizationProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Optimization complete
        setOptimizationStatus('complete');
        setIsApplying(false);
        
        // Start focus timer if enabled
        if (settings.enabled && settings.focusTimer > 0) {
          startFocusTimer();
        }
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings]);
  
  // Apply optimizations on settings change
  React.useEffect(() => {
    if (settings.enabled) {
      applyFocusModeOptimizations();
    } else {
      // Stop timers if focus mode is disabled
      setFocusTimerActive(false);
      setBreakTimerActive(false);
    }
  }, [settings.enabled, applyFocusModeOptimizations]);
  
  // Hide distractions
  const hideDistractions = React.useCallback(() => {
    if (!settings.enabled || !settings.hideDistractions) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add distraction hiding styles
      style.innerHTML = `
        .sidebar, .ads, .recommendations, .social-links, .related-content {
          display: none !important;
        }
        
        body {
          overflow-x: hidden !important;
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error hiding distractions:', error);
    }
  }, [settings.enabled, settings.hideDistractions]);
  
  // Highlight active element
  const highlightActiveElement = React.useCallback(() => {
    if (!settings.enabled || !settings.highlightActiveElement) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add active element highlighting styles
      style.innerHTML = `
        :focus {
          outline: 3px solid #0070f3 !important;
          outline-offset: 2px !important;
        }
        
        :focus-visible {
          outline: 3px solid #0070f3 !important;
          outline-offset: 2px !important;
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
      
      // Add event listeners to track active element
      document.addEventListener('focusin', (e) => {
        const target = e.target as HTMLElement;
        if (target) {
          target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.4)';
        }
      });
      
      document.addEventListener('focusout', (e) => {
        const target = e.target as HTMLElement;
        if (target) {
          target.style.boxShadow = '';
        }
      });
    } catch (error) {
      console.error('Error highlighting active element:', error);
    }
  }, [settings.enabled, settings.highlightActiveElement]);
  
  // Dim inactive content
  const dimInactiveContent = React.useCallback(() => {
    if (!settings.enabled || !settings.dimInactiveContent) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add inactive content dimming styles
      style.innerHTML = `
        body {
          position: relative;
        }
        
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          pointer-events: none;
          z-index: 9999;
          transition: opacity 0.3s ease;
        }
        
        :focus {
          position: relative;
          z-index: 10000;
        }
        
        :focus::after {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: white;
          border-radius: 10px;
          z-index: -1;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error dimming inactive content:', error);
    }
  }, [settings.enabled, settings.dimInactiveContent]);
  
  // Start focus timer
  const startFocusTimer = React.useCallback(() => {
    if (!settings.enabled || settings.focusTimer <= 0) return;
    
    setFocusTimerActive(true);
    setFocusTimeRemaining(settings.focusTimer * 60);
    setBreakTimerActive(false);
  }, [settings.enabled, settings.focusTimer]);
  
  // Start break timer
  const startBreakTimer = React.useCallback(() => {
    if (!settings.enabled || !settings.breakReminders) return;
    
    setBreakTimerActive(true);
    setBreakTimeRemaining(5 * 60); // 5 minutes break
    setFocusTimerActive(false);
  }, [settings.enabled, settings.breakReminders]);
  
  // Handle focus timer tick
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (focusTimerActive && focusTimeRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimeRemaining((prev) => {
          if (prev <= 1) {
            // Focus time is up, start break
            if (settings.breakReminders) {
              startBreakTimer();
            }
            clearInterval(interval as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimerActive, focusTimeRemaining, settings.breakReminders, startBreakTimer]);
  
  // Handle break timer tick
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (breakTimerActive && breakTimeRemaining > 0) {
      interval = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            // Break time is up, restart focus
            startFocusTimer();
            clearInterval(interval as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breakTimerActive, breakTimeRemaining, startFocusTimer]);
  
  // Apply all optimizations
  const applyAllOptimizations = React.useCallback(() => {
    hideDistractions();
    highlightActiveElement();
    dimInactiveContent();
  }, [
    hideDistractions,
    highlightActiveElement,
    dimInactiveContent
  ]);
  
  // Apply optimizations on component mount
  React.useEffect(() => {
    if (settings.enabled) {
      applyAllOptimizations();
    }
  }, [settings.enabled, applyAllOptimizations]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: string | number | boolean) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  return (
    <div className="focus-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Zap className="mr-2" /> Focus Mode
          </CardTitle>
          <CardDescription>
            Minimize distractions and enhance concentration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-focus-mode" className="flex items-center">
                Enable Focus Mode
              </Label>
              <input
                type="checkbox"
                id="enable-focus-mode"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hide-distractions" className="flex items-center text-sm">
                  Hide Distractions
                </Label>
                <input
                  type="checkbox"
                  id="hide-distractions"
                  checked={settings.hideDistractions}
                  onChange={(e) => handleSettingChange('hideDistractions', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-active-element" className="flex items-center text-sm">
                  Highlight Active Element
                </Label>
                <input
                  type="checkbox"
                  id="highlight-active-element"
                  checked={settings.highlightActiveElement}
                  onChange={(e) => handleSettingChange('highlightActiveElement', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="dim-inactive-content" className="flex items-center text-sm">
                  Dim Inactive Content
                </Label>
                <input
                  type="checkbox"
                  id="dim-inactive-content"
                  checked={settings.dimInactiveContent}
                  onChange={(e) => handleSettingChange('dimInactiveContent', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="focus-timer" className="text-sm">
                    Focus Timer: {settings.focusTimer} minutes
                  </Label>
                </div>
                <input
                  type="range"
                  id="focus-timer"
                  min="0"
                  max="60"
                  step="5"
                  value={settings.focusTimer}
                  onChange={(e) => handleSettingChange('focusTimer', parseInt(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Off</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="break-reminders" className="flex items-center text-sm">
                  Break Reminders
                </Label>
                <input
                  type="checkbox"
                  id="break-reminders"
                  checked={settings.breakReminders}
                  onChange={(e) => handleSettingChange('breakReminders', e.target.checked)}
                  disabled={!settings.enabled || settings.focusTimer === 0}
                  className="toggle toggle-sm"
                />
              </div>
              
              {settings.breakReminders && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="break-interval" className="text-sm">
                      Break Interval: {settings.breakInterval} minutes
                    </Label>
                  </div>
                  <input
                    type="range"
                    id="break-interval"
                    min="5"
                    max="30"
                    step="5"
                    value={settings.breakInterval}
                    onChange={(e) => handleSettingChange('breakInterval', parseInt(e.target.value))}
                    disabled={!settings.enabled || !settings.breakReminders}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>15 min</span>
                    <span>30 min</span>
                  </div>
                </div>
              )}
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying focus mode settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {focusTimerActive && (
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Focus Time Remaining</p>
                    <p className="text-xl font-bold">{formatTime(focusTimeRemaining)}</p>
                  </div>
                  <Progress 
                    value={(focusTimeRemaining / (settings.focusTimer * 60)) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>
            )}
            
            {breakTimerActive && (
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Break Time Remaining</p>
                    <p className="text-xl font-bold">{formatTime(breakTimeRemaining)}</p>
                  </div>
                  <Progress 
                    value={(breakTimeRemaining / (5 * 60)) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={applyFocusModeOptimizations} 
            disabled={!settings.enabled || isApplying}
            className="flex-1 mr-2"
          >
            {isApplying ? 'Applying Settings...' : 'Apply Settings'}
          </Button>
          
          {settings.focusTimer > 0 && (
            <Button 
              variant={focusTimerActive ? "destructive" : "outline"} 
              onClick={() => focusTimerActive ? setFocusTimerActive(false) : startFocusTimer()}
              disabled={!settings.enabled}
              className="flex-1 ml-2"
            >
              {focusTimerActive ? 'Stop Timer' : 'Start Timer'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FocusModeEngine;
