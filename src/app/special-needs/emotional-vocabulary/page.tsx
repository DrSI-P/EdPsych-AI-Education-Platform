import React from 'react';
import { Metadata } from 'next'
import nextDynamic from 'next/dynamic';;

const EmotionalVocabularyDevelopment = nextDynamic(
  () => import('@/components/special-needs/emotional-vocabulary/emotional-vocabulary-development')
);


// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Emotional Vocabulary Development | EdPsych Connect',
  description: 'Explore, learn, and practice using words to identify and express emotions with our comprehensive emotional vocabulary development tools.',
};

export default function EmotionalVocabularyPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <EmotionalVocabularyDevelopment />
    </div>
  );
}
