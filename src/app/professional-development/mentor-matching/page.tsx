'use client';

// import React from 'react'; // Unused import
// import { Metadata } from 'next'; // Unused import
import MentorMatchingDashboard from '@/components/professional-development/mentor-matching-dashboard';

export default function MentorMatchingPage() : React.ReactNode {
  return (
    <div className="min-h-screen bg-background">
      <MentorMatchingDashboard />
    </div>
  );
}
