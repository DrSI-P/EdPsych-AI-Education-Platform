"use client";

import React from 'react';
import dynamic from "next/dynamic";


const TeacherAutomation = dynamic(
  () => import('@/components/ai/teacher-automation/teacher-automation')
);

function TeacherAutomationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Administrative Automation</h1>
        <p className="text-muted-foreground">
          Save time on administrative tasks with AI-powered document generation, allowing more focus on teaching and student relationships.
        </p>
      </div>
      
      <TeacherAutomation />
    </div>
  );
}


export default TeacherAutomationPage;