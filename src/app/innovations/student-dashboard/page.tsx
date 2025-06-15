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
import { Bell, BookOpen, Calendar, CheckCircle, Clock, FileText, Home, MessageSquare, Search, Settings, Star, Trophy, Target, Award, Zap, Brain, Gamepad2, Video } from "lucide-react";
const subjectProgress = [
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

const learningStyleData = [
  { name: 'Visual', value: 40 },
  { name: 'Auditory', value: 25 },
  { name: 'Reading/Writing', value: 20 },
  { name: 'Kinesthetic', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


// Original component
function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Avatar className="h-20 w-20 my-2">
                <AvatarImage src="/images/avatars/student-avatar.png" alt="Student Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">Jamie Davies</h2>
              <p className="text-muted-foreground">Year 5 - Maple Class</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2 text-sm font-medium">4.2</span>
              </div>
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
                  variant={activeTab === "subjects" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("subjects")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Subjects
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
                  variant={activeTab === "goals" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("goals")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Goals
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
              <CardTitle className="text-sm font-medium">Learning Style</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={learningStyleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {learningStyleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-center text-muted-foreground mt-2">
                Based on your learning activities and preferences
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">
                Track your progress, manage assignments, and set learning goals
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
                      Overall Progress
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <Progress value={78} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Assignments Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24/30</div>
                    <Progress value={80} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      6 assignments remaining
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Learning Hours
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">16.1h</div>
                    <Progress value={65} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      This week (target: 25h)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Achievement Badges
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <Progress value={60} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      8 more to reach next level
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>
                      Your current progress across all subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={subjectProgress}
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                    <CardDescription>
                      Hours spent learning each day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weeklyActivity}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="hours"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Hours"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Upcoming Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>
                    Your pending tasks and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Mathematics Problem Set", subject: "Mathematics", due: "Tomorrow", status: "Not Started", priority: "High" },
                      { title: "Book Report", subject: "English", due: "3 days", status: "In Progress", priority: "Medium" },
                      { title: "Science Experiment", subject: "Science", due: "5 days", status: "Not Started", priority: "Medium" },
                      { title: "History Timeline", subject: "History", due: "1 week", status: "In Progress", priority: "Low" },
                    ].map((assignment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.due}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            assignment.status === "Not Started" ? "outline" : 
                            assignment.status === "In Progress" ? "secondary" : "default"
                          }>
                            {assignment.status}
                          </Badge>
                          <Badge variant={
                            assignment.priority === "High" ? "destructive" : 
                            assignment.priority === "Medium" ? "default" : "outline"
                          }>
                            {assignment.priority}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Assignments
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>
                    Badges and milestones you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Math Master", description: "Completed all algebra exercises with 90%+ accuracy", date: "2 days ago" },
                      { name: "Bookworm", description: "Read 5 books this month", date: "1 week ago" },
                      { name: "Science Explorer", description: "Completed all science experiments", date: "2 weeks ago" },
                      { name: "Consistent Learner", description: "Logged in for 14 consecutive days", date: "3 weeks ago" },
                    ].map((achievement, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-primary h-2"></div>
                        <CardHeader className="p-4">
                          <div className="flex justify-center mb-2">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <CardTitle className="text-center text-sm">{achievement.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-center text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-center mt-2 font-medium">{achievement.date}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab === "subjects" && (
            <div className="space-y-6">
              {/* Subject Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Mathematics", teacher: "Ms. Smith", progress: 82, nextLesson: "Algebra: Quadratic Equations", icon: Brain, color: "bg-blue-100 text-blue-700" },
                  { name: "English", teacher: "Mr. Johnson", progress: 75, nextLesson: "Creative Writing Workshop", icon: BookOpen, color: "bg-green-100 text-green-700" },
                  { name: "Science", teacher: "Dr. Chen", progress: 68, nextLesson: "Chemistry Lab: Reactions", icon: Zap, color: "bg-purple-100 text-purple-700" },
                  { name: "History", teacher: "Mrs. Davis", progress: 90, nextLesson: "World War II Timeline", icon: Clock, color: "bg-orange-100 text-orange-700" },
                  { name: "Geography", teacher: "Mr. Wilson", progress: 72, nextLesson: "Climate Zones Study", icon: Target, color: "bg-red-100 text-red-700" },
                  { name: "Art", teacher: "Ms. Garcia", progress: 88, nextLesson: "Digital Art Techniques", icon: Gamepad2, color: "bg-pink-100 text-pink-700" },
                ].map((subject, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${subject.color}`}>
                            <subject.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{subject.name}</CardTitle>
                            <CardDescription>{subject.teacher}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{subject.progress}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} className="h-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Lesson:</p>
                          <p className="text-sm font-medium">{subject.nextLesson}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button size="sm" className="flex-1">View Lessons</Button>
                      <Button size="sm" variant="outline" className="flex-1">Resources</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Learning Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Learning Recommendations</CardTitle>
                  <CardDescription>Based on your learning style and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Interactive Math Videos", subject: "Mathematics", type: "Video", duration: "15 min" },
                      { title: "Grammar Practice Quiz", subject: "English", type: "Quiz", duration: "10 min" },
                      { title: "Virtual Science Lab", subject: "Science", type: "Interactive", duration: "20 min" },
                      { title: "History Timeline Game", subject: "History", type: "Game", duration: "25 min" },
                    ].map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{rec.title}</p>
                            <p className="text-sm text-muted-foreground">{rec.subject} • {rec.type} • {rec.duration}</p>
                          </div>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="space-y-6">
              {/* Assignment Statistics */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">30</div>
                    <p className="text-xs text-muted-foreground">This term</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">80% completion rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">Currently working on</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">Within 3 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Assignment Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>My Assignments</CardTitle>
                  <CardDescription>Track and manage your schoolwork</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="space-y-4">
                      {[
                        { title: "Algebra Problem Set", subject: "Mathematics", dueDate: "Tomorrow", progress: 60, difficulty: "Medium" },
                        { title: "Essay: My Summer Holiday", subject: "English", dueDate: "3 days", progress: 30, difficulty: "Easy" },
                        { title: "Science Lab Report", subject: "Science", dueDate: "5 days", progress: 0, difficulty: "Hard" },
                        { title: "Geography Map Project", subject: "Geography", dueDate: "1 week", progress: 20, difficulty: "Medium" },
                      ].map((assignment, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Due: {assignment.dueDate}</p>
                              <Badge variant={
                                assignment.difficulty === "Easy" ? "secondary" :
                                assignment.difficulty === "Medium" ? "default" : "destructive"
                              }>
                                {assignment.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{assignment.progress}%</span>
                            </div>
                            <Progress value={assignment.progress} className="h-2" />
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" className="flex-1">Continue</Button>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="completed" className="space-y-4">
                      {[
                        { title: "History Timeline Project", subject: "History", completedDate: "2 days ago", grade: "A" },
                        { title: "Math Quiz: Fractions", subject: "Mathematics", completedDate: "1 week ago", grade: "B+" },
                        { title: "Book Report: Harry Potter", subject: "English", completedDate: "2 weeks ago", grade: "A-" },
                      ].map((assignment, index) => (
                        <div key={index} className="p-4 border rounded-lg opacity-75">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">{assignment.subject} • Completed {assignment.completedDate}</p>
                            </div>
                            <Badge variant="secondary">Grade: {assignment.grade}</Badge>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="overdue" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                        <p>Great job! You have no overdue assignments.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              {/* Goal Overview */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Currently working on</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15</div>
                    <p className="text-xs text-muted-foreground">This year</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7 days</div>
                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                  </CardContent>
                </Card>
              </div>

              {/* Current Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>My Learning Goals</CardTitle>
                  <CardDescription>Track your progress towards your goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Master Algebra", category: "Academic", progress: 65, deadline: "End of term", reward: "Math Champion Badge" },
                      { title: "Read 20 Books", category: "Personal", progress: 40, deadline: "This year", reward: "Bookworm Award" },
                      { title: "Perfect Attendance", category: "School", progress: 90, deadline: "This month", reward: "Attendance Star" },
                      { title: "Science Fair Winner", category: "Competition", progress: 30, deadline: "Next month", reward: "Innovation Trophy" },
                    ].map((goal, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              {goal.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{goal.category} • Deadline: {goal.deadline}</p>
                          </div>
                          <Badge variant="outline">{goal.progress}%</Badge>
                        </div>
                        <Progress value={goal.progress} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Reward: {goal.reward}</span>
                          <Button size="sm" variant="outline">Update Progress</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Create New Goal
                  </Button>
                </CardFooter>
              </Card>

              {/* Rewards & Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Rewards & Achievements</CardTitle>
                  <CardDescription>Your earned rewards and upcoming milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                      { name: "Early Bird", earned: true, icon: "🌅" },
                      { name: "Math Wizard", earned: true, icon: "🧙" },
                      { name: "Speed Reader", earned: true, icon: "📚" },
                      { name: "Team Player", earned: true, icon: "🤝" },
                      { name: "Creative Mind", earned: false, icon: "🎨" },
                      { name: "Science Star", earned: false, icon: "⭐" },
                    ].map((reward, index) => (
                      <div key={index} className={`text-center p-3 rounded-lg border ${reward.earned ? 'bg-primary/10' : 'opacity-50'}`}>
                        <div className="text-3xl mb-2">{reward.icon}</div>
                        <p className="text-xs font-medium">{reward.name}</p>
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
                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 unread</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">From Teachers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">School updates</p>
                  </CardContent>
                </Card>
              </div>

              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Messages</CardTitle>
                  <CardDescription>Communication from teachers and school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { from: "Ms. Smith", subject: "Great work on your math test!", time: "2 hours ago", unread: true, type: "praise" },
                      { from: "School Office", subject: "Reminder: Science Fair next week", time: "Yesterday", unread: true, type: "announcement" },
                      { from: "Mr. Johnson", subject: "Feedback on your essay", time: "2 days ago", unread: true, type: "feedback" },
                      { from: "Dr. Chen", subject: "Extra credit opportunity", time: "3 days ago", unread: false, type: "opportunity" },
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
                              <Badge variant="outline" className="h-5">
                                {message.type === 'praise' ? '🌟' :
                                 message.type === 'announcement' ? '📢' :
                                 message.type === 'feedback' ? '💬' : '🎯'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{message.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{message.time}</span>
                          <Button size="sm" variant="outline">Read</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Messages</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your classes and activities for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: "8:30 AM", subject: "Mathematics", room: "Room 203", type: "class" },
                      { time: "9:30 AM", subject: "English", room: "Room 105", type: "class" },
                      { time: "10:30 AM", subject: "Break Time", room: "Playground", type: "break" },
                      { time: "11:00 AM", subject: "Science Lab", room: "Lab 2", type: "class" },
                      { time: "12:00 PM", subject: "Lunch", room: "Cafeteria", type: "break" },
                      { time: "1:00 PM", subject: "History", room: "Room 301", type: "class" },
                      { time: "2:00 PM", subject: "Art Club", room: "Art Studio", type: "activity" },
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        item.type === 'break' ? 'bg-green-50' :
                        item.type === 'activity' ? 'bg-purple-50' : 'bg-blue-50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium w-20">{item.time}</div>
                          <div>
                            <p className="font-medium">{item.subject}</p>
                            <p className="text-sm text-muted-foreground">{item.room}</p>
                          </div>
                        </div>
                        {item.type === 'class' && (
                          <Button size="sm" variant="outline">View Lesson</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Important dates and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { event: "Science Fair", date: "June 15", time: "All Day", type: "competition" },
                      { event: "Math Olympiad", date: "June 20", time: "2:00 PM", type: "competition" },
                      { event: "Field Trip to Museum", date: "June 25", time: "9:00 AM", type: "trip" },
                      { event: "Sports Day", date: "June 28", time: "All Day", type: "sports" },
                      { event: "End of Term Celebration", date: "July 10", time: "1:00 PM", type: "celebration" },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            {event.type === 'competition' ? <Trophy className="h-6 w-6 text-primary" /> :
                             event.type === 'trip' ? <Calendar className="h-6 w-6 text-primary" /> :
                             event.type === 'sports' ? <Award className="h-6 w-6 text-primary" /> :
                             <Star className="h-6 w-6 text-primary" />}
                          </div>
                          <div>
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Learn More</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Customize your student profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Display Name</label>
                      <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="Jamie Davies" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Favorite Subject</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Science</option>
                        <option>History</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Avatar Style</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>Default</option>
                        <option>Animal</option>
                        <option>Cartoon</option>
                        <option>Robot</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Theme Color</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>Blue</option>
                        <option>Green</option>
                        <option>Purple</option>
                        <option>Orange</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                  <CardDescription>Help us personalize your learning experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "I prefer visual learning (videos, diagrams)", enabled: true },
                      { label: "I like to learn by doing activities", enabled: true },
                      { label: "I enjoy group work and collaboration", enabled: false },
                      { label: "I prefer quiet study time", enabled: true },
                      { label: "I like gamified learning experiences", enabled: true },
                      { label: "I want reminders for assignments", enabled: true },
                      { label: "I enjoy challenge problems", enabled: false },
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="text-sm font-medium">{pref.label}</label>
                        <Button variant={pref.enabled ? "default" : "outline"} size="sm">
                          {pref.enabled ? "Yes" : "No"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "New assignments", enabled: true },
                      { label: "Grade updates", enabled: true },
                      { label: "Messages from teachers", enabled: true },
                      { label: "Achievement unlocked", enabled: true },
                      { label: "Daily reminders", enabled: false },
                      { label: "Study tips", enabled: true },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="text-sm font-medium">{setting.label}</label>
                        <Button variant={setting.enabled ? "default" : "outline"} size="sm">
                          {setting.enabled ? "On" : "Off"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default StudentDashboard;