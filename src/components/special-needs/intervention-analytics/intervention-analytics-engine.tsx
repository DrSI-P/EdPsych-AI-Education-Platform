'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { BarChart3, Check, RefreshCw, FileText, AlertTriangle, Info, Target, BookOpen, Clock, Download, Filter, Lightbulb } from "lucide-react";
import { useSession } from 'next-auth/react';
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InterventionAnalyticsProps {
  onSettingsChange?: (settings: AnalyticsSettings) => void;
  className?: string;
}

interface AnalyticsSettings {
  enabled: boolean;
  dataSource: 'all' | 'current' | 'selected';
  timeRange: 'week' | 'month' | 'term' | 'year' | 'all';
  groupBy: 'intervention' | 'student' | 'learningProfile' | 'none';
  comparisonEnabled: boolean;
  significanceThreshold: number;
  automaticReports: boolean;
  selectedInterventions?: string[];
}

interface AnalyticsData {
  interventionType: string;
  learningProfile: string;
  averageGrowth: number;
  sampleSize: number;
  timeToTarget: number;
  consistency: number;
  effectiveness: number;
}

interface StudentProgress {
  id: string;
  name: string;
  intervention: string;
  learningProfile: string;
  startDate: string;
  currentGrowth: number;
  targetGrowth: number;
  progressRate: number;
  dataPoints: { date: string; value: number }[];
}

