'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Check, RefreshCw, FileText, AlertTriangle, Info, Target, BookOpen, Clock } from "lucide-react";
import { useSession } from 'next-auth/react';

interface PersonalizedInterventionsProps {
  onSettingsChange?: (settings: InterventionSettings) => void;
  className?: string;
}

interface InterventionSettings {
  enabled: boolean;
  learningProfile: string;
  interventionLevel: 'light' | 'moderate' | 'intensive';
  targetAreas: string[];
  customStrategies: string;
  progressTracking: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  parentTeacherUpdates: boolean;
}

interface LearningProfile {
  id: string;
  name: string;
  description: string;
  recommendedInterventions: string[];
}

export default function PersonalizedInterventionsEngine({
  onSettingsChange,
  className = '',
}: PersonalizedInterventionsProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // Learning profiles data
  const learningProfiles: LearningProfile[] = [
    {
      id: 'dyslexia',
      name: 'Dyslexia Support',
      description: 'Interventions for students with reading and language processing difficulties',
      recommendedInterventions: [
        'Phonological awareness training',
        'Structured literacy approach',
        'Text-to-speech technology',
        'Multisensory learning techniques',
        'Reading fluency practise'
      ]
    },
    {
      id: 'dyscalculia',
      name: 'Dyscalculia Support',
      description: 'Interventions for students with mathematical learning difficulties',
      recommendedInterventions: [
        'Concrete-representational-abstract approach',
        'Number sense development',
        'Visual supports for math concepts',
        'Memory aids for math facts',
        'Real-world math applications'
      ]
    },
    {
      id: 'adhd',
      name: 'ADHD Support',
      description: 'Interventions for students with attention and executive function challenges',
      recommendedInterventions: [
        'Task breakdown and organisation',
        'Time management strategies',
        'Self-monitoring techniques',
        'Movement breaks and fidget tools',
        'Environmental modifications'
      ]
    },
    {
      id: 'asd',
      name: 'Autism Spectrum Support',
      description: 'Interventions for students with social communication and sensory processing differences',
      recommendedInterventions: [
        'Visual schedules and supports',
        'Social stories and scripts',
        'Sensory accommodations',
        'Clear, concrete instructions',
        'Emotional regulation strategies'
      ]
    },
    {
      id: 'ell',
      name: 'English Language Learners',
      description: 'Interventions for students developing English language proficiency',
      recommendedInterventions: [
        'Vocabulary development',
        'Visual supports for concepts',
        'First language connections',
        'Sentence frames and starters',
        'Comprehensible input techniques'
      ]
    },
    {
      id: 'gifted',
      name: 'Gifted and Talented',
      description: 'Interventions for students requiring additional challenge and enrichment',
      recommendedInterventions: [
        'Curriculum compacting',
        'Independent research projects',
        'Higher-order thinking activities',
        'Mentorship opportunities',
        'Advanced content exploration'
      ]
    },
    {
      id: 'custom',
      name: 'Custom Profile',
      description: 'Create a personalized intervention profile for unique learning needs',
      recommendedInterventions: [
        'Customizable intervention strategies',
        'Flexible implementation options',
        'Personalized goal setting',
        'Individualized progress monitoring',
        'Tailored support resources'
      ]
    }
  ];
  
  // Target areas data
  const targetAreas = [
    { id: 'reading', name: 'Reading' },
    { id: 'writing', name: 'Writing' },
    { id: 'math', name: 'Mathematics' },
    { id: 'executive', name: 'Executive Function' },
    { id: 'social', name: 'Social Skills' },
    { id: 'emotional', name: 'Emotional Regulation' },
    { id: 'attention', name: 'Attention' },
    { id: 'memory', name: 'Memory' },
    { id: 'language', name: 'Language' },
    { id: 'motor', name: 'Motor Skills' }
  ];
  
  // State for intervention settings
  const [settings, setSettings] = useState<InterventionSettings>({
    enabled: false,
    learningProfile: '',
    interventionLevel: 'moderate',
    targetAreas: [],
    customStrategies: '',
    progressTracking: true,
    reminderFrequency: 'weekly',
    parentTeacherUpdates: true
  });
  
  const [isApplied, setIsApplied] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<LearningProfile | null>(null);
  
  // Update selected profile when learning profile changes
  useEffect(() => {
    const profile = learningProfiles.find(p => p.id === settings.learningProfile);
    setSelectedProfile(profile || null);
  }, [settings.learningProfile]);
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      fetch('/api/special-needs/personalized-interventions')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            // Update local settings from user preferences if available
            const userSettings = data.settings;
            setSettings(prev => ({
              ...prev,
              enabled: userSettings.enabled || false,
              learningProfile: userSettings.learningProfile || '',
              interventionLevel: userSettings.interventionLevel || 'moderate',
              targetAreas: userSettings.targetAreas || [],
              customStrategies: userSettings.customStrategies || '',
              progressTracking: userSettings.progressTracking !== undefined ? userSettings.progressTracking : true,
              reminderFrequency: userSettings.reminderFrequency || 'weekly',
              parentTeacherUpdates: userSettings.parentTeacherUpdates !== undefined ? userSettings.parentTeacherUpdates : true
            }));
            
            // If interventions were already enabled, mark as applied
            if (userSettings.enabled) {
              setIsApplied(true);
            }
          }
        })
        .catch(error => {
          console.error('Error loading intervention settings:', error);
        });
    }
  }, [session]);
  
  // Handle settings change
  const handleSettingsChange = (key: keyof InterventionSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Call the callback if provided
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
      
      return newSettings;
    });
  };
  
  // Handle target area toggle
  const handleTargetAreaToggle = (areaId: string) => {
    setSettings(prev => {
      const isSelected = prev.targetAreas.includes(areaId);
      let newTargetAreas;
      
      if (isSelected) {
        newTargetAreas = prev.targetAreas.filter(id => id !== areaId);
      } else {
        newTargetAreas = [...prev.targetAreas, areaId];
      }
      
      const newSettings = { ...prev, targetAreas: newTargetAreas };
      
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
      fetch('/api/special-needs/personalized-interventions', {
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
              title: "Intervention plan saved",
              description: "Your personalized intervention plan has been saved to your profile.",
            });
          } else {
            throw new Error(data.error || 'Failed to save settings');
          }
        })
        .catch(error => {
          console.error('Error saving intervention settings:', error);
          toast({
            title: "Error saving plan",
            description: "Your intervention plan could not be saved to your profile.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Intervention plan created",
        description: "Sign in to save this personalized intervention plan to your profile.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: InterventionSettings = {
      enabled: false,
      learningProfile: '',
      interventionLevel: 'moderate',
      targetAreas: [],
      customStrategies: '',
      progressTracking: true,
      reminderFrequency: 'weekly',
      parentTeacherUpdates: true
    };
    
    setSettings(defaultSettings);
    setIsApplied(false);
    
    toast({
      title: "Settings reset",
      description: "Personalized intervention settings have been reset to defaults.",
    });
    
    // Save reset settings to user profile if logged in
    if (session?.user) {
      fetch('/api/special-needs/personalized-interventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: defaultSettings
        }),
      }).catch(error => {
        console.error('Error resetting intervention settings:', error);
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            <Sparkles className="h-5 w-5" />
            Personalized Interventions
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Create tailored support strategies for diverse learning needs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Learning Profile</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="learning-profile">Select Learning Profile</Label>
                <Select
                  value={settings.learningProfile}
                  onValueChange={(value) => handleSettingsChange('learningProfile', value)}
                >
                  <SelectTrigger id="learning-profile">
                    <SelectValue placeholder="Select a learning profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProfile && (
                <div className="p-4 bg-muted rounded-md space-y-3">
                  <h4 className="font-medium">{selectedProfile.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedProfile.description}</p>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Recommended Interventions:</h5>
                    <ul className="text-sm space-y-1">
                      {selectedProfile.recommendedInterventions.map((intervention, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>{intervention}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Intervention Level</Label>
                <RadioGroup 
                  value={settings.interventionLevel}
                  onValueChange={(value: 'light' | 'moderate' | 'intensive') => 
                    handleSettingsChange('interventionLevel', value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="intensive" id="intensive" />
                    <Label htmlFor="intensive">Intensive</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Determines the frequency and depth of intervention strategies
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Target Areas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {targetAreas.map((area) => (
                    <div key={area.id} className="flex items-centre space-x-2">
                      <Switch 
                        checked={settings.targetAreas.includes(area.id)}
                        onCheckedChange={() => handleTargetAreaToggle(area.id)}
                        id={`area-${area.id}`}
                      />
                      <Label htmlFor={`area-${area.id}`}>{area.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-6 pt-4">
            <div className="space-y-4">
              {selectedProfile && (
                <div className="space-y-2">
                  <Label>Recommended Strategies</Label>
                  <div className="p-4 bg-muted rounded-md space-y-3">
                    <ul className="text-sm space-y-3">
                      {selectedProfile.recommendedInterventions.map((intervention, index) => (
                        <li key={index} className="space-y-1">
                          <div className="font-medium">{intervention}</div>
                          <p className="text-xs text-muted-foreground">
                            {getInterventionDescription(selectedProfile.id, index)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="custom-strategies">Custom Intervention Strategies</Label>
                <Textarea 
                  id="custom-strategies"
                  placeholder="Add your own intervention strategies or notes..."
                  value={settings.customStrategies}
                  onChange={(e) => handleSettingsChange('customStrategies', e.target.value)}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Add specific strategies, accommodations, or notes for this learning profile
                </p>
              </div>
              
              <Alert variant="info" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Evidence-Based Approach</AlertTitle>
                <AlertDescription>
                  All recommended interventions are based on peer-reviewed research and best practices in special education. Strategies should be implemented consistently and progress monitored regularly.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="progress-tracking">Progress Tracking</Label>
                  <p className="text-xs text-muted-foreground">
                    Monitor intervention effectiveness over time
                  </p>
                </div>
                <Switch 
                  id="progress-tracking"
                  checked={settings.progressTracking}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('progressTracking', checked)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Reminder Frequency</Label>
                <RadioGroup 
                  value={settings.reminderFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    handleSettingsChange('reminderFrequency', value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  How often to receive reminders about intervention implementation
                </p>
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="parent-teacher-updates">Parent/Teacher Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Send progress reports to parents and teachers
                  </p>
                </div>
                <Switch 
                  id="parent-teacher-updates"
                  checked={settings.parentTeacherUpdates}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('parentTeacherUpdates', checked)
                  }
                />
              </div>
              
              {settings.progressTracking && (
                <div className="p-4 bg-muted rounded-md space-y-3">
                  <h4 className="font-medium flex items-centre gap-2">
                    <Target className="h-4 w-4" />
                    Progress Monitoring Tools
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between text-sm">
                      <span>Goal Setting</span>
                      <span className="text-green-500">Available</span>
                    </div>
                    <div className="flex items-centre justify-between text-sm">
                      <span>Data Collection</span>
                      <span className="text-green-500">Available</span>
                    </div>
                    <div className="flex items-centre justify-between text-sm">
                      <span>Progress Visualisation</span>
                      <span className="text-green-500">Available</span>
                    </div>
                    <div className="flex items-centre justify-between text-sm">
                      <span>Intervention Effectiveness Analysis</span>
                      <span className="text-green-500">Available</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Access these tools from the Progress Monitoring dashboard after setting up your intervention plan.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex items-centre gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button 
          onClick={handleApplySettings}
          className="flex items-centre gap-2"
          disabled={!settings.learningProfile || settings.targetAreas.length === 0}
        >
          <Check className="h-4 w-4" />
          {isApplied ? "Update Plan" : "Create Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to get intervention descriptions
function getInterventionDescription(profileId: string, index: number): string {
  const descriptions: Record<string, string[]> = {
    'dyslexia': [
      'Systematic instruction in phonemic awareness, phonics, and word recognition skills.',
      'Explicit, systematic teaching of reading skills with multisensory components.',
      'Using software that converts text to speech to support reading comprehension.',
      'Incorporating visual, auditory, kinesthetic, and tactile elements in learning activities.',
      'Regular practise with decodable texts to build reading speed and accuracy.'
    ],
    'dyscalculia': [
      'Teaching math concepts using physical objects before moving to pictures and then abstract symbols.',
      'Activities that develop understanding of quantity, number relationships, and estimation.',
      'Using diagrams, charts, and manipulatives to represent mathematical concepts.',
      'Strategies like mnemonics and regular practise to help recall math facts.',
      'Connecting math concepts to everyday situations and practical applications.'
    ],
    'adhd': [
      'Breaking assignments into smaller, manageable parts with clear deadlines.',
      'Using timers, planners, and visual schedules to manage time effectively.',
      'Teaching students to monitor their own attention and work completion.',
      'Providing appropriate outlets for physical energy and sensory input needs.',
      'Reducing distractions and optimising the learning environment.'
    ],
    'asd': [
      'Using pictures, icons, or written words to show daily activities and transitions.',
      'Short narratives that describe social situations and appropriate responses.',
      'Adjusting the environment to address sensory sensitivities or needs.',
      'Providing step-by-step instructions without idioms or figurative language.',
      'Teaching techniques to identify and manage emotions effectively.'
    ],
    'ell': [
      'Explicit teaching of key academic vocabulary with visual supports.',
      'Using pictures, diagrams, and realia to support understanding of concepts.',
      'Making connections between new learning and concepts in the student\'s first language.',
      'Providing language structures to help students formulate responses.',
      'Making language input understandable through context, visuals, and simplified language.'
    ],
    'gifted': [
      'Eliminating content students have already mastered and accelerating the curriculum.',
      'Self-directed investigations on topics of personal interest.',
      'Activities that emphasize analysis, evaluation, and creation of new ideas.',
      'Connecting students with experts in their areas of interest.',
      'Providing access to advanced content beyond grade-level expectations.'
    ],
    'custom': [
      'Develop intervention strategies tailored to specific learning needs and strengths.',
      'Adapt implementation based on student response and environmental factors.',
      'Set specific, measurable, achievable, relevant, and time-bound (SMART) goals.',
      'Track progress using appropriate assessment tools and adjust as needed.',
      'Access specialised resources and materials to support unique learning needs.'
    ]
  };
  
  return descriptions[profileId]?.[index] || 'Personalized intervention strategy based on individual needs.';
}
