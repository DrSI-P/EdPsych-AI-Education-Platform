'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, BarChart3 } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the AdaptiveComplexityEngine component with SSR disabled
const AdaptiveComplexityEngine = dynamic(
  () => import('@/components/ai/adaptive-complexity/adaptive-complexity-engine'),
  { ssr: false }
);

// Define interface for content structure
interface ContentItem {
  title: string;
  content: string;
}

interface AdaptiveComplexityWithParamsProps {
  content: ContentItem | null;
  setContent: React.Dispatch<React.SetStateAction<ContentItem | null>>;
  router: any;
}

export function AdaptiveComplexityWithParams({ content, setContent, router }: AdaptiveComplexityWithParamsProps) {
  const searchParams = useSearchParams();
  const contentId = searchParams ? searchParams.get('contentId') : null;

  return (
    <div className="space-y-8">
      {!contentId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Content to Adjust</CardTitle>
            <CardDescription>
              Choose existing content or create new adaptive content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content?select=true')}
              >
                <BookOpen className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">Existing Content</div>
                  <div className="text-sm text-muted-foreground mt-1">Adapt previously created materials</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content/create?adaptive=true')}
              >
                <Layers className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">New Content</div>
                  <div className="text-sm text-muted-foreground mt-1">Create new adaptive content</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content/examples?adaptive=true')}
              >
                <BarChart3 className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">View Examples</div>
                  <div className="text-sm text-muted-foreground mt-1">See adaptive content in action</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {contentId && (
        <AdaptiveComplexityEngine 
          contentId={contentId}
          initialContent={content}
          onContentChange={setContent}
        />
      )}
    </div>
  );
}