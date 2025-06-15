'use client';

import dynamic from 'next/dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Bell, BookOpen, Calendar, CheckCircle, Clock, FileText, Home, MessageSquare, Search, Settings, Star, Trophy, Users, User, BarChart2, School, GraduationCap } from "lucide-react";
const childrenProgress = [
  { name: 'English', progress: 75, target: 85 },
  { name: 'Mathematics', progress: 82, target: 85 },
  { name: 'Science', progress: 68, target: 80 },
  { name: 'History', progress: 90, target: 85 },
  { name: 'Geography', progress: 72, target: 80 },
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.1 },
  { day: 'Sat', hours: 1.2 },
  { day: 'Sun', hours: 0.8 },
];


// Original component
function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock data for demonstration
  const parentData = {
    name: "Sarah Johnson",
    children: [
      { name: "Alex Johnson", mark: "Year 10", school: "Oakwood High" },
      { name: "Emma Johnson", mark: "Year 8", school: "Oakwood High" }
    ],
    upcomingEvents: [
      { title: "Parent-Teacher Conference", date: "June 15, 2025", time: "4:00 PM" },
      { title: "School Concert", date: "June 22, 2025", time: "6:30 PM" },
      { title: "End of Term Report", date: "July 10, 2025", time: "N/A" }
    ]
  };
  
  const childrenAssignments = [
    {
      id: 1,
      childName: "Alex",
      title: "History Essay: World War II",
      dueDate: "Tomorrow",
      status: "In Progress",
      subject: "History"
    },
    {
      id: 2,
      childName: "Alex",
      title: "Math Quiz: Algebra",
      dueDate: "Friday",
      status: "Not Started",
      subject: "Mathematics"
    },
    {
      id: 3,
      childName: "Emma",
      title: "Science Project: Ecosystems",
      dueDate: "Next Week",
      status: "In Progress",
      subject: "Science"
    }
  ];
  
  const recentUpdates = [
    {
      id: 1,
      childName: "Alex",
      type: "Mark",
      subject: "Mathematics",
      details: "Scored 85% on Algebra Test",
      date: "Yesterday"
    },
    {
      id: 2,
      childName: "Emma",
      type: "Attendance",
      subject: null,
      details: "Absent from school",
      date: "June 3, 2025"
    },
    {
      id: 3,
      childName: "Alex",
      type: "Behavior",
      subject: null,
      details: "Positive note from English teacher",
      date: "June 2, 2025"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Avatar className="h-20 w-20 my-2">
                <AvatarImage src="/images/avatars/parent-avatar.png" alt="Parent Avatar" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">{parentData.name}</h2>
              <p className="text-muted-foreground">Parent Account</p>
              <Button className="w-full mt-4">Edit Profile</Button>
            </CardContent>
            <Separator />
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                <Button 
                  variant={activeTab === "dashboard" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "children" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("children")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  My Children
                </Button>
                <Button 
                  variant={activeTab === "progress" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("progress")}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Progress Reports
                </Button>
                <Button 
                  variant={activeTab === "assignments" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("assignments")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Assignments
                </Button>
                <Button 
                  variant={activeTab === "messages" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button 
                  variant={activeTab === "calendar" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Children</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {parentData.children.map((child, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{child.name}</p>
                      <p className="text-xs text-muted-foreground">{child.mark} • {child.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your children's progress and stay connected with their education
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] rounded-full bg-background pl-8 py-2 text-sm ring-1 ring-slate-200 dark:ring-slate-800"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Children Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Children
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{parentData.children.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Registered in the system
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Events
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{parentData.upcomingEvents.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      In the next 30 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Assignments
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{childrenAssignments.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Across all children
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recent Updates
                    </CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{recentUpdates.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      In the past week
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Children Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Children's Academic Progress</CardTitle>
                  <CardDescription>
                    Current progress across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={childrenProgress}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="progress" fill="#8884d8" name="Current Progress" />
                        <Bar dataKey="target" fill="#82ca9d" name="Target" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    School events and important dates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parentData.upcomingEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} {event.time !== "N/A" && `• ${event.time}`}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Add to Calendar</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Events
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>
                    Latest updates about your children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUpdates.map((update) => (
                      <div key={update.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          update.type === 'Mark' ? 'bg-blue-100' : 
                          update.type === 'Attendance' ? 'bg-amber-100' : 'bg-green-100'
                        }`}>
                          {update.type === 'Mark' ? (
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          ) : update.type === 'Attendance' ? (
                            <School className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Star className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{update.childName}</h4>
                            <span className="text-sm text-muted-foreground">{update.date}</span>
                          </div>
                          <p className="text-sm mt-1">{update.details}</p>
                          {update.subject && (
                            <Badge variant="outline" className="mt-2">{update.subject}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Updates
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab === "children" && (
            <div className="space-y-6">
              {/* Children Overview */}
              <div className="grid gap-4 md:grid-cols-2">
                {parentData.children.map((child, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{child.name}</CardTitle>
                            <CardDescription>{child.mark} • {child.school}</CardDescription>
                          </div>
                        </div>
                        <Button size="sm">View Profile</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Progress</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Attendance</p>
                            <p className="font-medium">95%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Assignments</p>
                            <p className="font-medium">12/15 Complete</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Average Grade</p>
                            <p className="font-medium">B+</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Behavior Points</p>
                            <p className="font-medium">45</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Teachers
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Across All Children</CardTitle>
                  <CardDescription>Latest updates from school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { child: "Alex", activity: "Submitted History Essay", time: "2 hours ago", type: "assignment" },
                      { child: "Emma", activity: "Attended Science Lab", time: "Today", type: "attendance" },
                      { child: "Alex", activity: "Received Merit Award", time: "Yesterday", type: "achievement" },
                      { child: "Emma", activity: "Parent signature required for field trip", time: "2 days ago", type: "action" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'assignment' ? 'bg-blue-500' :
                            item.type === 'attendance' ? 'bg-green-500' :
                            item.type === 'achievement' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium">{item.child}: {item.activity}</p>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                        {item.type === 'action' && (
                          <Button size="sm">Take Action</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-6">
              {/* Subject Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress by Subject</CardTitle>
                  <CardDescription>Detailed progress tracking for all children</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="alex" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="alex">Alex Johnson</TabsTrigger>
                      <TabsTrigger value="emma">Emma Johnson</TabsTrigger>
                    </TabsList>
                    <TabsContent value="alex" className="space-y-4">
                      <div className="space-y-4">
                        {[
                          { subject: "Mathematics", current: 82, previous: 78, trend: "up" },
                          { subject: "English", current: 75, previous: 73, trend: "up" },
                          { subject: "Science", current: 88, previous: 90, trend: "down" },
                          { subject: "History", current: 91, previous: 89, trend: "up" },
                          { subject: "Geography", current: 79, previous: 79, trend: "stable" },
                        ].map((subject, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{subject.subject}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Current: {subject.current}%</span>
                                {subject.trend === "up" && <span className="text-green-500 text-sm">↑</span>}
                                {subject.trend === "down" && <span className="text-red-500 text-sm">↓</span>}
                                {subject.trend === "stable" && <span className="text-gray-500 text-sm">→</span>}
                              </div>
                            </div>
                            <Progress value={subject.current} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="emma" className="space-y-4">
                      <div className="space-y-4">
                        {[
                          { subject: "Mathematics", current: 76, previous: 72, trend: "up" },
                          { subject: "English", current: 84, previous: 85, trend: "down" },
                          { subject: "Science", current: 92, previous: 88, trend: "up" },
                          { subject: "History", current: 78, previous: 76, trend: "up" },
                          { subject: "Art", current: 95, previous: 93, trend: "up" },
                        ].map((subject, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{subject.subject}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Current: {subject.current}%</span>
                                {subject.trend === "up" && <span className="text-green-500 text-sm">↑</span>}
                                {subject.trend === "down" && <span className="text-red-500 text-sm">↓</span>}
                                {subject.trend === "stable" && <span className="text-gray-500 text-sm">→</span>}
                              </div>
                            </div>
                            <Progress value={subject.current} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Timeline</CardTitle>
                  <CardDescription>Track improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Sep', alex: 72, emma: 78 },
                          { month: 'Oct', alex: 74, emma: 80 },
                          { month: 'Nov', alex: 76, emma: 79 },
                          { month: 'Dec', alex: 78, emma: 82 },
                          { month: 'Jan', alex: 80, emma: 84 },
                          { month: 'Feb', alex: 82, emma: 83 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="alex" stroke="#8884d8" name="Alex" />
                        <Line type="monotone" dataKey="emma" stroke="#82ca9d" name="Emma" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Teacher Feedback</CardTitle>
                  <CardDescription>Comments and observations from teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { teacher: "Ms. Smith", subject: "Mathematics", child: "Alex", comment: "Excellent problem-solving skills shown in recent algebra test", date: "3 days ago" },
                      { teacher: "Mr. Johnson", subject: "Science", child: "Emma", comment: "Great participation in lab experiments, shows strong understanding", date: "1 week ago" },
                      { teacher: "Mrs. Davis", subject: "English", child: "Alex", comment: "Writing has improved significantly this term", date: "2 weeks ago" },
                    ].map((feedback, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{feedback.teacher} • {feedback.subject}</p>
                            <p className="text-sm text-muted-foreground">For {feedback.child}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{feedback.date}</span>
                        </div>
                        <p className="text-sm">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="space-y-6">
              {/* Assignment Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Overview</CardTitle>
                  <CardDescription>Track all assignments across your children</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">All Children</Button>
                    <Button variant="outline" size="sm">This Week</Button>
                    <Button variant="outline" size="sm">Pending</Button>
                    <Button variant="outline" size="sm">Completed</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { child: "Alex", subject: "History", title: "World War II Essay", dueDate: "Tomorrow", status: "in-progress", completion: 75 },
                      { child: "Alex", subject: "Mathematics", title: "Algebra Problem Set", dueDate: "Friday", status: "not-started", completion: 0 },
                      { child: "Emma", subject: "Science", title: "Ecosystem Project", dueDate: "Next Monday", status: "in-progress", completion: 40 },
                      { child: "Emma", subject: "English", title: "Book Report: To Kill a Mockingbird", dueDate: "Next Week", status: "in-progress", completion: 60 },
                      { child: "Alex", subject: "Geography", title: "Map Project", dueDate: "Completed", status: "completed", completion: 100 },
                    ].map((assignment, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{assignment.title}</h4>
                              <Badge variant={
                                assignment.status === 'completed' ? 'secondary' :
                                assignment.status === 'in-progress' ? 'default' : 'destructive'
                              }>
                                {assignment.status === 'completed' ? 'Completed' :
                                 assignment.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{assignment.child} • {assignment.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{assignment.dueDate}</p>
                            {assignment.status !== 'completed' && (
                              <Button size="sm" variant="outline" className="mt-2">Help Child</Button>
                            )}
                          </div>
                        </div>
                        {assignment.status !== 'completed' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{assignment.completion}%</span>
                            </div>
                            <Progress value={assignment.completion} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              {/* Message Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">2 unread</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Important</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Action required</p>
                  </CardContent>
                </Card>
              </div>

              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Communication with teachers and school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { from: "Ms. Smith (Math Teacher)", subject: "Alex's Progress Update", time: "2 hours ago", unread: true, important: false },
                      { from: "School Office", subject: "Parent-Teacher Conference Schedule", time: "Yesterday", unread: true, important: true },
                      { from: "Mr. Johnson (Science)", subject: "Re: Emma's Science Fair Project", time: "2 days ago", unread: false, important: false },
                      { from: "Principal Anderson", subject: "Important: School Policy Update", time: "3 days ago", unread: false, important: true },
                    ].map((message, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 border rounded-lg ${message.unread ? 'bg-muted/50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{message.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{message.from}</p>
                              {message.unread && <Badge variant="default" className="h-5">New</Badge>}
                              {message.important && <Badge variant="destructive" className="h-5">Important</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{message.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{message.time}</span>
                          <Button size="sm" variant="outline">Open</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Compose New Message
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              {/* Calendar View */}
              <Card>
                <CardHeader>
                  <CardTitle>School Calendar</CardTitle>
                  <CardDescription>Important dates and events for your children</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {/* This Week */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">This Week</h3>
                      <div className="space-y-2">
                        {[
                          { day: "Monday", date: "June 10", events: ["Alex: Math Test", "Emma: Art Class"] },
                          { day: "Tuesday", date: "June 11", events: ["School Assembly 9:00 AM"] },
                          { day: "Wednesday", date: "June 12", events: ["Alex: History Essay Due"] },
                          { day: "Thursday", date: "June 13", events: ["Emma: Science Fair Setup"] },
                          { day: "Friday", date: "June 14", events: ["Science Fair", "Early Dismissal 2:00 PM"] },
                        ].map((day, index) => (
                          <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{day.day}</p>
                              <p className="text-sm text-muted-foreground">{day.date}</p>
                            </div>
                            <div className="text-right">
                              {day.events.map((event, i) => (
                                <p key={i} className="text-sm">{event}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Upcoming Events</h3>
                      <div className="space-y-3">
                        {[
                          { event: "Parent-Teacher Conference", date: "June 15", time: "4:00 PM - 7:00 PM", type: "meeting" },
                          { event: "School Concert", date: "June 22", time: "6:30 PM", type: "event" },
                          { event: "Sports Day", date: "June 28", time: "All Day", type: "event" },
                          { event: "End of Term", date: "July 10", time: "12:00 PM", type: "important" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                item.type === 'meeting' ? 'bg-blue-500' :
                                item.type === 'event' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <p className="font-medium">{item.event}</p>
                                <p className="text-sm text-muted-foreground">{item.date} • {item.time}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Full Calendar</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your parent account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={parentData.name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="sarah.johnson@email.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <input type="tel" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="+44 7700 900000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preferred Contact Method</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>Email</option>
                        <option>Phone</option>
                        <option>SMS</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Assignment updates", enabled: true },
                      { label: "Attendance notifications", enabled: true },
                      { label: "Grade updates", enabled: true },
                      { label: "School announcements", enabled: true },
                      { label: "Teacher messages", enabled: true },
                      { label: "Event reminders", enabled: false },
                      { label: "Weekly progress summary", enabled: true },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="text-sm font-medium">{setting.label}</label>
                        <Button variant={setting.enabled ? "default" : "outline"} size="sm">
                          {setting.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Connected Children */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Children</CardTitle>
                  <CardDescription>Manage your children's profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parentData.children.map((child, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-muted-foreground">{child.mark} • {child.school}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Permissions</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Add Another Child</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;