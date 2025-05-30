import React, { useState } from 'react';
import Link from 'next/link';

// Import components from the main project
// Note: We're using simplified imports that work with Pages Router
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/ui/tabs';
import { Play } from 'lucide-react';

export default function Home() {
  const [ageGroup, setAgeGroup] = useState('late-primary');
  const [learningStyle, setLearningStyle] = useState('visual');
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(true);
  
  // Sample learning content
  const learningContent = [
    {
      title: "Introduction to Fractions",
      description: "Learn the basics of fractions and how they work",
      image: "/images/sample/fractions.jpg",
      learningStyle: "visual",
      progress: 75
    },
    {
      title: "Sound Patterns in Poetry",
      description: "Explore rhythm and rhyme in poetry",
      image: "/images/sample/poetry.jpg",
      learningStyle: "auditory",
      progress: 45
    },
    {
      title: "Hands-on Science Experiments",
      description: "Discover scientific principles through experiments",
      image: "/images/sample/science.jpg",
      learningStyle: "kinesthetic",
      progress: 60
    },
    {
      title: "Creative Writing Workshop",
      description: "Develop your storytelling and writing skills",
      image: "/images/sample/writing.jpg",
      learningStyle: "reading-writing",
      progress: 30
    }
  ];
  
  // Handle age group change - Removed DOM manipulation that could cause errors
  const handleAgeGroupChange = (value) => {
    setAgeGroup(value);
    // Removed direct DOM manipulation that could cause errors
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container">
          <h1 className="text-3xl font-bold">EdPsych Connect</h1>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to EdPsych Connect</h1>
          <p className="text-xl text-muted-foreground">A personalized learning platform designed to adapt to your unique learning style and needs.</p>
        </div>
        
        {/* Age Group Selector for Demo */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-medium mb-2">Demo Controls: Change Age Group</h2>
          <Tabs defaultValue={ageGroup} onValueChange={handleAgeGroupChange}>
            <TabsList>
              <TabsTrigger value="nursery">Nursery</TabsTrigger>
              <TabsTrigger value="early-primary">Early Primary</TabsTrigger>
              <TabsTrigger value="late-primary">Late Primary</TabsTrigger>
              <TabsTrigger value="secondary">Secondary</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Learning Style Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Learning Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-medium">Visual</h3>
              <p className="text-sm text-muted-foreground">Learn through images, diagrams, and visual aids</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-medium">Auditory</h3>
              <p className="text-sm text-muted-foreground">Learn through listening and speaking</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-medium">Hands-on</h3>
              <p className="text-sm text-muted-foreground">Learn through physical activities and experiences</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-medium">Reading/Writing</h3>
              <p className="text-sm text-muted-foreground">Learn through text-based materials</p>
            </div>
          </div>
        </div>
        
        {/* Recommended Content */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
            <Button variant="outline" size="sm">
              Explore AI Avatar Videos
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningContent.map((content, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-card">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <span className="text-4xl">{content.title.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${content.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{content.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Featured AI Avatar Video */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Meet Dr. Scott - Your AI Teacher</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-primary/20 flex flex-col items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">EdPsych Connect: Revolutionising Education Through Psychology</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch Dr. Scott's executive summary video introducing our platform's vision, components, and benefits
                  </p>
                  <Button>
                    Watch Video
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>About AI Avatar Videos</CardTitle>
                  <CardDescription>
                    Personalized learning experiences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI avatar videos feature Dr. Scott Ighavongbe-Patrick providing personalized instruction, guidance, and support for learners of all ages and abilities.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    These videos adapt to different learning styles and needs, making education more accessible and engaging for everyone.
                  </p>
                  <div className="text-xs text-muted-foreground border-t pt-3">
                    <p className="italic">
                      "EdPsych Connect was born from a simple yet powerful vision: to create personalised, evidence-based learning experiences that empower every child, regardless of their starting point or individual needs."
                    </p>
                    <p className="text-right mt-1">- From the Executive Summary Video</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Browse All Videos
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-muted/40">
        <div className="container text-center text-muted-foreground">
          <p>© 2025 EdPsych Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
