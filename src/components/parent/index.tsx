'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Home,
  Heart,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Bell,
  Shield,
  BookOpen,
  Activity,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  Video,
  Settings,
  HelpCircle,
  Star,
  ThumbsUp,
  Eye,
  Download,
  Upload,
  Share2,
  BarChart,
  PieChart,
  Target,
  Zap,
  Info,
  User,
  UserPlus,
  School,
  GraduationCap,
  Brain,
  Lightbulb,
  Briefcase,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  CheckSquare,
  XSquare,
  Flag,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  FileCheck,
  FileX,
  FolderOpen,
  FolderPlus,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  UserCheck,
  UserX,
  UserMinus,
  LogIn,
  LogOut,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Archive,
  Inbox,
  Send,
  Reply,
  Forward,
  Paperclip,
  Link2,
  ExternalLink,
  Navigation,
  Compass,
  Map,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Bluetooth,
  Cast,
  Airplay,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Image,
  Film,
  Music,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Speaker,
  Printer,
  Keyboard,
  Mouse,
  HardDrive,
  Cpu,
  Server,
  Database,
  CloudOff,
  Package,
  Box,
  Layers,
  Grid,
  List,
  LayoutGrid,
  LayoutList,
  Table,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface ParentProps {
  className?: string;
}

interface Child {
  id: string;
  name: string;
  year: string;
  school: string;
  profilePicture?: string;
  overallProgress: number;
  attendanceRate: number;
  behaviorScore: string;
  nextMeeting?: string;
  recentAchievements: string[];
  subjects: {
    name: string;
    teacher: string;
    grade: string;
    progress: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  upcomingAssignments: {
    subject: string;
    title: string;
    dueDate: string;
    status: 'not-started' | 'in-progress' | 'completed';
  }[];
  wellbeingScore: {
    overall: number;
    academic: number;
    social: number;
    emotional: number;
  };
}

function Parent({ className = '' }: ParentProps) {
  const { data: session } = useSession();
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [loading, setLoading] = useState(true);

  // Mock data for parent portal
  const [parentData, setParentData] = useState({
    profile: {
      name: session?.user?.name || 'Parent',
      email: session?.user?.email || '',
      phone: '+44 7700 900000',
      preferredContact: 'email',
      notificationSettings: {
        grades: true,
        attendance: true,
        behavior: true,
        assignments: true,
        meetings: true,
        wellbeing: true
      }
    },
    children: [
      {
        id: '1',
        name: 'Emma Thompson',
        year: 'Year 8',
        school: 'Comprehensive Secondary School',
        overallProgress: 85,
        attendanceRate: 98,
        behaviorScore: 'Excellent',
        nextMeeting: '2025-06-20 16:30',
        recentAchievements: ['Mathematics Award', 'Science Fair Winner', '100% Attendance'],
        subjects: [
          { name: 'Mathematics', teacher: 'Mr. Johnson', grade: 'A', progress: 88, trend: 'up' },
          { name: 'Science', teacher: 'Ms. Smith', grade: 'A+', progress: 92, trend: 'up' },
          { name: 'English', teacher: 'Mrs. Wilson', grade: 'A-', progress: 84, trend: 'stable' },
          { name: 'History', teacher: 'Mr. Brown', grade: 'B+', progress: 78, trend: 'up' },
          { name: 'Geography', teacher: 'Ms. Davis', grade: 'A-', progress: 82, trend: 'stable' }
        ],
        upcomingAssignments: [
          { subject: 'Mathematics', title: 'Algebra Quiz', dueDate: '2025-06-18', status: 'in-progress' },
          { subject: 'English', title: 'Essay: Romeo and Juliet', dueDate: '2025-06-22', status: 'not-started' },
          { subject: 'Science', title: 'Lab Report', dueDate: '2025-06-19', status: 'completed' }
        ],
        wellbeingScore: {
          overall: 88,
          academic: 90,
          social: 85,
          emotional: 89
        }
      },
      {
        id: '2',
        name: 'James Thompson',
        year: 'Year 6',
        school: 'St. Mary\'s Primary School',
        overallProgress: 78,
        attendanceRate: 95,
        behaviorScore: 'Good',
        nextMeeting: '2025-06-25 15:00',
        recentAchievements: ['Improved Reading Level', 'Football Team Captain'],
        subjects: [
          { name: 'Mathematics', teacher: 'Ms. Green', grade: 'B+', progress: 76, trend: 'up' },
          { name: 'English', teacher: 'Ms. Green', grade: 'B', progress: 72, trend: 'stable' },
          { name: 'Science', teacher: 'Mr. White', grade: 'A-', progress: 82, trend: 'up' }
        ],
        upcomingAssignments: [
          { subject: 'Mathematics', title: 'Fractions Worksheet', dueDate: '2025-06-17', status: 'in-progress' },
          { subject: 'English', title: 'Book Report', dueDate: '2025-06-20', status: 'not-started' }
        ],
        wellbeingScore: {
          overall: 82,
          academic: 78,
          social: 88,
          emotional: 80
        }
      }
    ] as Child[],
    messages: [
      {
        id: '1',
        from: 'Mr. Johnson',
        subject: 'Emma\'s Outstanding Performance',
        date: '2025-06-14',
        read: false,
        priority: 'normal',
        preview: 'I wanted to commend Emma on her exceptional work in mathematics this term...'
      },
      {
        id: '2',
        from: 'School Office',
        subject: 'Parent-Teacher Conference Schedule',
        date: '2025-06-13',
        read: true,
        priority: 'high',
        preview: 'Please confirm your attendance for the upcoming parent-teacher conferences...'
      },
      {
        id: '3',
        from: 'Ms. Green',
        subject: 'James - Reading Progress Update',
        date: '2025-06-12',
        read: true,
        priority: 'normal',
        preview: 'James has made significant improvements in his reading comprehension...'
      }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Parent-Teacher Conference - Emma',
        date: '2025-06-20',
        time: '16:30',
        location: 'Room 12',
        type: 'meeting'
      },
      {
        id: '2',
        title: 'Sports Day',
        date: '2025-06-28',
        time: '09:00',
        location: 'School Field',
        type: 'event'
      },
      {
        id: '3',
        title: 'Year 8 Parents Evening',
        date: '2025-07-05',
        time: '18:00',
        location: 'Main Hall',
        type: 'meeting'
      }
    ],
    schoolResources: [
      {
        id: '1',
        title: 'Supporting Your Child with Homework',
        type: 'guide',
        category: 'academic',
        downloadUrl: '#'
      },
      {
        id: '2',
        title: 'Mental Health and Wellbeing Resources',
        type: 'toolkit',
        category: 'wellbeing',
        downloadUrl: '#'
      },
      {
        id: '3',
        title: 'Online Safety Guide for Parents',
        type: 'guide',
        category: 'safety',
        downloadUrl: '#'
      }
    ]
  });

