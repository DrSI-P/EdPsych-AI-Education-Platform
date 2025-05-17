'use client';

import React from 'react';
import LearningCommunities from '@/components/professional-development/learning-communities';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Communities | EdPsych Connect',
  description: 'Connect, collaborate, and share with educators across schools through secure learning communities.',
};

export default function LearningCommunitiesPage() {
  return (
    <div>
      <LearningCommunities />
    </div>
  );
}
