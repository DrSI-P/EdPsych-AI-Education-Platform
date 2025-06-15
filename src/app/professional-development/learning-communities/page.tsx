'use client';

import dynamic from 'next/dynamic';

import React from 'react';

// Metadata should not be exported from client components
// Removed the metadata export to fix the React Server Components error


// Original component

const LearningCommunities = dynamic(
  () => import('@/components/professional-development/learning-communities')
);

function LearningCommunitiesPage() {
  return (
    <div>
      <LearningCommunities />
    </div>
  );
}


export default LearningCommunitiesPage;