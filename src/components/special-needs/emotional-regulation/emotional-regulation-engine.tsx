'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EmotionalRegulationEngine = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("identify");
  const [settings, setSettings] = useState({
    emotionVocabularyLevel: "intermediate",
    preferredStrategies: ["deep-breathing", "counting", "visualization"],
    triggerAwareness: true,
    selfMonitoringLevel: "guided",
    notificationPreferences: {
      escalationAlerts: true,
      calmingReminders: true,
      celebrateSuccess: true
    }
  });
  
  const [currentEmotion, setCurrentEmotion] = useState({
    name: "",
    intensity: 5,
    triggers: "",
    bodyFeelings: [],
    thoughts: ""
  });
  
  const [strategies, setStrategies] = useState([]);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionJournal, setEmotionJournal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic emotions with UK spelling
  const basicEmotions = [
    { name: "Happy", color: "#FFD700", icon: "😊" },
    { name: "Sad", color: "#6495ED", icon: "😢" },
    { name: "Angry", color: "#FF4500", icon: "😠" },
    { name: "Scared", color: "#9370DB", icon: "😨" },
    { name: "Disgusted", color: "#32CD32", icon: "🤢" },
    { name: "Surprised", color: "#FF69B4", icon: "😲" }
  ];
  
  // Advanced emotions with UK spelling
  const advancedEmotions = [
    { name: "Anxious", color: "#DAA520", icon: "😰" },
    { name: "Frustrated", color: "#CD5C5C", icon: "😤" },
    { name: "Excited", color: "#FF8C00", icon: "🤩" },
    { name: "Proud", color: "#4682B4", icon: "😌" },
    { name: "Embarrassed", color: "#DB7093", icon: "😳" },
    { name: "Jealous", color: "#228B22", icon: "😒" },
    { name: "Confused", color: "#9932CC", icon: "😕" },
    { name: "Calm", color: "#87CEEB", icon: "😌" },
    { name: "Bored", color: "#A9A9A9", icon: "😑" },
    { name: "Nervous", color: "#FFA07A", icon: "😬" },
    { name: "Overwhelmed", color: "#800080", icon: "😩" },
    { name: "Disappointed", color: "#708090", icon: "😞" }
  ];
  
  // Body feeling locations
  const bodyFeelingLocations = [
    "Head", "Chest", "Stomach", "Throat", 
    "Shoulders", "Arms", "Hands", "Legs", "Feet"
  ];
  
  // Regulation strategies with UK spelling and terminology
  const regulationStrategies = [
    {
      id: "deep-breathing",
      name: "Deep Breathing",
      description: "Take slow, deep breaths to calm your body and mind.",
      steps: [
        "Find a comfortable position",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath for 2 counts",
        "Breathe out slowly through your mouth for 6 counts",
        "Repeat 5 times"
      ],
      suitableFor: ["Angry", "Anxious", "Overwhelmed", "Nervous"],
      evidenceBase: "Supported by research from the British Psychological Society and NHS mental health guidelines."
    },
    {
      id: "counting",
      name: "Counting",
      description: "Count slowly to help redirect your focus and calm down.",
      steps: [
        "Start counting slowly from 1",
        "Focus on each number as you say it",
        "Continue to 10 or 20",
        "If needed, count backwards to 1"
      ],
      suitableFor: ["Angry", "Frustrated", "Overwhelmed"],
      evidenceBase: "Recommended by the Royal College of Psychiatrists as a grounding technique."
    },
    {
      id: "visualization",
      name: "Peaceful Place Visualisation",
      description: "Imagine a calm, peaceful place to help you relax.",
      steps: [
        "Close your eyes",
        "Think of a place where you feel safe and calm",
        "Imagine what you can see there",
        "Imagine what you can hear there",
        "Imagine what you can feel there",
        "Stay in this place for a few minutes"
      ],
      suitableFor: ["Anxious", "Scared", "Overwhelmed", "Sad"],
      evidenceBase: "Supported by cognitive-behavioural therapy research and NICE guidelines for anxiety management."
    },
    {
      id: "5-4-3-2-1",
      name: "5-4-3-2-1 Grounding",
      description: "Use your senses to ground yourself in the present moment.",
      steps: [
        "Notice 5 things you can see",
        "Notice 4 things you can touch/feel",
        "Notice 3 things you can hear",
        "Notice 2 things you can smell",
        "Notice 1 thing you can taste"
      ],
      suitableFor: ["Anxious", "Overwhelmed", "Scared", "Confused"],
      evidenceBase: "Recommended by NHS mental health services as an effective grounding technique for anxiety and panic."
    },
    {
      id: "movement",
      name: "Movement Break",
      description: "Use physical movement to release energy and change your state.",
      steps: [
        "Stand up and stretch",
        "Do 10 jumping jacks or march in place",
        "Shake out your arms and legs",
        "Roll your shoulders and neck gently",
        "Take a short walk if possible"
      ],
      suitableFor: ["Angry", "Frustrated", "Bored", "Nervous", "Restless"],
      evidenceBase: "Supported by research on the connection between physical activity and emotional regulation from Sport England and the British Association of Sport and Exercise Sciences."
    }
  ];
  
  // Load user settings and data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchUserSettings();
      fetchEmotionHistory();
      fetchEmotionJournal();
    }
  }, [session]);
  
  // Filter strategies based on current emotion
  useEffect(() => {
    if (currentEmotion.name) {
      const filteredStrategies = regulationStrategies.filter(
        strategy => strategy.suitableFor.includes(currentEmotion.name)
      );
      setStrategies(filteredStrategies.length > 0 ? filteredStrategies : regulationStrategies);
    } else {
      setStrategies(regulationStrategies);
    }
  }, [currentEmotion.name]);
  
  const fetchUserSettings = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/settings');
      // const data = await response.json();
      // setSettings(data.settings);
      
      // Simulating API response for now
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load your settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fetchEmotionHistory = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/history');
      // const data = await response.json();
      // setEmotionHistory(data.history);
      
      // Simulating API response for now
      const mockHistory = [
        { 
          name: "Frustrated", 
          intensity: 7, 
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          triggers: "Homework was too difficult",
          strategiesUsed: ["deep-breathing", "counting"]
        },
        { 
          name: "Happy", 
          intensity: 8, 
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          triggers: "Played with friends at break time",
          strategiesUsed: []
        },
        { 
          name: "Anxious", 
          intensity: 6, 
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          triggers: "Class presentation",
          strategiesUsed: ["visualization", "deep-breathing"]
        }
      ];
      setEmotionHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching emotion history:', error);
      toast({
        title: "Error",
        description: "Failed to load your emotion history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fetchEmotionJournal = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/journal');
      // const data = await response.json();
      // setEmotionJournal(data.journal);
      
      // Simulating API response for now
      const mockJournal = [
        {
          id: "journal-1",
          date: new Date(Date.now() - 86400000).toISOString(),
          title: "Difficult maths lesson",
          content: "I felt frustrated during maths today because I couldn't understand the new concept. I used deep breathing to calm down and then asked the teacher for help. This made me feel better.",
          emotions: ["Frustrated", "Confused", "Proud"],
          strategies: ["deep-breathing"]
        },
        {
          id: "journal-2",
          date: new Date(Date.now() - 259200000).toISOString(),
          title: "Made a new friend",
          content: "I felt nervous about talking to the new student, but I used my brave thoughts and introduced myself. We played together at break time and it was really fun!",
          emotions: ["Nervous", "Happy", "Excited"],
          strategies: ["visualization"]
        }
      ];
      setEmotionJournal(mockJournal);
    } catch (error) {
      console.error('Error fetching emotion journal:', error);
      toast({
        title: "Error",
        description: "Failed to load your emotion journal. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEmotionSelect = (emotion) => {
    setCurrentEmotion({
      ...currentEmotion,
      name: emotion.name
    });
    
    // Move to intensity tab after selecting emotion
    setActiveTab("intensity");
  };
  
  const handleIntensityChange = (value) => {
    setCurrentEmotion({
      ...currentEmotion,
      intensity: value[0]
    });
  };
  
  const handleBodyFeelingToggle = (location) => {
    const updatedBodyFeelings = currentEmotion.bodyFeelings.includes(location)
      ? currentEmotion.bodyFeelings.filter(item => item !== location)
      : [...currentEmotion.bodyFeelings, location];
    
    setCurrentEmotion({
      ...currentEmotion,
      bodyFeelings: updatedBodyFeelings
    });
  };
  
  const handleSaveEmotion = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/emotions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(currentEmotion),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        // Add to history
        const newHistoryItem = {
          ...currentEmotion,
          timestamp: new Date().toISOString(),
          strategiesUsed: []
        };
        setEmotionHistory([newHistoryItem, ...emotionHistory]);
        
        // Reset current emotion
        setCurrentEmotion({
          name: "",
          intensity: 5,
          triggers: "",
          bodyFeelings: [],
          thoughts: ""
        });
        
        setIsLoading(false);
        setActiveTab("strategies");
        
        toast({
          title: "Success",
          description: "Your emotion has been recorded. Let's find some helpful strategies.",
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving emotion:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your emotion. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveJournalEntry = async (entry) => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/journal', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(entry),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        const newEntry = {
          id: `journal-${Date.now()}`,
          date: new Date().toISOString(),
          ...entry
        };
        setEmotionJournal([newEntry, ...emotionJournal]);
        setIsLoading(false);
        
        toast({
          title: "Success",
          description: "Your journal entry has been saved.",
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(settings),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your settings have been saved.",
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getEmotionColor = (emotionName) => {
    const emotion = 
      basicEmotions.find(e => e.name === emotionName) || 
      advancedEmotions.find(e => e.name === emotionName);
    return emotion ? emotion.color : "#808080";
  };
  
  const getEmotionIcon = (emotionName) => {
    const emotion = 
      basicEmotions.find(e => e.name === emotionName) || 
      advancedEmotions.find(e => e.name === emotionName);
    return emotion ? emotion.icon : "😐";
  };
  
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  
  const getIntensityLabel = (intensity) => {
    if (intensity <= 3) return "Mild";
    if (intensity <= 6) return "Moderate";
    return "Strong";
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Emotional Regulation Support</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="identify">Identify</TabsTrigger>
          <TabsTrigger value="intensity">Intensity</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>
        
        {/* Identify Emotions Tab */}
        <TabsContent value="identify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling right now?</CardTitle>
              <CardDescription>
                Select the emotion that best matches how you're feeling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Basic Emotions</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {basicEmotions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant={currentEmotion.name === emotion.name ? "default" : "outline"}
                        className="h-24 flex flex-col items-center justify-center"
                        style={{
                          borderColor: emotion.color,
                          backgroundColor: currentEmotion.name === emotion.name ? emotion.color : "transparent",
                          color: currentEmotion.name === emotion.name ? "white" : "inherit"
                        }}
                        onClick={() => handleEmotionSelect(emotion)}
                      >
                        <span className="text-2xl mb-2">{emotion.icon}</span>
                        <span>{emotion.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">More Emotions</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {advancedEmotions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant={currentEmotion.name === emotion.name ? "default" : "outline"}
                        className="h-24 flex flex-col items-center justify-center"
                        style={{
                          borderColor: emotion.color,
                          backgroundColor: currentEmotion.name === emotion.name ? emotion.color : "transparent",
                          color: currentEmotion.name === emotion.name ? "white" : "inherit"
                        }}
                        onClick={() => handleEmotionSelect(emotion)}
                      >
                        <span className="text-2xl mb-2">{emotion.icon}</span>
                        <span>{emotion.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button 
                disabled={!currentEmotion.name || isLoading}
                onClick={() => setActiveTab("intensity")}
              >
                Next: Intensity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Intensity Tab */}
        <TabsContent value="intensity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                How intense is your {currentEmotion.name.toLowerCase()} feeling?
              </CardTitle>
              <CardDescription>
                Move the slider to show how strong the feeling is.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentEmotion.name && (
                <div className="flex items-center justify-center mb-6">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{ backgroundColor: getEmotionColor(currentEmotion.name) }}
                  >
                    {getEmotionIcon(currentEmotion.name)}
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Strong</span>
                  </div>
                  <Slider
                    defaultValue={[currentEmotion.intensity]}
                    max={10}
                    min={1}
                    step={1}
                    onValueChange={handleIntensityChange}
                  />
                  <div className="flex justify-center mt-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {currentEmotion.intensity} - {getIntensityLabel(currentEmotion.intensity)}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label htmlFor="triggers">What triggered this feeling?</Label>
                  <Textarea
                    id="triggers"
                    placeholder="What happened that made you feel this way?"
                    value={currentEmotion.triggers}
                    onChange={(e) => setCurrentEmotion({...currentEmotion, triggers: e.target.value})}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="thoughts">What thoughts are you having?</Label>
                  <Textarea
                    id="thoughts"
                    placeholder="What are you thinking about right now?"
                    value={currentEmotion.thoughts}
                    onChange={(e) => setCurrentEmotion({...currentEmotion, thoughts: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("identify")}>
                Back
              </Button>
              <Button 
                disabled={isLoading}
                onClick={() => setActiveTab("body")}
              >
                Next: Body Feelings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Body Feelings Tab */}
        <TabsContent value="body" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Where do you feel this in your body?</CardTitle>
              <CardDescription>
                Select all the places in your body where you notice this feeling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-64 h-80">
                  <Image 
                    src="/images/body-outline.png" 
                    alt="Body outline" 
                    width={256}
                    height={320}
                    className="w-full h-auto"
                  />
                  {/* This would be replaced with an actual body map with clickable regions */}
                </div>
                
                <div className="grid grid-cols-3 gap-2 w-full">
                  {bodyFeelingLocations.map((location) => (
                    <Button
                      key={location}
                      variant={currentEmotion.bodyFeelings.includes(location) ? "default" : "outline"}
                      className="h-12"
                      onClick={() => handleBodyFeelingToggle(location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("intensity")}>
                Back
              </Button>
              <Button 
                disabled={isLoading}
                onClick={handleSaveEmotion}
              >
                {isLoading ? "Saving..." : "Save and Find Strategies"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Strategies</CardTitle>
              <CardDescription>
                Here are some strategies that might help with your {currentEmotion.name ? currentEmotion.name.toLowerCase() : ""} feelings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {strategies.length > 0 ? (
                  strategies.map((strategy) => (
                    <Card key={strategy.id} className="border-l-4" style={{ borderLeftColor: currentEmotion.name ? getEmotionColor(currentEmotion.name) : "#808080" }}>
                      <CardHeader>
                        <CardTitle>{strategy.name}</CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium mb-2">Steps:</h4>
                        <ol className="list-decimal pl-5 space-y-1">
                          {strategy.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-1">Good for:</h4>
                          <div className="flex flex-wrap gap-2">
                            {strategy.suitableFor.map((emotion) => (
                              <Badge key={emotion} style={{ backgroundColor: getEmotionColor(emotion) }}>
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p><strong>Evidence:</strong> {strategy.evidenceBase}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">I\'ll Try This</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>Select an emotion to see strategies that might help.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("identify")}>
                Record Another Emotion
              </Button>
              <Button onClick={() => setActiveTab("history")}>
                View History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Emotion History</CardTitle>
              <CardDescription>
                Track your emotions over time to notice patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {emotionHistory.length > 0 ? (
                    emotionHistory.map((entry, index) => (
                      <Card key={index} className="border-l-4" style={{ borderLeftColor: getEmotionColor(entry.name) }}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getEmotionIcon(entry.name)}</span>
                              <CardTitle>{entry.name}</CardTitle>
                              <Badge variant="outline">
                                {entry.intensity}/10
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(entry.timestamp)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          {entry.triggers && (
                            <div className="mb-2">
                              <p><strong>Trigger:</strong> {entry.triggers}</p>
                            </div>
                          )}
                          
                          {entry.strategiesUsed && entry.strategiesUsed.length > 0 && (
                            <div>
                              <p><strong>Strategies used:</strong></p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {entry.strategiesUsed.map((strategyId) => {
                                  const strategy = regulationStrategies.find(s => s.id === strategyId);
                                  return strategy ? (
                                    <Badge key={strategyId} variant="secondary">
                                      {strategy.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p>No emotion history recorded yet.</p>
                      <Button className="mt-4" onClick={() => setActiveTab("identify")}>
                        Record Your First Emotion
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("identify")}>
                Record New Emotion
              </Button>
              <Button onClick={() => setActiveTab("journal")}>
                Go to Journal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Journal</CardTitle>
              <CardDescription>
                Write about your feelings and experiences to help understand them better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="view">View Entries</TabsTrigger>
                  <TabsTrigger value="create">Create Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="view">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {emotionJournal.length > 0 ? (
                        emotionJournal.map((entry) => (
                          <Card key={entry.id}>
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle>{entry.title}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(entry.date)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {entry.emotions.map((emotion) => (
                                  <Badge 
                                    key={emotion} 
                                    style={{ backgroundColor: getEmotionColor(emotion) }}
                                  >
                                    {emotion}
                                  </Badge>
                                ))}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="whitespace-pre-line">{entry.content}</p>
                              
                              {entry.strategies && entry.strategies.length > 0 && (
                                <div className="mt-4">
                                  <p><strong>Strategies used:</strong></p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {entry.strategies.map((strategyId) => {
                                      const strategy = regulationStrategies.find(s => s.id === strategyId);
                                      return strategy ? (
                                        <Badge key={strategyId} variant="secondary">
                                          {strategy.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p>No journal entries yet.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="create">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="journal-title">Title</Label>
                      <Input id="journal-title" placeholder="Give your entry a title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Emotions (select all that apply)</Label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[...basicEmotions, ...advancedEmotions].map((emotion) => (
                          <Button
                            key={emotion.name}
                            variant="outline"
                            className="h-10"
                            style={{
                              borderColor: emotion.color
                            }}
                          >
                            <span className="mr-1">{emotion.icon}</span>
                            <span>{emotion.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="journal-content">What happened?</Label>
                      <Textarea 
                        id="journal-content" 
                        placeholder="Write about what happened, how you felt, and what you did to manage your feelings..."
                        className="min-h-[200px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Strategies you used (if any)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {regulationStrategies.map((strategy) => (
                          <Button
                            key={strategy.id}
                            variant="outline"
                            className="h-10 justify-start"
                          >
                            {strategy.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Journal Entry"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionalRegulationEngine;
