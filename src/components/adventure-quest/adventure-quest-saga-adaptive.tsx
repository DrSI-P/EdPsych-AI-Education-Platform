
'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
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

// Define types for clarity
interface Quest {
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
  chapters: Chapter[];
  rewards: Reward[];
  progress: number;
  unlocked: boolean;
  adaptive: boolean;
  focusAreas: string[];
  generatedAt: string;
  curriculumCode?: string;
  curriculumLink?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  progress: number;
  unlocked: boolean;
  challenges: Challenge[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  completed: boolean;
  xpReward: number;
}

interface Reward {
  type: string;
  name: string;
  description: string;
  rarity: string;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  class: string;
  stats: { [key: string]: number };
  inventory: InventoryItem[];
  badges: BadgeItem[];
  skills: SkillItem[];
  createdAt: string;
  lastActive: string;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SkillItem {
  id: string;
  name: string;
  level: number;
  progress: number;
}

interface UserProfile {
  // Define structure based on actual user profile context
  keyStage?: string;
  learningStyles?: string[];
  // ... other profile properties
}

interface AssessmentResult {
  subject: string;
  percentageScore: number;
  skillBreakdown?: { [key: string]: number };
  // ... other assessment properties
}

interface GenerationParams {
  difficulty: string;
  subject: string;
  keyStage: string;
  learningStyles: string[];
  focusAreas: string[];
  duration: string;
}

/**
 * Adaptive Quest Generation and Progress Tracking System
 */

// Helper functions moved outside the component for better structure and testability

const determineSubjectFocus = (learningHistory: any, assessmentResults: AssessmentResult[] | null): string => {
  if (!assessmentResults || assessmentResults.length === 0) {
    return 'Mathematics'; // Default subject
  }
  
  const subjectScores: Record<string, {total: number, count: number}> = {};
  let lowestSubject: string | null = null;
  let lowestScore = 100;
  
  assessmentResults.forEach((result) => {
    if (!subjectScores[result.subject]) {
      subjectScores[result.subject] = { total: 0, count: 0 };
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

const determineFocusAreas = (assessmentResults: AssessmentResult[] | null): string[] => {
  if (!assessmentResults || assessmentResults.length === 0) {
    return ['problem-solving', 'critical-thinking']; // Default focus areas
  }
  
  const skillScores: Record<string, {total: number, count: number}> = {};
  
  assessmentResults.forEach((result) => {
    if (result.skillBreakdown) {
      Object.entries(result.skillBreakdown).forEach(([skill, score]) => {
        if (!skillScores[skill]) {
          skillScores[skill] = { total: 0, count: 0 };
        }
        skillScores[skill].total += score as number;
        skillScores[skill].count += 1;
      });
    }
  });
  
  const sortedSkills = Object.entries(skillScores)
    .map(([skill, data]) => ({ skill, averageScore: data.total / data.count }))
    .sort((a, b) => a.averageScore - b.averageScore);
  
  return sortedSkills.slice(0, 3).map(item => item.skill);
};

const generateQuestTitleAndDescription = (subject: string, focusAreas: string[], difficulty: string): {title: string, description: string} => {
  const subjectThemes: Record<string, {titles: string[], descriptions: string[]}> = {
    'Mathematics': {
      titles: ['The Mathematical Mystery', 'Number Explorers', 'Patterns and Puzzles', 'The Calculation Chronicles'],
      descriptions: [
        'Embark on an adventure to uncover the secrets of mathematical patterns in the world around us.',
        'Journey through the realm of numbers to discover the power of mathematical thinking.',
        'Solve puzzles and challenges that reveal the beauty and logic of mathematics.'
      ]
    },
    'English': {
      titles: ['The Literary Labyrinth', 'Word Wizards', 'The Storyteller\'s Quest', 'Language Legends'],
      descriptions: [
        'Journey through a maze of stories, poems, and literary devices to enhance your language skills.',
        'Discover the magic of words and storytelling through exciting challenges and creative tasks.',
        'Explore the power of language and expression through engaging literary adventures.'
      ]
    },
    'Science': {
      titles: ['The Scientific Expedition', 'Discovery Defenders', 'The Experiment Explorers', 'Nature\'s Mysteries'],
      descriptions: [
        'Embark on a scientific journey to explore the natural world and discover the principles that govern it.',
        'Conduct experiments and investigations to uncover the secrets of science.',
        'Journey through the fascinating world of scientific discovery and innovation.'
      ]
    }
  };
  const defaultThemes = {
    titles: ['The Knowledge Quest', 'Learning Legends', 'The Discovery Journey', 'Skill Seekers'],
    descriptions: [
      'Embark on an educational adventure to develop key skills and knowledge.',
      'Journey through challenges designed to enhance your understanding and abilities.',
      'Discover new concepts and skills through engaging activities and challenges.'
    ]
  };
  const themes = subjectThemes[subject] || defaultThemes;
  const titleIndex = Math.floor(Math.random() * themes.titles.length);
  const descIndex = Math.floor(Math.random() * themes.descriptions.length);
  const title = themes.titles[titleIndex];
  let description = themes.descriptions[descIndex];
  if (focusAreas && focusAreas.length > 0) {
    const focusArea = focusAreas[0].replace('-', ' ');
    description += ` This quest focuses on developing your ${focusArea} skills.`;
  }
  return { title, description };
};

const generateQuestObjectives = (subject: string, focusAreas: string[], curriculumContext: any): string[] => {
  const subjectObjectives: Record<string, string[]> = {
    'Mathematics': [
      'Understand and apply mathematical concepts', 'Develop problem-solving strategies',
      'Recognise patterns and relationships', 'Use mathematical language precisely',
      'Apply mathematics to real-world situations'
    ],
    'English': [
      'Analyse different types of texts', 'Develop vocabulary and language skills',
      'Create original written content', 'Understand literary devices and techniques',
      'Communicate ideas clearly and effectively'
    ],
    'Science': [
      'Understand scientific method', 'Conduct experiments and investigations',
      'Analyse and interpret data', 'Make connections between scientific concepts',
      'Apply scientific knowledge to solve problems'
    ]
  };
  const defaultObjectives = [
    'Develop critical thinking skills', 'Apply knowledge to solve problems',
    'Analyse information effectively', 'Communicate ideas clearly',
    'Make connections between concepts'
  ];
  const objectives = subjectObjectives[subject] || defaultObjectives;
  const count = Math.floor(Math.random() * 3) + 3;
  const selectedObjectives: string[] = [];
  if (focusAreas && focusAreas.length > 0) {
    focusAreas.forEach(area => {
      const formattedArea = area.replace('-', ' ');
      selectedObjectives.push(`Develop ${formattedArea} skills through ${subject.toLowerCase()} challenges`);
    });
  }
  while (selectedObjectives.length < count) {
    const index = Math.floor(Math.random() * objectives.length);
    const objective = objectives[index];
    if (!selectedObjectives.includes(objective)) {
      selectedObjectives.push(objective);
    }
  }
  return selectedObjectives;
};

const generateQuestChapters = (subject: string, focusAreas: string[], difficulty: string): Chapter[] => {
  const chapterCountMap: Record<string, number> = { 'beginner': 3, 'intermediate': 3, 'advanced': 4, 'expert': 4, 'master': 5 };
  const challengeBaseMap: Record<string, number> = { 'beginner': 3, 'intermediate': 4, 'advanced': 4, 'expert': 5, 'master': 5 };
  const chapterCount = chapterCountMap[difficulty] || 3;
  const challengeBase = challengeBaseMap[difficulty] || 3;

  // Mock chapter generation - replace with actual logic
  const chapters: Chapter[] = [];
  for (let i = 1; i <= chapterCount; i++) {
    const challenges: Challenge[] = [];
    const challengeCount = challengeBase + Math.floor(Math.random() * 2) - 1; // +/- 1 challenge
    for (let j = 1; j <= challengeCount; j++) {
      challenges.push({
        id: `ch-${i}-${j}`,
        title: `Challenge ${j}`,
        description: `Complete challenge ${j} for chapter ${i}.`,
        type: ['quiz', 'creative', 'problem-solving'][Math.floor(Math.random() * 3)],
        difficulty: difficulty,
        completed: false,
        xpReward: (difficultyMultiplier[difficulty] || 1) * 10 * j
      });
    }
    chapters.push({
      id: `chapter-${i}`,
      title: `${subject} Chapter ${i}: The ${focusAreas[i % focusAreas.length] || 'Basics'}`, // Example title
      description: `Explore chapter ${i} of the ${subject} quest. Focus: ${focusAreas[i % focusAreas.length] || 'Core Concepts'}.`,
      progress: 0,
      unlocked: i === 1, // Only first chapter unlocked initially
      challenges: challenges
    });
  }
  return chapters;
};

const generateQuestRewards = (subject: string, difficulty: string): Reward[] => {
  const rarityMap: Record<string, string> = { 'beginner': 'common', 'intermediate': 'uncommon', 'advanced': 'rare', 'expert': 'epic', 'master': 'legendary' };
  const rarity = rarityMap[difficulty] || 'common';
  return [
    {
      type: 'badge',
      name: `${subject} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Badge`,
      description: `Completed the ${subject} quest at ${difficulty} level.`,
      rarity: rarity
    },
    {
      type: 'item',
      name: `Scroll of ${subject} Knowledge`,
      description: `A scroll containing insights into ${subject}.`,
      rarity: rarity
    }
  ];
};

const difficultyMultiplier: Record<string, number> = { 'beginner': 1, 'intermediate': 1.5, 'advanced': 2, 'expert': 2.5, 'master': 3 };
const durationMultiplier: Record<string, number> = { 'short': 1, 'medium': 1.5, 'long': 2 };

const getCurriculumCode = (subject: string, keyStage: string, curriculumContext: any): string | undefined => {
  // Mock implementation - replace with actual curriculum lookup
  return curriculumContext?.findCode ? curriculumContext.findCode(subject, keyStage) : `${subject.toUpperCase()}-${keyStage}`;
};

const getCurriculumLink = (subject: string, keyStage: string, curriculumContext: any): string | undefined => {
  // Mock implementation - replace with actual curriculum lookup
  return curriculumContext?.findLink ? curriculumContext.findLink(subject, keyStage) : `/curriculum/${subject}/${keyStage}`;
};

// Create adaptive quest based on user data
const createAdaptiveQuest = (
  userProfile: UserProfile | null, 
  learningHistory: any, // Define type if available
  assessmentResults: AssessmentResult[] | null, 
  params: GenerationParams,
  curriculumContext: any // Define type if available
): Quest => {
  let difficulty = params.difficulty;
  if (difficulty === 'auto') {
    const averageScore = assessmentResults && assessmentResults.length > 0
      ? assessmentResults.reduce((sum, result) => sum + result.percentageScore, 0) / assessmentResults.length
      : 50;
    if (averageScore < 40) difficulty = 'beginner';
    else if (averageScore < 60) difficulty = 'intermediate';
    else if (averageScore < 80) difficulty = 'advanced';
    else difficulty = 'expert';
  }
  
  const subject = params.subject || determineSubjectFocus(learningHistory, assessmentResults);
  const keyStage = params.keyStage || userProfile?.keyStage || 'KS2';
  // Correctly reference learningStyles from userProfile or params
  const learningStyles = params.learningStyles.length > 0 
    ? params.learningStyles 
    : userProfile?.learningStyles || ['visual', 'reading_writing'];
  const focusAreas = params.focusAreas.length > 0
    ? params.focusAreas
    : determineFocusAreas(assessmentResults);
  
  const durationMap: Record<string, string> = { 'short': '1-2 hours', 'medium': '2-3 hours', 'long': '3-5 hours' };
  const duration = durationMap[params.duration] || '2-3 hours';
  
  const { title, description } = generateQuestTitleAndDescription(subject, focusAreas, difficulty);
  const objectives = generateQuestObjectives(subject, focusAreas, curriculumContext);
  const chapters = generateQuestChapters(subject, focusAreas, difficulty);
  const rewards = generateQuestRewards(subject, difficulty);
  
  const baseXp = 100;
  const xpReward = Math.round(
    baseXp * 
    (difficultyMultiplier[difficulty] || 1) * 
    (durationMultiplier[params.duration] || 1.5)
  );
  
  return {
    id: `aq-${Date.now()}`,
    title,
    description,
    difficulty,
    subject,
    keyStage,
    duration,
    xpReward,
    learningStyles, // Ensure this is correctly passed
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

// Adaptive Quest Generator Component
const AdaptiveQuestGenerator = ({ 
  userProfile, 
  learningHistory, 
  curriculumContext, 
  assessmentResults,
  onQuestGenerated
}: {
  userProfile: UserProfile | null;
  learningHistory: any; // Define type if available
  curriculumContext: any; // Define type if available
  assessmentResults: AssessmentResult[] | null;
  onQuestGenerated: (quest: Quest) => void;
}): React.ReactNode => {
  const [generating, setGenerating] = useState(false);
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    difficulty: 'auto',
    subject: '',
    keyStage: '',
    learningStyles: [],
    focusAreas: [],
    duration: 'medium'
  });
  const { toast } = useToast();
  // Call useFairUsage hook at the top level
  const { useFeatureWithCredit, CreditPurchaseDialog, canUseFeature } = useFairUsage();

  // Function to handle the generation logic
  const handleGenerateQuest = useCallback(async (): Promise<void> => {
    setGenerating(true);
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('adaptiveQuestGeneration');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        setGenerating(false);
        return; // Exit if feature cannot be used
      }
      
      // Simulate AI generation
      setTimeout(() => {
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
      }, 1500); // Reduced timeout for simulation
      
    } catch (error) {
      // console.error("Error generating adaptive quest:", error); // Avoid console logs
      toast({
        title: "Generation Failed",
        description: "There was an error generating your quest. Please try again.",
        variant: "destructive",
      });
      setGenerating(false);
    }
  }, [userProfile, learningHistory, assessmentResults, generationParams, curriculumContext, onQuestGenerated, toast, useFeatureWithCredit]);

  // Check initial feature availability
  const [isFeatureAvailable, setIsFeatureAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    canUseFeature('adaptiveQuestGeneration').then(result => setIsFeatureAvailable(result.success));
  }, [canUseFeature]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Adaptive Quest</CardTitle>
        <CardDescription>Create a personalized quest based on learning needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generation Parameter Controls (Simplified) */}
        <div>
          <Label htmlFor="subject-select">Subject Focus (Optional)</Label>
          <select 
            id="subject-select"
            value={generationParams.subject}
            onChange={(e) => setGenerationParams({...generationParams, subject: e.target.value})}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Automatic (Based on Profile)</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            {/* Add other subjects as needed */}
          </select>
        </div>
        <div>
          <Label htmlFor="difficulty-select">Difficulty</Label>
          <select 
            id="difficulty-select"
            value={generationParams.difficulty}
            onChange={(e) => setGenerationParams({...generationParams, difficulty: e.target.value})}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="auto">Automatic</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setGenerationParams({ difficulty: 'auto', subject: '', keyStage: '', learningStyles: [], focusAreas: [], duration: 'medium' })}>Reset</Button>
        <Button 
          onClick={handleGenerateQuest} // Use the handler function
          disabled={generating || isFeatureAvailable === false}
        >
          {generating ? 'Generating...' : (isFeatureAvailable === false ? 'Credits Needed' : 'Generate Quest')}
        </Button>
      </CardFooter>
      {/* Render CreditPurchaseDialog if needed */}
      <CreditPurchaseDialog featureId="adaptiveQuestGeneration" />
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
  const [character, setCharacter] = useState<Character | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestDetail, setShowQuestDetail] = useState(false);
  const { toast } = useToast();
  const { profile } = useUserProfile(); // Assuming profile has UserProfile structure
  const { curriculumData } = useCurriculum(); // Assuming structure
  const { assessmentResults } = useAssessment(); // Assuming AssessmentResult[] structure
  const { gamificationSettings, addXP } = useGamification(); // Assuming structure and addXP function
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage(); // Hook called at top level

