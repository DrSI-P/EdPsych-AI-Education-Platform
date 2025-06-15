import React from 'react';
import { Metadata } from 'next';
import PatternRecognitionWrapper from './wrapper';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Emotional Pattern Recognition | EdPsych Connect',
  description: 'Discover patterns in your emotional experiences to gain deeper insights and improve emotional regulation skills.',
};

export default function EmotionalPatternRecognitionPage() {
  return (
    <div className="container mx-auto py-8">
      <PatternRecognitionWrapper />
    </div>
  );
}
