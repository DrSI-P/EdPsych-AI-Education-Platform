'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Check, RefreshCw, FileText, AlertTriangle, Info } from "lucide-react";
import { useSession } from 'next-auth/react';

interface ScreenReaderOptimizationProps {
  onSettingsChange?: (settings: ScreenReaderSettings) => void;
  className?: string;
}

interface ScreenReaderSettings {
  enabled: boolean;
  enhancedAria: boolean;
  improvedAltText: boolean;
  semanticHeadings: boolean;
  tableAccessibility: boolean;
  formLabels: boolean;
  readingOrder: boolean;
  announcementLevel: 'minimal' | 'moderate' | 'verbose';
}

export default function ScreenReaderOptimizationEngine({
  onSettingsChange,
  className = '',
}: ScreenReaderOptimizationProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for screen reader settings
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
  
  const [isApplied, setIsApplied] = useState(false);
  const [previewContent, setPreviewContent] = useState<'text' | 'form' | 'table'>('text');
  
  // Load user settings from API on component mount
  useEffect(() => {
    if (session?.user) {
      fetch('/api/ai/accessibility')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            // Update local settings from user preferences if available
            const userSettings = data.settings;
            if (userSettings.screenReaderOptimization !== undefined) {
              setSettings(prev => ({
                ...prev,
                enabled: userSettings.screenReaderOptimization,
                // Add other settings if available in the API response
                ...(userSettings.enhancedAria !== undefined && { 
                  enhancedAria: userSettings.enhancedAria 
                }),
                ...(userSettings.improvedAltText !== undefined && { 
                  improvedAltText: userSettings.improvedAltText 
                }),
                ...(userSettings.semanticHeadings !== undefined && { 
                  semanticHeadings: userSettings.semanticHeadings 
                }),
                ...(userSettings.tableAccessibility !== undefined && { 
                  tableAccessibility: userSettings.tableAccessibility 
                }),
                ...(userSettings.formLabels !== undefined && { 
                  formLabels: userSettings.formLabels 
                }),
                ...(userSettings.readingOrder !== undefined && { 
                  readingOrder: userSettings.readingOrder 
                }),
                ...(userSettings.announcementLevel && { 
                  announcementLevel: userSettings.announcementLevel 
                }),
              }));
              
              // If screen reader optimization was already enabled, apply it
              if (userSettings.screenReaderOptimization) {
                applyScreenReaderOptimization({
                  ...settings,
                  enabled: userSettings.screenReaderOptimization,
                  ...(userSettings.enhancedAria !== undefined && { 
                    enhancedAria: userSettings.enhancedAria 
                  }),
                  ...(userSettings.improvedAltText !== undefined && { 
                    improvedAltText: userSettings.improvedAltText 
                  }),
                  ...(userSettings.semanticHeadings !== undefined && { 
                    semanticHeadings: userSettings.semanticHeadings 
                  }),
                  ...(userSettings.tableAccessibility !== undefined && { 
                    tableAccessibility: userSettings.tableAccessibility 
                  }),
                  ...(userSettings.formLabels !== undefined && { 
                    formLabels: userSettings.formLabels 
                  }),
                  ...(userSettings.readingOrder !== undefined && { 
                    readingOrder: userSettings.readingOrder 
                  }),
                  ...(userSettings.announcementLevel && { 
                    announcementLevel: userSettings.announcementLevel 
                  }),
                });
                setIsApplied(true);
              }
            }
          }
        })
        .catch(error => {
          console.error('Error loading accessibility settings:', error);
        });
    }
  }, [session]);
  
  // Apply screen reader optimization settings to the page
  const applyScreenReaderOptimization = (settingsToApply: ScreenReaderSettings) => {
    if (!settingsToApply.enabled) {
      // Remove screen reader optimization classes
      document.documentElement.classList.remove(
        'screen-reader-optimized',
        'announcement-minimal',
        'announcement-moderate',
        'announcement-verbose'
      );
      return;
    }
    
    // Apply screen reader optimization mode
    document.documentElement.classList.add('screen-reader-optimized');
    
    // Apply announcement level
    document.documentElement.classList.remove(
      'announcement-minimal',
      'announcement-moderate',
      'announcement-verbose'
    );
    document.documentElement.classList.add(`announcement-${settingsToApply.announcementLevel}`);
    
    // Apply enhanced ARIA attributes if enabled
    if (settingsToApply.enhancedAria) {
      // Add ARIA landmarks to main sections
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('role', 'main');
        main.setAttribute('aria-label', 'Main content');
      }
      
      const nav = document.querySelector('nav');
      if (nav) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
      }
      
      const footer = document.querySelector('footer');
      if (footer) {
        footer.setAttribute('role', 'contentinfo');
        footer.setAttribute('aria-label', 'Footer');
      }
    }
    
    // Apply improved alt text if enabled
    if (settingsToApply.improvedAltText) {
      // Find images without alt text and add descriptive placeholders
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img: HTMLImageElement) => {
        img.setAttribute('alt', 'Image - please contact support for description');
      });
    }
    
    // Apply semantic headings if enabled
    if (settingsToApply.semanticHeadings) {
      // Ensure proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        
        // If heading skips a level, add aria-level to fix the hierarchy
        if (level > lastLevel + 1) {
          heading.setAttribute('aria-level', (lastLevel + 1).toString());
        }
        
        lastLevel = level;
      });
    }
    
    // Apply table accessibility if enabled
    if (settingsToApply.tableAccessibility) {
      // Add captions and summaries to tables
      const tables = document.querySelectorAll('table');
      tables.forEach((table, index) => {
        if (!table.querySelector('caption')) {
          const caption = document.createElement('caption');
          caption.textContent = `Table ${index + 1}`;
          table.prepend(caption);
        }
        
        if (!table.hasAttribute('summary')) {
          table.setAttribute('summary', `Data table ${index + 1}`);
        }
      });
    }
    
    // Apply form labels if enabled
    if (settingsToApply.formLabels) {
      // Ensure all form controls have labels
      const formControls = document.querySelectorAll('input, select, textarea');
      formControls.forEach((control: HTMLElement, index) => {
        const id = control.id || `form-control-${index}`;
        control.id = id;
        
        // Check if control already has a label
        const hasLabel = document.querySelector(`label[for="${id}"]`);
        if (!hasLabel) {
          // Create a visually hidden label
          const label = document.createElement('label');
          label.setAttribute('for', id);
          label.classList.add('sr-only');
          label.textContent = `Form field ${index + 1}`;
          control.parentNode?.insertBefore(label, control);
        }
      });
    }
    
    // Apply reading order if enabled
    if (settingsToApply.readingOrder) {
      // Add tabindex to ensure logical reading order
      const content = document.querySelector('main');
      if (content) {
        const contentElements = content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, table');
        contentElements.forEach((element, index) => {
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
        });
      }
    }
  };
  
  // Handle settings change
  const handleSettingsChange = (key: keyof ScreenReaderSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // If changing the enabled state, apply or remove screen reader optimization immediately
      if (key === 'enabled' && isApplied) {
        applyScreenReaderOptimization(newSettings);
      }
      
      // Call the callback if provided
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
      
      return newSettings;
    });
  };
  
  // Apply settings
  const handleApplySettings = () => {
    applyScreenReaderOptimization(settings);
    setIsApplied(true);
    
    // Save settings to user profile if logged in
    if (session?.user) {
      fetch('/api/ai/accessibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            screenReaderOptimization: settings.enabled,
            enhancedAria: settings.enhancedAria,
            improvedAltText: settings.improvedAltText,
            semanticHeadings: settings.semanticHeadings,
            tableAccessibility: settings.tableAccessibility,
            formLabels: settings.formLabels,
            readingOrder: settings.readingOrder,
            announcementLevel: settings.announcementLevel,
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Settings saved",
              description: "Your screen reader optimization settings have been saved to your profile.",
            });
          } else {
            throw new Error(data.error || 'Failed to save settings');
          }
        })
        .catch(error => {
          console.error('Error saving accessibility settings:', error);
          toast({
            title: "Error saving settings",
            description: "Your settings have been applied but could not be saved to your profile.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Settings applied",
        description: "Screen reader optimization settings have been applied. Sign in to save these preferences.",
      });
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings: ScreenReaderSettings = {
      enabled: false,
      enhancedAria: true,
      improvedAltText: true,
      semanticHeadings: true,
      tableAccessibility: true,
      formLabels: true,
      readingOrder: true,
      announcementLevel: 'moderate',
    };
    
    setSettings(defaultSettings);
    applyScreenReaderOptimization(defaultSettings);
    setIsApplied(true);
    
    toast({
      title: "Settings reset",
      description: "Screen reader optimization settings have been reset to defaults.",
    });
    
    // Save reset settings to user profile if logged in
    if (session?.user) {
      fetch('/api/ai/accessibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            screenReaderOptimization: false,
            enhancedAria: true,
            improvedAltText: true,
            semanticHeadings: true,
            tableAccessibility: true,
            formLabels: true,
            readingOrder: true,
            announcementLevel: 'moderate',
          }
        }),
      }).catch(error => {
        console.error('Error resetting accessibility settings:', error);
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Screen Reader Optimization
          </div>
          <Switch 
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
          />
        </CardTitle>
        <CardDescription>
          Enhance content for screen reader users
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enhanced-aria">Enhanced ARIA Landmarks</Label>
                  <p className="text-xs text-muted-foreground">
                    Add ARIA roles and labels to page sections
                  </p>
                </div>
                <Switch 
                  id="enhanced-aria"
                  checked={settings.enhancedAria}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('enhancedAria', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="improved-alt-text">Improved Image Descriptions</Label>
                  <p className="text-xs text-muted-foreground">
                    Ensure all images have descriptive alt text
                  </p>
                </div>
                <Switch 
                  id="improved-alt-text"
                  checked={settings.improvedAltText}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('improvedAltText', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="semantic-headings">Semantic Heading Structure</Label>
                  <p className="text-xs text-muted-foreground">
                    Ensure proper heading hierarchy
                  </p>
                </div>
                <Switch 
                  id="semantic-headings"
                  checked={settings.semanticHeadings}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('semanticHeadings', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="table-accessibility">Table Accessibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Add captions and summaries to tables
                  </p>
                </div>
                <Switch 
                  id="table-accessibility"
                  checked={settings.tableAccessibility}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('tableAccessibility', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="form-labels">Form Field Labels</Label>
                  <p className="text-xs text-muted-foreground">
                    Ensure all form controls have labels
                  </p>
                </div>
                <Switch 
                  id="form-labels"
                  checked={settings.formLabels}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('formLabels', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reading-order">Logical Reading Order</Label>
                  <p className="text-xs text-muted-foreground">
                    Ensure content is read in a logical sequence
                  </p>
                </div>
                <Switch 
                  id="reading-order"
                  checked={settings.readingOrder}
                  onCheckedChange={(checked) => 
                    handleSettingsChange('readingOrder', checked)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Announcement Level</Label>
                <RadioGroup 
                  value={settings.announcementLevel}
                  onValueChange={(value: 'minimal' | 'moderate' | 'verbose') => 
                    handleSettingsChange('announcementLevel', value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">Minimal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verbose" id="verbose" />
                    <Label htmlFor="verbose">Verbose</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Controls the amount of additional context provided to screen reader users
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <Label>Preview Content Type</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={previewContent === 'text' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPreviewContent('text')}
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    Text
                  </Button>
                  <Button 
                    variant={previewContent === 'form' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPreviewContent('form')}
                    className="flex items-center gap-1"
                  >
                    Form
                  </Button>
                  <Button 
                    variant={previewContent === 'table' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPreviewContent('table')}
                    className="flex items-center gap-1"
                  >
                    Table
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Screen Reader Preview</h3>
                
                {previewContent === 'text' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Heading Structure</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="space-y-2">
                          <h1 className="text-xl font-bold">Main Heading (H1)</h1>
                          <h2 className="text-lg font-semibold">Section Heading (H2)</h2>
                          <p>This is a paragraph of text that would be read by a screen reader. With screen reader optimization enabled, this content will have improved semantic structure.</p>
                          <h3 className="text-md font-medium">Subsection Heading (H3)</h3>
                          <p>Another paragraph with more information. Screen readers will announce headings with their level, helping users understand the document structure.</p>
                          
                          {settings.enabled && (
                            <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 rounded-md text-xs">
                              <p className="font-medium">Screen Reader Announcement:</p>
                              <p className="italic mt-1">
                                {settings.announcementLevel === 'verbose' ? 
                                  '"Heading level 1, Main Heading. Heading level 2, Section Heading. Paragraph, This is a paragraph of text... Heading level 3, Subsection Heading. Paragraph, Another paragraph..."' :
                                  settings.announcementLevel === 'moderate' ?
                                  '"Main Heading, heading level 1. Section Heading, heading level 2. This is a paragraph of text... Subsection Heading, heading level 3. Another paragraph..."' :
                                  '"Main Heading. Section Heading. This is a paragraph of text... Subsection Heading. Another paragraph..."'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Image Description</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">Image Placeholder</span>
                          </div>
                          <p className="text-sm text-center">A sample image with alt text</p>
                          
                          {settings.enabled && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded-md text-xs w-full">
                              <p className="font-medium">Screen Reader Announcement:</p>
                              <p className="italic mt-1">
                                {settings.announcementLevel === 'verbose' ? 
                                  '"Image, A sample image showing a classroom with students engaged in collaborative learning activities. The classroom has colorful displays and modern technology."' :
                                  settings.announcementLevel === 'moderate' ?
                                  '"Image: A classroom with students in collaborative learning activities."' :
                                  '"Classroom with students."'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {previewContent === 'form' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Form Controls</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="preview-name" className="block text-sm font-medium">Name</label>
                            <input 
                              type="text" 
                              id="preview-name" 
                              className="w-full px-3 py-2 border rounded-md"
                              aria-required="true"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="preview-email" className="block text-sm font-medium">Email</label>
                            <input 
                              type="email" 
                              id="preview-email" 
                              className="w-full px-3 py-2 border rounded-md"
                              aria-required="true"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="preview-subject" className="block text-sm font-medium">Subject</label>
                            <select 
                              id="preview-subject" 
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="">Please select</option>
                              <option value="question">Question</option>
                              <option value="feedback">Feedback</option>
                              <option value="support">Support</option>
                            </select>
                          </div>
                          
                          {settings.enabled && (
                            <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 rounded-md text-xs">
                              <p className="font-medium">Screen Reader Announcement:</p>
                              <p className="italic mt-1">
                                {settings.announcementLevel === 'verbose' ? 
                                  '"Form with 3 fields. Name edit text, required. Email edit text, required. Subject combo box, Please select, collapsed."' :
                                  settings.announcementLevel === 'moderate' ?
                                  '"Name, required edit text. Email, required edit text. Subject dropdown."' :
                                  '"Name field. Email field. Subject dropdown."'}
                              </p>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                )}
                
                {previewContent === 'table' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Data Table</h4>
                      <div className="p-3 bg-muted rounded-md overflow-x-auto">
                        <table className="w-full border-collapse">
                          <caption className="text-sm mb-2 text-left">
                            Student Assessment Results
                          </caption>
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <th className="border px-4 py-2 text-left">Student</th>
                              <th className="border px-4 py-2 text-left">Math</th>
                              <th className="border px-4 py-2 text-left">Science</th>
                              <th className="border px-4 py-2 text-left">English</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">Alex</td>
                              <td className="border px-4 py-2">85%</td>
                              <td className="border px-4 py-2">92%</td>
                              <td className="border px-4 py-2">78%</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Jamie</td>
                              <td className="border px-4 py-2">76%</td>
                              <td className="border px-4 py-2">83%</td>
                              <td className="border px-4 py-2">91%</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Taylor</td>
                              <td className="border px-4 py-2">94%</td>
                              <td className="border px-4 py-2">88%</td>
                              <td className="border px-4 py-2">85%</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {settings.enabled && (
                          <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 rounded-md text-xs">
                            <p className="font-medium">Screen Reader Announcement:</p>
                            <p className="italic mt-1">
                              {settings.announcementLevel === 'verbose' ? 
                                '"Table with 4 columns and 3 rows. Caption: Student Assessment Results. Column headers: Student, Math, Science, English. Row 1: Alex, 85%, 92%, 78%. Row 2: Jamie, 76%, 83%, 91%. Row 3: Taylor, 94%, 88%, 85%."' :
                                settings.announcementLevel === 'moderate' ?
                                '"Table: Student Assessment Results. Alex: Math 85%, Science 92%, English 78%. Jamie: Math 76%, Science 83%, English 91%. Taylor: Math 94%, Science 88%, English 85%."' :
                                '"Student Assessment Results table. Alex, Jamie, and Taylor\'s scores in Math, Science, and English."'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  This preview demonstrates how content would be announced by a screen reader with your selected settings.
                  The actual experience may vary depending on the specific screen reader software and browser being used.
                </p>
              </div>
              
              <Alert variant="warning" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  These settings enhance the platform for screen reader users but do not replace the need for proper screen reader software. Users should have a screen reader installed on their device.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button 
          onClick={handleApplySettings}
          className="flex items-center gap-2"
          disabled={isApplied && JSON.stringify(settings) === JSON.stringify({
            enabled: document.documentElement.classList.contains('screen-reader-optimized'),
            enhancedAria: true, // This would need a more complex check in a real implementation
            improvedAltText: true, // This would need a more complex check in a real implementation
            semanticHeadings: true, // This would need a more complex check in a real implementation
            tableAccessibility: true, // This would need a more complex check in a real implementation
            formLabels: true, // This would need a more complex check in a real implementation
            readingOrder: true, // This would need a more complex check in a real implementation
            announcementLevel: document.documentElement.classList.contains('announcement-minimal') ? 'minimal' :
                              document.documentElement.classList.contains('announcement-verbose') ? 'verbose' :
                              'moderate',
          })}
        >
          <Check className="h-4 w-4" />
          Apply Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
