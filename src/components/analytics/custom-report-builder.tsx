'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subMonths, subYears } from "date-fns";
import { 
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon, 
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Sliders, 
  BarChart as BarChartIcon, Layers, Save, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  ArrowRight, Target, Eye, EyeOff, Zap, Flag, User, UserPlus, UserCheck, Star,
  Lightbulb, Clipboard, Briefcase, Heart, ThumbsUp, MessageSquare, School, GraduationCap,
  FileQuestion, BookMarked, Laptop, Tablet, Smartphone, Printer, Database, Search,
  Library, Book, Video, Music, Image, File, FilePlus, FileText2, FileCheck, Move,
  Grid, List, Table, Layout, Columns, PlusCircle, MinusCircle, Copy, Scissors, Type,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Link, Image as ImageIcon,
  FileImage, Palette, PenTool, Droplet, Aperture, Figma, Crop, Maximize, Minimize,
  RotateCcw, RotateCw, Shuffle, DivideCircle, Percent, Hash, DollarSign, PoundSign,
  ChevronsUp, ChevronsDown, ArrowUpRight, ArrowDownRight, CornerRightDown, CornerRightUp,
  ChevronRight, ChevronLeft, X, Check, Menu, MoreHorizontal, MoreVertical, ExternalLink
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

// Define item types for drag and drop
const ItemTypes = {
  CHART: 'chart',
  TABLE: 'table',
  TEXT: 'text',
  IMAGE: 'image',
  METRIC: 'metric',
  DIVIDER: 'divider',
  HEADING: 'heading',
};

// Sample data for charts
const sampleChartData = {
  bar: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ],
  line: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ],
  pie: [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ],
};

// Sample data for tables
const sampleTableData = {
  students: {
    headers: ['Student', 'Attendance', 'Progress', 'Attainment', 'Engagement'],
    rows: [
      ['Emily Johnson', '95%', '82%', 'Above Expected', 'High'],
      ['James Smith', '88%', '75%', 'Expected', 'Medium'],
      ['Sophia Williams', '92%', '90%', 'Above Expected', 'High'],
      ['Oliver Brown', '78%', '65%', 'Below Expected', 'Medium'],
      ['Charlotte Jones', '96%', '88%', 'Above Expected', 'High'],
    ],
  },
  subjects: {
    headers: ['Subject', 'Average Score', 'Progress', 'Resources Used', 'Teacher'],
    rows: [
      ['English', '78%', '+12%', '245', 'Ms. Andrews'],
      ['Mathematics', '82%', '+15%', '310', 'Mr. Peterson'],
      ['Science', '85%', '+18%', '280', 'Dr. Reynolds'],
      ['History', '76%', '+8%', '190', 'Mrs. Thompson'],
      ['Geography', '80%', '+10%', '175', 'Mr. Wilson'],
    ],
  },
  resources: {
    headers: ['Resource', 'Usage', 'Effectiveness', 'Cost', 'ROI'],
    rows: [
      ['Digital Textbooks', '420', '85%', '£2,500', '3.2x'],
      ['Interactive Simulations', '175', '92%', '£1,800', '3.8x'],
      ['Educational Videos', '320', '88%', '£2,200', '3.5x'],
      ['Practise Worksheets', '280', '75%', '£1,200', '2.8x'],
      ['Assessment Tools', '210', '90%', '£1,900', '3.6x'],
    ],
  },
};

// Sample metrics data
const sampleMetricsData = [
  { title: 'Average Attendance', value: '92%', change: '+3%', icon: Users },
  { title: 'Student Progress', value: '78%', change: '+12%', icon: TrendingUp },
  { title: 'Resource Usage', value: '5,842', change: '+15%', icon: BookOpen },
  { title: 'Assessment Completion', value: '95%', change: '+5%', icon: CheckCircle },
  { title: 'Teacher Engagement', value: '88%', change: '+7%', icon: Heart },
  { title: 'Parent Participation', value: '65%', change: '+20%', icon: UserPlus },
];

