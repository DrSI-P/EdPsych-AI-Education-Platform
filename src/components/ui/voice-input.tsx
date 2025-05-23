'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { createSpeechRecognition, SpeechRecognitionOptions, SpeechRecognitionResult } from '@/lib/accessibility/speechRecognition';
import { Mic, MicOff, Settings, HelpCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  placeholder?: string;
  className?: string;
  inputId?: string;
  disabled?: boolean;
}

export function VoiceInput({
  onTranscriptChange,
  placeholder = 'Click the microphone to start speaking...',
  className = '',
  inputId,
  disabled = false
}: VoiceInputProps) {
  // State for speech recognition
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // State for settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [options, setOptions] = useState<SpeechRecognitionOptions>({
    language: 'en-GB',
    continuous: false,
    interimResults: true,
    childVoiceOptimization: true,
    specialNeedsSupport: {
      articulationSupport: false,
      fluencySupport: false,
      processingSupport: false,
    },
    profanityFilter: true,
  });
  
  // Reference to speech recognition service
  const speechRecognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const speechRecognition = createSpeechRecognition(options);
    
    // Check if speech recognition is supported
    setIsSupported(speechRecognition.isSupported());
    
    // Set up event handlers
    speechRecognition.onStart(() => {
      setIsListening(true);
      setError(null);
    });
    
    speechRecognition.onResult((result: SpeechRecognitionResult) => {
      setConfidence(result.confidence);
      
      if (result.isFinal) {
        setTranscript(prev => prev + (prev ? ' ' : '') + result.transcript);
        setInterimTranscript('');
      } else {
        setInterimTranscript(result.transcript);
      }
    });
    
    speechRecognition.onError((error) => {
      setIsListening(false);
      setError(error.message);
    });
    
    speechRecognition.onEnd(() => {
      setIsListening(false);
    });
    
    speechRecognitionRef.current = speechRecognition;
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [options]);
  
  // Update parent component when transcript changes
  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);
  
  // Toggle listening
  const toggleListening = () => {
    if (!isSupported || disabled) return;
    
    if (isListening) {
      speechRecognitionRef.current?.stop();
    } else {
      speechRecognitionRef.current?.start();
    }
  };
  
  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  // Update options
  const updateOptions = (newOptions: Partial<SpeechRecognitionOptions>) => {
    const updatedOptions = { ...options, ...newOptions };
    setOptions(updatedOptions);
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.updateOptions(updatedOptions);
    }
  };
  
  // Calculate confidence level class
  const getConfidenceClass = () => {
    if (confidence > 0.8) return 'bg-green-500';
    if (confidence > 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Available languages
  const languages = [
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ar-SA', label: 'Arabic' },
    { value: 'hi-IN', label: 'Hindi' },
  ];
  
  return (
    <div className={`voice-input-container ${className}`}>
      {/* Main input display area */}
      <div className="relative border rounded-md p-3 min-h-[100px] bg-white dark:bg-gray-800">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isListening ? "destructive" : "default"}
              size="sm"
              onClick={toggleListening}
              disabled={!isSupported || disabled}
              aria-label={isListening ? "Stop listening" : "Start listening"}
              className="flex items-center gap-1"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? "Stop" : "Start"}
            </Button>
            
            {isListening && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full animate-pulse bg-red-500"></div>
                <span className="text-xs text-gray-500">Listening...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip content="Settings">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                aria-label="Voice input settings"
              >
                <Settings size={16} />
              </Button>
            </Tooltip>
            
            <Tooltip content="Help">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setHelpOpen(true)}
                aria-label="Voice input help"
              >
                <HelpCircle size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
        
        {/* Transcript display */}
        <div className="min-h-[50px] mb-2">
          {transcript ? (
            <p className="text-gray-900 dark:text-gray-100">{transcript}</p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500">{placeholder}</p>
          )}
          {interimTranscript && (
            <p className="text-gray-500 italic">{interimTranscript}</p>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        
        {/* Confidence indicator */}
        {isListening && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Confidence:</span>
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getConfidenceClass()}`} 
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex justify-end mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearTranscript}
            disabled={!transcript && !interimTranscript}
            aria-label="Clear transcript"
          >
            Clear
          </Button>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Input Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={options.language}
                onValueChange={(value) => updateOptions({ language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="childVoiceOptimization">Child Voice Optimization</Label>
              <Switch
                id="childVoiceOptimization"
                checked={options.childVoiceOptimization}
                onCheckedChange={(checked) => updateOptions({ childVoiceOptimization: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="profanityFilter">Profanity Filter</Label>
              <Switch
                id="profanityFilter"
                checked={options.profanityFilter}
                onCheckedChange={(checked) => updateOptions({ profanityFilter: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Special Needs Support</Label>
              
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="articulationSupport">Articulation Support</Label>
                  <Switch
                    id="articulationSupport"
                    checked={options.specialNeedsSupport?.articulationSupport}
                    onCheckedChange={(checked) => updateOptions({
                      specialNeedsSupport: {
                        ...options.specialNeedsSupport,
                        articulationSupport: checked
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="fluencySupport">Fluency Support</Label>
                  <Switch
                    id="fluencySupport"
                    checked={options.specialNeedsSupport?.fluencySupport}
                    onCheckedChange={(checked) => updateOptions({
                      specialNeedsSupport: {
                        ...options.specialNeedsSupport,
                        fluencySupport: checked
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="processingSupport">Processing Support</Label>
                  <Switch
                    id="processingSupport"
                    checked={options.specialNeedsSupport?.processingSupport}
                    onCheckedChange={(checked) => updateOptions({
                      specialNeedsSupport: {
                        ...options.specialNeedsSupport,
                        processingSupport: checked
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="continuous">Continuous Listening</Label>
              <Switch
                id="continuous"
                checked={options.continuous}
                onCheckedChange={(checked) => updateOptions({ continuous: checked })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Input Help</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <h3 className="font-medium">How to Use Voice Input</h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Click the "Start" button with the microphone icon to begin recording.</li>
              <li>Speak clearly into your microphone.</li>
              <li>The system will convert your speech to text in real-time.</li>
              <li>Click "Stop" when you're finished speaking.</li>
              <li>The final transcript will be added to your input.</li>
            </ol>
            
            <h3 className="font-medium mt-4">Tips for Best Results</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>Speak clearly and at a moderate pace.</li>
              <li>Reduce background noise when possible.</li>
              <li>Position your microphone properly (about 15-20 cm from your mouth).</li>
              <li>Use short phrases rather than very long sentences.</li>
              <li>If you have speech difficulties, enable the appropriate special needs support in settings.</li>
            </ul>
            
            <h3 className="font-medium mt-4">Troubleshooting</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>If voice input isn't working, check that your browser has permission to use your microphone.</li>
              <li>Try refreshing the page if speech recognition stops responding.</li>
              <li>Some browsers may have limited support for speech recognition. Chrome works best.</li>
              <li>If you're in a noisy environment, try moving to a quieter location.</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setHelpOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VoiceInput;
