import React from 'react';
import { Metadata } from 'next';
import RestorativeConversationFrameworks from '@/components/restorative-justice/restorative-conversation-frameworks';

export const metadata: Metadata = {
  title: 'Guided Restorative Conversation Frameworks | EdPsych Connect',
  description: 'Evidence-based frameworks for facilitating restorative conversations and conferences in educational settings.',
};

export default function RestorativeConversationFrameworksPage() {
  return (
    <div className="container mx-auto py-6">
      <RestorativeConversationFrameworks />
    </div>
  );
}
