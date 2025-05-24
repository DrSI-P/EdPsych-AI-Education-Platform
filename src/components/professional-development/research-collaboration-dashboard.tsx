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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Activity,
  TrendingUp,
  Users,
  School,
  BookOpen,
  FileText,
  Award,
  Globe,
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  ExternalLink,
  Info,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Mock data for research analytics
const MOCK_PROJECT_TRENDS = [
  { month: 'Jan', active: 8, completed: 2, new: 3 },
  { month: 'Feb', active: 9, completed: 3, new: 4 },
  { month: 'Mar', active: 10, completed: 3, new: 4 },
  { month: 'Apr', active: 11, completed: 4, new: 5 },
  { month: 'May', active: 12, completed: 4, new: 3 },
  { month: 'Jun', active: 13, completed: 5, new: 6 },
];

const MOCK_OUTPUT_TRENDS = [
  { month: 'Jan', reports: 3, articles: 1, guides: 2, other: 1 },
  { month: 'Feb', reports: 4, articles: 2, guides: 2, other: 2 },
  { month: 'Mar', reports: 5, articles: 2, guides: 3, other: 2 },
  { month: 'Apr', reports: 6, articles: 3, guides: 3, other: 3 },
  { month: 'May', reports: 7, articles: 3, guides: 4, other: 3 },
  { month: 'Jun', reports: 8, articles: 4, guides: 5, other: 4 },
];

const MOCK_METHODOLOGY_DISTRIBUTION = [
  { name: 'Mixed Methods', value: 35 },
  { name: 'Experimental', value: 20 },
  { name: 'Case Study', value: 15 },
  { name: 'Action Research', value: 25 },
  { name: 'Survey', value: 10 },
  { name: 'Ethnographic', value: 5 },
];

const MOCK_SCHOOL_TYPE_DISTRIBUTION = [
  { name: 'Primary', value: 45 },
  { name: 'Secondary', value: 35 },
  { name: 'Special', value: 10 },
  { name: 'All-through', value: 5 },
  { name: 'Alternative Provision', value: 5 },
];

const MOCK_RESEARCH_FOCUS_DISTRIBUTION = [
  { subject: 'Literacy', value: 80 },
  { subject: 'Numeracy', value: 65 },
  { subject: 'SEND', value: 70 },
  { subject: 'Behaviour', value: 55 },
  { subject: 'Digital Learning', value: 60 },
  { subject: 'Wellbeing', value: 75 },
  { subject: 'Assessment', value: 50 },
  { subject: 'Curriculum', value: 45 },
];

const MOCK_IMPACT_METRICS = [
  { name: 'Practise Change', value: 75 },
  { name: 'Policy Influence', value: 45 },
  { name: 'Student Outcomes', value: 85 },
  { name: 'Teacher Development', value: 70 },
  { name: 'Resource Creation', value: 60 },
  { name: 'Knowledge Sharing', value: 80 },
];

const MOCK_COLLABORATION_METRICS = [
  { name: 'Cross-School Projects', value: 18 },
  { name: 'Research Networks', value: 5 },
  { name: 'Joint Publications', value: 12 },
  { name: 'Shared Methods', value: 24 },
  { name: 'Collaborative Events', value: 8 },
];

const MOCK_ENGAGEMENT_METRICS = [
  { month: 'Jan', views: 120, downloads: 45, citations: 8 },
  { month: 'Feb', views: 145, downloads: 52, citations: 10 },
  { month: 'Mar', views: 165, downloads: 58, citations: 12 },
  { month: 'Apr', views: 190, downloads: 65, citations: 15 },
  { month: 'May', views: 210, downloads: 72, citations: 18 },
  { month: 'Jun', views: 245, downloads: 87, citations: 22 },
];

