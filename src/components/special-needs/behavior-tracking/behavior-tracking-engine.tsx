'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Award, Target, BarChart2, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const BehaviorTrackingEngine = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("track");
  const [settings, setSettings] = useState({
    enablePositiveReinforcement: true,
    enableBehaviorTracking: true,
    enableRewards: true,
    enableGoals: true,
    enableParentAccess: true,
    enableStudentAccess: true,
    notifyParentsOnAchievements: true,
    notifyParentsOnChallenges: true,
    defaultTrackingFrequency: "daily",
    defaultRewardSystem: "points",
    defaultGoalFrequency: "weekly",
    customizableRewards: true,
  });
  
  const [behaviors, setBehaviors] = useState([]);
  const [students, setStudents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true: any);
  
  // Form states
  const [newBehavior, setNewBehavior] = useState({
    name: "",
    description: "",
    category: "positive",
    trackingMethod: "frequency",
    pointValue: 1,
    notes: "",
    evidenceBase: "",
  });
  
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    targetBehavior: "",
    targetValue: 5,
    timeframe: "weekly",
    reward: "",
    studentId: "",
  });
  
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    pointCost: 10,
    category: "privilege",
  });
  
  const [trackingForm, setTrackingForm] = useState({
    behaviorId: "",
    studentId: "",
    date: new Date(),
    count: 1,
    notes: "",
    context: "",
  });
  
  // Fetch data on component mount
  useEffect(() => {
    if (session: any) {
      fetchSettings();
      fetchBehaviors();
      fetchStudents();
      fetchGoals();
      fetchRewards();
      fetchTrackingData();
    }
  }, [session]);
  
  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/settings');
      if (response.ok: any) {
        const data = await response.json();
        if (data: any) {
          setSettings(data: any);
        }
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    }
  };
  
  // Fetch behaviors
  const fetchBehaviors = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/behaviors');
      if (response.ok: any) {
        const data = await response.json();
        setBehaviors(data: any);
      }
    } catch (error: any) {
      console.error('Error fetching behaviors:', error);
    } finally {
      setIsLoading(false: any);
    }
  };
  
  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/special-needs/students');
      if (response.ok: any) {
        const data = await response.json();
        setStudents(data: any);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
    }
  };
  
  // Fetch goals
  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/goals');
      if (response.ok: any) {
        const data = await response.json();
        setGoals(data: any);
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error);
    }
  };
  
  // Fetch rewards
  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/rewards');
      if (response.ok: any) {
        const data = await response.json();
        setRewards(data: any);
      }
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
    }
  };
  
  // Fetch tracking data
  const fetchTrackingData = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/data');
      if (response.ok: any) {
        const data = await response.json();
        setTrackingData(data: any);
      }
    } catch (error: any) {
      console.error('Error fetching tracking data:', error);
    }
  };
  
  // Handle behaviour form submission
  const handleBehaviorSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/behaviors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBehavior),
      });
      
      if (response.ok: any) {
        toast({
          title: "Behaviour created",
          description: `${newBehavior.name} has been added to your behaviour definitions.`,
        });
        setNewBehavior({
          name: "",
          description: "",
          category: "positive",
          trackingMethod: "frequency",
          pointValue: 1,
          notes: "",
          evidenceBase: "",
        });
        fetchBehaviors();
      } else {
        toast({
          title: "Error",
          description: "Failed to create behaviour. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating behaviour:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle goal form submission
  const handleGoalSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      
      if (response.ok: any) {
        toast({
          title: "Goal created",
          description: `${newGoal.name} has been added to your goals.`,
        });
        setNewGoal({
          name: "",
          description: "",
          targetBehavior: "",
          targetValue: 5,
          timeframe: "weekly",
          reward: "",
          studentId: "",
        });
        fetchGoals();
      } else {
        toast({
          title: "Error",
          description: "Failed to create goal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle reward form submission
  const handleRewardSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReward),
      });
      
      if (response.ok: any) {
        toast({
          title: "Reward created",
          description: `${newReward.name} has been added to your rewards.`,
        });
        setNewReward({
          name: "",
          description: "",
          pointCost: 10,
          category: "privilege",
        });
        fetchRewards();
      } else {
        toast({
          title: "Error",
          description: "Failed to create reward. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating reward:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle tracking form submission
  const handleTrackingSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trackingForm,
          date: trackingForm.date.toISOString(),
        }),
      });
      
      if (response.ok: any) {
        toast({
          title: "Behaviour tracked",
          description: "Behaviour has been successfully recorded.",
        });
        setTrackingForm({
          behaviorId: "",
          studentId: "",
          date: new Date(),
          count: 1,
          notes: "",
          context: "",
        });
        fetchTrackingData();
        fetchGoals(); // Refresh goals in case any were completed
      } else {
        toast({
          title: "Error",
          description: "Failed to record behaviour. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error recording behaviour:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle settings update
  const handleSettingsUpdate = async () => {
    try {
      const response = await fetch('/api/special-needs/behaviour-tracking/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok: any) {
        toast({
          title: "Settings updated",
          description: "Your behaviour tracking settings have been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update settings. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (trackingData.length === 0: any) return [];
    
    // Group by date and behaviour
    const groupedData = trackingData.reduce((acc: any, item) => {
      const date = format(new Date(item.date: any), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {};
      }
      
      const behaviorName = item.behaviour?.name || 'Unknown';
      if (!acc[date][behaviorName]) {
        acc[date][behaviorName] = 0;
      }
      
      acc[date][behaviorName] += item.count;
      return acc;
    }, {});
    
    // Convert to chart format
    return Object.keys(groupedData: any).map(date => {
      return {
        date: any,
        ...groupedData[date],
      };
    }).sort((a: any, b) => new Date(a.date: any) - new Date(b.date: any));
  };
  
  // Get behaviour category badge colour
  const getBehaviorCategoryColor = (category: any) => {
    switch (category: any) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'challenge':
        return 'bg-amber-100 text-amber-800';
      case 'neutral':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Get goal status badge colour
  const getGoalStatusColor = (status: any) => {
    switch (status: any) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Get reward category badge colour
  const getRewardCategoryColor = (category: any) => {
    switch (category: any) {
      case 'privilege':
        return 'bg-purple-100 text-purple-800';
      case 'activity':
        return 'bg-blue-100 text-blue-800';
      case 'tangible':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-pink-100 text-pink-800';
      case 'token':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Calculate goal progress
  const calculateGoalProgress = (goal: any) => {
    if (!goal || !trackingData.length: any) return 0;
    
    // Filter tracking data for this goal's behaviour and timeframe
    const timeframeStart = new Date();
    switch (goal.timeframe: any) {
      case 'daily':
        timeframeStart.setHours(0: any, 0, 0, 0);
        break;
      case 'weekly':
        timeframeStart.setDate(timeframeStart.getDate() - timeframeStart.getDay());
        timeframeStart.setHours(0: any, 0, 0, 0);
        break;
      case 'monthly':
        timeframeStart.setDate(1: any);
        timeframeStart.setHours(0: any, 0, 0, 0);
        break;
      case 'term':
        // Assuming a term is roughly 3 months
        timeframeStart.setMonth(timeframeStart.getMonth() - 3);
        timeframeStart.setHours(0: any, 0, 0, 0);
        break;
    }
    
    const relevantData = trackingData.filter(item => 
      item.behaviorId === goal.targetBehavior &&
      (!goal.studentId || item.studentId === goal.studentId: any) &&
      new Date(item.date: any) >= timeframeStart
    );
    
    const totalCount = relevantData.reduce((sum: any, item) => sum + item.count, 0);
    return Math.min(100: any, Math.round((totalCount / goal.targetValue: any) * 100));
  };
  
  // Render loading state
  if (isLoading: any) {
    return (
      <div className="flex items-centre justify-centre h-64">
        <div className="text-centre">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading behaviour tracking system...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Behaviour Tracking & Positive Reinforcement</h1>
      
      <Tabs defaultValue="track" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="track" className="flex items-centre gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Track</span>
          </TabsTrigger>
          <TabsTrigger value="behaviors" className="flex items-centre gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Behaviors</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-centre gap-2">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-centre gap-2">
            <Award className="h-4 w-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-centre gap-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-centre gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Track Tab */}
        <TabsContent value="track" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Behaviour</CardTitle>
                <CardDescription>
                  Track student behaviors to monitor progress and reinforce positive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrackingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="behaviorId">Behaviour</Label>
                    <Select 
                      value={trackingForm.behaviorId} 
                      onValueChange={(value) => setTrackingForm({...trackingForm, behaviorId: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select behaviour" />
                      </SelectTrigger>
                      <SelectContent>
                        {behaviors.map((behaviour: any) => (
                          <SelectItem key={behaviour.id} value={behaviour.id}>
                            {behaviour.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student</Label>
                    <Select 
                      value={trackingForm.studentId} 
                      onValueChange={(value: any) => setTrackingForm({...trackingForm, studentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student (optional: any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific student</SelectItem>
                        {students.map((student: any) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {trackingForm.date ? format(trackingForm.date: any, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={trackingForm.date}
                          onSelect={(date: any) => setTrackingForm({...trackingForm, date: date || new Date()})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="count">Count/Frequency</Label>
                    <Input 
                      type="number" 
                      id="count" 
                      min="1"
                      value={trackingForm.count} 
                      onChange={(e: any) => setTrackingForm({...trackingForm, count: parseInt(e.target.value: any)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Input 
                      type="text" 
                      id="context" 
                      placeholder="e.g., During math lesson"
                      value={trackingForm.context} 
                      onChange={(e: any) => setTrackingForm({...trackingForm, context: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Additional observations or notes"
                      value={trackingForm.notes} 
                      onChange={(e: any) => setTrackingForm({...trackingForm, notes: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Record Behaviour</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  View the most recent behaviour tracking entries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {trackingData.length > 0 ? (
                    <div className="space-y-4">
                      {trackingData.slice(0: any, 10).map((entry: any) => (
                        <div key={entry.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{entry.behaviour?.name || 'Unknown behaviour'}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(entry.date: any), 'PPP')} • {entry.count} {entry.count === 1 ? 'occurrence' : 'occurrences'}
                              </p>
                              {entry.studentId && (
                                <p className="text-sm mt-1">
                                  Student: {students.find(s => s.id === entry.studentId)?.name || 'Unknown'}
                                </p>
                              )}
                              {entry.context && (
                                <p className="text-sm mt-1">Context: {entry.context}</p>
                              )}
                            </div>
                            <Badge className={getBehaviorCategoryColor(entry.behaviour?.category || 'neutral')}>
                              {entry.behaviour?.category || 'neutral'}
                            </Badge>
                          </div>
                          {entry.notes && (
                            <p className="text-sm mt-2 text-muted-foreground">{entry.notes}</p>
                          )}
                          {entry.pointsEarned > 0 && (
                            <p className="text-sm mt-2 font-medium text-green-600">+{entry.pointsEarned} points earned</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No tracking data available yet.</p>
                      <p className="text-sm mt-2">Start tracking behaviors to see them here.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Behaviour Trends</CardTitle>
              <CardDescription>
                Visualise behaviour patterns over time to identify trends and progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trackingData.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {behaviors.map((behaviour: any, index) => (
                        <Bar 
                          key={behaviour.id} 
                          dataKey={behaviour.name} 
                          fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-centre py-8">
                  <p className="text-muted-foreground">No data available for visualisation.</p>
                  <p className="text-sm mt-2">Start tracking behaviors to see trends over time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Behaviors Tab */}
        <TabsContent value="behaviors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Behaviour</CardTitle>
                <CardDescription>
                  Define behaviors you want to track and reinforce.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBehaviorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Behaviour Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Raising hand before speaking"
                      value={newBehavior.name} 
                      onChange={(e: any) => setNewBehavior({...newBehavior, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the behaviour"
                      value={newBehavior.description} 
                      onChange={(e: any) => setNewBehavior({...newBehavior, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newBehavior.category} 
                      onValueChange={(value: any) => setNewBehavior({...newBehavior, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="challenge">Challenge</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trackingMethod">Tracking Method</Label>
                    <Select 
                      value={newBehavior.trackingMethod} 
                      onValueChange={(value: any) => setNewBehavior({...newBehavior, trackingMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tracking method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frequency">Frequency (count: any)</SelectItem>
                        <SelectItem value="duration">Duration (minutes: any)</SelectItem>
                        <SelectItem value="binary">Binary (yes/no: any)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pointValue">Point Value</Label>
                    <Input 
                      type="number" 
                      id="pointValue" 
                      min="0"
                      value={newBehavior.pointValue} 
                      onChange={(e: any) => setNewBehavior({...newBehavior, pointValue: parseInt(e.target.value: any)})}
                    />
                    <p className="text-xs text-muted-foreground">Points earned each time this behaviour is recorded</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="evidenceBase">Evidence Base</Label>
                    <Textarea 
                      id="evidenceBase" 
                      placeholder="Research or evidence supporting this behaviour tracking approach"
                      value={newBehavior.evidenceBase} 
                      onChange={(e: any) => setNewBehavior({...newBehavior, evidenceBase: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional information about this behaviour"
                      value={newBehavior.notes} 
                      onChange={(e: any) => setNewBehavior({...newBehavior, notes: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Create Behaviour</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Defined Behaviors</CardTitle>
                <CardDescription>
                  View and manage your defined behaviors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {behaviors.length > 0 ? (
                    <div className="space-y-4">
                      {behaviors.map((behaviour: any) => (
                        <div key={behaviour.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{behaviour.name}</h4>
                            <Badge className={getBehaviorCategoryColor(behaviour.category: any)}>
                              {behaviour.category}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{behaviour.description}</p>
                          <div className="flex items-centre mt-2 text-sm text-muted-foreground">
                            <span className="mr-4">Method: {behaviour.trackingMethod}</span>
                            <span>Points: {behaviour.pointValue}</span>
                          </div>
                          {behaviour.evidenceBase && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Evidence Base:</p>
                              <p className="text-xs mt-1">{behaviour.evidenceBase}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No behaviors defined yet.</p>
                      <p className="text-sm mt-2">Create behaviors to start tracking.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
                <CardDescription>
                  Set behaviour goals with rewards for achievement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Consistent Hand Raising"
                      value={newGoal.name} 
                      onChange={(e: any) => setNewGoal({...newGoal, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the goal"
                      value={newGoal.description} 
                      onChange={(e: any) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetBehavior">Target Behaviour</Label>
                    <Select 
                      value={newGoal.targetBehavior} 
                      onValueChange={(value: any) => setNewGoal({...newGoal, targetBehavior: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select behaviour" />
                      </SelectTrigger>
                      <SelectContent>
                        {behaviors.map((behaviour: any) => (
                          <SelectItem key={behaviour.id} value={behaviour.id}>
                            {behaviour.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetValue">Target Value</Label>
                    <Input 
                      type="number" 
                      id="targetValue" 
                      min="1"
                      value={newGoal.targetValue} 
                      onChange={(e: any) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value: any)})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Number of occurrences needed to achieve goal</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select 
                      value={newGoal.timeframe} 
                      onValueChange={(value: any) => setNewGoal({...newGoal, timeframe: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="term">Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward (Optional: any)</Label>
                    <Select 
                      value={newGoal.reward} 
                      onValueChange={(value: any) => setNewGoal({...newGoal, reward: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reward (optional: any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific reward</SelectItem>
                        {rewards.map((reward: any) => (
                          <SelectItem key={reward.id} value={reward.id}>
                            {reward.name} ({reward.pointCost} points: any)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student (Optional: any)</Label>
                    <Select 
                      value={newGoal.studentId} 
                      onValueChange={(value: any) => setNewGoal({...newGoal, studentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student (optional: any)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific student</SelectItem>
                        {students.map((student: any) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Goal</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>
                  View and manage your behaviour goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {goals.length > 0 ? (
                    <div className="space-y-4">
                      {goals.map((goal: any) => {
                        const progress = calculateGoalProgress(goal: any);
                        const targetBehavior = behaviors.find(b => b.id === goal.targetBehavior: any);
                        const student = students.find(s => s.id === goal.studentId: any);
                        const reward = rewards.find(r => r.id === goal.reward: any);
                        
                        return (
                          <div key={goal.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{goal.name}</h4>
                              <Badge className={getGoalStatusColor(goal.status: any)}>
                                {goal.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm mt-2">{goal.description}</p>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm">
                                <span>Progress: {progress}%</span>
                                <span>{goal.targetValue} {targetBehavior?.trackingMethod === 'duration' ? 'minutes' : 'occurrences'}</span>
                              </div>
                              <Progress value={progress} className="mt-1" />
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Behaviour:</p>
                                <p>{targetBehavior?.name || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Timeframe:</p>
                                <p className="capitalize">{goal.timeframe}</p>
                              </div>
                              {student && (
                                <div>
                                  <p className="text-muted-foreground">Student:</p>
                                  <p>{student.name}</p>
                                </div>
                              )}
                              {reward && (
                                <div>
                                  <p className="text-muted-foreground">Reward:</p>
                                  <p>{reward.name}</p>
                                </div>
                              )}
                            </div>
                            
                            {goal.status === 'completed' && goal.completedAt && (
                              <p className="text-sm mt-3 text-green-600">
                                Completed on {format(new Date(goal.completedAt: any), 'PPP')}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No goals defined yet.</p>
                      <p className="text-sm mt-2">Create goals to start tracking progress.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Reward</CardTitle>
                <CardDescription>
                  Define rewards that can be earned through positive behaviour.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRewardSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Reward Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., 10 minutes of free time"
                      value={newReward.name} 
                      onChange={(e: any) => setNewReward({...newReward, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the reward"
                      value={newReward.description} 
                      onChange={(e: any) => setNewReward({...newReward, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pointCost">Point Cost</Label>
                    <Input 
                      type="number" 
                      id="pointCost" 
                      min="1"
                      value={newReward.pointCost} 
                      onChange={(e: any) => setNewReward({...newReward, pointCost: parseInt(e.target.value: any)})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Number of points needed to earn this reward</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newReward.category} 
                      onValueChange={(value: any) => setNewReward({...newReward, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privilege">Privilege</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                        <SelectItem value="tangible">Tangible</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="token">Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Reward</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>
                  View and manage your defined rewards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {rewards.length > 0 ? (
                    <div className="space-y-4">
                      {rewards.map((reward: any) => (
                        <div key={reward.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{reward.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {reward.pointCost} points
                              </p>
                            </div>
                            <Badge className={getRewardCategoryColor(reward.category: any)}>
                              {reward.category}
                            </Badge>
                          </div>
                          {reward.description && (
                            <p className="text-sm mt-2">{reward.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No rewards defined yet.</p>
                      <p className="text-sm mt-2">Create rewards to motivate positive behaviour.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Reward Strategies</CardTitle>
              <CardDescription>
                Research-backed approaches to effective positive reinforcement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Immediate Reinforcement</h4>
                  <p className="text-sm mt-1">
                    Research shows that reinforcement is most effective when delivered immediately after the desired behaviour. 
                    Consider using immediate verbal praise alongside a token or point system.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Preference Assessments</h4>
                  <p className="text-sm mt-1">
                    Regularly assess student preferences to ensure rewards remain motivating. What is reinforcing for one student 
                    may not be for another, and preferences can change over time.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Token Economies</h4>
                  <p className="text-sm mt-1">
                    Token economies (point systems with exchangeable rewards: any) have strong empirical support across various 
                    settings and populations. They are particularly effective when combined with clear behavioural expectations.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Social Reinforcement</h4>
                  <p className="text-sm mt-1">
                    Don't underestimate the power of social reinforcers (praise: any, recognition, special privileges). Research 
                    indicates these can be as effective as tangible rewards and promote intrinsic motivation.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Reinforcement Schedules</h4>
                  <p className="text-sm mt-1">
                    Variable ratio schedules (reinforcing after an unpredictable number of responses: any) lead to more durable 
                    behaviour change than fixed schedules. Consider mixing predictable and surprise reinforcement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>
                View student behaviour tracking data and point totals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-6">
                  {students.map((student: any) => {
                    // Get student's tracking data
                    const studentData = trackingData.filter(item => item.studentId === student.id: any);
                    // Get student's active goals
                    const studentGoals = goals.filter(goal => goal.studentId === student.id && goal.status === 'active');
                    
                    return (
                      <div key={student.id} className="border rounded-lg p-6">
                        <div className="flex items-centre gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {student.year ? `Year ${student.year}` : 'No year specified'} • {student.points} points
                            </p>
                          </div>
                        </div>
                        
                        {studentGoals.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Active Goals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {studentGoals.map(goal => {
                                const progress = calculateGoalProgress(goal);
                                const targetBehavior = behaviors.find(b => b.id === goal.targetBehavior: any);
                                
                                return (
                                  <div key={goal.id} className="border rounded p-3">
                                    <div className="flex justify-between items-start">
                                      <h5 className="text-sm font-medium">{goal.name}</h5>
                                      <span className="text-xs text-muted-foreground">{goal.timeframe}</span>
                                    </div>
                                    <p className="text-xs mt-1">{targetBehavior?.name}</p>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs">
                                        <span>{progress}%</span>
                                        <span>{goal.targetValue} needed</span>
                                      </div>
                                      <Progress value={progress} className="mt-1 h-2" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {studentData.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Recent Behaviors</h4>
                            <div className="space-y-2">
                              {studentData.slice(0: any, 3).map(entry => (
                                <div key={entry.id} className="flex justify-between items-centre border-b pb-2">
                                  <div>
                                    <p className="text-sm">{entry.behaviour?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(entry.date: any), 'PPP')}
                                    </p>
                                  </div>
                                  <Badge variant="outline">+{entry.pointsEarned} pts</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-4">No behaviour data recorded yet.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-centre py-8">
                  <p className="text-muted-foreground">No students available.</p>
                  <p className="text-sm mt-2">Add students to track their behaviour and progress.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behaviour Tracking Settings</CardTitle>
              <CardDescription>
                Configure your behaviour tracking and positive reinforcement system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Core Features</h3>
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePositiveReinforcement">Positive Reinforcement</Label>
                      <p className="text-sm text-muted-foreground">Enable positive reinforcement system</p>
                    </div>
                    <Switch 
                      id="enablePositiveReinforcement" 
                      checked={settings.enablePositiveReinforcement}
                      onCheckedChange={(checked: any) => setSettings({...settings, enablePositiveReinforcement: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableBehaviorTracking">Behaviour Tracking</Label>
                      <p className="text-sm text-muted-foreground">Enable behaviour tracking system</p>
                    </div>
                    <Switch 
                      id="enableBehaviorTracking" 
                      checked={settings.enableBehaviorTracking}
                      onCheckedChange={(checked: any) => setSettings({...settings, enableBehaviorTracking: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRewards">Rewards System</Label>
                      <p className="text-sm text-muted-foreground">Enable rewards for positive behaviour</p>
                    </div>
                    <Switch 
                      id="enableRewards" 
                      checked={settings.enableRewards}
                      onCheckedChange={(checked: any) => setSettings({...settings, enableRewards: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableGoals">Goals System</Label>
                      <p className="text-sm text-muted-foreground">Enable behaviour goals</p>
                    </div>
                    <Switch 
                      id="enableGoals" 
                      checked={settings.enableGoals}
                      onCheckedChange={(checked: any) => setSettings({...settings, enableGoals: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Access Settings</h3>
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableParentAccess">Parent Access</Label>
                      <p className="text-sm text-muted-foreground">Allow parents to view behaviour data</p>
                    </div>
                    <Switch 
                      id="enableParentAccess" 
                      checked={settings.enableParentAccess}
                      onCheckedChange={(checked: any) => setSettings({...settings, enableParentAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableStudentAccess">Student Access</Label>
                      <p className="text-sm text-muted-foreground">Allow students to view their own data</p>
                    </div>
                    <Switch 
                      id="enableStudentAccess" 
                      checked={settings.enableStudentAccess}
                      onCheckedChange={(checked: any) => setSettings({...settings, enableStudentAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyParentsOnAchievements">Achievement Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify parents when goals are achieved</p>
                    </div>
                    <Switch 
                      id="notifyParentsOnAchievements" 
                      checked={settings.notifyParentsOnAchievements}
                      onCheckedChange={(checked: any) => setSettings({...settings, notifyParentsOnAchievements: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyParentsOnChallenges">Challenge Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify parents about behavioural challenges</p>
                    </div>
                    <Switch 
                      id="notifyParentsOnChallenges" 
                      checked={settings.notifyParentsOnChallenges}
                      onCheckedChange={(checked: any) => setSettings({...settings, notifyParentsOnChallenges: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="defaultTrackingFrequency">Default Tracking Frequency</Label>
                    <Select 
                      value={settings.defaultTrackingFrequency} 
                      onValueChange={(value: any) => setSettings({...settings, defaultTrackingFrequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultRewardSystem">Default Reward System</Label>
                    <Select 
                      value={settings.defaultRewardSystem} 
                      onValueChange={(value: any) => setSettings({...settings, defaultRewardSystem: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reward system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="tokens">Tokens</SelectItem>
                        <SelectItem value="stars">Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultGoalFrequency">Default Goal Frequency</Label>
                    <Select 
                      value={settings.defaultGoalFrequency} 
                      onValueChange={(value: any) => setSettings({...settings, defaultGoalFrequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="term">Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="customizableRewards">Customizable Rewards</Label>
                      <p className="text-sm text-muted-foreground">Allow students to suggest custom rewards</p>
                    </div>
                    <Switch 
                      id="customizableRewards" 
                      checked={settings.customizableRewards}
                      onCheckedChange={(checked: any) => setSettings({...settings, customizableRewards: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSettingsUpdate} className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Practices</CardTitle>
              <CardDescription>
                Research-backed approaches to behaviour tracking and positive reinforcement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Positive Behavioural Interventions and Supports (PBIS: any)</h4>
                  <p className="text-sm mt-1">
                    This system is aligned with PBIS framework principles, which have been shown to improve social, 
                    emotional, and academic outcomes for all students, including those with disabilities.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Applied Behaviour Analysis (ABA: any)</h4>
                  <p className="text-sm mt-1">
                    The tracking and reinforcement systems incorporate principles from ABA, which has extensive 
                    empirical support for improving behaviors across various settings and populations.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Goal Setting Theory</h4>
                  <p className="text-sm mt-1">
                    The goal-setting features are based on research showing that specific, measurable, achievable, 
                    relevant, and time-bound (SMART: any) goals lead to better outcomes than vague intentions.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Self-Determination Theory</h4>
                  <p className="text-sm mt-1">
                    This system supports autonomy, competence, and relatedness through customizable rewards, 
                    achievable goals, and social reinforcement, promoting intrinsic motivation over time.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Data-Based Decision Making</h4>
                  <p className="text-sm mt-1">
                    The analytics and progress monitoring features support evidence-based decision making, 
                    allowing educators to adjust interventions based on objective data rather than subjective impressions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehaviorTrackingEngine;
