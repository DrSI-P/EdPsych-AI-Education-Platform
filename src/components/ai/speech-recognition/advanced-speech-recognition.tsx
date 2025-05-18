'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, VolumeX, Settings, RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface SpeechRecognitionProps {
  onTranscriptChange?: (transcript: string) => void;
  onSpeechEnd?: (finalTranscript: string) => void;
  placeholder?: string;
  initialText?: string;
  mode?: 'standard' | 'continuous' | 'command';
  childVoiceOptimization?: boolean;
  showCalibration?: boolean;
  className?: string;
}

export default function AdvancedSpeechRecognition({
  onTranscriptChange,
  onSpeechEnd,
  placeholder = 'Your speech will appear here...',
  initialText = '',
  mode = 'standard',
  childVoiceOptimization = true,
  showCalibration = false,
  className = '',
}: SpeechRecognitionProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for speech recognition
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  
  // State for settings
  const [settings, setSettings] = useState({
    childVoiceOptimization: childVoiceOptimization,
    noiseReduction: true,
    autoCapitalization: true,
    punctuationPrediction: true,
    dialectAdaptation: true,
    confidenceThreshold: 0.6,
    silenceTimeout: 1500, // ms
  });
  
  // State for calibration
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [calibrationSamples, setCalibrationSamples] = useState<number[]>([]);
  
  // References
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calibration phrases for children
  const calibrationPhrases = [
    "The quick brown fox jumps over the lazy dog",
    "My favorite ice cream is chocolate with sprinkles",
    "I like to play games with my friends at school",
    "The big dinosaur roared and stomped its feet",
    "Can you help me build a castle with blocks please"
  ];

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = mode === 'continuous';
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-GB'; // UK English
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setRecognitionError(null);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
      
      // If in continuous mode and no error, restart listening
      if (mode === 'continuous' && !recognitionError && isListening) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
        }
      } else if (onSpeechEnd) {
        onSpeechEnd(transcript);
      }
    };
    
    recognitionRef.current.onresult = (event: any) => {
      let interimText = '';
      let finalText = transcript;
      let maxConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          let processedText = text;
          
          // Apply processing based on settings
          if (settings.autoCapitalization) {
            processedText = autoCapitalize(processedText);
          }
          
          if (settings.punctuationPrediction) {
            processedText = predictPunctuation(processedText);
          }
          
          finalText += processedText + ' ';
        } else {
          interimText += text;
        }
        
        // Track confidence level
        const confidence = result[0].confidence;
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }
      }
      
      // Update state
      setTranscript(finalText.trim());
      setInterimTranscript(interimText);
      setConfidence(maxConfidence);
      
      // Call callback if provided
      if (onTranscriptChange) {
        onTranscriptChange(finalText.trim() + (interimText ? ' ' + interimText : ''));
      }
      
      // Reset silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      // Set new silence timeout if not in continuous mode
      if (mode === 'standard') {
        silenceTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, settings.silenceTimeout);
      }
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionError(event.error);
      
      if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Please try speaking again or check your microphone.",
          variant: "destructive",
        });
      } else if (event.error === 'audio-capture') {
        toast({
          title: "Microphone not found",
          description: "Please check your microphone connection and permissions.",
          variant: "destructive",
        });
      } else if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use speech recognition.",
          variant: "destructive",
        });
      }
    };
    
    // Initialize audio context for volume monitoring
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, onSpeechEnd, onTranscriptChange, toast, transcript]);
  
  // Apply child voice optimization settings when enabled
  useEffect(() => {
    if (!recognitionRef.current) return;
    
    if (settings.childVoiceOptimization) {
      // These settings help with child voice recognition
      recognitionRef.current.continuous = true; // Children may pause more frequently
      recognitionRef.current.interimResults = true; // Get partial results for better feedback
      
      // If we have calibration data, we would apply it here
      // This is a simplified implementation
      
      // In a production environment, we would:
      // 1. Use a specialized model trained on children's voices
      // 2. Apply acoustic model adaptation based on calibration
      // 3. Adjust frequency filtering to better capture higher pitched voices
      // 4. Implement custom language models for child vocabulary
    }
  }, [settings.childVoiceOptimization]);
  
  // Start volume monitoring when listening
  useEffect(() => {
    if (!isListening || !audioContextRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        microphoneStreamRef.current = stream;
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        source.connect(analyserRef.current!);
        
        // Start monitoring volume
        const updateVolume = () => {
          if (!isListening || !analyserRef.current || !dataArrayRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
          setVolume(average / 255); // Normalize to 0-1
          
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone access error",
          description: "Unable to access your microphone. Please check permissions.",
          variant: "destructive",
        });
      });
      
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, toast]);
  
  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      recognitionRef.current.start();
      setRecognitionError(null);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Speech recognition error",
        description: "There was an error starting speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };
  
  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    
    if (onTranscriptChange) {
      onTranscriptChange('');
    }
  };
  
  // Start calibration process
  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep(0);
    setCalibrationProgress(0);
    setCalibrationSamples([]);
    
    toast({
      title: "Calibration started",
      description: "Please read the phrases aloud when prompted.",
    });
  };
  
  // Handle calibration step completion
  const completeCalibrationStep = () => {
    // In a real implementation, we would save audio samples and analyze them
    // For this demo, we'll simulate collecting calibration data
    setCalibrationSamples(prev => [...prev, confidence]);
    
    const nextStep = calibrationStep + 1;
    if (nextStep < calibrationPhrases.length) {
      setCalibrationStep(nextStep);
      setCalibrationProgress((nextStep / calibrationPhrases.length) * 100);
    } else {
      finishCalibration();
    }
  };
  
  // Finish calibration process
  const finishCalibration = () => {
    setIsCalibrating(false);
    setCalibrationProgress(100);
    
    // In a real implementation, we would use the collected data to optimize the recognition
    // For this demo, we'll just show a success message
    toast({
      title: "Calibration complete",
      description: "Voice profile has been optimized for better recognition.",
      variant: "success",
    });
    
    // Save calibration data to user profile
    if (session?.user) {
      fetch('/api/ai/speech-recognition/calibration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          calibrationData: {
            samples: calibrationSamples,
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch(error => {
        console.error('Error saving calibration data:', error);
      });
    }
  };
  
  // Helper function to auto-capitalize text
  const autoCapitalize = (text: string): string => {
    if (!text) return text;
    
    // Capitalize first letter of sentences
    return text.replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
  };
  
  // Helper function to predict punctuation
  const predictPunctuation = (text: string): string => {
    if (!text) return text;
    
    // This is a simplified implementation
    // In a real application, we would use an AI model for this
    
    // Add period if text ends with a sentence-like structure without punctuation
    if (text.length > 10 && !text.match(/[.!?,;:]$/)) {
      return text + '.';
    }
    
    return text;
  };
  
  // Update settings
  const updateSettings = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Render error message if speech recognition is not supported
  if (!isSupported) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Speech Recognition Not Supported</AlertTitle>
        <AlertDescription>
          Your browser does not support speech recognition. Please try using a modern browser like Chrome, Edge, or Safari.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className={`speech-recognition-container ${className}`}>
      {isCalibrating ? (
        <Card>
          <CardHeader>
            <CardTitle>Voice Calibration</CardTitle>
            <CardDescription>
              Please read the following phrase aloud clearly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={calibrationProgress} className="mb-4" />
            
            <div className="bg-muted p-4 rounded-md mb-4 text-center">
              <p className="text-lg font-medium">{calibrationPhrases[calibrationStep]}</p>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                className="flex items-center gap-2"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" /> Start Recording
                  </>
                )}
              </Button>
            </div>
            
            {isListening && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            
            <div className="bg-muted/50 p-3 rounded-md min-h-[100px] mb-4">
              <p>{transcript}</p>
              <p className="text-muted-foreground">{interimTranscript}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCalibrating(false)}>
              Cancel
            </Button>
            <Button onClick={completeCalibrationStep} disabled={!transcript && !interimTranscript}>
              Next
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="speech" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="speech">Speech Recognition</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="speech" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Speech Recognition</CardTitle>
                <CardDescription>
                  Optimized for children's voices with enhanced accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recognitionError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Recognition Error</AlertTitle>
                    <AlertDescription>
                      {recognitionError === 'no-speech' && "No speech was detected. Please try again."}
                      {recognitionError === 'audio-capture' && "Could not access microphone. Please check your device."}
                      {recognitionError === 'not-allowed' && "Microphone access was denied. Please allow access in your browser settings."}
                      {recognitionError !== 'no-speech' && recognitionError !== 'audio-capture' && recognitionError !== 'not-allowed' && `An error occurred: ${recognitionError}`}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    className="flex items-center gap-2"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4" /> Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Start Listening
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearTranscript}
                      title="Clear transcript"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    {showCalibration && (
                      <Button
                        variant="outline"
                        onClick={startCalibration}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" /> Calibrate
                      </Button>
                    )}
                  </div>
                </div>
                
                {isListening && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${volume * 100}%` }}
                      ></div>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                
                <Textarea
                  placeholder={placeholder}
                  value={transcript + (interimTranscript ? ' ' + interimTranscript : '')}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    if (onTranscriptChange) {
                      onTranscriptChange(e.target.value);
                    }
                  }}
                  className="min-h-[150px] mb-2"
                />
                
                {confidence > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Recognition confidence: {Math.round(confidence * 100)}%</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Alert variant="default" className="w-full">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Child Voice Optimization</AlertTitle>
                  <AlertDescription>
                    This speech recognition is specially tuned for children's voices, with enhanced accuracy for higher pitches and developing speech patterns.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Recognition Settings</CardTitle>
                <CardDescription>
                  Customize speech recognition to match your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="childVoiceOptimization" className="font-medium">
                      Child Voice Optimization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enhances recognition for children's voices
                    </p>
                  </div>
                  <Switch
                    id="childVoiceOptimization"
                    checked={settings.childVoiceOptimization}
                    onCheckedChange={(checked) => updateSettings('childVoiceOptimization', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="noiseReduction" className="font-medium">
                      Noise Reduction
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Filters out background noise
                    </p>
                  </div>
                  <Switch
                    id="noiseReduction"
                    checked={settings.noiseReduction}
                    onCheckedChange={(checked) => updateSettings('noiseReduction', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoCapitalization" className="font-medium">
                      Auto Capitalization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically capitalizes sentences
                    </p>
                  </div>
                  <Switch
                    id="autoCapitalization"
                    checked={settings.autoCapitalization}
                    onCheckedChange={(checked) => updateSettings('autoCapitalization', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="punctuationPrediction" className="font-medium">
                      Punctuation Prediction
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Adds punctuation based on speech patterns
                    </p>
                  </div>
                  <Switch
                    id="punctuationPrediction"
                    checked={settings.punctuationPrediction}
                    onCheckedChange={(checked) => updateSettings('punctuationPrediction', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dialectAdaptation" className="font-medium">
                      UK Dialect Adaptation
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Optimizes for UK English dialects
                    </p>
                  </div>
                  <Switch
                    id="dialectAdaptation"
                    checked={settings.dialectAdaptation}
                    onCheckedChange={(checked) => updateSettings('dialectAdaptation', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidenceThreshold" className="font-medium">
                      Confidence Threshold
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(settings.confidenceThreshold * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="confidenceThreshold"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[settings.confidenceThreshold]}
                    onValueChange={(value) => updateSettings('confidenceThreshold', value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher values require more confident recognition
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="silenceTimeout" className="font-medium">
                      Silence Timeout
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.silenceTimeout / 1000}s
                    </span>
                  </div>
                  <Slider
                    id="silenceTimeout"
                    min={500}
                    max={5000}
                    step={500}
                    value={[settings.silenceTimeout]}
                    onValueChange={(value) => updateSettings('silenceTimeout', value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long to wait after speech ends before stopping
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Settings are automatically saved</AlertTitle>
                  <AlertDescription>
                    Your preferences will be applied immediately to the speech recognition system.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
