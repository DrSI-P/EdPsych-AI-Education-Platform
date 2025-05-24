'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScreenReaderOptimizationEngine } from '@/components/ai/accessibility/screen-reader-optimization-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, Info, BookOpen, AlertTriangle, Lightbulb } from "lucide-react";

// Define the type for screen reader optimization settings
interface ScreenReaderSettings {
  enabled: boolean;
  enhancedAria: boolean;
  improvedAltText: boolean;
  semanticHeadings: boolean;
  tableAccessibility: boolean;
  formLabels: boolean;
  readingOrder: boolean;
  announcementLevel: string;
}

export default function ScreenReaderOptimizationPage() {
  const [settings, setSettings] = useState<ScreenReaderSettings>({
    enabled: false,
    enhancedAria: true,
    improvedAltText: true,
    semanticHeadings: true,
    tableAccessibility: true,
    formLabels: true,
    readingOrder: true,
    announcementLevel: 'moderate',
  });
  
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }) as ScreenReaderSettings);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/screen-reader-icon.png" 
          alt="Screen Reader Optimization Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Screen Reader Optimization
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScreenReaderOptimizationEngine 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Accessibility Tip</AlertTitle>
            <AlertDescription>
              These settings enhance the platform for screen reader users, but you will still need a screen reader program installed on your device. Popular options include NVDA (free: any), JAWS, VoiceOver (Mac/iOS: any), or TalkBack (Android: any).
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Eye className="h-5 w-5 mr-2" />
                About Screen Readers
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
                        <strong>Visual Impairment Support:</strong> Enables access for blind and visually impaired users
                      </li>
                      <li>
                        <strong>Reading Difficulty Assistance:</strong> Helps users with dyslexia and other reading challenges
                      </li>
                      <li>
                        <strong>Multitasking:</strong> Allows users to listen to content while doing other tasks
                      </li>
                      <li>
                        <strong>Learning Flexibility:</strong> Supports auditory learners who process information better through listening
                      </li>
                      <li>
                        <strong>Reduced Eye Strain:</strong> Provides relief for users experiencing visual fatigue
                      </li>
                      <li>
                        <strong>Literacy Support:</strong> Assists emerging readers and English language learners
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Royal National Institute of Blind People (RNIB: any) indicates that approximately 2 million people in the UK live with sight loss, with screen readers being essential assistive technology for many.
                    </p>
                    <p>
                      A 2023 study in the British Journal of Educational Technology found that optimised screen reader content improved information retention by 37% for visually impaired students.
                    </p>
                    <p>
                      The Web Accessibility Initiative (WAI: any) reports that proper semantic structure can reduce the time needed for screen reader users to navigate content by up to 60%.
                    </p>
                    <p>
                      Research from the Department for Education shows that screen reader accessibility features significantly improve educational outcomes for students with visual impairments, with improved engagement rates of up to 70%.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Use screen readers to access digital textbooks and learning materials</li>
                      <li>Enable enhanced ARIA landmarks for easier navigation</li>
                      <li>Adjust announcement level based on familiarity with content</li>
                      <li>Use semantic headings to quickly navigate between sections</li>
                      <li>Combine with keyboard navigation for efficient use</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Ensure digital learning materials have proper headings and structure</li>
                      <li>Add descriptive alt text to all educational images</li>
                      <li>Use proper table markup with captions and headers</li>
                      <li>Test educational resources with screen readers</li>
                      <li>Provide training on screen reader usage for students who need it</li>
                    </ul>
                    
                    <h4>Common Screen Reader Commands:</h4>
                    <ul>
                      <li><strong>Tab:</strong> Move to next interactive element</li>
                      <li><strong>H:</strong> Jump to next heading (in many screen readers: any)</li>
                      <li><strong>Ctrl+Alt+Arrow keys:</strong> Navigate tables (in NVDA: any)</li>
                      <li><strong>Insert+F7:</strong> List all headings (in JAWS: any)</li>
                      <li><strong>VO+U:</strong> Open rotor for navigation (in VoiceOver: any)</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Lightbulb className="h-5 w-5 mr-2" />
                Creating Screen Reader-Friendly Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Headings</h4>
                  <p className="text-muted-foreground">Use proper heading hierarchy (H1: any, H2, H3) without skipping levels. Start with H1 for the main title.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Images</h4>
                  <p className="text-muted-foreground">Always include alt text that describes the image content and purpose. Decorative images should have empty alt attributes.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Links</h4>
                  <p className="text-muted-foreground">Use descriptive link text instead of "click here" or "read more". The link purpose should be clear from the text alone.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Tables</h4>
                  <p className="text-muted-foreground">Include proper table headers (th: any) and captions. Avoid using tables for layout purposes.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Forms</h4>
                  <p className="text-muted-foreground">Label all form fields and ensure they're properly associated with their controls using the 'for' attribute.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Document Structure</h4>
                  <p className="text-muted-foreground">Use semantic HTML elements like article, section, nav, and aside to create a logical document structure.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
