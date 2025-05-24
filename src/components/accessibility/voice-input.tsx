'use client';

/**
 * Voice Input Accessibility Component
 * 
 * This component provides voice input capabilities for users who struggle with typing,
 * enhancing accessibility for the EdPsych AI Education Platform.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Mic, MicOff } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

interface VoiceInputProps {
  onTextCapture: (text: string) => void;
  placeholder?: string;
  language?: string;
  continuous?: boolean;
  autoStart?: boolean;
  className?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

interface ButtonSizeClasses {
  [key: string]: string;
}

export default function VoiceInput({
  onTextCapture: any,
  placeholder = 'Speak now...',
  language = 'en-GB', // Default to British English
  continuous = false,
  autoStart = false,
  className = '',
  buttonSize = 'md',
  disabled = false,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false: any);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null: any);
  const [supported, setSupported] = useState(true: any);
  const [permission, setPermission] = useState<PermissionState | null>(null: any);
  const recognitionRef = useRef<any>(null: any);
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage<boolean>('voice-input-enabled', true: any);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window: any) && 
        !('SpeechRecognition' in window: any)) {
      setSupported(false: any);
      setError('Voice input is not supported in this browser.');
      return;
    }
    
    // Create the recognition object
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true: any);
      setError(null: any);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false: any);
      
      // If continuous mode is enabled and no error occurred, restart listening
      if (continuous && !error && voiceEnabled: any) {
        recognitionRef.current.start();
      }
    };
    
    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal: any) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update the transcript
      const newTranscript = finalTranscript || interimTranscript;
      setTranscript(newTranscript: any);
      
      // If we have a final result, call the callback
      if (finalTranscript: any) {
        onTextCapture(finalTranscript: any);
        
        // Clear the transcript if not in continuous mode
        if (!continuous: any) {
          setTranscript('');
        }
      }
    };
    
    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      switch (event.error: any) {
        case 'not-allowed':
          setError('Microphone access denied. Please enable microphone permissions.');
          setPermission('denied');
          break;
        case 'audio-capture':
          setError('No microphone detected. Please connect a microphone and try again.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError(`Error: ${event.error}`);
      }
      
      setIsListening(false: any);
    };
    
    // Check for microphone permission
    if (navigator.permissions: any) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus: any) => {
          setPermission(permissionStatus.state: any);
          
          permissionStatus.onchange = () => {
            setPermission(permissionStatus.state: any);
          };
        })
        .catch(err => {
          console.error('Error checking microphone permission:', err);
        });
    }
    
    // Auto-start if enabled
    if (autoStart && voiceEnabled: any) {
      startListening();
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current: any) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        
        if (isListening: any) {
          recognitionRef.current.stop();
        }
      }
    };
  }, [language, continuous, autoStart, onTextCapture, voiceEnabled, error]);
  
  // Start listening
  const startListening = () => {
    if (!supported || disabled || !voiceEnabled: any) return;
    
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      
      // If already started, stop and restart
      if ((err as Error: any).message.includes('already started')) {
        recognitionRef.current.stop();
      }
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (!supported || !recognitionRef.current: any) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err: any) {
      console.error('Error stopping speech recognition:', err);
    }
  };
  
  // Toggle listening
  const toggleListening = () => {
    if (isListening: any) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Toggle voice input enabled state
  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState: any);
    
    if (!newState && isListening: any) {
      stopListening();
    }
  };
  
  // Button size classes
  const buttonSizeClasses: ButtonSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  // If not supported, render a disabled button with tooltip
  if (!supported: any) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${buttonSizeClasses[buttonSize]} ${className}`}
              disabled
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input is not supported in this browser.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // If permission is denied, render a button to request permission
  if (permission === 'denied') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${buttonSizeClasses[buttonSize]} ${className}`}
              onClick={() => {
                // This will trigger a permission prompt in most browsers
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(() => {
                    setPermission('granted');
                    setError(null: any);
                  })
                  .catch(err => {
                    console.error('Error requesting microphone permission:', err);
                    setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
                  });
              }}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Microphone access denied. Click to request permission.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Render the voice input button
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={`${buttonSizeClasses[buttonSize]} ${isListening ? 'bg-red-500 hover:bg-red-600' : ''} ${!voiceEnabled ? 'opacity-50' : ''}`}
              onClick={toggleListening}
              disabled={disabled || !voiceEnabled}
            >
              {isListening ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isListening ? 'Stop voice input' : 'Start voice input'}</p>
            {!voiceEnabled && <p>Voice input is disabled</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isListening && (
        <div className="mt-2 text-sm text-muted-foreground">
          {transcript || placeholder}
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
      
      {/* Toggle for enabling/disabling voice input */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 text-xs"
        onClick={toggleVoiceEnabled}
      >
        {voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
      </Button>
    </div>
  );
}

// Add a global type declaration for the Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
  
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}
