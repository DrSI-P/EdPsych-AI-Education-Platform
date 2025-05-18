import React from 'react';
import CommunityBuildingActivities from '@/components/restorative-justice/community-building/community-building-activities';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Building Activities | EdPsych Connect',
  description: 'Evidence-based activities to build and strengthen community relationships in educational settings.',
};

const CommunityBuildingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <CommunityBuildingActivities />
    </div>
  );
};

export default CommunityBuildingPage;
