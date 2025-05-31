import React from 'react';
import { LearningPathDashboard } from '@/components/learning-path/LearningPathDashboard';

export default function LearningPathPage() {
  return (
    <div>
      <LearningPathDashboard userId="current-user-id" />
    </div>
  );
}
