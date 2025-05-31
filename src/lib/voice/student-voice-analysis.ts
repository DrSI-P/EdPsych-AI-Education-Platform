/**
 * Student Voice Analysis Service
 * 
 * This service extends the enhanced voice analysis capabilities with specific features
 * for analyzing student speech patterns, providing educational insights, and supporting
 * personalized learning based on voice interaction.
 */

import { EnhancedVoiceAnalysis, VoiceAnalysisResult, VoiceAnalysisOptions, EmotionType, SpeechPatternType } from './enhanced-voice-analysis';

// Learning engagement levels that can be detected from voice
export enum EngagementLevel {
  HIGHLY_ENGAGED = 'highly_engaged',
  ENGAGED = 'engaged',
  NEUTRAL = 'neutral',
  DISENGAGED = 'disengaged',
  FRUSTRATED = 'frustrated',
  CONFUSED = 'confused',
  ANXIOUS = 'anxious'
}

// Confidence levels in speaking
export enum ConfidenceLevel {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

// Student voice analysis result interface
export interface StudentVoiceAnalysisResult extends VoiceAnalysisResult {
  engagementLevel: EngagementLevel;
  confidenceLevel: ConfidenceLevel;
  learningInsights: {
    comprehension: number; // 0-1 scale
    fluency: number; // 0-1 scale
    vocabulary: {
      level: number; // 1-5 scale
      complexWords: number;
      totalWords: number;
      uniqueWords: number;
    };
    pronunciation: {
      accuracy: number; // 0-1 scale
      challengingPhonemes: string[];
    };
    conceptUnderstanding: number; // 0-1 scale
    attentionLevel: number; // 0-1 scale
  };
  supportRecommendations: string[];
  learningStyleIndicators: {
    visual: number; // 0-1 scale
    auditory: number; // 0-1 scale
    kinesthetic: number; // 0-1 scale
    readingWriting: number; // 0-1 scale
  };
}

// Student voice analysis options interface
export interface StudentVoiceAnalysisOptions extends VoiceAnalysisOptions {
  subject?: string; // Current subject being studied
  topic?: string; // Specific topic within the subject
  expectedVocabulary?: string[]; // Expected vocabulary for the current topic
  learningObjectives?: string[]; // Learning objectives for the current session
  previousAnalysisResults?: StudentVoiceAnalysisResult[]; // Previous analysis results for trend analysis
  learningDifficulties?: string[]; // Known learning difficulties to consider
}

// Default options
const defaultStudentOptions: StudentVoiceAnalysisOptions = {
  detectEmotion: true,
  analyzeSpeechPattern: true,
  ageGroup: 'late-primary',
  languageCode: 'en-GB',
  sensitivity: 0.8,
  subject: 'general',
  expectedVocabulary: []
};

/**
 * Student Voice Analysis Service
 */
export class StudentVoiceAnalysis {
  private static instance: StudentVoiceAnalysis;
  private enhancedVoiceAnalysis: EnhancedVoiceAnalysis;
  private isAnalyzing: boolean = false;
  private currentAnalysisCallback: ((result: StudentVoiceAnalysisResult) => void) | null = null;
  private analysisHistory: Map<string, StudentVoiceAnalysisResult[]> = new Map();
  private vocabularyDatabase: Map<string, Map<string, string[]>> = new Map();
  private conceptDatabase: Map<string, Map<string, string[]>> = new Map();

  private constructor() {
    this.enhancedVoiceAnalysis = EnhancedVoiceAnalysis.getInstance();
    this.initializeDatabases();
  }

  /**
   * Get the singleton instance of the Student Voice Analysis service
   */
  public static getInstance(): StudentVoiceAnalysis {
    if (!StudentVoiceAnalysis.instance) {
      StudentVoiceAnalysis.instance = new StudentVoiceAnalysis();
    }
    return StudentVoiceAnalysis.instance;
  }

