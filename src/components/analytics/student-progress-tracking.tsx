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
  ArrowRight, Target, Eye, EyeOff, Zap, Flag, User, UserPlus, UserCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for longitudinal student progress tracking
const longitudinalProgressData = [
  { year: '2022-23', reading: 62, writing: 65, maths: 58, science: 60, average: 61.25 },
  { year: '2023-24', reading: 72, writing: 70, maths: 68, science: 71, average: 70.25 },
  { year: '2024-25', reading: 82, writing: 78, maths: 75, science: 80, average: 78.75 },
  { year: '2025-26', reading: null, writing: null, maths: null, science: null, average: null, predicted: 85 },
];

// Sample data for cohort comparison
const cohortComparisonData = [
  { name: 'Reading', currentCohort: 82, previousCohort: 78, nationalAverage: 80 },
  { name: 'Writing', currentCohort: 76, previousCohort: 72, nationalAverage: 74 },
  { name: 'Maths', currentCohort: 73, previousCohort: 70, nationalAverage: 75 },
  { name: 'Science', currentCohort: 78, previousCohort: 75, nationalAverage: 77 },
];

// Sample data for student groups comparison
const studentGroupsData = [
  { subject: 'Reading', all: 82, pp: 75, send: 70, eal: 73, boys: 80, girls: 84 },
  { subject: 'Writing', all: 76, pp: 70, send: 65, eal: 68, boys: 72, girls: 80 },
  { subject: 'Maths', all: 73, pp: 68, send: 63, eal: 70, boys: 75, girls: 71 },
  { subject: 'Science', all: 78, pp: 72, send: 68, eal: 74, boys: 77, girls: 79 },
];

// Sample data for individual student progress
const individualStudentData = [
  { assessment: 'Autumn 1', score: 65, target: 70, average: 68 },
  { assessment: 'Autumn 2', score: 68, target: 70, average: 70 },
  { assessment: 'Spring 1', score: 72, target: 75, average: 71 },
  { assessment: 'Spring 2', score: 76, target: 75, average: 73 },
  { assessment: 'Summer 1', score: 78, target: 80, average: 75 },
  { assessment: 'Summer 2', score: 82, target: 80, average: 78 },
];

// Sample data for progress against curriculum objectives
const curriculumProgressData = [
  { objective: 'Number & Place Value', mastered: 85, developing: 10, emerging: 5 },
  { objective: 'Addition & Subtraction', mastered: 78, developing: 15, emerging: 7 },
  { objective: 'Multiplication & Division', mastered: 65, developing: 25, emerging: 10 },
  { objective: 'Fractions', mastered: 60, developing: 30, emerging: 10 },
  { objective: 'Measurement', mastered: 75, developing: 20, emerging: 5 },
  { objective: 'Geometry', mastered: 70, developing: 20, emerging: 10 },
  { objective: 'Statistics', mastered: 80, developing: 15, emerging: 5 },
];

// Sample data for intervention impact
const interventionImpactData = [
  { name: 'Reading Support', before: 65, after: 78, target: 75 },
  { name: 'Maths Tutoring', before: 60, after: 75, target: 72 },
  { name: 'Writing Workshop', before: 62, after: 73, target: 70 },
  { name: 'Science Club', before: 68, after: 80, target: 75 },
];

// Sample data for at-risk students
const atRiskStudentsData = [
  { 
    id: 1, 
    name: 'Alex Thompson', 
    year: 4,
    concerns: ['Maths: -12% below target', 'Attendance: 86%'],
    trend: 'declining',
    interventions: ['Daily maths support', 'Parent meeting scheduled'],
    priority: 'high'
  },
  { 
    id: 2, 
    name: 'Samira Khan', 
    year: 5,
    concerns: ['Reading: -8% below target', 'Engagement in class'],
    trend: 'static',
    interventions: ['Reading intervention group', 'Interest-based materials'],
    priority: 'medium'
  },
  { 
    id: 3, 
    name: 'Jamie Wilson', 
    year: 6,
    concerns: ['Multiple subjects: -15% average', 'Behaviour incidents'],
    trend: 'declining',
    interventions: ['SEN assessment', 'Behaviour support plan'],
    priority: 'high'
  },
  { 
    id: 4, 
    name: 'Olivia Chen', 
    year: 3,
    concerns: ['Science: -7% below target', 'Confidence in practical work'],
    trend: 'improving',
    interventions: ['Small group practical sessions'],
    priority: 'low'
  },
];

