'use client';

import React, { useState, useCallback } from 'react';
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
  Compass, 
  BookOpen, 
  Sparkles,
  Users, 
  Trophy, 
  Search,
  X
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';

// Add JSX namespace to fix 'JSX is not defined' errors
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}

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
  { id: 'visual', name: 'Visual', icon: <EyeIcon className="h-4 w-4" /> },
  { id: 'auditory', name: 'Auditory', icon: <EarIcon className="h-4 w-4" /> },
  { id: 'reading_writing', name: 'Reading/Writing', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'kinesthetic', name: 'Kinesthetic', icon: <HandIcon className="h-4 w-4" /> }
];

// Custom icons
const EyeIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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

const EarIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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

const HandIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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

// Custom shield icon
const Shield = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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
const MessageCircleIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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

// Character Creation Component
interface CharacterCreationProps {
  onCreateCharacter: (character: any) => void;
}

const CharacterCreation = ({ onCreateCharacter }: CharacterCreationProps): JSX.Element => {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const handleNext = (): void => {
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
      if (characterType) {
        const newCharacter = {
          name,
          type: selectedType,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          stats: characterType.startingStats,
          inventory: [],
          badges: [{ id: 'b1', name: 'First Steps', description: 'Created your character', icon: 'milestone' }],
          skills: [],
          completedQuests: 0,
          activeQuests: 0
        };
        onCreateCharacter(newCharacter);
      }
    }
  };
  
  const handleBack = (): void => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Character</CardTitle>
          <CardDescription>
            Step {step} of 3: {step === 1 ? 'Choose a Name' : step === 2 ? 'Select Character Type' : 'Review & Confirm'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="character-name">Character Name</Label>
                <Input 
                  id="character-name" 
                  placeholder="Enter a name for your character" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Choose a name that reflects your learning personality. This name will appear on leaderboards and in collaborative quests.
              </p>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Each character type has different starting attributes and special abilities. Choose the one that best matches your learning style.
              </p>
              
              <div className="grid gap-4">
                {characterTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedType === type.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-centre space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 3 && selectedType && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Character Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-lg">{name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-lg">{characterTypes.find(type => type.id === selectedType)?.name}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Starting Stats</h3>
                <div className="space-y-2">
                  {Object.entries(characterTypes.find(type => type.id === selectedType)?.startingStats || {}).map(([stat, value]) => (
                    <div key={stat} className="flex items-centre justify-between">
                      <span className="capitalize">{stat}</span>
                      <div className="flex items-centre space-x-2">
                        <Progress value={value * 10} className="w-24 h-2" />
                        <span className="text-sm">{value}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Special Abilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {characterTypes.find(type => type.id === selectedType)?.bonuses.map((bonus, index) => (
                    <li key={index} className="text-sm">{bonus}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {step < 3 ? 'Next' : 'Create Character'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Main component
const AdventureQuestSaga = (): JSX.Element => {
  const { toast } = useToast();
  const fairUsage = useFairUsage();
  
  // State for character
  const [character, setCharacter] = useState(mockCharacter);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  
  // State for quests
  const [quests] = useState(mockQuests);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [activeTab, setActiveTab] = useState('quests');
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    subject: [],
    keyStage: [],
    learningStyle: []
  });
  
  // Extract unique subjects and key stages for filters
  const subjects = [...new Set(mockQuests.map(quest => quest.subject))];
  const keyStages = [...new Set(mockQuests.map(quest => quest.keyStage))];
  
  // Handle character creation
  const handleCharacterCreated = (newCharacter: any): void => {
    setCharacter(newCharacter);
    setIsCreatingCharacter(false);
    toast({
      title: "Character Created!",
      description: `Welcome, ${newCharacter.name}!`
    });
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest: any): void => {
    setSelectedQuest(quest);
  };
  
  // Handle quest start
  const handleStartQuest = useCallback((quest: any): void => {
    // Check fair usage before starting quest
    const featureCheck = checkFeatureAvailability();
    
    if (featureCheck.success) {
      toast({
        title: "Quest Started!",
        description: `You've embarked on "${quest.title}". Good luck on your journey!`
      });
      
      // Additional logic for starting quest would go here
    } else {
      toast({
        title: "Feature Limit Reached",
        description: featureCheck.message || "You've reached your limit for starting new quests today.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Function to check feature availability (moved outside of component function)
  const checkFeatureAvailability = (): { success: boolean; message?: string } => {
    // This would normally call the fairUsage.checkFeatureAvailability method
    // For now, we'll just return a success
    return { success: true };
  };
  
  // Filter toggle
  const toggleFilter = (filterType: string, value: string): void => {
    setFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev] as string[];
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };
  
  // Clear all filters
  const clearFilters = (): void => {
    setFilters({
      difficulty: [],
      subject: [],
      keyStage: [],
      learningStyle: []
    });
    setSearchTerm('');
  };
  
  // Filter quests
  const filteredQuests = quests.filter(quest => {
    // Search term filter
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
    if (filters.learningStyle.length > 0 && 
        !quest.learningStyles.some(style => filters.learningStyle.includes(style))) {
      return false;
    }
    
    return true;
  });
  
  if (isCreatingCharacter) {
    return <CharacterCreation onCreateCharacter={handleCharacterCreated} />;
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
            <div>
              <Button variant="outline" className="mb-4" onClick={() => setSelectedQuest(null)}>
                Back to Quests
              </Button>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedQuest.title}</CardTitle>
                      <CardDescription>{selectedQuest.description}</CardDescription>
                    </div>
                    <Badge className={difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.color}>
                      {difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Subject</h3>
                      <p>{selectedQuest.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Key Stage</h3>
                      <p>{selectedQuest.keyStage}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Duration</h3>
                      <p>{selectedQuest.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">XP Reward</h3>
                      <p>{selectedQuest.xpReward} XP</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Learning Styles</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuest.learningStyles.map(styleId => {
                        const style = learningStyles.find(s => s.id === styleId);
                        return style ? (
                          <Badge key={styleId} variant="outline" className="flex items-centre">
                            {style.icon}
                            <span className="ml-1">{style.name}</span>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Learning Objectives</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedQuest.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Chapters</h3>
                    <div className="space-y-4">
                      {selectedQuest.chapters.map((chapter, index) => (
                        <Card key={chapter.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-centre">
                              <CardTitle className="text-lg">
                                {index + 1}. {chapter.title}
                              </CardTitle>
                              <Badge variant="outline">
                                {chapter.challenges} Challenges
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm">{chapter.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Rewards</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedQuest.rewards.map((reward, index) => (
                        <Card key={index}>
                          <CardContent className="p-4 flex flex-col items-centre text-centre">
                            <div className="bg-primary/10 p-3 rounded-full mb-2">
                              {reward.icon}
                            </div>
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-xs text-muted-foreground">{reward.type}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleStartQuest(selectedQuest)}>
                    Start Quest
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-centre mb-6">
                <h2 className="text-2xl font-bold">Available Quests</h2>
                
                <div className="flex items-centre space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search quests..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filter Quests</DialogTitle>
                        <DialogDescription>
                          Narrow down quests based on your preferences and needs.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-2">
                        <div>
                          <h3 className="font-medium mb-2">Difficulty</h3>
                          <div className="flex flex-wrap gap-2">
                            {difficultyLevels.map((level) => (
                              <Badge
                                key={level.id}
                                variant={filters.difficulty.includes(level.id) ? "default" : "outline"}
                                className={`cursor-pointer ${filters.difficulty.includes(level.id) ? '' : level.color.replace('bg-', 'hover:bg-') + '/20'}`}
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
                  </Dialog>
                </div>
              </div>
              
              {/* Active filters */}
              {(filters.difficulty.length > 0 || filters.subject.length > 0 || 
                filters.keyStage.length > 0 || filters.learningStyle.length > 0 || searchTerm) && (
                <div className="flex flex-wrap items-centre gap-2 p-3 bg-muted rounded-lg mb-6">
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
                  
                  {filters.learningStyle.map(styleId => {
                    const style = learningStyles.find(s => s.id === styleId);
                    return style ? (
                      <Badge key={styleId} variant="secondary" className="flex items-centre">
                        {style.icon}
                        <span className="ml-1">{style.name}</span>
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => toggleFilter('learningStyle', styleId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              )}
              
              {/* Quest grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuests.map((quest) => (
                  <Card key={quest.id} className={`cursor-pointer transition-shadow hover:shadow-md ${!quest.unlocked ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                        <Badge className={difficultyLevels.find(d => d.id === quest.difficulty)?.color}>
                          {difficultyLevels.find(d => d.id === quest.difficulty)?.name}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{quest.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Subject:</span> {quest.subject}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Key Stage:</span> {quest.keyStage}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span> {quest.duration}
                        </div>
                        <div>
                          <span className="text-muted-foreground">XP:</span> {quest.xpReward}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{quest.progress}%</span>
                        </div>
                        <Progress value={quest.progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-between items-centre">
                        <div className="flex -space-x-2">
                          {quest.learningStyles.map((styleId, index) => {
                            const style = learningStyles.find(s => s.id === styleId);
                            return style ? (
                              <div key={styleId} className="h-6 w-6 rounded-full bg-primary/10 flex items-centre justify-centre" title={style.name}>
                                {style.icon}
                              </div>
                            ) : null;
                          })}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSelectQuest(quest)}
                          disabled={!quest.unlocked}
                        >
                          {quest.unlocked ? 'View Quest' : 'Locked'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredQuests.length === 0 && (
                <div className="text-centre py-12">
                  <h3 className="text-lg font-medium mb-2">No quests found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="character">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Character Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-centre text-centre">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-centre justify-centre mb-2">
                      <Compass className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{character.name}</h2>
                    <p className="text-muted-foreground">Level {character.level} {character.type}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>XP Progress</span>
                      <span>{character.xp}/{character.xpToNextLevel}</span>
                    </div>
                    <Progress value={(character.xp / character.xpToNextLevel) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Stats</h3>
                    <div className="space-y-2">
                      {Object.entries(character.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-centre justify-between">
                          <span className="capitalize">{stat}</span>
                          <div className="flex items-centre space-x-2">
                            <Progress value={Number(value) * 10} className="w-24 h-2" />
                            <span className="text-sm">{value}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Quest Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted p-2 rounded flex flex-col items-centre">
                        <span className="text-lg font-bold">{character.completedQuests}</span>
                        <span className="text-muted-foreground">Completed</span>
                      </div>
                      <div className="bg-muted p-2 rounded flex flex-col items-centre">
                        <span className="text-lg font-bold">{character.activeQuests}</span>
                        <span className="text-muted-foreground">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="skills">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>
                
                <TabsContent value="skills" className="space-y-4 mt-4">
                  {character.skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="p-4">
                        <div className="flex items-centre justify-between mb-2">
                          <div className="flex items-centre">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-centre justify-centre mr-3">
                              {skill.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{skill.name}</h3>
                              <p className="text-xs text-muted-foreground">Level {skill.level}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{skill.progress}% to next level</Badge>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.inventory.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-centre">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-centre justify-centre mr-3">
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="badges" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.badges.map((badge) => (
                      <Card key={badge.id}>
                        <CardContent className="p-4">
                          <div className="flex items-centre">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-centre justify-centre mr-3">
                              {badge.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{badge.name}</h3>
                              <p className="text-xs text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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

export default AdventureQuestSaga;
