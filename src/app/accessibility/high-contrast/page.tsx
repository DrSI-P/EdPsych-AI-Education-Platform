'use client';

import { useState } from 'react';
import Image from 'next/image';
import HighContrastModeEngine from '@/components/ai/accessibility/high-contrast-mode-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Contrast, Info, BookOpen, Eye, AlertTriangle } from "lucide-react";

export default function HighContrastModePage() {
  const [settings, setSettings] = useState({
    enabled: false,
    mode: 'high-contrast',
    textSize: 100,
    contrastLevel: 100,
    reduceAnimations: false,
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Image 
          src="/images/high-contrast-icon.png" 
          alt="High Contrast Mode Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        High Contrast Mode
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HighContrastModeEngine 
            onSettingsChange={setSettings}
            className="mb-8"
          />
          
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Accessibility Tip</AlertTitle>
            <AlertDescription>
              Your high contrast settings will be saved to your profile when you sign in, allowing them to be applied automatically across all your devices.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                About High Contrast Mode
              </CardTitle>
              <CardDescription>
                Understanding the benefits and applications
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
                        <strong>Visual Clarity:</strong> Enhances readability for users with low vision, color blindness, or visual processing disorders
                      </li>
                      <li>
                        <strong>Reduced Eye Strain:</strong> Minimizes fatigue during extended reading or screen time
                      </li>
                      <li>
                        <strong>Improved Focus:</strong> Helps users with attention difficulties concentrate on content
                      </li>
                      <li>
                        <strong>Customization:</strong> Allows personalization to meet individual visual needs
                      </li>
                      <li>
                        <strong>Accessibility Compliance:</strong> Helps meet WCAG 2.1 AA standards for contrast ratios
                      </li>
                      <li>
                        <strong>Inclusive Design:</strong> Makes content accessible to a wider range of users
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Royal National Institute of Blind People (RNIB) shows that high contrast modes can improve reading speed by up to 35% for users with visual impairments.
                    </p>
                    <p>
                      A 2022 study in the British Journal of Ophthalmology found that customizable contrast settings significantly improved content accessibility for users with age-related macular degeneration.
                    </p>
                    <p>
                      The Web Accessibility Initiative (WAI) reports that proper contrast is one of the most important factors in digital accessibility, with an estimated 1 in 12 men and 1 in 200 women experiencing some form of color vision deficiency.
                    </p>
                    <p>
                      Research from the Department for Education indicates that appropriate visual adjustments can increase engagement and reduce cognitive load for students with specific learning differences.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Select a contrast mode that works best for your specific visual needs</li>
                      <li>Increase text size for improved readability during extended reading</li>
                      <li>Enable reduced animations if you experience visual tracking difficulties</li>
                      <li>Use custom color settings if you have specific color sensitivity</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Encourage students to explore different contrast settings</li>
                      <li>Consider high contrast mode when creating digital learning materials</li>
                      <li>Understand how different visual presentations affect different learners</li>
                      <li>Use high contrast mode during presentations for better visibility</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Help children find the most comfortable visual settings</li>
                      <li>Be aware that visual preferences may change with lighting conditions</li>
                      <li>Monitor for signs of eye strain when children use digital devices</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Visual Sensitivity Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm">
                Some high contrast settings may cause discomfort for users with certain visual sensitivities or conditions like photophobia. If you experience any discomfort, try adjusting the contrast level or switching to a different mode. The "Black on Yellow" and "Yellow on Black" options are often recommended for users with dyslexia, while "White on Black" may be preferred by users with light sensitivity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

