'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Heart,
  Brain,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  Share2,
  MessageSquare,
  Video,
  Mic,
  Volume2,
  Eye,
  EyeOff,
  Ear,
  Hand,
  Zap,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Star,
  Settings,
  HelpCircle,
  Bell,
  User,
  UserCheck,
  UserPlus,
  ClipboardCheck,
  ClipboardList,
  Clipboard,
  FileCheck,
  FilePlus,
  FolderOpen,
  Lightbulb,
  Palette,
  Accessibility,
  HeartHandshake,
  Puzzle,
  Sparkles,
  Infinity,
  Headphones,
  Glasses,
  Navigation,
  Map,
  Compass,
  Timer,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Type,
  Languages,
  Megaphone,
  BrainCircuit,
  Stethoscope,
  ActivitySquare,
  GraduationCap,
  School,
  Home,
  Building,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Smile,
  Frown,
  Meh,
  Laugh,
  ThumbsUp,
  ThumbsDown,
  HandMetal,
  Crosshair,
  Move,
  MousePointer,
  Gamepad2,
  Dices,
  Trophy,
  Medal,
  Flag,
  Mountain,
  TreePine,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Wind,
  Snowflake,
  Flower,
  Leaf,
  Bug,
  Bird,
  Fish,
  Cat,
  Dog,
  Rabbit,
  Turtle
} from 'lucide-react';

interface SpecialNeedsProps {
  className?: string;
}

