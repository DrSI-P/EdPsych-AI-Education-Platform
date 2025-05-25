'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Create stub InterventionAnalyticsEngine component to fix build warnings
export function InterventionAnalyticsEngine() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAnalyticsData({
        interventions: 24,
        students: 18,
        averageProgress: 68,
        successRate: 72,
        recentInterventions: [
          { id: 1, name: 'Reading Fluency Support', student: 'Alex Johnson', progress: 75, status: 'active' },
          { id: 2, name: 'Math Concept Reinforcement', student: 'Samira Patel', progress: 90, status: 'completed' },
          { id: 3, name: 'Executive Function Coaching', student: 'Jamie Smith', progress: 45, status: 'active' },
          { id: 4, name: 'Social Skills Development', student: 'Tyler Williams', progress: 60, status: 'active' }
        ]
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-centre justify-centre min-h-[400px]">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-grey-600">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-grey-500">Total Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.interventions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-grey-500">Students Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.students}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-grey-500">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.averageProgress}%</div>
            <Progress value={analyticsData.averageProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-grey-500">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.successRate}%</div>
            <Progress value={analyticsData.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Interventions</CardTitle>
              <CardDescription>
                Track the progress of your most recent intervention strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentInterventions.map((intervention) => (
                  <div key={intervention.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{intervention.name}</h3>
                        <p className="text-sm text-grey-500">Student: {intervention.student}</p>
                      </div>
                      <Badge variant={intervention.status === 'active' ? 'default' : 'outline'}>
                        {intervention.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{intervention.progress}%</span>
                      </div>
                      <Progress value={intervention.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Interventions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="interventions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of all intervention strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-grey-500">Detailed intervention analytics would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>
                Individual student progress across all interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-grey-500">Student progress analytics would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Reports</CardTitle>
              <CardDescription>
                Generate and download detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-grey-500">Report generation options would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Also export as default to maintain compatibility
export default InterventionAnalyticsEngine;
