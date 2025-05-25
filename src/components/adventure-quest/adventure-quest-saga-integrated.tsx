'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed unused Dialog imports
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

// Type for curriculum quest
interface CurriculumQuest {
  id: string;
  title: string;
  description: string;
  // Add other properties as needed
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

// Main component
const AdventureQuestSagaIntegrated = (): React.ReactElement => {
  const { toast } = useToast();
  // Removed unused context variables
  
  // State
  const [activeTab, setActiveTab] = useState<string>("quests");
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<CurriculumQuest | null>(null);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState<boolean>(false);
  // Removed unused state variables
  
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
  }, []);

  // Handle character creation
  const handleCharacterCreated = useCallback((newCharacter: Character): void => {
    setCharacter(newCharacter);
    toast({
      title: "Character Created!",
      description: `Welcome, ${newCharacter.name}!`
    });
  }, [toast]);

  // Render component
  if (!character && !isCreatingCharacter) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Adventure Quest</CardTitle>
            <CardDescription>
              Begin your learning journey by creating a character.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your character will represent you in the quest world, gaining experience and skills as you complete learning challenges.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsCreatingCharacter(true)}>
              Create Character
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isCreatingCharacter) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Adventure Quest</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="quests">Quests</TabsTrigger>
          <TabsTrigger value="character">Character</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests">
          {selectedQuest ? (
            <QuestDetail 
              quest={selectedQuest} 
              onBack={() => setSelectedQuest(null)} 
            />
          ) : (
            <QuestHub 
              onSelectQuest={setSelectedQuest} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="character">
          {character && <CharacterDashboard character={character} />}
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Track your progress and accomplishments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Achievements feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdventureQuestSagaIntegrated;
