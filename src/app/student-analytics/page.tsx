"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const StudentProgressAnalytics = dynamic(
  () => import('@/components/student-analytics/StudentProgressAnalytics')
);

function StudentAnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <StudentProgressAnalytics />
    </div>
  );
}

export default StudentAnalyticsPage;