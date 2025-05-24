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
  Zap,
  Clock
} from 'lucide-react';

interface ReadingTimeEstimatorProps {
  settings: {
    enabled: boolean;
    wordsPerMinute: number;
    showEstimateOnPage: boolean;
    highlightLongSections: boolean;
    adaptToReadingLevel: boolean;
    readingLevel: string;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const ReadingTimeEstimator: React.FC<ReadingTimeEstimatorProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = React.useState<string>('idle');
  const [analysisProgress, setAnalysisProgress] = React.useState<number>(0);
  const [analysisResults, setAnalysisResults] = React.useState<{
    totalWords: number;
    estimatedReadingTime: number;
    sections: Array<{
      title: string;
      wordCount: number;
      estimatedTime: number;
      complexity: string;
    }>;
  }>({
    totalWords: 0,
    estimatedReadingTime: 0,
    sections: []
  });

  // Reading level options
  const readingLevelOptions = [
    { value: 'primary', label: 'Primary School (Ages 5-11)' },
    { value: 'secondary', label: 'Secondary School (Ages 11-16)' },
    { value: 'college', label: 'College/Sixth Form (Ages 16-18)' },
    { value: 'university', label: 'University (Ages 18+)' },
    { value: 'professional', label: 'Professional' }
  ];

  // Analyze page content for reading time
  const analyzePageContent = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsAnalyzing(true);
    setAnalysisStatus('processing');
    setAnalysisProgress(0);
    
    // Simulate analysis process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setAnalysisProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Analysis complete
        setAnalysisStatus('complete');
        
        // Mock analysis results
        // In a real implementation, this would analyze the actual page content
        const mockResults = {
          totalWords: 2450,
          estimatedReadingTime: Math.ceil(2450 / settings.wordsPerMinute),
          sections: [
            {
              title: 'Introduction',
              wordCount: 350,
              estimatedTime: Math.ceil(350 / settings.wordsPerMinute),
              complexity: 'Low'
            },
            {
              title: 'Main Content',
              wordCount: 1500,
              estimatedTime: Math.ceil(1500 / settings.wordsPerMinute),
              complexity: 'Medium'
            },
            {
              title: 'Technical Details',
              wordCount: 400,
              estimatedTime: Math.ceil(400 / settings.wordsPerMinute),
              complexity: 'High'
            },
            {
              title: 'Conclusion',
              wordCount: 200,
              estimatedTime: Math.ceil(200 / settings.wordsPerMinute),
              complexity: 'Low'
            }
          ]
        };
        
        setAnalysisResults(mockResults);
        setIsAnalyzing(false);
        
        // If showing estimate on page is enabled, add reading time indicators
        if (settings.showEstimateOnPage) {
          addReadingTimeIndicators(mockResults);
        }
        
        // If highlighting long sections is enabled, highlight them
        if (settings.highlightLongSections) {
          highlightLongSections(mockResults);
        }
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings]);
  
  // Add reading time indicators to the page
  const addReadingTimeIndicators = React.useCallback((results: typeof analysisResults) => {
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Create a reading time indicator element
      const indicator = document.createElement('div');
      indicator.className = 'reading-time-indicator';
      indicator.style.position = 'sticky';
      indicator.style.top = '0';
      indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      indicator.style.padding = '8px 16px';
      indicator.style.borderBottom = '1px solid #eaeaea';
      indicator.style.zIndex = '1000';
      indicator.style.display = 'flex';
      indicator.style.alignItems = 'center';
      indicator.style.justifyContent = 'center';
      indicator.style.fontSize = '14px';
      indicator.style.fontWeight = 'bold';
      
      // Add clock icon
      const clockIcon = document.createElement('span');
      clockIcon.innerHTML = '⏱️';
      clockIcon.style.marginRight = '8px';
      
      // Add reading time text
      const readingTimeText = document.createElement('span');
      readingTimeText.textContent = `Estimated reading time: ${results.estimatedReadingTime} minutes`;
      
      // Assemble indicator
      indicator.appendChild(clockIcon);
      indicator.appendChild(readingTimeText);
      
      // Add to page
      document.body.insertBefore(indicator, document.body.firstChild);
      
      // Add section indicators
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (index < results.sections.length) {
          const section = results.sections[index];
          
          const sectionIndicator = document.createElement('span');
          sectionIndicator.className = 'section-reading-time';
          sectionIndicator.style.fontSize = '0.8em';
          sectionIndicator.style.color = '#666';
          sectionIndicator.style.marginLeft = '10px';
          sectionIndicator.textContent = `(${section.estimatedTime} min read)`;
          
          heading.appendChild(sectionIndicator);
        }
      });
    } catch (error) {
      console.error('Error adding reading time indicators:', error);
    }
  }, []);
  
  // Highlight long sections
  const highlightLongSections = React.useCallback((results: typeof analysisResults) => {
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find sections that take more than 5 minutes to read
      const longSections = results.sections.filter(section => section.estimatedTime > 5);
      
      // Highlight long sections
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (index < results.sections.length) {
          const section = results.sections[index];
          
          if (section.estimatedTime > 5) {
            const longSectionIndicator = document.createElement('span');
            longSectionIndicator.className = 'long-section-indicator';
            longSectionIndicator.style.fontSize = '0.8em';
            longSectionIndicator.style.color = '#e74c3c';
            longSectionIndicator.style.marginLeft = '10px';
            longSectionIndicator.textContent = '(Long section)';
            
            heading.appendChild(longSectionIndicator);
            
            // Find the section content (all elements until the next heading)
            let currentElement = heading.nextElementSibling;
            while (currentElement && !currentElement.matches('h1, h2, h3, h4, h5, h6')) {
              currentElement.style.borderLeft = '3px solid #e74c3c';
              currentElement.style.paddingLeft = '10px';
              currentElement = currentElement.nextElementSibling;
            }
          }
        }
      });
    } catch (error) {
      console.error('Error highlighting long sections:', error);
    }
  }, []);
  
  // Adjust reading time based on reading level
  const adjustForReadingLevel = React.useCallback((baseWordsPerMinute: number): number => {
    const adjustmentFactors: Record<string, number> = {
      primary: 0.6, // 60% of standard reading speed
      secondary: 0.8, // 80% of standard reading speed
      college: 1.0, // Standard reading speed
      university: 1.2, // 120% of standard reading speed
      professional: 1.4 // 140% of standard reading speed
    };
    
    const factor = adjustmentFactors[settings.readingLevel] || 1.0;
    return Math.round(baseWordsPerMinute * factor);
  }, [settings.readingLevel]);
  
  // Calculate effective words per minute based on settings
  const effectiveWordsPerMinute = React.useMemo(() => {
    if (settings.adaptToReadingLevel) {
      return adjustForReadingLevel(settings.wordsPerMinute);
    }
    return settings.wordsPerMinute;
  }, [settings.wordsPerMinute, settings.adaptToReadingLevel, settings.readingLevel, adjustForReadingLevel]);
  
  // Run analysis when settings change
  React.useEffect(() => {
    if (settings.enabled) {
      analyzePageContent();
    }
  }, [settings, analyzePageContent]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: string | number | boolean) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  // Format time in minutes and seconds
  const formatTime = (minutes: number): string => {
    if (minutes < 1) {
      return 'Less than a minute';
    } else if (minutes === 1) {
      return '1 minute';
    } else {
      return `${minutes} minutes`;
    }
  };
  
  return (
    <div className="reading-time-estimator">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Clock className="mr-2" /> Reading Time Estimator
          </CardTitle>
          <CardDescription>
            Estimate reading time for content based on reading speed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reading-time" className="flex items-center">
                Enable Reading Time Estimator
              </Label>
              <input
                type="checkbox"
                id="enable-reading-time"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="words-per-minute" className="text-sm">
                    Reading Speed: {settings.wordsPerMinute} words per minute
                  </Label>
                </div>
                <input
                  type="range"
                  id="words-per-minute"
                  min="100"
                  max="500"
                  step="25"
                  value={settings.wordsPerMinute}
                  onChange={(e) => handleSettingChange('wordsPerMinute', parseInt(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow (100 wpm)</span>
                  <span>Average (250 wpm)</span>
                  <span>Fast (500 wpm)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-estimate-on-page" className="flex items-center text-sm">
                  Show Estimate on Page
                </Label>
                <input
                  type="checkbox"
                  id="show-estimate-on-page"
                  checked={settings.showEstimateOnPage}
                  onChange={(e) => handleSettingChange('showEstimateOnPage', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-long-sections" className="flex items-center text-sm">
                  Highlight Long Sections
                </Label>
                <input
                  type="checkbox"
                  id="highlight-long-sections"
                  checked={settings.highlightLongSections}
                  onChange={(e) => handleSettingChange('highlightLongSections', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="adapt-to-reading-level" className="flex items-center text-sm">
                  Adapt to Reading Level
                </Label>
                <input
                  type="checkbox"
                  id="adapt-to-reading-level"
                  checked={settings.adaptToReadingLevel}
                  onChange={(e) => handleSettingChange('adaptToReadingLevel', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {settings.adaptToReadingLevel && (
                <div className="space-y-2">
                  <Label htmlFor="reading-level" className="text-sm">Reading Level</Label>
                  <select
                    id="reading-level"
                    value={settings.readingLevel}
                    onChange={(e) => handleSettingChange('readingLevel', e.target.value)}
                    disabled={!settings.enabled || !settings.adaptToReadingLevel}
                    className="w-full p-2 border rounded-md"
                  >
                    {readingLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {settings.adaptToReadingLevel && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
                  <p className="text-sm">
                    <strong>Adjusted reading speed:</strong> {effectiveWordsPerMinute} words per minute
                  </p>
                </div>
              )}
            </div>
            
            {analysisStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing content...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
            
            {analysisStatus === 'complete' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="text-sm font-medium">Content analysis complete</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Words:</span>
                    <span className="text-sm">{analysisResults.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estimated Reading Time:</span>
                    <span className="text-sm">{formatTime(analysisResults.estimatedReadingTime)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Section Breakdown:</p>
                  <div className="space-y-2">
                    {analysisResults.sections.map((section, index) => (
                      <div key={`section-${index}`} className="p-2 border rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{section.title}</span>
                          <Badge variant={section.complexity === 'High' ? 'destructive' : section.complexity === 'Medium' ? 'default' : 'outline'}>
                            {section.complexity} Complexity
                          </Badge>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs">{section.wordCount} words</span>
                          <span className="text-xs">{formatTime(section.estimatedTime)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={analyzePageContent} 
            disabled={!settings.enabled || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing Content...' : 'Analyze Content'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReadingTimeEstimator;
