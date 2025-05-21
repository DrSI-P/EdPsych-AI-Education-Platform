'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button 
} from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Users,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter
} from "lucide-react";

// Sample analytics data
const SAMPLE_COURSE_COMPLETION_DATA = [
  { month: 'Jan', completions: 12 },
  { month: 'Feb', completions: 19 },
  { month: 'Mar', completions: 15 },
  { month: 'Apr', completions: 27 },
  { month: 'May', completions: 32 },
  { month: 'Jun', completions: 24 },
  { month: 'Jul', completions: 18 },
  { month: 'Aug', completions: 21 },
  { month: 'Sep', completions: 36 },
  { month: 'Oct', completions: 42 },
  { month: 'Nov', completions: 38 },
  { month: 'Dec', completions: 29 }
];

const SAMPLE_COURSE_POPULARITY_DATA = [
  { name: 'Trauma-Informed Approaches', enrollments: 245, color: '#8884d8' },
  { name: 'Restorative Justice', enrollments: 186, color: '#83a6ed' },
  { name: 'Supporting Pupils with ASC', enrollments: 178, color: '#8dd1e1' },
  { name: 'Effective Differentiation', enrollments: 156, color: '#82ca9d' },
  { name: 'Advanced Assessment', enrollments: 92, color: '#a4de6c' },
  { name: 'Attachment Theory', enrollments: 112, color: '#d0ed57' }
];

const SAMPLE_TIME_SPENT_DATA = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 4.3 },
  { day: 'Sun', hours: 3.7 }
];

const SAMPLE_ENGAGEMENT_DATA = [
  { name: 'Video Lessons', value: 42, color: '#0088FE' },
  { name: 'Reading Materials', value: 28, color: '#00C49F' },
  { name: 'Interactive Activities', value: 15, color: '#FFBB28' },
  { name: 'Quizzes', value: 10, color: '#FF8042' },
  { name: 'Discussion Forums', value: 5, color: '#8884d8' }
];

const SAMPLE_SATISFACTION_DATA = [
  { name: 'Very Satisfied', value: 68, color: '#4CAF50' },
  { name: 'Satisfied', value: 22, color: '#8BC34A' },
  { name: 'Neutral', value: 7, color: '#FFC107' },
  { name: 'Dissatisfied', value: 2, color: '#FF9800' },
  { name: 'Very Dissatisfied', value: 1, color: '#F44336' }
];

export default function ProfessionalDevelopmentAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6 gap-4">
        <h1 className="text-3xl font-bold">Professional Development Analytics</h1>
        
        <div className="flex items-centre gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-centre gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-centre">
                  <span className="text-green-500 mr-1">↑ 12%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Course Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">683</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-centre">
                  <span className="text-green-500 mr-1">↑ 8%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">426</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-centre">
                  <span className="text-green-500 mr-1">↑ 15%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7/5</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-centre">
                  <span className="text-green-500 mr-1">↑ 0.2</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Completions</CardTitle>
                <CardDescription>Monthly course completions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SAMPLE_COURSE_COMPLETION_DATA}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completions" fill="#8884d8" name="Completions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Popularity</CardTitle>
                <CardDescription>Most popular courses by enrolment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={SAMPLE_COURSE_POPULARITY_DATA}
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="enrollments" name="Enrollments">
                        {SAMPLE_COURSE_POPULARITY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.colour} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent Learning</CardTitle>
                <CardDescription>Average daily hours spent on courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={SAMPLE_TIME_SPENT_DATA}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Engagement by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SAMPLE_ENGAGEMENT_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {SAMPLE_ENGAGEMENT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.colour} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Completion rates and average ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {SAMPLE_COURSE_POPULARITY_DATA.map((course, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-centre">
                          <h4 className="font-medium">{course.name}</h4>
                          <div className="flex items-centre gap-2">
                            <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 30) + 70}% completion rate</span>
                            <span className="text-sm font-medium">{(4 + Math.random()).toFixed(1)}/5</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>User Satisfaction</CardTitle>
                  <CardDescription>Overall course satisfaction ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SAMPLE_SATISFACTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {SAMPLE_SATISFACTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.colour} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Feedback Themes</CardTitle>
                  <CardDescription>Common themes from course feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <span>Practical examples</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Clear explanations</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Engaging content</span>
                      <span className="text-sm font-medium">58%</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Relevant to practise</span>
                      <span className="text-sm font-medium">52%</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>More interactive elements</span>
                      <span className="text-sm font-medium">37%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Over Time</CardTitle>
                  <CardDescription>Daily active users and session duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: '01/05', users: 120, duration: 25 },
                          { date: '02/05', users: 132, duration: 28 },
                          { date: '03/05', users: 145, duration: 32 },
                          { date: '04/05', users: 138, duration: 30 },
                          { date: '05/05', users: 126, duration: 27 },
                          { date: '06/05', users: 142, duration: 31 },
                          { date: '07/05', users: 156, duration: 34 },
                          { date: '08/05', users: 168, duration: 36 },
                          { date: '09/05', users: 175, duration: 38 },
                          { date: '10/05', users: 182, duration: 40 },
                          { date: '11/05', users: 195, duration: 42 },
                          { date: '12/05', users: 188, duration: 41 },
                          { date: '13/05', users: 176, duration: 38 },
                          { date: '14/05', users: 185, duration: 40 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="users" 
                          stroke="#8884d8" 
                          name="Active Users"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="duration" 
                          stroke="#82ca9d" 
                          name="Avg. Session (min)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Peak Usage Times</CardTitle>
                  <CardDescription>Most active hours of the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { hour: '6-8am', sessions: 42 },
                          { hour: '8-10am', sessions: 78 },
                          { hour: '10-12pm', sessions: 95 },
                          { hour: '12-2pm', sessions: 65 },
                          { hour: '2-4pm', sessions: 87 },
                          { hour: '4-6pm', sessions: 112 },
                          { hour: '6-8pm', sessions: 145 },
                          { hour: '8-10pm', sessions: 168 },
                          { hour: '10-12am', sessions: 92 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#8884d8" name="Sessions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Device Usage</CardTitle>
                  <CardDescription>Platform access by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Desktop', value: 45, color: '#0088FE' },
                            { name: 'Mobile', value: 35, color: '#00C49F' },
                            { name: 'Tablet', value: 20, color: '#FFBB28' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Desktop', value: 45, color: '#0088FE' },
                            { name: 'Mobile', value: 35, color: '#00C49F' },
                            { name: 'Tablet', value: 20, color: '#FFBB28' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.colour} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>Professional roles of platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { role: 'Teachers', count: 245 },
                          { role: 'SENDCos', count: 128 },
                          { role: 'School Leaders', count: 86 },
                          { role: 'Teaching Assistants', count: 156 },
                          { role: 'Educational Psychologists', count: 42 },
                          { role: 'Other Professionals', count: 68 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="role" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>User Retention</CardTitle>
                  <CardDescription>Return rate after first course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed 2+ courses', value: 68, color: '#4CAF50' },
                            { name: 'Completed 1 course', value: 22, color: '#FFC107' },
                            { name: 'In progress', value: 10, color: '#2196F3' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Completed 2+ courses', value: 68, color: '#4CAF50' },
                            { name: 'Completed 1 course', value: 22, color: '#FFC107' },
                            { name: 'In progress', value: 10, color: '#2196F3' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.colour} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', users: 24 },
                          { month: 'Feb', users: 32 },
                          { month: 'Mar', users: 38 },
                          { month: 'Apr', users: 45 },
                          { month: 'May', users: 56 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#8884d8" 
                          name="New Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certificates Issued</CardTitle>
                  <CardDescription>Monthly certificate issuance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: 'Jan', certificates: 18 },
                          { month: 'Feb', certificates: 24 },
                          { month: 'Mar', certificates: 22 },
                          { month: 'Apr', certificates: 35 },
                          { month: 'May', certificates: 42 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="certificates" fill="#8884d8" name="Certificates Issued" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Certificates by Course</CardTitle>
                  <CardDescription>Distribution across courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Trauma-Informed', value: 35, color: '#0088FE' },
                            { name: 'Restorative Justice', value: 28, color: '#00C49F' },
                            { name: 'Supporting ASC', value: 22, color: '#FFBB28' },
                            { name: 'Differentiation', value: 15, color: '#FF8042' },
                            { name: 'Other Courses', value: 20, color: '#8884d8' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Trauma-Informed', value: 35, color: '#0088FE' },
                            { name: 'Restorative Justice', value: 28, color: '#00C49F' },
                            { name: 'Supporting ASC', value: 22, color: '#FFBB28' },
                            { name: 'Differentiation', value: 15, color: '#FF8042' },
                            { name: 'Other Courses', value: 20, color: '#8884d8' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.colour} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>CPD Points Awarded</CardTitle>
                  <CardDescription>Total CPD points by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', points: 86 },
                          { month: 'Feb', points: 112 },
                          { month: 'Mar', points: 106 },
                          { month: 'Apr', points: 156 },
                          { month: 'May', points: 182 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="points" 
                          stroke="#8884d8" 
                          name="CPD Points"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