  // Fetch initial data
  useEffect(() => {
    // Mock character data fetch
    const mockCharacterData: Character = {
      id: 'char-1', name: 'Alex', avatar: '/images/avatars/wizard.png', level: 5, xp: 450, xpToNextLevel: 500, class: 'Scholar',
      stats: { intelligence: 8, creativity: 6, persistence: 7, curiosity: 9 },
      inventory: [{ id: 'item-1', name: 'Scholar\'s Notebook', description: 'Increases knowledge retention by 10%', type: 'tool', rarity: 'uncommon' }],
      badges: [{ id: 'badge-1', name: 'Mathematics Explorer', description: 'Completed 5 mathematics quests', icon: 'calculator' }],
      skills: [{ id: 'skill-1', name: 'Critical Thinking', level: 3, progress: 60 }],
      createdAt: '2025-01-15T10:30:00Z', lastActive: '2025-05-14T15:45:00Z'
    };
    setCharacter(mockCharacterData);

    // Mock quests data fetch
    const mockQuestsData: Quest[] = [
      {
        id: 'quest-1', title: 'The Mathematical Mystery', description: 'Embark on an adventure...', difficulty: 'intermediate', subject: 'Mathematics', keyStage: 'KS2', duration: '2-3 hours', xpReward: 150, progress: 35, unlocked: true, adaptive: true, learningStyles: ['visual'], objectives: ['Obj 1'], chapters: [], rewards: [], focusAreas: ['patterns'], generatedAt: new Date().toISOString()
      }
      // Add more mock quests if needed
    ];
    setQuests(mockQuestsData);

  }, []); // Empty dependency array ensures this runs only once on mount

