'use client';

import dynamic from 'next/dynamic';

import React from 'react';

// Original component

const ParentEducationResources = dynamic(
  () => import('@/components/restorative-justice/parent-education/parent-education-resources')
);

function ParentEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <ParentEducationResources />
    </div>
  );
}


export default ParentEducationPage;