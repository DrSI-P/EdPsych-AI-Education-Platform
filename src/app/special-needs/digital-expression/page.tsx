import React from 'react';
import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

const SafeDigitalExpressionSpaces = nextDynamic(
  () => import('@/components/special-needs/digital-expression/safe-digital-expression-spaces')
);


// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Safe Digital Expression Spaces | EdPsych Connect',
  description: 'Express yourself, reflect, and connect in a secure digital environment designed for emotional wellbeing and personal growth.',
};

export default function DigitalExpressionPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <SafeDigitalExpressionSpaces />
    </div>
  );
}
