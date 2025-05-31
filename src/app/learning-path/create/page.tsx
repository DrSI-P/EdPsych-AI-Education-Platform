import React from 'react';
import { LearningPathCreator } from '@/components/learning-path/LearningPathCreator';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

export default function CreateLearningPathPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Learning Path</h1>
      
      <AvatarVideo 
        title="Create Your Personalized Learning Path"
        description="This tool helps you create a personalized learning path tailored to your needs, interests, and learning style. You can select subjects, topics, and difficulty levels to create a journey that works best for you."
      />
      
      <LearningPathCreator userId="current-user-id" />
    </div>
  );
}