// Available chart components
const chartComponents = [
  { id: 'bar-chart', name: 'Bar Chart', type: ItemTypes.CHART, icon: BarChartIcon, chartType: 'bar' },
  { id: 'line-chart', name: 'Line Chart', type: ItemTypes.CHART, icon: LineChartIcon, chartType: 'line' },
  { id: 'pie-chart', name: 'Pie Chart', type: ItemTypes.CHART, icon: PieChartIcon, chartType: 'pie' },
  { id: 'area-chart', name: 'Area Chart', type: ItemTypes.CHART, icon: Activity, chartType: 'area' },
  { id: 'scatter-chart', name: 'Scatter Plot', type: ItemTypes.CHART, icon: DivideCircle, chartType: 'scatter' },
  { id: 'radar-chart', name: 'Radar Chart', type: ItemTypes.CHART, icon: Target, chartType: 'radar' },
];

// Available table components
const tableComponents = [
  { id: 'student-table', name: 'Student Data Table', type: ItemTypes.TABLE, icon: Users, dataType: 'students' },
  { id: 'subject-table', name: 'Subject Data Table', type: ItemTypes.TABLE, icon: BookOpen, dataType: 'subjects' },
  { id: 'resource-table', name: 'Resource Data Table', type: ItemTypes.TABLE, icon: Database, dataType: 'resources' },
];

// Available text components
const textComponents = [
  { id: 'heading', name: 'Heading', type: ItemTypes.HEADING, icon: Type },
  { id: 'paragraph', name: 'Paragraph', type: ItemTypes.TEXT, icon: AlignLeft },
  { id: 'divider', name: 'Divider', type: ItemTypes.DIVIDER, icon: Minus },
];

// Available metric components
const metricComponents = [
  { id: 'metric-card', name: 'Metric Card', type: ItemTypes.METRIC, icon: Activity },
];

// Available image components
const imageComponents = [
  { id: 'image', name: 'Image', type: ItemTypes.IMAGE, icon: ImageIcon },
];

// All available components
const allComponents = [
  ...chartComponents,
  ...tableComponents,
  ...textComponents,
  ...metricComponents,
  ...imageComponents,
];

// Draggable component for the sidebar
const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: component.type,
    item: { ...component, id: `${component.id}-${uuidv4()}` },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex items-centre space-x-2 rounded-md border p-2 cursor-move",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <component.icon className="h-4 w-4" />
      <span className="text-sm">{component.name}</span>
    </div>
  );
};

// Droppable report canvas
const ReportCanvas = ({ items, setItems, onEditItem, onRemoveItem, onMoveItem, onDuplicateItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.CHART,
      ItemTypes.TABLE,
      ItemTypes.TEXT,
      ItemTypes.IMAGE,
      ItemTypes.METRIC,
      ItemTypes.DIVIDER,
      ItemTypes.HEADING,
    ],
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      
      // Add the new item to the report
      setItems((prevItems) => [...prevItems, { ...item, position: prevItems.length }]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[600px] rounded-lg border-2 border-dashed p-4 transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      )}
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-centre justify-centre space-y-2 text-centre">
          <div className="rounded-full bg-muted p-3">
            <PlusCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Add Report Components</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Drag and drop components from the sidebar to build your custom report.
            Add charts, tables, text, and more to create a comprehensive view.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <ReportItem
              key={item.id}
              item={item}
              index={index}
              onEdit={() => onEditItem(item.id)}
              onRemove={() => onRemoveItem(item.id)}
              onMoveUp={() => onMoveItem(index, index - 1)}
              onMoveDown={() => onMoveItem(index, index + 1)}
              onDuplicate={() => onDuplicateItem(item.id)}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual report item
