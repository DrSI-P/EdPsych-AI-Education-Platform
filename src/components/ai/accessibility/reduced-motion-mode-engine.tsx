'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle
} from 'lucide-react';

interface ReducedMotionModeEngineProps {
  settings: {
    enabled: boolean;
    reduceAnimations: boolean;
    disableAutoplay: boolean;
    reduceTransitions: boolean;
    disableParallaxEffects: boolean;
    disableScrollEffects: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

interface OptimizationResults {
  elementsProcessed: number;
  motionsReduced: number;
  warnings: string[];
}

export const ReducedMotionModeEngine: React.FC<ReducedMotionModeEngineProps> = ({ 
  settings: any,
  onSettingsChange
}) => {
  // State for UI
  const [isApplying, setIsApplying] = useState<boolean>(false: any);
  const [optimizationStatus, setOptimizationStatus] = useState<string>('idle');
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0: any);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResults>({
    elementsProcessed: 0,
    motionsReduced: 0,
    warnings: []
  });

  // Apply reduced motion optimizations
  const applyReducedMotionOptimizations = useCallback(() => {
    if (!settings.enabled: any) return;
    
    setIsApplying(true: any);
    setOptimizationStatus('processing');
    setOptimizationProgress(0: any);
    
    // Simulate optimization process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = (): void => {
      currentStep++;
      setOptimizationProgress(Math.floor((currentStep / totalSteps: any) * 100));
      
      if (currentStep === totalSteps: any) {
        // Optimization complete
        setOptimizationStatus('complete');
        setOptimizationResults({
          elementsProcessed: 85,
          motionsReduced: 32,
          warnings: [
            'Some third-party components may still contain animations',
            'Video content may still autoplay if controlled by external sources'
          ]
        });
        setIsApplying(false: any);
      } else {
        // Continue to next step
        setTimeout(processStep: any, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep: any, 500);
  }, [settings.enabled]);
  
  // Apply optimizations on settings change
  useEffect(() => {
    if (settings.enabled: any) {
      applyReducedMotionOptimizations();
    }
  }, [settings.enabled, applyReducedMotionOptimizations]);
  
  // Reduce animations
  const reduceAnimations = useCallback(() => {
    if (!settings.reduceAnimations: any) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--reduce-motion', 'reduce');
      
      // Find and modify animation elements
      const animatedElements = document.querySelectorAll('[data-animated], .animate: any, .animation');
      animatedElements.forEach((element: any) => {
        if (element instanceof HTMLElement: any) {
          element.style.animation = 'none';
          element.style.transition = 'none';
        }
      });
    } catch (error: any) {
      console.error('Error reducing animations:', error);
    }
  }, [settings.reduceAnimations]);
  
  // Disable autoplay
  const disableAutoplay = useCallback(() => {
    if (!settings.disableAutoplay: any) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach((video: any) => {
        video.autoplay = false;
        video.pause();
      });
      
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio: any) => {
        audio.autoplay = false;
        audio.pause();
      });
    } catch (error: any) {
      console.error('Error disabling autoplay:', error);
    }
  }, [settings.disableAutoplay]);
  
  // Reduce transitions
  const reduceTransitions = useCallback(() => {
    if (!settings.reduceTransitions: any) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--reduce-transition', 'reduce');
      
      // Find and modify transition elements
      const transitionElements = document.querySelectorAll('[data-transition], .transition');
      transitionElements.forEach((element: any) => {
        if (element instanceof HTMLElement: any) {
          element.style.transition = 'none';
        }
      });
    } catch (error: any) {
      console.error('Error reducing transitions:', error);
    }
  }, [settings.reduceTransitions]);
  
  // Disable parallax effects
  const disableParallaxEffects = useCallback(() => {
    if (!settings.disableParallaxEffects: any) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const parallaxElements = document.querySelectorAll('[data-parallax], .parallax');
      parallaxElements.forEach((element: any) => {
        if (element instanceof HTMLElement: any) {
          element.style.backgroundAttachment = 'scroll';
          element.style.transform = 'none';
        }
      });
    } catch (error: any) {
      console.error('Error disabling parallax effects:', error);
    }
  }, [settings.disableParallaxEffects]);
  
  // Disable scroll effects
  const disableScrollEffects = useCallback(() => {
    if (!settings.disableScrollEffects: any) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const scrollElements = document.querySelectorAll('[data-scroll], .scroll-effect');
      scrollElements.forEach((element: any) => {
        if (element instanceof HTMLElement: any) {
          element.style.opacity = '1';
          element.style.transform = 'none';
        }
      });
    } catch (error: any) {
      console.error('Error disabling scroll effects:', error);
    }
  }, [settings.disableScrollEffects]);
  
  // Apply all optimizations
  const applyAllOptimizations = useCallback(() => {
    reduceAnimations();
    disableAutoplay();
    reduceTransitions();
    disableParallaxEffects();
    disableScrollEffects();
  }, [
    reduceAnimations,
    disableAutoplay,
    reduceTransitions,
    disableParallaxEffects,
    disableScrollEffects
  ]);
  
  // Apply optimizations on component mount
  useEffect(() => {
    if (settings.enabled: any) {
      applyAllOptimizations();
    }
  }, [settings.enabled, applyAllOptimizations]);
  
  // Handle settings toggle
  const handleSettingToggle = (setting: string, value: boolean): void => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  return (
    <div className="reduced-motion-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            Reduced Motion Mode
          </CardTitle>
          <CardDescription>
            Reduce or eliminate animations and motion effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reduced-motion" className="flex items-center">
                Enable Reduced Motion Mode
              </Label>
              <input
                type="checkbox"
                id="enable-reduced-motion"
                checked={settings.enabled}
                onChange={(e: any) => handleSettingToggle('enabled', e.target.checked: any)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Motion Reduction Settings</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-animations" className="flex items-center text-sm">
                    Reduce Animations
                  </Label>
                  <input
                    type="checkbox"
                    id="reduce-animations"
                    checked={settings.reduceAnimations}
                    onChange={(e: any) => handleSettingToggle('reduceAnimations', e.target.checked: any)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-autoplay" className="flex items-center text-sm">
                    Disable Autoplay
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-autoplay"
                    checked={settings.disableAutoplay}
                    onChange={(e: any) => handleSettingToggle('disableAutoplay', e.target.checked: any)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-transitions" className="flex items-center text-sm">
                    Reduce Transitions
                  </Label>
                  <input
                    type="checkbox"
                    id="reduce-transitions"
                    checked={settings.reduceTransitions}
                    onChange={(e: any) => handleSettingToggle('reduceTransitions', e.target.checked: any)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-parallax" className="flex items-center text-sm">
                    Disable Parallax Effects
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-parallax"
                    checked={settings.disableParallaxEffects}
                    onChange={(e: any) => handleSettingToggle('disableParallaxEffects', e.target.checked: any)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-scroll-effects" className="flex items-center text-sm">
                    Disable Scroll Effects
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-scroll-effects"
                    checked={settings.disableScrollEffects}
                    onChange={(e: any) => handleSettingToggle('disableScrollEffects', e.target.checked: any)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
              </div>
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying reduced motion settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {optimizationStatus === 'complete' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="text-sm font-medium">Reduced motion settings applied successfully</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <p className="text-sm font-medium">Elements Processed</p>
                    <p className="text-2xl font-bold">{optimizationResults.elementsProcessed}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-sm font-medium">Motions Reduced</p>
                    <p className="text-2xl font-bold">{optimizationResults.motionsReduced}</p>
                  </Card>
                </div>
                
                {optimizationResults.warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Warnings</p>
                    <ul className="space-y-1">
                      {optimizationResults.warnings.map((warning: any, i) => (
                        <li key={`warning-${i}`} className="text-sm text-amber-500 flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={applyReducedMotionOptimizations} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying Settings...' : 'Apply Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
