'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from '@/components/analytics/analytics-dashboard';
import StudentProgressTracking from '@/components/analytics/student-progress-tracking';
import EducatorAnalytics from '@/components/analytics/educator-analytics';
import CustomReportBuilder from '@/components/analytics/custom-report-builder';
import AnalyticsIntegration from '@/components/analytics/analytics-integration';

const AnalyticsPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and reporting tools for data-driven educational insights
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="educators">Educator Analytics</TabsTrigger>
          <TabsTrigger value="reports">Report Builder</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <StudentProgressTracking />
        </TabsContent>
        
        <TabsContent value="educators" className="space-y-4">
          <EducatorAnalytics />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <CustomReportBuilder />
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          <AnalyticsIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