  // Load data on mount
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Get current child data
  const currentChild = parentData.children.find(child => child.id === selectedChild) || parentData.children[0];

  // Helper functions
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWellbeingEmoji = (score: number) => {
    if (score >= 80) return { icon: Smile, color: 'text-green-500' };
    if (score >= 60) return { icon: Meh, color: 'text-yellow-500' };
    return { icon: Frown, color: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading parent portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Parent Portal</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, {parentData.profile.name}
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/parent-portal/communication" as={'/parent-portal/communication' as any}>
                <Mail className="h-4 w-4 mr-1" />
                Messages ({parentData.messages.filter(m => !m.read).length})
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                <Calendar className="h-4 w-4 mr-1" />
                Book Meeting
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Child Selector */}
        {parentData.children.length > 1 && (
          <div className="flex gap-2 mb-4">
            {parentData.children.map(child => (
              <Button
                key={child.id}
                variant={selectedChild === child.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChild(child.id)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
          <TabsTrigger value="communication">Messages</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Child Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentChild.name} - Overview</span>
                    <Badge variant="outline">{currentChild.year}</Badge>
                  </CardTitle>
                  <CardDescription>{currentChild.school}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{currentChild.overallProgress}%</div>
                      <p className="text-xs text-muted-foreground">Overall Progress</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentChild.attendanceRate}%</div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentChild.behaviorScore}</div>
                      <p className="text-xs text-muted-foreground">Behavior</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{currentChild.wellbeingScore.overall}%</div>
                      <p className="text-xs text-muted-foreground">Wellbeing</p>
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentChild.recentAchievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Next Meeting */}
                  {currentChild.nextMeeting && (
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        Next meeting scheduled: {new Date(currentChild.nextMeeting).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentChild.subjects.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{subject.name}</p>
                              <div className="flex items-center gap-2">
                                <span className={'font-bold ' + getGradeColor(subject.grade)}>
                                  {subject.grade}
                                </span>
                                {subject.trend === 'up' && (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                )}
                                {subject.trend === 'down' && (
                                  <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                          </div>
                        </div>
                        <Progress value={subject.progress} className={'h-2 ' + getProgressColor(subject.progress)} />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                      View Detailed Reports
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Upcoming Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentChild.upcomingAssignments.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          assignment.status === 'completed' ? 'default' :
                          assignment.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {assignment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Wellbeing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    Wellbeing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        {(() => {
                          const emoji = getWellbeingEmoji(currentChild.wellbeingScore.overall);
                          const Icon = emoji.icon;
                          return <Icon className={'h-12 w-12 ' + emoji.color} />;
                        })()}
                      </div>
                      <p className="text-2xl font-bold">{currentChild.wellbeingScore.overall}%</p>
                      <p className="text-sm text-muted-foreground">Overall Wellbeing</p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Academic</span>
                          <span>{currentChild.wellbeingScore.academic}%</span>
                        </div>
                        <Progress value={currentChild.wellbeingScore.academic} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Social</span>
                          <span>{currentChild.wellbeingScore.social}%</span>
                        </div>
                        <Progress value={currentChild.wellbeingScore.social} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Emotional</span>
                          <span>{currentChild.wellbeingScore.emotional}%</span>
                        </div>
                        <Progress value={currentChild.wellbeingScore.emotional} className="h-2" />
                      </div>
                    </div>
                  </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Wellbeing Report
                    </Button>
                  </CardFooter>
                </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      Recent Messages
                    </span>
                    {parentData.messages.filter(m => !m.read).length > 0 && (
                      <Badge variant="destructive">
                        {parentData.messages.filter(m => !m.read).length} new
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {parentData.messages.slice(0, 3).map((message) => (
                        <div key={message.id} className={'p-3 rounded-lg ' + (!message.read ? 'bg-blue-50' : 'bg-muted/50')}>
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm">{message.from}</p>
                            <span className="text-xs text-muted-foreground">{message.date}</span>
                          </div>
                          <p className="text-sm font-medium mb-1">{message.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{message.preview}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/parent-portal/communication" as={'/parent-portal/communication' as any}>
                      View All Messages
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parentData.upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className={'p-2 rounded-full ' + (
                          event.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                        )}>
                          {event.type === 'meeting' ? (
                            <Users className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Calendar className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date} at {event.time} • {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Calendar
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance Details</CardTitle>
              <CardDescription>
                Comprehensive view of {currentChild.name}'s academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Chart Placeholder */}
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Performance Chart</span>
                </div>

                {/* Detailed Subject Reports */}
                <div className="space-y-4">
                  {currentChild.subjects.map((subject, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <Badge className={getGradeColor(subject.grade).replace('text-', 'bg-').replace('600', '100')}>
                            Grade: {subject.grade}
                          </Badge>
                        </div>
                        <CardDescription>Teacher: {subject.teacher}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View Reports
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact Teacher
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wellbeing Tab */}
        <TabsContent value="wellbeing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing & Development</CardTitle>
              <CardDescription>
                Supporting {currentChild.name}'s holistic development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Wellbeing Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Wellbeing Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(currentChild.wellbeingScore).map(([key, value]) => {
                        if (key === 'overall') return null;
                        return (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="capitalize font-medium">{key}</span>
                              <span className="text-sm">{value}%</span>
                            </div>
                            <Progress value={value} className="h-3" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Support Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Brain className="h-4 w-4 mr-2" />
                        Mental Health Resources
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Emotional Support Guide
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Social Skills Development
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Online Safety Resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wellbeing Tips */}
              <Alert className="bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Tip:</strong> Regular conversations about school experiences can significantly 
                  improve your child's emotional wellbeing and academic performance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages & Communication</CardTitle>
              <CardDescription>
                Stay connected with teachers and school staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parentData.messages.map((message) => (
                  <Card key={message.id} className={!message.read ? 'border-blue-200' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{message.subject}</CardTitle>
                          <CardDescription>From: {message.from} • {message.date}</CardDescription>
                        </div>
                        {message.priority === 'high' && (
                          <Badge variant="destructive">Important</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{message.preview}</p>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <div className="flex gap-2">
                        <Button size="sm">Read Full Message</Button>
                        <Button size="sm" variant="outline">Reply</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Compose New Message
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent Resources</CardTitle>
              <CardDescription>
                Helpful guides and resources to support your child's education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parentData.schoolResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <FileText className="h-5 w-5 text-primary" />
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Support */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto flex-col p-4" asChild>
                  <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                    <HelpCircle className="h-8 w-8 mb-2 text-primary" />
                    <span>Help Centre</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col p-4" asChild>
                  <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                    <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                    <span>FAQs</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col p-4" asChild>
                  <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                    <Phone className="h-8 w-8 mb-2 text-primary" />
                    <span>Contact School</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Quick Links */}
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
                <h3 className="text-lg font-semibold mb-1">Need Support?</h3>
                <p className="text-sm text-muted-foreground">
                  Access help resources or contact your child's school directly
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/parent-portal/resources" as={'/parent-portal/resources' as any}>
                    Parent Handbook
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                    Parent Workshops
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/parent-portal/dashboard" as={'/parent-portal/dashboard' as any}>
                    Full Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export { Parent };
export default Parent;