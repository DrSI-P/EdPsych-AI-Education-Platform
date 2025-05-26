'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, Settings, Share2, 
  Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, 
  Award, TrendingUp, CheckCircle, FileText, 
  BarChart as BarChartIcon, Edit, Trash2, ArrowUp, ArrowDown,
  Target, User, UserPlus, Heart, MessageSquare, School, GraduationCap,
  FileQuestion, BookMarked, Laptop, Tablet, Smartphone, Printer, Database, Search,
  Library, Book, Video, Music, Image, File, FilePlus, FileText2, FileCheck, Move,
  Grid, List, Table, Layout, Columns, PlusCircle, MinusCircle, Copy, Scissors, Type,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Link, Image as ImageIcon,
  FileImage, Palette, PenTool, Droplet, Aperture, Figma, Crop, Maximize, Minimize,
  RotateCcw, RotateCw, Shuffle, DivideCircle, Percent, Hash, DollarSign, PoundSign,
  ChevronsUp, ChevronsDown, ArrowUpRight, ArrowDownRight, CornerRightDown, CornerRightUp,
  ChevronRight, ChevronLeft, X, Check, Menu, MoreHorizontal, MoreVertical, ExternalLink,
  Minus
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
const DraggableComponent = ({ component }: { component: any }): React.ReactNode => {
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
const ReportCanvas = ({ items, setItems, onEditItem, onRemoveItem, onMoveItem, onDuplicateItem }: {
  items[];
  setItems: (items[]) => void;
  onEditItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onDuplicateItem: (id: string) => void;
}): React.ReactNode => {
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
const ReportItem = ({ 
  item, 
  index, 
  onEdit, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onDuplicate, 
  canMoveUp, 
  canMoveDown 
}: {
  item: any;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}): React.ReactNode => {
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
const ChartPreview = ({ chartType }: { chartType: string }): React.ReactNode => {
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
const TablePreview = ({ dataType }: { dataType: string }): React.ReactNode => {
  const data = sampleTableData[dataType as keyof typeof sampleTableData] || sampleTableData.students;

  return (
    <div className="p-4 bg-white rounded-md overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            {data.headers.map((header: string, index: number) => (
              <th key={`header-${index}`} className="border px-4 py-2 text-left text-sm font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.slice(0, 3).map((row: string[], rowIndex: number) => (
            <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? "bg-white" : "bg-muted/50"}>
              {row.map((cell: string, cellIndex: number) => (
                <td key={`cell-${rowIndex}-${cellIndex}`} className="border px-4 py-2 text-sm">
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
const MetricPreview = (): React.ReactNode => {
  const randomMetric = sampleMetricsData[Math.floor(Math.random() * sampleMetricsData.length)];
  const MetricIcon = randomMetric.icon;
  
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
          <MetricIcon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

// Component categories for the sidebar
const componentCategories = [
  { id: 'charts', name: 'Charts', icon: BarChart2, components: chartComponents },
  { id: 'tables', name: 'Tables', icon: Table, components: tableComponents },
  { id: 'text', name: 'Text', icon: Type, components: textComponents },
  { id: 'metrics', name: 'Metrics', icon: Activity, components: metricComponents },
  { id: 'images', name: 'Images', icon: ImageIcon, components: imageComponents },
];

// Main component
export default function CustomReportBuilder() {
  const [activeTab, setActiveTab] = useState('builder');
  const [activeCategory, setActiveCategory] = useState('charts');
  const [reportItems, setReportItems] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('Custom Analytics Report');
  const [reportDescription, setReportDescription] = useState('A comprehensive overview of key educational metrics and trends');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemContent, setEditingItemContent] = useState('');
  
  // Handle editing an item
  const handleEditItem = (id: string) => {
    const item = reportItems.find(item => item.id === id);
    if (item) {
      setEditingItemId(id);
      setEditingItemContent(item.content || '');
    }
  };
  
  // Save edited item
  const handleSaveEdit = () => {
    if (!editingItemId) return;
    
    setReportItems(prevItems => 
      prevItems.map(item => 
        item.id === editingItemId 
          ? { ...item, content: editingItemContent } 
          : item
      )
    );
    
    setEditingItemId(null);
    setEditingItemContent('');
  };
  
  // Remove an item
  const handleRemoveItem = (id: string) => {
    setReportItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Move an item
  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= reportItems.length) return;
    
    const newItems = [...reportItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    
    setReportItems(newItems);
  };
  
  // Duplicate an item
  const handleDuplicateItem = (id: string) => {
    const itemToDuplicate = reportItems.find(item => item.id === id);
    if (!itemToDuplicate) return;
    
    const duplicatedItem = {
      ...itemToDuplicate,
      id: `${itemToDuplicate.id.split('-')[0]}-${uuidv4()}`,
    };
    
    setReportItems(prevItems => [...prevItems, duplicatedItem]);
  };
  
  // Export report
  const handleExportReport = () => {
    // In a real implementation, this would generate a PDF or other format
    console.log('Exporting report:', { title: reportTitle, description: reportDescription, items: reportItems });
    alert('Report exported successfully!');
  };
  
  // Share report
  const handleShareReport = () => {
    // In a real implementation, this would open sharing options
    console.log('Sharing report:', { title: reportTitle, description: reportDescription, items: reportItems });
    alert('Report sharing options would appear here.');
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Custom Report Builder</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Create tailored analytics reports with drag-and-drop simplicity
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="builder" className="flex items-center">
              <Layout className="mr-2 h-4 w-4" />
              Report Builder
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Component Sidebar */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Components
                  </CardTitle>
                  <CardDescription>
                    Drag and drop components to build your report
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid grid-cols-5 w-full">
                      {componentCategories.map(category => (
                        <TabsTrigger 
                          key={category.id} 
                          value={category.id}
                          className="p-2"
                          title={category.name}
                        >
                          <category.icon className="h-4 w-4" />
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {componentCategories.map(category => (
                      <TabsContent key={category.id} value={category.id} className="pt-4">
                        <div className="space-y-2">
                          {category.components.map(component => (
                            <DraggableComponent key={component.id} component={component} />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Report Canvas */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Report Canvas
                  </CardTitle>
                  <CardDescription>
                    Design your report by adding and arranging components
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                  <Button variant="outline" onClick={() => setReportItems([])}>
                    Clear Canvas
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab('preview')}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button onClick={handleExportReport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Item Edit Dialog */}
            {editingItemId && (
              <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium mb-4">Edit Content</h3>
                  <Textarea 
                    value={editingItemContent}
                    onChange={(e) => setEditingItemContent(e.target.value)}
                    className="min-h-[200px] mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingItemId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{reportTitle}</CardTitle>
                    <CardDescription>{reportDescription}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleShareReport}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportReport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" onClick={() => setActiveTab('builder')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reportItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold">No Report Content</h3>
                    <p className="mt-2 text-muted-foreground">
                      Add components to your report using the Report Builder tab.
                    </p>
                    <Button className="mt-6" onClick={() => setActiveTab('builder')}>
                      Build Your Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reportItems.map((item) => (
                      <div key={item.id} className="border rounded-md overflow-hidden">
                        {item.type === ItemTypes.CHART && (
                          <ChartPreview chartType={item.chartType} />
                        )}
                        {item.type === ItemTypes.TABLE && (
                          <TablePreview dataType={item.dataType} />
                        )}
                        {item.type === ItemTypes.TEXT && (
                          <div className="p-4">
                            <p>{item.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
                          </div>
                        )}
                        {item.type === ItemTypes.HEADING && (
                          <div className="p-4">
                            <h3 className="text-xl font-bold">{item.content || "Section Heading"}</h3>
                          </div>
                        )}
                        {item.type === ItemTypes.METRIC && (
                          <MetricPreview />
                        )}
                        {item.type === ItemTypes.IMAGE && (
                          <div className="p-4 flex items-center justify-center">
                            <div className="h-40 w-full bg-muted flex items-center justify-center rounded-md">
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                              <span className="ml-2 text-sm text-muted-foreground">Image Placeholder</span>
                            </div>
                          </div>
                        )}
                        {item.type === ItemTypes.DIVIDER && (
                          <div className="p-4">
                            <div className="h-px w-full bg-muted-foreground/20" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Report Settings
                </CardTitle>
                <CardDescription>
                  Configure your report details and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input 
                    id="report-title" 
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter report title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-description">Report Description</Label>
                  <Textarea 
                    id="report-description" 
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Enter report description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Report Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer bg-primary/5">
                      <div className="h-4 w-4 rounded-full bg-primary" />
                      <span className="text-sm">Default</span>
                    </div>
                    <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                      <span className="text-sm">Blue</span>
                    </div>
                    <div className="border rounded-md p-2 flex items-center space-x-2 cursor-pointer">
                      <div className="h-4 w-4 rounded-full bg-green-500" />
                      <span className="text-sm">Green</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Page Size</Label>
                  <Select defaultValue="a4">
                    <SelectTrigger>
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-date" defaultChecked />
                      <Label htmlFor="include-date">Include generation date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-page-numbers" defaultChecked />
                      <Label htmlFor="include-page-numbers">Include page numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-logo" defaultChecked />
                      <Label htmlFor="include-logo">Include school logo</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setReportTitle('Custom Analytics Report');
                  setReportDescription('A comprehensive overview of key educational metrics and trends');
                }}>
                  Reset to Default
                </Button>
                <Button onClick={() => setActiveTab('builder')}>
                  Apply Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
}