const MOCK_REGIONAL_DISTRIBUTION = [
  { region: 'London', schools: 8, projects: 12 },
  { region: 'South East', schools: 6, projects: 9 },
  { region: 'South West', schools: 4, projects: 6 },
  { region: 'East of England', schools: 3, projects: 5 },
  { region: 'West Midlands', schools: 5, projects: 7 },
  { region: 'East Midlands', schools: 3, projects: 4 },
  { region: 'Yorkshire', schools: 4, projects: 6 },
  { region: 'North West', schools: 5, projects: 8 },
  { region: 'North East', schools: 2, projects: 3 },
  { region: 'Wales', schools: 3, projects: 4 },
  { region: 'Scotland', schools: 4, projects: 5 },
  { region: 'Northern Ireland', schools: 2, projects: 3 },
];

// Colors for charts
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

export default function ResearchCollaborationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('6months');
  const [focusArea, setFocusArea] = useState('all');
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics for research collaboration activities
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={focusArea} onValueChange={setFocusArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Focus Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="literacy">Literacy</SelectItem>
              <SelectItem value="numeracy">Numeracy</SelectItem>
              <SelectItem value="send">SEND</SelectItem>
              <SelectItem value="behaviour">Behaviour</SelectItem>
              <SelectItem value="digital">Digital Learning</SelectItem>
              <SelectItem value="wellbeing">Wellbeing</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Research Outputs</p>
                <p className="text-3xl font-bold">28</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Participating Schools</p>
                <p className="text-3xl font-bold">32</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <School className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Citations</p>
                <p className="text-3xl font-bold">87</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+12</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="outputs">Outputs</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Activity className="mr-2 h-5 w-5" /> Research Activity Trends
                </CardTitle>
                <CardDescription>
                  Project and output activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MOCK_PROJECT_TRENDS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="active" stroke="#4f46e5" strokeWidth={2} />
                      <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <PieChartIcon className="mr-2 h-5 w-5" /> Research Focus Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of research projects by focus area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RESEARCH_FOCUS_DISTRIBUTION}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Research Focus" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Methodology Distribution
                </CardTitle>
                <CardDescription>
                  Research projects by methodology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_METHODOLOGY_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name: any, percent }) => `${name}: ${(percent * 100: any).toFixed(0: any)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {MOCK_METHODOLOGY_DISTRIBUTION.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <School className="mr-2 h-5 w-5" /> School Type Distribution
                </CardTitle>
                <CardDescription>
                  Participating schools by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_SCHOOL_TYPE_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name: any, percent }) => `${name}: ${(percent * 100: any).toFixed(0: any)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {MOCK_SCHOOL_TYPE_DISTRIBUTION.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Globe className="mr-2 h-5 w-5" /> Regional Distribution
                </CardTitle>
                <CardDescription>
                  Schools and projects by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto pr-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Region</th>
                        <th className="text-right py-2">Schools</th>
                        <th className="text-right py-2">Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_REGIONAL_DISTRIBUTION.map((region: any, index) => (
                        <tr key={index} className="border-b border-muted">
                          <td className="py-2">{region.region}</td>
                          <td className="text-right py-2">{region.schools}</td>
                          <td className="text-right py-2">{region.projects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Activity className="mr-2 h-5 w-5" /> Project Status Trends
                </CardTitle>
                <CardDescription>
                  Project status changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_PROJECT_TRENDS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="completed" stackId="a" fill="#10b981" />
                      <Bar dataKey="new" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Users className="mr-2 h-5 w-5" /> Collaboration Metrics
                </CardTitle>
                <CardDescription>
                  Cross-school collaboration statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={MOCK_COLLABORATION_METRICS}
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Calendar className="mr-2 h-5 w-5" /> Project Timeline
              </CardTitle>
              <CardDescription>
                Active research projects timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 w-1/4">Project</th>
                      <th className="text-left py-2 w-1/6">Lead</th>
                      <th className="text-left py-2 w-1/6">Status</th>
                      <th className="text-left py-2 w-1/6">Schools</th>
                      <th className="text-left py-2 w-1/4">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-muted">
                      <td className="py-3">Impact of Phonics Teaching Approaches</td>
                      <td>Sarah Johnson</td>
                      <td>
                        <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          In Progress
                        </span>
                      </td>
                      <td>3</td>
                      <td>
                        <div className="flex items-centre">
                          <span className="text-xs text-muted-foreground mr-2">Jan 2025</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">Jul 2025</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Mathematics Anxiety Intervention Study</td>
                      <td>David Wilson</td>
                      <td>
                        <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Planning
                        </span>
                      </td>
                      <td>2</td>
                      <td>
                        <div className="flex items-centre">
                          <span className="text-xs text-muted-foreground mr-2">Jun 2025</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">Mar 2026</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Digital Literacy Development in KS3</td>
                      <td>Michael Chen</td>
                      <td>
                        <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Analysis
                        </span>
                      </td>
                      <td>3</td>
                      <td>
                        <div className="flex items-centre">
                          <span className="text-xs text-muted-foreground mr-2">Nov 2024</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">Jun 2025</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Restorative Practise Implementation Study</td>
                      <td>Priya Patel</td>
                      <td>
                        <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          In Progress
                        </span>
                      </td>
                      <td>5</td>
                      <td>
                        <div className="flex items-centre">
                          <span className="text-xs text-muted-foreground mr-2">Jan 2025</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">Dec 2025</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">SEND Provision Mapping Effectiveness</td>
                      <td>Emma Thompson</td>
                      <td>
                        <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td>4</td>
                      <td>
                        <div className="flex items-centre">
                          <span className="text-xs text-muted-foreground mr-2">Sep 2024</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">Mar 2025</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Outputs Tab */}
        <TabsContent value="outputs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Output Types
                </CardTitle>
                <CardDescription>
                  Research outputs by type over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_OUTPUT_TRENDS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reports" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="articles" stackId="a" fill="#10b981" />
                      <Bar dataKey="guides" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="other" stackId="a" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <LineChart className="mr-2 h-5 w-5" /> Engagement Metrics
                </CardTitle>
                <CardDescription>
                  Views, downloads, and citations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MOCK_ENGAGEMENT_METRICS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="citations" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <BookOpen className="mr-2 h-5 w-5" /> Top Research Outputs
              </CardTitle>
              <CardDescription>
                Most impactful research outputs by engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Authors</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Downloads</th>
                      <th className="text-right py-2">Citations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-muted">
                      <td className="py-3">Digital Literacy Framework for Secondary Schools</td>
                      <td>Toolkit</td>
                      <td>Chen, Patel, Johnson</td>
                      <td>Jan 2025</td>
                      <td className="text-right">356</td>
                      <td className="text-right">156</td>
                      <td className="text-right">5</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Supporting SEND Students: Effective Provision Mapping</td>
                      <td>Journal Article</td>
                      <td>Thompson, Wilson, Chen</td>
                      <td>Feb 2025</td>
                      <td className="text-right">287</td>
                      <td className="text-right">124</td>
                      <td className="text-right">8</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Restorative Approaches in UK Schools: Implementation Guide</td>
                      <td>Practise Guide</td>
                      <td>Patel, Johnson, Smith</td>
                      <td>Apr 2025</td>
                      <td className="text-right">245</td>
                      <td className="text-right">112</td>
                      <td className="text-right">7</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Synthetic Phonics Implementation: A Cross-School Analysis</td>
                      <td>Report</td>
                      <td>Johnson, Smith, Brown</td>
                      <td>Mar 2025</td>
                      <td className="text-right">198</td>
                      <td className="text-right">87</td>
                      <td className="text-right">12</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Mathematics Anxiety: Early Intervention Approaches</td>
                      <td>Conference Paper</td>
                      <td>Wilson, Thompson</td>
                      <td>Nov 2024</td>
                      <td className="text-right">145</td>
                      <td className="text-right">68</td>
                      <td className="text-right">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Impact Categories
                </CardTitle>
                <CardDescription>
                  Research impact by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_IMPACT_METRICS}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Impact Score" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Users className="mr-2 h-5 w-5" /> Reach Statistics
                </CardTitle>
                <CardDescription>
                  Number of schools and students impacted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col items-centre justify-centre bg-muted/50 rounded-lg p-6">
                      <School className="h-12 w-12 text-primary mb-4" />
                      <p className="text-4xl font-bold">67</p>
                      <p className="text-sm text-muted-foreground mt-2">Schools Impacted</p>
                      <div className="mt-4 flex items-centre text-xs">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500 font-medium">+12</span>
                        <span className="ml-1 text-muted-foreground">from last period</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-centre justify-centre bg-muted/50 rounded-lg p-6">
                      <Users className="h-12 w-12 text-primary mb-4" />
                      <p className="text-4xl font-bold">23,900</p>
                      <p className="text-sm text-muted-foreground mt-2">Students Reached</p>
                      <div className="mt-4 flex items-centre text-xs">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500 font-medium">+3,450</span>
                        <span className="ml-1 text-muted-foreground">from last period</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <TrendingUp className="mr-2 h-5 w-5" /> Impact Case Studies
              </CardTitle>
              <CardDescription>
                Documented impact from research projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Synthetic Phonics Implementation Study</h3>
                      <p className="text-sm text-muted-foreground mt-1">Implementation of revised synthetic phonics approach based on research findings, resulting in 15% improvement in early reading outcomes.</p>
                    </div>
                    <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Practise Change
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-centre">
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">4,500</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">15%</p>
                      <p className="text-xs text-muted-foreground">Improvement</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">SEND Provision Mapping Study</h3>
                      <p className="text-sm text-muted-foreground mt-1">Development of new SEND provision mapping policy adopted by local authority, improving consistency and effectiveness of support.</p>
                    </div>
                    <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Policy Change
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-centre">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">3,200</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-xs text-muted-foreground">Policy Adopted</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Restorative Practise Implementation Study</h3>
                      <p className="text-sm text-muted-foreground mt-1">Whole-school implementation of restorative approaches, resulting in 40% reduction in exclusions and improved school climate.</p>
                    </div>
                    <span className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      School Culture
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-centre">
                      <p className="text-2xl font-bold">10</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">6,500</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-2xl font-bold">-40%</p>
                      <p className="text-xs text-muted-foreground">Exclusions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Users className="mr-2 h-5 w-5" /> Collaboration Network
                </CardTitle>
                <CardDescription>
                  Connections between schools and researchers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-centre justify-centre">
                  <div className="text-centre">
                    <div className="bg-muted/50 p-8 rounded-lg">
                      <div className="text-muted-foreground mb-4">Network visualisation would appear here</div>
                      <p className="text-sm">Interactive network graph showing connections between 32 schools and 85 researchers across 5 research networks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Cross-School Collaboration
                </CardTitle>
                <CardDescription>
                  Collaboration metrics by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_COLLABORATION_METRICS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Globe className="mr-2 h-5 w-5" /> Research Networks
              </CardTitle>
              <CardDescription>
                Active research networks and communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Early Literacy Research Network</h3>
                      <p className="text-sm text-muted-foreground mt-1">A collaborative network of researchers and practitioners focused on early literacy development and effective teaching approaches.</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-centre">
                      <p className="text-xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">15</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Outputs</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">SEND Research Collaborative</h3>
                      <p className="text-sm text-muted-foreground mt-1">A network dedicated to researching effective approaches for supporting students with special educational needs and disabilities.</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-centre">
                      <p className="text-xl font-bold">38</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">22</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">6</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">9</p>
                      <p className="text-xs text-muted-foreground">Outputs</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Behaviour and Wellbeing Research Collaborative</h3>
                      <p className="text-sm text-muted-foreground mt-1">A collaborative network researching approaches to supporting positive behaviour and wellbeing in educational settings.</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-centre">
                      <p className="text-xl font-bold">45</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">28</p>
                      <p className="text-xs text-muted-foreground">Schools</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">9</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div className="text-centre">
                      <p className="text-xl font-bold">14</p>
                      <p className="text-xs text-muted-foreground">Outputs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
