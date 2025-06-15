/**
 * Content Difficulty Assessment Service
 * 
 * This service analyzes educational video content to assess its difficulty level
 * across multiple dimensions. It provides a comprehensive difficulty profile
 * that can be used to:
 * 
 * 1. Help learners understand the complexity of content before engaging with it
 * 2. Recommend appropriate content based on a learner's current knowledge level
 * 3. Adapt learning pathways to gradually increase difficulty
 * 4. Provide instructors with insights into content complexity
 * 5. Support adaptive learning features across the platform
 */

import { ContentComplexityMetrics } from './content-complexity-analyzer';

export interface DifficultyLevel {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  numericValue: number; // 0-1 scale
  description: string;
}

export interface DifficultyDimension {
  name: string;
  score: number; // 0-1 scale
  level: DifficultyLevel;
  description: string;
}

export interface ContentDifficultyProfile {
  overallDifficulty: DifficultyLevel;
  dimensions: {
    conceptual: DifficultyDimension;
    linguistic: DifficultyDimension;
    technical: DifficultyDimension;
    prerequisite: DifficultyDimension;
    cognitive: DifficultyDimension;
  };
  keyTerms: {
    term: string;
    difficulty: number; // 0-1 scale
  }[];
  prerequisites: {
    concept: string;
    importance: number; // 0-1 scale
  }[];
  estimatedTimeToMastery: {
    beginner: number; // minutes
    intermediate: number; // minutes
    advanced: number; // minutes
  };
  suggestedPreparation: string[];
}

export interface ContentMetadata {
  title: string;
  description: string;
  subject: string;
  topics: string[];
  educationalLevel: string;
  keywords: string[];
  duration: number; // seconds
}

export interface TranscriptAnalysis {
  readabilityScore: number; // 0-1 scale (0: simple, 1: complex)
  technicalTermDensity: number; // 0-1 scale
  conceptDensity: number; // 0-1 scale
  sentenceComplexity: number; // 0-1 scale
  vocabularyLevel: number; // 0-1 scale
}

/**
 * Difficulty level definitions with descriptions
 */
const difficultyLevels: Record<string, DifficultyLevel> = {
  beginner: {
    level: 'beginner',
    numericValue: 0.25,
    description: 'Suitable for newcomers to the subject with no prior knowledge required'
  },
  intermediate: {
    level: 'intermediate',
    numericValue: 0.5,
    description: 'Builds on fundamental concepts, requiring basic subject familiarity'
  },
  advanced: {
    level: 'advanced',
    numericValue: 0.75,
    description: 'Explores complex topics in depth, requiring solid subject foundation'
  },
  expert: {
    level: 'expert',
    numericValue: 0.95,
    description: 'Covers specialized or highly technical content for experienced learners'
  }
};

/**
 * Get difficulty level based on numeric score
 */
function getDifficultyLevel(score: number): DifficultyLevel {
  if (score < 0.3) return difficultyLevels.beginner;
  if (score < 0.6) return difficultyLevels.intermediate;
  if (score < 0.85) return difficultyLevels.advanced;
  return difficultyLevels.expert;
}

/**
 * Analyze transcript for linguistic complexity
 * 
 * In a real implementation, this would use NLP techniques to analyze
 * readability, technical term density, sentence complexity, etc.
 */
function analyzeTranscriptComplexity(transcript: string): TranscriptAnalysis {
  // This is a simplified implementation for demonstration purposes
  // In a real system, this would use NLP libraries and more sophisticated analysis
  
  // Count words, sentences, and paragraphs
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = transcript.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Calculate average sentence length
  const avgSentenceLength = words.length / sentences.length;
  
  // Calculate average word length
  const avgWordLength = words.join('').length / words.length;
  
  // Count technical terms (simplified - just counting words with 8+ characters)
  const technicalTerms = words.filter(w => w.length >= 8);
  const technicalTermDensity = technicalTerms.length / words.length;
  
  // Calculate readability score (simplified)
  // In a real implementation, this would use established readability formulas
  // like Flesch-Kincaid, SMOG, or Coleman-Liau
  const readabilityScore = Math.min(
    1, 
    ((avgSentenceLength / 15) * 0.5) + ((avgWordLength / 6) * 0.5)
  );
  
  // Calculate sentence complexity (simplified)
  const sentenceComplexity = Math.min(
    1,
    avgSentenceLength / 25
  );
  
  // Calculate concept density (simplified)
  // In a real implementation, this would identify concept terms and their relationships
  const conceptDensity = Math.min(
    1,
    (technicalTermDensity * 0.7) + (readabilityScore * 0.3)
  );
  
  // Calculate vocabulary level (simplified)
  const vocabularyLevel = Math.min(
    1,
    (avgWordLength / 7) * 0.8
  );
  
  return {
    readabilityScore,
    technicalTermDensity,
    conceptDensity,
    sentenceComplexity,
    vocabularyLevel
  };
}

