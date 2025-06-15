import React from 'react';
import { Metadata } from 'next';
import WebinarWrapper from './wrapper';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Professional Development Webinars | EdPsych Connect',
  description: 'Access and register for professional development webinars for educators and educational psychologists.',
};

export default function WebinarPage() {
  return (
    <div className="min-h-screen bg-background">
      <WebinarWrapper />
    </div>
  );
}
