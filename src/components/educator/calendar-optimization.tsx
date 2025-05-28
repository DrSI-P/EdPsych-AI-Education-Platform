// TODO: Fix array index in keys warnings by using unique identifiers
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  BookOpen, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  BarChart4, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  Copy,
  RefreshCw,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useAIService } from '@/lib/ai/ai-service';

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Activity types with their colors and icons
const activityTypes = {
  teaching: { 
    label: 'Teaching', 
    color: '#4f46e5', 
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Classroom instruction and direct student engagement'
  },
  preparation: { 
    label: 'Preparation', 
    color: '#8b5cf6', 
    icon: <FileText className="h-4 w-4" />,
    description: 'Lesson planning and material preparation'
  },
  administrative: { 
    label: 'Administrative', 
    color: '#ec4899', 
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Paperwork, documentation, and administrative tasks'
  },
  meeting: { 
    label: 'Meeting', 
    color: '#f59e0b', 
    icon: <Users className="h-4 w-4" />,
    description: 'Staff meetings, parent conferences, and collaborative sessions'
  },
  professional: { 
    label: 'Professional Development', 
    color: '#10b981', 
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'Training, workshops, and professional growth activities'
  }
};

// Priority levels with their colors
const priorityLevels = {
  high: { label: 'High', color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#10b981' }
};

// Sample activities for demonstration
const sampleActivities = [
  {
    id: '1',
    title: 'Year 5 Mathematics',
    start: moment().hour(9).minute(0).toDate(),
    end: moment().hour(10).minute(0).toDate(),
    type: 'teaching',
    priority: 'high',
    location: 'Room 101',
    description: 'Fractions and decimals lesson',
    recurring: false,
    participants: ['All Year 5 students']
  },
  {
    id: '2',
    title: 'Lesson Planning',
    start: moment().hour(11).minute(0).toDate(),
    end: moment().hour(12).minute(0).toDate(),
    type: 'preparation',
    priority: 'medium',
    location: 'Staff Room',
    description: 'Prepare next week\'s science lessons',
    recurring: false,
    participants: []
  },
  {
    id: '3',
    title: 'Staff Meeting',
    start: moment().hour(15).minute(30).toDate(),
    end: moment().hour(16).minute(30).toDate(),
    type: 'meeting',
    priority: 'medium',
    location: 'Conference Room',
    description: 'Weekly staff catch-up and planning',
    recurring: true,
    participants: ['All teaching staff']
  },
  {
    id: '4',
    title: 'Progress Reports',
    start: moment().add(1, 'days').hour(13).minute(0).toDate(),
    end: moment().add(1, 'days').hour(15).minute(0).toDate(),
    type: 'administrative',
    priority: 'high',
    location: 'Office',
    description: 'Complete end-of-term progress reports',
    recurring: false,
    participants: []
  },
  {
    id: '5',
    title: 'Inclusive Teaching Workshop',
    start: moment().add(2, 'days').hour(9).minute(0).toDate(),
    end: moment().add(2, 'days').hour(12).minute(0).toDate(),
    type: 'professional',
    priority: 'medium',
    location: 'Training Center',
    description: 'Professional development on inclusive teaching strategies',
    recurring: false,
    participants: ['All teaching staff']
  }
];

interface CalendarOptimizationProps {
  className?: string;
}

export function CalendarOptimization({ className = '' }: CalendarOptimizationProps): React.ReactNode {
  const { toast } = useToast();
  const aiService = useAIService();
  
  // State for activities
  const [activities, setActivities] = useState<any[]>(sampleActivities);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  
  // State for new/edited activity
  const [activityForm, setActivityForm] = useState({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    type: 'teaching',
    priority: 'medium',
    location: '',
    description: '',
    recurring: false,
    participants: [] as string[]
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    types: Object.keys(activityTypes),
    priorities: Object.keys(priorityLevels),
    showPast: false
  });
  
  // State for optimization
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationFocus, setOptimizationFocus] = useState('balance');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  
  // State for analytics
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  
  // Calendar view state
  const [calendarView, setCalendarView] = useState('week');
// Apply filters to activities
  const filteredActivities = activities.filter(activity => {
    // Filter by type
    if (!filters.types.includes(activity.type)) return false;
    
    // Filter by priority
    if (!filters.priorities.includes(activity.priority)) return false;
    
    // Filter past events if not showing past
    if (!filters.showPast && new Date(activity.end) < new Date()) return false;
    
    return true;
  });
  
  // Handle activity selection
  const handleSelectActivity = (event: any) => {
    setSelectedActivity(event);
  };
  
  // Handle adding new activity slot
  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    setActivityForm({
      id: '',
      title: '',
      start,
      end,
      type: 'teaching',
      priority: 'medium',
      location: '',
      description: '',
      recurring: false,
      participants: []
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setActivityForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setActivityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle filter changes
  const handleFilterTypeToggle = (type: string) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return {
          ...prev,
          types: prev.types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          types: [...prev.types, type]
        };
      }
    });
  };
  
  const handleFilterPriorityToggle = (priority: string) => {
    setFilters(prev => {
      if (prev.priorities.includes(priority)) {
        return {
          ...prev,
          priorities: prev.priorities.filter(p => p !== priority)
        };
      } else {
        return {
          ...prev,
          priorities: [...prev.priorities, priority]
        };
      }
    });
  };
  
  const handleTogglePastEvents = () => {
    setFilters(prev => ({
      ...prev,
      showPast: !prev.showPast
    }));
  };