/**
 * Extract key terms from transcript with difficulty ratings
 */
function extractKeyTerms(transcript: string, subject: string): { term: string; difficulty: number }[] {
  // In a real implementation, this would use NLP and domain-specific knowledge
  // to identify key terms and assess their difficulty
  
  // For this demo, we'll return simulated data
  // In a production system, this would be much more sophisticated
  
  // Simplified key term extraction (just looking for capitalized phrases)
  const potentialTerms = transcript.match(/[A-Z][a-z]+ [A-Za-z]+|[A-Z][a-z]+/g) || [];
  
  // Deduplicate terms
  const uniqueTerms = Array.from(new Set(potentialTerms));
  
  // Assign difficulty ratings (simplified)
  return uniqueTerms.slice(0, 10).map(term => {
    // Assign difficulty based on term length and complexity
    const difficulty = Math.min(
      0.95,
      0.3 + (term.length / 20) + (term.includes(' ') ? 0.2 : 0)
    );
    
    return {
      term,
      difficulty
    };
  });
}

/**
 * Identify prerequisites for understanding the content
 */
function identifyPrerequisites(
  transcript: string, 
  keyTerms: { term: string; difficulty: number }[],
  subject: string
): { concept: string; importance: number }[] {
  // In a real implementation, this would use a knowledge graph or domain model
  // to identify prerequisite concepts
  
  // For this demo, we'll return simulated data based on the subject
  // In a production system, this would be much more sophisticated
  
  // Sample prerequisites for different subjects
  const subjectPrerequisites: Record<string, { concept: string; importance: number }[]> = {
    'mathematics': [
      { concept: 'Algebra fundamentals', importance: 0.9 },
      { concept: 'Basic arithmetic', importance: 0.8 },
      { concept: 'Understanding of variables', importance: 0.7 },
      { concept: 'Function notation', importance: 0.6 }
    ],
    'biology': [
      { concept: 'Cell structure', importance: 0.9 },
      { concept: 'Basic chemistry', importance: 0.8 },
      { concept: 'Scientific method', importance: 0.7 },
      { concept: 'Classification systems', importance: 0.6 }
    ],
    'physics': [
      { concept: 'Newton\'s laws of motion', importance: 0.9 },
      { concept: 'Basic algebra and calculus', importance: 0.8 },
      { concept: 'Understanding of forces', importance: 0.7 },
      { concept: 'Unit conversion', importance: 0.6 }
    ],
    'computer science': [
      { concept: 'Basic programming concepts', importance: 0.9 },
      { concept: 'Boolean logic', importance: 0.8 },
      { concept: 'Data types and variables', importance: 0.7 },
      { concept: 'Algorithm fundamentals', importance: 0.6 }
    ],
    'psychology': [
      { concept: 'Research methods', importance: 0.9 },
      { concept: 'Basic statistics', importance: 0.8 },
      { concept: 'Brain structure and function', importance: 0.7 },
      { concept: 'Psychological theories', importance: 0.6 }
    ]
  };
  
  // Return prerequisites for the subject, or generic ones if subject not found
  return subjectPrerequisites[subject.toLowerCase()] || [
    { concept: 'Basic understanding of the subject', importance: 0.9 },
    { concept: 'Critical thinking skills', importance: 0.8 },
    { concept: 'Reading comprehension', importance: 0.7 },
    { concept: 'Note-taking skills', importance: 0.6 }
  ];
}

/**
 * Calculate estimated time to mastery based on difficulty and content length
 */
function calculateTimeToMastery(
  overallDifficulty: number,
  contentDuration: number
): { beginner: number; intermediate: number; advanced: number } {
  // Base multiplier for different learner levels
  const beginnerMultiplier = 3.0 + overallDifficulty * 2;
  const intermediateMultiplier = 2.0 + overallDifficulty;
  const advancedMultiplier = 1.0 + overallDifficulty * 0.5;
  
  // Convert content duration from seconds to minutes
  const durationMinutes = contentDuration / 60;
  
  // Calculate estimated time to mastery
  return {
    beginner: Math.round(durationMinutes * beginnerMultiplier),
    intermediate: Math.round(durationMinutes * intermediateMultiplier),
    advanced: Math.round(durationMinutes * advancedMultiplier)
  };
}

/**
 * Generate suggested preparation activities based on difficulty profile
 */
