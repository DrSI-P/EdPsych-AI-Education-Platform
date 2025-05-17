'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar, 
  CalendarCell, 
  CalendarGrid, 
  CalendarHeader, 
  CalendarHeading, 
  CalendarMonthSelect, 
  CalendarNavigation, 
  CalendarViewSelector, 
  CalendarYearSelect 
} from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  Separator 
} from '@/components/ui/separator';
import { 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Check, 
  ChevronDown, 
  Clock, 
  Download, 
  File, 
  FileText, 
  Mail, 
  MessageSquare, 
  Phone, 
  Plus, 
  Settings, 
  Upload, 
  User, 
  Users, 
  Video 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { ParentTeacherCommunicationEngine } from '@/components/special-needs/parent-teacher-communication/parent-teacher-communication-engine';

// Form schemas
const messageFormSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  recipientId: z.string().min(1, 'Recipient is required'),
  studentId: z.string().min(1, 'Student is required'),
  urgent: z.boolean().default(false),
  attachments: z.array(z.any()).optional(),
});

const meetingFormSchema = z.object({
  title: z.string().min(1, 'Meeting title is required'),
  description: z.string().optional(),
  meetingType: z.string().default('parent_teacher'),
  scheduledDate: z.date(),
  duration: z.number().min(15).default(30),
  location: z.string().default('Virtual'),
  studentId: z.string().min(1, 'Student is required'),
  participantIds: z.array(z.string()).min(1, 'At least one participant is required'),
  virtualMeetingUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

const settingsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  autoTranslate: z.boolean().default(false),
  privacyMode: z.boolean().default(true),
  reminderFrequency: z.string().default('weekly'),
  messageTemplate: z.boolean().default(true),
  readReceipts: z.boolean().default(true),
  urgentFlagging: z.boolean().default(true),
});

