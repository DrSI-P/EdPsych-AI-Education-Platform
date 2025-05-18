'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

export default function AccessibilityControls() {
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
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandFeedback, setCommandFeedback] = useState('');
  
  // Initialize speech recognition and synthesis (simulated)
  useEffect(() => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate the functionality
    const simulateSpeechRecognition = () => {
      return {
        start: () => {
          console.log('Speech recognition started');
          setIsListening(true);
        },
        stop: () => {
          console.log('Speech recognition stopped');
          setIsListening(false);
        },
        onresult: null as any,
        onerror: null as any
      };
    };
    
    const simulateSpeechSynthesis = () => {
      return {
        speak: (text: string) => {
          console.log('Speaking:', text);
          // In a real implementation, this would use the SpeechSynthesis API
        },
        cancel: () => {
          console.log('Speech cancelled');
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
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);
  
  const startVoiceRecognition = () => {
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
  
  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const processVoiceCommand = (command: string) => {
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
  
  const speakText = (text: string) => {
    if (synthesisRef.current) {
      synthesisRef.current.speak(text);
    }
  };
  
  const resetSettings = () => {
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
            Customize your experience to meet your individual needs and preferences.
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
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="text-size">Text Size ({textSize}%)</Label>
                    <div className="flex items-center space-x-2">
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
                  <div className="flex justify-between items-center mb-2">
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
                
                <div className="flex items-center justify-between">
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
                
                <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between">
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
                
                <div className="flex items-center justify-between">
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
                      <div className="flex justify-between items-center mb-2">
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
                      <div className="flex justify-between items-center mb-2">
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-recognition">Voice Recognition</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the platform using voice commands
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
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Available Voice Commands:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>"Increase/decrease text size"</li>
                        <li>"Enable/disable high contrast"</li>
                        <li>"Enable/disable dyslexia font"</li>
                        <li>"Go to [page name]"</li>
                        <li>"Read this page"</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      {!isListening ? (
                        <Button 
                          onClick={startVoiceRecognition}
                          className="w-full"
                        >
                          Start Voice Recognition
                        </Button>
                      ) : (
                        <Button 
                          variant="destructive" 
                          onClick={stopVoiceRecognition}
                          className="w-full"
                        >
                          Stop Listening
                        </Button>
                      )}
                    </div>
                    
                    {isListening && (
                      <div className="bg-primary/10 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="h-3 w-3 rounded-full bg-primary animate-pulse mr-2"></div>
                          <span className="font-medium">Listening...</span>
                        </div>
                        {transcript && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Heard:</p>
                            <p className="text-sm">{transcript}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {commandFeedback && !isListening && (
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm font-medium">Last action:</p>
                        <p className="text-sm">{commandFeedback}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="motor" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Keyboard Navigation:</h4>
                  <p className="text-sm mb-2">
                    This platform supports full keyboard navigation. Use Tab to move between elements and Enter to activate them.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li><kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> - Move to next element</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Shift + Tab</kbd> - Move to previous element</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> - Activate current element</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Space</kbd> - Toggle checkboxes and buttons</li>
                    <li><kbd className="px-2 py-1 bg-background rounded border">Arrow Keys</kbd> - Navigate within components</li>
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="extended-timeout">Extended Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Extends timeout periods for forms and sessions
                    </p>
                  </div>
                  <Switch
                    id="extended-timeout"
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sticky-keys">Sticky Keys</Label>
                    <p className="text-sm text-muted-foreground">
                      Allows modifier keys to be pressed one at a time
                    </p>
                  </div>
                  <Switch
                    id="sticky-keys"
                    checked={false}
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={() => {
            toast({
              title: "Settings Saved",
              description: "Your accessibility preferences have been saved.",
            });
          }}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              See how your content will appear with the current settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`
                preview-content 
                ${highContrastMode ? 'high-contrast-mode' : ''} 
                ${dyslexiaFont ? 'dyslexia-font' : ''}
              `}
              style={{
                fontSize: `${textSize}%`,
                lineHeight: `${lineSpacing}%`
              }}
            >
              <h2 className="text-xl font-bold mb-4">Sample Content</h2>
              <p className="mb-4">
                This is a preview of how content will appear with your current accessibility settings. 
                The text size, line spacing, and other visual preferences you've selected are applied here.
              </p>
              <p className="mb-4">
                EdPsych Connect is committed to making education accessible to all learners, 
                regardless of their individual needs or learning styles. Our platform adapts to you, 
                not the other way around.
              </p>
              <h3 className="text-lg font-bold mb-2">Key Features:</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Personalized learning paths based on individual starting points</li>
                <li>Systematic curriculum coverage to minimize learning gaps</li>
                <li>Content adaptation based on interests to maximize motivation</li>
                <li>Support for diverse learning needs and styles</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
