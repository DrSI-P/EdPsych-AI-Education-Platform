'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Palette,
  Check
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface ColorBlindnessModeEngineProps {
  settings: {
    enabled: boolean;
    colorBlindnessType: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'custom';
    contrastEnhancement: number;
    colorShiftIntensity: number;
    usePatterns: boolean;
    highlightLinks: boolean;
    customColorMapping: Record<string, string>;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const ColorBlindnessModeEngine: React.FC<ColorBlindnessModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [applyProgress, setApplyProgress] = React.useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  const [previewMode, setPreviewMode] = React.useState<boolean>(false);
  
  // Color blindness type options
  const colorBlindnessTypes = [
    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
    { value: 'achromatopsia', label: 'Achromatopsia (Monochromacy)' },
    { value: 'custom', label: 'Custom' }
  ];
  
  // Apply color blindness mode
  const applyColorBlindnessMode = React.useCallback(() => {
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
        
        // Apply CSS filters based on color blindness type
        const root = document.documentElement;
        
        // Remove any existing filters
        root.style.filter = '';
        
        if (settings.colorBlindnessType === 'protanopia') {
          // Red-blind
          root.style.filter = `
            contrast(${100 + settings.contrastEnhancement}%) 
            saturate(${settings.colorShiftIntensity}%)
            hue-rotate(${settings.colorShiftIntensity / 10}deg)
          `;
        } else if (settings.colorBlindnessType === 'deuteranopia') {
          // Green-blind
          root.style.filter = `
            contrast(${100 + settings.contrastEnhancement}%) 
            saturate(${settings.colorShiftIntensity}%)
            hue-rotate(-${settings.colorShiftIntensity / 10}deg)
          `;
        } else if (settings.colorBlindnessType === 'tritanopia') {
          // Blue-blind
          root.style.filter = `
            contrast(${100 + settings.contrastEnhancement}%) 
            saturate(${settings.colorShiftIntensity}%)
            hue-rotate(${settings.colorShiftIntensity / 5}deg)
          `;
        } else if (settings.colorBlindnessType === 'achromatopsia') {
          // Monochromacy (grayscale)
          root.style.filter = `
            grayscale(100%)
            contrast(${100 + settings.contrastEnhancement}%)
          `;
        } else if (settings.colorBlindnessType === 'custom') {
          // Custom - no filter, use custom color mapping via CSS variables
          // This would be implemented with CSS variables in a real application
        }
        
        // Apply patterns if enabled
        if (settings.usePatterns) {
          // Add pattern styles to elements
          // This would be implemented with CSS in a real application
        }
        
        // Highlight links if enabled
        if (settings.highlightLinks) {
          // Add link highlighting styles
          // This would be implemented with CSS in a real application
        }
        
        // Log success
        console.log('Color blindness mode applied:', settings.colorBlindnessType);
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
      applyColorBlindnessMode();
    } else {
      // Remove any filters if disabled
      document.documentElement.style.filter = '';
    }
    
    // Clean up on unmount
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [settings.enabled, settings.colorBlindnessType, applyColorBlindnessMode]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Log setting change
    console.log(`Color blindness setting changed: ${setting} = ${value}`);
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
      colorBlindnessType: 'deuteranopia' as const,
      contrastEnhancement: 10,
      colorShiftIntensity: 80,
      usePatterns: false,
      highlightLinks: true,
      customColorMapping: {}
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Log reset
    console.log('Color blindness settings reset to defaults');
  };
  
  return (
    <div className="color-blindness-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Palette className="mr-2" /> Color Blindness Mode
          </CardTitle>
          <CardDescription>
            Adjusts colors to improve visibility for users with color vision deficiencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-color-blindness-mode" className="flex items-center">
                Enable Color Blindness Mode
              </Label>
              <input
                type="checkbox"
                id="enable-color-blindness-mode"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-blindness-type" className="text-sm">Color Blindness Type</Label>
                <select
                  id="color-blindness-type"
                  value={settings.colorBlindnessType}
                  onChange={(e) => handleSettingChange('colorBlindnessType', e.target.value)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  {colorBlindnessTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contrast-enhancement" className="text-sm">
                    Contrast Enhancement: {settings.contrastEnhancement}%
                  </Label>
                  <span className="text-xs text-gray-500">0 - 50%</span>
                </div>
                <input
                  type="range"
                  id="contrast-enhancement"
                  min="0"
                  max="50"
                  step="5"
                  value={settings.contrastEnhancement}
                  onChange={(e) => handleSettingChange('contrastEnhancement', parseInt(e.target.value, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="color-shift-intensity" className="text-sm">
                    Color Shift Intensity: {settings.colorShiftIntensity}%
                  </Label>
                  <span className="text-xs text-gray-500">50 - 150%</span>
                </div>
                <input
                  type="range"
                  id="color-shift-intensity"
                  min="50"
                  max="150"
                  step="5"
                  value={settings.colorShiftIntensity}
                  onChange={(e) => handleSettingChange('colorShiftIntensity', parseInt(e.target.value, 10))}
                  disabled={!settings.enabled || settings.colorBlindnessType === 'achromatopsia'}
                  className="w-full"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-patterns" className="flex items-center text-sm">
                      Use Patterns for Color Differentiation
                    </Label>
                    <input
                      type="checkbox"
                      id="use-patterns"
                      checked={settings.usePatterns}
                      onChange={(e) => handleSettingChange('usePatterns', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-links" className="flex items-center text-sm">
                      Highlight Links and Interactive Elements
                    </Label>
                    <input
                      type="checkbox"
                      id="highlight-links"
                      checked={settings.highlightLinks}
                      onChange={(e) => handleSettingChange('highlightLinks', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.colorBlindnessType === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-sm">Custom Color Mapping</Label>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Custom Color Mapping</AlertTitle>
                        <AlertDescription>
                          Custom color mapping allows you to define specific color replacements. This feature requires additional configuration.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
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
                  <span>Applying color blindness mode...</span>
                  <span>{applyProgress}%</span>
                </div>
                <Progress value={applyProgress} className="h-2" />
              </div>
            )}
            
            {previewMode && (
              <div className="space-y-2">
                <Label className="text-sm">Color Preview</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-red-500 rounded-md flex items-center justify-center text-white text-xs">
                    Red
                  </div>
                  <div className="h-10 bg-green-500 rounded-md flex items-center justify-center text-white text-xs">
                    Green
                  </div>
                  <div className="h-10 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs">
                    Blue
                  </div>
                  <div className="h-10 bg-yellow-500 rounded-md flex items-center justify-center text-white text-xs">
                    Yellow
                  </div>
                  <div className="h-10 bg-purple-500 rounded-md flex items-center justify-center text-white text-xs">
                    Purple
                  </div>
                  <div className="h-10 bg-orange-500 rounded-md flex items-center justify-center text-white text-xs">
                    Orange
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={applyColorBlindnessMode} 
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
          <strong>Color Blindness Tip:</strong> Different types of color blindness affect color perception in different ways. Protanopia affects red perception, deuteranopia affects green perception, and tritanopia affects blue perception. Achromatopsia is complete color blindness (monochromacy).
        </p>
      </div>
    </div>
  );
};

export default ColorBlindnessModeEngine;
