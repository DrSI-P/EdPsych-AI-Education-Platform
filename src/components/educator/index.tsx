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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText, 
  Clock, 
  BookOpen,
  Brain,
  PieChart,
  Settings,
  GraduationCap,
  Target,
  Sparkles,
  TrendingUp,
  Shield,
  ChevronRight,
  Home,
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  LineChart,
  Mail,
  Lightbulb,
  Award,
  Bell,
  School,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  Star,
  ThumbsUp,
  UserCheck,
  Zap,
  Globe,
  Briefcase,
  Heart,
  Layers,
  Package,
  Palette,
  Puzzle,
  Share2,
  Smartphone,
  Video,
  Volume2,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Database,
  Cloud,
  CloudOff,
  Sun,
  Moon,
  Laptop,
  Tablet,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Edit,
  Edit2,
  Edit3,
  Copy,
  Clipboard,
  Save,
  Trash,
  Trash2,
  Archive,
  FolderOpen,
  FolderPlus,
  FilePlus,
  FileCheck,
  FileX,
  FileSearch,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileLock,
  FileKey,
  Link2,
  ExternalLink,
  Anchor,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  Binary,
  Code,
  Code2,
  Terminal,
  Command,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Gitlab,
  Cpu,
  HardDrive,
  Server,
  Router,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  BatteryCharging,
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Power,
  PowerOff,
  Plug,
  Plug2,
  Zap as Lightning
} from 'lucide-react';

interface EducatorProps {
  className?: string;
}

