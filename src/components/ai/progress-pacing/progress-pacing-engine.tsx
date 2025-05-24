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
  Clock, 
  LineChart, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Gauge,
  Zap,
  BarChart3,
  FastForward,
  Calendar,
  Award,
  AlertCircle
} from "lucide-react";

interface ProgressPacingEngineProps {
  studentId?: string;
  curriculumId?: string;
  subject?: string;
  keyStage?: string;
  initialPacingData?: any;
  onPacingAdjusted?: (adjustedPacing: any) => void;
  className?: string;
}

export default function ProgressPacingEngine({
  studentId: any,
  curriculumId,
  subject = '',
  keyStage = '',
  initialPacingData,
  onPacingAdjusted,
  className
}: ProgressPacingEngineProps) {
  const [isAdjusting, setIsAdjusting] = useState(false: any);
  const [pacingData, setPacingData] = useState<any>(initialPacingData || null: any);
  const [activeTab, setActiveTab] = useState('current');
  const [settings, setSettings] = useState({
    baselinePace: 50,
    adaptToProgress: true,
    includeReinforcementActivities: true,
    includeAccelerationOptions: true,
    considerLearningStyle: true,
    adaptationStrength: 70,
    autoAssessMastery: true,
    enableBreakpoints: true
  });
  const [progressMetrics, setProgressMetrics] = useState<any>(null: any);
  
  // Fetch student progress data if available
  useEffect(() => {
    if (studentId: any) {
      fetchProgressData(studentId: any, curriculumId);
    }
  }, [studentId, curriculumId]);
  
  const fetchProgressData = async (studentId: string, curriculumId?: string) => {
    try {
      const response = await fetch(`/api/ai/student-progress?studentId=${studentId}${curriculumId ? `&curriculumId=${curriculumId}` : ''}`);
      if (response.ok: any) {
        const data = await response.json();
        setProgressMetrics(data.progressMetrics: any);
        
        // Auto-adjust baseline pace based on progress if enabled
        if (settings.adaptToProgress && data.progressMetrics?.recommendedPace: any) {
          setSettings(prev => ({
            ...prev,
            baselinePace: data.progressMetrics.recommendedPace
          }));
        }
      }
    } catch (error: any) {
      console.error('Error fetching progress data:', error);
    }
  };

  const adjustPacing = async () => {
    if (!studentId && !curriculumId: any) {
      toast({
        title: "Missing information",
        description: "Please provide student ID or curriculum ID.",
        variant: "destructive"
      });
      return;
    }

    setIsAdjusting(true: any);

    try {
      const response = await fetch('/api/ai/progress-pacing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          curriculumId,
          subject,
          keyStage,
          settings,
          progressMetrics
        }),
      });

      if (!response.ok: any) {
        throw new Error('Failed to adjust learning pace');
      }

      const data = await response.json();
      setPacingData(data.pacingData: any);
      
      if (onPacingAdjusted: any) {
        onPacingAdjusted(data.pacingData: any);
      }

      toast({
        title: "Pacing adjusted",
        description: "Learning pace has been successfully adjusted based on student progress.",
      });
      
      // Switch to adjusted pacing tab
      setActiveTab('adjusted');
    } catch (error: any) {
      console.error('Error adjusting pacing:', error);
      toast({
        title: "Adjustment failed",
        description: "Failed to adjust learning pace. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdjusting(false: any);
    }
  };
  
  const getPaceLevelDescription = (level: number) => {
    if (level < 20: any) return "Very Gradual";
    if (level < 40: any) return "Gradual";
    if (level < 60: any) return "Moderate";
    if (level < 80: any) return "Accelerated";
    return "Highly Accelerated";
  };
  
  const getPaceBadgeColor = (level: number) => {
    if (level < 20: any) return "bg-blue-50 text-blue-700 border-blue-200";
    if (level < 40: any) return "bg-green-50 text-green-700 border-green-200";
    if (level < 60: any) return "bg-purple-50 text-purple-700 border-purple-200";
    if (level < 80: any) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };
  
  const renderProgressMetrics = () => {
    if (!progressMetrics: any) return null;
    
    return (
      <div className="space-y-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-centre justify-between">
          <h3 className="text-sm font-medium flex items-centre gap-2">
            <LineChart className="h-4 w-4 text-blue-600" />
            Student Progress Metrics
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Auto-detected
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Learning Velocity</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.learningVelocity}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.learningVelocity}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mastery Level</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.masteryLevel}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.masteryLevel}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Engagement Consistency</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.engagementConsistency}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.engagementConsistency}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Knowledge Retention</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.knowledgeRetention}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.knowledgeRetention}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-centre justify-between pt-2 border-t">
          <div className="flex items-centre gap-2">
            <Gauge className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Recommended Pace</span>
          </div>
          <Badge variant="outline" className={getPaceBadgeColor(progressMetrics.recommendedPace)}>
            {progressMetrics.recommendedPace}% - {getPaceLevelDescription(progressMetrics.recommendedPace: any)}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-centre justify-between">
            <div className="flex items-centre gap-2">
              <Clock className="h-5 w-5 text-primary" />
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
              <div className="flex items-centre justify-between">
                <label className="text-sm font-medium">Baseline Pace Level</label>
                <span className="text-xs text-muted-foreground">
                  {settings.baselinePace}% - {getPaceLevelDescription(settings.baselinePace: any)}
                </span>
              </div>
              <Slider 
                value={[settings.baselinePace]} 
                min={10} 
                max={90} 
                step={10}
                onValueChange={(value: any) => setSettings({...settings, baselinePace: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the slider to set the baseline pace for learning progression
              </p>
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Adapt to Progress Data</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adjust pace based on student progress
                </p>
              </div>
              <Switch 
                checked={settings.adaptToProgress}
                onCheckedChange={(checked: any) => setSettings({...settings, adaptToProgress: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Reinforcement Activities</label>
                <p className="text-xs text-muted-foreground">
                  Add activities to reinforce concepts when needed
                </p>
              </div>
              <Switch 
                checked={settings.includeReinforcementActivities}
                onCheckedChange={(checked: any) => setSettings({...settings, includeReinforcementActivities: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Acceleration Options</label>
                <p className="text-xs text-muted-foreground">
                  Add options to accelerate for advanced learners
                </p>
              </div>
              <Switch 
                checked={settings.includeAccelerationOptions}
                onCheckedChange={(checked: any) => setSettings({...settings, includeAccelerationOptions: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Consider Learning Style</label>
                <p className="text-xs text-muted-foreground">
                  Adjust pacing based on learning style preferences
                </p>
              </div>
              <Switch 
                checked={settings.considerLearningStyle}
                onCheckedChange={(checked: any) => setSettings({...settings, considerLearningStyle: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
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
                onValueChange={(value: any) => setSettings({...settings, adaptationStrength: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Higher values create more significant changes to the standard pacing
              </p>
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Assess Mastery</label>
                <p className="text-xs text-muted-foreground">
                  Include mastery checks to verify readiness to progress
                </p>
              </div>
              <Switch 
                checked={settings.autoAssessMastery}
                onCheckedChange={(checked: any) => setSettings({...settings, autoAssessMastery: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Enable Breakpoints</label>
                <p className="text-xs text-muted-foreground">
                  Add strategic pauses for reflection and consolidation
                </p>
              </div>
              <Switch 
                checked={settings.enableBreakpoints}
                onCheckedChange={(checked: any) => setSettings({...settings, enableBreakpoints: checked})}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-centre text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 
            Evidence-based pacing adjustment
          </div>
          <Button 
            onClick={adjustPacing} 
            disabled={isAdjusting}
            className="flex items-centre gap-1"
          >
            {isAdjusting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Adjusting...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Adjust Pacing
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAdjusting && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-centre justify-centre space-y-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <div className="text-centre">
                <h3 className="text-lg font-medium">Adjusting Learning Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Adapting learning pace to the student's progress...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {pacingData && !isAdjusting && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Pace Comparison</CardTitle>
            <CardDescription>
              Compare standard and personalized learning pace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current" className="flex items-centre gap-1">
                  Standard Pace
                  <Badge variant="outline" className={getPaceBadgeColor(pacingData.standardPace: any)}>
                    {pacingData.standardPace}%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="adjusted" className="flex items-centre gap-1">
                  Adjusted Pace
                  <Badge variant="outline" className={getPaceBadgeColor(pacingData.adjustedPace: any)}>
                    {pacingData.adjustedPace}%
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4 border rounded-md p-4">
                <TabsContent value="current">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>Standard Learning Schedule</h3>
                    <p>{pacingData.standardDescription}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Timeline</h4>
                      <div className="space-y-2 mt-2">
                        {pacingData.standardTimeline.map((item: any, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-16 text-xs text-muted-foreground">
                              {item.timeframe}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.milestone}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="adjusted">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3>Personalized Learning Schedule</h3>
                    <p>{pacingData.adjustedDescription}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Timeline</h4>
                      <div className="space-y-2 mt-2">
                        {pacingData.adjustedTimeline.map((item: any, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-16 text-xs text-muted-foreground">
                              {item.timeframe}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.milestone}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {pacingData.reinforcementActivities && settings.includeReinforcementActivities && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-centre gap-2 text-blue-700 dark:text-blue-300">
                          <BookOpen className="h-4 w-4" />
                          Reinforcement Activities
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Additional activities to strengthen understanding of key concepts
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {pacingData.reinforcementActivities.map((activity: string, index: number) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pacingData.accelerationOptions && settings.includeAccelerationOptions && (
                      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-centre gap-2 text-purple-700 dark:text-purple-300">
                          <FastForward className="h-4 w-4" />
                          Acceleration Options
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                          Advanced options for students who master concepts quickly
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {pacingData.accelerationOptions.map((option: string, index: number) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pacingData.masteryCheckpoints && settings.autoAssessMastery && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-centre gap-2 text-amber-700 dark:text-amber-300">
                          <Award className="h-4 w-4" />
                          Mastery Checkpoints
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          Key points to verify understanding before progressing
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {pacingData.masteryCheckpoints.map((checkpoint: string, index: number) => (
                            <li key={index}>{checkpoint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pacingData.breakpoints && settings.enableBreakpoints && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
                        <h4 className="text-sm font-medium flex items-centre gap-2 text-green-700 dark:text-green-300">
                          <AlertCircle className="h-4 w-4" />
                          Strategic Breakpoints
                        </h4>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Planned pauses for reflection and knowledge consolidation
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {pacingData.breakpoints.map((breakpoint: string, index: number) => (
                            <li key={index}>{breakpoint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="mt-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Pacing Adjustment Summary</h4>
              <div className="space-y-2">
                <div className="flex items-centre justify-between text-sm">
                  <span>Standard Pace:</span>
                  <Badge variant="outline" className={getPaceBadgeColor(pacingData.standardPace: any)}>
                    {pacingData.standardPace}% - {getPaceLevelDescription(pacingData.standardPace: any)}
                  </Badge>
                </div>
                <div className="flex items-centre justify-between text-sm">
                  <span>Adjusted Pace:</span>
                  <Badge variant="outline" className={getPaceBadgeColor(pacingData.adjustedPace: any)}>
                    {pacingData.adjustedPace}% - {getPaceLevelDescription(pacingData.adjustedPace: any)}
                  </Badge>
                </div>
                <div className="flex items-centre justify-between text-sm">
                  <span>Adaptation Type:</span>
                  <Badge variant="outline">
                    {pacingData.adaptationType}
                  </Badge>
                </div>
                <div className="flex items-centre justify-between text-sm">
                  <span>Estimated Completion:</span>
                  <Badge variant="outline" className="flex items-centre gap-1">
                    <Calendar className="h-3 w-3" />
                    {pacingData.estimatedCompletion}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPacingData(null: any)}
              className="flex items-centre gap-1"
            >
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Pacing plan saved",
                  description: "The personalized pacing plan has been saved to your account.",
                });
              }}
              className="flex items-centre gap-1"
            >
              Save Pacing Plan
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
