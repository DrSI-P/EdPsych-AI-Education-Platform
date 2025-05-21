'use client';

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '@/providers/voice-input-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, X, Minimize2, Maximize2, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AgeGroup } from '@/providers/voice-input-provider';

/**
 * Global Voice Input Component
 * 
 * A floating, accessible voice input component that can be toggled from anywhere
 * in the application. Designed to be discoverable and usable by children who
 * struggle with typing.
 */
const GlobalVoiceInput: React.FC = () => {
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening,
    transcript,
    interimTranscript,
    clearTranscript,
    volume,
    ageGroup,
    setAgeGroup,
    settings,
    updateSettings,
    calibrate
  } = useVoiceInput();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Load position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('voiceInputPosition');
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error('Error loading voice input position:', e);
      }
    } else {
      // Default position based on screen size
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 200
      });
    }
    
    // Check if the component has been used before
    const used = localStorage.getItem('voiceInputUsed') === 'true';
    setHasBeenUsed(used);
    
    // Show tutorial if it's the first time
    if (!used) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 3000);
    }
  }, []);
  
  // Save position to localStorage when it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('voiceInputPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
  };
  
  // Handle drag
  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Handle mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      
      // Mark as used
      if (!hasBeenUsed) {
        setHasBeenUsed(true);
        localStorage.setItem('voiceInputUsed', 'true');
      }
    }
  };
  
  // Toggle open state
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  // Close tutorial
  const closeTutorial = () => {
    setShowTutorial(false);
  };
  
  // Render appropriate button based on age group
  const renderButton = () => {
    if (!isOpen) {
      switch (ageGroup) {
        case 'nursery':
          return (
            <motion.button
              className="w-16 h-16 rounded-full bg-purple-500 text-white shadow-lg flex items-centre justify-centre"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleOpen}
            >
              <span className="text-2xl">🎤</span>
            </motion.button>
          );
        case 'early-primary':
          return (
            <motion.button
              className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-centre justify-centre"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleOpen}
            >
              <Mic className="h-6 w-6" />
            </motion.button>
          );
        case 'late-primary':
        case 'secondary':
        default:
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-centre justify-centre"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleOpen}
                  >
                    <Mic className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice Input</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
      }
    }
    
    return null;
  };
  
  // Render age-appropriate UI
  const renderContent = () => {
    if (!isOpen) return null;
    
    // Minimized state
    if (isMinimized) {
      return (
        <motion.div
          className="flex items-centre gap-2 bg-white rounded-full shadow-md p-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={toggleMinimized}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={isListening ? "destructive" : "default"}
            className="h-8 w-8 rounded-full"
            onClick={toggleVoiceInput}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={toggleOpen}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      );
    }
    
    // Full content based on age group
    switch (ageGroup) {
      case 'nursery':
        return (
          <motion.div
            className="w-72 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-purple-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-purple-100 p-3 flex items-centre justify-between">
              <div className="flex items-centre gap-2">
                <span className="text-2xl">🎤</span>
                <span className="text-lg font-bold text-purple-800">Talk to Me!</span>
              </div>
              
              <div className="flex items-centre gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={toggleMinimized}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={toggleOpen}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-centre mb-4">
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 + (volume * 0.2) }}
                      exit={{ scale: 0.8 }}
                      className="w-20 h-20 bg-purple-200 rounded-full flex items-centre justify-centre"
                    >
                      <span className="text-3xl">🎤</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-listening"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="w-20 h-20 bg-grey-200 rounded-full flex items-centre justify-centre"
                    >
                      <span className="text-3xl">🎤</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="min-h-[60px] bg-purple-50 rounded-xl p-3 mb-4 text-centre">
                {transcript || interimTranscript ? (
                  <p className="text-purple-800 text-lg">{transcript} {interimTranscript}</p>
                ) : (
                  <p className="text-grey-400 text-lg">Say something...</p>
                )}
              </div>
              
              <div className="flex justify-centre gap-4">
                {isListening ? (
                  <Button 
                    size="lg"
                    className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={toggleVoiceInput}
                  >
                    <MicOff className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={toggleVoiceInput}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                )}
                
                {transcript && (
                  <Button 
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 rounded-full border-2 border-purple-300"
                    onClick={clearTranscript}
                  >
                    <span className="text-xl">🧹</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
        
      case 'early-primary':
        return (
          <motion.div
            className="w-80 bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-blue-100 p-2 flex items-centre justify-between">
              <div className="flex items-centre gap-2">
                <Mic className="h-5 w-5 text-blue-700" />
                <span className="font-medium text-blue-800">Voice Helper</span>
              </div>
              
              <div className="flex items-centre gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setIsHelpOpen(true)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={toggleMinimized}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={toggleOpen}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-centre mb-3">
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ y: 5 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 bg-blue-200 rounded-full flex items-centre justify-centre"
                    >
                      <span className="text-2xl">🦊</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-listening"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ repeat: 1, duration: 2 }}
                      className="w-16 h-16 bg-grey-200 rounded-full flex items-centre justify-centre"
                    >
                      <span className="text-2xl">🦊</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="min-h-[80px] bg-blue-50 rounded-lg p-3 mb-3">
                {transcript || interimTranscript ? (
                  <p className="text-blue-900">{transcript} <span className="text-blue-400">{interimTranscript}</span></p>
                ) : (
                  <p className="text-grey-400">Say something...</p>
                )}
              </div>
              
              <div className="flex justify-centre gap-3">
                {isListening ? (
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-centre gap-2"
                    onClick={toggleVoiceInput}
                  >
                    <MicOff className="h-5 w-5" />
                    <span>Stop</span>
                  </Button>
                ) : (
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-centre gap-2"
                    onClick={toggleVoiceInput}
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start</span>
                  </Button>
                )}
                
                {transcript && (
                  <Button 
                    variant="outline"
                    className="border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg"
                    onClick={clearTranscript}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
        
      case 'late-primary':
      case 'secondary':
      default:
        return (
          <motion.div
            className="w-96 bg-white rounded-md shadow-xl overflow-hidden border border-grey-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-grey-100 p-2 flex items-centre justify-between">
              <div className="flex items-centre gap-2">
                <Mic className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-grey-800">Voice Input</span>
              </div>
              
              <div className="flex items-centre gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setIsHelpOpen(true)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={toggleMinimized}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  onClick={toggleOpen}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="relative min-h-[120px] bg-grey-50 rounded-sm p-3 border border-grey-200 mb-3">
                {transcript || interimTranscript ? (
                  <div>
                    <span className="text-grey-900">{transcript}</span>
                    <span className="text-grey-400">{interimTranscript}</span>
                  </div>
                ) : (
                  <p className="text-grey-400">Speak to input text...</p>
                )}
                
                {isListening && (
                  <motion.div 
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-100 flex items-centre justify-centre"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic className="h-3 w-3 text-blue-600" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {isListening ? (
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={toggleVoiceInput}
                      className="flex items-centre gap-1"
                    >
                      <MicOff className="h-4 w-4" />
                      Stop
                    </Button>
                  ) : (
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={toggleVoiceInput}
                      className="flex items-centre gap-1"
                    >
                      <Mic className="h-4 w-4" />
                      Start
                    </Button>
                  )}
                  
                  {transcript && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={clearTranscript}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                
                <div className="text-xs text-grey-500 flex items-centre">
                  {isListening && (
                    <div className="flex items-centre gap-1 mr-2">
                      <div className="w-16 h-1.5 bg-grey-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-600"
                          style={{ width: `${volume * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {isListening ? "Listening..." : "Ready"}
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };
  
  // Render settings dialogue
  const renderSettingsDialog = () => {
    return (
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voice Input Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="age-group-setting">Age Group</Label>
              <Select 
                value={ageGroup} 
                onValueChange={(value) => setAgeGroup(value as AgeGroup)}
              >
                <SelectTrigger id="age-group-setting">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nursery">Nursery (3-5 years)</SelectItem>
                  <SelectItem value="early-primary">Early Primary (5-8 years)</SelectItem>
                  <SelectItem value="late-primary">Late Primary (8-11 years)</SelectItem>
                  <SelectItem value="secondary">Secondary (11+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <Label htmlFor="child-voice-optimization-setting">Child Voice Optimization</Label>
                <Switch 
                  id="child-voice-optimization-setting"
                  checked={settings.childVoiceOptimization}
                  onCheckedChange={(checked) => updateSettings({ childVoiceOptimization: checked })}
                />
              </div>
              <p className="text-xs text-grey-500">
                Improves recognition accuracy for children's voices
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <Label htmlFor="noise-reduction-setting">Background Noise Reduction</Label>
                <Switch 
                  id="noise-reduction-setting"
                  checked={settings.noiseReduction}
                  onCheckedChange={(checked) => updateSettings({ noiseReduction: checked })}
                />
              </div>
              <p className="text-xs text-grey-500">
                Reduces impact of background classroom noise
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confidence-threshold-setting">Recognition Sensitivity</Label>
              <Slider 
                id="confidence-threshold-setting"
                min={0.3}
                max={0.9}
                step={0.1}
                value={[settings.confidenceThreshold]}
                onValueChange={(value) => updateSettings({ confidenceThreshold: value[0] })}
              />
              <div className="flex justify-between text-xs text-grey-500">
                <span>More Forgiving</span>
                <span>More Strict</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Special Educational Needs</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-centre justify-between">
                  <Label htmlFor="articulation-setting" className="text-sm">Articulation Support</Label>
                  <Switch 
                    id="articulation-setting"
                    checked={settings.specialEducationalNeeds.articulation}
                    onCheckedChange={(checked) => updateSettings({ 
                      specialEducationalNeeds: { 
                        ...settings.specialEducationalNeeds, 
                        articulation: checked 
                      } 
                    })}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <Label htmlFor="fluency-setting" className="text-sm">Fluency Support</Label>
                  <Switch 
                    id="fluency-setting"
                    checked={settings.specialEducationalNeeds.fluency}
                    onCheckedChange={(checked) => updateSettings({ 
                      specialEducationalNeeds: { 
                        ...settings.specialEducationalNeeds, 
                        fluency: checked 
                      } 
                    })}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <Label htmlFor="processing-setting" className="text-sm">Processing Support</Label>
                  <Switch 
                    id="processing-setting"
                    checked={settings.specialEducationalNeeds.processing}
                    onCheckedChange={(checked) => updateSettings({ 
                      specialEducationalNeeds: { 
                        ...settings.specialEducationalNeeds, 
                        processing: checked 
                      } 
                    })}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={async () => {
                await calibrate();
                setIsSettingsOpen(false);
              }}
              className="w-full"
            >
              Calibrate Voice Recognition
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Render help dialogue
  const renderHelpDialog = () => {
    return (
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voice Input Help</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium mb-2">How to Use Voice Input</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">1.</span>
                  <span>Click the microphone button to start listening</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">2.</span>
                  <span>Speak clearly into your microphone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">3.</span>
                  <span>Your words will appear in the text box</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">4.</span>
                  <span>Click the stop button when you're finished</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">5.</span>
                  <span>The text will be automatically inserted where your cursor is</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tips for Better Results</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Speak clearly and at a normal pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Reduce background noise if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Say "period" for a full stop, "comma" for a comma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Say "new line" or "new paragraph" to start a new line</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Use the settings to adjust for your specific needs</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Render tutorial
  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-centre justify-centre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-6 max-w-md"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">Voice Input Available!</h2>
          
          <div className="space-y-4">
            <p>
              You can now use your voice to input text anywhere in the application!
              This is especially helpful if you find typing difficult.
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">1.</span>
                  <span>Click the microphone button in the corner of the screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">2.</span>
                  <span>Start speaking and watch your words appear</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">3.</span>
                  <span>Click the stop button when you're done</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeTutorial}>
                Don't show again
              </Button>
              <Button onClick={toggleOpen}>
                Try it now
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  if (!isAvailable) return null;
  
  return (
    <>
      <motion.div
        className="fixed z-40"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        drag
        dragMomentum={false}
      >
        <AnimatePresence mode="wait">
          {renderButton()}
          {renderContent()}
        </AnimatePresence>
      </motion.div>
      
      {renderSettingsDialog()}
      {renderHelpDialog()}
      
      <AnimatePresence>
        {showTutorial && renderTutorial()}
      </AnimatePresence>
    </>
  );
};

export default GlobalVoiceInput;
