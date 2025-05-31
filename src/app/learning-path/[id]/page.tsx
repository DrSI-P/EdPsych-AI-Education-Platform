import React from 'react';
import { LearningPathView } from '@/components/learning-path/LearningPathView';

interface LearningPathViewPageProps {
  params: {
    id: string;
  };
}

export default function LearningPathViewPage({ params }: LearningPathViewPageProps) {
  return (
    <div>
      <LearningPathView pathId={params.id} userId="current-user-id" />
    </div>
  );
}
