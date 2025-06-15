'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Original component

const ParentSchoolCollaboration = dynamic(
  () => import('@/components/parent-school/parent-school-collaboration')
);

function ParentSchoolCollaborationPage() {
  return (
    <div className="container mx-auto py-6">
      <ParentSchoolCollaboration />
    </div>
  );
}


export default ParentSchoolCollaborationPage;