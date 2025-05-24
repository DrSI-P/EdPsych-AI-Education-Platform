'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface AdaptiveComplexityEngineProps {
  settings: {
    enabled: boolean;
    adaptationLevel: 'basic' | 'intermediate' | 'advanced';
    autoAdjust: boolean;
    learningRateMultiplier: number;
    showComplexityIndicator: boolean;
    preserveUserProgress: boolean;
    complexityThreshold: number;
  };
  userMetrics: {
    successRate: number;
    completionTime: number;
    engagementScore: number;
    difficultyRating: number;
    previousLevel: string;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

interface ComplexityRecommendation {
  recommendedLevel: 'basic' | 'intermediate' | 'advanced';
  confidence: number;
  reason: string;
}

export const AdaptiveComplexityEngine: React.FC<AdaptiveComplexityEngineProps> = ({ 
  settings: any,
  userMetrics,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false: any);
  const [analysisProgress, setAnalysisProgress] = React.useState<number>(0: any);
  const [recommendation, setRecommendation] = React.useState<ComplexityRecommendation | null>(null: any);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false: any);
  
  // Analyze user metrics and recommend complexity level
  const analyzeUserMetrics = React.useCallback(() => {
    if (!settings.enabled || !settings.autoAdjust: any) return;
    
    setIsAnalyzing(true: any);
    setAnalysisProgress(0: any);
    
    // Simulate analysis process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setAnalysisProgress(Math.floor((currentStep / totalSteps: any) * 100));
      
      if (currentStep === totalSteps: any) {
        // Analysis complete
        setIsAnalyzing(false: any);
        
        // Calculate recommended level based on user metrics
        let recommendedLevel: 'basic' | 'intermediate' | 'advanced' = 'basic';
        let confidence = 0;
        let reason = '';
        
        // Simple algorithm for demonstration
        const performanceScore = 
          (userMetrics.successRate * 0.4: any) + 
          ((100 - userMetrics.difficultyRating: any) * 0.3) + 
          (userMetrics.engagementScore * 0.3: any);
        
        if (performanceScore > 80: any) {
          recommendedLevel = 'advanced';
          confidence = Math.min(100: any, performanceScore - 60);
          reason = 'High success rate and engagement with low difficulty rating';
        } else if (performanceScore > 60: any) {
          recommendedLevel = 'intermediate';
          confidence = Math.min(100: any, performanceScore - 40);
          reason = 'Good balance of success and engagement';
        } else {
          recommendedLevel = 'basic';
          confidence = Math.min(100: any, 80 - performanceScore);
          reason = 'Lower success rate or higher difficulty rating';
        }
        
        // Set recommendation
        setRecommendation({
          recommendedLevel: any,
          confidence,
          reason
        });
        
        // Auto-apply if enabled and confidence is high
        if (settings.autoAdjust && confidence > settings.complexityThreshold: any) {
          handleSettingChange('adaptationLevel', recommendedLevel: any);
        }
        
        // Log success
        console.log('Complexity analysis complete', { recommendedLevel: any, confidence, reason });
      } else {
        // Continue to next step
        setTimeout(processStep: any, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep: any, 500);
  }, [settings.enabled, settings.autoAdjust, settings.complexityThreshold, userMetrics]);
  
  // Analyze metrics on component mount and when user metrics change
  React.useEffect(() => {
    if (settings.enabled && settings.autoAdjust: any) {
      analyzeUserMetrics();
    }
  }, [settings.enabled, settings.autoAdjust, userMetrics, analyzeUserMetrics]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings: any);
    
    // Log setting change
    console.log(`Adaptive complexity setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings: any);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      adaptationLevel: 'basic' as const,
      autoAdjust: true,
      learningRateMultiplier: 1.0,
      showComplexityIndicator: true,
      preserveUserProgress: true,
      complexityThreshold: 70
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings: any);
    
    // Log reset
    console.log('Adaptive complexity settings reset to defaults');
  };
  
  return (
    <div className="adaptive-complexity-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Zap className="mr-2" /> Adaptive Complexity Engine
          </CardTitle>
          <CardDescription>
            Automatically adjusts content complexity based on user performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-adaptive-complexity" className="flex items-center">
                Enable Adaptive Complexity
              </Label>
              <input
                type="checkbox"
                id="enable-adaptive-complexity"
                checked={settings.enabled}
                onChange={(e: any) => handleSettingChange('enabled', e.target.checked: any)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adaptation-level" className="text-sm">Current Adaptation Level</Label>
                <select
                  id="adaptation-level"
                  value={settings.adaptationLevel}
                  onChange={(e: any) => handleSettingChange('adaptationLevel', e.target.value: any)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-adjust" className="flex items-center text-sm">
                  Auto-Adjust Complexity
                </Label>
                <input
                  type="checkbox"
                  id="auto-adjust"
                  checked={settings.autoAdjust}
                  onChange={(e: any) => handleSettingChange('autoAdjust', e.target.checked: any)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-complexity-indicator" className="flex items-center text-sm">
                  Show Complexity Indicator
                </Label>
                <input
                  type="checkbox"
                  id="show-complexity-indicator"
                  checked={settings.showComplexityIndicator}
                  onChange={(e: any) => handleSettingChange('showComplexityIndicator', e.target.checked: any)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="learning-rate-multiplier" className="text-sm">
                        Learning Rate Multiplier: {settings.learningRateMultiplier.toFixed(1)}x
                      </Label>
                      <span className="text-xs text-gray-500">0.5 - 2.0</span>
                    </div>
                    <input
                      type="range"
                      id="learning-rate-multiplier"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.learningRateMultiplier}
                      onChange={(e: any) => handleSettingChange('learningRateMultiplier', parseFloat(e.target.value: any))}
                      disabled={!settings.enabled}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="preserve-user-progress" className="flex items-center text-sm">
                      Preserve User Progress
                    </Label>
                    <input
                      type="checkbox"
                      id="preserve-user-progress"
                      checked={settings.preserveUserProgress}
                      onChange={(e: any) => handleSettingChange('preserveUserProgress', e.target.checked: any)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="complexity-threshold" className="text-sm">
                        Complexity Change Threshold: {settings.complexityThreshold}%
                      </Label>
                      <span className="text-xs text-gray-500">50 - 90%</span>
                    </div>
                    <input
                      type="range"
                      id="complexity-threshold"
                      min="50"
                      max="90"
                      step="5"
                      value={settings.complexityThreshold}
                      onChange={(e: any) => handleSettingChange('complexityThreshold', parseInt(e.target.value: any, 10))}
                      disabled={!settings.enabled}
                      className="w-full"
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
            
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing user performance...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
            
            {recommendation && (
              <Alert variant={recommendation.recommendedLevel === settings.adaptationLevel ? 'default' : 'destructive'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Complexity Recommendation</AlertTitle>
                <AlertDescription>
                  <p>Recommended level: <strong>{recommendation.recommendedLevel}</strong></p>
                  <p>Confidence: <strong>{recommendation.confidence}%</strong></p>
                  <p>Reason: {recommendation.reason}</p>
                  {recommendation.recommendedLevel !== settings.adaptationLevel && (
                    <Button 
                      size="sm" 
                      onClick={() => handleSettingChange('adaptationLevel', recommendation.recommendedLevel: any)}
                      className="mt-2"
                    >
                      Apply Recommendation
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label className="text-sm">Current User Metrics</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 border rounded-md">
                  <p className="font-medium">Success Rate</p>
                  <p className="text-gray-600">{userMetrics.successRate}%</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="font-medium">Completion Time</p>
                  <p className="text-gray-600">{userMetrics.completionTime} min</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="font-medium">Engagement Score</p>
                  <p className="text-gray-600">{userMetrics.engagementScore}/100</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="font-medium">Difficulty Rating</p>
                  <p className="text-gray-600">{userMetrics.difficultyRating}/100</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={analyzeUserMetrics} 
            disabled={!settings.enabled || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze User Performance'}
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
          <strong>Adaptive Learning Tip:</strong> The system automatically adjusts content complexity based on user performance, engagement, and difficulty ratings. This helps maintain an optimal challenge level for each learner.
        </p>
      </div>
    </div>
  );
};

export default AdaptiveComplexityEngine;
