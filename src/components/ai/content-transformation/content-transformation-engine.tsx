'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAIService } from '@/lib/ai/ai-service';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, Play, Pause, Volume2, BookOpen, Eye, Hand, Ear } from 'lucide-react';

type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';

type ContentTransformationProps = {
  originalContent: string;
  contentType?: 'lesson' | 'assessment' | 'resource' | 'feedback';
  subjectArea?: string;
  targetAge?: number;
  learningStyle?: LearningStyle;
  onTransformationComplete?: (transformedContent: TransformedContent) => void;
};

type TransformedContent = {
  visual: string;
  auditory: string;
  kinesthetic: string;
  readingWriting: string;
  multimodal: string;
};

export default function ContentTransformationEngine({
  originalContent,
  contentType = 'lesson',
  subjectArea = '',
  targetAge = 10,
  learningStyle,
  onTransformationComplete
}: ContentTransformationProps) {
  const { toast } = useToast();
  const aiService = useAIService();
  
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedContent, setTransformedContent] = useState<TransformedContent | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>(learningStyle || 'visual');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(80);
  const [customContent, setCustomContent] = useState('');
  const [useCustomContent, setUseCustomContent] = useState(false);
  const [complexity, setComplexity] = useState(50);
  
  // Fetch user's learning style profile if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/ai/learning-style');
        const data = await response.json();
        
        if (data.success && data.hasProfile) {
          setUserProfile(data.profile);
          if (!learningStyle) {
            setSelectedStyle(data.profile.primaryStyle.toLowerCase().replace('/', '-') as LearningStyle);
          }
        }
      } catch (error) {
        console.error('Error fetching learning style profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [learningStyle]);
  
  // Transform content when component mounts or when key props change
  useEffect(() => {
    if (originalContent && !transformedContent && !isTransforming) {
      transformContent();
    }
  }, [originalContent]);
  
  const transformContent = async () => {
    if (!originalContent && !useCustomContent) {
      toast({
        title: "No content to transform",
        description: "Please provide content to transform or enable custom content input.",
        variant: "destructive"
      });
      return;
    }
    
    const contentToTransform = useCustomContent ? customContent : originalContent;
    
    if (!contentToTransform) {
      toast({
        title: "No content to transform",
        description: "Please provide content to transform.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransforming(true);
    
    try {
      const prompt = `
        Transform the following educational content to optimize it for different learning styles.
        Create versions optimized for visual, auditory, kinesthetic, and reading/writing learning styles,
        as well as a multimodal version that combines elements from all styles.
        
        Content Type: ${contentType}
        ${subjectArea ? `Subject Area: ${subjectArea}` : ''}
        Target Age: ${targetAge}
        Complexity Level (0-100): ${complexity}
        
        Original Content:
        ${contentToTransform}
        
        For each learning style, adapt the content while preserving the educational objectives:
        
        1. Visual: Emphasize diagrams, charts, color-coding, spatial organization, and visual metaphors.
        2. Auditory: Emphasize dialogue, discussion points, mnemonics, rhythm, and spoken explanations.
        3. Kinesthetic: Emphasize hands-on activities, physical movements, tactile examples, and experiential learning.
        4. Reading/Writing: Emphasize lists, definitions, structured text, note-taking opportunities, and written exercises.
        5. Multimodal: Create a balanced version that incorporates elements from all learning styles.
        
        Ensure all content:
        - Uses UK English spelling and terminology
        - Aligns with UK curriculum standards
        - Is evidence-based and factually accurate
        - Is age-appropriate for the target audience
        - Maintains the educational integrity of the original content
        
        Format the response as JSON with the following structure:
        {
          "visual": "content optimized for visual learners",
          "auditory": "content optimized for auditory learners",
          "kinesthetic": "content optimized for kinesthetic learners",
          "readingWriting": "content optimized for reading/writing learners",
          "multimodal": "content optimized for multimodal learning"
        }
      `;
      
      const apiResult = await aiService.generateText(prompt, {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      });
      
      const aiResponse = apiResult.text;
      
      // Parse AI response
      try {
        const parsedResult = JSON.parse(aiResponse);
        setTransformedContent({
          visual: parsedResult.visual,
          auditory: parsedResult.auditory,
          kinesthetic: parsedResult.kinesthetic,
          readingWriting: parsedResult.readingWriting,
          multimodal: parsedResult.multimodal
        });
        
        if (onTransformationComplete) {
          onTransformationComplete({
            visual: parsedResult.visual,
            auditory: parsedResult.auditory,
            kinesthetic: parsedResult.kinesthetic,
            readingWriting: parsedResult.readingWriting,
            multimodal: parsedResult.multimodal
          });
        }
        
        toast({
          title: "Content transformed successfully",
          description: "Content has been adapted for different learning styles.",
        });
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        toast({
          title: "Transformation error",
          description: "Failed to process the transformed content.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error transforming content:', error);
      toast({
        title: "Transformation failed",
        description: "There was an error transforming the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTransforming(false);
    }
  };
  
  const handleVoiceInput = () => {
    // In a real implementation, this would use the Web Speech API
    setIsVoiceInputActive(prev => !prev);
    
    if (!isVoiceInputActive) {
      toast({
        title: "Voice input activated",
        description: "Speak clearly to input your content.",
      });
      
      // Simulate voice recognition after a delay
      setTimeout(() => {
        setCustomContent(prev => prev + " This is simulated voice input text that would be captured from the user's speech.");
        setIsVoiceInputActive(false);
        toast({
          title: "Voice input complete",
          description: "Your speech has been converted to text.",
        });
      }, 3000);
    }
  };
  
  const handleTextToSpeech = () => {
    // In a real implementation, this would use the Web Speech API
    setIsPlayingAudio(prev => !prev);
    
    if (!isPlayingAudio) {
      toast({
        title: "Reading content aloud",
        description: `Volume: ${audioVolume}%`,
      });
      
      // Simulate audio playback ending after a delay
      setTimeout(() => {
        setIsPlayingAudio(false);
        toast({
          title: "Finished reading content",
          description: "Audio playback complete.",
        });
      }, 5000);
    } else {
      toast({
        title: "Paused reading",
        description: "Audio playback paused.",
      });
    }
  };
  
  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'visual':
        return <Eye className="h-4 w-4" />;
      case 'auditory':
        return <Ear className="h-4 w-4" />;
      case 'kinesthetic':
        return <Hand className="h-4 w-4" />;
      case 'reading-writing':
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const renderStyleBadge = (style: LearningStyle) => {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        {getStyleIcon(style)}
        <span>{style.charAt(0).toUpperCase() + style.slice(1).replace('-', '/')}</span>
      </Badge>
    );
  };
  
  const renderContent = () => {
    if (isTransforming) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    
    if (!transformedContent) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No transformed content available. Click "Transform Content" to begin.
          </p>
        </div>
      );
    }
    
    const contentMap = {
      'visual': transformedContent.visual,
      'auditory': transformedContent.auditory,
      'kinesthetic': transformedContent.kinesthetic,
      'reading-writing': transformedContent.readingWriting,
      'multimodal': transformedContent.multimodal
    };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {renderStyleBadge(selectedStyle)}
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTextToSpeech}
              className="flex items-center gap-1"
            >
              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlayingAudio ? 'Pause' : 'Read Aloud'}
            </Button>
            
            {isPlayingAudio && (
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[audioVolume]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setAudioVolume(value[0])}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {/* In a real implementation, this would be properly rendered HTML with appropriate styling */}
          <div dangerouslySetInnerHTML={{ __html: contentMap[selectedStyle].replace(/\n/g, '<br />') }} />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Content Transformation Engine</CardTitle>
          <CardDescription>
            Adapt educational content to different learning styles for personalized learning experiences.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-2">
          <div className="space-y-6">
            {/* Custom Content Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-custom-content">Use custom content</Label>
                <Switch
                  id="use-custom-content"
                  checked={useCustomContent}
                  onCheckedChange={setUseCustomContent}
                />
              </div>
              
              {useCustomContent && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="custom-content">Enter content to transform</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVoiceInput}
                      className={`flex items-center gap-1 ${isVoiceInputActive ? 'text-red-500' : ''}`}
                    >
                      <Mic className="h-4 w-4" />
                      {isVoiceInputActive ? 'Recording...' : 'Voice Input'}
                    </Button>
                  </div>
                  
                  <Textarea
                    id="custom-content"
                    placeholder="Enter educational content to transform..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
            
            {/* Complexity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="complexity">Content Complexity</Label>
                <span className="text-sm text-muted-foreground">{complexity}%</span>
              </div>
              <Slider
                id="complexity"
                value={[complexity]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setComplexity(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Simpler</span>
                <span>More Complex</span>
              </div>
            </div>
            
            {/* Learning Style Selection */}
            <div className="space-y-2">
              <Label>Learning Style Preference</Label>
              <RadioGroup
                value={selectedStyle}
                onValueChange={(value) => setSelectedStyle(value as LearningStyle)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visual" id="visual" />
                  <Label htmlFor="visual" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Visual
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auditory" id="auditory" />
                  <Label htmlFor="auditory" className="flex items-center gap-1">
                    <Ear className="h-4 w-4" /> Auditory
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                  <Label htmlFor="kinesthetic" className="flex items-center gap-1">
                    <Hand className="h-4 w-4" /> Kinesthetic
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reading-writing" id="reading-writing" />
                  <Label htmlFor="reading-writing" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> Reading/Writing
                  </Label>
                </div>
              </RadioGroup>
              
              {userProfile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your primary learning style is {userProfile.primaryStyle} ({userProfile.visualScore}%).
                </p>
              )}
            </div>
            
            {/* Transformed Content Display */}
            <div className="border rounded-md p-4">
              {renderContent()}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setTransformedContent(null)}
            disabled={isTransforming || !transformedContent}
          >
            Reset
          </Button>
          <Button
            onClick={transformContent}
            disabled={isTransforming || (!originalContent && !useCustomContent) || (useCustomContent && !customContent)}
          >
            {isTransforming ? 'Transforming...' : 'Transform Content'}
          </Button>
        </CardFooter>
      </Card>
      
      {transformedContent && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Learning Styles</CardTitle>
            <CardDescription>
              Compare content adapted for different learning styles.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2">
            <Tabs defaultValue={selectedStyle}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="visual" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> Visual
                </TabsTrigger>
                <TabsTrigger value="auditory" className="flex items-center gap-1">
                  <Ear className="h-4 w-4" /> Auditory
                </TabsTrigger>
                <TabsTrigger value="kinesthetic" className="flex items-center gap-1">
                  <Hand className="h-4 w-4" /> Kinesthetic
                </TabsTrigger>
                <TabsTrigger value="reading-writing" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> Reading/Writing
                </TabsTrigger>
                <TabsTrigger value="multimodal">Multimodal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual" className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: transformedContent.visual.replace(/\n/g, '<br />') }} />
              </TabsContent>
              
              <TabsContent value="auditory" className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: transformedContent.auditory.replace(/\n/g, '<br />') }} />
              </TabsContent>
              
              <TabsContent value="kinesthetic" className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: transformedContent.kinesthetic.replace(/\n/g, '<br />') }} />
              </TabsContent>
              
              <TabsContent value="reading-writing" className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: transformedContent.readingWriting.replace(/\n/g, '<br />') }} />
              </TabsContent>
              
              <TabsContent value="multimodal" className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: transformedContent.multimodal.replace(/\n/g, '<br />') }} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

