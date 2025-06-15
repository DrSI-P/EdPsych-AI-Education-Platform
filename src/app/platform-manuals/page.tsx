'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Home, 
  Settings,
  FileText,
  HelpCircle,
  Search,
  ChevronRight
} from 'lucide-react';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function PlatformManualsPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center mb-12">
          <Heading level="h1" className="mb-4">EdPsych AI Platform Manuals</Heading>
          <Text className="text-xl max-w-3xl mx-auto">
            Comprehensive guides for all users of the EdPsych AI Platform. Select the manual that matches your role to get started.
          </Text>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input 
              type="search" 
              className="block w-full p-4 pl-10 text-sm border rounded-lg bg-background" 
              placeholder="Search across all manuals..." 
            />
            <Button className="absolute right-2.5 bottom-2.5">
              Search
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Educator Manual */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <Heading level="h2" className="text-xl mb-2">Educator Manual</Heading>
                <Text className="text-muted-foreground mb-4">
                  A comprehensive guide for teachers and instructors using the platform to enhance teaching and learning.
                </Text>
              </div>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/platform-manuals/educator">
                    View Manual
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Student Manual */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <Heading level="h2" className="text-xl mb-2">Student Manual</Heading>
                <Text className="text-muted-foreground mb-4">
                  A guide for students to navigate the platform, access learning materials, and track progress.
                </Text>
              </div>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/platform-manuals/student">
                    View Manual
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Parent/Guardian Manual */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <Heading level="h2" className="text-xl mb-2">Parent/Guardian Manual</Heading>
                <Text className="text-muted-foreground mb-4">
                  A guide for parents and guardians to monitor student progress and support learning at home.
                </Text>
              </div>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/platform-manuals/parent">
                    View Manual
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Administrator Manual */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <Heading level="h2" className="text-xl mb-2">Administrator Manual</Heading>
                <Text className="text-muted-foreground mb-4">
                  A detailed guide for system administrators to configure, manage, and maintain the platform.
                </Text>
              </div>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/platform-manuals/administrator">
                    View Manual
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <Heading level="h2" className="text-xl mb-4">Feature-Specific Guides</Heading>
            <Text className="mb-4">
              Detailed documentation for specific platform features and capabilities.
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features/ai-lesson-planning">
                  <FileText className="mr-2 h-4 w-4" />
                  AI Lesson Planning
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features/content-differentiation">
                  <FileText className="mr-2 h-4 w-4" />
                  Content Differentiation
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features/assessment-generation">
                  <FileText className="mr-2 h-4 w-4" />
                  Assessment Generation
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features/analytics-reporting">
                  <FileText className="mr-2 h-4 w-4" />
                  Analytics & Reporting
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features/subscription-credits">
                  <FileText className="mr-2 h-4 w-4" />
                  Subscription & Credits
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/features">
                  View All Feature Guides
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <Heading level="h2" className="text-xl mb-4">Quick Reference Materials</Heading>
            <Text className="mb-4">
              Concise guides for common tasks and quick answers to frequently asked questions.
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference/educator">
                  <FileText className="mr-2 h-4 w-4" />
                  Educator Quick Start
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference/student">
                  <FileText className="mr-2 h-4 w-4" />
                  Student Quick Start
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference/parent">
                  <FileText className="mr-2 h-4 w-4" />
                  Parent Quick Start
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference/administrator">
                  <FileText className="mr-2 h-4 w-4" />
                  Administrator Quick Start
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference/ui-elements">
                  <FileText className="mr-2 h-4 w-4" />
                  UI Elements Guide
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/platform-manuals/quick-reference">
                  View All Quick References
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
        
        <Card className="p-6 mb-8">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-6 w-6 text-primary mr-2" />
            <Heading level="h2" className="text-xl">Need Additional Help?</Heading>
          </div>
          <Text className="mb-4">
            If you can't find what you're looking for in our documentation, there are several ways to get assistance:
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/help/contact">
                Contact Support Team
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/help/community">
                Community Forums
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/help/training">
                Request Training
              </Link>
            </Button>
          </div>
        </Card>
        
        <div className="text-center">
          <Text className="text-sm text-muted-foreground">
            All documentation is regularly updated to reflect the latest platform features and improvements.
            Last updated: June 2025
          </Text>
        </div>
      </div>
    </AIEnhancedLayout>
  );
}

export default PlatformManualsPage;