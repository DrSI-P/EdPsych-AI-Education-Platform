'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
// Removed unused import: Input
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
// Removed unused Dialog components
import { 
  Sword, 
  Map, 
  Trophy, 
  Star, 
  BookOpen, 
  // Removed unused: Users
  Compass, 
  Sparkles,
  Award,
  Backpack,
  Scroll,
  Zap,
  // Removed unused: Heart
  Brain,
  Lightbulb,
  Puzzle,
  Milestone,
  // Removed unused: Hourglass
  BarChart,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';
import { useCurriculum } from '../curriculum/curriculum-context';
import { useGamification } from '../gamification/gamification-context';
import { useAssessment } from '../assessment/assessment-context';
import { useUserProfile } from '../user/user-profile-context';
import { CharacterCreation } from './character-creation';
import { QuestDetail } from './quest-detail';
import { QuestHub } from './quest-hub';
import { CharacterDashboard } from './character-dashboard';

/**
 * Adaptive Quest Generation and Progress Tracking System
 * 
 * This component extends the Adventure Quest Saga with:
 * 1. AI-driven adaptive quest generation based on learning profiles
 * 2. Comprehensive progress tracking across all platform modules
 * 3. Analytics dashboard for learning insights
 * 4. Personalized quest recommendations
 */

// Adaptive Quest Generator Component
const AdaptiveQuestGenerator = ({ 
  userProfile, 
  learningHistory, 
  curriculumContext, 
  assessmentResults,
  onQuestGenerated
}: {
  userProfile: any;
  learningHistory: any;
  curriculumContext: any;
  assessmentResults: any;
  onQuestGenerated: (quest: any) => void;
}): React.ReactNode => {
  const [generating, setGenerating] = useState(false);
  const [generationParams, setGenerationParams] = useState({
    difficulty: 'auto',
    subject: '',
    keyStage: '',
    learningStyles: [],
    focusAreas: [],
    duration: 'medium'
  });
  const { toast } = useToast();
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage();
  
  // Generate quest based on user profile and learning history
  const generateAdaptiveQuest = async (): Promise<void> => {
    try {
      setGenerating(true);
      
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('adaptiveQuestGeneration');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        setGenerating(false);
        return;
      }
      
      // In a real implementation, this would call an AI service to generate a quest
      // For now, simulate with a timeout and mock data
      setTimeout(() => {
        // Generate quest based on user profile, learning history, and parameters
        const generatedQuest = createAdaptiveQuest(
          userProfile, 
          learningHistory, 
          assessmentResults, 
          generationParams,
          curriculumContext
        );
        
        onQuestGenerated(generatedQuest);
        
        toast({
          title: "Quest Generated",
          description: `"${generatedQuest.title}" has been created based on your learning profile`,
          variant: "success",
        });
        
        setGenerating(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating adaptive quest:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your quest. Please try again.",
        variant: "destructive",
      });
      setGenerating(false);
    }
  };
  
  // Create adaptive quest based on user data
  const createAdaptiveQuest = (
    userProfile: any, 
    learningHistory: any, 
    assessmentResults: any, 
    params: any,
    curriculumContext: any
  ): any => {
    // Determine appropriate difficulty
    let difficulty = params.difficulty;
    if (difficulty === 'auto') {
      // Calculate appropriate difficulty based on assessment results
      const averageScore = assessmentResults && assessmentResults.length > 0
        ? assessmentResults.reduce((sum: number, result: any) => sum + result.percentageScore, 0) / assessmentResults.length
        : 50;
      
      if (averageScore < 40) difficulty = 'beginner';
      else if (averageScore < 60) difficulty = 'intermediate';
      else if (averageScore < 80) difficulty = 'advanced';
      else difficulty = 'expert';
    }
    
    // Determine subject focus
    const subject = params.subject || determineSubjectFocus(learningHistory, assessmentResults);
    
    // Determine key stage
    const keyStage = params.keyStage || userProfile.keyStage || 'KS2';
    
    // Determine learning styles
    const learningStyles = params.learningStyles.length > 0 
      ? params.learningStyles 
      : userProfile.learningStyles || ['visual', 'reading_writing'];
    
    // Determine focus areas
    const focusAreas = params.focusAreas.length > 0
      ? params.focusAreas
      : determineFocusAreas(assessmentResults);
    
    // Determine duration
    const durationMap: Record<string, string> = {
      'short': '1-2 hours',
      'medium': '2-3 hours',
      'long': '3-5 hours'
    };
    const duration = durationMap[params.duration] || '2-3 hours';
    
    // Generate quest title and description
    const { title, description } = generateQuestTitleAndDescription(subject, focusAreas, difficulty);
    
    // Generate quest objectives
    const objectives = generateQuestObjectives(subject, focusAreas, curriculumContext);
    
    // Generate quest chapters
    const chapters = generateQuestChapters(subject, focusAreas, difficulty);
    
    // Generate quest rewards
    const rewards = generateQuestRewards(subject, difficulty);
    
    // Calculate XP reward based on difficulty and duration
    const difficultyMultiplier: Record<string, number> = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
      'expert': 2.5,
      'master': 3
    };
    const durationMultiplier: Record<string, number> = {
      'short': 1,
      'medium': 1.5,
      'long': 2
    };
    const baseXp = 100;
    const xpReward = Math.round(
      baseXp * 
      (difficultyMultiplier[difficulty] || 1) * 
      (durationMultiplier[params.duration] || 1.5)
    );
    
    // Create quest object
    return {
      id: `aq-${Date.now()}`,
      title,
      description,
      difficulty,
      subject,
      keyStage,
      duration,
      xpReward,
      learningStyles,
      objectives,
      chapters,
      rewards,
      progress: 0,
      unlocked: true,
      adaptive: true,
      focusAreas,
      generatedAt: new Date().toISOString(),
      curriculumCode: getCurriculumCode(subject, keyStage, curriculumContext),
      curriculumLink: getCurriculumLink(subject, keyStage, curriculumContext)
    };
  };
  
  // Helper functions for adaptive quest generation
  const determineSubjectFocus = (learningHistory: any, assessmentResults: any): string => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return 'Mathematics'; // Default subject
    }
    
    // Find subject with lowest average score (area for improvement)
    const subjectScores: Record<string, {total: number, count: number}> = {};
    let lowestSubject = null;
    let lowestScore = 100;
    
    assessmentResults.forEach((result: any) => {
      if (!subjectScores[result.subject]) {
        subjectScores[result.subject] = {
          total: 0,
          count: 0
        };
      }
      
      subjectScores[result.subject].total += result.percentageScore;
      subjectScores[result.subject].count += 1;
    });
    
    Object.entries(subjectScores).forEach(([subject, data]) => {
      const averageScore = data.total / data.count;
      if (averageScore < lowestScore) {
        lowestScore = averageScore;
        lowestSubject = subject;
      }
    });
    
    return lowestSubject || 'Mathematics';
  };
  
  const determineFocusAreas = (assessmentResults: any): string[] => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return ['problem-solving', 'critical-thinking']; // Default focus areas
    }
    
    // Find skill areas with lowest scores
    const skillScores: Record<string, {total: number, count: number}> = {};
    
    assessmentResults.forEach((result: any) => {
      if (result.skillBreakdown) {
        Object.entries(result.skillBreakdown).forEach(([skill, score]) => {
          if (!skillScores[skill]) {
            skillScores[skill] = {
              total: 0,
              count: 0
            };
          }
          
          skillScores[skill].total += score as number;
          skillScores[skill].count += 1;
        });
      }
    });
    
    // Sort skills by average score (ascending)
    const sortedSkills = Object.entries(skillScores)
      .map(([skill, data]) => ({
        skill,
        averageScore: data.total / data.count
      }))
      .sort((a, b) => a.averageScore - b.averageScore);
    
    // Return top 3 skills with lowest scores
    return sortedSkills.slice(0, 3).map(item => item.skill);
  };
  
  const generateQuestTitleAndDescription = (subject: string, focusAreas: string[], difficulty: string): {title: string, description: string} => {
    // In a real implementation, this would use an AI service to generate creative titles
    // For now, use templates based on subject and focus areas
    
    const subjectThemes: Record<string, {titles: string[], descriptions: string[]}> = {
      'Mathematics': {
        titles: [
          'The Mathematical Mystery',
          'Number Explorers',
          'Patterns and Puzzles',
          'The Calculation Chronicles'
        ],
        descriptions: [
          'Embark on an adventure to uncover the secrets of mathematical patterns in the world around us.',
          'Journey through the realm of numbers to discover the power of mathematical thinking.',
          'Solve puzzles and challenges that reveal the beauty and logic of mathematics.'
        ]
      },
      'English': {
        titles: [
          'The Literary Labyrinth',
          'Word Wizards',
          'The Storyteller\'s Quest',
          'Language Legends'
        ],
        descriptions: [
          'Journey through a maze of stories, poems, and literary devices to enhance your language skills.',
          'Discover the magic of words and storytelling through exciting challenges and creative tasks.',
          'Explore the power of language and expression through engaging literary adventures.'
        ]
      },
      'Science': {
        titles: [
          'The Scientific Expedition',
          'Discovery Defenders',
          'The Experiment Explorers',
          'Nature\'s Mysteries'
        ],
        descriptions: [
          'Embark on a scientific journey to explore the natural world and discover the principles that govern it.',
          'Conduct experiments and investigations to uncover the secrets of science.',
          'Journey through the fascinating world of scientific discovery and innovation.'
        ]
      }
    };
    
    // Default themes if subject not found
    const defaultThemes = {
      titles: [
        'The Knowledge Quest',
        'Learning Legends',
        'The Discovery Journey',
        'Skill Seekers'
      ],
      descriptions: [
        'Embark on an educational adventure to develop key skills and knowledge.',
        'Journey through challenges designed to enhance your understanding and abilities.',
        'Discover new concepts and skills through engaging activities and challenges.'
      ]
    };
    
    // Get themes for the subject or use defaults
    const themes = subjectThemes[subject] || defaultThemes;
    
    // Select random title and description
    const titleIndex = Math.floor(Math.random() * themes.titles.length);
    const descIndex = Math.floor(Math.random() * themes.descriptions.length);
    
    const title = themes.titles[titleIndex];
    let description = themes.descriptions[descIndex];
    
    // Add focus area to description if available
    if (focusAreas && focusAreas.length > 0) {
      const focusArea = focusAreas[0].replace('-', ' ');
      description += ` This quest focuses on developing your ${focusArea} skills.`;
    }
    
    return { title, description };
  };
  
  const generateQuestObjectives = (subject: string, focusAreas: string[], curriculumContext: any): string[] => {
    // In a real implementation, this would generate objectives based on curriculum standards
    // For now, use templates based on subject and focus areas
    
    const subjectObjectives: Record<string, string[]> = {
      'Mathematics': [
        'Understand and apply mathematical concepts',
        'Develop problem-solving strategies',
        'Recognise patterns and relationships',
        'Use mathematical language precisely',
        'Apply mathematics to real-world situations'
      ],
      'English': [
        'Analyse different types of texts',
        'Develop vocabulary and language skills',
        'Create original written content',
        'Understand literary devices and techniques',
        'Communicate ideas clearly and effectively'
      ],
      'Science': [
        'Understand scientific method',
        'Conduct experiments and investigations',
        'Analyse and interpret data',
        'Make connections between scientific concepts',
        'Apply scientific knowledge to solve problems'
      ]
    };
    
    // Default objectives if subject not found
    const defaultObjectives = [
      'Develop critical thinking skills',
      'Apply knowledge to solve problems',
      'Analyse information effectively',
      'Communicate ideas clearly',
      'Make connections between concepts'
    ];
    
    // Get objectives for the subject or use defaults
    const objectives = subjectObjectives[subject] || defaultObjectives;
    
    // Select 3-5 objectives
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 objectives
    const selectedObjectives: string[] = [];
    
    // Ensure focus areas are included in objectives
    if (focusAreas && focusAreas.length > 0) {
      focusAreas.forEach(area => {
        const formattedArea = area.replace('-', ' ');
        selectedObjectives.push(`Develop ${formattedArea} skills through ${subject.toLowerCase()} challenges`);
      });
    }
    
    // Add additional objectives up to the count
    while (selectedObjectives.length < count) {
      const index = Math.floor(Math.random() * objectives.length);
      const objective = objectives[index];
      
      if (!selectedObjectives.includes(objective)) {
        selectedObjectives.push(objective);
      }
    }
    
    return selectedObjectives;
  };
  
  const generateQuestChapters = (subject: string, focusAreas: string[], difficulty: string): any[] => {
    // In a real implementation, this would generate chapters based on curriculum progression
    // For now, use templates based on subject and difficulty
    
    const chapterCount = {
      'beginner': 3,
      'intermediate': 3,
      'advanced': 4,
      'expert': 4,
      'master': 5
    }[difficulty] || 3;
    
    const challengeBase = {
      'beginner': 3,
      'intermediate': 4,
      'advanced': 4,
      'expert': 5,
      'master': 5
    }[difficulty] || 3;
    
    const subjectChapters: Record<string, any[]> = {
      'Mathematics': [
        {
          title: 'The Pattern Palace',
          description: 'Explore the Pattern Palace to discover the fundamental building blocks of mathematics.'
        },
        {
          title: 'The Sequence Sanctuary',
          description: 'Navigate through the Sequence Sanctuary to understand how patterns evolve and grow.'
        },
        {
          title: 'The Problem-Solving Peaks',
          description: 'Climb the Problem-Solving Peaks to apply your knowledge to increasingly complex challenges.'
        },
        {
          title: 'The Logic Labyrinth',
          description: 'Find your way through the Logic Labyrinth by applying mathematical reasoning.'
        },
        {
          title: 'The Application Arena',
          description: 'Enter the Application Arena to use mathematics in real-world contexts.'
        }
      ],
      'English': [
        {
          title: 'The Vocabulary Valley',
          description: 'Journey through the Vocabulary Valley to expand your language toolkit.'
        },
        {
          title: 'The Grammar Grotto',
          description: 'Explore the Grammar Grotto to master the structures of language.'
        },
        {
          title: 'The Composition Cliffs',
          description: 'Scale the Composition Cliffs to develop your writing skills.'
        },
        {
          title: 'The Literature Lagoon',
          description: 'Dive into the Literature Lagoon to analyze and appreciate different texts.'
        },
        {
          title: 'The Expression Expanse',
          description: 'Cross the Expression Expanse to communicate your ideas effectively.'
        }
      ],
      'Science': [
        {
          title: 'The Observation Outpost',
          description: 'Begin at the Observation Outpost to develop your scientific observation skills.'
        },
        {
          title: 'The Hypothesis Harbor',
          description: 'Dock at the Hypothesis Harbor to learn how to form and test scientific ideas.'
        },
        {
          title: 'The Experiment Enclave',
          description: 'Enter the Experiment Enclave to design and conduct scientific investigations.'
        },
        {
          title: 'The Analysis Archipelago',
          description: 'Navigate the Analysis Archipelago to interpret scientific data and results.'
        },
        {
          title: 'The Conclusion Citadel',
          description: 'Reach the Conclusion Citadel to draw meaningful conclusions from scientific evidence.'
        }
      ]
    };
    
    // Default chapters if subject not found
    const defaultChapters = [
      {
        title: 'The Foundation Fields',
        description: 'Begin your journey in the Foundation Fields to establish core knowledge and skills.'
      },
      {
        title: 'The Challenge Canyons',
        description: 'Navigate through the Challenge Canyons to test and apply your understanding.'
      },
      {
        title: 'The Mastery Mountains',
        description: 'Climb the Mastery Mountains to develop advanced skills and deeper knowledge.'
      },
      {
        title: 'The Integration Isle',
        description: 'Explore the Integration Isle to connect concepts and see the bigger picture.'
      },
      {
        title: 'The Application Apex',
        description: 'Reach the Application Apex to use your knowledge in meaningful contexts.'
      }
    ];
    
    // Get chapters for the subject or use defaults
    const chapters = subjectChapters[subject] || defaultChapters;
    
    // Select chapters based on chapter count
    const selectedChapters = chapters.slice(0, chapterCount);
    
    // Add challenges to each chapter
    return selectedChapters.map((chapter, index) => {
      // Increase challenge count for later chapters
      const challengeCount = challengeBase + Math.min(index, 2);
      
      // Generate challenges
      const challenges = Array.from({ length: challengeCount }, (_, i) => {
        return {
          id: `ch-${index}-${i}`,
          title: `Challenge ${i + 1}`,
          description: `Complete this challenge to progress through ${chapter.title}.`,
          type: getRandomChallengeType(),
          difficulty: getChallengeProgressiveDifficulty(difficulty, index, i, challengeCount),
          completed: false,
          xpReward: 20 + (index * 5) + (i * 2)
        };
      });
      
      return {
        ...chapter,
        id: `chapter-${index}`,
        challenges,
        progress: 0,
        unlocked: index === 0 // Only first chapter is unlocked initially
      };
    });
  };
  
  const getRandomChallengeType = (): string => {
    const types = [
      'quiz',
      'interactive',
      'creative',
      'research',
      'problem-solving',
      'reflection'
    ];
    
    return types[Math.floor(Math.random() * types.length)];
  };
  
  const getChallengeProgressiveDifficulty = (questDifficulty: string, chapterIndex: number, challengeIndex: number, totalChallenges: number): string => {
    // Base difficulty level based on quest difficulty
    const baseDifficultyLevel = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4,
      'master': 5
    }[questDifficulty] || 2;
    
    // Calculate progressive difficulty
    // Later chapters and challenges are more difficult
    const chapterFactor = chapterIndex * 0.5;
    const challengeFactor = (challengeIndex / totalChallenges) * 0.5;
    
    const difficultyLevel = Math.min(Math.round(baseDifficultyLevel + chapterFactor + challengeFactor), 5);
    
    // Map difficulty level to string
    const difficultyMap: Record<number, string> = {
      1: 'beginner',
      2: 'intermediate',
      3: 'advanced',
      4: 'expert',
      5: 'master'
    };
    
    return difficultyMap[difficultyLevel] || 'intermediate';
  };
  
  const generateQuestRewards = (subject: string, difficulty: string): any[] => {
    // Generate rewards based on subject and difficulty
    const baseRewards = [
      {
        type: 'badge',
        name: `${subject} Explorer`,
        description: `Awarded for completing a ${difficulty} ${subject} quest.`,
        icon: 'award'
      },
      {
        type: 'certificate',
        name: `${subject} Achievement`,
        description: `Certificate of achievement in ${subject} at ${difficulty} level.`,
        icon: 'scroll'
      }
    ];
    
    // Add difficulty-specific rewards
    const difficultyRewards: Record<string, any[]> = {
      'beginner': [
        {
          type: 'item',
          name: 'Novice Toolkit',
          description: `Basic tools for ${subject} exploration.`,
          icon: 'backpack'
        }
      ],
      'intermediate': [
        {
          type: 'item',
          name: 'Scholar\'s Compass',
          description: `Helps navigate more complex ${subject} challenges.`,
          icon: 'compass'
        }
      ],
      'advanced': [
        {
          type: 'item',
          name: 'Expert\'s Lens',
          description: `Reveals hidden insights in ${subject} problems.`,
          icon: 'search'
        },
        {
          type: 'skill',
          name: 'Advanced Problem-Solving',
          description: `Enhanced ability to solve complex ${subject} problems.`,
          icon: 'puzzle'
        }
      ],
      'expert': [
        {
          type: 'item',
          name: 'Master\'s Grimoire',
          description: `Contains advanced ${subject} knowledge and techniques.`,
          icon: 'book-open'
        },
        {
          type: 'skill',
          name: 'Expert Analysis',
          description: `Superior ability to analyze ${subject} concepts.`,
          icon: 'bar-chart'
        }
      ],
      'master': [
        {
          type: 'item',
          name: 'Legendary Artifact',
          description: `A rare and powerful tool for ${subject} mastery.`,
          icon: 'sparkles'
        },
        {
          type: 'skill',
          name: 'Master Insight',
          description: `Exceptional understanding of ${subject} principles.`,
          icon: 'lightbulb'
        },
        {
          type: 'title',
          name: `${subject} Sage`,
          description: `A prestigious title awarded to masters of ${subject}.`,
          icon: 'crown'
        }
      ]
    };
    
    return [...baseRewards, ...(difficultyRewards[difficulty] || [])];
  };
  
  const getCurriculumCode = (subject: string, keyStage: string, curriculumContext: any): string => {
    // In a real implementation, this would look up the appropriate curriculum code
    // For now, return a placeholder
    return `${subject.substring(0, 3).toUpperCase()}-${keyStage}-${Math.floor(Math.random() * 1000)}`;
  };
  
  const getCurriculumLink = (subject: string, keyStage: string, curriculumContext: any): string => {
    // In a real implementation, this would generate a link to curriculum resources
    // For now, return a placeholder
    return `/curriculum/${keyStage.toLowerCase()}/${subject.toLowerCase().replace(' ', '-')}`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Adaptive Quest</CardTitle>
        <CardDescription>
          Create a personalized learning quest based on your profile and assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                className="w-full p-2 border rounded"
                value={generationParams.difficulty}
                onChange={(e) => setGenerationParams({
                  ...generationParams,
                  difficulty: e.target.value
                })}
              >
                <option value="auto">Automatic (Based on assessments)</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                className="w-full p-2 border rounded"
                value={generationParams.duration}
                onChange={(e) => setGenerationParams({
                  ...generationParams,
                  duration: e.target.value
                })}
              >
                <option value="short">Short (1-2 hours)</option>
                <option value="medium">Medium (2-3 hours)</option>
                <option value="long">Long (3-5 hours)</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject (Optional)</Label>
            <select
              id="subject"
              className="w-full p-2 border rounded"
              value={generationParams.subject}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                subject: e.target.value
              })}
            >
              <option value="">Automatic (Based on learning needs)</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button 
          onClick={generateAdaptiveQuest}
          disabled={generating}
        >
          {generating ? (
            <>Generating Quest...</>
          ) : (
            <>Generate Quest</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Adventure Quest Saga Component
export function AdventureQuestSagaAdaptive({
  className = ''
}: {
  className?: string;
}): React.ReactNode {
  const [activeTab, setActiveTab] = useState('quests');
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [showQuestDetail, setShowQuestDetail] = useState(false);
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { curriculumData } = useCurriculum();
  const { assessmentResults } = useAssessment();
  const { gamificationSettings } = useGamification();
  
  // Check if character exists on component mount
  useEffect(() => {
    // In a real implementation, this would fetch from an API or local storage
    // For now, use mock data
    const mockCharacter = {
      id: 'char-1',
      name: 'Alex',
      avatar: '/images/avatars/wizard.png',
      level: 5,
      xp: 450,
      xpToNextLevel: 500,
      class: 'Scholar',
      stats: {
        intelligence: 8,
        creativity: 6,
        persistence: 7,
        curiosity: 9
      },
      inventory: [
        {
          id: 'item-1',
          name: 'Scholar\'s Notebook',
          description: 'Increases knowledge retention by 10%',
          type: 'tool',
          rarity: 'uncommon'
        },
        {
          id: 'item-2',
          name: 'Curiosity Compass',
          description: 'Helps discover hidden learning opportunities',
          type: 'accessory',
          rarity: 'rare'
        }
      ],
      badges: [
        {
          id: 'badge-1',
          name: 'Mathematics Explorer',
          description: 'Completed 5 mathematics quests',
          icon: 'calculator'
        },
        {
          id: 'badge-2',
          name: 'Persistent Learner',
          description: 'Completed a difficult quest after multiple attempts',
          icon: 'award'
        }
      ],
      skills: [
        {
          id: 'skill-1',
          name: 'Critical Thinking',
          level: 3,
          progress: 60
        },
        {
          id: 'skill-2',
          name: 'Problem Solving',
          level: 4,
          progress: 30
        },
        {
          id: 'skill-3',
          name: 'Research',
          level: 2,
          progress: 80
        }
      ],
      createdAt: '2025-01-15T10:30:00Z',
      lastActive: '2025-05-14T15:45:00Z'
    };
    
    setCharacter(mockCharacter);
    
    // Mock quests
    const mockQuests = [
      {
        id: 'quest-1',
        title: 'The Mathematical Mystery',
        description: 'Embark on an adventure to uncover the secrets of mathematical patterns in the world around us.',
        difficulty: 'intermediate',
        subject: 'Mathematics',
        keyStage: 'KS2',
        duration: '2-3 hours',
        xpReward: 150,
        progress: 35,
        unlocked: true,
        adaptive: true,
        chapters: [
          {
            id: 'chapter-1',
            title: 'The Pattern Palace',
            description: 'Explore the Pattern Palace to discover the fundamental building blocks of mathematics.',
            progress: 70,
            unlocked: true,
            challenges: [
              {
                id: 'ch-1-1',
                title: 'Challenge 1',
                description: 'Identify number patterns in sequences.',
                type: 'quiz',
                difficulty: 'beginner',
                completed: true,
                xpReward: 20
              },
              {
                id: 'ch-1-2',
                title: 'Challenge 2',
                description: 'Create your own number pattern and explain the rule.',
                type: 'creative',
                difficulty: 'intermediate',
                completed: true,
                xpReward: 25
              },
              {
                id: 'ch-1-3',
                title: 'Challenge 3',
                description: 'Apply pattern recognition to solve a problem.',
                type: 'problem-solving',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 30
              }
            ]
          },
          {
            id: 'chapter-2',
            title: 'The Sequence Sanctuary',
            description: 'Navigate through the Sequence Sanctuary to understand how patterns evolve and grow.',
            progress: 0,
            unlocked: false,
            challenges: [
              {
                id: 'ch-2-1',
                title: 'Challenge 1',
                description: 'Explore Fibonacci sequences in nature.',
                type: 'research',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 25
              },
              {
                id: 'ch-2-2',
                title: 'Challenge 2',
                description: 'Predict the next terms in complex sequences.',
                type: 'quiz',
                difficulty: 'advanced',
                completed: false,
                xpReward: 30
              },
              {
                id: 'ch-2-3',
                title: 'Challenge 3',
                description: 'Create a visual representation of a growing pattern.',
                type: 'creative',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 25
              },
              {
                id: 'ch-2-4',
                title: 'Challenge 4',
                description: 'Apply sequence knowledge to solve a real-world problem.',
                type: 'problem-solving',
                difficulty: 'advanced',
                completed: false,
                xpReward: 35
              }
            ]
          },
          {
            id: 'chapter-3',
            title: 'The Problem-Solving Peaks',
            description: 'Climb the Problem-Solving Peaks to apply your knowledge to increasingly complex challenges.',
            progress: 0,
            unlocked: false,
            challenges: [
              {
                id: 'ch-3-1',
                title: 'Challenge 1',
                description: 'Solve pattern-based word problems.',
                type: 'problem-solving',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 30
              },
              {
                id: 'ch-3-2',
                title: 'Challenge 2',
                description: 'Create a pattern-based puzzle for others to solve.',
                type: 'creative',
                difficulty: 'advanced',
                completed: false,
                xpReward: 35
              },
              {
                id: 'ch-3-3',
                title: 'Challenge 3',
                description: 'Apply pattern recognition to a complex scenario.',
                type: 'interactive',
                difficulty: 'advanced',
                completed: false,
                xpReward: 40
              },
              {
                id: 'ch-3-4',
                title: 'Challenge 4',
                description: 'Reflect on your pattern recognition skills and areas for improvement.',
                type: 'reflection',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 25
              }
            ]
          }
        ],
        rewards: [
          {
            type: 'badge',
            name: 'Mathematics Explorer',
            description: 'Awarded for completing an intermediate Mathematics quest.',
            icon: 'award'
          },
          {
            type: 'certificate',
            name: 'Mathematics Achievement',
            description: 'Certificate of achievement in Mathematics at intermediate level.',
            icon: 'scroll'
          },
          {
            type: 'item',
            name: 'Scholar\'s Compass',
            description: 'Helps navigate more complex Mathematics challenges.',
            icon: 'compass'
          }
        ]
      },
      {
        id: 'quest-2',
        title: 'The Literary Labyrinth',
        description: 'Journey through a maze of stories, poems, and literary devices to enhance your language skills.',
        difficulty: 'beginner',
        subject: 'English',
        keyStage: 'KS2',
        duration: '1-2 hours',
        xpReward: 100,
        progress: 0,
        unlocked: true,
        adaptive: true,
        chapters: [
          {
            id: 'chapter-1',
            title: 'The Vocabulary Valley',
            description: 'Journey through the Vocabulary Valley to expand your language toolkit.',
            progress: 0,
            unlocked: true,
            challenges: [
              {
                id: 'ch-1-1',
                title: 'Challenge 1',
                description: 'Explore synonyms and antonyms.',
                type: 'quiz',
                difficulty: 'beginner',
                completed: false,
                xpReward: 15
              },
              {
                id: 'ch-1-2',
                title: 'Challenge 2',
                description: 'Create a word web for a theme.',
                type: 'creative',
                difficulty: 'beginner',
                completed: false,
                xpReward: 20
              },
              {
                id: 'ch-1-3',
                title: 'Challenge 3',
                description: 'Use new vocabulary in context.',
                type: 'interactive',
                difficulty: 'beginner',
                completed: false,
                xpReward: 20
              }
            ]
          },
          {
            id: 'chapter-2',
            title: 'The Grammar Grotto',
            description: 'Explore the Grammar Grotto to master the structures of language.',
            progress: 0,
            unlocked: false,
            challenges: [
              {
                id: 'ch-2-1',
                title: 'Challenge 1',
                description: 'Identify parts of speech in sentences.',
                type: 'quiz',
                difficulty: 'beginner',
                completed: false,
                xpReward: 15
              },
              {
                id: 'ch-2-2',
                title: 'Challenge 2',
                description: 'Correct grammatical errors in passages.',
                type: 'problem-solving',
                difficulty: 'beginner',
                completed: false,
                xpReward: 20
              },
              {
                id: 'ch-2-3',
                title: 'Challenge 3',
                description: 'Create sentences using specific grammatical structures.',
                type: 'creative',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 25
              }
            ]
          },
          {
            id: 'chapter-3',
            title: 'The Composition Cliffs',
            description: 'Scale the Composition Cliffs to develop your writing skills.',
            progress: 0,
            unlocked: false,
            challenges: [
              {
                id: 'ch-3-1',
                title: 'Challenge 1',
                description: 'Plan a short story using a story map.',
                type: 'creative',
                difficulty: 'beginner',
                completed: false,
                xpReward: 20
              },
              {
                id: 'ch-3-2',
                title: 'Challenge 2',
                description: 'Write a descriptive paragraph using sensory language.',
                type: 'creative',
                difficulty: 'intermediate',
                completed: false,
                xpReward: 25
              },
              {
                id: 'ch-3-3',
                title: 'Challenge 3',
                description: 'Edit and improve a piece of writing.',
                type: 'problem-solving',
                difficulty: 'beginner',
                completed: false,
                xpReward: 20
              }
            ]
          }
        ],
        rewards: [
          {
            type: 'badge',
            name: 'English Explorer',
            description: 'Awarded for completing a beginner English quest.',
            icon: 'award'
          },
          {
            type: 'certificate',
            name: 'English Achievement',
            description: 'Certificate of achievement in English at beginner level.',
            icon: 'scroll'
          },
          {
            type: 'item',
            name: 'Novice Toolkit',
            description: 'Basic tools for English exploration.',
            icon: 'backpack'
          }
        ]
      }
    ];
    
    setQuests(mockQuests);
  }, []);
  
  // Handle quest selection
  const handleQuestSelect = (quest: any): void => {
    setSelectedQuest(quest);
    setShowQuestDetail(true);
  };
  
  // Handle quest completion
  const handleQuestComplete = (questId: string): void => {
    // Update quest progress
    setQuests(prevQuests => 
      prevQuests.map(quest => 
        quest.id === questId 
          ? { ...quest, progress: 100 } 
          : quest
      )
    );
    
    // Update character XP
    if (character) {
      const completedQuest = quests.find(q => q.id === questId);
      if (completedQuest) {
        const newXP = character.xp + completedQuest.xpReward;
        const levelUp = newXP >= character.xpToNextLevel;
        
        setCharacter({
          ...character,
          xp: levelUp ? newXP - character.xpToNextLevel : newXP,
          level: levelUp ? character.level + 1 : character.level,
          xpToNextLevel: levelUp ? character.xpToNextLevel + 100 : character.xpToNextLevel
        });
        
        // Show toast notification
        toast({
          title: "Quest Completed!",
          description: `You earned ${completedQuest.xpReward} XP${levelUp ? ' and leveled up!' : '!'}`,
          variant: "success",
        });
      }
    }
  };
  
  // Handle quest generation
  const handleQuestGenerated = (quest: any): void => {
    setQuests(prevQuests => [...prevQuests, quest]);
    setActiveTab('quests');
  };
  
  // Handle character creation
  const handleCharacterCreated = (newCharacter: any): void => {
    setCharacter(newCharacter);
    setActiveTab('quests');
    
    toast({
      title: "Character Created!",
      description: `Welcome, ${newCharacter.name}! Your adventure begins now.`,
      variant: "success",
    });
  };
  
  // Handle starting a quest
  const handleStartQuest = async (questId: string): Promise<void> => {
    // Check if feature can be used (fair usage)
    const { useFeatureWithCredit } = useFairUsage();
    const usageResult = await useFeatureWithCredit('questParticipation');
    
    if (!usageResult.success && !usageResult.usedCredits) {
      // If feature cannot be used and credits weren't used, exit
      return;
    }
    
    // Find the quest
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setSelectedQuest(quest);
      setShowQuestDetail(true);
      
      // If quest hasn't been started yet, update progress
      if (quest.progress === 0) {
        setQuests(prevQuests => 
          prevQuests.map(q => 
            q.id === questId 
              ? { ...q, progress: 5 } 
              : q
          )
        );
      }
      
      toast({
        title: "Quest Started",
        description: `You've embarked on "${quest.title}". Good luck on your journey!`,
        variant: "success",
      });
    }
  };
  
  return (
    <div className={`container mx-auto py-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Adventure Quest Saga</h1>
          <p className="text-gray-600">Embark on personalized learning adventures</p>
        </div>
        {character && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{character.name}</p>
              <p className="text-sm text-gray-600">Level {character.level} {character.class}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {character.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quests" disabled={!character}>
            <Map className="w-4 h-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="character" disabled={!character}>
            <Sword className="w-4 h-4 mr-2" />
            Character
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={!character}>
            <Trophy className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="create">
            <Star className="w-4 h-4 mr-2" />
            Create
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests" className="mt-6">
          {showQuestDetail && selectedQuest ? (
            <QuestDetail 
              quest={selectedQuest}
              onBack={() => setShowQuestDetail(false)}
              onComplete={handleQuestComplete}
            />
          ) : (
            <QuestHub 
              quests={quests}
              onQuestSelect={handleQuestSelect}
              onStartQuest={handleStartQuest}
            />
          )}
        </TabsContent>
        
        <TabsContent value="character" className="mt-6">
          {character && (
            <CharacterDashboard 
              character={character}
              quests={quests}
            />
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your progress across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Mathematics</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">English</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Science</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">History</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Detailed Progress</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>Track your skill growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {character && character.skills.map((skill: any) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span>Level {skill.level}</span>
                      </div>
                      <div className="flex items-center">
                        <Progress value={skill.progress} className="h-2 flex-1" />
                        <span className="ml-2 text-sm">{skill.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Skills</Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quest Completion</CardTitle>
                <CardDescription>Your adventure journey so far</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quests.map((quest: any) => (
                    <div key={quest.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{quest.title}</h3>
                          <p className="text-sm text-gray-600">{quest.subject} • {quest.difficulty}</p>
                        </div>
                        <Badge variant={quest.progress === 100 ? "success" : "outline"}>
                          {quest.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <Progress value={quest.progress} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span>{quest.progress}% complete</span>
                        <span>{quest.xpReward} XP reward</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          {!character ? (
            <CharacterCreation onCharacterCreated={handleCharacterCreated} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdaptiveQuestGenerator
                userProfile={profile}
                learningHistory={[]}
                curriculumContext={curriculumData}
                assessmentResults={assessmentResults}
                onQuestGenerated={handleQuestGenerated}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quest Templates</CardTitle>
                  <CardDescription>Start with a pre-designed quest template</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="mr-4 p-2 bg-blue-100 rounded-full">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Mathematics Explorer</h3>
                          <p className="text-sm text-gray-600">A journey through number patterns, shapes, and mathematical puzzles.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="mr-4 p-2 bg-green-100 rounded-full">
                          <Scroll className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Literary Adventure</h3>
                          <p className="text-sm text-gray-600">Explore the world of stories, poetry, and creative writing.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="mr-4 p-2 bg-purple-100 rounded-full">
                          <Zap className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Scientific Discovery</h3>
                          <p className="text-sm text-gray-600">Conduct experiments and explore the natural world through science.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
