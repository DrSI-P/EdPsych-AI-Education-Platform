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
  BookOpen, 
  Brain,
  FileText,
  HelpCircle,
  ChevronLeft,
  Download,
  Printer,
  Share2,
  Lightbulb,
  Target,
  Sliders,
  CheckCircle,
  Clock,
  Layers,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function AILessonPlanningGuidePage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link href="/platform-manuals/features">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Feature Guides
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">AI Lesson Planning Guide</Heading>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Text className="text-xl">
            A comprehensive guide to creating effective lesson plans with AI assistance
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
                <a href="#creating-plans" className="block p-2 hover:bg-muted rounded-md">Creating Lesson Plans</a>
                <a href="#templates" className="block p-2 hover:bg-muted rounded-md">Using Templates</a>
                <a href="#curriculum-alignment" className="block p-2 hover:bg-muted rounded-md">Curriculum Alignment</a>
                <a href="#differentiation" className="block p-2 hover:bg-muted rounded-md">Differentiation</a>
                <a href="#collaboration" className="block p-2 hover:bg-muted rounded-md">Collaboration</a>
                <a href="#organization" className="block p-2 hover:bg-muted rounded-md">Organization</a>
                <a href="#advanced" className="block p-2 hover:bg-muted rounded-md">Advanced Techniques</a>
                <a href="#best-practices" className="block p-2 hover:bg-muted rounded-md">Best Practices</a>
              </nav>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/platform-manuals/quick-reference/ai-lesson-planning">
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
                <Heading level="h2" className="mb-4">Introduction to AI Lesson Planning</Heading>
                <Text className="mb-4">
                  The AI Lesson Planning feature combines educational expertise with artificial intelligence to help you create engaging, standards-aligned lesson plans in a fraction of the time it would take manually. This guide will walk you through how to use this powerful tool effectively.
                </Text>
                
                <div className="bg-muted p-4 rounded-md mb-6">
                  <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center mb-2">
                    <Text className="text-slate-500">AI Lesson Planning Overview Video</Text>
                  </div>
                  <Text className="text-sm text-center">Watch this short video for an overview of the AI Lesson Planning feature.</Text>
                </div>
                
                <Heading level="h3" className="mb-2">Key Benefits</Heading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Time Savings</Heading>
                      <Text>Create comprehensive lesson plans in minutes instead of hours.</Text>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Target className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Standards Alignment</Heading>
                      <Text>Automatically align lessons with curriculum standards.</Text>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Layers className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Differentiation</Heading>
                      <Text>Easily create variations for different learning needs.</Text>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RefreshCw className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Adaptability</Heading>
                      <Text>Quickly adjust plans based on changing needs or feedback.</Text>
                    </div>
                  </div>
                </div>
                
                <Text>
                  The AI Lesson Planning tool learns from your teaching style and preferences over time, becoming more tailored to your specific needs with each use. It's designed to enhance your expertise, not replace it, by handling the time-consuming aspects of lesson planning whilst allowing you to focus on the creative and pedagogical elements.
                </Text>
              </Card>
            </section>
            
            <section id="getting-started">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">Getting Started</Heading>
                
                <Tabs defaultValue="accessing">
                  <TabsList className="mb-4">
                    <TabsTrigger value="accessing">Accessing the Tool</TabsTrigger>
                    <TabsTrigger value="interface">Interface Overview</TabsTrigger>
                    <TabsTrigger value="preferences">Setting Preferences</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="accessing">
                    <Heading level="h3" className="mb-2">Accessing the AI Lesson Planning Tool</Heading>
                    <Text className="mb-4">
                      There are several ways to access the AI Lesson Planning tool:
                    </Text>
                    <ol className="list-decimal pl-8 mb-4 space-y-2">
                      <li>
                        <Text>
                          <span className="font-medium">Dashboard:</span> Click the "Create" button on your dashboard and select "Lesson Plan" from the dropdown menu.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Navigation Menu:</span> Select "Lesson Planning" from the main navigation menu.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Quick Actions:</span> Use the "New Lesson Plan" quick action button if you've added it to your dashboard.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Calendar:</span> Click on a date in your calendar and select "Create Lesson Plan" from the options.
                        </Text>
                      </li>
                    </ol>
                    <div className="bg-muted p-4 rounded-md">
                      <Text className="font-medium">Pro Tip:</Text>
                      <Text>Add the AI Lesson Planning tool to your Quick Actions for faster access. Go to Dashboard Settings {'>'} Quick Actions {'>'} Add/Remove and select "AI Lesson Planning".</Text>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interface">
                    <Heading level="h3" className="mb-2">Interface Overview</Heading>
                    <Text className="mb-4">
                      The AI Lesson Planning interface is divided into several key sections:
                    </Text>
                    <div className="space-y-4 mb-4">
                      <div>
                        <Heading level="h4" className="text-lg mb-1">1. Parameters Panel</Heading>
                        <Text>Located on the left side, this is where you define the basic parameters of your lesson plan, including subject, mark level, duration, and learning objectives.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">2. Content Editor</Heading>
                        <Text>The central area where you view and edit the generated lesson plan content.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">3. AI Assistant Panel</Heading>
                        <Text>Located on the right side, this panel provides suggestions, alternatives, and enhancements for your lesson plan.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">4. Template Library</Heading>
                        <Text>Access saved templates and previously created lesson plans for reference or reuse.</Text>
                      </div>
                      <div>
                        <Heading level="h4" className="text-lg mb-1">5. Resource Suggestions</Heading>
                        <Text>Recommended resources, activities, and materials that complement your lesson plan.</Text>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <Text className="font-medium">Note:</Text>
                      <Text>You can collapse any panel to create more space for the content editor by clicking the arrow icon in the panel header.</Text>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preferences">
                    <Heading level="h3" className="mb-2">Setting Your Preferences</Heading>
                    <Text className="mb-4">
                      Before creating your first lesson plan, it's helpful to set up your preferences to ensure the AI generates content aligned with your teaching style and requirements:
                    </Text>
                    <ol className="list-decimal pl-8 mb-4 space-y-2">
                      <li>
                        <Text>
                          <span className="font-medium">Teaching Philosophy:</span> Specify your teaching philosophy (e.g., constructivist, inquiry-based, direct instruction) to influence the types of activities suggested.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Preferred Structure:</span> Define your preferred lesson structure (e.g., 5E model, gradual release, workshop model).
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Assessment Preferences:</span> Indicate your preferred assessment methods and frequency.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Resource Types:</span> Select the types of resources you typically use or have access to.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          <span className="font-medium">Curriculum Standards:</span> Set your default curriculum standards framework.
                        </Text>
                      </li>
                    </ol>
                    <Text className="mb-4">
                      To access preference settings, click the "Settings" gear icon in the top-right corner of the AI Lesson Planning interface and select "Preferences."
                    </Text>
                    <div className="bg-muted p-4 rounded-md">
                      <Text className="font-medium">Pro Tip:</Text>
                      <Text>You can create multiple preference profiles for different subjects or contexts. For example, you might have different preferences for mathematics versus language arts lessons.</Text>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </section>
            
            <section id="creating-plans">
              <Card className="p-6">
                <Heading level="h2" className="mb-4">Creating Lesson Plans</Heading>
                <Text className="mb-4">
                  Creating a lesson plan with the AI assistant is a straightforward process that can be completed in just a few minutes.
                </Text>
                
                <Heading level="h3" className="mb-2">Step-by-Step Process</Heading>
                <ol className="list-decimal pl-8 mb-6 space-y-4">
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Define Basic Parameters</Heading>
                      <Text className="mb-2">Start by providing the essential information about your lesson:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Subject area and specific topic</Text></li>
                        <li><Text>Mark level or year group</Text></li>
                        <li><Text>Lesson duration</Text></li>
                        <li><Text>Learning objectives or outcomes</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Select Curriculum Standards</Heading>
                      <Text className="mb-2">Choose the relevant curriculum standards for your lesson:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Browse or search for applicable standards</Text></li>
                        <li><Text>Select primary and secondary standards</Text></li>
                        <li><Text>Review AI-suggested standards based on your topic</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Generate Initial Plan</Heading>
                      <Text className="mb-2">Click "Generate Plan" to create an AI-recommended lesson structure:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>The AI will create a complete lesson plan structure</Text></li>
                        <li><Text>Review the generated plan sections</Text></li>
                        <li><Text>Use the "Regenerate" option for specific sections if needed</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Customise Content</Heading>
                      <Text className="mb-2">Modify the generated plan to suit your specific needs:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Edit any section directly in the content editor</Text></li>
                        <li><Text>Add, remove, or rearrange sections as needed</Text></li>
                        <li><Text>Use the AI suggestions panel for alternative approaches</Text></li>
                        <li><Text>Incorporate your own activities and resources</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Add Resources</Heading>
                      <Text className="mb-2">Enhance your lesson with supporting materials:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Browse AI-suggested resources relevant to your lesson</Text></li>
                        <li><Text>Upload your own resources and materials</Text></li>
                        <li><Text>Link to external websites and tools</Text></li>
                        <li><Text>Create or request supplementary worksheets and handouts</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Review and Finalise</Heading>
                      <Text className="mb-2">Ensure your lesson plan is complete and effective:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Use the "Review" feature to check alignment with standards</Text></li>
                        <li><Text>Verify timing for each section of the lesson</Text></li>
                        <li><Text>Check for differentiation options</Text></li>
                        <li><Text>Ensure all resources are properly linked</Text></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Heading level="h4" className="text-lg mb-1">Save and Share</Heading>
                      <Text className="mb-2">Preserve and distribute your lesson plan:</Text>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><Text>Save the lesson plan to your library</Text></li>
                        <li><Text>Optionally save as a template for future use</Text></li>
                        <li><Text>Share with colleagues or teaching assistants if desired</Text></li>
                        <li><Text>Export in various formats (PDF, Word, HTML)</Text></li>
                      </ul>
                    </div>
                  </li>
                </ol>
                
                <div className="bg-muted p-4 rounded-md">
                  <Heading level="h3" className="text-lg mb-2">Quick Creation Mode</Heading>
                  <Text className="mb-2">
                    For experienced users, the "Quick Creation" mode allows you to generate a complete lesson plan with minimal input:
                  </Text>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li><Text>Click "Quick Create" from the main Lesson Planning page</Text></li>
                    <li><Text>Enter a brief description of your lesson (e.g., "Year 8 introduction to photosynthesis, 60 minutes")</Text></li>
                    <li><Text>The AI will generate a complete plan based on your description and preferences</Text></li>
                    <li><Text>Review and customise as needed</Text></li>
                  </ol>
                  <Text className="mt-2 italic">
                    Note: Quick Creation works best after you've created several lesson plans and the AI has learnt your preferences.
                  </Text>
                </div>
              </Card>
            </section>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link href="#introduction">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Introduction
                </Link>
              </Button>
              <Button asChild>
                <Link href="#templates">
                  Next: Using Templates
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

export default AILessonPlanningGuidePage;