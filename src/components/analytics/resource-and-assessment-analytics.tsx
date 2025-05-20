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
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Treemap
} from 'recharts';
import { 
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon, 
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Sliders, 
  BarChart as BarChartIcon, Layers, Save, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  ArrowRight, Target, Eye, EyeOff, Zap, Flag, User, UserPlus, UserCheck, Star,
  Lightbulb, Clipboard, Briefcase, Heart, ThumbsUp, MessageSquare, School, GraduationCap,
  FileQuestion, BookMarked, Laptop, Tablet, Smartphone, Printer, Database, Search,
  Library, Book, Video, Music, Image, File, FilePlus, FileText, FileCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for resource usage
const resourceUsageData = [
  { month: 'Sep', digital: 245, print: 120, interactive: 85, total: 450 },
  { month: 'Oct', digital: 280, print: 110, interactive: 95, total: 485 },
  { month: 'Nov', digital: 310, print: 100, interactive: 105, total: 515 },
  { month: 'Dec', digital: 290, print: 90, interactive: 100, total: 480 },
  { month: 'Jan', digital: 320, print: 85, interactive: 115, total: 520 },
  { month: 'Feb', digital: 350, print: 80, interactive: 125, total: 555 },
  { month: 'Mar', digital: 380, print: 75, interactive: 135, total: 590 },
  { month: 'Apr', digital: 400, print: 70, interactive: 145, total: 615 },
  { month: 'May', digital: 420, print: 65, interactive: 155, total: 640 },
  { month: 'Jun', digital: 440, print: 60, interactive: 165, total: 665 },
  { month: 'Jul', digital: 460, print: 55, interactive: 175, total: 690 },
];

// Sample data for resource effectiveness
const resourceEffectivenessData = [
  { name: 'Digital Textbooks', effectiveness: 85, usage: 420, cost: 2500 },
  { name: 'Interactive Simulations', effectiveness: 92, usage: 175, cost: 1800 },
  { name: 'Educational Videos', effectiveness: 88, usage: 320, cost: 2200 },
  { name: 'Practice Worksheets', effectiveness: 75, usage: 280, cost: 1200 },
  { name: 'Assessment Tools', effectiveness: 90, usage: 210, cost: 1900 },
  { name: 'Learning Games', effectiveness: 86, usage: 150, cost: 1600 },
  { name: 'Reference Materials', effectiveness: 78, usage: 190, cost: 1400 },
];

// Sample data for resource distribution by subject
const resourceDistributionData = [
  { subject: 'English', digital: 28, print: 12, interactive: 15 },
  { subject: 'Maths', digital: 32, print: 10, interactive: 18 },
  { subject: 'Science', digital: 30, print: 8, interactive: 22 },
  { subject: 'Humanities', digital: 25, print: 15, interactive: 10 },
  { subject: 'Arts', digital: 20, print: 18, interactive: 12 },
  { subject: 'PE', digital: 15, print: 5, interactive: 8 },
  { subject: 'Computing', digital: 35, print: 2, interactive: 25 },
];

// Sample data for assessment types
const assessmentTypesData = [
  { name: 'Formative', value: 45, color: '#8884d8' },
  { name: 'Summative', value: 30, color: '#82ca9d' },
  { name: 'Diagnostic', value: 15, color: '#ffc658' },
  { name: 'Self-Assessment', value: 10, color: '#ff8042' },
];

// Sample data for assessment frequency
const assessmentFrequencyData = [
  { month: 'Sep', formative: 25, summative: 5, diagnostic: 8 },
  { month: 'Oct', formative: 28, summative: 2, diagnostic: 3 },
  { month: 'Nov', formative: 30, summative: 8, diagnostic: 2 },
  { month: 'Dec', formative: 22, summative: 12, diagnostic: 1 },
  { month: 'Jan', formative: 26, summative: 3, diagnostic: 10 },
  { month: 'Feb', formative: 32, summative: 2, diagnostic: 2 },
  { month: 'Mar', formative: 35, summative: 4, diagnostic: 3 },
  { month: 'Apr', formative: 30, summative: 10, diagnostic: 2 },
  { month: 'May', formative: 28, summative: 15, diagnostic: 1 },
  { month: 'Jun', formative: 25, summative: 18, diagnostic: 5 },
  { month: 'Jul', formative: 20, summative: 5, diagnostic: 2 },
];

// Sample data for assessment quality
const assessmentQualityData = [
  { category: 'Validity', score: 88, target: 90 },
  { category: 'Reliability', score: 85, target: 90 },
  { category: 'Fairness', score: 92, target: 90 },
  { category: 'Efficiency', score: 80, target: 85 },
  { category: 'Engagement', score: 86, target: 85 },
  { category: 'Feedback Quality', score: 90, target: 90 },
];

// Sample data for assessment impact
const assessmentImpactData = [
  { assessment: 'Weekly Quizzes', beforeAfterGap: 15, studentEngagement: 85, teacherValue: 80 },
  { assessment: 'Unit Tests', beforeAfterGap: 18, studentEngagement: 70, teacherValue: 85 },
  { assessment: 'Project Evaluations', beforeAfterGap: 20, studentEngagement: 90, teacherValue: 88 },
  { assessment: 'Peer Assessments', beforeAfterGap: 12, studentEngagement: 88, teacherValue: 75 },
  { assessment: 'Self-Reflections', beforeAfterGap: 10, studentEngagement: 92, teacherValue: 78 },
  { assessment: 'End of Term Exams', beforeAfterGap: 22, studentEngagement: 65, teacherValue: 90 },
];

// Sample data for popular resources
const popularResourcesData = [
  { name: 'Interactive Maths Games', downloads: 1250, rating: 4.8, type: 'Interactive' },
  { name: 'Science Experiment Videos', downloads: 980, rating: 4.7, type: 'Digital' },
  { name: 'Reading Comprehension Worksheets', downloads: 850, rating: 4.5, type: 'Print' },
  { name: 'Historical Timeline Interactive', downloads: 780, rating: 4.6, type: 'Interactive' },
  { name: 'Grammar Practice Activities', downloads: 720, rating: 4.4, type: 'Digital' },
  { name: 'Physics Simulation Lab', downloads: 680, rating: 4.9, type: 'Interactive' },
  { name: 'Creative Writing Prompts', downloads: 650, rating: 4.3, type: 'Print' },
  { name: 'Geography Map Quizzes', downloads: 620, rating: 4.5, type: 'Digital' },
];

// Sample data for resource categories
const resourceCategoriesData = [
  {
    name: 'Digital',
    children: [
      { name: 'E-books', size: 1200 },
      { name: 'Videos', size: 980 },
      { name: 'Presentations', size: 850 },
      { name: 'Audio', size: 620 },
      { name: 'Websites', size: 780 },
    ],
  },
  {
    name: 'Print',
    children: [
      { name: 'Worksheets', size: 850 },
      { name: 'Textbooks', size: 720 },
      { name: 'Activity Cards', size: 480 },
      { name: 'Posters', size: 350 },
      { name: 'Handouts', size: 520 },
    ],
  },
  {
    name: 'Interactive',
    children: [
      { name: 'Games', size: 680 },
      { name: 'Simulations', size: 780 },
      { name: 'Quizzes', size: 620 },
      { name: 'Virtual Tours', size: 450 },
      { name: 'Interactive Whiteboards', size: 580 },
    ],
  },
];

export function ResourceAndAssessmentAnalytics() {
  // State for tracking configuration
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('academic-year');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState('all');
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
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource & Assessment Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into resource usage and assessment effectiveness
        </p>
      </div>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
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
          Add Resource
        </Button>
      </div>
    </div>
  );
  
  // Render filter bar
  const renderFilterBar = () => (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
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
        
        <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="print">Print</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
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
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="pe">PE</SelectItem>
            <SelectItem value="computing">Computing</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Year group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="eyfs">EYFS</SelectItem>
            <SelectItem value="year1">Year 1</SelectItem>
            <SelectItem value="year2">Year 2</SelectItem>
            <SelectItem value="year3">Year 3</SelectItem>
            <SelectItem value="year4">Year 4</SelectItem>
            <SelectItem value="year5">Year 5</SelectItem>
            <SelectItem value="year6">Year 6</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
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
        <TabsTrigger value="resources">Resource Usage</TabsTrigger>
        <TabsTrigger value="effectiveness">Resource Effectiveness</TabsTrigger>
        <TabsTrigger value="assessments">Assessment Types</TabsTrigger>
        <TabsTrigger value="impact">Assessment Impact</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        {renderOverviewTab()}
      </TabsContent>
      
      <TabsContent value="resources" className="mt-6 space-y-6">
        {renderResourceUsageTab()}
      </TabsContent>
      
      <TabsContent value="effectiveness" className="mt-6 space-y-6">
        {renderResourceEffectivenessTab()}
      </TabsContent>
      
      <TabsContent value="assessments" className="mt-6 space-y-6">
        {renderAssessmentTypesTab()}
      </TabsContent>
      
      <TabsContent value="impact" className="mt-6 space-y-6">
        {renderAssessmentImpactTab()}
      </TabsContent>
      
      <TabsContent value="recommendations" className="mt-6 space-y-6">
        {renderRecommendationsTab()}
      </TabsContent>
    </Tabs>
  );
  
  // Render overview tab
  const renderOverviewTab = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources Used
            </CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">5,842</div>
            <p className="text-xs text-muted-foreground">
              +12% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Digital Resource Usage
            </CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +15% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "68%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assessment Effectiveness
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "87%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource ROI
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">3.2x</div>
            <p className="text-xs text-muted-foreground">
              +0.4x from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "80%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Usage Trends</CardTitle>
            <CardDescription>
              Usage patterns across resource types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={resourceUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="digital" 
                    name="Digital Resources"
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="print" 
                    name="Print Resources"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interactive" 
                    name="Interactive Resources"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Distribution</CardTitle>
            <CardDescription>
              Distribution of assessment types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assessmentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Distribution by Subject</CardTitle>
            <CardDescription>
              Resource allocation across curriculum areas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="subject" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="digital" name="Digital" stackId="a" fill="#8884d8" />
                  <Bar dataKey="print" name="Print" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="interactive" name="Interactive" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Quality</CardTitle>
            <CardDescription>
              Quality metrics for assessment practices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={assessmentQualityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Popular Resources</CardTitle>
            <CardDescription>
              Most frequently used teaching resources
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {popularResourcesData.slice(0, 4).map((resource, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-muted p-3">
                  <div className="flex items-center space-x-3">
                    {resource.type === 'Digital' ? (
                      <Laptop className="h-5 w-5 text-blue-500" />
                    ) : resource.type === 'Interactive' ? (
                      <Zap className="h-5 w-5 text-amber-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span className="ml-1 text-xs text-muted-foreground">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{resource.downloads}</Badge>
                </div>
              ))}
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render resource usage tab
  const renderResourceUsageTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Usage Trends</CardTitle>
            <CardDescription>
              Usage patterns across resource types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={resourceUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="digital" 
                    name="Digital Resources"
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="print" 
                    name="Print Resources"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interactive" 
                    name="Interactive Resources"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Categories</CardTitle>
            <CardDescription>
              Hierarchical view of resource categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={resourceCategoriesData}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                  fill="#8884d8"
                  content={<CustomizedContent colors={['#8884d8', '#82ca9d', '#ffc658']} />}
                >
                  <Tooltip formatter={(value) => [`${value} uses`, 'Usage']} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Distribution by Subject</CardTitle>
            <CardDescription>
              Resource allocation across curriculum areas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="subject" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="digital" name="Digital" stackId="a" fill="#8884d8" />
                  <Bar dataKey="print" name="Print" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="interactive" name="Interactive" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Usage by Device</CardTitle>
            <CardDescription>
              Distribution of resource access by device type
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Desktop/Laptop', value: 45, color: '#8884d8' },
                      { name: 'Tablet', value: 35, color: '#82ca9d' },
                      { name: 'Smartphone', value: 15, color: '#ffc658' },
                      { name: 'Interactive Whiteboard', value: 5, color: '#ff8042' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Desktop/Laptop', value: 45, color: '#8884d8' },
                      { name: 'Tablet', value: 35, color: '#82ca9d' },
                      { name: 'Smartphone', value: 15, color: '#ffc658' },
                      { name: 'Interactive Whiteboard', value: 5, color: '#ff8042' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Format Distribution</CardTitle>
            <CardDescription>
              Breakdown of digital resource formats
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Documents', value: 30, color: '#8884d8' },
                      { name: 'Videos', value: 25, color: '#82ca9d' },
                      { name: 'Interactive', value: 20, color: '#ffc658' },
                      { name: 'Images', value: 15, color: '#ff8042' },
                      { name: 'Audio', value: 10, color: '#0088fe' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Documents', value: 30, color: '#8884d8' },
                      { name: 'Videos', value: 25, color: '#82ca9d' },
                      { name: 'Interactive', value: 20, color: '#ffc658' },
                      { name: 'Images', value: 15, color: '#ff8042' },
                      { name: 'Audio', value: 10, color: '#0088fe' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Access Patterns</CardTitle>
            <CardDescription>
              When resources are most frequently accessed
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { time: 'Before School', count: 120 },
                    { time: 'Morning Lessons', count: 450 },
                    { time: 'Lunch Break', count: 180 },
                    { time: 'Afternoon Lessons', count: 380 },
                    { time: 'After School', count: 220 },
                    { time: 'Evening', count: 150 },
                    { time: 'Weekend', count: 90 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Access Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Popular Resources</CardTitle>
            <CardDescription>
              Most frequently used teaching resources
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {popularResourcesData.slice(0, 5).map((resource, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-muted p-3">
                  <div className="flex items-center space-x-3">
                    {resource.type === 'Digital' ? (
                      <Laptop className="h-5 w-5 text-blue-500" />
                    ) : resource.type === 'Interactive' ? (
                      <Zap className="h-5 w-5 text-amber-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span className="ml-1 text-xs text-muted-foreground">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{resource.downloads}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render resource effectiveness tab
  const renderResourceEffectivenessTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Effectiveness vs. Usage</CardTitle>
            <CardDescription>
              Comparing effectiveness ratings with usage frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="usage" 
                    name="Usage Count" 
                    label={{ value: 'Usage Count', position: 'bottom' }}
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
                    name="Resources" 
                    data={resourceEffectivenessData} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource ROI Analysis</CardTitle>
            <CardDescription>
              Return on investment for different resource types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'Digital Textbooks', roi: 2.8 },
                    { type: 'Interactive Simulations', roi: 3.5 },
                    { type: 'Educational Videos', roi: 3.2 },
                    { type: 'Practice Worksheets', roi: 2.5 },
                    { type: 'Assessment Tools', roi: 3.8 },
                    { type: 'Learning Games', roi: 3.0 },
                    { type: 'Reference Materials', roi: 2.2 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 4]} />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}x`, 'ROI']} />
                  <Legend />
                  <Bar dataKey="roi" name="Return on Investment" fill="#8884d8" />
                  <ReferenceLine x={3} stroke="red" label="Target ROI" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Impact on Student Outcomes</CardTitle>
            <CardDescription>
              Correlation between resource usage and student progress
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Sep', resourceUsage: 450, studentProgress: 0 },
                    { month: 'Oct', resourceUsage: 485, studentProgress: 8 },
                    { month: 'Nov', resourceUsage: 515, studentProgress: 15 },
                    { month: 'Dec', resourceUsage: 480, studentProgress: 22 },
                    { month: 'Jan', resourceUsage: 520, studentProgress: 30 },
                    { month: 'Feb', resourceUsage: 555, studentProgress: 38 },
                    { month: 'Mar', resourceUsage: 590, studentProgress: 48 },
                    { month: 'Apr', resourceUsage: 615, studentProgress: 58 },
                    { month: 'May', resourceUsage: 640, studentProgress: 68 },
                    { month: 'Jun', resourceUsage: 665, studentProgress: 80 },
                    { month: 'Jul', resourceUsage: 690, studentProgress: 92 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="resourceUsage" 
                    name="Resource Usage"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="studentProgress" 
                    name="Student Progress (%)"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Effectiveness by Subject</CardTitle>
            <CardDescription>
              How resource effectiveness varies across subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={[
                  { subject: 'English', digital: 85, print: 75, interactive: 90 },
                  { subject: 'Maths', digital: 80, print: 70, interactive: 95 },
                  { subject: 'Science', digital: 88, print: 72, interactive: 92 },
                  { subject: 'Humanities', digital: 82, print: 78, interactive: 85 },
                  { subject: 'Arts', digital: 75, print: 80, interactive: 88 },
                  { subject: 'PE', digital: 70, print: 65, interactive: 90 },
                  { subject: 'Computing', digital: 95, print: 60, interactive: 92 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Digital" dataKey="digital" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Print" dataKey="print" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Interactive" dataKey="interactive" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cost-Effectiveness Analysis</CardTitle>
            <CardDescription>
              Effectiveness relative to resource cost
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="cost" 
                    name="Cost (£)" 
                    label={{ value: 'Cost (£)', position: 'bottom' }}
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
                    name="Resources" 
                    data={resourceEffectivenessData} 
                    fill="#8884d8"
                  />
                  <ReferenceLine y={80} stroke="red" label="Minimum Effectiveness" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Longevity</CardTitle>
            <CardDescription>
              Effectiveness retention over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { year: 1, digital: 95, print: 90, interactive: 98 },
                    { year: 2, digital: 90, print: 85, interactive: 95 },
                    { year: 3, digital: 85, print: 80, interactive: 90 },
                    { year: 4, digital: 75, print: 75, interactive: 85 },
                    { year: 5, digital: 65, print: 70, interactive: 75 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'bottom' }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Effectiveness (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="digital" name="Digital" stroke="#8884d8" />
                  <Line type="monotone" dataKey="print" name="Print" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="interactive" name="Interactive" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Most Effective Resources</CardTitle>
            <CardDescription>
              Highest impact teaching resources
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {resourceEffectivenessData.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 5).map((resource, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-muted p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{resource.effectiveness}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">Usage: {resource.usage}</p>
                    </div>
                  </div>
                  <Badge variant="outline">£{resource.cost}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render assessment types tab
  const renderAssessmentTypesTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of assessment approaches
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assessmentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardHeader className="pb-2">
            <CardTitle>Assessment Frequency</CardTitle>
            <CardDescription>
              Assessment patterns throughout the academic year
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentFrequencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="formative" name="Formative" fill="#8884d8" />
                  <Bar dataKey="summative" name="Summative" fill="#82ca9d" />
                  <Bar dataKey="diagnostic" name="Diagnostic" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Quality</CardTitle>
            <CardDescription>
              Quality metrics for assessment practices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={assessmentQualityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Format Distribution</CardTitle>
            <CardDescription>
              Types of assessment formats used
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { format: 'Multiple Choice', percentage: 25 },
                    { format: 'Short Answer', percentage: 20 },
                    { format: 'Extended Response', percentage: 15 },
                    { format: 'Performance Task', percentage: 12 },
                    { format: 'Project', percentage: 10 },
                    { format: 'Portfolio', percentage: 8 },
                    { format: 'Observation', percentage: 6 },
                    { format: 'Self-Assessment', percentage: 4 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="format" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                  <Bar dataKey="percentage" name="Usage %" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Digital vs. Traditional Assessment</CardTitle>
            <CardDescription>
              Comparison of assessment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Digital', value: 65, color: '#8884d8' },
                      { name: 'Traditional', value: 35, color: '#82ca9d' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Digital', value: 65, color: '#8884d8' },
                      { name: 'Traditional', value: 35, color: '#82ca9d' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardHeader className="pb-2">
            <CardTitle>Assessment Time Efficiency</CardTitle>
            <CardDescription>
              Time spent on different assessment activities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Creation', value: 25, color: '#8884d8' },
                      { name: 'Administration', value: 15, color: '#82ca9d' },
                      { name: 'Marking', value: 40, color: '#ffc658' },
                      { name: 'Feedback', value: 20, color: '#ff8042' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Creation', value: 25, color: '#8884d8' },
                      { name: 'Administration', value: 15, color: '#82ca9d' },
                      { name: 'Marking', value: 40, color: '#ffc658' },
                      { name: 'Feedback', value: 20, color: '#ff8042' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardHeader className="pb-2">
            <CardTitle>Assessment Tools</CardTitle>
            <CardDescription>
              Most frequently used assessment tools
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Digital Quiz Platform</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="ml-1 text-xs text-muted-foreground">4.8</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">85%</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Rubric Builder</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="ml-1 text-xs text-muted-foreground">4.6</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">78%</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Feedback Assistant</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="ml-1 text-xs text-muted-foreground">4.7</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">72%</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Progress Tracker</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="ml-1 text-xs text-muted-foreground">4.5</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">68%</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Tools
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render assessment impact tab
  const renderAssessmentImpactTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Impact Analysis</CardTitle>
            <CardDescription>
              Impact metrics for different assessment types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentImpactData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="assessment" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="beforeAfterGap" name="Before/After Progress Gap" fill="#8884d8" />
                  <Bar dataKey="studentEngagement" name="Student Engagement" fill="#82ca9d" />
                  <Bar dataKey="teacherValue" name="Teacher Perceived Value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Feedback Impact</CardTitle>
            <CardDescription>
              How different feedback approaches affect learning
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'Written Comments', impact: 75, implementation: 85 },
                    { type: 'Verbal Feedback', impact: 85, implementation: 70 },
                    { type: 'Peer Feedback', impact: 70, implementation: 60 },
                    { type: 'Self-Assessment', impact: 65, implementation: 55 },
                    { type: 'Rubric-Based', impact: 80, implementation: 75 },
                    { type: 'Digital/Automated', impact: 72, implementation: 65 },
                    { type: 'Video Feedback', impact: 88, implementation: 40 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impact" name="Learning Impact %" fill="#8884d8" />
                  <Bar dataKey="implementation" name="Implementation Rate %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Timing Impact</CardTitle>
            <CardDescription>
              Effect of assessment timing on student outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { position: 'Start of Unit', retention: 65, application: 60, engagement: 75 },
                    { position: 'Mid-Unit', retention: 75, application: 70, engagement: 80 },
                    { position: 'End of Unit', retention: 85, application: 75, engagement: 70 },
                    { position: '1 Week After', retention: 80, application: 80, engagement: 65 },
                    { position: '1 Month After', retention: 70, application: 85, engagement: 60 },
                    { position: 'Next Term', retention: 60, application: 80, engagement: 55 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="retention" name="Knowledge Retention" stroke="#8884d8" />
                  <Line type="monotone" dataKey="application" name="Knowledge Application" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="engagement" name="Student Engagement" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Format Effectiveness</CardTitle>
            <CardDescription>
              Effectiveness of different assessment formats
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={[
                  { format: 'Multiple Choice', accuracy: 85, efficiency: 95, depth: 65 },
                  { format: 'Short Answer', accuracy: 80, efficiency: 85, depth: 75 },
                  { format: 'Essay', accuracy: 75, efficiency: 60, depth: 90 },
                  { format: 'Project', accuracy: 70, efficiency: 65, depth: 95 },
                  { format: 'Presentation', accuracy: 75, efficiency: 70, depth: 85 },
                  { format: 'Portfolio', accuracy: 85, efficiency: 60, depth: 90 },
                  { format: 'Practical', accuracy: 90, efficiency: 75, depth: 85 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="format" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Assessment Accuracy" dataKey="accuracy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Time Efficiency" dataKey="efficiency" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Learning Depth" dataKey="depth" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Student Perception</CardTitle>
            <CardDescription>
              How students perceive different assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'Formative', value: 85 },
                    { type: 'Summative', value: 65 },
                    { type: 'Peer', value: 80 },
                    { type: 'Self', value: 90 },
                    { type: 'Digital', value: 75 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Positive Perception']} />
                  <Bar dataKey="value" name="Positive Perception" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Anxiety Impact</CardTitle>
            <CardDescription>
              How assessment approaches affect student anxiety
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'High-Stakes Tests', anxiety: 85, performance: 65 },
                    { type: 'Low-Stakes Quizzes', anxiety: 40, performance: 85 },
                    { type: 'Project-Based', anxiety: 35, performance: 90 },
                    { type: 'Continuous Assessment', anxiety: 30, performance: 88 },
                    { type: 'Self-Assessment', anxiety: 25, performance: 82 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="anxiety" name="Anxiety Level" fill="#f87171" />
                  <Bar dataKey="performance" name="Performance Level" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>High-Impact Assessment Practices</CardTitle>
            <CardDescription>
              Assessment approaches with greatest learning impact
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Immediate Feedback</p>
                    <p className="text-xs text-muted-foreground">+22% learning gain</p>
                  </div>
                </div>
                <Badge>High Impact</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Formative Quizzing</p>
                    <p className="text-xs text-muted-foreground">+18% learning gain</p>
                  </div>
                </div>
                <Badge>High Impact</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Self-Assessment</p>
                    <p className="text-xs text-muted-foreground">+15% learning gain</p>
                  </div>
                </div>
                <Badge>High Impact</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Peer Review</p>
                    <p className="text-xs text-muted-foreground">+12% learning gain</p>
                  </div>
                </div>
                <Badge>Medium Impact</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Practices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render recommendations tab
  const renderRecommendationsTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Optimization Recommendations</CardTitle>
            <CardDescription>
              AI-powered suggestions to optimize resource usage
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Increase Interactive Resources in Science</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Analysis shows 92% effectiveness for interactive simulations in Science, but only 22% of Science resources are interactive. 
                  Increasing interactive content could improve student outcomes by an estimated 15%.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">High Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Consolidate Digital Textbook Subscriptions</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Current analysis shows overlap in 3 digital textbook platforms with similar content. 
                  Consolidating to a single platform could reduce costs by £1,800 annually while maintaining resource quality.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">Medium Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Expand Video Resources for Humanities</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Humanities has the lowest digital resource usage (25%) despite high effectiveness ratings (82%). 
                  Adding curated video content could increase engagement and improve learning outcomes.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">Medium Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Implement Resource Tagging System</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Only 45% of resources have proper metadata tagging, limiting discoverability. 
                  Implementing a comprehensive tagging system could increase resource utilization by an estimated 25%.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">High Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Strategy Recommendations</CardTitle>
            <CardDescription>
              Evidence-based suggestions to enhance assessment practices
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Increase Formative Assessment Frequency</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Data shows 22% higher progress in classes with weekly formative assessments vs. monthly. 
                  Implementing low-stakes weekly quizzes could significantly improve retention and reduce test anxiety.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">High Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Implement Digital Feedback System</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Analysis shows 35% time reduction in assessment feedback when using digital tools, with no reduction in quality. 
                  Adopting a school-wide digital feedback approach could save approximately 5 hours per teacher per week.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">High Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Expand Peer Assessment Practices</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Peer assessment shows 15% higher engagement and 12% better knowledge retention, but is only used in 10% of classes. 
                  Implementing structured peer assessment could improve outcomes while reducing teacher workload.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">Medium Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-sm font-medium">Standardize Rubric Usage</h4>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Classes using standardized rubrics show 18% more consistent assessment outcomes and higher student satisfaction. 
                  Developing department-wide rubrics could improve assessment reliability and student understanding.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">Medium Priority</Badge>
                  <Button size="sm" variant="outline">Implement</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Gap Analysis</CardTitle>
            <CardDescription>
              Identified gaps in current resource provision
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Limited SEND-Specific Resources</p>
                  <p className="text-xs text-muted-foreground">Only 8% of resources have SEND adaptations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Outdated Computing Materials</p>
                  <p className="text-xs text-muted-foreground">65% of computing resources {'>'}2 years old</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Limited EAL Support Resources</p>
                  <p className="text-xs text-muted-foreground">Only 5% of resources have EAL support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Few Higher-Order Thinking Resources</p>
                  <p className="text-xs text-muted-foreground">12% focus on analysis/evaluation skills</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Improvement Areas</CardTitle>
            <CardDescription>
              Key areas for assessment enhancement
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Feedback Timeliness</p>
                  <p className="text-xs text-muted-foreground">Average 8.5 days feedback turnaround</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Limited Self-Assessment</p>
                  <p className="text-xs text-muted-foreground">Used in only 10% of assessment practices</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Assessment Variety</p>
                  <p className="text-xs text-muted-foreground">75% of assessments use similar formats</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Digital Assessment Skills</p>
                  <p className="text-xs text-muted-foreground">35% of staff need additional training</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cost-Saving Opportunities</CardTitle>
            <CardDescription>
              Potential efficiency improvements and savings
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Subscription Consolidation</p>
                    <p className="text-xs text-muted-foreground">Reduce overlapping services</p>
                  </div>
                </div>
                <Badge variant="outline">£3,200/yr</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Print Resource Reduction</p>
                    <p className="text-xs text-muted-foreground">Shift to digital alternatives</p>
                  </div>
                </div>
                <Badge variant="outline">£2,500/yr</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Assessment Automation</p>
                    <p className="text-xs text-muted-foreground">Reduce marking workload</p>
                  </div>
                </div>
                <Badge variant="outline">£4,800/yr</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Resource Sharing Network</p>
                    <p className="text-xs text-muted-foreground">Inter-school collaboration</p>
                  </div>
                </div>
                <Badge variant="outline">£3,500/yr</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Detailed Analysis
                </Button>
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

// Custom content component for Treemap
// Define the props type for CustomizedContent
interface CustomizedContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  colors?: string[];
  name?: string;
  value?: number;
}

const CustomizedContent = (props: CustomizedContentProps) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor(index / 5) % colors.length] : '#ffffff',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && width > 50 && height > 30 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
      {depth === 1 && width > 50 && height > 30 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 - 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
        >
          {value}
        </text>
      ) : null}
      {depth === 2 && width > 40 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#000"
          fontSize={12}
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};

// Helper components
const ReferenceLine = ({ x, y, stroke, label }) => {
  return (
    <g>
      {x && (
        <line
          x1={x}
          y1={0}
          x2={x}
          y2="100%"
          stroke={stroke}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      )}
      {y && (
        <line
          x1={0}
          y1={y}
          x2="100%"
          y2={y}
          stroke={stroke}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      )}
      {label && x && (
        <text
          x={x + 5}
          y={15}
          textAnchor="start"
          fill={stroke}
          fontSize={12}
        >
          {label}
        </text>
      )}
      {label && y && (
        <text
          x={5}
          y={y - 5}
          textAnchor="start"
          fill={stroke}
          fontSize={12}
        >
          {label}
        </text>
      )}
    </g>
  );
};

