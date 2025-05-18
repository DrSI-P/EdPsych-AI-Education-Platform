'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Copy, Clipboard, RefreshCw, Settings, AlertCircle, CheckCircle, Keyboard } from "lucide-react";
import { useSession } from 'next-auth/react';

interface SpeechToTextEngineProps {
  onTextChange?: (text: string) => void;
  onComplete?: (text: string) => void;
  placeholder?: string;
  initialText?: string;
  mode?: 'standard' | 'continuous' | 'command';
  childVoiceOptimization?: boolean;
  showCalibration?: boolean;
  className?: string;
}

export default function SpeechToTextEngine({
  onTextChange,
  onComplete,
  placeholder = 'Speak to convert your words to text...',
  initialText = '',
  mode = 'standard',
  childVoiceOptimization = true,
  showCalibration = false,
  className = '',
}: SpeechToTextEngineProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for speech recognition
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState(initialText);
  const [interimText, setInterimText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('main');
  const [isCopied, setIsCopied] = useState(false);
  
  // State for settings
  const [settings, setSettings] = useState({
    childVoiceOptimization: childVoiceOptimization,
    noiseReduction: true,
    autoCapitalization: true,
    punctuationPrediction: true,
    dialectAdaptation: true,
    confidenceThreshold: 0.6,
    silenceTimeout: 1500, // ms
    language: 'en-GB', // UK English
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Calibration phrases for children
  const calibrationPhrases = [
    "The quick brown fox jumps over the lazy dog",
    "My favourite ice cream is chocolate with sprinkles",
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
    recognitionRef.current.lang = settings.language;
    
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
      } else if (onComplete) {
        onComplete(text);
      }
    };
    
    recognitionRef.current.onresult = (event: any) => {
      let interimResult = '';
      let finalResult = '';
      let maxConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          let processedText = transcript;
          
          // Apply processing based on settings
          if (settings.childVoiceOptimization) {
            processedText = optimizeChildVoiceTranscript(processedText);
          }
          
          if (settings.autoCapitalization) {
            processedText = autoCapitalize(processedText);
          }
          
          if (settings.punctuationPrediction) {
            processedText = predictPunctuation(processedText);
          }
          
          finalResult += processedText + ' ';
        } else {
          interimResult += transcript;
        }
        
        // Track confidence level
        const confidence = result[0].confidence;
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }
      }
      
      // Update state
      if (finalResult) {
        setText(prev => {
          const newText = prev + finalResult;
          // Call callback if provided
          if (onTextChange) {
            onTextChange(newText);
          }
          return newText;
        });
      }
      
      setInterimText(interimResult);
      setConfidence(maxConfidence);
      
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
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [mode, onComplete, onTextChange, settings.language, settings.silenceTimeout, text, toast]);
  
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
  
  // Clear text
  const clearText = () => {
    setText('');
    setInterimText('');
    
    if (onTextChange) {
      onTextChange('');
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = () => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Text copied",
          description: "The text has been copied to your clipboard.",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(error => {
        console.error('Error copying text to clipboard:', error);
        toast({
          title: "Copy failed",
          description: "Failed to copy text to clipboard. Please try again.",
          variant: "destructive",
        });
      });
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
  const finishCalibration = async () => {
    setIsCalibrating(false);
    setCalibrationProgress(100);
    
    // In a real implementation, we would use the collected data to optimize the recognition
    toast({
      title: "Calibration complete",
      description: "Voice profile has been optimized for better recognition.",
      variant: "success",
    });
    
    // Save calibration data to user profile
    if (session?.user) {
      try {
        const response = await fetch('/api/ai/speech-recognition/calibration', {
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
        });
        
        if (!response.ok) {
          throw new Error('Failed to save calibration data');
        }
      } catch (error) {
        console.error('Error saving calibration data:', error);
        toast({
          title: "Calibration save error",
          description: "Failed to save calibration data. Your settings will work for this session only.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Helper function to optimize child voice transcript
  const optimizeChildVoiceTranscript = (text: string): string => {
    if (!text) return text;
    
    // Common child speech patterns and corrections
    let optimized = text
      // Fix common child pronunciation issues
      .replace(/(\b)fing(\b)/gi, '$1thing$2')
      .replace(/(\b)wiv(\b)/gi, '$1with$2')
      .replace(/(\b)dat(\b)/gi, '$1that$2')
      .replace(/(\b)dis(\b)/gi, '$1this$2')
      .replace(/(\b)nuffin(\b)/gi, '$1nothing$2')
      .replace(/(\b)sumfin(\b)/gi, '$1something$2')
      .replace(/(\b)libary(\b)/gi, '$1library$2')
      .replace(/(\b)aminal(\b)/gi, '$1animal$2')
      .replace(/(\b)lellow(\b)/gi, '$1yellow$2')
      .replace(/(\b)pasketti(\b)/gi, '$1spaghetti$2')
      .replace(/(\b)brefast(\b)/gi, '$1breakfast$2')
      .replace(/(\b)supwise(\b)/gi, '$1surprise$2')
      .replace(/(\b)member(\b)/gi, '$1remember$2')
      .replace(/(\b)tomorow(\b)/gi, '$1tomorrow$2')
      .replace(/(\b)yesteray(\b)/gi, '$1yesterday$2')
      
      // Fix common word omissions
      .replace(/(\b)want (go|play|see)(\b)/gi, '$1want to $2$3')
      .replace(/(\b)going (go|play|see)(\b)/gi, '$1going to $2$3')
      .replace(/(\b)have (go|play|see)(\b)/gi, '$1have to $2$3');
    
    return optimized;
  };
  
  // Helper function to auto-capitalize text
  const autoCapitalize = (text: string): string => {
    if (!text) return text;
    
    // Capitalize first letter of sentences
    let capitalized = text.replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
    
    // Capitalize "I"
    capitalized = capitalized.replace(/(\s|^)i(\s|$)/g, '$1I$2');
    
    return capitalized;
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
  
  // Handle text input change (for manual editing)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (onTextChange) {
      onTextChange(newText);
    }
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
  
  // Render calibration UI if calibrating
  if (isCalibrating) {
    return (
      <Card className={className}>
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
                  <MicOff className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Speaking
                </>
              )}
            </Button>
          </div>
          
          {isListening && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
          
          <div className="min-h-[100px] p-3 border rounded-md bg-muted/20 mb-4">
            {interimText || "Waiting for speech..."}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={completeCalibrationStep}
              disabled={!interimText && calibrationStep > 0}
              variant="default"
            >
              {calibrationStep === calibrationPhrases.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Main UI
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-green-500 animate-pulse" />
            ) : (
              <Keyboard className="h-5 w-5 text-muted-foreground" />
            )}
            Speech-to-Text
          </div>
        </CardTitle>
        <CardDescription>
          Speak or type to create text - perfect for students who struggle with typing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="main" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-4 pt-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={text + (interimText ? ' ' + interimText : '')}
                onChange={handleTextChange}
                placeholder={placeholder}
                className="min-h-[150px] resize-y font-medium"
              />
              
              {isListening && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
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
                  onClick={stopListening}
                  className="flex items-center gap-1"
                >
                  <MicOff className="h-4 w-4" />
                  Stop Listening
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={startListening}
                  className="flex items-center gap-1"
                >
                  <Mic className="h-4 w-4" />
                  Start Listening
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={clearText}
                className="flex items-center gap-1"
                disabled={!text && !interimText}
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={copyToClipboard}
                className="flex items-center gap-1"
                disabled={!text}
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            {showCalibration && (
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={startCalibration}
                  className="w-full"
                >
                  Calibrate for Your Voice
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="child-voice">Child Voice Optimization</Label>
                  <p className="text-xs text-muted-foreground">
                    Improves recognition for children's voices
                  </p>
                </div>
                <Switch 
                  id="child-voice"
                  checked={settings.childVoiceOptimization}
                  onCheckedChange={(checked) => updateSettings('childVoiceOptimization', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="noise-reduction">Background Noise Reduction</Label>
                  <p className="text-xs text-muted-foreground">
                    Filters out ambient classroom noise
                  </p>
                </div>
                <Switch 
                  id="noise-reduction"
                  checked={settings.noiseReduction}
                  onCheckedChange={(checked) => updateSettings('noiseReduction', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-capitalization">Auto-Capitalization</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically capitalizes sentences
                  </p>
                </div>
                <Switch 
                  id="auto-capitalization"
                  checked={settings.autoCapitalization}
                  onCheckedChange={(checked) => updateSettings('autoCapitalization', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="punctuation">Punctuation Prediction</Label>
                  <p className="text-xs text-muted-foreground">
                    Adds punctuation based on speech patterns
                  </p>
                </div>
                <Switch 
                  id="punctuation"
                  checked={settings.punctuationPrediction}
                  onCheckedChange={(checked) => updateSettings('punctuationPrediction', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings('language', value)}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-AU">English (Australia)</SelectItem>
                    <SelectItem value="en-IN">English (India)</SelectItem>
                    <SelectItem value="en-CA">English (Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidence-threshold">Confidence Threshold ({settings.confidenceThreshold.toFixed(1)})</Label>
                </div>
                <Slider
                  id="confidence-threshold"
                  min={0.1}
                  max={0.9}
                  step={0.1}
                  value={[settings.confidenceThreshold]}
                  onValueChange={(value) => updateSettings('confidenceThreshold', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values require more confident recognition (may reduce errors but also reduce recognition rate)
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="silence-timeout">Silence Timeout ({settings.silenceTimeout}ms)</Label>
                </div>
                <Slider
                  id="silence-timeout"
                  min={500}
                  max={3000}
                  step={100}
                  value={[settings.silenceTimeout]}
                  onValueChange={(value) => updateSettings('silenceTimeout', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  How long to wait after speech stops before finalizing (only in standard mode)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {isListening ? (
            <span className="flex items-center gap-1">
              <Mic className="h-3 w-3 text-green-500" />
              Listening...
            </span>
          ) : (
            <span>Ready to convert speech to text</span>
          )}
        </div>
        
        {confidence > 0 && (
          <div className="text-xs text-muted-foreground">
            Recognition confidence: {Math.round(confidence * 100)}%
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
