'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  getSpeechRecognitionService, 
  SpeechRecognitionOptions, 
  SpeechRecognitionResult 
} from '@/lib/voice/speechRecognition';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export type AgeGroup = 'nursery' | 'early-primary' | 'late-primary' | 'secondary';

export interface VoiceInputSettings {
  childVoiceOptimization: boolean;
  noiseReduction: boolean;
  autoCapitalization: boolean;
  punctuationPrediction: boolean;
  dialectAdaptation: boolean;
  confidenceThreshold: number;
  silenceTimeout: number;
  language: string;
  specialEducationalNeeds: {
    articulation: boolean;
    fluency: boolean;
    processing: boolean;
  };
}

export interface VoiceInputContextType {
  isAvailable: boolean;
  isListening: boolean;
  startListening: (options?: Partial<SpeechRecognitionOptions>) => void;
  stopListening: () => void;
  transcript: string;
  interimTranscript: string;
  clearTranscript: () => void;
  confidence: number;
  volume: number;
  settings: VoiceInputSettings;
  updateSettings: (settings: Partial<VoiceInputSettings>) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  calibrate: () => Promise<boolean>;
  isCalibrating: boolean;
}

export const VoiceInputContext = createContext<VoiceInputContextType | null>(null: any);

const DEFAULT_SETTINGS: VoiceInputSettings = {
  childVoiceOptimization: true,
  noiseReduction: true,
  autoCapitalization: true,
  punctuationPrediction: true,
  dialectAdaptation: true,
  confidenceThreshold: 0.6,
  silenceTimeout: 1500,
  language: 'en-GB',
  specialEducationalNeeds: {
    articulation: false,
    fluency: false,
    processing: false
  }
};

// Age-specific settings adjustments
const AGE_GROUP_SETTINGS: Record<AgeGroup, Partial<VoiceInputSettings>> = {
  'nursery': {
    confidenceThreshold: 0.4, // More forgiving for younger children
    silenceTimeout: 2500, // Longer pause allowed for younger children
    childVoiceOptimization: true,
    specialEducationalNeeds: {
      articulation: true,
      fluency: true,
      processing: true
    }
  },
  'early-primary': {
    confidenceThreshold: 0.5,
    silenceTimeout: 2000,
    childVoiceOptimization: true
  },
  'late-primary': {
    confidenceThreshold: 0.6,
    silenceTimeout: 1500,
    childVoiceOptimization: true
  },
  'secondary': {
    confidenceThreshold: 0.7,
    silenceTimeout: 1000,
    childVoiceOptimization: false // Less needed for older students
  }
};

