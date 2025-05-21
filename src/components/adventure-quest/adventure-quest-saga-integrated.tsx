'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Dialogue, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialogue";
import { 
  Sword, 
  Map, 
  Trophy, 
  Star, 
  BookOpen, 
  Users, 
  Compass, 
  Sparkles,
  Award,
  Backpack,
  Scroll,
  Zap,
  Heart,
  Brain,
  Lightbulb,
  Puzzle,
  Milestone,
  Hourglass
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';
import { useCurriculum } from '../curriculum/curriculum-context';
import { useGamification } from '../gamification/gamification-context';
import { useAssessment } from '../assessment/assessment-context';

/**
 * Adventure Quest Saga - Gamified Learning Adventure System
 * 
 * This component provides an immersive, gamified learning experience that adapts
 * to individual learning styles and educational needs while maintaining alignment
 * with UK curriculum standards.
 * 
 * Integration points:
 * - Curriculum Module: Connects quests to curriculum standards and learning objectives
 * - Gamification System: Links with rewards, achievements, and progression systems
 * - Assessment Module: Ties quest challenges to formative and summative assessments
 * - User Profiles: Personalizes experiences based on learner data and preferences
 * - Subscription System: Manages feature access based on subscription tier
 */

// Character types with their attributes and starting bonuses
const characterTypes = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Curious and adventurous, Explorers excel at discovering new knowledge and connections.',
    icon: <Compass className="h-8 w-8" />,
    startingStats: {
      curiosity: 8,
      creativity: 6,
      persistence: 5,
      collaboration: 4,
      analysis: 5
    },
    bonuses: ['10% faster exploration of new topics', 'Bonus rewards for discovering connections between subjects']
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Methodical and analytical, Scholars excel at deep understanding and critical thinking.',
    icon: <BookOpen className="h-8 w-8" />,
    startingStats: {
      curiosity: 6,
      creativity: 4,
      persistence: 7,
      collaboration: 3,
      analysis: 8
    },
    bonuses: ['15% bonus to knowledge retention', 'Unlocks advanced research quests earlier']
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Imaginative and expressive, Creators excel at innovative solutions and artistic approaches.',
    icon: <Sparkles className="h-8 w-8" />,
    startingStats: {
      curiosity: 7,
      creativity: 9,
      persistence: 4,
      collaboration: 5,
      analysis: 3
    },
    bonuses: ['20% bonus to creative challenges', 'Can transform standard quests into creative projects']
  },
  {
    id: 'collaborator',
    name: 'Collaborator',
    description: 'Supportive and communicative, Collaborators excel at team challenges and knowledge sharing.',
    icon: <Users className="h-8 w-8" />,
    startingStats: {
      curiosity: 5,
      creativity: 6,
      persistence: 4,
      collaboration: 9,
      analysis: 4
    },
    bonuses: ['25% bonus when completing team quests', 'Can invite friends to join individual quests']
  },
  {
    id: 'achiever',
    name: 'Achiever',
    description: 'Determined and focused, Achievers excel at completing goals and overcoming challenges.',
    icon: <Trophy className="h-8 w-8" />,
    startingStats: {
      curiosity: 4,
      creativity: 3,
      persistence: 9,
      collaboration: 5,
      analysis: 7
    },
    bonuses: ['15% faster quest completion', 'Bonus rewards for streak achievements']
  }
];

// Quest difficulty levels
const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-500' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-blue-500' },
  { id: 'advanced', name: 'Advanced', color: 'bg-purple-500' },
  { id: 'expert', name: 'Expert', color: 'bg-red-500' },
  { id: 'master', name: 'Master', color: 'bg-amber-500' }
];

// Learning styles
const learningStyles = [
  { id: 'visual', name: 'Visual', icon: <Eye className="h-4 w-4" /> },
  { id: 'auditory', name: 'Auditory', icon: <EarIcon className="h-4 w-4" /> },
  { id: 'reading_writing', name: 'Reading/Writing', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'kinesthetic', name: 'Kinesthetic', icon: <HandIcon className="h-4 w-4" /> }
];

// Custom icons
const EarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
  </svg>
);

const HandIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

// Integration with Curriculum Module
const useCurriculumQuests = (curriculumContext) => {
  const [curriculumQuests, setCurriculumQuests] = useState([]);
  
  useEffect(() => {
    if (!curriculumContext) return;
    
    // Generate quests based on curriculum objectives
    const generateCurriculumQuests = async () => {
      try {
        // Get curriculum standards from context
        const { standards, subjects, keyStages } = curriculumContext;
        
        // Transform curriculum standards into quest objectives
        const quests = standards.map((standard, index) => ({
          id: `cq-${index}`,
          title: standard.title || `${standard.subject} Adventure: ${standard.code}`,
          description: standard.description || `Explore the world of ${standard.subject} through an exciting adventure aligned with curriculum standard ${standard.code}.`,
          difficulty: mapDifficultyFromStandard(standard),
          subject: standard.subject,
          keyStage: standard.keyStage,
          duration: estimateDurationFromStandard(standard),
          xpReward: calculateXpReward(standard),
          learningStyles: determineLearningStyles(standard),
          objectives: extractObjectives(standard),
          chapters: generateChaptersFromStandard(standard),
          rewards: generateRewardsFromStandard(standard),
          progress: 0,
          unlocked: isUnlocked(standard),
          curriculumCode: standard.code,
          curriculumLink: standard.link
        }));
        
        setCurriculumQuests(quests);
      } catch (error) {
        console.error("Error generating curriculum quests:", error);
      }
    };
    
    generateCurriculumQuests();
  }, [curriculumContext]);
  
  return curriculumQuests;
};

