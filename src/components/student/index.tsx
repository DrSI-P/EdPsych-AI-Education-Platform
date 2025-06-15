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
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Brain,
  BookOpen,
  Target,
  Trophy,
  Star,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Zap,
  Sparkles,
  Activity,
  BarChart,
  PieChart,
  Award,
  MessageSquare,
  Users,
  Video,
  Mic,
  FileText,
  Download,
  Upload,
  Share2,
  Heart,
  Lightbulb,
  Palette,
  Music,
  Code,
  Calculator,
  Globe,
  Microscope,
  Paintbrush,
  Camera,
  Map,
  Compass,
  Timer,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Volume2,
  Headphones,
  Gamepad2,
  Puzzle,
  Dices,
  Medal,
  Flag,
  Mountain,
  Rocket,
  Telescope,
  Atom,
  FlaskConical,
  GraduationCap,
  School,
  Home,
  Bell,
  Settings,
  HelpCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  LayoutGrid,
  Smile,
  Coffee,
  Pizza,
  Apple,
  Sandwich,
  Cookie,
  IceCream,
  Popcorn,
  Cake,
  Candy,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Wind,
  Snowflake,
  Rainbow,
  Waves,
  TreePine,
  Flower,
  Bug,
  Bird,
  Fish,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Sparkle,
  Shield,
  Sword,
  Crown,
  Gem,
  Coins,
  Gift,
  PartyPopper,
  Balloon,
  Confetti,
  Fireworks,
  MagicWand,
  Wand2,
  Stars,
  Orbit,
  Saturn,
  Comet,
  Eclipse,
  Infinity,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Pentagon,
  Octagon,
  Diamond,
  Shapes,
  Layers,
  Package,
  Box,
  Archive,
  Folder,
  FolderOpen,
  File,
  FileCheck,
  FilePlus,
  FileX,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  Tag,
  Tags,
  Hash,
  AtSign,
  Mail,
  Send,
  MessageCircle,
  MessagesSquare,
  Bot,
  User,
  UserCheck,
  UserPlus,
  UserX,
  UsersRound,
  PersonStanding,
  Accessibility,
  Baby,
  Bike,
  Car,
  Train,
  Plane,
  Ship,
  Anchor,
  Navigation,
  MapPin,
  Milestone,
  Signpost,
  Route,
  FootprintsIcon,
  Footprints,
  HandMetal,
  Hand,
  Grab,
  Pointer,
  MousePointer2,
  Move,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Ear,
  EarOff,
  Megaphone,
  Speaker,
  Repeat,
  Repeat2,
  Rewind,
  FastForward,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Shuffle,
  Disc,
  Album,
  Radio,
  Podcast,
  Wifi,
  WifiOff,
  Bluetooth,
  Cast,
  Airplay,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  HardDrive,
  Cpu,
  MemoryStick,
  Router,
  Keyboard,
  Mouse,
  Joystick,
  Webcam,
  Projector,
  Printer,
  Scanner,
  Fax,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Voicemail,
  Video as VideoIcon,
  VideoOff,
  Film,
  Clapperboard,
  Tv,
  Youtube,
  Twitch,
  Netflix
} from 'lucide-react';

interface StudentProps {
  className?: string;
}

