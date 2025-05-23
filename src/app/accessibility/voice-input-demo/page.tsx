'use client';

import React, { useState, useEffect } from 'react';
import { VoiceInputField } from '@/components/ui/voice-input-field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';

export function VoiceInputDemo() {
  const [demoText, setDemoText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Voice Input Accessibility Demo</h1>
      
      <p className="mb-6">
        This demo showcases the voice input functionality integrated throughout the platform.
        Try using your voice to fill in the form fields below.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Form Example</TabsTrigger>
          <TabsTrigger value="notes">Notes Example</TabsTrigger>
          <TabsTrigger value="search">Search Example</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Student Information Form</CardTitle>
              <CardDescription>
                Enter student details using voice input or keyboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearGroup">Year Group</Label>
                  <Select>
                    <SelectTrigger id="yearGroup">
                      <SelectValue placeholder="Select year group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="year1">Year 1</SelectItem>
                      <SelectItem value="year2">Year 2</SelectItem>
                      <SelectItem value="year3">Year 3</SelectItem>
                      <SelectItem value="year4">Year 4</SelectItem>
                      <SelectItem value="year5">Year 5</SelectItem>
                      <SelectItem value="year6">Year 6</SelectItem>
                      <SelectItem value="year7">Year 7</SelectItem>
                      <SelectItem value="year8">Year 8</SelectItem>
                      <SelectItem value="year9">Year 9</SelectItem>
                      <SelectItem value="year10">Year 10</SelectItem>
                      <SelectItem value="year11">Year 11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests and Hobbies</Label>
                  <VoiceInputField
                    id="interests"
                    placeholder="Describe student's interests and hobbies..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Learning Style Observations</Label>
                  <VoiceInputField
                    id="learningStyle"
                    placeholder="Describe observed learning preferences and styles..."
                    rows={4}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </form>
            
            {formSubmitted && (
              <div className="px-6 pb-6">
                <Alert variant="success">
                  Form submitted successfully!
                </Alert>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>
                Record your session notes using voice input
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionNotes">Session Notes</Label>
                  <VoiceInputField
                    id="sessionNotes"
                    placeholder="Record your session notes here..."
                    rows={8}
                    value={demoText}
                    onChange={setDemoText}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Submit Notes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Resource Search</CardTitle>
              <CardDescription>
                Search for educational resources using voice input
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <VoiceInputField
                    id="searchQuery"
                    placeholder="Search for resources..."
                    rows={1}
                    className="flex-1"
                  />
                  <Button>Search</Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Advanced Search</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maths">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="geography">Geography</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger id="keyStage">
                        <SelectValue placeholder="Key Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ks1">Key Stage 1</SelectItem>
                        <SelectItem value="ks2">Key Stage 2</SelectItem>
                        <SelectItem value="ks3">Key Stage 3</SelectItem>
                        <SelectItem value="ks4">Key Stage 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-center text-muted-foreground">
                    Search results will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-xl font-semibold mb-2">How to Use Voice Input</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click on any text field with the microphone icon</li>
          <li>Click the "Start" button to begin recording</li>
          <li>Speak clearly into your microphone</li>
          <li>Click "Stop" when you're finished</li>
          <li>Your speech will be converted to text and inserted into the field</li>
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">
          Voice input is available throughout the platform and supports special educational needs with features like articulation support, fluency support, and child voice optimization.
        </p>
      </div>
    </div>
  );
}

export default VoiceInputDemo;
