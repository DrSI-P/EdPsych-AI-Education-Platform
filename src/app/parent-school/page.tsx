'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";




// Original component

const ParentCommunication = dynamic(
  () => import('@/components/parent-school/parent-communication')
);

const SharedGoalTracking = dynamic(
  () => import('@/components/parent-school/shared-goal-tracking')
);

const HomeStrategyLibrary = dynamic(
  () => import('@/components/parent-school/home-strategy-library')
);

const VirtualConferenceTools = dynamic(
  () => import('@/components/parent-school/virtual-conference-tools')
);

function ParentSchoolCollaborationHub() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Parent-School Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Strengthen the partnership between home and school with our comprehensive collaboration tools
        </p>
      </div>
      
      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Library</TabsTrigger>
          <TabsTrigger value="conferences">Conferences & Celebrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communication" className="mt-6">
          <ParentCommunication />
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <SharedGoalTracking />
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-6">
          <HomeStrategyLibrary />
        </TabsContent>
        
        <TabsContent value="conferences" className="mt-6">
          <VirtualConferenceTools />
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default ParentSchoolCollaborationHub;