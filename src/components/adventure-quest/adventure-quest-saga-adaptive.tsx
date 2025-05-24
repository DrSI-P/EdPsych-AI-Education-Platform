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

// Custom hook for feature credit usage
const useFeatureWithCredit = (featureName: string) => {
  // This would normally check if the user has credits or subscription access
  return Promise.resolve({ success: true, usedCredits: false });
};

// AdventureQuestSaga component
export const AdventureQuestSagaAdaptive = () => {
  const toast = useToast();
  const { fairUsage } = useFairUsage();
  const { curriculum } = useCurriculum();
  const { gamification } = useGamification();
  const { assessment } = useAssessment();
  const { userProfile } = useUserProfile();
  
  // State for character
  const [character, setCharacter] = useState(null);
  
  // State for quests
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  
  // State for UI
  const [view, setView] = useState('hub');
  const [generating, setGenerating] = useState(false);
  
  // State for quest generation parameters
  const [generationParams, setGenerationParams] = useState({
    subject: 'Mathematics',
    difficulty: 'beginner',
    duration: 20,
    learningStyle: 'visual'
  });
  
  // Generate quest based on user profile and learning history
  const generateAdaptiveQuest = async () => {
    try {
      setGenerating(true);
      
      // In a real implementation, this would call an API to check credits
      const usageResult = { success: true, usedCredits: false };
      
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
          [], // Empty array instead of undefined learningHistory
          assessment?.results || [], 
          generationParams,
          curriculum
        );
        
        onQuestGenerated(generatedQuest);
        
        toast({
          title: "Quest Generated",
          description: `"${generatedQuest.title}" has been created based on your learning profile`,
        });
        
        setGenerating(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating adaptive quest:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your quest. Please try again.",
      });
      setGenerating(false);
    }
  };
  
  // Create adaptive quest based on user data
  const createAdaptiveQuest = (
    userProfile: any, 
    learningHistory: any[], 
    assessmentResults: any[], 
    params: any,
    curriculumContext: any
  ) => {
    // In a real implementation, this would use AI to generate a quest
    // For now, return a mock quest
    return {
      id: `quest-${Date.now()}`,
      title: `${params.subject} Adventure: ${params.difficulty.charAt(0).toUpperCase() + params.difficulty.slice(1)} Level`,
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
  const onQuestGenerated = (quest: any) => {
    setQuests([...quests, quest]);
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest: any) => {
    setActiveQuest(quest);
    setView('quest');
  };
  
  // Handle quest completion
  const handleCompleteQuest = (quest: any, results: any) => {
    // Add quest to completed quests
    setCompletedQuests([...completedQuests, {
      ...quest,
      completedAt: new Date().toISOString(),
      results
    }]);
    
    // Remove from active quests
    setQuests(quests.filter(q => q.id !== quest.id));
    
    // Award XP to character
    if (character) {
      setCharacter({
        ...character,
        xp: character.xp + quest.xpReward,
        level: calculateLevel(character.xp + quest.xpReward)
      });
    }
    
    // Show success message
    toast({
      title: "Quest Completed!",
      description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
    });
    
    // Return to hub
    setActiveQuest(null);
    setView('hub');
  };
  
  // Calculate level based on XP
  const calculateLevel = (xp: number) => {
    // Simple level calculation: level = 1 + floor(xp / 1000)
    return 1 + Math.floor(xp / 1000);
  };
  
  // Handle character creation
  const handleCreateCharacter = (newCharacter: any) => {
    setCharacter(newCharacter);
    setView('hub');
    
    toast({
      title: "Character Created",
      description: `Welcome, ${newCharacter.name}! Your adventure begins now.`,
    });
  };
  
  // Handle parameter change
  const handleParamChange = (param: string, value: any) => {
    setGenerationParams({
      ...generationParams,
      [param]: value
    });
  };
  
  // Initialize data on component mount
  useEffect(() => {
    // Initialize character if not exists
    if (!character) {
      setCharacter(mockCharacter);
    }
    
    // Initialize quests
    setQuests(mockQuests);
    
    // Initialize completed quests
    setCompletedQuests([
      {
        id: 'cq1',
        title: 'The Number Navigator',
        subject: 'Mathematics',
        difficulty: 'beginner',
        xpReward: 150,
        completedAt: '2023-01-15T12:30:00Z'
      },
      {
        id: 'cq2',
        title: 'Word Wizards',
        subject: 'English',
        difficulty: 'intermediate',
        xpReward: 200,
        completedAt: '2023-02-10T14:45:00Z'
      },
      {
        id: 'cq3',
        title: 'Science Explorers',
        subject: 'Science',
        difficulty: 'beginner',
        xpReward: 125,
        completedAt: '2023-03-05T09:20:00Z'
      }
    ]);
  }, []);
  
  // Render character creation view
  const renderCharacterCreation = () => {
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
                  {learningStyles.map((style) => (
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
  const renderQuestHub = () => {
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
                    {quests.map((quest) => (
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
                            <Button size="sm" onClick={() => handleSelectQuest(quest)}>
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
                  <Sword className="mr-2" /> {character?.name || 'Character'}
                </CardTitle>
                <CardDescription>
                  Level {character?.level || 1} Adventurer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>XP: {character?.xp || 0}</span>
                      <span>{character?.xpToNextLevel || 1000} to level {(character?.level || 1) + 1}</span>
                    </div>
                    <Progress value={(character?.xp || 0) / (character?.xpToNextLevel || 1000) * 100} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Attributes</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Brain className="mr-1 h-3 w-3" /> Intelligence
                          </span>
                          <span>{character?.attributes?.intelligence || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.intelligence || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Lightbulb className="mr-1 h-3 w-3" /> Creativity
                          </span>
                          <span>{character?.attributes?.creativity || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.creativity || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Milestone className="mr-1 h-3 w-3" /> Persistence
                          </span>
                          <span>{character?.attributes?.persistence || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.persistence || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Puzzle className="mr-1 h-3 w-3" /> Curiosity
                          </span>
                          <span>{character?.attributes?.curiosity || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.curiosity || 0) * 10} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                    {character?.achievements && character.achievements.length > 0 ? (
                      <div className="space-y-2">
                        {character.achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className="flex items-start">
                            <Award className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">{achievement.name}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Complete quests to earn achievements</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setView('character')}>
                  View Character
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  // Render quest detail view
  const renderQuestDetail = () => {
    if (!activeQuest) return null;
    
    return (
      <div className="adventure-quest-detail">
        <Card className="w-full">
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
                <h3 className="text-lg font-semibold mb-2">Objectives</h3>
                <ul className="space-y-1">
                  {activeQuest.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-4 w-4 mr-2 text-yellow-500 mt-1" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Challenges</h3>
                <div className="space-y-4">
                  {activeQuest.challenges.map((challenge, index) => (
                    <Card key={challenge.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-md flex items-center">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            {index + 1}
                          </span>
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="mb-4">{challenge.content}</p>
                        
                        {challenge.type === 'multiple-choice' && (
                          <div className="space-y-2">
                            {challenge.options.map((option, i) => (
                              <div key={i} className="flex items-center">
                                <input 
                                  type="radio" 
                                  id={`option-${i}`} 
                                  name={`challenge-${challenge.id}`} 
                                  className="mr-2"
                                />
                                <Label htmlFor={`option-${i}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {challenge.type === 'text-input' && (
                          <div>
                            <Input placeholder="Enter your answer" />
                          </div>
                        )}
                        
                        {challenge.type === 'free-text' && (
                          <div>
                            <textarea 
                              className="w-full min-h-[100px] p-2 border rounded-md" 
                              placeholder="Write your response here..."
                            ></textarea>
                            <p className="text-xs text-muted-foreground mt-1">
                              Minimum {challenge.minWords} words
                            </p>
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
              setActiveQuest(null);
              setView('hub');
            }}>
              Back to Hub
            </Button>
            <Button onClick={() => handleCompleteQuest(activeQuest, {
              score: 85,
              timeSpent: activeQuest.duration * 60,
              completedChallenges: activeQuest.challenges.length
            })}>
              Complete Quest
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest generation view
  const renderQuestGeneration = () => {
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
            <div className="space-y-6">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select 
                  id="subject"
                  className="w-full p-2 border rounded-md"
                  value={generationParams.subject}
                  onChange={(e) => handleParamChange('subject', e.target.value)}
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
                <div className="flex gap-4 mt-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <div 
                      key={level}
                      className={`
                        flex-1 p-3 border rounded-md text-center cursor-pointer transition-colors
                        ${generationParams.difficulty === level ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}
                      `}
                      onClick={() => handleParamChange('difficulty', level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    id="duration"
                    min="10" 
                    max="60" 
                    step="5"
                    value={generationParams.duration}
                    onChange={(e) => handleParamChange('duration', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{generationParams.duration}</span>
                </div>
              </div>
              
              <div>
                <Label>Learning Style</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {learningStyles.map((style) => (
                    <div 
                      key={style.id}
                      className={`
                        p-3 border rounded-md cursor-pointer transition-colors
                        ${generationParams.learningStyle === style.id ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}
                      `}
                      onClick={() => handleParamChange('learningStyle', style.id)}
                    >
                      <h4 className="font-medium">{style.name}</h4>
                      <p className="text-sm">{style.description}</p>
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
                  <span className="animate-spin mr-2">⟳</span>
                  Generating...
                </>
              ) : (
                'Generate Quest'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest history view
  const renderQuestHistory = () => {
    return (
      <div className="adventure-quest-history">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="mr-2" /> Quest History
            </CardTitle>
            <CardDescription>
              Review your completed quests and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="completed">
              <TabsList className="mb-4">
                <TabsTrigger value="completed">Completed Quests</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="completed">
                {completedQuests.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">You haven't completed any quests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedQuests.map((quest) => (
                      <Card key={quest.id}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                            <Badge variant="outline">
                              {new Date(quest.completedAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{quest.subject}</Badge>
                            <Badge variant="outline">{quest.difficulty}</Badge>
                            <Badge variant="outline" className="flex items-center">
                              <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                              {quest.xpReward} XP
                            </Badge>
                          </div>
                          
                          {quest.results && (
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="font-medium">{quest.results.score}%</p>
                              </div>
                              <div className="p-2 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-medium">{Math.floor(quest.results.timeSpent / 60)} min</p>
                              </div>
                              <div className="p-2 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">Challenges</p>
                                <p className="font-medium">{quest.results.completedChallenges}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center">
                          <Activity className="mr-2 h-4 w-4" /> Total XP
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-3xl font-bold">
                          {completedQuests.reduce((total, quest) => total + quest.xpReward, 0)}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center">
                          <Scroll className="mr-2 h-4 w-4" /> Quests Completed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-3xl font-bold">{completedQuests.length}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart className="mr-2 h-4 w-4" /> Average Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-3xl font-bold">
                          {completedQuests.length > 0 && completedQuests.some(q => q.results?.score)
                            ? Math.round(
                                completedQuests
                                  .filter(q => q.results?.score)
                                  .reduce((total, quest) => total + quest.results.score, 0) / 
                                completedQuests.filter(q => q.results?.score).length
                              )
                            : 0}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <PieChart className="mr-2 h-4 w-4" /> Subjects Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-[200px] flex items-center justify-center">
                        <p className="text-muted-foreground">Subject distribution visualization would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <LineChart className="mr-2 h-4 w-4" /> Progress Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-[200px] flex items-center justify-center">
                        <p className="text-muted-foreground">Progress chart would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
  
  // Render character dashboard view
  const renderCharacterDashboard = () => {
    if (!character) return null;
    
    return (
      <div className="adventure-quest-character">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sword className="mr-2" /> {character.name}
            </CardTitle>
            <CardDescription>
              Level {character.level} Adventurer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>XP: {character.xp}</span>
                  <span>{character.xpToNextLevel} to level {character.level + 1}</span>
                </div>
                <Progress value={character.xp / character.xpToNextLevel * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Attributes</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <Brain className="mr-1 h-4 w-4" /> Intelligence
                        </span>
                        <span>{character.attributes.intelligence}/10</span>
                      </div>
                      <Progress value={character.attributes.intelligence * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <Lightbulb className="mr-1 h-4 w-4" /> Creativity
                        </span>
                        <span>{character.attributes.creativity}/10</span>
                      </div>
                      <Progress value={character.attributes.creativity * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <Milestone className="mr-1 h-4 w-4" /> Persistence
                        </span>
                        <span>{character.attributes.persistence}/10</span>
                      </div>
                      <Progress value={character.attributes.persistence * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <Puzzle className="mr-1 h-4 w-4" /> Curiosity
                        </span>
                        <span>{character.attributes.curiosity}/10</span>
                      </div>
                      <Progress value={character.attributes.curiosity * 10} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Inventory</h3>
                  {character.inventory && character.inventory.length > 0 ? (
                    <div className="space-y-2">
                      {character.inventory.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Badge variant="outline">x{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Your inventory is empty</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                {character.achievements && character.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start p-3 border rounded-md">
                        <Award className="h-5 w-5 mr-3 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Complete quests to earn achievements</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-md text-center">
                    <p className="text-2xl font-bold">{completedQuests.length}</p>
                    <p className="text-sm text-muted-foreground">Quests Completed</p>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <p className="text-2xl font-bold">
                      {completedQuests.reduce((total, quest) => total + quest.xpReward, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total XP Earned</p>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <p className="text-2xl font-bold">
                      {character.achievements ? character.achievements.length : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <p className="text-2xl font-bold">
                      {completedQuests.length > 0
                        ? Math.round(
                            completedQuests
                              .filter(q => q.results?.score)
                              .reduce((total, quest) => total + (quest.results?.score || 0), 0) / 
                            Math.max(1, completedQuests.filter(q => q.results?.score).length)
                          )
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </div>
            </div>
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
  
  // Handle starting a quest
  const handleStartQuest = async (quest: any) => {
    try {
      // Check if feature can be used (fair usage)
      const usageResult = await useFeatureWithCredit('startQuest');
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        return;
      }
      
      // Set active quest and change view
      setActiveQuest(quest);
      setView('quest');
      
    } catch (error) {
      console.error("Error starting quest:", error);
      toast({
        title: "Error",
        description: "There was an error starting the quest. Please try again.",
      });
    }
  };
  
  // Render the appropriate view based on state
  const renderView = () => {
    if (!character && view !== 'character-creation') {
      return renderCharacterCreation();
    }
    
    switch (view) {
      case 'character-creation':
        return <CharacterCreation onCreateCharacter={handleCreateCharacter} />;
      case 'quest':
        return <QuestDetail quest={activeQuest} onComplete={handleCompleteQuest} onBack={() => setView('hub')} />;
      case 'hub':
        return <QuestHub quests={quests} character={character} onSelectQuest={handleSelectQuest} onGenerateQuest={() => setView('generate')} />;
      case 'generate':
        return renderQuestGeneration();
      case 'history':
        return renderQuestHistory();
      case 'character':
        return <CharacterDashboard character={character} completedQuests={completedQuests} onBack={() => setView('hub')} />;
      default:
        return renderQuestHub();
    }
  };
  
  return (
    <div className="adventure-quest-saga p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Sword className="mr-2" /> Adventure Quest Saga
          </h1>
          <p className="text-muted-foreground">
            Embark on personalized learning quests tailored to your abilities and interests
          </p>
        </div>
        
        {renderView()}
      </div>
    </div>
  );
};

export default AdventureQuestSagaAdaptive;