export function Student({ className = '' }: StudentProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Student data
  const [studentData, setStudentData] = useState({
    profile: {
      name: session?.user?.name || 'Student',
      email: session?.user?.email || '',
      grade: 'Year 10',
      school: 'Oakwood Academy',
      studentId: 'STU-2024-0156',
      joinDate: '2024-09-01',
      avatar: session?.user?.image || '',
      level: 42,
      xp: 8540,
      nextLevelXp: 10000,
      rank: 'Knowledge Seeker',
      badges: 24,
      achievements: 156,
      streak: 15
    },
    stats: {
      lessonsCompleted: 234,
      hoursLearned: 156,
      assignmentsSubmitted: 89,
      averageGrade: 87,
      attendanceRate: 96,
      participationScore: 92,
      questionsAsked: 145,
      questionsAnswered: 67,
      projectsCompleted: 12,
      certificatesEarned: 5
    },
    subjects: [
      {
        id: '1',
        name: 'Mathematics',
        icon: Calculator,
        teacher: 'Ms. Johnson',
        progress: 78,
        grade: 'A-',
        nextClass: '2025-06-16 09:00',
        assignments: 3,
        color: 'bg-blue-500'
      },
      {
        id: '2',
        name: 'Science',
        icon: FlaskConical,
        teacher: 'Dr. Smith',
        progress: 85,
        grade: 'A',
        nextClass: '2025-06-16 10:30',
        assignments: 2,
        color: 'bg-green-500'
      },
      {
        id: '3',
        name: 'English',
        icon: BookOpen,
        teacher: 'Mr. Thompson',
        progress: 92,
        grade: 'A+',
        nextClass: '2025-06-16 13:00',
        assignments: 1,
        color: 'bg-purple-500'
      },
      {
        id: '4',
        name: 'History',
        icon: Globe,
        teacher: 'Mrs. Davis',
        progress: 71,
        grade: 'B+',
        nextClass: '2025-06-17 09:00',
        assignments: 2,
        color: 'bg-orange-500'
      },
      {
        id: '5',
        name: 'Art',
        icon: Paintbrush,
        teacher: 'Ms. Garcia',
        progress: 88,
        grade: 'A',
        nextClass: '2025-06-17 14:00',
        assignments: 1,
        color: 'bg-pink-500'
      },
      {
        id: '6',
        name: 'Computer Science',
        icon: Code,
        teacher: 'Mr. Chen',
        progress: 95,
        grade: 'A+',
        nextClass: '2025-06-18 11:00',
        assignments: 0,
        color: 'bg-indigo-500'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'assignment',
        title: 'Completed Math Homework',
        subject: 'Mathematics',
        time: '2 hours ago',
        points: 50,
        icon: CheckCircle,
        color: 'text-green-500'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Earned "Problem Solver" Badge',
        subject: 'Mathematics',
        time: '3 hours ago',
        points: 100,
        icon: Award,
        color: 'text-yellow-500'
      },
      {
        id: '3',
        type: 'lesson',
        title: 'Attended Science Lab Session',
        subject: 'Science',
        time: '1 day ago',
        points: 30,
        icon: FlaskConical,
        color: 'text-blue-500'
      },
      {
        id: '4',
        type: 'project',
        title: 'Submitted History Essay',
        subject: 'History',
        time: '2 days ago',
        points: 75,
        icon: FileText,
        color: 'text-purple-500'
      }
    ],
    upcomingTasks: [
      {
        id: '1',
        title: 'Math Quiz - Chapter 7',
        subject: 'Mathematics',
        dueDate: '2025-06-18',
        type: 'quiz',
        priority: 'high',
        estimatedTime: '30 min'
      },
      {
        id: '2',
        title: 'Science Lab Report',
        subject: 'Science',
        dueDate: '2025-06-19',
        type: 'assignment',
        priority: 'medium',
        estimatedTime: '2 hours'
      },
      {
        id: '3',
        title: 'English Book Review',
        subject: 'English',
        dueDate: '2025-06-20',
        type: 'project',
        priority: 'medium',
        estimatedTime: '3 hours'
      },
      {
        id: '4',
        title: 'Art Portfolio Submission',
        subject: 'Art',
        dueDate: '2025-06-22',
        type: 'project',
        priority: 'low',
        estimatedTime: '4 hours'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Fast Learner',
        description: 'Complete 10 lessons in one week',
        icon: Rocket,
        unlocked: true,
        date: '2025-06-01',
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Problem Solver',
        description: 'Solve 100 math problems',
        icon: Brain,
        unlocked: true,
        date: '2025-05-28',
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Science Explorer',
        description: 'Complete all science experiments',
        icon: Microscope,
        unlocked: true,
        date: '2025-05-15',
        rarity: 'epic'
      },
      {
        id: '4',
        title: 'Master Scholar',
        description: 'Maintain A+ grades for 3 months',
        icon: Crown,
        unlocked: false,
        date: null,
        rarity: 'legendary'
      }
    ],
    learningPaths: [
      {
        id: '1',
        title: 'Advanced Mathematics',
        description: 'Master calculus and advanced algebra',
        icon: Calculator,
        progress: 45,
        totalModules: 12,
        completedModules: 5,
        nextModule: 'Introduction to Calculus'
      },
      {
        id: '2',
        title: 'Creative Writing',
        description: 'Develop your writing skills',
        icon: FileText,
        progress: 72,
        totalModules: 8,
        completedModules: 6,
        nextModule: 'Character Development'
      },
      {
        id: '3',
        title: 'Web Development',
        description: 'Build modern web applications',
        icon: Code,
        progress: 60,
        totalModules: 15,
        completedModules: 9,
        nextModule: 'React Fundamentals'
      }
    ]
  });

  // Learning features
  const learningFeatures = [
    {
      title: 'AI Study Buddy',
      description: 'Get personalized help anytime',
      icon: Bot,
      href: '/student/ai-buddy',
      color: 'bg-purple-500',
      features: ['24/7 assistance', 'Subject expert', 'Homework help', 'Exam prep']
    },
    {
      title: 'Interactive Lessons',
      description: 'Engaging multimedia content',
      icon: PlayCircle,
      href: '/student/lessons',
      color: 'bg-blue-500',
      features: ['Videos', 'Simulations', 'Quizzes', 'Games']
    },
    {
      title: 'Study Groups',
      description: 'Collaborate with classmates',
      icon: Users,
      href: '/student/groups',
      color: 'bg-green-500',
      features: ['Group chat', 'Shared notes', 'Projects', 'Peer learning']
    },
    {
      title: 'Progress Tracker',
      description: 'Monitor your academic journey',
      icon: TrendingUp,
      href: '/student/progress',
      color: 'bg-orange-500',
      features: ['Grades', 'Analytics', 'Goals', 'Achievements']
    },
    {
      title: 'Resource Library',
      description: 'Access study materials',
      icon: BookOpen,
      href: '/student/library',
      color: 'bg-pink-500',
      features: ['E-books', 'Past papers', 'Notes', 'References']
    },
    {
      title: 'Virtual Classroom',
      description: 'Join live sessions',
      icon: Video,
      href: '/student/classroom',
      color: 'bg-indigo-500',
      features: ['Live classes', 'Recording', 'Whiteboard', 'Breakout rooms']
    }
  ];

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Helper functions
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic':
        return 'bg-purple-500';
      case 'rare':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={studentData.profile.avatar} />
              <AvatarFallback>{studentData.profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Welcome back, {studentData.profile.name}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Level {studentData.profile.level} {studentData.profile.rank} • {studentData.profile.grade}
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
              <Trophy className="h-4 w-4 mr-1" />
              Leaderboard
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Level {studentData.profile.level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {studentData.profile.xp} / {studentData.profile.nextLevelXp} XP
            </span>
          </div>
          <Progress 
            value={(studentData.profile.xp / studentData.profile.nextLevelXp) * 100} 
            className="h-3"
          />
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="bg-orange-50">
              <Zap className="h-3 w-3 mr-1" />
              {studentData.profile.streak} day streak
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline">
                <Medal className="h-3 w-3 mr-1" />
                {studentData.profile.badges} badges
              </Badge>
              <Badge variant="outline">
                <Trophy className="h-3 w-3 mr-1" />
                {studentData.profile.achievements} achievements
              </Badge>
            </div>
          </div>
        </Card>
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
                <div className="text-2xl font-bold text-primary">{studentData.stats.lessonsCompleted}</div>
                <p className="text-xs text-muted-foreground">Lessons</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studentData.stats.hoursLearned}</div>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{studentData.stats.assignmentsSubmitted}</div>
                <p className="text-xs text-muted-foreground">Assignments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{studentData.stats.averageGrade}%</div>
                <p className="text-xs text-muted-foreground">Avg Grade</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{studentData.stats.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{studentData.stats.participationScore}%</div>
                <p className="text-xs text-muted-foreground">Participation</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{studentData.stats.questionsAsked}</div>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{studentData.stats.questionsAnswered}</div>
                <p className="text-xs text-muted-foreground">Answers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{studentData.stats.projectsCompleted}</div>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{studentData.stats.certificatesEarned}</div>
                <p className="text-xs text-muted-foreground">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="assignments">Tasks</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                    Today's Classes
                  </CardTitle>
                  <CardDescription>
                    Your schedule for {new Date().toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentData.subjects.slice(0, 3).map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${subject.color} bg-opacity-10`}>
                            <subject.icon className={`h-5 w-5 ${subject.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {subject.teacher} • {subject.nextClass.split(' ')[1]}
                            </p>
                          </div>
                        </div>
                        <Badge className={getGradeColor(subject.grade)} variant="secondary">
                          {subject.grade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Schedule
                  </Button>
                </CardFooter>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your learning progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.subject} • {activity.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50">
                          +{activity.points} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentData.upcomingTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{task.title}</p>
                          <Badge className={getPriorityColor(task.priority)} variant="secondary">
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{task.subject}</span>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Bot className="h-4 w-4 mr-1" />
                      AI Help
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Study
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Users className="h-4 w-4 mr-1" />
                      Groups
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Video className="h-4 w-4 mr-1" />
                      Classes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentData.subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-lg ${subject.color} bg-opacity-10`}>
                      <subject.icon className={`h-6 w-6 ${subject.color.replace('bg-', 'text-')}`} />
                    </div>
                    <Badge className={getGradeColor(subject.grade)} variant="secondary">
                      {subject.grade}
                    </Badge>
                  </div>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.teacher}</CardDescription>
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
                    <div className="flex justify-between text-sm">
                      <span>Next Class:</span>
                      <span className="font-medium">
                        {new Date(subject.nextClass).toLocaleString()}
                      </span>
                    </div>
                    {subject.assignments > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {subject.assignments} pending assignment{subject.assignments > 1 ? 's' : ''}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Go to Subject
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Assignments</CardTitle>
              <CardDescription>
                Manage your academic workload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.upcomingTasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <CardDescription>{task.subject}</CardDescription>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          Est. time: {task.estimatedTime}
                        </div>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2">
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button>
                        Start Working
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>
                    Your classes and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-3">{day}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {studentData.subjects.slice(0, 3).map((subject, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <div className={`p-1 rounded ${subject.color} bg-opacity-10`}>
                                <subject.icon className={`h-4 w-4 ${subject.color.replace('bg-', 'text-')}`} />
                              </div>
                              <span>{subject.name}</span>
                              <span className="text-muted-foreground">9:00 - 10:30</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
              <CardDescription>
                Your academic accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studentData.achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${!achievement.unlocked && 'opacity-50'}`}>
                    <CardContent className="p-6 text-center">
                      <div className={`h-16 w-16 mx-auto mb-3 rounded-full flex items-center justify-center ${achievement.unlocked ? getRarityColor(achievement.rarity) : 'bg-gray-300'}`}>
                        <achievement.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-medium mb-1">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <Badge variant="outline" className="text-xs">
                          Unlocked {new Date(achievement.date!).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>
                Your personalized learning journeys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.learningPaths.map((path) => (
                  <Card key={path.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <path.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{path.title}</CardTitle>
                            <CardDescription>{path.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{path.completedModules}/{path.totalModules} modules</span>
                          </div>
                          <Progress value={path.progress} className="h-3" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Next: {path.nextModule}
                          </span>
                          <Button size="sm">
                            Continue
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningFeatures.map((feature, index) => (
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
                      Explore
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">
                  Need help with your studies?
                </h3>
                <p className="text-primary-foreground/90">
                  Your AI study buddy is available 24/7 to help you succeed
                </p>
              </div>
              <Button size="lg" variant="secondary">
                <Bot className="mr-2 h-5 w-5" />
                Chat with AI Buddy
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Export additional components
export const StudyTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Timer</CardTitle>
        <CardDescription>
          Track your study sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-5xl font-bold font-mono">{formatTime(time)}</div>
          <div className="flex justify-center space-x-2">
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className={isRunning ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {isRunning ? (
                <>
                  <PauseCircle className="h-5 w-5 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setTime(0)}>
              <RefreshCw className="h-5 w-5 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AchievementUnlock = ({ achievement }: { achievement: any }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="fixed top-20 right-4 z-50"
  >
    <Card className="w-80 shadow-xl border-2 border-yellow-400">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
            <p className="text-sm text-muted-foreground">{achievement.title}</p>
            <Badge className="mt-1" variant="outline">+100 XP</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export { Student as default };