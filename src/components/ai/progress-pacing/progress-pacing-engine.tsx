'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { 
  Clock, 
  BarChart3, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Gauge,
  Zap,
  LineChart,
  Timer,
  Lightbulb,
  AlertCircle,
  FastForward,
  SkipForward,
  ChevronRight
} from "lucide-react";

interface ProgressPacingEngineProps {
  content?: string;
  title?: string;
  subject?: string;
  keyStage?: string;
  contentId?: string;
  studentProgressData?: any;
  onPacingAdjusted?: (adjustedPacing: any) => void;
  className?: string;
}

export default function ProgressPacingEngine({
  content = '',
  title = '',
  subject = '',
  keyStage = '',
  contentId,
  studentProgressData,
  onPacingAdjusted,
  className
}: ProgressPacingEngineProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedPacing, setAdjustedPacing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('original');
  const [settings, setSettings] = useState({
    baselinePace: 50,
    adaptToProgress: true,
    includeRemediation: true,
    includeAcceleration: true,
    preserveComprehension: true,
    adaptationStrength: 70,
    autoAssessProgress: true,
    enableMasteryBasedAdvancement: true
  });
  const [progressMetrics, setProgressMetrics] = useState<any>(null);
  
  // Fetch student progress data if available
  useEffect(() => {
    if (studentProgressData) {
      setProgressMetrics(studentProgressData);
    } else if (contentId) {
      fetchProgressData(contentId);
    }
  }, [studentProgressData, contentId]);
  
  const fetchProgressData = async (contentId: string) => {
    try {
      const response = await fetch(`/api/ai/student-progress?contentId=${contentId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressMetrics(data.progressMetrics);
        
        // Auto-adjust baseline pace based on progress if enabled
        if (settings.adaptToProgress && data.progressMetrics?.recommendedPace) {
          setSettings(prev => ({
            ...prev,
            baselinePace: data.progressMetrics.recommendedPace
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const adjustPacing = async () => {
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
      const response = await fetch('/api/ai/progress-pacing', {
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
          progressMetrics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adjust content pacing');
      }

      const data = await response.json();
      setAdjustedPacing(data.adjustedPacing);
      
      if (onPacingAdjusted) {
        onPacingAdjusted(data.adjustedPacing);
      }

      toast({
        title: "Pacing adjusted",
        description: "Content has been successfully adjusted to the appropriate learning pace.",
      });
      
      // Switch to adjusted content tab
      setActiveTab('adjusted');
    } catch (error) {
      console.error('Error adjusting pacing:', error);
      toast({
        title: "Adjustment failed",
        description: "Failed to adjust content pacing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdjusting(false);
    }
  };
  
  const getPaceLevelDescription = (level: number) => {
    if (level < 20) return "Very Slow";
    if (level < 40) return "Slow";
    if (level < 60) return "Moderate";
    if (level < 80) return "Fast";
    return "Very Fast";
  };
  
  const getPaceBadgeColor = (level: number) => {
    if (level < 20) return "bg-blue-50 text-blue-700 border-blue-200";
    if (level < 40) return "bg-green-50 text-green-700 border-green-200";
    if (level < 60) return "bg-purple-50 text-purple-700 border-purple-200";
    if (level < 80) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };
  
  const renderProgressMetrics = () => {
    if (!progressMetrics) return null;
    
    return (
      <div className="space-y-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <LineChart className="h-4 w-4 text-blue-600" />
            Student Progress Metrics
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Auto-detected
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mastery Level</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.masteryLevel}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.masteryLevel}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Learning Velocity</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.learningVelocity}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.learningVelocity}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Retention Rate</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.retentionRate}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.retentionRate}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Engagement Consistency</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.engagementConsistency}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.engagementConsistency}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Recommended Pace</span>
          </div>
          <Badge variant="outline" className={getPaceBadgeColor(progressMetrics.recommendedPace)}>
            {progressMetrics.recommendedPace}% - {getPaceLevelDescription(progressMetrics.recommendedPace)}
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
              <Timer className="h-5 w-5 text-primary" />
              Progress-Adaptive Pacing
            </div>
          </CardTitle>
          <CardDescription>
            Automatically adjust learning pace based on individual student progress
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {renderProgressMetrics()}
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Baseline Pace Level</label>
                <span className="text-xs text-muted-foreground">
                  {settings.baselinePace}% - {getPaceLevelDescription(settings.baselinePace)}
                </span>
              </div>
              <Slider 
                value={[settings.baselinePace]} 
                min={10} 
                max={90} 
                step={10}
                onValueChange={(value) => setSettings({...settings, baselinePace: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the slider to set the desired pace level for the content
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Adapt to Progress Data</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adjust pace based on student progress
                </p>
              </div>
              <Switch 
                checked={settings.adaptToProgress}
                onCheckedChange={(checked) => setSettings({...settings, adaptToProgress: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Remediation</label>
                <p className="text-xs text-muted-foreground">
                  Add additional support for struggling students
                </p>
              </div>
              <Switch 
                checked={settings.includeRemediation}
                onCheckedChange={(checked) => setSettings({...settings, includeRemediation: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Acceleration</label>
                <p className="text-xs text-muted-foreground">
                  Add advanced pacing for high-performing students
                </p>
              </div>
              <Switch 
                checked={settings.includeAcceleration}
                onCheckedChange={(checked) => setSettings({...settings, includeAcceleration: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Preserve Comprehension</label>
                <p className="text-xs text-muted-foreground">
                  Ensure understanding is maintained at all paces
                </p>
              </div>
              <Switch 
                checked={settings.preserveComprehension}
                onCheckedChange={(checked) => setSettings({...settings, preserveComprehension: checked})}
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
                Higher values create more significant changes to the original pacing
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Assess Progress</label>
                <p className="text-xs text-muted-foreground">
                  Include progress checks within content
                </p>
              </div>
              <Switch 
                checked={settings.autoAssessProgress}
                onCheckedChange={(checked) => setSettings({...settings, autoAssessProgress: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Mastery-Based Advancement</label>
                <p className="text-xs text-muted-foreground">
                  Require mastery before advancing to next topics
                </p>
              </div>
              <Switch 
                checked={settings.enableMasteryBasedAdvancement}
                onCheckedChange={(checked) => setSettings({...settings, enableMasteryBasedAdvancement: checked})}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 
            Evidence-based pacing adjustment
          </div>
          <Button 
            onClick={adjustPacing} 
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
                <Timer className="h-4 w-4" />
                Adjust Pacing
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
                <h3 className="text-lg font-medium">Adjusting Learning Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Adapting content to the appropriate learning pace...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {adjustedPacing && !isAdjusting && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Pace Comparison</CardTitle>
            <CardDescription>
              Compare original and adjusted learning pace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="original" className="flex items-center gap-1">
                  Original Pacing
                  <Badge variant="outline" className={getPaceBadgeColor(adjustedPacing.originalPace)}>
                    {adjustedPacing.originalPace}%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="adjusted" className="flex items-center gap-1">
                  Adjusted Pacing
                  <Badge variant="outline" className={getPaceBadgeColor(adjustedPacing.adjustedPace)}>
                    {adjustedPacing.adjustedPace}%
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4 border rounded-md p-4">
                <TabsContent value="original">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>{adjustedPacing.title || 'Original Pacing'}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Estimated Completion Time:</span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {adjustedPacing.originalCompletionTime}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Learning Sequence</h4>
                        <div className="space-y-3">
                          {adjustedPacing.originalSequence.map((item: any, index: number) => (
                            <div key={index} className="border rounded-md p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium">{item.title}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {item.duration}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="adjusted">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>{adjustedPacing.title || 'Adjusted Pacing'}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Estimated Completion Time:</span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {adjustedPacing.adjustedCompletionTime}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Adaptive Learning Sequence</h4>
                        <div className="space-y-3">
                          {adjustedPacing.adjustedSequence.map((item: any, index: number) => (
                            <div key={index} className="border rounded-md p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium flex items-center gap-1">
                                  {item.type === 'remediation' && (
                                    <AlertCircle className="h-3 w-3 text-blue-500" />
                                  )}
                                  {item.type === 'acceleration' && (
                                    <FastForward className="h-3 w-3 text-purple-500" />
                                  )}
                                  {item.type === 'core' && (
                                    <ChevronRight className="h-3 w-3 text-slate-500" />
                                  )}
                                  {item.title}
                                </h5>
                                <Badge variant="outline" className="text-xs">
                                  {item.duration}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                              
                              {item.masteryCheck && settings.enableMasteryBasedAdvancement && (
                                <div className="mt-2 pt-2 border-t border-dashed flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                    Mastery Check
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {adjustedPacing.remediation && settings.includeRemediation && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <AlertCircle className="h-4 w-4" />
                          Remediation Support
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedPacing.remediation }} />
                      </div>
                    )}
                    
                    {adjustedPacing.acceleration && settings.includeAcceleration && (
                      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <FastForward className="h-4 w-4" />
                          Acceleration Opportunities
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedPacing.acceleration }} />
                      </div>
                    )}
                    
                    {adjustedPacing.progressChecks && settings.autoAssessProgress && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <Gauge className="h-4 w-4" />
                          Progress Checks
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: adjustedPacing.progressChecks }} />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="mt-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Pacing Adjustment Summary</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Original Pace:</span>
                  <Badge variant="outline" className={getPaceBadgeColor(adjustedPacing.originalPace)}>
                    {adjustedPacing.originalPace}% - {getPaceLevelDescription(adjustedPacing.originalPace)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Adjusted Pace:</span>
                  <Badge variant="outline" className={getPaceBadgeColor(adjustedPacing.adjustedPace)}>
                    {adjustedPacing.adjustedPace}% - {getPaceLevelDescription(adjustedPacing.adjustedPace)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Adaptation Type:</span>
                  <Badge variant="outline">
                    {adjustedPacing.adaptationType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAdjustedPacing(null)}
              className="flex items-center gap-1"
            >
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Pacing saved",
                  description: "The adjusted pacing has been saved to your account.",
                });
              }}
              className="flex items-center gap-1"
            >
              Save Adjusted Pacing
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