export function SpecialNeeds({ className = '' }: SpecialNeedsProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  // Special needs data
  const [specialNeedsData, setSpecialNeedsData] = useState({
    profile: {
      studentName: session?.user?.name || 'Student',
      email: session?.user?.email || '',
      diagnoses: ['Autism Spectrum Disorder', 'ADHD', 'Dyslexia'],
      supportLevel: 'Moderate',
      iepStatus: 'Active',
      lastReview: '2025-05-15',
      nextReview: '2025-11-15',
      keyWorker: 'Ms. Sarah Thompson',
      accommodations: [
        'Extra time for assessments',
        'Quiet space for work',
        'Visual schedules',
        'Movement breaks',
        'Assistive technology'
      ]
    },
    stats: {
      goalsAchieved: 12,
      goalsInProgress: 5,
      supportHours: 156,
      therapySessions: 48,
      progressScore: 78,
      engagementLevel: 85,
      confidenceGrowth: 23,
      socialInteractions: 145,
      sensoryIncidents: 3,
      communicationImprovement: 67
    },
    goals: [
      {
        id: '1',
        title: 'Improve Social Communication',
        category: 'Social Skills',
        description: 'Initiate and maintain conversations with peers',
        progress: 65,
        status: 'In Progress',
        dueDate: '2025-07-30',
        strategies: ['Role-play scenarios', 'Social stories', 'Peer mentoring']
      },
      {
        id: '2',
        title: 'Develop Executive Function Skills',
        category: 'Academic',
        description: 'Organize tasks and manage time effectively',
        progress: 45,
        status: 'In Progress',
        dueDate: '2025-08-15',
        strategies: ['Visual planners', 'Task breakdown', 'Timer use']
      },
      {
        id: '3',
        title: 'Sensory Regulation',
        category: 'Sensory',
        description: 'Identify and use coping strategies for sensory overload',
        progress: 80,
        status: 'On Track',
        dueDate: '2025-06-30',
        strategies: ['Sensory toolkit', 'Break cards', 'Quiet zones']
      }
    ],
    therapies: [
      {
        id: '1',
        type: 'Speech & Language Therapy',
        therapist: 'Dr. Emma Wilson',
        frequency: 'Weekly',
        nextSession: '2025-06-18',
        focus: 'Pragmatic language skills',
        progress: 'Good'
      },
      {
        id: '2',
        type: 'Occupational Therapy',
        therapist: 'Mr. James Chen',
        frequency: 'Bi-weekly',
        nextSession: '2025-06-20',
        focus: 'Fine motor skills and sensory integration',
        progress: 'Excellent'
      },
      {
        id: '3',
        type: 'Behavioral Support',
        therapist: 'Ms. Lisa Brown',
        frequency: 'Weekly',
        nextSession: '2025-06-17',
        focus: 'Emotional regulation strategies',
        progress: 'Steady'
      }
    ],
    tools: [
      {
        id: '1',
        name: 'Visual Schedule Builder',
        description: 'Create customized daily schedules',
        icon: Calendar,
        usage: 'Daily',
        effectiveness: 92
      },
      {
        id: '2',
        name: 'Sensory Toolkit',
        description: 'Digital sensory regulation tools',
        icon: Heart,
        usage: 'As needed',
        effectiveness: 88
      },
      {
        id: '3',
        name: 'Communication Board',
        description: 'AAC support for non-verbal moments',
        icon: MessageSquare,
        usage: 'Occasional',
        effectiveness: 95
      },
      {
        id: '4',
        name: 'Focus Timer',
        description: 'Pomodoro-style work sessions',
        icon: Timer,
        usage: 'Daily',
        effectiveness: 85
      }
    ],
    accommodations: {
      classroom: [
        { name: 'Preferential seating', enabled: true },
        { name: 'Movement breaks every 30 minutes', enabled: true },
        { name: 'Fidget tools available', enabled: true },
        { name: 'Noise-canceling headphones', enabled: true },
        { name: 'Visual cues for transitions', enabled: true }
      ],
      assessment: [
        { name: '50% extra time', enabled: true },
        { name: 'Separate quiet room', enabled: true },
        { name: 'Reader support', enabled: false },
        { name: 'Scribe support', enabled: false },
        { name: 'Assistive technology', enabled: true }
      ],
      technology: [
        { name: 'Text-to-speech software', enabled: true },
        { name: 'Speech-to-text software', enabled: true },
        { name: 'Mind mapping tools', enabled: true },
        { name: 'Calculator use', enabled: true },
        { name: 'Spell checker', enabled: true }
      ]
    },
    sensoryProfile: {
      visual: { sensitivity: 7, strategies: ['Dimmed lights', 'Reduced clutter'] },
      auditory: { sensitivity: 9, strategies: ['Noise-canceling headphones', 'Quiet spaces'] },
      tactile: { sensitivity: 6, strategies: ['Soft fabrics', 'Fidget tools'] },
      vestibular: { sensitivity: 5, strategies: ['Movement breaks', 'Balance activities'] },
      proprioceptive: { sensitivity: 4, strategies: ['Heavy work', 'Compression vest'] }
    }
  });

  // Features for special needs support
  const specialNeedsFeatures = [
    {
      title: 'Personalized Learning',
      description: 'Adaptive content based on individual needs',
      icon: Brain,
      href: '/special-needs/learning',
      color: 'bg-purple-500',
      features: ['Custom pace', 'Multi-sensory content', 'Repetition options', 'Visual supports']
    },
    {
      title: 'Sensory Tools',
      description: 'Digital sensory regulation toolkit',
      icon: Heart,
      href: '/special-needs/sensory',
      color: 'bg-pink-500',
      features: ['Calming visuals', 'White noise', 'Breathing exercises', 'Sensory breaks']
    },
    {
      title: 'Communication Support',
      description: 'AAC and communication aids',
      icon: MessageSquare,
      href: '/special-needs/communication',
      color: 'bg-blue-500',
      features: ['Symbol boards', 'Text-to-speech', 'Social stories', 'Visual schedules']
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor goals and achievements',
      icon: TrendingUp,
      href: '/special-needs/progress',
      color: 'bg-green-500',
      features: ['IEP goals', 'Daily tracking', 'Visual reports', 'Celebration system']
    },
    {
      title: 'Therapy Resources',
      description: 'Support materials and exercises',
      icon: Stethoscope,
      href: '/special-needs/therapy',
      color: 'bg-orange-500',
      features: ['Speech exercises', 'OT activities', 'Social skills', 'Homework help']
    },
    {
      title: 'Parent Portal',
      description: 'Family collaboration tools',
      icon: Home,
      href: '/special-needs/family',
      color: 'bg-indigo-500',
      features: ['Daily reports', 'Home strategies', 'Resource library', 'Support network']
    }
  ];

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Helper functions
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-blue-600 bg-blue-100';
    if (progress >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSensitivityColor = (level: number) => {
    if (level >= 8) return 'bg-red-500';
    if (level >= 6) return 'bg-orange-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading special needs support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 px-4 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Accessibility className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Special Needs Support</h1>
              <p className="text-lg text-muted-foreground">
                Personalized learning and support for {specialNeedsData.profile.studentName}
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            </Button>
            <Button variant="outline" size="sm">
              <HeartHandshake className="h-4 w-4 mr-1" />
              Emergency Support
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Support Status */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>IEP Status:</strong> {specialNeedsData.profile.iepStatus} • 
            <strong> Support Level:</strong> {specialNeedsData.profile.supportLevel} • 
            <strong> Key Worker:</strong> {specialNeedsData.profile.keyWorker} • 
            <strong> Next Review:</strong> {new Date(specialNeedsData.profile.nextReview).toLocaleDateString()}
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{specialNeedsData.stats.goalsAchieved}</div>
                <p className="text-xs text-muted-foreground">Goals Achieved</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{specialNeedsData.stats.goalsInProgress}</div>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{specialNeedsData.stats.supportHours}</div>
                <p className="text-xs text-muted-foreground">Support Hours</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{specialNeedsData.stats.therapySessions}</div>
                <p className="text-xs text-muted-foreground">Therapy Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{specialNeedsData.stats.progressScore}%</div>
                <p className="text-xs text-muted-foreground">Progress Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{specialNeedsData.stats.engagementLevel}%</div>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">+{specialNeedsData.stats.confidenceGrowth}%</div>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{specialNeedsData.stats.socialInteractions}</div>
                <p className="text-xs text-muted-foreground">Social Interactions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{specialNeedsData.stats.sensoryIncidents}</div>
                <p className="text-xs text-muted-foreground">Sensory Events</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{specialNeedsData.stats.communicationImprovement}%</div>
                <p className="text-xs text-muted-foreground">Communication</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="therapies">Therapies</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="sensory">Sensory</TabsTrigger>
          <TabsTrigger value="accommodations">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Focus */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>
                    Visual schedule with support breaks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Morning Learning</p>
                          <p className="text-sm text-muted-foreground">Math with visual supports</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Brain className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Speech Therapy</p>
                          <p className="text-sm text-muted-foreground">With Dr. Wilson at 11:00</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Heart className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium">Sensory Break</p>
                          <p className="text-sm text-muted-foreground">15 minutes quiet time</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Scheduled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Schedule
                  </Button>
                </CardFooter>
              </Card>

              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Current Goals
                  </CardTitle>
                  <CardDescription>
                    IEP goals and progress tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specialNeedsData.goals.map((goal) => (
                      <div key={goal.id} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{goal.title}</p>
                            <p className="text-sm text-muted-foreground">{goal.category}</p>
                          </div>
                          <Badge className={getProgressColor(goal.progress)} variant="secondary">
                            {goal.status}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Timer className="h-4 w-4 mr-1" />
                      Focus Timer
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Heart className="h-4 w-4 mr-1" />
                      Calm Space
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      AAC Board
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Headphones className="h-4 w-4 mr-1" />
                      White Noise
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mood Check-in */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smile className="h-5 w-5 mr-2 text-primary" />
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    <Button variant="outline" size="lg" className="p-2">
                      <Laugh className="h-6 w-6 text-green-500" />
                    </Button>
                    <Button variant="outline" size="lg" className="p-2">
                      <Smile className="h-6 w-6 text-blue-500" />
                    </Button>
                    <Button variant="outline" size="lg" className="p-2">
                      <Meh className="h-6 w-6 text-yellow-500" />
                    </Button>
                    <Button variant="outline" size="lg" className="p-2">
                      <Frown className="h-6 w-6 text-orange-500" />
                    </Button>
                    <Button variant="outline" size="lg" className="p-2">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Tap to log your mood
                  </p>
                </CardContent>
              </Card>

              {/* Support Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Your Support Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{specialNeedsData.profile.keyWorker}</p>
                          <p className="text-xs text-muted-foreground">Key Worker</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      View All Team Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IEP Goals & Objectives</CardTitle>
              <CardDescription>
                Track progress on individualized education plan goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {specialNeedsData.goals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span className="font-medium">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Strategies in use:</p>
                          <div className="flex flex-wrap gap-2">
                            {goal.strategies.map((strategy, idx) => (
                              <Badge key={idx} variant="secondary">
                                {strategy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Status: {goal.status}</span>
                          <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details & History
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Therapies Tab */}
        <TabsContent value="therapies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Therapy Sessions</CardTitle>
              <CardDescription>
                Scheduled therapies and intervention support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialNeedsData.therapies.map((therapy) => (
                  <Card key={therapy.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{therapy.type}</CardTitle>
                      <CardDescription>{therapy.therapist}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Frequency:</span>
                          <span className="font-medium">{therapy.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Session:</span>
                          <span className="font-medium">
                            {new Date(therapy.nextSession).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Focus Area:</span>
                          <span className="text-xs text-right max-w-[150px]">{therapy.focus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Progress:</span>
                          <Badge variant="outline" className={
                            therapy.progress === 'Excellent' ? 'bg-green-50' :
                            therapy.progress === 'Good' ? 'bg-blue-50' :
                            'bg-yellow-50'
                          }>
                            {therapy.progress}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Resources
                      </Button>
                      <Button size="sm" className="flex-1">
                        Join Session
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Therapy Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Home Practice Resources</CardTitle>
              <CardDescription>
                Activities and exercises to support therapy goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Mic className="h-4 w-4 mr-2 text-blue-500" />
                    Speech Exercises
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Practice articulation and language skills
                  </p>
                  <Button size="sm" className="w-full">
                    Start Practice
                  </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Hand className="h-4 w-4 mr-2 text-purple-500" />
                    Fine Motor Activities
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Strengthen hand muscles and coordination
                  </p>
                  <Button size="sm" className="w-full">
                    View Activities
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialNeedsData.tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">{tool.usage}</Badge>
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Effectiveness</span>
                        <span>{tool.effectiveness}%</span>
                      </div>
                      <Progress value={tool.effectiveness} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Open Tool
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Additional Support Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Support Tools</CardTitle>
              <CardDescription>
                More resources to support learning and wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-20 flex-col">
                  <Glasses className="h-6 w-6 mb-1" />
                  <span className="text-xs">Reading Helper</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Volume2 className="h-6 w-6 mb-1" />
                  <span className="text-xs">Sound Control</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Type className="h-6 w-6 mb-1" />
                  <span className="text-xs">Font Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Palette className="h-6 w-6 mb-1" />
                  <span className="text-xs">Color Overlay</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensory Tab */}
        <TabsContent value="sensory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensory Profile</CardTitle>
              <CardDescription>
                Understanding and managing sensory sensitivities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(specialNeedsData.sensoryProfile).map(([sense, data]) => (
                  <div key={sense} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {sense === 'visual' && <Eye className="h-5 w-5 text-blue-500" />}
                        {sense === 'auditory' && <Ear className="h-5 w-5 text-purple-500" />}
                        {sense === 'tactile' && <Hand className="h-5 w-5 text-pink-500" />}
                        {sense === 'vestibular' && <Activity className="h-5 w-5 text-green-500" />}
                        {sense === 'proprioceptive' && <Move className="h-5 w-5 text-orange-500" />}
                        <h4 className="font-medium capitalize">{sense}</h4>
                      </div>
                      <Badge className={`${getSensitivityColor(data.sensitivity)} text-white`}>
                        Level {data.sensitivity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Sensitivity:</span>
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getSensitivityColor(data.sensitivity)}`}
                            style={{ width: `${data.sensitivity * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Strategies:</p>
                      <div className="flex flex-wrap gap-2">
                        {data.strategies.map((strategy, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {strategy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sensory Toolkit */}
          <Card>
            <CardHeader>
              <CardTitle>Digital Sensory Toolkit</CardTitle>
              <CardDescription>
                Interactive tools for sensory regulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-medium">Calming Visuals</p>
                    <p className="text-xs text-muted-foreground">Soothing animations</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <CloudRain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium">Nature Sounds</p>
                    <p className="text-xs text-muted-foreground">Rain, ocean, forest</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Wind className="h-8 w-8 mx-auto mb-2 text-teal-500" />
                    <p className="font-medium">Breathing Guide</p>
                    <p className="text-xs text-muted-foreground">Calming exercises</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accommodations Tab */}
        <TabsContent value="accommodations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Accommodations</CardTitle>
              <CardDescription>
                Support strategies currently in place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Classroom Accommodations */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <School className="h-4 w-4 mr-2 text-blue-500" />
                    Classroom Support
                  </h4>
                  <div className="space-y-2">
                    {specialNeedsData.accommodations.classroom.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm">{item.name}</span>
                        <Switch checked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Accommodations */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <ClipboardCheck className="h-4 w-4 mr-2 text-purple-500" />
                    Assessment Support
                  </h4>
                  <div className="space-y-2">
                    {specialNeedsData.accommodations.assessment.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm">{item.name}</span>
                        <Switch checked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Accommodations */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-green-500" />
                    Technology Support
                  </h4>
                  <div className="space-y-2">
                    {specialNeedsData.accommodations.technology.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm">{item.name}</span>
                        <Switch checked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request Additional Support
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Support Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialNeedsFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                    <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={feature.href as any}>
                    Access Feature
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Bottom Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  <HeartHandshake className="h-5 w-5 mr-2 text-primary" />
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your support team is here to help you succeed
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Team
                </Button>
                <Button>
                  Emergency Support
                  <AlertCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Export helper components
export const VisualSchedule = () => (
  <Card>
    <CardHeader>
      <CardTitle>Visual Schedule Builder</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="p-3 bg-muted/50 rounded-lg flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <Input placeholder="Activity name" />
          </div>
          <Button size="sm" variant="ghost">
            <Timer className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Add Activity</Button>
    </CardFooter>
  </Card>
);

export const SensoryBreak = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sensory Break Timer</CardTitle>
      <CardDescription>
        Take a calming break when needed
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-primary">5:00</div>
        <div className="flex justify-center space-x-2">
          <Button size="lg" className="w-24">
            <PlayCircle className="h-5 w-5 mr-1" />
            Start
          </Button>
          <Button size="lg" variant="outline" className="w-24">
            <RefreshCw className="h-5 w-5 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export { SpecialNeeds as default };