  /**
   * Start student voice analysis with the given options
   * 
   * @param callback Function to call with analysis results
   * @param options Student voice analysis options
   */
  public async startAnalysis(
    callback: (result: StudentVoiceAnalysisResult) => void,
    options: Partial<StudentVoiceAnalysisOptions> = {}
  ): Promise<void> {
    if (this.isAnalyzing) {
      this.stopAnalysis();
    }

    const mergedOptions = { ...defaultStudentOptions, ...options };
    this.currentAnalysisCallback = callback;
    this.isAnalyzing = true;

    try {
      // Start enhanced voice analysis
      await this.enhancedVoiceAnalysis.startAnalysis(
        (baseResult: VoiceAnalysisResult) => {
          if (this.isAnalyzing && this.currentAnalysisCallback) {
            // Extend base analysis with student-specific insights
            const studentResult = this.extendWithStudentInsights(baseResult, mergedOptions);
            
            // Store result in history
            this.storeAnalysisResult(studentResult, mergedOptions);
            
            // Send results to callback
            this.currentAnalysisCallback(studentResult);
          }
        },
        mergedOptions
      );
    } catch (error) {
      console.error('Error starting student voice analysis:', error);
      throw new Error('Failed to start student voice analysis');
    }
  }

  /**
   * Stop the current student voice analysis
   */
  public stopAnalysis(): void {
    if (this.isAnalyzing) {
      this.enhancedVoiceAnalysis.stopAnalysis();
      this.isAnalyzing = false;
      this.currentAnalysisCallback = null;
    }
  }

  /**
   * Check if student voice analysis is currently active
   */
  public isCurrentlyAnalyzing(): boolean {
    return this.isAnalyzing;
  }

  /**
   * Get analysis history for a student
   * 
   * @param studentId Student identifier
   */
  public getAnalysisHistory(studentId: string): StudentVoiceAnalysisResult[] {
    return this.analysisHistory.get(studentId) || [];
  }

  /**
   * Clear analysis history for a student
   * 
   * @param studentId Student identifier
   */
  public clearAnalysisHistory(studentId: string): void {
    this.analysisHistory.delete(studentId);
  }