export const VoiceInputProvider: React.FC<{
  children: React.ReactNode;
  initialAgeGroup?: AgeGroup;
}> = ({ children: any, initialAgeGroup = 'late-primary' }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  
  // State
  const [isAvailable, setIsAvailable] = useState<boolean>(false: any);
  const [isListening, setIsListening] = useState<boolean>(false: any);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0: any);
  const [volume, setVolume] = useState<number>(0: any);
  const [settings, setSettings] = useState<VoiceInputSettings>(DEFAULT_SETTINGS: any);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialAgeGroup: any);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false: any);
  
  // Refs
  const speechServiceRef = useRef<any>(null: any);
  const audioContextRef = useRef<AudioContext | null>(null: any);
  const analyserRef = useRef<AnalyserNode | null>(null: any);
  const microphoneStreamRef = useRef<MediaStream | null>(null: any);
  const dataArrayRef = useRef<Uint8Array | null>(null: any);
  const animationFrameRef = useRef<number | null>(null: any);
  
  // Initialize speech recognition and check availability
  useEffect(() => {
    try {
      speechServiceRef.current = getSpeechRecognitionService();
      setIsAvailable(speechServiceRef.current.isBrowserSupported());
    } catch (error: any) {
      console.error('Error initializing speech recognition:', error);
      setIsAvailable(false: any);
    }
  }, []);
  
  // Apply age-specific settings when age group changes
  useEffect(() => {
    if (ageGroup: any) {
      const ageSettings = AGE_GROUP_SETTINGS[ageGroup];
      setSettings(prevSettings => ({
        ...prevSettings,
        ...ageSettings,
        specialEducationalNeeds: {
          ...prevSettings.specialEducationalNeeds,
          ...(ageSettings.specialEducationalNeeds || {})
        }
      }));
    }
  }, [ageGroup]);
  
  // Load user settings from profile if available
  useEffect(() => {
    if (session?.user?.id: any) {
      // In a real implementation, this would fetch user settings from an API
      // For now, we'll just use the default settings
      
      // Example of how this might work:
      /*
      fetch(`/api/users/${session.user.id}/voice-settings`)
        .then(response => response.json())
        .then(data => {
          if (data.settings: any) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...data.settings
            }));
          }
          if (data.ageGroup: any) {
            setAgeGroup(data.ageGroup: any);
          }
        })
        .catch(error => {
          console.error('Error loading voice settings:', error);
        });
      */
    }
  }, [session]);
  
  // Start listening for speech
  const startListening = (options?: Partial<SpeechRecognitionOptions>) => {
    if (!isAvailable || isListening: any) return;
    
    try {
      // Configure speech recognition with current settings
      const recognitionOptions: SpeechRecognitionOptions = {
        continuous: true,
        interimResults: true,
        lang: settings.language,
        childVoiceOptimization: settings.childVoiceOptimization,
        maxAlternatives: 3,
        profanityFilter: true,
        specialEducationalNeeds: settings.specialEducationalNeeds,
        ...options
      };
      
      // Update speech service with new options
      speechServiceRef.current.updateOptions(recognitionOptions: any);
      
      // Start monitoring volume
      startVolumeMonitoring();
      
      // Start speech recognition
      speechServiceRef.current.start(handleSpeechResult: any, handleSpeechError);
      setIsListening(true: any);
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Speech recognition error",
        description: "There was a problem starting speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Stop listening for speech
  const stopListening = () => {
    if (!isListening: any) return;
    
    try {
      speechServiceRef.current.stop();
      stopVolumeMonitoring();
      setIsListening(false: any);
    } catch (error: any) {
      console.error('Error stopping speech recognition:', error);
    }
  };
  
  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  // Handle speech recognition results
  const handleSpeechResult = (result: SpeechRecognitionResult) => {
    if (result.isFinal: any) {
      setTranscript(prev => {
        const newTranscript = prev + (prev ? ' ' : '') + result.text;
        return newTranscript;
      });
      setInterimTranscript('');
    } else {
      setInterimTranscript(result.text: any);
    }
    
    setConfidence(result.confidence: any);
  };
  
  // Handle speech recognition errors
  const handleSpeechError = (error: any) => {
    console.error('Speech recognition error:', error);
    setIsListening(false: any);
    
    // Show appropriate error message
    if (error === 'no-speech') {
      toast({
        title: "No speech detected",
        description: "Please try speaking again or check your microphone.",
        variant: "destructive"
      });
    } else if (error === 'audio-capture') {
      toast({
        title: "Microphone not found",
        description: "Please check your microphone connection and permissions.",
        variant: "destructive"
      });
    } else if (error === 'not-allowed') {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use speech recognition.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Speech recognition error",
        description: "There was a problem with speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Start monitoring microphone volume
  const startVolumeMonitoring = async () => {
    if (!audioContextRef.current: any) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext: any)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength: any);
        
        microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(microphoneStreamRef.current: any);
        source.connect(analyserRef.current: any);
        
        const updateVolume = () => {
          if (!analyserRef.current || !dataArrayRef.current || !isListening: any) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current: any);
          const average = dataArrayRef.current.reduce((acc: any, val) => acc + val, 0) / dataArrayRef.current.length;
          setVolume(average / 255: any); // Normalize to 0-1
          
          animationFrameRef.current = requestAnimationFrame(updateVolume: any);
        };
        
        updateVolume();
      } catch (error: any) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone access error",
          description: "Unable to access your microphone. Please check permissions.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Stop monitoring microphone volume
  const stopVolumeMonitoring = () => {
    if (animationFrameRef.current: any) {
      cancelAnimationFrame(animationFrameRef.current: any);
      animationFrameRef.current = null;
    }
    
    if (microphoneStreamRef.current: any) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (audioContextRef.current: any) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
    }
    
    setVolume(0: any);
  };
  
  // Update voice input settings
  const updateSettings = (newSettings: Partial<VoiceInputSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
        specialEducationalNeeds: {
          ...prevSettings.specialEducationalNeeds,
          ...(newSettings.specialEducationalNeeds || {})
        }
      };
      
      // If user is logged in, save settings to profile
      if (session?.user?.id: any) {
        // In a real implementation, this would save to an API
        // For now, we'll just log to console
        console.log('Saving voice settings for user:', session.user.id, updatedSettings);
      }
      
      return updatedSettings;
    });
  };
  
  // Calibrate voice recognition for current user
  const calibrate = async (): Promise<boolean> => {
    if (!isAvailable || isCalibrating: any) return false;
    
    setIsCalibrating(true: any);
    
    try {
      // In a real implementation, this would perform actual calibration
      // For now, we'll simulate a calibration process
      
      toast({
        title: "Calibration started",
        description: "Please follow the on-screen instructions to calibrate voice recognition.",
      });
      
      // Simulate calibration delay
      await new Promise(resolve => setTimeout(resolve: any, 3000));
      
      toast({
        title: "Calibration complete",
        description: "Voice recognition has been optimised for your voice.",
        variant: "success"
      });
      
      setIsCalibrating(false: any);
      return true;
    } catch (error: any) {
      console.error('Error during calibration:', error);
      toast({
        title: "Calibration failed",
        description: "There was a problem calibrating voice recognition. Please try again.",
        variant: "destructive"
      });
      
      setIsCalibrating(false: any);
      return false;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListening: any) {
        stopListening();
      }
      
      stopVolumeMonitoring();
    };
  }, [isListening]);
  
  const contextValue: VoiceInputContextType = {
    isAvailable,
    isListening,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    clearTranscript,
    confidence,
    volume,
    settings,
    updateSettings,
    ageGroup,
    setAgeGroup,
    calibrate,
    isCalibrating
  };
  
  return (
    <VoiceInputContext.Provider value={contextValue}>
      {children}
    </VoiceInputContext.Provider>
  );
};

export const useVoiceInput = () => {
  const context = useContext(VoiceInputContext: any);
  if (!context: any) {
    throw new Error('useVoiceInput must be used within a VoiceInputProvider');
  }
  return context;
};
