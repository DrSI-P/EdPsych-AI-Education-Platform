'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Sparkles } from "lucide-react";
import MultiModalPresentationEngine from '@/components/ai/multi-modal-content/multi-modal-presentation-engine';

interface MultiModalContentWithParamsProps {
  content: any;
  setContent: React.Dispatch<React.SetStateAction<any>>;
  router: any;
}

export function MultiModalContentWithParams({ content, setContent, router }: MultiModalContentWithParamsProps) {
  const searchParams = useSearchParams();
  const contentId = searchParams ? searchParams.get('contentId') : null;

  return (
    <>
      {!contentId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Content to Transform</CardTitle>
            <CardDescription>
              Choose existing content or create new multi-modal content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                onClick={() => router.push('/curriculum')}
              >
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <span className="text-lg font-medium">Curriculum Plans</span>
                <span className="text-sm text-muted-foreground text-centre">
                  Transform existing curriculum plans into multi-modal content
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                onClick={() => router.push('/resources')}
              >
                <Layers className="h-10 w-10 text-primary mb-2" />
                <span className="text-lg font-medium">Resources</span>
                <span className="text-sm text-muted-foreground text-centre">
                  Transform existing resources into multi-modal content
                </span>
              </Button>
            </div>
            
            <div className="mt-6 text-centre">
              <p className="text-sm text-muted-foreground mb-4">
                Or create new multi-modal content from scratch
              </p>
              <Button onClick={() => setContent({ title: '', content: '' })}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create New Content
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <MultiModalPresentationEngine 
        contentId={contentId || undefined}
        content={content?.content}
        title={content?.title}
      />
    </>
  );
}