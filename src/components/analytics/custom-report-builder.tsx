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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  FileText, 
  Filter, 
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Save,
  Calendar,
  Clock,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  LayoutGrid,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Sliders,
  Share2,
  Mail,
  Printer,
  FileDown
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const mockReportTemplates = [
  { id: 1, name: 'Student Progress Summary', category: 'Student', description: 'Comprehensive overview of student progress across subjects', frequency: 'Term' },
  { id: 2, name: 'Class Performance Analysis', category: 'Class', description: 'Detailed analysis of class performance with comparisons to previous terms', frequency: 'Term' },
  { id: 3, name: 'Educator Effectiveness Report', category: 'Educator', description: 'Analysis of teaching effectiveness and student outcomes', frequency: 'Term' },
  { id: 4, name: 'Resource Utilization Report', category: 'Resource', description: 'Overview of resource usage and effectiveness', frequency: 'Monthly' },
  { id: 5, name: 'Curriculum Coverage Analysis', category: 'Curriculum', description: 'Analysis of curriculum coverage and learning gaps', frequency: 'Term' },
  { id: 6, name: 'Parent-Teacher Conference Report', category: 'Student', description: 'Personalized student report for parent meetings', frequency: 'As needed' },
  { id: 7, name: 'SEND Progress Tracker', category: 'SEND', description: 'Specialized report for tracking SEND student progress', frequency: 'Monthly' },
  { id: 8, name: 'Intervention Impact Analysis', category: 'Intervention', description: 'Measures the effectiveness of interventions on student progress', frequency: 'Monthly' },
];

const mockDataSources = [
  { id: 'students', name: 'Students', fields: ['id', 'name', 'year', 'class', 'attendance', 'progress'] },
  { id: 'assessments', name: 'Assessments', fields: ['id', 'student_id', 'subject', 'score', 'date', 'type'] },
  { id: 'educators', name: 'Educators', fields: ['id', 'name', 'role', 'subjects', 'effectiveness'] },
  { id: 'curriculum', name: 'Curriculum', fields: ['id', 'subject', 'unit', 'objectives', 'coverage'] },
  { id: 'resources', name: 'Resources', fields: ['id', 'name', 'type', 'subject', 'usage', 'effectiveness'] },
  { id: 'interventions', name: 'Interventions', fields: ['id', 'student_id', 'type', 'start_date', 'end_date', 'impact'] },
  { id: 'attendance', name: 'Attendance', fields: ['id', 'student_id', 'date', 'status', 'reason'] },
  { id: 'behaviour', name: 'Behaviour', fields: ['id', 'student_id', 'date', 'type', 'description', 'action'] },
];

const mockChartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: <BarChart2 className="h-4 w-4" /> },
  { id: 'line', name: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
  { id: 'pie', name: 'Pie Chart', icon: <PieChartIcon className="h-4 w-4" /> },
  { id: 'area', name: 'Area Chart', icon: <Activity className="h-4 w-4" /> },
  { id: 'scatter', name: 'Scatter Plot', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'radar', name: 'Radar Chart', icon: <Activity className="h-4 w-4" /> },
];

const mockSavedReports = [
  { id: 1, name: 'Year 4 Term Progress', category: 'Student', created: '2025-05-10', lastRun: '2025-05-15', schedule: 'Weekly' },
  { id: 2, name: 'Mathematics Department Analysis', category: 'Curriculum', created: '2025-04-22', lastRun: '2025-05-01', schedule: 'Monthly' },
  { id: 3, name: 'SEND Intervention Impact', category: 'Intervention', created: '2025-05-05', lastRun: '2025-05-14', schedule: 'Bi-weekly' },
  { id: 4, name: 'Educator Performance Q2', category: 'Educator', created: '2025-04-15', lastRun: '2025-05-10', schedule: 'Monthly' },
  { id: 5, name: 'Resource Effectiveness', category: 'Resource', created: '2025-03-20', lastRun: '2025-05-01', schedule: 'Monthly' },
];

const mockScheduleOptions = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'biweekly', name: 'Bi-weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'termly', name: 'Termly' },
  { id: 'asneeded', name: 'As needed' },
];

