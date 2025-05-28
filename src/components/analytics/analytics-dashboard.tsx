'use client';

import React, { useState, useEffect } from 'react';
import { 
  DashboardConfig, 
  WidgetConfig,
  AnalyticsFilter,
  TimePeriod,
  DataGranularity,
  ExportFormat
} from '@/lib/analytics/types';
import { getAnalyticsService } from '@/lib/analytics/analyticsService';
import DashboardWidget from './dashboard-widget';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Unused import
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Download, 
  Filter, 
  Save, 
  Share2, 
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface AnalyticsDashboardProps {
  initialDashboardId?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  initialDashboardId
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<DashboardConfig | null>(null);
  const [filter, setFilter] = useState<AnalyticsFilter>({
    timePeriod: TimePeriod.MONTH,
    granularity: DataGranularity.DAILY
  });
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: undefined,
    to: undefined
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const { toast } = useToast();
  const analyticsService = getAnalyticsService();
  
  // Load available dashboards
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        setIsLoading(true);
        const availableDashboards = await analyticsService.getAvailableDashboards();
        setDashboards(availableDashboards);
        
        // Load initial dashboard
        if (initialDashboardId) {
          const dashboard = availableDashboards.find(d => d.id === initialDashboardId);
          if (dashboard) {
            setCurrentDashboard(dashboard);
          } else if (availableDashboards.length > 0) {
            setCurrentDashboard(availableDashboards[0]);
          }
        } else if (availableDashboards.length > 0) {
          setCurrentDashboard(availableDashboards[0]);
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */ console.error('Failed to load dashboards:', error);
        toast({
          variant: "destructive",
          title: "Failed to load dashboards",
          description: "There was a problem loading your dashboards. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboards();
  }, [initialDashboardId]);
  
  // Handle dashboard change
  const handleDashboardChange = async (dashboardId: string) => {
    try {
      setIsLoading(true);
      const dashboard = await analyticsService.getDashboardConfig(dashboardId);
      setCurrentDashboard(dashboard);
      
      // Update filter with dashboard defaults
      if (dashboard.defaultTimePeriod || dashboard.defaultGranularity) {
        setFilter(prev => ({
          ...prev,
          timePeriod: dashboard.defaultTimePeriod || prev.timePeriod,
          granularity: dashboard.defaultGranularity || prev.granularity
        }));
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */ console.error('Failed to load dashboard:', error);
      toast({
        variant: "destructive",
        title: "Failed to load dashboard",
        description: "There was a problem loading the selected dashboard. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    setFilter(prev => ({
      ...prev,
      timePeriod: period
    }));
    
    // Reset custom date range if not custom
    if (period !== TimePeriod.CUSTOM) {
      setDateRange({
        from: undefined,
        to: undefined
      });
    }
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    
    if (range.from && range.to) {
      setFilter(prev => ({
        ...prev,
        timePeriod: TimePeriod.CUSTOM,
        startDate: range.from,
        endDate: range.to
      }));
    }
  };
  
  // Handle widget refresh
  const handleWidgetRefresh = async (widgetId: string) => {
    // In a real implementation, this would refresh the specific widget data
    toast({
      title: "Refreshing widget",
      description: "Widget data is being updated."
    });
  };
  
  // Handle dashboard export
  const handleExport = async (format: ExportFormat) => {
    if (!currentDashboard) return;
    
    try {
      setIsExporting(true);
      
      const exportConfig = {
        format,
        includeFilters: true,
        includeSummary: true,
        fileName: `${currentDashboard.title.replace(/\s+/g, '_')}_${format}`
      };
      
      const result = await analyticsService.exportDashboard(currentDashboard.id, exportConfig);
      
      // Handle the exported data based on format
      if (format === ExportFormat.PDF || format === ExportFormat.EXCEL || format === ExportFormat.CSV || format === ExportFormat.IMAGE) {
        // Create a download link for blob data
        const blob = result as Blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportConfig.fileName}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === ExportFormat.JSON) {
        // Create a download link for JSON data
        const jsonString = result as string;
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportConfig.fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Export successful",
        description: `Dashboard exported as ${format}.`
      });
    } catch (error) {
      /* eslint-disable-next-line no-console */ console.error('Failed to export dashboard:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was a problem exporting the dashboard. Please try again."
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Render time period selector
  const renderTimePeriodSelector = () => {
    return (
      <div className="flex items-centre space-x-2">
        <Select
          value={filter.timePeriod}
          onValueChange={(value) => handleTimePeriodChange(value as TimePeriod)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimePeriod.DAY}>Today</SelectItem>
            <SelectItem value={TimePeriod.WEEK}>This Week</SelectItem>
            <SelectItem value={TimePeriod.MONTH}>This Month</SelectItem>
            <SelectItem value={TimePeriod.TERM}>This Term</SelectItem>
            <SelectItem value={TimePeriod.ACADEMIC_YEAR}>This Academic Year</SelectItem>
            <SelectItem value={TimePeriod.CUSTOM}>Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {filter.timePeriod === TimePeriod.CUSTOM && (
          <div className="flex items-centre space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                      </>
                    ) : (
                      format(dateRange.from, "PPP")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    );
  };
  
  // Render granularity selector
  const renderGranularitySelector = () => {
    return (
      <div className="flex items-centre space-x-2">
        <Label htmlFor="granularity" className="mr-2">Granularity:</Label>
        <Select
          value={filter.granularity}
          onValueChange={(value) => setFilter(prev => ({ ...prev, granularity: value as DataGranularity }))}
        >
          <SelectTrigger id="granularity" className="w-[150px]">
            <SelectValue placeholder="Select granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DataGranularity.HOURLY}>Hourly</SelectItem>
            <SelectItem value={DataGranularity.DAILY}>Daily</SelectItem>
            <SelectItem value={DataGranularity.WEEKLY}>Weekly</SelectItem>
            <SelectItem value={DataGranularity.MONTHLY}>Monthly</SelectItem>
            <SelectItem value={DataGranularity.TERMLY}>Termly</SelectItem>
            <SelectItem value={DataGranularity.YEARLY}>Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  // Render filter panel
  const renderFilterPanel = () => {
    return (
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Options</h4>
            
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects</Label>
              <Select>
                <SelectTrigger id="subjects">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="maths">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keyStages">Key Stages</Label>
              <Select>
                <SelectTrigger id="keyStages">
                  <SelectValue placeholder="All Key Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early_years">Early Years</SelectItem>
                  <SelectItem value="ks1">Key Stage 1</SelectItem>
                  <SelectItem value="ks2">Key Stage 2</SelectItem>
                  <SelectItem value="ks3">Key Stage 3</SelectItem>
                  <SelectItem value="ks4">Key Stage 4</SelectItem>
                  <SelectItem value="ks5">Key Stage 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearGroups">Year Groups</Label>
              <Select>
                <SelectTrigger id="yearGroups">
                  <SelectValue placeholder="All Year Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="year1">Year 1</SelectItem>
                  <SelectItem value="year2">Year 2</SelectItem>
                  <SelectItem value="year3">Year 3</SelectItem>
                  <SelectItem value="year4">Year 4</SelectItem>
                  <SelectItem value="year5">Year 5</SelectItem>
                  <SelectItem value="year6">Year 6</SelectItem>
                  <SelectItem value="year7">Year 7</SelectItem>
                  <SelectItem value="year8">Year 8</SelectItem>
                  <SelectItem value="year9">Year 9</SelectItem>
                  <SelectItem value="year10">Year 10</SelectItem>
                  <SelectItem value="year11">Year 11</SelectItem>
                  <SelectItem value="year12">Year 12</SelectItem>
                  <SelectItem value="year13">Year 13</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Special Educational Needs</Label>
              <Select>
                <SelectTrigger id="specialNeeds">
                  <SelectValue placeholder="All SEN Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dyslexia">Dyslexia</SelectItem>
                  <SelectItem value="dyspraxia">Dyspraxia</SelectItem>
                  <SelectItem value="asd">ASD</SelectItem>
                  <SelectItem value="adhd">ADHD</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="ebsna">EBSNA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Filters applied",
                  description: "Dashboard data has been updated with your filters."
                });
                setIsFilterOpen(false);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  
  // Render dashboard selector
  const renderDashboardSelector = () => {
    return (
      <div className="flex items-centre space-x-2">
        <Select
          value={currentDashboard?.id}
          onValueChange={handleDashboardChange}
          disabled={isLoading || dashboards.length === 0}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select dashboard" />
          </SelectTrigger>
          <SelectContent>
            {dashboards.map((dashboard) => (
              <SelectItem key={dashboard.id} value={dashboard.id}>
                {dashboard.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  
  // Render export options
  const renderExportOptions = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={isExporting || !currentDashboard}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              'Export'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleExport(ExportFormat.PDF)}
            >
              PDF Document
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleExport(ExportFormat.EXCEL)}
            >
              Excel Spreadsheet
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleExport(ExportFormat.CSV)}
            >
              CSV File
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleExport(ExportFormat.IMAGE)}
            >
              Image (PNG)
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleExport(ExportFormat.JSON)}
            >
              JSON Data
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  
  // Render dashboard content
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-centre justify-centre h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      );
    }
    
    if (!currentDashboard) {
      return (
        <div className="flex flex-col items-centre justify-centre h-64">
          <p className="text-muted-foreground mb-4">No dashboard selected or available.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-4 gap-4">
        {currentDashboard.widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            widget={widget}
            isLoading={isLoading}
            onRefresh={() => handleWidgetRefresh(widget.id)}
            onEdit={() => {
              toast({
                title: "Edit widget",
                description: "Widget editing functionality will be implemented in a future update."
              });
            }}
            onDelete={() => {
              toast({
                title: "Delete widget",
                description: "Widget deletion functionality will be implemented in a future update."
              });
            }}
            onExport={() => {
              toast({
                title: "Export widget",
                description: "Widget export functionality will be implemented in a future update."
              });
            }}
            onMaximize={() => {
              // Handle widget maximization
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="analytics-dashboard space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-centre">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          
          <div className="flex items-centre space-x-2">
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {renderExportOptions()}
          </div>
        </div>
        
        <div className="flex justify-between items-centre">
          {renderDashboardSelector()}
          
          <div className="flex items-centre space-x-4">
            {renderTimePeriodSelector()}
            {renderGranularitySelector()}
            {renderFilterPanel()}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="student-performance">Student Performance</TabsTrigger>
          <TabsTrigger value="curriculum-coverage">Curriculum Coverage</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="special-needs">Special Needs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          {renderDashboardContent()}
        </TabsContent>
        
        <TabsContent value="student-performance" className="pt-4">
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Student Performance view will be available in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="curriculum-coverage" className="pt-4">
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Curriculum Coverage view will be available in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="pt-4">
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Engagement view will be available in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="special-needs" className="pt-4">
          <div className="flex items-centre justify-centre h-64 border border-dashed rounded-md">
            <p className="text-muted-foreground">Special Needs view will be available in a future update.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
