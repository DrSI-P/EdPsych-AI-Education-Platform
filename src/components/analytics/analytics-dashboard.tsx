'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  Calendar, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Share2,
  Printer,
  Save,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const studentProgressData = [
  { name: 'Mathematics', current: 78, previous: 65, target: 85 },
  { name: 'English', current: 82, previous: 75, target: 85 },
  { name: 'Science', current: 70, previous: 62, target: 80 },
  { name: 'History', current: 85, previous: 80, target: 85 },
  { name: 'Geography', current: 75, previous: 68, target: 80 },
  { name: 'Art', current: 90, previous: 85, target: 90 },
];

const attendanceData = [
  { month: 'Jan', attendance: 95 },
  { month: 'Feb', attendance: 97 },
  { month: 'Mar', attendance: 94 },
  { month: 'Apr', attendance: 98 },
  { month: 'May', attendance: 96 },
  { month: 'Jun', attendance: 93 },
  { month: 'Jul', attendance: 97 },
  { month: 'Aug', attendance: 95 },
  { month: 'Sep', attendance: 98 },
  { month: 'Oct', attendance: 96 },
  { month: 'Nov', attendance: 94 },
  { month: 'Dec', attendance: 92 },
];

const engagementData = [
  { name: 'Active Participation', value: 65 },
  { name: 'Resource Access', value: 80 },
  { name: 'Assignment Completion', value: 75 },
  { name: 'Discussion Contribution', value: 60 },
  { name: 'Peer Collaboration', value: 70 },
];

const learningStyleData = [
  { subject: 'Visual', A: 120, fullMark: 150 },
  { subject: 'Auditory', A: 98, fullMark: 150 },
  { subject: 'Reading/Writing', A: 86, fullMark: 150 },
  { subject: 'Kinesthetic', A: 99, fullMark: 150 },
  { subject: 'Social', A: 85, fullMark: 150 },
  { subject: 'Solitary', A: 65, fullMark: 150 },
];

const resourceUsageData = [
  { name: 'Videos', students: 85, educators: 45 },
  { name: 'Documents', students: 70, educators: 65 },
  { name: 'Interactive', students: 90, educators: 40 },
  { name: 'Assessments', students: 65, educators: 80 },
  { name: 'External Links', students: 55, educators: 30 },
];

const assessmentPerformanceData = [
  { score: 30, count: 2 },
  { score: 40, count: 3 },
  { score: 50, count: 5 },
  { score: 60, count: 8 },
  { score: 70, count: 12 },
  { score: 80, count: 15 },
  { score: 90, count: 10 },
  { score: 100, count: 5 },
];

const mockReports = [
  { id: 1, name: 'Student Progress Report', type: 'Student', lastRun: '2025-05-15', schedule: 'Weekly' },
  { id: 2, name: 'Educator Performance Summary', type: 'Educator', lastRun: '2025-05-10', schedule: 'Monthly' },
  { id: 3, name: 'Resource Utilization Analysis', type: 'Resource', lastRun: '2025-05-01', schedule: 'Monthly' },
  { id: 4, name: 'Assessment Effectiveness Report', type: 'Assessment', lastRun: '2025-04-28', schedule: 'As needed' },
  { id: 5, name: 'Curriculum Coverage Report', type: 'Curriculum', lastRun: '2025-04-15', schedule: 'Termly' },
  { id: 6, name: 'Parent Engagement Summary', type: 'Parent', lastRun: '2025-05-12', schedule: 'Monthly' },
];

const mockAlerts = [
  { id: 1, type: 'warning', message: 'Emma Smith has missed 3 consecutive assignments', date: '2025-05-17' },
  { id: 2, type: 'success', message: 'James Wilson has achieved all term goals', date: '2025-05-16' },
  { id: 3, type: 'info', message: 'New assessment results available for Year 4', date: '2025-05-15' },
  { id: 4, type: 'warning', message: 'Resource usage below threshold for Science module', date: '2025-05-14' },
  { id: 5, type: 'success', message: 'Literacy intervention showing positive results', date: '2025-05-13' },
];

const AnalyticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState({ from: new Date(2025, 0, 1), to: new Date() });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "All analytics data has been updated to the latest available information.",
      });
    }, 1200);
  };

  const handleExport = (format) => {
    toast({
      title: `Exporting Dashboard as ${format.toUpperCase()}`,
      description: "Your export is being prepared and will download shortly.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Preparing Print Version",
      description: "The print dialog will open shortly.",
    });
    // In a real implementation, this would trigger the print dialog
  };

  const handleSaveView = () => {
    toast({
      title: "Dashboard View Saved",
      description: "Your current dashboard configuration has been saved.",
    });
  };

  const handleRunReport = (reportId) => {
    toast({
      title: "Running Report",
      description: `Report #${reportId} is being generated and will be available shortly.`,
    });
  };

  const handleScheduleReport = (reportId) => {
    toast({
      title: "Schedule Updated",
      description: `Report #${reportId} schedule has been updated.`,
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and data visualizations for evidence-based decision making.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveView}>
            <Save className="mr-2 h-4 w-4" />
            Save View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students Tracked
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +12% from last term
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last term
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Utilization
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">
              -2% from last term
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              8 high priority
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Refine the analytics data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="emma">Emma Smith</SelectItem>
                    <SelectItem value="james">James Wilson</SelectItem>
                    <SelectItem value="sophia">Sophia Johnson</SelectItem>
                    <SelectItem value="noah">Noah Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="year3">Year 3</SelectItem>
                    <SelectItem value="year4">Year 4</SelectItem>
                    <SelectItem value="year5">Year 5</SelectItem>
                    <SelectItem value="year6">Year 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="maths">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DateRangePicker
                  value={selectedDateRange}
                  onChange={setSelectedDateRange}
                />
              </div>
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>
                Recent notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      {alert.type === 'warning' && (
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      )}
                      {alert.type === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      {alert.type === 'info' && (
                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Alerts</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="educators">Educators</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              {isLoading ? (
                renderSkeleton()
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Progress Overview</CardTitle>
                      <CardDescription>
                        Current vs previous term performance across subjects
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={studentProgressData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="previous" name="Previous Term" fill="#8884d8" />
                            <Bar dataKey="current" name="Current Term" fill="#82ca9d" />
                            <Bar dataKey="target" name="Target" fill="#ffc658" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                        <CardDescription>
                          Monthly attendance percentage
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={attendanceData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis domain={[90, 100]} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="attendance" 
                                name="Attendance %" 
                                stroke="#8884d8" 
                                activeDot={{ r: 8 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Engagement Metrics</CardTitle>
                        <CardDescription>
                          Student engagement across different activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={engagementData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {engagementData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Style Profile</CardTitle>
                        <CardDescription>
                          Preferred learning modalities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={learningStyleData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis angle={30} domain={[0, 150]} />
                              <Radar name="Student" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Usage</CardTitle>
                        <CardDescription>
                          Comparison of resource usage between students and educators
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={resourceUsageData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="students" name="Students" fill="#8884d8" />
                              <Bar dataKey="educators" name="Educators" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="students" className="space-y-4">
              {isLoading ? (
                renderSkeleton()
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Performance Distribution</CardTitle>
                      <CardDescription>
                        Assessment score distribution across all students
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
                              dataKey="score" 
                              name="Score" 
                              domain={[0, 100]}
                              label={{ value: 'Score', position: 'insideBottomRight', offset: -5 }} 
                            />
                            <YAxis 
                              type="number" 
                              dataKey="count" 
                              name="Number of Students"
                              label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} 
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Students" data={assessmentPerformanceData} fill="#8884d8" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Individual Student Progress</CardTitle>
                        <CardDescription>
                          Select a student to view detailed progress
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emma">Emma Smith</SelectItem>
                              <SelectItem value="james">James Wilson</SelectItem>
                              <SelectItem value="sophia">Sophia Johnson</SelectItem>
                              <SelectItem value="noah">Noah Williams</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="h-[200px] flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Select a student to view progress</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Intervention Effectiveness</CardTitle>
                        <CardDescription>
                          Impact of interventions on student progress
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { week: 'Week 1', before: 65, after: 65 },
                                { week: 'Week 2', before: 66, after: 68 },
                                { week: 'Week 3', before: 67, after: 72 },
                                { week: 'Week 4', before: 68, after: 75 },
                                { week: 'Week 5', before: 69, after: 79 },
                                { week: 'Week 6', before: 70, after: 82 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="week" />
                              <YAxis domain={[60, 90]} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="before" 
                                name="Projected (No Intervention)" 
                                stroke="#8884d8" 
                                strokeDasharray="5 5"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="after" 
                                name="Actual (With Intervention)" 
                                stroke="#82ca9d" 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="educators" className="space-y-4">
              {isLoading ? (
                renderSkeleton()
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Educator Performance Metrics</CardTitle>
                      <CardDescription>
                        Key performance indicators for educators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Ms. Johnson', studentProgress: 82, resourceCreation: 65, parentEngagement: 78 },
                              { name: 'Mr. Smith', studentProgress: 75, resourceCreation: 80, parentEngagement: 70 },
                              { name: 'Mrs. Davis', studentProgress: 85, resourceCreation: 60, parentEngagement: 85 },
                              { name: 'Mr. Wilson', studentProgress: 78, resourceCreation: 75, parentEngagement: 65 },
                              { name: 'Ms. Thompson', studentProgress: 80, resourceCreation: 70, parentEngagement: 75 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="studentProgress" name="Student Progress" fill="#8884d8" />
                            <Bar dataKey="resourceCreation" name="Resource Creation" fill="#82ca9d" />
                            <Bar dataKey="parentEngagement" name="Parent Engagement" fill="#ffc658" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Development Impact</CardTitle>
                        <CardDescription>
                          Effect of training on educator performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', beforeTraining: 70, afterTraining: 70 },
                                { month: 'Feb', beforeTraining: 71, afterTraining: 73 },
                                { month: 'Mar', beforeTraining: 72, afterTraining: 78 },
                                { month: 'Apr', beforeTraining: 73, afterTraining: 82 },
                                { month: 'May', beforeTraining: 74, afterTraining: 85 },
                                { month: 'Jun', beforeTraining: 75, afterTraining: 88 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis domain={[65, 90]} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="beforeTraining" 
                                name="Projected Performance" 
                                stroke="#8884d8" 
                                strokeDasharray="5 5"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="afterTraining" 
                                name="Actual Performance" 
                                stroke="#82ca9d" 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Teaching Strategy Effectiveness</CardTitle>
                        <CardDescription>
                          Impact of different teaching approaches
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { strategy: 'Direct Instruction', effectiveness: 75 },
                                { strategy: 'Inquiry-Based', effectiveness: 85 },
                                { strategy: 'Collaborative', effectiveness: 80 },
                                { strategy: 'Flipped Classroom', effectiveness: 78 },
                                { strategy: 'Differentiated', effectiveness: 88 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="strategy" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="effectiveness" name="Effectiveness Score" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="resources" className="space-y-4">
              {isLoading ? (
                renderSkeleton()
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Utilization by Type</CardTitle>
                      <CardDescription>
                        Usage patterns across different resource types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: 'Jan', videos: 120, documents: 85, interactive: 65, assessments: 45 },
                              { month: 'Feb', videos: 130, documents: 90, interactive: 70, assessments: 50 },
                              { month: 'Mar', videos: 125, documents: 95, interactive: 80, assessments: 55 },
                              { month: 'Apr', videos: 140, documents: 100, interactive: 85, assessments: 60 },
                              { month: 'May', videos: 150, documents: 110, interactive: 90, assessments: 65 },
                              { month: 'Jun', videos: 145, documents: 105, interactive: 95, assessments: 70 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="videos" name="Videos" stackId="a" fill="#8884d8" />
                            <Bar dataKey="documents" name="Documents" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="interactive" name="Interactive" stackId="a" fill="#ffc658" />
                            <Bar dataKey="assessments" name="Assessments" stackId="a" fill="#ff8042" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Effectiveness</CardTitle>
                        <CardDescription>
                          Impact on student performance by resource type
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { type: 'Videos', effectiveness: 82, engagement: 88 },
                                { type: 'Documents', effectiveness: 75, engagement: 70 },
                                { type: 'Interactive', effectiveness: 90, engagement: 92 },
                                { type: 'Assessments', effectiveness: 85, engagement: 75 },
                                { type: 'External', effectiveness: 78, engagement: 80 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="type" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="effectiveness" name="Learning Effectiveness" fill="#8884d8" />
                              <Bar dataKey="engagement" name="Student Engagement" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Gaps Analysis</CardTitle>
                        <CardDescription>
                          Curriculum areas needing additional resources
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { subject: 'Mathematics', coverage: 85, need: 15 },
                                { subject: 'English', coverage: 90, need: 10 },
                                { subject: 'Science', coverage: 75, need: 25 },
                                { subject: 'History', coverage: 65, need: 35 },
                                { subject: 'Geography', coverage: 70, need: 30 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="subject" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="coverage" name="Current Coverage" fill="#82ca9d" />
                              <Bar dataKey="need" name="Resource Gap" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              {isLoading ? (
                renderSkeleton()
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Report Management</CardTitle>
                      <CardDescription>
                        Create, schedule, and manage reports
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="space-x-2">
                            <Button>
                              <FileText className="mr-2 h-4 w-4" />
                              New Report
                            </Button>
                            <Button variant="outline">
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Search reports..." 
                              className="w-[200px]" 
                            />
                          </div>
                        </div>
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Report Name</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Last Run</th>
                                <th className="text-left p-2">Schedule</th>
                                <th className="text-left p-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockReports.map((report) => (
                                <tr key={report.id} className="border-b">
                                  <td className="p-2">{report.name}</td>
                                  <td className="p-2">
                                    <Badge variant="outline">{report.type}</Badge>
                                  </td>
                                  <td className="p-2">{report.lastRun}</td>
                                  <td className="p-2">{report.schedule}</td>
                                  <td className="p-2">
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleRunReport(report.id)}
                                      >
                                        Run
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleScheduleReport(report.id)}
                                      >
                                        Schedule
                                      </Button>
                                      <Button variant="ghost" size="sm">Edit</Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Report Builder</CardTitle>
                        <CardDescription>
                          Create personalized reports with selected metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="report-name">Report Name</Label>
                            <Input id="report-name" placeholder="Enter report name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select>
                              <SelectTrigger id="report-type">
                                <SelectValue placeholder="Select report type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Student Progress</SelectItem>
                                <SelectItem value="educator">Educator Performance</SelectItem>
                                <SelectItem value="resource">Resource Utilization</SelectItem>
                                <SelectItem value="assessment">Assessment Analysis</SelectItem>
                                <SelectItem value="custom">Custom Report</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Included Metrics</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="metric1" />
                                <Label htmlFor="metric1">Academic Progress</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="metric2" />
                                <Label htmlFor="metric2">Attendance</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="metric3" />
                                <Label htmlFor="metric3">Engagement</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="metric4" />
                                <Label htmlFor="metric4">Resource Usage</Label>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full">Create Report</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Templates</CardTitle>
                        <CardDescription>
                          Pre-configured report templates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Term Progress Summary</h4>
                                  <p className="text-sm text-muted-foreground">Comprehensive overview of student progress for the term</p>
                                </div>
                                <Button variant="outline" size="sm">Use</Button>
                              </div>
                            </div>
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Parent-Teacher Conference</h4>
                                  <p className="text-sm text-muted-foreground">Student-specific report for parent meetings</p>
                                </div>
                                <Button variant="outline" size="sm">Use</Button>
                              </div>
                            </div>
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Curriculum Coverage</h4>
                                  <p className="text-sm text-muted-foreground">Analysis of curriculum coverage and gaps</p>
                                </div>
                                <Button variant="outline" size="sm">Use</Button>
                              </div>
                            </div>
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Resource Effectiveness</h4>
                                  <p className="text-sm text-muted-foreground">Analysis of resource impact on learning outcomes</p>
                                </div>
                                <Button variant="outline" size="sm">Use</Button>
                              </div>
                            </div>
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Intervention Impact</h4>
                                  <p className="text-sm text-muted-foreground">Effectiveness of interventions on student progress</p>
                                </div>
                                <Button variant="outline" size="sm">Use</Button>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
