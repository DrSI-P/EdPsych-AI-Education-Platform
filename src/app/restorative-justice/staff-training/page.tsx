'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { useSession } from 'next-auth/react';

// Original component

const StaffTrainingModules = dynamic(
  () => import('@/components/restorative-justice/staff-training/staff-training-modules')
);

const AccessDenied = dynamic(
  () => import('@/components/common/access-denied')
);

function StaffTrainingPage() {
  const session = useSession();
  const isLoading = session?.status === 'loading';
  
  // Check if user is authenticated
  if (!session?.data && !isLoading) {
    return <AccessDenied />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Staff Training on Restorative Approaches</h1>
        <p className="text-lg">
          Evidence-based professional development resources to support educators in effectively implementing
          restorative practices in educational settings. These comprehensive modules are designed to build
          knowledge, skills, and confidence in using restorative approaches to create positive school communities.
        </p>
      </div>
      
      <StaffTrainingModules />
    </div>
  );
}


export default StaffTrainingPage;