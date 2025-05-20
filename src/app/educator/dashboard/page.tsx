'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AutomatedDocumentation from '@/components/educator/automated-documentation';
import SmartLessonPlanning from '@/components/educator/smart-lesson-planning';
import { BookOpen, FileText, Settings, HelpCircle } from 'lucide-react';

export default function EducatorDashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const recentDocuments = [
    {
      id: '1',
      title: 'Year 4 Mathematics Observation',
      type: 'classroom-observation',
      date: '15 May 2025'
    },
    {
      id: '2',
      title: 'Emma Thompson Conference Notes',
      type: 'student-conference',
      date: '14 May 2025'
    },
    {
      id: '3',
      title: 'Science Lesson Reflection',
      type: 'lesson-reflection',
      date: '13 May 2025'
    }
  ];
  
  const recentLessonPlans = [
    {
      id: '1',
      title: 'Introduction to Fractions',
      subject: 'Mathematics',
      yearGroup: 'Year 4',
      date: '15 May 2025'
    },
    {
      id: '2',
      title: 'Romeo and Juliet: Introduction',
      subject: 'English',
      yearGroup: 'Year 10',
      date: '14 May 2025'
    },
    {
      id: '3',
      title: 'States of Matter Experiments',
      subject: 'Science',
      yearGroup: 'Year 7',
      date: '13 May 2025'
    }
  ];
  
  const quickActions = [
    {
      title: 'Create Documentation',
      description: 'Record classroom observations, student conferences, and more',
      icon: <FileText className="h-6 w-6" />,
      action: () => setActiveTab('documentation')
    },
    {
      title: 'Create Lesson Plan',
      description: 'Design comprehensive, differentiated lesson plans',
      icon: <BookOpen className="h-6 w-6" />,
      action: () => setActiveTab('lesson-planning')
    },
    {
      title: 'Settings',
      description: 'Customize your administrative automation preferences',
      icon: <Settings className="h-6 w-6" />,
      action: () => {
        toast({
          title: "Settings",
          description: "Settings functionality will be available in a future update.",
        });
      }
    },
    {
      title: 'Help & Resources',
      description: 'Access guides and tutorials for administrative automation',
      icon: <HelpCircle className="h-6 w-6" />,
      action: () => {
        toast({
          title: "Help & Resources",
          description: "Help resources will be available in a future update.",
        });
      }
    }
  ];
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Educator Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Access your teaching resources, administrative tools, and student information
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documentation">Automated Documentation</TabsTrigger>
          <TabsTrigger value="lesson-planning">Smart Lesson Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative tools</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                    onClick={action.action}
                  >
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center mb-2">
                        {action.icon}
                        <span className="ml-2 font-medium">{action.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{action.description}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Documentation</CardTitle>
                  <CardDescription>Your recently created documentation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentDocuments.map(doc => (
                    <div key={doc.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('documentation')}>
                    View All Documentation
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Lesson Plans</CardTitle>
                  <CardDescription>Your recently created lesson plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentLessonPlans.map(plan => (
                    <div key={plan.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-sm text-muted-foreground">{plan.subject} | {plan.yearGroup} | {plan.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('lesson-planning')}>
                    View All Lesson Plans
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Administrative Automation</CardTitle>
              <CardDescription>AI-powered tools to reduce your administrative burden</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                The Teacher Administrative Automation tools help you save time on paperwork and administrative tasks,
                allowing you to focus more on teaching and supporting your students.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>
                  <strong>Automated Documentation</strong> - Easily create structured documentation for classroom observations,
                  student conferences, behavior incidents, parent meetings, and lesson reflections.
                </li>
                <li>
                  <strong>Smart Lesson Planning</strong> - Design comprehensive, differentiated lesson plans aligned with
                  UK curriculum standards, with AI assistance for each section.
                </li>
                <li>
                  <strong>Voice Input Support</strong> - Record observations and notes using voice input for hands-free documentation.
                </li>
                <li>
                  <strong>Differentiation Support</strong> - Get suggestions for accommodating different learning styles and
                  special educational needs in your lesson plans.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('documentation')}>
                Try Automated Documentation
              </Button>
              <Button onClick={() => setActiveTab('lesson-planning')}>
                Try Smart Lesson Planning
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation">
          <AutomatedDocumentation />
        </TabsContent>
        
        <TabsContent value="lesson-planning">
          <SmartLessonPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
}

