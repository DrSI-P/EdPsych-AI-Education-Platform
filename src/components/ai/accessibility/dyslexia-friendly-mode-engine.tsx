'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Eye,
  EyeOff
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
    highlightActiveLines: boolean;
    simplifyLayout: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const DyslexiaFriendlyModeEngine: React.FC<DyslexiaFriendlyModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [applyProgress, setApplyProgress] = React.useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  const [previewMode, setPreviewMode] = React.useState<boolean>(false);
  
  // Font family options
  const fontFamilyOptions = [
    { value: 'OpenDyslexic', label: 'OpenDyslexic' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Lexie Readable', label: 'Lexie Readable' }
  ];
  
  // Apply dyslexia-friendly mode
  const applyDyslexiaFriendlyMode = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsApplying(true);
    setApplyProgress(0);
    
    // Simulate application process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setApplyProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Application complete
        setIsApplying(false);
        
        // Apply CSS styles based on settings
        const root = document.documentElement;
        
        // Reset existing styles
        root.style.removeProperty('--dyslexia-font-family');
        root.style.removeProperty('--dyslexia-font-size');
        root.style.removeProperty('--dyslexia-line-spacing');
        root.style.removeProperty('--dyslexia-letter-spacing');
        root.style.removeProperty('--dyslexia-background-color');
        root.style.removeProperty('--dyslexia-text-color');
        
        // Apply new styles
        root.style.setProperty('--dyslexia-font-family', settings.fontFamily);
        root.style.setProperty('--dyslexia-font-size', `${settings.fontSize}px`);
        root.style.setProperty('--dyslexia-line-spacing', `${settings.lineSpacing}%`);
        root.style.setProperty('--dyslexia-letter-spacing', `${settings.letterSpacing}px`);
        
        if (settings.useCustomColors) {
          root.style.setProperty('--dyslexia-background-color', settings.backgroundColor);
          root.style.setProperty('--dyslexia-text-color', settings.textColor);
        }
        
        // Apply class to body for global styles
        if (settings.enabled) {
          document.body.classList.add('dyslexia-friendly-mode');
        } else {
          document.body.classList.remove('dyslexia-friendly-mode');
        }
        
        // Apply line highlighting if enabled
        if (settings.highlightActiveLines) {
          document.body.classList.add('dyslexia-highlight-lines');
        } else {
          document.body.classList.remove('dyslexia-highlight-lines');
        }
        
        // Apply simplified layout if enabled
        if (settings.simplifyLayout) {
          document.body.classList.add('dyslexia-simplified-layout');
        } else {
          document.body.classList.remove('dyslexia-simplified-layout');
        }
        
        // Log success
        console.log('Dyslexia-friendly mode applied');
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings]);
  
  // Apply settings on component mount and when settings change
  React.useEffect(() => {
    if (settings.enabled) {
      applyDyslexiaFriendlyMode();
    } else {
      // Remove styles if disabled
      document.body.classList.remove('dyslexia-friendly-mode');
      document.body.classList.remove('dyslexia-highlight-lines');
      document.body.classList.remove('dyslexia-simplified-layout');
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('dyslexia-friendly-mode');
      document.body.classList.remove('dyslexia-highlight-lines');
      document.body.classList.remove('dyslexia-simplified-layout');
    };
  }, [settings.enabled, applyDyslexiaFriendlyMode]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Log setting change
    console.log(`Dyslexia-friendly setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  // Toggle preview mode
  const togglePreviewMode = (): void => {
    setPreviewMode(!previewMode);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      fontFamily: 'OpenDyslexic',
      fontSize: 18,
      lineSpacing: 150,
      letterSpacing: 0.5,
      useCustomColors: true,
      backgroundColor: '#f8f5e4',
      textColor: '#333333',
      highlightActiveLines: true,
      simplifyLayout: true
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Log reset
    console.log('Dyslexia-friendly settings reset to defaults');
  };
  
  return (
    <div className="dyslexia-friendly-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Eye className="mr-2" /> Dyslexia-Friendly Mode
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
                  {fontFamilyOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
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
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
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
                  onChange={(e) => handleSettingChange('lineSpacing', parseInt(e.target.value, 10))}
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
                  onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
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
                            onChange={(e) => handleSettingChange('textColor', e.target.value)}
                            disabled={!settings.enabled}
                            className="w-8 h-8 rounded-md"
                          />
                          <span className="text-xs">{settings.textColor}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-active-lines" className="flex items-center text-sm">
                      Highlight Active Lines
                    </Label>
                    <input
                      type="checkbox"
                      id="highlight-active-lines"
                      checked={settings.highlightActiveLines}
                      onChange={(e) => handleSettingChange('highlightActiveLines', e.target.checked)}
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
                      onChange={(e) => handleSettingChange('simplifyLayout', e.target.checked)}
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
            
            {previewMode && (
              <div className="space-y-2">
                <Label className="text-sm">Text Preview</Label>
                <div 
                  className="p-4 border rounded-md"
                  style={{
                    fontFamily: settings.enabled ? settings.fontFamily : 'inherit',
                    fontSize: settings.enabled ? `${settings.fontSize}px` : 'inherit',
                    lineHeight: settings.enabled ? `${settings.lineSpacing}%` : 'inherit',
                    letterSpacing: settings.enabled ? `${settings.letterSpacing}px` : 'inherit',
                    backgroundColor: settings.enabled && settings.useCustomColors ? settings.backgroundColor : 'inherit',
                    color: settings.enabled && settings.useCustomColors ? settings.textColor : 'inherit'
                  }}
                >
                  <p>The quick brown fox jumps over the lazy dog.</p>
                  <p>Pack my box with five dozen liquor jugs.</p>
                  <p>How vexingly quick daft zebras jump!</p>
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
          
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              onClick={togglePreviewMode}
              className="flex-1"
            >
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="flex-1"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Dyslexia-Friendly Tip:</strong> Specialized fonts like OpenDyslexic are designed with heavier bottom portions to help prevent letters from appearing to flip or move. Increased spacing between lines and letters can also significantly improve readability for users with dyslexia.
        </p>
      </div>
    </div>
  );
};

export default DyslexiaFriendlyModeEngine;