  /**
   * Initialize vocabulary and concept databases
   */
  private initializeDatabases(): void {
    // Initialize vocabulary database with sample data
    // In a real implementation, this would be loaded from a database or API
    
    // Mathematics vocabulary
    const mathVocabulary = new Map<string, string[]>();
    mathVocabulary.set('numbers', ['digit', 'numeral', 'integer', 'decimal', 'fraction', 'place value', 'odd', 'even']);
    mathVocabulary.set('operations', ['add', 'subtract', 'multiply', 'divide', 'sum', 'difference', 'product', 'quotient']);
    mathVocabulary.set('geometry', ['shape', 'angle', 'line', 'polygon', 'circle', 'triangle', 'square', 'rectangle']);
    this.vocabularyDatabase.set('mathematics', mathVocabulary);
    
    // English vocabulary
    const englishVocabulary = new Map<string, string[]>();
    englishVocabulary.set('grammar', ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction']);
    englishVocabulary.set('punctuation', ['period', 'comma', 'question mark', 'exclamation mark', 'apostrophe', 'quotation']);
    englishVocabulary.set('literature', ['character', 'plot', 'setting', 'theme', 'narrator', 'protagonist', 'antagonist']);
    this.vocabularyDatabase.set('english', englishVocabulary);
    
    // Science vocabulary
    const scienceVocabulary = new Map<string, string[]>();
    scienceVocabulary.set('biology', ['cell', 'organism', 'ecosystem', 'photosynthesis', 'respiration', 'adaptation']);
    scienceVocabulary.set('chemistry', ['element', 'compound', 'molecule', 'atom', 'reaction', 'solution', 'mixture']);
    scienceVocabulary.set('physics', ['force', 'energy', 'motion', 'gravity', 'electricity', 'magnetism', 'wave']);
    this.vocabularyDatabase.set('science', scienceVocabulary);
    
    // Initialize concept database with sample data
    // In a real implementation, this would be loaded from a database or API
    
    // Mathematics concepts
    const mathConcepts = new Map<string, string[]>();
    mathConcepts.set('numbers', ['place value', 'number line', 'comparing numbers', 'rounding']);
    mathConcepts.set('operations', ['addition algorithm', 'subtraction algorithm', 'multiplication algorithm', 'division algorithm']);
    mathConcepts.set('geometry', ['properties of shapes', 'angle measurement', 'area calculation', 'perimeter calculation']);
    this.conceptDatabase.set('mathematics', mathConcepts);
    
    // English concepts
    const englishConcepts = new Map<string, string[]>();
    englishConcepts.set('grammar', ['parts of speech', 'sentence structure', 'tense agreement', 'subject-verb agreement']);
    englishConcepts.set('punctuation', ['end punctuation', 'commas in lists', 'apostrophes for possession', 'quotation marks for dialogue']);
    englishConcepts.set('literature', ['character development', 'plot structure', 'theme analysis', 'narrative perspective']);
    this.conceptDatabase.set('english', englishConcepts);
    
    // Science concepts
    const scienceConcepts = new Map<string, string[]>();
    scienceConcepts.set('biology', ['cell structure', 'classification of organisms', 'food chains', 'life cycles']);
    scienceConcepts.set('chemistry', ['states of matter', 'atomic structure', 'chemical reactions', 'periodic table']);
    scienceConcepts.set('physics', ['Newton\'s laws', 'energy transfer', 'electrical circuits', 'light and sound waves']);
    this.conceptDatabase.set('science', scienceConcepts);
  }

  /**
   * Extend base voice analysis with student-specific insights
   * 
   * @param baseResult Base voice analysis result
   * @param options Student voice analysis options
   */
  private extendWithStudentInsights(
    baseResult: VoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): StudentVoiceAnalysisResult {
    // Analyze text for educational insights
    const text = baseResult.text;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    
    // Calculate vocabulary metrics
    const vocabularyMetrics = this.analyzeVocabulary(words, options);
    
    // Calculate pronunciation accuracy
    const pronunciationAnalysis = this.analyzePronunciation(text, baseResult, options);
    
    // Determine engagement level
    const engagementLevel = this.determineEngagementLevel(baseResult, options);
    
    // Determine confidence level
    const confidenceLevel = this.determineConfidenceLevel(baseResult, options);
    
    // Analyze concept understanding
    const conceptUnderstanding = this.analyzeConceptUnderstanding(text, options);
    
    // Generate learning style indicators
    const learningStyleIndicators = this.generateLearningStyleIndicators(baseResult, text, options);
    
    // Generate support recommendations
    const supportRecommendations = this.generateSupportRecommendations(
      baseResult,
      engagementLevel,
      confidenceLevel,
      vocabularyMetrics,
      pronunciationAnalysis,
      conceptUnderstanding,
      options
    );
    
    // Create extended result
    const studentResult: StudentVoiceAnalysisResult = {
      ...baseResult,
      engagementLevel,
      confidenceLevel,
      learningInsights: {
        comprehension: this.calculateComprehension(text, options),
        fluency: this.calculateFluency(baseResult, words.length),
        vocabulary: {
          level: vocabularyMetrics.level,
          complexWords: vocabularyMetrics.complexWords,
          totalWords: words.length,
          uniqueWords: uniqueWords.size
        },
        pronunciation: {
          accuracy: pronunciationAnalysis.accuracy,
          challengingPhonemes: pronunciationAnalysis.challengingPhonemes
        },
        conceptUnderstanding,
        attentionLevel: this.calculateAttentionLevel(baseResult, options)
      },
      supportRecommendations,
      learningStyleIndicators
    };
    
    return studentResult;
  }

  /**
   * Analyze vocabulary in text
   * 
   * @param words Array of words from text
   * @param options Student voice analysis options
   */
  private analyzeVocabulary(
    words: string[],
    options: StudentVoiceAnalysisOptions
  ): { level: number; complexWords: number } {
    // Get subject-specific vocabulary
    const subjectVocabulary = this.getSubjectVocabulary(options.subject, options.topic);
    const expectedVocabulary = options.expectedVocabulary || [];
    
    // Count complex words and subject-specific vocabulary
    let complexWordCount = 0;
    let subjectVocabCount = 0;
    let expectedVocabCount = 0;
    
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      
      // Check for complex words (simplified: words with 3+ syllables)
      if (this.countSyllables(word) >= 3) {
        complexWordCount++;
      }
      
      // Check for subject-specific vocabulary
      if (subjectVocabulary.includes(lowerWord)) {
        subjectVocabCount++;
      }
      
      // Check for expected vocabulary
      if (expectedVocabulary.some(v => v.toLowerCase() === lowerWord)) {
        expectedVocabCount++;
      }
    }
    
    // Calculate vocabulary level (1-5 scale)
    // Based on complex words, subject vocabulary, and expected vocabulary
    const totalWords = words.length;
    const complexRatio = totalWords > 0 ? complexWordCount / totalWords : 0;
    const subjectRatio = subjectVocabulary.length > 0 ? subjectVocabCount / subjectVocabulary.length : 0;
    const expectedRatio = expectedVocabulary.length > 0 ? expectedVocabCount / expectedVocabulary.length : 1;
    
    // Calculate weighted vocabulary level
    let level = 1;
    
    if (totalWords >= 5) {
      level = 1 + 
        Math.min(1, complexRatio * 2) * 2 + 
        Math.min(1, subjectRatio) * 1 + 
        Math.min(1, expectedRatio) * 1;
    }
    
    return {
      level,
      complexWords: complexWordCount
    };
  }

