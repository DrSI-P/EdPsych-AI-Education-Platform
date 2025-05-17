'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Settings, Users, Bell, Calendar, FileText, Download, Upload, PlusCircle, Search, Filter, Mail, Phone, Video, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

export function ParentTeacherCommunicationEngine({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoTranslate: false,
    privacyMode: true,
    reminderFrequency: 'weekly',
    messageTemplate: true,
    readReceipts: true,
    urgentFlagging: true
  });

  // Demo data for development purposes
  useEffect(() => {
    // Simulated students data
    setStudents([
      { id: '1', name: 'Alex Johnson', role: 'student', year: 'Year 5', supportNeeds: ['Dyslexia', 'ADHD'], avatar: '' },
      { id: '2', name: 'Samira Patel', role: 'student', year: 'Year 3', supportNeeds: ['Dyscalculia'], avatar: '' },
      { id: '3', name: 'Jamie Wilson', role: 'student', year: 'Year 7', supportNeeds: ['ASD', 'Anxiety'], avatar: '' },
      { id: '4', name: 'Olivia Chen', role: 'student', year: 'Year 4', supportNeeds: ['EAL', 'Visual impairment'], avatar: '' },
    ]);

    // Simulated messages data
    setMessages([
      {
        id: '1',
        studentId: '1',
        sender: { name: 'Mrs. Thompson', role: 'teacher', avatar: '' },
        recipient: { name: 'Mr. Johnson', role: 'parent', avatar: '' },
        content: 'Alex has made excellent progress with his reading strategies this week. The text-to-speech tool has been particularly helpful.',
        timestamp: '2025-05-16T14:30:00',
        read: true,
        attachments: [],
        urgent: false
      },
      {
        id: '2',
        studentId: '1',
        sender: { name: 'Mr. Johnson', role: 'parent', avatar: '' },
        recipient: { name: 'Mrs. Thompson', role: 'teacher', avatar: '' },
        content: 'Thank you for the update. We\'ve been practicing the strategies at home too. Could you recommend any additional resources we could use over the weekend?',
        timestamp: '2025-05-16T18:45:00',
        read: true,
        attachments: [],
        urgent: false
      },
      {
        id: '3',
        studentId: '1',
        sender: { name: 'Mrs. Thompson', role: 'teacher', avatar: '' },
        recipient: { name: 'Mr. Johnson', role: 'parent', avatar: '' },
        content: 'Absolutely! I\'ve attached a PDF with some dyslexia-friendly reading activities that would be perfect for Alex. Also, our new high contrast mode in the platform might help with visual tracking.',
        timestamp: '2025-05-17T09:15:00',
        read: false,
        attachments: [{ name: 'Dyslexia_Reading_Activities.pdf', type: 'pdf', size: '1.2 MB' }],
        urgent: false
      },
      {
        id: '4',
        studentId: '3',
        sender: { name: 'Dr. Martinez', role: 'senco', avatar: '' },
        recipient: { name: 'Mrs. Wilson', role: 'parent', avatar: '' },
        content: 'Following our meeting yesterday, I\'ve updated Jamie\'s personalized intervention plan. The new sensory breaks schedule starts on Monday.',
        timestamp: '2025-05-16T16:20:00',
        read: true,
        attachments: [{ name: 'Jamie_Intervention_Plan_May2025.pdf', type: 'pdf', size: '2.4 MB' }],
        urgent: true
      }
    ]);

    // Set default selected student
    setSelectedStudent('1');
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStudent) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMsg = {
        id: Date.now().toString(),
        studentId: selectedStudent,
        sender: { name: 'Mrs. Thompson', role: 'teacher', avatar: '' },
        recipient: { name: 'Mr. Johnson', role: 'parent', avatar: '' },
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
        attachments: [],
        urgent: false
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setIsLoading(false);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    }, 1000);
  };

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Settings updated",
      description: `${key} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated'}.`,
    });
  };

  const filteredMessages = messages.filter(msg => msg.studentId === selectedStudent);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className={`flex flex-col ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Student List */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  Students
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {students.map(student => (
                    <div 
                      key={student.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${selectedStudent === student.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{student.year}</div>
                      </div>
                      {messages.some(m => m.studentId === student.id && !m.read) && (
                        <Badge variant="default" className="ml-auto">New</Badge>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Message Thread */}
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                {selectedStudentData && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedStudentData.avatar} />
                        <AvatarFallback>{selectedStudentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedStudentData.name}</CardTitle>
                        <CardDescription className="flex gap-2">
                          {selectedStudentData.year}
                          {selectedStudentData.supportNeeds.map((need: string) => (
                            <Badge key={need} variant="outline">{need}</Badge>
                          ))}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-4 py-2">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                      <div key={message.id} className="mb-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">{message.sender.name} <span className="text-xs text-muted-foreground">({message.sender.role})</span></div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {formatDate(message.timestamp)}
                                {message.urgent && <AlertCircle className="h-3 w-3 text-destructive" />}
                                {message.read && <CheckCircle2 className="h-3 w-3 text-muted-foreground" />}
                              </div>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm">{message.content}</p>
                              {message.attachments.length > 0 && (
                                <div className="mt-2 pt-2 border-t flex flex-col gap-1">
                                  {message.attachments.map((attachment: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                      <FileText className="h-3 w-3" />
                                      <span>{attachment.name}</span>
                                      <span className="text-muted-foreground">({attachment.size})</span>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-xs text-muted-foreground">Start a conversation with this student's parent or teacher</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="outline" size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Textarea 
                    placeholder="Type your message..." 
                    className="flex-1 min-h-[40px] h-10 py-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    variant="default" 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Scheduled Meetings
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your upcoming parent-teacher meetings and consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Select defaultValue="upcoming">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Alex Johnson - Annual Review</div>
                          <div className="text-sm text-muted-foreground">Parent-Teacher Conference</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Upcoming</Badge>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Date</div>
                        <div>May 20, 2025</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time</div>
                        <div>15:30 - 16:00</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div>Virtual (Zoom)</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Participants</div>
                        <div>Mrs. Thompson, Mr. & Mrs. Johnson</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>SP</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Samira Patel - Intervention Review</div>
                          <div className="text-sm text-muted-foreground">SENCO Consultation</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Upcoming</Badge>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Date</div>
                        <div>May 22, 2025</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time</div>
                        <div>14:00 - 14:30</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div>Room 12B</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Participants</div>
                        <div>Dr. Martinez, Mrs. Patel, Ms. Lee</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Jamie Wilson - Transition Planning</div>
                          <div className="text-sm text-muted-foreground">Multi-Agency Meeting</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Completed</Badge>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Minutes
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Date</div>
                        <div>May 10, 2025</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time</div>
                        <div>10:00 - 11:30</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div>Conference Room A</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Participants</div>
                        <div>Dr. Martinez, Mrs. Wilson, Mr. Clark, Ms. Ahmed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Communication Reports
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardTitle>
              <CardDescription>
                Generate and view reports on parent-teacher communication and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Communication Frequency</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">Messages this week</p>
                      <div className="text-xs text-emerald-500 mt-1">↑ 12% from last week</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">Messages responded to within 24h</p>
                      <div className="text-xs text-emerald-500 mt-1">↑ 5% from last month</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Parent Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold">87%</div>
                      <p className="text-xs text-muted-foreground">Parents actively engaged</p>
                      <div className="text-xs text-emerald-500 mt-1">↑ 8% from last term</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Available Reports</h3>
                  
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Communication Summary Report</div>
                            <div className="text-sm text-muted-foreground">Overview of all parent-teacher communications</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Intervention Feedback Report</div>
                            <div className="text-sm text-muted-foreground">Parent feedback on intervention effectiveness</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Meeting Attendance Report</div>
                            <div className="text-sm text-muted-foreground">Analysis of parent-teacher meeting attendance</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Communication Impact Report</div>
                            <div className="text-sm text-muted-foreground">Analysis of how communication affects student outcomes</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Custom Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="communication">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="communication">Communication Summary</SelectItem>
                          <SelectItem value="intervention">Intervention Feedback</SelectItem>
                          <SelectItem value="attendance">Meeting Attendance</SelectItem>
                          <SelectItem value="impact">Communication Impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date-range">Date Range</Label>
                      <Select defaultValue="term">
                        <SelectTrigger id="date-range">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Current Week</SelectItem>
                          <SelectItem value="month">Current Month</SelectItem>
                          <SelectItem value="term">Current Term</SelectItem>
                          <SelectItem value="year">Current Academic Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="format">Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription>
                Configure your preferences for parent-teacher communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive notifications via email</span>
                    </Label>
                    <Switch 
                      id="email-notifications" 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                      <span>SMS Notifications</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive notifications via text message</span>
                    </Label>
                    <Switch 
                      id="sms-notifications" 
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingsChange('smsNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="reminder-frequency" className="flex flex-col space-y-1">
                      <span>Reminder Frequency</span>
                      <span className="font-normal text-xs text-muted-foreground">How often to send reminders</span>
                    </Label>
                    <Select 
                      value={settings.reminderFrequency}
                      onValueChange={(value) => handleSettingsChange('reminderFrequency', value)}
                    >
                      <SelectTrigger id="reminder-frequency" className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="urgent-flagging" className="flex flex-col space-y-1">
                      <span>Urgent Message Flagging</span>
                      <span className="font-normal text-xs text-muted-foreground">Allow marking messages as urgent</span>
                    </Label>
                    <Switch 
                      id="urgent-flagging" 
                      checked={settings.urgentFlagging}
                      onCheckedChange={(checked) => handleSettingsChange('urgentFlagging', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy & Accessibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="privacy-mode" className="flex flex-col space-y-1">
                      <span>Enhanced Privacy Mode</span>
                      <span className="font-normal text-xs text-muted-foreground">Additional data protection for sensitive information</span>
                    </Label>
                    <Switch 
                      id="privacy-mode" 
                      checked={settings.privacyMode}
                      onCheckedChange={(checked) => handleSettingsChange('privacyMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="auto-translate" className="flex flex-col space-y-1">
                      <span>Automatic Translation</span>
                      <span className="font-normal text-xs text-muted-foreground">Translate messages to preferred language</span>
                    </Label>
                    <Switch 
                      id="auto-translate" 
                      checked={settings.autoTranslate}
                      onCheckedChange={(checked) => handleSettingsChange('autoTranslate', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="read-receipts" className="flex flex-col space-y-1">
                      <span>Read Receipts</span>
                      <span className="font-normal text-xs text-muted-foreground">Show when messages have been read</span>
                    </Label>
                    <Switch 
                      id="read-receipts" 
                      checked={settings.readReceipts}
                      onCheckedChange={(checked) => handleSettingsChange('readReceipts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="message-template" className="flex flex-col space-y-1">
                      <span>Message Templates</span>
                      <span className="font-normal text-xs text-muted-foreground">Enable pre-written message templates</span>
                    </Label>
                    <Switch 
                      id="message-template" 
                      checked={settings.messageTemplate}
                      onCheckedChange={(checked) => handleSettingsChange('messageTemplate', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Communication History
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Contact Information
                  </Button>
                  
                  <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Delete Communication History
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
