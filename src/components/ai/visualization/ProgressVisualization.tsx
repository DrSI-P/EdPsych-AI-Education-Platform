"use client";

/**
 * Progress Visualization Component
 * Part of Holistic Progress Visualization
 * Visualize learning progress holistically
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';

// Types
interface ProgressData {
  userId: string;
  timeframe: string;
  metrics: {
    academic: AcademicMetrics;
    engagement: EngagementMetrics;
    social: SocialMetrics;
    emotional: EmotionalMetrics;
    cognitive: CognitiveMetrics;
  };
  trends: {
    daily: TrendPoint[];
    weekly: TrendPoint[];
    monthly: TrendPoint[];
  };
  recommendations: Recommendation[];
}

interface AcademicMetrics {
  overallScore: number;
  subjectScores: Record<string, number>;
  completionRates: Record<string, number>;
  assessmentScores: Record<string, number>;
  learningObjectives: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

interface EngagementMetrics {
  overallScore: number;
  timeSpent: Record<string, number>;
  activityFrequency: Record<string, number>;
  resourcesAccessed: number;
  participationScore: number;
}

interface SocialMetrics {
  overallScore: number;
  collaborationScore: number;
  communicationScore: number;
  peerInteractions: number;
  groupContributions: number;
}

interface EmotionalMetrics {
  overallScore: number;
  sentiment: Record<string, number>;
  motivation: number;
  satisfaction: number;
  stressLevel: number;
}

interface CognitiveMetrics {
  overallScore: number;
  attentionScore: number;
  memoryScore: number;
  problemSolvingScore: number;
  criticalThinkingScore: number;
  creativityScore: number;
}

interface TrendPoint {
  date: string;
  academic: number;
  engagement: number;
  social: number;
  emotional: number;
  cognitive: number;
}

interface Recommendation {
  id: string;
  type: 'resource' | 'activity' | 'intervention' | 'goal';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metrics: string[];
}

interface ProgressVisualizationProps {
  userId?: string;
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
  showRecommendations?: boolean;
  showTrends?: boolean;
  height?: number;
  width?: number;
  className?: string;
}

/**
 * Holistic Progress Visualization Component
 * 
 * This component visualizes learning progress holistically across multiple dimensions:
 * - Academic performance
 * - Engagement
 * - Social interaction
 * - Emotional state
 * - Cognitive development
 * 
 * It provides various visualization types and allows filtering and customization.
 */
