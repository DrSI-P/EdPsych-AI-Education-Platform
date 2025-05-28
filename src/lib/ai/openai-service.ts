import { env } from '../../env';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

// Initialize OpenAI API client
const openai = new OpenAIApi(configuration);

/**
 * OpenAI service for various AI tasks
 */
export class OpenAIService {
  /**
   * Generate text using OpenAI's GPT models
   */
  async generateText(prompt: string, options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  } = {}) {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 500,
        temperature = 0.7,
        topP = 1,
        presencePenalty = 0,
        frequencyPenalty = 0
      } = options;
      
      const response = await openai.createChatCompletion({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        presence_penalty: presencePenalty,
        frequency_penalty: frequencyPenalty
      });
      
      return {
        text: response.data.choices[0]?.message?.content || '',
        model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenAI text generation error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }
  
  /**
   * Generate educational content with specific complexity level
   */
  async generateEducationalContent(topic: string, options: {
    ageGroup?: string;
    complexityLevel?: 'simple' | 'moderate' | 'advanced';
    format?: 'explanation' | 'quiz' | 'activity' | 'story';
    maxTokens?: number;
    includeImages?: boolean;
  } = {}) {
    try {
      const {
        ageGroup = 'primary',
        complexityLevel = 'moderate',
        format = 'explanation',
        maxTokens = 800,
        includeImages = false
      } = options;
      
      // Map age group to appropriate language
      const ageGroupPrompts = {
        'nursery': 'very simple language suitable for 3-4 year olds',
        'reception': 'simple language suitable for 4-5 year olds',
        'ks1': 'clear, simple language suitable for 5-7 year olds',
        'ks2': 'clear language suitable for 7-11 year olds',
        'ks3': 'appropriate language for 11-14 year olds',
        'ks4': 'appropriate language for 14-16 year olds',
        'ks5': 'appropriate language for 16-18 year olds',
        'primary': 'clear language suitable for primary school children',
        'secondary': 'appropriate language for secondary school students',
        'professional': 'professional language suitable for educators'
      };
      
      const agePrompt = ageGroupPrompts[ageGroup] || 'age-appropriate language';
      
      // Map complexity level to appropriate instructions
      const complexityPrompts = {
        'simple': 'Use simple concepts and vocabulary. Focus on foundational ideas.',
        'moderate': 'Balance simplicity with some more advanced concepts. Introduce subject-specific vocabulary with clear explanations.',
        'advanced': 'Include advanced concepts and subject-specific vocabulary. Make connections between different ideas and encourage critical thinking.'
      };
      
      const complexityPrompt = complexityPrompts[complexityLevel];
      
      // Map format to appropriate instructions
      const formatPrompts = {
        'explanation': 'Provide a clear explanation of the topic with examples.',
        'quiz': 'Create a quiz with questions and answers about the topic.',
        'activity': 'Design an engaging activity or exercise related to the topic.',
        'story': 'Present the information in a narrative format with characters and a storyline.'
      };
      
      const formatPrompt = formatPrompts[format];
      
      // Create the full prompt
      const fullPrompt = `
        Create educational content about "${topic}" for ${ageGroup} level students.
        
        Use ${agePrompt}.
        
        ${complexityPrompt}
        
        ${formatPrompt}
        
        ${includeImages ? 'Suggest points where images or diagrams would enhance understanding.' : ''}
        
        Make the content engaging, accurate, and educational.
      `;
      
      // Generate the content
      const response = await this.generateText(fullPrompt, {
        model: 'gpt-4',
        maxTokens,
        temperature: 0.7
      });
      
      return {
        content: response.text,
        metadata: {
          topic,
          ageGroup,
          complexityLevel,
          format,
          includesImageSuggestions: includeImages
        }
      };
    } catch (error) {
      console.error('OpenAI educational content generation error:', error);
      throw new Error(`Failed to generate educational content: ${error.message}`);
    }
  }
  
  /**
   * Analyze text for educational complexity and readability
   */
  async analyzeEducationalContent(text: string, targetAgeGroup: string) {
    try {
      const prompt = `
        Analyze the following educational content for complexity, readability, and appropriateness for ${targetAgeGroup} students.
        
        Provide:
        1. Estimated reading level (UK year group)
        2. Key concepts covered
        3. Vocabulary complexity assessment
        4. Sentence structure complexity
        5. Whether the content is appropriate for the target age group
        6. Specific recommendations to better match the content to the target age group
        
        Format the response as JSON with the following structure:
        {
          "readingLevel": "Year X",
          "keyConcepts": ["concept1", "concept2", ...],
          "vocabularyComplexity": "simple/moderate/advanced",
          "sentenceComplexity": "simple/moderate/advanced",
          "isAppropriate": true/false,
          "recommendations": ["recommendation1", "recommendation2", ...]
        }
        
        Content to analyze:
        ${text}
      `;
      
      const response = await this.generateText(prompt, {
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 800
      });
      
      // Parse the JSON response
      try {
        const analysisResult = JSON.parse(response.text);
        return {
          ...analysisResult,
          targetAgeGroup,
          analysisModel: 'gpt-4'
        };
      } catch (parseError) {
        console.error('Error parsing OpenAI analysis response:', parseError);
        return {
          error: 'Failed to parse analysis result',
          rawResponse: response.text
        };
      }
    } catch (error) {
      console.error('OpenAI educational content analysis error:', error);
      throw new Error(`Failed to analyze educational content: ${error.message}`);
    }
  }
  
  /**
   * Generate personalized feedback for student work
   */
  async generatePersonalizedFeedback(studentWork: string, options: {
    subject?: string;
    ageGroup?: string;
    learningObjectives?: string[];
    feedbackStyle?: 'encouraging' | 'constructive' | 'detailed' | 'simple';
    previousFeedback?: string;
  } = {}) {
    try {
      const {
        subject = 'general',
        ageGroup = 'primary',
        learningObjectives = [],
        feedbackStyle = 'encouraging',
        previousFeedback
      } = options;
      
      // Map feedback style to appropriate instructions
      const feedbackStylePrompts = {
        'encouraging': 'Focus on positive aspects and provide gentle suggestions for improvement. Use encouraging language throughout.',
        'constructive': 'Balance positive feedback with clear areas for improvement. Be specific about how the student can develop their work.',
        'detailed': 'Provide comprehensive feedback covering multiple aspects of the work. Include specific examples and detailed suggestions.',
        'simple': 'Keep feedback concise and easy to understand. Focus on 1-2 key points only.'
      };
      
      const stylePrompt = feedbackStylePrompts[feedbackStyle];
      
      // Create learning objectives section if provided
      const objectivesSection = learningObjectives.length > 0
        ? `The learning objectives for this work were:\n${learningObjectives.map(obj => `- ${obj}`).join('\n')}`
        : 'Please assess the work based on age-appropriate standards.';
      
      // Include previous feedback context if provided
      const previousFeedbackSection = previousFeedback
        ? `Previous feedback given to this student: "${previousFeedback}"\nBuild on this previous feedback and note any improvements or continued areas for development.`
        : '';
      
      // Create the full prompt
      const fullPrompt = `
        Generate personalized feedback for a ${ageGroup} student's work in ${subject}.
        
        ${objectivesSection}
        
        ${stylePrompt}
        
        ${previousFeedbackSection}
        
        Format the feedback with:
        1. Positive aspects of the work
        2. Areas for development
        3. Specific next steps
        4. An encouraging summary
        
        Student's work:
        ${studentWork}
      `;
      
      // Generate the feedback
      const response = await this.generateText(fullPrompt, {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 800
      });
      
      return {
        feedback: response.text,
        metadata: {
          subject,
          ageGroup,
          feedbackStyle,
          learningObjectives
        }
      };
    } catch (error) {
      console.error('OpenAI feedback generation error:', error);
      throw new Error(`Failed to generate personalized feedback: ${error.message}`);
    }
  }
  
  /**
   * Generate differentiated versions of content for different ability levels
   */
  async generateDifferentiatedContent(baseContent: string, options: {
    levels?: ('lower' | 'core' | 'higher')[];
    subject?: string;
    ageGroup?: string;
    preserveKeyPoints?: boolean;
  } = {}) {
    try {
      const {
        levels = ['lower', 'core', 'higher'],
        subject = 'general',
        ageGroup = 'primary',
        preserveKeyPoints = true
      } = options;
      
      // Map levels to appropriate instructions
      const levelPrompts = {
        'lower': 'Simplify the content for students who need additional support. Use simpler vocabulary, shorter sentences, and more scaffolding. Focus on the most essential concepts only.',
        'core': 'Adapt the content for the average ability level in the class. Maintain the key concepts but ensure they are clearly explained with appropriate examples.',
        'higher': 'Extend the content for higher ability students. Include more complex vocabulary, deeper analysis, and challenging questions that promote critical thinking.'
      };
      
      // Generate differentiated content for each requested level
      const differentiatedVersions = {};
      
      for (const level of levels) {
        const levelPrompt = levelPrompts[level];
        
        const fullPrompt = `
          Create a differentiated version of the following educational content for ${level} ability ${ageGroup} students in ${subject}.
          
          ${levelPrompt}
          
          ${preserveKeyPoints ? 'Ensure all key learning points are preserved, even if simplified or extended.' : ''}
          
          Original content:
          ${baseContent}
        `;
        
        // Generate the differentiated content
        const response = await this.generateText(fullPrompt, {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000
        });
        
        differentiatedVersions[level] = response.text;
      }
      
      return {
        original: baseContent,
        differentiated: differentiatedVersions,
        metadata: {
          subject,
          ageGroup,
          levels
        }
      };
    } catch (error) {
      console.error('OpenAI differentiation error:', error);
      throw new Error(`Failed to generate differentiated content: ${error.message}`);
    }
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();
