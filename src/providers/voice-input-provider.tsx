/**
 * Voice Input Provider
 * React context provider for voice input functionality
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define the context value interface
interface VoiceInputContextValue {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  supported: boolean;
}

// Create the context with default values
const VoiceInputContext = createContext<VoiceInputContextValue>({
  isListening: false,
  transcript: '',
  startListening: () => {},
  stopListening: () => {},
  clearTranscript: () => {},
  error: null,
  supported: false
});

// Hook to use the voice input context
export const useVoiceInput = () => useContext(VoiceInputContext);

// Provider component
export const VoiceInputProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Set up event handlers
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(prev => prev + ' ' + transcriptText);
      };
      
      recognitionInstance.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setError('Speech recognition not supported in this browser');
      setSupported(false);
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (recognition && supported) {
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch (err) {
        setError('Error starting speech recognition');
        console.error('Speech recognition error:', err);
      }
    }
  }, [recognition, supported]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && supported) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, supported]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Context value
  const value = {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    supported
  };

  return (
    <VoiceInputContext.Provider value={value}>
      {children}
    </VoiceInputContext.Provider>
  );
};

export default VoiceInputProvider;
