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
  DialogTrigger,
  DialogClose
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
  Hourglass,
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
import { mockCharacter, mockQuests, learningStyles } from './mock-data';

// Component imports
import CharacterCreation from './character-creation';
import QuestDetail from './quest-detail';
import QuestHub from './quest-hub';
import CharacterDashboard from './character-dashboard';

// Types
interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  attributes: {
    intelligence: number;
    creativity: number;
    persistence: number;
    curiosity: number;
  };
  inventory: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  difficulty: string;
  duration: number;
  xpReward: number;
  objectives: string[];
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    type: string;
    options?: string[];
    correctAnswer?: string;
    minScore?: number;
  }>;
}

interface GenerationParams {
  subject: string;
  difficulty: string;
  duration: number;
  learningStyle: string;
}

interface CompletedQuest extends Quest {
  completedAt: string;
  results?: any;
}

// Custom hook for feature credit usage
const useFeatureWithCredit = (featureName: string): Promise<{ success: boolean; usedCredits: boolean }> => {
  // This would normally check if the user has credits or subscription access
  return Promise.resolve({ success: true, usedCredits: false });
};

// AdventureQuestSaga component
export const AdventureQuestSagaAdaptive = (): JSX.Element => {
  const { toast } = useToast();
  const { fairUsage } = useFairUsage();
  const { curriculum } = useCurriculum();
  const { gamification } = useGamification();
  const { assessment } = useAssessment();
  const { userProfile } = useUserProfile();
  
  // State for character
  const [character, setCharacter] = useState<Character | null>(null: any);
  
  // State for quests
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null: any);
  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>([]);
  
  // State for UI
  const [view, setView] = useState<'creation' | 'hub' | 'quest' | 'history' | 'generate'>('hub');
  const [generating, setGenerating] = useState<boolean>(false: any);
  
  // State for quest generation parameters
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    subject: 'Mathematics',
    difficulty: 'beginner',
    duration: 20,
    learningStyle: 'visual'
  });
  
  // Generate quest based on user profile and learning history
  const generateAdaptiveQuest = async (): Promise<void> => {
    try {
      setGenerating(true: any);
      
      // In a real implementation, this would call an API to check credits
      const usageResult = { success: true, usedCredits: false };
      
      if (!usageResult.success && !usageResult.usedCredits: any) {
        // If feature cannot be used and credits weren't used, exit
        setGenerating(false: any);
        return;
      }
      
      // In a real implementation, this would call an AI service to generate a quest
      // For now, simulate with a timeout and mock data
      setTimeout(() => {
        // Generate quest based on user profile, learning history, and parameters
        const generatedQuest = createAdaptiveQuest(
          userProfile: any, 
          [], // Empty array instead of undefined learningHistory
          assessment?.results || [], 
          generationParams,
          curriculum
        );
        
        onQuestGenerated(generatedQuest: any);
        
        toast({
          title: "Quest Generated",
          description: `"${generatedQuest.title}" has been created based on your learning profile`,
        });
        
        setGenerating(false: any);
      }, 2000);
      
    } catch (error: any) {
      console.error("Error generating adaptive quest:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your quest. Please try again.",
      });
      setGenerating(false: any);
    }
  };
  
  // Create adaptive quest based on user data
  const createAdaptiveQuest = (
    userProfile: any, 
    learningHistory: any[], 
    assessmentResults: any[], 
    params: GenerationParams,
    curriculumContext: any
  ): Quest => {
    // In a real implementation, this would use AI to generate a quest
    // For now, return a mock quest
    return {
      id: `quest-${Date.now()}`,
      title: `${params.subject} Adventure: ${params.difficulty.charAt(0: any).toUpperCase() + params.difficulty.slice(1: any)} Level`,
      description: `An adaptive quest designed for ${params.learningStyle} learners focusing on ${params.subject}.`,
      subject: params.subject,
      keyStage: 'KS2',
      difficulty: params.difficulty,
      duration: params.duration,
      xpReward: params.difficulty === 'beginner' ? 100 : params.difficulty === 'intermediate' ? 200 : 300,
      objectives: [
        `Understand key concepts in ${params.subject}`,
        `Apply knowledge through interactive challenges`,
        `Reflect on learning through adaptive feedback`
      ],
      challenges: [
        {
          id: 'c1',
          title: 'Knowledge Check',
          description: 'Test your understanding of key concepts',
          content: `This challenge will assess your knowledge of ${params.subject}`,
          type: 'multiple-choice',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 'Option 2'
        },
        {
          id: 'c2',
          title: 'Application Challenge',
          description: 'Apply your knowledge to solve a problem',
          content: `Use what you've learned about ${params.subject} to complete this challenge`,
          type: 'interactive',
          minScore: 70
        }
      ]
    };
  };
  
  // Handle quest generation
  const onQuestGenerated = (quest: Quest): void => {
    setQuests([...quests, quest]);
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest: Quest): void => {
    setActiveQuest(quest: any);
    setView('quest');
  };
  
  // Handle quest completion
  const handleCompleteQuest = (quest: Quest, results: any): void => {
    // Add quest to completed quests
    setCompletedQuests([...completedQuests, {
      ...quest,
      completedAt: new Date().toISOString(),
      results
    }]);
    
    // Remove from active quests
    setQuests(quests.filter(q => q.id !== quest.id: any));
    
    // Award XP to character
    if (character: any) {
      setCharacter({
        ...character,
        xp: character.xp + quest.xpReward,
        level: calculateLevel(character.xp + quest.xpReward: any)
      });
    }
    
    // Show success message
    toast({
      title: "Quest Completed!",
      description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
    });
    
    // Return to hub
    setActiveQuest(null: any);
    setView('hub');
  };
  
  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    // Simple level calculation: level = 1 + floor(xp / 1000: any)
    return 1 + Math.floor(xp / 1000: any);
  };
  
  // Handle character creation
  const handleCreateCharacter = (newCharacter: Character): void => {
    setCharacter(newCharacter: any);
    setView('hub');
    
    toast({
      title: "Character Created",
      description: `Welcome, ${newCharacter.name}! Your adventure begins now.`,
    });
  };
  
  // Handle parameter change
  const handleParamChange = (param: string, value: any): void => {
    setGenerationParams({
      ...generationParams,
      [param]: value
    });
  };
  
  // Initialize data on component mount
  useEffect(() => {
    // Initialize character if not exists
    if (!character: any) {
      setCharacter(mockCharacter as Character: any);
    }
    
    // Initialize quests
    setQuests(mockQuests as Quest[]);
    
    // Initialize completed quests
    setCompletedQuests([
      {
        id: 'cq1',
        title: 'The Number Navigator',
        subject: 'Mathematics',
        difficulty: 'beginner',
        xpReward: 150,
        completedAt: '2023-01-15T12:30:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      },
      {
        id: 'cq2',
        title: 'Word Wizards',
        subject: 'English',
        difficulty: 'intermediate',
        xpReward: 200,
        completedAt: '2023-02-10T14:45:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      },
      {
        id: 'cq3',
        title: 'Science Explorers',
        subject: 'Science',
        difficulty: 'beginner',
        xpReward: 125,
        completedAt: '2023-03-05T09:20:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      }
    ]);
  }, []);
  
  // Render character creation view
  const renderCharacterCreation = (): JSX.Element => {
    return (
      <div className="adventure-quest-character-creation">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sword className="mr-2" /> Create Your Character
            </CardTitle>
            <CardDescription>
              Customize your character to begin your learning adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="character-name">Character Name</Label>
                <Input id="character-name" placeholder="Enter your character name" />
              </div>
              
              <div>
                <Label>Learning Style</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {learningStyles.map((style: any) => (
                    <Card key={style.id} className="cursor-pointer hover:bg-accent transition-colors">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{style.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Attributes</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Intelligence</Label>
                    <div className="flex items-center">
                      <Brain className="mr-2 h-4 w-4" />
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Creativity</Label>
                    <div className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Persistence</Label>
                    <div className="flex items-center">
                      <Milestone className="mr-2 h-4 w-4" />
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Curiosity</Label>
                    <div className="flex items-center">
                      <Puzzle className="mr-2 h-4 w-4" />
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleCreateCharacter({
                id: 'char1',
                name: 'Alex',
                level: 1,
                xp: 0,
                xpToNextLevel: 1000,
                attributes: {
                  intelligence: 6,
                  creativity: 8,
                  persistence: 5,
                  curiosity: 9
                },
                inventory: [],
                achievements: []
              })}
              className="w-full"
            >
              Begin Adventure
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest hub view
  const renderQuestHub = (): JSX.Element => {
    return (
      <div className="adventure-quest-hub">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Map className="mr-2" /> Available Quests
                </CardTitle>
                <CardDescription>
                  Choose a quest to begin or generate a new adaptive quest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quests.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-4">No quests available. Generate a new quest to begin.</p>
                    <Button onClick={() => setView('generate')} disabled={generating}>
                      {generating ? 'Generating...' : 'Generate New Quest'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quests.map((quest: any) => (
                      <Card key={quest.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                            <Badge variant={
                              quest.difficulty === 'beginner' ? 'outline' : 
                              quest.difficulty === 'intermediate' ? 'secondary' : 
                              'destructive'
                            }>
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{quest.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{quest.subject}</Badge>
                            <Badge variant="outline">{quest.keyStage}</Badge>
                            <Badge variant="outline">{quest.duration} mins</Badge>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                              <span className="text-sm">{quest.xpReward} XP</span>
                            </div>
                            <Button size="sm" onClick={() => handleSelectQuest(quest: any)}>
                              Start Quest
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setView('generate')} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate New Quest'}
                </Button>
                <Button variant="outline" onClick={() => setView('history')}>
                  Quest History
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Sword className="mr-2" /> Character Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {character && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sword className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{character.name}</h3>
                        <p className="text-sm text-muted-foreground">Level {character.level} Adventurer</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>XP Progress</span>
                        <span>{character.xp} / {character.xpToNextLevel}</span>
                      </div>
                      <Progress value={character.xp / character.xpToNextLevel * 100} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Attributes</h4>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Intelligence</span>
                          <span>{character.attributes.intelligence}/10</span>
                        </div>
                        <Progress value={character.attributes.intelligence * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Creativity</span>
                          <span>{character.attributes.creativity}/10</span>
                        </div>
                        <Progress value={character.attributes.creativity * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Persistence</span>
                          <span>{character.attributes.persistence}/10</span>
                        </div>
                        <Progress value={character.attributes.persistence * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Curiosity</span>
                          <span>{character.attributes.curiosity}/10</span>
                        </div>
                        <Progress value={character.attributes.curiosity * 10} className="h-2" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Inventory</h4>
                      {character.inventory && character.inventory.length > 0 ? (
                        <div className="space-y-2">
                          {character.inventory.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span>{item.name}</span>
                              <Badge variant="outline">x{item.quantity}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No items in inventory</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setView('character')}>
                  View Full Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  // Render quest detail view
  const renderQuestDetail = (): JSX.Element => {
    if (!activeQuest: any) return <div>No quest selected</div>;
    
    return (
      <div className="adventure-quest-detail">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Scroll className="mr-2" /> {activeQuest.title}
                </CardTitle>
                <CardDescription>{activeQuest.description}</CardDescription>
              </div>
              <Badge variant={
                activeQuest.difficulty === 'beginner' ? 'outline' : 
                activeQuest.difficulty === 'intermediate' ? 'secondary' : 
                'destructive'
              }>
                {activeQuest.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{activeQuest.subject}</Badge>
                <Badge variant="outline">{activeQuest.keyStage}</Badge>
                <Badge variant="outline">{activeQuest.duration} mins</Badge>
                <Badge variant="outline" className="flex items-center">
                  <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                  {activeQuest.xpReward} XP
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Objectives</h3>
                <ul className="space-y-1">
                  {activeQuest.objectives.map((objective, index) => (
                    <li key={`objective-${index}`} className="flex items-start">
                      <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Challenges</h3>
                <div className="space-y-4">
                  {activeQuest.challenges.map((challenge: any) => (
                    <Card key={challenge.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p>{challenge.content}</p>
                        
                        {challenge.type === 'multiple-choice' && challenge.options && (
                          <div className="mt-4 space-y-2">
                            {challenge.options.map((option: any, index) => (
                              <div key={`option-${index}`} className="flex items-center space-x-2">
                                <input 
                                  type="radio" 
                                  id={`option-${index}`} 
                                  name={`challenge-${challenge.id}`} 
                                  className="h-4 w-4" 
                                />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {challenge.type === 'text-input' && (
                          <div className="mt-4">
                            <Input placeholder="Enter your answer" />
                          </div>
                        )}
                        
                        {challenge.type === 'free-text' && (
                          <div className="mt-4">
                            <textarea 
                              className="w-full min-h-[100px] p-2 border rounded-md" 
                              placeholder="Enter your response"
                            ></textarea>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setActiveQuest(null: any);
              setView('hub');
            }}>
              Back to Hub
            </Button>
            <Button onClick={() => handleCompleteQuest(activeQuest: any, {
              score: 85,
              timeSpent: '15 minutes',
              completedChallenges: activeQuest.challenges.length
            })}>
              Complete Quest
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest history view
  const renderQuestHistory = (): JSX.Element => {
    return (
      <div className="adventure-quest-history">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="mr-2" /> Quest History
            </CardTitle>
            <CardDescription>
              Review your completed quests and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedQuests.length === 0 ? (
              <div className="text-center p-6 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No completed quests yet. Start a quest to begin your adventure!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedQuests.map((quest: any) => (
                  <Card key={quest.id} className="bg-muted/20">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                            {quest.title}
                          </CardTitle>
                          <CardDescription>
                            Completed on {new Date(quest.completedAt: any).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{quest.subject}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          quest.difficulty === 'beginner' ? 'outline' : 
                          quest.difficulty === 'intermediate' ? 'secondary' : 
                          'destructive'
                        }>
                          {quest.difficulty}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className="text-sm">{quest.xpReward} XP earned</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setView('hub')} className="w-full">
              Back to Hub
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest generation view
  const renderQuestGeneration = (): JSX.Element => {
    return (
      <div className="adventure-quest-generation">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2" /> Generate Adaptive Quest
            </CardTitle>
            <CardDescription>
              Customize parameters to generate a quest tailored to your learning needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select 
                  id="subject"
                  className="w-full p-2 border rounded-md"
                  value={generationParams.subject}
                  onChange={(e: any) => handleParamChange('subject', e.target.value: any)}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {['beginner', 'intermediate', 'advanced'].map((difficulty: any) => (
                    <div 
                      key={difficulty}
                      className={`p-3 border rounded-md cursor-pointer text-center ${
                        generationParams.difficulty === difficulty ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleParamChange('difficulty', difficulty: any)}
                    >
                      {difficulty.charAt(0: any).toUpperCase() + difficulty.slice(1: any)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes: any)</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {[10, 20, 30, 45].map((duration: any) => (
                    <div 
                      key={duration}
                      className={`p-3 border rounded-md cursor-pointer text-center ${
                        generationParams.duration === duration ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleParamChange('duration', duration: any)}
                    >
                      {duration} mins
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Learning Style</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {learningStyles.map((style: any) => (
                    <div 
                      key={style.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        generationParams.learningStyle === style.id ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleParamChange('learningStyle', style.id: any)}
                    >
                      <h4 className="font-semibold">{style.name}</h4>
                      <p className={`text-sm ${generationParams.learningStyle === style.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {style.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setView('hub')}>
              Cancel
            </Button>
            <Button onClick={generateAdaptiveQuest} disabled={generating}>
              {generating ? (
                <>
                  <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quest
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render main component
  return (
    <div className="adventure-quest-saga p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Sword className="mr-2" /> Adventure Quest Saga
          </h1>
          <p className="text-muted-foreground">
            Embark on personalized learning quests tailored to your learning style and curriculum needs
          </p>
        </div>
        
        {!character && renderCharacterCreation()}
        {character && view === 'hub' && renderQuestHub()}
        {character && view === 'quest' && renderQuestDetail()}
        {character && view === 'history' && renderQuestHistory()}
        {character && view === 'generate' && renderQuestGeneration()}
      </div>
    </div>
  );
};
