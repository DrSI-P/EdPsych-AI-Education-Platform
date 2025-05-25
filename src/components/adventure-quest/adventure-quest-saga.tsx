'use client';

import React, { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock data for character and quests
const mockCharacter = {
  name: 'Alex',
  type: 'explorer',
  level: 3,
  xp: 250,
  xpToNextLevel: 400,
  stats: {
    curiosity: 8,
    creativity: 6,
    persistence: 5,
    collaboration: 4,
    analysis: 5
  },
  inventory: [
    { id: 'i1', name: 'Knowledge Map', description: 'Reveals connections between topics', icon: 'map' },
    { id: 'i2', name: 'Focus Lens', description: 'Increases concentration for difficult topics', icon: 'lens' }
  ],
  badges: [
    { id: 'b1', name: 'First Steps', description: 'Created your character', icon: 'milestone' },
    { id: 'b2', name: 'Knowledge Seeker', description: 'Completed 5 quests', icon: 'quest' }
  ],
  skills: [
    { id: 's1', name: 'Critical Thinking', level: 2 },
    { id: 's2', name: 'Research', level: 3 }
  ],
  completedQuests: 7,
  activeQuests: 2
};

// Mock quests data
const mockQuests = [
  {
    id: 'q1',
    title: 'The Mathematical Mystery',
    description: 'Solve a series of increasingly complex math problems to unlock the secret code.',
    difficulty: 'intermediate',
    subject: 'Mathematics',
    keyStage: 'KS3',
    learningStyles: ['visual', 'reading_writing'],
    xpReward: 100,
    duration: '30 minutes',
    objectives: [
      'Understand algebraic expressions',
      'Apply problem-solving techniques',
      'Practice mental math skills'
    ],
    progress: 0,
    status: 'available'
  },
  {
    id: 'q2',
    title: 'Historical Heroes',
    description: 'Research historical figures who changed the world and create a timeline of their achievements.',
    difficulty: 'beginner',
    subject: 'History',
    keyStage: 'KS2',
    learningStyles: ['reading_writing', 'visual'],
    xpReward: 75,
    duration: '45 minutes',
    objectives: [
      'Research historical figures',
      'Understand chronological order',
      'Identify key historical achievements'
    ],
    progress: 0,
    status: 'available'
  },
  {
    id: 'q3',
    title: 'Science Expedition',
    description: 'Conduct experiments to understand the principles of forces and motion.',
    difficulty: 'advanced',
    subject: 'Science',
    keyStage: 'KS3',
    learningStyles: ['kinesthetic', 'visual'],
    xpReward: 150,
    duration: '60 minutes',
    objectives: [
      'Design simple experiments',
      'Collect and analyze data',
      'Draw conclusions from results'
    ],
    progress: 0,
    status: 'available'
  }
];

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
                        <span className="text-sm">{value}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Special Abilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {characterTypes.find(type => type.id === selectedType)?.bonuses.map((bonus, i) => (
                    <li key={i} className="text-sm">{bonus}</li>
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
  
  return (
    <div className="container mx-auto p-4">
      {isCreatingCharacter ? (
        <CharacterCreation onCreateCharacter={handleCharacterCreated} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Character Panel */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Character</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-centre justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{character.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      Level {character.level} {character.type}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    {characterTypes.find(type => type.id === character.type)?.icon}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-centre justify-between mb-1">
                    <span className="text-sm">XP: {character.xp}/{character.xpToNextLevel}</span>
                    <span className="text-sm">{Math.round((character.xp / character.xpToNextLevel) * 100)}%</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Stats</h4>
                  <div className="space-y-2">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div key={stat} className="flex items-centre justify-between">
                        <span className="capitalize text-sm">{stat}</span>
                        <div className="flex items-centre space-x-2">
                          <span className="text-sm">{value}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.badges.map(badge => (
                      <div 
                        key={badge.id}
                        className="bg-muted p-1 rounded-md text-xs"
                        title={badge.description}
                      >
                        {badge.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">Completed Quests</p>
                    <p className="text-2xl font-bold">{character.completedQuests}</p>
                  </div>
                  <div>
                    <p className="font-medium">Active Quests</p>
                    <p className="text-2xl font-bold">{character.activeQuests}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-centre justify-between">
                  <CardTitle>Adventure Quest Saga</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsCreatingCharacter(true)}>
                    Create New Character
                  </Button>
                </div>
                <CardDescription>
                  Embark on educational quests tailored to your learning style and curriculum needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="quests" onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="quests">Available Quests</TabsTrigger>
                    <TabsTrigger value="active">Active Quests</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quests">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search quests..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-centre gap-2">
                              <span>Filters</span>
                              {Object.values(filters).flat().length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                  {Object.values(filters).flat().length}
                                </Badge>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Filter Quests</DialogTitle>
                              <DialogDescription>
                                Narrow down quests based on your preferences and needs
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="font-medium mb-2">Difficulty</h4>
                                <div className="flex flex-wrap gap-2">
                                  {difficultyLevels.map(level => (
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
                              
                              <div>
                                <h4 className="font-medium mb-2">Subject</h4>
                                <div className="flex flex-wrap gap-2">
                                  {subjects.map(subject => (
                                    <Badge
                                      key={subject}
                                      variant={filters.subject.includes(subject) ? "default" : "outline"}
                                      className="cursor-pointer"
                                      onClick={() => toggleFilter('subject', subject)}
                                    >
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Key Stage</h4>
                                <div className="flex flex-wrap gap-2">
                                  {keyStages.map(keyStage => (
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
                              
                              <div>
                                <h4 className="font-medium mb-2">Learning Style</h4>
                                <div className="flex flex-wrap gap-2">
                                  {learningStyles.map(style => (
                                    <Badge
                                      key={style.id}
                                      variant={filters.learningStyle.includes(style.id) ? "default" : "outline"}
                                      className="cursor-pointer flex items-centre gap-1"
                                      onClick={() => toggleFilter('learningStyle', style.id)}
                                    >
                                      {style.icon}
                                      <span>{style.name}</span>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                              <DialogClose asChild>
                                <Button>Apply Filters</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {filteredQuests.length === 0 ? (
                        <div className="text-centre p-8">
                          <p className="text-muted-foreground">No quests match your filters. Try adjusting your criteria.</p>
                          <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredQuests.map(quest => (
                            <Card key={quest.id} className="overflow-hidden">
                              <div className={`h-2 ${difficultyLevels.find(d => d.id === quest.difficulty)?.color}`} />
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">{quest.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{quest.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex flex-wrap gap-1 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {quest.subject}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {quest.keyStage}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {difficultyLevels.find(d => d.id === quest.difficulty)?.name}
                                  </Badge>
                                </div>
                                <div className="flex items-centre justify-between text-xs text-muted-foreground">
                                  <span>{quest.duration}</span>
                                  <span>{quest.xpReward} XP</span>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <div className="flex gap-2 w-full">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleSelectQuest(quest)}
                                  >
                                    Details
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleStartQuest(quest)}
                                  >
                                    Start
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="active">
                    <div className="text-centre p-8">
                      <p className="text-muted-foreground">You have no active quests. Start a new quest to begin your adventure!</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <div className="text-centre p-8">
                      <p className="text-muted-foreground">You haven&apos;t completed any quests yet. Keep exploring!</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Quest Details Dialog */}
            {selectedQuest && (
              <Dialog open={!!selectedQuest} onOpenChange={(open) => !open && setSelectedQuest(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <DialogTitle>{selectedQuest.title}</DialogTitle>
                        <DialogDescription>{selectedQuest.description}</DialogDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedQuest(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge>
                        {difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.name}
                      </Badge>
                      <Badge variant="outline">{selectedQuest.subject}</Badge>
                      <Badge variant="outline">{selectedQuest.keyStage}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Duration</h4>
                        <p>{selectedQuest.duration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">XP Reward</h4>
                        <p>{selectedQuest.xpReward} XP</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuest.learningStyles.map(styleId => {
                          const style = learningStyles.find(s => s.id === styleId);
                          return style ? (
                            <Badge key={styleId} variant="outline" className="flex items-centre gap-1">
                              {style.icon}
                              <span>{style.name}</span>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedQuest.objectives.map((objective, i) => (
                          <li key={i}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={() => handleStartQuest(selectedQuest)}>
                      Start Quest
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventureQuestSaga;
