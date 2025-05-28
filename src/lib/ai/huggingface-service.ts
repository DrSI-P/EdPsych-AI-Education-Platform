import { env } from '../../env';
import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client
const hf = new HfInference(env.HUGGINGFACE_API_KEY);

/**
 * Hugging Face AI service for various AI tasks
 */
export class HuggingfaceService {
  /**
   * Generate text using a specified model
   */
  async generateText(prompt: string, options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}) {
    try {
      const {
        model = 'mistralai/Mistral-7B-Instruct-v0.2',
        maxTokens = 100,
        temperature = 0.7
      } = options;
      
      const response = await hf.textGeneration({
        model,
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: temperature,
          return_full_text: false
        }
      });
      
      return {
        text: response.generated_text,
        model
      };
    } catch (error) {
      console.error('Hugging Face text generation error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }
  
  /**
   * Summarize text using a specified model
   */
  async summarizeText(text: string, options: {
    model?: string;
    maxLength?: number;
  } = {}) {
    try {
      const {
        model = 'facebook/bart-large-cnn',
        maxLength = 100
      } = options;
      
      const response = await hf.summarization({
        model,
        inputs: text,
        parameters: {
          max_length: maxLength
        }
      });
      
      return {
        summary: response.summary_text,
        model
      };
    } catch (error) {
      console.error('Hugging Face summarization error:', error);
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
  }
  
  /**
   * Classify text sentiment
   */
  async classifySentiment(text: string, options: {
    model?: string;
  } = {}) {
    try {
      const { model = 'distilbert-base-uncased-finetuned-sst-2-english' } = options;
      
      const response = await hf.textClassification({
        model,
        inputs: text
      });
      
      return {
        sentiment: response[0].label,
        score: response[0].score,
        model
      };
    } catch (error) {
      console.error('Hugging Face sentiment classification error:', error);
      throw new Error(`Failed to classify sentiment: ${error.message}`);
    }
  }
  
  /**
   * Answer questions based on context
   */
  async answerQuestion(question: string, context: string, options: {
    model?: string;
  } = {}) {
    try {
      const { model = 'deepset/roberta-base-squad2' } = options;
      
      const response = await hf.questionAnswering({
        model,
        inputs: {
          question,
          context
        }
      });
      
      return {
        answer: response.answer,
        score: response.score,
        start: response.start,
        end: response.end,
        model
      };
    } catch (error) {
      console.error('Hugging Face question answering error:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
  
  /**
   * Generate image from text prompt
   */
  async generateImage(prompt: string, options: {
    model?: string;
    negativePrompt?: string;
  } = {}) {
    try {
      const {
        model = 'stabilityai/stable-diffusion-xl-base-1.0',
        negativePrompt = 'blurry, bad quality, distorted'
      } = options;
      
      const response = await hf.textToImage({
        model,
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt
        }
      });
      
      // Convert blob to base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      return {
        imageBase64: `data:image/jpeg;base64,${base64}`,
        model
      };
    } catch (error) {
      console.error('Hugging Face image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
  
  /**
   * Fill in masked text
   */
  async fillMask(text: string, options: {
    model?: string;
    topK?: number;
  } = {}) {
    try {
      const {
        model = 'bert-base-uncased',
        topK = 5
      } = options;
      
      // Ensure text contains [MASK] token
      if (!text.includes('[MASK]')) {
        throw new Error('Text must contain [MASK] token');
      }
      
      const response = await hf.fillMask({
        model,
        inputs: text
      });
      
      return {
        results: response.slice(0, topK).map(result => ({
          sequence: result.sequence,
          token: result.token_str,
          score: result.score
        })),
        model
      };
    } catch (error) {
      console.error('Hugging Face fill mask error:', error);
      throw new Error(`Failed to fill mask: ${error.message}`);
    }
  }
  
  /**
   * Analyze educational content complexity
   */
  async analyzeEducationalContent(text: string, targetAgeGroup: string) {
    try {
      // First, classify the text complexity
      const complexityResponse = await this.classifyTextComplexity(text);
      
      // Then, get readability metrics
      const readabilityMetrics = this.calculateReadabilityMetrics(text);
      
      // Map complexity level to age range
      const complexityToAge = {
        'elementary': [5, 10],
        'intermediate': [11, 14],
        'high_school': [15, 18],
        'college': [19, 22],
        'technical': [19, 99]
      };
      
      // Determine target age range
      const targetAge = this.estimateAgeFromGroup(targetAgeGroup);
      
      // Check if content complexity matches target age
      const complexityLevel = complexityResponse.complexity;
      const [minAge, maxAge] = complexityToAge[complexityLevel] || [0, 99];
      const isAppropriate = targetAge >= minAge && targetAge <= maxAge;
      
      return {
        complexity: {
          level: complexityLevel,
          confidence: complexityResponse.score,
          ageRange: `${minAge}-${maxAge}`
        },
        readability: readabilityMetrics,
        targetAnalysis: {
          targetAgeGroup,
          estimatedTargetAge: targetAge,
          isAppropriateForAge: isAppropriate
        },
        recommendations: this.generateRecommendations(
          complexityLevel,
          readabilityMetrics,
          targetAge
        )
      };
    } catch (error) {
      console.error('Educational content analysis error:', error);
      throw new Error(`Failed to analyze educational content: ${error.message}`);
    }
  }
  
  /**
   * Classify text complexity level
   * This is a simplified implementation using sentiment analysis as a proxy
   */
  private async classifyTextComplexity(text: string) {
    // Use a zero-shot classification approach
    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: ['elementary', 'intermediate', 'high_school', 'college', 'technical']
      }
    });
    
    return {
      complexity: response.labels[0],
      score: response.scores[0]
    };
  }
  
  /**
   * Calculate readability metrics for text
   */
  private calculateReadabilityMetrics(text: string) {
    // Count words, sentences, and syllables
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
    const syllables = this.countSyllables(text);
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const syllableCount = syllables;
    
    // Calculate average words per sentence
    const wordsPerSentence = wordCount / sentenceCount;
    
    // Calculate average syllables per word
    const syllablesPerWord = syllableCount / wordCount;
    
    // Calculate Flesch-Kincaid Grade Level
    const fleschKincaidGradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
    
    // Calculate Flesch Reading Ease
    const fleschReadingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
    
    return {
      wordCount,
      sentenceCount,
      syllableCount,
      wordsPerSentence: wordsPerSentence.toFixed(1),
      syllablesPerWord: syllablesPerWord.toFixed(1),
      fleschKincaidGradeLevel: Math.max(0, fleschKincaidGradeLevel).toFixed(1),
      fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)).toFixed(1),
      estimatedAge: Math.round(fleschKincaidGradeLevel + 5)
    };
  }
  
  /**
   * Count syllables in text (simplified)
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;
    
    for (const word of words) {
      if (word.length <= 3) {
        count += 1;
        continue;
      }
      
      // Count vowel groups as syllables
      const vowelGroups = word.match(/[aeiouy]+/g);
      if (vowelGroups) {
        count += vowelGroups.length;
      }
      
      // Subtract silent e at the end
      if (word.endsWith('e') && word.length > 2 && !/[aeiouy]/.test(word.charAt(word.length - 2))) {
        count -= 1;
      }
    }
    
    return count;
  }
  
  /**
   * Estimate age from age group string
   */
  private estimateAgeFromGroup(ageGroup: string): number {
    const ageGroupMap: Record<string, number> = {
      'reception': 5,
      'year 1': 6,
      'year 2': 7,
      'year 3': 8,
      'year 4': 9,
      'year 5': 10,
      'year 6': 11,
      'year 7': 12,
      'year 8': 13,
      'year 9': 14,
      'year 10': 15,
      'year 11': 16,
      'year 12': 17,
      'year 13': 18,
      'ks1': 6,
      'ks2': 9,
      'ks3': 13,
      'ks4': 15,
      'ks5': 17,
      'primary': 8,
      'secondary': 14,
      'early years': 4
    };
    
    const normalizedAgeGroup = ageGroup.toLowerCase().trim();
    
    if (normalizedAgeGroup in ageGroupMap) {
      return ageGroupMap[normalizedAgeGroup];
    }
    
    // Try to extract a number if the age group contains digits
    const match = normalizedAgeGroup.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    
    // Default to middle school age if unknown
    return 12;
  }
  
  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    complexityLevel: string,
    readabilityMetrics: any,
    targetAge: number
  ): string[] {
    const recommendations: string[] = [];
    const gradeLevel = parseFloat(readabilityMetrics.fleschKincaidGradeLevel);
    const targetGradeLevel = targetAge - 5;
    
    if (Math.abs(gradeLevel - targetGradeLevel) > 2) {
      if (gradeLevel > targetGradeLevel) {
        recommendations.push('The content may be too complex for the target age group.');
        
        if (parseFloat(readabilityMetrics.wordsPerSentence) > 15) {
          recommendations.push('Consider using shorter sentences to improve readability.');
        }
        
        if (parseFloat(readabilityMetrics.syllablesPerWord) > 1.5) {
          recommendations.push('Consider using simpler words with fewer syllables.');
        }
      } else {
        recommendations.push('The content may be too simple for the target age group.');
        recommendations.push('Consider introducing more complex vocabulary and sentence structures.');
      }
    } else {
      recommendations.push('The content is appropriately matched to the target age group.');
    }
    
    return recommendations;
  }
}

// Export a singleton instance
export const huggingfaceService = new HuggingfaceService();
