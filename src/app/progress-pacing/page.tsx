'use client';

import { useState } from 'react';
import ProgressPacingEngine from '@/components/ai/progress-pacing/progress-pacing-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Timer, BookOpen, Layers, ArrowRight, CheckCircle2, BarChart3, Gauge } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProgressPacingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<any>(null);
  const contentId = searchParams.get('contentId');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progress-Adaptive Pacing</h1>
          <p className="text-muted-foreground">
            Automatically adjust learning pace based on individual student progress
          </p>
        </div>
        
        <Tabs defaultValue="adjust" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">Adjust Pacing</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="pt-4">
            <div className="space-y-8">
              {!contentId && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select Content to Adjust</CardTitle>
                    <CardDescription>
                      Choose existing content or create new adaptive pacing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto flex flex-col items-center justify-center p-6 gap-2"
                        onClick={() => router.push('/curriculum')}
                      >
                        <BookOpen className="h-10 w-10 text-primary mb-2" />
                        <span className="text-lg font-medium">Curriculum Plans</span>
                        <span className="text-sm text-muted-foreground text-center">
                          Adjust pacing of curriculum plans
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto flex flex-col items-center justify-center p-6 gap-2"
                        onClick={() => router.push('/resources')}
                      >
                        <Layers className="h-10 w-10 text-primary mb-2" />
                        <span className="text-lg font-medium">Resources</span>
                        <span className="text-sm text-muted-foreground text-center">
                          Adjust pacing of learning resources
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto flex flex-col items-center justify-center p-6 gap-2"
                        onClick={() => router.push('/adaptive-complexity')}
                      >
                        <Gauge className="h-10 w-10 text-primary mb-2" />
                        <span className="text-lg font-medium">Adaptive Content</span>
                        <span className="text-sm text-muted-foreground text-center">
                          Adjust pacing of complexity-adjusted content
                        </span>
                      </Button>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Or create new progress-adaptive content from scratch
                      </p>
                      <Button onClick={() => setContent({ title: '', content: '' })}>
                        <Timer className="h-4 w-4 mr-2" />
                        Create New Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <ProgressPacingEngine 
                contentId={contentId || undefined}
                content={content?.content}
                title={content?.title}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Progress-Adaptive Pacing</CardTitle>
                <CardDescription>
                  Understanding how this feature personalizes learning pace for individual students
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Progress-Adaptive Pacing?</h3>
                  <p>
                    Progress-Adaptive Pacing is an advanced educational technology that automatically adjusts the pace of learning based on individual student progress and mastery. This feature ensures that each student moves through the curriculum at an optimal rate—not too fast to cause confusion or knowledge gaps, yet not too slow to cause disengagement or boredom.
                  </p>
                  <p className="mt-2">
                    By leveraging artificial intelligence and evidence-based pedagogical principles, the system creates personalized learning journeys that adapt to each student's unique progress patterns, making education more efficient, engaging, and effective.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Progress-Based Adaptation:</span> Automatically adjusts learning pace based on student progress data, mastery levels, and learning velocity.
                    </li>
                    <li>
                      <span className="font-medium">Remediation Support:</span> Provides additional time and resources for topics where students need more practice or support.
                    </li>
                    <li>
                      <span className="font-medium">Acceleration Opportunities:</span> Offers faster progression and enrichment for students who demonstrate mastery and readiness for advanced content.
                    </li>
                    <li>
                      <span className="font-medium">Progress Checks:</span> Embeds assessment points within the learning sequence to verify understanding and guide further adaptations.
                    </li>
                    <li>
                      <span className="font-medium">Mastery-Based Advancement:</span> Ensures students master essential concepts before moving to more advanced topics, preventing knowledge gaps.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Benefits</h3>
                  <p>
                    Research in educational psychology demonstrates that adaptive pacing offers significant advantages:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Increased engagement through appropriately paced content</li>
                    <li>Reduced frustration from moving too quickly through challenging material</li>
                    <li>Prevention of boredom from unnecessary repetition of mastered content</li>
                    <li>Support for students with diverse learning speeds and needs</li>
                    <li>More efficient use of learning time through personalized pacing</li>
                    <li>Improved knowledge retention through mastery-based progression</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our progress-adaptive pacing system is built on established research in mastery learning theory, spaced repetition principles, and the science of knowledge acquisition and retention. The system implements best practices for presenting information at the optimal pace while ensuring deep understanding and long-term retention.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                  <p>
                    All adapted pacing maintains alignment with UK curriculum standards and uses UK English spelling and terminology. The system ensures that while the learning pace may be adjusted, the core learning objectives and curriculum requirements are preserved.
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                    Teacher Tip
                  </h3>
                  <p>
                    Progress-adaptive pacing is particularly valuable for mixed-ability classrooms, students with special educational needs, and personalized learning programs. Consider using this feature to create individualized learning pathways that allow all students to progress at their optimal pace while ensuring mastery of essential concepts.
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
