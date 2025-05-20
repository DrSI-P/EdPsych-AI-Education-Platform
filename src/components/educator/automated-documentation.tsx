'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAIService } from '@/lib/ai/ai-service';
import { Mic, MicOff, Save, Copy, Download, FileText, Upload, RefreshCw } from 'lucide-react';

interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    name: string;
    description: string;
    placeholder: string;
  }[];
}

const documentationTemplates: DocumentationTemplate[] = [
  {
    id: 'classroom-observation',
    name: 'Classroom Observation',
    description: 'Document student behaviors, interactions, and learning moments during class',
    sections: [
      {
        id: 'context',
        name: 'Context',
        description: 'Class details, time, subject, and activity',
        placeholder: 'Year 4 Mathematics, Tuesday 10:30-11:30, Fractions lesson with group activities'
      },
      {
        id: 'observations',
        name: 'Observations',
        description: 'Detailed notes about what happened during the session',
        placeholder: 'Record specific behaviors, interactions, questions asked, etc.'
      },
      {
        id: 'student-engagement',
        name: 'Student Engagement',
        description: 'Notes on student participation and engagement levels',
        placeholder: 'Which students were engaged? Who needed support? Any notable interactions?'
      },
      {
        id: 'learning-evidence',
        name: 'Learning Evidence',
        description: 'Evidence of student understanding or misconceptions',
        placeholder: 'Examples of student work, verbal responses, or demonstrations of understanding'
      },
      {
        id: 'next-steps',
        name: 'Next Steps',
        description: 'Follow-up actions based on the observations',
        placeholder: 'Interventions needed, adjustments to teaching, students requiring additional support'
      }
    ]
  },
  {
    id: 'student-conference',
    name: 'Student Conference',
    description: 'Document one-on-one meetings with students about their progress',
    sections: [
      {
        id: 'student-info',
        name: 'Student Information',
        description: 'Student name, year group, date and purpose of meeting',
        placeholder: 'Emma Thompson, Year 8, 15 May 2025, Discussing recent English assessment'
      },
      {
        id: 'discussion-points',
        name: 'Discussion Points',
        description: 'Main topics discussed during the conference',
        placeholder: 'Current progress, recent assessment results, goals, challenges'
      },
      {
        id: 'student-perspective',
        name: 'Student Perspective',
        description: 'Student\'s thoughts, feelings, and self-assessment',
        placeholder: 'How does the student feel about their progress? What challenges do they identify?'
      },
      {
        id: 'agreed-goals',
        name: 'Agreed Goals',
        description: 'Goals and targets set during the conference',
        placeholder: 'Specific, measurable goals agreed upon with timeframes'
      },
      {
        id: 'support-strategies',
        name: 'Support Strategies',
        description: 'Strategies to help the student achieve their goals',
        placeholder: 'Resources, interventions, accommodations, or support to be provided'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Plan',
        description: 'When and how progress will be reviewed',
        placeholder: 'Date for follow-up meeting, check-in points, assessment plans'
      }
    ]
  },
  {
    id: 'behavior-incident',
    name: 'Behavior Incident',
    description: 'Document behavioral incidents for record-keeping and pattern identification',
    sections: [
      {
        id: 'incident-details',
        name: 'Incident Details',
        description: 'Date, time, location, and students involved',
        placeholder: '15 May 2025, 10:15am, Playground, Students: [names]'
      },
      {
        id: 'description',
        name: 'Description',
        description: 'Factual description of what happened',
        placeholder: 'Detailed account of the incident without judgment or interpretation'
      },
      {
        id: 'antecedent',
        name: 'Antecedent',
        description: 'What happened before the incident',
        placeholder: 'Events, triggers, or circumstances leading up to the incident'
      },
      {
        id: 'response',
        name: 'Response',
        description: 'How the situation was handled',
        placeholder: 'Actions taken, interventions, restorative practices used'
      },
      {
        id: 'outcome',
        name: 'Outcome',
        description: 'Resolution and immediate consequences',
        placeholder: 'How the situation was resolved, any consequences applied'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Actions',
        description: 'Next steps and preventative measures',
        placeholder: 'Support plans, parent contact, monitoring arrangements'
      }
    ]
  },
  {
    id: 'parent-meeting',
    name: 'Parent/Guardian Meeting',
    description: 'Document discussions with parents or guardians',
    sections: [
      {
        id: 'meeting-details',
        name: 'Meeting Details',
        description: 'Date, time, attendees, and purpose',
        placeholder: '15 May 2025, 16:00-16:30, Mr. & Mrs. Thompson (Emma\'s parents), Class teacher'
      },
      {
        id: 'discussion-points',
        name: 'Discussion Points',
        description: 'Main topics discussed during the meeting',
        placeholder: 'Academic progress, behavior, social development, concerns raised'
      },
      {
        id: 'parent-perspective',
        name: 'Parent/Guardian Perspective',
        description: 'Views, concerns, and information shared by parents',
        placeholder: 'Concerns, observations from home, relevant family circumstances'
      },
      {
        id: 'school-perspective',
        name: 'School Perspective',
        description: 'Information and perspectives shared by school staff',
        placeholder: 'Academic data, classroom observations, social interactions'
      },
      {
        id: 'agreed-actions',
        name: 'Agreed Actions',
        description: 'Actions agreed by all parties',
        placeholder: 'Support strategies, interventions, home-school coordination'
      },
      {
        id: 'follow-up',
        name: 'Follow-up Plan',
        description: 'How and when progress will be communicated',
        placeholder: 'Next meeting date, communication method, review timeline'
      }
    ]
  },
  {
    id: 'lesson-reflection',
    name: 'Lesson Reflection',
    description: 'Reflect on lesson effectiveness and student learning',
    sections: [
      {
        id: 'lesson-details',
        name: 'Lesson Details',
        description: 'Class, subject, topic, and objectives',
        placeholder: 'Year 7 Science, States of Matter, Understanding particle arrangement in solids, liquids, and gases'
      },
      {
        id: 'what-went-well',
        name: 'What Went Well',
        description: 'Successful aspects of the lesson',
        placeholder: 'Activities that engaged students, effective explanations, learning achievements'
      },
      {
        id: 'challenges',
        name: 'Challenges',
        description: 'Difficulties or unexpected issues',
        placeholder: 'Misconceptions, timing issues, resource problems, behavior management'
      },
      {
        id: 'student-learning',
        name: 'Student Learning',
        description: 'Evidence of student understanding or confusion',
        placeholder: 'Assessment results, work samples, verbal responses, observations'
      },
      {
        id: 'differentiation-effectiveness',
        name: 'Differentiation Effectiveness',
        description: 'How well differentiation strategies worked',
        placeholder: 'Effectiveness of support for different learners, extension activities'
      },
      {
        id: 'adjustments',
        name: 'Future Adjustments',
        description: 'Changes for next time',
        placeholder: 'Modifications to activities, pacing, resources, or approaches'
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Documentation',
    description: 'Create your own documentation structure',
    sections: [
      {
        id: 'title',
        name: 'Title',
        description: 'Title of your documentation',
        placeholder: 'Enter a descriptive title'
      },
      {
        id: 'content',
        name: 'Content',
        description: 'Main content of your documentation',
        placeholder: 'Enter your documentation content here'
      }
    ]
  }
];

export default function AutomatedDocumentation() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentationTemplate | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSection, setRecordingSection] = useState('');
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Reference for MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize saved documents from localStorage
  useEffect(() => {
    const loadSavedDocuments = () => {
      try {
        const saved = localStorage.getItem('automatedDocuments');
        if (saved) {
          setSavedDocuments(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved documents:', error);
      }
    };
    
    loadSavedDocuments();
  }, []);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = documentationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize section content with empty strings
      const initialContent: Record<string, string> = {};
      template.sections.forEach(section => {
        initialContent[section.id] = '';
      });
      setSectionContent(initialContent);
      setDocumentTitle(template.name);
    }
  };
  
  // Handle section content change
  const handleSectionChange = (sectionId: string, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };
  
  // Start voice recording for a section
  const startRecording = async (sectionId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // In a real implementation, this would send the audio to a speech-to-text service
        // For now, we'll simulate a transcription after a delay
        setIsProcessing(true);
        setTimeout(() => {
          // Simulate transcription based on section
          const simulatedTranscriptions: Record<string, string> = {
            'context': 'Year 4 Mathematics class on Tuesday from 10:30 to 11:30. The lesson focused on fractions with students working in small groups to solve fraction problems using manipulatives.',
            'observations': 'Students were engaged in the group activities. Most groups collaborated well, with students taking turns to explain their thinking. There was some confusion in Group 3 about equivalent fractions, which required additional support.',
            'student-engagement': 'Overall engagement was high. Emma and James were particularly active in discussions. Michael was initially reluctant to participate but became more involved after receiving one-on-one support. Three students in the back (Sam, Olivia, and Noah) were occasionally off-task.',
            'learning-evidence': 'Most students demonstrated understanding of basic fraction concepts. Group 1 successfully completed all extension tasks. Group 3 struggled with equivalent fractions but improved after targeted support. Work samples collected show varying levels of mastery.',
            'next-steps': 'Plan additional activities on equivalent fractions for next lesson. Provide extra support for Group 3. Create extension activities for Group 1. Rearrange seating to better support off-task students.',
            'student-info': 'Emma Thompson, Year 8, meeting held on 15 May 2025 to discuss recent English assessment results and set goals for the upcoming term.',
            'discussion-points': 'We discussed Emma\'s recent English assessment where she scored 78%. We reviewed her strengths in creative writing and areas for improvement in analytical responses. Emma expressed interest in developing her essay writing skills.',
            'student-perspective': 'Emma feels confident about her creative writing but acknowledges she struggles with analyzing texts in depth. She mentioned feeling rushed during timed assessments and would like strategies to manage her time better.',
            'agreed-goals': '1. Improve analytical writing skills by practicing one analytical paragraph per week. 2. Develop time management strategies for assessments. 3. Read at least one book from the recommended literature list by the end of term.',
            'support-strategies': 'Provide Emma with analytical writing frameworks. Schedule a 10-minute check-in every two weeks. Share time management techniques for exams. Recommend specific books based on her interests.',
            'follow-up': 'Schedule follow-up meeting for June 12th to review progress. Weekly quick checks on analytical writing samples. Email parents with update on goals and support strategies.',
          };
          
          const transcription = simulatedTranscriptions[sectionId] || 
            `This is a simulated transcription for the ${sectionId} section. In a real implementation, this would be the text converted from your audio recording.`;
          
          setTranscription(transcription);
          handleSectionChange(sectionId, transcription);
          setIsProcessing(false);
        }, 2000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSection(sectionId);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      // Clear timer
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
        setRecordingTime(0);
      }
    }
  };
  
  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Generate document from template and content
  const generateDocument = async () => {
    if (!selectedTemplate) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare the content for AI processing
      let contentForAI = `Title: ${documentTitle}\n\n`;
      
      selectedTemplate.sections.forEach(section => {
        const content = sectionContent[section.id] || '';
        if (content.trim()) {
          contentForAI += `## ${section.name}\n${content}\n\n`;
        }
      });
      
      const prompt = `
        You are an educational documentation assistant helping a teacher organize their notes into a professional document.
        
        Please format and enhance the following teacher notes into a well-structured, professional document.
        Maintain all the factual information but improve clarity, organization, and presentation.
        Use appropriate educational terminology and UK English spelling.
        
        Here are the teacher's notes:
        
        ${contentForAI}
        
        Format the document with clear headings, proper paragraphing, and professional language.
        Do not add any new factual information that wasn't in the original notes.
        Focus on improving structure, clarity, and professional presentation only.
      `;
      
      const result = await aiService.generateText(prompt, {
        model: 'gpt-4',
        temperature: 0.5,
        max_tokens: 1500
      });
      
      const response = result.text;
      
      setGeneratedDocument(response);
      setActiveTab('preview');
      
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Error generating document",
        description: "There was a problem creating your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Save document
  const saveDocument = () => {
    if (!generatedDocument || !documentTitle) return;
    
    const newDocument = {
      id: Date.now().toString(),
      title: documentTitle,
      content: generatedDocument,
      template: selectedTemplate?.id || 'custom',
      date: new Date().toISOString()
    };
    
    const updatedDocuments = [...savedDocuments, newDocument];
    setSavedDocuments(updatedDocuments);
    
    // Save to localStorage
    try {
      localStorage.setItem('automatedDocuments', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document.",
        variant: "destructive"
      });
    }
  };
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The document has been copied to your clipboard.",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying the document.",
          variant: "destructive"
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  // Download document as text file
  const downloadDocument = () => {
    if (!generatedDocument) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedDocument], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    
    // Create filename from title or use default
    const filename = documentTitle 
      ? `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      : 'document.txt';
    
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `Your file "${filename}" is being downloaded.`,
    });
  };
  
  // Delete saved document
  const deleteDocument = (id: string) => {
    const updatedDocuments = savedDocuments.filter(doc => doc.id !== id);
    setSavedDocuments(updatedDocuments);
    
    // Update localStorage
    try {
      localStorage.setItem('automatedDocuments', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  // View saved document
  const viewDocument = (document: any) => {
    setDocumentTitle(document.title);
    setGeneratedDocument(document.content);
    setActiveTab('preview');
  };
  
  // Upload audio for transcription
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, this would send the audio file to a speech-to-text service
    // For now, we'll simulate a transcription after a delay
    setIsProcessing(true);
    
    setTimeout(() => {
      // Simulate transcription
      const transcription = `This is a simulated transcription from the uploaded audio file for the ${sectionId} section. In a real implementation, this would be the text converted from your audio file "${file.name}".`;
      
      handleSectionChange(sectionId, transcription);
      setIsProcessing(false);
      
      toast({
        title: "Audio processed",
        description: `Audio file "${file.name}" has been transcribed.`,
      });
    }, 2000);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Automated Documentation</h1>
      <p className="text-muted-foreground mb-6">
        Convert classroom activities, observations, and discussions into structured documentation
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="create">Create Document</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
          <TabsTrigger value="saved">Saved Documents</TabsTrigger>
        </TabsList>
        
        {/* Create Document Tab */}
        <TabsContent value="create" className="space-y-6">
          {!selectedTemplate ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Select a Documentation Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentationTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Select</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTemplate(null)}
                >
                  Change Template
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-title">Document Title</Label>
                  <Input 
                    id="document-title" 
                    value={documentTitle} 
                    onChange={(e) => setDocumentTitle(e.target.value)} 
                    placeholder="Enter a title for your document"
                  />
                </div>
                
                {selectedTemplate.sections.map(section => (
                  <div key={section.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={section.id}>{section.name}</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id={`audio-upload-${section.id}`}
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => handleAudioUpload(e, section.id)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById(`audio-upload-${section.id}`)?.click()}
                          disabled={isRecording || isProcessing}
                          className="flex items-center gap-1 h-8"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Audio</span>
                        </Button>
                        
                        {isRecording && recordingSection === section.id ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={stopRecording}
                            className="flex items-center gap-1 h-8"
                          >
                            <MicOff className="h-4 w-4" />
                            <span>{formatRecordingTime(recordingTime)}</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startRecording(section.id)}
                            disabled={isRecording || isProcessing}
                            className="flex items-center gap-1 h-8"
                          >
                            <Mic className="h-4 w-4" />
                            <span>Record</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                    <Textarea 
                      id={section.id} 
                      value={sectionContent[section.id] || ''} 
                      onChange={(e) => handleSectionChange(section.id, e.target.value)} 
                      placeholder={section.placeholder}
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button 
                    onClick={generateDocument} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Generate Document'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Preview & Export Tab */}
        <TabsContent value="preview" className="space-y-6">
          {generatedDocument ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{documentTitle}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadDocument}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={saveDocument}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              
              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {generatedDocument.split('\n').map((line, index) => (
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
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No document to preview</h3>
              <p className="mt-2 text-muted-foreground">
                Create a document first or select a saved document to view.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveTab('create')}
              >
                Create Document
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Saved Documents Tab */}
        <TabsContent value="saved" className="space-y-6">
          <h2 className="text-xl font-semibold">Saved Documents</h2>
          
          {savedDocuments.length > 0 ? (
            <div className="space-y-4">
              {savedDocuments.map(doc => (
                <Card key={doc.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>
                          {new Date(doc.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </CardDescription>
                      </div>
                      <Badge>
                        {documentationTemplates.find(t => t.id === doc.template)?.name || 'Custom'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewDocument(doc)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No saved documents</h3>
              <p className="mt-2 text-muted-foreground">
                Documents you save will appear here.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveTab('create')}
              >
                Create Document
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

