'use client';

import { useState } from 'react';
import Image from 'next/image';
import TextToSpeechEngine from '@/components/ai/accessibility/text-to-speech-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Headphones, BookMarked } from "lucide-react";

// Define the type for sample texts
interface SampleTexts {
  primary: string;
  secondary: string;
  story: string;
}

export default function TextToSpeechPage() {
  const [sampleText, setSampleText] = useState<string>(
    "Welcome to the EdPsych Connect text-to-speech feature. This tool helps make content more accessible by converting written text into spoken words. You can adjust the voice, speaking rate, pitch, and volume to suit your preferences. This is especially helpful for students with reading difficulties, visual impairments, or those who prefer auditory learning."
  );
  
  const sampleTexts: SampleTexts = {
    primary: "The cat sat on the mat. It was a sunny day. The birds were singing in the trees. I like to play in the park with my friends. We can run, jump, and climb on the playground. My favourite game is hide and seek.",
    secondary: "The water cycle is the continuous movement of water within the Earth and atmosphere. It is a complex system that includes many different processes. Liquid water evaporates into water vapor, condenses to form clouds, and precipitates back to earth in the form of rain and snow.",
    story: "Once upon a time, there was a clever fox who lived in a dense forest. Every day, the fox would watch the birds flying high above the trees. 'How wonderful it must be to soar through the sky,' thought the fox. One day, the fox had an idea. 'Perhaps I can learn to climb to the highest branches, and from there, I might learn to fly!'"
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/text-to-speech-icon.png" 
          alt="Text-to-Speech Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Text-to-Speech Accessibility Tool
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TextToSpeechEngine 
            initialText={sampleText} 
            className="mb-8"
          />
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sample Texts</CardTitle>
              <CardDescription>
                Try these sample texts to test the text-to-speech feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(sampleTexts.primary)}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Primary Level</div>
                    <div className="text-sm text-muted-foreground">Simple sentences for young readers</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(sampleTexts.secondary)}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Secondary Level</div>
                    <div className="text-sm text-muted-foreground">Academic content with subject vocabulary</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-centre justify-start h-auto py-4"
                  onClick={() => setSampleText(sampleTexts.story)}
                >
                  <BookMarked className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Story Sample</div>
                    <div className="text-sm text-muted-foreground">Narrative text with dialogue</div>
                  </div>
                </Button>
              </div>
              
              <Textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter or edit sample text here..."
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Headphones className="h-5 w-5 mr-2" />
                About Text-to-Speech
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
                        <strong>Accessibility:</strong> Makes content available to students with reading difficulties, visual impairments, or processing disorders
                      </li>
                      <li>
                        <strong>Multi-sensory Learning:</strong> Engages both auditory and visual pathways for enhanced comprehension
                      </li>
                      <li>
                        <strong>Independence:</strong> Allows students to access content without relying on others to read for them
                      </li>
                      <li>
                        <strong>Vocabulary Development:</strong> Helps with pronunciation and recognition of new words
                      </li>
                      <li>
                        <strong>Reduced Cognitive Load:</strong> Frees mental resources for comprehension rather than decoding
                      </li>
                      <li>
                        <strong>Engagement:</strong> Provides an alternative format that may increase interest and attention
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the British Dyslexia Association shows that text-to-speech technology can improve reading comprehension by 38% for students with dyslexia.
                    </p>
                    <p>
                      A 2022 study in the Journal of Special Education Technology found that synchronized highlighting with text-to-speech increased reading fluency by 27% compared to text-only presentation.
                    </p>
                    <p>
                      The Education Endowment Foundation reports that assistive technology like text-to-speech provides significant benefits for struggling readers, with an effect size of +0.32 (moderate positive impact).
                    </p>
                    <p>
                      Research from the National Council for Special Education (NCSE) indicates that text-to-speech tools support independent learning and boost confidence in students with reading difficulties.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Listen to assigned readings or textbook content</li>
                      <li>Proofread your own writing by hearing it read aloud</li>
                      <li>Access content at your preferred pace and reading level</li>
                      <li>Reinforce learning by hearing and seeing content simultaneously</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Provide differentiated access to the same content</li>
                      <li>Support students with reading difficulties or English language learners</li>
                      <li>Create audio versions of handouts and worksheets</li>
                      <li>Model proper pronunciation of technical or subject-specific vocabulary</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Support homework completion for children with reading challenges</li>
                      <li>Encourage independent reading through audio support</li>
                      <li>Help children access age-appropriate content that may be above their reading level</li>
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
