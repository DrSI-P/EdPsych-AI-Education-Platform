import React from 'react';
import AgeAppropriateDemoWrapper from './wrapper';
import { Metadata } from 'next';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Age-Appropriate Content & UI Demo | EdPsych Connect',
  description: 'Interactive demonstration of the EdPsych Connect platform\'s age-appropriate content and UI system.',
};

export default function AgeAppropriateDemoPage() {
  return <AgeAppropriateDemoWrapper />;
}