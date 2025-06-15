'use client';

import dynamic from 'next/dynamic';

import React from 'react';

// Original component

const ProfessionalDevelopmentAnalytics = dynamic(
  () => import('@/components/professional-development/professional-development-analytics')
);

function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfessionalDevelopmentAnalytics />
    </div>
  );
}


export default AnalyticsPage;