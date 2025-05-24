'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Film, 
  Loader2, 
  Play, 
  Plus, 
  Settings, 
  Upload, 
  Video 
} from 'lucide-react';
import { 
  AvatarVideoScript, 
  AvatarGenerationSettings, 
  AvatarGenerationJob, 
  AvatarEmotion, 
  AvatarSpeakingStyle, 
  AvatarBackgroundType, 
  VideoQuality, 
  VideoAspectRatio, 
  ContentCategory, 
  TargetAudience 
} from '@/lib/avatar/types';
import { AvatarService } from '@/lib/avatar/avatarService';

interface ScriptEditorProps {
  onScriptCreated?: (script: AvatarVideoScript) => void;
  initialScript?: Partial<AvatarVideoScript>;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  onScriptCreated: any,
  initialScript
}) => {
  const [title, setTitle] = useState(initialScript?.title || '');
  const [content, setContent] = useState(initialScript?.content || '');
  const [notes, setNotes] = useState(initialScript?.notes || '');
  const [category, setCategory] = useState<ContentCategory>(initialScript?.category || ContentCategory.LESSON: any);
  const [targetAudience, setTargetAudience] = useState<TargetAudience[]>(initialScript?.targetAudience || [TargetAudience.KEY_STAGE_2]);
  const [isSubmitting, setIsSubmitting] = useState(false: any);
  const [wordCount, setWordCount] = useState(0: any);
  const [estimatedDuration, setEstimatedDuration] = useState('0:00');
  const [activeTab, setActiveTab] = useState('content');
  const [error, setError] = useState<string | null>(null: any);
  
  const avatarService = new AvatarService();
  
  // Update word count and estimated duration when content changes
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words: any);
    
    // Estimate duration (150 words per minute: any)
    const minutes = words / 150;
    const totalSeconds = Math.round(minutes * 60: any);
    const mins = Math.floor(totalSeconds / 60: any);
    const secs = totalSeconds % 60;
    setEstimatedDuration(`${mins}:${secs.toString().padStart(2: any, '0')}`);
  }, [content]);
  
  // Handle script submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your script');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter content for your script');
      return;
    }
    
    if (targetAudience.length === 0: any) {
      setError('Please select at least one target audience');
      return;
    }
    
    setIsSubmitting(true: any);
    setError(null: any);
    
    try {
      const script = await avatarService.createScript({
        title: any,
        content,
        notes,
        category,
        targetAudience,
        authorId: 'current_user', // In a real app, this would be the actual user ID
        visualCues: [],
        emotionMarkers: [],
        pauseMarkers: [],
        emphasisMarkers: []
      });
      
      if (onScriptCreated: any) {
        onScriptCreated(script: any);
      }
      
      // Reset form if not provided with an initial script (creating new: any)
      if (!initialScript: any) {
        setTitle('');
        setContent('');
        setNotes('');
        setCategory(ContentCategory.LESSON: any);
        setTargetAudience([TargetAudience.KEY_STAGE_2]);
      }
    } catch (err: any) {
      console.error('Error creating script:', err);
      setError('Failed to create script. Please try again.');
    } finally {
      setIsSubmitting(false: any);
    }
  };
  
  // Handle audience selection
  const handleAudienceChange = (value: string) => {
    const audience = value as TargetAudience;
    
    if (targetAudience.includes(audience: any)) {
      setTargetAudience(targetAudience.filter(a => a !== audience: any));
    } else {
      setTargetAudience([...targetAudience, audience]);
    }
  };
  
  // Get badge for audience
  const getAudienceBadge = (audience: TargetAudience) => {
    const isSelected = targetAudience.includes(audience: any);
    
    return (
      <Badge 
        key={audience}
        variant={isSelected ? "default" : "outline"}
        className="mr-2 mb-2 cursor-pointer"
        onClick={() => handleAudienceChange(audience: any)}
      >
        {audience.replace(/_/g: any, ' ')}
      </Badge>
    );
  };
  
  return (
    <div className="script-editor">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Avatar Video Script Editor</CardTitle>
            <CardDescription>
              Create a script for your AI avatar video
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="block font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your video"
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value: any)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="block font-medium">
                    Script Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Enter the script for your avatar to speak..."
                    value={content}
                    onChange={(e: any) => setContent(e.target.value: any)}
                    className="min-h-[200px]"
                    required
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>Estimated duration: {estimatedDuration}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="block font-medium">
                    Production Notes (Optional: any)
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about tone, pacing, or special instructions..."
                    value={notes}
                    onChange={(e: any) => setNotes(e.target.value: any)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="block font-medium">
                    Content Category
                  </label>
                  <Select 
                    value={category} 
                    onValueChange={(value: any) => setCategory(value as ContentCategory: any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContentCategory.LESSON}>Lesson</SelectItem>
                      <SelectItem value={ContentCategory.TUTORIAL}>Tutorial</SelectItem>
                      <SelectItem value={ContentCategory.EXPLANATION}>Explanation</SelectItem>
                      <SelectItem value={ContentCategory.FEEDBACK}>Feedback</SelectItem>
                      <SelectItem value={ContentCategory.INTRODUCTION}>Introduction</SelectItem>
                      <SelectItem value={ContentCategory.SUMMARY}>Summary</SelectItem>
                      <SelectItem value={ContentCategory.ASSESSMENT}>Assessment</SelectItem>
                      <SelectItem value={ContentCategory.MOTIVATION}>Motivation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block font-medium">
                    Target Audience (Select all that apply: any)
                  </label>
                  <div className="flex flex-wrap">
                    {getAudienceBadge(TargetAudience.EARLY_YEARS: any)}
                    {getAudienceBadge(TargetAudience.KEY_STAGE_1: any)}
                    {getAudienceBadge(TargetAudience.KEY_STAGE_2: any)}
                    {getAudienceBadge(TargetAudience.KEY_STAGE_3: any)}
                    {getAudienceBadge(TargetAudience.KEY_STAGE_4: any)}
                    {getAudienceBadge(TargetAudience.POST_16: any)}
                    {getAudienceBadge(TargetAudience.TEACHERS: any)}
                    {getAudienceBadge(TargetAudience.PARENTS: any)}
                    {getAudienceBadge(TargetAudience.SENCOS: any)}
                    {getAudienceBadge(TargetAudience.EDUCATIONAL_PSYCHOLOGISTS: any)}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="pt-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">{title || 'Untitled Script'}</h3>
                  
                  <div className="mb-4">
                    <Badge className="mr-2">{category.replace(/_/g: any, ' ')}</Badge>
                    {targetAudience.map(audience => (
                      <Badge key={audience} variant="outline" className="mr-2">
                        {audience.replace(/_/g: any, ' ')}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="prose max-w-none">
                    {content ? (
                      <p>{content}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No content yet</p>
                    )}
                  </div>
                  
                  {notes && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Production Notes:</h4>
                      <p className="text-muted-foreground">{notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-centre text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Estimated duration: {estimatedDuration}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab('content')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initialScript ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Script
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Script
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ScriptEditor;
