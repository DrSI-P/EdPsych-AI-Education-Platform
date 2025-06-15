'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  BarChart, 
  FileText,
  Brain,
  MessageSquare,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  Download,
  Printer,
  Share2
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function EducatorManualPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link href="/platform-manuals">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Manuals
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center mb-6">
          <GraduationCap className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">Educator Manual</Heading>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Text className="text-xl">
            A comprehensive guide for educators using the EdPsych AI Platform
          </Text>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4 sticky top-4">
              <Heading level="h3" className="mb-4">Table of Contents</Heading>
              <nav className="space-y-1">
                <a href="#introduction" className="block p-2 hover:bg-muted rounded-md">Introduction</a>
                <a href="#getting-started" className="block p-2 hover:bg-muted rounded-md">Getting Started</a>
                <a href="#dashboard" className="block p-2 hover:bg-muted rounded-md">Dashboard Overview</a>
                <a href="#lesson-planning" className="block p-2 hover:bg-muted rounded-md">AI Lesson Planning</a>
                <a href="#content-differentiation" className="block p-2 hover:bg-muted rounded-md">Content Differentiation</a>
                <a href="#assessments" className="block p-2 hover:bg-muted rounded-md">Assessments</a>
                <a href="#analytics" className="block p-2 hover:bg-muted rounded-md">Student Analytics</a>
                <a href="#communication" className="block p-2 hover:bg-muted rounded-md">Communication Tools</a>
                <a href="#credits" className="block p-2 hover:bg-muted rounded-md">Credits Management</a>
                <a href="#best-practices" className="block p-2 hover:bg-muted rounded-md">Best Practices</a>
                <a href="#troubleshooting" className="block p-2 hover:bg-muted rounded-md">Troubleshooting</a>
              </nav>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/platform-manuals/quick-reference/educator">
                    <FileText className="mr-2 h-4 w-4" />
                    Quick Reference Guide
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Help
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <section id="introduction">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">Introduction</Heading>
                <Text className="mb-4">
                  Welcome to the EdPsych AI Platform Educator Manual. This comprehensive guide will help you navigate and utilize the platform's features to enhance your teaching and improve student outcomes.
                </Text>
                <Text className="mb-4">
                  The EdPsych AI Platform combines educational psychology principles with artificial intelligence to provide personalized learning experiences, intelligent content differentiation, and data-driven insights.
                </Text>
                <Text className="mb-4">
                  As an educator, you have access to a suite of AI-powered tools designed to:
                </Text>
                <ul className="list-disc pl-8 mb-4 space-y-2">
                  <li>
                    <Text>Create personalized lesson plans aligned with curriculum standards</Text>
                  </li>
                  <li>
                    <Text>Differentiate content for diverse learning needs</Text>
                  </li>
                  <li>
                    <Text>Generate assessments with automatic marking</Text>
                  </li>
                  <li>
                    <Text>Analyze student performance with actionable insights</Text>
                  </li>
                  <li>
                    <Text>Communicate effectively with students and parents</Text>
                  </li>
                </ul>
                <Text>
                  This manual will guide you through each feature, provide best practices, and help you troubleshoot common issues.
                </Text>
              </Card>
            </section>
            
            <section id="getting-started">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">Getting Started</Heading>
                
                <Tabs defaultValue="account-setup">
                  <TabsList className="mb-4">
                    <TabsTrigger value="account-setup">Account Setup</TabsTrigger>
                    <TabsTrigger value="profile">Profile Management</TabsTrigger>
                    <TabsTrigger value="first-login">First Login</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account-setup">
                    <Heading level="h3" className="mb-2">Account Setup</Heading>
                    <Text className="mb-4">
                      To get started with the EdPsych AI Platform, you'll need to set up your educator account:
                    </Text>
                    <ol className="list-decimal pl-8 mb-4 space-y-2">
                      <li>
                        <Text>
                          <span className="font-medium">Receive Invitation:</span> Your institution administrator will send you an email invitation to join the platform.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Create Account:</span> Click the link in the email and follow the prompts to create your account. You'll need to:
                          <ul className="list-disc pl-6 mt-2">
                            <li>Enter your full name and email address</li>
                            <li>Create a secure password</li>
                            <li>Select your role and subject areas</li>
                            <li>Accept the terms of service</li>
                          </ul>
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Verification:</span> Verify your email address by clicking the link sent to your inbox.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Complete Profile:</span> Fill out your educator profile with your teaching experience, mark levels, and subject specialties.
                        </Text>
                      </li>
                    </ol>
                    <div className="bg-muted p-4 rounded-md">
                      <Text className="font-medium">Note:</Text>
                      <Text>If you don't receive an invitation email, check your spam folder or contact your institution administrator.</Text>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="profile">
                    <Heading level="h3" className="mb-2">Profile Management</Heading>
                    <Text className="mb-4">
                      Your educator profile helps the AI personalize recommendations and content for your teaching style:
                    </Text>
                    <div className="space-y-4">
                      <div>
                        <Heading level="h4" className="text-lg mb-1">Personal Information</Heading>
                        <Text>Update your name, profile picture, contact information, and biography.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">Teaching Preferences</Heading>
                        <Text>Specify your teaching philosophy, preferred methodologies, and classroom management style.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">Subject Expertise</Heading>
                        <Text>Add your subject areas, mark levels, and areas of specialisation.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">Notification Settings</Heading>
                        <Text>Configure how and when you receive notifications about student activity, system updates, and more.</Text>
                      </div>
                    </div>
                    <Text className="mt-4">
                      To update your profile, click on your profile picture in the top-right corner and select "Profile Settings."
                    </Text>
                  </TabsContent>
                  
                  <TabsContent value="first-login">
                    <Heading level="h3" className="mb-2">First Login Experience</Heading>
                    <Text className="mb-4">
                      When you first log in to the EdPsych AI Platform, you'll be guided through an onboarding process:
                    </Text>
                    <ol className="list-decimal pl-8 mb-4 space-y-2">
                      <li>
                        <Text>
                          <span className="font-medium">Welcome Tour:</span> A guided tour of the platform's key features and navigation.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Teaching Style Assessment:</span> A brief questionnaire to help the AI understand your teaching preferences.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Class Setup:</span> Connect to your existing classes or create new ones.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Content Import:</span> Import existing lesson plans, assessments, and materials.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Goal Setting:</span> Establish your teaching goals and priorities for the term.
                        </Text>
                      </li>
                    </ol>
                    <Text>
                      You can revisit any part of this onboarding process later by going to Help {'>'} Onboarding in the main menu.
                    </Text>
                  </TabsContent>
                </Tabs>
              </Card>
            </section>
            
            <section id="dashboard">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">Dashboard Overview</Heading>
                <Text className="mb-4">
                  Your educator dashboard is the central hub for managing your classes, tracking student progress, and accessing platform features.
                </Text>
                
                <div className="bg-muted p-4 rounded-md mb-6">
                  <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center mb-2">
                    <Text className="text-slate-500">Dashboard Screenshot</Text>
                  </div>
                  <Text className="text-sm text-center">The educator dashboard provides a comprehensive overview of your classes and student activity.</Text>
                </div>
                
                <Heading level="h3" className="mb-2">Dashboard Sections</Heading>
                <div className="space-y-4 mb-6">
                  <div className="border rounded-md p-4">
                    <Heading level="h4" className="text-lg mb-1">Quick Actions</Heading>
                    <Text>Access frequently used features like creating a new lesson plan, generating an assessment, or sending a message.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <Heading level="h4" className="text-lg mb-1">Class Overview</Heading>
                    <Text>View all your classes with key metrics like upcoming assignments, recent activity, and overall performance.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <Heading level="h4" className="text-lg mb-1">Recent Activity</Heading>
                    <Text>See recent student submissions, completed assessments, and platform notifications.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <Heading level="h4" className="text-lg mb-1">Calendar</Heading>
                    <Text>View upcoming lessons, assignments, and important dates for your classes.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <Heading level="h4" className="text-lg mb-1">AI Insights</Heading>
                    <Text>Receive personalized recommendations and insights based on your teaching activity and student performance.</Text>
                  </div>
                </div>
                
                <Heading level="h3" className="mb-2">Customising Your Dashboard</Heading>
                <Text className="mb-4">
                  You can personalize your dashboard to focus on the information most relevant to you:
                </Text>
                <ul className="list-disc pl-8 mb-4">
                  <li>
                    <Text>Click the "Customise" button in the top-right corner of the dashboard</Text>
                  </li>
                  <li>
                    <Text>Drag and drop widgets to rearrange them</Text>
                  </li>
                  <li>
                    <Text>Add or remove widgets from the available options</Text>
                  </li>
                  <li>
                    <Text>Resize widgets to show more or less information</Text>
                  </li>
                  <li>
                    <Text>Save your layout or create multiple layouts for different purposes</Text>
                  </li>
                </ul>
              </Card>
            </section>
            
            <section id="lesson-planning">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">AI Lesson Planning</Heading>
                <Text className="mb-4">
                  The AI Lesson Planning feature helps you create engaging, standards-aligned lesson plans tailored to your teaching style and student needs.
                </Text>
                
                <div className="flex items-center justify-center mb-6">
                  <Button className="mr-4" asChild>
                    <Link href="/platform-manuals/features/ai-lesson-planning">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Detailed Lesson Planning Guide
                    </Link>
                  </Button>
                </div>
                
                <Heading level="h3" className="mb-2">Key Features</Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-primary mr-2" />
                      <Heading level="h4" className="text-lg">AI-Generated Content</Heading>
                    </div>
                    <Text>Generate complete lesson plans or specific components like objectives, activities, and assessments.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-primary mr-2" />
                      <Heading level="h4" className="text-lg">Standards Alignment</Heading>
                    </div>
                    <Text>Automatically align lessons with national, state, or district curriculum standards.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-primary mr-2" />
                      <Heading level="h4" className="text-lg">Differentiation Options</Heading>
                    </div>
                    <Text>Create variations of the same lesson for different learning needs and abilities.</Text>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-primary mr-2" />
                      <Heading level="h4" className="text-lg">Resource Suggestions</Heading>
                    </div>
                    <Text>Get recommendations for supplementary materials, activities, and digital resources.</Text>
                  </div>
                </div>
                
                <Heading level="h3" className="mb-2">Creating a Lesson Plan</Heading>
                <ol className="list-decimal pl-8 mb-6 space-y-2">
                  <li>
                    <Text>
                      <span className="font-medium">Start New Plan:</span> From your dashboard, click "Create" {'>'} "Lesson Plan" or navigate to the Lesson Planning section.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Define Parameters:</span> Specify the subject, mark level, topic, duration, and learning objectives.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Select Standards:</span> Choose the curriculum standards you want to address.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Generate Plan:</span> Click "Generate" to create an AI-recommended lesson plan.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Customise:</span> Edit any part of the generated plan to suit your needs.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Add Resources:</span> Attach or link to supplementary materials.
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <span className="font-medium">Save and Share:</span> Save your plan and optionally share it with colleagues.
                    </Text>
                  </li>
                </ol>
                
                <div className="bg-muted p-4 rounded-md">
                  <Heading level="h3" className="text-lg mb-2">Pro Tips</Heading>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Text>Use the "Inspiration" feature when you're not sure where to start with a topic.</Text>
                    </li>
                    <li>
                      <Text>Save successful lesson plans as templates for future use.</Text>
                    </li>
                    <li>
                      <Text>The more you use the AI Lesson Planning feature, the better it adapts to your teaching style.</Text>
                    </li>
                    <li>
                      <Text>Connect lesson plans to assessments for a complete learning cycle.</Text>
                    </li>
                  </ul>
                </div>
              </Card>
            </section>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" disabled>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous: Introduction
              </Button>
              <Button asChild>
                <Link href="#content-differentiation">
                  Next: Content Differentiation
                  <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AIEnhancedLayout>
  );
}

export default EducatorManualPage;