  /**
   * Analyze pronunciation in text
   * 
   * @param text Text to analyze
   * @param baseResult Base voice analysis result
   * @param options Student voice analysis options
   */
  private analyzePronunciation(
    text: string,
    baseResult: VoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): { accuracy: number; challengingPhonemes: string[] } {
    // In a real implementation, this would use speech recognition confidence scores
    // for individual words and phonemes
    
    // For this implementation, we'll use a simplified approach based on
    // speech recognition confidence and speech pattern
    
    const confidence = baseResult.confidence;
    const speechPattern = baseResult.speechPattern;
    
    // Identify potentially challenging phonemes
    // This is a simplified implementation - in a real system, this would use
    // phoneme-level analysis from speech recognition
    const challengingPhonemes: string[] = [];
    
    // Common challenging phonemes in English
    const potentiallyChallengingPhonemes = [
      'th', 'sh', 'ch', 'j', 'r', 'l', 'v', 'z', 'ng', 'w'
    ];
    
    // Check for challenging phonemes in text
    for (const phoneme of potentiallyChallengingPhonemes) {
      if (text.toLowerCase().includes(phoneme) && Math.random() < 0.3) {
        challengingPhonemes.push(phoneme);
      }
    }
    
    // Calculate pronunciation accuracy
    let accuracy = confidence;
    
    // Adjust based on speech pattern
    if (speechPattern === SpeechPatternType.HESITANT || speechPattern === SpeechPatternType.REPETITIVE) {
      accuracy *= 0.9;
    }
    
    // Adjust based on age group
    if (options.ageGroup === 'nursery' || options.ageGroup === 'early-primary') {
      accuracy *= 0.95; // More lenient for younger students
    }
    
    // Adjust based on learning difficulties
    if (options.learningDifficulties && options.learningDifficulties.includes('speech')) {
      accuracy *= 1.1; // More lenient for students with speech difficulties
      accuracy = Math.min(accuracy, 1.0);
    }
    
    return {
      accuracy,
      challengingPhonemes
    };
  }

  /**
   * Determine engagement level from voice analysis
   * 
   * @param baseResult Base voice analysis result
   * @param options Student voice analysis options
   */
  private determineEngagementLevel(
    baseResult: VoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): EngagementLevel {
    const emotion = baseResult.emotion;
    const speechPattern = baseResult.speechPattern;
    const metrics = baseResult.metrics;
    
    // Determine engagement based on emotion
    if (emotion === EmotionType.HAPPY) {
      return EngagementLevel.HIGHLY_ENGAGED;
    } else if (emotion === EmotionType.NEUTRAL && speechPattern === SpeechPatternType.FLUENT) {
      return EngagementLevel.ENGAGED;
    } else if (emotion === EmotionType.NEUTRAL) {
      return EngagementLevel.NEUTRAL;
    } else if (emotion === EmotionType.CONFUSED) {
      return EngagementLevel.CONFUSED;
    } else if (emotion === EmotionType.FRUSTRATED) {
      return EngagementLevel.FRUSTRATED;
    } else if (emotion === EmotionType.FEARFUL) {
      return EngagementLevel.ANXIOUS;
    } else if (emotion === EmotionType.SAD || speechPattern === SpeechPatternType.MONOTONE) {
      return EngagementLevel.DISENGAGED;
    }
    
    // Default to neutral
    return EngagementLevel.NEUTRAL;
  }

