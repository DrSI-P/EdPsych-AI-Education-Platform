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
  FileCode,
  FileText as FileText2,
  Video,
  Image,
  Mic,
  Presentation,
  BookOpen as Book,
  Clipboard,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
const ComprehensiveNavigation = dynamic(
  () => import('@/components/navigation/comprehensive-navigation'),
  { ssr: false }
);





// Original component
function AIContentGenerationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Sample data for demonstration
  const contentTypes = [
    { 
      id: 'lesson', 
      name: 'Lesson Plans', 
      icon: Presentation,
      description: 'Generate comprehensive lesson plans with objectives, activities, assessments, and resources.',
      targetUsers: 'Teachers',
      timeToGenerate: '30-45 seconds',
      aiFeatures: ['Curriculum alignment', 'Differentiation options', 'Evidence-based strategies'],
      color: 'blue'
    },
    { 
      id: 'worksheet', 
      name: 'Worksheets & Activities', 
      icon: Clipboard,
      description: 'Create engaging worksheets, exercises, and activities for various subjects and learning objectives.',
      targetUsers: 'Teachers, Students',
      timeToGenerate: '20-30 seconds',
      aiFeatures: ['Age-appropriate content', 'Multiple difficulty levels', 'Visual and textual elements'],
      color: 'green'
    },
    { 
      id: 'assessment', 
      name: 'Assessments & Quizzes', 
      icon: FileText,
      description: 'Design formative and summative assessments with various question types and answer keys.',
      targetUsers: 'Teachers',
      timeToGenerate: '25-35 seconds',
      aiFeatures: ['Question variety', 'Difficulty calibration', 'Learning objective alignment'],
      color: 'purple'
    },
    { 
      id: 'feedback', 
      name: 'Student Feedback', 
      icon: MessageSquare,
      description: 'Generate personalized, constructive feedback for student work based on learning objectives.',
      targetUsers: 'Teachers',
      timeToGenerate: '15-25 seconds',
      aiFeatures: ['Strength recognition', 'Growth-oriented language', 'Next step recommendations'],
      color: 'amber'
    },
    { 
      id: 'multimodal', 
      name: 'Multi-Modal Content', 
      icon: Layers,
      description: 'Create content that combines visual, audio, and interactive elements for enhanced engagement.',
      targetUsers: 'Teachers, Students',
      timeToGenerate: '40-60 seconds',
      aiFeatures: ['Visual content suggestions', 'Audio script generation', 'Interactive element design'],
      color: 'red'
    },
    { 
      id: 'blog', 
      name: 'Educational Blog Posts', 
      icon: FileText2,
      description: 'Generate informative blog posts on educational topics with evidence-based content.',
      targetUsers: 'Teachers, Parents, Professionals',
      timeToGenerate: '30-45 seconds',
      aiFeatures: ['Research integration', 'Engaging narrative', 'SEO optimization'],
      color: 'indigo'
    }
  ];

  const recentGenerations = [
    {
      id: 'g1',
      type: 'lesson',
      title: 'Photosynthesis Process for KS3',
      date: 'June 5, 2025',
      subject: 'Science',
      keyStage: 'KS3',
      status: 'Completed'
    },
    {
      id: 'g2',
      type: 'worksheet',
      title: 'Fractions Practice Worksheet',
      date: 'June 4, 2025',
      subject: 'Mathematics',
      keyStage: 'KS2',
      status: 'Completed'
    },
    {
      id: 'g3',
      type: 'blog',
      title: 'Supporting Dyslexic Students in the Classroom',
      date: 'June 3, 2025',
      subject: 'Special Educational Needs',
      keyStage: 'All',
      status: 'Completed'
    }
  ];

  const handleContentTypeSelect = (id: string) => {
    setSelectedContentType(id);
  };

  const handleGenerateContent = (): void => {
    setGeneratingContent(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setGeneratedContent(`
# Photosynthesis: Understanding Nature's Energy Process

## Lesson Plan for KS3 Science

### Learning Objectives
- Explain the process of photosynthesis and its importance
- Identify the key components required for photosynthesis
- Describe how plants convert light energy into chemical energy
- Understand the role of photosynthesis in ecosystems

### Key Vocabulary
- Photosynthesis
- Chlorophyll
- Chloroplast
- Carbon dioxide
- Oxygen
- Glucose
- Light energy
- Chemical energy

### Introduction (10 minutes)
Begin by asking students what they know about how plants get their energy. Display images of various plants and ask students to consider what these plants need to survive and grow.

### Main Activities

#### Activity 1: Photosynthesis Basics (15 minutes)
- Present the basic photosynthesis equation: Carbon dioxide + Water → Glucose + Oxygen
- Explain that this process occurs in the chloroplasts of plant cells
- Discuss the role of chlorophyll in capturing light energy
- Use diagrams to illustrate the process

#### Activity 2: Interactive Demonstration (20 minutes)
- Divide students into groups
- Provide each group with materials to create a simple model of photosynthesis
- Students should label key components and explain the flow of energy and matter

#### Activity 3: Investigation (25 minutes)
- Set up a simple experiment to demonstrate that light is necessary for photosynthesis
- Use leaf disks in sodium bicarbonate solution to observe oxygen production
- Students record observations and draw conclusions

### Plenary (10 minutes)
- Review key concepts through a quick quiz
- Discuss the importance of photosynthesis for all life on Earth
- Preview how this connects to topics of respiration and food chains

### Assessment
- Formative assessment through questioning and observation
- Exit ticket: Students write 3 facts they learnt about photosynthesis and 1 question they still have

### Differentiation
- Support: Simplified diagrams and word banks
- Extension: Explore factors affecting the rate of photosynthesis

### Resources
- Interactive whiteboard presentation
- Photosynthesis diagram handouts
- Materials for photosynthesis models
- Equipment for leaf disk experiment

### Homework
Research how photosynthesis connects to current environmental issues such as deforestation or climate change.
      `);
      setGeneratingContent(false);
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
            AI Content Generation
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Educational Content Creation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate high-quality, customised educational content in seconds. From lesson plans to assessments, worksheets to blog posts - all aligned with curriculum standards.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
            <TabsTrigger value="templates">Saved Templates</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    Content Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">124</div>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                    Time Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">47h</div>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="w-5 h-5 mr-2 text-amber-500" />
                    Content Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.8/5</div>
                  <p className="text-sm text-gray-500">Average rating</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Content Generation Process</CardTitle>
                  <CardDescription>How our AI creates educational content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Specify Requirements</h3>
                        <p className="text-sm text-gray-600">
                          Define your content needs, including subject, key stage, learning objectives, and format.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">AI Content Creation</h3>
                        <p className="text-sm text-gray-600">
                          Our AI analyzes curriculum standards, educational research, and best practices to generate tailored content.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Review & Customise</h3>
                        <p className="text-sm text-gray-600">
                          Edit the generated content to match your specific teaching style and student needs.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <span className="font-bold text-blue-600">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Use & Improve</h3>
                        <p className="text-sm text-gray-600">
                          Implement the content in your teaching and provide feedback to improve future generations.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Generation Features</CardTitle>
                  <CardDescription>Key benefits of AI-powered content creation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                          <Target className="w-4 h-4 text-blue-700" />
                        </div>
                        <h3 className="font-medium">Curriculum Aligned</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        All content is aligned with UK curriculum standards and educational frameworks.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                          <Users className="w-4 h-4 text-purple-700" />
                        </div>
                        <h3 className="font-medium">Differentiation</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Easily create differentiated content for diverse learning needs and abilities.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                          <Clock className="w-4 h-4 text-green-700" />
                        </div>
                        <h3 className="font-medium">Time-Saving</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Generate in seconds what would normally take hours to create manually.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center mr-2">
                          <Sparkles className="w-4 h-4 text-amber-700" />
                        </div>
                        <h3 className="font-medium">Evidence-Based</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Content incorporates research-backed educational practices and pedagogical approaches.
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
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Generate Educational Content?</h3>
                    <p className="text-gray-600 mb-4">
                      Create high-quality, curriculum-aligned educational content in seconds with our AI-powered generation tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button onClick={() => setActiveTab('generate')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Generating Content
                      </Button>
                      <Button variant="outline">
                        View Tutorials
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Generate Content Tab */}
          <TabsContent value="generate">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Content Types</h2>
                  <p className="text-gray-600">
                    Select the type of educational content you want to generate
                  </p>
                </div>
                
                <div className="space-y-4">
                  {contentTypes.map((contentType) => (
                    <Card 
                      key={contentType.id} 
                      className={`cursor-pointer transition-all ${
                        selectedContentType === contentType.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleContentTypeSelect(contentType.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-${contentType.color}-100 flex items-center justify-center mr-3`}>
                            <contentType.icon className={`w-5 h-5 text-${contentType.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-medium">{contentType.name}</h3>
                            <p className="text-sm text-gray-500">{contentType.description}</p>
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
                    <CardTitle>Content Generation Form</CardTitle>
                    <CardDescription>
                      {selectedContentType 
                        ? `Configure your ${contentTypes.find(c => c.id === selectedContentType)?.name.toLowerCase()} generation settings` 
                        : 'Select a content type to begin'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedContentType ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title/Topic</Label>
                          <Input id="title" placeholder="e.g., Photosynthesis, Fractions, World War II" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select defaultValue="science">
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="history">History</SelectItem>
                                <SelectItem value="geography">Geography</SelectItem>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="pe">Physical Education</SelectItem>
                                <SelectItem value="computing">Computing</SelectItem>
                                <SelectItem value="dt">Design & Technology</SelectItem>
                                <SelectItem value="languages">Languages</SelectItem>
                                <SelectItem value="re">Religious Education</SelectItem>
                                <SelectItem value="pshe">PSHE</SelectItem>
                                <SelectItem value="sen">Special Educational Needs</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="keyStage">Key Stage</Label>
                            <Select defaultValue="ks3">
                              <SelectTrigger>
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
                        
                        <div className="space-y-2">
                          <Label htmlFor="objectives">Learning Objectives</Label>
                          <Textarea 
                            id="objectives" 
                            placeholder="Enter the learning objectives for this content"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Content Length</Label>
                          <RadioGroup defaultValue="medium" className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="short" id="short" />
                              <Label htmlFor="short">Short</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="medium" />
                              <Label htmlFor="medium">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="long" id="long" />
                              <Label htmlFor="long">Long</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="differentiation">Include Differentiation</Label>
                            <Switch id="differentiation" defaultChecked />
                          </div>
                          <p className="text-sm text-gray-500">
                            Generate content with differentiated options for various ability levels
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="complexity">Content Complexity</Label>
                          <Slider 
                            defaultValue={[50]} 
                            max={100} 
                            step={1}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Simplified</span>
                            <span>Standard</span>
                            <span>Advanced</span>
                          </div>
                        </div>
                        
                        {selectedContentType === 'multimodal' && (
                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                            <h3 className="font-medium">Multi-Modal Settings</h3>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="includeVisual">Include Visual Content</Label>
                                <Switch id="includeVisual" defaultChecked />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="includeAudio">Include Audio Content</Label>
                                <Switch id="includeAudio" defaultChecked />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="includeInteractive">Include Interactive Elements</Label>
                                <Switch id="includeInteractive" defaultChecked />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="accessibilityLevel">Accessibility Level</Label>
                              <Select defaultValue="standard">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select accessibility level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="maximum">Maximum</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Layers className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Content Type</h3>
                        <p className="text-gray-500 max-w-md">
                          Choose a content type from the left panel to configure and generate educational content
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    {selectedContentType && (
                      <Button 
                        onClick={handleGenerateContent}
                        disabled={generatingContent}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {generatingContent ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                {generatedContent && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Generated Content</CardTitle>
                      <CardDescription>
                        Your AI-generated content is ready to use or customise
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg border overflow-auto max-h-[500px]">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {generatedContent}
                        </pre>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Content
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Content
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Generation History</h2>
                <p className="text-gray-600">View and manage your previously generated content</p>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search history..."
                    className="pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentGenerations.map((generation) => {
                const contentType = contentTypes.find(t => t.id === generation.type);
                return (
                  <Card key={generation.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-${contentType?.color || 'gray'}-100 flex items-center justify-center mr-3`}>
                            {contentType?.icon && <contentType.icon className={`w-5 h-5 text-${contentType?.color || 'gray'}-600`} />}
                          </div>
                          <div>
                            <h3 className="font-medium">{generation.title}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {generation.date}
                              <span className="mx-2">•</span>
                              <BookOpen className="w-3 h-3 mr-1" />
                              {generation.subject}
                              <span className="mx-2">•</span>
                              <Target className="w-3 h-3 mr-1" />
                              {generation.keyStage}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {generation.status}
                          </Badge>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">
                Load More History
              </Button>
            </div>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Layers className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Templates Yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Save your generation settings as templates to quickly create similar content in the future
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AIContentGenerationPage;