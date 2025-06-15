'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from 'next/image';

// Temporary simple header/footer components
function SimpleHeader() {
  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4">
        <h1 className="text-2xl font-bold">EdPsych Connect</h1>
      </div>
    </header>
  );
}

function SimpleFooter() {
  return (
    <footer className="bg-background border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">© 2025 EdPsych Connect. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Original component
function FoundationsOfEducationalPsychology() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar - Module navigation */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Module Navigation</CardTitle>
                <CardDescription>Foundations of Educational Psychology</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Introduction to Educational Psychology</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Child Development and Learning Theories</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. UK Educational Framework</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Evidence-Based Practice</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </nav>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
                  <Progress value={25} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">1 of 4 units completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Introduction to Educational Psychology</CardTitle>
                    <CardDescription>Foundations of Educational Psychology - Unit 1</CardDescription>
                  </div>
                  <Badge>25 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Educational psychology is the scientific study of how people learn and how teachers can foster learning. 
                    This unit introduces the fundamental principles of educational psychology and their application in UK educational settings.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Save Progress</Button>
                <div className="space-x-2">
                  <Button variant="outline" disabled>Previous Unit</Button>
                  <Button>
                    Next Unit: Child Development and Learning Theories
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <SimpleFooter />
    </div>
  );
}

export default FoundationsOfEducationalPsychology;

// Force dynamic rendering to avoid SSR issues with client components
export const dynamic = 'force-dynamic';