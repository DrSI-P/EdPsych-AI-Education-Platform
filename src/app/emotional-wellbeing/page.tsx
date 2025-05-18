'use client';

import { EmotionalCheckin } from '@/components/ai/emotional-wellbeing/emotional-checkin';
import { Metadata } from 'next';

export default function EmotionalWellbeingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emotional Well-being</h1>
          <p className="text-muted-foreground">
            Monitor and support your emotional health with daily check-ins and personalized strategies.
          </p>
        </div>
        
        <EmotionalCheckin />
      </div>
    </div>
  );
}
