'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, BarChart3, Check, RefreshCw, FileText, AlertTriangle, Info, Target, BookOpen, Clock, Plus, Trash2 } from "lucide-react";
import { useSession } from 'next-auth/react';

interface ProgressMonitoringProps {
  onSettingsChange?: (settings: MonitoringSettings) => void;
  className?: string;
}

interface MonitoringSettings {
  enabled: boolean;
  monitoringFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  automaticReminders: boolean;
  dataVisualization: boolean;
  progressReports: boolean;
  goalTracking: boolean;
  interventionId?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  notes: string;
}

interface DataPoint {
  date: string;
  value: number;
  notes?: string;
}

export default function ProgressMonitoringEngine({
  onSettingsChange,
  className = '',
}: ProgressMonitoringProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for monitoring settings
  const [settings, setSettings] = useState<MonitoringSettings>({
    enabled: false,
    monitoringFrequency: 'weekly',
    automaticReminders: true,
    dataVisualization: true,
    progressReports: true,
    goalTracking: true,
  });
  
  // State for goals and data points
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [newDataPoint, setNewDataPoint] = useState<{
    date: Date | undefined;
    value: string;
    notes: string;
  }>({
    date: new Date(),
    value: '',
    notes: '',
  });
  
  // State for new goal form
  const [newGoal, setNewGoal] = useState<{
    title: string;
    description: string;
    targetDate: Date | undefined;
    baseline: string;
    target: string;
    unit: string;
    notes: string;
  }>({
    title: '',
    description: '',
    targetDate: undefined,
    baseline: '',
    target: '',
    unit: '',
    notes: '',
  });
  
  // State for UI
  const [isApplied, setIsApplied] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [interventions, setInterventions] = useState<{id: string, name: string}[]>([]);
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      // Load progress monitoring settings
      fetch('/api/special-needs/progress-monitoring')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            setSettings(prev => ({
              ...prev,
              ...data.settings,
            }));
            
            // If monitoring was already enabled, mark as applied
            if (data.settings.enabled) {
              setIsApplied(true);
            }
          }
        })
        .catch(error => {
          console.error('Error loading progress monitoring settings:', error);
        });
      
      // Load goals
      fetch('/api/special-needs/progress-monitoring/goals')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.goals) {
            setGoals(data.goals.map((goal: any) => ({
              ...goal,
              targetDate: new Date(goal.targetDate),
            })));
            
            if (data.goals.length > 0) {
              setSelectedGoal({
                ...data.goals[0],
                targetDate: new Date(data.goals[0].targetDate),
              });
            }
          }
        })
        .catch(error => {
          console.error('Error loading goals:', error);
        });
      
      // Load available interventions
      fetch('/api/special-needs/personalized-interventions')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            setInterventions([
              {
                id: data.settings.id || 'default',
                name: `${data.settings.learningProfile} (${data.settings.interventionLevel})`
              }
            ]);
          }
        })
        .catch(error => {
          console.error('Error loading interventions:', error);
        });
    }
  }, [session]);
  
  // Load data points when selected goal changes
  useEffect(() => {
    if (selectedGoal && session?.user) {
      fetch(`/api/special-needs/progress-monitoring/goals/${selectedGoal.id}/data`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.dataPoints) {
            setDataPoints(data.dataPoints);
          }
        })
        .catch(error => {
          console.error('Error loading data points:', error);
        });
    } else {
      setDataPoints([]);
    }
  }, [selectedGoal, session]);
  
  // Handle settings change
  const handleSettingsChange = (key: keyof MonitoringSettings, value: any) => {
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
    
    // Save settings to user profile if logged in
    if (session?.user) {
      fetch('/api/special-needs/progress-monitoring', {
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
              title: "Monitoring settings saved",
              description: "Your progress monitoring settings have been saved to your profile.",
            });
          } else {
            throw new Error(data.error || 'Failed to save settings');
          }
        })
        .catch(error => {
          console.error('Error saving monitoring settings:', error);
          toast({
            title: "Error saving settings",
            description: "Your monitoring settings could not be saved to your profile.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Monitoring settings created",
        description: "Sign in to save these settings to your profile.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: MonitoringSettings = {
      enabled: false,
      monitoringFrequency: 'weekly',
      automaticReminders: true,
      dataVisualization: true,
      progressReports: true,
      goalTracking: true,
    };
    
    setSettings(defaultSettings);
    setIsApplied(false);
    
    toast({
      title: "Settings reset",
      description: "Progress monitoring settings have been reset to defaults.",
    });
    
    // Save reset settings to user profile if logged in
    if (session?.user) {
      fetch('/api/special-needs/progress-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: defaultSettings
        }),
      }).catch(error => {
        console.error('Error resetting monitoring settings:', error);
      });
    }
  };
  
  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate || !newGoal.baseline || !newGoal.target || !newGoal.unit) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the goal.",
        variant: "destructive",
      });
      return;
    }
    
    const goalData = {
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      baseline: parseFloat(newGoal.baseline),
      target: parseFloat(newGoal.target),
      currentValue: parseFloat(newGoal.baseline),
      unit: newGoal.unit,
      notes: newGoal.notes,
    };
    
    if (session?.user) {
      fetch('/api/special-needs/progress-monitoring/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goalData
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.goal) {
            const newGoalWithId = {
              ...goalData,
              id: data.goal.id,
              currentValue: parseFloat(newGoal.baseline),
            };
            
            setGoals(prev => [...prev, newGoalWithId]);
            setSelectedGoal(newGoalWithId);
            
            // Reset form
            setNewGoal({
              title: '',
              description: '',
              targetDate: undefined,
              baseline: '',
              target: '',
              unit: '',
              notes: '',
            });
            
            toast({
              title: "Goal created",
              description: "Your new goal has been created successfully.",
            });
            
            // Switch to goals tab
            setActiveTab('goals');
          } else {
            throw new Error(data.error || 'Failed to create goal');
          }
        })
        .catch(error => {
          console.error('Error creating goal:', error);
          toast({
            title: "Error creating goal",
            description: "Your goal could not be created. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      // For demo purposes when not logged in
      const demoGoal = {
        ...goalData,
        id: `demo-${Date.now()}`,
        currentValue: parseFloat(newGoal.baseline),
      };
      
      setGoals(prev => [...prev, demoGoal]);
      setSelectedGoal(demoGoal);
      
      // Reset form
      setNewGoal({
        title: '',
        description: '',
        targetDate: undefined,
        baseline: '',
        target: '',
        unit: '',
        notes: '',
      });
      
      toast({
        title: "Demo goal created",
        description: "This is a demo goal. Sign in to save goals to your profile.",
      });
      
      // Switch to goals tab
      setActiveTab('goals');
    }
  };
  
  // Add new data point
  const handleAddDataPoint = () => {
    if (!selectedGoal || !newDataPoint.date || !newDataPoint.value) {
      toast({
        title: "Missing information",
        description: "Please select a goal and provide a date and value.",
        variant: "destructive",
      });
      return;
    }
    
    const dataPointValue = parseFloat(newDataPoint.value);
    
    if (isNaN(dataPointValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number for the value.",
        variant: "destructive",
      });
      return;
    }
    
    const dataPoint = {
      date: format(newDataPoint.date, 'yyyy-MM-dd'),
      value: dataPointValue,
      notes: newDataPoint.notes,
    };
    
    if (session?.user) {
      fetch(`/api/special-needs/progress-monitoring/goals/${selectedGoal.id}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataPoint: dataPoint
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.dataPoint) {
            setDataPoints(prev => [...prev, dataPoint]);
            
            // Update current value in selected goal
            setSelectedGoal(prev => {
              if (prev) {
                return {
                  ...prev,
                  currentValue: dataPointValue,
                };
              }
              return prev;
            });
            
            // Update current value in goals list
            setGoals(prev => prev.map(goal => 
              goal.id === selectedGoal.id 
                ? { ...goal, currentValue: dataPointValue } 
                : goal
            ));
            
            // Reset form
            setNewDataPoint({
              date: new Date(),
              value: '',
              notes: '',
            });
            
            toast({
              title: "Data point added",
              description: "Your new data point has been added successfully.",
            });
          } else {
            throw new Error(data.error || 'Failed to add data point');
          }
        })
        .catch(error => {
          console.error('Error adding data point:', error);
          toast({
            title: "Error adding data point",
            description: "Your data point could not be added. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      // For demo purposes when not logged in
      setDataPoints(prev => [...prev, dataPoint]);
      
      // Update current value in selected goal
      setSelectedGoal(prev => {
        if (prev) {
          return {
            ...prev,
            currentValue: dataPointValue,
          };
        }
        return prev;
      });
      
      // Update current value in goals list
      setGoals(prev => prev.map(goal => 
        goal.id === selectedGoal.id 
          ? { ...goal, currentValue: dataPointValue } 
          : goal
      ));
      
      // Reset form
      setNewDataPoint({
        date: new Date(),
        value: '',
        notes: '',
      });
      
      toast({
        title: "Demo data point added",
        description: "This is a demo data point. Sign in to save data to your profile.",
      });
    }
  };
  
  // Delete goal
  const handleDeleteGoal = (goalId: string) => {
    if (session?.user) {
      fetch(`/api/special-needs/progress-monitoring/goals/${goalId}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Remove goal from state
            setGoals(prev => prev.filter(goal => goal.id !== goalId));
            
            // If the deleted goal was selected, select another one or set to null
            if (selectedGoal && selectedGoal.id === goalId) {
              const remainingGoals = goals.filter(goal => goal.id !== goalId);
              setSelectedGoal(remainingGoals.length > 0 ? remainingGoals[0] : null);
            }
            
            toast({
              title: "Goal deleted",
              description: "The goal has been deleted successfully.",
            });
          } else {
            throw new Error(data.error || 'Failed to delete goal');
          }
        })
        .catch(error => {
          console.error('Error deleting goal:', error);
          toast({
            title: "Error deleting goal",
            description: "The goal could not be deleted. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      // For demo purposes when not logged in
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      // If the deleted goal was selected, select another one or set to null
      if (selectedGoal && selectedGoal.id === goalId) {
        const remainingGoals = goals.filter(goal => goal.id !== goalId);
        setSelectedGoal(remainingGoals.length > 0 ? remainingGoals[0] : null);
      }
      
      toast({
        title: "Demo goal deleted",
        description: "This is a demo deletion. Sign in to manage goals in your profile.",
      });
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (goal: Goal) => {
    if (goal.target === goal.baseline) return 100; // Avoid division by zero
    const range = goal.target - goal.baseline;
    const progress = goal.currentValue - goal.baseline;
    const percentage = (progress / range) * 100;
    return Math.min(Math.max(0, percentage), 100); // Clamp between 0 and 100
  };
  
  // Format chart data
  const getChartData = () => {
    return dataPoints.map(point => ({
      date: point.date,
      value: point.value,
    }));
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progress Monitoring
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Track intervention effectiveness and student progress over time
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monitoring-frequency">Monitoring Frequency</Label>
                <Select
                  value={settings.monitoringFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'biweekly' | 'monthly') => 
                    handleSettingsChange('monitoringFrequency', value)
                  }
                >
                  <SelectTrigger id="monitoring-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How often data should be collected to monitor progress
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intervention-link">Link to Intervention</Label>
                <Select
                  value={settings.interventionId}
                  onValueChange={(value) => 
                    handleSettingsChange('interventionId', value)
                  }
                >
                  <SelectTrigger id="intervention-link">
                    <SelectValue placeholder="Select intervention" />
                  </SelectTrigger>
                  <SelectContent>
                    {interventions.map((intervention) => (
                      <SelectItem key={intervention.id} value={intervention.id}>
                        {intervention.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Connect monitoring to a specific intervention plan
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automatic-reminders">Automatic Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Send reminders when data collection is due
                  </p>
                </div>
                <Switch 
                  id="automatic-reminders"
                  checked={settings.automaticReminders}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('automaticReminders', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-visualization">Data Visualization</Label>
                  <p className="text-xs text-muted-foreground">
                    Show charts and graphs of progress data
                  </p>
                </div>
                <Switch 
                  id="data-visualization"
                  checked={settings.dataVisualization}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('dataVisualization', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="progress-reports">Progress Reports</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate shareable progress reports
                  </p>
                </div>
                <Switch 
                  id="progress-reports"
                  checked={settings.progressReports}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('progressReports', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="goal-tracking">Goal Tracking</Label>
                  <p className="text-xs text-muted-foreground">
                    Set and monitor progress toward specific goals
                  </p>
                </div>
                <Switch 
                  id="goal-tracking"
                  checked={settings.goalTracking}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('goalTracking', checked)
                  }
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-6 pt-4">
            {goals.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Goal to View</Label>
                  <Select
                    value={selectedGoal?.id}
                    onValueChange={(value) => {
                      const goal = goals.find(g => g.id === value);
                      if (goal) setSelectedGoal(goal);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedGoal && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{selectedGoal.title}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGoal(selectedGoal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{selectedGoal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Baseline</p>
                            <p className="text-2xl">{selectedGoal.baseline} <span className="text-sm text-muted-foreground">{selectedGoal.unit}</span></p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Current</p>
                            <p className="text-2xl">{selectedGoal.currentValue} <span className="text-sm text-muted-foreground">{selectedGoal.unit}</span></p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Target</p>
                            <p className="text-2xl">{selectedGoal.target} <span className="text-sm text-muted-foreground">{selectedGoal.unit}</span></p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(calculateProgress(selectedGoal))}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${calculateProgress(selectedGoal)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Target Date</p>
                            <p className="text-sm">{format(selectedGoal.targetDate, 'PPP')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Notes</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{selectedGoal.notes || "No notes"}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Add New Goal</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-title">Goal Title</Label>
                        <Input 
                          id="goal-title" 
                          placeholder="e.g., Improve reading fluency"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea 
                          id="goal-description" 
                          placeholder="Describe the goal and how it will be measured"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Target Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newGoal.targetDate ? (
                                format(newGoal.targetDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newGoal.targetDate}
                              onSelect={(date) => setNewGoal({...newGoal, targetDate: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-unit">Unit of Measurement</Label>
                        <Input 
                          id="goal-unit" 
                          placeholder="e.g., words per minute"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-baseline">Baseline Value</Label>
                        <Input 
                          id="goal-baseline" 
                          type="number"
                          placeholder="Current value"
                          value={newGoal.baseline}
                          onChange={(e) => setNewGoal({...newGoal, baseline: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-target">Target Value</Label>
                        <Input 
                          id="goal-target" 
                          type="number"
                          placeholder="Goal value"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-notes">Notes</Label>
                      <Textarea 
                        id="goal-notes" 
                        placeholder="Additional notes about this goal"
                        value={newGoal.notes}
                        onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddGoal}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-8 text-center">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Goals Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your first goal to start tracking progress.
                  </p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Add New Goal</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-title">Goal Title</Label>
                        <Input 
                          id="goal-title" 
                          placeholder="e.g., Improve reading fluency"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea 
                          id="goal-description" 
                          placeholder="Describe the goal and how it will be measured"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Target Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newGoal.targetDate ? (
                                format(newGoal.targetDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newGoal.targetDate}
                              onSelect={(date) => setNewGoal({...newGoal, targetDate: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-unit">Unit of Measurement</Label>
                        <Input 
                          id="goal-unit" 
                          placeholder="e.g., words per minute"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-baseline">Baseline Value</Label>
                        <Input 
                          id="goal-baseline" 
                          type="number"
                          placeholder="Current value"
                          value={newGoal.baseline}
                          onChange={(e) => setNewGoal({...newGoal, baseline: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-target">Target Value</Label>
                        <Input 
                          id="goal-target" 
                          type="number"
                          placeholder="Goal value"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-notes">Notes</Label>
                      <Textarea 
                        id="goal-notes" 
                        placeholder="Additional notes about this goal"
                        value={newGoal.notes}
                        onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddGoal}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6 pt-4">
            {selectedGoal ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Data for: {selectedGoal.title}</h3>
                  
                  {dataPoints.length > 0 && settings.dataVisualization ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getChartData()}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={[
                              Math.min(selectedGoal.baseline, Math.min(...dataPoints.map(d => d.value))) * 0.9,
                              Math.max(selectedGoal.target, Math.max(...dataPoints.map(d => d.value))) * 1.1
                            ]}
                          />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            name={`${selectedGoal.title} (${selectedGoal.unit})`}
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                          {/* Horizontal line for target */}
                          <Line 
                            type="monotone" 
                            dataKey={() => selectedGoal.target} 
                            stroke="#82ca9d" 
                            strokeDasharray="5 5" 
                            name="Target" 
                            dot={false}
                          />
                          {/* Horizontal line for baseline */}
                          <Line 
                            type="monotone" 
                            dataKey={() => selectedGoal.baseline} 
                            stroke="#ff7300" 
                            strokeDasharray="5 5" 
                            name="Baseline" 
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : dataPoints.length === 0 ? (
                    <div className="p-8 text-center bg-muted rounded-md">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No Data Points Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Add data points to start tracking progress for this goal.
                      </p>
                    </div>
                  ) : null}
                  
                  <div className="pt-4">
                    <h4 className="text-md font-medium mb-2">Add New Data Point</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newDataPoint.date ? (
                                  format(newDataPoint.date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newDataPoint.date}
                                onSelect={(date) => setNewDataPoint({...newDataPoint, date})}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="data-value">Value ({selectedGoal.unit})</Label>
                          <Input 
                            id="data-value" 
                            type="number"
                            placeholder={`Value in ${selectedGoal.unit}`}
                            value={newDataPoint.value}
                            onChange={(e) => setNewDataPoint({...newDataPoint, value: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-notes">Notes</Label>
                        <Textarea 
                          id="data-notes" 
                          placeholder="Additional notes about this data point"
                          value={newDataPoint.notes}
                          onChange={(e) => setNewDataPoint({...newDataPoint, notes: e.target.value})}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAddDataPoint}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Data Point
                      </Button>
                    </div>
                  </div>
                  
                  {dataPoints.length > 0 && (
                    <div className="pt-4">
                      <h4 className="text-md font-medium mb-2">Data History</h4>
                      <div className="border rounded-md">
                        <div className="grid grid-cols-3 font-medium p-3 border-b">
                          <div>Date</div>
                          <div>Value</div>
                          <div>Notes</div>
                        </div>
                        <div className="divide-y">
                          {dataPoints.map((point, index) => (
                            <div key={index} className="grid grid-cols-3 p-3">
                              <div>{point.date}</div>
                              <div>{point.value} {selectedGoal.unit}</div>
                              <div className="text-sm text-muted-foreground truncate">{point.notes || "—"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Goal Selected</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please select or create a goal first to add and view data points.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('goals')}
                >
                  Go to Goals
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
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
