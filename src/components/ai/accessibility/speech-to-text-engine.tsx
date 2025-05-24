'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Trash, 
  Copy, 
  Check,
  Settings
} from 'lucide-react';

interface SpeechToTextEngineProps {
  settings: {
    enabled: boolean;
    autoCapitalization: boolean;
    punctuationPrediction: boolean;
    childVoiceOptimization: boolean;
    noiseReduction: boolean;
    continuousListening: boolean;
    confidenceThreshold: number;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
  onTextGenerated?: (text: string) => void;
}

export const SpeechToTextEngine: React.FC<SpeechToTextEngineProps> = ({ 
  settings,
  onSettingsChange,
  onTextGenerated
}) => {
  // State for UI
  const [activeTab, setActiveTab] = React.useState<string>('input');
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [transcript, setTranscript] = React.useState<string>('');
  const [interimTranscript, setInterimTranscript] = React.useState<string>('');
  const [recognitionError, setRecognitionError] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  
  // Reference for speech recognition
  const recognitionRef = React.useRef<any>(null);
  
  // Timer for continuous listening
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Initialize speech recognition
  const initializeSpeechRecognition = React.useCallback(() => {
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setRecognitionError('Speech recognition is not supported in this browser.');
        return false;
      }
      
      // Create speech recognition instance
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-GB'; // UK English
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
        console.log('Speech recognition started');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
        
        // Restart if continuous listening is enabled
        if (settings.continuousListening && !recognitionError) {
          timerRef.current = setTimeout(() => {
            startListening();
          }, 1000);
        }
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        
        if (final) {
          let processedText = final;
          
          // Apply text processing based on settings
          if (settings.autoCapitalization) {
            processedText = applyAutoCapitalization(processedText);
          }
          
          if (settings.punctuationPrediction) {
            processedText = applyPunctuationPrediction(processedText);
          }
          
          setTranscript(prev => prev + (prev ? ' ' : '') + processedText);
          
          if (onTextGenerated) {
            onTextGenerated(processedText);
          }
        }
        
        setInterimTranscript(interim);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // This is a common error, don't show it to the user
          return;
        }
        
        setRecognitionError(`Error: ${event.error}`);
        stopListening();
      };
      
      return true;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setRecognitionError('Failed to initialize speech recognition.');
      return false;
    }
  }, [settings.autoCapitalization, settings.continuousListening, settings.punctuationPrediction, onTextGenerated]);
  
  // Start listening
  const startListening = React.useCallback(() => {
    if (!recognitionRef.current) {
      const initialized = initializeSpeechRecognition();
      if (!initialized) return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setRecognitionError('Failed to start speech recognition.');
    }
  }, [initializeSpeechRecognition]);
  
  // Stop listening
  const stopListening = React.useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);
  
  // Apply auto-capitalization
  const applyAutoCapitalization = (text: string): string => {
    if (!text) return text;
    
    // Capitalize first letter of the text
    let processed = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Capitalize after periods, question marks, and exclamation marks
    processed = processed.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    
    return processed;
  };
  
  // Apply punctuation prediction
  const applyPunctuationPrediction = (text: string): string => {
    if (!text) return text;
    
    // Simple punctuation rules
    let processed = text;
    
    // Add period at the end if missing
    if (!/[.!?]$/.test(processed)) {
      processed += '.';
    }
    
    return processed;
  };
  
  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  // Copy transcript to clipboard
  const copyTranscript = () => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(error => {
        console.error('Error copying to clipboard:', error);
      });
  };
  
  // Handle settings toggle
  const handleSettingToggle = (setting: string, value: boolean | number) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  return (
    <div className="speech-to-text-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Mic className="mr-2" /> Voice Input
          </CardTitle>
          <CardDescription>
            Convert speech to text for easier input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="input">Voice Input</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-speech-to-text" className="flex items-center">
                    Enable Voice Input
                  </Label>
                  <input
                    type="checkbox"
                    id="enable-speech-to-text"
                    checked={settings.enabled}
                    onChange={(e) => handleSettingToggle('enabled', e.target.checked)}
                    className="toggle"
                  />
                </div>
                
                <Separator />
                
                <div className="relative min-h-[150px] border rounded-md p-3">
                  <div className="space-y-2">
                    {transcript && (
                      <p className="text-base">{transcript}</p>
                    )}
                    {interimTranscript && (
                      <p className="text-base text-muted-foreground italic">{interimTranscript}</p>
                    )}
                    {!transcript && !interimTranscript && (
                      <p className="text-muted-foreground">
                        {isListening ? 'Listening... Speak now.' : 'Click the microphone button to start speaking.'}
                      </p>
                    )}
                  </div>
                </div>
                
                {recognitionError && (
                  <div className="text-sm text-red-500">
                    {recognitionError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button
                      variant={isListening ? "destructive" : "default"}
                      size="sm"
                      onClick={isListening ? stopListening : startListening}
                      disabled={!settings.enabled}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-1 h-4 w-4" /> Stop
                        </>
                      ) : (
                        <>
                          <Mic className="mr-1 h-4 w-4" /> Start
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearTranscript}
                      disabled={!transcript && !interimTranscript}
                    >
                      <Trash className="mr-1 h-4 w-4" /> Clear
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTranscript}
                    disabled={!transcript}
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-4 w-4" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-capitalization" className="flex items-center text-sm">
                    Auto-Capitalization
                  </Label>
                  <input
                    type="checkbox"
                    id="auto-capitalization"
                    checked={settings.autoCapitalization}
                    onChange={(e) => handleSettingToggle('autoCapitalization', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="punctuation-prediction" className="flex items-center text-sm">
                    Punctuation Prediction
                  </Label>
                  <input
                    type="checkbox"
                    id="punctuation-prediction"
                    checked={settings.punctuationPrediction}
                    onChange={(e) => handleSettingToggle('punctuationPrediction', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="child-voice-optimization" className="flex items-center text-sm">
                    Child Voice Optimization
                  </Label>
                  <input
                    type="checkbox"
                    id="child-voice-optimization"
                    checked={settings.childVoiceOptimization}
                    onChange={(e) => handleSettingToggle('childVoiceOptimization', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="noise-reduction" className="flex items-center text-sm">
                    Noise Reduction
                  </Label>
                  <input
                    type="checkbox"
                    id="noise-reduction"
                    checked={settings.noiseReduction}
                    onChange={(e) => handleSettingToggle('noiseReduction', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="continuous-listening" className="flex items-center text-sm">
                    Continuous Listening
                  </Label>
                  <input
                    type="checkbox"
                    id="continuous-listening"
                    checked={settings.continuousListening}
                    onChange={(e) => handleSettingToggle('continuousListening', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="confidence-threshold" className="text-sm">
                      Confidence Threshold: {settings.confidenceThreshold}%
                    </Label>
                  </div>
                  <input
                    type="range"
                    id="confidence-threshold"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.confidenceThreshold}
                    onChange={(e) => handleSettingToggle('confidenceThreshold', parseInt(e.target.value))}
                    disabled={!settings.enabled}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Voice input helps children who struggle with typing to interact with the platform more easily.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpeechToTextEngine;
