'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAIService } from '@/lib/ai/ai-service';
import { Save, Copy, Download, FileText, RefreshCw, BookOpen, Lightbulb, Wand2 } from 'lucide-react';

interface LessonPlanTemplate {
  id: string;
  name: string;
  description: string;
  structure: string[];
}

const lessonPlanTemplates: LessonPlanTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Lesson Plan',
    description: 'A comprehensive lesson plan suitable for most subjects and year groups',
    structure: [
      'Learning Objectives',
      'Success Criteria',
      'Prior Knowledge',
      'Resources',
      'Introduction (10-15 min)',
      'Main Activities (25-30 min)',
      'Plenary (5-10 min)',
      'Assessment',
      'Differentiation',
      'Extension Activities',
      'Homework'
    ]
  },
  {
    id: 'inquiry',
    name: 'Inquiry-Based Learning',
    description: 'A lesson plan focused on student-led inquiry and discovery',
    structure: [
      'Essential Question',
      'Learning Objectives',
      'Resources and Materials',
      'Hook/Engagement (10 min)',
      'Exploration Phase (20 min)',
      'Explanation Phase (15 min)',
      'Elaboration Activities (15 min)',
      'Evaluation/Assessment',
      'Differentiation Strategies',
      'Reflection Prompts'
    ]
  },
  {
    id: 'workshop',
    name: 'Workshop Model',
    description: 'A structured approach with mini-lesson, independent work, and sharing',
    structure: [
      'Learning Objectives',
      'Connection to Prior Learning',
      'Mini-Lesson (10-15 min)',
      'Independent/Group Work (25-30 min)',
      'Mid-Workshop Teaching Point',
      'Sharing/Reflection (10 min)',
      'Assessment Strategy',
      'Differentiation',
      'Next Steps'
    ]
  },
  {
    id: 'direct',
    name: 'Direct Instruction',
    description: 'A teacher-led approach focused on explicit instruction and guided practise',
    structure: [
      'Learning Objectives',
      'Success Criteria',
      'Prerequisite Skills',
      'Materials and Resources',
      'Anticipatory Set (5 min)',
      'Teacher Presentation (15 min)',
      'Guided Practise (15 min)',
      'Independent Practise (15 min)',
      'Assessment',
      'Reteaching Strategies',
      'Extension Activities'
    ]
  },
  {
    id: 'station',
    name: 'Station Rotation',
    description: 'A plan organising learning through multiple activity stations',
    structure: [
      'Learning Objectives',
      'Station Setup and Materials',
      'Introduction and Directions (10 min)',
      'Station 1: Teacher-Led (15-20 min)',
      'Station 2: Collaborative Work (15-20 min)',
      'Station 3: Independent Practise (15-20 min)',
      'Station 4: Digital Content (15-20 min)',
      'Rotation Schedule',
      'Wrap-Up and Reflection (10 min)',
      'Assessment Strategy',
      'Differentiation Plan'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Lesson Plan',
    description: 'Create your own lesson plan structure',
    structure: [
      'Learning Objectives',
      'Activities',
      'Assessment',
      'Resources'
    ]
  }
];

const yearGroups = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

const subjects = [
  'English', 'Mathematics', 'Science', 'History', 'Geography', 'Art and Design',
  'Computing', 'Design and Technology', 'Languages', 'Music', 'Physical Education',
  'Religious Education', 'PSHE', 'Citizenship', 'Business Studies', 'Drama'
];

const learningStyles = [
  { id: 'visual', label: 'Visual' },
  { id: 'auditory', label: 'Auditory' },
  { id: 'kinesthetic', label: 'Kinesthetic' },
  { id: 'reading', label: 'Reading/Writing' }
];

const specialNeeds = [
  { id: 'adhd', label: 'ADHD' },
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'asd', label: 'Autism Spectrum' },
  { id: 'esl', label: 'English as Additional Language' },
  { id: 'hearing', label: 'Hearing Impairment' },
  { id: 'visual', label: 'Visual Impairment' },
  { id: 'gifted', label: 'Gifted and Talented' }
];

export default function SmartLessonPlanning() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [activeTab, setActiveTab] = useState('create');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LessonPlanTemplate | null>(null);
  const [customSections, setCustomSections] = useState<string[]>(['Learning Objectives', 'Activities', 'Assessment', 'Resources']);
  const [newSection, setNewSection] = useState('');
  
  const [lessonPlanInput, setLessonPlanInput] = useState({
    title: '',
    subject: '',
    yearGroup: '',
    duration: '60',
    objectives: '',
    priorKnowledge: '',
    keyVocabulary: '',
    resources: '',
    notes: '',
    selectedLearningStyles: [] as string[],
    selectedSpecialNeeds: [] as string[]
  });
  
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [generatedLessonPlan, setGeneratedLessonPlan] = useState('');
  const [savedLessonPlans, setSavedLessonPlans] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [showingSuggestion, setShowingSuggestion] = useState('');
  
  // Initialize saved lesson plans from localStorage
  useEffect(() => {
    const loadSavedLessonPlans = () => {
      try {
        const saved = localStorage.getItem('smartLessonPlans');
        if (saved) {
          setSavedLessonPlans(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved lesson plans:', error);
      }
    };
    
    loadSavedLessonPlans();
  }, []);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = lessonPlanTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      
      // Initialize section content with empty strings
      const initialContent: Record<string, string> = {};
      template.structure.forEach(section => {
        initialContent[section] = '';
      });
      setSectionContent(initialContent);
      
      // For custom template, set up the custom sections
      if (template.id === 'custom') {
        setCustomSections(['Learning Objectives', 'Activities', 'Assessment', 'Resources']);
      }
    }
  };
  
  // Handle lesson plan input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLessonPlanInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle section content change
  const handleSectionChange = (section: string, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [section]: content
    }));
  };
  
  // Toggle learning style selection
  const toggleLearningStyle = (styleId: string) => {
    setLessonPlanInput(prev => {
      const current = [...prev.selectedLearningStyles];
      if (current.includes(styleId)) {
        return {
          ...prev,
          selectedLearningStyles: current.filter(id => id !== styleId)
        };
      } else {
        return {
          ...prev,
          selectedLearningStyles: [...current, styleId]
        };
      }
    });
  };
  
  // Toggle special needs selection
  const toggleSpecialNeed = (needId: string) => {
    setLessonPlanInput(prev => {
      const current = [...prev.selectedSpecialNeeds];
      if (current.includes(needId)) {
        return {
          ...prev,
          selectedSpecialNeeds: current.filter(id => id !== needId)
        };
      } else {
        return {
          ...prev,
          selectedSpecialNeeds: [...current, needId]
        };
      }
    });
  };
  
  // Add custom section
  const addCustomSection = () => {
    if (newSection.trim() && !customSections.includes(newSection.trim())) {
      const updatedSections = [...customSections, newSection.trim()];
      setCustomSections(updatedSections);
      
      // Initialize content for the new section
      setSectionContent(prev => ({
        ...prev,
        [newSection.trim()]: ''
      }));
      
      setNewSection('');
    }
  };
  
  // Remove custom section
  const removeCustomSection = (section: string) => {
    const updatedSections = customSections.filter(s => s !== section);
    setCustomSections(updatedSections);
    
    // Remove content for this section
    setSectionContent(prev => {
      const updated = { ...prev };
      delete updated[section];
      return updated;
    });
  };
  
  // Get AI suggestion for a specific section
  const getAiSuggestion = async (section: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setShowingSuggestion(section);
    
    try {
      // Prepare context for AI
      const context = {
        title: lessonPlanInput.title,
        subject: lessonPlanInput.subject,
        yearGroup: lessonPlanInput.yearGroup,
        duration: lessonPlanInput.duration,
        objectives: lessonPlanInput.objectives,
        priorKnowledge: lessonPlanInput.priorKnowledge,
        keyVocabulary: lessonPlanInput.keyVocabulary,
        learningStyles: lessonPlanInput.selectedLearningStyles.map(id => 
          learningStyles.find(style => style.id === id)?.label
        ).filter(Boolean),
        specialNeeds: lessonPlanInput.selectedSpecialNeeds.map(id => 
          specialNeeds.find(need => need.id === id)?.label
        ).filter(Boolean)
      };
      
      const prompt = `
        You are an experienced UK educator creating a lesson plan. Please provide a detailed suggestion for the "${section}" section of a lesson plan with the following details:
        
        Title: ${context.title || 'Not specified'}
        Subject: ${context.subject || 'Not specified'}
        Year Group: ${context.yearGroup || 'Not specified'}
        Duration: ${context.duration} minutes
        Learning Objectives: ${context.objectives || 'Not specified'}
        Prior Knowledge: ${context.priorKnowledge || 'Not specified'}
        Key Vocabulary: ${context.keyVocabulary || 'Not specified'}
        Learning Styles to Address: ${context.learningStyles?.join(', ') || 'All learning styles'}
        Special Educational Needs: ${context.specialNeeds?.join(', ') || 'None specified'}
        
        Please provide a detailed, practical, and specific suggestion for the "${section}" section only.
        Your suggestion should be aligned with UK curriculum standards and educational best practices.
        Include specific activities, questions, or resources where appropriate.
        Ensure the content is appropriate for the specified year group and subject.
        
        Format your response as a ready-to-use section that the teacher can directly include in their lesson plan.
      `;
      
      const response = await aiService.getCompletion({
        prompt,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500
      });
      
      // Store the suggestion
      setAiSuggestions(prev => ({
        ...prev,
        [section]: response
      }));
      
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "Error getting suggestion",
        description: "There was a problem generating the suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Apply AI suggestion to section
  const applySuggestion = (section: string) => {
    if (aiSuggestions[section]) {
      handleSectionChange(section, aiSuggestions[section]);
      setShowingSuggestion('');
      
      toast({
        title: "Suggestion applied",
        description: `The suggestion for "${section}" has been applied to your lesson plan.`,
      });
    }
  };
  
  // Generate complete lesson plan
  const generateLessonPlan = async () => {
    if (!selectedTemplate) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare the content for AI processing
      let contentForAI = `
        Title: ${lessonPlanInput.title || 'Untitled Lesson Plan'}
        Subject: ${lessonPlanInput.subject}
        Year Group: ${lessonPlanInput.yearGroup}
        Duration: ${lessonPlanInput.duration} minutes
        Learning Styles: ${lessonPlanInput.selectedLearningStyles.map(id => 
          learningStyles.find(style => style.id === id)?.label
        ).join(', ') || 'All learning styles'}
        Special Educational Needs: ${lessonPlanInput.selectedSpecialNeeds.map(id => 
          specialNeeds.find(need => need.id === id)?.label
        ).join(', ') || 'None specified'}
        
        Additional Notes: ${lessonPlanInput.notes}
        
        Lesson Plan Structure:
      `;
      
      // Get the appropriate sections based on template
      const sections = selectedTemplate.id === 'custom' ? customSections : selectedTemplate.structure;
      
      sections.forEach(section => {
        const content = sectionContent[section] || '';
        contentForAI += `\n## ${section}\n${content}\n`;
      });
      
      const prompt = `
        You are an experienced UK educator creating a comprehensive lesson plan. Please format, enhance, and complete the following lesson plan draft.
        
        ${contentForAI}
        
        Please format this into a professional, comprehensive lesson plan following these guidelines:
        1. Maintain all the content provided but enhance clarity, organisation, and presentation
        2. Fill in any missing details or sections that would make the lesson plan more complete
        3. Ensure all activities and assessments align with the stated learning objectives
        4. Include appropriate differentiation strategies for the specified learning styles and special needs
        5. Use UK curriculum terminology and standards
        6. Format the lesson plan with clear headings, proper structure, and professional language
        7. Add timing suggestions for each activity if not already specified
        8. Ensure the lesson has a clear beginning, middle, and end structure
        
        The final lesson plan should be ready for classroom use with minimal additional preparation.
      `;
      
      const response = await aiService.getCompletion({
        prompt,
        model: 'gpt-4',
        temperature: 0.5,
        max_tokens: 2000
      });
      
      setGeneratedLessonPlan(response);
      setActiveTab('preview');
      
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      toast({
        title: "Error generating lesson plan",
        description: "There was a problem creating your lesson plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Save lesson plan
  const saveLessonPlan = () => {
    if (!generatedLessonPlan) return;
    
    const newLessonPlan = {
      id: Date.now().toString(),
      title: lessonPlanInput.title || 'Untitled Lesson Plan',
      subject: lessonPlanInput.subject,
      yearGroup: lessonPlanInput.yearGroup,
      template: selectedTemplate?.id || 'custom',
      content: generatedLessonPlan,
      date: new Date().toISOString()
    };
    
    const updatedLessonPlans = [...savedLessonPlans, newLessonPlan];
    setSavedLessonPlans(updatedLessonPlans);
    
    // Save to localStorage
    try {
      localStorage.setItem('smartLessonPlans', JSON.stringify(updatedLessonPlans));
      
      toast({
        title: "Lesson plan saved",
        description: "Your lesson plan has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      toast({
        title: "Error saving lesson plan",
        description: "There was a problem saving your lesson plan.",
        variant: "destructive"
      });
    }
  };
  
  // Copy lesson plan to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLessonPlan).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The lesson plan has been copied to your clipboard.",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying the lesson plan.",
          variant: "destructive"
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  // Download lesson plan as text file
  const downloadLessonPlan = () => {
    if (!generatedLessonPlan) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedLessonPlan], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    
    // Create filename from title or use default
    const filename = lessonPlanInput.title 
      ? `${lessonPlanInput.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      : 'lesson_plan.txt';
    
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `Your file "${filename}" is being downloaded.`,
    });
  };
  
  // Delete saved lesson plan
  const deleteLessonPlan = (id: string) => {
    const updatedLessonPlans = savedLessonPlans.filter(plan => plan.id !== id);
    setSavedLessonPlans(updatedLessonPlans);
    
    // Update localStorage
    try {
      localStorage.setItem('smartLessonPlans', JSON.stringify(updatedLessonPlans));
      
      toast({
        title: "Lesson plan deleted",
        description: "The lesson plan has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting lesson plan:', error);
    }
  };
  
  // View saved lesson plan
  const viewLessonPlan = (lessonPlan: any) => {
    setLessonPlanInput(prev => ({
      ...prev,
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      yearGroup: lessonPlan.yearGroup
    }));
    setGeneratedLessonPlan(lessonPlan.content);
    setActiveTab('preview');
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Smart Lesson Planning</h1>
      <p className="text-muted-foreground mb-6">
        Create comprehensive, differentiated lesson plans aligned with curriculum standards
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="create">Create Lesson Plan</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
          <TabsTrigger value="saved">Saved Lesson Plans</TabsTrigger>
        </TabsList>
        
        {/* Create Lesson Plan Tab */}
        <TabsContent value="create" className="space-y-6">
          {!selectedTemplate ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Select a Lesson Plan Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonPlanTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">Includes sections for:</p>
                      <ul className="text-sm list-disc list-inside">
                        {template.structure.slice(0, 3).map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                        {template.structure.length > 3 && (
                          <li>+ {template.structure.length - 3} more sections</li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Select</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTemplate(null)}
                >
                  Change Template
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Details</CardTitle>
                    <CardDescription>Basic information about your lesson</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Lesson Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={lessonPlanInput.title} 
                        onChange={handleInputChange} 
                        placeholder="Enter a title for your lesson"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Select 
                          value={lessonPlanInput.subject} 
                          onValueChange={(value) => setLessonPlanInput(prev => ({ ...prev, subject: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="yearGroup">Year Group</Label>
                        <Select 
                          value={lessonPlanInput.yearGroup} 
                          onValueChange={(value) => setLessonPlanInput(prev => ({ ...prev, yearGroup: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year group" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearGroups.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input 
                        id="duration" 
                        name="duration" 
                        type="number" 
                        value={lessonPlanInput.duration} 
                        onChange={handleInputChange} 
                        min="15"
                        max="180"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="objectives">Learning Objectives</Label>
                      <Textarea 
                        id="objectives" 
                        name="objectives" 
                        value={lessonPlanInput.objectives} 
                        onChange={handleInputChange} 
                        placeholder="What students will know or be able to do by the end of the lesson"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="priorKnowledge">Prior Knowledge</Label>
                      <Textarea 
                        id="priorKnowledge" 
                        name="priorKnowledge" 
                        value={lessonPlanInput.priorKnowledge} 
                        onChange={handleInputChange} 
                        placeholder="What students should already know before this lesson"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keyVocabulary">Key Vocabulary</Label>
                      <Textarea 
                        id="keyVocabulary" 
                        name="keyVocabulary" 
                        value={lessonPlanInput.keyVocabulary} 
                        onChange={handleInputChange} 
                        placeholder="Important terms and concepts for this lesson"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="resources">Resources Needed</Label>
                      <Textarea 
                        id="resources" 
                        name="resources" 
                        value={lessonPlanInput.resources} 
                        onChange={handleInputChange} 
                        placeholder="Materials, equipment, and resources required"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Differentiation</CardTitle>
                      <CardDescription>Customise your lesson for diverse learners</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="block mb-2">Learning Styles to Address</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {learningStyles.map(style => (
                            <div key={style.id} className="flex items-centre space-x-2">
                              <Checkbox 
                                id={`style-${style.id}`} 
                                checked={lessonPlanInput.selectedLearningStyles.includes(style.id)} 
                                onCheckedChange={() => toggleLearningStyle(style.id)}
                              />
                              <Label htmlFor={`style-${style.id}`} className="text-sm font-normal">
                                {style.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Special Educational Needs</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {specialNeeds.map(need => (
                            <div key={need.id} className="flex items-centre space-x-2">
                              <Checkbox 
                                id={`need-${need.id}`} 
                                checked={lessonPlanInput.selectedSpecialNeeds.includes(need.id)} 
                                onCheckedChange={() => toggleSpecialNeed(need.id)}
                              />
                              <Label htmlFor={`need-${need.id}`} className="text-sm font-normal">
                                {need.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea 
                          id="notes" 
                          name="notes" 
                          value={lessonPlanInput.notes} 
                          onChange={handleInputChange} 
                          placeholder="Any other information to consider for this lesson"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedTemplate.id === 'custom' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Sections</CardTitle>
                        <CardDescription>Add or remove sections for your custom lesson plan</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Input 
                            value={newSection} 
                            onChange={(e) => setNewSection(e.target.value)} 
                            placeholder="New section name"
                          />
                          <Button 
                            variant="outline" 
                            onClick={addCustomSection}
                            disabled={!newSection.trim()}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {customSections.map((section, index) => (
                            <div key={index} className="flex justify-between items-centre p-2 bg-muted rounded-md">
                              <span>{section}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeCustomSection(section)}
                                disabled={customSections.length <= 1}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Lesson Plan Content</h3>
                
                {/* Render sections based on template */}
                {(selectedTemplate.id === 'custom' ? customSections : selectedTemplate.structure).map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-centre">
                      <Label htmlFor={`section-${index}`}>{section}</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => getAiSuggestion(section)}
                        disabled={isProcessing}
                        className="flex items-centre gap-1"
                      >
                        {isProcessing && showingSuggestion === section ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span>Get AI Suggestion</span>
                      </Button>
                    </div>
                    
                    {showingSuggestion === section && aiSuggestions[section] && (
                      <Card className="bg-muted/50 border-dashed">
                        <CardHeader className="py-2 px-4">
                          <div className="flex justify-between items-centre">
                            <CardTitle className="text-sm font-medium flex items-centre">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              AI Suggestion
                            </CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowingSuggestion('')}
                            >
                              Close
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="text-sm">
                            {aiSuggestions[section].split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="py-2 px-4">
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(section)}
                          >
                            Apply Suggestion
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                    
                    <Textarea 
                      id={`section-${index}`} 
                      value={sectionContent[section] || ''} 
                      onChange={(e) => handleSectionChange(section, e.target.value)} 
                      placeholder={`Enter content for ${section}`}
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button 
                    onClick={generateLessonPlan} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating Lesson Plan...
                      </>
                    ) : (
                      'Generate Complete Lesson Plan'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Preview & Export Tab */}
        <TabsContent value="preview" className="space-y-6">
          {generatedLessonPlan ? (
            <div className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">
                  {lessonPlanInput.title || 'Untitled Lesson Plan'}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-centre gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadLessonPlan}
                    className="flex items-centre gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={saveLessonPlan}
                    className="flex items-centre gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {generatedLessonPlan.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('create')}
                >
                  Back to Editor
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-centre py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No lesson plan to preview</h3>
              <p className="mt-2 text-muted-foreground">
                Create a lesson plan first or select a saved plan to view.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveTab('create')}
              >
                Create Lesson Plan
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Saved Lesson Plans Tab */}
        <TabsContent value="saved" className="space-y-6">
          <h2 className="text-xl font-semibold">Saved Lesson Plans</h2>
          
          {savedLessonPlans.length > 0 ? (
            <div className="space-y-4">
              {savedLessonPlans.map(plan => (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>
                          {plan.subject} | {plan.yearGroup}
                        </CardDescription>
                      </div>
                      <Badge>
                        {lessonPlanTemplates.find(t => t.id === plan.template)?.name || 'Custom'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewLessonPlan(plan)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteLessonPlan(plan.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-centre py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No saved lesson plans</h3>
              <p className="mt-2 text-muted-foreground">
                Lesson plans you save will appear here.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveTab('create')}
              >
                Create Lesson Plan
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
