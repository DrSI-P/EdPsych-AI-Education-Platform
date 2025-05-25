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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

// Use React.ReactElement instead of JSX namespace
type ReactElement = React.ReactElement;

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
const EyeIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
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

const EarIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
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

const HandIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
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

// Define proper types instead of using 'any'
interface CharacterStats {
  curiosity: number;
  creativity: number;
  persistence: number;
  collaboration: number;
  analysis: number;
}

interface CharacterBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CharacterSkill {
  id: string;
  name: string;
  level: number;
}

interface Character {
  name: string;
  type: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: CharacterStats;
  inventory: Array<{id: string; name: string; description: string; icon: string}>;
  badges: CharacterBadge[];
  skills: CharacterSkill[];
  completedQuests: number;
  activeQuests: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subject: string;
  keyStage: string;
  learningStyles: string[];
  xpReward: number;
  duration: string;
  objectives: string[];
  progress: number;
  status: string;
}

interface FeatureCheckResult {
  success: boolean;
  message?: string;
}

// Character Creation Component
interface CharacterCreationProps {
  onCreateCharacter: (character: Character) => void;
}

const CharacterCreation = ({ onCreateCharacter }: CharacterCreationProps): React.ReactElement => {
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
        } as Character;
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

// Function to check feature availability
const checkFeatureAvailability = (): FeatureCheckResult => {
  // This would normally check against the user's subscription or fair usage limits
  return { success: true };
};

// Main component
const AdventureQuestSaga = (): React.ReactElement => {
  const { toast } = useToast();
  const fairUsage = useFairUsage();
  
  // State for character
  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  
  // State for quests
  const [quests] = useState<Quest[]>(mockQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    subject: [] as string[],
    keyStage: [] as string[],
    learningStyle: [] as string[]
  });
  
  // Extract unique subjects and key stages for filters
  const subjects = [...new Set(mockQuests.map(quest => quest.subject))];
  const keyStages = [...new Set(mockQuests.map(quest => quest.keyStage))];
  
  // Handle character creation
  const handleCharacterCreated = (newCharacter: Character): void => {
    setCharacter(newCharacter);
    setIsCreatingCharacter(false);
    toast({
      title: "Character Created!",
      description: `Welcome, ${newCharacter.name}!`
    });
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest: Quest): void => {
    setSelectedQuest(quest);
  };
  
  // Handle quest start
  const handleStartQuest = useCallback((quest: Quest): void => {
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
        description: featureCheck.message || "You've reached your limit for starting new quests today. Upgrade your plan or try again tomorrow."
      });
    }
  }, [toast]);
  
  // Filter quests based on search term and filters
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
  
  // Toggle filter
  const toggleFilter = (category: keyof typeof filters, value: string): void => {
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
  const clearFilters = (): void => {
    setFilters({
      difficulty: [],
      subject: [],
      keyStage: [],
      learningStyle: []
    });
    setSearchTerm('');
  };
  
  return (
    <div className="container mx-auto p-4">
      {isCreatingCharacter ? (
        <CharacterCreation onCreateCharacter={handleCharacterCreated} />
      ) : (
        <div className="space-y-6">
          {/* Character Overview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{character.name}</CardTitle>
                  <CardDescription>Level {character.level} {characterTypes.find(t => t.id === character.type)?.name}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsCreatingCharacter(true)}>
                  Change Character
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Progress</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>XP: {character.xp}/{character.xpToNextLevel}</span>
                      <span>{Math.round((character.xp / character.xpToNextLevel) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="text-xs capitalize">{stat}</span>
                        <span className="text-xs font-medium">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Achievements</h3>
                  <div className="flex flex-wrap gap-1">
                    {character.badges.map(badge => (
                      <Badge key={badge.id} variant="outline" className="text-xs">
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quest Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="search-quests">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-quests"
                      placeholder="Search quests..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full aspect-square p-0"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Difficulty</h3>
                  <div className="flex flex-wrap gap-1">
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
                
                <Separator />
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Subject</h3>
                  <div className="flex flex-wrap gap-1">
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
                
                <Separator />
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Key Stage</h3>
                  <div className="flex flex-wrap gap-1">
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
                
                <Separator />
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Learning Style</h3>
                  <div className="flex flex-wrap gap-1">
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
            
            {/* Quest List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-centre">
                <h2 className="text-2xl font-bold">Available Quests</h2>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredQuests.length} of {quests.length} quests
                </div>
              </div>
              
              {filteredQuests.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-centre justify-centre p-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-medium">No quests found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or search term to find quests.
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuests.map(quest => (
                    <Card key={quest.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{quest.title}</CardTitle>
                          <Badge>
                            {difficultyLevels.find(d => d.id === quest.difficulty)?.name}
                          </Badge>
                        </div>
                        <CardDescription>{quest.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Subject:</span> {quest.subject}
                          </div>
                          <div>
                            <span className="font-medium">Key Stage:</span> {quest.keyStage}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {quest.duration}
                          </div>
                          <div>
                            <span className="font-medium">XP Reward:</span> {quest.xpReward}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm font-medium">Learning Styles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {quest.learningStyles.map(styleId => {
                              const style = learningStyles.find(s => s.id === styleId);
                              return style ? (
                                <Badge key={styleId} variant="outline" className="text-xs flex items-centre gap-1">
                                  {style.icon}
                                  <span>{style.name}</span>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => handleSelectQuest(quest)}>
                          View Details
                        </Button>
                        <Button onClick={() => handleStartQuest(quest)}>
                          Start Quest
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Quest Details Dialog */}
          {selectedQuest && (
            <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <DialogTitle>{selectedQuest.title}</DialogTitle>
                    <Badge>
                      {difficultyLevels.find(d => d.id === selectedQuest.difficulty)?.name}
                    </Badge>
                  </div>
                  <DialogDescription>{selectedQuest.description}</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <h3 className="font-medium mb-2">Quest Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subject:</span>
                        <span>{selectedQuest.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Key Stage:</span>
                        <span>{selectedQuest.keyStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{selectedQuest.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>XP Reward:</span>
                        <span>{selectedQuest.xpReward}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Learning Styles</h3>
                    <div className="flex flex-wrap gap-1">
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
                </div>
                
                <div className="py-4">
                  <h3 className="font-medium mb-2">Learning Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedQuest.objectives.map((objective, i) => (
                      <li key={i} className="text-sm">{objective}</li>
                    ))}
                  </ul>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedQuest(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleStartQuest(selectedQuest)}>
                    Start Quest
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default AdventureQuestSaga;