// Helper functions for curriculum integration
const mapDifficultyFromStandard = (standard) => {
  // Map curriculum complexity to quest difficulty
  const complexityMap = {
    1: 'beginner',
    2: 'beginner',
    3: 'intermediate',
    4: 'intermediate',
    5: 'advanced',
    6: 'advanced',
    7: 'expert',
    8: 'expert',
    9: 'master',
    10: 'master'
  };
  
  return complexityMap[standard.complexity] || 'intermediate';
};

const estimateDurationFromStandard = (standard) => {
  // Estimate quest duration based on standard scope
  const baseTime = 30; // minutes
  const scopeFactor = standard.scope || 1;
  const totalMinutes = baseTime * scopeFactor;
  
  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  }
};

const calculateXpReward = (standard) => {
  // Calculate XP reward based on standard complexity and scope
  const baseXp = 50;
  const complexityFactor = standard.complexity || 1;
  const scopeFactor = standard.scope || 1;
  
  return Math.round(baseXp * complexityFactor * scopeFactor);
};

const determineLearningStyles = (standard) => {
  // Determine appropriate learning styles based on standard content
  const styles = [];
  
  if (standard.visualElements) styles.push('visual');
  if (standard.auditoryElements) styles.push('auditory');
  if (standard.textualElements) styles.push('reading_writing');
  if (standard.practicalElements) styles.push('kinesthetic');
  
  // Ensure at least one learning style
  if (styles.length === 0) {
    // Default to visual and reading/writing if no specific styles indicated
    return ['visual', 'reading_writing'];
  }
  
  return styles;
};

const extractObjectives = (standard) => {
  // Extract learning objectives from curriculum standard
  if (standard.objectives && Array.isArray(standard.objectives)) {
    return standard.objectives.slice(0, 5); // Limit to 5 objectives
  }
  
  // Generate default objectives if none provided
  return [
    `Understand key concepts in ${standard.subject}`,
    `Apply knowledge to solve problems related to ${standard.topic || standard.subject}`,
    `Develop critical thinking skills through ${standard.subject} challenges`
  ];
};

const generateChaptersFromStandard = (standard) => {
  // Generate quest chapters based on curriculum standard structure
  if (standard.units && Array.isArray(standard.units)) {
    return standard.units.slice(0, 5).map((unit, index) => ({
      id: `ch-${standard.code}-${index}`,
      title: unit.title || `Chapter ${index + 1}`,
      description: unit.description || `Explore the concepts of ${unit.title || 'this chapter'} through interactive challenges.`,
      challenges: unit.challengeCount || Math.floor(Math.random() * 3) + 3,
      completed: false
    }));
  }
  
  // Generate default chapters if none provided
  return [
    {
      id: `ch-${standard.code}-1`,
      title: 'Foundations',
      description: `Build a strong foundation in ${standard.subject} concepts.`,
      challenges: 3,
      completed: false
    },
    {
      id: `ch-${standard.code}-2`,
      title: 'Exploration',
      description: `Explore and experiment with ${standard.subject} principles.`,
      challenges: 4,
      completed: false
    },
    {
      id: `ch-${standard.code}-3`,
      title: 'Mastery',
      description: `Demonstrate mastery of ${standard.subject} through challenging applications.`,
      challenges: 5,
      completed: false
    }
  ];
};

const generateRewardsFromStandard = (standard) => {
  // Generate rewards based on curriculum standard
  const rewards = [];
  
  // Badge reward
  rewards.push({
    type: 'badge',
    name: `${standard.subject} Explorer`,
    icon: <Award className="h-4 w-4" />
  });
  
  // Item reward
  rewards.push({
    type: 'item',
    name: `${standard.subject} Toolkit`,
    icon: <Backpack className="h-4 w-4" />
  });
  
  // Skill reward
  rewards.push({
    type: 'skill',
    name: `${standard.subject} Mastery +1`,
    icon: <Brain className="h-4 w-4" />
  });
  
  return rewards;
};

const isUnlocked = (standard) => {
  // Determine if quest should be unlocked based on prerequisites
  if (!standard.prerequisites || standard.prerequisites.length === 0) {
    return true; // No prerequisites, so unlocked by default
  }
  
  // In a real implementation, this would check if prerequisites are completed
  // For now, randomly unlock some quests
  return Math.random() > 0.3;
};

// Integration with Gamification System
const useGamificationIntegration = (gamificationContext, character, setCharacter) => {
  useEffect(() => {
    if (!gamificationContext || !character) return;
    
    // Sync character progression with gamification system
    const syncCharacterWithGamification = async () => {
      try {
        // Get user's gamification profile
        const { profile, achievements, points, level } = gamificationContext;
        
        // Update character based on gamification data
        const updatedCharacter = {
          ...character,
          level: level || character.level,
          xp: points || character.xp,
          xpToNextLevel: calculateXpToNextLevel(level || character.level),
          badges: mergeGamificationAchievements(character.badges, achievements),
          completedQuests: achievements?.filter(a => a.type === 'quest_completion')?.length || character.completedQuests
        };
        
        setCharacter(updatedCharacter);
        
      } catch (error) {
        console.error("Error syncing character with gamification:", error);
      }
    };
    
    syncCharacterWithGamification();
  }, [gamificationContext, character, setCharacter]);
  
  // Function to award XP and achievements
  const awardQuestProgress = async (quest, progressType, amount = 1) => {
    if (!gamificationContext || !character) return;
    
    try {
      // Define progress types and their XP values
      const progressValues = {
        challenge_complete: 10,
        chapter_complete: 50,
        quest_complete: quest.xpReward || 100
      };
      
      // Calculate XP to award
      const xpToAward = progressValues[progressType] || 0;
      
      // Update gamification system
      await gamificationContext.awardPoints(xpToAward, {
        source: 'adventure_quest',
        questId: quest.id,
        progressType
      });
      
      // For chapter or quest completion, award achievements
      if (progressType === 'chapter_complete' || progressType === 'quest_complete') {
        await gamificationContext.awardAchievement({
          id: `${progressType}_${quest.id}`,
          name: progressType === 'chapter_complete' 
            ? `${quest.title} Chapter Explorer` 
            : `${quest.title} Champion`,
          description: progressType === 'chapter_complete'
            ? `Completed a chapter in the ${quest.title} quest`
            : `Completed the ${quest.title} quest`,
          type: progressType,
          questId: quest.id,
          timestamp: new Date().toISOString()
        });
      }
      
      // Update character locally for immediate feedback
      setCharacter(prev => {
        const newXp = prev.xp + xpToAward;
        const xpToNextLevel = calculateXpToNextLevel(prev.level);
        let newLevel = prev.level;
        
        // Level up if enough XP
        if (newXp >= xpToNextLevel) {
          newLevel += 1;
        }
        
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
          completedQuests: progressType === 'quest_complete' 
            ? prev.completedQuests + 1 
            : prev.completedQuests
        };
      });
      
    } catch (error) {
      console.error("Error awarding quest progress:", error);
    }
  };
  
  return { awardQuestProgress };
};

