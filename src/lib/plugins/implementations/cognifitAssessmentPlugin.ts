/**
 * CogniFit Assessment Tool Plugin Implementation
 * 
 * This file implements the CogniFit assessment tool plugin for the EdPsych-AI-Education-Platform.
 * It integrates with CogniFit's API to provide cognitive assessment capabilities.
 */

import { 
  AssessmentToolPluginTemplate,
  AssessmentType,
  AssessmentDifficulty,
  AssessmentResultLevel,
  AssessmentMetadata,
  AssessmentResult
} from '@/lib/plugins/templates/assessmentToolPlugin';
import { PluginMetadata, PluginStatus } from '@/lib/plugins/types';

/**
 * CogniFit API client
 */
class CogniFitApiClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string = 'https://api.cognifit.com/v1';
  
  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  
  /**
   * Make authenticated request to CogniFit API
   */
  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Secret': this.apiSecret
    };
    
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CogniFit API error (${response.status}): ${errorText}`);
    }
    
    return response.json();
  }
  
  /**
   * Get available assessments
   */
  async getAssessments(): Promise<any[]> {
    return this.request('/assessments');
  }
  
  /**
   * Get assessment details
   */
  async getAssessment(assessmentId: string): Promise<any> {
    return this.request(`/assessments/${assessmentId}`);
  }
  
  /**
   * Create assessment session
   */
  async createAssessmentSession(params: any): Promise<any> {
    return this.request('/assessment-sessions', 'POST', params);
  }
  
  /**
   * Get assessment session
   */
  async getAssessmentSession(sessionId: string): Promise<any> {
    return this.request(`/assessment-sessions/${sessionId}`);
  }
  
  /**
   * Get assessment results
   */
  async getAssessmentResults(sessionId: string): Promise<any> {
    return this.request(`/assessment-sessions/${sessionId}/results`);
  }
}

/**
 * CogniFit Assessment Tool Plugin
 */
export class CogniFitAssessmentPlugin extends AssessmentToolPluginTemplate {
  private apiClient: CogniFitApiClient | null = null;
  
  /**
   * Get plugin metadata
   */
  getMetadata(): PluginMetadata {
    return {
      id: 'cognifit-assessment',
      name: 'CogniFit Assessment Tools',
      description: 'Integrates CogniFit cognitive assessment and training tools.',
      version: '1.0.0',
      author: 'EdPsych-AI-Education-Platform',
      website: 'https://www.cognifit.com',
      icon: '/icons/cognifit.svg',
      tags: ['assessment', 'cognitive', 'special-needs'],
      supportedFeatures: ['cognitive-assessment', 'progress-tracking', 'reporting'],
      requiredPermissions: ['read_assessment', 'write_assessment', 'external_api'],
      compatibilityVersion: '1.0',
    };
  }
  
  /**
   * Validate plugin settings
   */
  protected validateSettings(): boolean {
    // Check if required settings are present
    if (!this.settings.apiKey || !this.settings.apiSecret) {
      console.error('CogniFit plugin missing required settings: apiKey and apiSecret');
      return false;
    }
    
    return true;
  }
  
  /**
   * Initialize provider-specific resources
   */
  protected async initializeProvider(): Promise<void> {
    if (!this.settings.apiKey || !this.settings.apiSecret) {
      throw new Error('CogniFit API credentials not configured');
    }
    
    this.apiClient = new CogniFitApiClient(
      this.settings.apiKey,
      this.settings.apiSecret
    );
    
    // Verify API connection
    try {
      await this.apiClient.getAssessments();
    } catch (error) {
      throw new Error(`Failed to connect to CogniFit API: ${error.message}`);
    }
  }
  
  /**
   * Shutdown provider-specific resources
   */
  protected async shutdownProvider(): Promise<void> {
    this.apiClient = null;
  }
  
  /**
   * Configure provider with settings
   */
  protected async configureProvider(settings: Record<string, any>): Promise<void> {
    if (settings.apiKey && settings.apiSecret) {
      this.apiClient = new CogniFitApiClient(
        settings.apiKey,
        settings.apiSecret
      );
      
      // Verify API connection
      try {
        await this.apiClient.getAssessments();
      } catch (error) {
        throw new Error(`Failed to connect to CogniFit API: ${error.message}`);
      }
    }
  }
  
  /**
   * Validate assessment parameters
   */
  protected validateAssessmentParams(params: any): boolean {
    // Check if required parameters are present
    if (!params.type || !params.userId) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Create assessment in provider
   */
  protected async createProviderAssessment(params: any): Promise<any> {
    if (!this.apiClient) {
      throw new Error('CogniFit API client not initialized');
    }
    
    // Map platform parameters to CogniFit parameters
    const cognifitParams = {
      assessment_type: this.mapAssessmentType(params.type),
      user_id: params.userId,
      language: params.language || 'en-GB',
      redirect_url: params.redirectUrl,
      ...this.getAdditionalParams(params)
    };
    
    // Create assessment session in CogniFit
    const session = await this.apiClient.createAssessmentSession(cognifitParams);
    
    return session;
  }
  
  /**
   * Map provider assessment to platform format
   */
  protected mapProviderAssessment(assessment: any): AssessmentMetadata {
    return {
      id: assessment.id,
      name: assessment.name,
      description: assessment.description || 'CogniFit cognitive assessment',
      type: this.mapCognifitType(assessment.type),
      difficulty: AssessmentDifficulty.ADAPTIVE,
      ageRangeMin: assessment.min_age || 7,
      ageRangeMax: assessment.max_age || 99,
      estimatedTimeMinutes: assessment.estimated_time_minutes || 30,
      tags: ['cognitive', 'cognifit', assessment.type]
    };
  }
  
  /**
   * Validate assessment responses
   */
  protected validateResponses(responses: any): boolean {
    // CogniFit handles responses internally, so we just need to validate the session ID
    return !!responses.sessionId;
  }
  
  /**
   * Score assessment in provider
   */
  protected async scoreProviderAssessment(assessmentId: string, responses: any): Promise<any> {
    if (!this.apiClient) {
      throw new Error('CogniFit API client not initialized');
    }
    
    // CogniFit handles scoring internally, so we just need to get the results
    const results = await this.apiClient.getAssessmentResults(responses.sessionId);
    
    return results;
  }
  
  /**
   * Get assessment results from provider
   */
  protected async getProviderResults(assessmentId: string): Promise<any> {
    if (!this.apiClient) {
      throw new Error('CogniFit API client not initialized');
    }
    
    // Get results from CogniFit
    const results = await this.apiClient.getAssessmentResults(assessmentId);
    
    return results;
  }
  
  /**
   * Map provider result to platform format
   */
  protected mapProviderResult(result: any): AssessmentResult {
    // Calculate overall score
    const scores = result.cognitive_skills.map(skill => skill.score);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = scores.length * 800; // CogniFit scores range from 0-800
    const percentageScore = (totalScore / maxPossibleScore) * 100;
    
    // Determine result level
    let level = AssessmentResultLevel.AVERAGE;
    if (percentageScore >= 80) {
      level = AssessmentResultLevel.WELL_ABOVE_AVERAGE;
    } else if (percentageScore >= 60) {
      level = AssessmentResultLevel.ABOVE_AVERAGE;
    } else if (percentageScore >= 40) {
      level = AssessmentResultLevel.AVERAGE;
    } else if (percentageScore >= 20) {
      level = AssessmentResultLevel.BELOW_AVERAGE;
    } else {
      level = AssessmentResultLevel.WELL_BELOW_AVERAGE;
    }
    
    // Map strengths and areas for improvement
    const strengths = result.cognitive_skills
      .filter(skill => skill.score >= 600)
      .map(skill => skill.name);
    
    const areasForImprovement = result.cognitive_skills
      .filter(skill => skill.score < 400)
      .map(skill => skill.name);
    
    // Map recommendations
    const recommendations = result.recommendations || [];
    
    return {
      assessmentId: result.assessment_id,
      userId: result.user_id,
      startedAt: new Date(result.started_at),
      completedAt: new Date(result.completed_at),
      totalScore,
      maxPossibleScore,
      percentageScore,
      timeSpent: result.time_spent_seconds || 0,
      level,
      responses: [], // CogniFit doesn't provide individual responses
      strengths,
      areasForImprovement,
      recommendations,
      rawData: result
    };
  }
  
  /**
   * Map assessment type to CogniFit type
   */
  private mapAssessmentType(type: AssessmentType): string {
    const mapping: Record<AssessmentType, string> = {
      [AssessmentType.COGNITIVE]: 'cognitive',
      [AssessmentType.EXECUTIVE_FUNCTION]: 'executive',
      [AssessmentType.ATTENTION]: 'attention',
      [AssessmentType.MEMORY]: 'memory',
      [AssessmentType.PERCEPTION]: 'perception',
      [AssessmentType.REASONING]: 'reasoning',
      [AssessmentType.COORDINATION]: 'coordination',
      [AssessmentType.EMOTIONAL]: 'emotional',
      [AssessmentType.LITERACY]: 'reading',
      [AssessmentType.NUMERACY]: 'math',
      [AssessmentType.BEHAVIORAL]: 'behavior',
      [AssessmentType.SENSORY]: 'sensory',
      [AssessmentType.LANGUAGE]: 'language',
      [AssessmentType.MOTOR]: 'motor',
      [AssessmentType.CUSTOM]: 'custom'
    };
    
    return mapping[type] || 'cognitive';
  }
  
  /**
   * Map CogniFit type to assessment type
   */
  private mapCognifitType(type: string): AssessmentType {
    switch (type.toLowerCase()) {
      case 'cognitive':
        return AssessmentType.COGNITIVE;
      case 'executive':
        return AssessmentType.EXECUTIVE_FUNCTION;
      case 'attention':
        return AssessmentType.COGNITIVE;
      case 'memory':
        return AssessmentType.COGNITIVE;
      case 'perception':
        return AssessmentType.COGNITIVE;
      case 'reasoning':
        return AssessmentType.COGNITIVE;
      case 'coordination':
        return AssessmentType.MOTOR;
      case 'emotional':
        return AssessmentType.EMOTIONAL;
      case 'reading':
        return AssessmentType.LITERACY;
      case 'math':
        return AssessmentType.NUMERACY;
      case 'behavior':
        return AssessmentType.BEHAVIORAL;
      case 'sensory':
        return AssessmentType.SENSORY;
      case 'language':
        return AssessmentType.LANGUAGE;
      case 'motor':
        return AssessmentType.MOTOR;
      default:
        return AssessmentType.CUSTOM;
    }
  }
  
  /**
   * Get additional parameters for CogniFit assessment
   */
  private getAdditionalParams(params: any): Record<string, any> {
    const additionalParams: Record<string, any> = {};
    
    // Add optional parameters if provided
    if (params.age) {
      additionalParams.age = params.age;
    }
    
    if (params.gender) {
      additionalParams.gender = params.gender;
    }
    
    if (params.educationLevel) {
      additionalParams.education_level = params.educationLevel;
    }
    
    if (params.customInstructions) {
      additionalParams.custom_instructions = params.customInstructions;
    }
    
    return additionalParams;
  }
}

// Export plugin class
export default CogniFitAssessmentPlugin;
