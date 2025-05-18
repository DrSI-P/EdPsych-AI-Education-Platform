import React from 'react';
import { Metadata } from 'next';
import GuidedRestorativeConversationFrameworks from '@/components/restorative-justice/guided-restorative-conversation-frameworks';

export const metadata: Metadata = {
  title: 'Guided Restorative Conversation Frameworks | EdPsych Connect',
  description: 'Evidence-based frameworks for conducting restorative conversations based on restorative justice principles.',
};

export default function GuidedRestorativeConversationFrameworksPage() {
  return (
    <div className="container mx-auto py-6">
      <GuidedRestorativeConversationFrameworks />
    </div>
  );
}