// Sample data for progress distribution
const progressDistributionData = [
  { name: 'Exceeding', students: 25, color: '#4ade80' },
  { name: 'Meeting', students: 45, color: '#facc15' },
  { name: 'Working Towards', students: 20, color: '#fb923c' },
  { name: 'Below', students: 10, color: '#f87171' },
];

export function StudentProgressTracking() {
  // State for tracking configuration
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('academic-year');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 10),
    to: new Date(),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
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
        <h1 className="text-3xl font-bold tracking-tight">Student Progress Tracking</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics for monitoring and predicting student achievement
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
          New Assessment
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
        
        <Select value={selectedStudentGroup} onValueChange={setSelectedStudentGroup}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Student group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="pp">Pupil Premium</SelectItem>
            <SelectItem value="send">SEND</SelectItem>
            <SelectItem value="eal">EAL</SelectItem>
            <SelectItem value="boys">Boys</SelectItem>
            <SelectItem value="girls">Girls</SelectItem>
            <SelectItem value="custom">Custom Group</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="maths">Maths</SelectItem>
            <SelectItem value="science">Science</SelectItem>
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
        <TabsTrigger value="longitudinal">Longitudinal</TabsTrigger>
        <TabsTrigger value="cohort">Cohort Comparison</TabsTrigger>
        <TabsTrigger value="curriculum">Curriculum Coverage</TabsTrigger>
        <TabsTrigger value="interventions">Interventions</TabsTrigger>
        <TabsTrigger value="individual">Individual Students</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        {renderOverviewTab()}
      </TabsContent>
      
      <TabsContent value="longitudinal" className="mt-6 space-y-6">
        {renderLongitudinalTab()}
      </TabsContent>
      
      <TabsContent value="cohort" className="mt-6 space-y-6">
        {renderCohortComparisonTab()}
      </TabsContent>
      
      <TabsContent value="curriculum" className="mt-6 space-y-6">
        {renderCurriculumCoverageTab()}
      </TabsContent>
      
      <TabsContent value="interventions" className="mt-6 space-y-6">
        {renderInterventionsTab()}
      </TabsContent>
      
      <TabsContent value="individual" className="mt-6 space-y-6">
        {renderIndividualStudentsTab()}
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
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students Above Target
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "68%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attainment Gap (PP)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">-8.3%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intervention Impact
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">
              +3.7% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress Distribution</CardTitle>
            <CardDescription>
              Student distribution across progress categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="students"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {progressDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>
              Average performance across core subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { subject: 'Reading', score: 82, target: 80 },
                    { subject: 'Writing', score: 76, target: 75 },
                    { subject: 'Maths', score: 73, target: 75 },
                    { subject: 'Science', score: 78, target: 75 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Average Score" fill="#8884d8" />
                  <Bar dataKey="target" name="Target" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress by Student Group</CardTitle>
            <CardDescription>
              Comparative analysis across student demographics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={[
                  { subject: 'Reading', all: 82, pp: 75, send: 70 },
                  { subject: 'Writing', all: 76, pp: 70, send: 65 },
                  { subject: 'Maths', all: 73, pp: 68, send: 63 },
                  { subject: 'Science', all: 78, pp: 72, send: 68 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="All Students" dataKey="all" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Pupil Premium" dataKey="pp" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="SEND" dataKey="send" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Predicted Outcomes</CardTitle>
            <CardDescription>
              AI-powered prediction of end-of-year results
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Exceeding', current: 25, predicted: 30 },
                    { name: 'Meeting', current: 45, predicted: 48 },
                    { name: 'Working Towards', current: 20, predicted: 17 },
                    { name: 'Below', current: 10, predicted: 5 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="Current" fill="#8884d8" />
                  <Bar dataKey="predicted" name="Predicted" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>At-Risk Students</CardTitle>
            <CardDescription>
              Students requiring additional support
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {atRiskStudentsData.slice(0, 4).map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-md bg-muted p-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={cn(
                      "h-5 w-5",
                      student.priority === 'high' ? "text-red-500" : 
                      student.priority === 'medium' ? "text-amber-500" : 
                      "text-yellow-500"
                    )} />
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.concerns[0]}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render longitudinal tab
  const renderLongitudinalTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Multi-Year Progress Trends</CardTitle>
            <CardDescription>
              Longitudinal tracking across academic years
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={longitudinalProgressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reading" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="writing" 
                    stroke="#82ca9d"
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maths" 
                    stroke="#ffc658"
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="science" 
                    stroke="#ff8042"
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#ff0000"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#ff0000"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Year-on-Year Growth</CardTitle>
            <CardDescription>
              Annual progress increments by subject
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { subject: 'Reading', 'year1-2': 10, 'year2-3': 10 },
                    { subject: 'Writing', 'year1-2': 5, 'year2-3': 8 },
                    { subject: 'Maths', 'year1-2': 10, 'year2-3': 7 },
                    { subject: 'Science', 'year1-2': 11, 'year2-3': 9 },
                    { subject: 'Average', 'year1-2': 9, 'year2-3': 8.5 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="year1-2" name="2022-23 to 2023-24" fill="#8884d8" />
                  <Bar dataKey="year2-3" name="2023-24 to 2024-25" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress Trajectory Analysis</CardTitle>
            <CardDescription>
              Current trajectory with prediction models
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { term: 'Y3 Autumn', actual: 60, expected: 60, predicted: null },
                    { term: 'Y3 Spring', actual: 65, expected: 65, predicted: null },
                    { term: 'Y3 Summer', actual: 70, expected: 70, predicted: null },
                    { term: 'Y4 Autumn', actual: 72, expected: 73, predicted: null },
                    { term: 'Y4 Spring', actual: 76, expected: 76, predicted: null },
                    { term: 'Y4 Summer', actual: 80, expected: 79, predicted: null },
                    { term: 'Y5 Autumn', actual: 82, expected: 82, predicted: null },
                    { term: 'Y5 Spring', actual: 85, expected: 85, predicted: null },
                    { term: 'Y5 Summer', actual: null, expected: 88, predicted: 90 },
                    { term: 'Y6 Autumn', actual: null, expected: 91, predicted: 93 },
                    { term: 'Y6 Spring', actual: null, expected: 94, predicted: 96 },
                    { term: 'Y6 Summer', actual: null, expected: 97, predicted: 100 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Actual Progress"
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    name="Expected Trajectory"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    connectNulls={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    name="AI Prediction"
                    stroke="#ff8042"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    connectNulls={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    fill="#ff8042"
                    fillOpacity={0.2}
                    stroke="none"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attainment Gap Trends</CardTitle>
            <CardDescription>
              Tracking gaps between student groups over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { year: '2022-23 Autumn', pp: -12, send: -15, eal: -10, gender: -5 },
                    { year: '2022-23 Spring', pp: -11, send: -14, eal: -9, gender: -5 },
                    { year: '2022-23 Summer', pp: -10, send: -13, eal: -8, gender: -4 },
                    { year: '2023-24 Autumn', pp: -10, send: -12, eal: -7, gender: -4 },
                    { year: '2023-24 Spring', pp: -9, send: -11, eal: -6, gender: -3 },
                    { year: '2023-24 Summer', pp: -9, send: -10, eal: -5, gender: -3 },
                    { year: '2024-25 Autumn', pp: -8, send: -10, eal: -5, gender: -2 },
                    { year: '2024-25 Spring', pp: -8, send: -9, eal: -4, gender: -2 },
                    { year: '2024-25 Summer', pp: -7, send: -8, eal: -3, gender: -1 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[-20, 0]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pp" 
                    name="Pupil Premium Gap"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="send" 
                    name="SEND Gap"
                    stroke="#82ca9d"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="eal" 
                    name="EAL Gap"
                    stroke="#ffc658"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gender" 
                    name="Gender Gap"
                    stroke="#ff8042"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render cohort comparison tab
  const renderCohortComparisonTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cohort Comparison</CardTitle>
            <CardDescription>
              Current cohort vs previous cohort and national average
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cohortComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentCohort" name="Current Cohort" fill="#8884d8" />
                  <Bar dataKey="previousCohort" name="Previous Cohort" fill="#82ca9d" />
                  <Bar dataKey="nationalAverage" name="National Average" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Student Groups Comparison</CardTitle>
            <CardDescription>
              Performance across different student demographics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentGroupsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="all" name="All Students" fill="#8884d8" />
                  <Bar dataKey="pp" name="Pupil Premium" fill="#82ca9d" />
                  <Bar dataKey="send" name="SEND" fill="#ffc658" />
                  <Bar dataKey="eal" name="EAL" fill="#ff8042" />
                  <Bar dataKey="boys" name="Boys" fill="#0088fe" />
                  <Bar dataKey="girls" name="Girls" fill="#ff00ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress Distribution Comparison</CardTitle>
            <CardDescription>
              Distribution of students across progress categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: 'Exceeding', current: 25, previous: 20, national: 22 },
                    { category: 'Meeting', current: 45, previous: 42, national: 44 },
                    { category: 'Working Towards', current: 20, previous: 25, national: 22 },
                    { category: 'Below', current: 10, previous: 13, national: 12 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="Current Cohort" fill="#8884d8" />
                  <Bar dataKey="previous" name="Previous Cohort" fill="#82ca9d" />
                  <Bar dataKey="national" name="National Average" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Value Added Analysis</CardTitle>
            <CardDescription>
              Progress relative to starting points
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="starting" 
                    name="Starting Point" 
                    domain={[0, 100]} 
                    label={{ value: 'Starting Point', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="current" 
                    name="Current Level" 
                    domain={[0, 100]}
                    label={{ value: 'Current Level', angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Current Cohort" 
                    data={[
                      { starting: 45, current: 65, name: "Student A" },
                      { starting: 50, current: 68, name: "Student B" },
                      { starting: 55, current: 72, name: "Student C" },
                      { starting: 60, current: 75, name: "Student D" },
                      { starting: 65, current: 78, name: "Student E" },
                      { starting: 70, current: 80, name: "Student F" },
                      { starting: 75, current: 82, name: "Student G" },
                      { starting: 80, current: 85, name: "Student H" },
                      { starting: 40, current: 62, name: "Student I" },
                      { starting: 45, current: 70, name: "Student J" },
                      { starting: 50, current: 65, name: "Student K" },
                      { starting: 55, current: 75, name: "Student L" },
                      { starting: 60, current: 70, name: "Student M" },
                      { starting: 65, current: 85, name: "Student N" },
                      { starting: 70, current: 75, name: "Student O" },
                    ]} 
                    fill="#8884d8"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    data={[
                      { starting: 0, expected: 0 },
                      { starting: 100, expected: 100 },
                    ]}
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                    name="Expected Progress"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render curriculum coverage tab
  const renderCurriculumCoverageTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Curriculum Objectives Progress</CardTitle>
            <CardDescription>
              Mastery levels across curriculum objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={curriculumProgressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="objective" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mastered" name="Mastered" stackId="a" fill="#4ade80" />
                  <Bar dataKey="developing" name="Developing" stackId="a" fill="#facc15" />
                  <Bar dataKey="emerging" name="Emerging" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Curriculum Coverage Map</CardTitle>
            <CardDescription>
              Coverage and mastery across curriculum areas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={[
                  { area: 'Number', coverage: 95, mastery: 85 },
                  { area: 'Algebra', coverage: 90, mastery: 75 },
                  { area: 'Ratio & Proportion', coverage: 85, mastery: 70 },
                  { area: 'Geometry', coverage: 80, mastery: 75 },
                  { area: 'Statistics', coverage: 90, mastery: 80 },
                  { area: 'Measurement', coverage: 95, mastery: 85 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Coverage %" dataKey="coverage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Mastery %" dataKey="mastery" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Curriculum Gaps Analysis</CardTitle>
            <CardDescription>
              Identifying areas with lower mastery levels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { objective: 'Fractions - Equivalence', mastery: 60, target: 100 },
                    { objective: 'Geometry - Properties of Shapes', mastery: 65, target: 100 },
                    { objective: 'Statistics - Interpreting Data', mastery: 68, target: 100 },
                    { objective: 'Ratio - Proportional Reasoning', mastery: 70, target: 100 },
                    { objective: 'Algebra - Expressions', mastery: 72, target: 100 },
                  ]}
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="objective" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mastery" name="Current Mastery %" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Curriculum Progression</CardTitle>
            <CardDescription>
              Progress through curriculum sequence
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Number & Place Value</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "95%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Addition & Subtraction</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "90%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Multiplication & Division</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Fractions</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Measurement</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "80%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">80%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Geometry</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">70%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Statistics</p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Detailed Curriculum Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render interventions tab
  const renderInterventionsTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Intervention Impact Analysis</CardTitle>
            <CardDescription>
              Before and after comparison for interventions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={interventionImpactData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" name="Before Intervention" fill="#f87171" />
                  <Bar dataKey="after" name="After Intervention" fill="#4ade80" />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Intervention Effectiveness</CardTitle>
            <CardDescription>
              Comparative analysis of intervention types
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'Small Group', impact: 15, duration: 8, costEffectiveness: 85 },
                    { type: '1:1 Support', impact: 18, duration: 6, costEffectiveness: 75 },
                    { type: 'Digital', impact: 12, duration: 10, costEffectiveness: 90 },
                    { type: 'Peer Tutoring', impact: 10, duration: 12, costEffectiveness: 95 },
                    { type: 'Parent Support', impact: 14, duration: 10, costEffectiveness: 92 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="impact" name="Average Impact %" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="duration" name="Avg. Duration (weeks)" fill="#82ca9d" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="costEffectiveness" 
                    name="Cost Effectiveness"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Intervention Targeting Accuracy</CardTitle>
            <CardDescription>
              Analysis of intervention allocation effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Highly Effective', value: 45, color: '#4ade80' },
                      { name: 'Moderately Effective', value: 30, color: '#facc15' },
                      { name: 'Limited Effect', value: 15, color: '#fb923c' },
                      { name: 'No Significant Effect', value: 10, color: '#f87171' },
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
                    {progressDistributionData.map((entry, index) => (
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
            <CardTitle>Active Interventions</CardTitle>
            <CardDescription>
              Currently running intervention programmes
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Reading Fluency Programme</p>
                    <p className="text-xs text-muted-foreground">12 students, 8 weeks duration</p>
                  </div>
                </div>
                <Badge variant="outline">Week 4</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Maths Mastery Booster</p>
                    <p className="text-xs text-muted-foreground">8 students, 6 weeks duration</p>
                  </div>
                </div>
                <Badge variant="outline">Week 3</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Writing Confidence Workshop</p>
                    <p className="text-xs text-muted-foreground">10 students, 10 weeks duration</p>
                  </div>
                </div>
                <Badge variant="outline">Week 6</Badge>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">1:1 Targeted Support</p>
                    <p className="text-xs text-muted-foreground">5 students, 12 weeks duration</p>
                  </div>
                </div>
                <Badge variant="outline">Week 8</Badge>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Plan New Intervention
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render individual students tab
  const renderIndividualStudentsTab = () => (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              Select a student to view detailed progress
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8" />
              </div>
              
              <div className="pt-2 space-y-1">
                {atRiskStudentsData.map((student) => (
                  <div 
                    key={student.id}
                    className={cn(
                      "flex items-center justify-between rounded-md p-2 cursor-pointer",
                      selectedStudent === student.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Year {student.year}</p>
                      </div>
                    </div>
                    {student.priority === 'high' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
                
                <div 
                  className="flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedStudent(5)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Emily Johnson</p>
                      <p className="text-xs text-muted-foreground">Year 5</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedStudent(6)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Mohammed Ali</p>
                      <p className="text-xs text-muted-foreground">Year 4</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedStudent(7)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Sofia Garcia</p>
                      <p className="text-xs text-muted-foreground">Year 6</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedStudent(8)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Daniel Smith</p>
                      <p className="text-xs text-muted-foreground">Year 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Progress Details</CardTitle>
                <CardDescription>
                  Comprehensive progress tracking for individual student
                </CardDescription>
              </div>
              {selectedStudent && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                  <Button size="sm">
                    <Target className="mr-2 h-4 w-4" />
                    Set Targets
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Current Average
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-2xl font-bold">76%</div>
                      <p className="text-xs text-muted-foreground">
                        +8% from last assessment
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Target Gap
                      </CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-2xl font-bold">-4%</div>
                      <p className="text-xs text-muted-foreground">
                        Improving trend
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Attendance
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-2xl font-bold">94.2%</div>
                      <p className="text-xs text-muted-foreground">
                        -0.8% from last term
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Learning Style
                      </CardTitle>
                      <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-2xl font-bold">Visual</div>
                      <p className="text-xs text-muted-foreground">
                        Secondary: Kinaesthetic
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Progress Tracking</CardTitle>
                      <CardDescription>
                        Assessment scores over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={individualStudentData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="assessment" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              name="Student Score"
                              stroke="#8884d8" 
                              activeDot={{ r: 8 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              name="Target"
                              stroke="#82ca9d"
                              strokeDasharray="5 5"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="average" 
                              name="Class Average"
                              stroke="#ffc658"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Subject Performance</CardTitle>
                      <CardDescription>
                        Performance across different subjects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={[
                            { subject: 'Reading', score: 82, target: 80, average: 78 },
                            { subject: 'Writing', score: 75, target: 75, average: 72 },
                            { subject: 'Maths', score: 68, target: 75, average: 70 },
                            { subject: 'Science', score: 78, target: 75, average: 75 },
                            { subject: 'Humanities', score: 80, target: 75, average: 74 },
                          ]}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Student Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Radar name="Class Average" dataKey="average" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
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
                      <CardTitle>Strengths</CardTitle>
                      <CardDescription>
                        Areas of strong performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Reading Comprehension</span>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Scientific Enquiry</span>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Creative Writing</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Areas for Development</CardTitle>
                      <CardDescription>
                        Areas needing additional support
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Fractions & Decimals</span>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Spelling Accuracy</span>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <ArrowRight className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Problem Solving</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Current Interventions</CardTitle>
                      <CardDescription>
                        Active support programmes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <Flag className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm">Maths Booster Group</p>
                            <p className="text-xs text-muted-foreground">Week 3 of 6</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-muted p-2">
                          <Flag className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm">Spelling Programme</p>
                            <p className="text-xs text-muted-foreground">Week 2 of 8</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Intervention
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 py-12">
                <UserPlus className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">Select a Student</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Choose a student from the list to view their detailed progress information, 
                  including assessment history, subject performance, and intervention records.
                </p>
              </div>
            )}
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