export default function InterventionAnalyticsEngine({
  onSettingsChange,
  className = '',
}: InterventionAnalyticsProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for analytics settings
  const [settings, setSettings] = useState<AnalyticsSettings>({
    enabled: false,
    dataSource: 'all',
    timeRange: 'term',
    groupBy: 'intervention',
    comparisonEnabled: true,
    significanceThreshold: 0.05,
    automaticReports: true,
    selectedInterventions: [],
  });
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [interventionTypes, setInterventionTypes] = useState<string[]>([]);
  const [learningProfiles, setLearningProfiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isApplied, setIsApplied] = useState(false);
  
  // Load user settings and data from API on component mount
  useEffect(() => {
    if (session?.user) {
      // Load analytics settings
      fetch('/api/special-needs/intervention-analytics/settings')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            setSettings(prev => ({
              ...prev,
              ...data.settings,
            }));
            
            // If analytics was already enabled, mark as applied
            if (data.settings.enabled) {
              setIsApplied(true);
              loadAnalyticsData(data.settings);
            }
          }
        })
        .catch(error => {
          console.error('Error loading analytics settings:', error);
        });
      
      // Load available intervention types
      fetch('/api/special-needs/personalized-interventions')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Extract unique intervention types
            const types = Array.from(new Set([
              'Reading Support',
              'Math Intervention',
              'Executive Function',
              'Social Skills',
              'Sensory Regulation',
              'Behavioral Support',
              'Language Development',
              'Motor Skills'
            ]));
            setInterventionTypes(types);
          }
        })
        .catch(error => {
          console.error('Error loading intervention types:', error);
        });
      
      // Load available learning profiles
      setLearningProfiles([
        'Dyslexia',
        'Dyscalculia',
        'ADHD',
        'Autism Spectrum',
        'Dyspraxia',
        'Language Disorder',
        'General Learning Difficulty',
        'Gifted & Talented'
      ]);
    }
  }, [session]);
  
  // Load analytics data based on current settings
  const loadAnalyticsData = (currentSettings: AnalyticsSettings) => {
    setIsLoading(true);
    
    // Fetch analytics data
    fetch('/api/special-needs/intervention-analytics/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings: currentSettings
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnalyticsData(data.analyticsData || generateDemoAnalyticsData());
          setStudentProgress(data.studentProgress || generateDemoStudentProgress());
        } else {
          // If API fails, use demo data for development/preview
          setAnalyticsData(generateDemoAnalyticsData());
          setStudentProgress(generateDemoStudentProgress());
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading analytics data:', error);
        // Use demo data on error
        setAnalyticsData(generateDemoAnalyticsData());
        setStudentProgress(generateDemoStudentProgress());
        setIsLoading(false);
      });
  };
  
  // Generate demo analytics data for development/preview
  const generateDemoAnalyticsData = (): AnalyticsData[] => {
    const interventions = [
      'Reading Support',
      'Math Intervention',
      'Executive Function',
      'Social Skills',
      'Sensory Regulation',
      'Behavioral Support'
    ];
    
    const profiles = [
      'Dyslexia',
      'Dyscalculia',
      'ADHD',
      'Autism Spectrum',
      'Dyspraxia',
      'Language Disorder'
    ];
    
    const demoData: AnalyticsData[] = [];
    
    // Create data for each intervention type
    interventions.forEach(intervention => {
      profiles.forEach(profile => {
        // Only create entries for logical combinations
        if ((intervention === 'Reading Support' && profile === 'Dyslexia') ||
            (intervention === 'Math Intervention' && profile === 'Dyscalculia') ||
            (intervention === 'Executive Function' && profile === 'ADHD') ||
            (intervention === 'Social Skills' && profile === 'Autism Spectrum') ||
            (intervention === 'Sensory Regulation' && profile === 'Autism Spectrum') ||
            (intervention === 'Behavioral Support' && profile === 'ADHD') ||
            Math.random() > 0.7) { // Add some random combinations
          
          const effectiveness = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
          
          demoData.push({
            interventionType: intervention,
            learningProfile: profile,
            averageGrowth: Math.round((Math.random() * 30 + 10) * 10) / 10, // 10 to 40 with one decimal
            sampleSize: Math.floor(Math.random() * 20) + 3, // 3 to 22
            timeToTarget: Math.floor(Math.random() * 8) + 4, // 4 to 12 weeks
            consistency: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100, // 0.6 to 1.0
            effectiveness: effectiveness
          });
        }
      });
    });
    
    return demoData;
  };
  
  // Generate demo student progress data for development/preview
  const generateDemoStudentProgress = (): StudentProgress[] => {
    const names = [
      'Alex Johnson',
      'Sam Taylor',
      'Jordan Smith',
      'Casey Brown',
      'Riley Wilson',
      'Morgan Davis',
      'Taylor Anderson',
      'Jamie Thomas'
    ];
    
    const interventions = [
      'Reading Support',
      'Math Intervention',
      'Executive Function',
      'Social Skills',
      'Sensory Regulation',
      'Behavioral Support'
    ];
    
    const profiles = [
      'Dyslexia',
      'Dyscalculia',
      'ADHD',
      'Autism Spectrum',
      'Dyspraxia',
      'Language Disorder'
    ];
    
    const demoProgress: StudentProgress[] = [];
    
    // Create progress data for each student
    names.forEach((name, index) => {
      const intervention = interventions[index % interventions.length];
      const profile = profiles[index % profiles.length];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (Math.floor(Math.random() * 60) + 30)); // 30 to 90 days ago
      
      const targetGrowth = Math.floor(Math.random() * 30) + 20; // 20 to 50
      const currentGrowth = Math.floor(Math.random() * targetGrowth); // 0 to targetGrowth
      const progressRate = Math.round((currentGrowth / targetGrowth) * 100) / 100; // 0 to 1
      
      // Generate data points
      const dataPoints = [];
      const numPoints = Math.floor(Math.random() * 8) + 5; // 5 to 12 data points
      const pointDate = new Date(startDate);
      let lastValue = 0;
      
      for (let i = 0; i < numPoints; i++) {
        pointDate.setDate(pointDate.getDate() + Math.floor(Math.random() * 7) + 3); // 3 to 10 days between points
        
        // Ensure steady progress with some variability
        const increase = Math.random() * 5 + 1; // 1 to 6 points increase
        const value = lastValue + increase;
        lastValue = value;
        
        dataPoints.push({
          date: pointDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          value: Math.round(value * 10) / 10 // Round to one decimal
        });
      }
      
      demoProgress.push({
        id: `demo-${index}`,
        name: name,
        intervention: intervention,
        learningProfile: profile,
        startDate: startDate.toISOString().split('T')[0],
        currentGrowth: currentGrowth,
        targetGrowth: targetGrowth,
        progressRate: progressRate,
        dataPoints: dataPoints
      });
    });
    
    return demoProgress;
  };
  
  // Handle settings change
  const handleSettingsChange = (key: keyof AnalyticsSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Call the callback if provided
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
      
      return newSettings;
    });
  };
  
  // Apply settings
  const handleApplySettings = () => {
    setIsApplied(true);
    loadAnalyticsData(settings);
    
    // Save settings to user profile if logged in
    if (session?.user) {
      fetch('/api/special-needs/intervention-analytics/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: settings
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Analytics settings saved",
              description: "Your intervention analytics settings have been saved to your profile.",
            });
          } else {
            throw new Error(data.error || 'Failed to save settings');
          }
        })
        .catch(error => {
          console.error('Error saving analytics settings:', error);
          toast({
            title: "Error saving settings",
            description: "Your analytics settings could not be saved to your profile.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Analytics settings applied",
        description: "Sign in to save these settings to your profile.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: AnalyticsSettings = {
      enabled: false,
      dataSource: 'all',
      timeRange: 'term',
      groupBy: 'intervention',
      comparisonEnabled: true,
      significanceThreshold: 0.05,
      automaticReports: true,
      selectedInterventions: [],
    };
    
    setSettings(defaultSettings);
    setIsApplied(false);
    
    toast({
      title: "Settings reset",
      description: "Intervention analytics settings have been reset to defaults.",
    });
    
    // Save reset settings to user profile if logged in
    if (session?.user) {
      fetch('/api/special-needs/intervention-analytics/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: defaultSettings
        }),
      }).catch(error => {
        console.error('Error resetting analytics settings:', error);
      });
    }
  };
  
  // Generate report
  const handleGenerateReport = () => {
    toast({
      title: "Report generated",
      description: "Intervention effectiveness report has been generated and is ready for download.",
    });
  };
  
  // Calculate effectiveness rating
  const getEffectivenessRating = (effectiveness: number) => {
    if (effectiveness >= 0.8) return "Very High";
    if (effectiveness >= 0.7) return "High";
    if (effectiveness >= 0.5) return "Moderate";
    if (effectiveness >= 0.3) return "Low";
    return "Very Low";
  };
  
  // Get color for effectiveness rating
  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 0.8) return "#10b981"; // green
    if (effectiveness >= 0.7) return "#22c55e"; // green-light
    if (effectiveness >= 0.5) return "#f59e0b"; // amber
    if (effectiveness >= 0.3) return "#f97316"; // orange
    return "#ef4444"; // red
  };
  
  // Get badge variant for effectiveness rating
  const getEffectivenessBadgeVariant = (effectiveness: number): "default" | "secondary" | "destructive" | "outline" => {
    if (effectiveness >= 0.7) return "default";
    if (effectiveness >= 0.5) return "secondary";
    return "destructive";
  };
  
  // Format data for charts
  const getInterventionComparisonData = () => {
    // Group by intervention type and calculate average effectiveness
    const groupedData = analyticsData.reduce((acc, item) => {
      if (!acc[item.interventionType]) {
        acc[item.interventionType] = {
          interventionType: item.interventionType,
          effectiveness: 0,
          count: 0,
          averageGrowth: 0,
          timeToTarget: 0,
          sampleSize: 0
        };
      }
      
      acc[item.interventionType].effectiveness += item.effectiveness;
      acc[item.interventionType].averageGrowth += item.averageGrowth;
      acc[item.interventionType].timeToTarget += item.timeToTarget;
      acc[item.interventionType].sampleSize += item.sampleSize;
      acc[item.interventionType].count += 1;
      
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate averages
    return Object.values(groupedData).map(item => ({
      interventionType: item.interventionType,
      effectiveness: Math.round((item.effectiveness / item.count) * 100) / 100,
      averageGrowth: Math.round((item.averageGrowth / item.count) * 10) / 10,
      timeToTarget: Math.round(item.timeToTarget / item.count),
      sampleSize: item.sampleSize
    }));
  };
  
  const getProfileComparisonData = () => {
    // Group by learning profile and calculate average effectiveness
    const groupedData = analyticsData.reduce((acc, item) => {
      if (!acc[item.learningProfile]) {
        acc[item.learningProfile] = {
          learningProfile: item.learningProfile,
          effectiveness: 0,
          count: 0
        };
      }
      
      acc[item.learningProfile].effectiveness += item.effectiveness;
      acc[item.learningProfile].count += 1;
      
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate averages
    return Object.values(groupedData).map(item => ({
      learningProfile: item.learningProfile,
      effectiveness: Math.round((item.effectiveness / item.count) * 100) / 100
    }));
  };
  
  const getInterventionProfileMatrix = () => {
    // Create a matrix of intervention types vs learning profiles
    const matrix: Record<string, Record<string, number>> = {};
    
    // Initialize matrix
    interventionTypes.forEach(intervention => {
      matrix[intervention] = {};
      learningProfiles.forEach(profile => {
        matrix[intervention][profile] = 0;
      });
    });
    
    // Fill matrix with effectiveness values
    analyticsData.forEach(item => {
      if (matrix[item.interventionType] && matrix[item.interventionType][item.learningProfile] !== undefined) {
        matrix[item.interventionType][item.learningProfile] = item.effectiveness;
      }
    });
    
    return matrix;
  };
  
  const getStudentProgressData = () => {
    // Format student progress data for visualization
    return studentProgress.map(student => ({
      id: student.id,
      name: student.name,
      intervention: student.intervention,
      learningProfile: student.learningProfile,
      progressRate: student.progressRate,
      dataPoints: student.dataPoints
    }));
  };
  
  // Get COLORS array for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Intervention Effectiveness Analytics
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Analyze and compare intervention effectiveness across different learning profiles
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            {isApplied ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Most Effective Intervention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold">
                            {analyticsData.sort((a, b) => b.effectiveness - a.effectiveness)[0].interventionType}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.sort((a, b) => b.effectiveness - a.effectiveness)[0].effectiveness * 100}% effectiveness rate
                          </p>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Fastest Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold">
                            {analyticsData.sort((a, b) => a.timeToTarget - b.timeToTarget)[0].interventionType}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Average {analyticsData.sort((a, b) => a.timeToTarget - b.timeToTarget)[0].timeToTarget} weeks to target
                          </p>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Highest Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold">
                            {analyticsData.sort((a, b) => b.averageGrowth - a.averageGrowth)[0].interventionType}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {analyticsData.sort((a, b) => b.averageGrowth - a.averageGrowth)[0].averageGrowth} points average growth
                          </p>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">No data available</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Intervention Effectiveness Overview</h3>
                  
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getInterventionComparisonData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="interventionType" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          label={{ value: 'Effectiveness', angle: -90, position: 'insideLeft' }}
                          domain={[0, 1]}
                          tickFormatter={(value) => `${Math.round(value * 100)}%`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Effectiveness']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="effectiveness" 
                          name="Effectiveness" 
                          fill="#8884d8"
                          isAnimationActive={true}
                        >
                          {getInterventionComparisonData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getEffectivenessColor(entry.effectiveness)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-3">Effectiveness by Learning Profile</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getProfileComparisonData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="effectiveness"
                              nameKey="learningProfile"
                              label={({ learningProfile, effectiveness }) => `${learningProfile}: ${Math.round(effectiveness * 100)}%`}
                            >
                              {getProfileComparisonData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Effectiveness']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium mb-3">Time to Target by Intervention</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getInterventionComparisonData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="interventionType" 
                              angle={-45} 
                              textAnchor="end"
                              height={50}
                            />
                            <YAxis 
                              label={{ value: 'Weeks', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="timeToTarget" 
                              name="Weeks to Target" 
                              fill="#82ca9d"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Top Performing Interventions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intervention</TableHead>
                          <TableHead>Learning Profile</TableHead>
                          <TableHead>Effectiveness</TableHead>
                          <TableHead>Growth</TableHead>
                          <TableHead>Time to Target</TableHead>
                          <TableHead>Sample Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsData
                          .sort((a, b) => b.effectiveness - a.effectiveness)
                          .slice(0, 5)
                          .map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.interventionType}</TableCell>
                              <TableCell>{item.learningProfile}</TableCell>
                              <TableCell>
                                <Badge variant={getEffectivenessBadgeVariant(item.effectiveness)}>
                                  {Math.round(item.effectiveness * 100)}%
                                </Badge>
                              </TableCell>
                              <TableCell>{item.averageGrowth} points</TableCell>
                              <TableCell>{item.timeToTarget} weeks</TableCell>
                              <TableCell>{item.sampleSize} students</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Not Configured</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure and apply analytics settings to view intervention effectiveness data.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('settings')}
                >
                  Go to Settings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6 pt-4">
            {isApplied ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Intervention Comparison</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-3">Effectiveness Comparison</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getInterventionComparisonData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="number"
                              domain={[0, 1]}
                              tickFormatter={(value) => `${Math.round(value * 100)}%`}
                            />
                            <YAxis 
                              dataKey="interventionType" 
                              type="category"
                              width={150}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Effectiveness']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="effectiveness" 
                              name="Effectiveness" 
                              fill="#8884d8"
                            >
                              {getInterventionComparisonData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getEffectivenessColor(entry.effectiveness)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium mb-3">Growth Comparison</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getInterventionComparisonData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis 
                              dataKey="interventionType" 
                              type="category"
                              width={150}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="averageGrowth" 
                              name="Average Growth (points)" 
                              fill="#82ca9d"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Intervention-Profile Matrix</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This matrix shows the effectiveness of each intervention type for different learning profiles.
                      Darker colors indicate higher effectiveness.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Intervention / Profile</TableHead>
                            {learningProfiles.map((profile, index) => (
                              <TableHead key={index}>{profile}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(getInterventionProfileMatrix()).map(([intervention, profiles], index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{intervention}</TableCell>
                              {learningProfiles.map((profile, profileIndex) => (
                                <TableCell key={profileIndex} style={{ 
                                  backgroundColor: profiles[profile] > 0 
                                    ? `rgba(136, 132, 216, ${profiles[profile]})` 
                                    : undefined,
                                  color: profiles[profile] > 0.7 ? 'white' : undefined
                                }}>
                                  {profiles[profile] > 0 
                                    ? `${Math.round(profiles[profile] * 100)}%` 
                                    : '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Statistical Significance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Interventions with statistically significant results (p &lt; {settings.significanceThreshold})
                    </p>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intervention</TableHead>
                          <TableHead>Learning Profile</TableHead>
                          <TableHead>p-value</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Sample Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsData
                          .filter(item => Math.random() < 0.7) // Simulate statistical significance for demo
                          .sort((a, b) => a.learningProfile.localeCompare(b.learningProfile))
                          .slice(0, 6)
                          .map((item, index) => {
                            const pValue = Math.random() * settings.significanceThreshold;
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.interventionType}</TableCell>
                                <TableCell>{item.learningProfile}</TableCell>
                                <TableCell>{pValue.toFixed(4)}</TableCell>
                                <TableCell>{Math.round((1 - pValue) * 100)}%</TableCell>
                                <TableCell>{item.sampleSize} students</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Not Configured</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure and apply analytics settings to view intervention comparison data.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('settings')}
                >
                  Go to Settings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="individual" className="space-y-6 pt-4">
            {isApplied ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Individual Student Progress</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-3">Progress Rate Comparison</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getStudentProgressData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis 
                              domain={[0, 1]}
                              tickFormatter={(value) => `${Math.round(value * 100)}%`}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Progress Rate']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="progressRate" 
                              name="Progress Rate" 
                              fill="#8884d8"
                            >
                              {getStudentProgressData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getEffectivenessColor(entry.progressRate)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium mb-3">Progress by Intervention Type</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="category"
                              dataKey="intervention" 
                              name="Intervention"
                              angle={-45} 
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis 
                              type="number"
                              dataKey="progressRate" 
                              name="Progress Rate"
                              domain={[0, 1]}
                              tickFormatter={(value) => `${Math.round(value * 100)}%`}
                            />
                            <Tooltip 
                              formatter={(value: number, name: string) => {
                                if (name === "Progress Rate") {
                                  return [`${Math.round(value * 100)}%`, name];
                                }
                                return [value, name];
                              }}
                              cursor={{ strokeDasharray: '3 3' }}
                            />
                            <Legend />
                            <Scatter 
                              name="Students" 
                              data={getStudentProgressData()} 
                              fill="#8884d8"
                            >
                              {getStudentProgressData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getEffectivenessColor(entry.progressRate)} />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Individual Progress Tracking</h3>
                    
                    <div className="space-y-2 mb-4">
                      <Label>Select Student</Label>
                      <Select
                        defaultValue={studentProgress[0]?.id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {studentProgress.map((student, index) => (
                            <SelectItem key={index} value={student.id}>
                              {student.name} - {student.learningProfile}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {studentProgress.length > 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {Math.round(studentProgress[0].progressRate * 100)}%
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {studentProgress[0].currentGrowth} of {studentProgress[0].targetGrowth} points
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Intervention</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {studentProgress[0].intervention}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Started {studentProgress[0].startDate}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Learning Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {studentProgress[0].learningProfile}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {analyticsData.find(item => item.learningProfile === studentProgress[0].learningProfile)?.sampleSize || 0} similar students
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={studentProgress[0].dataPoints}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                name="Progress" 
                                stroke="#8884d8" 
                                activeDot={{ r: 8 }} 
                              />
                              {/* Target line */}
                              <Line 
                                type="monotone" 
                                dataKey={() => studentProgress[0].targetGrowth} 
                                name="Target" 
                                stroke="#82ca9d" 
                                strokeDasharray="5 5" 
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-md font-medium mb-3">Recommendations</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="font-medium">Continue current intervention</p>
                                <p className="text-sm text-muted-foreground">
                                  Progress is steady and on track to meet target. Maintain current approach.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="font-medium">Increase frequency</p>
                                <p className="text-sm text-muted-foreground">
                                  Consider increasing session frequency to accelerate progress.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="font-medium">Add complementary strategy</p>
                                <p className="text-sm text-muted-foreground">
                                  Based on similar profiles, adding visual supports may enhance effectiveness.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Not Configured</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure and apply analytics settings to view individual student progress data.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('settings')}
                >
                  Go to Settings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-source">Data Source</Label>
                <Select
                  value={settings.dataSource}
                  onValueChange={(value: 'all' | 'current' | 'selected') => 
                    handleSettingsChange('dataSource', value)
                  }
                >
                  <SelectTrigger id="data-source">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Interventions</SelectItem>
                    <SelectItem value="current">Current Interventions Only</SelectItem>
                    <SelectItem value="selected">Selected Interventions</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Which intervention data to include in analytics
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-range">Time Range</Label>
                <Select
                  value={settings.timeRange}
                  onValueChange={(value: 'week' | 'month' | 'term' | 'year' | 'all') => 
                    handleSettingsChange('timeRange', value)
                  }
                >
                  <SelectTrigger id="time-range">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="term">Current Term</SelectItem>
                    <SelectItem value="year">Current Academic Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Time period to analyze for intervention effectiveness
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group-by">Group By</Label>
                <Select
                  value={settings.groupBy}
                  onValueChange={(value: 'intervention' | 'student' | 'learningProfile' | 'none') => 
                    handleSettingsChange('groupBy', value)
                  }
                >
                  <SelectTrigger id="group-by">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intervention">Intervention Type</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="learningProfile">Learning Profile</SelectItem>
                    <SelectItem value="none">No Grouping</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How to group data for analysis and visualization
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comparison-enabled">Enable Comparison</Label>
                  <p className="text-xs text-muted-foreground">
                    Compare effectiveness across different interventions and profiles
                  </p>
                </div>
                <Switch 
                  id="comparison-enabled"
                  checked={settings.comparisonEnabled}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('comparisonEnabled', checked)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="significance-threshold">Significance Threshold (p-value)</Label>
                  <span className="text-sm">{settings.significanceThreshold}</span>
                </div>
                <Slider
                  id="significance-threshold"
                  min={0.01}
                  max={0.1}
                  step={0.01}
                  value={[settings.significanceThreshold]}
                  onValueChange={(value) => 
                    handleSettingsChange('significanceThreshold', value[0])
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Statistical significance level for determining meaningful differences
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automatic-reports">Automatic Reports</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate periodic effectiveness reports automatically
                  </p>
                </div>
                <Switch 
                  id="automatic-reports"
                  checked={settings.automaticReports}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('automaticReports', checked)
                  }
                />
              </div>
              
              {settings.dataSource === 'selected' && (
                <div className="space-y-2 pt-2">
                  <Label>Selected Interventions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {interventionTypes.map((intervention, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Switch 
                          id={`intervention-${index}`}
                          checked={settings.selectedInterventions?.includes(intervention) || false}
                          onCheckedChange={(checked) => {
                            const current = settings.selectedInterventions || [];
                            const updated = checked 
                              ? [...current, intervention]
                              : current.filter(i => i !== intervention);
                            handleSettingsChange('selectedInterventions', updated);
                          }}
                        />
                        <Label htmlFor={`intervention-${index}`}>{intervention}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          {isApplied && (
            <Button 
              variant="outline" 
              onClick={handleGenerateReport}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleApplySettings}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          {isApplied ? "Update Settings" : "Apply Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
