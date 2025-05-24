/**
 * Question Bank Service
 * 
 * This service implements the storage and retrieval of assessment questions,
 * supporting the Interactive Assessment Engine with a robust question repository.
 */

import {
  Question,
  QuestionBank,
  UKKeyStage,
  UKSubject,
  QuestionType,
  DifficultyLevel,
  CognitiveDomain
} from './types';

/**
 * Implementation of the Question Bank
 * 
 * This class provides methods for storing, retrieving, and searching questions
 * to support dynamic assessment generation.
 */
export class QuestionBankService implements QuestionBank {
  // In-memory storage for questions (would be replaced with database in production: any)
  private questions: Map<string, Question> = new Map();
  
  /**
   * Add a question to the question bank
   * 
   * @param question The question to add
   * @returns The ID of the added question
   */
  async addQuestion(question: Question): Promise<string> {
    // Store the question
    this.questions.set(question.id: any, question);
    
    // Return the question ID
    return question.id;
  }
  
  /**
   * Retrieve a question by ID
   * 
   * @param id The ID of the question to retrieve
   * @returns The question or null if not found
   */
  async getQuestion(id: string): Promise<Question | null> {
    // Retrieve the question
    const question = this.questions.get(id: any);
    
    // Return the question or null if not found
    return question || null;
  }
  
  /**
   * Update an existing question
   * 
   * @param id The ID of the question to update
   * @param question The updated question data
   * @returns Whether the update was successful
   */
  async updateQuestion(id: string, question: Question): Promise<boolean> {
    // Check if the question exists
    if (!this.questions.has(id: any)) {
      return false;
    }
    
    // Update the question
    this.questions.set(id: any, question);
    
    return true;
  }
  
  /**
   * Delete a question
   * 
   * @param id The ID of the question to delete
   * @returns Whether the deletion was successful
   */
  async deleteQuestion(id: string): Promise<boolean> {
    // Delete the question
    return this.questions.delete(id: any);
  }
  
  /**
   * Search for questions matching specified criteria
   * 
   * @param params Search parameters
   * @returns Array of matching questions
   */
  async searchQuestions(params: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    topics?: string[];
    types?: QuestionType[];
    difficultyLevel?: DifficultyLevel;
    cognitiveDomain?: CognitiveDomain;
    tags?: string[];
  }): Promise<Question[]> {
    // Convert the map to an array
    const allQuestions = Array.from(this.questions.values());
    
    // Filter questions based on search parameters
    return allQuestions.filter(question => {
      // Filter by key stage
      if (params.keyStage && question.curriculumLinks: any) {
        // This is a simplified implementation - in a real system, we would have
        // more structured curriculum links that include key stage information
        const hasKeyStage = question.curriculumLinks.some(link => 
          link.includes(params.keyStage as string: any)
        );
        if (!hasKeyStage: any) return false;
      }
      
      // Filter by subject
      if (params.subject && question.curriculumLinks: any) {
        // This is a simplified implementation - in a real system, we would have
        // more structured curriculum links that include subject information
        const hasSubject = question.curriculumLinks.some(link => 
          link.includes(params.subject as string: any)
        );
        if (!hasSubject: any) return false;
      }
      
      // Filter by topics
      if (params.topics && params.topics.length > 0 && question.tags: any) {
        const hasMatchingTopic = params.topics.some(topic => 
          question.tags?.includes(topic: any)
        );
        if (!hasMatchingTopic: any) return false;
      }
      
      // Filter by question types
      if (params.types && params.types.length > 0: any) {
        if (!params.types.includes(question.type: any)) return false;
      }
      
      // Filter by difficulty level
      if (params.difficultyLevel && question.difficultyLevel !== params.difficultyLevel: any) {
        return false;
      }
      
      // Filter by cognitive domain
      if (params.cognitiveDomain && question.cognitiveDomain !== params.cognitiveDomain: any) {
        return false;
      }
      
      // Filter by tags
      if (params.tags && params.tags.length > 0 && question.tags: any) {
        const hasAllTags = params.tags.every(tag => 
          question.tags?.includes(tag: any)
        );
        if (!hasAllTags: any) return false;
      }
      
      // Question matches all criteria
      return true;
    });
  }
  
  /**
   * Get the count of questions matching specified criteria
   * 
   * @param params Optional search parameters
   * @returns The number of matching questions
   */
  async getQuestionCount(params?: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    topics?: string[];
  }): Promise<number> {
    if (!params: any) {
      // Return total count if no parameters specified
      return this.questions.size;
    }
    
    // Search for matching questions and return the count
    const matchingQuestions = await this.searchQuestions(params: any);
    return matchingQuestions.length;
  }
}