export function Educator({ className = '' }: EducatorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Mock data for comprehensive educator portal
  const [educatorData, setEducatorData] = useState({
    profile: {
      name: session?.user?.name || 'Educator',
      email: session?.user?.email || '',
      school: 'Comprehensive Secondary School',
      department: 'Mathematics & Science',
      yearsExperience: 8,
      specializations: ['Special Educational Needs', 'Gifted & Talented', 'Digital Learning'],
      certifications: ['PGCE', 'QTS', 'SENDCo', 'Digital Education Specialist'],
      cpdHours: 45,
      cpdTarget: 60
    },
    stats: {
      totalStudents: 87,
      activeClasses: 4,
      pendingTasks: 12,
      completionRate: 78,
      averageStudentProgress: 72,
      upcomingMeetings: 3,
      recentMessages: 5,
      resourcesCreated: 45,
      assessmentsGraded: 156,
      parentInteractions: 23,
      safeguardingAlerts: 2,
      attendanceRate: 94.5,
      homeworkCompletion: 82,
      behaviorIncidents: 4,
      achievementPoints: 342
    },
    classes: [
      {
        id: '1',
        name: 'Year 8A Mathematics',
        subject: 'Mathematics',
        students: 24,
        averageProgress: 76,
        nextLesson: '2025-06-17 09:00',
        currentTopic: 'Algebraic Expressions',
        completedTopics: 12,
        totalTopics: 20,
        recentAssessmentScore: 72,
        attendanceRate: 95.2,
        homeworkCompletion: 85
      },
      {
        id: '2',
        name: 'Year 8B Mathematics',
        subject: 'Mathematics',
        students: 22,
        averageProgress: 68,
        nextLesson: '2025-06-17 11:00',
        currentTopic: 'Algebraic Expressions',
        completedTopics: 11,
        totalTopics: 20,
        recentAssessmentScore: 65,
        attendanceRate: 92.8,
        homeworkCompletion: 78
      },
      {
        id: '3',
        name: 'Year 9A Science',
        subject: 'Science',
        students: 26,
        averageProgress: 82,
        nextLesson: '2025-06-18 13:30',
        currentTopic: 'Chemical Reactions',
        completedTopics: 15,
        totalTopics: 22,
        recentAssessmentScore: 78,
        attendanceRate: 96.1,
        homeworkCompletion: 88
      },
      {
        id: '4',
        name: 'Year 9B Science',
        subject: 'Science',
        students: 25,
        averageProgress: 74,
        nextLesson: '2025-06-18 14:45',
        currentTopic: 'Chemical Reactions',
        completedTopics: 14,
        totalTopics: 22,
        recentAssessmentScore: 70,
        attendanceRate: 93.5,
        homeworkCompletion: 80
      }
    ],
    students: [
      {
        id: '1',
        name: 'Emma Thompson',
        year: 'Year 8',
        classes: ['8A Mathematics', '8A Science'],
        overallProgress: 85,
        attendanceRate: 98,
        behaviorScore: 'Excellent',
        lastActive: '2025-06-15',
        parentContact: 'Regular',
        specialNeeds: false,
        giftedTalented: true,
        recentAchievements: ['Mathematics Award', 'Science Fair Winner'],
        subjects: [
          { name: 'Mathematics', score: 88, trend: 'up' },
          { name: 'Science', score: 92, trend: 'up' },
          { name: 'English', score: 84, trend: 'stable' }
        ]
      },
      {
        id: '2',
        name: 'James Wilson',
        year: 'Year 8',
        classes: ['8B Mathematics', '8B Science'],
        overallProgress: 62,
        attendanceRate: 82,
        behaviorScore: 'Good',
        lastActive: '2025-06-14',
        parentContact: 'Needed',
        specialNeeds: true,
        giftedTalented: false,
        recentAchievements: ['Improvement Award'],
        subjects: [
          { name: 'Mathematics', score: 65, trend: 'up' },
          { name: 'Science', score: 58, trend: 'down' },
          { name: 'English', score: 70, trend: 'stable' }
        ]
      },
      {
        id: '3',
        name: 'Sophia Ahmed',
        year: 'Year 9',
        classes: ['9A Science', '9A Mathematics'],
        overallProgress: 91,
        attendanceRate: 99,
        behaviorScore: 'Outstanding',
        lastActive: '2025-06-15',
        parentContact: 'Regular',
        specialNeeds: false,
        giftedTalented: true,
        recentAchievements: ['Academic Excellence', 'Student Leader'],
        subjects: [
          { name: 'Mathematics', score: 94, trend: 'up' },
          { name: 'Science', score: 92, trend: 'stable' },
          { name: 'English', score: 88, trend: 'up' }
        ]
      }
    ],
    resources: [
      {
        id: '1',
        title: 'Algebraic Expressions Worksheet',
        type: 'worksheet',
        subject: 'Mathematics',
        yearGroup: 'Year 8',
        downloads: 45,
        rating: 4.8,
        lastModified: '2025-06-10',
        shared: true
      },
      {
        id: '2',
        title: 'Chemical Reactions Interactive Presentation',
        type: 'presentation',
        subject: 'Science',
        yearGroup: 'Year 9',
        downloads: 38,
        rating: 4.9,
        lastModified: '2025-06-08',
        shared: true
      },
      {
        id: '3',
        title: 'Assessment: Quadratic Equations',
        type: 'assessment',
        subject: 'Mathematics',
        yearGroup: 'Year 9',
        downloads: 22,
        rating: 4.7,
        lastModified: '2025-06-05',
        shared: false
      }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Year 8 Parents Evening',
        date: '2025-06-17 17:00',
        type: 'meeting',
        priority: 'high',
        location: 'Main Hall',
        attendees: 48,
        preparation: 'Reports due'
      },
      {
        id: '2',
        title: 'Department Meeting',
        date: '2025-06-18 15:30',
        type: 'meeting',
        priority: 'medium',
        location: 'Staff Room',
        attendees: 12,
        preparation: 'Curriculum review'
      },
      {
        id: '3',
        title: 'GCSE Moderation',
        date: '2025-06-20 09:00',
        type: 'assessment',
        priority: 'high',
        location: 'Science Lab',
        attendees: 6,
        preparation: 'Sample work ready'
      }
    ]
  });

  // Features array for the main grid
  const features = [
    {
      id: 'dashboard',
      title: 'Educator Dashboard',
      description: 'Comprehensive overview of your classes, student progress, and teaching activities',
      icon: LayoutDashboard,
      href: '/educator/dashboard',
      color: 'bg-blue-500',
      stats: { label: 'Active Classes', value: educatorData.stats.activeClasses },
      features: ['Real-time analytics', 'Student progress tracking', 'Task management', 'Calendar integration']
    },
    {
      id: 'classes',
      title: 'Class Management',
      description: 'Manage your classes, student rosters, and curriculum planning',
      icon: Users,
      href: '/educator/classes',
      color: 'bg-purple-500',
      stats: { label: 'Total Students', value: educatorData.stats.totalStudents },
      features: ['Roster management', 'Seating charts', 'Group creation', 'Class schedules']
    },
    {
      id: 'admin-automation',
      title: 'Administrative Automation',
      description: 'AI-powered tools to automate reports, marking, and administrative tasks',
      icon: Sparkles,
      href: '/educator/administrative-automation',
      color: 'bg-green-500',
      stats: { label: 'Time Saved', value: '12h/week' },
      features: ['Auto-grading', 'Report generation', 'Feedback templates', 'Parent communications']
    },
    {
      id: 'calendar',
      title: 'Calendar Optimisation',
      description: 'Smart scheduling and time management for teaching activities',
      icon: CalendarDays,
      href: '/educator/calendar-optimisation',
      color: 'bg-orange-500',
      stats: { label: 'Upcoming', value: educatorData.stats.upcomingMeetings },
      features: ['Smart scheduling', 'Meeting management', 'Deadline tracking', 'Resource booking']
    },
    {
      id: 'data-viz',
      title: 'Data Visualisation',
      description: 'Advanced analytics and insights on student performance and progress',
      icon: LineChart,
      href: '/educator/data-visualisation',
      color: 'bg-indigo-500',
      stats: { label: 'Completion Rate', value: `${educatorData.stats.completionRate}%` },
      features: ['Performance trends', 'Gap analysis', 'Predictive insights', 'Custom reports']
    },
    {
      id: 'parent-comm',
      title: 'Parent Communication',
      description: 'Streamlined communication tools for parent engagement',
      icon: Mail,
      href: '/educator/parent-communication',
      color: 'bg-pink-500',
      stats: { label: 'New Messages', value: educatorData.stats.recentMessages },
      features: ['Message templates', 'Bulk communications', 'Meeting scheduler', 'Progress updates']
    }
  ];

  // AI Tools for teaching assistance
  const aiTools = [
    {
      title: 'Lesson Plan Generator',
      description: 'Create UK curriculum-aligned lesson plans in minutes',
      icon: BookOpen,
      action: 'Generate Plan',
      href: '/educator/ai-assistant/lesson-planner'
    },
    {
      title: 'Assessment Builder',
      description: 'Design adaptive assessments with instant marking',
      icon: ClipboardList,
      action: 'Create Assessment',
      href: '/educator/ai-assistant/assessment-builder'
    },
    {
      title: 'Feedback Assistant',
      description: 'Generate personalised student feedback efficiently',
      icon: MessageSquare,
      action: 'Write Feedback',
      href: '/educator/ai-assistant/feedback-generator'
    },
    {
      title: 'Resource Finder',
      description: 'Discover educational resources tailored to your needs',
      icon: Target,
      action: 'Find Resources',
      href: '/educator/ai-assistant/resource-finder'
    },
    {
      title: 'Differentiation Helper',
      description: 'Create differentiated materials for diverse learners',
      icon: Layers,
      action: 'Differentiate',
      href: '/educator/ai-assistant/differentiation'
    },
    {
      title: 'Behaviour Insights',
      description: 'Analyze behaviour patterns and intervention strategies',
      icon: Brain,
      action: 'Analyze',
      href: '/educator/ai-assistant/behaviour-analysis'
    }
  ];

  // Professional development modules
  const professionalDevelopment = [
    {
      title: 'Digital Teaching Excellence',
      progress: 75,
      hours: 6,
      deadline: '2025-07-01',
      category: 'Technology'
    },
    {
      title: 'Inclusive Education Strategies',
      progress: 45,
      hours: 8,
      deadline: '2025-07-15',
      category: 'SEN'
    },
    {
      title: 'Assessment for Learning',
      progress: 90,
      hours: 4,
      deadline: '2025-06-30',
      category: 'Pedagogy'
    }
  ];

  // Recent updates for activity feed
  const [recentUpdates] = useState([
    {
      type: 'achievement',
      title: 'Class 8A achieved 85% average in recent assessment',
      time: '2 hours ago',
      icon: Award,
      priority: 'success'
    },
    {
      type: 'alert',
      title: '3 students need additional support in Mathematics',
      time: '5 hours ago',
      icon: AlertCircle,
      priority: 'warning'
    },
    {
      type: 'progress',
      title: 'Weekly teaching goals 92% complete',
      time: '1 day ago',
      icon: TrendingUp,
      priority: 'info'
    },
    {
      type: 'safeguarding',
      title: 'Safeguarding concern logged - requires review',
      time: '1 day ago',
      icon: Shield,
      priority: 'urgent'
    },
    {
      type: 'resource',
      title: 'New curriculum resources available for Year 9 Science',
      time: '2 days ago',
      icon: Package,
      priority: 'info'
    }
  ]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      
      // Set up notifications
      setNotifications([
        { id: 1, message: 'Parent meeting reminder: Tomorrow at 17:00', read: false },
        { id: 2, message: 'New safeguarding training available', read: false },
        { id: 3, message: '5 assignments pending review', read: true }
      ]);
    };
    
    loadData();
  }, []);

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent':
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'warning':
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'info':
      case 'low':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading educator portal...</p>
        </div>
      </div>
    );
  }

  // Render main content
  return (
    <div className={`container mx-auto py-8 px-4 ${className}`}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <GraduationCap className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Educator Portal</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, {educatorData.profile.name}
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/dashboard">
                <UserCheck className="h-4 w-4 mr-1" />
                Quick Attendance
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/dashboard">
                <FilePlus className="h-4 w-4 mr-1" />
                New Assignment
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/dashboard">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Alert Banner for urgent items */}
        {educatorData.stats.safeguardingAlerts > 0 && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You have {educatorData.stats.safeguardingAlerts} safeguarding alerts requiring immediate attention.
              <Link href="/educator/dashboard" className="ml-2 underline font-medium">
                Review now
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </motion.div>

      {/* Quick Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{educatorData.stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{educatorData.stats.activeClasses}</div>
                <p className="text-xs text-muted-foreground">Classes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{educatorData.stats.pendingTasks}</div>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{educatorData.stats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{educatorData.stats.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{educatorData.stats.resourcesCreated}</div>
                <p className="text-xs text-muted-foreground">Resources</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{educatorData.stats.achievementPoints}</div>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{educatorData.stats.parentInteractions}</div>
                <p className="text-xs text-muted-foreground">Parent Comms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="development">CPD</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {educatorData.classes.slice(0, 2).map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${cls.subject === 'Mathematics' ? 'bg-blue-100' : 'bg-green-100'}`}>
                            <School className={`h-4 w-4 ${cls.subject === 'Mathematics' ? 'text-blue-600' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">{cls.currentTopic}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{cls.nextLesson.split(' ')[1]}</p>
                          <p className="text-xs text-muted-foreground">{cls.students} students</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/educator/calendar-optimisation">
                      View Full Schedule
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Recent Updates
                    </span>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {recentUpdates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getPriorityColor(update.priority)}`}>
                            <update.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{update.title}</p>
                            <p className="text-xs text-muted-foreground">{update.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Class Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Class Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {educatorData.classes.map((cls) => (
                      <div key={cls.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {cls.completedTopics}/{cls.totalTopics} topics • {cls.students} students
                            </p>
                          </div>
                          <Badge variant="outline">{cls.averageProgress}%</Badge>
                        </div>
                        <Progress value={cls.averageProgress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Professional Development */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Professional Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPD Hours This Year</span>
                        <span className="font-medium">{educatorData.profile.cpdHours}/{educatorData.profile.cpdTarget}</span>
                      </div>
                      <Progress value={(educatorData.profile.cpdHours / educatorData.profile.cpdTarget) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Active Courses</h4>
                    {professionalDevelopment.slice(0, 2).map((course, index) => (
                      <div key={index} className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="truncate">{course.title}</span>
                          <Badge variant="outline" className="text-xs">{course.progress}%</Badge>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                    <Link href="/professional-development">
                      View All Courses
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Student Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                    Student Alerts
                  </CardTitle>
                  <CardDescription>
                    Students requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {educatorData.students
                      .filter(s => s.attendanceRate < 85 || s.overallProgress < 65)
                      .slice(0, 3)
                      .map((student) => (
                        <div key={student.id} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.year}</p>
                            </div>
                            <Badge variant={student.parentContact === 'Needed' ? 'destructive' : 'outline'} className="text-xs">
                              {student.parentContact}
                            </Badge>
                          </div>
                          {student.attendanceRate < 85 && (
                            <div className="flex items-center text-xs text-orange-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Low attendance: {student.attendanceRate}%
                            </div>
                          )}
                          {student.overallProgress < 65 && (
                            <div className="flex items-center text-xs text-red-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Below target: {student.overallProgress}%
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                    <Link href="/educator/dashboard">
                      View All Students
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Quick Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href="/educator/dashboard">
                        <FileCheck className="h-4 w-4 mr-1" />
                        Mark Work
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href="/educator/parent-communication">
                        <Mail className="h-4 w-4 mr-1" />
                        Message
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href="/educator/dashboard">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href="/educator/calendar-optimisation">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                        <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.stats.label}: {feature.stats.value}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {feature.features.map((item, index) => (
                        <li key={index} className="flex items-center text-sm">
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
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="ai-tools" className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl">AI Teaching Assistant Suite</CardTitle>
              </div>
              <CardDescription>
                Leverage AI to reduce workload and enhance teaching effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((tool, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <tool.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                      <Button className="w-full" asChild>
                        <Link href={tool.href as any}>
                          {tool.action}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Generations</CardTitle>
                <CardDescription>Your recently created content using AI tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Year 8 Algebra Lesson Plan</p>
                        <p className="text-xs text-muted-foreground">Generated 2 days ago</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ClipboardList className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">Science Assessment - Chemical Reactions</p>
                        <p className="text-xs text-muted-foreground">Generated 1 week ago</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-sm">Parent Report - Emma Thompson</p>
                        <p className="text-xs text-muted-foreground">Generated 3 days ago</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Usage Statistics</CardTitle>
                <CardDescription>Your AI assistant productivity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Saved This Month</span>
                      <span className="font-medium text-green-600">48 hours</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Content Generated</span>
                      <span className="font-medium">127 items</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Automation Tasks</span>
                      <span className="font-medium">89 completed</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">94%</p>
                      <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">4.8/5</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Teaching Resources</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="worksheet">Worksheets</SelectItem>
                    <SelectItem value="presentation">Presentations</SelectItem>
                    <SelectItem value="assessment">Assessments</SelectItem>
                    <SelectItem value="lesson-plan">Lesson Plans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {educatorData.resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{resource.type}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{resource.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                  <CardDescription>
                    {resource.subject} • {resource.yearGroup}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{resource.downloads} downloads</span>
                    <span>Modified {resource.lastModified}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  {resource.shared && (
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Resource Library Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Library Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{educatorData.stats.resourcesCreated}</p>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">342</p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">28</p>
                  <p className="text-sm text-muted-foreground">Shared</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">4.7</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Development Tab */}
        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-primary" />
                Professional Development Overview
              </CardTitle>
              <CardDescription>
                Track your continuous professional development progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* CPD Progress */}
                <div>
                  <h3 className="font-semibold mb-3">Annual CPD Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Hours Completed</span>
                      <span className="font-medium">{educatorData.profile.cpdHours} / {educatorData.profile.cpdTarget} hours</span>
                    </div>
                    <Progress value={(educatorData.profile.cpdHours / educatorData.profile.cpdTarget) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {educatorData.profile.cpdTarget - educatorData.profile.cpdHours} hours remaining to meet annual target
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Active Courses */}
                <div>
                  <h3 className="font-semibold mb-3">Active Courses</h3>
                  <div className="space-y-4">
                    {professionalDevelopment.map((course, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {course.hours} hours • Due {course.deadline}
                              </p>
                            </div>
                            <Badge variant="outline">{course.category}</Badge>
                          </div>
                          <Progress value={course.progress} className="h-2 mt-3" />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/professional-development/course/${index}`}>
                                Continue
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h3 className="font-semibold mb-3">Your Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {educatorData.profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <Award className="h-5 w-5 text-primary mr-3" />
                        <span className="text-sm font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Specializations */}
                <div>
                  <h3 className="font-semibold mb-3">Areas of Specialization</h3>
                  <div className="flex flex-wrap gap-2">
                    {educatorData.profile.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/professional-development">
                  Browse All CPD Opportunities
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your teaching profile and current educational trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <Badge className="mb-2">New</Badge>
                    <h4 className="font-medium mb-1">AI in Education Masterclass</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn to integrate AI tools effectively in your classroom
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">12 hours</span>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Badge className="mb-2" variant="secondary">Popular</Badge>
                    <h4 className="font-medium mb-1">Trauma-Informed Teaching</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Support students with trauma-responsive practices
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">8 hours</span>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Help Section */}
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
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access our comprehensive educator resources, tutorials, and support
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/help/educator">
                    View Help Centre
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact/support">
                    Contact Support
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/educator/dashboard">
                    Go to Dashboard
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

export { Educator as default };