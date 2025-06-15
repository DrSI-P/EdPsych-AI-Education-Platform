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
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Briefcase,
  GraduationCap,
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
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Star,
  Heart,
  Target,
  Zap,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  Layers,
  Package,
  Globe,
  Map,
  Compass,
  Navigation,
  Search,
  Filter,
  Settings,
  HelpCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Building,
  School,
  Home,
  User,
  UserCheck,
  UserPlus,
  ClipboardCheck,
  ClipboardList,
  Clipboard,
  FileCheck,
  FilePlus,
  FileSearch,
  FolderOpen,
  FolderPlus,
  Database,
  Server,
  Cloud,
  Lock,
  Key,
  ShieldCheck,
  ShieldAlert,
  Gift,
  Lightbulb,
  Fingerprint,
  Eye,
  EyeOff,
  Hand,
  Accessibility,
  Flower,
  Sun,
  Moon,
  Edit,
  Edit2,
  Edit3,
  Palette,
  Brush
} from 'lucide-react';

interface ProfessionalProps {
  className?: string;
}

export function Professional({ className = '' }: ProfessionalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  // Professional data
  const [professionalData, setProfessionalData] = useState({
    profile: {
      name: session?.user?.name || 'Professional',
      email: session?.user?.email || '',
      title: 'Educational Psychologist',
      organization: 'Local Education Authority',
      qualifications: ['BSc Psychology', 'MSc Educational Psychology', 'DEdPsy', 'HCPC Registered'],
      specializations: ['Autism Spectrum', 'ADHD', 'Dyslexia', 'Emotional Regulation', 'Trauma-Informed Practice'],
      yearsExperience: 12,
      cpdHours: 85,
      cpdTarget: 100,
      registrationNumber: 'PYL12345',
      nextRevalidation: '2026-03-15'
    },
    stats: {
      activeClients: 42,
      assessmentsCompleted: 156,
      reportsWritten: 89,
      consultationsHeld: 234,
      schoolsSupported: 12,
      trainingsDelivered: 18,
      averageImpactScore: 8.7,
      clientSatisfaction: 96,
      referralWaitTime: 3.5,
      interventionSuccess: 82
    },
    clients: [
      {
        id: '1',
        initials: 'J.S.',
        age: 8,
        school: 'Oakwood Primary',
        referralReason: 'Learning difficulties',
        status: 'Active',
        nextReview: '2025-06-20',
        progress: 65,
        riskLevel: 'medium',
        interventions: ['Cognitive assessment', 'Learning support plan', 'Teacher consultation']
      },
      {
        id: '2',
        initials: 'E.M.',
        age: 14,
        school: 'City Academy',
        referralReason: 'Anxiety and school refusal',
        status: 'Active',
        nextReview: '2025-06-18',
        progress: 78,
        riskLevel: 'high',
        interventions: ['CBT', 'School liaison', 'Family therapy']
      },
      {
        id: '3',
        initials: 'A.P.',
        age: 11,
        school: 'St. Mary\'s School',
        referralReason: 'ADHD assessment',
        status: 'Assessment',
        nextReview: '2025-06-22',
        progress: 40,
        riskLevel: 'low',
        interventions: ['ADHD screening', 'Observation', 'Multi-agency meeting']
      }
    ],
    assessmentTools: [
      {
        id: '1',
        name: 'WISC-V',
        category: 'Cognitive',
        lastUsed: '2025-06-10',
        usageCount: 45,
        licensed: true,
        expiryDate: '2026-01-15'
      },
      {
        id: '2',
        name: 'ADOS-2',
        category: 'Autism',
        lastUsed: '2025-06-12',
        usageCount: 28,
        licensed: true,
        expiryDate: '2025-12-31'
      },
      {
        id: '3',
        name: 'Conners 3',
        category: 'ADHD',
        lastUsed: '2025-06-08',
        usageCount: 62,
        licensed: true,
        expiryDate: '2026-03-31'
      }
    ],
    upcomingAppointments: [
      {
        id: '1',
        type: 'Assessment',
        client: 'T.R.',
        location: 'Clinic Room A',
        date: '2025-06-17',
        time: '09:00',
        duration: 120
      },
      {
        id: '2',
        type: 'School Visit',
        client: 'Multiple',
        location: 'Riverside Academy',
        date: '2025-06-17',
        time: '14:00',
        duration: 180
      },
      {
        id: '3',
        type: 'Consultation',
        client: 'M.L.',
        location: 'Virtual',
        date: '2025-06-18',
        time: '10:30',
        duration: 60
      }
    ],
    resources: [
      {
        id: '1',
        title: 'Autism Intervention Strategies Toolkit',
        type: 'toolkit',
        category: 'Intervention',
        downloads: 156,
        rating: 4.8,
        lastUpdated: '2025-05-20'
      },
      {
        id: '2',
        title: 'Executive Function Assessment Battery',
        type: 'assessment',
        category: 'Assessment',
        downloads: 89,
        rating: 4.9,
        lastUpdated: '2025-05-15'
      },
      {
        id: '3',
        title: 'Trauma-Informed Schools Guide',
        type: 'guide',
        category: 'Training',
        downloads: 234,
        rating: 4.7,
        lastUpdated: '2025-05-10'
      }
    ],
    trainings: [
      {
        id: '1',
        title: 'Understanding Neurodiversity in Education',
        date: '2025-06-25',
        time: '09:30-16:30',
        location: 'County Hall',
        attendees: 45,
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'EHCP Writing Workshop',
        date: '2025-07-02',
        time: '13:00-17:00',
        location: 'Virtual',
        attendees: 28,
        status: 'scheduled'
      }
    ]
  });

  // Features for professionals
  const professionalFeatures = [
    {
      title: 'Client Management',
      description: 'Secure case management with progress tracking',
      icon: Users,
      href: '/professional/clients',
      color: 'bg-blue-500',
      features: ['Case notes', 'Progress monitoring', 'Report generation', 'Secure messaging']
    },
    {
      title: 'Assessment Suite',
      description: 'Digital assessment tools and scoring',
      icon: ClipboardCheck,
      href: '/professional/assessments',
      color: 'bg-purple-500',
      features: ['Digital tests', 'Auto-scoring', 'Norm comparisons', 'Report templates']
    },
    {
      title: 'Resource Library',
      description: 'Evidence-based interventions and materials',
      icon: BookOpen,
      href: '/professional/resources',
      color: 'bg-green-500',
      features: ['Intervention guides', 'Worksheets', 'Training materials', 'Research papers']
    },
    {
      title: 'CPD Tracker',
      description: 'Professional development and certification',
      icon: Award,
      href: '/professional/cpd',
      color: 'bg-orange-500',
      features: ['Course tracking', 'Certificate storage', 'Reflection logs', 'CPD planning']
    },
    {
      title: 'Consultation Hub',
      description: 'Virtual consultation and collaboration tools',
      icon: Video,
      href: '/professional/consultation',
      color: 'bg-pink-500',
      features: ['Video sessions', 'Screen sharing', 'Whiteboards', 'Session recording']
    },
    {
      title: 'Data Analytics',
      description: 'Service metrics and outcome tracking',
      icon: BarChart,
      href: '/professional/analytics',
      color: 'bg-indigo-500',
      features: ['Outcome measures', 'Service stats', 'Impact reports', 'Trend analysis']
    }
  ];

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Helper functions
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Assessment': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading professional portal...</p>
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
            <Briefcase className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Professional Portal</h1>
              <p className="text-lg text-muted-foreground">
                {professionalData.profile.title} • {professionalData.profile.organization}
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/professional/new-referral">
                <UserPlus className="h-4 w-4 mr-1" />
                New Referral
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/professional/reports">
                <FileText className="h-4 w-4 mr-1" />
                Reports
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            </Button>
          </div>
        </div>

        {/* Professional Registration Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>HCPC Registration:</strong> {professionalData.profile.registrationNumber} • 
            <strong> Next Revalidation:</strong> {new Date(professionalData.profile.nextRevalidation).toLocaleDateString()} • 
            <strong> CPD Hours:</strong> {professionalData.profile.cpdHours}/{professionalData.profile.cpdTarget}
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
                <div className="text-2xl font-bold text-primary">{professionalData.stats.activeClients}</div>
                <p className="text-xs text-muted-foreground">Active Cases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{professionalData.stats.assessmentsCompleted}</div>
                <p className="text-xs text-muted-foreground">Assessments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{professionalData.stats.reportsWritten}</div>
                <p className="text-xs text-muted-foreground">Reports</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{professionalData.stats.consultationsHeld}</div>
                <p className="text-xs text-muted-foreground">Consultations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{professionalData.stats.schoolsSupported}</div>
                <p className="text-xs text-muted-foreground">Schools</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{professionalData.stats.trainingsDelivered}</div>
                <p className="text-xs text-muted-foreground">Trainings</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{professionalData.stats.averageImpactScore}/10</div>
                <p className="text-xs text-muted-foreground">Impact Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{professionalData.stats.clientSatisfaction}%</div>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{professionalData.stats.referralWaitTime}w</div>
                <p className="text-xs text-muted-foreground">Wait Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{professionalData.stats.interventionSuccess}%</div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {professionalData.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            appointment.type === 'Assessment' ? 'bg-blue-100' :
                            appointment.type === 'School Visit' ? 'bg-green-100' :
                            'bg-purple-100'
                          }`}>
                            {appointment.type === 'Assessment' ? (
                              <ClipboardCheck className="h-4 w-4 text-blue-600" />
                            ) : appointment.type === 'School Visit' ? (
                              <School className="h-4 w-4 text-green-600" />
                            ) : (
                              <Video className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.client} • {appointment.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.time}</p>
                          <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Calendar
                  </Button>
                </CardFooter>
              </Card>

              {/* Active Cases Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Active Cases
                  </CardTitle>
                  <CardDescription>
                    Clients requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {professionalData.clients.filter(c => c.status === 'Active').map((client) => (
                      <Card key={client.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{client.initials}</p>
                                <Badge className={getStatusColor(client.status)} variant="secondary">
                                  {client.status}
                                </Badge>
                                <Badge className={getRiskColor(client.riskLevel)} variant="outline">
                                  {client.riskLevel} risk
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Age {client.age} • {client.school}
                              </p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mb-2">{client.referralReason}</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{client.progress}%</span>
                              </div>
                              <Progress value={client.progress} className="h-2 w-32" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Next review: {new Date(client.nextReview).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                      <FilePlus className="h-4 w-4 mr-1" />
                      New Report
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Assessment
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CPD Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    CPD Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Annual CPD Hours</span>
                        <span className="font-medium">
                          {professionalData.profile.cpdHours}/{professionalData.profile.cpdTarget}
                        </span>
                      </div>
                      <Progress 
                        value={(professionalData.profile.cpdHours / professionalData.profile.cpdTarget) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent CPD:</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          Trauma-Informed Practice
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          ADOS-2 Refresher
                        </li>
                        <li className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                          Supervision Skills (In Progress)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View CPD Log
                  </Button>
                </CardFooter>
              </Card>

              {/* Resource Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Resource Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resources Created</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Downloads</span>
                      <span className="font-medium">479</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Manage your caseload and track client progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clients..." className="pl-9" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    New Client
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionalData.clients.map((client) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{client.initials}</CardTitle>
                          <CardDescription>
                            Age {client.age} • {client.school}
                          </CardDescription>
                        </div>
                        <Badge className={getRiskColor(client.riskLevel)} variant="outline">
                          {client.riskLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{client.referralReason}</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{client.progress}%</span>
                          </div>
                          <Progress value={client.progress} className="h-2" />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Status: {client.status}</span>
                          <span>Next: {new Date(client.nextReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Tools</CardTitle>
              <CardDescription>
                Digital assessment tools and batteries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionalData.assessmentTools.map((tool) => (
                  <Card key={tool.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription>{tool.category}</CardDescription>
                        </div>
                        {tool.licensed ? (
                          <Badge variant="default">Licensed</Badge>
                        ) : (
                          <Badge variant="secondary">Trial</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Last Used:</span>
                          <span>{new Date(tool.lastUsed).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage Count:</span>
                          <span>{tool.usageCount}</span>
                        </div>
                        {tool.expiryDate && (
                          <div className="flex justify-between">
                            <span>License Expires:</span>
                            <span className={new Date(tool.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600' : ''}>
                              {new Date(tool.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Launch Tool
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>
                Your latest assessment sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">WISC-V - J.S.</p>
                    <p className="text-sm text-muted-foreground">Completed 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Conners 3 - A.P.</p>
                    <p className="text-sm text-muted-foreground">In progress</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Resources</CardTitle>
              <CardDescription>
                Evidence-based materials and intervention guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionalData.resources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{resource.category}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p>{resource.downloads} downloads</p>
                        <p>Updated {new Date(resource.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training & Workshops</CardTitle>
              <CardDescription>
                Deliver and manage professional training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionalData.trainings.map((training) => (
                  <Card key={training.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{training.title}</CardTitle>
                          <CardDescription>
                            {training.date} • {training.time} • {training.location}
                          </CardDescription>
                        </div>
                        <Badge variant={training.status === 'scheduled' ? 'default' : 'secondary'}>
                          {training.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{training.attendees} registered</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Materials
                          </Button>
                          <Button size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Training
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Service metrics chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcome Measures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Outcome trends</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
              <CardDescription>
                Your professional impact over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-sm text-muted-foreground">Lives Impacted</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">82%</p>
                  <p className="text-sm text-muted-foreground">Positive Outcomes</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <School className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Schools Supported</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">567</p>
                  <p className="text-sm text-muted-foreground">Staff Trained</p>
                </div>
              </div>
            </CardContent>
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
        <h2 className="text-2xl font-semibold mb-4">Professional Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalFeatures.map((feature, index) => (
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
                    Access Tool
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
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Professional Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access supervision, peer support, and professional resources
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  Supervision Hub
                </Button>
                <Button variant="outline">
                  Peer Network
                </Button>
                <Button>
                  Contact Support
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Additional professional-specific components
export const SupervisionNotes = () => (
  <Card>
    <CardHeader>
      <CardTitle>Supervision Notes</CardTitle>
    </CardHeader>
    <CardContent>
      <Textarea 
        placeholder="Record supervision notes here..."
        className="min-h-[200px]"
      />
    </CardContent>
    <CardFooter>
      <Button>Save Notes</Button>
    </CardFooter>
  </Card>
);

export const CaseConference = () => (
  <Card>
    <CardHeader>
      <CardTitle>Case Conference</CardTitle>
      <CardDescription>
        Multi-agency meeting coordination
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Label>Meeting Title</Label>
          <Input placeholder="e.g., TAC Meeting - J.S." />
        </div>
        <div>
          <Label>Attendees</Label>
          <Textarea placeholder="List attendees and their roles..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" />
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button>Schedule Meeting</Button>
    </CardFooter>
  </Card>
);

export { Professional as default };
