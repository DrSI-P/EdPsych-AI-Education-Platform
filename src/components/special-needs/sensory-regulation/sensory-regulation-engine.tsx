'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  BarChart, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Brain,
  Eye,
  Ear,
  Hand,
  Activity,
  Compass
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function SensoryRegulationEngine() {
  // State for user settings
  const [settings, setSettings] = useState({
    visualStimulation: 50,
    auditoryStimulation: 50,
    tactileStimulation: 50,
    vestibularStimulation: 50,
    proprioceptiveStimulation: 50,
    environmentalControls: true,
    sensoryBreaks: true,
    sensoryProfile: 'balanced',
    alertnessLevel: 'optimal'
  });

  // State for activities
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category: 'calming',
    sensorySystems: [],
    duration: 5,
    materials: '',
    instructions: '',
    evidenceBase: ''
  });

  // State for sensory diets
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [newDiet, setNewDiet] = useState({
    name: '',
    description: '',
    isActive: false
  });

  // State for diet schedules
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    activityId: '',
    time: '08:00',
    duration: 5,
    notes: ''
  });

  // State for UI
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/special-needs/sensory-regulation/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching sensory settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sensory settings. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/special-needs/sensory-regulation/activities');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error('Error fetching sensory activities:', error);
      }
    };

    const fetchDiets = async () => {
      try {
        const response = await fetch('/api/special-needs/sensory-regulation/diets');
        if (response.ok) {
          const data = await response.json();
          setDiets(data);
          
          // If there's an active diet, select it
          const activeDiet = data.find(diet => diet.isActive);
          if (activeDiet) {
            setSelectedDiet(activeDiet);
            fetchDietSchedules(activeDiet.id);
          }
        }
      } catch (error) {
        console.error('Error fetching sensory diets:', error);
      }
    };

    fetchSettings();
    fetchActivities();
    fetchDiets();
  }, []);

  // Fetch diet schedules
  const fetchDietSchedules = async (dietId) => {
    try {
      const response = await fetch(`/api/special-needs/sensory-regulation/diets/${dietId}/schedules`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching diet schedules:', error);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/special-needs/sensory-regulation/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Sensory regulation settings saved successfully.',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save activity
  const saveActivity = async () => {
    try {
      setLoading(true);
      
      if (!newActivity.name || !newActivity.description || !newActivity.instructions) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive'
        });
        return;
      }
      
      const response = await fetch('/api/special-needs/sensory-regulation/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActivity),
      });

      if (response.ok) {
        const savedActivity = await response.json();
        setActivities([...activities, savedActivity]);
        setNewActivity({
          name: '',
          description: '',
          category: 'calming',
          sensorySystems: [],
          duration: 5,
          materials: '',
          instructions: '',
          evidenceBase: ''
        });
        toast({
          title: 'Success',
          description: 'Sensory activity saved successfully.',
        });
      } else {
        throw new Error('Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to save activity. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save diet
  const saveDiet = async () => {
    try {
      setLoading(true);
      
      if (!newDiet.name) {
        toast({
          title: 'Validation Error',
          description: 'Please provide a name for the sensory diet.',
          variant: 'destructive'
        });
        return;
      }
      
      const response = await fetch('/api/special-needs/sensory-regulation/diets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiet),
      });

      if (response.ok) {
        const savedDiet = await response.json();
        setDiets([...diets, savedDiet]);
        setSelectedDiet(savedDiet);
        setNewDiet({
          name: '',
          description: '',
          isActive: false
        });
        toast({
          title: 'Success',
          description: 'Sensory diet saved successfully.',
        });
      } else {
        throw new Error('Failed to save diet');
      }
    } catch (error) {
      console.error('Error saving diet:', error);
      toast({
        title: 'Error',
        description: 'Failed to save diet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add schedule item
  const addScheduleItem = async () => {
    try {
      setLoading(true);
      
      if (!selectedDiet || !newSchedule.activityId) {
        toast({
          title: 'Validation Error',
          description: 'Please select a diet and activity.',
          variant: 'destructive'
        });
        return;
      }
      
      const scheduleItem = {
        ...newSchedule,
        dietId: selectedDiet.id
      };
      
      const response = await fetch(`/api/special-needs/sensory-regulation/diets/${selectedDiet.id}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleItem),
      });

      if (response.ok) {
        const savedSchedule = await response.json();
        setSchedules([...schedules, savedSchedule]);
        setNewSchedule({
          activityId: '',
          time: '08:00',
          duration: 5,
          notes: ''
        });
        toast({
          title: 'Success',
          description: 'Schedule item added successfully.',
        });
      } else {
        throw new Error('Failed to add schedule item');
      }
    } catch (error) {
      console.error('Error adding schedule item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add schedule item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle sensory system selection
  const toggleSensorySystem = (system) => {
    setNewActivity(prev => {
      const systems = [...prev.sensorySystems];
      if (systems.includes(system)) {
        return {
          ...prev,
          sensorySystems: systems.filter(s => s !== system)
        };
      } else {
        return {
          ...prev,
          sensorySystems: [...systems, system]
        };
      }
    });
  };

  // Get icon for sensory system
  const getSensorySystemIcon = (system) => {
    switch (system) {
      case 'visual':
        return <Eye className="h-4 w-4" />;
      case 'auditory':
        return <Ear className="h-4 w-4" />;
      case 'tactile':
        return <Hand className="h-4 w-4" />;
      case 'vestibular':
        return <Activity className="h-4 w-4" />;
      case 'proprioceptive':
        return <Compass className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  // Get color for activity category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'calming':
        return 'bg-blue-100 text-blue-800';
      case 'alerting':
        return 'bg-red-100 text-red-800';
      case 'organizing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Sensory Profile</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="diets">Sensory Diets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Sensory Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Sensory Regulation Profile
              </CardTitle>
              <CardDescription>
                Customize your sensory preferences to maintain an optimal state for learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="visualStimulation" className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Visual Stimulation
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.visualStimulation}%</span>
                  </div>
                  <Slider
                    id="visualStimulation"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.visualStimulation]}
                    onValueChange={(value) => setSettings({...settings, visualStimulation: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="auditoryStimulation" className="flex items-center">
                      <Ear className="mr-2 h-4 w-4" />
                      Auditory Stimulation
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.auditoryStimulation}%</span>
                  </div>
                  <Slider
                    id="auditoryStimulation"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.auditoryStimulation]}
                    onValueChange={(value) => setSettings({...settings, auditoryStimulation: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="tactileStimulation" className="flex items-center">
                      <Hand className="mr-2 h-4 w-4" />
                      Tactile Stimulation
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.tactileStimulation}%</span>
                  </div>
                  <Slider
                    id="tactileStimulation"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.tactileStimulation]}
                    onValueChange={(value) => setSettings({...settings, tactileStimulation: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="vestibularStimulation" className="flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      Vestibular Stimulation (Movement)
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.vestibularStimulation}%</span>
                  </div>
                  <Slider
                    id="vestibularStimulation"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.vestibularStimulation]}
                    onValueChange={(value) => setSettings({...settings, vestibularStimulation: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="proprioceptiveStimulation" className="flex items-center">
                      <Compass className="mr-2 h-4 w-4" />
                      Proprioceptive Stimulation (Body Awareness)
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.proprioceptiveStimulation}%</span>
                  </div>
                  <Slider
                    id="proprioceptiveStimulation"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.proprioceptiveStimulation]}
                    onValueChange={(value) => setSettings({...settings, proprioceptiveStimulation: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sensoryProfile">Sensory Profile</Label>
                  <Select
                    value={settings.sensoryProfile}
                    onValueChange={(value) => setSettings({...settings, sensoryProfile: value})}
                  >
                    <SelectTrigger id="sensoryProfile">
                      <SelectValue placeholder="Select a sensory profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sensory_seeking">Sensory Seeking</SelectItem>
                      <SelectItem value="sensory_avoiding">Sensory Avoiding</SelectItem>
                      <SelectItem value="sensory_sensitive">Sensory Sensitive</SelectItem>
                      <SelectItem value="low_registration">Low Registration</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertnessLevel">Optimal Alertness Level</Label>
                  <Select
                    value={settings.alertnessLevel}
                    onValueChange={(value) => setSettings({...settings, alertnessLevel: value})}
                  >
                    <SelectTrigger id="alertnessLevel">
                      <SelectValue placeholder="Select alertness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Alertness</SelectItem>
                      <SelectItem value="optimal">Optimal Alertness</SelectItem>
                      <SelectItem value="high">High Alertness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="environmentalControls">Environmental Controls</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable adjustments to lighting, sound, and other environmental factors
                    </p>
                  </div>
                  <Switch
                    id="environmentalControls"
                    checked={settings.environmentalControls}
                    onCheckedChange={(checked) => setSettings({...settings, environmentalControls: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sensoryBreaks">Sensory Breaks</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable scheduled sensory breaks during learning activities
                    </p>
                  </div>
                  <Switch
                    id="sensoryBreaks"
                    checked={settings.sensoryBreaks}
                    onCheckedChange={(checked) => setSettings({...settings, sensoryBreaks: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading}>
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensory Activities</CardTitle>
              <CardDescription>
                Create and manage sensory activities for different sensory needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{activity.name}</CardTitle>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge className={getCategoryColor(activity.category)}>
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.duration} min
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activity.sensorySystems.map((system) => (
                          <Badge key={system} variant="secondary" className="flex items-center">
                            {getSensorySystemIcon(system)}
                            <span className="ml-1">{system.charAt(0).toUpperCase() + system.slice(1)}</span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => setSelectedActivity(activity)}>
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New Activity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityName">Activity Name</Label>
                    <Input
                      id="activityName"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      placeholder="e.g., Deep Pressure Squeezes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityCategory">Category</Label>
                    <Select
                      value={newActivity.category}
                      onValueChange={(value) => setNewActivity({...newActivity, category: value})}
                    >
                      <SelectTrigger id="activityCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calming">Calming</SelectItem>
                        <SelectItem value="alerting">Alerting</SelectItem>
                        <SelectItem value="organizing">Organizing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityDescription">Description</Label>
                  <Textarea
                    id="activityDescription"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    placeholder="Describe the activity and its benefits"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sensory Systems</Label>
                  <div className="flex flex-wrap gap-2">
                    {['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive'].map((system) => (
                      <Badge
                        key={system}
                        variant={newActivity.sensorySystems.includes(system) ? "default" : "outline"}
                        className="cursor-pointer flex items-center"
                        onClick={() => toggleSensorySystem(system)}
                      >
                        {getSensorySystemIcon(system)}
                        <span className="ml-1">{system.charAt(0).toUpperCase() + system.slice(1)}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityDuration">Duration (minutes)</Label>
                    <Input
                      id="activityDuration"
                      type="number"
                      min={1}
                      max={60}
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value) || 5})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityMaterials">Materials Needed</Label>
                    <Input
                      id="activityMaterials"
                      value={newActivity.materials}
                      onChange={(e) => setNewActivity({...newActivity, materials: e.target.value})}
                      placeholder="e.g., Therapy ball, weighted blanket"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityInstructions">Instructions</Label>
                  <Textarea
                    id="activityInstructions"
                    value={newActivity.instructions}
                    onChange={(e) => setNewActivity({...newActivity, instructions: e.target.value})}
                    placeholder="Step-by-step instructions for the activity"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityEvidenceBase">Evidence Base (Optional)</Label>
                  <Textarea
                    id="activityEvidenceBase"
                    value={newActivity.evidenceBase}
                    onChange={(e) => setNewActivity({...newActivity, evidenceBase: e.target.value})}
                    placeholder="Research or evidence supporting this activity"
                    rows={2}
                  />
                </div>

                <Button onClick={saveActivity} disabled={loading} className="w-full">
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sensory Diets Tab */}
        <TabsContent value="diets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensory Diets</CardTitle>
              <CardDescription>
                Create and manage scheduled sensory activities throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {diets.map((diet) => (
                  <Card 
                    key={diet.id} 
                    className={`overflow-hidden cursor-pointer ${selectedDiet?.id === diet.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setSelectedDiet(diet);
                      fetchDietSchedules(diet.id);
                    }}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        {diet.name}
                        {diet.isActive && (
                          <Badge variant="default" className="ml-2">Active</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {diet.description || 'No description provided'}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {selectedDiet && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Schedule for {selectedDiet.name}</h3>
                      <Badge variant={selectedDiet.isActive ? "default" : "outline"}>
                        {selectedDiet.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {schedules.length > 0 ? (
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="divide-x divide-border">
                                <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Activity</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Duration</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {schedules.map((schedule) => {
                                const activity = activities.find(a => a.id === schedule.activityId);
                                return (
                                  <tr key={schedule.id} className="divide-x divide-border">
                                    <td className="px-4 py-3 text-sm">{schedule.time}</td>
                                    <td className="px-4 py-3 text-sm">
                                      {activity ? (
                                        <div className="flex flex-col">
                                          <span>{activity.name}</span>
                                          <Badge className={`mt-1 w-fit ${getCategoryColor(activity.category)}`}>
                                            {activity.category}
                                          </Badge>
                                        </div>
                                      ) : 'Unknown Activity'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{schedule.duration} min</td>
                                    <td className="px-4 py-3 text-sm">{schedule.notes || '-'}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center p-4 border rounded-md">
                          <p className="text-muted-foreground">No scheduled activities yet.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Add Activity to Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduleTime">Time</Label>
                          <Input
                            id="scheduleTime"
                            type="time"
                            value={newSchedule.time}
                            onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="scheduleActivity">Activity</Label>
                          <Select
                            value={newSchedule.activityId}
                            onValueChange={(value) => setNewSchedule({...newSchedule, activityId: value})}
                          >
                            <SelectTrigger id="scheduleActivity">
                              <SelectValue placeholder="Select activity" />
                            </SelectTrigger>
                            <SelectContent>
                              {activities.map((activity) => (
                                <SelectItem key={activity.id} value={activity.id}>
                                  {activity.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="scheduleDuration">Duration (min)</Label>
                          <Input
                            id="scheduleDuration"
                            type="number"
                            min={1}
                            max={60}
                            value={newSchedule.duration}
                            onChange={(e) => setNewSchedule({...newSchedule, duration: parseInt(e.target.value) || 5})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="scheduleNotes">Notes (Optional)</Label>
                          <Input
                            id="scheduleNotes"
                            value={newSchedule.notes}
                            onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                            placeholder="Any special instructions"
                          />
                        </div>
                      </div>
                      
                      <Button onClick={addScheduleItem} disabled={loading || !newSchedule.activityId}>
                        {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add to Schedule
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New Sensory Diet</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dietName">Diet Name</Label>
                    <Input
                      id="dietName"
                      value={newDiet.name}
                      onChange={(e) => setNewDiet({...newDiet, name: e.target.value})}
                      placeholder="e.g., School Day Routine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietDescription">Description (Optional)</Label>
                    <Input
                      id="dietDescription"
                      value={newDiet.description}
                      onChange={(e) => setNewDiet({...newDiet, description: e.target.value})}
                      placeholder="Brief description of this sensory diet"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dietActive"
                    checked={newDiet.isActive}
                    onCheckedChange={(checked) => setNewDiet({...newDiet, isActive: !!checked})}
                  />
                  <Label htmlFor="dietActive">Set as active diet</Label>
                </div>

                <Button onClick={saveDiet} disabled={loading || !newDiet.name}>
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Sensory Diet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Sensory Regulation Analytics
              </CardTitle>
              <CardDescription>
                Track and analyze sensory regulation patterns and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Detailed analytics for sensory regulation will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
