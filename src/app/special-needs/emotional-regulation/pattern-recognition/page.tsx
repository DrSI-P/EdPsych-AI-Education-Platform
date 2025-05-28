// import React from 'react'; // Unused import
import { Metadata } from 'next';
import EmotionalPatternRecognition from '@/components/special-needs/emotional-regulation/pattern-recognition/emotional-pattern-recognition';

export const metadata: Metadata = {
  title: 'Emotional Pattern Recognition | EdPsych Connect',
  description: 'Discover patterns in your emotional experiences to gain deeper insights and improve emotional regulation skills.',
};

export default function EmotionalPatternRecognitionPage() : React.ReactNode {
  return (
    <div className="container mx-auto py-8">
      <EmotionalPatternRecognition />
    </div>
  );
}