  const handleQuestGenerated = useCallback((newQuest: Quest): void => {
    setQuests(prevQuests => [...prevQuests, newQuest]);
    setActiveTab('quests'); // Switch to quests tab to show the new quest
  }, []);

  const handleStartQuest = useCallback(async (questId: string): Promise<void> => {
    const questToStart = quests.find(q => q.id === questId);
    if (!questToStart) return;

    // Check fair usage before starting
    const usageResult = await useFeatureWithCredit('startQuest'); 
    if (!usageResult.success && !usageResult.usedCredits) {
      return; // Exit if cannot start
    }

    setSelectedQuest(questToStart);
    setShowQuestDetail(true);
    toast({ title: `Quest Started: ${questToStart.title}` });
  }, [quests, toast, useFeatureWithCredit]);

  const handleCompleteChallenge = useCallback((questId: string, chapterId: string, challengeId: string, xpEarned: number): void => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.id === questId) {
          const updatedChapters = quest.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              const updatedChallenges = chapter.challenges.map(challenge => 
                challenge.id === challengeId ? { ...challenge, completed: true } : challenge
              );
              // Recalculate chapter progress
              const completedChallenges = updatedChallenges.filter(c => c.completed).length;
              const chapterProgress = Math.round((completedChallenges / updatedChallenges.length) * 100);
              return { ...chapter, challenges: updatedChallenges, progress: chapterProgress };
            }
            return chapter;
          });
          // Recalculate overall quest progress
          const totalChapters = updatedChapters.length;
          const completedChaptersProgress = updatedChapters.reduce((sum, ch) => sum + ch.progress, 0);
          const questProgress = totalChapters > 0 ? Math.round(completedChaptersProgress / totalChapters) : 0;
          return { ...quest, chapters: updatedChapters, progress: questProgress };
        }
        return quest;
      })
    );

    // Add XP using gamification context
    if (addXP) {
      addXP(xpEarned);
    }

    toast({ title: "Challenge Complete!", description: `You earned ${xpEarned} XP!`, variant: "success" });

    // Check if quest is complete
    const currentQuest = quests.find(q => q.id === questId);
    if (currentQuest && currentQuest.progress === 100) {
      handleCompleteQuest(questId);
    }
  }, [quests, toast, addXP]); // Added addXP dependency

  const handleCompleteQuest = useCallback((questId: string): void => {
    const completedQuest = quests.find(q => q.id === questId);
    if (!completedQuest) return;

    toast({ title: `Quest Complete: ${completedQuest.title}`, description: `You earned ${completedQuest.xpReward} XP and rewards!`, variant: "success" });
    
    // Update character stats, inventory, badges based on rewards
    setCharacter(prevChar => {
      if (!prevChar) return null;
      let updatedChar = { ...prevChar };
      // Add XP
      if (addXP) {
        addXP(completedQuest.xpReward); // Use gamification context for XP
      }
      // Add rewards (badges, items)
      completedQuest.rewards.forEach(reward => {
        if (reward.type === 'badge' && !updatedChar.badges.some(b => b.name === reward.name)) {
          updatedChar.badges = [...updatedChar.badges, { id: `badge-${Date.now()}`, name: reward.name, description: reward.description, icon: 'award' }];
        }
        // Add logic for items if needed
      });
      return updatedChar;
    });

    // Potentially unlock next quest or provide recommendations
    // ... logic for next steps ...

    // Close detail view
    setShowQuestDetail(false);
    setSelectedQuest(null);
  }, [quests, toast, addXP]); // Added addXP dependency

  const handleCharacterCreated = useCallback((newCharacter: Character): void => {
    setCharacter(newCharacter);
    toast({ title: "Character Created!", description: `Welcome, ${newCharacter.name}!` });
  }, [toast]);

  if (!profile) {
    return <div>Loading user profile...</div>; // Or some loading indicator
  }

  if (!character) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />;
  }

  return (
    <div className={`p-4 md:p-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="quests">Quests</TabsTrigger>
          <TabsTrigger value="character">Character</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="quests">
          {showQuestDetail && selectedQuest ? (
            <QuestDetail 
              quest={selectedQuest} 
              onBack={() => { setShowQuestDetail(false); setSelectedQuest(null); }} 
              onCompleteChallenge={handleCompleteChallenge}
            />
          ) : (
            <QuestHub 
              quests={quests} 
              onStartQuest={handleStartQuest} 
            />
          )}
        </TabsContent>

        <TabsContent value="character">
          <CharacterDashboard character={character} />
        </TabsContent>

        <TabsContent value="generate">
          <AdaptiveQuestGenerator 
            userProfile={profile} 
            learningHistory={null} // Pass actual learning history if available
            curriculumContext={curriculumData} 
            assessmentResults={assessmentResults} 
            onQuestGenerated={handleQuestGenerated} 
          />
        </TabsContent>
      </Tabs>
      {/* Render CreditPurchaseDialog globally if needed */}
      <CreditPurchaseDialog featureId="generic" /> 
    </div>
  );
}
