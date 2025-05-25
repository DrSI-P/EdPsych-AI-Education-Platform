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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
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
const Eye = (props: React.SVGProps<SVGSVGElement>) => (
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

const EarIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const HandIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

// Types for curriculum integration
interface CurriculumStandard {
  title?: string;
  description?: string;
  subject: string;
  code: string;
  keyStage: string;
  complexity?: number;
  scope?: number;
  visualElements?: boolean;
  auditoryElements?: boolean;
  textualElements?: boolean;
  practicalElements?: boolean;
  objectives?: string[];
  units?: {
    title?: string;
    description?: string;
    challengeCount?: number;
  }[];
  prerequisites?: string[];
  topic?: string;
  link?: string;
}

interface CurriculumQuest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subject: string;
  keyStage: string;
  duration: string;
  xpReward: number;
  learningStyles: string[];
  objectives: string[];
  chapters: {
    id: string;
    title: string;
    description: string;
    challenges: number;
    completed: boolean;
  }[];
  rewards: {
    type: string;
    name: string;
    icon: React.ReactNode;
  }[];
  progress: number;
  unlocked: boolean;
  curriculumCode: string;
  curriculumLink?: string;
}

interface CurriculumContext {
  standards: CurriculumStandard[];
  subjects: string[];
  keyStages: string[];
}

