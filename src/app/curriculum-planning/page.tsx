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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  Calendar as CalendarIcon,
  User,
  Layers,
  Settings,
  Target,
  Award,
  Compass,
  Edit,
  Plus,
  Zap,
  AlertCircle,
  ChevronRight,
  Map,
  GraduationCap,
  School,
  BookMarked,
  GitBranch,
  Layout,
  List,
  Grid,
  Copy,
  Share2,
  Trash2,
  Save,
  FileDown
} from 'lucide-react';

const ComprehensiveNavigation = dynamic(
  () => import('@/components/navigation/comprehensive-navigation'),
  { ssr: false }
);

function CurriculumPlanningPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [planningStarted, setPlanningStarted] = useState(false);
  const [date, setDate] = useState<Date>();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sample curriculum templates
  const curriculumTemplates = [
    {
      id: 'template1',
      name: 'Primary Mathematics',
      description: 'Comprehensive mathematics curriculum for KS2',
      subject: 'Mathematics',
      keyStage: 'KS2',
      duration: '1 Academic Year',
      modules: 6,
      lastUpdated: 'June 1, 2025',
      usage: 124
    },
    {
      id: 'template2',
      name: 'Secondary Science',
      description: 'Integrated science curriculum covering Biology, Chemistry, and Physics',
      subject: 'Science',
      keyStage: 'KS3',
      duration: '1 Academic Year',
      modules: 9,
      lastUpdated: 'May 28, 2025',
      usage: 87
    },
    {
      id: 'template3',
      name: 'English Literature',
      description: 'Literature and creative writing curriculum with diverse texts',
      subject: 'English',
      keyStage: 'KS4',
      duration: '2 Years (GCSE)',
      modules: 8,
      lastUpdated: 'May 15, 2025',
      usage: 156
    }
  ];

  // Sample curriculum units
  const curriculumUnits = [
    {
      id: 'unit1',
      title: 'Number and Place Value',
      subject: 'Mathematics',
      duration: '6 weeks',
      objectives: 4,
      resources: 12,
      assessments: 3,
      status: 'active'
    },
    {
      id: 'unit2',
      title: 'Forces and Motion',
      subject: 'Science',
      duration: '4 weeks',
      objectives: 5,
      resources: 15,
      assessments: 2,
      status: 'draft'
    },
    {
      id: 'unit3',
      title: 'Shakespeare Studies',
      subject: 'English',
      duration: '8 weeks',
      objectives: 6,
      resources: 20,
      assessments: 4,
      status: 'active'
    }
  ];

  // Learning objectives categories
  const objectiveCategories = [
    { id: 'knowledge', name: 'Knowledge & Understanding', icon: Brain, color: 'blue' },
    { id: 'skills', name: 'Skills & Application', icon: Zap, color: 'green' },
    { id: 'values', name: 'Values & Attitudes', icon: Star, color: 'amber' },
    { id: 'competencies', name: 'Key Competencies', icon: Target, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <BookMarked className="w-4 h-4 mr-2" />
            Curriculum Planning
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Enhanced Curriculum Planning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design comprehensive, standards-aligned curricula with AI assistance. Create engaging learning experiences that meet educational objectives and student needs.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create">Create Curriculum</TabsTrigger>
            <TabsTrigger value="manage">Manage Plans</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    Active Curricula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">28</div>
                  <p className="text-sm text-gray-500">Across all subjects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <School className="w-5 h-5 mr-2 text-purple-500" />
                    Total Units
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <p className="text-sm text-gray-500">Learning units created</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                    Student Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,240</div>
                  <p className="text-sm text-gray-500">Students enrolled</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum Planning Process</CardTitle>
                  <CardDescription>How to create effective curricula with AI assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Define Objectives</h3>
                        <p className="text-sm text-gray-600">
                          Set clear learning objectives aligned with curriculum standards and student needs.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Structure Content</h3>
                        <p className="text-sm text-gray-600">
                          Organize content into logical units and lessons with appropriate sequencing.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Select Resources</h3>
                        <p className="text-sm text-gray-600">
                          Choose appropriate teaching materials, activities, and assessments for each unit.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">AI Enhancement</h3>
                        <p className="text-sm text-gray-600">
                          Use AI to optimize pacing, suggest resources, and ensure comprehensive coverage.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Planning Features</CardTitle>
                  <CardDescription>Key capabilities of our curriculum planning tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                          <Target className="w-4 h-4 text-blue-700" />
                        </div>
                        <h3 className="font-medium">Standards Alignment</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Automatic alignment with UK National Curriculum and exam specifications.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                          <GitBranch className="w-4 h-4 text-purple-700" />
                        </div>
                        <h3 className="font-medium">Differentiation</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Built-in support for multiple ability levels and learning styles.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                          <Layout className="w-4 h-4 text-green-700" />
                        </div>
                        <h3 className="font-medium">Flexible Structure</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Adaptable frameworks for different teaching contexts and timeframes.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2">
                          <Brain className="w-4 h-4 text-amber-700" />
                        </div>
                        <h3 className="font-medium">AI Suggestions</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Intelligent recommendations for content, activities, and assessments.
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
                      <BookMarked className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Plan Your Curriculum?</h3>
                    <p className="text-gray-600 mb-4">
                      Create comprehensive, engaging curricula with AI-powered planning tools that save time and improve outcomes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button onClick={() => setActiveTab('create')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Planning
                      </Button>
                      <Button variant="outline">
                        Browse Templates
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Create Curriculum Tab */}
          <TabsContent value="create">
            {!planningStarted ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Templates</h2>
                    <p className="text-gray-600">
                      Start with a template or create from scratch
                    </p>
                  </div>
                  
                  <Card className="border-dashed mb-4">
                    <CardContent className="p-4">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-center"
                        onClick={() => {
                          setSelectedTemplate('new');
                          setPlanningStarted(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create from Scratch
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    {curriculumTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium">{template.name}</h3>
                            <Badge variant="outline">{template.keyStage}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>
                              <BookOpen className="w-3 h-3 inline mr-1" />
                              {template.modules} modules
                            </div>
                            <div>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {template.duration}
                            </div>
                            <div>
                              <Users className="w-3 h-3 inline mr-1" />
                              Used {template.usage} times
                            </div>
                            <div>
                              <CalendarIcon className="w-3 h-3 inline mr-1" />
                              {template.lastUpdated}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Curriculum Details</CardTitle>
                      <CardDescription>
                        {selectedTemplate && selectedTemplate !== 'new'
                          ? `Customize the ${curriculumTemplates.find(t => t.id === selectedTemplate)?.name} template` 
                          : 'Select a template or start from scratch'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTemplate ? (
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="curriculum-name">Curriculum Name</Label>
                            <Input 
                              id="curriculum-name" 
                              placeholder="e.g., Year 8 Mathematics Curriculum"
                              defaultValue={selectedTemplate !== 'new' ? curriculumTemplates.find(t => t.id === selectedTemplate)?.name : ''}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="subject">Subject</Label>
                              <Select defaultValue={selectedTemplate !== 'new' ? curriculumTemplates.find(t => t.id === selectedTemplate)?.subject.toLowerCase() : ''}>
                                <SelectTrigger id="subject" className="mt-1">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mathematics">Mathematics</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="science">Science</SelectItem>
                                  <SelectItem value="history">History</SelectItem>
                                  <SelectItem value="geography">Geography</SelectItem>
                                  <SelectItem value="languages">Languages</SelectItem>
                                  <SelectItem value="arts">Arts</SelectItem>
                                  <SelectItem value="pe">Physical Education</SelectItem>
                                  <SelectItem value="computing">Computing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="key-stage">Key Stage</Label>
                              <Select defaultValue={selectedTemplate !== 'new' ? curriculumTemplates.find(t => t.id === selectedTemplate)?.keyStage.toLowerCase() : ''}>
                                <SelectTrigger id="key-stage" className="mt-1">
                                  <SelectValue placeholder="Select key stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="eyfs">Early Years</SelectItem>
                                  <SelectItem value="ks1">Key Stage 1</SelectItem>
                                  <SelectItem value="ks2">Key Stage 2</SelectItem>
                                  <SelectItem value="ks3">Key Stage 3</SelectItem>
                                  <SelectItem value="ks4">Key Stage 4</SelectItem>
                                  <SelectItem value="ks5">Key Stage 5</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="start-date">Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal mt-1",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div>
                              <Label htmlFor="duration">Duration</Label>
                              <Select defaultValue="year">
                                <SelectTrigger id="duration" className="mt-1">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="term">1 Term</SelectItem>
                                  <SelectItem value="semester">1 Semester</SelectItem>
                                  <SelectItem value="year">1 Academic Year</SelectItem>
                                  <SelectItem value="2years">2 Years</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description" 
                              placeholder="Describe the curriculum objectives and overview..."
                              rows={4}
                              className="mt-1"
                            />
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <Label>Learning Objectives</Label>
                            <p className="text-sm text-gray-500 mb-3">Select the types of objectives to include</p>
                            
                            <div className="space-y-3">
                              {objectiveCategories.map((category) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                  <Checkbox id={category.id} defaultChecked />
                                  <Label 
                                    htmlFor={category.id} 
                                    className="flex items-center cursor-pointer"
                                  >
                                    <category.icon className={`w-4 h-4 mr-2 text-${category.color}-500`} />
                                    {category.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="ai-assist">AI-Assisted Planning</Label>
                              <p className="text-sm text-gray-500">Get suggestions for content and resources</p>
                            </div>
                            <Switch id="ai-assist" defaultChecked />
                          </div>
                          
                          <Button 
                            onClick={() => setPlanningStarted(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Continue to Unit Planning
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <BookMarked className="w-16 h-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Selected</h3>
                          <p className="text-gray-500 mb-4">Select a template or create from scratch to begin planning</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Unit Planning</CardTitle>
                  <CardDescription>
                    Add units and lessons to your curriculum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">AI Suggestions Available</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Based on your curriculum details, we recommend including units on: Number Operations, 
                            Algebra Basics, Geometry Fundamentals, Data Handling, and Problem Solving.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Curriculum Units</h3>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Unit
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">Unit 1: Number and Place Value</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Understanding number systems, place value, and operations
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                  <span>
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    6 weeks
                                  </span>
                                  <span>
                                    <BookOpen className="w-3 h-3 inline mr-1" />
                                    8 lessons
                                  </span>
                                  <span>
                                    <Target className="w-3 h-3 inline mr-1" />
                                    5 objectives
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">Unit 2: Addition and Subtraction</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Developing fluency in addition and subtraction strategies
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                  <span>
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    4 weeks
                                  </span>
                                  <span>
                                    <BookOpen className="w-3 h-3 inline mr-1" />
                                    6 lessons
                                  </span>
                                  <span>
                                    <Target className="w-3 h-3 inline mr-1" />
                                    4 objectives
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4">
                            <Button variant="ghost" className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Another Unit
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setPlanningStarted(false)}>
                        Back to Details
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline">
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Curriculum
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Manage Plans Tab */}
          <TabsContent value="manage">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">My Curricula</h2>
                  <p className="text-gray-600">Manage and organize your curriculum plans</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search curricula..."
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-md">
                    <Button 
                      variant={viewMode === 'list' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-r-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-l-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {curriculumUnits.map((unit) => (
                    <Card key={unit.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium">{unit.title}</h3>
                              <Badge variant={unit.status === 'active' ? 'default' : 'secondary'}>
                                {unit.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{unit.subject} Curriculum</p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>
                                <Clock className="w-4 h-4 inline mr-1" />
                                {unit.duration}
                              </span>
                              <span>
                                <Target className="w-4 h-4 inline mr-1" />
                                {unit.objectives} objectives
                              </span>
                              <span>
                                <FileText className="w-4 h-4 inline mr-1" />
                                {unit.resources} resources
                              </span>
                              <span>
                                <BarChart2 className="w-4 h-4 inline mr-1" />
                                {unit.assessments} assessments
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {curriculumUnits.map((unit) => (
                    <Card key={unit.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{unit.title}</CardTitle>
                          <Badge variant={unit.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                            {unit.status}
                          </Badge>
                        </div>
                        <CardDescription>{unit.subject} Curriculum</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {unit.duration}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            {unit.objectives} objectives
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            {unit.resources} resources
                          </div>
                          <div className="flex items-center">
                            <BarChart2 className="w-4 h-4 mr-2" />
                            {unit.assessments} assessments
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum Analytics</CardTitle>
                  <CardDescription>Overview of curriculum usage and effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <BarChart2 className="w-8 h-8 text-gray-400" />
                    <p className="ml-2 text-gray-500">Curriculum analytics visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Curriculum Resources</h2>
                <p className="text-gray-600">
                  Templates, guides, and best practices for curriculum planning
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Planning Templates</CardTitle>
                    <CardDescription>Ready-to-use curriculum frameworks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Primary Core Subjects</h4>
                        <p className="text-xs text-gray-600 mb-2">Complete curriculum templates for KS1-KS2</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Secondary STEM</h4>
                        <p className="text-xs text-gray-600 mb-2">Science, Technology, Engineering, Maths</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Cross-Curricular Themes</h4>
                        <p className="text-xs text-gray-600 mb-2">Integrated learning approaches</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Planning Guides</CardTitle>
                    <CardDescription>Best practices and methodologies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Backwards Design Guide</h4>
                        <p className="text-xs text-gray-600 mb-2">Start with end goals in mind</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          Read Guide
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Differentiation Strategies</h4>
                        <p className="text-xs text-gray-600 mb-2">Meeting diverse learner needs</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          Read Guide
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Assessment Integration</h4>
                        <p className="text-xs text-gray-600 mb-2">Embedding assessment in curriculum</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          Read Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Standards & Frameworks</CardTitle>
                    <CardDescription>Official curriculum requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">National Curriculum</h4>
                        <p className="text-xs text-gray-600 mb-2">UK statutory requirements</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          View Standards
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Exam Specifications</h4>
                        <p className="text-xs text-gray-600 mb-2">GCSE and A-Level requirements</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          View Specs
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">SEND Guidelines</h4>
                        <p className="text-xs text-gray-600 mb-2">Special educational needs support</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-2" />
                          View Guidelines
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900 mb-2">Professional Development Available</h3>
                      <p className="text-sm text-amber-800 mb-3">
                        Enhance your curriculum planning skills with our comprehensive training courses on curriculum design, 
                        assessment integration, and differentiation strategies.
                      </p>
                      <Button variant="outline" className="bg-white border-amber-300 hover:bg-amber-50">
                        Explore Courses
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CurriculumPlanningPage;