// Helper functions for gamification integration
const calculateXpToNextLevel = (currentLevel) => {
  // Calculate XP required for next level using a progressive formula
  const baseXp = 100;
  const scaleFactor = 1.5;
  
  return Math.round(baseXp * Math.pow(scaleFactor, currentLevel));
};

const mergeGamificationAchievements = (characterBadges, gamificationAchievements) => {
  if (!gamificationAchievements || !Array.isArray(gamificationAchievements)) {
    return characterBadges;
  }
  
  // Convert achievements to badges format
  const achievementBadges = gamificationAchievements.map(achievement => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: getBadgeIconForAchievement(achievement)
  }));
  
  // Merge with existing badges, avoiding duplicates
  const existingIds = new Set(characterBadges.map(badge => badge.id));
  const newBadges = achievementBadges.filter(badge => !existingIds.has(badge.id));
  
  return [...characterBadges, ...newBadges];
};

const getBadgeIconForAchievement = (achievement) => {
  // Select appropriate icon based on achievement type
  switch (achievement.type) {
    case 'quest_completion':
      return <Trophy className="h-4 w-4" />;
    case 'chapter_complete':
      return <BookOpen className="h-4 w-4" />;
    case 'skill_mastery':
      return <Brain className="h-4 w-4" />;
    case 'collaboration':
      return <Users className="h-4 w-4" />;
    case 'creativity':
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
};

// Integration with Assessment Module
const useAssessmentIntegration = (assessmentContext, quests, setQuests) => {
  useEffect(() => {
    if (!assessmentContext || !quests || quests.length === 0) return;
    
    // Link quests with assessment data
    const linkQuestsWithAssessments = async () => {
      try {
        // Get assessment data from context
        const { assessments, results } = assessmentContext;
        
        if (!assessments || !results) return;
        
        // Update quests with assessment data
        const updatedQuests = quests.map(quest => {
          // Find related assessments for this quest
          const relatedAssessments = assessments.filter(assessment => 
            assessment.subject === quest.subject && 
            assessment.keyStage === quest.keyStage
          );
          
          // Find user's results for related assessments
          const userResults = relatedAssessments.map(assessment => {
            const result = results.find(r => r.assessmentId === assessment.id);
            return result ? { assessment, result } : null;
          }).filter(Boolean);
          
          // Calculate quest progress based on assessment results
          let progress = 0;
          if (userResults.length > 0) {
            const averageScore = userResults.reduce((sum, { result }) => 
              sum + (result.score / result.maxScore) * 100, 0
            ) / userResults.length;
            
            progress = Math.round(averageScore);
          }
          
          // Determine if quest should be unlocked based on prerequisites
          let unlocked = quest.unlocked;
          if (quest.prerequisites) {
            const prerequisitesMet = quest.prerequisites.every(prereq => {
              const prereqAssessment = assessments.find(a => a.id === prereq.assessmentId);
              if (!prereqAssessment) return false;
              
              const prereqResult = results.find(r => r.assessmentId === prereq.assessmentId);
              if (!prereqResult) return false;
              
              return (prereqResult.score / prereqResult.maxScore) * 100 >= prereq.requiredScore;
            });
            
            unlocked = prerequisitesMet;
          }
          
          return {
            ...quest,
            progress,
            unlocked,
            assessments: relatedAssessments.map(a => a.id),
            results: userResults.map(({ assessment, result }) => ({
              assessmentId: assessment.id,
              score: result.score,
              maxScore: result.maxScore,
              completedAt: result.completedAt
            }))
          };
        });
        
        setQuests(updatedQuests);
        
      } catch (error) {
        console.error("Error linking quests with assessments:", error);
      }
    };
    
    linkQuestsWithAssessments();
  }, [assessmentContext, quests, setQuests]);
  
  // Function to create assessment from quest challenge
  const createAssessmentFromChallenge = async (quest, chapter, challengeIndex) => {
    if (!assessmentContext) return null;
    
    try {
      // Generate assessment from quest challenge
      const assessment = {
        title: `${quest.title}: ${chapter.title} - Challenge ${challengeIndex + 1}`,
        description: `Assessment for challenge ${challengeIndex + 1} in the ${chapter.title} chapter of ${quest.title}`,
        subject: quest.subject,
        keyStage: quest.keyStage,
        duration: 15, // minutes
        questId: quest.id,
        chapterId: chapter.id,
        challengeIndex,
        questions: await generateQuestionsForChallenge(quest, chapter, challengeIndex)
      };
      
      // Create assessment in assessment system
      const createdAssessment = await assessmentContext.createAssessment(assessment);
      
      return createdAssessment;
      
    } catch (error) {
      console.error("Error creating assessment from challenge:", error);
      return null;
    }
  };
  
  return { createAssessmentFromChallenge };
};

// Helper function for assessment integration
const generateQuestionsForChallenge = async (quest, chapter, challengeIndex) => {
  // In a real implementation, this would generate questions based on the quest content
  // For now, return placeholder questions
  return [
    {
      type: 'multiple_choice',
      text: `Question about ${quest.subject} related to ${chapter.title}`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
      ],
      correctAnswer: 0,
      points: 10
    },
    {
      type: 'true_false',
      text: `True or false question about ${quest.subject}`,
      correctAnswer: true,
      points: 5
    },
    {
      type: 'short_answer',
      text: `Short answer question about ${chapter.title}`,
      sampleAnswer: 'Sample correct answer',
      points: 15
    }
  ];
};

