'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Original component

const ResearchCollaboration = dynamic(
  () => import('@/components/professional-development/research-collaboration')
);

const ResearchCollaborationDashboard = dynamic(
  () => import('@/components/professional-development/research-collaboration-dashboard')
);

function ResearchCollaborationPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <ResearchCollaboration />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <ResearchCollaborationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default ResearchCollaborationPage;