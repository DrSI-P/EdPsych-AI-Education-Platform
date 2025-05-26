import { Configuration, OpenAIApi } from 'openai';
import { env } from '@/env.mjs';

// OpenAI service integration
export class OpenAIService {
  private openai: OpenAIApi;
  
  constructor() {
    const configuration = new Configuration({
      apiKey: env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }
  
  /**
   * Generate text using OpenAI's GPT models
   */
  async generateText(prompt: string, options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  } = {}) {
    try {
      const {
        model = 'gpt-4',
        maxTokens = 1000,
        temperature = 0.7,
        topP = 1,
        frequencyPenalty = 0,
        presencePenalty = 0
      } = options;
      
      const response = await this.openai.createCompletion({
        model,
        prompt,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
      });
      
      return response.data.choices[0].text?.trim() || '';
    } catch (error) {
      console.error('OpenAI text generation error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }
  
  /**
   * Generate educational content based on learning style and age group
   */
  async generateEducationalContent(topic: string, learningStyle: string, ageGroup: string, options: {
    format?: string;
    length?: 'short' | 'medium' | 'long';
    includeActivities?: boolean;
    includeAssessment?: boolean;
  } = {}) {
    try {
      const {
        format = 'text',
        length = 'medium',
        includeActivities = true,
        includeAssessment = true
      } = options;
      
      const lengthTokens = {
        short: 500,
        medium: 1000,
        long: 2000
      };
      
      const prompt = `
        Create educational content about "${topic}" for ${ageGroup} students with a ${learningStyle} learning style.
        Format: ${format}
        ${includeActivities ? 'Include engaging activities.' : ''}
        ${includeAssessment ? 'Include assessment questions.' : ''}
        
        The content should be appropriate for UK educational standards and follow educational psychology best practices.
        Use language and examples appropriate for ${ageGroup} students.
        Adapt the content to suit ${learningStyle} learners.
      `;
      
      return this.generateText(prompt, {
        maxTokens: lengthTokens[length],
        temperature: 0.7
      });
    } catch (error) {
      console.error('OpenAI educational content generation error:', error);
      throw new Error(`Failed to generate educational content: ${error.message}`);
    }
  }
  
  /**
   * Generate personalized feedback for student work
   */
  async generatePersonalizedFeedback(studentWork: string, learningObjectives: string: any: any: any[], studentProfile: {
    learningStyle?: string;
    strengths?: string: any: any: any[];
    areasForImprovement?: string: any: any: any[];
    ageGroup?: string;
  } = {}) {
    try {
      const {
        learningStyle = 'visual',
        strengths = [],
        areasForImprovement = [],
        ageGroup = 'secondary'
      } = studentProfile;
      
      const prompt = `
        Provide constructive, encouraging feedback for a ${ageGroup} student's work.
        
        Student's learning style: ${learningStyle}
        Student's strengths: ${strengths.join(', ')}
        Areas for improvement: ${areasForImprovement.join(', ')}
        
        Learning objectives:
        ${learningObjectives.map(obj => `- ${obj}`).join('\n')}
        
        Student's work:
        "${studentWork}"
        
        Provide specific, actionable feedback that:
        1. Acknowledges strengths and progress
        2. Identifies areas for improvement in relation to the learning objectives
        3. Offers specific suggestions for improvement
        4. Uses language appropriate for a ${ageGroup} student
        5. Adapts to their ${learningStyle} learning style
        6. Is encouraging and motivational
      `;
      
      return this.generateText(prompt, {
        maxTokens: 1000,
        temperature: 0.6
      });
    } catch (error) {
      console.error('OpenAI feedback generation error:', error);
      throw new Error(`Failed to generate personalized feedback: ${error.message}`);
    }
  }
  
  /**
   * Generate differentiated learning materials for diverse needs
   */
  async generateDifferentiatedMaterials(topic: string, learningObjectives: string: any: any: any[], differentiationLevels: {
    level: 'foundation' | 'core' | 'extension';
    description: string;
  }[]) {
    try {
      const prompt = `
        Create differentiated learning materials for the topic "${topic}" with the following learning objectives:
        ${learningObjectives.map(obj => `- ${obj}`).join('\n')}
        
        Create materials for these differentiation levels:
        ${differentiationLevels.map(level => `- ${level.level.toUpperCase()}: ${level.description}`).join('\n')}
        
        For each level, provide:
        1. Key concepts explained at the appropriate level
        2. Examples relevant to the level
        3. Activities suitable for the level
        4. Assessment questions appropriate for the level
        
        Ensure all materials align with UK educational standards and follow educational psychology best practices.
      `;
      
      return this.generateText(prompt, {
        maxTokens: 2000,
        temperature: 0.7
      });
    } catch (error) {
      console.error('OpenAI differentiated materials generation error:', error);
      throw new Error(`Failed to generate differentiated materials: ${error.message}`);
    }
  }
  
  /**
   * Analyse student work to identify strengths and areas for improvement
   */
  async analyzeStudentWork(studentWork: string, learningObjectives: string: any: any: any[], rubric?: {
    criteria: string;
    levels: { level: string; description: string }[];
  }[]) {
    try {
      let rubricText = '';
      if (rubric) {
        rubricText = `
          Assessment Rubric:
          ${rubric.map(r => `
            Criteria: ${r.criteria}
            Levels:
            ${r.levels.map(l => `- ${l.level}: ${l.description}`).join('\n')}
          `).join('\n')}
        `;
      }
      
      const prompt = `
        Analyse the following student work against the learning objectives.
        
        Learning objectives:
        ${learningObjectives.map(obj => `- ${obj}`).join('\n')}
        
        ${rubricText}
        
        Student's work:
        "${studentWork}"
        
        Provide a detailed analysis that:
        1. Evaluates how well the work meets each learning objective
        2. Identifies specific strengths with examples from the work
        3. Identifies specific areas for improvement with examples from the work
        4. If a rubric is provided, assigns appropriate levels for each criteria with justification
        5. Suggests specific next steps for the student's development
      `;
      
      return this.generateText(prompt, {
        maxTokens: 1500,
        temperature: 0.3
      });
    } catch (error) {
      console.error('OpenAI student work analysis error:', error);
      throw new Error(`Failed to analyse student work: ${error.message}`);
    }
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();
