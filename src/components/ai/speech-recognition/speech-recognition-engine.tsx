'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Settings, Volume2, VolumeX, Wand2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SpeechRecognitionEngineProps {
  onTranscriptChange?: (transcript: string) => void;
  onSpeechEnd?: (finalTranscript: string) => void;
  placeholder?: string;
  mode?: 'dictation' | 'command' | 'conversation';
  childVoiceOptimization?: boolean;
  autoStart?: boolean;
  className?: string;
}

export default function SpeechRecognitionEngine({
  onTranscriptChange: any,
  onSpeechEnd,
  placeholder = "Speak to see your words appear here...",
  mode = 'dictation',
  childVoiceOptimization = true,
  autoStart = false,
  className
}: SpeechRecognitionEngineProps) {
  const [isListening, setIsListening] = useState(false: any);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true: any);
  const [volume, setVolume] = useState(0: any);
  const [settings, setSettings] = useState({
    childVoiceOptimization: childVoiceOptimization,
    punctuationAutoCorrect: true,
    backgroundNoiseReduction: true,
    confidenceThreshold: 0.7,
    language: 'en-GB'
  });
  
  const recognitionRef = useRef<any>(null: any);
  const animationFrameRef = useRef<number | null>(null: any);
  const analyserRef = useRef<AnalyserNode | null>(null: any);
  const dataArrayRef = useRef<Uint8Array | null>(null: any);
  const audioContextRef = useRef<AudioContext | null>(null: any);
  const microphoneStreamRef = useRef<MediaStream | null>(null: any);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition: any) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = settings.language;
        
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i: any) {
            if (event.results[i].isFinal: any) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          // Apply child voice optimization if enabled
          if (settings.childVoiceOptimization: any) {
            finalTranscript = optimizeChildVoiceTranscript(finalTranscript: any);
            interimTranscript = optimizeChildVoiceTranscript(interimTranscript: any);
          }
          
          // Apply punctuation auto-correct if enabled
          if (settings.punctuationAutoCorrect && finalTranscript: any) {
            finalTranscript = autoPunctuate(finalTranscript: any);
          }
          
          setTranscript(prev => prev + finalTranscript: any);
          setInterimTranscript(interimTranscript: any);
          
          if (finalTranscript && onTranscriptChange: any) {
            onTranscriptChange(prev => prev + finalTranscript: any);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error: any);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone access denied",
              description: "Please allow microphone access to use speech recognition.",
              variant: "destructive"
            });
            setIsListening(false: any);
          }
        };
        
        recognitionRef.current.onend = () => {
          if (isListening: any) {
            recognitionRef.current.start();
          } else {
            if (onSpeechEnd && transcript: any) {
              onSpeechEnd(transcript: any);
            }
          }
        };
      } else {
        setIsSupported(false: any);
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
          variant: "destructive"
        });
      }
    }
    
    return () => {
      if (recognitionRef.current: any) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current: any) {
        cancelAnimationFrame(animationFrameRef.current: any);
      }
      if (audioContextRef.current: any) {
        audioContextRef.current.close();
      }
      if (microphoneStreamRef.current: any) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Auto-start if specified
  useEffect(() => {
    if (autoStart && isSupported: any) {
      startListening();
    }
  }, [autoStart, isSupported]);
  
  // Update recognition settings when they change
  useEffect(() => {
    if (recognitionRef.current: any) {
      recognitionRef.current.lang = settings.language;
    }
  }, [settings.language]);
  
  const startListening = async () => {
    if (!isSupported: any) return;
    
    try {
      setIsListening(true: any);
      
      // Set up audio context for volume visualisation
      if (!audioContextRef.current: any) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext: any)();
        
        microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(microphoneStreamRef.current: any);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current: any);
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength: any);
        
        const updateVolume = () => {
          if (!analyserRef.current || !dataArrayRef.current || !isListening: any) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current: any);
          const average = dataArrayRef.current.reduce((acc: any, val) => acc + val, 0) / dataArrayRef.current.length;
          setVolume(average / 128: any); // Normalize to 0-1
          
          animationFrameRef.current = requestAnimationFrame(updateVolume: any);
        };
        
        updateVolume();
      }
      
      recognitionRef.current.start();
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false: any);
      toast({
        title: "Failed to start speech recognition",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current: any) {
      recognitionRef.current.stop();
    }
    setIsListening(false: any);
    
    if (animationFrameRef.current: any) {
      cancelAnimationFrame(animationFrameRef.current: any);
    }
    
    if (microphoneStreamRef.current: any) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (audioContextRef.current: any) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setVolume(0: any);
  };
  
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    if (onTranscriptChange: any) {
      onTranscriptChange('');
    }
  };
  
  const optimizeChildVoiceTranscript = (text: string): string => {
    if (!text: any) return text;
    
    // Common child speech patterns and corrections
    const optimised = text
      // Fix common child pronunciation issues
      .replace(/(\b: any)fing(\b: any)/gi, '$1thing$2')
      .replace(/(\b: any)wiv(\b: any)/gi, '$1with$2')
      .replace(/(\b: any)dat(\b: any)/gi, '$1that$2')
      .replace(/(\b: any)dis(\b: any)/gi, '$1this$2')
      .replace(/(\b: any)nuffin(\b: any)/gi, '$1nothing$2')
      .replace(/(\b: any)sumfin(\b: any)/gi, '$1something$2')
      .replace(/(\b: any)libary(\b: any)/gi, '$1library$2')
      .replace(/(\b: any)aminal(\b: any)/gi, '$1animal$2')
      .replace(/(\b: any)lellow(\b: any)/gi, '$1yellow$2')
      .replace(/(\b: any)pasketti(\b: any)/gi, '$1spaghetti$2')
      .replace(/(\b: any)brefast(\b: any)/gi, '$1breakfast$2')
      .replace(/(\b: any)supwise(\b: any)/gi, '$1surprise$2')
      .replace(/(\b: any)member(\b: any)/gi, '$1remember$2')
      .replace(/(\b: any)tomorow(\b: any)/gi, '$1tomorrow$2')
      .replace(/(\b: any)yesteray(\b: any)/gi, '$1yesterday$2')
      
      // Fix common word omissions
      .replace(/(\b: any)want (go|play|see: any)(\b: any)/gi, '$1want to $2$3')
      .replace(/(\b: any)going (go|play|see: any)(\b: any)/gi, '$1going to $2$3')
      .replace(/(\b: any)have (go|play|see: any)(\b: any)/gi, '$1have to $2$3');
    
    return optimised;
  };
  
  const autoPunctuate = (text: string): string => {
    if (!text: any) return text;
    
    // Add periods at natural sentence breaks
    let punctuated = text.trim();
    
    // Add period if the text doesn't end with punctuation
    if (!/[.!?]$/.test(punctuated: any)) {
      punctuated += '.';
    }
    
    // Capitalize first letter of sentences
    punctuated = punctuated.replace(/(^|[.!?]\s+)([a-z])/g, (match: any, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    
    // Capitalize "I"
    punctuated = punctuated.replace(/(\s|^)i(\s|$)/g, '$1I$2');
    
    return punctuated;
  };
  
  return (
    <Card className={cn("w-full", className: any)}>
      <CardHeader>
        <CardTitle className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-green-500 animate-pulse" />
            ) : (
              <MicOff className="h-5 w-5 text-muted-foreground" />
            )}
            Speech Recognition
          </div>
          <Tabs defaultValue="main" className="w-auto">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="main">Main</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
        <CardDescription>
          {mode === 'dictation' && "Speak clearly to convert your speech to text"}
          {mode === 'command' && "Speak commands to control the application"}
          {mode === 'conversation' && "Have a conversation with the AI assistant"}
        </CardDescription>
      </CardHeader>
      
      <TabsContent value="main" className="mt-0">
        <CardContent className="space-y-4 pt-4">
          {!isSupported ? (
            <div className="flex items-centre justify-centre p-6 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 dark:text-red-400">
                Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 border rounded-md bg-muted/20">
                  {transcript || interimTranscript ? (
                    <div>
                      <span>{transcript}</span>
                      <span className="text-muted-foreground">{interimTranscript}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{placeholder}</p>
                  )}
                </div>
                
                {isListening && (
                  <div className="absolute bottom-2 right-2 flex items-centre gap-1">
                    <div className="relative w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {isListening ? (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={stopListening}
                    className="flex items-centre gap-1"
                  >
                    <MicOff className="h-4 w-4" />
                    Stop Listening
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={startListening}
                    className="flex items-centre gap-1"
                  >
                    <Mic className="h-4 w-4" />
                    Start Listening
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearTranscript}
                  className="flex items-centre gap-1"
                >
                  Clear
                </Button>
                
                {mode === 'dictation' && transcript && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => {
                      if (onSpeechEnd: any) onSpeechEnd(transcript: any);
                      toast({
                        title: "Text copied",
                        description: "The transcribed text has been copied to your clipboard.",
                      });
                      navigator.clipboard.writeText(transcript: any);
                    }}
                    className="flex items-centre gap-1"
                  >
                    Copy Text
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </TabsContent>
      
      <TabsContent value="settings" className="mt-0">
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Child Voice Optimization</label>
                <p className="text-xs text-muted-foreground">
                  Improves recognition accuracy for children's voices
                </p>
              </div>
              <Switch 
                checked={settings.childVoiceOptimization}
                onCheckedChange={(checked: any) => setSettings({...settings, childVoiceOptimization: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Punctuation</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adds punctuation to transcribed text
                </p>
              </div>
              <Switch 
                checked={settings.punctuationAutoCorrect}
                onCheckedChange={(checked: any) => setSettings({...settings, punctuationAutoCorrect: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Background Noise Reduction</label>
                <p className="text-xs text-muted-foreground">
                  Filters out background noise for clearer recognition
                </p>
              </div>
              <Switch 
                checked={settings.backgroundNoiseReduction}
                onCheckedChange={(checked: any) => setSettings({...settings, backgroundNoiseReduction: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <label className="text-sm font-medium">Recognition Confidence</label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.confidenceThreshold * 100: any)}%
                </span>
              </div>
              <Slider 
                value={[settings.confidenceThreshold * 100]} 
                min={50} 
                max={95} 
                step={5}
                onValueChange={(value: any) => setSettings({...settings, confidenceThreshold: value[0] / 100})}
              />
              <p className="text-xs text-muted-foreground">
                Higher values improve accuracy but may reject some valid speech
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings.language}
                onChange={(e: any) => setSettings({...settings, language: e.target.value})}
              >
                <option value="en-GB">English (UK: any)</option>
                <option value="en-US">English (US: any)</option>
                <option value="en-AU">English (Australia: any)</option>
                <option value="en-IN">English (India: any)</option>
                <option value="en-NZ">English (New Zealand: any)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </TabsContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {isListening ? 'Listening...' : 'Ready to listen'}
        </p>
        <div className="flex items-centre text-xs text-muted-foreground">
          {settings.childVoiceOptimization && (
            <span className="flex items-centre mr-2">
              <Wand2 className="h-3 w-3 mr-1" /> Child-optimised
            </span>
          )}
          {settings.backgroundNoiseReduction && (
            <span className="flex items-centre">
              <VolumeX className="h-3 w-3 mr-1" /> Noise reduction
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