// Save new activity
  const handleSaveActivity = () => {
    if (!activityForm.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for the activity.",
        variant: "destructive"
      });
      return;
    }
    
    const newActivity = {
      ...activityForm,
      id: activityForm.id || `activity-${Date.now()}`
    };
    
    if (activityForm.id) {
      // Update existing activity
      setActivities(prev => prev.map(activity => 
        activity.id === activityForm.id ? newActivity : activity
      ));
      
      toast({
        title: "Activity updated",
        description: `"${newActivity.title}" has been updated.`
      });
    } else {
      // Add new activity
      setActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Activity added",
        description: `"${newActivity.title}" has been added to your calendar.`
      });
    }
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  // Edit activity
  const handleEditActivity = () => {
    if (!selectedActivity) return;
    
    setActivityForm({
      id: selectedActivity.id,
      title: selectedActivity.title,
      start: selectedActivity.start,
      end: selectedActivity.end,
      type: selectedActivity.type,
      priority: selectedActivity.priority,
      location: selectedActivity.location || '',
      description: selectedActivity.description || '',
      recurring: selectedActivity.recurring || false,
      participants: selectedActivity.participants || []
    });
    
    setIsEditDialogOpen(true);
    setSelectedActivity(null);
  };
  
  // Delete activity
  const handleDeleteActivity = () => {
    if (!selectedActivity) return;
    
    setActivities(prev => prev.filter(activity => activity.id !== selectedActivity.id));
    
    toast({
      title: "Activity deleted",
      description: `"${selectedActivity.title}" has been removed from your calendar.`
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedActivity(null);
  };
  
  // Duplicate activity
  const handleDuplicateActivity = () => {
    if (!selectedActivity) return;
    
    const duplicatedActivity = {
      ...selectedActivity,
      id: `activity-${Date.now()}`,
      title: `${selectedActivity.title} (Copy)`,
      start: new Date(selectedActivity.start.getTime() + 24 * 60 * 60 * 1000), // Next day
      end: new Date(selectedActivity.end.getTime() + 24 * 60 * 60 * 1000) // Next day
    };
    
    setActivities(prev => [...prev, duplicatedActivity]);
    
    toast({
      title: "Activity duplicated",
      description: `"${duplicatedActivity.title}" has been added to your calendar.`
    });
    
    setSelectedActivity(null);
  };
// Optimize calendar
  const handleOptimizeCalendar = async () => {
    setIsOptimizing(true);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the optimization process
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate optimization suggestions based on focus
      const suggestions = generateOptimizationSuggestions(optimizationFocus);
      setOptimizationSuggestions(suggestions);
      
      toast({
        title: "Calendar optimized",
        description: `${suggestions.length} suggestions generated based on your preferences.`
      });
    } catch (error) {
      /* eslint-disable-next-line no-console */ console.error('Error optimizing calendar:', error);
      toast({
        title: "Optimization failed",
        description: "There was a problem optimizing your calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Generate mock optimization suggestions
  const generateOptimizationSuggestions = (focus: string) => {
    const suggestions = [];
    
    if (focus === 'balance' || focus === 'efficiency') {
      suggestions.push({
        id: 'sug-1',
        type: 'reschedule',
        title: 'Reschedule administrative tasks',
        description: 'Group administrative tasks together on Thursday afternoon to reduce context switching.',
        impact: 'Could save approximately 45 minutes per week',
        activities: ['4']
      });
    }
    
    if (focus === 'balance' || focus === 'well-being') {
      suggestions.push({
        id: 'sug-2',
        type: 'break',
        title: 'Add recovery breaks',
        description: 'Schedule 15-minute breaks after intensive teaching sessions to maintain energy levels.',
        impact: 'May improve teaching quality and reduce end-of-day fatigue',
        activities: ['1']
      });
    }
    
    if (focus === 'efficiency' || focus === 'teaching') {
      suggestions.push({
        id: 'sug-3',
        type: 'batch',
        title: 'Batch lesson planning',
        description: 'Consolidate lesson planning into a single 2-hour block rather than multiple shorter sessions.',
        impact: 'Could increase planning efficiency by approximately 20%',
        activities: ['2']
      });
    }
    
    return suggestions;
  };
  
  // Apply optimization suggestion
  const handleApplySuggestion = (suggestion: any) => {
    // In a real implementation, this would update the activities based on the suggestion
    // For now, we'll just show a toast
    
    toast({
      title: "Suggestion applied",
      description: `"${suggestion.title}" has been applied to your calendar.`
    });
    
    // Remove the suggestion from the list
    setOptimizationSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };
  
  // Load analytics data
  const handleLoadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the analytics data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock analytics data
      const data = {
        timeDistribution: {
          teaching: 40,
          preparation: 20,
          administrative: 15,
          meeting: 15,
          professional: 10
        },
        weeklyTrends: {
          monday: { teaching: 8, preparation: 2, administrative: 1, meeting: 1, professional: 0 },
          tuesday: { teaching: 7, preparation: 3, administrative: 2, meeting: 0, professional: 0 },
          wednesday: { teaching: 6, preparation: 2, administrative: 1, meeting: 2, professional: 1 },
          thursday: { teaching: 8, preparation: 1, administrative: 2, meeting: 1, professional: 0 },
          friday: { teaching: 6, preparation: 2, administrative: 1, meeting: 1, professional: 2 }
        },
        insights: [
          'You spend 15% more time on administrative tasks than the average educator',
          'Your teaching time is well-distributed throughout the week',
          'Consider allocating more time for preparation on Thursdays',
          'Your professional development activities are concentrated on Fridays'
        ]
      };
      
      setAnalyticsData(data);
    } catch (error) {
      /* eslint-disable-next-line no-console */ console.error('Error loading analytics:', error);
      toast({
        title: "Analytics failed",
        description: "There was a problem loading your calendar analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Event styling
  const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
    const style = {
      backgroundColor: activityTypes[event.type]?.color || '#7c3aed', // Default to purple
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${className}`}>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-primary" />
            Educator Calendar Optimization
          </CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsAnalyticsDialogOpen(true)}>
              <BarChart4 className="mr-2 h-4 w-4" /> View Analytics
            </Button>
            <Button onClick={() => setIsOptimizeDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Optimize Calendar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <div style={{ height: 600 }}>
                <Calendar
                  localizer={localizer}
                  events={filteredActivities}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  selectable
                  onSelectEvent={handleSelectActivity}
                  onSelectSlot={handleSelectSlot}
                  eventPropGetter={eventStyleGetter}
                  view={calendarView as any}
                  onView={(view) => setCalendarView(view)}
                  // components={{
                  //   toolbar: CustomToolbar, // TODO: Implement custom toolbar for better view control
                  // }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Activity Types</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(activityTypes).map(([key, value]) => (
                    <Button 
                      key={key} 
                      variant={filters.types.includes(key) ? "default" : "outline"}
                      onClick={() => handleFilterTypeToggle(key)}
                      className="flex items-center justify-start space-x-2"
                    >
                      {value.icon}
                      <span>{value.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Priority Levels</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(priorityLevels).map(([key, value]) => (
                    <Button 
                      key={key} 
                      variant={filters.priorities.includes(key) ? "default" : "outline"}
                      onClick={() => handleFilterPriorityToggle(key)}
                      style={filters.priorities.includes(key) ? { backgroundColor: value.color, color: 'white' } : {}}
                    >
                      {value.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Button variant="outline" onClick={handleTogglePastEvents}>
                  {filters.showPast ? "Hide Past Events" : "Show Past Events"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-2">
              <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Activity
              </Button>
              {selectedActivity && (
                <>
                  <Button onClick={handleEditActivity} variant="outline" className="w-full md:w-auto">
                    <Edit className="mr-2 h-4 w-4" /> Edit Selected
                  </Button>
                  <Button onClick={handleDuplicateActivity} variant="outline" className="w-full md:w-auto">
                    <Copy className="mr-2 h-4 w-4" /> Duplicate Selected
                  </Button>
                  <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" className="w-full md:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                  </Button>
                </>
              )}
            </TabsContent>
            <TabsContent value="settings">
              {/* TODO: Add calendar settings like default view, working hours, etc. */}
              <p className="text-muted-foreground">Calendar settings will be available here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={isAddDialogOpen ? setIsAddDialogOpen : setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{activityForm.id ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
            <DialogDescription>
              {activityForm.id ? 'Update the details of your activity.' : 'Fill in the details for your new activity.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" value={activityForm.title} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">Start Time</Label>
              <Input id="start" name="start" type="datetime-local" value={moment(activityForm.start).format('YYYY-MM-DDTHH:mm')} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">End Time</Label>
              <Input id="end" name="end" type="datetime-local" value={moment(activityForm.end).format('YYYY-MM-DDTHH:mm')} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select name="type" value={activityForm.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select name="priority" value={activityForm.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLevels).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" name="location" value={activityForm.location} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={activityForm.description} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurring" className="text-right">Recurring</Label>
              <Input id="recurring" name="recurring" type="checkbox" checked={activityForm.recurring} onChange={handleCheckboxChange} className="col-span-3" />
            </div>
            {/* TODO: Add participants input */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => isAddDialogOpen ? setIsAddDialogOpen(false) : setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveActivity}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {selectedActivity && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Activity</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedActivity.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive" onClick={handleDeleteActivity}>Delete Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Optimize Calendar Dialog */}
      <Dialog open={isOptimizeDialogOpen} onOpenChange={setIsOptimizeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" /> Optimize Calendar
            </DialogTitle>
            <DialogDescription>
              Let AI help you optimize your schedule based on your priorities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="optimizationFocus">Optimization Focus</Label>
              <Select value={optimizationFocus} onValueChange={setOptimizationFocus}>
                <SelectTrigger id="optimizationFocus">
                  <SelectValue placeholder="Select focus area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Work-Life Balance</SelectItem>
                  <SelectItem value="efficiency">Task Efficiency</SelectItem>
                  <SelectItem value="teaching">Teaching Impact</SelectItem>
                  <SelectItem value="well-being">Educator Well-being</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {optimizationSuggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Optimization Suggestions:</h4>
                {optimizationSuggestions.map((suggestion, index) => (
                  <Card key={suggestion.id} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {suggestion.title}
                        <Button size="sm" variant="ghost" onClick={() => handleApplySuggestion(suggestion)}>
                          Apply
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <p>{suggestion.description}</p>
                      <p className="mt-1 italic">Impact: {suggestion.impact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptimizeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleOptimizeCalendar} disabled={isOptimizing}>
              {isOptimizing ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {isOptimizing ? 'Optimizing...' : 'Generate Suggestions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BarChart4 className="mr-2 h-5 w-5" /> Calendar Analytics
            </DialogTitle>
            <DialogDescription>
              Insights into your time distribution and weekly trends.
            </DialogDescription>
          </DialogHeader>
          {isLoadingAnalytics ? (
            <div className="flex justify-center items-center h-40">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : analyticsData ? (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-medium mb-2">Time Distribution</h4>
                <div className="space-y-1">
                  {Object.entries(analyticsData.timeDistribution).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center w-3/4">
                        <div 
                          className="h-4 rounded-l-md"
                          style={{ 
                            width: `${value}%`, 
                            backgroundColor: activityTypes[key]?.color || '#7c3aed'
                          }}
                        ></div>
                        <span className="text-xs ml-2">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Weekly Trends (Teaching Hours)</h4>
                {/* TODO: Implement a more visual chart here (e.g., bar chart) */}
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  {Object.entries(analyticsData.weeklyTrends).map(([day, data]: [string, any]) => (
                    <div key={day} className="p-2 bg-muted/50 rounded-md">
                      <p className="font-medium capitalize">{day.substring(0,3)}</p>
                      <p>{data.teaching}h</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI Insights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {analyticsData.insights.map((insight: string, index: number) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No analytics data available.</p>
              <Button onClick={handleLoadAnalytics} className="mt-2">
                Load Analytics
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnalyticsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