// Mock quests data for development
const mockQuests = [
  {
    id: 'q1',
    title: 'The Mathematical Mystery',
    description: 'Embark on an adventure to uncover the secrets of mathematical patterns in the world around us.',
    difficulty: 'beginner',
    subject: 'Mathematics',
    keyStage: 'KS2',
    duration: '2-3 hours',
    xpReward: 150,
    learningStyles: ['visual', 'kinesthetic'],
    objectives: [
      'Understand basic number patterns',
      'Apply mathematical thinking to real-world problems',
      'Develop problem-solving strategies'
    ],
    chapters: [
      {
        id: 'c1',
        title: 'The Pattern Palace',
        description: 'Explore the Pattern Palace to discover the fundamental building blocks of mathematics.',
        challenges: 3,
        completed: false
      },
      {
        id: 'c2',
        title: 'The Sequence Sanctuary',
        description: 'Navigate through the Sequence Sanctuary to understand how patterns evolve and grow.',
        challenges: 4,
        completed: false
      },
      {
        id: 'c3',
        title: 'The Problem-Solving Peaks',
        description: 'Climb the Problem-Solving Peaks to apply your knowledge to increasingly complex challenges.',
        challenges: 5,
        completed: false
      }
    ],
    rewards: [
      { type: 'badge', name: 'Pattern Spotter', icon: <Puzzle className="h-4 w-4" /> },
      { type: 'item', name: 'Mathematical Compass', icon: <Compass className="h-4 w-4" /> },
      { type: 'skill', name: 'Pattern Recognition +1', icon: <Brain className="h-4 w-4" /> }
    ],
    progress: 0,
    unlocked: true,
    curriculumCode: 'MA2-1',
    curriculumLink: '/curriculum/mathematics/ks2/patterns'
  },
  {
    id: 'q2',
    title: 'The Literary Labyrinth',
    description: 'Journey through a maze of stories, poems, and literary devices to enhance your language skills.',
    difficulty: 'intermediate',
    subject: 'English',
    keyStage: 'KS2',
    duration: '3-4 hours',
    xpReward: 200,
    learningStyles: ['reading_writing', 'auditory'],
    objectives: [
      'Analyse different types of texts',
      'Identify and use literary devices',
      'Develop creative writing skills'
    ],
    chapters: [
      {
        id: 'c1',
        title: 'The Narrative Nexus',
        description: 'Explore the Narrative Nexus to understand the structure and elements of compelling stories.',
        challenges: 4,
        completed: false
      },
      {
        id: 'c2',
        title: 'The Poetry Pavilion',
        description: 'Visit the Poetry Pavilion to discover the rhythm, rhyme, and power of poetic expression.',
        challenges: 3,
        completed: false
      },
      {
        id: 'c3',
        title: 'The Creative Crucible',
        description: 'Enter the Creative Crucible to forge your own literary masterpieces.',
        challenges: 5,
        completed: false
      }
    ],
    rewards: [
      { type: 'badge', name: 'Wordsmith', icon: <BookOpen className="h-4 w-4" /> },
      { type: 'item', name: 'Enchanted Quill', icon: <Scroll className="h-4 w-4" /> },
      { type: 'skill', name: 'Creative Expression +1', icon: <Sparkles className="h-4 w-4" /> }
    ],
    progress: 0,
    unlocked: true,
    curriculumCode: 'EN2-1',
    curriculumLink: '/curriculum/english/ks2/literature'
  },
  {
    id: 'q3',
    title: 'The Scientific Expedition',
    description: 'Embark on a scientific journey to explore the natural world and discover the principles that govern it.',
    difficulty: 'intermediate',
    subject: 'Science',
    keyStage: 'KS2',
    duration: '3-4 hours',
    xpReward: 200,
    learningStyles: ['visual', 'kinesthetic'],
    objectives: [
      'Understand scientific method',
      'Conduct simple experiments',
      'Analyse and interpret results'
    ],
    chapters: [
      {
        id: 'c1',
        title: 'The Observation Outpost',
        description: 'Begin at the Observation Outpost to learn how to carefully observe the world around you.',
        challenges: 3,
        completed: false
      },
      {
        id: 'c2',
        title: 'The Experiment Enclave',
        description: 'Enter the Experiment Enclave to design and conduct your own scientific investigations.',
        challenges: 4,
        completed: false
      },
      {
        id: 'c3',
        title: 'The Discovery Domain',
        description: 'Reach the Discovery Domain to analyse your findings and draw meaningful conclusions.',
        challenges: 4,
        completed: false
      }
    ],
    rewards: [
      { type: 'badge', name: 'Junior Scientist', icon: <Lightbulb className="h-4 w-4" /> },
      { type: 'item', name: 'Pocket Microscope', icon: <Search className="h-4 w-4" /> },
      { type: 'skill', name: 'Analytical Thinking +1', icon: <Brain className="h-4 w-4" /> }
    ],
    progress: 0,
    unlocked: false,
    curriculumCode: 'SC2-1',
    curriculumLink: '/curriculum/science/ks2/scientific-method'
  }
];

