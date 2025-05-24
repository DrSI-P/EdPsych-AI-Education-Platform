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
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  AlertTriangle
} from 'lucide-react';

interface TextToSpeechEngineProps {
  settings: {
    enabled: boolean;
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
    autoRead: boolean;
    highlightText: boolean;
  };
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const TextToSpeechEngine: React.FC<TextToSpeechEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [currentText, setCurrentText] = React.useState<string>('');
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = React.useState<string>('idle');
  const [error, setError] = React.useState<string | null>(null);
  
  // Reference for speech synthesis
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Get available voices
      const getVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
        
        // Set default voice if not already set
        if (!settings.voice && voices.length > 0) {
          // Prefer UK English voice if available
          const ukVoice = voices.find(voice => voice.lang === 'en-GB');
          if (ukVoice) {
            handleSettingChange('voice', ukVoice.name);
          } else {
            handleSettingChange('voice', voices[0].name);
          }
        }
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = getVoices;
      }
      
      getVoices();
    } else {
      setError('Speech synthesis is not supported in this browser.');
    }
    
    // Clean up on unmount
    return () => {
      if (synthRef.current && isPlaying) {
        synthRef.current.cancel();
      }
    };
  }, [settings.voice, isPlaying]);
  
  // Speak text
  const speakText = React.useCallback((text: string) => {
    if (!synthRef.current) {
      setError('Speech synthesis is not available.');
      return;
    }
    
    if (!text) {
      setError('No text to speak.');
      return;
    }
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set voice
    if (settings.voice) {
      const selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Set other properties
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    // Set event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setStatus('playing');
      setError(null);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setStatus('completed');
    };
    
    utterance.onerror = (event) => {
      setIsPlaying(false);
      setStatus('error');
      setError(`Error: ${event.error}`);
    };
    
    // Speak
    synthRef.current.speak(utterance);
  }, [settings, availableVoices]);
  
  // Stop speaking
  const stopSpeaking = React.useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setStatus('stopped');
    }
  }, []);
  
  // Handle text input
  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
    
    // Auto-read if enabled
    if (settings.enabled && settings.autoRead && e.target.value) {
      // Debounce to avoid speaking on every keystroke
      if (utteranceRef.current) {
        synthRef.current?.cancel();
      }
      
      setTimeout(() => {
        speakText(e.target.value);
      }, 1000);
    }
  };
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: string | number | boolean) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  // Get voice options
  const getVoiceOptions = () => {
    return availableVoices.map(voice => ({
      value: voice.name,
      label: `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`
    }));
  };
  
  return (
    <div className="text-to-speech-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Volume2 className="mr-2" /> Text to Speech
          </CardTitle>
          <CardDescription>
            Convert text to spoken words for easier comprehension
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="input">Text Input</TabsTrigger>
              <TabsTrigger value="settings">Voice Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-text-to-speech" className="flex items-center">
                    Enable Text to Speech
                  </Label>
                  <input
                    type="checkbox"
                    id="enable-text-to-speech"
                    checked={settings.enabled}
                    onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                    className="toggle"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="text-input">Enter text to speak</Label>
                  <textarea
                    id="text-input"
                    value={currentText}
                    onChange={handleTextInput}
                    disabled={!settings.enabled}
                    className="w-full min-h-[150px] p-2 border rounded-md"
                    placeholder="Type or paste text here to convert to speech..."
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button
                    variant={isPlaying ? "destructive" : "default"}
                    size="sm"
                    onClick={isPlaying ? stopSpeaking : () => speakText(currentText)}
                    disabled={!settings.enabled || !currentText}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-1 h-4 w-4" /> Stop
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-4 w-4" /> Speak
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-read" className="text-sm">Auto-Read</Label>
                    <input
                      type="checkbox"
                      id="auto-read"
                      checked={settings.autoRead}
                      onChange={(e) => handleSettingChange('autoRead', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Voice</Label>
                  <select
                    id="voice-select"
                    value={settings.voice}
                    onChange={(e) => handleSettingChange('voice', e.target.value)}
                    disabled={!settings.enabled || availableVoices.length === 0}
                    className="w-full p-2 border rounded-md"
                  >
                    {availableVoices.length === 0 ? (
                      <option value="">Loading voices...</option>
                    ) : (
                      availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang}){voice.default ? ' - Default' : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rate-slider" className="text-sm">
                      Rate: {settings.rate.toFixed(1)}x
                    </Label>
                  </div>
                  <input
                    type="range"
                    id="rate-slider"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.rate}
                    onChange={(e) => handleSettingChange('rate', parseFloat(e.target.value))}
                    disabled={!settings.enabled}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="pitch-slider" className="text-sm">
                      Pitch: {settings.pitch.toFixed(1)}
                    </Label>
                  </div>
                  <input
                    type="range"
                    id="pitch-slider"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.pitch}
                    onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
                    disabled={!settings.enabled}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume-slider" className="text-sm">
                      Volume: {Math.round(settings.volume * 100)}%
                    </Label>
                  </div>
                  <input
                    type="range"
                    id="volume-slider"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                    disabled={!settings.enabled}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Quiet</span>
                    <span>Medium</span>
                    <span>Loud</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="highlight-text" className="flex items-center text-sm">
                    Highlight Text While Speaking
                  </Label>
                  <input
                    type="checkbox"
                    id="highlight-text"
                    checked={settings.highlightText}
                    onChange={(e) => handleSettingChange('highlightText', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Text-to-speech helps children with reading difficulties or visual impairments access content more easily.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TextToSpeechEngine;
