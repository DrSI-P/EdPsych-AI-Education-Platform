'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Mic, MicOff, RefreshCw, Settings, Keyboard } from 'lucide-react';
import { SpeechRecognitionService, SpeechRecognitionResult, SpeechRecognitionOptions } from '@/lib/voice/speechRecognition';

export default function VoiceInput(): React.ReactNode {
  // State for speech recognition
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for settings
  const [language, setLanguage] = useState('en-GB');
  const [childVoiceOptimization, setChildVoiceOptimization] = useState(true);
  const [continuousListening, setContinuousListening] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [specialNeedsSettings, setSpecialNeedsSettings] = useState({
    articulation: false,
    fluency: false,
    processing: false
  });
  
  // References
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize speech recognition on client side
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      try {
        // Import dynamically to avoid SSR issues
        import('@/lib/voice/speechRecognition').then(({ getSpeechRecognitionService }) => {
          const options: SpeechRecognitionOptions = {
            continuous: continuousListening,
            interimResults: true,
            lang: language,
            childVoiceOptimization,
            profanityFilter,
            specialEducationalNeeds: specialNeedsSettings
          };
          
          speechRecognitionRef.current = getSpeechRecognitionService(options);
          setIsSupported(speechRecognitionRef.current.isBrowserSupported());
        });
      } catch (error) {
        // Avoid console.error in production
        setIsSupported(false);
      }
    }
  }, [language, childVoiceOptimization, continuousListening, profanityFilter, specialNeedsSettings]);
  
  // Update speech recognition options when settings change
  useEffect(() => {
    if (speechRecognitionRef.current) {
      const options: SpeechRecognitionOptions = {
        continuous: continuousListening,
        interimResults: true,
        lang: language,
        childVoiceOptimization,
        profanityFilter,
        specialEducationalNeeds: specialNeedsSettings
      };
      
      speechRecognitionRef.current.updateOptions(options);
    }
  }, [language, childVoiceOptimization, continuousListening, profanityFilter, specialNeedsSettings]);
  
  // Handle start listening
  const startListening = (): void => {
    if (!speechRecognitionRef.current) return;
    
    setIsLoading(true);
    
    // Start speech recognition
    speechRecognitionRef.current.start(
      (result: SpeechRecognitionResult) => {
        setIsLoading(false);
        setIsListening(true);
        
        // Update transcript and confidence
        if (result.isFinal || !continuousListening) {
          setConfidence(result.confidence * 100);
          
          // Insert text at cursor position in textarea
          if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const text = textareaRef.current.value;
            const newText = text.substring(0, start) + result.text + text.substring(end);
            textareaRef.current.value = newText;
            textareaRef.current.selectionStart = start + result.text.length;
            textareaRef.current.selectionEnd = start + result.text.length;
            textareaRef.current.focus();
          }
          
          if (!continuousListening) {
            stopListening();
          }
        }
      },
      (error) => {
        // Avoid using console.error in production
        setIsLoading(false);
        setIsListening(false);
        toast({
          title: 'Speech Recognition Error',
          description: `An error occurred: ${error}`,
          variant: 'destructive'
        });
      }
    );
  };
  
  // Handle stop listening
  const stopListening = (): void => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // Toggle listening
  const toggleListening = (): void => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Clear transcript
  const clearTranscript = (): void => {
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
  };
  
  // Handle language change
  const handleLanguageChange = (value: string): void => {
    setLanguage(value);
  };
  
  // Handle special needs setting change
  const handleSpecialNeedsChange = (setting: keyof typeof specialNeedsSettings, value: boolean): void => {
    setSpecialNeedsSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Voice Input</h1>
      
      {!isSupported ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-600">Browser Not Supported</CardTitle>
            <CardDescription>
              Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Voice input requires a modern browser with Web Speech API support. 
              Please switch to a compatible browser to use this feature.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Voice to Text</CardTitle>
              <CardDescription>
                Speak clearly into your microphone to convert speech to text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="voice-input">Voice Input</Label>
                  <div className="relative">
                    <Textarea 
                      id="voice-input" 
                      placeholder="Start speaking or type here..." 
                      className="min-h-[200px] pr-12"
                      ref={textareaRef}
                    />
                    <Button
                      variant={isListening ? "destructive" : "default"}
                      size="icon"
                      className="absolute bottom-2 right-2"
                      onClick={toggleListening}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {isListening && (
                    <div className="flex items-centre space-x-2 text-sm text-muted-foreground">
                      <span className="animate-pulse text-red-500">●</span>
                      <span>Listening...</span>
                      {confidence > 0 && (
                        <>
                          <span className="ml-2">Confidence:</span>
                          <Progress value={confidence} className="h-2 w-20" />
                          <span>{Math.round(confidence)}%</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearTranscript}>
                    Clear
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Keyboard className="h-4 w-4 mr-2" />
                      Keyboard
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="settings">
            <TabsList className="grid grid-cols-3 w-[400px] mb-6">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="special-needs">Special Needs</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Input Settings</CardTitle>
                  <CardDescription>
                    Configure voice recognition settings to improve accuracy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="cy-GB">Welsh</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="pl-PL">Polish</SelectItem>
                        <SelectItem value="ur-PK">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="child-voice" className="block mb-1">Child Voice Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimise recognition for children&apos;s voices and speech patterns
                      </p>
                    </div>
                    <Switch
                      id="child-voice"
                      checked={childVoiceOptimization}
                      onCheckedChange={setChildVoiceOptimization}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="continuous" className="block mb-1">Continuous Listening</Label>
                      <p className="text-sm text-muted-foreground">
                        Continue listening until manually stopped
                      </p>
                    </div>
                    <Switch
                      id="continuous"
                      checked={continuousListening}
                      onCheckedChange={setContinuousListening}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="profanity" className="block mb-1">Profanity Filter</Label>
                      <p className="text-sm text-muted-foreground">
                        Filter out inappropriate language
                      </p>
                    </div>
                    <Switch
                      id="profanity"
                      checked={profanityFilter}
                      onCheckedChange={setProfanityFilter}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="special-needs">
              <Card>
                <CardHeader>
                  <CardTitle>Special Educational Needs Settings</CardTitle>
                  <CardDescription>
                    Additional settings to support various speech and language needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="articulation" className="block mb-1">Articulation Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Enhanced support for articulation difficulties
                      </p>
                    </div>
                    <Switch
                      id="articulation"
                      checked={specialNeedsSettings.articulation}
                      onCheckedChange={(value) => handleSpecialNeedsChange('articulation', value)}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="fluency" className="block mb-1">Fluency Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Support for stuttering and other fluency challenges
                      </p>
                    </div>
                    <Switch
                      id="fluency"
                      checked={specialNeedsSettings.fluency}
                      onCheckedChange={(value) => handleSpecialNeedsChange('fluency', value)}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="processing" className="block mb-1">Processing Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Extended processing time for speech recognition
                      </p>
                    </div>
                    <Switch
                      id="processing"
                      checked={specialNeedsSettings.processing}
                      onCheckedChange={(value) => handleSpecialNeedsChange('processing', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="help">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Input Help</CardTitle>
                  <CardDescription>
                    Tips for getting the best results with voice input.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-semibold text-lg">Tips for Clear Recognition</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Minimize background noise</li>
                    <li>Position your microphone 15-20cm from your mouth</li>
                    <li>Use short phrases rather than long sentences</li>
                    <li>For children, select the Child Voice Optimization option</li>
                  </ul>
                  
                  <h3 className="font-semibold text-lg mt-4">Voice Commands</h3>
                  <p>You can use the following voice commands while speaking:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>&quot;New line&quot; - Start a new paragraph</li>
                    <li>&quot;Full stop&quot; or &quot;Period&quot; - Add a period</li>
                    <li>&quot;Question mark&quot; - Add a question mark</li>
                    <li>&quot;Exclamation mark&quot; - Add an exclamation mark</li>
                    <li>&quot;Comma&quot; - Add a comma</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