// Mock character data for development
const mockCharacter = {
  name: 'Alex',
  type: 'explorer',
  level: 5,
  xp: 450,
  xpToNextLevel: 600,
  stats: {
    curiosity: 8,
    creativity: 6,
    persistence: 5,
    collaboration: 4,
    analysis: 5
  },
  inventory: [
    { id: 'i1', name: 'Mathematical Compass', description: 'Helps navigate complex mathematical problems', icon: <Compass className="h-4 w-4" /> },
    { id: 'i2', name: 'Knowledge Crystal', description: 'Stores information for later retrieval', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'i3', name: 'Resilience Shield', description: 'Provides protection against challenging problems', icon: <Shield className="h-4 w-4" /> }
  ],
  badges: [
    { id: 'b1', name: 'Pattern Spotter', description: 'Awarded for excellence in recognising mathematical patterns', icon: <Puzzle className="h-4 w-4" /> },
    { id: 'b2', name: 'First Steps', description: 'Completed your first quest', icon: <Milestone className="h-4 w-4" /> },
    { id: 'b3', name: 'Team Player', description: 'Successfully completed a collaborative challenge', icon: <Users className="h-4 w-4" /> }
  ],
  skills: [
    { id: 's1', name: 'Pattern Recognition', level: 3, progress: 60, icon: <Brain className="h-4 w-4" /> },
    { id: 's2', name: 'Critical Thinking', level: 2, progress: 40, icon: <Lightbulb className="h-4 w-4" /> },
    { id: 's3', name: 'Communication', level: 2, progress: 30, icon: <MessageCircleIcon className="h-4 w-4" /> },
    { id: 's4', name: 'Problem Solving', level: 3, progress: 70, icon: <Puzzle className="h-4 w-4" /> },
    { id: 's5', name: 'Creativity', level: 2, progress: 50, icon: <Sparkles className="h-4 w-4" /> }
  ],
  completedQuests: 7,
  activeQuests: 2
};

// Custom shield icon
const Shield = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

// Custom message circle icon
const MessageCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

