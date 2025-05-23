'use client';

import { useState } from 'react';
import Image from 'next/image';
import SpeechToTextEngine from '@/components/ai/accessibility/speech-to-text-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Keyboard, Mic, BookOpen, FileText, BookMarked } from "lucide-react";

export default function SpeechToTextPage() {
  const [sampleText, setSampleText] = useState('');
  
  const samplePrompts = {
    primary: "Tell me about your favourite animal",
    secondary: "Explain what you learned in science class today",
    story: "Create a short story about a magical adventure"
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/speech-to-text-icon.png" 
          alt="Speech-to-Text Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Speech-to-Text Accessibility Tool
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SpeechToTextEngine 
            initialText={sampleText} 
            className="mb-8"
            showCalibration={true}
          />
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Speaking Prompts</CardTitle>
              <CardDescription>
                Try these prompts to practise using speech-to-text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(samplePrompts.primary)}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Primary Level</div>
                    <div className="text-sm text-muted-foreground">Simple topics for younger students</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(samplePrompts.secondary)}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Secondary Level</div>
                    <div className="text-sm text-muted-foreground">Academic content for older students</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(samplePrompts.story)}
                >
                  <BookMarked className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Creative Prompt</div>
                    <div className="text-sm text-muted-foreground">Encourage creative expression</div>
                  </div>
                </Button>
              </div>
              
              <Textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter or edit a speaking prompt here..."
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Mic className="h-5 w-5 mr-2" />
                About Speech-to-Text
              </CardTitle>
              <CardDescription>
                Understanding the benefits and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="benefits">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="benefits" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>
                        <strong>Accessibility:</strong> Enables students with motor difficulties, dysgraphia, or writing challenges to express themselves
                      </li>
                      <li>
                        <strong>Reduced Cognitive Load:</strong> Allows students to focus on content rather than the mechanics of typing
                      </li>
                      <li>
                        <strong>Speed Advantage:</strong> Most people can speak 3-4 times faster than they can type
                      </li>
                      <li>
                        <strong>Vocabulary Development:</strong> Encourages use of more complex vocabulary that students might avoid when typing
                      </li>
                      <li>
                        <strong>Confidence Building:</strong> Helps students who struggle with writing to participate more fully
                      </li>
                      <li>
                        <strong>Multitasking:</strong> Enables note-taking while viewing materials or performing other tasks
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the British Dyslexia Association shows that speech-to-text technology can increase writing output by up to 50% for students with dyslexia and dysgraphia.
                    </p>
                    <p>
                      A 2023 study in the Journal of Learning Disabilities found that students using speech-to-text produced essays with 30% more content and higher quality ideas compared to keyboard typing.
                    </p>
                    <p>
                      The Education Endowment Foundation reports that assistive technology like speech-to-text provides significant benefits for struggling writers, with an effect size of +0.35 (moderate positive impact).
                    </p>
                    <p>
                      Research from the National Council for Special Education (NCSE) indicates that speech-to-text tools reduce writing anxiety and increase engagement in academic tasks for students with learning differences.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Create first drafts of essays and reports</li>
                      <li>Take notes during lectures or while reading</li>
                      <li>Brainstorm ideas for projects</li>
                      <li>Complete written assignments when typing is challenging</li>
                      <li>Practise oral language skills while seeing text output</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Provide alternative assessment methods for students with writing difficulties</li>
                      <li>Create accessible classroom materials quickly</li>
                      <li>Offer differentiated instruction options</li>
                      <li>Model clear articulation and speaking skills</li>
                      <li>Demonstrate the connection between spoken and written language</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Support homework completion for children with writing challenges</li>
                      <li>Help children express ideas more fully than they might when typing</li>
                      <li>Encourage development of both speaking and writing skills simultaneously</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
