'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

// Define proper types instead of using 'any'
interface SpeechRecognition {
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
}

interface SpeechSynthesis {
  speak: (text: string) => void;
  cancel: () => void;
}

export default function AccessibilityControls(): React.ReactElement {
  const { toast } = useToast();
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [textToSpeechActive, setTextToSpeechActive] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [lineSpacing, setLineSpacing] = useState(150);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [activeTab, setActiveTab] = useState('visual');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandFeedback, setCommandFeedback] = useState('');
  
  // Initialize speech recognition and synthesis (simulated)
  useEffect(() => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate the functionality
    const simulateSpeechRecognition = (): SpeechRecognition => {
      return {
        start: () => {
          // Removed console.log
          setIsListening(true);
        },
        stop: () => {
          // Removed console.log
          setIsListening(false);
        },
        onresult: null,
        onerror: null
      };
    };
    
    const simulateSpeechSynthesis = (): SpeechSynthesis => {
      return {
        speak: (text: string) => {
          // Removed console.log
          // In a real implementation, this would use the SpeechSynthesis API
        },
        cancel: () => {
          // Removed console.log
        }
      };
    };
    
    recognitionRef.current = simulateSpeechRecognition();
    synthesisRef.current = simulateSpeechSynthesis();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);
  
  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply text size
    root.style.setProperty('--accessibility-text-size', `${textSize}%`);
    
    // Apply line spacing
    root.style.setProperty('--accessibility-line-spacing', `${lineSpacing}%`);
    
    // Apply high contrast mode
    if (highContrastMode) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    
    // Apply dyslexia-friendly font
    if (dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    // Save settings to localStorage
    const settings = {
      textSize,
      lineSpacing,
      highContrastMode,
      dyslexiaFont,
      reducedMotion,
      voiceRecognitionActive,
      textToSpeechActive,
      speechRate,
      speechPitch
    };
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
  }, [textSize, lineSpacing, highContrastMode, dyslexiaFont, reducedMotion, voiceRecognitionActive, textToSpeechActive, speechRate, speechPitch]);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTextSize(settings.textSize || 100);
        setLineSpacing(settings.lineSpacing || 150);
        setHighContrastMode(settings.highContrastMode || false);
        setDyslexiaFont(settings.dyslexiaFont || false);
        setReducedMotion(settings.reducedMotion || false);
        setVoiceRecognitionActive(settings.voiceRecognitionActive || false);
        setTextToSpeechActive(settings.textToSpeechActive || false);
        setSpeechRate(settings.speechRate || 1);
        setSpeechPitch(settings.speechPitch || 1);
      } catch (error) {
        // Removed console.error
        // Handle error silently or use toast for user feedback
        toast({
          title: "Error",
          description: "Failed to load accessibility settings. Default values will be used.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);
  
  const startVoiceRecognition = (): void => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      
      // Simulate receiving voice command after 3 seconds
      setTimeout(() => {
        const simulatedCommands = [
          'increase text size',
          'enable high contrast',
          'go to dashboard',
          'read this page',
          'open learning styles'
        ];
        
        const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
        setTranscript(randomCommand);
        
        // Process the command
        processVoiceCommand(randomCommand);
        
        // Stop listening after processing
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 3000);
    }
  };
  
  const stopVoiceRecognition = (): void => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const processVoiceCommand = (command: string): void => {
    const lowerCommand = command.toLowerCase();
    
    // Text size commands
    if (lowerCommand.includes('increase text size') || lowerCommand.includes('larger text')) {
      setTextSize(prev => Math.min(prev + 10, 200));
      setCommandFeedback('Text size increased');
    } 
    else if (lowerCommand.includes('decrease text size') || lowerCommand.includes('smaller text')) {
      setTextSize(prev => Math.max(prev - 10, 70));
      setCommandFeedback('Text size decreased');
    }
    
    // Contrast commands
    else if (lowerCommand.includes('enable high contrast') || lowerCommand.includes('high contrast on')) {
      setHighContrastMode(true);
      setCommandFeedback('High contrast mode enabled');
    }
    else if (lowerCommand.includes('disable high contrast') || lowerCommand.includes('high contrast off')) {
      setHighContrastMode(false);
      setCommandFeedback('High contrast mode disabled');
    }
    
    // Font commands
    else if (lowerCommand.includes('enable dyslexia font') || lowerCommand.includes('dyslexia font on')) {
      setDyslexiaFont(true);
      setCommandFeedback('Dyslexia-friendly font enabled');
    }
    else if (lowerCommand.includes('disable dyslexia font') || lowerCommand.includes('dyslexia font off')) {
      setDyslexiaFont(false);
      setCommandFeedback('Dyslexia-friendly font disabled');
    }
    
    // Navigation commands
    else if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      const destination = lowerCommand.replace('go to', '').replace('navigate to', '').trim();
      setCommandFeedback(`Navigating to ${destination}`);
      
      // In a real implementation, this would use router.push() to navigate
      // For now, we'll just show feedback
    }
    
    // Read page commands
    else if (lowerCommand.includes('read this page') || lowerCommand.includes('read page')) {
      setCommandFeedback('Reading page content');
      
      // In a real implementation, this would use the SpeechSynthesis API to read the page content
      // For now, we'll just show feedback
    }
    
    // Unknown command
    else {
      setCommandFeedback('Sorry, I didn\'t understand that command');
    }
    
    // Show toast with feedback
    toast({
      title: "Voice Command",
      description: commandFeedback,
    });
  };
  
  const speakText = (text: string): void => {
    if (synthesisRef.current) {
      synthesisRef.current.speak(text);
    }
  };
  
  const resetSettings = (): void => {
    setTextSize(100);
    setLineSpacing(150);
    setHighContrastMode(false);
    setDyslexiaFont(false);
    setReducedMotion(false);
    setSpeechRate(1);
    setSpeechPitch(1);
    
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to default values.",
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Controls</CardTitle>
          <CardDescription>
            Customise your experience to meet your individual needs and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visual" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="voice">Voice Control</TabsTrigger>
              <TabsTrigger value="motor">Motor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <Label htmlFor="text-size">Text Size ({textSize}%)</Label>
                    <div className="flex items-centre space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTextSize(prev => Math.max(prev - 10, 70))}
                      >
                        A-
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTextSize(prev => Math.min(prev + 10, 200))}
                      >
                        A+
                      </Button>
                    </div>
                  </div>
                  <Slider
                    id="text-size"
                    min={70}
                    max={200}
                    step={5}
                    value={[textSize]}
                    onValueChange={(value) => setTextSize(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <Label htmlFor="line-spacing">Line Spacing ({lineSpacing}%)</Label>
                  </div>
                  <Slider
                    id="line-spacing"
                    min={100}
                    max={250}
                    step={10}
                    value={[lineSpacing]}
                    onValueChange={(value) => setLineSpacing(value[0])}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increases contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrastMode}
                    onCheckedChange={setHighContrastMode}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimizes animations and transitions
                    </p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reading" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                    <p className="text-sm text-muted-foreground">
                      Uses a font designed for readers with dyslexia
                    </p>
                  </div>
                  <Switch
                    id="dyslexia-font"
                    checked={dyslexiaFont}
                    onCheckedChange={setDyslexiaFont}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                    <p className="text-sm text-muted-foreground">
                      Reads text content aloud
                    </p>
                  </div>
                  <Switch
                    id="text-to-speech"
                    checked={textToSpeechActive}
                    onCheckedChange={setTextToSpeechActive}
                  />
                </div>
                
                {textToSpeechActive && (
                  <>
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <Label htmlFor="speech-rate">Speech Rate ({speechRate.toFixed(1)}x)</Label>
                      </div>
                      <Slider
                        id="speech-rate"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[speechRate]}
                        onValueChange={(value) => setSpeechRate(value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <Label htmlFor="speech-pitch">Speech Pitch ({speechPitch.toFixed(1)})</Label>
                      </div>
                      <Slider
                        id="speech-pitch"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[speechPitch]}
                        onValueChange={(value) => setSpeechPitch(value[0])}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => speakText("This is a test of the text-to-speech feature. You can adjust the rate and pitch to suit your preferences.")}
                      >
                        Test Text-to-Speech
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-recognition">Voice Recognition</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the interface with voice commands
                    </p>
                  </div>
                  <Switch
                    id="voice-recognition"
                    checked={voiceRecognitionActive}
                    onCheckedChange={setVoiceRecognitionActive}
                  />
                </div>
                
                {voiceRecognitionActive && (
                  <>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Voice Commands</h3>
                      <ul className="space-y-1 text-sm">
                        <li>&quot;Increase/decrease text size&quot;</li>
                        <li>&quot;Enable/disable high contrast&quot;</li>
                        <li>&quot;Enable/disable dyslexia font&quot;</li>
                        <li>&quot;Go to [page name]&quot;</li>
                        <li>&quot;Read this page&quot;</li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant={isListening ? "destructive" : "default"}
                        onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                      >
                        {isListening ? "Stop Listening" : "Start Voice Recognition"}
                      </Button>
                      
                      {isListening && (
                        <div className="text-center animate-pulse text-primary">
                          Listening...
                        </div>
                      )}
                      
                      {transcript && (
                        <div className="bg-muted p-3 rounded-lg mt-2">
                          <p className="font-medium">Heard:</p>
                          <p className="text-sm">{transcript}</p>
                          {commandFeedback && (
                            <p className="text-sm text-primary mt-1">
                              {commandFeedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="motor" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="keyboard-navigation">Enhanced Keyboard Navigation</Label>
                    <p className="text-sm text-muted-foreground">
                      Improves focus indicators and keyboard shortcuts
                    </p>
                  </div>
                  <Switch
                    id="keyboard-navigation"
                    checked={false}
                    onCheckedChange={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Enhanced keyboard navigation will be available in a future update.",
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-click">Auto-Click</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically clicks after hovering for a set time
                    </p>
                  </div>
                  <Switch
                    id="auto-click"
                    checked={false}
                    onCheckedChange={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Auto-click feature will be available in a future update.",
                      });
                    }}
                  />
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    More motor accessibility features coming soon.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
