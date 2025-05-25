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
import { format, subDays, subMonths } from "date-fns";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon, 
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for visualisations
const studentProgressData = [
  { name: 'Week 1', maths: 65, english: 70, science: 60 },
  { name: 'Week 2', maths: 68, english: 72, science: 62 },
  { name: 'Week 3', maths: 75, english: 71, science: 65 },
  { name: 'Week 4', maths: 78, english: 74, science: 70 },
  { name: 'Week 5', maths: 82, english: 76, science: 73 },
  { name: 'Week 6', maths: 85, english: 80, science: 75 },
];

const attendanceData = [
  { name: 'Monday', present: 92, absent: 5, late: 3 },
  { name: 'Tuesday', present: 94, absent: 4, late: 2 },
  { name: 'Wednesday', present: 90, absent: 7, late: 3 },
  { name: 'Thursday', present: 88, absent: 8, late: 4 },
  { name: 'Friday', present: 85, absent: 10, late: 5 },
];

const behaviourIncidentsData = [
  { name: 'Week 1', positive: 24, concern: 8 },
  { name: 'Week 2', positive: 28, concern: 6 },
  { name: 'Week 3', positive: 32, concern: 5 },
  { name: 'Week 4', positive: 35, concern: 4 },
  { name: 'Week 5', positive: 38, concern: 3 },
  { name: 'Week 6', positive: 42, concern: 2 },
];

const resourceUsageData = [
  { name: 'Lesson Plans', value: 35 },
  { name: 'Worksheets', value: 25 },
  { name: 'Videos', value: 20 },
  { name: 'Interactive', value: 15 },
  { name: 'Assessments', value: 5 },
];

const parentEngagementData = [
  { name: 'High', value: 35, color: '#4ade80' },
  { name: 'Medium', value: 45, color: '#facc15' },
  { name: 'Low', value: 20, color: '#f87171' },
];

const timeAllocationData = [
  { name: 'Teaching', value: 45 },
  { name: 'Planning', value: 20 },
  { name: 'Assessment', value: 15 },
  { name: 'Meetings', value: 10 },
  { name: 'Admin', value: 10 },
];

const learningStylesData = [
  { name: 'Visual', students: 35 },
  { name: 'Auditory', students: 25 },
  { name: 'Reading/Writing', students: 20 },
  { name: 'Kinaesthetic', students: 20 },
];

const interventionEffectivenessData = [
  { name: 'Reading Support', before: 65, after: 78 },
  { name: 'Maths Tutoring', before: 60, after: 75 },
  { name: 'Behaviour Plan', before: 55, after: 70 },
  { name: 'Attendance Plan', before: 70, after: 85 },
  { name: 'SEN Support', before: 62, after: 72 },
];

// Sample alerts for dashboard
const alerts = [
  { 
    id: 1, 
    type: 'warning', 
    message: '5 students showing declining attendance patterns', 
    action: 'Review attendance data',
    date: '2025-05-16'
  },
  { 
    id: 2, 
    type: 'success', 
    message: 'Year 4 maths progress exceeding targets by 15%', 
    action: 'View progress details',
    date: '2025-05-17'
  },
  { 
    id: 3, 
    type: 'info', 
    message: 'New curriculum resources available for science', 
    action: 'Explore resources',
    date: '2025-05-15'
  },
  { 
    id: 4, 
    type: 'warning', 
    message: 'Parent engagement decreased for Year 6 class', 
    action: 'Review communication data',
    date: '2025-05-14'
  },
];

// Sample dashboard configurations
const dashboardConfigs = [
  { id: 'default', name: 'Default Dashboard', isDefault: true },
  { id: 'academic', name: 'Academic Focus', isDefault: false },
  { id: 'behaviour', name: 'Behaviour & Wellbeing', isDefault: false },
  { id: 'sen', name: 'SEN Support', isDefault: false },
  { id: 'admin', name: 'Administrative', isDefault: false },
];

