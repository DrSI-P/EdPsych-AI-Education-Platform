'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentLedConferenceTool from '@/components/student-voice/student-led-conference-tool';
import CollaborativeGoalSetting from '@/components/student-voice/collaborative-goal-setting';

export default function StudentVoiceExpansionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Student Voice Expansion</h1>
        <p className="text-xl text-muted-foreground">
          Tools for student-led conferences and collaborative goal setting
        </p>
      </div>
      
      <Tabs defaultValue="conferences" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="conferences">Student-Led Conferences</TabsTrigger>
          <TabsTrigger value="goals">Collaborative Goal Setting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conferences">
          <StudentLedConferenceTool />
        </TabsContent>
        
        <TabsContent value="goals">
          <CollaborativeGoalSetting />
        </TabsContent>
      </Tabs>
    </div>
  );
}
