'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Home, 
  BookOpen, 
  Calendar, 
  BarChart, 
  MessageSquare,
  Bell,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Award,
  Zap,
  ArrowRight,
  PlusCircle,
  Search,
  ChevronRight,
  Mail,
  Phone,
  User,
  Lock
} from 'lucide-react';

// Parent Portal prototype
// This component demonstrates the concept of a comprehensive parent engagement system

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  yearGroup: string;
  avatar: string;
}

interface ActivityUpdate {
  id: string;
  childId: string;
  type: 'achievement' | 'assessment' | 'behavior' | 'attendance' | 'homework';
  title: string;
  description: string;
  date: string;
  status?: 'positive' | 'neutral' | 'needs-attention';
  subject?: string;
  score?: number;
  teacherName?: string;
  teacherMessage?: string;
  acknowledged: boolean;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'parent-evening' | 'school-event' | 'deadline' | 'meeting';
  childId?: string;
}

interface HomeworkItem {
  id: string;
  childId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'submitted' | 'late' | 'graded';
  grade?: string;
  feedback?: string;
  attachments?: string[];
}

interface MessageThread {
  id: string;
  with: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
}

export default function ParentPortalPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for selected child
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  // State for notification filter
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for message input
  const [messageInput, setMessageInput] = useState('');
  
  // State for selected message thread
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  // Children profiles
  const [children, setChildren] = useState<ChildProfile[]>([
    {
      id: 'child1',
      name: 'Emily Johnson',
      age: 9,
      yearGroup: 'Year 5',
      avatar: '👧'
    },
    {
      id: 'child2',
      name: 'James Johnson',
      age: 12,
      yearGroup: 'Year 8',
      avatar: '👦'
    }
  ]);
  
  // Activity updates
  const [activityUpdates, setActivityUpdates] = useState<ActivityUpdate[]>([
    {
      id: 'act1',
      childId: 'child1',
      type: 'achievement',
      title: 'Star of the Week',
      description: 'Emily was awarded Star of the Week for her excellent work in Mathematics.',
      date: '2025-05-17',
      status: 'positive',
      teacherName: 'Ms. Williams',
      acknowledged: false
    },
    {
      id: 'act2',
      childId: 'child1',
      type: 'assessment',
      title: 'Mathematics Assessment',
      description: 'End of unit assessment on fractions and decimals.',
      date: '2025-05-15',
      status: 'positive',
      subject: 'Mathematics',
      score: 92,
      teacherName: 'Ms. Williams',
      teacherMessage: 'Emily demonstrated excellent understanding of equivalent fractions and decimal conversion.',
      acknowledged: true
    },
    {
      id: 'act3',
      childId: 'child1',
      type: 'homework',
      title: 'Reading Comprehension',
      description: 'Complete pages 45-47 in the reading workbook.',
      date: '2025-05-16',
      status: 'neutral',
      subject: 'English',
      acknowledged: false
    },
    {
      id: 'act4',
      childId: 'child2',
      type: 'behavior',
      title: 'Positive Behavior Note',
      description: 'James helped a classmate who was struggling with their work.',
      date: '2025-05-17',
      status: 'positive',
      teacherName: 'Mr. Thompson',
      acknowledged: false
    },
    {
      id: 'act5',
      childId: 'child2',
      type: 'assessment',
      title: 'Science Quiz',
      description: 'Quiz on the solar system and space exploration.',
      date: '2025-05-14',
      status: 'needs-attention',
      subject: 'Science',
      score: 65,
      teacherName: 'Dr. Martinez',
      teacherMessage: 'James struggled with some concepts about planetary motion. Some additional review at home would be beneficial.',
      acknowledged: true
    },
    {
      id: 'act6',
      childId: 'child2',
      type: 'attendance',
      title: 'Late Arrival',
      description: 'James arrived 15 minutes late to school.',
      date: '2025-05-16',
      status: 'needs-attention',
      acknowledged: true
    }
  ]);
  
  // Upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: 'event1',
      title: 'Parent-Teacher Evening',
      date: '2025-05-25',
      time: '16:00 - 19:00',
      location: 'School Main Hall',
      description: 'Opportunity to discuss your child\'s progress with their teachers.',
      type: 'parent-evening'
    },
    {
      id: 'event2',
      title: 'School Sports Day',
      date: '2025-06-10',
      time: '09:30 - 15:00',
      location: 'School Playing Fields',
      description: 'Annual sports day event. Parents are welcome to attend and cheer on the children.',
      type: 'school-event'
    },
    {
      id: 'event3',
      title: 'Mathematics Project Deadline',
      date: '2025-05-30',
      time: '15:30',
      location: 'N/A',
      description: 'Final deadline for the term\'s mathematics project.',
      type: 'deadline',
      childId: 'child1'
    },
    {
      id: 'event4',
      title: 'Science Fair',
      date: '2025-06-15',
      time: '13:00 - 16:00',
      location: 'School Science Block',
      description: 'Annual science fair where students present their projects.',
      type: 'school-event',
      childId: 'child2'
    },
    {
      id: 'event5',
      title: 'Special Educational Needs Review',
      date: '2025-05-28',
      time: '14:00 - 15:00',
      location: 'Meeting Room 3',
      description: 'Regular review meeting to discuss support strategies.',
      type: 'meeting',
      childId: 'child2'
    }
  ]);
  
  // Homework items
  const [homeworkItems, setHomeworkItems] = useState<HomeworkItem[]>([
    {
      id: 'hw1',
      childId: 'child1',
      subject: 'Mathematics',
      title: 'Fractions Worksheet',
      description: 'Complete the worksheet on adding and subtracting fractions with different denominators.',
      dueDate: '2025-05-22',
      status: 'not-started'
    },
    {
      id: 'hw2',
      childId: 'child1',
      subject: 'English',
      title: 'Book Report',
      description: 'Write a 500-word report on the book "Charlotte\'s Web".',
      dueDate: '2025-05-29',
      status: 'in-progress'
    },
    {
      id: 'hw3',
      childId: 'child1',
      subject: 'Science',
      title: 'Plant Growth Experiment',
      description: 'Record the daily growth of your bean plant and prepare a short presentation.',
      dueDate: '2025-06-05',
      status: 'not-started'
    },
    {
      id: 'hw4',
      childId: 'child2',
      subject: 'History',
      title: 'Tudor Dynasty Research',
      description: 'Research and create a timeline of the Tudor dynasty, highlighting key events.',
      dueDate: '2025-05-23',
      status: 'completed'
    },
    {
      id: 'hw5',
      childId: 'child2',
      subject: 'Science',
      title: 'Forces and Motion Quiz',
      description: 'Complete the online quiz on forces and motion.',
      dueDate: '2025-05-20',
      status: 'submitted',
      grade: 'B+',
      feedback: 'Good understanding of Newton\'s laws, but some confusion about friction concepts.'
    },
    {
      id: 'hw6',
      childId: 'child2',
      subject: 'Mathematics',
      title: 'Algebra Practice',
      description: 'Complete exercises 5-10 on page 78 of the textbook.',
      dueDate: '2025-05-18',
      status: 'late'
    }
  ]);
  
  // Message threads
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([
    {
      id: 'msg1',
      with: 'Ms. Williams',
      role: 'Class Teacher - Year 5',
      avatar: '👩‍🏫',
      lastMessage: 'Emily has been making excellent progress with her reading comprehension skills.',
      lastMessageDate: '2025-05-17',
      unread: 1
    },
    {
      id: 'msg2',
      with: 'Mr. Thompson',
      role: 'Form Tutor - Year 8',
      avatar: '👨‍🏫',
      lastMessage: 'I'd like to discuss James's recent slastMessage: "I'd like to discuss James's recent science assessment results with you.",cience assessment results with you.',
      lastMessageDate: '2025-05-16',
      unread: 0
    },
    {
      id: 'msg3',
      with: 'Dr. Martinez',
      role: 'Science Teacher',
      avatar: '👨‍🔬',
      lastMessage: 'James might benefit from some additional support with the upcoming astronomy unit.',
      lastMessageDate: '2025-05-15',
      unread: 0
    },
    {
      id: 'msg4',
      with: 'Mrs. Johnson',
      role: 'SENCO',
      avatar: '👩‍💼',
      lastMessage: 'I've prepared some additional resources for James that you can use at home.',
      lastMessageDate: '2025-05-14',
      unread: 0
    },
    {
      id: 'msg5',
      with: 'School Office',
      role: 'Administration',
      avatar: '🏫',
      lastMessage: 'This is a reminder about the upcoming parent-teacher evening on May 25th.',
      lastMessageDate: '2025-05-13',
      unread: 0
    }
  ]);
  
  // Set initial selected child
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);
  
  // Get selected child
  const getSelectedChild = () => {
    return children.find(child => child.id === selectedChildId);
  };
  
  // Get filtered activity updates
  const getFilteredActivityUpdates = () => {
    let filtered = activityUpdates;
    
    // Filter by child if selected
    if (selectedChildId) {
      filtered = filtered.filter(update => update.childId === selectedChildId);
    }
    
    // Filter by type if not 'all'
    if (notificationFilter !== 'all') {
      filtered = filtered.filter(update => update.type === notificationFilter);
    }
    
    // Sort by date (most recent first)
    filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return filtered;
  };
  
  // Get child-specific upcoming events
  const getChildEvents = () => {
    if (!selectedChildId) return upcomingEvents;
    
    return upcomingEvents.filter(event => 
      !event.childId || event.childId === selectedChildId
    );
  };
  
  // Get child-specific homework
  const getChildHomework = () => {
    if (!selectedChildId) return homeworkItems;
    
    return homeworkItems.filter(item => item.childId === selectedChildId);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'positive':
        return 'text-green-500';
      case 'needs-attention':
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };
  
  // Get homework status color and icon
  const getHomeworkStatusInfo = (status: string) => {
    switch(status) {
      case 'not-started':
        return { color: 'text-red-500', icon: <AlertCircle className="h-4 w-4" /> };
      case 'in-progress':
        return { color: 'text-amber-500', icon: <Clock className="h-4 w-4" /> };
      case 'completed':
        return { color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" /> };
      case 'submitted':
        return { color: 'text-blue-500', icon: <CheckCircle className="h-4 w-4" /> };
      case 'late':
        return { color: 'text-red-500', icon: <AlertCircle className="h-4 w-4" /> };
      case 'graded':
        return { color: 'text-green-500', icon: <Star className="h-4 w-4" /> };
      default:
        return { color: 'text-muted-foreground', icon: <Clock className="h-4 w-4" /> };
    }
  };
  
  // Get event type badge
  const getEventTypeBadge = (type: string) => {
    switch(type) {
      case 'parent-evening':
        return <Badge className="bg-blue-500">Parent Evening</Badge>;
      case 'school-event':
        return <Badge className="bg-green-500">School Event</Badge>;
      case 'deadline':
        return <Badge className="bg-red-500">Deadline</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-500">Meeting</Badge>;
      default:
        return <Badge>Event</Badge>;
    }
  };
  
  // Handle acknowledging an update
  const handleAcknowledgeUpdate = (updateId: string) => {
    setActivityUpdates(prev => 
      prev.map(update => 
        update.id === updateId 
          ? { ...update, acknowledged: true } 
          : update
      )
    );
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedThreadId) return;
    
    // In a real implementation, this would send the message to the backend
    // For now, we'll just update the UI to simulate sending a message
    
    setMessageThreads(prev => 
      prev.map(thread => 
        thread.id === selectedThreadId
          ? { 
              ...thread, 
              lastMessage: `You: ${messageInput}`,
              lastMessageDate: new Date().toISOString().split('T')[0]
            }
          : thread
      )
    );
    
    setMessageInput('');
  };
  
  // Get selected message thread
  const getSelectedThread = () => {
    return messageThreads.find(thread => thread.id === selectedThreadId);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Parent Portal</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay connected with your child's educational journey through our comprehensive parent engagement system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Parent Dashboard</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Your Children</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {children.map((child) => (
                      <div 
                        key={child.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center ${
                          selectedChildId === child.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedChildId(child.id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-xl">
                          {child.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{child.name}</div>
                          <div className="text-xs text-muted-foreground">{child.yearGroup} • Age {child.age}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button
                  variant={activeTab === 'activities' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('activities')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Activities & Updates
                  {activityUpdates.filter(u => !u.acknowledged).length > 0 && (
                    <Badge className="ml-auto">{activityUpdates.filter(u => !u.acknowledged).length}</Badge>
                  )}
                </Button>
                
                <Button
                  variant={activeTab === 'homework' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('homework')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Homework & Assignments
                </Button>
                
                <Button
                  variant={activeTab === 'calendar' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('calendar')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar & Events
                </Button>
                
                <Button
                  variant={activeTab === 'progress' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('progress')}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Academic Progress
                </Button>
                
                <Button
                  variant={activeTab === 'messages' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                  {messageThreads.reduce((count, thread) => count + thread.unread, 0) > 0 && (
                    <Badge className="ml-auto">{messageThreads.reduce((count, thread) => count + thread.unread, 0)}</Badge>
                  )}
                </Button>
                
                <Button
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Welcome Back, Parent</h2>
                      <p className="text-muted-foreground">
                        Here's what's happening with {selectedChildId ? getSelectedChild()?.name : 'your children'} today.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">Today</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        📅
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Unread Updates</p>
                        <h3 className="text-2xl font-bold">
                          {activityUpdates.filter(u => !u.acknowledged).length}
                        </h3>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2"
                      onClick={() => setActiveTab('activities')}
                    >
                      View all updates
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
                        <h3 className="text-2xl font-bold">
                          {upcomingEvents.filter(e => new Date(e.date) > new Date()).length}
                        </h3>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2"
                      onClick={() => setActiveTab('calendar')}
                    >
                      View calendar
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Pending Homework</p>
                        <h3 className="text-2xl font-bold">
                          {homeworkItems.filter(h => ['not-started', 'in-progress'].includes(h.status)).length}
                        </h3>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2"
                      onClick={() => setActiveTab('homework')}
                    >
                      View homework
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFilteredActivityUpdates().slice(0, 3).map((update) => (
                      <div key={update.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          update.status === 'positive' ? 'bg-green-100 text-green-600' :
                          update.status === 'needs-attention' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {update.type === 'achievement' && <Award className="h-5 w-5" />}
                          {update.type === 'assessment' && <FileText className="h-5 w-5" />}
                          {update.type === 'behavior' && <Users className="h-5 w-5" />}
                          {update.type === 'attendance' && <Clock className="h-5 w-5" />}
                          {update.type === 'homework' && <BookOpen className="h-5 w-5" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{update.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {children.find(c => c.id === update.childId)?.name} • {new Date(update.date).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                            {!update.acknowledged && (
                              <Badge variant="outline">New</Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm">{update.description}</p>
                          {update.type === 'assessment' && update.score !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Score</span>
                                <span className={getStatusColor(update.status || 'neutral')}>{update.score}%</span>
                              </div>
                              <Progress value={update.score} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('activities')}
                    >
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getChildEvents()
                      .filter(event => new Date(event.date) > new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map((event) => (
                        <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {event.type === 'parent-evening' && <Users className="h-5 w-5 text-primary" />}
                            {event.type === 'school-event' && <Home className="h-5 w-5 text-primary" />}
                            {event.type === 'deadline' && <Clock className="h-5 w-5 text-primary" />}
                            {event.type === 'meeting' && <MessageSquare className="h-5 w-5 text-primary" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{event.title}</h4>
                              {getEventTypeBadge(event.type)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString('en-GB')} • {event.time} • {event.location}
                            </p>
                            <p className="mt-2 text-sm">{event.description}</p>
                            {event.childId && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                For: {children.find(c => c.id === event.childId)?.name}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('calendar')}
                    >
                      View Full Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-semibold">Activities & Updates</h2>
                    
                    <div className="flex items-center gap-2">
                      <Tabs value={notificationFilter} onValueChange={setNotificationFilter} className="w-full md:w-auto">
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="achievement">Achievements</TabsTrigger>
                          <TabsTrigger value="assessment">Assessments</TabsTrigger>
                          <TabsTrigger value="behavior">Behavior</TabsTrigger>
                          <TabsTrigger value="attendance">Attendance</TabsTrigger>
                          <TabsTrigger value="homework">Homework</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {getFilteredActivityUpdates().length > 0 ? (
                      getFilteredActivityUpdates().map((update) => (
                        <Card key={update.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                update.status === 'positive' ? 'bg-green-100 text-green-600' :
                                update.status === 'needs-attention' ? 'bg-red-100 text-red-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {update.type === 'achievement' && <Award className="h-5 w-5" />}
                                {update.type === 'assessment' && <FileText className="h-5 w-5" />}
                                {update.type === 'behavior' && <Users className="h-5 w-5" />}
                                {update.type === 'attendance' && <Clock className="h-5 w-5" />}
                                {update.type === 'homework' && <BookOpen className="h-5 w-5" />}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{update.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {children.find(c => c.id === update.childId)?.name} • {new Date(update.date).toLocaleDateString('en-GB')}
                                      {update.subject && ` • ${update.subject}`}
                                      {update.teacherName && ` • ${update.teacherName}`}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!update.acknowledged && (
                                      <Badge variant="outline">New</Badge>
                                    )}
                                    <Badge className={
                                      update.status === 'positive' ? 'bg-green-500' :
                                      update.status === 'needs-attention' ? 'bg-red-500' :
                                      'bg-amber-500'
                                    }>
                                      {update.status === 'positive' ? 'Positive' :
                                       update.status === 'needs-attention' ? 'Needs Attention' :
                                       'Neutral'}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="mt-2">{update.description}</p>
                                
                                {update.type === 'assessment' && update.score !== undefined && (
                                  <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Score</span>
                                      <span className={getStatusColor(update.status || 'neutral')}>{update.score}%</span>
                                    </div>
                                    <Progress value={update.score} className="h-2" />
                                  </div>
                                )}
                                
                                {update.teacherMessage && (
                                  <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <div className="text-xs text-muted-foreground mb-1">Teacher's Note:</div>
                                    <p className="text-sm">{update.teacherMessage}</p>
                                  </div>
                                )}
                                
                                {!update.acknowledged && (
                                  <div className="mt-4 flex justify-end">
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAcknowledgeUpdate(update.id)}
                                    >
                                      Acknowledge
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Updates Found</h3>
                        <p className="text-muted-foreground">
                          There are no updates matching your current filter criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'homework' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Homework & Assignments</h2>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search homework..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[200px]"
                      />
                    </div>
                  </div>
                  
                  <Tabs defaultValue="current">
                    <TabsList className="mb-6">
                      <TabsTrigger value="current">Current</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="current">
                      <div className="space-y-4">
                        {getChildHomework()
                          .filter(item => ['not-started', 'in-progress', 'late'].includes(item.status))
                          .filter(item => 
                            searchQuery ? 
                              item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.subject.toLowerCase().includes(searchQuery.toLowerCase()) : 
                              true
                          )
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    item.status === 'not-started' ? 'bg-red-100 text-red-600' :
                                    item.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                                    item.status === 'late' ? 'bg-red-100 text-red-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {getHomeworkStatusInfo(item.status).icon}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {children.find(c => c.id === item.childId)?.name} • {item.subject} • Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}
                                        </p>
                                      </div>
                                      <Badge className={
                                        item.status === 'not-started' ? 'bg-red-500' :
                                        item.status === 'in-progress' ? 'bg-amber-500' :
                                        item.status === 'late' ? 'bg-red-500' :
                                        'bg-green-500'
                                      }>
                                        {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </Badge>
                                    </div>
                                    
                                    <p className="mt-2">{item.description}</p>
                                    
                                    <div className="mt-4 flex justify-end gap-2">
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                      <Button size="sm">
                                        Mark as Completed
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="completed">
                      <div className="space-y-4">
                        {getChildHomework()
                          .filter(item => ['completed', 'submitted', 'graded'].includes(item.status))
                          .filter(item => 
                            searchQuery ? 
                              item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.subject.toLowerCase().includes(searchQuery.toLowerCase()) : 
                              true
                          )
                          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                          .map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    {getHomeworkStatusInfo(item.status).icon}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {children.find(c => c.id === item.childId)?.name} • {item.subject} • Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {item.grade && (
                                          <Badge variant="outline">{item.grade}</Badge>
                                        )}
                                        <Badge className="bg-green-500">
                                          {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <p className="mt-2">{item.description}</p>
                                    
                                    {item.feedback && (
                                      <div className="mt-4 p-3 bg-muted rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">Teacher's Feedback:</div>
                                        <p className="text-sm">{item.feedback}</p>
                                      </div>
                                    )}
                                    
                                    <div className="mt-4 flex justify-end">
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="all">
                      <div className="space-y-4">
                        {getChildHomework()
                          .filter(item => 
                            searchQuery ? 
                              item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.subject.toLowerCase().includes(searchQuery.toLowerCase()) : 
                              true
                          )
                          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                          .map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    item.status === 'not-started' ? 'bg-red-100 text-red-600' :
                                    item.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                                    item.status === 'late' ? 'bg-red-100 text-red-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {getHomeworkStatusInfo(item.status).icon}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {children.find(c => c.id === item.childId)?.name} • {item.subject} • Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {item.grade && (
                                          <Badge variant="outline">{item.grade}</Badge>
                                        )}
                                        <Badge className={
                                          item.status === 'not-started' ? 'bg-red-500' :
                                          item.status === 'in-progress' ? 'bg-amber-500' :
                                          item.status === 'late' ? 'bg-red-500' :
                                          'bg-green-500'
                                        }>
                                          {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <p className="mt-2">{item.description}</p>
                                    
                                    {item.feedback && (
                                      <div className="mt-4 p-3 bg-muted rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">Teacher's Feedback:</div>
                                        <p className="text-sm">{item.feedback}</p>
                                      </div>
                                    )}
                                    
                                    <div className="mt-4 flex justify-end gap-2">
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                      {['not-started', 'in-progress', 'late'].includes(item.status) && (
                                        <Button size="sm">
                                          Mark as Completed
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Calendar & Events</h2>
                    
                    <div className="flex items-center gap-2">
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 35 }).map((_, index) => {
                        const day = index + 1;
                        const isToday = day === 18; // Assuming today is the 18th
                        const hasEvent = [10, 15, 18, 25, 28, 30].includes(day);
                        
                        return (
                          <div 
                            key={index}
                            className={`aspect-square flex flex-col items-center justify-center rounded-md border text-sm ${
                              isToday ? 'bg-primary text-primary-foreground' : 
                              hasEvent ? 'border-primary/50 bg-primary/5' : 
                              'hover:bg-muted'
                            }`}
                          >
                            <span>{day}</span>
                            {hasEvent && !isToday && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {getChildEvents()
                      .filter(event => new Date(event.date) > new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event) => (
                        <Card key={event.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {event.type === 'parent-evening' && <Users className="h-5 w-5 text-primary" />}
                                {event.type === 'school-event' && <Home className="h-5 w-5 text-primary" />}
                                {event.type === 'deadline' && <Clock className="h-5 w-5 text-primary" />}
                                {event.type === 'meeting' && <MessageSquare className="h-5 w-5 text-primary" />}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{event.title}</h4>
                                  {getEventTypeBadge(event.type)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString('en-GB')} • {event.time} • {event.location}
                                </p>
                                <p className="mt-2">{event.description}</p>
                                {event.childId && (
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    For: {children.find(c => c.id === event.childId)?.name}
                                  </div>
                                )}
                                
                                <div className="mt-4 flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    Add to Personal Calendar
                                  </Button>
                                  {event.type === 'parent-evening' && (
                                    <Button size="sm">
                                      Book Appointment
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Academic Progress</h2>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                  
                  {selectedChildId && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">Mathematics</div>
                              <div className="text-green-500">85%</div>
                            </div>
                            <Progress value={85} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Above Expected Level</span>
                              <span>Year 5 Average: 72%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">English</div>
                              <div className="text-green-500">78%</div>
                            </div>
                            <Progress value={78} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Meeting Expected Level</span>
                              <span>Year 5 Average: 75%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">Science</div>
                              <div className="text-amber-500">68%</div>
                            </div>
                            <Progress value={68} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Approaching Expected Level</span>
                              <span>Year 5 Average: 70%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">History</div>
                              <div className="text-green-500">82%</div>
                            </div>
                            <Progress value={82} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Above Expected Level</span>
                              <span>Year 5 Average: 68%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">Art</div>
                              <div className="text-green-500">90%</div>
                            </div>
                            <Progress value={90} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Exceeding Expected Level</span>
                              <span>Year 5 Average: 78%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recent Assessments</h3>
                        <div className="space-y-4">
                          {activityUpdates
                            .filter(update => update.childId === selectedChildId && update.type === 'assessment')
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((assessment) => (
                              <Card key={assessment.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      assessment.status === 'positive' ? 'bg-green-100 text-green-600' :
                                      assessment.status === 'needs-attention' ? 'bg-red-100 text-red-600' :
                                      'bg-amber-100 text-amber-600'
                                    }`}>
                                      <FileText className="h-5 w-5" />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-medium">{assessment.title}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {assessment.subject} • {new Date(assessment.date).toLocaleDateString('en-GB')} • {assessment.teacherName}
                                          </p>
                                        </div>
                                        <Badge className={
                                          assessment.status === 'positive' ? 'bg-green-500' :
                                          assessment.status === 'needs-attention' ? 'bg-red-500' :
                                          'bg-amber-500'
                                        }>
                                          {assessment.score}%
                                        </Badge>
                                      </div>
                                      
                                      <p className="mt-2">{assessment.description}</p>
                                      
                                      {assessment.teacherMessage && (
                                        <div className="mt-4 p-3 bg-muted rounded-lg">
                                          <div className="text-xs text-muted-foreground mb-1">Teacher's Note:</div>
                                          <p className="text-sm">{assessment.teacherMessage}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Learning Goals</h3>
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Mathematics</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Understand and use equivalent fractions</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Add and subtract fractions with the same denominator</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                                  <span>Add and subtract fractions with different denominators</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                                  <span>Multiply proper fractions and mixed numbers by whole numbers</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">English</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Use expanded noun phrases to convey complicated information concisely</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Use modal verbs to indicate degrees of possibility</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                                  <span>Use relative clauses beginning with who, which, where, when, whose, that</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                                  <span>Use commas to clarify meaning or avoid ambiguity in writing</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Messages</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border-r pr-6">
                      <div className="mb-4">
                        <Input
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        {messageThreads
                          .filter(thread => 
                            searchQuery ? 
                              thread.with.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) : 
                              true
                          )
                          .map((thread) => (
                            <div 
                              key={thread.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedThreadId === thread.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => setSelectedThreadId(thread.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                  {thread.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium truncate">{thread.with}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(thread.lastMessageDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-1">{thread.role}</div>
                                  <div className="text-sm truncate">
                                    {thread.lastMessage}
                                  </div>
                                </div>
                              </div>
                              {thread.unread > 0 && (
                                <div className="flex justify-end mt-1">
                                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                    {thread.unread}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      {selectedThreadId ? (
                        <div className="flex flex-col h-[600px]">
                          <div className="border-b pb-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                {getSelectedThread()?.avatar}
                              </div>
                              <div>
                                <div className="font-medium">{getSelectedThread()?.with}</div>
                                <div className="text-xs text-muted-foreground">{getSelectedThread()?.role}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">Hello! I wanted to discuss Emily's recent progress in mathematics. She's been doing very well with fractions.</p>
                                <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">Thank you for letting me know. We've been practicing at home as well. Are there any specific areas where she could use more support?</p>
                                <div className="text-xs text-primary-foreground/70 mt-1">10:45 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">She's doing great with equivalent fractions and basic operations. We'll be moving on to fractions with different denominators next week, so some preview work on that would be helpful.</p>
                                <div className="text-xs text-muted-foreground mt-1">11:02 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">I've attached some practice worksheets that you might find useful.</p>
                                <div className="mt-2 p-2 bg-background rounded border flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-xs">fraction_practice.pdf</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">11:05 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">This is very helpful, thank you! We'll work on these over the weekend. Is there anything else I should know about her progress?</p>
                                <div className="text-xs text-primary-foreground/70 mt-1">11:10 AM</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">Emily has been making excellent progress with her reading comprehension skills. She's been actively participating in class discussions about our current book.</p>
                                <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="min-h-[80px] resize-none"
                              />
                              <Button 
                                className="self-end"
                                disabled={!messageInput.trim()}
                                onClick={handleSendMessage}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[600px] flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            Select a conversation from the list to view messages and respond.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                  
                  <Tabs defaultValue="profile">
                    <TabsList className="mb-6">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-20 h-20">
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <Button variant="outline" size="sm">
                              Change Photo
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" defaultValue="Parent Name" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="parent@example.com" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue="07700 900123" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship to Children</Label>
                            <Input id="relationship" defaultValue="Parent/Guardian" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea id="address" defaultValue="123 Example Street, Example Town, EX1 2AB" />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Changes</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                              </div>
                              <Switch id="email-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                              </div>
                              <Switch id="sms-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="app-notifications" className="font-medium">In-App Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive notifications within the portal</p>
                              </div>
                              <Switch id="app-notifications" defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="achievement-notifications" className="font-medium">Achievements</Label>
                                <p className="text-sm text-muted-foreground">Awards, recognitions, and positive feedback</p>
                              </div>
                              <Switch id="achievement-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="assessment-notifications" className="font-medium">Assessments</Label>
                                <p className="text-sm text-muted-foreground">Test results, grades, and academic evaluations</p>
                              </div>
                              <Switch id="assessment-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="behavior-notifications" className="font-medium">Behavior</Label>
                                <p className="text-sm text-muted-foreground">Behavior reports and incidents</p>
                              </div>
                              <Switch id="behavior-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="attendance-notifications" className="font-medium">Attendance</Label>
                                <p className="text-sm text-muted-foreground">Absences, late arrivals, and early departures</p>
                              </div>
                              <Switch id="attendance-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="homework-notifications" className="font-medium">Homework</Label>
                                <p className="text-sm text-muted-foreground">Assignments, due dates, and completion status</p>
                              </div>
                              <Switch id="homework-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="event-notifications" className="font-medium">School Events</Label>
                                <p className="text-sm text-muted-foreground">School activities, meetings, and important dates</p>
                              </div>
                              <Switch id="event-notifications" defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Preferences</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="privacy">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="profile-visibility" className="font-medium">Profile Visibility</Label>
                                <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                              </div>
                              <div className="w-[180px]">
                                <Select defaultValue="school-only">
                                  <SelectTrigger id="profile-visibility">
                                    <SelectValue placeholder="Select visibility" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="school-only">School Staff Only</SelectItem>
                                    <SelectItem value="teachers">Teachers & Administrators</SelectItem>
                                    <SelectItem value="all">All School Community</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="contact-sharing" className="font-medium">Contact Information Sharing</Label>
                                <p className="text-sm text-muted-foreground">Allow teachers to share your contact with other parents</p>
                              </div>
                              <Switch id="contact-sharing" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="photo-consent" className="font-medium">Photo Usage Consent</Label>
                                <p className="text-sm text-muted-foreground">Allow school to use photos of your child in publications</p>
                              </div>
                              <Switch id="photo-consent" defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Data Management</h3>
                          <div className="space-y-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">Download Your Data</h4>
                                    <p className="text-sm text-muted-foreground">Get a copy of all your data stored in the system</p>
                                  </div>
                                  <Button variant="outline">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">Data Retention</h4>
                                    <p className="text-sm text-muted-foreground">Control how long your data is stored</p>
                                  </div>
                                  <div className="w-[180px]">
                                    <Select defaultValue="standard">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select retention" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="standard">Standard (3 years)</SelectItem>
                                        <SelectItem value="extended">Extended (5 years)</SelectItem>
                                        <SelectItem value="minimum">Minimum (1 year)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Privacy Settings</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="accessibility">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Accessibility Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
                                <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                              </div>
                              <Switch id="high-contrast" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="text-to-speech" className="font-medium">Text-to-Speech</Label>
                                <p className="text-sm text-muted-foreground">Enable reading of content aloud</p>
                              </div>
                              <Switch id="text-to-speech" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                                <p className="text-sm text-muted-foreground">Adjust text size for better readability</p>
                              </div>
                              <div className="w-[180px]">
                                <Select defaultValue="medium">
                                  <SelectTrigger id="font-size">
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="x-large">Extra Large</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="reduced-motion" className="font-medium">Reduced Motion</Label>
                                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                              </div>
                              <Switch id="reduced-motion" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Language Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="interface-language" className="font-medium">Interface Language</Label>
                                <p className="text-sm text-muted-foreground">Select your preferred language for the portal</p>
                              </div>
                              <div className="w-[180px]">
                                <Select defaultValue="en-GB">
                                  <SelectTrigger id="interface-language">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en-GB">English (UK)</SelectItem>
                                    <SelectItem value="cy">Welsh</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="pl">Polish</SelectItem>
                                    <SelectItem value="ar">Arabic</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="translation" className="font-medium">Automatic Translation</Label>
                                <p className="text-sm text-muted-foreground">Automatically translate content to your preferred language</p>
                              </div>
                              <Switch id="translation" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Accessibility Settings</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Change Password</h4>
                              <p className="text-sm text-muted-foreground">Update your account password</p>
                            </div>
                            <Button variant="outline">
                              <Lock className="h-4 w-4 mr-2" />
                              Change
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Two-Factor Authentication</h4>
                              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Login History</h4>
                            <p className="text-sm text-muted-foreground">View recent account activity</p>
                          </div>
                          <Button variant="outline">
                            <User className="h-4 w-4 mr-2" />
                            View Activity
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Support</h3>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Contact Support</h4>
                            <p className="text-sm text-muted-foreground">Get help with your account or the portal</p>
                          </div>
                          <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Help Center</h4>
                            <p className="text-sm text-muted-foreground">Browse tutorials and FAQs</p>
                          </div>
                          <Button variant="outline">
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Help
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">School Contact Information</h4>
                            <p className="text-sm text-muted-foreground">Contact the school directly</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 mb-12"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground">
                Receive instant notifications about your child's achievements, assessments, behavior, and attendance, keeping you informed about their educational journey.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-muted-foreground">
                Maintain open lines of communication with teachers and school staff through our secure messaging system, ensuring timely and effective collaboration.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your child's academic progress across all subjects with detailed insights into assessments, learning goals, and areas for improvement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calendar Integration</h3>
              <p className="text-muted-foreground">
                Stay organized with a comprehensive calendar of school events, deadlines, parent-teacher meetings, and other important dates relevant to your child.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Parents</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Enhanced Engagement</span>
                    <p className="text-sm text-muted-foreground">Stay actively involved in your child's education with comprehensive insights into their school life.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Timely Intervention</span>
                    <p className="text-sm text-muted-foreground">Identify and address potential challenges early through real-time updates and progress tracking.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Streamlined Communication</span>
                    <p className="text-sm text-muted-foreground">Communicate directly with teachers and staff without scheduling constraints or phone tag.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Holistic View</span>
                    <p className="text-sm text-muted-foreground">Gain a comprehensive understanding of your child's academic, social, and behavioral development.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Schools</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Increased Parent Involvement</span>
                    <p className="text-sm text-muted-foreground">Foster stronger home-school connections through transparent and accessible communication channels.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Efficient Communication</span>
                    <p className="text-sm text-muted-foreground">Reduce administrative burden with streamlined digital communication and automated updates.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Data-Driven Insights</span>
                    <p className="text-sm text-muted-foreground">Leverage comprehensive data to identify trends and improve educational outcomes.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Enhanced Community Building</span>
                    <p className="text-sm text-muted-foreground">Create a stronger school community through improved transparency and engagement.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
