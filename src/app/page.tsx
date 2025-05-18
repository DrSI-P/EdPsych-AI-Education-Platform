/**
 * EdPsych-AI-Education-Platform - Home Page
 * 
 * A showcase of the platform's comprehensive visual and brand identity,
 * demonstrating the cohesive design system across different components.
 */

'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import MainNavigation from '@/components/ui/MainNavigation';
import PageHeader from '@/components/ui/PageHeader';
import LearningCard from '@/components/ui/LearningCard';
import AchievementCard, { AchievementGallery } from '@/components/ui/AchievementCard';
import FeedbackMessage from '@/components/ui/FeedbackMessage';
import LearningStyleSelector from '@/components/ui/LearningStyleSelector';
import CelebrationOverlay from '@/components/ui/CelebrationOverlay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
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
        
        {/* Celebration Demo */}
        <div className="text-center mb-12">
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
        <div className="container text-center text-muted-foreground">
          <p>© 2025 EdPsych Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
