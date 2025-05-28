'use client';

import React, { useState, useEffect } from 'react';
import { VoiceInputProvider } from '@/providers/voice-input-provider';
import UniversalVoiceInput from '@/components/voice-input/universal-voice-input';
import AssessmentVoiceInput from '@/components/voice-input/activity-specific/assessment-voice-input';
import AdaptiveComplexityVoiceInput from '@/components/voice-input/activity-specific/adaptive-complexity-voice-input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';
import { Button } from '../../components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui';
import { Textarea } from '../../components/ui';
import { Label } from '../../components/ui';
import { AgeGroup } from '@/providers/voice-input-provider';
import { motion } from 'framer-motion';

/**
 * Voice Input Test Page
 * 
 * This page provides a testing environment for the voice input feature,
 * allowing developers to test different components, age groups, and scenarios.
 */
export default function VoiceInputTestPage() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('late-primary');
  const [transcript, setTranscript] = useState('');
  const [activeTab, setActiveTab] = useState('universal');
  const [questionType, setQuestionType] = useState('short-answer');
  const [complexityLevel, setComplexityLevel] = useState('intermediate');
  
  // Handle transcript change
  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
  };
  
  // Handle completion
  const handleComplete = (finalTranscript: string) => {
    console.log('Voice input complete:', finalTranscript);
  };
  
  return (
    <VoiceInputProvider initialAgeGroup={ageGroup}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Voice Input Testing</h1>
          <p className="text-grey-600 mb-6">
            Test the enhanced voice input feature across different age groups and scenarios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Age Group</CardTitle>
                <CardDescription>Select the target age group for testing</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value as AgeGroup)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nursery">Nursery (3-5 years)</SelectItem>
                    <SelectItem value="early-primary">Early Primary (5-8 years)</SelectItem>
                    <SelectItem value="late-primary">Late Primary (8-11 years)</SelectItem>
                    <SelectItem value="secondary">Secondary (11+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Component Type</CardTitle>
                <CardDescription>Select the voice input component to test</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="universal">Universal</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="adaptive">Adaptive</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Component Settings</CardTitle>
                <CardDescription>Configure component-specific settings</CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'assessment' && (
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                {activeTab === 'adaptive' && (
                  <Select value={complexityLevel} onValueChange={setComplexityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                {activeTab === 'universal' && (
                  <p className="text-sm text-grey-500">
                    No additional settings for universal component.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Voice Input Component</h2>
              
              <TabsContent value="universal" className="mt-0" forceMount={activeTab === 'universal'}>
                {activeTab === 'universal' && (
                  <UniversalVoiceInput 
                    onTranscriptChange={handleTranscriptChange}
                    onComplete={handleComplete}
                    placeholder="Speak to test the universal voice input component..."
                    mode="standard"
                    showSettings={true}
                    className="mb-4"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="assessment" className="mt-0" forceMount={activeTab === 'assessment'}>
                {activeTab === 'assessment' && (
                  <AssessmentVoiceInput 
                    onTranscriptChange={handleTranscriptChange}
                    onComplete={handleComplete}
                    placeholder="Speak to test the assessment voice input component..."
                    questionType={questionType as 'multiple-choice' | 'short-answer' | 'essay'}
                    className="mb-4"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="adaptive" className="mt-0" forceMount={activeTab === 'adaptive'}>
                {activeTab === 'adaptive' && (
                  <AdaptiveComplexityVoiceInput 
                    onTranscriptChange={handleTranscriptChange}
                    onComplete={handleComplete}
                    placeholder="Speak to test the adaptive complexity voice input component..."
                    complexityLevel={complexityLevel as 'beginner' | 'intermediate' | 'advanced' | 'expert'}
                    className="mb-4"
                  />
                )}
              </TabsContent>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Testing Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>1. Select an age group to test different UI presentations</p>
                  <p>2. Try different component types for specific use cases</p>
                  <p>3. Test with various settings and configurations</p>
                  <p>4. Verify that the transcript appears correctly in the output area</p>
                  <p>5. Check that the UI is appropriate for the selected age group</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Voice Input Output</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transcript</CardTitle>
                  <CardDescription>The text generated from your speech</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Your speech transcript will appear here..."
                    className="min-h-[200px]"
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setTranscript('')}>
                      Clear Transcript
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Current Configuration</Label>
                      <div className="text-sm mt-1 space-y-1">
                        <p><span className="font-medium">Age Group:</span> {ageGroup}</p>
                        <p><span className="font-medium">Component Type:</span> {activeTab}</p>
                        {activeTab === 'assessment' && (
                          <p><span className="font-medium">Question Type:</span> {questionType}</p>
                        )}
                        {activeTab === 'adaptive' && (
                          <p><span className="font-medium">Complexity Level:</span> {complexityLevel}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Testing Checklist</Label>
                      <ul className="text-sm mt-1 space-y-1 list-disc pl-5">
                        <li>UI is appropriate for selected age group</li>
                        <li>Voice recognition works correctly</li>
                        <li>Transcript updates in real-time</li>
                        <li>Component responds to settings changes</li>
                        <li>Error handling works as expected</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </VoiceInputProvider>
  );
}
