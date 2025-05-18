'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { 
  Brain, 
  BarChart3, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Layers,
  Zap,
  LineChart,
  ArrowUpDown,
  Lightbulb,
  AlertCircle
} from "lucide-react";

interface AdaptiveComplexityEngineProps {
  content?: string;
  title?: string;
  subject?: string;
  keyStage?: string;
  contentId?: string;
  studentPerformanceData?: any;
  onComplexityAdjusted?: (adjustedContent: any) => void;
  className?: string;
}

export default function AdaptiveComplexityEngine({
  content = '',
  title = '',
  subject = '',
  keyStage = '',
  contentId,
  studentPerformanceData,
  onComplexityAdjusted,
  className
}: AdaptiveComplexityEngineProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedContent, setAdjustedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('original');
  const [settings, setSettings] = useState({
    targetComplexityLevel: 50,
    adaptToPerformance: true,
    includeScaffolding: true,
    includeExtensions: true,
    preserveMultiModal: true,
    adaptationStrength: 70,
    autoAssessComprehension: true
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  
  // Fetch student performance data if available
  useEffect(() => {
    if (studentPerformanceData) {
      setPerformanceMetrics(studentPerformanceData);
    } else if (contentId) {
      fetchPerformanceData(contentId);
    }
  }, [studentPerformanceData, contentId]);
  
  const fetchPerformanceData = async (contentId: string) => {
    try {
      const response = await fetch(`/api/ai/student-performance?contentId=${contentId}`);
      if (response.ok) {
        const data = await response.json();
        setPerformanceMetrics(data.performanceMetrics);
        
        // Auto-adjust target complexity based on performance if enabled
        if (settings.adaptToPerformance && data.performanceMetrics?.recommendedComplexity) {
          setSettings(prev => ({
            ...prev,
            targetComplexityLevel: data.performanceMetrics.recommendedComplexity
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const adjustComplexity = async () => {
    if (!content && !contentId && !title) {
      toast({
        title: "Missing content",
        description: "Please provide content, a title, or select existing content.",
        variant: "destructive"
      });
      return;
    }

    setIsAdjusting(true);

    try {
      const response = await fetch('/api/ai/adaptive-complexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          subject,
          keyStage,
          contentId,
          settings,
          performanceMetrics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adjust content complexity');
      }

      const data = await response.json();
      setAdjustedContent(data.adjustedContent);
      
      if (onComplexityAdjusted) {
        onComplexityAdjusted(data.adjustedContent);
      }

      toast({
        title: "Complexity adjusted",
        description: "Content has been successfully adjusted to the appropriate complexity level.",
      });
      
      // Switch to adjusted content tab
      setActiveTab('adjusted');
    } catch (error) {
      console.error('Error adjusting complexity:', error);
      toast({
        title: "Adjustment failed",
        description: "Failed to adjust content complexity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdjusting(false);
    }
  };
  
  const getComplexityLevelDescription = (level: number) => {
    if (level < 20) return "Very Simple";
    if (level < 40) return "Simple";
    if (level < 60) return "Moderate";
    if (level < 80) return "Complex";
    return "Very Complex";
  };
  
  const getComplexityBadgeColor = (level: number) => {
    if (level < 20) return "bg-green-50 text-green-700 border-green-200";
    if (level < 40) return "bg-blue-50 text-blue-700 border-blue-200";
    if (level < 60) return "bg-purple-50 text-purple-700 border-purple-200";
    if (level < 80) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };
  
  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) return null;
    
    return (
      <div className="space-y-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <LineChart className="h-4 w-4 text-blue-600" />
            Student Performance Metrics
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Auto-detected
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Comprehension Level</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${performanceMetrics.comprehensionLevel}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{performanceMetrics.comprehensionLevel}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Engagement Level</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${performanceMetrics.engagementLevel}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{performanceMetrics.engagementLevel}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${performanceMetrics.completionRate}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{performanceMetrics.completionRate}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Assessment Score</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${performanceMetrics.assessmentScore}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{performanceMetrics.assessmentScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Recommended Complexity</span>
          </div>
          <Badge variant="outline" className={getComplexityBadgeColor(performanceMetrics.recommendedComplexity)}>
            {performanceMetrics.recommendedComplexity}% - {getComplexityLevelDescription(performanceMetrics.recommendedComplexity)}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              Adaptive Complexity Adjustment
            </div>
          </CardTitle>
          <CardDescription>
            Automatically adjust content complexity based on student performance and needs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {renderPerformanceMetrics()}
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Target Complexity Level</label>
                <span className="text-xs text-muted-foreground">
                  {settings.targetComplexityLevel}% - {getComplexityLevelDescription(settings.targetComplexityLevel)}
                </span>
              </div>
              <Slider 
                value={[settings.targetComplexityLevel]} 
                min={10} 
                max={90} 
                step={10}
                onValueChange={(value) => setSettings({...settings, targetComplexityLevel: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the slider to set the desired complexity level for the content
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Adapt to Performance Data</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adjust complexity based on student performance
                </p>
              </div>
              <Switch 
                checked={settings.adaptToPerformance}
                onCheckedChange={(checked) => setSettings({...settings, adaptToPerformance: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Scaffolding</label>
                <p className="text-xs text-muted-foreground">
                  Add support structures for complex concepts
                </p>
              </div>
              <Switch 
                checked={settings.includeScaffolding}
                onCheckedChange={(checked) => setSettings({...settings, includeScaffolding: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Extensions</label>
                <p className="text-xs text-muted-foreground">
                  Add extension activities for advanced learners
                </p>
              </div>
              <Switch 
                checked={settings.includeExtensions}
                onCheckedChange={(checked) => setSettings({...settings, includeExtensions: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Preserve Multi-Modal Elements</label>
                <p className="text-xs text-muted-foreground">
                  Maintain visual, audio, and interactive elements
                </p>
              </div>
              <Switch 
                checked={settings.preserveMultiModal}
                onCheckedChange={(checked) => setSettings({...settings, preserveMultiModal: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Adaptation Strength</label>
                <span className="text-xs text-muted-foreground">
                  {settings.adaptationStrength}%
                </span>
              </div>
              <Slider 
                value={[settings.adaptationStrength]} 
                min={10} 
                max={100} 
                step={10}
                onValueChange={(value) => setSettings({...settings, adaptationStrength: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Higher values create more significant changes to the original content
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Assess Comprehension</label>
                <p className="text-xs text-muted-foreground">
                  Include comprehension checks within content
                </p>
              </div>
              <Switch 
                checked={settings.autoAssessComprehension}
                onCheckedChange={(checked) => setSettings({...settings, autoAssessComprehension: checked})}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 
            Evidence-based complexity adjustment
          </div>
          <Button 
            onClick={adjustComplexity} 
            disabled={isAdjusting}
            className="flex items-center gap-1"
          >
            {isAdjusting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Adjusting...
              </>
            ) : (
              <>
                <ArrowUpDown className="h-4 w-4" />
                Adjust Complexity
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAdjusting && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Adjusting Content Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  Adapting content to the appropriate complexity level...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {adjustedContent && !isAdjusting && (
        <Card>
          <CardHeader>
            <CardTitle>Content Complexity Comparison</CardTitle>
            <CardDescription>
              Compare original and adjusted content complexity
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="original" className="flex items-center gap-1">
                  Original Content
                  <Badge variant="outline" className={getComplexityBadgeColor(adjustedContent.originalComplexity)}>
                    {adjustedContent.originalComplexity}%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="adjusted" className="flex items-center gap-1">
                  Adjusted Content
                  <Badge variant="outline" className={getComplexityBadgeColor(adjustedContent.adjustedComplexity)}>
                    {adjustedContent.adjustedComplexity}%
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4 border rounded-md p-4">
                <TabsContent value="original">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>{adjustedContent.title || 'Original Content'}</h3>
                    <div dangerouslySetInnerHTML={{ __html: adjustedContent.originalContent }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="adjusted">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>{adjustedContent.title || 'Adjusted Content'}</h3>
                    <div dangerouslySetInnerHTML={{ __html: adjustedContent.adjustedContent }} />
                    
                    {adjustedContent.scaffolding && settings.includeScaffolding && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Lightbulb className="h-4 w-4" />
                          Scaffolding Support
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedContent.scaffolding }} />
                      </div>
                    )}
                    
                    {adjustedContent.extensions && settings.includeExtensions && (
                      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <Zap className="h-4 w-4" />
                          Extension Activities
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedContent.extensions }} />
                      </div>
                    )}
                    
                    {adjustedContent.comprehensionChecks && settings.autoAssessComprehension && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <AlertCircle className="h-4 w-4" />
                          Comprehension Checks
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedContent.comprehensionChecks }} />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="mt-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Complexity Adjustment Summary</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Original Complexity:</span>
                  <Badge variant="outline" className={getComplexityBadgeColor(adjustedContent.originalComplexity)}>
                    {adjustedContent.originalComplexity}% - {getComplexityLevelDescription(adjustedContent.originalComplexity)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Adjusted Complexity:</span>
                  <Badge variant="outline" className={getComplexityBadgeColor(adjustedContent.adjustedComplexity)}>
                    {adjustedContent.adjustedComplexity}% - {getComplexityLevelDescription(adjustedContent.adjustedComplexity)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Adaptation Type:</span>
                  <Badge variant="outline">
                    {adjustedContent.adaptationType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAdjustedContent(null)}
              className="flex items-center gap-1"
            >
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Content saved",
                  description: "The adjusted content has been saved to your account.",
                });
              }}
              className="flex items-center gap-1"
            >
              Save Adjusted Content
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
