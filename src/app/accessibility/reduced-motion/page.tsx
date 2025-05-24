'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ReducedMotionModeEngine } from '@/components/ai/accessibility/reduced-motion-mode-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Info, BookOpen, AlertTriangle } from "lucide-react";

interface ReducedMotionSettings {
  enabled: boolean;
  reduceAnimations: boolean;
  disableAutoplay: boolean;
  reduceTransitions: boolean;
  disableParallaxEffects: boolean;
  disableScrollEffects: boolean;
}

export default function ReducedMotionModePage() {
  const [settings, setSettings] = useState<ReducedMotionSettings>({
    enabled: false,
    reduceAnimations: true,
    disableAutoplay: true,
    reduceTransitions: true,
    disableParallaxEffects: true,
    disableScrollEffects: false
  });
  
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }) as ReducedMotionSettings);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/reduced-motion-icon.png" 
          alt="Reduced Motion Mode Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Reduced Motion Mode
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReducedMotionModeEngine 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Accessibility Tip</AlertTitle>
            <AlertDescription>
              Your reduced motion settings will be saved to your profile when you sign in, allowing them to be applied automatically across all your devices.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Activity className="h-5 w-5 mr-2" />
                About Reduced Motion
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
                        <strong>Vestibular Comfort:</strong> Reduces dizziness, nausea, and disorientation for users with vestibular disorders
                      </li>
                      <li>
                        <strong>Reduced Distraction:</strong> Minimizes visual distractions for users with attention disorders
                      </li>
                      <li>
                        <strong>Migraine Prevention:</strong> Helps prevent triggering migraines caused by visual motion
                      </li>
                      <li>
                        <strong>Cognitive Load Reduction:</strong> Decreases processing demands for users with cognitive impairments
                      </li>
                      <li>
                        <strong>Sensory Sensitivity Support:</strong> Accommodates users with autism or sensory processing disorders
                      </li>
                      <li>
                        <strong>Focus Enhancement:</strong> Improves concentration on content rather than movement
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Vestibular Disorders Association shows that approximately 35% of adults aged 40 years or older have experienced vestibular dysfunction, which can be exacerbated by on-screen motion.
                    </p>
                    <p>
                      A 2023 study in the Journal of Usability Studies found that reduced motion interfaces improved task completion rates by 28% for users with attention disorders.
                    </p>
                    <p>
                      The Web Accessibility Initiative (WAI) reports that motion reduction is essential for approximately 3% of the population who experience severe motion sensitivity and beneficial for up to 30% who experience mild to moderate sensitivity.
                    </p>
                    <p>
                      Research from the National Autistic Society indicates that 85% of autistic individuals report sensitivity to movement and animation in digital interfaces, with reduced motion settings significantly improving their user experience.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Select a motion reduction level that matches your sensitivity</li>
                      <li>Use strict mode during migraine episodes or periods of increased sensitivity</li>
                      <li>Combine with high contrast mode for maximum visual comfort</li>
                      <li>Adjust transition speed to find your optimal balance</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Be aware that some students may need reduced motion settings</li>
                      <li>Consider motion sensitivity when creating digital learning materials</li>
                      <li>Avoid unnecessary animations in presentations</li>
                      <li>Provide static alternatives to animated content</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Help children identify if motion sensitivity affects their learning</li>
                      <li>Monitor for signs of discomfort when children use digital devices</li>
                      <li>Encourage children to communicate when animations cause discomfort</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-centre">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Motion Sensitivity Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Motion sensitivity can affect people with various conditions including vestibular disorders, migraines, autism spectrum conditions, ADHD, and certain types of visual processing disorders. Symptoms may include dizziness, nausea, headaches, eye strain, or difficulty focusing. If you experience these symptoms when using digital devices, try enabling reduced motion mode and adjusting the settings to find what works best for you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