// Custom search icon
const Search = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Character Creation Component
const CharacterCreation = ({ onCreateCharacter }) => {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your character",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !selectedType) {
      toast({
        title: "Character Type Required",
        description: "Please select a character type",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create character
      const characterType = characterTypes.find(type => type.id === selectedType);
      
      const newCharacter = {
        name,
        type: selectedType,
        level: 1,
        xp: 0,
        xpToNextLevel: 200,
        stats: characterType.startingStats,
        inventory: [],
        badges: [
          { id: 'b1', name: 'First Steps', description: 'Created your character and began your adventure', icon: <Milestone className="h-4 w-4" /> }
        ],
        skills: [
          { id: 's1', name: 'Pattern Recognition', level: 1, progress: 0, icon: <Brain className="h-4 w-4" /> },
          { id: 's2', name: 'Critical Thinking', level: 1, progress: 0, icon: <Lightbulb className="h-4 w-4" /> },
          { id: 's3', name: 'Communication', level: 1, progress: 0, icon: <MessageCircleIcon className="h-4 w-4" /> },
          { id: 's4', name: 'Problem Solving', level: 1, progress: 0, icon: <Puzzle className="h-4 w-4" /> },
          { id: 's5', name: 'Creativity', level: 1, progress: 0, icon: <Sparkles className="h-4 w-4" /> }
        ],
        completedQuests: 0,
        activeQuests: 0
      };
      
      onCreateCharacter(newCharacter);
      
      toast({
        title: "Character Created",
        description: `Welcome to your adventure, ${name}!`,
        variant: "success",
      });
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-centre mb-8">
        <h1 className="text-3xl font-bold">Begin Your Adventure</h1>
        <p className="text-muted-foreground mt-2">Create your character and embark on an educational journey</p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-centre">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-centre">
              <div className={`w-10 h-10 rounded-full flex items-centre justify-centre ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s}
              </div>
              <span className="text-xs mt-1">
                {s === 1 ? 'Name' : s === 2 ? 'Character Type' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-centre">
            <h2 className="text-2xl font-semibold">Choose Your Name</h2>
            <p className="text-muted-foreground mt-1">What shall we call you on your adventure?</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Label htmlFor="character-name">Character Name</Label>
            <Input
              id="character-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your character name"
              className="mt-1"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
            <h3 className="font-medium flex items-centre">
              <Info className="h-4 w-4 mr-2" />
              Name Guidelines
            </h3>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Choose a name that represents you</li>
              <li>• Names should be appropriate for a school environment</li>
              <li>• You can change your name later if needed</li>
            </ul>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-centre">
            <h2 className="text-2xl font-semibold">Choose Your Character Type</h2>
            <p className="text-muted-foreground mt-1">Each type offers different strengths and abilities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characterTypes.map((type) => (
              <Card 
                key={type.id} 
                className={`cursor-pointer transition-all hover:border-primary ${selectedType === type.id ? 'border-2 border-primary' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {type.icon}
                    </div>
                    {selectedType === type.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2">{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  
                  <div className="space-y-2">
                    {Object.entries(type.startingStats).map(([stat, value]) => (
                      <div key={stat} className="flex items-centre justify-between">
                        <span className="text-xs capitalize">{stat}</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${(value / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {step === 3 && selectedType && (
        <div className="space-y-6">
          <div className="text-centre">
            <h2 className="text-2xl font-semibold">Confirm Your Character</h2>
            <p className="text-muted-foreground mt-1">Review your choices before beginning your adventure</p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-centre">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  {characterTypes.find(type => type.id === selectedType)?.icon}
                </div>
                <div>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>
                    Level 1 {characterTypes.find(type => type.id === selectedType)?.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Starting Stats</h3>
                  <div className="space-y-2">
                    {Object.entries(characterTypes.find(type => type.id === selectedType)?.startingStats || {}).map(([stat, value]) => (
                      <div key={stat} className="flex items-centre justify-between">
                        <span className="text-sm capitalize">{stat}</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${(value / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Special Abilities</h3>
                  <ul className="text-sm space-y-1">
                    {characterTypes.find(type => type.id === selectedType)?.bonuses.map((bonus, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                        <span>{bonus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        <Button onClick={handleNext}>
          {step < 3 ? 'Next' : 'Begin Adventure'}
        </Button>
      </div>
    </div>
  );
};

// Character Dashboard Component
const CharacterDashboard = ({ character }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre">
        <div className="flex items-centre">
          <div className="p-3 bg-primary/10 rounded-lg mr-4">
            {characterTypes.find(type => type.id === character.type)?.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <div className="flex items-centre">
              <Badge variant="outline" className="mr-2">
                Level {character.level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {characterTypes.find(type => type.id === character.type)?.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-centre space-x-4">
          <div className="text-centre">
            <span className="text-sm text-muted-foreground">Completed Quests</span>
            <div className="flex items-centre mt-1">
              <Trophy className="h-4 w-4 mr-1 text-amber-500" />
              <span className="font-bold">{character.completedQuests}</span>
            </div>
          </div>
          
          <div className="text-centre">
            <span className="text-sm text-muted-foreground">Active Quests</span>
            <div className="flex items-centre mt-1">
              <Sword className="h-4 w-4 mr-1 text-blue-500" />
              <span className="font-bold">{character.activeQuests}</span>
            </div>
          </div>
          
          <div className="text-centre">
            <span className="text-sm text-muted-foreground">Badges</span>
            <div className="flex items-centre mt-1">
              <Award className="h-4 w-4 mr-1 text-purple-500" />
              <span className="font-bold">{character.badges.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-centre mb-2">
          <div>
            <span className="text-sm font-medium">Level Progress</span>
            <div className="flex items-centre text-xs text-muted-foreground">
              <span>{character.xp} / {character.xpToNextLevel} XP</span>
              <span className="mx-1">•</span>
              <span>{Math.round((character.xp / character.xpToNextLevel) * 100)}%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Next Level</span>
            <div className="font-bold">{character.level + 1}</div>
          </div>
        </div>
        <Progress value={(character.xp / character.xpToNextLevel) * 100} className="h-2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Brain className="h-5 w-5 mr-2" />
              Character Stats
            </CardTitle>
            <CardDescription>Your character's abilities and attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="space-y-1">
                  <div className="flex justify-between items-centre">
                    <span className="text-sm capitalize">{stat}</span>
                    <span className="text-sm font-medium">{value}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        stat === 'curiosity' ? 'bg-blue-500' :
                        stat === 'creativity' ? 'bg-purple-500' :
                        stat === 'persistence' ? 'bg-amber-500' :
                        stat === 'collaboration' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(value / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Zap className="h-5 w-5 mr-2" />
              Skills
            </CardTitle>
            <CardDescription>Skills you've developed through quests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {character.skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between items-centre">
                    <div className="flex items-centre">
                      {skill.icon}
                      <span className="text-sm ml-2">{skill.name}</span>
                    </div>
                    <Badge variant="outline">Level {skill.level}</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Backpack className="h-5 w-5 mr-2" />
              Inventory
            </CardTitle>
            <CardDescription>Items you've collected on your journey</CardDescription>
          </CardHeader>
          <CardContent>
            {character.inventory.length > 0 ? (
              <div className="space-y-3">
                {character.inventory.map((item) => (
                  <div key={item.id} className="flex items-start p-2 border rounded-lg">
                    <div className="p-2 bg-muted rounded-lg mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-centre py-6 text-muted-foreground">
                <Backpack className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Your inventory is empty</p>
                <p className="text-xs mt-1">Complete quests to earn items</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Award className="h-5 w-5 mr-2" />
              Badges
            </CardTitle>
            <CardDescription>Achievements you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            {character.badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {character.badges.map((badge) => (
                  <div key={badge.id} className="flex items-start p-2 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-centre py-6 text-muted-foreground">
                <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No badges earned yet</p>
                <p className="text-xs mt-1">Complete quests to earn badges</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Quest Card Component
const QuestCard = ({ quest, onSelect }) => {
  const difficultyInfo = difficultyLevels.find(d => d.id === quest.difficulty);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="capitalize">
            {quest.subject}
          </Badge>
          <Badge className={`${difficultyInfo?.colour} text-white`}>
            {difficultyInfo?.name}
          </Badge>
        </div>
        <CardTitle className="mt-2">{quest.title}</CardTitle>
        <CardDescription>
          {quest.keyStage} • {quest.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Learning Objectives</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {quest.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-4 w-4 mr-2 flex items-centre justify-centre">•</div>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Learning Styles</h4>
            <div className="flex space-x-2">
              {quest.learningStyles.map((style) => {
                const styleInfo = learningStyles.find(s => s.id === style);
                return (
                  <Badge key={style} variant="outline" className="flex items-centre">
                    {styleInfo?.icon}
                    <span className="ml-1">{styleInfo?.name}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Rewards</h4>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="flex items-centre">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                <span>{quest.xpReward} XP</span>
              </Badge>
              <Badge variant="secondary" className="flex items-centre">
                <Award className="h-3 w-3 mr-1" />
                <span>{quest.rewards.length} Items</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          disabled={!quest.unlocked}
          onClick={() => onSelect(quest)}
        >
          {quest.unlocked ? (
            <>
              <Sword className="h-4 w-4 mr-2" />
              Begin Quest
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Quest Detail Component
const QuestDetail = ({ quest, onBack, onStart }) => {
  const difficultyInfo = difficultyLevels.find(d => d.id === quest.difficulty);
  const curriculumContext = useCurriculum();
  
  return (
    <div className="space-y-6">
      <div className="flex items-centre">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{quest.title}</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="capitalize">
          {quest.subject}
        </Badge>
        <Badge className={`${difficultyInfo?.colour} text-white`}>
          {difficultyInfo?.name}
        </Badge>
        <Badge variant="outline">{quest.keyStage}</Badge>
        <Badge variant="outline">{quest.duration}</Badge>
        {quest.curriculumCode && (
          <Badge variant="outline" className="flex items-centre">
            <BookOpen className="h-3 w-3 mr-1" />
            {quest.curriculumCode}
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground">{quest.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Target className="h-5 w-5 mr-2" />
              Learning Objectives
            </CardTitle>
            <CardDescription>What you'll learn in this quest</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quest.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 mr-2 flex items-centre justify-centre bg-primary/10 rounded-full text-primary">
                    {index + 1}
                  </div>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
            
            {quest.curriculumLink && curriculumContext && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium flex items-centre">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Curriculum Alignment
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  This quest aligns with the {quest.keyStage} {quest.subject} curriculum.
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0 text-xs"
                  onClick={() => curriculumContext.viewStandard(quest.curriculumCode)}
                >
                  View curriculum details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-centre">
              <Trophy className="h-5 w-5 mr-2" />
              Rewards
            </CardTitle>
            <CardDescription>What you'll earn by completing this quest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-centre p-2 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <Star className="h-5 w-5 mr-2 text-amber-500" />
              <span className="font-medium">{quest.xpReward} XP</span>
            </div>
            
            <div className="space-y-3">
              {quest.rewards.map((reward, index) => (
                <div key={index} className="flex items-start p-2 border rounded-lg">
                  <div className="p-2 bg-muted rounded-lg mr-3">
                    {reward.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {reward.type === 'badge' ? 'Achievement Badge' : 
                       reward.type === 'item' ? 'Inventory Item' : 
                       'Skill Improvement'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <Map className="h-5 w-5 mr-2" />
            Quest Journey
          </CardTitle>
          <CardDescription>The chapters and challenges you'll face</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quest.chapters.map((chapter, index) => (
              <div key={chapter.id} className="relative">
                {index < quest.chapters.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted"></div>
                )}
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-centre justify-centre bg-primary/10 rounded-full text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{chapter.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{chapter.description}</p>
                    <Badge variant="outline" className="flex items-centre w-fit">
                      <Puzzle className="h-3 w-3 mr-1" />
                      {chapter.challenges} Challenges
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Quests
        </Button>
        <Button onClick={() => onStart(quest)}>
          <Sword className="h-4 w-4 mr-2" />
          Begin Quest
        </Button>
      </div>
    </div>
  );
};

// Custom icons
const Target = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ChevronLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const Lock = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Eye = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Info = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

// Quest Hub Component
const QuestHub = ({ quests, onSelectQuest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    subject: [],
    keyStage: [],
    learningStyle: []
  });
  
  // Get unique filter options
  const getUniqueOptions = (field) => {
    const options = new Set();
    quests.forEach(quest => {
      if (Array.isArray(quest[field])) {
        quest[field].forEach(option => options.add(option));
      } else {
        options.add(quest[field]);
      }
    });
    return Array.from(options);
  };
  
  const subjects = getUniqueOptions('subject');
  const keyStages = getUniqueOptions('keyStage');
  const learningStyleOptions = getUniqueOptions('learningStyles').flat();
  
  // Apply filters and search
  const filteredQuests = quests.filter(quest => {
    // Search term
    if (searchTerm && !quest.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !quest.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(quest.difficulty)) {
      return false;
    }
    
    // Subject filter
    if (filters.subject.length > 0 && !filters.subject.includes(quest.subject)) {
      return false;
    }
    
    // Key Stage filter
    if (filters.keyStage.length > 0 && !filters.keyStage.includes(quest.keyStage)) {
      return false;
    }
    
    // Learning Style filter
    if (filters.learningStyle.length > 0) {
      const hasMatchingStyle = filters.learningStyle.some(style => 
        quest.learningStyles.includes(style)
      );
      if (!hasMatchingStyle) return false;
    }
    
    return true;
  });
  
  // Toggle filter
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = [...prev[category]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        [category]: current
      };
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      difficulty: [],
      subject: [],
      keyStage: [],
      learningStyle: []
    });
    setSearchTerm('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre">
        <div>
          <h2 className="text-2xl font-bold">Quest Hub</h2>
          <p className="text-muted-foreground">Discover adventures that await you</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-centre space-x-2">
          <Input
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
          
          <Dialogue>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Quests</DialogTitle>
                <DialogDescription>
                  Narrow down quests based on your preferences
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="font-medium mb-2">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {difficultyLevels.map((level) => (
                      <Badge
                        key={level.id}
                        variant={filters.difficulty.includes(level.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFilter('difficulty', level.id)}
                      >
                        {level.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Subject</h3>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant={filters.subject.includes(subject) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleFilter('subject', subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Key Stage</h3>
                  <div className="flex flex-wrap gap-2">
                    {keyStages.map((keyStage) => (
                      <Badge
                        key={keyStage}
                        variant={filters.keyStage.includes(keyStage) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFilter('keyStage', keyStage)}
                      >
                        {keyStage}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Learning Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {learningStyles.map((style) => (
                      <Badge
                        key={style.id}
                        variant={filters.learningStyle.includes(style.id) ? "default" : "outline"}
                        className="cursor-pointer flex items-centre"
                        onClick={() => toggleFilter('learningStyle', style.id)}
                      >
                        {style.icon}
                        <span className="ml-1">{style.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <DialogClose asChild>
                  <Button>Apply Filters</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialogue>
        </div>
      </div>
      
      {/* Active filters */}
      {(filters.difficulty.length > 0 || filters.subject.length > 0 || 
        filters.keyStage.length > 0 || filters.learningStyle.length > 0 || searchTerm) && (
        <div className="flex flex-wrap items-centre gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium mr-2">Active Filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="flex items-centre">
              <Search className="h-3 w-3 mr-1" />
              {searchTerm}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          
          {filters.difficulty.map(difficulty => (
            <Badge key={difficulty} variant="secondary" className="flex items-centre">
              {difficultyLevels.find(d => d.id === difficulty)?.name}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleFilter('difficulty', difficulty)}
              />
            </Badge>
          ))}
          
          {filters.subject.map(subject => (
            <Badge key={subject} variant="secondary" className="flex items-centre capitalize">
              {subject}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleFilter('subject', subject)}
              />
            </Badge>
          ))}
          
          {filters.keyStage.map(keyStage => (
            <Badge key={keyStage} variant="secondary" className="flex items-centre">
              {keyStage}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleFilter('keyStage', keyStage)}
              />
            </Badge>
          ))}
          
          {filters.learningStyle.map(style => (
            <Badge key={style} variant="secondary" className="flex items-centre">
              {learningStyles.find(s => s.id === style)?.name}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleFilter('learningStyle', style)}
              />
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
            Clear All
          </Button>
        </div>
      )}
      
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map(quest => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              onSelect={onSelectQuest}
            />
          ))}
        </div>
      ) : (
        <div className="text-centre py-12 border rounded-lg">
          <Map className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Quests Found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or search terms
          </p>
          <Button 
            onClick={clearFilters} 
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

// Custom filter icon
const Filter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// Custom X icon
const X = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Search icon
const Search = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Main Adventure Quest Saga Component
const AdventureQuestSaga = () => {
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [activeView, setActiveView] = useState('quests'); // 'quests', 'character', 'quest-detail'
  const { toast } = useToast();
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage();
  
  // Integration with curriculum module
  const curriculumContext = useCurriculum();
  const curriculumQuests = useCurriculumQuests(curriculumContext);
  
  // Integration with gamification system
  const gamificationContext = useGamification();
  const { awardQuestProgress } = useGamificationIntegration(gamificationContext, character, setCharacter);
  
  // Integration with assessment module
  const assessmentContext = useAssessment();
  const { createAssessmentFromChallenge } = useAssessmentIntegration(assessmentContext, quests, setQuests);
  
  // Initialize quests from mock data and curriculum
  useEffect(() => {
    // Combine mock quests with curriculum-generated quests
    const combinedQuests = [...mockQuests];
    
    if (curriculumQuests && curriculumQuests.length > 0) {
      // Filter out duplicates by ID
      const existingIds = new Set(combinedQuests.map(q => q.id));
      const newQuests = curriculumQuests.filter(q => !existingIds.has(q.id));
      
      combinedQuests.push(...newQuests);
    }
    
    setQuests(combinedQuests);
  }, [curriculumQuests]);
  
  // Handle character creation
  const handleCreateCharacter = (newCharacter) => {
    setCharacter(newCharacter);
    
    // Notify gamification system of character creation
    if (gamificationContext) {
      gamificationContext.awardAchievement({
        id: 'character_creation',
        name: 'Adventure Begins',
        description: 'Created a character and began your educational journey',
        type: 'character_creation',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
    setActiveView('quest-detail');
  };
  
  // Handle quest start
  const handleStartQuest = async (quest) => {
    // Check if feature can be used (fair usage)
    const usageResult = await useFeatureWithCredit('questStart');
    
    if (!usageResult.success && !usageResult.usedCredits) {
      // If feature cannot be used and credits weren't used, exit
      return;
    }
    
    toast({
      title: "Quest Started",
      description: `You've begun "${quest.title}"`,
      variant: "success",
    });
    
    // Update character
    setCharacter(prev => ({
      ...prev,
      activeQuests: prev.activeQuests + 1
    }));
    
    // Notify gamification system
    if (gamificationContext) {
      gamificationContext.trackEvent({
        type: 'quest_start',
        questId: quest.id,
        questTitle: quest.title,
        timestamp: new Date().toISOString()
      });
    }
    
    // Create assessment for first challenge if assessment module is available
    if (assessmentContext && quest.chapters && quest.chapters.length > 0) {
      const firstChapter = quest.chapters[0];
      createAssessmentFromChallenge(quest, firstChapter, 0);
    }
    
    // In a real implementation, this would navigate to the quest gameplay
    setActiveView('quests');
  };
  
  // If no character, show character creation
  if (!character) {
    return (
      <div className="container mx-auto py-8">
        <CharacterCreation onCreateCharacter={handleCreateCharacter} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="quests" disabled={activeView === 'quest-detail'}>
            <Map className="h-4 w-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="character" disabled={activeView === 'quest-detail'}>
            <User className="h-4 w-4 mr-2" />
            Character
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests" className="mt-0">
          {activeView === 'quest-detail' ? (
            <QuestDetail 
              quest={selectedQuest} 
              onBack={() => setActiveView('quests')}
              onStart={handleStartQuest}
            />
          ) : (
            <QuestHub 
              quests={quests} 
              onSelectQuest={handleSelectQuest}
            />
          )}
        </TabsContent>
        
        <TabsContent value="character" className="mt-0">
          <CharacterDashboard character={character || mockCharacter} />
        </TabsContent>
      </Tabs>
      
      {/* Credit purchase dialogue from fair usage hook */}
      <CreditPurchaseDialog />
    </div>
  );
};

// Custom user icon
const User = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

export default AdventureQuestSaga;
