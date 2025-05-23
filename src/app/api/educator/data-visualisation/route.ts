import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema for data request
const dataRequestSchema = z.object({
  dataType: z.enum([
    "student_progress", 
    "attendance", 
    "behaviour", 
    "resource_usage", 
    "parent_engagement",
    "time_allocation",
    "learning_styles",
    "intervention_effectiveness",
    "custom"
  ]),
  timeRange: z.object({
    from: z.string(),
    to: z.string(),
  }),
  filters: z.object({
    studentGroup: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    yearGroups: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
  }).optional(),
  aggregation: z.enum(["day", "week", "month", "term", "year"]).optional(),
  customQuery: z.string().optional(),
});

// Define type for chart settings to avoid 'any'
interface ChartSettings {
  [key: string]: string | number | boolean | string[] | number[] | null;
}

// Define type for filters to avoid 'any'
interface DashboardFilters {
  [key: string]: string | number | boolean | object | null;
}

// Schema for dashboard configuration
const dashboardConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isDefault: z.boolean().default(false),
  layout: z.array(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
      chartType: z.string(),
      dataSource: z.string(),
      title: z.string(),
      settings: z.record(z.string(), z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.array(z.number()),
        z.null()
      ])).optional(),
    })
  ),
  filters: z.record(z.string(), z.any()).optional(),
  theme: z.string().optional(),
});

// Define interface for request body
interface RequestBody {
  action: string;
  config?: unknown;
  configId?: string;
  dataType?: string;
  timeRange?: {
    from: string;
    to: string;
  };
  filters?: unknown;
  aggregation?: string;
}