const ReportItem = ({ item, index, onEdit, onRemove, onMoveUp, onMoveDown, onDuplicate, canMoveUp, canMoveDown }) => {
  const renderContent = () => {
    switch (item.type) {
      case ItemTypes.CHART:
        return <ChartPreview chartType={item.chartType} />;
      case ItemTypes.TABLE:
        return <TablePreview dataType={item.dataType} />;
      case ItemTypes.TEXT:
        return (
          <div className="p-4 bg-white rounded-md">
            <p className="text-sm text-muted-foreground">
              {item.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>
          </div>
        );
      case ItemTypes.HEADING:
        return (
          <div className="p-4 bg-white rounded-md">
            <h3 className="text-xl font-bold">
              {item.content || "Section Heading"}
            </h3>
          </div>
        );
      case ItemTypes.METRIC:
        return <MetricPreview />;
      case ItemTypes.IMAGE:
        return (
          <div className="p-4 bg-white rounded-md flex items-centre justify-centre">
            <div className="h-40 w-full bg-muted flex items-centre justify-centre rounded-md">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Image Placeholder</span>
            </div>
          </div>
        );
      case ItemTypes.DIVIDER:
        return (
          <div className="p-4 bg-white rounded-md">
            <div className="h-px w-full bg-muted-foreground/20" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border shadow-sm">
      <div className="flex items-centre justify-between bg-muted p-2 rounded-t-md">
        <div className="flex items-centre space-x-2">
          <Badge variant="outline" className="text-xs">
            {index + 1}
          </Badge>
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        <div className="flex items-centre space-x-1">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Move Up"
            className={!canMoveUp ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Move Down"
            className={!canMoveDown ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove} title="Remove">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

// Chart preview component
const ChartPreview = ({ chartType }) => {
  return (
    <div className="p-4 bg-white rounded-md">
      <div className="h-60 w-full bg-muted flex flex-col items-centre justify-centre rounded-md">
        {chartType === 'bar' && <BarChartIcon className="h-10 w-10 text-primary" />}
        {chartType === 'line' && <LineChartIcon className="h-10 w-10 text-primary" />}
        {chartType === 'pie' && <PieChartIcon className="h-10 w-10 text-primary" />}
        {chartType === 'area' && <Activity className="h-10 w-10 text-primary" />}
        {chartType === 'scatter' && <DivideCircle className="h-10 w-10 text-primary" />}
        {chartType === 'radar' && <Target className="h-10 w-10 text-primary" />}
        <span className="mt-2 text-sm text-muted-foreground">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart Preview</span>
      </div>
    </div>
  );
};

// Table preview component
const TablePreview = ({ dataType }) => {
  const data = sampleTableData[dataType] || sampleTableData.students;
  
  return (
    <div className="p-4 bg-white rounded-md overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            {data.headers.map((header, index) => (
              <th key={index} className="border px-4 py-2 text-left text-sm font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.slice(0, 3).map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-muted/50"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Metric preview component
const MetricPreview = () => {
  const randomMetric = sampleMetricsData[Math.floor(Math.random() * sampleMetricsData.length)];
  
  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex items-centre justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{randomMetric.title}</p>
          <h4 className="text-2xl font-bold">{randomMetric.value}</h4>
          <p className={cn(
            "text-xs",
            randomMetric.change.startsWith('+') ? "text-green-500" : "text-red-500"
          )}>
            {randomMetric.change} from previous period
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-centre justify-centre">
          <randomMetric.icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

// Item editor modal
const ItemEditorModal = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState({ ...item });
  
  const handleSave = () => {
    onSave(editedItem);
  };
  
  const renderEditor = () => {
    switch (item.type) {
      case ItemTypes.CHART:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                value={editedItem.title || ''}
                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                placeholder="Enter chart title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select
                value={editedItem.chartType}
                onValueChange={(value) => setEditedItem({ ...editedItem, chartType: value })}
              >
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                  <SelectItem value="radar">Radar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-source">Data Source</Label>
              <Select
                value={editedItem.dataSource || 'students'}
                onValueChange={(value) => setEditedItem({ ...editedItem, dataSource: value })}
              >
                <SelectTrigger id="data-source">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Student Data</SelectItem>
                  <SelectItem value="subjects">Subject Data</SelectItem>
                  <SelectItem value="resources">Resource Data</SelectItem>
                  <SelectItem value="assessments">Assessment Data</SelectItem>
                  <SelectItem value="attendance">Attendance Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre space-x-2">
                <Checkbox
                  id="show-legend"
                  checked={editedItem.showLegend !== false}
                  onCheckedChange={(checked) => setEditedItem({ ...editedItem, showLegend: checked })}
                />
                <Label htmlFor="show-legend">Show Legend</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre space-x-2">
                <Checkbox
                  id="show-grid"
                  checked={editedItem.showGrid !== false}
                  onCheckedChange={(checked) => setEditedItem({ ...editedItem, showGrid: checked })}
                />
                <Label htmlFor="show-grid">Show Grid</Label>
              </div>
            </div>
          </div>
        );
      
      case ItemTypes.TABLE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="table-title">Table Title</Label>
              <Input
                id="table-title"
                value={editedItem.title || ''}
                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                placeholder="Enter table title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type</Label>
              <Select
                value={editedItem.dataType}
                onValueChange={(value) => setEditedItem({ ...editedItem, dataType: value })}
              >
                <SelectTrigger id="data-type">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Student Data</SelectItem>
                  <SelectItem value="subjects">Subject Data</SelectItem>
                  <SelectItem value="resources">Resource Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="row-limit">Row Limit</Label>
              <Select
                value={editedItem.rowLimit || '5'}
                onValueChange={(value) => setEditedItem({ ...editedItem, rowLimit: value })}
              >
                <SelectTrigger id="row-limit">
                  <SelectValue placeholder="Select row limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 rows</SelectItem>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="15">15 rows</SelectItem>
                  <SelectItem value="20">20 rows</SelectItem>
                  <SelectItem value="all">All rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre space-x-2">
                <Checkbox
                  id="show-pagination"
                  checked={editedItem.showPagination !== false}
                  onCheckedChange={(checked) => setEditedItem({ ...editedItem, showPagination: checked })}
                />
                <Label htmlFor="show-pagination">Show Pagination</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre space-x-2">
                <Checkbox
                  id="enable-sorting"
                  checked={editedItem.enableSorting !== false}
                  onCheckedChange={(checked) => setEditedItem({ ...editedItem, enableSorting: checked })}
                />
                <Label htmlFor="enable-sorting">Enable Sorting</Label>
              </div>
            </div>
          </div>
        );
      
      case ItemTypes.TEXT:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={editedItem.content || ''}
                onChange={(e) => setEditedItem({ ...editedItem, content: e.target.value })}
                placeholder="Enter text content"
                rows={6}
              />
            </div>
          </div>
        );
      
      case ItemTypes.HEADING:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading-content">Heading Text</Label>
              <Input
                id="heading-content"
                value={editedItem.content || ''}
                onChange={(e) => setEditedItem({ ...editedItem, content: e.target.value })}
                placeholder="Enter heading text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heading-level">Heading Level</Label>
              <Select
                value={editedItem.headingLevel || 'h2'}
                onValueChange={(value) => setEditedItem({ ...editedItem, headingLevel: value })}
              >
                <SelectTrigger id="heading-level">
                  <SelectValue placeholder="Select heading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1 (Largest)</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="h4">Heading 4</SelectItem>
                  <SelectItem value="h5">Heading 5 (Smallest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case ItemTypes.METRIC:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-title">Metric Title</Label>
              <Input
                id="metric-title"
                value={editedItem.title || ''}
                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                placeholder="Enter metric title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric-value">Metric Value</Label>
              <Input
                id="metric-value"
                value={editedItem.value || ''}
                onChange={(e) => setEditedItem({ ...editedItem, value: e.target.value })}
                placeholder="Enter metric value"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric-change">Change Value</Label>
              <Input
                id="metric-change"
                value={editedItem.change || ''}
                onChange={(e) => setEditedItem({ ...editedItem, change: e.target.value })}
                placeholder="e.g. +10%"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric-icon">Icon</Label>
              <Select
                value={editedItem.icon || 'TrendingUp'}
                onValueChange={(value) => setEditedItem({ ...editedItem, icon: value })}
              >
                <SelectTrigger id="metric-icon">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TrendingUp">Trending Up</SelectItem>
                  <SelectItem value="Users">Users</SelectItem>
                  <SelectItem value="BookOpen">Book</SelectItem>
                  <SelectItem value="CheckCircle">Check Circle</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case ItemTypes.IMAGE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-title">Image Title</Label>
              <Input
                id="image-title"
                value={editedItem.title || ''}
                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                placeholder="Enter image title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={editedItem.url || ''}
                onChange={(e) => setEditedItem({ ...editedItem, url: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={editedItem.alt || ''}
                onChange={(e) => setEditedItem({ ...editedItem, alt: e.target.value })}
                placeholder="Enter alt text"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-centre justify-centre bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-centre justify-between">
          <h3 className="text-lg font-medium">Edit {item.name}</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-6">
          {renderEditor()}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Report settings modal
const ReportSettingsModal = ({ settings, onSave, onCancel }) => {
  const [editedSettings, setEditedSettings] = useState({ ...settings });
  
  const handleSave = () => {
    onSave(editedSettings);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-centre justify-centre bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-centre justify-between">
          <h3 className="text-lg font-medium">Report Settings</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-title">Report Title</Label>
            <Input
              id="report-title"
              value={editedSettings.title || ''}
              onChange={(e) => setEditedSettings({ ...editedSettings, title: e.target.value })}
              placeholder="Enter report title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Textarea
              id="report-description"
              value={editedSettings.description || ''}
              onChange={(e) => setEditedSettings({ ...editedSettings, description: e.target.value })}
              placeholder="Enter report description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-author">Author</Label>
            <Input
              id="report-author"
              value={editedSettings.author || ''}
              onChange={(e) => setEditedSettings({ ...editedSettings, author: e.target.value })}
              placeholder="Enter author name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-layout">Layout</Label>
            <Select
              value={editedSettings.layout || 'standard'}
              onValueChange={(value) => setEditedSettings({ ...editedSettings, layout: value })}
            >
              <SelectTrigger id="report-layout">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-theme">Theme</Label>
            <Select
              value={editedSettings.theme || 'default'}
              onValueChange={(value) => setEditedSettings({ ...editedSettings, theme: value })}
            >
              <SelectTrigger id="report-theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-centre space-x-2">
              <Checkbox
                id="include-header"
                checked={editedSettings.includeHeader !== false}
                onCheckedChange={(checked) => setEditedSettings({ ...editedSettings, includeHeader: checked })}
              />
              <Label htmlFor="include-header">Include Header</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-centre space-x-2">
              <Checkbox
                id="include-footer"
                checked={editedSettings.includeFooter !== false}
                onCheckedChange={(checked) => setEditedSettings({ ...editedSettings, includeFooter: checked })}
              />
              <Label htmlFor="include-footer">Include Footer</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-centre space-x-2">
              <Checkbox
                id="include-page-numbers"
                checked={editedSettings.includePageNumbers !== false}
                onCheckedChange={(checked) => setEditedSettings({ ...editedSettings, includePageNumbers: checked })}
              />
              <Label htmlFor="include-page-numbers">Include Page Numbers</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export modal
const ExportModal = ({ onExport, onCancel }) => {
  const [exportSettings, setExportSettings] = useState({
    format: 'pdf',
    quality: 'high',
    includeInteractivity: true,
    orientation: 'portrait',
    paperSize: 'a4',
  });
  
  const handleExport = () => {
    onExport(exportSettings);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-centre justify-centre bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-centre justify-between">
          <h3 className="text-lg font-medium">Export Report</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Format</Label>
            <Select
              value={exportSettings.format}
              onValueChange={(value) => setExportSettings({ ...exportSettings, format: value })}
            >
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="docx">Word Document (DOCX)</SelectItem>
                <SelectItem value="xlsx">Excel Spreadsheet (XLSX)</SelectItem>
                <SelectItem value="html">Web Page (HTML)</SelectItem>
                <SelectItem value="png">Image (PNG)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="export-quality">Quality</Label>
            <Select
              value={exportSettings.quality}
              onValueChange={(value) => setExportSettings({ ...exportSettings, quality: value })}
            >
              <SelectTrigger id="export-quality">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Faster)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="print">Print Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {exportSettings.format === 'pdf' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paper-size">Paper Size</Label>
                <Select
                  value={exportSettings.paperSize}
                  onValueChange={(value) => setExportSettings({ ...exportSettings, paperSize: value })}
                >
                  <SelectTrigger id="paper-size">
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select
                  value={exportSettings.orientation}
                  onValueChange={(value) => setExportSettings({ ...exportSettings, orientation: value })}
                >
                  <SelectTrigger id="orientation">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {(exportSettings.format === 'html' || exportSettings.format === 'pdf') && (
            <div className="space-y-2">
              <div className="flex items-centre space-x-2">
                <Checkbox
                  id="include-interactivity"
                  checked={exportSettings.includeInteractivity}
                  onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeInteractivity: checked })}
                />
                <Label htmlFor="include-interactivity">Include Interactive Elements</Label>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

// Share modal
const ShareModal = ({ onShare, onCancel }) => {
  const [shareSettings, setShareSettings] = useState({
    method: 'link',
    recipients: '',
    message: '',
    expiryDays: '7',
    accessLevel: 'view',
  });
  
  const handleShare = () => {
    onShare(shareSettings);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-centre justify-centre bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-centre justify-between">
          <h3 className="text-lg font-medium">Share Report</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-method">Share Method</Label>
            <Select
              value={shareSettings.method}
              onValueChange={(value) => setShareSettings({ ...shareSettings, method: value })}
            >
              <SelectTrigger id="share-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Shareable Link</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="platform">Platform Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {shareSettings.method !== 'link' && (
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Textarea
                id="recipients"
                value={shareSettings.recipients}
                onChange={(e) => setShareSettings({ ...shareSettings, recipients: e.target.value })}
                placeholder={shareSettings.method === 'email' ? "Enter email addresses (comma separated)" : "Enter usernames (comma separated)"}
                rows={3}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="share-message">Message (Optional)</Label>
            <Textarea
              id="share-message"
              value={shareSettings.message}
              onChange={(e) => setShareSettings({ ...shareSettings, message: e.target.value })}
              placeholder="Add a message to recipients"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry-days">Link Expiry</Label>
            <Select
              value={shareSettings.expiryDays}
              onValueChange={(value) => setShareSettings({ ...shareSettings, expiryDays: value })}
            >
              <SelectTrigger id="expiry-days">
                <SelectValue placeholder="Select expiry period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="never">Never expires</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="access-level">Access Level</Label>
            <Select
              value={shareSettings.accessLevel}
              onValueChange={(value) => setShareSettings({ ...shareSettings, accessLevel: value })}
            >
              <SelectTrigger id="access-level">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="comment">View and comment</SelectItem>
                <SelectItem value="edit">View and edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleShare}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
export function CustomReportBuilder() {
  // State for report items
  const [reportItems, setReportItems] = useState([]);
  
  // State for report settings
  const [reportSettings, setReportSettings] = useState({
    title: 'Custom Analytics Report',
    description: 'A comprehensive analysis of school performance metrics',
    author: '',
    layout: 'standard',
    theme: 'default',
    includeHeader: true,
    includeFooter: true,
    includePageNumbers: true,
  });
  
  // State for modals
  const [editingItem, setEditingItem] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('charts');
  
  // Handle edit item
  const handleEditItem = (itemId) => {
    const item = reportItems.find((item) => item.id === itemId);
    if (item) {
      setEditingItem(item);
    }
  };
  
  // Handle save edited item
  const handleSaveEditedItem = (editedItem) => {
    setReportItems((prevItems) =>
      prevItems.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
    setEditingItem(null);
  };
  
  // Handle remove item
  const handleRemoveItem = (itemId) => {
    setReportItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  
  // Handle move item
  const handleMoveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= reportItems.length) return;
    
    setReportItems((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  };
  
  // Handle duplicate item
  const handleDuplicateItem = (itemId) => {
    const item = reportItems.find((item) => item.id === itemId);
    if (item) {
      const duplicatedItem = {
        ...item,
        id: `${item.id.split('-')[0]}-${uuidv4()}`,
      };
      setReportItems((prevItems) => [...prevItems, duplicatedItem]);
    }
  };
  
  // Handle save settings
  const handleSaveSettings = (newSettings) => {
    setReportSettings(newSettings);
    setShowSettingsModal(false);
  };
  
  // Handle export
  const handleExport = (exportSettings) => {
    // In a real implementation, this would trigger the export process
    console.log('Exporting report with settings:', exportSettings);
    
    // Simulate export process
    setTimeout(() => {
      alert(`Report exported as ${exportSettings.format.toUpperCase()}`);
      setShowExportModal(false);
    }, 1500);
  };
  
  // Handle share
  const handleShare = (shareSettings) => {
    // In a real implementation, this would trigger the sharing process
    console.log('Sharing report with settings:', shareSettings);
    
    // Simulate sharing process
    setTimeout(() => {
      if (shareSettings.method === 'link') {
        alert('Shareable link created: https://edpsych-connect.com/reports/shared/abc123');
      } else if (shareSettings.method === 'email') {
        alert(`Report shared via email to ${shareSettings.recipients}`);
      } else {
        alert(`Report shared with platform users: ${shareSettings.recipients}`);
      }
      setShowShareModal(false);
    }, 1500);
  };
  
  // Render component tabs
  const renderComponentTabs = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="tables">Tables</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="charts" className="mt-4 space-y-2">
        {chartComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </TabsContent>
      
      <TabsContent value="tables" className="mt-4 space-y-2">
        {tableComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </TabsContent>
      
      <TabsContent value="metrics" className="mt-4 space-y-2">
        {metricComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </TabsContent>
      
      <TabsContent value="text" className="mt-4 space-y-2">
        {textComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </TabsContent>
      
      <TabsContent value="images" className="mt-4 space-y-2">
        {imageComponents.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </TabsContent>
      
      <TabsContent value="templates" className="mt-4 space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="rounded-md border p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-centre space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <span className="font-medium">Student Progress Report</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              A comprehensive template for tracking individual student progress across subjects.
            </p>
          </div>
          
          <div className="rounded-md border p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-centre space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <span className="font-medium">Resource Effectiveness</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Analyse the impact and usage patterns of teaching resources.
            </p>
          </div>
          
          <div className="rounded-md border p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-centre space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <span className="font-medium">Attendance Dashboard</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Track attendance patterns and identify trends across classes and time periods.
            </p>
          </div>
          
          <div className="rounded-md border p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-centre space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <span className="font-medium">Assessment Analysis</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Detailed breakdown of assessment results with comparative analysis.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
            <p className="text-muted-foreground">
              Create tailored reports with drag-and-drop simplicity
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
            <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" onClick={() => setShowShareModal(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={() => setShowExportModal(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>
                  Drag and drop to add to your report
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {renderComponentTabs()}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-muted-foreground">{reportSettings.title}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Components</p>
                  <p className="text-sm text-muted-foreground">{reportItems.length} items</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Layout</p>
                  <p className="text-sm text-muted-foreground capitalize">{reportSettings.layout}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground capitalize">{reportSettings.theme}</p>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => setShowSettingsModal(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Settings
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Canvas */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{reportSettings.title}</CardTitle>
                <CardDescription>
                  {reportSettings.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ReportCanvas
                  items={reportItems}
                  setItems={setReportItems}
                  onEditItem={handleEditItem}
                  onRemoveItem={handleRemoveItem}
                  onMoveItem={handleMoveItem}
                  onDuplicateItem={handleDuplicateItem}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {reportItems.length} components
                </p>
                <Button variant="outline" size="sm" onClick={() => setReportItems([])}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Modals */}
        {editingItem && (
          <ItemEditorModal
            item={editingItem}
            onSave={handleSaveEditedItem}
            onCancel={() => setEditingItem(null)}
          />
        )}
        
        {showSettingsModal && (
          <ReportSettingsModal
            settings={reportSettings}
            onSave={handleSaveSettings}
            onCancel={() => setShowSettingsModal(false)}
          />
        )}
        
        {showExportModal && (
          <ExportModal
            onExport={handleExport}
            onCancel={() => setShowExportModal(false)}
          />
        )}
        
        {showShareModal && (
          <ShareModal
            onShare={handleShare}
            onCancel={() => setShowShareModal(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}
