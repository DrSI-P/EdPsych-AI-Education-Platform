'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { Metadata } from 'next';

// Original component

const MentorMatchingDashboard = dynamic(
  () => import('@/components/professional-development/mentor-matching-dashboard')
);

function MentorMatchingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MentorMatchingDashboard />
    </div>
  );
}


export default MentorMatchingPage;