const mockDeliveryOptions = [
  { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4" /> },
  { id: 'download', name: 'Download', icon: <FileDown className="h-4 w-4" /> },
  { id: 'print', name: 'Print', icon: <Printer className="h-4 w-4" /> },
  { id: 'share', name: 'Share Link', icon: <Share2 className="h-4 w-4" /> },
];

const mockFormatOptions = [
  { id: 'pdf', name: 'PDF' },
  { id: 'excel', name: 'Excel' },
  { id: 'word', name: 'Word' },
  { id: 'html', name: 'HTML' },
];

const mockFilterOptions = [
  { id: 'year', name: 'Year Group', values: ['Year 3', 'Year 4', 'Year 5', 'Year 6'] },
  { id: 'subject', name: 'Subject', values: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'] },
  { id: 'term', name: 'Term', values: ['Autumn', 'Spring', 'Summer'] },
  { id: 'progress', name: 'Progress Range', values: ['Below 60%', '60-80%', 'Above 80%'] },
];

const CustomReportBuilder = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [reportSchedule, setReportSchedule] = useState('asneeded');
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [recipients, setRecipients] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // For drag and drop functionality
  const [reportSections, setReportSections] = useState([
    { id: 1, type: 'chart', chartType: 'bar', title: 'Progress Overview', dataSource: 'students', fields: ['progress'] },
    { id: 2, type: 'table', title: 'Detailed Data', dataSource: 'students', fields: ['name', 'year', 'progress'] },
  ]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setReportName(template.name);
    setReportDescription(template.description);
    // In a real implementation, this would load the template configuration
    toast({
      title: "Template Selected",
      description: `${template.name} template has been loaded.`,
    });
  };

  const handleDataSourceChange = (source) => {
    setSelectedDataSource(source);
    setSelectedFields([]);
  };

  const handleFieldToggle = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleAddFilter = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handleAddSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      title: type === 'chart' ? 'New Chart' : 'New Table',
      dataSource: selectedDataSource || 'students',
      fields: [],
      chartType: type === 'chart' ? selectedChartType : null,
    };
    setReportSections([...reportSections, newSection]);
  };

  const handleRemoveSection = (id) => {
    setReportSections(reportSections.filter(section => section.id !== id));
  };

  const handleSaveReport = () => {
    // In a real implementation, this would save the report configuration
    toast({
      title: "Report Saved",
      description: `${reportName} has been saved successfully.`,
    });
  };

  const handleGenerateReport = () => {
    // In a real implementation, this would generate the report
    toast({
      title: "Generating Report",
      description: "Your report is being generated and will be available shortly.",
    });
  };

  const handleScheduleReport = () => {
    // In a real implementation, this would schedule the report
    toast({
      title: "Report Scheduled",
      description: `${reportName} has been scheduled for ${reportSchedule} delivery.`,
    });
  };

  const handleRunSavedReport = (report) => {
    // In a real implementation, this would run the saved report
    toast({
      title: "Running Report",
      description: `${report.name} is being generated and will be available shortly.`,
    });
  };

  const handleDeleteSavedReport = (report) => {
    // In a real implementation, this would delete the saved report
    toast({
      title: "Report Deleted",
      description: `${report.name} has been deleted.`,
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[300px]" />
      <Skeleton className="h-4 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full md:col-span-2" />
      </div>
    </div>
  );

  const renderTemplateSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle>Report Templates</CardTitle>
        <CardDescription>
          Start with a pre-configured template or create a custom report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {mockReportTemplates
                .filter(template => 
                  searchQuery === '' || 
                  template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  template.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(template => (
                  <div 
                    key={template.id}
                    className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="outline">{template.frequency}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Use</Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedTemplate(null);
            setReportName('');
            setReportDescription('');
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Report
        </Button>
      </CardFooter>
    </Card>
  );

  const renderDataSourceSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources</CardTitle>
        <CardDescription>
          Select the primary data source for your report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedDataSource} onValueChange={handleDataSourceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {mockDataSources.map(source => (
                <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedDataSource && (
            <>
              <div>
                <h4 className="font-medium mb-2">Available Fields</h4>
                <div className="space-y-2">
                  {mockDataSources
                    .find(source => source.id === selectedDataSource)
                    ?.fields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`field-${field}`} 
                          checked={selectedFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <Label htmlFor={`field-${field}`}>{field}</Label>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Filters</h4>
                <div className="space-y-2">
                  {mockFilterOptions.map(filter => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-${filter.id}`} 
                        checked={selectedFilters.includes(filter.id)}
                        onCheckedChange={() => 
                          selectedFilters.includes(filter.id) 
                            ? handleRemoveFilter(filter.id) 
                            : handleAddFilter(filter.id)
                        }
                      />
                      <Label htmlFor={`filter-${filter.id}`}>{filter.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedFilters.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.map(filterId => {
                      const filter = mockFilterOptions.find(f => f.id === filterId);
                      return (
                        <Badge key={filterId} variant="secondary" className="flex items-center gap-1">
                          {filter.name}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveFilter(filterId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderVisualizationSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle>Visualizations</CardTitle>
        <CardDescription>
          Choose how to visualize your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Chart Type</h4>
            <div className="grid grid-cols-3 gap-2">
              {mockChartTypes.map(chart => (
                <Button
                  key={chart.id}
                  variant={selectedChartType === chart.id ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 p-2"
                  onClick={() => setSelectedChartType(chart.id)}
                >
                  <div className="mb-1">{chart.icon}</div>
                  <span className="text-xs">{chart.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Report Sections</h4>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddSection('chart')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddSection('table')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Table
                </Button>
              </div>
              
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {reportSections.map((section, index) => (
                  <div 
                    key={section.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        {section.type === 'chart' ? (
                          <BarChart2 className="h-4 w-4" />
                        ) : (
                          <LayoutGrid className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{section.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {section.type === 'chart' ? 'Chart' : 'Table'} - 
                          {mockDataSources.find(ds => ds.id === section.dataSource)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          // In a real implementation, this would open a section editor
                          toast({
                            title: "Edit Section",
                            description: `Editing ${section.title}`,
                          });
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReportPreview = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              Preview how your report will look
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showPreview ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold">{reportName || 'Untitled Report'}</h2>
              <p className="text-muted-foreground">{reportDescription || 'No description provided'}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">
                  {mockDataSources.find(ds => ds.id === selectedDataSource)?.name || 'No data source'}
                </Badge>
                <Badge variant="outline">
                  Generated on {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
            
            {reportSections.map((section, index) => (
              <div key={section.id} className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                {section.type === 'chart' ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {section.chartType === 'bar' && (
                        <BarChart
                          data={[
                            { name: 'Category A', value: 65 },
                            { name: 'Category B', value: 75 },
                            { name: 'Category C', value: 85 },
                            { name: 'Category D', value: 70 },
                            { name: 'Category E', value: 80 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      )}
                      {section.chartType === 'line' && (
                        <LineChart
                          data={[
                            { name: 'Jan', value: 65 },
                            { name: 'Feb', value: 70 },
                            { name: 'Mar', value: 75 },
                            { name: 'Apr', value: 72 },
                            { name: 'May', value: 78 },
                            { name: 'Jun', value: 82 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                      )}
                      {section.chartType === 'pie' && (
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Category A', value: 65 },
                              { name: 'Category B', value: 75 },
                              { name: 'Category C', value: 85 },
                              { name: 'Category D', value: 70 },
                              { name: 'Category E', value: 80 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[0, 1, 2, 3, 4].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      )}
                      {section.chartType === 'area' && (
                        <AreaChart
                          data={[
                            { name: 'Jan', value: 65 },
                            { name: 'Feb', value: 70 },
                            { name: 'Mar', value: 75 },
                            { name: 'Apr', value: 72 },
                            { name: 'May', value: 78 },
                            { name: 'Jun', value: 82 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      )}
                      {section.chartType === 'scatter' && (
                        <ScatterChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="x" name="Score" />
                          <YAxis type="number" dataKey="y" name="Value" />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Legend />
                          <Scatter name="Values" data={[
                            { x: 10, y: 30 },
                            { x: 30, y: 50 },
                            { x: 45, y: 20 },
                            { x: 60, y: 80 },
                            { x: 75, y: 40 },
                            { x: 90, y: 60 },
                          ]} fill="#8884d8" />
                        </ScatterChart>
                      )}
                      {section.chartType === 'radar' && (
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                          { subject: 'Math', A: 120, fullMark: 150 },
                          { subject: 'English', A: 98, fullMark: 150 },
                          { subject: 'Science', A: 86, fullMark: 150 },
                          { subject: 'History', A: 99, fullMark: 150 },
                          { subject: 'Geography', A: 85, fullMark: 150 },
                          { subject: 'Art', A: 65, fullMark: 150 },
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} />
                          <Radar name="Student" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Emma Smith</TableCell>
                          <TableCell>Year 4</TableCell>
                          <TableCell>78%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>James Wilson</TableCell>
                          <TableCell>Year 4</TableCell>
                          <TableCell>65%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sophia Johnson</TableCell>
                          <TableCell>Year 4</TableCell>
                          <TableCell>82%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Noah Williams</TableCell>
                          <TableCell>Year 4</TableCell>
                          <TableCell>70%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Olivia Brown</TableCell>
                          <TableCell>Year 4</TableCell>
                          <TableCell>75%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Preview Hidden</h3>
              <p className="text-muted-foreground">Click "Show Preview" to see how your report will look</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderReportSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Report Settings</CardTitle>
        <CardDescription>
          Configure report details and delivery options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input 
              id="report-name" 
              placeholder="Enter report name" 
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Textarea 
              id="report-description" 
              placeholder="Enter report description" 
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Select value={reportSchedule} onValueChange={setReportSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                {mockScheduleOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mockDeliveryOptions.map(option => (
                <Button
                  key={option.id}
                  variant={deliveryMethod === option.id ? "default" : "outline"}
                  className="flex items-center justify-center"
                  onClick={() => setDeliveryMethod(option.id)}
                >
                  {option.icon}
                  <span className="ml-2">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {deliveryMethod === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Textarea 
                id="recipients" 
                placeholder="Enter email addresses (one per line)" 
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mockFormatOptions.map(option => (
                <Button
                  key={option.id}
                  variant={reportFormat === option.id ? "default" : "outline"}
                  className="flex items-center justify-center"
                  onClick={() => setReportFormat(option.id)}
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSaveReport}>
          <Save className="mr-2 h-4 w-4" />
          Save Report
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleScheduleReport}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const renderSavedReports = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Saved Reports</CardTitle>
            <CardDescription>
              View, run, and manage your saved reports
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSavedReports
                .filter(report => 
                  searchQuery === '' || 
                  report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  report.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(report => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.category}</Badge>
                    </TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>{report.schedule}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRunSavedReport(report)}
                        >
                          Run
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // In a real implementation, this would edit the report
                            setReportName(report.name);
                            setActiveTab('builder');
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSavedReport(report)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderScheduledReports = () => (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Reports</CardTitle>
        <CardDescription>
          View and manage your scheduled reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Year 4 Term Progress</TableCell>
                <TableCell>Weekly</TableCell>
                <TableCell>2025-05-22</TableCell>
                <TableCell>5 recipients</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Pause</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mathematics Department Analysis</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>2025-06-01</TableCell>
                <TableCell>3 recipients</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Pause</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SEND Intervention Impact</TableCell>
                <TableCell>Bi-weekly</TableCell>
                <TableCell>2025-05-28</TableCell>
                <TableCell>4 recipients</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Pause</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Custom Report Builder</h2>
          <p className="text-muted-foreground">
            Create, customize, and schedule reports with powerful visualizations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  {renderTemplateSelector()}
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDataSourceSelector()}
                    {renderVisualizationSelector()}
                  </div>
                  {renderReportSettings()}
                </div>
              </div>
              {renderReportPreview()}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            renderSavedReports()
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            renderScheduledReports()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomReportBuilder;
