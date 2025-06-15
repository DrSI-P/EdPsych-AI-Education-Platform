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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Route,
  Navigation,
  TrendingUp,
  Activity,
  Map,
  Milestone,
  GitBranch,
  Zap,
  RefreshCw,
  Info,
  AlertCircle,
  Trophy,
  Flag,
  ChevronRight
} from 'lucide-react';

const ComprehensiveNavigation = dynamic(
  () => import('@/components/navigation/comprehensive-navigation'),
  { ssr: false }
);

function LearningPathOptimizationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [pathOptimized, setPathOptimized] = useState(false);

  // Sample data for demonstration
  const students = [
    {
      id: 'student1',
      name: 'Emily Chen',
      age: 12,
      yearGroup: 'Year 8',
      currentPath: 'Mathematics - Algebra',
      progress: 65,
      avatar: '/avatars/emily.jpg'
    },
    {
      id: 'student2',
      name: 'James Williams',
      age: 14,
      yearGroup: 'Year 10',
      currentPath: 'Science - Biology',
      progress: 78,
      avatar: '/avatars/james.jpg'
    },
    {
      id: 'student3',
      name: 'Sophie Taylor',
      age: 11,
      yearGroup: 'Year 7',
      currentPath: 'English - Creative Writing',
      progress: 45,
      avatar: '/avatars/sophie.jpg'
    }
  ];

  const learningPaths = [
    {
      id: 'path1',
      name: 'Mathematics Foundation',
      modules: 12,
      estimatedDuration: '3 months',
      difficulty: 'Intermediate',
      completionRate: 89,
      aiRecommended: true
    },
    {
      id: 'path2',
      name: 'Advanced Science Track',
      modules: 16,
      estimatedDuration: '4 months',
      difficulty: 'Advanced',
      completionRate: 76,
      aiRecommended: false
    },
    {
      id: 'path3',
      name: 'English Literature Journey',
      modules: 10,
      estimatedDuration: '2.5 months',
      difficulty: 'Standard',
      completionRate: 92,
      aiRecommended: true
    }
  ];

  const optimizationFactors = [
    {
      id: 'pace',
      name: 'Learning Pace',
      description: 'Adjust content delivery speed based on comprehension',
      weight: 85,
      icon: Activity
    },
    {
      id: 'difficulty',
      name: 'Difficulty Progression',
      description: 'Optimize challenge level to maintain engagement',
      weight: 75,
      icon: TrendingUp
    },
    {
      id: 'interests',
      name: 'Interest Alignment',
      description: 'Incorporate topics that match student interests',
      weight: 90,
      icon: Star
    },
    {
      id: 'goals',
      name: 'Goal Achievement',
      description: 'Prioritize paths that lead to learning objectives',
      weight: 80,
      icon: Target
    },
    {
      id: 'prerequisites',
      name: 'Prerequisite Management',
      description: 'Ensure foundational knowledge before advancement',
      weight: 95,
      icon: GitBranch
    }
  ];

  const handleOptimizePath = () => {
    setOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizing(false);
      setPathOptimized(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <Route className="w-4 h-4 mr-2" />
            Learning Path Optimization
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Learning Path Optimization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dynamically optimize learning pathways to maximize student engagement, comprehension, and achievement using advanced AI algorithms.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="optimization">Path Optimization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-blue-500" />
                    Active Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42</div>
                  <p className="text-sm text-gray-500">Students on optimized paths</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Average Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">28%</div>
                  <p className="text-sm text-gray-500">Learning efficiency gain</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87%</div>
                  <p className="text-sm text-gray-500">Path completion success</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>How Path Optimization Works</CardTitle>
                  <CardDescription>AI-driven process for creating optimal learning journeys</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Learner Analysis</h3>
                        <p className="text-sm text-gray-600">
                          Analyze student performance, pace, preferences, and learning history to create a comprehensive profile.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Path Generation</h3>
                        <p className="text-sm text-gray-600">
                          Generate multiple potential learning paths based on curriculum requirements and learner characteristics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">AI Optimization</h3>
                        <p className="text-sm text-gray-600">
                          Apply machine learning algorithms to select and refine the optimal path for maximum effectiveness.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Continuous Adaptation</h3>
                        <p className="text-sm text-gray-600">
                          Monitor progress and dynamically adjust the path based on real-time performance and engagement data.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Benefits</CardTitle>
                  <CardDescription>Key advantages of AI-optimized learning paths</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                          <Zap className="w-4 h-4 text-blue-700" />
                        </div>
                        <h3 className="font-medium">Accelerated Learning</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Students progress faster through optimized content sequencing and pacing.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                          <Target className="w-4 h-4 text-purple-700" />
                        </div>
                        <h3 className="font-medium">Personalized Goals</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Paths aligned with individual learning objectives and career aspirations.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                          <Activity className="w-4 h-4 text-green-700" />
                        </div>
                        <h3 className="font-medium">Engagement Boost</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Higher engagement through relevance and appropriate challenge levels.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2">
                          <GitBranch className="w-4 h-4 text-amber-700" />
                        </div>
                        <h3 className="font-medium">Adaptive Branching</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Dynamic path adjustments based on mastery and emerging interests.
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
                      <Route className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Optimize Learning Paths?</h3>
                    <p className="text-gray-600 mb-4">
                      Use AI to create personalized, adaptive learning journeys that maximize student potential and accelerate achievement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button onClick={() => setActiveTab('optimization')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Path Optimization
                      </Button>
                      <Button variant="outline">
                        View Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Path Optimization Tab */}
          <TabsContent value="optimization">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Select Student</h2>
                  <p className="text-gray-600">
                    Choose a student to optimize their learning path
                  </p>
                </div>
                
                <div className="space-y-4">
                  {students.map((student) => (
                    <Card 
                      key={student.id} 
                      className={`cursor-pointer transition-all ${
                        selectedStudent === student.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{student.name}</h3>
                              <p className="text-sm text-gray-500">{student.yearGroup}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Progress</p>
                            <p className="text-sm font-medium">{student.progress}%</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500">Current Path</p>
                          <p className="text-sm">{student.currentPath}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Path Optimization</CardTitle>
                    <CardDescription>
                      {selectedStudent 
                        ? `Optimize learning path for ${students.find(s => s.id === selectedStudent)?.name}` 
                        : 'Select a student to begin optimization'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent ? (
                      pathOptimized ? (
                        <div className="space-y-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <p className="text-green-700 font-medium">Learning path optimized successfully</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Optimized Learning Path</h3>
                            
                            <div className="space-y-4">
                              <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">Mathematics - Accelerated Algebra</h4>
                                  <Badge className="bg-blue-100 text-blue-700">AI Recommended</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  Customized path based on strong mathematical aptitude and rapid comprehension
                                </p>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Duration</p>
                                    <p className="font-medium">8 weeks</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Modules</p>
                                    <p className="font-medium">12 modules</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Difficulty</p>
                                    <p className="font-medium">Advanced</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-3">Key Milestones</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                      <Milestone className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Week 2: Linear Equations Mastery</p>
                                      <Progress value={100} className="h-2 mt-1" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                      <Milestone className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Week 4: Quadratic Functions</p>
                                      <Progress value={65} className="h-2 mt-1" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                      <Milestone className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Week 6: Polynomial Operations</p>
                                      <Progress value={0} className="h-2 mt-1" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                      <Flag className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Week 8: Advanced Problem Solving</p>
                                      <Progress value={0} className="h-2 mt-1" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-medium mb-3">Optimization Insights</h4>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                  <div className="flex items-start">
                                    <Lightbulb className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                      <p className="mb-2">This optimized path will:</p>
                                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        <li>Reduce completion time by 25% compared to standard path</li>
                                        <li>Include advanced problem-solving challenges to maintain engagement</li>
                                        <li>Incorporate visual learning materials aligned with student preferences</li>
                                        <li>Provide accelerated progression through foundational concepts</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Current Learning Status</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 mb-1">Current Path</p>
                                <p className="font-medium">{students.find(s => s.id === selectedStudent)?.currentPath}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 mb-1">Progress</p>
                                <div className="flex items-center">
                                  <Progress value={students.find(s => s.id === selectedStudent)?.progress || 0} className="flex-1 mr-2" />
                                  <span className="text-sm font-medium">{students.find(s => s.id === selectedStudent)?.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Optimization Factors</h3>
                            
                            <div className="space-y-4">
                              {optimizationFactors.map((factor) => (
                                <div key={factor.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <factor.icon className="w-5 h-5 text-blue-500 mr-2" />
                                      <h4 className="font-medium">{factor.name}</h4>
                                    </div>
                                    <Badge variant="outline">{factor.weight}%</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                                  <Progress value={factor.weight} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Optimization Settings</h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="adaptive">Enable Adaptive Learning</Label>
                                <Switch id="adaptive" defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="prerequisites">Enforce Prerequisites</Label>
                                <Switch id="prerequisites" defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="interests">Consider Student Interests</Label>
                                <Switch id="interests" defaultChecked />
                              </div>
                              
                              <div>
                                <Label htmlFor="timeframe">Optimization Timeframe</Label>
                                <Select defaultValue="term">
                                  <SelectTrigger id="timeframe" className="mt-1">
                                    <SelectValue placeholder="Select timeframe" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="month">1 Month</SelectItem>
                                    <SelectItem value="term">1 Term</SelectItem>
                                    <SelectItem value="semester">1 Semester</SelectItem>
                                    <SelectItem value="year">1 Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={handleOptimizePath}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                            disabled={optimizing}
                          >
                            {optimizing ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Optimizing Path...
                              </>
                            ) : (
                              <>
                                <Route className="mr-2 h-4 w-4" />
                                Optimize Learning Path
                              </>
                            )}
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Map className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Selected</h3>
                        <p className="text-gray-500 mb-4">Select a student from the list to optimize their learning path</p>
                      </div>
                    )}
                  </CardContent>
                  {selectedStudent && pathOptimized && (
                    <CardFooter className="flex justify-between border-t bg-gray-50">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Path Details
                      </Button>
                      <Button size="sm">
                        Apply Optimized Path
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Path Analytics</h2>
                  <p className="text-gray-600">Track performance and effectiveness of optimized learning paths</p>
                </div>
                <div className="flex gap-2">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Avg. Completion Time</p>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">-23%</p>
                    <p className="text-xs text-green-600">vs. standard paths</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Engagement Score</p>
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">8.7/10</p>
                    <p className="text-xs text-gray-500">+1.2 from baseline</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold">91%</p>
                    <p className="text-xs text-gray-500">Path completion</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Adaptation Rate</p>
                      <RefreshCw className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">3.2</p>
                    <p className="text-xs text-gray-500">Adjustments per path</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Path Performance Comparison</CardTitle>
                  <CardDescription>Compare optimized paths with standard curriculum paths</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <LineChart className="w-8 h-8 text-gray-400" />
                    <p className="ml-2 text-gray-500">Performance chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Paths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {learningPaths.map((path) => (
                        <div key={path.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{path.name}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {path.modules} modules
                              <span className="mx-2">•</span>
                              <Clock className="w-3 h-3 mr-1" />
                              {path.estimatedDuration}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{path.completionRate}%</p>
                            <p className="text-xs text-gray-500">completion</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium text-sm">Visual Learners Excel</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Students with visual learning preferences show 35% faster progress on paths with enhanced visual content.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium text-sm">Adaptive Pacing Success</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Dynamic pacing adjustments result in 92% of students maintaining optimal challenge levels.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-amber-500 pl-4">
                        <p className="font-medium text-sm">Interest Alignment Impact</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Incorporating student interests increases engagement by 40% and reduces dropout rates by 60%.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Settings</CardTitle>
                <CardDescription>Configure global settings for learning path optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Algorithm Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="algorithm">Optimization Algorithm</Label>
                        <Select defaultValue="neural">
                          <SelectTrigger id="algorithm" className="mt-1">
                            <SelectValue placeholder="Select algorithm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="neural">Neural Network (Recommended)</SelectItem>
                            <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                            <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
                            <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="sensitivity">Adaptation Sensitivity</Label>
                        <div className="mt-2">
                          <Slider defaultValue={[75]} max={100} step={5} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Conservative</span>
                          <span>Balanced</span>
                          <span>Aggressive</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="realtime">Real-time Optimization</Label>
                          <p className="text-sm text-gray-500 mt-1">Continuously adjust paths based on live data</p>
                        </div>
                        <Switch id="realtime" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Sources</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="assessment">Assessment Data</Label>
                        <Switch id="assessment" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="engagement">Engagement Metrics</Label>
                        <Switch id="engagement" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="feedback">Student Feedback</Label>
                        <Switch id="feedback" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="peer">Peer Comparison</Label>
                        <Switch id="peer" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Constraints & Limits</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="maxdeviation">Maximum Path Deviation</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="maxdeviation" className="mt-1">
                            <SelectValue placeholder="Select maximum deviation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20">20% from curriculum</SelectItem>
                            <SelectItem value="30">30% from curriculum</SelectItem>
                            <SelectItem value="40">40% from curriculum</SelectItem>
                            <SelectItem value="50">50% from curriculum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="prerequisites">Strict Prerequisite Enforcement</Label>
                          <p className="text-sm text-gray-500 mt-1">Prevent skipping foundational content</p>
                        </div>
                        <Switch id="prerequisites" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50">
                <Button variant="outline">
                  Reset to Defaults
                </Button>
                <Button>
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default LearningPathOptimizationPage;