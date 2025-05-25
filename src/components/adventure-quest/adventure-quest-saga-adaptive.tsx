'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Removed unused imports: Badge, Separator, Progress
// Removed unused icons: Sword, Map, Trophy, Star, BookOpen
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

interface FairUsageResult {
  success: boolean;
  usedCredits: boolean;
  message?: string;
}

/**
 * Adaptive Quest Generation and Progress Tracking System
 */

// Helper functions moved outside the component for better structure and testability

const determineSubjectFocus = (learningHistory: Record<string, unknown>, assessmentResults: AssessmentResult[] | null): string => {
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

const generateQuestTitleAndDescription = (subject: string, focusAreas: string[]): {title: string, description: string} => {
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
      titles: ['The Literary Labyrinth', 'Word Wizards', 'The Storyteller&apos;s Quest', 'Language Legends'],
      descriptions: [
        'Journey through a maze of stories, poems, and literary devices to enhance your language skills.',
        'Discover the magic of words and storytelling through exciting challenges and creative tasks.',
        'Explore the power of language and expression through engaging literary adventures.'
      ]
    },
    'Science': {
      titles: ['The Scientific Expedition', 'Discovery Defenders', 'The Experiment Explorers', 'Nature&apos;s Mysteries'],
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

const generateQuestObjectives = (subject: string, focusAreas: string[], curriculumContext: Record<string, unknown>): string[] => {
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

const difficultyMultiplier: Record<string, number> = { 'beginner': 1, 'intermediate': 1.5, 'advanced': 2, 'expert': 2.5, 'master': 3 };
const durationMultiplier: Record<string, number> = { 'short': 1, 'medium': 1.5, 'long': 2 };

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

const getCurriculumCode = (subject: string, keyStage: string, curriculumContext: Record<string, unknown>): string | undefined => {
  // Mock implementation - replace with actual curriculum lookup
  return curriculumContext?.findCode ? (curriculumContext.findCode as Function)(subject, keyStage) : `${subject.toUpperCase()}-${keyStage}`;
};

const getCurriculumLink = (subject: string, keyStage: string, curriculumContext: Record<string, unknown>): string | undefined => {
  // Mock implementation - replace with actual curriculum lookup
  return curriculumContext?.findLink ? (curriculumContext.findLink as Function)(subject, keyStage) : `/curriculum/${subject}/${keyStage}`;
};

// Create adaptive quest based on user data
const createAdaptiveQuest = (
  userProfile: UserProfile | null, 
  learningHistory: Record<string, unknown>, 
  assessmentResults: AssessmentResult[] | null, 
  params: GenerationParams,
  curriculumContext: Record<string, unknown>
): Quest => {
  let questDifficulty = params.difficulty;
  if (questDifficulty === 'auto') {
    const averageScore = assessmentResults && assessmentResults.length > 0
      ? assessmentResults.reduce((sum, result) => sum + result.percentageScore, 0) / assessmentResults.length
      : 50;
    if (averageScore < 40) questDifficulty = 'beginner';
    else if (averageScore < 60) questDifficulty = 'intermediate';
    else if (averageScore < 80) questDifficulty = 'advanced';
    else questDifficulty = 'expert';
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
  
  const { title, description } = generateQuestTitleAndDescription(subject, focusAreas);
  const objectives = generateQuestObjectives(subject, focusAreas, curriculumContext);
  const chapters = generateQuestChapters(subject, focusAreas, questDifficulty);
  const rewards = generateQuestRewards(subject, questDifficulty);
  
  const baseXp = 100;
  const xpReward = Math.round(
    baseXp * 
    (difficultyMultiplier[questDifficulty] || 1) * 
    (durationMultiplier[params.duration] || 1.5)
  );
  
  return {
    id: `aq-${Date.now()}`,
    title,
    description,
    difficulty: questDifficulty,
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
  learningHistory: Record<string, unknown>;
  curriculumContext: Record<string, unknown>;
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
  const fairUsage = useFairUsage();
  
  // Function to check if feature is available based on fair usage
  const checkFeatureAvailability = useCallback((): FairUsageResult => {
    // This would normally check against the user's subscription or fair usage limits
    // For now, we'll assume it's always available
    return { success: true, usedCredits: false };
  }, []);
  
  const handleGenerateQuest = useCallback((): void => {
    setGenerating(true);
    
    // Check fair usage before generating quest
    const featureCheck = checkFeatureAvailability();
    
    if (featureCheck.success) {
      try {
        const newQuest = createAdaptiveQuest(
          userProfile,
          learningHistory,
          assessmentResults,
          generationParams,
          curriculumContext
        );
        
        onQuestGenerated(newQuest);
        
        toast({
          title: "Quest Generated!",
          description: `Your adaptive quest "${newQuest.title}" has been created.`
        });
      } catch (error) {
        toast({
          title: "Generation Failed",
          description: "There was an error generating your quest. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Feature Limit Reached",
        description: featureCheck.message || "You've reached your limit for generating quests today. Upgrade your plan or try again tomorrow.",
        variant: "destructive"
      });
    }
    
    setGenerating(false);
  }, [userProfile, learningHistory, assessmentResults, generationParams, curriculumContext, onQuestGenerated, toast, checkFeatureAvailability]);
  
  const handleParamChange = (param: keyof GenerationParams, value: string): void => {
    setGenerationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  const handleLearningStyleToggle = (style: string): void => {
    setGenerationParams(prev => {
      const currentStyles = [...prev.learningStyles];
      const index = currentStyles.indexOf(style);
      
      if (index === -1) {
        currentStyles.push(style);
      } else {
        currentStyles.splice(index, 1);
      }
      
      return {
        ...prev,
        learningStyles: currentStyles
      };
    });
  };
  
  const handleFocusAreaToggle = (area: string): void => {
    setGenerationParams(prev => {
      const currentAreas = [...prev.focusAreas];
      const index = currentAreas.indexOf(area);
      
      if (index === -1) {
        currentAreas.push(area);
      } else {
        currentAreas.splice(index, 1);
      }
      
      return {
        ...prev,
        focusAreas: currentAreas
      };
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Adaptive Quest</CardTitle>
        <CardDescription>
          Create a personalized learning quest tailored to your needs and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <select
            id="difficulty"
            className="w-full p-2 border rounded"
            value={generationParams.difficulty}
            onChange={(e) => handleParamChange('difficulty', e.target.value)}
          >
            <option value="auto">Auto (Based on Assessment)</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
            <option value="master">Master</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <select
            id="subject"
            className="w-full p-2 border rounded"
            value={generationParams.subject}
            onChange={(e) => handleParamChange('subject', e.target.value)}
          >
            <option value="">Auto (Based on Assessment)</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="keyStage">Key Stage</Label>
          <select
            id="keyStage"
            className="w-full p-2 border rounded"
            value={generationParams.keyStage}
            onChange={(e) => handleParamChange('keyStage', e.target.value)}
          >
            <option value="">Auto (Based on Profile)</option>
            <option value="KS1">Key Stage 1</option>
            <option value="KS2">Key Stage 2</option>
            <option value="KS3">Key Stage 3</option>
            <option value="KS4">Key Stage 4</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Learning Styles</Label>
          <div className="flex flex-wrap gap-2">
            {['visual', 'auditory', 'reading_writing', 'kinesthetic'].map(style => (
              <Button
                key={style}
                variant={generationParams.learningStyles.includes(style) ? "default" : "outline"}
                size="sm"
                onClick={() => handleLearningStyleToggle(style)}
              >
                {style.replace('_', '/')}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty to use your profile preferences
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Focus Areas</Label>
          <div className="flex flex-wrap gap-2">
            {['problem-solving', 'critical-thinking', 'creativity', 'communication', 'collaboration'].map(area => (
              <Button
                key={area}
                variant={generationParams.focusAreas.includes(area) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFocusAreaToggle(area)}
              >
                {area.replace('-', ' ')}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty to determine from assessment results
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Quest Duration</Label>
          <select
            id="duration"
            className="w-full p-2 border rounded"
            value={generationParams.duration}
            onChange={(e) => handleParamChange('duration', e.target.value)}
          >
            <option value="short">Short (1-2 hours)</option>
            <option value="medium">Medium (2-3 hours)</option>
            <option value="long">Long (3-5 hours)</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateQuest} 
          disabled={generating}
          className="w-full"
        >
          {generating ? "Generating..." : "Generate Adaptive Quest"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main component
const AdventureQuestSagaAdaptive = (): React.ReactNode => {
  // State for character
  const [character, setCharacter] = useState<Character | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeView, setActiveView] = useState<string>('hub');
  
  // Contexts
  const fairUsage = useFairUsage();
  const curriculumContext = useCurriculum();
  const gamificationContext = useGamification();
  const assessmentContext = useAssessment();
  const userProfile = useUserProfile();
  
  // Mock learning history data - would come from API/context in real app
  const learningHistory = {
    completedQuests: [],
    assessments: [],
    preferences: {}
  };
  
  // Mock assessment results - would come from API/context in real app
  const assessmentResults = [
    {
      subject: 'Mathematics',
      percentageScore: 65,
      skillBreakdown: {
        'problem-solving': 60,
        'number-operations': 70,
        'algebra': 55,
        'geometry': 75
      }
    },
    {
      subject: 'English',
      percentageScore: 80,
      skillBreakdown: {
        'reading-comprehension': 85,
        'writing': 75,
        'grammar': 80,
        'vocabulary': 80
      }
    }
  ];
  
  // Handle quest generation
  const handleQuestGenerated = useCallback((newQuest: Quest): void => {
    setQuests(prev => [...prev, newQuest]);
  }, []);
  
  // Handle quest selection
  const handleSelectQuest = useCallback((quest: Quest): void => {
    setSelectedQuest(quest);
    setActiveView('detail');
  }, []);
  
  // Handle quest completion
  const handleQuestProgress = useCallback((questId: string, progress: number): void => {
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, progress } : q
    ));
  }, []);
  
  // Handle character creation
  const handleCharacterCreated = useCallback((newCharacter: Character): void => {
    setCharacter(newCharacter);
    setActiveView('hub');
  }, []);
  
  // Render view based on active state
  const renderView = (): React.ReactNode => {
    if (!character) {
      return <CharacterCreation onCharacterCreated={handleCharacterCreated} />;
    }
    
    switch (activeView) {
      case 'hub':
        return (
          <QuestHub 
            character={character}
            quests={quests}
            onSelectQuest={handleSelectQuest}
          />
        );
      case 'detail':
        return selectedQuest ? (
          <QuestDetail 
            quest={selectedQuest}
            character={character}
            onProgress={handleQuestProgress}
            onBack={() => setActiveView('hub')}
          />
        ) : null;
      case 'character':
        return (
          <CharacterDashboard 
            character={character}
            onBack={() => setActiveView('hub')}
          />
        );
      case 'generate':
        return (
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setActiveView('hub')}>
              Back to Quest Hub
            </Button>
            <AdaptiveQuestGenerator 
              userProfile={userProfile}
              learningHistory={learningHistory}
              curriculumContext={curriculumContext}
              assessmentResults={assessmentResults}
              onQuestGenerated={handleQuestGenerated}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      {character && (
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hub">Quest Hub</TabsTrigger>
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="generate">Generate Quest</TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedQuest}>Quest Detail</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {renderView()}
    </div>
  );
};

export default AdventureQuestSagaAdaptive;