export default function ProgressVisualization({
  userId,
  timeframe = 'month',
  showRecommendations = true,
  showTrends = true,
  height = 600,
  width = 800,
  className = ''
}: ProgressVisualizationProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [visualizationType, setVisualizationType] = useState('radar');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['academic', 'engagement', 'social', 'emotional', 'cognitive']);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [showDetails, setShowDetails] = useState(false);
  
  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/ai/visualization/progress?userId=${userId || session?.user?.id}&timeframe=${selectedTimeframe}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProgressData(data);
      } catch (err: unknown) {
        console.error('Error fetching progress data:', err);
        setError(err.message || 'Failed to fetch progress data');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch progress data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgressData();
  }, [userId, session, selectedTimeframe]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle visualization type change
  const handleVisualizationTypeChange = (value: string) => {
    setVisualizationType(value);
  };
  
  // Handle metric selection
  const handleMetricSelection = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
  };
  
  // Prepare data for visualization
  const prepareOverviewData = (): void => {
    if (!progressData) return [];
    
    return [
      {
        subject: 'Academic',
        value: progressData.metrics.academic.overallScore,
        fullMark: 100
      },
      {
        subject: 'Engagement',
        value: progressData.metrics.engagement.overallScore,
        fullMark: 100
      },
      {
        subject: 'Social',
        value: progressData.metrics.social.overallScore,
        fullMark: 100
      },
      {
        subject: 'Emotional',
        value: progressData.metrics.emotional.overallScore,
        fullMark: 100
      },
      {
        subject: 'Cognitive',
        value: progressData.metrics.cognitive.overallScore,
        fullMark: 100
      }
    ];
  };
  
  const prepareTrendData = (): void => {
    if (!progressData) return [];
    
    const trendData = progressData.trends[selectedTimeframe === 'day' ? 'daily' : selectedTimeframe === 'week' ? 'weekly' : 'monthly'];
    
    return trendData.map(point => {
      const filteredPoint: unknown = { date: point.date };
      
      selectedMetrics.forEach(metric => {
        filteredPoint[metric] = point[metric as keyof typeof point];
      });
      
      return filteredPoint;
    });
  };
  
  const prepareAcademicData = (): void => {
    if (!progressData) return [];
    
    return Object.entries(progressData.metrics.academic.subjectScores).map(([subject, score]) => ({
      subject,
      score,
      completionRate: progressData.metrics.academic.completionRates[subject] || 0,
      assessmentScore: progressData.metrics.academic.assessmentScores[subject] || 0
    }));
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>Progress Visualization</CardTitle>
          <CardDescription>Loading your progress data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>Progress Visualization</CardTitle>
          <CardDescription>Error loading progress data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => setSelectedTimeframe(selectedTimeframe)}>Retry</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render empty state
  if (!progressData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>Progress Visualization</CardTitle>
          <CardDescription>No progress data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-gray-500">No data available for the selected timeframe.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Render visualization
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Holistic Progress Visualization</CardTitle>
            <CardDescription>
              Visualizing your progress across multiple dimensions
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visualizationType} onValueChange={handleVisualizationTypeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="radar">Radar</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="details-switch"
                checked={showDetails}
                onCheckedChange={setShowDetails}
              />
              <Label htmlFor="details-switch">Details</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="emotional">Emotional</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
            {showTrends && <TabsTrigger value="trends">Trends</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center" style={{ height: `${height - 100}px` }}>
                {visualizationType === 'radar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={prepareOverviewData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Progress"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
                
                {visualizationType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareOverviewData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Progress" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {visualizationType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareOverviewData()}
                        dataKey="value"
                        nameKey="subject"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              {showDetails && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Academic</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold">{progressData.metrics.academic.overallScore}%</p>
                      <p className="text-sm text-gray-500">
                        {progressData.metrics.academic.learningObjectives.completed} objectives completed
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold">{progressData.metrics.engagement.overallScore}%</p>
                      <p className="text-sm text-gray-500">
                        {progressData.metrics.engagement.resourcesAccessed} resources accessed
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Social</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold">{progressData.metrics.social.overallScore}%</p>
                      <p className="text-sm text-gray-500">
                        {progressData.metrics.social.peerInteractions} peer interactions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Emotional</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold">{progressData.metrics.emotional.overallScore}%</p>
                      <p className="text-sm text-gray-500">
                        Motivation: {progressData.metrics.emotional.motivation}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Cognitive</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold">{progressData.metrics.cognitive.overallScore}%</p>
                      <p className="text-sm text-gray-500">
                        Critical thinking: {progressData.metrics.cognitive.criticalThinkingScore}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="academic" className="mt-0">
            <div style={{ height: `${height - 100}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareAcademicData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Overall Score" fill="#8884d8" />
                  <Bar dataKey="completionRate" name="Completion Rate" fill="#82ca9d" />
                  <Bar dataKey="assessmentScore" name="Assessment Score" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Other tabs would be implemented similarly */}
          
          <TabsContent value="trends" className="mt-0">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {['academic', 'engagement', 'social', 'emotional', 'cognitive'].map(metric => (
                  <Button
                    key={metric}
                    variant={selectedMetrics.includes(metric) ? 'default' : 'outline'}
                    onClick={() => handleMetricSelection(metric)}
                    className="capitalize"
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
            
            <div style={{ height: `${height - 150}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {selectedMetrics.includes('academic') && (
                    <Line type="monotone" dataKey="academic" name="Academic" stroke="#8884d8" activeDot={{ r: 8 }} />
                  )}
                  {selectedMetrics.includes('engagement') && (
                    <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#82ca9d" />
                  )}
                  {selectedMetrics.includes('social') && (
                    <Line type="monotone" dataKey="social" name="Social" stroke="#ffc658" />
                  )}
                  {selectedMetrics.includes('emotional') && (
                    <Line type="monotone" dataKey="emotional" name="Emotional" stroke="#ff8042" />
                  )}
                  {selectedMetrics.includes('cognitive') && (
                    <Line type="monotone" dataKey="cognitive" name="Cognitive" stroke="#0088fe" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        {showRecommendations && progressData.recommendations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.recommendations.slice(0, 3).map(recommendation => (
                <Card key={recommendation.id}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md">{recommendation.title}</CardTitle>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recommendation.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : recommendation.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {recommendation.priority}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-700">{recommendation.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recommendation.metrics.map(metric => (
                        <span key={metric} className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {progressData.recommendations.length > 3 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline">View All Recommendations</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}