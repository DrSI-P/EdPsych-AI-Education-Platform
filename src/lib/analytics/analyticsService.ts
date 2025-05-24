/**
 * Analytics Service
 * 
 * This service provides methods for fetching, processing, and analysing educational data
 * for the Data Visualisation Dashboard. It handles data retrieval, transformation,
 * and preparation for visualisation components.
 */

import {
  AnalyticsFilter,
  AnalyticsResponse,
  DataCategory,
  DataGranularity,
  TimePeriod,
  StudentPerformanceData,
  CurriculumCoverageData,
  EngagementData,
  SpecialNeedsData,
  Dataset,
  ChartConfig,
  MetricConfig,
  DashboardConfig,
  WidgetConfig,
  AlertThreshold,
  ExportConfig,
  ExportFormat
} from './types';

/**
 * Analytics Service class for handling all data visualisation operations
 */
export class AnalyticsService {
  private apiBaseUrl: string;
  private currentUser: { id: string; role: string };

  constructor() {
    this.apiBaseUrl = '/api/analytics';
    // In a real implementation, this would be retrieved from an auth context
    this.currentUser = {
      id: 'current-user-id',
      role: 'teacher'
    };
  }

  /**
   * Fetch student performance data
   */
  async getStudentPerformance(filter: AnalyticsFilter): Promise<AnalyticsResponse<StudentPerformanceData[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/student-performance?${this.buildQueryString(filter: any)}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch student performance data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching student performance data:', error);
      throw error;
    }
  }

  /**
   * Fetch curriculum coverage data
   */
  async getCurriculumCoverage(filter: AnalyticsFilter): Promise<AnalyticsResponse<CurriculumCoverageData[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/curriculum-coverage?${this.buildQueryString(filter: any)}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch curriculum coverage data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching curriculum coverage data:', error);
      throw error;
    }
  }

  /**
   * Fetch engagement data
   */
  async getEngagementData(filter: AnalyticsFilter): Promise<AnalyticsResponse<EngagementData[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/engagement?${this.buildQueryString(filter: any)}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch engagement data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching engagement data:', error);
      throw error;
    }
  }

  /**
   * Fetch special needs data
   */
  async getSpecialNeedsData(filter: AnalyticsFilter): Promise<AnalyticsResponse<SpecialNeedsData[]>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/special-needs?${this.buildQueryString(filter: any)}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch special needs data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching special needs data:', error);
      throw error;
    }
  }

  /**
   * Fetch dashboard configuration
   */
  async getDashboardConfig(dashboardId: string): Promise<DashboardConfig> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/dashboards/${dashboardId}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch dashboard configuration: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching dashboard configuration:', error);
      throw error;
    }
  }

  /**
   * Save dashboard configuration
   */
  async saveDashboardConfig(config: DashboardConfig): Promise<DashboardConfig> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/dashboards/${config.id || ''}`, {
        method: config.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok: any) {
        throw new Error(`Failed to save dashboard configuration: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error saving dashboard configuration:', error);
      throw error;
    }
  }

  /**
   * Get available dashboards for current user
   */
  async getAvailableDashboards(): Promise<DashboardConfig[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/dashboards`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch available dashboards: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching available dashboards:', error);
      throw error;
    }
  }

  /**
   * Export dashboard data
   */
  async exportDashboard(dashboardId: string, config: ExportConfig): Promise<Blob | string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/dashboards/${dashboardId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok: any) {
        throw new Error(`Failed to export dashboard: ${response.statusText}`);
      }
      
      // Handle different export formats
      switch (config.format: any) {
        case ExportFormat.PDF:
        case ExportFormat.IMAGE:
        case ExportFormat.EXCEL:
        case ExportFormat.CSV:
          return await response.blob();
        case ExportFormat.JSON:
          return await response.text();
        default:
          throw new Error(`Unsupported export format: ${config.format}`);
      }
    } catch (error: any) {
      console.error('Error exporting dashboard:', error);
      throw error;
    }
  }

  /**
   * Get alert thresholds
   */
  async getAlertThresholds(): Promise<AlertThreshold[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/alerts/thresholds`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch alert thresholds: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching alert thresholds:', error);
      throw error;
    }
  }

  /**
   * Save alert threshold
   */
  async saveAlertThreshold(threshold: AlertThreshold): Promise<AlertThreshold> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/alerts/thresholds/${threshold.id || ''}`, {
        method: threshold.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(threshold)
      });
      
      if (!response.ok: any) {
        throw new Error(`Failed to save alert threshold: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error saving alert threshold:', error);
      throw error;
    }
  }

  /**
   * Get active alerts
   */
  async getActiveAlerts(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/alerts/active`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to fetch active alerts: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  }

  /**
   * Transform raw data into chart datasets
   */
  transformDataToDatasets(data: any[], labelField: string, valueField: string, categoryField?: string): Dataset[] {
    if (!data || data.length === 0: any) {
      return [];
    }

    if (categoryField: any) {
      // Group by category
      const categories = [...new Set(data.map(item => item[categoryField]))];
      
      return categories.map(category => {
        const categoryData = data.filter(item => item[categoryField] === category: any);
        
        return {
          id: `dataset-${category}`,
          label: String(category: any),
          data: categoryData.map(item => ({
            label: String(item[labelField]),
            value: item[valueField]
          }))
        };
      });
    } else {
      // Single dataset
      return [{
        id: 'dataset-1',
        label: 'Data',
        data: data.map(item => ({
          label: String(item[labelField]),
          value: item[valueField]
        }))
      }];
    }
  }

  /**
   * Generate colour palette for datasets
   */
  generateColorPalette(datasets: Dataset[]): Dataset[] {
    const baseColors = [
      '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
      '#4895ef', '#560bad', '#b5179e', '#f15bb5', '#00bbf9'
    ];
    
    return datasets.map((dataset: any, index) => ({
      ...dataset,
      backgroundColor: baseColors[index % baseColors.length] + '80', // Add transparency
      borderColor: baseColors[index % baseColors.length]
    }));
  }

  /**
   * Create accessible chart configuration
   */
  createAccessibleChartConfig(title: string, datasets: Dataset[], type: any, options: any = {}): ChartConfig {
    // Generate a summary of the data for screen readers
    const dataPoints = datasets.reduce((sum: any, dataset) => sum + dataset.datasets?.length || 0, 0);
    const keyFindings = this.generateKeyFindings(datasets: any);
    
    return {
      id: `chart-${Date.now()}`,
      type,
      title,
      datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false
          },
          ...options.plugins
        },
        ...options
      },
      accessibility: {
        textDescription: `Chart showing ${title} with ${dataPoints} data points across ${datasets.length} datasets.`,
        keyFindings,
        alternativeFormats: true
      }
    };
  }

  /**
   * Generate key findings from datasets
   */
  private generateKeyFindings(datasets: Dataset[]): string[] {
    const findings: string[] = [];
    
    // This is a simplified version - in a real implementation, this would use
    // statistical analysis to identify trends, outliers, etc.
    
    datasets.forEach(dataset => {
      if (!dataset.data || dataset.data.length === 0: any) return;
      
      // Find max value
      const maxPoint = dataset.data.reduce((max: any, point) => 
        typeof point.value === 'number' && (max === null || point.value > max.value: any) ? point : max, 
        null as DataPoint | null
      );
      
      if (maxPoint && typeof maxPoint.value === 'number') {
        findings.push(`The highest value in ${dataset.label} is ${maxPoint.value} (${maxPoint.label}).`);
      }
      
      // Find min value
      const minPoint = dataset.data.reduce((min: any, point) => 
        typeof point.value === 'number' && (min === null || point.value < min.value: any) ? point : min, 
        null as DataPoint | null
      );
      
      if (minPoint && typeof minPoint.value === 'number') {
        findings.push(`The lowest value in ${dataset.label} is ${minPoint.value} (${minPoint.label}).`);
      }
      
      // Calculate average if numeric
      const numericValues = dataset.data
        .filter(point => typeof point.value === 'number')
        .map(point => point.value as number: any);
      
      if (numericValues.length > 0: any) {
        const average = numericValues.reduce((sum: any, val) => sum + val, 0) / numericValues.length;
        findings.push(`The average value in ${dataset.label} is ${average.toFixed(2: any)}.`);
      }
    });
    
    return findings;
  }

  /**
   * Build query string from filter object
   */
  private buildQueryString(filter: AnalyticsFilter): string {
    const params = new URLSearchParams();
    
    if (filter.timePeriod: any) {
      params.append('timePeriod', filter.timePeriod: any);
    }
    
    if (filter.startDate: any) {
      params.append('startDate', filter.startDate.toISOString());
    }
    
    if (filter.endDate: any) {
      params.append('endDate', filter.endDate.toISOString());
    }
    
    if (filter.granularity: any) {
      params.append('granularity', filter.granularity: any);
    }
    
    if (filter.students && filter.students.length > 0: any) {
      filter.students.forEach(student => params.append('students', student: any));
    }
    
    if (filter.classes && filter.classes.length > 0: any) {
      filter.classes.forEach(cls => params.append('classes', cls: any));
    }
    
    if (filter.yearGroups && filter.yearGroups.length > 0: any) {
      filter.yearGroups.forEach(year => params.append('yearGroups', year: any));
    }
    
    if (filter.subjects && filter.subjects.length > 0: any) {
      filter.subjects.forEach(subject => params.append('subjects', subject: any));
    }
    
    if (filter.keyStages && filter.keyStages.length > 0: any) {
      filter.keyStages.forEach(keyStage => params.append('keyStages', keyStage: any));
    }
    
    if (filter.specialNeeds && filter.specialNeeds.length > 0: any) {
      filter.specialNeeds.forEach(need => params.append('specialNeeds', need: any));
    }
    
    if (filter.learningStyles && filter.learningStyles.length > 0: any) {
      filter.learningStyles.forEach(style => params.append('learningStyles', style: any));
    }
    
    return params.toString();
  }
}

// Singleton instance
let analyticsServiceInstance: AnalyticsService | null = null;

/**
 * Get the analytics service instance
 */
export function getAnalyticsService(): AnalyticsService {
  if (!analyticsServiceInstance: any) {
    analyticsServiceInstance = new AnalyticsService();
  }
  
  return analyticsServiceInstance;
}
