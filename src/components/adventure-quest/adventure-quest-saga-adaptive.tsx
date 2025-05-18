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
}) => {
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
  const generateAdaptiveQuest = async () => {
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
    userProfile, 
    learningHistory, 
    assessmentResults, 
    params,
    curriculumContext
  ) => {
    // Determine appropriate difficulty
    let difficulty = params.difficulty;
    if (difficulty === 'auto') {
      // Calculate appropriate difficulty based on assessment results
      const averageScore = assessmentResults && assessmentResults.length > 0
        ? assessmentResults.reduce((sum, result) => sum + result.percentageScore, 0) / assessmentResults.length
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
    const durationMap = {
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
    const difficultyMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
      'expert': 2.5,
      'master': 3
    };
    const durationMultiplier = {
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
  const determineSubjectFocus = (learningHistory, assessmentResults) => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return 'Mathematics'; // Default subject
    }
    
    // Find subject with lowest average score (area for improvement)
    const subjectScores = {};
    let lowestSubject = null;
    let lowestScore = 100;
    
    assessmentResults.forEach(result => {
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
  
  const determineFocusAreas = (assessmentResults) => {
    if (!assessmentResults || assessmentResults.length === 0) {
      return ['problem-solving', 'critical-thinking']; // Default focus areas
    }
    
    // Find skill areas with lowest scores
    const skillScores = {};
    
    assessmentResults.forEach(result => {
      if (result.skillBreakdown) {
        Object.entries(result.skillBreakdown).forEach(([skill, score]) => {
          if (!skillScores[skill]) {
            skillScores[skill] = {
              total: 0,
              count: 0
            };
          }
          
          skillScores[skill].total += score;
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
  
  const generateQuestTitleAndDescription = (subject, focusAreas, difficulty) => {
    // In a real implementation, this would use an AI service to generate creative titles
    // For now, use templates based on subject and focus areas
    
    const subjectThemes = {
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
    
    let title = themes.titles[titleIndex];
    let description = themes.descriptions[descIndex];
    
    // Add focus area to description if available
    if (focusAreas && focusAreas.length > 0) {
      const focusArea = focusAreas[0].replace('-', ' ');
      description += ` This quest focuses on developing your ${focusArea} skills.`;
    }
    
    return { title, description };
  };
  
  const generateQuestObjectives = (subject, focusAreas, curriculumContext) => {
    // In a real implementation, this would generate objectives based on curriculum standards
    // For now, use templates based on subject and focus areas
    
    const subjectObjectives = {
      'Mathematics': [
        'Understand and apply mathematical concepts',
        'Develop problem-solving strategies',
        'Recognize patterns and relationships',
        'Use mathematical language precisely',
        'Apply mathematics to real-world situations'
      ],
      'English': [
        'Analyze different types of texts',
        'Develop vocabulary and language skills',
        'Create original written content',
        'Understand literary devices and techniques',
        'Communicate ideas clearly and effectively'
      ],
      'Science': [
        'Understand scientific method',
        'Conduct experiments and investigations',
        'Analyze and interpret data',
        'Make connections between scientific concepts',
        'Apply scientific knowledge to solve problems'
      ]
    };
    
    // Default objectives if subject not found
    const defaultObjectives = [
      'Develop critical thinking skills',
      'Apply knowledge to solve problems',
      'Analyze information effectively',
      'Communicate ideas clearly',
      'Make connections between concepts'
    ];
    
    // Get objectives for the subject or use defaults
    const objectives = subjectObjectives[subject] || defaultObjectives;
    
    // Select 3-5 objectives
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 objectives
    const selectedObjectives = [];
    
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
  
  const generateQuestChapters = (subject, focusAreas, difficulty) => {
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
    
    const subjectChapters = {
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
          title: 'The Narrative Nexus',
          description: 'Explore the Narrative Nexus to understand the structure and elements of compelling stories.'
        },
        {
          title: 'The Poetry Pavilion',
          description: 'Visit the Poetry Pavilion to discover the rhythm, rhyme, and power of poetic expression.'
        },
        {
          title: 'The Creative Crucible',
          description: 'Enter the Creative Crucible to forge your own literary masterpieces.'
        },
        {
          title: 'The Analysis Atrium',
          description: 'Study in the Analysis Atrium to develop critical reading and interpretation skills.'
        },
        {
          title: 'The Communication Courtyard',
          description: 'Practice in the Communication Courtyard to refine your ability to express ideas clearly.'
        }
      ],
      'Science': [
        {
          title: 'The Observation Outpost',
          description: 'Begin at the Observation Outpost to learn how to carefully observe the world around you.'
        },
        {
          title: 'The Experiment Enclave',
          description: 'Enter the Experiment Enclave to design and conduct your own scientific investigations.'
        },
        {
          title: 'The Discovery Domain',
          description: 'Reach the Discovery Domain to analyze your findings and draw meaningful conclusions.'
        },
        {
          title: 'The Theory Theater',
          description: 'Visit the Theory Theater to understand how scientific ideas explain natural phenomena.'
        },
        {
          title: 'The Application Archipelago',
          description: 'Explore the Application Archipelago to see how scientific knowledge solves real-world problems.'
        }
      ]
    };
    
    // Default chapters if subject not found
    const defaultChapters = [
      {
        title: 'Foundations',
        description: 'Build a strong foundation in key concepts and skills.'
      },
      {
        title: 'Exploration',
        description: 'Explore and experiment with new ideas and approaches.'
      },
      {
        title: 'Application',
        description: 'Apply your knowledge to solve problems and complete challenges.'
      },
      {
        title: 'Mastery',
        description: 'Demonstrate mastery through complex challenges and creative tasks.'
      },
      {
        title: 'Reflection',
        description: 'Reflect on your learning journey and consolidate your knowledge.'
      }
    ];
    
    // Get chapters for the subject or use defaults
    const chapters = subjectChapters[subject] || defaultChapters;
    
    // Select chapters based on chapter count
    const selectedChapters = chapters.slice(0, chapterCount).map((chapter, index) => {
      // Vary challenge count slightly for each chapter
      const challengeVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const challenges = Math.max(2, challengeBase + challengeVariation);
      
      return {
        id: `ch-${Date.now()}-${index}`,
        title: chapter.title,
        description: chapter.description,
        challenges,
        completed: false
      };
    });
    
    return selectedChapters;
  };
  
  const generateQuestRewards = (subject, difficulty) => {
    // In a real implementation, this would generate rewards based on curriculum achievements
    // For now, use templates based on subject and difficulty
    
    const difficultyMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
      'expert': 2.5,
      'master': 3
    }[difficulty] || 1;
    
    const subjectRewards = {
      'Mathematics': [
        { type: 'badge', name: 'Mathematical Explorer', icon: <Puzzle className="h-4 w-4" /> },
        { type: 'item', name: 'Mathematical Compass', icon: <Compass className="h-4 w-4" /> },
        { type: 'skill', name: 'Pattern Recognition +1', icon: <Brain className="h-4 w-4" /> }
      ],
      'English': [
        { type: 'badge', name: 'Wordsmith', icon: <BookOpen className="h-4 w-4" /> },
        { type: 'item', name: 'Enchanted Quill', icon: <Scroll className="h-4 w-4" /> },
        { type: 'skill', name: 'Creative Expression +1', icon: <Sparkles className="h-4 w-4" /> }
      ],
      'Science': [
        { type: 'badge', name: 'Scientific Explorer', icon: <Lightbulb className="h-4 w-4" /> },
        { type: 'item', name: 'Pocket Microscope', icon: <Search className="h-4 w-4" /> },
        { type: 'skill', name: 'Analytical Thinking +1', icon: <Brain className="h-4 w-4" /> }
      ]
    };
    
    // Default rewards if subject not found
    const defaultRewards = [
      { type: 'badge', name: 'Knowledge Seeker', icon: <Award className="h-4 w-4" /> },
      { type: 'item', name: 'Explorer\'s Kit', icon: <Backpack className="h-4 w-4" /> },
      { type: 'skill', name: 'Critical Thinking +1', icon: <Brain className="h-4 w-4" /> }
    ];
    
    // Get rewards for the subject or use defaults
    const rewards = subjectRewards[subject] || defaultRewards;
    
    // Enhance rewards based on difficulty
    if (difficultyMultiplier > 1) {
      // Add additional rewards for higher difficulties
      if (difficultyMultiplier >= 2) {
        rewards.push({ 
          type: 'badge', 
          name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${subject} Master`, 
          icon: <Trophy className="h-4 w-4" /> 
        });
      }
      
      if (difficultyMultiplier >= 2.5) {
        rewards.push({ 
          type: 'item', 
          name: `${subject} Mastery Emblem`, 
          icon: <Award className="h-4 w-4" /> 
        });
      }
    }
    
    return rewards;
  };
  
  const getCurriculumCode = (subject, keyStage, curriculumContext) => {
    if (!curriculumContext) return null;
    
    // In a real implementation, this would look up the appropriate curriculum code
    const subjectPrefix = {
      'Mathematics': 'MA',
      'English': 'EN',
      'Science': 'SC'
    }[subject] || 'GEN';
    
    const keyStageNumber = keyStage.replace('KS', '');
    
    return `${subjectPrefix}${keyStageNumber}-AQ`;
  };
  
  const getCurriculumLink = (subject, keyStage, curriculumContext) => {
    if (!curriculumContext) return null;
    
    // In a real implementation, this would generate a link to curriculum standards
    return `/curriculum/${subject.toLowerCase()}/${keyStage.toLowerCase()}/standards`;
  };
  
  // Handle parameter changes
  const handleParamChange = (param, value) => {
    setGenerationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Toggle learning style
  const toggleLearningStyle = (style) => {
    setGenerationParams(prev => {
      const current = [...prev.learningStyles];
      const index = current.indexOf(style);
      
      if (index === -1) {
        current.push(style);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        learningStyles: current
      };
    });
  };
  
  // Toggle focus area
  const toggleFocusArea = (area) => {
    setGenerationParams(prev => {
      const current = [...prev.focusAreas];
      const index = current.indexOf(area);
      
      if (index === -1) {
        current.push(area);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        focusAreas: current
      };
    });
  };
  
  // Available subjects from curriculum
  const subjects = curriculumContext?.subjects || [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'Art'
  ];
  
  // Available key stages
  const keyStages = curriculumContext?.keyStages || [
    'KS1',
    'KS2',
    'KS3',
    'KS4'
  ];
  
  // Available focus areas
  const availableFocusAreas = [
    'problem-solving',
    'critical-thinking',
    'creativity',
    'communication',
    'collaboration',
    'analysis',
    'application',
    'evaluation',
    'synthesis',
    'research'
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Adaptive Quest Generator</h2>
          <p className="text-muted-foreground">Create personalized quests tailored to your learning needs</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Quest Parameters
          </CardTitle>
          <CardDescription>Customize your quest or let the system adapt to your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generationParams.difficulty}
                  onChange={(e) => handleParamChange('difficulty', e.target.value)}
                >
                  <option value="auto">Auto (Based on your profile)</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                  <option value="master">Master</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generationParams.subject}
                  onChange={(e) => handleParamChange('subject', e.target.value)}
                >
                  <option value="">Auto (Based on your needs)</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="keyStage">Key Stage</Label>
                <select
                  id="keyStage"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generationParams.keyStage}
                  onChange={(e) => handleParamChange('keyStage', e.target.value)}
                >
                  <option value="">Auto (Based on your profile)</option>
                  {keyStages.map((keyStage) => (
                    <option key={keyStage} value={keyStage}>{keyStage}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration</Label>
                <select
                  id="duration"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generationParams.duration}
                  onChange={(e) => handleParamChange('duration', e.target.value)}
                >
                  <option value="short">Short (1-2 hours)</option>
                  <option value="medium">Medium (2-3 hours)</option>
                  <option value="long">Long (3-5 hours)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Learning Styles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {learningStyles.map((style) => (
                    <Badge
                      key={style.id}
                      variant={generationParams.learningStyles.includes(style.id) ? "default" : "outline"}
                      className="cursor-pointer flex items-center"
                      onClick={() => toggleLearningStyle(style.id)}
                    >
                      {style.icon}
                      <span className="ml-1">{style.name}</span>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {generationParams.learningStyles.length === 0 
                    ? "Auto (Based on your profile)" 
                    : `Selected: ${generationParams.learningStyles.length}`}
                </p>
              </div>
              
              <div>
                <Label>Focus Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableFocusAreas.map((area) => (
                    <Badge
                      key={area}
                      variant={generationParams.focusAreas.includes(area) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleFocusArea(area)}
                    >
                      {area.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {generationParams.focusAreas.length === 0 
                    ? "Auto (Based on assessment results)" 
                    : `Selected: ${generationParams.focusAreas.length}`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generateAdaptiveQuest} 
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Quest...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Adaptive Quest
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Credit purchase dialog from fair usage hook */}
      <CreditPurchaseDialog />
    </div>
  );
};

// Custom loader icon
const Loader2 = (props) => (
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Custom search icon
const Search = (props) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Progress Tracking Dashboard Component
const ProgressTrackingDashboard = ({ 
  character, 
  completedQuests, 
  activeQuests, 
  learningHistory, 
  assessmentResults 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate overall progress statistics
  const calculateOverallProgress = () => {
    if (!completedQuests || completedQuests.length === 0) {
      return {
        completionRate: 0,
        averageScore: 0,
        totalXP: 0,
        skillProgress: {}
      };
    }
    
    const totalQuests = completedQuests.length + (activeQuests?.length || 0);
    const completionRate = totalQuests > 0 
      ? (completedQuests.length / totalQuests) * 100 
      : 0;
    
    // Calculate average score from assessment results
    const averageScore = assessmentResults && assessmentResults.length > 0
      ? assessmentResults.reduce((sum, result) => sum + result.percentageScore, 0) / assessmentResults.length
      : 0;
    
    // Calculate total XP earned
    const totalXP = completedQuests.reduce((sum, quest) => sum + (quest.xpReward || 0), 0);
    
    // Calculate skill progress
    const skillProgress = {};
    
    if (character && character.skills) {
      character.skills.forEach(skill => {
        skillProgress[skill.name] = skill.progress;
      });
    }
    
    return {
      completionRate,
      averageScore,
      totalXP,
      skillProgress
    };
  };
  
  // Calculate subject-specific progress
  const calculateSubjectProgress = () => {
    if (!completedQuests || completedQuests.length === 0) {
      return [];
    }
    
    const subjectProgress = {};
    
    // Group quests by subject
    completedQuests.forEach(quest => {
      const subject = quest.subject;
      
      if (!subjectProgress[subject]) {
        subjectProgress[subject] = {
          subject,
          completed: 0,
          xpEarned: 0,
          assessmentScores: []
        };
      }
      
      subjectProgress[subject].completed += 1;
      subjectProgress[subject].xpEarned += (quest.xpReward || 0);
    });
    
    // Add assessment scores
    if (assessmentResults && assessmentResults.length > 0) {
      assessmentResults.forEach(result => {
        const subject = result.subject;
        
        if (subjectProgress[subject]) {
          subjectProgress[subject].assessmentScores.push(result.percentageScore);
        }
      });
    }
    
    // Calculate average assessment score for each subject
    Object.values(subjectProgress).forEach(progress => {
      progress.averageScore = progress.assessmentScores.length > 0
        ? progress.assessmentScores.reduce((sum, score) => sum + score, 0) / progress.assessmentScores.length
        : 0;
    });
    
    return Object.values(subjectProgress);
  };
  
  // Calculate learning style effectiveness
  const calculateLearningStyleEffectiveness = () => {
    if (!completedQuests || completedQuests.length === 0 || !assessmentResults || assessmentResults.length === 0) {
      return [];
    }
    
    const styleEffectiveness = {
      visual: { style: 'Visual', quests: 0, averageScore: 0, totalScore: 0 },
      auditory: { style: 'Auditory', quests: 0, averageScore: 0, totalScore: 0 },
      reading_writing: { style: 'Reading/Writing', quests: 0, averageScore: 0, totalScore: 0 },
      kinesthetic: { style: 'Kinesthetic', quests: 0, averageScore: 0, totalScore: 0 }
    };
    
    // Match completed quests with assessment results
    completedQuests.forEach(quest => {
      const relatedAssessments = assessmentResults.filter(result => 
        result.questId === quest.id || result.subject === quest.subject
      );
      
      if (relatedAssessments.length > 0) {
        const averageScore = relatedAssessments.reduce((sum, result) => 
          sum + result.percentageScore, 0
        ) / relatedAssessments.length;
        
        // Update effectiveness for each learning style in the quest
        quest.learningStyles.forEach(style => {
          if (styleEffectiveness[style]) {
            styleEffectiveness[style].quests += 1;
            styleEffectiveness[style].totalScore += averageScore;
          }
        });
      }
    });
    
    // Calculate average scores
    Object.values(styleEffectiveness).forEach(style => {
      style.averageScore = style.quests > 0 
        ? style.totalScore / style.quests 
        : 0;
    });
    
    // Sort by effectiveness (highest average score first)
    return Object.values(styleEffectiveness)
      .filter(style => style.quests > 0)
      .sort((a, b) => b.averageScore - a.averageScore);
  };
  
  // Calculate time-based progress trends
  const calculateProgressTrends = () => {
    if (!completedQuests || completedQuests.length === 0) {
      return {
        weekly: [],
        monthly: []
      };
    }
    
    // Group completed quests by week and month
    const weeklyData = {};
    const monthlyData = {};
    
    completedQuests.forEach(quest => {
      const completedAt = quest.completedAt ? new Date(quest.completedAt) : new Date();
      
      // Format week key (e.g., "2023-W01")
      const weekKey = getWeekKey(completedAt);
      
      // Format month key (e.g., "2023-01")
      const monthKey = getMonthKey(completedAt);
      
      // Update weekly data
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          period: weekKey,
          completed: 0,
          xpEarned: 0
        };
      }
      
      weeklyData[weekKey].completed += 1;
      weeklyData[weekKey].xpEarned += (quest.xpReward || 0);
      
      // Update monthly data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          period: monthKey,
          completed: 0,
          xpEarned: 0
        };
      }
      
      monthlyData[monthKey].completed += 1;
      monthlyData[monthKey].xpEarned += (quest.xpReward || 0);
    });
    
    // Convert to arrays and sort by period
    const weekly = Object.values(weeklyData).sort((a, b) => a.period.localeCompare(b.period));
    const monthly = Object.values(monthlyData).sort((a, b) => a.period.localeCompare(b.period));
    
    return {
      weekly,
      monthly
    };
  };
  
  // Helper functions for date formatting
  const getWeekKey = (date) => {
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  };
  
  const getMonthKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  };
  
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  // Get calculated statistics
  const overallProgress = calculateOverallProgress();
  const subjectProgress = calculateSubjectProgress();
  const learningStyleEffectiveness = calculateLearningStyleEffectiveness();
  const progressTrends = calculateProgressTrends();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Learning Progress</h2>
          <p className="text-muted-foreground">Track your educational journey and achievements</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{completedQuests?.length || 0}</div>
              <p className="text-muted-foreground">Quests Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{Math.round(overallProgress.averageScore)}%</div>
              <p className="text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{overallProgress.totalXP}</div>
              <p className="text-muted-foreground">Total XP Earned</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{character?.level || 1}</div>
              <p className="text-muted-foreground">Current Level</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="h-4 w-4 mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="learning-styles">
            <Brain className="h-4 w-4 mr-2" />
            Learning Styles
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Overall Progress
              </CardTitle>
              <CardDescription>Your learning journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Quest Completion</span>
                    <span className="text-sm font-medium">{Math.round(overallProgress.completionRate)}%</span>
                  </div>
                  <Progress value={overallProgress.completionRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Average Assessment Score</span>
                    <span className="text-sm font-medium">{Math.round(overallProgress.averageScore)}%</span>
                  </div>
                  <Progress value={overallProgress.averageScore} className="h-2" />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skill Progress</h3>
                  <div className="space-y-3">
                    {character?.skills?.map((skill) => (
                      <div key={skill.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {skill.icon}
                            <span className="text-sm ml-2">{skill.name}</span>
                          </div>
                          <span className="text-sm font-medium">Level {skill.level}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${skill.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                {character?.badges && character.badges.length > 0 ? (
                  <div className="space-y-3">
                    {character.badges.slice(0, 5).map((badge) => (
                      <div key={badge.id} className="flex items-start p-2 border rounded-lg">
                        <div className="p-2 bg-primary/10 rounded-lg mr-3">
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-xs mt-1">Complete quests to earn badges</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sword className="h-5 w-5 mr-2" />
                  Active Quests
                </CardTitle>
                <CardDescription>Your current adventures</CardDescription>
              </CardHeader>
              <CardContent>
                {activeQuests && activeQuests.length > 0 ? (
                  <div className="space-y-3">
                    {activeQuests.slice(0, 5).map((quest) => (
                      <div key={quest.id} className="p-2 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{quest.title}</h4>
                          <Badge variant="outline" className="capitalize">
                            {quest.subject}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{quest.progress}%</span>
                          </div>
                          <Progress value={quest.progress} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Sword className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active quests</p>
                    <p className="text-xs mt-1">Start a quest to begin your adventure</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Subject Performance
              </CardTitle>
              <CardDescription>Your progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectProgress.length > 0 ? (
                <div className="space-y-6">
                  {subjectProgress.map((progress) => (
                    <div key={progress.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{progress.subject}</h3>
                        <Badge variant="outline">
                          {progress.completed} {progress.completed === 1 ? 'Quest' : 'Quests'}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                          <span>Average Score</span>
                          <span>{Math.round(progress.averageScore)}%</span>
                        </div>
                        <Progress 
                          value={progress.averageScore} 
                          className="h-2"
                          // Color based on score
                          style={{
                            backgroundColor: 'hsl(var(--muted))',
                            '--progress-color': progress.averageScore < 50 
                              ? 'hsl(var(--destructive))' 
                              : progress.averageScore < 70
                                ? 'hsl(var(--warning))' 
                                : 'hsl(var(--success))',
                            '--progress-value': `${progress.averageScore}%`,
                            background: 'linear-gradient(to right, var(--progress-color) var(--progress-value), hsl(var(--muted)) var(--progress-value))'
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>XP Earned: {progress.xpEarned}</span>
                        <span>Assessments: {progress.assessmentScores.length}</span>
                      </div>
                      
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No subject data available</p>
                  <p className="text-xs mt-1">Complete quests to see your subject performance</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Subject Distribution
              </CardTitle>
              <CardDescription>How your learning is distributed across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectProgress.length > 0 ? (
                <div className="h-64 flex items-center justify-center">
                  {/* In a real implementation, this would be a pie chart */}
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Subject distribution visualization would appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No subject data available</p>
                  <p className="text-xs mt-1">Complete quests to see your subject distribution</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning-styles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Learning Style Effectiveness
              </CardTitle>
              <CardDescription>Which learning styles work best for you</CardDescription>
            </CardHeader>
            <CardContent>
              {learningStyleEffectiveness.length > 0 ? (
                <div className="space-y-6">
                  {learningStyleEffectiveness.map((style) => (
                    <div key={style.style} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                          {style.style === 'Visual' ? <Eye className="h-4 w-4 mr-2" /> :
                           style.style === 'Auditory' ? <EarIcon className="h-4 w-4 mr-2" /> :
                           style.style === 'Reading/Writing' ? <BookOpen className="h-4 w-4 mr-2" /> :
                           <HandIcon className="h-4 w-4 mr-2" />}
                          {style.style}
                        </h3>
                        <Badge variant="outline">
                          {style.quests} {style.quests === 1 ? 'Quest' : 'Quests'}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                          <span>Effectiveness Score</span>
                          <span>{Math.round(style.averageScore)}%</span>
                        </div>
                        <Progress 
                          value={style.averageScore} 
                          className="h-2"
                          // Color based on effectiveness
                          style={{
                            backgroundColor: 'hsl(var(--muted))',
                            '--progress-color': style.averageScore < 50 
                              ? 'hsl(var(--destructive))' 
                              : style.averageScore < 70
                                ? 'hsl(var(--warning))' 
                                : 'hsl(var(--success))',
                            '--progress-value': `${style.averageScore}%`,
                            background: 'linear-gradient(to right, var(--progress-color) var(--progress-value), hsl(var(--muted)) var(--progress-value))'
                          }}
                        />
                      </div>
                      
                      <Separator className="my-2" />
                    </div>
                  ))}
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Learning Style Insights
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your performance, {learningStyleEffectiveness[0]?.style} learning appears to be most effective for you. 
                      Consider prioritizing quests that incorporate this learning style.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No learning style data available</p>
                  <p className="text-xs mt-1">Complete quests with different learning styles to see your effectiveness</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Puzzle className="h-5 w-5 mr-2" />
                Recommended Learning Approaches
              </CardTitle>
              <CardDescription>Personalized suggestions based on your learning profile</CardDescription>
            </CardHeader>
            <CardContent>
              {learningStyleEffectiveness.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2 text-amber-500" />
                      Primary Approach
                    </h4>
                    <p className="text-sm mt-1">
                      Focus on {learningStyleEffectiveness[0]?.style.toLowerCase()} learning materials and activities.
                      {learningStyleEffectiveness[0]?.style === 'Visual' 
                        ? ' Use diagrams, charts, and videos to reinforce concepts.' 
                        : learningStyleEffectiveness[0]?.style === 'Auditory'
                          ? ' Listen to explanations, discussions, and audio materials.' 
                          : learningStyleEffectiveness[0]?.style === 'Reading/Writing'
                            ? ' Take notes, read texts, and write summaries of concepts.' 
                            : ' Engage in hands-on activities and practical applications.'}
                    </p>
                  </div>
                  
                  {learningStyleEffectiveness.length > 1 && (
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-blue-500" />
                        Secondary Approach
                      </h4>
                      <p className="text-sm mt-1">
                        Complement your primary style with {learningStyleEffectiveness[1]?.style.toLowerCase()} approaches.
                        {learningStyleEffectiveness[1]?.style === 'Visual' 
                          ? ' Incorporate visual aids alongside your primary learning method.' 
                          : learningStyleEffectiveness[1]?.style === 'Auditory'
                            ? ' Add discussions and verbal explanations to reinforce learning.' 
                            : learningStyleEffectiveness[1]?.style === 'Reading/Writing'
                              ? ' Support learning with written notes and text-based resources.' 
                              : ' Include practical exercises to solidify understanding.'}
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                      Multimodal Strategy
                    </h4>
                    <p className="text-sm mt-1">
                      For complex topics, combine multiple learning styles. Start with your strongest style, 
                      then reinforce with others. This approach leads to deeper understanding and better retention.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Puzzle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recommendations available</p>
                  <p className="text-xs mt-1">Complete more quests to receive personalized learning recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Progress Over Time
              </CardTitle>
              <CardDescription>How your learning journey has evolved</CardDescription>
            </CardHeader>
            <CardContent>
              {progressTrends.weekly.length > 0 || progressTrends.monthly.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Weekly Progress</h3>
                    <div className="h-64 flex items-center justify-center">
                      {/* In a real implementation, this would be a line chart */}
                      <div className="text-center">
                        <LineChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Weekly progress chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Monthly Progress</h3>
                    <div className="h-64 flex items-center justify-center">
                      {/* In a real implementation, this would be a line chart */}
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Monthly progress chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <LineChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No trend data available</p>
                  <p className="text-xs mt-1">Complete quests over time to see your progress trends</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Milestone className="h-5 w-5 mr-2" />
                Learning Milestones
              </CardTitle>
              <CardDescription>Key achievements in your educational journey</CardDescription>
            </CardHeader>
            <CardContent>
              {completedQuests && completedQuests.length > 0 ? (
                <div className="relative space-y-6">
                  {completedQuests.slice(0, 5).map((quest, index) => (
                    <div key={quest.id} className="relative">
                      {index < completedQuests.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted"></div>
                      )}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{quest.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {quest.subject} • {quest.completedAt 
                              ? new Date(quest.completedAt).toLocaleDateString() 
                              : 'Date unknown'}
                          </p>
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                            {quest.xpReward} XP Earned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Milestone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No milestones yet</p>
                  <p className="text-xs mt-1">Complete quests to create your learning timeline</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom icons
const Eye = (props) => (
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

const EarIcon = (props) => (
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

const HandIcon = (props) => (
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

// Main Adventure Quest Saga Component with Adaptive Generation and Progress Tracking
const AdventureQuestSagaAdaptive = () => {
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [activeView, setActiveView] = useState('quests'); // 'quests', 'character', 'quest-detail', 'adaptive', 'progress'
  const { toast } = useToast();
  const { useFeatureWithCredit, CreditPurchaseDialog } = useFairUsage();
  
  // Integration with curriculum module
  const curriculumContext = useCurriculum();
  
  // Integration with gamification system
  const gamificationContext = useGamification();
  
  // Integration with assessment module
  const assessmentContext = useAssessment();
  
  // Integration with user profile
  const userProfileContext = useUserProfile();
  
  // Mock learning history and assessment results for development
  const mockLearningHistory = [
    {
      id: 'lh1',
      questId: 'q1',
      subject: 'Mathematics',
      completedAt: '2023-01-15T12:30:00Z',
      score: 85,
      timeSpent: 120 // minutes
    },
    {
      id: 'lh2',
      questId: 'q2',
      subject: 'English',
      completedAt: '2023-02-10T14:45:00Z',
      score: 78,
      timeSpent: 90 // minutes
    },
    {
      id: 'lh3',
      questId: 'q3',
      subject: 'Science',
      completedAt: '2023-03-05T10:15:00Z',
      score: 92,
      timeSpent: 150 // minutes
    }
  ];
  
  const mockAssessmentResults = [
    {
      id: 'ar1',
      questId: 'q1',
      subject: 'Mathematics',
      completedAt: '2023-01-15T12:30:00Z',
      score: 17,
      maxScore: 20,
      percentageScore: 85,
      skillBreakdown: {
        'problem-solving': 80,
        'critical-thinking': 85,
        'application': 90
      }
    },
    {
      id: 'ar2',
      questId: 'q2',
      subject: 'English',
      completedAt: '2023-02-10T14:45:00Z',
      score: 39,
      maxScore: 50,
      percentageScore: 78,
      skillBreakdown: {
        'analysis': 75,
        'creativity': 85,
        'communication': 80
      }
    },
    {
      id: 'ar3',
      questId: 'q3',
      subject: 'Science',
      completedAt: '2023-03-05T10:15:00Z',
      score: 46,
      maxScore: 50,
      percentageScore: 92,
      skillBreakdown: {
        'research': 90,
        'analysis': 95,
        'application': 85
      }
    }
  ];
  
  // Initialize quests and character
  useEffect(() => {
    // In a real implementation, this would load data from API
    // For now, use mock data
    
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
        difficulty: 'intermediate',
        xpReward: 200,
        completedAt: '2023-03-05T10:15:00Z'
      }
    ]);
    
    // Initialize active quests
    setActiveQuests([
      {
        id: 'aq1',
        title: 'The Mathematical Mystery',
        subject: 'Mathematics',
        difficulty: 'intermediate',
        progress: 65
      },
      {
        id: 'aq2',
        title: 'The Literary Labyrinth',
        subject: 'English',
        difficulty: 'advanced',
        progress: 30
      }
    ]);
    
  }, [character]);
  
  // Handle character creation
  const handleCreateCharacter = (newCharacter) => {
    setCharacter(newCharacter);
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
    setActiveView('quest-detail');
  };
  
  // Handle quest start
  const handleStartQuest = async (quest) => {
    // Check if feature can be used (fair usage)
    const usageResult = await useFeatureWithCredit('questStart');
    
    if (!usageResult.success && !usageResult.usedCredits) {
      // If feature cannot be used and credits weren't used, exit
      return;
    }
    
    toast({
      title: "Quest Started",
      description: `You've begun "${quest.title}"`,
      variant: "success",
    });
    
    // Update character
    setCharacter(prev => ({
      ...prev,
      activeQuests: prev.activeQuests + 1
    }));
    
    // Add to active quests
    setActiveQuests(prev => [
      ...prev,
      {
        ...quest,
        progress: 0
      }
    ]);
    
    // Notify gamification system
    if (gamificationContext) {
      gamificationContext.trackEvent({
        type: 'quest_start',
        questId: quest.id,
        questTitle: quest.title,
        timestamp: new Date().toISOString()
      });
    }
    
    // In a real implementation, this would navigate to the quest gameplay
    setActiveView('quests');
  };
  
  // Handle adaptive quest generation
  const handleAdaptiveQuestGenerated = (quest) => {
    // Add generated quest to quests list
    setQuests(prev => [...prev, quest]);
    
    // Select the generated quest
    setSelectedQuest(quest);
    setActiveView('quest-detail');
  };
  
  // If no character, show character creation
  if (!character) {
    return (
      <div className="container mx-auto py-8">
        <CharacterCreation onCreateCharacter={handleCreateCharacter} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="quests" disabled={activeView === 'quest-detail'}>
            <Map className="h-4 w-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="character" disabled={activeView === 'quest-detail'}>
            <User className="h-4 w-4 mr-2" />
            Character
          </TabsTrigger>
          <TabsTrigger value="adaptive" disabled={activeView === 'quest-detail'}>
            <Sparkles className="h-4 w-4 mr-2" />
            Adaptive
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={activeView === 'quest-detail'}>
            <Activity className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests" className="mt-0">
          {activeView === 'quest-detail' ? (
            <QuestDetail 
              quest={selectedQuest} 
              onBack={() => setActiveView('quests')}
              onStart={handleStartQuest}
            />
          ) : (
            <QuestHub 
              quests={quests} 
              onSelectQuest={handleSelectQuest}
            />
          )}
        </TabsContent>
        
        <TabsContent value="character" className="mt-0">
          <CharacterDashboard character={character} />
        </TabsContent>
        
        <TabsContent value="adaptive" className="mt-0">
          <AdaptiveQuestGenerator 
            userProfile={userProfileContext?.profile || {
              keyStage: 'KS2',
              learningStyles: ['visual', 'kinesthetic']
            }}
            learningHistory={mockLearningHistory}
            curriculumContext={curriculumContext}
            assessmentResults={mockAssessmentResults}
            onQuestGenerated={handleAdaptiveQuestGenerated}
          />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-0">
          <ProgressTrackingDashboard 
            character={character}
            completedQuests={completedQuests}
            activeQuests={activeQuests}
            learningHistory={mockLearningHistory}
            assessmentResults={mockAssessmentResults}
          />
        </TabsContent>
      </Tabs>
      
      {/* Credit purchase dialog from fair usage hook */}
      <CreditPurchaseDialog />
    </div>
  );
};

// Custom user icon
const User = (props) => (
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
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

export default AdventureQuestSagaAdaptive;
