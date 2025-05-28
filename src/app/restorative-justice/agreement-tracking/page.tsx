// import React from 'react'; // Unused import
import AgreementTrackingSystem from '@/components/restorative-justice/agreement-tracking/agreement-tracking-system';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agreement Tracking System | EdPsych Connect',
  description: 'Document, monitor, and follow up on agreements made during restorative processes.',
};

const AgreementTrackingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AgreementTrackingSystem />
    </div>
  );
};

export default AgreementTrackingPage;
