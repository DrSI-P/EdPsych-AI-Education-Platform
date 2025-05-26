'use client';

import React from 'react';
import { DataVisualisationDashboard } from '@/components/educator/data-visualisation-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataVisualisationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Data Visualisation Dashboard</h1>
      
      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="about">About This Feature</TabsTrigger>
          <TabsTrigger value="help">Help & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <DataVisualisationDashboard />
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Data Visualisation Dashboard</CardTitle>
              <CardDescription>
                Understanding how this feature helps educators make data-informed decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Data Visualisation Dashboard transforms complex educational data into intuitive, interactive visualisations that support evidence-based decision-making. This comprehensive analytics solution provides educators, administrators, and other stakeholders with powerful insights across all aspects of educational practise.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key Benefits</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Comprehensive Data Integration:</strong> Unified data collection from all platform modules, providing a holistic view of educational processes and outcomes.
                </li>
                <li>
                  <strong>Interactive Visualisations:</strong> Dynamic charts and graphs that respond to user interaction, allowing for deeper exploration of patterns and relationships.
                </li>
                <li>
                  <strong>Student Progress Analytics:</strong> Detailed tracking of academic achievement, skill development, and personalised learning pathways.
                </li>
                <li>
                  <strong>Behavioural and Social-Emotional Insights:</strong> Visualisation of behavioural patterns, emotional regulation progress, and social interaction networks.
                </li>
                <li>
                  <strong>Resource Utilisation Analytics:</strong> Analysis of curriculum resource usage, effectiveness, and identification of resource gaps.
                </li>
                <li>
                  <strong>Communication and Engagement Metrics:</strong> Visualisation of parent communication effectiveness, student voice impact, and community engagement patterns.
                </li>
                <li>
                  <strong>Administrative Efficiency Analytics:</strong> Time allocation visualisation, workflow optimisation insights, and documentation efficiency metrics.
                </li>
                <li>
                  <strong>Customisable Dashboard Interface:</strong> Role-based configurations, user-defined preferences, and saved views for personalised analytics.
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Educational Psychology Foundations</h3>
              <p>
                This dashboard is grounded in established educational psychology principles including data-informed practise, growth mindset, metacognitive awareness, differentiated instruction, and ecological systems perspective. By making complex data accessible and actionable, the dashboard supports educators in implementing evidence-based approaches tailored to diverse student needs.
              </p>
              
              <p className="mt-4">
                The Data Visualisation Dashboard represents a significant advancement in educational analytics, moving beyond simple data reporting to provide meaningful insights that drive continuous improvement in teaching and learning practices.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
              <CardDescription>
                Guidance on getting the most from the Data Visualisation Dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Begin by exploring the Overview tab to see key metrics across all areas</li>
                <li>Use the filters at the top to select specific time periods and student groups</li>
                <li>Hover over charts to see detailed information about specific data points</li>
                <li>Try different dashboard configurations from the dropdown menu</li>
                <li>Customise chart settings in the Settings tab to suit your preferences</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-4">Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Regular review:</strong> Schedule time to review dashboard insights weekly or monthly
                </li>
                <li>
                  <strong>Compare time periods:</strong> Use the date range selector to identify trends over time
                </li>
                <li>
                  <strong>Focus on specific groups:</strong> Filter by student groups to identify targeted intervention needs
                </li>
                <li>
                  <strong>Share insights:</strong> Use the export and share features to collaborate with colleagues
                </li>
                <li>
                  <strong>Action planning:</strong> Document specific actions based on dashboard insights
                </li>
                <li>
                  <strong>Follow up:</strong> Return to the dashboard to evaluate the impact of your interventions
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Understanding Visualisations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Line charts show trends over time and are ideal for tracking progress</li>
                <li>Bar charts compare values across categories and highlight differences</li>
                <li>Pie charts show proportional relationships and distribution</li>
                <li>Area charts emphasise cumulative totals and overall volume</li>
                <li>Alerts highlight important patterns requiring attention</li>
              </ul>
              
              <p className="mt-4">
                If you need additional help or have suggestions for improving this feature, please contact the platform support team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
