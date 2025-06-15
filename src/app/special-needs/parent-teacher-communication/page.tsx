import React from 'react';
import { Metadata } from 'next';
import ParentTeacherCommunicationWrapper from './wrapper';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Parent-Teacher-Student Emotional Communication | EdPsych Connect',
  description: 'Collaborate on emotional wellbeing through secure, structured communication channels for parents, teachers, and students.',
};

export default function ParentTeacherCommunicationPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <ParentTeacherCommunicationWrapper />
    </div>
  );
}