function generateSuggestedPreparation(
  difficultyProfile: ContentDifficultyProfile
): string[] {
  const suggestions: string[] = [];
  
  // Add suggestions based on overall difficulty
  if (difficultyProfile.overallDifficulty.level === 'advanced' || 
      difficultyProfile.overallDifficulty.level === 'expert') {
    suggestions.push('Review the prerequisite concepts before starting this content');
    suggestions.push('Take notes during the video to aid comprehension');
    suggestions.push('Consider watching at a slower playback speed for complex sections');
  }
  
  // Add suggestions based on specific dimensions
  if (difficultyProfile.dimensions.conceptual.score > 0.7) {
    suggestions.push('Create a concept map to visualize relationships between ideas');
    suggestions.push('Break down complex concepts into smaller, manageable parts');
  }
  
  if (difficultyProfile.dimensions.linguistic.score > 0.7) {
    suggestions.push('Keep a glossary of technical terms encountered in the video');
    suggestions.push('Use the transcript to review complex explanations');
  }
  
  if (difficultyProfile.dimensions.technical.score > 0.7) {
    suggestions.push('Practice with examples to reinforce technical concepts');
    suggestions.push('Seek additional resources for technical demonstrations');
  }
  
  if (difficultyProfile.dimensions.prerequisite.score > 0.7) {
    suggestions.push('Review foundational concepts before proceeding');
    suggestions.push('Consider taking an introductory course first');
  }
  
  // Add suggestions based on prerequisites
  if (difficultyProfile.prerequisites.length > 0) {
    const highImportancePrereqs = difficultyProfile.prerequisites
      .filter(p => p.importance > 0.7)
      .map(p => p.concept);
    
    if (highImportancePrereqs.length > 0) {
      suggestions.push(`Ensure you understand these key concepts: ${highImportancePrereqs.join(', ')}`);
    }
  }
  
  return suggestions;
}

/**
 * Assess content difficulty based on transcript, complexity metrics, and metadata
 */
export function assessContentDifficulty(
  transcript: string,
  complexityMetrics: ContentComplexityMetrics,
  metadata: ContentMetadata
): ContentDifficultyProfile {
  // Analyze transcript for linguistic complexity
  const transcriptAnalysis = analyzeTranscriptComplexity(transcript);
  
  // Extract key terms with difficulty ratings
  const keyTerms = extractKeyTerms(transcript, metadata.subject);
  
  // Identify prerequisites
  const prerequisites = identifyPrerequisites(transcript, keyTerms, metadata.subject);
  
  // Calculate difficulty dimensions
  
  // 1. Conceptual Difficulty
  const conceptualDifficulty = Math.min(
    0.95,
    (complexityMetrics.conceptDifficulty * 0.6) +
    (transcriptAnalysis.conceptDensity * 0.4)
  );
  
  // 2. Linguistic Difficulty
  const linguisticDifficulty = Math.min(
    0.95,
    (transcriptAnalysis.readabilityScore * 0.3) +
    (transcriptAnalysis.vocabularyLevel * 0.3) +
    (transcriptAnalysis.sentenceComplexity * 0.4)
  );
  
  // 3. Technical Difficulty
  const technicalDifficulty = Math.min(
    0.95,
    (complexityMetrics.informationDensity * 0.4) +
    (transcriptAnalysis.technicalTermDensity * 0.4) +
    (complexityMetrics.visualComplexity * 0.2)
  );
  
  // 4. Prerequisite Knowledge Difficulty
  const prerequisiteDifficulty = Math.min(
    0.95,
    prerequisites.reduce((sum, prereq) => sum + prereq.importance, 0) / 
    Math.max(1, prerequisites.length)
  );
  
  // 5. Cognitive Load Difficulty
  const cognitiveDifficulty = Math.min(
    0.95,
    (complexityMetrics.informationDensity * 0.3) +
    (complexityMetrics.speechRate * 0.2) +
    (conceptualDifficulty * 0.3) +
    (technicalDifficulty * 0.2)
  );
  
  // Calculate overall difficulty
  const overallDifficulty = Math.min(
    0.95,
    (conceptualDifficulty * 0.25) +
    (linguisticDifficulty * 0.2) +
    (technicalDifficulty * 0.2) +
    (prerequisiteDifficulty * 0.2) +
    (cognitiveDifficulty * 0.15)
  );
  
  // Calculate estimated time to mastery
  const timeToMastery = calculateTimeToMastery(overallDifficulty, metadata.duration);
  
  // Create difficulty profile
  const difficultyProfile: ContentDifficultyProfile = {
    overallDifficulty: getDifficultyLevel(overallDifficulty),
    dimensions: {
      conceptual: {
        name: 'Conceptual Complexity',
        score: conceptualDifficulty,
        level: getDifficultyLevel(conceptualDifficulty),
        description: 'The complexity of ideas and concepts presented'
      },
      linguistic: {
        name: 'Linguistic Complexity',
        score: linguisticDifficulty,
        level: getDifficultyLevel(linguisticDifficulty),
        description: 'The complexity of language and vocabulary used'
      },
      technical: {
        name: 'Technical Complexity',
        score: technicalDifficulty,
        level: getDifficultyLevel(technicalDifficulty),
        description: 'The complexity of technical content and procedures'
      },
      prerequisite: {
        name: 'Prerequisite Knowledge',
        score: prerequisiteDifficulty,
        level: getDifficultyLevel(prerequisiteDifficulty),
        description: 'The level of prior knowledge required'
      },
      cognitive: {
        name: 'Cognitive Load',
        score: cognitiveDifficulty,
        level: getDifficultyLevel(cognitiveDifficulty),
        description: 'The mental effort required to process the content'
      }
    },
    keyTerms,
    prerequisites,
    estimatedTimeToMastery: timeToMastery,
    suggestedPreparation: generateSuggestedPreparation({
      overallDifficulty: getDifficultyLevel(overallDifficulty),
      dimensions: {
        conceptual: {
          name: 'Conceptual Complexity',
          score: conceptualDifficulty,
          level: getDifficultyLevel(conceptualDifficulty),
          description: 'The complexity of ideas and concepts presented'
        },
        linguistic: {
          name: 'Linguistic Complexity',
          score: linguisticDifficulty,
          level: getDifficultyLevel(linguisticDifficulty),
          description: 'The complexity of language and vocabulary used'
        },
        technical: {
          name: 'Technical Complexity',
          score: technicalDifficulty,
          level: getDifficultyLevel(technicalDifficulty),
          description: 'The complexity of technical content and procedures'
        },
        prerequisite: {
          name: 'Prerequisite Knowledge',
          score: prerequisiteDifficulty,
          level: getDifficultyLevel(prerequisiteDifficulty),
          description: 'The level of prior knowledge required'
        },
        cognitive: {
          name: 'Cognitive Load',
          score: cognitiveDifficulty,
          level: getDifficultyLevel(cognitiveDifficulty),
          description: 'The mental effort required to process the content'
        }
      },
      keyTerms,
      prerequisites,
      estimatedTimeToMastery: timeToMastery,
      suggestedPreparation: []
    })
  };
  
  return difficultyProfile;
}

