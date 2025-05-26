/**
 * OpenAI API Compatibility Layer
 * 
 * This file provides compatibility between OpenAI API v3 and v4
 * to ensure code written for v3 continues to work with v4.
 */

import OpenAI from 'openai';

// Create a singleton instance of the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Compatibility class that mimics the v3 OpenAIApi interface
export class OpenAIApi {
  constructor(config) {
    this.config = config;
    this.openai = openai;
  }

  // Compatibility method for createCompletion
  async createCompletion(params) {
    try {
      const response = await this.openai.completions.create(params);
      return { data: response };
    } catch (error) {
      console.error('Error in createCompletion:', error);
      throw error;
    }
  }

  // Compatibility method for createChatCompletion
  async createChatCompletion(params) {
    try {
      const response = await this.openai.chat.completions.create(params);
      return { data: response };
    } catch (error) {
      console.error('Error in createChatCompletion:', error);
      throw error;
    }
  }

  // Compatibility method for createEmbedding
  async createEmbedding(params) {
    try {
      const response = await this.openai.embeddings.create(params);
      return { data: response };
    } catch (error) {
      console.error('Error in createEmbedding:', error);
      throw error;
    }
  }

  // Add other methods as needed
}

// Compatibility class that mimics the v3 Configuration interface
export class Configuration {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.organization = config.organization;
  }
}

// Export the OpenAI client directly for v4-style usage
export default openai;