export default function ParentTeacherCommunicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoTranslate: false,
    privacyMode: true,
    reminderFrequency: 'weekly',
    messageTemplate: true,
    readReceipts: true,
    urgentFlagging: true,
  });
  const [loading, setLoading] = useState({
    messages: false,
    meetings: false,
    settings: false,
    students: false,
    users: false,
  });
  const [openDialog, setOpenDialog] = useState({
    newMessage: false,
    newMeeting: false,
    viewMessage: false,
    viewMeeting: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportType, setReportType] = useState('communication');
  const [timeRange, setTimeRange] = useState('term');
  const [reportData, setReportData] = useState(null);

  // Forms
  const messageForm = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: '',
      recipientId: '',
      studentId: '',
      urgent: false,
      attachments: [],
    },
  });

  const meetingForm = useForm({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      description: '',
      meetingType: 'parent_teacher',
      scheduledDate: new Date(),
      duration: 30,
      location: 'Virtual',
      studentId: '',
      participantIds: [],
      virtualMeetingUrl: '',
      notes: '',
    },
  });

  const settingsForm = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages();
      fetchMeetings();
      fetchSettings();
      fetchStudents();
      fetchUsers();
    }
  }, [status]);

  // Fetch messages
  const fetchMessages = async () => {
    setLoading((prev) => ({ ...prev, messages: true }));
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/messages');
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('An error occurred while fetching messages');
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  // Fetch meetings
  const fetchMeetings = async () => {
    setLoading((prev) => ({ ...prev, meetings: true }));
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/meetings');
      const data = await response.json();
      if (data.success) {
        setMeetings(data.meetings);
      } else {
        toast.error('Failed to fetch meetings');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('An error occurred while fetching meetings');
    } finally {
      setLoading((prev) => ({ ...prev, meetings: false }));
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    setLoading((prev) => ({ ...prev, settings: true }));
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
        settingsForm.reset(data.settings);
      } else {
        toast.error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('An error occurred while fetching settings');
    } finally {
      setLoading((prev) => ({ ...prev, settings: false }));
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    setLoading((prev) => ({ ...prev, students: true }));
    try {
      // This would be a real API call in a production environment
      // For now, we'll use mock data
      const mockStudents = [
        { id: 'student1', name: 'Alex Johnson', yearGroup: 'Year 5', supportNeeds: ['Dyslexia'] },
        { id: 'student2', name: 'Sam Williams', yearGroup: 'Year 3', supportNeeds: ['ADHD'] },
        { id: 'student3', name: 'Jamie Smith', yearGroup: 'Year 7', supportNeeds: ['Autism'] },
        { id: 'student4', name: 'Taylor Brown', yearGroup: 'Year 10', supportNeeds: ['Dyscalculia'] },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('An error occurred while fetching students');
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      // This would be a real API call in a production environment
      // For now, we'll use mock data
      const mockUsers = [
        { id: 'user1', name: 'Ms. Roberts', email: 'roberts@school.edu', role: 'teacher', image: null },
        { id: 'user2', name: 'Mr. Thompson', email: 'thompson@school.edu', role: 'teacher', image: null },
        { id: 'user3', name: 'Dr. Wilson', email: 'wilson@school.edu', role: 'senco', image: null },
        { id: 'user4', name: 'Mrs. Johnson', email: 'johnson@email.com', role: 'parent', image: null },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('An error occurred while fetching users');
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Send message
  const handleSendMessage = async (data) => {
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: data }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Message sent successfully');
        setOpenDialog((prev) => ({ ...prev, newMessage: false }));
        messageForm.reset();
        fetchMessages();
      } else {
        toast.error(responseData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred while sending the message');
    }
  };

  // Schedule meeting
  const handleScheduleMeeting = async (data) => {
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meeting: data }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Meeting scheduled successfully');
        setOpenDialog((prev) => ({ ...prev, newMeeting: false }));
        meetingForm.reset();
        fetchMeetings();
      } else {
        toast.error(responseData.error || 'Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('An error occurred while scheduling the meeting');
    }
  };

  // Save settings
  const handleSaveSettings = async (data) => {
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: data }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Settings saved successfully');
        setSettings(data);
      } else {
        toast.error(responseData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    }
  };

  // Generate report
  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`/api/special-needs/parent-teacher-communication/reports?type=${reportType}&timeRange=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
        toast.success('Report generated successfully');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('An error occurred while generating the report');
    }
  };

  // Request report download
  const handleRequestReportDownload = async () => {
    try {
      const response = await fetch('/api/special-needs/parent-teacher-communication/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportRequest: {
            type: reportType,
            timeRange: timeRange,
            format: 'pdf',
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Report download requested. You will be notified when it is ready.');
      } else {
        toast.error('Failed to request report download');
      }
    } catch (error) {
      console.error('Error requesting report download:', error);
      toast.error('An error occurred while requesting the report download');
    }
  };

  // View message
  const handleViewMessage = (message) => {
    setSelectedItem(message);
    setOpenDialog((prev) => ({ ...prev, viewMessage: true }));
  };

  // View meeting
  const handleViewMeeting = (meeting) => {
    setSelectedItem(meeting);
    setOpenDialog((prev) => ({ ...prev, viewMeeting: true }));
  };

  // Mark message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      // This would be a real API call in a production environment
      // For now, we'll update the local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('An error occurred while marking the message as read');
    }
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Get student name by ID
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'PPP');
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'p');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Parent-Teacher Communication</h1>
          <p className="text-muted-foreground">
            Facilitate seamless communication between parents and teachers to support student success.
          </p>
        </div>

        <ParentTeacherCommunicationEngine />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Messages</h2>
              <Button onClick={() => setOpenDialog((prev) => ({ ...prev, newMessage: true }))}>
                <Plus className="mr-2 h-4 w-4" /> New Message
              </Button>
            </div>

            {loading.messages ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No messages yet. Start a conversation!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className={cn(!message.read && message.recipientId === session?.user?.id && "border-primary")}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={message.sender.image} alt={message.sender.name} />
                            <AvatarFallback>{getUserInitials(message.sender.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{message.sender.name}</CardTitle>
                            <CardDescription>
                              {formatDate(message.createdAt)} at {formatTime(message.createdAt)}
                            </CardDescription>
                          </div>
                        </div>
                        {message.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2">{message.content}</p>
                      <div className="mt-2">
                        <Badge variant="outline">Re: {getStudentName(message.studentId)}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewMessage(message)}>
                        View Details
                      </Button>
                      {!message.read && message.recipientId === session?.user?.id && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(message.id)}>
                          Mark as Read
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Meetings</h2>
              <Button onClick={() => setOpenDialog((prev) => ({ ...prev, newMeeting: true }))}>
                <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
              </Button>
            </div>

            {loading.meetings ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : meetings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No meetings scheduled. Plan a meeting!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {meetings
                        .filter((meeting) => new Date(meeting.scheduledDate) >= new Date())
                        .length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No upcoming meetings</p>
                      ) : (
                        <div className="space-y-4">
                          {meetings
                            .filter((meeting) => new Date(meeting.scheduledDate) >= new Date())
                            .map((meeting) => (
                              <div
                                key={meeting.id}
                                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                                onClick={() => handleViewMeeting(meeting)}
                              >
                                <div className="bg-primary/10 p-2 rounded-full">
                                  {meeting.meetingType === 'parent_teacher' ? (
                                    <Users className="h-5 w-5 text-primary" />
                                  ) : meeting.meetingType === 'virtual' ? (
                                    <Video className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Phone className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{meeting.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(meeting.scheduledDate)} at {formatTime(meeting.scheduledDate)}
                                  </p>
                                  <p className="text-sm mt-1">
                                    Re: {getStudentName(meeting.studentId)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Past Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {meetings
                        .filter((meeting) => new Date(meeting.scheduledDate) < new Date())
                        .length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No past meetings</p>
                      ) : (
                        <div className="space-y-4">
                          {meetings
                            .filter((meeting) => new Date(meeting.scheduledDate) < new Date())
                            .map((meeting) => (
                              <div
                                key={meeting.id}
                                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                                onClick={() => handleViewMeeting(meeting)}
                              >
                                <div className="bg-muted p-2 rounded-full">
                                  {meeting.meetingType === 'parent_teacher' ? (
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                  ) : meeting.meetingType === 'virtual' ? (
                                    <Video className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{meeting.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(meeting.scheduledDate)} at {formatTime(meeting.scheduledDate)}
                                  </p>
                                  <p className="text-sm mt-1">
                                    Re: {getStudentName(meeting.studentId)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-2xl font-semibold">Communication Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                  <CardDescription>
                    Create reports to analyze communication patterns and effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communication">Communication Summary</SelectItem>
                        <SelectItem value="meeting">Meeting Analytics</SelectItem>
                        <SelectItem value="impact">Impact Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                        <SelectItem value="term">Current Term</SelectItem>
                        <SelectItem value="year">Academic Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full" onClick={handleGenerateReport}>
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleRequestReportDownload}>
                    <Download className="mr-2 h-4 w-4" /> Download as PDF
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Report Results</CardTitle>
                  <CardDescription>
                    View the generated report data and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!reportData ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">
                        Generate a report to see results here
                      </p>
                    </div>
                  ) : reportType === 'communication' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.messageCount}</h3>
                          <p className="text-sm text-muted-foreground">Total Messages</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.readRate.toFixed(1)}%</h3>
                          <p className="text-sm text-muted-foreground">Read Rate</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.sentMessages}</h3>
                          <p className="text-sm text-muted-foreground">Sent Messages</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.receivedMessages}</h3>
                          <p className="text-sm text-muted-foreground">Received Messages</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Response Analysis</h3>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${reportData.responseRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>Response Rate: {reportData.responseRate.toFixed(1)}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  ) : reportType === 'meeting' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.meetingCount}</h3>
                          <p className="text-sm text-muted-foreground">Total Meetings</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.attendanceRate.toFixed(1)}%</h3>
                          <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.organizedMeetings}</h3>
                          <p className="text-sm text-muted-foreground">Organized Meetings</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.upcomingMeetings}</h3>
                          <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.communicationImpact.overallEngagement}%</h3>
                          <p className="text-sm text-muted-foreground">Overall Engagement</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.communicationImpact.parentSatisfaction}%</h3>
                          <p className="text-sm text-muted-foreground">Parent Satisfaction</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.communicationImpact.studentProgress}%</h3>
                          <p className="text-sm text-muted-foreground">Student Progress</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium text-lg">{reportData.communicationImpact.interventionEffectiveness}%</h3>
                          <p className="text-sm text-muted-foreground">Intervention Effectiveness</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Correlation Analysis</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead className="text-right">Correlation</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Communication Frequency to Progress</TableCell>
                              <TableCell className="text-right">{reportData.correlations.communicationFrequencyToProgress.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Meeting Attendance to Outcomes</TableCell>
                              <TableCell className="text-right">{reportData.correlations.meetingAttendanceToOutcomes.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Parent Engagement to Support</TableCell>
                              <TableCell className="text-right">{reportData.correlations.parentEngagementToSupport.toFixed(2)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-semibold">Communication Settings</h2>

            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(handleSaveSettings)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Control how you receive notifications about messages and meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={settingsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for new messages and meetings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SMS Notifications</FormLabel>
                            <FormDescription>
                              Receive text message notifications for urgent communications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="reminderFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reminder frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often you want to receive reminders about unread messages and upcoming meetings
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Accessibility</CardTitle>
                    <CardDescription>
                      Manage privacy settings and accessibility features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={settingsForm.control}
                      name="privacyMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enhanced Privacy Mode</FormLabel>
                            <FormDescription>
                              Hide sensitive information in notifications and previews
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="autoTranslate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-Translate Messages</FormLabel>
                            <FormDescription>
                              Automatically translate messages to your preferred language
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Message Features</CardTitle>
                    <CardDescription>
                      Customize your messaging experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={settingsForm.control}
                      name="messageTemplate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Message Templates</FormLabel>
                            <FormDescription>
                              Enable pre-written templates for common communications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="readReceipts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Read Receipts</FormLabel>
                            <FormDescription>
                              Allow others to see when you've read their messages
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="urgentFlagging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Urgent Message Flagging</FormLabel>
                            <FormDescription>
                              Allow marking messages as urgent for immediate attention
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full">
                  Save Settings
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Message Dialog */}
      <Dialog open={openDialog.newMessage} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, newMessage: open }))}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a parent or teacher about a student.
            </DialogDescription>
          </DialogHeader>
          <Form {...messageForm}>
            <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className="space-y-4">
              <FormField
                control={messageForm.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={messageForm.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regarding Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.yearGroup})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={messageForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={messageForm.control}
                name="urgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mark as Urgent</FormLabel>
                      <FormDescription>
                        Use only for time-sensitive matters requiring immediate attention
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Send Message</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* New Meeting Dialog */}
      <Dialog open={openDialog.newMeeting} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, newMeeting: open }))}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Schedule a meeting with parents or teachers to discuss a student.
            </DialogDescription>
          </DialogHeader>
          <Form {...meetingForm}>
            <form onSubmit={meetingForm.handleSubmit(handleScheduleMeeting)} className="space-y-4">
              <FormField
                control={meetingForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter meeting title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={meetingForm.control}
                  name="meetingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent_teacher">Parent-Teacher Conference</SelectItem>
                          <SelectItem value="iep_review">IEP Review</SelectItem>
                          <SelectItem value="progress_update">Progress Update</SelectItem>
                          <SelectItem value="behavior_discussion">Behavior Discussion</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={meetingForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Virtual">Virtual Meeting</SelectItem>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="Phone">Phone Call</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={meetingForm.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date & Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP p")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="p-3 border-t">
                            <Select
                              onValueChange={(value) => {
                                const date = new Date(field.value);
                                const [hours, minutes] = value.split(':');
                                date.setHours(parseInt(hours, 10));
                                date.setMinutes(parseInt(minutes, 10));
                                field.onChange(date);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }).map((_, hour) => (
                                  <React.Fragment key={hour}>
                                    <SelectItem value={`${hour}:00`}>
                                      {format(new Date().setHours(hour, 0), 'p')}
                                    </SelectItem>
                                    <SelectItem value={`${hour}:30`}>
                                      {format(new Date().setHours(hour, 30), 'p')}
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={meetingForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={meetingForm.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regarding Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.yearGroup})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={meetingForm.control}
                name="participantIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Switch
                            checked={field.value.includes(user.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, user.id]
                                : field.value.filter((id) => id !== user.id);
                              field.onChange(updatedValue);
                            }}
                          />
                          <span>
                            {user.name} ({user.role})
                          </span>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={meetingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Agenda</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose and agenda of the meeting..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={meetingForm.control}
                name="virtualMeetingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Meeting URL (if applicable)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      For virtual meetings, provide a link to the video conference
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Schedule Meeting</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      {selectedItem && (
        <Dialog open={openDialog.viewMessage} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, viewMessage: open }))}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={selectedItem.sender?.image} alt={selectedItem.sender?.name} />
                  <AvatarFallback>{getUserInitials(selectedItem.sender?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selectedItem.sender?.name}</DialogTitle>
                  <DialogDescription>
                    {formatDate(selectedItem.createdAt)} at {formatTime(selectedItem.createdAt)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">To: {selectedItem.recipient?.name}</Badge>
                <Badge variant="outline">Re: {selectedItem.student?.name}</Badge>
                {selectedItem.urgent && <Badge variant="destructive">Urgent</Badge>}
              </div>

              <Separator />

              <div className="max-h-[300px] overflow-y-auto">
                <p className="whitespace-pre-wrap">{selectedItem.content}</p>
              </div>

              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center space-x-2 border rounded-md p-2"
                      >
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOpenDialog((prev) => ({ ...prev, viewMessage: false }))}>
                Close
              </Button>
              <Button>Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Meeting Dialog */}
      {selectedItem && (
        <Dialog open={openDialog.viewMeeting} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, viewMeeting: open }))}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>
                {formatDate(selectedItem.scheduledDate)} at {formatTime(selectedItem.scheduledDate)}
                {' • '}{selectedItem.duration} minutes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Meeting Type</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.meetingType === 'parent_teacher'
                      ? 'Parent-Teacher Conference'
                      : selectedItem.meetingType === 'iep_review'
                      ? 'IEP Review'
                      : selectedItem.meetingType === 'progress_update'
                      ? 'Progress Update'
                      : 'Behavior Discussion'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Regarding Student</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.student?.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Organizer</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedItem.organizer?.image} alt={selectedItem.organizer?.name} />
                    <AvatarFallback>{getUserInitials(selectedItem.organizer?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedItem.organizer?.name}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Participants</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedItem.participantIds?.map((participantId) => {
                    const participant = users.find((u) => u.id === participantId);
                    return participant ? (
                      <div key={participantId} className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={participant.image} alt={participant.name} />
                          <AvatarFallback>{getUserInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {selectedItem.description && (
                <div>
                  <h4 className="text-sm font-medium">Agenda</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {selectedItem.virtualMeetingUrl && (
                <div>
                  <h4 className="text-sm font-medium">Virtual Meeting Link</h4>
                  <a
                    href={selectedItem.virtualMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    {selectedItem.virtualMeetingUrl}
                  </a>
                </div>
              )}

              {selectedItem.notes && (
                <div>
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {selectedItem.notes}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOpenDialog((prev) => ({ ...prev, viewMeeting: false }))}>
                Close
              </Button>
              {new Date(selectedItem.scheduledDate) > new Date() && (
                <Button>Join Meeting</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
