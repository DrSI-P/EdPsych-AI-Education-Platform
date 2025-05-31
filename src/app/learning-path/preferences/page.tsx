import React from 'react';
import { LearningStylePreferences } from '@/components/learning-path/LearningStylePreferences';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

export default function LearningStylePreferencesPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Learning Style Preferences</h1>
      
      <AvatarVideo 
        title="Your Learning Style"
        description="Understanding how you learn best helps us personalize your educational experience. This page allows you to set your preferences and interests to make learning more effective and engaging."
      />
      
      <LearningStylePreferences userId="current-user-id" />
    </div>
  );
}
