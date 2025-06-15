'use client';

import React from 'react';
import { AskDrScott } from '@/components/ask-dr-scott/AskDrScott';

// Note: Server-side exports like dynamic, revalidate, and fetchCache cannot be used with 'use client'
// If you need these features, create a separate layout.tsx file without 'use client'

export default function AskDrScottPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ask Dr. Scott</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Interactive AI Assistant</h2>
        
        <p className="mb-4">
          Welcome to the Ask Dr. Scott feature! This interactive AI assistant allows you to ask questions
          about education, psychology, and the EdPsych AI Platform.
        </p>
        
        <p className="mb-4">
          Dr. Scott I-Patrick, Managing Director & Educational Psychologist, is here to help you with:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li>Questions about educational psychology</li>
          <li>Platform features and how to use them</li>
          <li>Best practices for teaching and learning</li>
          <li>Support for special educational needs</li>
          <li>And much more!</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">
            Look for the Dr. Scott avatar in the bottom-left corner of your screen.
            Click on it to start a conversation!
          </p>
        </div>
      </div>
      
      {/* This component injects the interactive AI avatar */}
      <AskDrScott />
    </div>
  );
}