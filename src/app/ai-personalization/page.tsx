'use client';

import dynamic from 'next/dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { 
Brain, 
  BookOpen, 
  Lightbulb, 
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  FileText,
  Users,
  BarChart2,
  PieChart,
  LineChart,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Layers,
  Settings,
  Target,
  Award,
  Compass,
  Edit,
  Plus,
  Zap,
  Sparkles,
  FileText as FileText2,
  Video,
  Image,
  Mic,
  Presentation,
  BookOpen as Book,
  Clipboard,
  MessageSquare,
  RefreshCw,
  Sliders,
  UserPlus,
  Fingerprint,
  Eye,
  Heart,
  BarChart,
  Gauge,
  Palette
} from 'lucide-react';
const ComprehensiveNavigation = dynamic(
  () => import('@/components/navigation/comprehensive-navigation'),
  { ssr: false }
);





// Original component
function AIPersonalizationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [generatingProfile, setGeneratingProfile] = useState(false);
  const [profileGenerated, setProfileGenerated] = useState(false);

  // Sample data for demonstration
  const studentProfiles = [
    {
      id: 'student1',
      name: 'Alex Johnson',
      age: 12,
      yearGroup: 'Year 8',
      avatar: '/avatars/alex.jpg',
      lastUpdated: 'June 4, 2025'
    },
    {
      id: 'student2',
      name: 'Maya Patel',
      age: 10,
      yearGroup: 'Year 6',
      avatar: '/avatars/maya.jpg',
      lastUpdated: 'June 3, 2025'
    },
    {
      id: 'student3',
      name: 'Thomas Wilson',
      age: 14,
      yearGroup: 'Year 10',
      avatar: '/avatars/thomas.jpg',
      lastUpdated: 'June 1, 2025'
    }
  ];

  const personalizationDimensions = [
    { 
      id: 'learning-style', 
      name: 'Learning Style', 
      icon: Brain,
      description: 'Personalize content based on preferred learning modalities and cognitive approaches.',
      options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Multimodal'],
      color: 'blue'
    },
    { 
      id: 'interests', 
      name: 'Interests & Motivations', 
      icon: Heart,
      description: 'Adapt content themes and examples to align with student interests and motivational factors.',
      options: ['Science & Nature', 'Arts & Culture', 'Sports & Activities', 'Technology', 'Social Issues'],
      color: 'red'
    },
    { 
      id: 'pace', 
      name: 'Learning Pace', 
      icon: Gauge,
      description: 'Adjust content delivery speed and complexity based on individual processing and mastery rates.',
      options: ['Accelerated', 'Standard', 'Extended', 'Flexible', 'Mastery-Based'],
      color: 'green'
    },
    { 
      id: 'support', 
      name: 'Support Needs', 
      icon: Layers,
      description: 'Provide appropriate scaffolding, accommodations, and support based on individual requirements.',
      options: ['Minimal', 'Intermittent', 'Moderate', 'Substantial', 'Specialized'],
      color: 'purple'
    },
    { 
      id: 'presentation', 
      name: 'Content Presentation', 
      icon: Palette,
      description: 'Customise visual and structural aspects of content presentation for optimal engagement.',
      options: ['Text-Focused', 'Visual-Rich', 'Interactive', 'Simplified', 'Multimedia'],
      color: 'amber'
    }
  ];

  const recentPersonalizations = [
    {
      id: 'p1',
      student: 'Alex Johnson',
      date: 'June 5, 2025',
      dimensions: ['Learning Style', 'Interests & Motivations', 'Content Presentation'],
      status: 'Active'
    },
    {
      id: 'p2',
      student: 'Maya Patel',
      date: 'June 2, 2025',
      dimensions: ['Learning Pace', 'Support Needs', 'Content Presentation'],
      status: 'Active'
    },
    {
      id: 'p3',
      student: 'Thomas Wilson',
      date: 'May 28, 2025',
      dimensions: ['Learning Style', 'Interests & Motivations', 'Learning Pace'],
      status: 'Inactive'
    }
  ];

  const handleProfileSelect = (id: string) => {
    setSelectedProfile(id);
  };

  const handleGenerateProfile = (): void => {
    setGeneratingProfile(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setProfileGenerated(true);
      setGeneratingProfile(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI Personalization
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adaptive Learning Personalization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create tailored learning experiences that adapt to individual student needs, preferences, and learning styles using AI-powered personalization.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiles">Student Profiles</TabsTrigger>
            <TabsTrigger value="dimensions">Personalization</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                    Active Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">28</div>
                  <p className="text-sm text-gray-500">Personalized student profiles</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sliders className="w-5 h-5 mr-2 text-purple-500" />
                    Personalization Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-sm text-gray-500">Active personalization factors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-green-500" />
                    Engagement Increase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">32%</div>
                  <p className="text-sm text-gray-500">Average improvement</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personalization Process</CardTitle>
                  <CardDescription>How our AI creates personalized learning experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Profile Creation</h3>
                        <p className="text-sm text-gray-600">
                          Generate comprehensive student profiles based on learning data, assessments, and observations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Dimension Analysis</h3>
                        <p className="text-sm text-gray-600">
                          Analyze key personalization dimensions including learning style, pace, interests, and support needs.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Content Adaptation</h3>
                        <p className="text-sm text-gray-600">
                          Automatically adapt learning content, activities, and assessments to match individual profiles.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Continuous Refinement</h3>
                        <p className="text-sm text-gray-600">
                          Continuously update and refine personalization based on ongoing performance and engagement data.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personalization Benefits</CardTitle>
                  <CardDescription>Key advantages of AI-powered personalization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                          <Target className="w-4 h-4 text-blue-700" />
                        </div>
                        <h3 className="font-medium">Targeted Learning</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Delivers precisely what each student needs at the right time and in the right format.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                          <Gauge className="w-4 h-4 text-purple-700" />
                        </div>
                        <h3 className="font-medium">Optimal Pacing</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Adjusts learning pace to prevent frustration or boredom and maximize engagement.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                          <Heart className="w-4 h-4 text-green-700" />
                        </div>
                        <h3 className="font-medium">Increased Motivation</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Connects learning to personal interests and preferences to boost intrinsic motivation.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2">
                          <BarChart2 className="w-4 h-4 text-amber-700" />
                        </div>
                        <h3 className="font-medium">Better Outcomes</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Improves academic performance, knowledge retention, and skill development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-8">
                  <div className="mb-6 md:mb-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Fingerprint className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Personalize Learning?</h3>
                    <p className="text-gray-600 mb-4">
                      Create AI-powered personalized learning experiences tailored to each student's unique needs, preferences, and learning style.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button onClick={() => setActiveTab('profiles')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Create Student Profile
                      </Button>
                      <Button variant="outline">
                        View Personalization Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Student Profiles Tab */}
          <TabsContent value="profiles">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Student Profiles</h2>
                  <p className="text-gray-600">
                    Select a student to view or create a personalized learning profile
                  </p>
                </div>
                
                <div className="space-y-4">
                  {studentProfiles.map((student) => (
                    <Card 
                      key={student.id} 
                      className={`cursor-pointer transition-all ${
                        selectedProfile === student.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleProfileSelect(student.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.yearGroup} • Age {student.age}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-center">
                      <Button variant="ghost" className="w-full flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Student
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Profile</CardTitle>
                    <CardDescription>
                      {selectedProfile 
                        ? `Personalized learning profile for ${studentProfiles.find(s => s.id === selectedProfile)?.name}` 
                        : 'Select a student to view or create a profile'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedProfile ? (
                      profileGenerated ? (
                        <div className="space-y-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <p className="text-green-700 font-medium">Learning profile generated successfully</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Learning Style Profile</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Visual</span>
                                    <span className="text-sm font-medium">75%</span>
                                  </div>
                                  <Progress value={75} className="h-2" />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Auditory</span>
                                    <span className="text-sm font-medium">45%</span>
                                  </div>
                                  <Progress value={45} className="h-2" />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Kinesthetic</span>
                                    <span className="text-sm font-medium">60%</span>
                                  </div>
                                  <Progress value={60} className="h-2" />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Reading/Writing</span>
                                    <span className="text-sm font-medium">80%</span>
                                  </div>
                                  <Progress value={80} className="h-2" />
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Interest Areas</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Science & Nature</Badge>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Technology</Badge>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">History</Badge>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Mathematics</Badge>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Learning Pace</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Overall Pace</span>
                                  <Badge>Accelerated</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Mathematics</span>
                                  <Badge>Accelerated</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">English</span>
                                  <Badge>Standard</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Science</span>
                                  <Badge>Accelerated</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Support Needs</h3>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <div className="bg-amber-100 p-1 rounded mr-2">
                                    <Lightbulb className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Extended time for writing tasks</p>
                                    <p className="text-xs text-gray-500">Provide additional time for extended writing assignments</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <div className="bg-green-100 p-1 rounded mr-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Visual learning aids</p>
                                    <p className="text-xs text-gray-500">Supplement instruction with diagrams, charts, and visual models</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">AI Recommendations</h3>
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <div className="flex items-start">
                                  <Brain className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm">This student would benefit from visual-rich content with connections to science and technology. Provide accelerated pacing in mathematics and science with standard pacing in English. Include visual learning aids and allow extended time for writing tasks.</p>
                                    <p className="text-sm mt-2">Recommended learning activities: interactive simulations, visual problem-solving, and project-based learning with technology integration.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="dataSource">Data Sources</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="assessments" defaultChecked />
                                <label htmlFor="assessments" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Assessment Results
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="activities" defaultChecked />
                                <label htmlFor="activities" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Learning Activities
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="surveys" defaultChecked />
                                <label htmlFor="surveys" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Student Surveys
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="observations" />
                                <label htmlFor="observations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Teacher Observations
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="profileDimensions">Profile Dimensions</Label>
                            <div className="space-y-2">
                              {personalizationDimensions.map(dimension => (
                                <div key={dimension.id} className="flex items-center space-x-2">
                                  <Checkbox id={dimension.id} defaultChecked />
                                  <label htmlFor={dimension.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {dimension.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="timeRange">Analysis Time Range</Label>
                            <Select defaultValue="90days">
                              <SelectTrigger>
                                <SelectValue placeholder="Select time range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="6months">Last 6 months</SelectItem>
                                <SelectItem value="1year">Last year</SelectItem>
                                <SelectItem value="all">All available data</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="includeRecommendations">Include AI Recommendations</Label>
                              <Switch id="includeRecommendations" defaultChecked />
                            </div>
                            <p className="text-sm text-gray-500">
                              Generate personalized learning recommendations based on the profile
                            </p>
                          </div>
                          
                          <Button
                            onClick={handleGenerateProfile}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                            disabled={generatingProfile}
                          >
                            {generatingProfile ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Generating Profile...
                              </>
                            ) : (
                              <>
                                <Brain className="mr-2 h-4 w-4" />
                                Generate Learning Profile
                              </>
                            )}
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Selected</h3>
                        <p className="text-gray-500 mb-4">Select a student from the list to view or create a personalized learning profile</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Profile
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-600">
                        View Profile History
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Personalization Dimensions Tab */}
          <TabsContent value="dimensions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Personalization Dimensions</h2>
                  <p className="text-gray-600">
                    Configure how content is personalized for individual students
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Active Dimensions</CardTitle>
                    <CardDescription>
                      Select dimensions to include in personalization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {personalizationDimensions.map(dimension => (
                        <div key={dimension.id} className="flex items-start space-x-3">
                          <Switch id={`switch-${dimension.id}`} defaultChecked />
                          <div>
                            <Label htmlFor={`switch-${dimension.id}`} className="text-base font-medium flex items-center">
                              <dimension.icon className={`w-4 h-4 mr-2 text-${dimension.color}-500`} />
                              {dimension.name}
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">{dimension.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Dimension Configuration</CardTitle>
                    <CardDescription>
                      Configure personalization settings for each dimension
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="learning-style">
                      <TabsList className="grid grid-cols-5 mb-6">
                        {personalizationDimensions.map(dimension => (
                          <TabsTrigger key={dimension.id} value={dimension.id} className="text-xs">
                            <dimension.icon className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">{dimension.name}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {personalizationDimensions.map(dimension => (
                        <TabsContent key={dimension.id} value={dimension.id}>
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2 flex items-center">
                                <dimension.icon className={`w-5 h-5 mr-2 text-${dimension.color}-500`} />
                                {dimension.name}
                              </h3>
                              <p className="text-gray-600 mb-4">{dimension.description}</p>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`${dimension.id}-weight`}>Personalization Weight</Label>
                                <div className="pt-2">
                                  <Slider defaultValue={[75]} max={100} step={5} />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low Impact</span>
                                  <span>High Impact</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Included Options</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {dimension.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <Checkbox id={`${dimension.id}-option-${index}`} defaultChecked />
                                      <label htmlFor={`${dimension.id}-option-${index}`} className="text-sm">
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Data Sources</Label>
                                <RadioGroup defaultValue="automatic">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="automatic" id={`${dimension.id}-automatic`} />
                                    <Label htmlFor={`${dimension.id}-automatic`}>Automatic (AI-determined)</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="manual" id={`${dimension.id}-manual`} />
                                    <Label htmlFor={`${dimension.id}-manual`}>Manual (Teacher-specified)</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="hybrid" id={`${dimension.id}-hybrid`} />
                                    <Label htmlFor={`${dimension.id}-hybrid`}>Hybrid (AI + Teacher)</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Update Frequency</Label>
                                <Select defaultValue="weekly">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="termly">Termly</SelectItem>
                                    <SelectItem value="manual">Manual Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="font-medium mb-2">Advanced Settings</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`${dimension.id}-override`}>Allow Teacher Override</Label>
                                  <Switch id={`${dimension.id}-override`} defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`${dimension.id}-notifications`}>Change Notifications</Label>
                                  <Switch id={`${dimension.id}-notifications`} defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`${dimension.id}-history`}>Maintain History</Label>
                                  <Switch id={`${dimension.id}-history`} defaultChecked />
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-gray-50">
                    <Button variant="outline">
                      Reset to Defaults
                    </Button>
                    <Button>
                      Save Configuration
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Personalization History</h2>
                  <p className="text-gray-600">
                    View and manage personalization profiles and changes
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Personalizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPersonalizations.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className={`px-4 py-2 ${
                          item.status === 'Active' ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{item.student}</div>
                            <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                              <div className="text-sm text-gray-500 mb-2">
                                <Calendar className="w-4 h-4 inline-block mr-1" />
                                Created: {item.date}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.dimensions.map((dim, index) => (
                                  <Badge key={index} variant="outline" className="bg-blue-50">
                                    {dim}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Showing 3 of 24 personalizations
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AIPersonalizationPage;