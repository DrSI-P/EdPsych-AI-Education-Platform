'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subMonths, subYears } from "date-fns";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import { 
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon, 
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Sliders, 
  BarChart as BarChartIcon, Layers, Save, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  ArrowRight, Target, Eye, EyeOff, Zap, Flag, User, UserPlus, UserCheck, Star,
  Lightbulb, Clipboard, Briefcase, Heart, ThumbsUp, MessageSquare, School, GraduationCap
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for teaching effectiveness
const teachingEffectivenessData = [
  { month: 'Sep', studentProgress: 72, lessonQuality: 78, studentEngagement: 75, average: 75 },
  { month: 'Oct', studentProgress: 75, lessonQuality: 80, studentEngagement: 78, average: 77.7 },
  { month: 'Nov', studentProgress: 78, lessonQuality: 82, studentEngagement: 80, average: 80 },
  { month: 'Dec', studentProgress: 80, lessonQuality: 85, studentEngagement: 82, average: 82.3 },
  { month: 'Jan', studentProgress: 82, lessonQuality: 86, studentEngagement: 84, average: 84 },
  { month: 'Feb', studentProgress: 85, lessonQuality: 88, studentEngagement: 86, average: 86.3 },
  { month: 'Mar', studentProgress: 87, lessonQuality: 90, studentEngagement: 88, average: 88.3 },
  { month: 'Apr', studentProgress: 88, lessonQuality: 92, studentEngagement: 90, average: 90 },
  { month: 'May', studentProgress: 90, lessonQuality: 93, studentEngagement: 92, average: 91.7 },
  { month: 'Jun', studentProgress: 92, lessonQuality: 94, studentEngagement: 93, average: 93 },
  { month: 'Jul', studentProgress: 94, lessonQuality: 95, studentEngagement: 94, average: 94.3 },
];

// Sample data for professional development
const professionalDevelopmentData = [
  { category: 'Subject Knowledge', completed: 95, target: 100 },
  { category: 'Pedagogical Skills', completed: 85, target: 90 },
  { category: 'Assessment Practices', completed: 80, target: 85 },
  { category: 'Digital Competency', completed: 75, target: 80 },
  { category: 'SEND Support', completed: 90, target: 90 },
  { category: 'Behaviour Management', completed: 88, target: 90 },
  { category: 'Curriculum Design', completed: 82, target: 85 },
];

// Sample data for student feedback
const studentFeedbackData = [
  { category: 'Clear Explanations', rating: 4.5, previousRating: 4.2 },
  { category: 'Engaging Lessons', rating: 4.3, previousRating: 4.0 },
  { category: 'Helpful Feedback', rating: 4.6, previousRating: 4.4 },
  { category: 'Supportive Approach', rating: 4.7, previousRating: 4.5 },
  { category: 'Subject Knowledge', rating: 4.8, previousRating: 4.7 },
  { category: 'Classroom Management', rating: 4.4, previousRating: 4.1 },
];

// Sample data for workload distribution
const workloadDistributionData = [
  { name: 'Teaching', hours: 22, percentage: 55 },
  { name: 'Planning', hours: 8, percentage: 20 },
  { name: 'Assessment', hours: 6, percentage: 15 },
  { name: 'Admin', hours: 2, percentage: 5 },
  { name: 'CPD', hours: 2, percentage: 5 },
];

// Sample data for observation scores
const observationScoresData = [
  { date: '15/09/2024', score: 85, observer: 'Head Teacher', focus: 'Classroom Management' },
  { date: '10/11/2024', score: 88, observer: 'Deputy Head', focus: 'Differentiation' },
  { date: '22/01/2025', score: 90, observer: 'Subject Lead', focus: 'Subject Knowledge' },
  { date: '18/03/2025', score: 92, observer: 'External Advisor', focus: 'Assessment for Learning' },
  { date: '05/05/2025', score: 94, observer: 'Head Teacher', focus: 'Student Engagement' },
];

// Sample data for teaching strategies effectiveness
const teachingStrategiesData = [
  { strategy: 'Collaborative Learning', effectiveness: 85, usage: 75 },
  { strategy: 'Formative Assessment', effectiveness: 90, usage: 85 },
  { strategy: 'Digital Resources', effectiveness: 80, usage: 70 },
  { strategy: 'Differentiation', effectiveness: 88, usage: 80 },
  { strategy: 'Questioning Techniques', effectiveness: 92, usage: 88 },
  { strategy: 'Feedback Methods', effectiveness: 86, usage: 82 },
];

