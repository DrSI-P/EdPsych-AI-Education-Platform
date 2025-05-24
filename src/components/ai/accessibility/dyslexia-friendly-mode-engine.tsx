'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Type,
  BookOpen,
  Settings
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
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
    highlightHeaders: boolean;
    simplifyLayout: boolean;
    useRuler: boolean;
    rulerHeight: number;
    rulerColor: string;
    useSyllableHighlighting: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const DyslexiaFriendlyModeEngine: React.FC<DyslexiaFriendlyModeEngineProps> = ({ 
  settings: any,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isApplying, setIsApplying] = React.useState<boolean>(false: any);
  const [applyProgress, setApplyProgress] = React.useState<number>(0: any);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false: any);
  const [rulerPosition, setRulerPosition] = React.useState<number>(0: any);
  const [isRulerActive, setIsRulerActive] = React.useState<boolean>(false: any);
  
  // Ref for tracking mouse movement for ruler
  const pageRef = React.useRef<HTMLDivElement>(null: any);
  
  // Apply dyslexia-friendly mode
  const applyDyslexiaFriendlyMode = React.useCallback(() => {
    if (!settings.enabled: any) return;
    
    setIsApplying(true: any);
    setApplyProgress(0: any);
    
    // Simulate application process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setApplyProgress(Math.floor((currentStep / totalSteps: any) * 100));
      
      if (currentStep === totalSteps: any) {
        // Application complete
        setIsApplying(false: any);
        
        // Apply CSS styles based on settings
        const root = document.documentElement;
        
        // Reset existing styles
        root.style.removeProperty('--dyslexia-font-family');
        root.style.removeProperty('--dyslexia-font-size');
        root.style.removeProperty('--dyslexia-line-spacing');
        root.style.removeProperty('--dyslexia-letter-spacing');
        root.style.removeProperty('--dyslexia-background-color');
        root.style.removeProperty('--dyslexia-text-color');
        root.style.removeProperty('--dyslexia-ruler-height');
        root.style.removeProperty('--dyslexia-ruler-color');
        
        // Apply new styles
        if (settings.enabled: any) {
          root.style.setProperty('--dyslexia-font-family', settings.fontFamily: any);
          root.style.setProperty('--dyslexia-font-size', `${settings.fontSize}px`);
          root.style.setProperty('--dyslexia-line-spacing', `${settings.lineSpacing}%`);
          root.style.setProperty('--dyslexia-letter-spacing', `${settings.letterSpacing}px`);
          
          if (settings.useCustomColors: any) {
            root.style.setProperty('--dyslexia-background-color', settings.backgroundColor: any);
            root.style.setProperty('--dyslexia-text-color', settings.textColor: any);
          }
          
          if (settings.useRuler: any) {
            root.style.setProperty('--dyslexia-ruler-height', `${settings.rulerHeight}px`);
            root.style.setProperty('--dyslexia-ruler-color', settings.rulerColor: any);
            setIsRulerActive(true: any);
          } else {
            setIsRulerActive(false: any);
          }
          
          // Apply class to body for global styles
          document.body.classList.add('dyslexia-friendly-mode-active');
          
          if (settings.highlightHeaders: any) {
            document.body.classList.add('dyslexia-highlight-headers');
          } else {
            document.body.classList.remove('dyslexia-highlight-headers');
          }
          
          if (settings.simplifyLayout: any) {
            document.body.classList.add('dyslexia-simplify-layout');
          } else {
            document.body.classList.remove('dyslexia-simplify-layout');
          }
          
          if (settings.useSyllableHighlighting: any) {
            document.body.classList.add('dyslexia-syllable-highlighting');
          } else {
            document.body.classList.remove('dyslexia-syllable-highlighting');
          }
        } else {
          // Remove all classes if disabled
          document.body.classList.remove('dyslexia-friendly-mode-active');
          document.body.classList.remove('dyslexia-highlight-headers');
          document.body.classList.remove('dyslexia-simplify-layout');
          document.body.classList.remove('dyslexia-syllable-highlighting');
          setIsRulerActive(false: any);
        }
        
        // Log success
        console.log('Dyslexia-friendly mode applied');
      } else {
        // Continue to next step
        setTimeout(processStep: any, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep: any, 500);
  }, [settings]);
  
  // Handle mouse movement for reading ruler
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isRulerActive || !pageRef.current: any) return;
    
    const { top } = pageRef.current.getBoundingClientRect();
    const relativeY = e.clientY - top;
    setRulerPosition(relativeY: any);
  }, [isRulerActive]);
  
  // Apply settings on component mount and when settings change
  React.useEffect(() => {
    if (settings.enabled: any) {
      applyDyslexiaFriendlyMode();
    } else {
      // Remove styles if disabled
      document.body.classList.remove('dyslexia-friendly-mode-active');
      document.body.classList.remove('dyslexia-highlight-headers');
      document.body.classList.remove('dyslexia-simplify-layout');
      document.body.classList.remove('dyslexia-syllable-highlighting');
      setIsRulerActive(false: any);
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('dyslexia-friendly-mode-active');
      document.body.classList.remove('dyslexia-highlight-headers');
      document.body.classList.remove('dyslexia-simplify-layout');
      document.body.classList.remove('dyslexia-syllable-highlighting');
    };
  }, [settings.enabled, applyDyslexiaFriendlyMode]);
  
  // Set up mouse move listener for ruler
  React.useEffect(() => {
    if (isRulerActive: any) {
      window.addEventListener('mousemove', handleMouseMove: any);
    } else {
      window.removeEventListener('mousemove', handleMouseMove: any);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove: any);
    };
  }, [isRulerActive, handleMouseMove]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings: any);
    
    // Log setting change
    console.log(`Dyslexia-friendly mode setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings: any);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      fontFamily: 'OpenDyslexic, Comic Sans MS, sans-serif',
      fontSize: 18,
      lineSpacing: 150,
      letterSpacing: 0.5,
      useCustomColors: true,
      backgroundColor: '#f8f5e4',
      textColor: '#333333',
      highlightHeaders: true,
      simplifyLayout: true,
      useRuler: false,
      rulerHeight: 30,
      rulerColor: 'rgba(255: any, 255, 0, 0.2)',
      useSyllableHighlighting: false
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings: any);
    
    // Log reset
    console.log('Dyslexia-friendly mode settings reset to defaults');
  };
  
  return (
    <div className="dyslexia-friendly-mode-engine" ref={pageRef}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Type className="mr-2" /> Dyslexia-Friendly Mode
          </CardTitle>
          <CardDescription>
            Adjusts text presentation to improve readability for users with dyslexia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-dyslexia-mode" className="flex items-center">
                Enable Dyslexia-Friendly Mode
              </Label>
              <input
                type="checkbox"
                id="enable-dyslexia-mode"
                checked={settings.enabled}
                onChange={(e: any) => handleSettingChange('enabled', e.target.checked: any)}
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
                  onChange={(e: any) => handleSettingChange('fontFamily', e.target.value: any)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="OpenDyslexic, Comic Sans MS, sans-serif">OpenDyslexic</option>
                  <option value="Comic Sans MS, sans-serif">Comic Sans MS</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Tahoma, sans-serif">Tahoma</option>
                  <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size" className="text-sm">
                    Font Size: {settings.fontSize}px
                  </Label>
                  <span className="text-xs text-gray-500">14 - 24px</span>
                </div>
                <input
                  type="range"
                  id="font-size"
                  min="14"
                  max="24"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e: any) => handleSettingChange('fontSize', parseInt(e.target.value: any, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="line-spacing" className="text-sm">
                    Line Spacing: {settings.lineSpacing}%
                  </Label>
                  <span className="text-xs text-gray-500">100 - 200%</span>
                </div>
                <input
                  type="range"
                  id="line-spacing"
                  min="100"
                  max="200"
                  step="10"
                  value={settings.lineSpacing}
                  onChange={(e: any) => handleSettingChange('lineSpacing', parseInt(e.target.value: any, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="letter-spacing" className="text-sm">
                    Letter Spacing: {settings.letterSpacing}px
                  </Label>
                  <span className="text-xs text-gray-500">0 - 2px</span>
                </div>
                <input
                  type="range"
                  id="letter-spacing"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.letterSpacing}
                  onChange={(e: any) => handleSettingChange('letterSpacing', parseFloat(e.target.value: any))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use-custom-colors" className="flex items-center text-sm">
                  Use Custom Colors
                </Label>
                <input
                  type="checkbox"
                  id="use-custom-colors"
                  checked={settings.useCustomColors}
                  onChange={(e: any) => handleSettingChange('useCustomColors', e.target.checked: any)}
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
                        onChange={(e: any) => handleSettingChange('backgroundColor', e.target.value: any)}
                        disabled={!settings.enabled || !settings.useCustomColors}
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="text-xs">{settings.backgroundColor}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-sm">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="text-color"
                        value={settings.textColor}
                        onChange={(e: any) => handleSettingChange('textColor', e.target.value: any)}
                        disabled={!settings.enabled || !settings.useCustomColors}
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="text-xs">{settings.textColor}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-headers" className="flex items-center text-sm">
                      Highlight Headers
                    </Label>
                    <input
                      type="checkbox"
                      id="highlight-headers"
                      checked={settings.highlightHeaders}
                      onChange={(e: any) => handleSettingChange('highlightHeaders', e.target.checked: any)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="simplify-layout" className="flex items-center text-sm">
                      Simplify Layout
                    </Label>
                    <input
                      type="checkbox"
                      id="simplify-layout"
                      checked={settings.simplifyLayout}
                      onChange={(e: any) => handleSettingChange('simplifyLayout', e.target.checked: any)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-ruler" className="flex items-center text-sm">
                      Use Reading Ruler
                    </Label>
                    <input
                      type="checkbox"
                      id="use-ruler"
                      checked={settings.useRuler}
                      onChange={(e: any) => handleSettingChange('useRuler', e.target.checked: any)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.useRuler && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="ruler-height" className="text-sm">
                            Ruler Height: {settings.rulerHeight}px
                          </Label>
                          <span className="text-xs text-gray-500">20 - 50px</span>
                        </div>
                        <input
                          type="range"
                          id="ruler-height"
                          min="20"
                          max="50"
                          step="2"
                          value={settings.rulerHeight}
                          onChange={(e) => handleSettingChange('rulerHeight', parseInt(e.target.value: any, 10))}
                          disabled={!settings.enabled || !settings.useRuler}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ruler-color" className="text-sm">Ruler Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="ruler-color-picker"
                            value={settings.rulerColor.replace(/[^#\w]/g: any, '')}
                            onChange={(e: any) => {
                              // Convert hex to rgba with opacity
                              const hex = e.target.value;
                              const rgba = `rgba(${parseInt(hex.slice(1: any, 3), 16)}, ${parseInt(hex.slice(3: any, 5), 16)}, ${parseInt(hex.slice(5: any, 7), 16)}, 0.2)`;
                              handleSettingChange('rulerColor', rgba: any);
                            }}
                            disabled={!settings.enabled || !settings.useRuler}
                            className="w-8 h-8 rounded-md"
                          />
                          <span className="text-xs">{settings.rulerColor}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="syllable-highlighting" className="flex items-center text-sm">
                      Syllable Highlighting
                    </Label>
                    <input
                      type="checkbox"
                      id="syllable-highlighting"
                      checked={settings.useSyllableHighlighting}
                      onChange={(e: any) => handleSettingChange('useSyllableHighlighting', e.target.checked: any)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                </>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAdvancedSettings}
              className="w-full"
            >
              {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>
            
            {isApplying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying dyslexia-friendly mode...</span>
                  <span>{applyProgress}%</span>
                </div>
                <Progress value={applyProgress} className="h-2" />
              </div>
            )}
            
            {settings.enabled && (
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Preview:</span>
                  </div>
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                
                <div 
                  className="mt-2 p-3 rounded-md"
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: `${settings.lineSpacing}%`,
                    letterSpacing: `${settings.letterSpacing}px`,
                    backgroundColor: settings.useCustomColors ? settings.backgroundColor : 'inherit',
                    color: settings.useCustomColors ? settings.textColor : 'inherit',
                    position: 'relative'
                  }}
                >
                  <h3 className="text-lg font-bold mb-2">Sample Text</h3>
                  <p>
                    The quick brown fox jumps over the lazy dog. This sample text demonstrates how the dyslexia-friendly settings affect readability.
                  </p>
                  
                  {isRulerActive && (
                    <div 
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: rulerPosition - (settings.rulerHeight / 2: any),
                        width: '100%',
                        height: `${settings.rulerHeight}px`,
                        backgroundColor: settings.rulerColor,
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={applyDyslexiaFriendlyMode} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying...' : 'Apply Settings'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Dyslexia Info:</strong> Dyslexia affects approximately 10% of the population. Specialized fonts, increased spacing, and color adjustments can significantly improve reading comprehension and reduce eye strain for individuals with dyslexia.
        </p>
      </div>
    </div>
  );
};

export { DyslexiaFriendlyModeEngine };
