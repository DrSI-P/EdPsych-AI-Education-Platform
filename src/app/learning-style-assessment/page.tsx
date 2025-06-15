'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  Eye,
  Ear,
  Hand,
  Book,
  Palette,
  Music,
  Move,
  MessageSquare,
  Layers,
  Target,
  Award,
  RefreshCw,
  Info,
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
  TrendingUp,
  Activity,
  Zap,
  GitBranch,
  Search,
  Filter
} from 'lucide-react';

const ComprehensiveNavigation = dynamic(
  () => import('@/components/navigation/comprehensive-navigation'),
  { ssr: false }
);

interface AssessmentQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    style: string;
  }>;
}

function LearningStyleAssessmentPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Sample assessment questions
  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 'q1',
      question: 'When learning something new, I prefer to:',
      options: [
        { text: 'See diagrams, charts, or visual demonstrations', style: 'visual' },
        { text: 'Listen to explanations or discussions', style: 'auditory' },
        { text: 'Try it out hands-on or practice it myself', style: 'kinesthetic' },
        { text: 'Read about it in detail', style: 'reading' }
      ]
    },
    {
      id: 'q2',
      question: 'I remember information best when:',
      options: [
        { text: 'I can visualise it in my mind', style: 'visual' },
        { text: 'I hear it explained clearly', style: 'auditory' },
        { text: 'I actively participate or move around', style: 'kinesthetic' },
        { text: 'I write it down or take notes', style: 'reading' }
      ]
    },
    {
      id: 'q3',
      question: 'During lessons, I find it most helpful when:',
      options: [
        { text: 'The teacher uses the whiteboard or shows slides', style: 'visual' },
        { text: 'There are group discussions or verbal explanations', style: 'auditory' },
        { text: 'We do experiments or hands-on activities', style: 'kinesthetic' },
        { text: 'We have textbooks or handouts to follow', style: 'reading' }
      ]
    },
    {
      id: 'q4',
      question: 'When studying for a test, I prefer to:',
      options: [
        { text: 'Create mind maps or use colour-coding', style: 'visual' },
        { text: 'Discuss the material with others or recite it aloud', style: 'auditory' },
        { text: 'Use flashcards or practice problems', style: 'kinesthetic' },
        { text: 'Review my notes and read textbooks', style: 'reading' }
      ]
    },
    {
      id: 'q5',
      question: 'I understand concepts better when:',
      options: [
        { text: 'I can see examples or demonstrations', style: 'visual' },
        { text: 'Someone explains it to me verbally', style: 'auditory' },
        { text: 'I can work through it step by step', style: 'kinesthetic' },
        { text: 'I can read detailed explanations', style: 'reading' }
      ]
    }
  ];

  // Sample students
  const students = [
    {
      id: 'student1',
      name: 'Oliver Thompson',
      age: 13,
      yearGroup: 'Year 9',
      lastAssessment: 'Never',
      avatar: '/avatars/oliver.jpg'
    },
    {
      id: 'student2',
      name: 'Isabella Martinez',
      age: 11,
      yearGroup: 'Year 7',
      lastAssessment: '3 months ago',
      avatar: '/avatars/isabella.jpg'
    },
    {
      id: 'student3',
      name: 'Noah Davies',
      age: 15,
      yearGroup: 'Year 11',
      lastAssessment: '6 months ago',
      avatar: '/avatars/noah.jpg'
    }
  ];

  // Learning style descriptions
  const learningStyles = [
    {
      id: 'visual',
      name: 'Visual Learner',
      icon: Eye,
      color: 'blue',
      description: 'Learns best through seeing information presented visually',
      characteristics: [
        'Prefers diagrams, charts, and visual aids',
        'Benefits from colour-coding and highlighting',
        'Remembers faces better than names',
        'Enjoys visual arts and design'
      ],
      strategies: [
        'Use mind maps and concept diagrams',
        'Incorporate videos and visual demonstrations',
        'Provide written instructions with images',
        'Use colour-coding for organisation'
      ]
    },
    {
      id: 'auditory',
      name: 'Auditory Learner',
      icon: Ear,
      color: 'green',
      description: 'Learns best through listening and verbal communication',
      characteristics: [
        'Prefers verbal explanations and discussions',
        'Benefits from reading aloud',
        'Remembers names better than faces',
        'Enjoys music and spoken word'
      ],
      strategies: [
        'Include group discussions and debates',
        'Use audio recordings and podcasts',
        'Encourage verbal repetition',
        'Incorporate music and rhythm'
      ]
    },
    {
      id: 'kinesthetic',
      name: 'Kinesthetic Learner',
      icon: Hand,
      color: 'purple',
      description: 'Learns best through hands-on experience and movement',
      characteristics: [
        'Prefers hands-on activities and experiments',
        'Benefits from movement while learning',
        'Remembers what they did rather than saw or heard',
        'Enjoys sports and physical activities'
      ],
      strategies: [
        'Incorporate hands-on experiments and projects',
        'Allow movement and breaks during learning',
        'Use manipulatives and interactive materials',
        'Include role-play and simulations'
      ]
    },
    {
      id: 'reading',
      name: 'Reading/Writing Learner',
      icon: Book,
      color: 'amber',
      description: 'Learns best through reading and writing activities',
      characteristics: [
        'Prefers written instructions and text',
        'Benefits from note-taking and journaling',
        'Remembers written information well',
        'Enjoys reading and creative writing'
      ],
      strategies: [
        'Provide comprehensive written materials',
        'Encourage detailed note-taking',
        'Use writing exercises and essays',
        'Include reading assignments and research'
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, style: string) => {
    setAnswers({ ...answers, [questionId]: style });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setAssessmentComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const styleCounts: Record<string, number> = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0
    };

    Object.values(answers).forEach(style => {
      if (style in styleCounts) {
        styleCounts[style]++;
      }
    });

    const total = Object.values(styleCounts).reduce((sum, count) => sum + count, 0);
    const percentages: Record<string, number> = {};

    Object.entries(styleCounts).forEach(([style, count]) => {
      percentages[style] = total > 0 ? Math.round((count / total) * 100) : 0;
    });

    return percentages;
  };

  const getTopLearningStyle = () => {
    const results = calculateResults();
    let topStyle = 'visual';
    let topScore = 0;

    Object.entries(results).forEach(([style, score]) => {
      if (score > topScore) {
        topScore = score;
        topStyle = style;
      }
    });

    return topStyle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Learning Style Assessment
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Learning Style
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify individual learning preferences to create personalised educational experiences that maximise engagement and achievement.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessment">Take Assessment</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Assessments Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <p className="text-sm text-gray-500">This academic year</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                    Style Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                  <p className="text-sm text-gray-500">Main learning styles</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Performance Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">+24%</div>
                  <p className="text-sm text-gray-500">Average improvement</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>About Learning Styles</CardTitle>
                  <CardDescription>Understanding different ways students learn best</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Learning styles refer to the preferred ways individuals absorb, process, and retain information. 
                      While students can learn through multiple modalities, most have a dominant style that makes 
                      learning more effective and enjoyable.
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Key Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Improved information retention and recall</li>
                        <li>Increased engagement and motivation</li>
                        <li>Better academic performance</li>
                        <li>Enhanced self-awareness and metacognition</li>
                        <li>More effective study strategies</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          Remember: Learning styles are preferences, not limitations. Students benefit from 
                          exposure to multiple teaching methods.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Style Types</CardTitle>
                  <CardDescription>The four main learning modalities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningStyles.map((style) => (
                      <div key={style.id} className={`border rounded-lg p-3 bg-${style.color}-50 border-${style.color}-200`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full bg-${style.color}-100 flex items-center justify-center mr-2`}>
                            <style.icon className={`w-4 h-4 text-${style.color}-600`} />
                          </div>
                          <h4 className="font-medium">{style.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </div>
                    ))}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Discover Learning Styles?</h3>
                    <p className="text-gray-600 mb-4">
                      Take our comprehensive assessment to identify learning preferences and create personalised educational strategies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button onClick={() => setActiveTab('assessment')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Assessment
                      </Button>
                      <Button variant="outline">
                        View Sample Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Assessment Tab */}
          <TabsContent value="assessment">
            {!assessmentStarted ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Select Student</h2>
                    <p className="text-gray-600">
                      Choose a student to assess their learning style
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
                                <p className="text-sm text-gray-500">{student.yearGroup} • Age {student.age}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Last Assessment</p>
                            <p className="text-sm">{student.lastAssessment}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Style Assessment</CardTitle>
                      <CardDescription>
                        A comprehensive assessment to identify learning preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Assessment Overview</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="font-medium">Duration</span>
                              </div>
                              <p className="text-gray-600">10-15 minutes</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="font-medium">Questions</span>
                              </div>
                              <p className="text-gray-600">{assessmentQuestions.length} questions</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <Target className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="font-medium">Purpose</span>
                              </div>
                              <p className="text-gray-600">Identify dominant learning style</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <BarChart2 className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="font-medium">Output</span>
                              </div>
                              <p className="text-gray-600">Detailed learning profile</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Instructions</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            <li>Answer all questions honestly based on your preferences</li>
                            <li>There are no right or wrong answers</li>
                            <li>Choose the option that best describes how you prefer to learn</li>
                            <li>Complete the assessment in one sitting for best results</li>
                            <li>Results will be available immediately after completion</li>
                          </ol>
                        </div>
                        
                        {selectedStudent ? (
                          <Button 
                            onClick={() => setAssessmentStarted(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Begin Assessment
                          </Button>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Please select a student to begin the assessment
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : assessmentComplete ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Complete!</CardTitle>
                  <CardDescription>
                    Learning style profile for {students.find(s => s.id === selectedStudent)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700 font-medium">Assessment completed successfully</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Learning Style Results</h3>
                      
                      <div className="space-y-4">
                        {Object.entries(calculateResults()).map(([style, percentage]) => {
                          const styleInfo = learningStyles.find(s => s.id === style);
                          if (!styleInfo) return null;
                          
                          return (
                            <div key={style} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <styleInfo.icon className={`w-5 h-5 text-${styleInfo.color}-500 mr-2`} />
                                  <span className="font-medium">{styleInfo.name}</span>
                                </div>
                                <span className="text-sm font-medium">{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Primary Learning Style</h3>
                      {(() => {
                        const topStyle = getTopLearningStyle();
                        const styleInfo = learningStyles.find(s => s.id === topStyle);
                        if (!styleInfo) return null;
                        
                        return (
                          <div className={`border rounded-lg p-4 bg-${styleInfo.color}-50 border-${styleInfo.color}-200`}>
                            <div className="flex items-center mb-3">
                              <div className={`w-10 h-10 rounded-full bg-${styleInfo.color}-100 flex items-center justify-center mr-3`}>
                                <styleInfo.icon className={`w-5 h-5 text-${styleInfo.color}-600`} />
                              </div>
                              <div>
                                <h4 className="font-medium text-lg">{styleInfo.name}</h4>
                                <p className="text-sm text-gray-600">{styleInfo.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium mb-2">Key Characteristics:</h5>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {styleInfo.characteristics.map((char, index) => (
                                    <li key={index}>{char}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-medium mb-2">Recommended Strategies:</h5>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {styleInfo.strategies.map((strategy, index) => (
                                    <li key={index}>{strategy}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => {
                        setAssessmentStarted(false);
                        setAssessmentComplete(false);
                        setCurrentQuestion(0);
                        setAnswers({});
                      }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retake Assessment
                      </Button>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button onClick={() => setActiveTab('resources')}>
                        View Resources
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Question {currentQuestion + 1} of {assessmentQuestions.length}</CardTitle>
                      <CardDescription>
                        Select the option that best describes your learning preference
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {Object.keys(answers).length} / {assessmentQuestions.length} answered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Progress 
                      value={(currentQuestion + 1) / assessmentQuestions.length * 100} 
                      className="h-2"
                    />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {assessmentQuestions[currentQuestion].question}
                      </h3>
                      
                      <RadioGroup
                        value={answers[assessmentQuestions[currentQuestion].id] || ''}
                        onValueChange={(value) => handleAnswerSelect(assessmentQuestions[currentQuestion].id, value)}
                      >
                        <div className="space-y-3">
                          {assessmentQuestions[currentQuestion].options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <RadioGroupItem value={option.style} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!answers[assessmentQuestions[currentQuestion].id]}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {currentQuestion === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Assessment Results</h2>
                  <p className="text-gray-600">View and manage learning style assessment results</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Eye className="w-8 h-8 text-blue-500" />
                      <span className="text-2xl font-bold">32%</span>
                    </div>
                    <p className="text-sm font-medium">Visual Learners</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Ear className="w-8 h-8 text-green-500" />
                      <span className="text-2xl font-bold">28%</span>
                    </div>
                    <p className="text-sm font-medium">Auditory Learners</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Hand className="w-8 h-8 text-purple-500" />
                      <span className="text-2xl font-bold">25%</span>
                    </div>
                    <p className="text-sm font-medium">Kinesthetic Learners</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Book className="w-8 h-8 text-amber-500" />
                      <span className="text-2xl font-bold">15%</span>
                    </div>
                    <p className="text-sm font-medium">Reading/Writing</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>Latest learning style assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        student: 'Emma Wilson',
                        date: 'June 5, 2025',
                        primaryStyle: 'Visual',
                        secondaryStyle: 'Kinesthetic',
                        yearGroup: 'Year 8'
                      },
                      {
                        student: 'Liam Brown',
                        date: 'June 4, 2025',
                        primaryStyle: 'Auditory',
                        secondaryStyle: 'Reading/Writing',
                        yearGroup: 'Year 10'
                      },
                      {
                        student: 'Sophia Chen',
                        date: 'June 3, 2025',
                        primaryStyle: 'Kinesthetic',
                        secondaryStyle: 'Visual',
                        yearGroup: 'Year 7'
                      }
                    ].map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{result.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{result.student}</p>
                            <p className="text-sm text-gray-500">{result.yearGroup} • {result.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Primary</p>
                            <Badge variant="outline">{result.primaryStyle}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Secondary</p>
                            <Badge variant="outline">{result.secondaryStyle}</Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            View Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Style Trends</CardTitle>
                  <CardDescription>Distribution and changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <PieChart className="w-8 h-8 text-gray-400" />
                    <p className="ml-2 text-gray-500">Learning style distribution chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Learning Style Resources</h2>
                <p className="text-gray-600">
                  Teaching strategies and resources for different learning styles
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {learningStyles.map((style) => (
                  <Card key={style.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <style.icon className={`w-5 h-5 mr-2 text-${style.color}-500`} />
                        {style.name} Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Teaching Strategies</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {style.strategies.slice(0, 3).map((strategy, index) => (
                              <li key={index}>{strategy}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Recommended Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Interactive Whiteboards</Badge>
                            <Badge variant="outline">Educational Videos</Badge>
                            <Badge variant="outline">Learning Apps</Badge>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download {style.name} Guide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                  <CardDescription>Further reading and professional development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Research Papers</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Latest research on learning styles and educational outcomes
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Papers
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Professional Development</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Courses and workshops on differentiated instruction
                      </p>
                      <Button variant="outline" size="sm">
                        <Award className="w-4 h-4 mr-2" />
                        View Courses
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Assessment Templates</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Downloadable templates for classroom use
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Templates
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Video Tutorials</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        How-to guides for implementing learning style strategies
                      </p>
                      <Button variant="outline" size="sm">
                        <Palette className="w-4 h-4 mr-2" />
                        Watch Videos
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

export default LearningStyleAssessmentPage;