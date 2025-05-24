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
  items: any[];
  setItems: (items: any[]) => void;
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

// Main custom report builder component
export default function CustomReportBuilder(): React.ReactNode {
  const [reportItems, setReportItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("charts");
  const [reportName, setReportName] = useState<string>("New Custom Report");
  const [reportDescription, setReportDescription] = useState<string>("Created on " + new Date().toLocaleDateString());

  // Handle editing an item
  const handleEditItem = (id: string) => {
    // Implementation would go here
    console.log("Edit item:", id);
  };

  // Handle removing an item
  const handleRemoveItem = (id: string) => {
    setReportItems(reportItems.filter(item => item.id !== id));
  };

  // Handle moving an item
  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= reportItems.length) return;
    
    const newItems = [...reportItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    
    setReportItems(newItems);
  };

  // Handle duplicating an item
  const handleDuplicateItem = (id: string) => {
    const itemToDuplicate = reportItems.find(item => item.id === id);
    if (!itemToDuplicate) return;
    
    const duplicatedItem = {
      ...itemToDuplicate,
      id: `${itemToDuplicate.id.split('-')[0]}-${uuidv4()}`
    };
    
    setReportItems([...reportItems, duplicatedItem]);
  };

  // Handle saving the report
  const handleSaveReport = () => {
    // Implementation would go here
    console.log("Save report:", { name: reportName, description: reportDescription, items: reportItems });
  };

  // Handle exporting the report
  const handleExportReport = () => {
    // Implementation would go here
    console.log("Export report");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-centre">
            <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={handleSaveReport}>
                Save Report
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Create custom reports by dragging and dropping components onto the canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with components */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Components</CardTitle>
              <CardDescription>
                Drag and drop these components onto the report canvas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="charts" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="tables">Tables</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="p-4 space-y-2">
                  {chartComponents.map((component) => (
                    <DraggableComponent key={component.id} component={component} />
                  ))}
                </TabsContent>
                <TabsContent value="tables" className="p-4 space-y-2">
                  {tableComponents.map((component) => (
                    <DraggableComponent key={component.id} component={component} />
                  ))}
                </TabsContent>
                <TabsContent value="other" className="p-4 space-y-2">
                  {[...textComponents, ...metricComponents, ...imageComponents].map((component) => (
                    <DraggableComponent key={component.id} component={component} />
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" size="sm" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
            </CardFooter>
          </Card>

          {/* Main report canvas */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-1">
                  <div className="flex items-centre space-x-2">
                    <Input
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="text-xl font-semibold h-auto py-1 px-2"
                    />
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Add a description for your report"
                    className="resize-none text-sm text-muted-foreground"
                  />
                </div>
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
              <CardFooter className="border-t flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {reportItems.length} {reportItems.length === 1 ? 'component' : 'components'}
                </div>
                <Button variant="outline" size="sm">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