// Define interface for session
interface UserSession {
  user: {
    id: string;
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 }
      );
    }
    
    const body = await req.json() as RequestBody;
    const { action } = body;
    
    switch (action) {
      case "get_data":
        return handleGetData(body, session as UserSession);
      case "save_dashboard_config":
        return handleSaveDashboardConfig(body, session as UserSession);
      case "get_dashboard_config":
        return handleGetDashboardConfig(body, session as UserSession);
      case "delete_dashboard_config":
        return handleDeleteDashboardConfig(body, session as UserSession);
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error("Error in data visualisation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleGetData(body: RequestBody, session: UserSession): Promise<NextResponse> {
  try {
    const { dataType, timeRange, filters, aggregation } = 
      dataRequestSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Query the database for the requested data type
    // 2. Apply filters and time range constraints
    // 3. Perform appropriate aggregation
    // 4. Return the formatted data
    
    // For now, we'll return mock data based on the requested type
    let mockData: Array<{
      name: string;
      [key: string]: string | number;
    }> = [];
    
    switch (dataType) {
      case "student_progress":
        mockData = [
          { name: 'Week 1', maths: 65, english: 70, science: 60 },
          { name: 'Week 2', maths: 68, english: 72, science: 62 },
          { name: 'Week 3', maths: 75, english: 71, science: 65 },
          { name: 'Week 4', maths: 78, english: 74, science: 70 },
          { name: 'Week 5', maths: 82, english: 76, science: 73 },
          { name: 'Week 6', maths: 85, english: 80, science: 75 },
        ];
        break;
      case "attendance":
        mockData = [
          { name: 'Monday', present: 92, absent: 5, late: 3 },
          { name: 'Tuesday', present: 94, absent: 4, late: 2 },
          { name: 'Wednesday', present: 90, absent: 7, late: 3 },
          { name: 'Thursday', present: 88, absent: 8, late: 4 },
          { name: 'Friday', present: 85, absent: 10, late: 5 },
        ];
        break;
      case "behaviour":
        mockData = [
          { name: 'Week 1', positive: 24, concern: 8 },
          { name: 'Week 2', positive: 28, concern: 6 },
          { name: 'Week 3', positive: 32, concern: 5 },
          { name: 'Week 4', positive: 35, concern: 4 },
          { name: 'Week 5', positive: 38, concern: 3 },
          { name: 'Week 6', positive: 42, concern: 2 },
        ];
        break;
      case "resource_usage":
        mockData = [
          { name: 'Lesson Plans', value: 35 },
          { name: 'Worksheets', value: 25 },
          { name: 'Videos', value: 20 },
          { name: 'Interactive', value: 15 },
          { name: 'Assessments', value: 5 },
        ];
        break;
      case "parent_engagement":
        mockData = [
          { name: 'High', value: 35, color: '#4ade80' },
          { name: 'Medium', value: 45, color: '#facc15' },
          { name: 'Low', value: 20, color: '#f87171' },
        ];
        break;
      case "time_allocation":
        mockData = [
          { name: 'Teaching', value: 45 },
          { name: 'Planning', value: 20 },
          { name: 'Assessment', value: 15 },
          { name: 'Meetings', value: 10 },
          { name: 'Admin', value: 10 },
        ];
        break;
      case "learning_styles":
        mockData = [
          { name: 'Visual', students: 35 },
          { name: 'Auditory', students: 25 },
          { name: 'Reading/Writing', students: 20 },
          { name: 'Kinaesthetic', students: 20 },
        ];
        break;
      case "intervention_effectiveness":
        mockData = [
          { name: 'Reading Support', before: 65, after: 78 },
          { name: 'Maths Tutoring', before: 60, after: 75 },
          { name: 'Behaviour Plan', before: 55, after: 70 },
          { name: 'Attendance Plan', before: 70, after: 85 },
          { name: 'SEN Support', before: 62, after: 72 },
        ];
        break;
      default:
        mockData = [];
    }
    
    return NextResponse.json({
      success: true,
      data: mockData,
      metadata: {
        dataType,
        timeRange,
        filters: filters || {},
        aggregation: aggregation || "week",
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

async function handleSaveDashboardConfig(body: RequestBody, session: UserSession): Promise<NextResponse> {
  try {
    const { config } = body;
    const validatedConfig = dashboardConfigSchema.parse(config);
    
    // In a real implementation, this would:
    // 1. Save the dashboard configuration to the database
    // 2. If isDefault is true, update other configurations to not be default
    // 3. Associate the configuration with the user
    
    // For now, we'll simulate success
    const configId = `config_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: "Dashboard configuration saved successfully",
      configId,
      config: {
        id: configId,
        ...validatedConfig,
        createdAt: new Date().toISOString(),
        createdBy: session.user.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    throw error;
  }
}

async function handleGetDashboardConfig(body: RequestBody, session: UserSession): Promise<NextResponse> {
  const { configId } = body;
  
  // In a real implementation, this would:
  // 1. Query the database for the specified dashboard configuration
  // 2. Verify the user has access to this configuration
  // 3. Return the configuration
  
  // For now, we'll return mock configurations
  const mockConfigs = [
    {
      id: "default",
      name: "Default Dashboard",
      isDefault: true,
      layout: [
        {
          id: "chart1",
          x: 0,
          y: 0,
          w: 6,
          h: 4,
          chartType: "line",
          dataSource: "student_progress",
          title: "Student Progress Trends",
        },
        {
          id: "chart2",
          x: 6,
          y: 0,
          w: 6,
          h: 4,
          chartType: "bar",
          dataSource: "attendance",
          title: "Attendance Patterns",
        },
        {
          id: "chart3",
          x: 0,
          y: 4,
          w: 4,
          h: 4,
          chartType: "area",
          dataSource: "behaviour",
          title: "Behaviour Incidents",
        },
        {
          id: "chart4",
          x: 4,
          y: 4,
          w: 4,
          h: 4,
          chartType: "pie",
          dataSource: "resource_usage",
          title: "Resource Usage",
        },
        {
          id: "chart5",
          x: 8,
          y: 4,
          w: 4,
          h: 4,
          chartType: "pie",
          dataSource: "parent_engagement",
          title: "Parent Engagement",
        },
      ],
      filters: {
        timeRange: {
          from: "2025-04-17",
          to: "2025-05-17",
        },
        studentGroup: "all",
      },
      theme: "light",
      createdAt: "2025-01-01T00:00:00Z",
      createdBy: "system",
    },
    {
      id: "academic",
      name: "Academic Focus",
      isDefault: false,
      layout: [
        {
          id: "chart1",
          x: 0,
          y: 0,
          w: 12,
          h: 4,
          chartType: "bar",
          dataSource: "learning_styles",
          title: "Learning Styles Distribution",
        },
        {
          id: "chart2",
          x: 0,
          y: 4,
          w: 12,
          h: 4,
          chartType: "bar",
          dataSource: "intervention_effectiveness",
          title: "Intervention Effectiveness",
        },
      ],
      filters: {
        timeRange: {
          from: "2025-04-17",
          to: "2025-05-17",
        },
        studentGroup: "all",
      },
      theme: "light",
      createdAt: "2025-01-02T00:00:00Z",
      createdBy: "system",
    },
  ];
  
  if (configId) {
    const config = mockConfigs.find(c => c.id === configId);
    
    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      config,
    });
  } else {
    return NextResponse.json({
      success: true,
      configs: mockConfigs,
    });
  }
}

async function handleDeleteDashboardConfig(body: RequestBody, session: UserSession): Promise<NextResponse> {
  const { configId } = body;
  
  // In a real implementation, this would:
  // 1. Verify the user has permission to delete this configuration
  // 2. Delete the configuration from the database
  // 3. If it was the default, potentially set another as default
  
  // For now, we'll simulate success
  return NextResponse.json({
    success: true,
    message: "Dashboard configuration deleted successfully",
    configId,
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 }
      );
    }
    
    // Handle GET requests for dashboard configurations
    const url = new URL(req.url);
    const configId = url.searchParams.get("configId");
    
    return handleGetDashboardConfig({ configId, action: "get_dashboard_config" }, session as UserSession);
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error("Error in data visualisation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
