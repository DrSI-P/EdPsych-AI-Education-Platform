'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
// Import VolumeUp from our custom icons to fix build errors
import { Mic, MicOff, Send, Globe, Volume2, MessageSquare, Copy, Download, RefreshCw, Check, X, FileText, BookOpen } from 'lucide-react';
import { VolumeUp } from '@/components/icons/volume-up';

// Mock data for language options
const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polish' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'so', name: 'Somali' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ru', name: 'Russian' },
];

// Mock data for subjects
const subjects = [
  'English', 'Mathematics', 'Science', 'History', 'Geography', 'Art and Design',
  'Computing', 'Design and Technology', 'Languages', 'Music', 'Physical Education',
  'Religious Education', 'PSHE', 'Citizenship', 'Other'
];

// Interface for transcription entry
interface TranscriptionEntry {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText?: string;
  targetLanguage?: string;
  context?: string;
  subject?: string;
  createdAt: string;
}

// Interface for vocabulary item
interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  translations: {
    language: string;
    translation: string;
  }[];
  subject: string;
  createdAt: string;
}

export default function TranscriptionTranslationSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('translate');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const liveTranscriptionRef = useRef<NodeJS.Timeout | null>(null);
  
  // Transcription form state
  const [transcriptionForm, setTranscriptionForm] = useState({
    originalText: '',
    originalLanguage: 'en',
    targetLanguage: 'en',
    context: '',
    subject: ''
  });
  
  // Vocabulary form state
  const [vocabularyForm, setVocabularyForm] = useState({
    term: '',
    definition: '',
    subject: '',
    translations: [{ language: 'es', translation: '' }]
  });
  
  // Load mock data on component mount
  useEffect(() => {
    // Mock transcription history
    const mockTranscriptionHistory: TranscriptionEntry[] = [
      {
        id: '1',
        originalText: 'Today we will learn about photosynthesis and how plants convert sunlight into energy.',
        originalLanguage: 'en',
        translatedText: 'Dziś dowiemy się o fotosyntezie i o tym, jak rośliny przekształcają światło słoneczne w energię.',
        targetLanguage: 'pl',
        context: 'Science lesson',
        subject: 'Science',
        createdAt: '2025-05-15T09:30:00Z'
      },
      {
        id: '2',
        originalText: 'Please complete exercises 1-5 on page 42 of your workbook for homework.',
        originalLanguage: 'en',
        translatedText: 'Lütfen ev ödevi için çalışma kitabınızın 42. sayfasındaki 1-5 alıştırmaları tamamlayın.',
        targetLanguage: 'tr',
        context: 'Mathematics homework',
        subject: 'Mathematics',
        createdAt: '2025-05-14T15:20:00Z'
      },
      {
        id: '3',
        originalText: 'Tomorrow we will have a school trip to the museum. Please bring a packed lunch and wear comfortable shoes.',
        originalLanguage: 'en',
        translatedText: 'غدًا سنقوم برحلة مدرسية إلى المتحف. يرجى إحضار غداء معبأ وارتداء أحذية مريحة.',
        targetLanguage: 'ar',
        context: 'School announcement',
        subject: 'Other',
        createdAt: '2025-05-13T14:10:00Z'
      }
    ];
    
    // Mock vocabulary list
    const mockVocabularyList: VocabularyItem[] = [
      {
        id: '1',
        term: 'Photosynthesis',
        definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.',
        translations: [
          { language: 'pl', translation: 'Fotosynteza' },
          { language: 'es', translation: 'Fotosíntesis' },
          { language: 'ar', translation: 'التمثيل الضوئي' }
        ],
        subject: 'Science',
        createdAt: '2025-05-15T10:00:00Z'
      },
      {
        id: '2',
        term: 'Equation',
        definition: 'A statement that the values of two mathematical expressions are equal.',
        translations: [
          { language: 'pl', translation: 'Równanie' },
          { language: 'es', translation: 'Ecuación' },
          { language: 'tr', translation: 'Denklem' }
        ],
        subject: 'Mathematics',
        createdAt: '2025-05-14T11:30:00Z'
      },
      {
        id: '3',
        term: 'Adjective',
        definition: 'A word naming an attribute of a noun, such as sweet, red, or technical.',
        translations: [
          { language: 'fr', translation: 'Adjectif' },
          { language: 'es', translation: 'Adjetivo' },
          { language: 'de', translation: 'Adjektiv' }
        ],
        subject: 'English',
        createdAt: '2025-05-13T09:15:00Z'
      }
    ];
    
    setTranscriptionHistory(mockTranscriptionHistory);
    setVocabularyList(mockVocabularyList);
  }, []);
  
  // Handle starting voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        transcribeAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Handle stopping voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording stopped",
        description: "Processing your audio...",
      });
    }
  };
  
  // Simulate transcribing audio
  const transcribeAudio = (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    // In a real application, this would send the audio to a transcription service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock transcription result
      const mockTranscriptions = [
        "Today we will be learning about the water cycle and how it affects our environment.",
        "Please turn to page 42 in your textbooks and complete exercises 3 through 7.",
        "For homework, I would like you to write a short essay about your favorite scientific discovery.",
        "Let's review what we learned yesterday about the structure of plant cells.",
        "Can anyone tell me what photosynthesis means and why it's important?"
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      setTranscribedText(randomTranscription);
      setTranscriptionForm(prev => ({
        ...prev,
        originalText: randomTranscription
      }));
      
      setIsTranscribing(false);
      
      toast({
        title: "Transcription complete",
        description: "Your speech has been converted to text.",
      });
    }, 2000);
  };
  
  // Simulate translating text
  const translateText = (text: string, sourceLanguage: string, targetLanguage: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    
    // In a real application, this would send the text to a translation service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock translation based on target language
      let mockTranslation = '';
      
      if (targetLanguage === 'es') {
        mockTranslation = "Esta es una traducción simulada al español. En una aplicación real, utilizaríamos un servicio de traducción profesional.";
      } else if (targetLanguage === 'fr') {
        mockTranslation = "Ceci est une traduction simulée en français. Dans une application réelle, nous utiliserions un service de traduction professionnel.";
      } else if (targetLanguage === 'pl') {
        mockTranslation = "To jest symulowane tłumaczenie na język polski. W rzeczywistej aplikacji użylibyśmy profesjonalnego serwisu tłumaczeniowego.";
      } else if (targetLanguage === 'ar') {
        mockTranslation = "هذه ترجمة محاكاة باللغة العربية. في تطبيق حقيقي، سنستخدم خدمة ترجمة احترافية.";
      } else {
        mockTranslation = "This is a simulated translation. In a real application, we would use a professional translation service.";
      }
      
      // Create a new transcription entry
      const newTranscription: TranscriptionEntry = {
        id: Date.now().toString(),
        originalText: text,
        originalLanguage: sourceLanguage,
        translatedText: mockTranslation,
        targetLanguage: targetLanguage,
        context: transcriptionForm.context || undefined,
        subject: transcriptionForm.subject || undefined,
        createdAt: new Date().toISOString()
      };
      
      // Add to transcription history
      setTranscriptionHistory(prev => [newTranscription, ...prev]);
      
      setIsTranslating(false);
      
      toast({
        title: "Translation complete",
        description: `Text has been translated to ${languageOptions.find(l => l.code === targetLanguage)?.name || targetLanguage}.`,
      });
      
      // Reset form
      setTranscriptionForm({
        originalText: '',
        originalLanguage: 'en',
        targetLanguage: 'en',
        context: '',
        subject: ''
      });
      
      setTranscribedText('');
    }, 1500);
  };
  
  // Handle transcription form change
  const handleTranscriptionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTranscriptionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle vocabulary form change
  const handleVocabularyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVocabularyForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle translation change in vocabulary form
  const handleTranslationChange = (index: number, field: 'language' | 'translation', value: string) => {
    setVocabularyForm(prev => {
      const newTranslations = [...prev.translations];
      newTranslations[index] = {
        ...newTranslations[index],
        [field]: value
      };
      return { ...prev, translations: newTranslations };
    });
  };
  
  // Add translation field to vocabulary form
  const addTranslation = () => {
    setVocabularyForm(prev => ({
      ...prev,
      translations: [...prev.translations, { language: 'en', translation: '' }]
    }));
  };
  
  // Remove translation field from vocabulary form
  const removeTranslation = (index: number) => {
    setVocabularyForm(prev => {
      const newTranslations = [...prev.translations];
      newTranslations.splice(index, 1);
      return { 
        ...prev, 
        translations: newTranslations.length ? newTranslations : [{ language: 'en', translation: '' }]
      };
    });
  };
  
  // Handle vocabulary submission
  const handleSubmitVocabulary = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!vocabularyForm.term.trim()) {
      toast({
        title: "Term required",
        description: "Please enter a vocabulary term.",
        variant: "destructive"
      });
      return;
    }
    
    if (!vocabularyForm.definition.trim()) {
      toast({
        title: "Definition required",
        description: "Please enter a definition for the term.",
        variant: "destructive"
      });
      return;
    }
    
    if (!vocabularyForm.subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject for the vocabulary term.",
        variant: "destructive"
      });
      return;
    }
    
    const hasEmptyTranslations = vocabularyForm.translations.some(t => !t.translation.trim());
    if (hasEmptyTranslations) {
      toast({
        title: "Translation required",
        description: "Please provide all translations or remove empty fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the vocabulary to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new vocabulary item
      const newVocabulary: VocabularyItem = {
        id: Date.now().toString(),
        term: vocabularyForm.term,
        definition: vocabularyForm.definition,
        translations: vocabularyForm.translations,
        subject: vocabularyForm.subject,
        createdAt: new Date().toISOString()
      };
      
      // Add to vocabulary list
      setVocabularyList(prev => [newVocabulary, ...prev]);
      
      // Reset form
      setVocabularyForm({
        term: '',
        definition: '',
        subject: '',
        translations: [{ language: 'es', translation: '' }]
      });
      
      setIsLoading(false);
      
      toast({
        title: "Vocabulary added",
        description: "The vocabulary term has been added to the list.",
      });
    }, 1000);
  };
  
  // Handle transcription request
  const handleRequestTranscription = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!transcriptionForm.originalText.trim()) {
      toast({
        title: "Text required",
        description: "Please enter the text to translate.",
        variant: "destructive"
      });
      return;
    }
    
    if (transcriptionForm.originalLanguage === transcriptionForm.targetLanguage) {
      toast({
        title: "Different languages required",
        description: "Source and target languages must be different.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Translate the text
    translateText(
      transcriptionForm.originalText,
      transcriptionForm.originalLanguage,
      transcriptionForm.targetLanguage
    );
  };
  
  // Start live transcription
  const startLiveTranscription = () => {
    setIsLiveTranscribing(true);
    setLiveTranscription('');
    
    // In a real application, this would connect to a live transcription service
    // For now, we'll simulate with periodic updates
    const mockPhrases = [
      "Today we're going to learn about the water cycle.",
      "Water can exist in three states: liquid, solid, and gas.",
      "When water heats up, it evaporates and becomes water vapor.",
      "This water vapor rises into the atmosphere and forms clouds.",
      "When the water vapor cools, it condenses and forms droplets.",
      "These droplets fall back to Earth as precipitation.",
      "This continuous movement of water is called the water cycle.",
      "The water cycle is essential for all life on Earth.",
      "Can anyone tell me why the water cycle is important?",
      "Very good! The water cycle provides fresh water for plants and animals."
    ];
    
    let phraseIndex = 0;
    
    // Simulate live transcription with periodic updates
    liveTranscriptionRef.current = setInterval(() => {
      if (phraseIndex < mockPhrases.length) {
        setLiveTranscription(prev => prev + (prev ? ' ' : '') + mockPhrases[phraseIndex]);
        phraseIndex++;
      } else {
        // End transcription when all phrases are used
        stopLiveTranscription();
      }
    }, 3000);
    
    toast({
      title: "Live transcription started",
      description: "Transcribing classroom speech in real-time.",
    });
  };
  
  // Stop live transcription
  const stopLiveTranscription = () => {
    if (liveTranscriptionRef.current) {
      clearInterval(liveTranscriptionRef.current);
      liveTranscriptionRef.current = null;
    }
    
    setIsLiveTranscribing(false);
    
    toast({
      title: "Live transcription stopped",
      description: "Transcription has been saved.",
    });
    
    // Save the transcription if there's content
    if (liveTranscription) {
      const newTranscription: TranscriptionEntry = {
        id: Date.now().toString(),
        originalText: liveTranscription,
        originalLanguage: 'en',
        context: 'Live classroom transcription',
        subject: 'Science',
        createdAt: new Date().toISOString()
      };
      
      setTranscriptionHistory(prev => [newTranscription, ...prev]);
    }
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Text has been copied to your clipboard.",
        });
      },
      (err) => {
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive"
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Transcription & Translation System</h1>
      <p className="text-muted-foreground mb-6">
        Supporting EAL students with transcription and translation tools
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="translate">Translate Content</TabsTrigger>
          <TabsTrigger value="vocabulary">Key Vocabulary</TabsTrigger>
          <TabsTrigger value="classroom">Classroom Support</TabsTrigger>
        </TabsList>
        
        {/* Translate Content Tab */}
        <TabsContent value="translate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translate Educational Content</CardTitle>
              <CardDescription>
                Convert text between languages to support EAL students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestTranscription} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalLanguage">Source Language</Label>
                    <Select 
                      value={transcriptionForm.originalLanguage} 
                      onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, originalLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(language => (
                          <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Select 
                      value={transcriptionForm.targetLanguage} 
                      onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, targetLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(language => (
                          <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="originalText">Text to Translate</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startRecording}
                        disabled={isRecording || isTranscribing}
                        className="flex items-center gap-1"
                      >
                        <Mic className="h-4 w-4" />
                        <span>Record</span>
                      </Button>
                      
                      {isRecording && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={stopRecording}
                          className="flex items-center gap-1"
                        >
                          <MicOff className="h-4 w-4" />
                          <span>Stop ({formatTime(recordingTime)})</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isTranscribing ? (
                    <div className="min-h-[150px] flex items-center justify-center border rounded-md bg-muted/20">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Transcribing audio...</span>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      id="originalText"
                      name="originalText"
                      value={transcriptionForm.originalText}
                      onChange={handleTranscriptionFormChange}
                      placeholder="Enter text to translate or record speech..."
                      className="min-h-[150px]"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="context">Context (Optional)</Label>
                    <Input
                      id="context"
                      name="context"
                      value={transcriptionForm.context}
                      onChange={handleTranscriptionFormChange}
                      placeholder="e.g., Science lesson, Homework instructions, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Select 
                      value={transcriptionForm.subject} 
                      onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !transcriptionForm.originalText.trim() || transcriptionForm.originalLanguage === transcriptionForm.targetLanguage}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Translate
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Translation History</CardTitle>
              <CardDescription>
                Recently translated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcriptionHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No translation history available.
                  </div>
                ) : (
                  transcriptionHistory.map(entry => (
                    <Card key={entry.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {languageOptions.find(l => l.code === entry.originalLanguage)?.name || entry.originalLanguage}
                              {entry.targetLanguage && ` → ${languageOptions.find(l => l.code === entry.targetLanguage)?.name || entry.targetLanguage}`}
                            </CardTitle>
                            <CardDescription>
                              {new Date(entry.createdAt).toLocaleDateString()}
                              {entry.subject && ` • ${entry.subject}`}
                              {entry.context && ` • ${entry.context}`}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(entry.originalText)}
                              className="h-8 w-8 p-0"
                              title="Copy original text"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {entry.translatedText && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(entry.translatedText || '')}
                                className="h-8 w-8 p-0"
                                title="Copy translation"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Original Text</Label>
                            <div className="text-sm p-2 bg-muted/20 rounded-md">
                              {entry.originalText}
                            </div>
                          </div>
                          
                          {entry.translatedText && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Translated Text</Label>
                              <div className="text-sm p-2 bg-muted/20 rounded-md">
                                {entry.translatedText}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Key Vocabulary Tab */}
        <TabsContent value="vocabulary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Key Vocabulary</CardTitle>
                <CardDescription>
                  Create translated vocabulary lists for EAL students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitVocabulary} className="space-y-4">
                  <div>
                    <Label htmlFor="term">Term</Label>
                    <Input
                      id="term"
                      name="term"
                      value={vocabularyForm.term}
                      onChange={handleVocabularyFormChange}
                      placeholder="Enter vocabulary term"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="definition">Definition</Label>
                    <Textarea
                      id="definition"
                      name="definition"
                      value={vocabularyForm.definition}
                      onChange={handleVocabularyFormChange}
                      placeholder="Enter definition"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={vocabularyForm.subject} 
                      onValueChange={(value) => setVocabularyForm(prev => ({ ...prev, subject: value }))}
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
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Translations</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTranslation}
                        className="flex items-center gap-1"
                      >
                        <span>Add Language</span>
                      </Button>
                    </div>
                    
                    {vocabularyForm.translations.map((translation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select 
                          value={translation.language} 
                          onValueChange={(value) => handleTranslationChange(index, 'language', value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.filter(l => l.code !== 'en').map(language => (
                              <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={translation.translation}
                          onChange={(e) => handleTranslationChange(index, 'translation', e.target.value)}
                          placeholder={`Translation in ${languageOptions.find(l => l.code === translation.language)?.name || 'selected language'}`}
                          className="flex-grow"
                        />
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTranslation(index)}
                          disabled={vocabularyForm.translations.length <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={
                        isLoading || 
                        !vocabularyForm.term.trim() || 
                        !vocabularyForm.definition.trim() || 
                        !vocabularyForm.subject ||
                        vocabularyForm.translations.some(t => !t.translation.trim())
                      }
                      className="w-full md:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Add Vocabulary
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vocabulary List</CardTitle>
                <CardDescription>
                  Key terms with translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vocabularyList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No vocabulary items available.
                    </div>
                  ) : (
                    vocabularyList.map(item => (
                      <Card key={item.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {item.term}
                                <Badge variant="outline">{item.subject}</Badge>
                              </CardTitle>
                              <CardDescription>
                                Added on {new Date(item.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${item.term}: ${item.definition}`)}
                              className="h-8 w-8 p-0"
                              title="Copy term and definition"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Definition</Label>
                              <div className="text-sm p-2 bg-muted/20 rounded-md">
                                {item.definition}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-muted-foreground">Translations</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                                {item.translations.map((translation, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="min-w-[80px] justify-center">
                                      {languageOptions.find(l => l.code === translation.language)?.name || translation.language}
                                    </Badge>
                                    <span>{translation.translation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Classroom Support Tab */}
        <TabsContent value="classroom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Classroom Transcription</CardTitle>
              <CardDescription>
                Real-time transcription of classroom speech to support EAL students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Current Lesson</h3>
                  <p className="text-sm text-muted-foreground">Science - The Water Cycle</p>
                </div>
                
                {!isLiveTranscribing ? (
                  <Button
                    onClick={startLiveTranscription}
                    className="flex items-center gap-2"
                  >
                    <VolumeUp className="h-4 w-4" />
                    Start Transcription
                  </Button>
                ) : (
                  <Button
                    onClick={stopLiveTranscription}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <MicOff className="h-4 w-4" />
                    Stop Transcription
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md p-4 min-h-[200px] bg-muted/20">
                {isLiveTranscribing && !liveTranscription && (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Waiting for speech...</span>
                    </div>
                  </div>
                )}
                
                {liveTranscription && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        Live Transcription
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(liveTranscription)}
                          className="h-7 w-7 p-0"
                          title="Copy transcription"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                      {liveTranscription}
                    </p>
                  </div>
                )}
                
                {!isLiveTranscribing && !liveTranscription && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Click "Start Transcription" to begin capturing classroom speech
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Translation Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="targetLanguage">Target Language</Label>
                        <Select disabled={!liveTranscription || isLiveTranscribing}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.filter(l => l.code !== 'en').map(language => (
                              <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        disabled={!liveTranscription || isLiveTranscribing}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        Translate Transcription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Format</Label>
                        <Select disabled={!liveTranscription || isLiveTranscribing}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                            <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                            <SelectItem value="docx">Word Document (.docx)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        disabled={!liveTranscription || isLiveTranscribing}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Transcription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>EAL Support Resources</CardTitle>
              <CardDescription>
                Tools and resources to support EAL students in the classroom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visual Aids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate visual aids with translated labels to support concept understanding.
                    </p>
                    <Button className="w-full" disabled>
                      <Image className="mr-2 h-4 w-4" />
                      Create Visual Aids
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Simplified Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create simplified versions of learning materials with key vocabulary highlighted.
                    </p>
                    <Button className="w-full" disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      Simplify Materials
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Translate important messages and announcements for EAL parents and guardians.
                    </p>
                    <Button className="w-full" disabled>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Translate Messages
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Note: Advanced features will be available in the next update. Current implementation provides basic translation support.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
