'use client';

import React from 'react';
import dynamic from 'next/dynamic';
// This prevents Next.js from trying to statically generate this page

// Import the component dynamically to prevent SSR
const PersonalizedStrategyRecommendations = dynamic(
  () => import('@/components/special-needs/emotional-regulation/strategy-recommendations/personalized-strategy-recommendations')
);


// Original component
function StrategyRecommendationsPage() {
  return (
    <div className="container mx-auto py-8">
      <PersonalizedStrategyRecommendations />
    </div>
  );
}


export default StrategyRecommendationsPage;