// Sample time periods for filtering
const timePeriods = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'term', label: 'This Term' },
  { value: 'year', label: 'This Academic Year' },
  { value: 'custom', label: 'Custom Range' },
];

// Sample student groups for filtering
const studentGroups = [
  { value: 'all', label: 'All Students' },
  { value: 'year3', label: 'Year 3' },
  { value: 'year4', label: 'Year 4' },
  { value: 'year5', label: 'Year 5' },
  { value: 'year6', label: 'Year 6' },
  { value: 'sen', label: 'SEN Students' },
  { value: 'pp', label: 'Pupil Premium' },
  { value: 'esl', label: 'EAL Students' },
];

export function DataVisualisationDashboard() {
  // State for dashboard configuration
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConfig, setSelectedConfig] = useState('default');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('month');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // State for chart configurations
  const [chartSettings, setChartSettings] = useState({
    showGrid: true,
    showLegend: true,
    animationEnabled: true,
    darkMode: false,
  });
  
  // Handle time period selection
  useEffect(() => {
    if (selectedTimePeriod === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      
      // Set appropriate date range based on selection
      const now = new Date();
      switch (selectedTimePeriod) {
        case 'week':
          setDateRange({ from: subDays(now, 7), to: now });
          break;
        case 'month':
          setDateRange({ from: subMonths(now, 1), to: now });
          break;
        case 'term':
          setDateRange({ from: subMonths(now, 3), to: now });
          break;
        case 'year':
          setDateRange({ from: subMonths(now, 10), to: now });
          break;
      }
    }
  }, [selectedTimePeriod]);
  
  // Render dashboard header with controls
  const renderDashboardHeader = () => {
    return (
      <div className="flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Visualisation Dashboard</h2>
          <p className="text-muted-foreground">
            Interactive analytics and insights to support evidence-based educational practices
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
          <Select value={selectedConfig} onValueChange={setSelectedConfig}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select dashboard" />
            </SelectTrigger>
            <SelectContent>
              {dashboardConfigs.map(config => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-centre space-x-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render filter bar
  const renderFilterBar = () => {
    return (
      <div className="bg-muted/50 p-4 rounded-lg flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
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
          
          <Select value={selectedStudentGroup} onValueChange={setSelectedStudentGroup}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Student group" />
            </SelectTrigger>
            <SelectContent>
              {studentGroups.map(group => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-centre space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    );
  };
  
  // Render overview dashboard
  const renderOverviewDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
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
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.8% from previous period
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "94%" }} />
                </div>
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resource Utilisation
                </CardTitle>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.3%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from previous period
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "78%" }} />
                </div>
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parent Engagement
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67.8%</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from previous period
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "68%" }} />
                </div>
              </CardContent>
            </Card>
        </div>
        
        {/* Main charts */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Trends</CardTitle>
              <CardDescription>
                Average progress scores across core subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={studentProgressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    {chartSettings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    <XAxis dataKey="name" />
                    <YAxis />
                    {chartSettings.showLegend && <Legend />}
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="maths" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      isAnimationActive={chartSettings.animationEnabled}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="english" 
                      stroke="#82ca9d"
                      isAnimationActive={chartSettings.animationEnabled}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="science" 
                      stroke="#ffc658"
                      isAnimationActive={chartSettings.animationEnabled}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderDashboardHeader()}
      {renderFilterBar()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="behaviour">Behaviour & Wellbeing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {renderOverviewDashboard()}
        </TabsContent>
        <TabsContent value="academic">
          {/* Academic dashboard content */}
        </TabsContent>
        <TabsContent value="behaviour">
          {/* Behaviour dashboard content */}
        </TabsContent>
      </Tabs>
    </div>
  );
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  {chartSettings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                  <XAxis dataKey="name" />
                  <YAxis />
                  {chartSettings.showLegend && <Legend />}
                  <Tooltip />
                  <Bar 
                    dataKey="present" 
                    fill="#4ade80"
                    isAnimationActive={chartSettings.animationEnabled}
                  />
                  <Bar 
                    dataKey="absent" 
                    fill="#f87171"
                    isAnimationActive={chartSettings.animationEnabled}
                  />
                  <Bar 
                    dataKey="late" 
                    fill="#facc15"
                    isAnimationActive={chartSettings.animationEnabled}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Behaviour Incidents</CardTitle>
            <CardDescription>
              Positive vs. concern incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={behaviourIncidentsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  {chartSettings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                  <XAxis dataKey="name" />
                  <YAxis />
                  {chartSettings.showLegend && <Legend />}
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stackId="1" 
                    stroke="#4ade80" 
                    fill="#4ade80"
                    isAnimationActive={chartSettings.animationEnabled}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="concern" 
                    stackId="1" 
                    stroke="#f87171" 
                    fill="#f87171"
                    isAnimationActive={chartSettings.animationEnabled}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>
              Distribution by resource type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={chartSettings.animationEnabled}
                    label={({ name: any, percent }) => `${name}: ${(percent * 100: any).toFixed(0: any)}%`}
                  >
                    {resourceUsageData.map((entry: any, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'
                        ][index % 5]} 
                      />
                    ))}
                  </Pie>
                  {chartSettings.showLegend && <Legend />}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Parent Engagement</CardTitle>
            <CardDescription>
              Levels of parent participation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={parentEngagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={chartSettings.animationEnabled}
                    label={({ name: any, percent }) => `${name}: ${(percent * 100: any).toFixed(0: any)}%`}
                  >
                    {parentEngagementData.map((entry: any, index) => (
                      <Cell key={`cell-${index}`} fill={entry.colour} />
                    ))}
                  </Pie>
                  {chartSettings.showLegend && <Legend />}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts and insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Alerts & Insights</CardTitle>
            <CardDescription>
              Important notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "p-4 rounded-lg border flex items-start space-x-4",
                    alert.type === 'warning' && "bg-yellow-50 border-yellow-200",
                    alert.type === 'success' && "bg-green-50 border-green-200",
                    alert.type === 'info' && "bg-blue-50 border-blue-200"
                  )}
                >
                  {alert.type === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  {alert.type === 'info' && (
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-centre justify-between">
                      <p className="font-medium">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Time Allocation</CardTitle>
            <CardDescription>
              How educator time is distributed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={chartSettings.animationEnabled}
                    label={({ name: any, percent }) => `${name}: ${(percent * 100: any).toFixed(0: any)}%`}
                  >
                    {timeAllocationData.map((entry: any, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'
                        ][index % 5]} 
                      />
                    ))}
                  </Pie>
                  {chartSettings.showLegend && <Legend />}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  // Render academic dashboard
  const renderAcademicDashboard = () => (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Academic Progress
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+14.2%</div>
            <p className="text-xs text-muted-foreground">
              +3.5% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assessment Completion
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.5%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "96%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Curriculum Coverage
            </CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">
              On track for term completion
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "87%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Learning styles distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Styles Distribution</CardTitle>
          <CardDescription>
            Student preferences across learning modalities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={learningStylesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                {chartSettings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey="name" />
                <YAxis />
                {chartSettings.showLegend && <Legend />}
                <Tooltip />
                <Bar 
                  dataKey="students" 
                  fill="#8884d8"
                  isAnimationActive={chartSettings.animationEnabled}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Intervention effectiveness */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Effectiveness</CardTitle>
          <CardDescription>
            Before and after comparison of targeted interventions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={interventionEffectivenessData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                {chartSettings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey="name" />
                <YAxis />
                {chartSettings.showLegend && <Legend />}
                <Tooltip />
                <Bar 
                  dataKey="before" 
                  fill="#f87171"
                  name="Before Intervention"
                  isAnimationActive={chartSettings.animationEnabled}
                />
                <Bar 
                  dataKey="after" 
                  fill="#4ade80"
                  name="After Intervention"
                  isAnimationActive={chartSettings.animationEnabled}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Render chart settings panel
  const renderChartSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Visualisation Settings</CardTitle>
        <CardDescription>
          Customise how charts and data are displayed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-centre justify-between">
            <Label htmlFor="show-grid">Show grid lines</Label>
            <Switch
              id="show-grid"
              checked={chartSettings.showGrid}
              onCheckedChange={(checked: any) => 
                setChartSettings({...chartSettings, showGrid: checked})
              }
            />
          </div>
          
          <div className="flex items-centre justify-between">
            <Label htmlFor="show-legend">Show legends</Label>
            <Switch
              id="show-legend"
              checked={chartSettings.showLegend}
              onCheckedChange={(checked: any) => 
                setChartSettings({...chartSettings, showLegend: checked})
              }
            />
          </div>
          
          <div className="flex items-centre justify-between">
            <Label htmlFor="enable-animation">Enable animations</Label>
            <Switch
              id="enable-animation"
              checked={chartSettings.animationEnabled}
              onCheckedChange={(checked: any) => 
                setChartSettings({...chartSettings, animationEnabled: checked})
              }
            />
          </div>
          
          <div className="flex items-centre justify-between">
            <Label htmlFor="dark-mode">Dark mode charts</Label>
            <Switch
              id="dark-mode"
              checked={chartSettings.darkMode}
              onCheckedChange={(checked: any) => 
                setChartSettings({...chartSettings, darkMode: checked})
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Chart opacity</Label>
            <Slider
              defaultValue={[80]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Apply Settings</Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      {renderDashboardHeader()}
      
      {renderFilterBar()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="academic">
            <BookOpen className="h-4 w-4 mr-2" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="help">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverviewDashboard()}
        </TabsContent>
        
        <TabsContent value="academic" className="mt-6">
          {renderAcademicDashboard()}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {renderChartSettings()}
            
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Configuration</CardTitle>
                <CardDescription>
                  Manage your dashboard layouts and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Saved Dashboards</Label>
                    <div className="mt-2 space-y-2">
                      {dashboardConfigs.map(config => (
                        <div 
                          key={config.id}
                          className="flex items-centre justify-between p-2 border rounded-md"
                        >
                          <div className="flex items-centre">
                            <span>{config.name}</span>
                            {config.isDefault && (
                              <Badge variant="outline" className="ml-2">Default</Badge>
                            )}
                          </div>
                          <div className="flex items-centre space-x-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            {!config.isDefault && (
                              <Button variant="ghost" size="sm">Delete</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Save Current Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="help" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Visualisation Dashboard Help</CardTitle>
              <CardDescription>
                Learn how to get the most from your analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p className="text-muted-foreground mt-1">
                  The Data Visualisation Dashboard provides interactive analytics to help you make data-informed decisions about your educational practise. Here's how to get started:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Use the filters at the top to select time periods and student groups</li>
                  <li>Switch between dashboard tabs to focus on different aspects of your data</li>
                  <li>Hover over charts to see detailed information</li>
                  <li>Customise your view in the Settings tab</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Understanding the Data</h3>
                <p className="text-muted-foreground mt-1">
                  The dashboard presents data from across the platform, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Student academic progress across subjects</li>
                  <li>Attendance and behaviour patterns</li>
                  <li>Resource utilisation and effectiveness</li>
                  <li>Parent engagement metrics</li>
                  <li>Time allocation analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Taking Action</h3>
                <p className="text-muted-foreground mt-1">
                  The insights from this dashboard can help you:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Identify students who may need additional support</li>
                  <li>Recognise successful teaching strategies</li>
                  <li>Optimise resource allocation</li>
                  <li>Improve parent communication</li>
                  <li>Make evidence-based decisions about your practise</li>
                </ul>
              </div>
              
              <div className="flex justify-centre mt-4">
                <Button>
                  View Full Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
