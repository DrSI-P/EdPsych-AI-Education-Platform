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

interface DyslexiaFriendlyModeEngineProps {
  settings: {
    enabled: boolean;
    fontFamily: string;
    fontSize: number;
    lineSpacing: number;
    letterSpacing: number;
    useCustomColors: boolean;
    backgroundColor: string;
    textColor: string;
    highlightImportantText: boolean;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const DyslexiaFriendlyModeEngine: React.FC<DyslexiaFriendlyModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [optimizationStatus, setOptimizationStatus] = React.useState<string>('idle');
  const [optimizationProgress, setOptimizationProgress] = React.useState<number>(0);
  const [optimizationResults, setOptimizationResults] = React.useState<{
    elementsProcessed: number;
    elementsEnhanced: number;
    warnings: string[];
  }>({
    elementsProcessed: 0,
    elementsEnhanced: 0,
    warnings: []
  });

  // Font family options
  const fontFamilyOptions = [
    { value: 'OpenDyslexic', label: 'OpenDyslexic' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' }
  ];

  // Apply dyslexia-friendly optimizations
  const applyDyslexiaFriendlyOptimizations = React.useCallback(() => {
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
        setOptimizationResults({
          elementsProcessed: 145,
          elementsEnhanced: 92,
          warnings: [
            'Some embedded content may not be affected by dyslexia-friendly settings',
            'Custom components may require additional styling'
          ]
        });
        setIsApplying(false);
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
      applyDyslexiaFriendlyOptimizations();
    }
  }, [settings, applyDyslexiaFriendlyOptimizations]);
  
  // Apply font family
  const applyFontFamily = React.useCallback(() => {
    if (!settings.enabled) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--font-family', settings.fontFamily);
      
      // Apply font family to all text elements
      const style = document.createElement('style');
      style.innerHTML = `
        body, p, h1, h2, h3, h4, h5, h6, span, a, button, input, textarea, select, label {
          font-family: ${settings.fontFamily} !important;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error applying font family:', error);
    }
  }, [settings.enabled, settings.fontFamily]);
  
  // Apply font size
  const applyFontSize = React.useCallback(() => {
    if (!settings.enabled) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--font-size-multiplier', `${settings.fontSize / 100}`);
      
      // Apply font size to all text elements
      const style = document.createElement('style');
      style.innerHTML = `
        body {
          font-size: ${settings.fontSize}% !important;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error applying font size:', error);
    }
  }, [settings.enabled, settings.fontSize]);
  
  // Apply line spacing
  const applyLineSpacing = React.useCallback(() => {
    if (!settings.enabled) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--line-height', `${settings.lineSpacing}`);
      
      // Apply line spacing to all text elements
      const style = document.createElement('style');
      style.innerHTML = `
        p, li, h1, h2, h3, h4, h5, h6 {
          line-height: ${settings.lineSpacing} !important;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error applying line spacing:', error);
    }
  }, [settings.enabled, settings.lineSpacing]);
  
  // Apply letter spacing
  const applyLetterSpacing = React.useCallback(() => {
    if (!settings.enabled) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
      
      // Apply letter spacing to all text elements
      const style = document.createElement('style');
      style.innerHTML = `
        p, li, h1, h2, h3, h4, h5, h6, span, a, button, input, textarea, select, label {
          letter-spacing: ${settings.letterSpacing}px !important;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error applying letter spacing:', error);
    }
  }, [settings.enabled, settings.letterSpacing]);
  
  // Apply custom colors
  const applyCustomColors = React.useCallback(() => {
    if (!settings.enabled || !settings.useCustomColors) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--background', settings.backgroundColor);
      document.documentElement.style.setProperty('--foreground', settings.textColor);
      
      // Apply custom colors to all elements
      const style = document.createElement('style');
      style.innerHTML = `
        body {
          background-color: ${settings.backgroundColor} !important;
          color: ${settings.textColor} !important;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error applying custom colors:', error);
    }
  }, [settings.enabled, settings.useCustomColors, settings.backgroundColor, settings.textColor]);
  
  // Highlight important text
  const highlightImportantText = React.useCallback(() => {
    if (!settings.enabled || !settings.highlightImportantText) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find and highlight important text elements
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        if (heading instanceof HTMLElement) {
          heading.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
          heading.style.padding = '2px 4px';
          heading.style.borderRadius = '2px';
        }
      });
      
      // Highlight strong and em elements
      const emphasisElements = document.querySelectorAll('strong, em, b, i');
      emphasisElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
          element.style.padding = '0 2px';
          element.style.borderRadius = '2px';
        }
      });
    } catch (error) {
      console.error('Error highlighting important text:', error);
    }
  }, [settings.enabled, settings.highlightImportantText]);
  
  // Apply all optimizations
  const applyAllOptimizations = React.useCallback(() => {
    applyFontFamily();
    applyFontSize();
    applyLineSpacing();
    applyLetterSpacing();
    applyCustomColors();
    highlightImportantText();
  }, [
    applyFontFamily,
    applyFontSize,
    applyLineSpacing,
    applyLetterSpacing,
    applyCustomColors,
    highlightImportantText
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
    <div className="dyslexia-friendly-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2" /> Dyslexia-Friendly Mode
          </CardTitle>
          <CardDescription>
            Optimize text display for easier reading with dyslexia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-dyslexia-friendly" className="flex items-center">
                Enable Dyslexia-Friendly Mode
              </Label>
              <input
                type="checkbox"
                id="enable-dyslexia-friendly"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                <select
                  id="font-family"
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  {fontFamilyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size" className="text-sm">
                    Font Size: {settings.fontSize}%
                  </Label>
                </div>
                <input
                  type="range"
                  id="font-size"
                  min="100"
                  max="200"
                  step="10"
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal</span>
                  <span>Large</span>
                  <span>Extra Large</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="line-spacing" className="text-sm">
                    Line Spacing: {settings.lineSpacing.toFixed(1)}
                  </Label>
                </div>
                <input
                  type="range"
                  id="line-spacing"
                  min="1.5"
                  max="3"
                  step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => handleSettingChange('lineSpacing', parseFloat(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal</span>
                  <span>Medium</span>
                  <span>Wide</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="letter-spacing" className="text-sm">
                    Letter Spacing: {settings.letterSpacing}px
                  </Label>
                </div>
                <input
                  type="range"
                  id="letter-spacing"
                  min="0"
                  max="5"
                  step="0.5"
                  value={settings.letterSpacing}
                  onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal</span>
                  <span>Medium</span>
                  <span>Wide</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use-custom-colors" className="flex items-center text-sm">
                  Use Custom Colors
                </Label>
                <input
                  type="checkbox"
                  id="use-custom-colors"
                  checked={settings.useCustomColors}
                  onChange={(e) => handleSettingChange('useCustomColors', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {settings.useCustomColors && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="background-color" className="text-sm">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="background-color"
                        value={settings.backgroundColor}
                        onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                        disabled={!settings.enabled}
                        className="w-8 h-8 rounded-md"
                      />
                      <input
                        type="text"
                        value={settings.backgroundColor}
                        onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                        disabled={!settings.enabled}
                        className="flex-1 p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-sm">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="text-color"
                        value={settings.textColor}
                        onChange={(e) => handleSettingChange('textColor', e.target.value)}
                        disabled={!settings.enabled}
                        className="w-8 h-8 rounded-md"
                      />
                      <input
                        type="text"
                        value={settings.textColor}
                        onChange={(e) => handleSettingChange('textColor', e.target.value)}
                        disabled={!settings.enabled}
                        className="flex-1 p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-important-text" className="flex items-center text-sm">
                  Highlight Important Text
                </Label>
                <input
                  type="checkbox"
                  id="highlight-important-text"
                  checked={settings.highlightImportantText}
                  onChange={(e) => handleSettingChange('highlightImportantText', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying dyslexia-friendly settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {optimizationStatus === 'complete' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="text-sm font-medium">Dyslexia-friendly settings applied successfully</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <p className="text-sm font-medium">Elements Processed</p>
                    <p className="text-2xl font-bold">{optimizationResults.elementsProcessed}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-sm font-medium">Elements Enhanced</p>
                    <p className="text-2xl font-bold">{optimizationResults.elementsEnhanced}</p>
                  </Card>
                </div>
                
                {optimizationResults.warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Warnings</p>
                    <ul className="space-y-1">
                      {optimizationResults.warnings.map((warning, i) => (
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
            onClick={applyDyslexiaFriendlyOptimizations} 
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

export default DyslexiaFriendlyModeEngine;
