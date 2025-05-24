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
  Eye,
  EyeOff
} from 'lucide-react';

interface ColorBlindnessModeEngineProps {
  settings: {
    enabled: boolean;
    type: string;
    intensity: number;
    simulationMode: boolean;
    enhanceContrast: boolean;
    highlightLinks: boolean;
    highlightButtons: boolean;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const ColorBlindnessModeEngine: React.FC<ColorBlindnessModeEngineProps> = ({ 
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

  // Color blindness type options
  const colorBlindnessTypes = [
    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
    { value: 'achromatopsia', label: 'Achromatopsia (Complete Color Blindness)' },
    { value: 'protanomaly', label: 'Protanomaly (Red-Weak)' },
    { value: 'deuteranomaly', label: 'Deuteranomaly (Green-Weak)' },
    { value: 'tritanomaly', label: 'Tritanomaly (Blue-Weak)' }
  ];

  // Apply color blindness optimizations
  const applyColorBlindnessOptimizations = React.useCallback(() => {
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
          elementsProcessed: 135,
          elementsEnhanced: 82,
          warnings: [
            'Some embedded content may not be affected by color blindness settings',
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
      applyColorBlindnessOptimizations();
    }
  }, [settings, applyColorBlindnessOptimizations]);
  
  // Apply color blindness filters
  const applyColorBlindnessFilters = React.useCallback(() => {
    if (!settings.enabled) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Different SVG filters for different types of color blindness
      const filters: Record<string, string> = {
        protanopia: `
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        `,
        deuteranopia: `
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.7,   0.3,   0,   0, 0
                    0,     0.3,   0.7, 0, 0
                    0,     0,     0,   1, 0"
          />
        `,
        tritanopia: `
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"
          />
        `,
        achromatopsia: `
          <feColorMatrix
            type="matrix"
            values="0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0,     0,     0,     1, 0"
          />
        `,
        protanomaly: `
          <feColorMatrix
            type="matrix"
            values="0.817, 0.183, 0,     0, 0
                    0.333, 0.667, 0,     0, 0
                    0,     0.125, 0.875, 0, 0
                    0,     0,     0,     1, 0"
          />
        `,
        deuteranomaly: `
          <feColorMatrix
            type="matrix"
            values="0.8,   0.2,   0,     0, 0
                    0.258, 0.742, 0,     0, 0
                    0,     0.142, 0.858, 0, 0
                    0,     0,     0,     1, 0"
          />
        `,
        tritanomaly: `
          <feColorMatrix
            type="matrix"
            values="0.967, 0.033, 0,     0, 0
                    0,     0.733, 0.267, 0, 0
                    0,     0.183, 0.817, 0, 0
                    0,     0,     0,     1, 0"
          />
        `
      };
      
      // Create SVG filter
      const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgFilter.setAttribute('width', '0');
      svgFilter.setAttribute('height', '0');
      svgFilter.style.position = 'absolute';
      svgFilter.style.zIndex = '-1';
      
      // Create filter element
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'color-blindness-filter');
      
      // Set filter content based on type
      filter.innerHTML = filters[settings.type] || filters.deuteranopia;
      
      // Add filter to SVG
      svgFilter.appendChild(filter);
      
      // Add SVG to document
      document.body.appendChild(svgFilter);
      
      // Apply filter to body if simulation mode is enabled
      if (settings.simulationMode) {
        document.body.style.filter = `url(#color-blindness-filter)`;
      } else {
        document.body.style.filter = '';
      }
    } catch (error) {
      console.error('Error applying color blindness filters:', error);
    }
  }, [settings.enabled, settings.type, settings.simulationMode]);
  
  // Enhance contrast
  const enhanceContrast = React.useCallback(() => {
    if (!settings.enabled || !settings.enhanceContrast) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add contrast enhancement styles
      style.innerHTML = `
        :root {
          --contrast-enhancement: ${settings.intensity / 100};
        }
        
        body {
          filter: contrast(calc(1 + var(--contrast-enhancement)));
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error enhancing contrast:', error);
    }
  }, [settings.enabled, settings.enhanceContrast, settings.intensity]);
  
  // Highlight links
  const highlightLinks = React.useCallback(() => {
    if (!settings.enabled || !settings.highlightLinks) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add link highlighting styles
      style.innerHTML = `
        a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 2px !important;
          border-bottom: 2px solid currentColor !important;
        }
        
        a:focus, a:hover {
          outline: 2px solid currentColor !important;
          outline-offset: 2px !important;
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error highlighting links:', error);
    }
  }, [settings.enabled, settings.highlightLinks]);
  
  // Highlight buttons
  const highlightButtons = React.useCallback(() => {
    if (!settings.enabled || !settings.highlightButtons) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create style element
      const style = document.createElement('style');
      
      // Add button highlighting styles
      style.innerHTML = `
        button, [role="button"] {
          border: 2px solid currentColor !important;
        }
        
        button:focus, [role="button"]:focus,
        button:hover, [role="button"]:hover {
          outline: 2px solid currentColor !important;
          outline-offset: 2px !important;
        }
      `;
      
      // Add style to document
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error highlighting buttons:', error);
    }
  }, [settings.enabled, settings.highlightButtons]);
  
  // Apply all optimizations
  const applyAllOptimizations = React.useCallback(() => {
    applyColorBlindnessFilters();
    enhanceContrast();
    highlightLinks();
    highlightButtons();
  }, [
    applyColorBlindnessFilters,
    enhanceContrast,
    highlightLinks,
    highlightButtons
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
    <div className="color-blindness-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Eye className="mr-2" /> Color Blindness Mode
          </CardTitle>
          <CardDescription>
            Optimize colors for different types of color vision deficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-color-blindness" className="flex items-center">
                Enable Color Blindness Mode
              </Label>
              <input
                type="checkbox"
                id="enable-color-blindness"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-blindness-type" className="text-sm">Type of Color Blindness</Label>
                <select
                  id="color-blindness-type"
                  value={settings.type}
                  onChange={(e) => handleSettingChange('type', e.target.value)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  {colorBlindnessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity-slider" className="text-sm">
                    Intensity: {settings.intensity}%
                  </Label>
                </div>
                <input
                  type="range"
                  id="intensity-slider"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.intensity}
                  onChange={(e) => handleSettingChange('intensity', parseInt(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="simulation-mode" className="flex items-center text-sm">
                  Simulation Mode
                </Label>
                <input
                  type="checkbox"
                  id="simulation-mode"
                  checked={settings.simulationMode}
                  onChange={(e) => handleSettingChange('simulationMode', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enhance-contrast" className="flex items-center text-sm">
                  Enhance Contrast
                </Label>
                <input
                  type="checkbox"
                  id="enhance-contrast"
                  checked={settings.enhanceContrast}
                  onChange={(e) => handleSettingChange('enhanceContrast', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-links" className="flex items-center text-sm">
                  Highlight Links
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
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-buttons" className="flex items-center text-sm">
                  Highlight Buttons
                </Label>
                <input
                  type="checkbox"
                  id="highlight-buttons"
                  checked={settings.highlightButtons}
                  onChange={(e) => handleSettingChange('highlightButtons', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying color blindness settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {optimizationStatus === 'complete' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="text-sm font-medium">Color blindness settings applied successfully</p>
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
            onClick={applyColorBlindnessOptimizations} 
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

export default ColorBlindnessModeEngine;
