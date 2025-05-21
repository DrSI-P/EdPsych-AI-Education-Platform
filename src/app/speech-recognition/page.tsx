'use client';

import { useState } from 'react';
import AdvancedSpeechRecognition from '@/components/ai/speech-recognition/advanced-speech-recognition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Mic, BookOpen, CheckCircle2 } from 'lucide-react';

export default function SpeechRecognitionPage() {
  const [transcript, setTranscript] = useState('');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Speech Recognition</h1>
          <p className="text-muted-foreground">
            Optimised for children's voices with enhanced accuracy and accessibility
          </p>
        </div>
        
        <Tabs defaultValue="recognition" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recognition">Speech Recognition</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recognition" className="pt-4">
            <AdvancedSpeechRecognition 
              onTranscriptChange={setTranscript}
              showCalibration={true}
              className="mb-6"
            />
            
            {transcript && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recognised Text</CardTitle>
                  <CardDescription>
                    Your speech has been converted to text
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-md">
                    {transcript}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Advanced Speech Recognition</CardTitle>
                <CardDescription>
                  Understanding how this feature supports accessibility and inclusion
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Advanced Speech Recognition?</h3>
                  <p>
                    Our Advanced Speech Recognition is specially designed to accurately understand children's voices, 
                    which traditional speech recognition systems often struggle with. It provides a way for children 
                    who find typing difficult to interact with educational content through natural speech.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Child Voice Optimization</span>
                        <p className="text-muted-foreground">Specially tuned for higher-pitched voices and developing speech patterns</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Voice Calibration</span>
                        <p className="text-muted-foreground">Personalized voice profile creation for improved accuracy</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">UK English Optimization</span>
                        <p className="text-muted-foreground">Specifically designed for UK accents and dialects</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Noise Reduction</span>
                        <p className="text-muted-foreground">Filters out background classroom noise for clearer recognition</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Punctuation Prediction</span>
                        <p className="text-muted-foreground">Automatically adds appropriate punctuation to spoken text</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">How It Works</h3>
                  <p className="mb-2">
                    Our speech recognition system uses advanced machine learning models specifically trained on children's voices 
                    across different age groups and developmental stages. The system adapts to individual speech patterns through 
                    calibration and continuous learning.
                  </p>
                  <p>
                    The voice calibration process creates a personalized profile that improves recognition accuracy for each child's 
                    unique voice characteristics, including pitch, pronunciation patterns, and speech rhythm.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Removes barriers for children who struggle with typing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Supports children with dyslexia, dyspraxia, and motor difficulties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Enables more natural interaction with educational content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Builds confidence in verbal expression and communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Provides an alternative input method for all learning activities</span>
                    </li>
                  </ul>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Evidence-Based Approach</AlertTitle>
                  <AlertDescription>
                    This feature is developed based on research in speech recognition technology for children, 
                    accessibility standards, and educational psychology principles that support diverse learning needs.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
