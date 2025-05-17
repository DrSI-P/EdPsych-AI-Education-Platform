'use client';

import { useState } from 'react';
import SpeechRecognitionEngine from '@/components/ai/speech-recognition/speech-recognition-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen, PenTool, Headphones, MessageSquare } from "lucide-react";

export default function SpeechRecognitionPage() {
  const [transcript, setTranscript] = useState('');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Speech Recognition</h1>
          <p className="text-muted-foreground">
            Voice input optimized for children's voices, making the platform accessible to all learners.
          </p>
        </div>
        
        <Tabs defaultValue="try" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="try">Try It Out</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="try" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpeechRecognitionEngine 
                onTranscriptChange={setTranscript}
                placeholder="Click 'Start Listening' and speak to see how our advanced speech recognition works..."
                childVoiceOptimization={true}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Use Cases
                  </CardTitle>
                  <CardDescription>
                    Ways to use speech recognition across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Assignments & Assessments
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Students can dictate answers to open-ended questions, making assessments accessible to those who struggle with typing.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Classroom Discussions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Capture and transcribe classroom discussions, ensuring all voices are heard and documented.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Platform Navigation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate the entire platform using voice commands, making it accessible to users with motor difficulties.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Advanced Speech Recognition</CardTitle>
                <CardDescription>
                  Understanding how this feature enhances accessibility and engagement
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Advanced Speech Recognition?</h3>
                  <p>
                    Our Advanced Speech Recognition is specifically optimized for children's voices, addressing the unique challenges that standard speech recognition systems face when processing children's speech patterns.
                  </p>
                  <p className="mt-2">
                    Unlike conventional systems that are trained primarily on adult voices, our technology accounts for the higher pitch, different pronunciation patterns, and unique vocabulary of children across different age groups.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Child Voice Optimization:</span> Specially calibrated for the unique speech patterns of children aged 3-18.
                    </li>
                    <li>
                      <span className="font-medium">UK English Support:</span> Optimized for UK accents, dialects, and terminology used in British schools.
                    </li>
                    <li>
                      <span className="font-medium">Background Noise Reduction:</span> Filters out classroom noise for clearer recognition in educational settings.
                    </li>
                    <li>
                      <span className="font-medium">Auto-Punctuation:</span> Automatically adds appropriate punctuation to transcribed text.
                    </li>
                    <li>
                      <span className="font-medium">Adjustable Confidence Threshold:</span> Customizable accuracy settings to balance between recognition accuracy and inclusivity.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Accessibility Benefits</h3>
                  <p>
                    This feature significantly enhances accessibility for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Students with dyslexia or other writing difficulties</li>
                    <li>Younger learners still developing typing skills</li>
                    <li>Students with motor coordination challenges</li>
                    <li>English language learners who may speak better than they write</li>
                    <li>Students who process information better through verbal expression</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our speech recognition technology is built on research into children's speech development and the specific challenges of processing children's voices. The system continuously improves through machine learning, adapting to different accents, speech patterns, and educational vocabulary.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy and Security</h3>
                  <p>
                    All speech processing is handled with strict privacy controls. Audio data is processed securely, and no recordings are stored longer than necessary for the immediate task. The system complies with all UK data protection regulations for educational settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