/**
 * Get content metadata from video ID
 * 
 * In a real implementation, this would fetch metadata from a database
 */
export async function getContentMetadata(videoId: string): Promise<ContentMetadata> {
  // This is a simplified implementation for demonstration purposes
  // In a real system, this would fetch metadata from a database or API
  
  // Sample metadata for demo videos
  const sampleMetadata: Record<string, ContentMetadata> = {
    'educational-psychology-intro': {
      title: 'Introduction to Educational Psychology',
      description: 'An overview of key concepts in educational psychology and their application in modern classrooms.',
      subject: 'Psychology',
      topics: ['Educational Psychology', 'Learning Theory', 'Cognitive Development'],
      educationalLevel: 'Undergraduate',
      keywords: ['psychology', 'education', 'learning', 'development', 'cognition'],
      duration: 600 // 10 minutes
    },
    'photosynthesis-explained': {
      title: 'Photosynthesis Explained',
      description: 'A detailed explanation of the photosynthesis process in plants.',
      subject: 'Biology',
      topics: ['Photosynthesis', 'Plant Biology', 'Cellular Processes'],
      educationalLevel: 'Secondary',
      keywords: ['biology', 'photosynthesis', 'plants', 'chlorophyll', 'cellular respiration'],
      duration: 480 // 8 minutes
    }
  };
  
  // Extract video name from ID or URL
  const videoName = videoId.split('/').pop()?.split('.')[0] || videoId;
  
  // Return metadata for the video, or generic metadata if not found
  return sampleMetadata[videoName] || {
    title: 'Educational Video',
    description: 'Educational content for learning purposes.',
    subject: 'General Education',
    topics: ['Education'],
    educationalLevel: 'All Levels',
    keywords: ['education', 'learning'],
    duration: 300 // 5 minutes
  };
}

/**
 * Main function to assess video content difficulty
 */
export async function getContentDifficultyProfile(
  videoId: string,
  transcript: string,
  complexityMetrics: ContentComplexityMetrics
): Promise<ContentDifficultyProfile> {
  // Get content metadata
  const metadata = await getContentMetadata(videoId);
  
  // Assess content difficulty
  return assessContentDifficulty(transcript, complexityMetrics, metadata);
}