  /**
   * Determine confidence level from voice analysis
   * 
   * @param baseResult Base voice analysis result
   * @param options Student voice analysis options
   */
  private determineConfidenceLevel(
    baseResult: VoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): ConfidenceLevel {
    const emotion = baseResult.emotion;
    const speechPattern = baseResult.speechPattern;
    const metrics = baseResult.metrics;
    
    // Calculate confidence score based on multiple factors
    let confidenceScore = 0.5; // Start at neutral
    
    // Adjust based on speech pattern
    if (speechPattern === SpeechPatternType.FLUENT) {
      confidenceScore += 0.2;
    } else if (speechPattern === SpeechPatternType.VARIED) {
      confidenceScore += 0.15;
    } else if (speechPattern === SpeechPatternType.HESITANT) {
      confidenceScore -= 0.2;
    } else if (speechPattern === SpeechPatternType.REPETITIVE) {
      confidenceScore -= 0.1;
    }
    
    // Adjust based on emotion
    if (emotion === EmotionType.HAPPY) {
      confidenceScore += 0.15;
    } else if (emotion === EmotionType.FEARFUL) {
      confidenceScore -= 0.2;
    } else if (emotion === EmotionType.CONFUSED) {
      confidenceScore -= 0.1;
    }
    
    // Adjust based on volume
    if (metrics.volume.average > 0.7) {
      confidenceScore += 0.1;
    } else if (metrics.volume.average < 0.3) {
      confidenceScore -= 0.1;
    }
    
    // Determine confidence level based on score
    if (confidenceScore >= 0.8) {
      return ConfidenceLevel.VERY_HIGH;
    } else if (confidenceScore >= 0.6) {
      return ConfidenceLevel.HIGH;
    } else if (confidenceScore >= 0.4) {
      return ConfidenceLevel.MODERATE;
    } else if (confidenceScore >= 0.2) {
      return ConfidenceLevel.LOW;
    } else {
      return ConfidenceLevel.VERY_LOW;
    }
  }

  /**
   * Analyze concept understanding in text
   * 
   * @param text Text to analyze
   * @param options Student voice analysis options
   */
  private analyzeConceptUnderstanding(
    text: string,
    options: StudentVoiceAnalysisOptions
  ): number {
    // Get subject-specific concepts
    const subjectConcepts = this.getSubjectConcepts(options.subject, options.topic);
    const learningObjectives = options.learningObjectives || [];
    
    // Count concept mentions
    let conceptCount = 0;
    let objectiveCount = 0;
    
    const lowerText = text.toLowerCase();
    
    // Check for subject-specific concepts
    for (const concept of subjectConcepts) {
      if (lowerText.includes(concept.toLowerCase())) {
        conceptCount++;
      }
    }
    
    // Check for learning objectives
    for (const objective of learningObjectives) {
      const keywords = objective.toLowerCase().split(/\s+/).filter(word => 
        word.length > 3 && !['and', 'the', 'that', 'with', 'from', 'this', 'these', 'those'].includes(word)
      );
      
      let keywordMatches = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          keywordMatches++;
        }
      }
      
      if (keywords.length > 0 && keywordMatches / keywords.length >= 0.5) {
        objectiveCount++;
      }
    }
    
    // Calculate concept understanding score (0-1 scale)
    const conceptRatio = subjectConcepts.length > 0 ? conceptCount / subjectConcepts.length : 0;
    const objectiveRatio = learningObjectives.length > 0 ? objectiveCount / learningObjectives.length : 0;
    
    // Calculate weighted understanding score
    let understandingScore = 0.5; // Start at moderate
    
    if (subjectConcepts.length > 0 || learningObjectives.length > 0) {
      if (subjectConcepts.length > 0 && learningObjectives.length > 0) {
        understandingScore = (conceptRatio * 0.4) + (objectiveRatio * 0.6);
      } else if (subjectConcepts.length > 0) {
        understandingScore = conceptRatio;
      } else {
        understandingScore = objectiveRatio;
      }
    }
    
