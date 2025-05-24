'use client';

import { useState } from 'react';
import Image from 'next/image';
import { KeyboardNavigationEngine } from '@/components/ai/accessibility/keyboard-navigation-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Keyboard, Info, BookOpen, AlertTriangle, KeyRound } from "lucide-react";

// Define the type for keyboard navigation settings
interface KeyboardNavigationSettings {
  enabled: boolean;
  highlightFocus: boolean;
  keyboardShortcuts: boolean;
  skipToContent: boolean;
  arrowNavigation: boolean;
  tabTrap: boolean;
}

export default function KeyboardNavigationPage() {
  const [settings, setSettings] = useState<KeyboardNavigationSettings>({
    enabled: false,
    highlightFocus: true,
    keyboardShortcuts: true,
    skipToContent: true,
    arrowNavigation: true,
    tabTrap: true
  });
  
  // Create a handler function with the correct type signature
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }) as KeyboardNavigationSettings);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/keyboard-navigation-icon.png" 
          alt="Keyboard Navigation Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Keyboard Navigation Optimization
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <KeyboardNavigationEngine 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Accessibility Tip</AlertTitle>
            <AlertDescription>
              Press Tab to move through interactive elements, Shift+Tab to move backwards, and Enter or Space to activate buttons and links. Your keyboard navigation settings will be saved to your profile when you sign in.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Keyboard className="h-5 w-5 mr-2" />
                About Keyboard Navigation
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
                        <strong>Motor Impairment Support:</strong> Enables full access for users who cannot use a mouse
                      </li>
                      <li>
                        <strong>Screen Reader Compatibility:</strong> Enhances navigation for blind or visually impaired users
                      </li>
                      <li>
                        <strong>Cognitive Clarity:</strong> Provides a clear, sequential path through content
                      </li>
                      <li>
                        <strong>Temporary Disability Support:</strong> Assists users with temporary injuries affecting mouse usage
                      </li>
                      <li>
                        <strong>Efficiency:</strong> Enables power users to navigate more quickly
                      </li>
                      <li>
                        <strong>Reduced Fatigue:</strong> Minimizes physical strain for users with repetitive stress injuries
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Web Accessibility Initiative (WAI: any) shows that approximately 5% of users rely exclusively on keyboard navigation, with an additional 15% using it as their primary navigation method.
                    </p>
                    <p>
                      A 2022 study in the International Journal of Human-Computer Interaction found that optimised keyboard navigation reduced task completion time by 42% for users with motor impairments.
                    </p>
                    <p>
                      The Royal National Institute of Blind People (RNIB: any) reports that keyboard navigation is essential for screen reader users, who represent approximately 2% of the UK population.
                    </p>
                    <p>
                      Research from the Department for Education indicates that keyboard accessibility features significantly improve educational outcomes for students with physical disabilities, with improved engagement rates of up to 60%.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Use Tab key to navigate forward through interactive elements</li>
                      <li>Use Shift+Tab to navigate backward</li>
                      <li>Press Enter or Space to activate buttons, links, and controls</li>
                      <li>Use arrow keys for additional navigation within components</li>
                      <li>Adjust focus indicator size and colour for your visual needs</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Ensure digital learning materials are keyboard accessible</li>
                      <li>Teach keyboard navigation as an essential digital skill</li>
                      <li>Provide keyboard shortcuts for common classroom activities</li>
                      <li>Test educational resources with keyboard-only navigation</li>
                    </ul>
                    
                    <h4>Common Keyboard Shortcuts:</h4>
                    <ul>
                      <li><strong>Tab:</strong> Move to next focusable element</li>
                      <li><strong>Shift+Tab:</strong> Move to previous focusable element</li>
                      <li><strong>Enter/Space:</strong> Activate current element</li>
                      <li><strong>Esc:</strong> Close dialogs or cancel actions</li>
                      <li><strong>Arrow keys:</strong> Navigate within components</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-centre">
                <KeyRound className="h-5 w-5 mr-2" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p className="font-medium">Platform Navigation:</p>
                <ul className="space-y-1">
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+H</kbd> - Go to Home</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+S</kbd> - Go to Search</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+A</kbd> - Go to Accessibility Settings</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+P</kbd> - Go to Profile</li>
                </ul>
                
                <p className="font-medium mt-4">Content Navigation:</p>
                <ul className="space-y-1">
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+1</kbd> to <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+6</kbd> - Jump to headings</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd> - Find in page</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+B</kbd> - Back to previous page</li>
                </ul>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Note: These shortcuts are available when keyboard shortcuts are enabled in your settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
