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
import { 
Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Home, 
  MessageSquare, 
  Search, 
  Settings, 
  Star, 
  Trophy, 
  Users, 
  User, 
  BarChart2, 
  Briefcase, 
  FileCheck,
  UserCheck,
  Activity,
  PieChart as PieChartIcon,
  Clipboard,
  Download
} from "lucide-react";
const caseloadData = [
  { name: 'Assessments', count: 12 },
  { name: 'Interventions', count: 8 },
  { name: 'Consultations', count: 15 },
  { name: 'Reports', count: 7 },
  { name: 'Follow-ups', count: 10 },
];

const monthlyActivity = [
  { month: 'Jan', assessments: 8, interventions: 5 },
  { month: 'Feb', assessments: 10, interventions: 7 },
  { month: 'Mar', assessments: 12, interventions: 9 },
  { month: 'Apr', assessments: 9, interventions: 11 },
  { month: 'May', assessments: 11, interventions: 8 },
  { month: 'Jun', assessments: 13, interventions: 10 },
];

const caseDistribution = [
  { name: 'ADHD', value: 25 },
  { name: 'Dyslexia', value: 20 },
  { name: 'Autism', value: 15 },
  { name: 'Anxiety', value: 18 },
  { name: 'Other', value: 22 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


// Original component
function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock data for demonstration
  const professionalData = {
    name: "Dr. Emily Roberts",
    title: "Educational Psychologist",
    licence: "CPsychol AFBPsS",
    registrationNumber: "PYL123456",
    caseload: 52,
    upcomingAppointments: 8
  };
  
  const upcomingAppointments = [
    {
      id: 1,
      studentName: "Michael Brown",
      type: "Initial Assessment",
      date: "June 8, 2025",
      time: "10:00 AM",
      location: "Oakwood High School"
    },
    {
      id: 2,
      studentName: "Sarah Williams",
      type: "Follow-up Consultation",
      date: "June 9, 2025",
      time: "2:30 PM",
      location: "Virtual Meeting"
    },
    {
      id: 3,
      studentName: "James Taylor",
      type: "Intervention Review",
      date: "June 10, 2025",
      time: "11:15 AM",
      location: "Riverside Elementary"
    }
  ];
  
  const pendingReports = [
    {
      id: 1,
      studentName: "Emma Davis",
      type: "Psychoeducational Assessment",
      dueDate: "June 12, 2025",
      status: "In Progress",
      completion: 75
    },
    {
      id: 2,
      studentName: "Thomas Wilson",
      type: "Behavior Intervention Plan",
      dueDate: "June 15, 2025",
      status: "Not Started",
      completion: 0
    },
    {
      id: 3,
      studentName: "Olivia Martinez",
      type: "Annual Review",
      dueDate: "June 20, 2025",
      status: "In Progress",
      completion: 40
    }
  ];
  
  const recentActivity = [
    {
      id: 1,
      studentName: "Daniel Johnson",
      action: "Assessment Completed",
      date: "June 3, 2025",
      details: "Cognitive and academic assessment completed"
    },
    {
      id: 2,
      studentName: "Sophia Garcia",
      action: "Report Submitted",
      date: "June 2, 2025",
      details: "Comprehensive evaluation report submitted to school"
    },
    {
      id: 3,
      studentName: "Noah Smith",
      action: "Consultation Held",
      date: "June 1, 2025",
      details: "Teacher consultation regarding classroom accommodations"
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
                <AvatarImage src="/images/avatars/professional-avatar.png" alt="Professional Avatar" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">{professionalData.name}</h2>
              <p className="text-muted-foreground">{professionalData.title}</p>
              <p className="text-xs text-muted-foreground">{professionalData.licence} • {professionalData.registrationNumber}</p>
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
                  variant={activeTab === "caseload" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("caseload")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Caseload
                </Button>
                <Button 
                  variant={activeTab === "assessments" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("assessments")}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Assessments
                </Button>
                <Button 
                  variant={activeTab === "reports" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
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
                  variant={activeTab === "resources" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("resources")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Resources
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
              <CardTitle className="text-sm font-medium">Caseload Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={caseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {caseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-center text-muted-foreground mt-2">
                Based on primary referral reasons
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Professional Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your caseload, assessments, and professional activities
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
              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Caseload
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{professionalData.caseload}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Active cases
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Appointments
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{professionalData.upcomingAppointments}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Next 7 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Reports
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingReports.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Due this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recent Activity
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{recentActivity.length}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      In the past week
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>
                    Assessments and interventions conducted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyActivity}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="assessments" fill="#8884d8" name="Assessments" />
                        <Bar dataKey="interventions" fill="#82ca9d" name="Interventions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    Your scheduled appointments for the next week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.studentName}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{appointment.type}</Badge>
                              <p className="text-sm text-muted-foreground">{appointment.date} • {appointment.time}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{appointment.location}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Pending Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reports</CardTitle>
                  <CardDescription>
                    Reports that need to be completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div key={report.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{report.studentName}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{report.type}</Badge>
                              <p className="text-sm text-muted-foreground">Due: {report.dueDate}</p>
                            </div>
                          </div>
                          <Badge variant={
                            report.status === "In Progress" ? "secondary" : 
                            report.status === "Not Started" ? "destructive" : "default"
                          }>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Completion</span>
                            <span>{report.completion}%</span>
                          </div>
                          <Progress value={report.completion} className="h-2" />
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Clipboard className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Reports
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent professional activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {activity.action.includes('Assessment') ? (
                            <FileCheck className="h-5 w-5 text-blue-600" />
                          ) : activity.action.includes('Report') ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.studentName}</h4>
                            <span className="text-sm text-muted-foreground">{activity.date}</span>
                          </div>
                          <p className="text-sm font-medium mt-1">{activity.action}</p>
                          <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab === "caseload" && (
            <div className="space-y-6">
              {/* Caseload Overview */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">52</div>
                    <p className="text-xs text-muted-foreground">8 new this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Awaiting Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 priority</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Review Due</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">Within 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Case List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Caseload</CardTitle>
                  <CardDescription>All active cases assigned to you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Alex Thompson", school: "Oakwood High", status: "Active", priority: "High", lastContact: "2 days ago" },
                      { name: "Emma Wilson", school: "Riverside Elementary", status: "Assessment", priority: "Medium", lastContact: "1 week ago" },
                      { name: "James Chen", school: "Central Academy", status: "Intervention", priority: "Low", lastContact: "3 days ago" },
                      { name: "Sophie Martinez", school: "Westfield Primary", status: "Review", priority: "High", lastContact: "Today" },
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">{student.school}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={student.priority === "High" ? "destructive" : student.priority === "Medium" ? "default" : "secondary"}>
                            {student.priority} Priority
                          </Badge>
                          <Badge variant="outline">{student.status}</Badge>
                          <span className="text-sm text-muted-foreground">{student.lastContact}</span>
                          <Button size="sm">View Case</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Cases</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "assessments" && (
            <div className="space-y-6">
              {/* Assessment Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Tools</CardTitle>
                  <CardDescription>Standardised assessments and evaluation tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { name: "WISC-V", type: "Cognitive", lastUsed: "3 days ago", uses: 156 },
                      { name: "WIAT-III", type: "Achievement", lastUsed: "1 week ago", uses: 98 },
                      { name: "BASC-3", type: "Behavioral", lastUsed: "Today", uses: 134 },
                      { name: "Conners 3", type: "ADHD", lastUsed: "5 days ago", uses: 87 },
                    ].map((tool, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{tool.name}</h4>
                            <Badge variant="outline" className="mt-1">{tool.type}</Badge>
                          </div>
                          <Button size="sm">Start Assessment</Button>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Last used: {tool.lastUsed}</span>
                          <span>{tool.uses} total uses</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>Completed and in-progress assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { student: "Michael Brown", assessment: "WISC-V", date: "June 5, 2025", status: "Completed", score: "Report Ready" },
                      { student: "Sarah Williams", assessment: "WIAT-III", date: "June 4, 2025", status: "In Progress", score: "75% Complete" },
                      { student: "Emma Davis", assessment: "BASC-3", date: "June 3, 2025", status: "Completed", score: "Under Review" },
                    ].map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{assessment.student}</h4>
                          <p className="text-sm text-muted-foreground">{assessment.assessment} • {assessment.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={assessment.status === "Completed" ? "secondary" : "default"}>
                            {assessment.status}
                          </Badge>
                          <span className="text-sm">{assessment.score}</span>
                          <Button size="sm" variant="outline">
                            {assessment.status === "Completed" ? "View Report" : "Continue"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Report Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Templates</CardTitle>
                  <CardDescription>Standardised templates for professional reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { name: "Psychoeducational Report", icon: FileText, count: 45 },
                      { name: "Consultation Summary", icon: MessageSquare, count: 78 },
                      { name: "Behaviour Intervention Plan", icon: Clipboard, count: 23 },
                      { name: "Annual Review Report", icon: Calendar, count: 34 },
                      { name: "Initial Assessment Report", icon: FileCheck, count: 56 },
                      { name: "Progress Monitoring Report", icon: BarChart2, count: 89 },
                    ].map((template, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <template.icon className="h-8 w-8 text-primary" />
                          <span className="text-sm text-muted-foreground">{template.count} used</span>
                        </div>
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Button size="sm" className="w-full mt-2">Use Template</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Your recently created and edited reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{report.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{report.type}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">Due: {report.dueDate}</p>
                              <Progress value={report.completion} className="h-2 w-32 mt-1" />
                            </div>
                            <Button size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              {/* Calendar View */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Calendar</CardTitle>
                  <CardDescription>Manage your appointments and schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {/* Weekly View */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">This Week</h3>
                      <div className="space-y-2">
                        {[
                          { day: "Monday", date: "June 10", events: 3 },
                          { day: "Tuesday", date: "June 11", events: 2 },
                          { day: "Wednesday", date: "June 12", events: 4 },
                          { day: "Thursday", date: "June 13", events: 2 },
                          { day: "Friday", date: "June 14", events: 1 },
                        ].map((day, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{day.day}</p>
                              <p className="text-sm text-muted-foreground">{day.date}</p>
                            </div>
                            <Badge>{day.events} events</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Today's Schedule</h3>
                      <div className="space-y-3">
                        {upcomingAppointments.map((apt) => (
                          <div key={apt.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            <div className="text-center min-w-[60px]">
                              <p className="text-sm font-medium">{apt.time}</p>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{apt.studentName}</p>
                              <p className="text-sm text-muted-foreground">{apt.type} • {apt.location}</p>
                            </div>
                            <Button size="sm" variant="outline">Details</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Open Full Calendar
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-6">
              {/* Resource Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Resources</CardTitle>
                  <CardDescription>Tools, guides, and materials for educational psychology practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { category: "Assessment Protocols", icon: FileCheck, count: 24, color: "bg-blue-100 text-blue-700" },
                      { category: "Intervention Strategies", icon: Briefcase, count: 45, color: "bg-green-100 text-green-700" },
                      { category: "Parent Resources", icon: Users, count: 38, color: "bg-purple-100 text-purple-700" },
                      { category: "Teacher Guidance", icon: BookOpen, count: 56, color: "bg-orange-100 text-orange-700" },
                      { category: "Legal & Ethical", icon: FileText, count: 19, color: "bg-red-100 text-red-700" },
                      { category: "Research Articles", icon: Search, count: 82, color: "bg-indigo-100 text-indigo-700" },
                    ].map((resource, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`inline-flex p-3 rounded-lg ${resource.color} mb-3`}>
                          <resource.icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-medium">{resource.category}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{resource.count} resources</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Downloads */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Downloads</CardTitle>
                  <CardDescription>Your recently accessed resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "ADHD Intervention Toolkit", type: "PDF", size: "2.4 MB", date: "Today" },
                      { name: "Anxiety Assessment Scale", type: "Form", size: "156 KB", date: "Yesterday" },
                      { name: "Parent Communication Templates", type: "DOCX", size: "890 KB", date: "3 days ago" },
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.type} • {file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{file.date}</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              {/* Message Overview */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 unread</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Archived</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Communications with parents, teachers, and colleagues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { from: "Jane Smith (Parent)", subject: "Re: Assessment Results for Tommy", time: "2 hours ago", unread: true },
                      { from: "Mr. Johnson (Teacher)", subject: "Behavioral Strategies Update", time: "5 hours ago", unread: true },
                      { from: "Dr. Sarah Lee", subject: "Case Consultation - Emma Wilson", time: "Yesterday", unread: false },
                      { from: "Principal Anderson", subject: "Monthly Team Meeting", time: "2 days ago", unread: false },
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

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your professional information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={professionalData.name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={professionalData.title} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">License Number</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={professionalData.licence} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Number</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={professionalData.registrationNumber} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Email notifications for new referrals", enabled: true },
                      { label: "SMS alerts for urgent cases", enabled: false },
                      { label: "Weekly summary reports", enabled: true },
                      { label: "Meeting reminders", enabled: true },
                      { label: "Report deadline notifications", enabled: true },
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

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>Manage your data and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalDashboard;