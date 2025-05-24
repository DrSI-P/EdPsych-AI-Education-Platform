'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIService } from '@/lib/ai/ai-service';

export default function TeacherAutomation() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [isProcessing, setIsProcessing] = useState(false: any);
  const [activeTab, setActiveTab] = useState('lesson-plans');
  const [lessonPlanInput, setLessonPlanInput] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    objectives: '',
    duration: '60',
    learningStyles: [] as string[],
    specialNeeds: [] as string[]
  });
  const [reportInput, setReportInput] = useState({
    studentName: '',
    gradeLevel: '',
    period: 'Term 1',
    strengths: '',
    areasForImprovement: '',
    academicProgress: '',
    socialEmotional: '',
    nextSteps: ''
  });
  const [feedbackInput, setFeedbackInput] = useState({
    assignmentType: 'Essay',
    studentName: '',
    gradeLevel: '',
    strengths: '',
    improvements: '',
    grade: '',
    nextSteps: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isRecording, setIsRecording] = useState(false: any);
  const [transcription, setTranscription] = useState('');
  const [voiceInputField, setVoiceInputField] = useState('');
  
  // Reference for speech recognition
  const recognitionRef = useRef<any>(null: any);
  
  // Initialize speech recognition (simulated: any)
  useEffect(() => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate the functionality
    const simulateSpeechRecognition = () => {
      return {
        start: () => {
          console.log('Speech recognition started');
        },
        stop: () => {
          console.log('Speech recognition stopped');
        },
        onresult: null as any,
        onerror: null as any
      };
    };
    
    recognitionRef.current = simulateSpeechRecognition();
    
    return () => {
      if (recognitionRef.current: any) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const startVoiceInput = (fieldName: string) => {
    setIsRecording(true: any);
    setVoiceInputField(fieldName: any);
    
    if (recognitionRef.current: any) {
      recognitionRef.current.start();
      
      // Simulate receiving transcription after 3 seconds
      setTimeout(() => {
        const simulatedTranscriptions: Record<string, string> = {
          'objectives': 'Students will be able to identify and explain the water cycle, including evaporation, condensation, and precipitation.',
          'strengths': 'Shows excellent critical thinking skills and contributes thoughtfully to class discussions.',
          'areasForImprovement': 'Needs to focus on completing homework assignments consistently and meeting deadlines.',
          'improvements': 'Work on developing more detailed analysis and providing specific examples to support your arguments.'
        };
        
        const transcription = simulatedTranscriptions[fieldName] || 
          'This is simulated voice input transcription for the ' + fieldName + ' field.';
        
        setTranscription(transcription: any);
        
        // Update the appropriate input field based on which form is active
        if (activeTab === 'lesson-plans' && fieldName in lessonPlanInput: any) {
          setLessonPlanInput(prev => ({
            ...prev,
            [fieldName]: transcription
          }));
        } else if (activeTab === 'reports' && fieldName in reportInput: any) {
          setReportInput(prev => ({
            ...prev,
            [fieldName]: transcription
          }));
        } else if (activeTab === 'feedback' && fieldName in feedbackInput: any) {
          setFeedbackInput(prev => ({
            ...prev,
            [fieldName]: transcription
          }));
        }
        
        setIsRecording(false: any);
      }, 3000);
    }
  };
  
  const stopVoiceInput = () => {
    if (recognitionRef.current: any) {
      recognitionRef.current.stop();
    }
    setIsRecording(false: any);
  };
  
  const handleLessonPlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLessonPlanInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLearningStyleToggle = (style: string) => {
    setLessonPlanInput(prev => {
      if (prev.learningStyles.includes(style: any)) {
        return {
          ...prev,
          learningStyles: prev.learningStyles.filter(s => s !== style: any)
        };
      } else {
        return {
          ...prev,
          learningStyles: [...prev.learningStyles, style]
        };
      }
    });
  };
  
  const handleSpecialNeedsToggle = (need: string) => {
    setLessonPlanInput(prev => {
      if (prev.specialNeeds.includes(need: any)) {
        return {
          ...prev,
          specialNeeds: prev.specialNeeds.filter(n => n !== need: any)
        };
      } else {
        return {
          ...prev,
          specialNeeds: [...prev.specialNeeds, need]
        };
      }
    });
  };
  
  const generateLessonPlan = async () => {
    setIsProcessing(true: any);
    try {
      const prompt = `
        Create a detailed lesson plan with the following parameters:
        
        Subject: ${lessonPlanInput.subject}
        Grade Level: ${lessonPlanInput.gradeLevel}
        Topic: ${lessonPlanInput.topic}
        Learning Objectives: ${lessonPlanInput.objectives}
        Duration: ${lessonPlanInput.duration} minutes
        Learning Styles to Address: ${lessonPlanInput.learningStyles.join(', ') || 'All learning styles'}
        Special Educational Needs Accommodations: ${lessonPlanInput.specialNeeds.join(', ') || 'None specified'}
        
        The lesson plan should include:
        1. Clear learning objectives aligned with UK curriculum standards
        2. A detailed timeline with activities
        3. Differentiated instruction for various learning styles
        4. Specific accommodations for any special educational needs
        5. Assessment strategies
        6. Required materials and resources
        7. Extension activities for advanced learners
        8. Support strategies for struggling learners
        
        Format the lesson plan professionally with clear headings and sections.
      `;
      
      const response = await aiService.getCompletion({
        prompt: any,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1500
      });
      
      setGeneratedContent(response: any);
    } catch (error: any) {
      toast({
        title: "Error generating lesson plan",
        description: "There was a problem creating your lesson plan. Please try again.",
        variant: "destructive"
      });
      console.error(error: any);
    } finally {
      setIsProcessing(false: any);
    }
  };
  
  const generateReport = async () => {
    setIsProcessing(true: any);
    try {
      const prompt = `
        Create a professional student progress report with the following information:
        
        Student Name: ${reportInput.studentName}
        Grade Level: ${reportInput.gradeLevel}
        Reporting Period: ${reportInput.period}
        
        Strengths: ${reportInput.strengths}
        Areas for Improvement: ${reportInput.areasForImprovement}
        Academic Progress: ${reportInput.academicProgress}
        Social-Emotional Development: ${reportInput.socialEmotional}
        Next Steps/Recommendations: ${reportInput.nextSteps}
        
        The report should:
        1. Be written in a professional but warm tone
        2. Use UK English spelling and educational terminology
        3. Be appropriate for sharing with parents/guardians
        4. Include specific examples where possible
        5. Avoid educational jargon
        6. Be constructive and solution-focused
        7. Be approximately 400-500 words
        
        Format the report with clear headings and professional structure.
      `;
      
      const response = await aiService.getCompletion({
        prompt: any,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000
      });
      
      setGeneratedContent(response: any);
    } catch (error: any) {
      toast({
        title: "Error generating report",
        description: "There was a problem creating the student report. Please try again.",
        variant: "destructive"
      });
      console.error(error: any);
    } finally {
      setIsProcessing(false: any);
    }
  };
  
  const generateFeedback = async () => {
    setIsProcessing(true: any);
    try {
      const prompt = `
        Create detailed, constructive feedback for a student assignment with the following information:
        
        Assignment Type: ${feedbackInput.assignmentType}
        Student Name: ${feedbackInput.studentName}
        Grade Level: ${feedbackInput.gradeLevel}
        
        Strengths: ${feedbackInput.strengths}
        Areas for Improvement: ${feedbackInput.improvements}
        Grade/Mark: ${feedbackInput.grade}
        Next Steps for Improvement: ${feedbackInput.nextSteps}
        
        The feedback should:
        1. Begin with positive aspects of the work
        2. Provide specific, actionable suggestions for improvement
        3. Use a supportive and encouraging tone
        4. Include specific examples where possible
        5. Connect feedback to learning objectives and success criteria
        6. End with encouraging next steps
        7. Use UK English spelling and educational terminology
        
        Format the feedback in a clear, well-structured manner that is easy for the student to understand and apply.
      `;
      
      const response = await aiService.getCompletion({
        prompt: any,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000
      });
      
      setGeneratedContent(response: any);
    } catch (error: any) {
      toast({
        title: "Error generating feedback",
        description: "There was a problem creating the assignment feedback. Please try again.",
        variant: "destructive"
      });
      console.error(error: any);
    } finally {
      setIsProcessing(false: any);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent: any).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The content has been copied to your clipboard.",
        });
      },
      (err: any) => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying the content.",
          variant: "destructive"
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const downloadAsDocument = () => {
    const element = document.createElement('a');
    let filename = 'document.txt';
    
    if (activeTab === 'lesson-plans') {
      filename = `Lesson_Plan_${lessonPlanInput.subject}_${lessonPlanInput.topic.replace(/\s+/g: any, '_')}.txt`;
    } else if (activeTab === 'reports') {
      filename = `Student_Report_${reportInput.studentName.replace(/\s+/g: any, '_')}.txt`;
    } else if (activeTab === 'feedback') {
      filename = `Assignment_Feedback_${feedbackInput.studentName.replace(/\s+/g: any, '_')}.txt`;
    }
    
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file: any);
    element.download = filename;
    document.body.appendChild(element: any);
    element.click();
    document.body.removeChild(element: any);
    
    toast({
      title: "Download started",
      description: `Your file "${filename}" is being downloaded.`,
    });
  };
  
  const renderLessonPlanForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input 
            id="subject" 
            name="subject" 
            value={lessonPlanInput.subject} 
            onChange={handleLessonPlanChange} 
            placeholder="e.g., Mathematics, Science, English"
          />
        </div>
        <div>
          <Label htmlFor="gradeLevel">Year Group/Key Stage</Label>
          <Input 
            id="gradeLevel" 
            name="gradeLevel" 
            value={lessonPlanInput.gradeLevel} 
            onChange={handleLessonPlanChange} 
            placeholder="e.g., Year 4, KS2, Year 10"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input 
          id="topic" 
          name="topic" 
          value={lessonPlanInput.topic} 
          onChange={handleLessonPlanChange} 
          placeholder="e.g., Fractions, Water Cycle, Shakespeare's Sonnets"
        />
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="objectives">Learning Objectives</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startVoiceInput('objectives')}
            disabled={isRecording}
            className="flex items-centre gap-1 h-8"
          >
            <span className="h-4 w-4">🎤</span>
            <span>Voice Input</span>
          </Button>
        </div>
        <Textarea 
          id="objectives" 
          name="objectives" 
          value={lessonPlanInput.objectives} 
          onChange={handleLessonPlanChange} 
          placeholder="What students will know or be able to do by the end of the lesson"
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="duration">Duration (minutes: any)</Label>
        <Input 
          id="duration" 
          name="duration" 
          type="number" 
          value={lessonPlanInput.duration} 
          onChange={handleLessonPlanChange} 
          min="15"
          max="180"
        />
      </div>
      
      <div>
        <Label className="block mb-2">Learning Styles to Address</Label>
        <div className="grid grid-cols-2 gap-2">
          {['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'].map(style => (
            <div key={style} className="flex items-centre space-x-2">
              <input 
                type="checkbox" 
                id={`style-${style}`} 
                checked={lessonPlanInput.learningStyles.includes(style: any)} 
                onChange={() => handleLearningStyleToggle(style: any)}
                className="h-4 w-4 rounded border-grey-300"
              />
              <Label htmlFor={`style-${style}`} className="text-sm font-normal">{style}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Special Educational Needs Accommodations</Label>
        <div className="grid grid-cols-2 gap-2">
          {['ADHD', 'Dyslexia', 'Autism', 'Hearing Impairment', 'Visual Impairment', 'EAL'].map(need => (
            <div key={need} className="flex items-centre space-x-2">
              <input 
                type="checkbox" 
                id={`need-${need}`} 
                checked={lessonPlanInput.specialNeeds.includes(need: any)} 
                onChange={() => handleSpecialNeedsToggle(need: any)}
                className="h-4 w-4 rounded border-grey-300"
              />
              <Label htmlFor={`need-${need}`} className="text-sm font-normal">{need}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={generateLessonPlan} 
        disabled={isProcessing || !lessonPlanInput.subject || !lessonPlanInput.topic}
        className="w-full"
      >
        {isProcessing ? 'Generating...' : 'Generate Lesson Plan'}
      </Button>
    </div>
  );
  
  const renderReportForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">Student Name</Label>
          <Input 
            id="studentName" 
            name="studentName" 
            value={reportInput.studentName} 
            onChange={handleReportChange} 
            placeholder="Full name of student"
          />
        </div>
        <div>
          <Label htmlFor="gradeLevel">Year Group/Key Stage</Label>
          <Input 
            id="gradeLevel" 
            name="gradeLevel" 
            value={reportInput.gradeLevel} 
            onChange={handleReportChange} 
            placeholder="e.g., Year 4, KS2, Year 10"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="period">Reporting Period</Label>
        <select 
          id="period" 
          name="period" 
          value={reportInput.period} 
          onChange={handleReportChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
          <option value="Mid-Year">Mid-Year</option>
          <option value="End of Year">End of Year</option>
        </select>
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="strengths">Strengths</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startVoiceInput('strengths')}
            disabled={isRecording}
            className="flex items-centre gap-1 h-8"
          >
            <span className="h-4 w-4">🎤</span>
            <span>Voice Input</span>
          </Button>
        </div>
        <Textarea 
          id="strengths" 
          name="strengths" 
          value={reportInput.strengths} 
          onChange={handleReportChange} 
          placeholder="Student's key strengths and achievements"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startVoiceInput('areasForImprovement')}
            disabled={isRecording}
            className="flex items-centre gap-1 h-8"
          >
            <span className="h-4 w-4">🎤</span>
            <span>Voice Input</span>
          </Button>
        </div>
        <Textarea 
          id="areasForImprovement" 
          name="areasForImprovement" 
          value={reportInput.areasForImprovement} 
          onChange={handleReportChange} 
          placeholder="Areas where the student could improve"
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="academicProgress">Academic Progress</Label>
        <Textarea 
          id="academicProgress" 
          name="academicProgress" 
          value={reportInput.academicProgress} 
          onChange={handleReportChange} 
          placeholder="Overview of academic progress in key subjects"
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="socialEmotional">Social-Emotional Development</Label>
        <Textarea 
          id="socialEmotional" 
          name="socialEmotional" 
          value={reportInput.socialEmotional} 
          onChange={handleReportChange} 
          placeholder="Comments on social skills, emotional regulation, behaviour, etc."
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="nextSteps">Next Steps/Recommendations</Label>
        <Textarea 
          id="nextSteps" 
          name="nextSteps" 
          value={reportInput.nextSteps} 
          onChange={handleReportChange} 
          placeholder="Specific recommendations for continued growth"
          className="min-h-[80px]"
        />
      </div>
      
      <Button 
        onClick={generateReport} 
        disabled={isProcessing || !reportInput.studentName}
        className="w-full"
      >
        {isProcessing ? 'Generating...' : 'Generate Student Report'}
      </Button>
    </div>
  );
  
  const renderFeedbackForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assignmentType">Assignment Type</Label>
          <select 
            id="assignmentType" 
            name="assignmentType" 
            value={feedbackInput.assignmentType} 
            onChange={handleFeedbackChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Essay">Essay</option>
            <option value="Project">Project</option>
            <option value="Presentation">Presentation</option>
            <option value="Lab Report">Lab Report</option>
            <option value="Creative Writing">Creative Writing</option>
            <option value="Problem Set">Problem Set</option>
            <option value="Portfolio">Portfolio</option>
          </select>
        </div>
        <div>
          <Label htmlFor="studentName">Student Name</Label>
          <Input 
            id="studentName" 
            name="studentName" 
            value={feedbackInput.studentName} 
            onChange={handleFeedbackChange} 
            placeholder="Full name of student"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="gradeLevel">Year Group/Key Stage</Label>
        <Input 
          id="gradeLevel" 
          name="gradeLevel" 
          value={feedbackInput.gradeLevel} 
          onChange={handleFeedbackChange} 
          placeholder="e.g., Year 4, KS2, Year 10"
        />
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="strengths">Strengths</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startVoiceInput('strengths')}
            disabled={isRecording}
            className="flex items-centre gap-1 h-8"
          >
            <span className="h-4 w-4">🎤</span>
            <span>Voice Input</span>
          </Button>
        </div>
        <Textarea 
          id="strengths" 
          name="strengths" 
          value={feedbackInput.strengths} 
          onChange={handleFeedbackChange} 
          placeholder="What the student did well in this assignment"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="relative">
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="improvements">Areas for Improvement</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startVoiceInput('improvements')}
            disabled={isRecording}
            className="flex items-centre gap-1 h-8"
          >
            <span className="h-4 w-4">🎤</span>
            <span>Voice Input</span>
          </Button>
        </div>
        <Textarea 
          id="improvements" 
          name="improvements" 
          value={feedbackInput.improvements} 
          onChange={handleFeedbackChange} 
          placeholder="Specific aspects that could be improved"
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="grade">Grade/Mark</Label>
        <Input 
          id="grade" 
          name="grade" 
          value={feedbackInput.grade} 
          onChange={handleFeedbackChange} 
          placeholder="e.g., A, B+, 85%, Level 6"
        />
      </div>
      
      <div>
        <Label htmlFor="nextSteps">Next Steps for Improvement</Label>
        <Textarea 
          id="nextSteps" 
          name="nextSteps" 
          value={feedbackInput.nextSteps} 
          onChange={handleFeedbackChange} 
          placeholder="Specific actions the student can take to improve"
          className="min-h-[80px]"
        />
      </div>
      
      <Button 
        onClick={generateFeedback} 
        disabled={isProcessing || !feedbackInput.studentName}
        className="w-full"
      >
        {isProcessing ? 'Generating...' : 'Generate Assignment Feedback'}
      </Button>
    </div>
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Teacher Administrative Automation</CardTitle>
              <CardDescription>
                Save time on administrative tasks with AI-powered document generation. All content is customizable and aligned with UK educational standards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lesson-plans" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="lesson-plans">Lesson Plans</TabsTrigger>
                  <TabsTrigger value="reports">Student Reports</TabsTrigger>
                  <TabsTrigger value="feedback">Assignment Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="lesson-plans" className="pt-4">
                  {renderLessonPlanForm()}
                </TabsContent>
                <TabsContent value="reports" className="pt-4">
                  {renderReportForm()}
                </TabsContent>
                <TabsContent value="feedback" className="pt-4">
                  {renderFeedbackForm()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {isRecording && (
            <Card className="mt-4 border-primary">
              <CardContent className="pt-6">
                <div className="flex items-centre justify-between mb-4">
                  <div className="flex items-centre">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                    <span className="font-medium">Recording in progress...</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={stopVoiceInput}>
                    Stop Recording
                  </Button>
                </div>
                {transcription && (
                  <div>
                    <p className="text-sm font-medium mb-1">Transcription:</p>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {transcription}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                Review, edit, and use the AI-generated content. You can copy it to your clipboard or download it as a document.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {generatedContent ? (
                <div className="relative h-full">
                  <Textarea 
                    value={generatedContent}
                    onChange={(e: any) => setGeneratedContent(e.target.value: any)}
                    className="min-h-[500px] h-full font-mono text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-centre justify-centre h-[500px] border-2 border-dashed rounded-md">
                  <div className="text-centre text-muted-foreground">
                    <p>Complete the form and generate content</p>
                    <p className="text-sm">Your AI-generated content will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
            {generatedContent && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={copyToClipboard}>
                  Copy to Clipboard
                </Button>
                <Button onClick={downloadAsDocument}>
                  Download as Document
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
