/**
 * EdPsych-AI-Education-Platform - Home Page
 * 
 * A showcase of the platform's comprehensive visual and brand identity,
 * demonstrating the cohesive design system across different components.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import MainNavigation from '@/components/ui/MainNavigation';
import PageHeader from '@/components/ui/PageHeader';
import LearningCard from '@/components/ui/LearningCard';
import AchievementCard, { AchievementGallery } from '@/components/ui/AchievementCard';
import FeedbackMessage from '@/components/ui/FeedbackMessage';
import LearningStyleSelector from '@/components/ui/LearningStyleSelector';
import CelebrationOverlay from '@/components/ui/CelebrationOverlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from '@/components/ui';

export default function HomePage() {
  const { ageGroup, setAgeGroup } = useTheme();
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | 'reading-writing'>('visual');
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(true);
  
  // Sample learning content
  const learningContent = [
    {
      title: "Introduction to Fractions",
      description: "Learn the basics of fractions and how they work",
      image: "/images/sample/fractions.jpg",
      learningStyle: "visual" as const,
      progress: 75
    },
    {
      title: "Sound Patterns in Poetry",
      description: "Explore rhythm and rhyme in poetry",
      image: "/images/sample/poetry.jpg",
      learningStyle: "auditory" as const,
      progress: 45
    },
    {
      title: "Hands-on Science Experiments",
      description: "Discover scientific principles through experiments",
      image: "/images/sample/science.jpg",
      learningStyle: "kinesthetic" as const,
      progress: 60
    },
    {
      title: "Creative Writing Workshop",
      description: "Develop your storytelling and writing skills",
      image: "/images/sample/writing.jpg",
      learningStyle: "reading-writing" as const,
      progress: 30
    }
  ];
  
  // Sample achievements
  const achievements = [
    {
      title: "Math Master",
      description: "Completed 10 math lessons with perfect scores",
      type: "badge" as const,
      level: "gold" as const,
      date: "15 May 2025",
      completed: true
    },
    {
      title: "Reading Explorer",
      description: "Read 5 books and completed comprehension activities",
      type: "milestone" as const,
      level: "silver" as const,
      date: "10 May 2025",
      completed: true
    },
    {
      title: "Science Investigator",
      description: "Conducted 3 science experiments and documented results",
      type: "badge" as const,
      level: "bronze" as const,
      progress: 66,
      completed: false
    }
  ];
  
  // Handle learning style change
  const handleLearningStyleChange = (style: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing') => {
    setLearningStyle(style);
  };
  
  // Handle age group change
  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value as any);
  };
  
  // Show celebration overlay
  const handleShowCelebration = () => {
    setShowCelebration(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      <main className="container py-8">
        <PageHeader
          title="Welcome to EdPsych Connect"
          description="A personalized learning platform designed to adapt to your unique learning style and needs."
        />
        
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
        
        {/* Feedback Message */}
        {feedbackVisible && (
          <div className="mb-8">
            <FeedbackMessage
              type="info"
              title="Welcome Back!"
              message="Continue where you left off with your personalized learning journey."
              dismissable={true}
              onDismiss={() => setFeedbackVisible(false)}
            />
          </div>
        )}
        
        {/* Learning Style Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Learning Style</h2>
          <LearningStyleSelector
            defaultStyle={learningStyle}
            onStyleChange={handleLearningStyleChange}
          />
        </div>
        
        {/* Learning Content */}
        <div className="mb-12">
          <div className="flex justify-between items-centre mb-4">
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/ai-avatar-videos">
                Explore AI Avatar Videos
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningContent.map((content, index) => (
              <LearningCard
                key={index}
                title={content.title}
                description={content.description}
                image={content.image}
                learningStyle={content.learningStyle}
                progress={content.progress}
              />
            ))}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                {...achievement}
              />
            ))}
          </div>
        </div>
        
        {/* Featured AI Avatar Video */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Meet Dr. Scott - Your AI Teacher</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-primary/20 flex flex-col items-centre justify-centre">
                <div className="text-centre p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-centre justify-centre mx-auto mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">EdPsych Connect: Revolutionising Education Through Psychology</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch Dr. Scott's executive summary video introducing our platform's vision, components, and benefits
                  </p>
                  <Button asChild>
                    <Link href="/ai-avatar-videos">
                      Watch Video
                    </Link>
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
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/ai-avatar-videos">
                      Browse All Videos
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Celebration Demo */}
        <div className="text-centre mb-12">
          <h2 className="text-2xl font-semibold mb-4">Celebration Demo</h2>
          <Button
            size="lg"
            onClick={handleShowCelebration}
          >
            Show Celebration Overlay
          </Button>
        </div>
        
        {/* Celebration Overlay */}
        {showCelebration && (
          <CelebrationOverlay
            type="achievement"
            title="Congratulations!"
            message="You've earned the 'Design Explorer' badge for your excellent work on the platform's visual identity."
            confetti={true}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </main>
      
      <footer className="border-t py-6 bg-muted/40">
        <div className="container text-centre text-muted-foreground">
          <p>© 2025 EdPsych Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