// Sample data for student attainment by class
const studentAttainmentData = [
  { class: '5A', exceeding: 30, meeting: 45, approaching: 20, below: 5 },
  { class: '5B', exceeding: 25, meeting: 50, approaching: 20, below: 5 },
  { class: '6A', exceeding: 35, meeting: 45, approaching: 15, below: 5 },
  { class: '6B', exceeding: 28, meeting: 47, approaching: 20, below: 5 },
];

// Sample data for teacher comparison (anonymized)
const teacherComparisonData = [
  { metric: 'Student Progress', you: 92, departmentAvg: 85, schoolAvg: 82 },
  { metric: 'Lesson Quality', you: 94, departmentAvg: 88, schoolAvg: 85 },
  { metric: 'Student Engagement', you: 93, departmentAvg: 86, schoolAvg: 84 },
  { metric: 'Behaviour Management', you: 90, departmentAvg: 85, schoolAvg: 83 },
  { metric: 'Assessment Quality', you: 91, departmentAvg: 84, schoolAvg: 82 },
];

export function EducatorPerformanceAnalytics() {
  // State for tracking configuration
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('academic-year');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 10),
    to: new Date(),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // Handle time period selection
  useEffect(() => {
    if (selectedTimePeriod === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      
      // Set appropriate date range based on selection
      const now = new Date();
      switch (selectedTimePeriod) {
        case 'term':
          setDateRange({ from: subMonths(now, 3), to: now });
          break;
        case 'academic-year':
          setDateRange({ from: subMonths(now, 10), to: now });
          break;
        case 'three-year':
          setDateRange({ from: subYears(now, 3), to: now });
          break;
      }
    }
  }, [selectedTimePeriod]);
  
  // Render component header with controls
  const renderHeader = () => (
    <div className="flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Educator Performance Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights to support professional growth and teaching excellence
        </p>
      </div>
      <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Set New Goal
        </Button>
      </div>
    </div>
  );
  
  // Render filter bar
  const renderFilterBar = () => (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
        <div className="flex items-centre space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term">Current Term</SelectItem>
            <SelectItem value="academic-year">Academic Year</SelectItem>
            <SelectItem value="three-year">Three Year Trend</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {showCustomDateRange && (
          <div className="flex items-centre space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="5a">Year 5A</SelectItem>
            <SelectItem value="5b">Year 5B</SelectItem>
            <SelectItem value="6a">Year 6A</SelectItem>
            <SelectItem value="6b">Year 6B</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="maths">Maths</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="humanities">Humanities</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-centre space-x-2">
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save View
        </Button>
        <Button size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
  
  // Render main tabs
  const renderTabs = () => (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="teaching">Teaching Effectiveness</TabsTrigger>
        <TabsTrigger value="professional">Professional Development</TabsTrigger>
        <TabsTrigger value="feedback">Feedback & Observations</TabsTrigger>
        <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
        <TabsTrigger value="comparison">Comparative Analysis</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        {renderOverviewTab()}
      </TabsContent>
      
      <TabsContent value="teaching" className="mt-6 space-y-6">
        {renderTeachingEffectivenessTab()}
      </TabsContent>
      
      <TabsContent value="professional" className="mt-6 space-y-6">
        {renderProfessionalDevelopmentTab()}
      </TabsContent>
      
      <TabsContent value="feedback" className="mt-6 space-y-6">
        {renderFeedbackObservationsTab()}
      </TabsContent>
      
      <TabsContent value="workload" className="mt-6 space-y-6">
        {renderWorkloadAnalysisTab()}
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-6 space-y-6">
        {renderComparativeAnalysisTab()}
      </TabsContent>
    </Tabs>
  );
  
  // Render overview tab
  const renderOverviewTab = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Teaching Effectiveness
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "94.3%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Progress Impact
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "85%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              CPD Completion
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "92%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Satisfaction
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">
              +0.3 from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "94%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teaching Effectiveness Trend</CardTitle>
            <CardDescription>
              Performance metrics over the academic year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={teachingEffectivenessData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="studentProgress" 
                    name="Student Progress"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lessonQuality" 
                    name="Lesson Quality"
                    stroke="#82ca9d"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="studentEngagement" 
                    name="Student Engagement"
                    stroke="#ffc658"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Overall Effectiveness"
                    stroke="#ff8042"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Attainment Distribution</CardTitle>
            <CardDescription>
              Distribution of students across attainment categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentAttainmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exceeding" name="Exceeding" stackId="a" fill="#4ade80" />
                  <Bar dataKey="meeting" name="Meeting" stackId="a" fill="#facc15" />
                  <Bar dataKey="approaching" name="Approaching" stackId="a" fill="#fb923c" />
                  <Bar dataKey="below" name="Below" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Professional Development</CardTitle>
            <CardDescription>
              Progress towards CPD targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={professionalDevelopmentData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Completed" dataKey="completed" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teaching Strategies</CardTitle>
            <CardDescription>
              Effectiveness vs usage of teaching approaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="usage" 
                    name="Usage Frequency (%)" 
                    domain={[0, 100]} 
                    label={{ value: 'Usage (%)', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="effectiveness" 
                    name="Effectiveness (%)" 
                    domain={[0, 100]}
                    label={{ value: 'Effectiveness (%)', angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Teaching Strategies" 
                    data={teachingStrategiesData} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Observations</CardTitle>
            <CardDescription>
              Formal lesson observation scores
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {observationScoresData.map((observation, index) => (
                <div key={index} className="flex items-centre justify-between rounded-md bg-muted p-3">
                  <div className="flex items-centre space-x-3">
                    <div className="flex h-9 w-9 items-centre justify-centre rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{observation.score}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{observation.date}</p>
                      <p className="text-xs text-muted-foreground">{observation.focus}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{observation.observer}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render teaching effectiveness tab
  const renderTeachingEffectivenessTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teaching Effectiveness Trend</CardTitle>
            <CardDescription>
              Performance metrics over the academic year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={teachingEffectivenessData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="studentProgress" 
                    name="Student Progress"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lessonQuality" 
                    name="Lesson Quality"
                    stroke="#82ca9d"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="studentEngagement" 
                    name="Student Engagement"
                    stroke="#ffc658"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Overall Effectiveness"
                    stroke="#ff8042"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teaching Strategies Effectiveness</CardTitle>
            <CardDescription>
              Effectiveness vs usage of teaching approaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teachingStrategiesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="strategy" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="effectiveness" name="Effectiveness (%)" fill="#8884d8" />
                  <Bar dataKey="usage" name="Usage Frequency (%)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Attainment by Class</CardTitle>
            <CardDescription>
              Distribution of students across attainment categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentAttainmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exceeding" name="Exceeding" stackId="a" fill="#4ade80" />
                  <Bar dataKey="meeting" name="Meeting" stackId="a" fill="#facc15" />
                  <Bar dataKey="approaching" name="Approaching" stackId="a" fill="#fb923c" />
                  <Bar dataKey="below" name="Below" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Over Time</CardTitle>
            <CardDescription>
              Average progress points across classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Sep', '5A': 0, '5B': 0, '6A': 0, '6B': 0 },
                    { month: 'Oct', '5A': 0.5, '5B': 0.4, '6A': 0.6, '6B': 0.5 },
                    { month: 'Nov', '5A': 1.0, '5B': 0.9, '6A': 1.2, '6B': 1.0 },
                    { month: 'Dec', '5A': 1.5, '5B': 1.3, '6A': 1.7, '6B': 1.4 },
                    { month: 'Jan', '5A': 2.0, '5B': 1.8, '6A': 2.3, '6B': 1.9 },
                    { month: 'Feb', '5A': 2.5, '5B': 2.2, '6A': 2.8, '6B': 2.4 },
                    { month: 'Mar', '5A': 3.0, '5B': 2.7, '6A': 3.4, '6B': 2.9 },
                    { month: 'Apr', '5A': 3.5, '5B': 3.2, '6A': 3.9, '6B': 3.4 },
                    { month: 'May', '5A': 4.0, '5B': 3.7, '6A': 4.5, '6B': 3.9 },
                    { month: 'Jun', '5A': 4.5, '5B': 4.2, '6A': 5.0, '6B': 4.4 },
                    { month: 'Jul', '5A': 5.0, '5B': 4.7, '6A': 5.5, '6B': 4.9 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 6]} label={{ value: 'Progress Points', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="5A" stroke="#8884d8" />
                  <Line type="monotone" dataKey="5B" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="6A" stroke="#ffc658" />
                  <Line type="monotone" dataKey="6B" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Components Analysis</CardTitle>
            <CardDescription>
              Effectiveness of different lesson elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={[
                  { component: 'Starter Activities', score: 92 },
                  { component: 'Explanations', score: 95 },
                  { component: 'Modelling', score: 90 },
                  { component: 'Independent Work', score: 88 },
                  { component: 'Group Activities', score: 85 },
                  { component: 'Plenaries', score: 93 },
                  { component: 'Assessment', score: 91 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="component" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Effectiveness Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>
              Teaching effectiveness across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { subject: 'English', score: 92, target: 90 },
                    { subject: 'Maths', score: 94, target: 90 },
                    { subject: 'Science', score: 90, target: 90 },
                    { subject: 'Humanities', score: 88, target: 85 },
                    { subject: 'Arts', score: 95, target: 85 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Effectiveness Score" fill="#8884d8" />
                  <Bar dataKey="target" name="Target" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Areas of Excellence</CardTitle>
            <CardDescription>
              Your highest performing teaching areas
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Explanations & Modelling</p>
                    <p className="text-xs text-muted-foreground">95% effectiveness</p>
                  </div>
                </div>
                <Badge>Outstanding</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Questioning Techniques</p>
                    <p className="text-xs text-muted-foreground">94% effectiveness</p>
                  </div>
                </div>
                <Badge>Outstanding</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Feedback Quality</p>
                    <p className="text-xs text-muted-foreground">93% effectiveness</p>
                  </div>
                </div>
                <Badge>Outstanding</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Subject Knowledge</p>
                    <p className="text-xs text-muted-foreground">92% effectiveness</p>
                  </div>
                </div>
                <Badge>Outstanding</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Areas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render professional development tab
  const renderProfessionalDevelopmentTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Professional Development Progress</CardTitle>
            <CardDescription>
              Progress towards CPD targets by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={professionalDevelopmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed (%)" fill="#8884d8" />
                  <Bar dataKey="target" name="Target (%)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CPD Activity Timeline</CardTitle>
            <CardDescription>
              Professional development activities over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { month: 'Sep', hours: 5, courses: 1, impact: 75 },
                    { month: 'Oct', hours: 8, courses: 2, impact: 78 },
                    { month: 'Nov', hours: 6, courses: 1, impact: 80 },
                    { month: 'Dec', hours: 4, courses: 1, impact: 82 },
                    { month: 'Jan', hours: 10, courses: 2, impact: 85 },
                    { month: 'Feb', hours: 7, courses: 1, impact: 87 },
                    { month: 'Mar', hours: 12, courses: 3, impact: 90 },
                    { month: 'Apr', hours: 8, courses: 2, impact: 92 },
                    { month: 'May', hours: 6, courses: 1, impact: 93 },
                    { month: 'Jun', hours: 9, courses: 2, impact: 95 },
                    { month: 'Jul', hours: 5, courses: 1, impact: 96 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hours" name="CPD Hours" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="courses" name="Courses Completed" fill="#82ca9d" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="impact" 
                    name="Teaching Impact Score"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>CPD Focus Areas</CardTitle>
            <CardDescription>
              Distribution of professional development focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Subject Knowledge', value: 30, color: '#8884d8' },
                      { name: 'Pedagogy', value: 25, color: '#82ca9d' },
                      { name: 'Assessment', value: 15, color: '#ffc658' },
                      { name: 'Digital Skills', value: 10, color: '#ff8042' },
                      { name: 'SEND', value: 12, color: '#0088fe' },
                      { name: 'Leadership', value: 8, color: '#00C49F' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {({ name, value, colour }) => (
                      <Cell key={`cell-${name}`} fill={colour} />
                    )}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CPD Impact Analysis</CardTitle>
            <CardDescription>
              Impact of professional development on teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { course: 'Assessment for Learning', before: 75, after: 90 },
                    { course: 'Digital Teaching', before: 70, after: 85 },
                    { course: 'SEND Strategies', before: 80, after: 92 },
                    { course: 'Questioning Techniques', before: 78, after: 94 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="course" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" name="Before CPD" fill="#f87171" />
                  <Bar dataKey="after" name="After CPD" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent CPD Activities</CardTitle>
            <CardDescription>
              Recently completed professional development
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Advanced Questioning Techniques</p>
                    <p className="text-xs text-muted-foreground">10 hours, Completed May 2025</p>
                  </div>
                </div>
                <Badge variant="outline">High Impact</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Digital Assessment Tools</p>
                    <p className="text-xs text-muted-foreground">8 hours, Completed April 2025</p>
                  </div>
                </div>
                <Badge variant="outline">Medium Impact</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">SEND Inclusive Strategies</p>
                    <p className="text-xs text-muted-foreground">12 hours, Completed March 2025</p>
                  </div>
                </div>
                <Badge variant="outline">High Impact</Badge>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Subject Knowledge Enhancement</p>
                    <p className="text-xs text-muted-foreground">15 hours, Completed February 2025</p>
                  </div>
                </div>
                <Badge variant="outline">High Impact</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New CPD Activity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render feedback and observations tab
  const renderFeedbackObservationsTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Observation Scores Trend</CardTitle>
            <CardDescription>
              Formal lesson observation scores over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { date: 'Sep 2024', score: 85, target: 85 },
                    { date: 'Nov 2024', score: 88, target: 87 },
                    { date: 'Jan 2025', score: 90, target: 89 },
                    { date: 'Mar 2025', score: 92, target: 91 },
                    { date: 'May 2025', score: 94, target: 93 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Observation Score"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target Score"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Feedback Ratings</CardTitle>
            <CardDescription>
              Student feedback on teaching effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentFeedbackData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="category" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" name="Current Rating" fill="#8884d8" />
                  <Bar dataKey="previousRating" name="Previous Rating" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Observation Feedback Analysis</CardTitle>
            <CardDescription>
              Breakdown of observation feedback by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={[
                  { area: 'Subject Knowledge', score: 95, average: 85 },
                  { area: 'Planning & Preparation', score: 92, average: 83 },
                  { area: 'Teaching Strategies', score: 90, average: 82 },
                  { area: 'Assessment', score: 93, average: 80 },
                  { area: 'Classroom Management', score: 91, average: 84 },
                  { area: 'Student Engagement', score: 94, average: 81 },
                  { area: 'Differentiation', score: 89, average: 79 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="School Average" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peer Feedback</CardTitle>
            <CardDescription>
              Feedback from peer observations and reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Mathematics Lead</span>
                  </div>
                  <div className="flex items-centre">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  "Excellent use of questioning techniques to deepen student understanding. 
                  Clear explanations and effective modelling of mathematical concepts."
                </p>
                <p className="mt-1 text-xs text-muted-foreground">March 15, 2025</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Deputy Head</span>
                  </div>
                  <div className="flex items-centre">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  "Outstanding classroom management and student engagement. 
                  Excellent differentiation strategies that support all learners."
                </p>
                <p className="mt-1 text-xs text-muted-foreground">February 8, 2025</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">English Lead</span>
                  </div>
                  <div className="flex items-centre">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  "Impressive use of formative assessment strategies. 
                  High-quality feedback that moves learning forward effectively."
                </p>
                <p className="mt-1 text-xs text-muted-foreground">January 22, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Parent Feedback</CardTitle>
            <CardDescription>
              Feedback from parents on teaching effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Very Satisfied', value: 75, color: '#4ade80' },
                      { name: 'Satisfied', value: 20, color: '#facc15' },
                      { name: 'Neutral', value: 5, color: '#fb923c' },
                      { name: 'Dissatisfied', value: 0, color: '#f87171' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {({ name, value, colour }) => (
                      <Cell key={`cell-${name}`} fill={colour} />
                    )}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Areas for Development</CardTitle>
            <CardDescription>
              Identified areas for improvement from feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Digital Resource Integration</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-primary/10">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Advanced Differentiation</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-primary/10">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Metacognitive Strategies</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-primary/10">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Development Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Observations</CardTitle>
            <CardDescription>
              Formal lesson observation scores
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {observationScoresData.map((observation, index) => (
                <div key={index} className="flex items-centre justify-between rounded-md bg-muted p-3">
                  <div className="flex items-centre space-x-3">
                    <div className="flex h-9 w-9 items-centre justify-centre rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{observation.score}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{observation.date}</p>
                      <p className="text-xs text-muted-foreground">{observation.focus}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{observation.observer}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render workload analysis tab
  const renderWorkloadAnalysisTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>
              Breakdown of time spent on different activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workloadDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {workloadDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'
                      ][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workload Trend</CardTitle>
            <CardDescription>
              Weekly working hours over the academic year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Sep', hours: 48, target: 45 },
                    { month: 'Oct', hours: 50, target: 45 },
                    { month: 'Nov', hours: 52, target: 45 },
                    { month: 'Dec', hours: 47, target: 45 },
                    { month: 'Jan', hours: 46, target: 45 },
                    { month: 'Feb', hours: 45, target: 45 },
                    { month: 'Mar', hours: 44, target: 45 },
                    { month: 'Apr', hours: 43, target: 45 },
                    { month: 'May', hours: 45, target: 45 },
                    { month: 'Jun', hours: 47, target: 45 },
                    { month: 'Jul', hours: 42, target: 45 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[35, 55]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    name="Weekly Hours"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target Hours"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Task Efficiency</CardTitle>
            <CardDescription>
              Time spent vs. effectiveness for key tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="time" 
                    name="Time (hours/week)" 
                    domain={[0, 10]} 
                    label={{ value: 'Time (hours/week)', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="effectiveness" 
                    name="Effectiveness (%)" 
                    domain={[0, 100]}
                    label={{ value: 'Effectiveness (%)', angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Tasks" 
                    data={[
                      { task: 'Lesson Planning', time: 8, effectiveness: 90 },
                      { task: 'Marking', time: 6, effectiveness: 75 },
                      { task: 'Feedback', time: 4, effectiveness: 95 },
                      { task: 'Resource Creation', time: 5, effectiveness: 85 },
                      { task: 'Admin', time: 2, effectiveness: 60 },
                      { task: 'Parent Communication', time: 3, effectiveness: 80 },
                      { task: 'Meetings', time: 4, effectiveness: 65 },
                    ]} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Work-Life Balance</CardTitle>
            <CardDescription>
              Working hours distribution across the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: 'Monday', schoolHours: 8, afterSchool: 2, evening: 1 },
                    { day: 'Tuesday', schoolHours: 8, afterSchool: 2, evening: 1.5 },
                    { day: 'Wednesday', schoolHours: 8, afterSchool: 1.5, evening: 1 },
                    { day: 'Thursday', schoolHours: 8, afterSchool: 2.5, evening: 0.5 },
                    { day: 'Friday', schoolHours: 8, afterSchool: 1, evening: 0 },
                    { day: 'Saturday', schoolHours: 0, afterSchool: 0, evening: 2 },
                    { day: 'Sunday', schoolHours: 0, afterSchool: 0, evening: 3 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="schoolHours" name="School Hours" stackId="a" fill="#8884d8" />
                  <Bar dataKey="afterSchool" name="After School" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="evening" name="Evening/Weekend" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workload Optimisation</CardTitle>
            <CardDescription>
              Recommendations for workload efficiency
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Batch similar tasks together</p>
                  <p className="text-xs text-muted-foreground">Potential time saving: 2.5 hours/week</p>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Use whole-class feedback approaches</p>
                  <p className="text-xs text-muted-foreground">Potential time saving: 3 hours/week</p>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Implement digital marking tools</p>
                  <p className="text-xs text-muted-foreground">Potential time saving: 2 hours/week</p>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Collaborative planning with colleagues</p>
                  <p className="text-xs text-muted-foreground">Potential time saving: 1.5 hours/week</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Detailed Recommendations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render comparative analysis tab
  const renderComparativeAnalysisTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>
              Your performance compared to department and school averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teacherComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="metric" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="you" name="Your Score" fill="#8884d8" />
                  <Bar dataKey="departmentAvg" name="Department Average" fill="#82ca9d" />
                  <Bar dataKey="schoolAvg" name="School Average" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Value Added Comparison</CardTitle>
            <CardDescription>
              Student progress value added compared to school average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { class: '5A (You)', valueAdded: 1.2, schoolAvg: 0.9 },
                    { class: '5B (You)', valueAdded: 1.3, schoolAvg: 0.9 },
                    { class: '6A (You)', valueAdded: 1.5, schoolAvg: 1.0 },
                    { class: '6B (You)', valueAdded: 1.4, schoolAvg: 1.0 },
                    { class: 'School Average', valueAdded: 0.95, schoolAvg: 0.95 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis domain={[0, 2]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valueAdded" name="Value Added Score" fill="#8884d8" />
                  <Bar dataKey="schoolAvg" name="School Average" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teaching Approach Comparison</CardTitle>
            <CardDescription>
              Your teaching approach compared to best practise benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={[
                  { approach: 'Direct Instruction', you: 85, benchmark: 80 },
                  { approach: 'Inquiry-Based', you: 75, benchmark: 70 },
                  { approach: 'Collaborative Learning', you: 90, benchmark: 85 },
                  { approach: 'Flipped Classroom', you: 70, benchmark: 65 },
                  { approach: 'Mastery Learning', you: 85, benchmark: 75 },
                  { approach: 'Project-Based', you: 80, benchmark: 70 },
                  { approach: 'Differentiation', you: 90, benchmark: 80 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="approach" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Approach" dataKey="you" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Best Practise Benchmark" dataKey="benchmark" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Professional Growth Comparison</CardTitle>
            <CardDescription>
              Your professional growth compared to career stage expectations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { year: '2021', you: 70, expected: 65 },
                    { year: '2022', you: 78, expected: 72 },
                    { year: '2023', you: 85, expected: 78 },
                    { year: '2024', you: 92, expected: 84 },
                    { year: '2025', you: 95, expected: 88 },
                    { year: '2026', you: null, expected: 92, projected: 98 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="you" 
                    name="Your Growth"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    name="Expected Growth"
                    stroke="#82ca9d"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    name="Projected Growth"
                    stroke="#8884d8"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Strengths vs. Peers</CardTitle>
            <CardDescription>
              Areas where you excel compared to colleagues
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Questioning Techniques</p>
                  <div className="mt-1 flex items-centre space-x-2">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }} />
                    </div>
                    <span className="text-xs font-medium">+15%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Student Engagement</p>
                  <div className="mt-1 flex items-centre space-x-2">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "93%" }} />
                    </div>
                    <span className="text-xs font-medium">+12%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2 rounded-md bg-muted p-3">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Feedback Quality</p>
                  <div className="mt-1 flex items-centre space-x-2">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "94%" }} />
                    </div>
                    <span className="text-xs font-medium">+10%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>National Standards Comparison</CardTitle>
            <CardDescription>
              Your performance against national teaching standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { standard: 'Set high expectations', you: 95, national: 85 },
                    { standard: 'Promote good progress', you: 92, national: 82 },
                    { standard: 'Demonstrate subject knowledge', you: 94, national: 86 },
                    { standard: 'Plan and teach well', you: 90, national: 83 },
                    { standard: 'Adapt teaching', you: 88, national: 80 },
                    { standard: 'Make accurate assessments', you: 93, national: 81 },
                    { standard: 'Manage behaviour', you: 91, national: 84 },
                    { standard: 'Fulfil wider responsibilities', you: 89, national: 82 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="standard" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="you" name="Your Score" fill="#8884d8" />
                  <Bar dataKey="national" name="National Average" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Career Progression</CardTitle>
            <CardDescription>
              Your readiness for next career steps
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium">Leadership Readiness</h4>
                <div className="mt-2 flex items-centre justify-between">
                  <div className="w-full max-w-xs">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Strong potential for subject leadership or phase leadership roles.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium">Specialist Teacher Readiness</h4>
                <div className="mt-2 flex items-centre justify-between">
                  <div className="w-full max-w-xs">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Excellent potential for specialist teacher or lead practitioner roles.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium">Mentoring Readiness</h4>
                <div className="mt-2 flex items-centre justify-between">
                  <div className="w-full max-w-xs">
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "90%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Strong potential for mentoring roles with trainee or early career teachers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  return (
    <div className="container mx-auto py-6">
      {renderHeader()}
      {renderFilterBar()}
      {renderTabs()}
    </div>
  );
}

// Helper components
const Search = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-search", className)}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
