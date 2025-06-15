import React from 'react';
import { Metadata } from 'next';
import DashboardWrapper from './wrapper';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




// Metadata for the page
export const metadata: Metadata = {
  title: 'Educator Dashboard | EdPsych Connect',
  description: 'Manage your classroom, track student progress, and plan your curriculum',
};

// Main page component - server component
export default function EducatorDashboardPage() {
  return <DashboardWrapper />;
}
