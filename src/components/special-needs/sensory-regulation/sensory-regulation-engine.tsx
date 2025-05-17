'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  Check, 
  Info, 
  Moon, 
  Save, 
  Settings, 
  Sun, 
  Volume2, 
  VolumeX,
  Wind,
  Droplets,
  Lightbulb,
  Vibrate
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

// This component will be the main engine for sensory regulation tools
// It will provide the core functionality that can be used across the platform

export function SensoryRegulationEngine() {
  const { data: session, status } = useSession();
  const [sensorySettings, setSensorySettings] = useState({
    visualStimulation: 50,
    auditoryStimulation: 50,
    tactileStimulation: 50,
    vestibularStimulation: 50,
    proprioceptiveStimulation: 50,
    environmentalControls: true,
    sensoryBreaks: true,
    sensoryProfile: 'balanced',
    alertnessLevel: 'optimal',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Form schema for sensory regulation settings
  const formSchema = z.object({
    visualStimulation: z.number().min(0).max(100).default(50),
    auditoryStimulation: z.number().min(0).max(100).default(50),
    tactileStimulation: z.number().min(0).max(100).default(50),
    vestibularStimulation: z.number().min(0).max(100).default(50),
    proprioceptiveStimulation: z.number().min(0).max(100).default(50),
    environmentalControls: z.boolean().default(true),
    sensoryBreaks: z.boolean().default(true),
    sensoryProfile: z.string().default('balanced'),
    alertnessLevel: z.string().default('optimal'),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sensorySettings,
  });

  // Fetch settings on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSensorySettings();
    }
  }, [status]);

  // Fetch sensory regulation settings
  const fetchSensorySettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        const settings = {
          visualStimulation: 50,
          auditoryStimulation: 50,
          tactileStimulation: 50,
          vestibularStimulation: 50,
          proprioceptiveStimulation: 50,
          environmentalControls: true,
          sensoryBreaks: true,
          sensoryProfile: 'balanced',
          alertnessLevel: 'optimal',
        };
        setSensorySettings(settings);
        form.reset(settings);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching sensory settings:', error);
      toast.error('Failed to load sensory regulation settings');
      setLoading(false);
    }
  };

  // Save sensory regulation settings
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a successful save
      setTimeout(() => {
        setSensorySettings(data);
        toast.success('Sensory regulation settings saved successfully');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error saving sensory settings:', error);
      toast.error('Failed to save sensory regulation settings');
      setLoading(false);
    }
  };

  // Get alertness level description
  const getAlertnessDescription = (level) => {
    switch (level) {
      case 'low':
        return 'Low energy, under-responsive to stimuli';
      case 'optimal':
        return 'Balanced and ready for learning';
      case 'high':
        return 'High energy, over-responsive to stimuli';
      default:
        return 'Balanced and ready for learning';
    }
  };

  // Get sensory profile description
  const getSensoryProfileDescription = (profile) => {
    switch (profile) {
      case 'sensory_seeking':
        return 'Seeks additional sensory input';
      case 'sensory_avoiding':
        return 'Avoids excessive sensory input';
      case 'balanced':
        return 'Balanced sensory processing';
      case 'mixed':
        return 'Mixed sensory processing patterns';
      default:
        return 'Balanced sensory processing';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Vibrate className="mr-2 h-5 w-5" />
          Sensory Regulation Tools
        </CardTitle>
        <CardDescription>
          Personalize sensory input to maintain optimal alertness for learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Sensory Profile</TabsTrigger>
            <TabsTrigger value="controls">Sensory Controls</TabsTrigger>
            <TabsTrigger value="activities">Regulation Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Alertness Level</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={cn(
                    "bg-blue-50",
                    sensorySettings.alertnessLevel === 'low' && "bg-blue-50",
                    sensorySettings.alertnessLevel === 'optimal' && "bg-green-50",
                    sensorySettings.alertnessLevel === 'high' && "bg-orange-50"
                  )}>
                    {sensorySettings.alertnessLevel === 'low' && <Moon className="mr-1 h-3 w-3 text-blue-500" />}
                    {sensorySettings.alertnessLevel === 'optimal' && <Check className="mr-1 h-3 w-3 text-green-500" />}
                    {sensorySettings.alertnessLevel === 'high' && <AlertCircle className="mr-1 h-3 w-3 text-orange-500" />}
                    <span className={cn(
                      "text-blue-700",
                      sensorySettings.alertnessLevel === 'low' && "text-blue-700",
                      sensorySettings.alertnessLevel === 'optimal' && "text-green-700",
                      sensorySettings.alertnessLevel === 'high' && "text-orange-700"
                    )}>
                      {sensorySettings.alertnessLevel.charAt(0).toUpperCase() + sensorySettings.alertnessLevel.slice(1)}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getAlertnessDescription(sensorySettings.alertnessLevel)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sensory Processing Profile</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-50">
                    <Info className="mr-1 h-3 w-3 text-purple-500" />
                    <span className="text-purple-700">
                      {sensorySettings.sensoryProfile.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getSensoryProfileDescription(sensorySettings.sensoryProfile)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sensoryProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sensory Processing Profile</FormLabel>
                        <FormDescription>
                          Select the profile that best describes your sensory processing pattern
                        </FormDescription>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sensory profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sensory_seeking">Sensory Seeking</SelectItem>
                            <SelectItem value="sensory_avoiding">Sensory Avoiding</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alertnessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Alertness Level</FormLabel>
                        <FormDescription>
                          Select your current level of alertness and energy
                        </FormDescription>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alertness level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low (Under-responsive)</SelectItem>
                            <SelectItem value="optimal">Optimal (Just right)</SelectItem>
                            <SelectItem value="high">High (Over-responsive)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="controls" className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="visualStimulation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex items-center">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Visual Stimulation
                          </FormLabel>
                          <span className="text-sm">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            disabled={loading}
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Adjust the level of visual input (brightness, colors, movement)
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="auditoryStimulation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex items-center">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Auditory Stimulation
                          </FormLabel>
                          <span className="text-sm">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            disabled={loading}
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Adjust the level of auditory input (volume, background noise, sound types)
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tactileStimulation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex items-center">
                            <Droplets className="mr-2 h-4 w-4" />
                            Tactile Stimulation
                          </FormLabel>
                          <span className="text-sm">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            disabled={loading}
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Adjust the level of touch input (textures, pressure, temperature)
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vestibularStimulation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex items-center">
                            <Wind className="mr-2 h-4 w-4" />
                            Vestibular Stimulation
                          </FormLabel>
                          <span className="text-sm">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            disabled={loading}
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Adjust the level of movement input (spinning, swinging, balance)
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proprioceptiveStimulation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex items-center">
                            <Vibrate className="mr-2 h-4 w-4" />
                            Proprioceptive Stimulation
                          </FormLabel>
                          <span className="text-sm">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            disabled={loading}
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Adjust the level of body awareness input (pressure, resistance, weight)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="environmentalControls"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Environmental Controls</FormLabel>
                          <FormDescription className="text-xs">
                            Enable controls for lighting, sound, and temperature
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sensoryBreaks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Sensory Breaks</FormLabel>
                          <FormDescription className="text-xs">
                            Enable scheduled sensory regulation breaks
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save Controls
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-blue-700">
                    <Moon className="mr-2 h-4 w-4" />
                    Calming Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">1</Button>
                    <div>
                      <p className="font-medium">Deep Pressure</p>
                      <p className="text-muted-foreground">Apply gentle, firm pressure using weighted items</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">2</Button>
                    <div>
                      <p className="font-medium">Deep Breathing</p>
                      <p className="text-muted-foreground">Practice slow, deep breathing exercises</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">3</Button>
                    <div>
                      <p className="font-medium">Quiet Space</p>
                      <p className="text-muted-foreground">Retreat to a low-stimulation environment</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 text-xs">
                    View All Calming Activities
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-orange-700">
                    <Sun className="mr-2 h-4 w-4" />
                    Alerting Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">1</Button>
                    <div>
                      <p className="font-medium">Movement Breaks</p>
                      <p className="text-muted-foreground">Engage in quick, energizing physical activities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">2</Button>
                    <div>
                      <p className="font-medium">Tactile Stimulation</p>
                      <p className="text-muted-foreground">Use textured materials to increase alertness</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">3</Button>
                    <div>
                      <p className="font-medium">Auditory Input</p>
                      <p className="text-muted-foreground">Listen to upbeat, rhythmic sounds</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-orange-600 text-xs">
                    View All Alerting Activities
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="border-2 border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center text-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Organizing Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">1</Button>
                    <div>
                      <p className="font-medium">Heavy Work</p>
                      <p className="text-muted-foreground">Activities that provide resistance to muscles and joints</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">2</Button>
                    <div>
                      <p className="font-medium">Rhythmic Activities</p>
                      <p className="text-muted-foreground">Engage in predictable, rhythmic movements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">3</Button>
                    <div>
                      <p className="font-medium">Bilateral Coordination</p>
                      <p className="text-muted-foreground">Activities that use both sides of the body</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">4</Button>
                    <div>
                      <p className="font-medium">Crossing Midline</p>
                      <p className="text-muted-foreground">Activities that cross the body's center line</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full text-green-600 text-xs">
                  View All Organizing Activities
                </Button>
              </CardFooter>
            </Card>

            <div className="flex justify-center">
              <Button variant="outline" className="w-full md:w-auto">
                Create Custom Sensory Diet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        <div className="flex items-center">
          <Info className="mr-1 h-3 w-3" />
          <span>Based on evidence from sensory integration theory and occupational therapy practices</span>
        </div>
      </CardFooter>
    </Card>
  );
}