// Integration with Curriculum Module
const useCurriculumQuests = (curriculumContext: CurriculumContext | null): CurriculumQuest[] => {
  const [curriculumQuests, setCurriculumQuests] = useState<CurriculumQuest[]>([]);
  
  useEffect(() => {
    if (!curriculumContext) return;
    
    // Generate quests based on curriculum objectives
    const generateCurriculumQuests = async (): Promise<void> => {
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
const mapDifficultyFromStandard = (standard: CurriculumStandard): string => {
  // Map curriculum complexity to quest difficulty
  const complexityMap: Record<number, string> = {
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
  
  return complexityMap[standard.complexity || 0] || 'intermediate';
};

const estimateDurationFromStandard = (standard: CurriculumStandard): string => {
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

const calculateXpReward = (standard: CurriculumStandard): number => {
  // Calculate XP reward based on standard complexity and scope
  const baseXp = 50;
  const complexityFactor = standard.complexity || 1;
  const scopeFactor = standard.scope || 1;
  
  return Math.round(baseXp * complexityFactor * scopeFactor);
};

const determineLearningStyles = (standard: CurriculumStandard): string[] => {
  // Determine appropriate learning styles based on standard content
  const styles: string[] = [];
  
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

const extractObjectives = (standard: CurriculumStandard): string[] => {
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

const generateChaptersFromStandard = (standard: CurriculumStandard): {
  id: string;
  title: string;
  description: string;
  challenges: number;
  completed: boolean;
}[] => {
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

const generateRewardsFromStandard = (standard: CurriculumStandard): {
  type: string;
  name: string;
  icon: React.ReactNode;
}[] => {
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

const isUnlocked = (standard: CurriculumStandard): boolean => {
  // Determine if quest should be unlocked based on prerequisites
  if (!standard.prerequisites || standard.prerequisites.length === 0) {
    return true; // No prerequisites, so unlocked by default
  }
  
  // In a real implementation, this would check if prerequisites are completed
  // For now, randomly unlock some quests
  return Math.random() > 0.3;
};

// Types for gamification integration
interface Character {
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: any[];
  completedQuests: number;
}

interface GamificationContext {
  profile: any;
  achievements: any[];
  points: number;
  level: number;
  awardPoints: (points: number, metadata: any) => Promise<void>;
  awardAchievement: (achievement: any) => Promise<void>;
}

interface QuestProgressResult {
  awardQuestProgress: (quest: CurriculumQuest, progressType: string, amount?: number) => Promise<void>;
}

// Integration with Gamification System
const useGamificationIntegration = (
  gamificationContext: GamificationContext | null, 
  character: Character | null, 
  setCharacter: React.Dispatch<React.SetStateAction<Character | null>>
): QuestProgressResult => {
  useEffect(() => {
    if (!gamificationContext || !character) return;
    
    // Sync character progression with gamification system
    const syncCharacterWithGamification = async (): Promise<void> => {
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
  const awardQuestProgress = async (quest: CurriculumQuest, progressType: string, amount = 1): Promise<void> => {
    if (!gamificationContext || !character) return;
    
    try {
      // Define progress types and their XP values
      const progressValues: Record<string, number> = {
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
        if (!prev) return prev;
        
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
const calculateXpToNextLevel = (currentLevel: number): number => {
  // Calculate XP required for next level using a progressive formula
  const baseXp = 100;
  const scaleFactor = 1.5;
  
  return Math.round(baseXp * Math.pow(scaleFactor, currentLevel - 1));
};

const mergeGamificationAchievements = (characterBadges: any[], achievements: any[] | undefined): any[] => {
  if (!achievements || !Array.isArray(achievements)) return characterBadges || [];
  
  // Convert achievements to badges
  const achievementBadges = achievements
    .filter(a => a.type === 'badge' || a.type === 'quest_completion' || a.type === 'chapter_complete')
    .map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      icon: getBadgeIconByType(a.type),
      dateAwarded: a.timestamp
    }));
  
  // Merge with existing badges, avoiding duplicates
  const existingIds = new Set(characterBadges.map(b => b.id));
  const newBadges = achievementBadges.filter(b => !existingIds.has(b.id));
  
  return [...characterBadges, ...newBadges];
};

const getBadgeIconByType = (type: string): React.ReactNode => {
  switch (type) {
    case 'badge':
      return <Award className="h-4 w-4" />;
    case 'quest_completion':
      return <Trophy className="h-4 w-4" />;
    case 'chapter_complete':
      return <BookOpen className="h-4 w-4" />;
    default:
      return <Star className="h-4 w-4" />;
  }
};

// Types for assessment integration
interface AssessmentContext {
  assessments: any[];
  results: any[];
  createAssessment: (assessment: any) => Promise<any>;
  submitAssessment: (assessmentId: string, answers: any[]) => Promise<any>;
}

interface QuestAssessment {
  id: string;
  title: string;
  description: string;
  questions: any[];
  timeLimit?: number;
  passingScore: number;
  questId: string;
  chapterId?: string;
}

// Integration with Assessment Module
const useAssessmentIntegration = (
  assessmentContext: AssessmentContext | null,
  curriculumQuests: CurriculumQuest[]
): {
  questAssessments: Record<string, QuestAssessment[]>;
  generateAssessment: (quest: CurriculumQuest, chapter?: any) => Promise<QuestAssessment | null>;
  submitQuestAssessment: (assessment: QuestAssessment, answers: any[]) => Promise<any>;
} => {
  const [questAssessments, setQuestAssessments] = useState<Record<string, QuestAssessment[]>>({});
  
  useEffect(() => {
    if (!assessmentContext || !curriculumQuests.length) return;
    
    // Load existing assessments for quests
    const loadQuestAssessments = async (): Promise<void> => {
      try {
        // Get assessments from context
        const { assessments } = assessmentContext;
        
        // Filter and organize assessments by quest
        const questAssessmentsMap: Record<string, QuestAssessment[]> = {};
        
        curriculumQuests.forEach(quest => {
          const questId = quest.id;
          const questAssessments = assessments.filter(a => a.metadata?.questId === questId);
          
          if (questAssessments.length > 0) {
            questAssessmentsMap[questId] = questAssessments.map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              questions: a.questions,
              timeLimit: a.timeLimit,
              passingScore: a.passingScore,
              questId: a.metadata.questId,
              chapterId: a.metadata.chapterId
            }));
          }
        });
        
        setQuestAssessments(questAssessmentsMap);
        
      } catch (error) {
        console.error("Error loading quest assessments:", error);
      }
    };
    
    loadQuestAssessments();
  }, [assessmentContext, curriculumQuests]);
  
  // Generate assessment for a quest or chapter
  const generateAssessment = async (
    quest: CurriculumQuest, 
    chapter?: any
  ): Promise<QuestAssessment | null> => {
    if (!assessmentContext) return null;
    
    try {
      // Determine assessment type and scope
      const isChapterAssessment = !!chapter;
      const title = isChapterAssessment 
        ? `${quest.title}: ${chapter.title} Assessment` 
        : `${quest.title} Final Assessment`;
      const description = isChapterAssessment
        ? `Test your knowledge of ${chapter.title} concepts from the ${quest.title} quest.`
        : `Demonstrate your mastery of ${quest.title} to complete the quest.`;
      
      // Create assessment structure
      const assessmentData = {
        title,
        description,
        type: isChapterAssessment ? 'chapter_assessment' : 'quest_assessment',
        subject: quest.subject,
        keyStage: quest.keyStage,
        timeLimit: isChapterAssessment ? 15 : 30, // minutes
        passingScore: isChapterAssessment ? 70 : 75, // percentage
        questions: [], // Will be generated by the backend
        metadata: {
          questId: quest.id,
          chapterId: isChapterAssessment ? chapter.id : undefined,
          curriculumCode: quest.curriculumCode
        }
      };
      
      // Create assessment via context
      const createdAssessment = await assessmentContext.createAssessment(assessmentData);
      
      // Format and store the new assessment
      const newAssessment: QuestAssessment = {
        id: createdAssessment.id,
        title: createdAssessment.title,
        description: createdAssessment.description,
        questions: createdAssessment.questions,
        timeLimit: createdAssessment.timeLimit,
        passingScore: createdAssessment.passingScore,
        questId: quest.id,
        chapterId: isChapterAssessment ? chapter.id : undefined
      };
      
      // Update local state
      setQuestAssessments(prev => {
        const questId = quest.id;
        const existingAssessments = prev[questId] || [];
        
        return {
          ...prev,
          [questId]: [...existingAssessments, newAssessment]
        };
      });
      
      return newAssessment;
      
    } catch (error) {
      console.error("Error generating assessment:", error);
      return null;
    }
  };
  
  // Submit assessment answers
  const submitQuestAssessment = async (
    assessment: QuestAssessment, 
    answers: any[]
  ): Promise<any> => {
    if (!assessmentContext) return null;
    
    try {
      // Submit via context
      const result = await assessmentContext.submitAssessment(assessment.id, answers);
      
      return result;
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      return null;
    }
  };
  
  return { questAssessments, generateAssessment, submitQuestAssessment };
};

// Main component
const AdventureQuestSagaIntegrated: React.FC = (): JSX.Element => {
  const toast = useToast();
  const fairUsage = useFairUsage();
  const curriculumContext = useCurriculum();
  const gamificationContext = useGamification();
  const assessmentContext = useAssessment();
  
  // State
  const [activeTab, setActiveTab] = useState<string>("quests");
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<CurriculumQuest | null>(null);
  const [activeChapter, setActiveChapter] = useState<any | null>(null);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState<boolean>(false);
  const [selectedCharacterType, setSelectedCharacterType] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [currentAssessment, setCurrentAssessment] = useState<QuestAssessment | null>(null);
  
  // Get quests from curriculum
  const curriculumQuests = useCurriculumQuests(curriculumContext);
  
  // Gamification integration
  const { awardQuestProgress } = useGamificationIntegration(
    gamificationContext, 
    character, 
    setCharacter
  );
  
  // Assessment integration
  const { 
    questAssessments, 
    generateAssessment, 
    submitQuestAssessment 
  } = useAssessmentIntegration(assessmentContext, curriculumQuests);
  
  // Initialize character on first load
  useEffect(() => {
    const initializeCharacter = async (): Promise<void> => {
      // Check if character exists in local storage
      const savedCharacter = localStorage.getItem('adventure_quest_character');
      
      if (savedCharacter) {
        try {
          const parsedCharacter = JSON.parse(savedCharacter);
          setCharacter(parsedCharacter);
        } catch (error) {
          console.error("Error parsing saved character:", error);
          setIsCreatingCharacter(true);
        }
      } else {
        // No character found, prompt creation
        setIsCreatingCharacter(true);
      }
    };
    
    initializeCharacter();
  }, []);
  
  // Save character to local storage when updated
  useEffect(() => {
    if (character) {
      localStorage.setItem('adventure_quest_character', JSON.stringify(character));
    }
  }, [character]);
  
  // Check fair usage limits
  useEffect(() => {
    if (!fairUsage) return;
    
    const checkFairUsageLimits = async (): Promise<void> => {
      try {
        const { hasAccess, remainingQuests } = await fairUsage.checkFeatureAccess('adventure_quest');
        
        if (!hasAccess) {
          toast.toast({
            title: "Fair Usage Limit Reached",
            description: "You've reached your quest limit for today. Upgrade your subscription for unlimited quests.",
            variant: "destructive"
          });
        } else if (remainingQuests && remainingQuests < 3) {
          toast.toast({
            title: "Fair Usage Notice",
            description: `You have ${remainingQuests} quests remaining today.`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error checking fair usage:", error);
      }
    };
    
    checkFairUsageLimits();
  }, [fairUsage, toast]);
  
  // Create a new character
  const handleCreateCharacter = (): void => {
    if (!characterName || !selectedCharacterType) {
      toast.toast({
        title: "Character Creation",
        description: "Please select a character type and enter a name.",
        variant: "destructive"
      });
      return;
    }
    
    const characterType = characterTypes.find(type => type.id === selectedCharacterType);
    
    if (!characterType) {
      toast.toast({
        title: "Character Creation",
        description: "Invalid character type selected.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new character
    const newCharacter: Character = {
      name: characterName,
      type: selectedCharacterType,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      stats: { ...characterType.startingStats },
      badges: [],
      inventory: [],
      completedQuests: 0,
      activeQuests: [],
      bonuses: characterType.bonuses
    };
    
    setCharacter(newCharacter);
    setIsCreatingCharacter(false);
    
    toast.toast({
      title: "Character Created",
      description: `Welcome, ${characterName} the ${characterType.name}!`,
      variant: "default"
    });
  };
  
  // Start a quest
  const handleStartQuest = (quest: CurriculumQuest): void => {
    if (!fairUsage) return;
    
    fairUsage.useFeature('adventure_quest', { questId: quest.id }).then(result => {
      if (result.success) {
        setSelectedQuest(quest);
        setActiveChapter(quest.chapters[0]);
        
        toast.toast({
          title: "Quest Started",
          description: `You've embarked on "${quest.title}". Good luck!`,
          variant: "default"
        });
      } else {
        toast.toast({
          title: "Cannot Start Quest",
          description: result.message || "You've reached your fair usage limit for today.",
          variant: "destructive"
        });
      }
    }).catch(error => {
      console.error("Error starting quest:", error);
      toast.toast({
        title: "Error",
        description: "Failed to start quest. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  // Complete a challenge
  const handleCompleteChallenge = async (quest: CurriculumQuest, chapter: any): Promise<void> => {
    if (!character) return;
    
    try {
      // Award progress
      await awardQuestProgress(quest, 'challenge_complete');
      
      // Update chapter progress
      const updatedChapter = { ...chapter, completedChallenges: (chapter.completedChallenges || 0) + 1 };
      setActiveChapter(updatedChapter);
      
      // Check if chapter is complete
      if (updatedChapter.completedChallenges >= chapter.challenges) {
        // Chapter complete
        await awardQuestProgress(quest, 'chapter_complete');
        
        // Update quest chapters
        const updatedChapters = quest.chapters.map(ch => 
          ch.id === chapter.id ? { ...ch, completed: true } : ch
        );
        
        // Calculate new progress
        const completedChapters = updatedChapters.filter(ch => ch.completed).length;
        const totalChapters = updatedChapters.length;
        const newProgress = Math.round((completedChapters / totalChapters) * 100);
        
        // Update selected quest
        setSelectedQuest({
          ...quest,
          chapters: updatedChapters,
          progress: newProgress
        });
        
        // Check if all chapters complete
        if (completedChapters === totalChapters) {
          // Generate final assessment
          const assessment = await generateAssessment(quest);
          if (assessment) {
            setCurrentAssessment(assessment);
            setIsAssessmentOpen(true);
          }
        } else {
          // Move to next chapter
          const currentIndex = updatedChapters.findIndex(ch => ch.id === chapter.id);
          if (currentIndex < updatedChapters.length - 1) {
            setActiveChapter(updatedChapters[currentIndex + 1]);
          }
        }
      }
      
      toast.toast({
        title: "Challenge Completed",
        description: "Great job! You've completed a challenge.",
        variant: "default"
      });
      
    } catch (error) {
      console.error("Error completing challenge:", error);
      toast.toast({
        title: "Error",
        description: "Failed to complete challenge. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle assessment submission
  const handleSubmitAssessment = async (answers: any[]): Promise<void> => {
    if (!currentAssessment || !selectedQuest) return;
    
    try {
      // Submit assessment
      const result = await submitQuestAssessment(currentAssessment, answers);
      
      // Close assessment
      setIsAssessmentOpen(false);
      setCurrentAssessment(null);
      
      if (result.passed) {
        // If final quest assessment
        if (!currentAssessment.chapterId) {
          // Complete quest
          await awardQuestProgress(selectedQuest, 'quest_complete');
          
          toast.toast({
            title: "Quest Completed",
            description: `Congratulations! You've completed "${selectedQuest.title}".`,
            variant: "success"
          });
          
          // Reset selected quest
          setSelectedQuest(null);
          setActiveChapter(null);
        } else {
          toast.toast({
            title: "Assessment Passed",
            description: `You scored ${result.score}%. Well done!`,
            variant: "default"
          });
        }
      } else {
        toast.toast({
          title: "Assessment Failed",
          description: `You scored ${result.score}%. The passing score is ${currentAssessment.passingScore}%.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Render character creation
  const renderCharacterCreation = (): JSX.Element => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Create Your Character</h2>
        <p className="text-muted-foreground">
          Choose your learning adventure persona
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characterTypes.map(type => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all ${
              selectedCharacterType === type.id 
                ? 'border-primary ring-2 ring-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedCharacterType(type.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-2">
                {type.icon}
                <CardTitle>{type.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{type.description}</p>
              
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold">Starting Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(type.startingStats).map(([stat, value]) => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="text-xs capitalize">{stat}</span>
                      <div className="flex items-center">
                        <Progress value={value * 10} className="h-2 w-16" />
                        <span className="ml-2 text-xs">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold">Bonuses</h4>
                <ul className="text-xs space-y-1">
                  {type.bonuses.map((bonus, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-3 w-3 mr-1 mt-0.5 text-amber-500" />
                      <span>{bonus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="character-name">Character Name</Label>
          <Input 
            id="character-name"
            placeholder="Enter your character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
        </div>
        
        <Button 
          className="w-full"
          onClick={handleCreateCharacter}
          disabled={!selectedCharacterType || !characterName}
        >
          Create Character
        </Button>
      </div>
    </div>
  );
  
  // Render character profile
  const renderCharacterProfile = (): JSX.Element | null => {
    if (!character) return null;
    
    const characterType = characterTypes.find(type => type.id === character.type);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {characterType?.icon}
              <div>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription>Level {character.level} {characterType?.name}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="ml-auto">
              {character.completedQuests} Quests Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>XP: {character.xp}/{character.xpToNextLevel}</span>
                <span>{Math.round((character.xp / character.xpToNextLevel) * 100)}%</span>
              </div>
              <Progress value={(character.xp / character.xpToNextLevel) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {character.stats && Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs capitalize">{stat}</span>
                    <span className="text-xs">{value}</span>
                  </div>
                  <Progress value={value * 10} className="h-1.5" />
                </div>
              ))}
            </div>
            
            {character.badges && character.badges.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {character.badges.slice(0, 5).map((badge, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {badge.icon}
                      <span>{badge.name}</span>
                    </Badge>
                  ))}
                  {character.badges.length > 5 && (
                    <Badge variant="outline">+{character.badges.length - 5} more</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render quest list
  const renderQuestList = (): JSX.Element => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Available Quests</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="filter-difficulty" className="text-sm">Filter:</Label>
          <select 
            id="filter-difficulty"
            className="text-sm p-1 border rounded"
          >
            <option value="">All Difficulties</option>
            {difficultyLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {curriculumQuests.map(quest => (
          <Card key={quest.id} className={!quest.unlocked ? 'opacity-70' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{quest.title}</CardTitle>
                <Badge 
                  className={`${difficultyLevels.find(d => d.id === quest.difficulty)?.color} text-white`}
                >
                  {difficultyLevels.find(d => d.id === quest.difficulty)?.name}
                </Badge>
              </div>
              <CardDescription>{quest.subject} • {quest.keyStage}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm mb-2">{quest.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {quest.learningStyles.map(style => {
                  const styleInfo = learningStyles.find(s => s.id === style);
                  return (
                    <Badge key={style} variant="outline" className="text-xs flex items-center gap-1">
                      {styleInfo?.icon}
                      <span>{styleInfo?.name}</span>
                    </Badge>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Hourglass className="h-3 w-3" />
                  <span>{quest.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span>{quest.xpReward} XP</span>
                </div>
              </div>
              
              {quest.progress > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{quest.progress}%</span>
                  </div>
                  <Progress value={quest.progress} className="h-1.5" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant={quest.unlocked ? "default" : "outline"}
                disabled={!quest.unlocked}
                onClick={() => handleStartQuest(quest)}
              >
                {quest.progress > 0 ? "Continue Quest" : "Start Quest"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Render active quest
  const renderActiveQuest = (): JSX.Element | null => {
    if (!selectedQuest || !activeChapter) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setSelectedQuest(null)}>
            Back to Quests
          </Button>
          <Badge 
            className={`${difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.color} text-white`}
          >
            {difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.name}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{selectedQuest.title}</h1>
          <p className="text-muted-foreground">{selectedQuest.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{selectedQuest.subject}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Milestone className="h-3 w-3" />
              <span>{selectedQuest.keyStage}</span>
            </Badge>
            {selectedQuest.learningStyles.map(style => {
              const styleInfo = learningStyles.find(s => s.id === style);
              return (
                <Badge key={style} variant="outline" className="flex items-center gap-1">
                  {styleInfo?.icon}
                  <span>{styleInfo?.name}</span>
                </Badge>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Quest Objectives</h2>
          <ul className="space-y-1">
            {selectedQuest.objectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chapters</h2>
            <div className="text-sm text-muted-foreground">
              {selectedQuest.chapters.filter(ch => ch.completed).length}/{selectedQuest.chapters.length} completed
            </div>
          </div>
          
          <div className="space-y-2">
            {selectedQuest.chapters.map((chapter, index) => (
              <Card 
                key={chapter.id} 
                className={`
                  ${chapter.id === activeChapter.id ? 'border-primary' : ''}
                  ${chapter.completed ? 'bg-muted/50' : ''}
                  ${index > 0 && !selectedQuest.chapters[index-1].completed ? 'opacity-70' : ''}
                `}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {chapter.completed ? (
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border border-muted-foreground flex items-center justify-center mr-2">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                      )}
                      <CardTitle className="text-base">{chapter.title}</CardTitle>
                    </div>
                    {chapter.id === activeChapter.id && !chapter.completed && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </div>
                </CardHeader>
                
                {chapter.id === activeChapter.id && !chapter.completed && (
                  <CardContent className="pb-3">
                    <p className="text-sm mb-3">{chapter.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Challenges completed</span>
                          <span>{activeChapter.completedChallenges || 0}/{chapter.challenges}</span>
                        </div>
                        <Progress 
                          value={((activeChapter.completedChallenges || 0) / chapter.challenges) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <Button 
                        onClick={() => handleCompleteChallenge(selectedQuest, activeChapter)}
                        className="w-full"
                      >
                        Complete Challenge
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Rewards</h2>
          <div className="flex flex-wrap gap-3">
            {selectedQuest.rewards.map((reward, index) => (
              <Card key={index} className="w-full sm:w-auto sm:min-w-[150px]">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    {reward.icon}
                  </div>
                  <div className="text-sm font-medium">{reward.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{reward.type}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {selectedQuest.curriculumLink && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center">
              <Scroll className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Curriculum Reference</span>
            </div>
            <p className="text-xs mt-1">
              This quest aligns with curriculum standard {selectedQuest.curriculumCode}.{' '}
              <a 
                href={selectedQuest.curriculumLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View curriculum details
              </a>
            </p>
          </div>
        )}
      </div>
    );
  };
  
  // Render assessment
  const renderAssessment = (): JSX.Element | null => {
    if (!currentAssessment) return null;
    
    return (
      <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{currentAssessment.title}</DialogTitle>
            <DialogDescription>{currentAssessment.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            {currentAssessment.questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">Question {index + 1}</h3>
                <p>{question.text}</p>
                
                <div className="space-y-1">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id={`q${index}-opt${optIndex}`} 
                        name={`question-${index}`} 
                        value={optIndex}
                      />
                      <label htmlFor={`q${index}-opt${optIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssessmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmitAssessment([])}>
              Submit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Main render
  if (isCreatingCharacter) {
    return renderCharacterCreation();
  }
  
  return (
    <div className="space-y-6">
      {renderCharacterProfile()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quests">
            <Map className="h-4 w-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests" className="space-y-4 mt-6">
          {selectedQuest ? renderActiveQuest() : renderQuestList()}
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Sword className="h-5 w-5 mr-2 text-primary" />
                  Quest Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Quests Completed</span>
                    <span className="font-medium">{character?.completedQuests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Challenges Completed</span>
                    <span className="font-medium">
                      {/* Calculate from achievements */}
                      {character?.badges?.filter(b => b.type === 'challenge_complete')?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Assessments Passed</span>
                    <span className="font-medium">
                      {/* Calculate from achievements */}
                      {character?.badges?.filter(b => b.type === 'assessment_passed')?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-amber-500" />
                  Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Badges Earned</span>
                    <span className="font-medium">
                      {character?.badges?.filter(b => b.type === 'badge')?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Items Collected</span>
                    <span className="font-medium">
                      {character?.inventory?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total XP Earned</span>
                    <span className="font-medium">{character?.xp || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-500" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {character?.stats && Object.entries(character.stats).map(([stat, value]) => (
                    <div key={stat} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs capitalize">{stat}</span>
                        <span className="text-xs">{value}</span>
                      </div>
                      <Progress value={value * 10} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {character?.badges && character.badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {character.badges.map((badge, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="p-4 flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          {badge.icon}
                        </div>
                        <h3 className="font-medium text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {badge.dateAwarded && (
                          <p className="text-xs mt-2">
                            {new Date(badge.dateAwarded).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">
                    Complete quests to earn badges
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {renderAssessment()}
    </div>
  );
};

export default AdventureQuestSagaIntegrated;