    return understandingScore;
  }

  /**
   * Calculate comprehension score
   * 
   * @param text Text to analyze
   * @param options Student voice analysis options
   */
  private calculateComprehension(
    text: string,
    options: StudentVoiceAnalysisOptions
  ): number {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated natural language understanding and concept analysis
    
    // Calculate comprehension based on concept understanding and vocabulary
    const conceptUnderstanding = this.analyzeConceptUnderstanding(text, options);
    const vocabularyMetrics = this.analyzeVocabulary(text.split(/\s+/).filter(word => word.length > 0), options);
    
    // Calculate comprehension score (0-1 scale)
    const comprehensionScore = (conceptUnderstanding * 0.7) + ((vocabularyMetrics.level / 5) * 0.3);
    
    return comprehensionScore;
  }

  /**
   * Calculate fluency score
   * 
   * @param baseResult Base voice analysis result
   * @param wordCount Number of words in text
   */
  private calculateFluency(
    baseResult: VoiceAnalysisResult,
    wordCount: number
  ): number {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated speech analysis
    
    // Calculate fluency based on speech pattern and metrics
    const speechPattern = baseResult.speechPattern;
    const metrics = baseResult.metrics;
    
    // Start with base fluency score based on speech pattern
    let fluencyScore = 0.5; // Start at moderate
    
    if (speechPattern === SpeechPatternType.FLUENT) {
      fluencyScore = 0.8;
    } else if (speechPattern === SpeechPatternType.VARIED) {
      fluencyScore = 0.7;
    } else if (speechPattern === SpeechPatternType.HESITANT) {
      fluencyScore = 0.3;
    } else if (speechPattern === SpeechPatternType.REPETITIVE) {
      fluencyScore = 0.4;
    } else if (speechPattern === SpeechPatternType.MONOTONE) {
      fluencyScore = 0.5;
    } else if (speechPattern === SpeechPatternType.RAPID) {
      fluencyScore = 0.6;
    } else if (speechPattern === SpeechPatternType.SLOW) {
      fluencyScore = 0.4;
    }
    
    // Adjust based on pauses
    if (metrics.pauses.count > 5 && wordCount > 10) {
      fluencyScore -= 0.1 * Math.min(1, (metrics.pauses.count - 5) / 10);
    }
    
    // Adjust based on speech speed
    if (metrics.speed.wordsPerMinute > 150) {
      fluencyScore += 0.1;
    } else if (metrics.speed.wordsPerMinute < 80) {
      fluencyScore -= 0.1;
    }
    
    // Ensure score is within 0-1 range
    fluencyScore = Math.max(0, Math.min(1, fluencyScore));
    
    return fluencyScore;
  }

  /**
   * Calculate attention level
   * 
   * @param baseResult Base voice analysis result
   * @param options Student voice analysis options
   */
  private calculateAttentionLevel(
    baseResult: VoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): number {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated attention analysis
    
    // Calculate attention based on engagement and speech patterns
    const engagementLevel = this.determineEngagementLevel(baseResult, options);
    const speechPattern = baseResult.speechPattern;
    
    // Start with base attention score based on engagement level
    let attentionScore = 0.5; // Start at moderate
    
    if (engagementLevel === EngagementLevel.HIGHLY_ENGAGED) {
      attentionScore = 0.9;
    } else if (engagementLevel === EngagementLevel.ENGAGED) {
      attentionScore = 0.8;
    } else if (engagementLevel === EngagementLevel.NEUTRAL) {
      attentionScore = 0.6;
    } else if (engagementLevel === EngagementLevel.DISENGAGED) {
      attentionScore = 0.3;
    } else if (engagementLevel === EngagementLevel.FRUSTRATED) {
      attentionScore = 0.4;
    } else if (engagementLevel === EngagementLevel.CONFUSED) {
      attentionScore = 0.5;
    } else if (engagementLevel === EngagementLevel.ANXIOUS) {
      attentionScore = 0.4;
    }
    
    // Adjust based on speech pattern
    if (speechPattern === SpeechPatternType.MONOTONE) {
      attentionScore -= 0.2;
    } else if (speechPattern === SpeechPatternType.HESITANT) {
      attentionScore -= 0.1;
    }
    
    // Ensure score is within 0-1 range
    attentionScore = Math.max(0, Math.min(1, attentionScore));
    
    return attentionScore;
  }

  /**
   * Generate learning style indicators
   * 
   * @param baseResult Base voice analysis result
   * @param text Text to analyze
   * @param options Student voice analysis options
   */
  private generateLearningStyleIndicators(
    baseResult: VoiceAnalysisResult,
    text: string,
    options: StudentVoiceAnalysisOptions
  ): StudentVoiceAnalysisResult['learningStyleIndicators'] {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated learning style analysis
    
    // Initialize learning style indicators with default values
    const indicators = {
      visual: 0.25,
      auditory: 0.25,
      kinesthetic: 0.25,
      readingWriting: 0.25
    };
    
    // Analyze text for learning style indicators
    const lowerText = text.toLowerCase();
    
    // Visual learning style indicators
    const visualWords = ['see', 'look', 'watch', 'view', 'appear', 'show', 'picture', 'image', 'color', 'bright'];
    let visualCount = 0;
    for (const word of visualWords) {
      if (lowerText.includes(word)) {
        visualCount++;
      }
    }
    
    // Auditory learning style indicators
    const auditoryWords = ['hear', 'listen', 'sound', 'talk', 'tell', 'say', 'speak', 'discuss', 'loud', 'quiet'];
    let auditoryCount = 0;
    for (const word of auditoryWords) {
      if (lowerText.includes(word)) {
        auditoryCount++;
      }
    }
    
    // Kinesthetic learning style indicators
    const kinestheticWords = ['feel', 'touch', 'move', 'hold', 'do', 'make', 'build', 'try', 'practice', 'experience'];
    let kinestheticCount = 0;
    for (const word of kinestheticWords) {
      if (lowerText.includes(word)) {
        kinestheticCount++;
      }
    }
    
    // Reading/writing learning style indicators
    const readingWritingWords = ['read', 'write', 'note', 'list', 'text', 'book', 'word', 'definition', 'paper', 'document'];
    let readingWritingCount = 0;
    for (const word of readingWritingWords) {
      if (lowerText.includes(word)) {
        readingWritingCount++;
      }
    }
    
    // Calculate total indicators
    const totalCount = visualCount + auditoryCount + kinestheticCount + readingWritingCount;
    
    // Update indicators based on word counts
    if (totalCount > 0) {
      indicators.visual = 0.2 + (visualCount / totalCount) * 0.6;
      indicators.auditory = 0.2 + (auditoryCount / totalCount) * 0.6;
      indicators.kinesthetic = 0.2 + (kinestheticCount / totalCount) * 0.6;
      indicators.readingWriting = 0.2 + (readingWritingCount / totalCount) * 0.6;
    }
    
    // Adjust based on speech pattern
    if (baseResult.speechPattern === SpeechPatternType.FLUENT || 
        baseResult.speechPattern === SpeechPatternType.VARIED) {
      indicators.auditory += 0.1;
    }
    
    // Normalize to ensure sum is 1.0
    const sum = indicators.visual + indicators.auditory + indicators.kinesthetic + indicators.readingWriting;
    if (sum > 0) {
      indicators.visual /= sum;
      indicators.auditory /= sum;
      indicators.kinesthetic /= sum;
      indicators.readingWriting /= sum;
    }
    
    return indicators;
  }

  /**
   * Generate support recommendations
   * 
   * @param baseResult Base voice analysis result
   * @param engagementLevel Engagement level
   * @param confidenceLevel Confidence level
   * @param vocabularyMetrics Vocabulary metrics
   * @param pronunciationAnalysis Pronunciation analysis
   * @param conceptUnderstanding Concept understanding score
   * @param options Student voice analysis options
   */
  private generateSupportRecommendations(
    baseResult: VoiceAnalysisResult,
    engagementLevel: EngagementLevel,
    confidenceLevel: ConfidenceLevel,
    vocabularyMetrics: { level: number; complexWords: number },
    pronunciationAnalysis: { accuracy: number; challengingPhonemes: string[] },
    conceptUnderstanding: number,
    options: StudentVoiceAnalysisOptions
  ): string[] {
    const recommendations: string[] = [];
    
    // Recommendations based on engagement level
    if (engagementLevel === EngagementLevel.DISENGAGED) {
      recommendations.push('Increase interactive elements to boost engagement');
      recommendations.push('Connect content to student interests to improve motivation');
    } else if (engagementLevel === EngagementLevel.CONFUSED) {
      recommendations.push('Provide clearer explanations with visual aids');
      recommendations.push('Break down complex concepts into smaller steps');
    } else if (engagementLevel === EngagementLevel.FRUSTRATED) {
      recommendations.push('Offer immediate support and encouragement');
      recommendations.push('Simplify current task and gradually increase difficulty');
    } else if (engagementLevel === EngagementLevel.ANXIOUS) {
      recommendations.push('Create a more supportive learning environment');
      recommendations.push('Provide reassurance and reduce performance pressure');
    }
    
    // Recommendations based on confidence level
    if (confidenceLevel === ConfidenceLevel.LOW || confidenceLevel === ConfidenceLevel.VERY_LOW) {
      recommendations.push('Build confidence through scaffolded success experiences');
      recommendations.push('Provide positive reinforcement for participation');
    }
    
    // Recommendations based on vocabulary
    if (vocabularyMetrics.level < 3) {
      recommendations.push('Introduce subject-specific vocabulary with visual supports');
      recommendations.push('Create opportunities to practice using key terminology');
    }
    
    // Recommendations based on pronunciation
    if (pronunciationAnalysis.accuracy < 0.7 && pronunciationAnalysis.challengingPhonemes.length > 0) {
      recommendations.push(`Provide targeted practice for challenging sounds: ${pronunciationAnalysis.challengingPhonemes.join(', ')}`);
    }
    
    // Recommendations based on concept understanding
    if (conceptUnderstanding < 0.6) {
      recommendations.push('Review fundamental concepts with alternative explanations');
      recommendations.push('Use concrete examples to illustrate abstract concepts');
    }
    
    // Recommendations based on learning style indicators
    const learningStyleIndicators = this.generateLearningStyleIndicators(baseResult, baseResult.text, options);
    const dominantStyle = Object.entries(learningStyleIndicators).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    if (dominantStyle === 'visual') {
      recommendations.push('Provide visual aids such as diagrams, charts, and videos');
    } else if (dominantStyle === 'auditory') {
      recommendations.push('Incorporate audio explanations and discussion opportunities');
    } else if (dominantStyle === 'kinesthetic') {
      recommendations.push('Include hands-on activities and interactive exercises');
    } else if (dominantStyle === 'readingWriting') {
      recommendations.push('Provide written materials and note-taking opportunities');
    }
    
    // Limit to top 5 recommendations
    if (recommendations.length > 5) {
      recommendations.splice(5);
    }
    
    return recommendations;
  }

  /**
   * Store analysis result in history
   * 
   * @param result Student voice analysis result
   * @param options Student voice analysis options
   */
  private storeAnalysisResult(
    result: StudentVoiceAnalysisResult,
    options: StudentVoiceAnalysisOptions
  ): void {
    // In a real implementation, this would store results in a database
    // For this implementation, we'll use a simple in-memory map
    
    // Generate a mock student ID if not provided
    const studentId = 'current-student';
    
    // Get or create history array for student
    const history = this.analysisHistory.get(studentId) || [];
    
    // Add result to history
    history.push(result);
    
    // Limit history size
    if (history.length > 100) {
      history.shift();
    }
    
    // Update history map
    this.analysisHistory.set(studentId, history);
  }

  /**
   * Get subject-specific vocabulary
   * 
   * @param subject Subject name
   * @param topic Topic within subject
   */
  private getSubjectVocabulary(subject?: string, topic?: string): string[] {
    if (!subject) {
      return [];
    }
    
    const lowerSubject = subject.toLowerCase();
    const subjectMap = this.vocabularyDatabase.get(lowerSubject);
    
    if (!subjectMap) {
      return [];
    }
    
    if (topic) {
      const lowerTopic = topic.toLowerCase();
      const topicVocabulary = subjectMap.get(lowerTopic);
      
      if (topicVocabulary) {
        return topicVocabulary;
      }
    }
    
    // If no specific topic or topic not found, combine all vocabulary for subject
    const allVocabulary: string[] = [];
    subjectMap.forEach((words) => {
      allVocabulary.push(...words);
    });
    
    return allVocabulary;
  }

  /**
   * Get subject-specific concepts
   * 
   * @param subject Subject name
   * @param topic Topic within subject
   */
  private getSubjectConcepts(subject?: string, topic?: string): string[] {
    if (!subject) {
      return [];
    }
    
    const lowerSubject = subject.toLowerCase();
    const subjectMap = this.conceptDatabase.get(lowerSubject);
    
    if (!subjectMap) {
      return [];
    }
    
    if (topic) {
      const lowerTopic = topic.toLowerCase();
      const topicConcepts = subjectMap.get(lowerTopic);
      
      if (topicConcepts) {
        return topicConcepts;
      }
    }
    
    // If no specific topic or topic not found, combine all concepts for subject
    const allConcepts: string[] = [];
    subjectMap.forEach((concepts) => {
      allConcepts.push(...concepts);
    });
    
    return allConcepts;
  }

  /**
   * Count syllables in a word
   * 
   * @param word Word to count syllables in
   */
  private countSyllables(word: string): number {
    // This is a simplified implementation - in a real system, this would use
    // a more sophisticated syllable counting algorithm
    
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    
    // Count vowel groups
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    let count = 0;
    let prevIsVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevIsVowel) {
        count++;
      }
      prevIsVowel = isVowel;
    }
    
    // Adjust for silent e at end
    if (word.length > 2 && word.endsWith('e') && !vowels.includes(word[word.length - 2])) {
      count--;
    }
    
    // Ensure at least one syllable
    return Math.max(1, count);
  }
}

// Export singleton instance
export const studentVoiceAnalysis = StudentVoiceAnalysis.getInstance();
