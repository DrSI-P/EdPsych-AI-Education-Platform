'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInputProps {
  onTextCapture?: (text: string) => void;
  placeholder?: string;
  language?: string;
  autoSubmit?: boolean;
  className?: string;
}

/**
 * VoiceInput Component
 * 
 * A component that allows users to input text via voice recognition,
 * making the platform more accessible for users who struggle with typing.
 */
export default function VoiceInput({
  onTextCapture,
  placeholder = 'Speak to enter text...',
  language = 'en-GB', // Default to British English
  autoSubmit = false,
  className = '',
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = language;
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          
          setText(transcript);
          
          // If autoSubmit is enabled and we have a final result
          if (autoSubmit && event.results[0].isFinal && onTextCapture) {
            onTextCapture(transcript);
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            title: 'Voice Input Error',
            description: `Error: ${event.error}. Please try again.`,
            variant: 'destructive',
          });
        };
        
        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        toast({
          title: 'Voice Input Not Supported',
          description: 'Your browser does not support voice input. Please try using Chrome, Edge, or Safari.',
          variant: 'destructive',
        });
      }
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language, autoSubmit, onTextCapture, toast]);

  // Toggle listening
  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setText('');
      recognition.start();
      setIsListening(true);
      
      toast({
        title: 'Voice Input Active',
        description: 'Speak now. Your voice is being converted to text.',
      });
    }
  };

  // Submit the captured text
  const handleSubmit = () => {
    if (text.trim() && onTextCapture) {
      onTextCapture(text.trim());
      setText('');
    }
  };

  // Read text aloud (text-to-speech)
  const speakText = () => {
    if (!text.trim()) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: 'Text-to-Speech Error',
          description: 'There was an error reading the text aloud.',
          variant: 'destructive',
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: 'Text-to-Speech Not Supported',
        description: 'Your browser does not support text-to-speech.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Voice Input</CardTitle>
        <CardDescription>
          {isSupported 
            ? 'Speak to enter text instead of typing' 
            : 'Voice input is not supported in your browser'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
            aria-label="Voice input text"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              disabled={!isSupported}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Listening
                </>
              )}
            </Button>
            
            <Button
              onClick={speakText}
              variant="outline"
              disabled={!text.trim() || isSpeaking}
              aria-label="Read text aloud"
            >
              {isSpeaking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Read Aloud
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!text.trim()}
          className="ml-auto"
          aria-label="Submit text"
        >
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
