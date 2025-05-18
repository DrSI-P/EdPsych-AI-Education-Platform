'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Label,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Switch
} from "@/components/ui";
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  MessageCircle, 
  Heart, 
  ArrowRight, 
  FileText, 
  Save, 
  Download,
  Lightbulb,
  Plus,
  Trash2,
  Edit,
  Copy,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Age-Appropriate Reflection Prompts Component
 * 
 * This component provides developmentally appropriate reflection prompts
 * for students at different age levels within the restorative justice framework.
 * 
 * Key features:
 * - Age-appropriate prompts categorized by developmental stage
 * - Different prompt types for various restorative scenarios
 * - Customizable prompt collections
 * - Visual supports for younger students
 * - Integration with the restorative justice framework
 */
const AgeAppropriateReflectionPrompts = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState({
    title: "",
    description: "",
    ageGroup: "",
    category: "",
    promptText: "",
    supportingQuestions: [],
    visualSupports: false,
    simplifiedLanguage: false
  });
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Predefined reflection prompts based on restorative justice research and developmental psychology
  const predefinedPrompts = [
    // Early Years (3-5)
    {
      id: "early-1",
      title: "Feelings Check",
      description: "Simple prompts to help young children identify and express their feelings",
      ageGroup: "early-years",
      category: "self-awareness",
      promptText: "How are you feeling right now? Can you point to the face that shows how you feel?",
      supportingQuestions: [
        "Can you tell me why you feel that way?",
        "What happened to make you feel like this?",
        "What would help you feel better?",
        "Is there something you need right now?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/emotions/happy.png",
        "/images/restorative-justice/emotions/sad.png",
        "/images/restorative-justice/emotions/angry.png",
        "/images/restorative-justice/emotions/scared.png",
        "/images/restorative-justice/emotions/confused.png"
      ]
    },
    {
      id: "early-2",
      title: "What Happened?",
      description: "Simple prompts to help young children describe events",
      ageGroup: "early-years",
      category: "incident-reflection",
      promptText: "Can you tell me what happened? Let's draw it together.",
      supportingQuestions: [
        "Who was there?",
        "What did you do?",
        "What did the other person do?",
        "How did it make you feel?",
        "What do you wish had happened instead?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/sequence/first.png",
        "/images/restorative-justice/sequence/then.png",
        "/images/restorative-justice/sequence/next.png",
        "/images/restorative-justice/sequence/last.png"
      ]
    },
    {
      id: "early-3",
      title: "Making Things Better",
      description: "Simple prompts to help young children think about making amends",
      ageGroup: "early-years",
      category: "making-amends",
      promptText: "What could you do to make things better?",
      supportingQuestions: [
        "How could you help [name] feel better?",
        "Would you like to make a card/picture for them?",
        "Could you use kind words to help?",
        "What could you share with them?",
        "Would a hug help if they want one?"
      ],
      visualSupports: true,
      simplifiedLanguage: true,
      visualAids: [
        "/images/restorative-justice/actions/say-sorry.png",
        "/images/restorative-justice/actions/help-clean.png",
        "/images/restorative-justice/actions/share-toy.png",
        "/images/restorative-justice/actions/kind-words.png"
      ]
    },
    
    // Primary (5-11)
    {
      id: "primary-1",
      title: "Understanding Impact",
      description: "Prompts to help primary students reflect on how their actions affect others",
      ageGroup: "primary",
      category: "impact-awareness",
      promptText: "When [incident] happened, how do you think it affected other people?",
      supportingQuestions: [
        "How do you think [name] felt when that happened?",
        "What might they have been thinking?",
        "How might it have affected their day?",
        "Did it affect anyone else? How?",
        "If you were in their position, how would you have felt?"
      ],
      visualSupports: true,
      simplifiedLanguage: false
    },
    {
      id: "primary-2",
      title: "Exploring Choices",
      description: "Prompts to help primary students reflect on decision-making",
      ageGroup: "primary",
      category: "choice-reflection",
      promptText: "What choices did you make before, during, and after what happened?",
      supportingQuestions: [
        "What were you thinking when you made that choice?",
        "What else could you have chosen to do instead?",
        "What stopped you from making a different choice?",
        "How might things have been different if you chose differently?",
        "What might help you make different choices next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "primary-3",
      title: "Repairing Harm",
      description: "Prompts to help primary students think about making things right",
      ageGroup: "primary",
      category: "making-amends",
      promptText: "What could you do to help make things right?",
      supportingQuestions: [
        "What do you think would help [name] feel better?",
        "Is there something you could do to fix what happened?",
        "Is there something you could say that would help?",
        "How will you know if things are better?",
        "What might you do differently next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "primary-4",
      title: "Community Impact",
      description: "Prompts to help primary students understand wider impacts",
      ageGroup: "primary",
      category: "community-awareness",
      promptText: "How do you think what happened affected our classroom community?",
      supportingQuestions: [
        "Did it change how people feel in our classroom?",
        "Did it make it harder for anyone to learn or play?",
        "Did it affect how people trust each other?",
        "What could we all do to make our classroom feel better?",
        "What classroom agreements does this remind us about?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    
    // Secondary (11-18)
    {
      id: "secondary-1",
      title: "Personal Responsibility",
      description: "Prompts to help secondary students reflect on their role in situations",
      ageGroup: "secondary",
      category: "responsibility",
      promptText: "Reflecting on the situation, what part did you play and what responsibility do you have?",
      supportingQuestions: [
        "What factors influenced your decisions or actions?",
        "Which aspects were within your control and which weren't?",
        "How might your actions or words have contributed to what happened?",
        "Were there moments where you could have changed the outcome?",
        "What does taking responsibility mean to you in this situation?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-2",
      title: "Perspective Taking",
      description: "Prompts to help secondary students consider multiple perspectives",
      ageGroup: "secondary",
      category: "empathy",
      promptText: "How might different people involved view and experience this situation?",
      supportingQuestions: [
        "How do you think [name] experienced this situation?",
        "What might they have been thinking or feeling?",
        "What pressures or influences might they have been under?",
        "How might someone not directly involved view this situation?",
        "What assumptions might you be making about others' intentions or experiences?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-3",
      title: "Values Alignment",
      description: "Prompts to help secondary students reflect on personal values",
      ageGroup: "secondary",
      category: "values",
      promptText: "How does what happened align with your personal values and who you want to be?",
      supportingQuestions: [
        "What values are important to you as a person?",
        "Which of your values were honored or compromised in this situation?",
        "How would someone who embodies your values have handled this situation?",
        "What does this situation reveal about what matters to you?",
        "How might this experience shape your values going forward?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-4",
      title: "Relationship Impact",
      description: "Prompts to help secondary students reflect on relationship effects",
      ageGroup: "secondary",
      category: "relationships",
      promptText: "How has this situation affected your relationships with others involved?",
      supportingQuestions: [
        "How has trust been affected in your relationship(s)?",
        "What might be needed to repair these relationship(s)?",
        "How might this experience change how you interact in the future?",
        "What strengths in your relationship(s) might help with moving forward?",
        "What have you learned about yourself in relationships from this experience?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "secondary-5",
      title: "Future Planning",
      description: "Prompts to help secondary students plan for similar situations",
      ageGroup: "secondary",
      category: "future-planning",
      promptText: "What have you learned from this experience that you can apply in the future?",
      supportingQuestions: [
        "What warning signs or triggers can you identify now?",
        "What strategies could you use in similar situations?",
        "What support might you need to respond differently?",
        "How might you repair similar harm if it happens again?",
        "What commitments are you willing to make going forward?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    
    // Staff Reflection
    {
      id: "staff-1",
      title: "Facilitation Reflection",
      description: "Prompts for staff to reflect on their restorative facilitation",
      ageGroup: "staff",
      category: "facilitation",
      promptText: "How effective was your facilitation of the restorative process?",
      supportingQuestions: [
        "How well did you maintain neutrality throughout the process?",
        "How effectively did you create a safe space for all participants?",
        "What questions or techniques were most effective?",
        "What challenges did you encounter and how did you address them?",
        "What would you do differently next time?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    },
    {
      id: "staff-2",
      title: "Relationship Building",
      description: "Prompts for staff to reflect on relationship aspects",
      ageGroup: "staff",
      category: "relationships",
      promptText: "How has this restorative process affected your relationships with the students involved?",
      supportingQuestions: [
        "How has trust been affected in your relationships?",
        "What have you learned about these students through this process?",
        "How might this experience change how you interact with them in the future?",
        "What strengths in your relationships helped with the process?",
        "How can you continue to build on these relationships?"
      ],
      visualSupports: false,
      simplifiedLanguage: false
    }
  ];

  // Load saved prompts on component mount
  useEffect(() => {
    const loadSavedPrompts = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use localStorage as a placeholder
        const saved = localStorage.getItem('savedReflectionPrompts');
        if (saved) {
          setSavedPrompts(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved prompts:', error);
        toast.error('Failed to load saved prompts');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPrompts();
  }, []);

  // Filter prompts based on search and filters
  const filteredPrompts = [...predefinedPrompts, ...savedPrompts].filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = filterAgeGroup === 'all' || prompt.ageGroup === filterAgeGroup;
    const matchesCategory = filterCategory === 'all' || prompt.category === filterCategory;
    
    return matchesSearch && matchesAgeGroup && matchesCategory;
  });

  // Handle prompt selection
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setActiveTab("view");
  };

  // Handle custom prompt changes
  const handleCustomPromptChange = (field, value) => {
    setCustomPrompt(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a supporting question to custom prompt
  const addSupportingQuestion = () => {
    setCustomPrompt(prev => ({
      ...prev,
      supportingQuestions: [...prev.supportingQuestions, ""]
    }));
  };

  // Handle supporting question changes
  const handleQuestionChange = (index, value) => {
    setCustomPrompt(prev => {
      const updatedQuestions = [...prev.supportingQuestions];
      updatedQuestions[index] = value;
      return {
        ...prev,
        supportingQuestions: updatedQuestions
      };
    });
  };

  // Remove a supporting question
  const removeQuestion = (index) => {
    setCustomPrompt(prev => {
      const updatedQuestions = [...prev.supportingQuestions];
      updatedQuestions.splice(index, 1);
      return {
        ...prev,
        supportingQuestions: updatedQuestions
      };
    });
  };

  // Save custom prompt
  const saveCustomPrompt = () => {
    if (!customPrompt.title) {
      toast.error('Please provide a title for your prompt');
      return;
    }

    if (!customPrompt.promptText) {
      toast.error('Please provide the main reflection prompt');
      return;
    }

    const newPrompt = {
      ...customPrompt,
      id: `custom-${Date.now()}`,
    };

    setSavedPrompts(prev => {
      const updated = [...prev, newPrompt];
      // In a real implementation, this would save to an API
      localStorage.setItem('savedReflectionPrompts', JSON.stringify(updated));
      return updated;
    });

    toast.success('Reflection prompt saved successfully');
    setCustomPrompt({
      title: "",
      description: "",
      ageGroup: "",
      category: "",
      promptText: "",
      supportingQuestions: [],
      visualSupports: false,
      simplifiedLanguage: false
    });
    setActiveTab("browse");
  };

  // Export prompt as PDF
  const exportPromptAsPDF = () => {
    if (!selectedPrompt) return;
    
    // In a real implementation, this would generate and download a PDF
    toast.success('Prompt exported as PDF');
  };

  // Duplicate a prompt
  const duplicatePrompt = (prompt) => {
    const duplicated = {
      ...prompt,
      id: `custom-${Date.now()}`,
      title: `Copy of ${prompt.title}`
    };

    setSavedPrompts(prev => {
      const updated = [...prev, duplicated];
      localStorage.setItem('savedReflectionPrompts', JSON.stringify(updated));
      return updated;
    });

    toast.success('Prompt duplicated successfully');
  };

  // Get age group display name
  const getAgeGroupDisplay = (ageGroup) => {
    switch (ageGroup) {
      case 'early-years': return 'Early Years (3-5)';
      case 'primary': return 'Primary (5-11)';
      case 'secondary': return 'Secondary (11-18)';
      case 'staff': return 'Staff';
      default: return ageGroup;
    }
  };

  // Get category display name
  const getCategoryDisplay = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Age-Appropriate Reflection Prompts</h1>
          <p className="text-muted-foreground">
            Developmentally appropriate prompts to support reflection within the restorative justice framework.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="browse">Browse Prompts</TabsTrigger>
            <TabsTrigger value="view" disabled={!selectedPrompt}>View Prompt</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
          </TabsList>

          {/* Browse Prompts Tab */}
          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reflection Prompts</CardTitle>
                <CardDescription>
                  Browse age-appropriate prompts for different restorative contexts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search prompts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="age-group">Age Group</Label>
                      <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
                        <SelectTrigger id="age-group">
                          <SelectValue placeholder="All age groups" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All age groups</SelectItem>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (5-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="category">Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                          <SelectItem value="incident-reflection">Incident Reflection</SelectItem>
                          <SelectItem value="making-amends">Making Amends</SelectItem>
                          <SelectItem value="impact-awareness">Impact Awareness</SelectItem>
                          <SelectItem value="choice-reflection">Choice Reflection</SelectItem>
                          <SelectItem value="community-awareness">Community Awareness</SelectItem>
                          <SelectItem value="responsibility">Responsibility</SelectItem>
                          <SelectItem value="empathy">Empathy</SelectItem>
                          <SelectItem value="values">Values</SelectItem>
                          <SelectItem value="relationships">Relationships</SelectItem>
                          <SelectItem value="future-planning">Future Planning</SelectItem>
                          <SelectItem value="facilitation">Facilitation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredPrompts.map((prompt) => (
                      <Card key={prompt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{prompt.title}</CardTitle>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {getAgeGroupDisplay(prompt.ageGroup)}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {getCategoryDisplay(prompt.category)}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">{prompt.description}</p>
                          <p className="text-sm mt-2 font-medium">
                            "{prompt.promptText.length > 100 ? prompt.promptText.substring(0, 100) + '...' : prompt.promptText}"
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => duplicatePrompt(prompt)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSelectPrompt(prompt)}
                          >
                            View
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                    {filteredPrompts.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center p-6 text-center">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No prompts found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filters, or create a custom prompt.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Prompt Tab */}
          <TabsContent value="view" className="space-y-6">
            {selectedPrompt && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setActiveTab("browse")}>
                      Back to Prompts
                    </Button>
                    <Button variant="outline" onClick={exportPromptAsPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reflection Prompt</CardTitle>
                        <CardDescription>
                          {selectedPrompt.description}
                        </CardDescription>
                        <div className="flex space-x-2 mt-2">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {getAgeGroupDisplay(selectedPrompt.ageGroup)}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {getCategoryDisplay(selectedPrompt.category)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <h3 className="text-lg font-medium mb-2">Main Prompt</h3>
                            <p className="text-lg">{selectedPrompt.promptText}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Supporting Questions</h3>
                            <ul className="space-y-2">
                              {selectedPrompt.supportingQuestions.map((question, index) => (
                                <li key={index} className="flex items-start p-3 border rounded-lg">
                                  <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {selectedPrompt.visualSupports && selectedPrompt.visualAids && (
                            <div>
                              <h3 className="text-lg font-medium mb-2">Visual Supports</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {selectedPrompt.visualAids.map((aid, index) => (
                                  <div key={index} className="border rounded-lg p-2 flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-gray-500">Image</span>
                                      </div>
                                      <p className="text-xs mt-1 text-gray-500">Visual Aid {index + 1}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage Guidelines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-1">Recommended For</h3>
                            <p className="text-sm text-muted-foreground">{getAgeGroupDisplay(selectedPrompt.ageGroup)}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Best Used When</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedPrompt.category === 'self-awareness' && 'Students need to identify and express their feelings'}
                              {selectedPrompt.category === 'incident-reflection' && 'Reflecting on a specific incident or event'}
                              {selectedPrompt.category === 'making-amends' && 'Considering how to repair harm or make things right'}
                              {selectedPrompt.category === 'impact-awareness' && 'Exploring how actions affect others'}
                              {selectedPrompt.category === 'choice-reflection' && 'Examining decision-making processes'}
                              {selectedPrompt.category === 'community-awareness' && 'Understanding impacts on the wider community'}
                              {selectedPrompt.category === 'responsibility' && 'Exploring personal responsibility in a situation'}
                              {selectedPrompt.category === 'empathy' && 'Developing perspective-taking skills'}
                              {selectedPrompt.category === 'values' && 'Connecting actions to personal values'}
                              {selectedPrompt.category === 'relationships' && 'Examining effects on relationships'}
                              {selectedPrompt.category === 'future-planning' && 'Planning for similar situations in the future'}
                              {selectedPrompt.category === 'facilitation' && 'Reflecting on restorative facilitation practice'}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Adaptations</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Checkbox id="simplified" checked={selectedPrompt.simplifiedLanguage} disabled />
                                <label htmlFor="simplified" className="ml-2 text-sm">
                                  Simplified language
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="visual" checked={selectedPrompt.visualSupports} disabled />
                                <label htmlFor="visual" className="ml-2 text-sm">
                                  Visual supports available
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h3 className="text-sm font-medium mb-3">Facilitation Tips</h3>
                            <div className="space-y-3">
                              <div className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span className="text-sm">Allow plenty of time for reflection</span>
                              </div>
                              <div className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span className="text-sm">Use a calm, non-judgmental tone</span>
                              </div>
                              <div className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span className="text-sm">Validate feelings while exploring actions</span>
                              </div>
                              <div className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span className="text-sm">Adapt language to match developmental level</span>
                              </div>
                              <div className="flex items-start">
                                <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                                <span className="text-sm">Consider offering drawing or writing options</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Create Custom Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Reflection Prompt</CardTitle>
                <CardDescription>
                  Design your own age-appropriate reflection prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-title">Prompt Title</Label>
                      <Input
                        id="custom-title"
                        placeholder="Enter a title for your prompt"
                        value={customPrompt.title}
                        onChange={(e) => handleCustomPromptChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-description">Description</Label>
                      <Input
                        id="custom-description"
                        placeholder="Briefly describe your prompt"
                        value={customPrompt.description}
                        onChange={(e) => handleCustomPromptChange('description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-age-group">Age Group</Label>
                      <Select 
                        value={customPrompt.ageGroup} 
                        onValueChange={(value) => handleCustomPromptChange('ageGroup', value)}
                      >
                        <SelectTrigger id="custom-age-group">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (5-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="custom-category">Category</Label>
                      <Select 
                        value={customPrompt.category} 
                        onValueChange={(value) => handleCustomPromptChange('category', value)}
                      >
                        <SelectTrigger id="custom-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                          <SelectItem value="incident-reflection">Incident Reflection</SelectItem>
                          <SelectItem value="making-amends">Making Amends</SelectItem>
                          <SelectItem value="impact-awareness">Impact Awareness</SelectItem>
                          <SelectItem value="choice-reflection">Choice Reflection</SelectItem>
                          <SelectItem value="community-awareness">Community Awareness</SelectItem>
                          <SelectItem value="responsibility">Responsibility</SelectItem>
                          <SelectItem value="empathy">Empathy</SelectItem>
                          <SelectItem value="values">Values</SelectItem>
                          <SelectItem value="relationships">Relationships</SelectItem>
                          <SelectItem value="future-planning">Future Planning</SelectItem>
                          <SelectItem value="facilitation">Facilitation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="main-prompt">Main Reflection Prompt</Label>
                    <Textarea
                      id="main-prompt"
                      placeholder="Enter the main reflection prompt question"
                      value={customPrompt.promptText}
                      onChange={(e) => handleCustomPromptChange('promptText', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Supporting Questions</Label>
                      <Button variant="outline" size="sm" onClick={addSupportingQuestion}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </Button>
                    </div>

                    {customPrompt.supportingQuestions.map((question, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter supporting question"
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {customPrompt.supportingQuestions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add supporting questions to help guide the reflection process.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Adaptations</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox 
                          id="custom-simplified" 
                          checked={customPrompt.simplifiedLanguage}
                          onCheckedChange={(checked) => 
                            handleCustomPromptChange('simplifiedLanguage', checked)
                          }
                        />
                        <label htmlFor="custom-simplified" className="ml-2 text-sm">
                          Simplified language for younger students
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="custom-visual" 
                          checked={customPrompt.visualSupports}
                          onCheckedChange={(checked) => 
                            handleCustomPromptChange('visualSupports', checked)
                          }
                        />
                        <label htmlFor="custom-visual" className="ml-2 text-sm">
                          Visual supports recommended
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("browse")}>
                  Cancel
                </Button>
                <Button onClick={saveCustomPrompt}>
                  Save Prompt
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgeAppropriateReflectionPrompts;
