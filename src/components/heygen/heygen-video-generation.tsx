'use client';

import React, { useState, useEffect } from 'react';
import { HeyGenService, VideoGenerationParams, HeyGenAvatar, HeyGenVoice, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Check, RefreshCw, Video, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/**
 * HeyGen Video Generation Component
 * 
 * This component handles the generation of AI videos using HeyGen's API,
 * utilizing the custom avatar and voice created in the avatar creation step.
 */
export const HeyGenVideoGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatars, setAvatars] = useState<HeyGenAvatar[]>([]);
  const [voices, setVoices] = useState<HeyGenVoice[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [selectedOutfit, setSelectedOutfit] = useState<string>('professional');
  const [selectedBackground, setSelectedBackground] = useState<string>('office');
  const [generatedVideo, setGeneratedVideo] = useState<HeyGenVideo | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [availableScripts, setAvailableScripts] = useState<{id: string, title: string}[]>([]);
  
  // Initialize HeyGen service
  const heygenService = HeyGenService.getInstance({
    apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo-api-key',
    baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
  });
  
  // Outfit options
  const outfitOptions = [
    { value: 'professional', label: 'Professional (Business Attire)' },
    { value: 'casual', label: 'Casual (Smart Casual)' },
    { value: 'academic', label: 'Academic (Professor Style)' },
    { value: 'formal', label: 'Formal (Suit and Tie)' }
  ];
  
  // Background options
  const backgroundOptions = [
    { value: 'office', label: 'Office Environment' },
    { value: 'classroom', label: 'Classroom Setting' },
    { value: 'library', label: 'Library' },
    { value: 'neutral', label: 'Neutral Background' },
    { value: 'gradient', label: 'Gradient Background' }
  ];
  
  useEffect(() => {
    // Initialize HeyGen service and fetch avatars, voices, and scripts
    const initService = async () => {
      try {
        await heygenService.initialize();
        
        // Fetch avatars
        const fetchedAvatars = await heygenService.getAvatars();
        setAvatars(fetchedAvatars);
        if (fetchedAvatars.length > 0) {
          setSelectedAvatar(fetchedAvatars[0].id);
        }
        
        // Fetch voices
        const fetchedVoices = await heygenService.getVoices();
        setVoices(fetchedVoices);
        if (fetchedVoices.length > 0) {
          setSelectedVoice(fetchedVoices[0].id);
        }
        
        // In a production environment, we would fetch the actual scripts
        // For now, we'll use our predefined scripts
        const scripts = [
          { id: 'exec_summary', title: 'Executive Summary' },
          { id: 'platform_overview', title: 'Platform Features Overview' },
          { id: 'ed_psych_foundations', title: 'Educational Psychology Foundations' },
          { id: 'educator_onboarding', title: 'Educator Onboarding' },
          { id: 'parent_onboarding', title: 'Parent Onboarding' },
          { id: 'student_ks2', title: 'Student Onboarding (Key Stage 2)' },
          { id: 'adaptive_complexity', title: 'Adaptive Complexity System' },
          { id: 'voice_input', title: 'Voice Input and Accessibility' },
          { id: 'immersive_learning', title: 'Immersive Learning Environments' },
          { id: 'sen_support', title: 'Special Educational Needs Support' }
        ];
        
        setAvailableScripts(scripts);
        if (scripts.length > 0) {
          setSelectedScript(scripts[0].id);
        }
      } catch (error) {
        console.error('Failed to initialize HeyGen service:', error);
        setError('Failed to initialize video generation service. Please try again later.');
      }
    };
    
    initService();
  }, []);
  
  // Handle video generation
  const handleGenerateVideo = async () => {
    if (!selectedAvatar) {
      setError('Please select an avatar for video generation.');
      return;
    }
    
    if (!selectedScript) {
      setError('Please select a script for video generation.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setGenerationProgress(0);
    
    try {
      const params: VideoGenerationParams = {
        avatarId: selectedAvatar,
        scriptId: selectedScript,
        outfit: selectedOutfit,
        background: selectedBackground,
        voiceId: selectedVoice || undefined
      };
      
      // Generate the video
      const video = await heygenService.generateVideo(params);
      setGeneratedVideo(video);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setSuccess(true);
            setLoading(false);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to generate video:', error);
      setError('Failed to generate video. Please try again later.');
      setLoading(false);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setGeneratedVideo(null);
    setSuccess(false);
    setError(null);
    setGenerationProgress(0);
  };
  
  // Success state
  if (success && generatedVideo) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <Check className="mr-2" /> Video Generated Successfully
          </CardTitle>
          <CardDescription>
            Your AI avatar video has been created and is ready to view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-4">
            {generatedVideo.url ? (
              <video 
                src={generatedVideo.url} 
                controls 
                className="w-full h-full object-cover"
                poster={generatedVideo.thumbnailUrl}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Video preview not available</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline" className="mr-2">
              Generate Another Video
            </Button>
            <Button onClick={() => window.location.href = '/ai-avatar-videos'}>
              View All Videos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Generate AI Avatar Video</CardTitle>
        <CardDescription>
          Create educational videos using your custom AI avatar and voice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Avatar</label>
            <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
              <SelectTrigger>
                <SelectValue placeholder="Select an avatar" />
              </SelectTrigger>
              <SelectContent>
                {avatars.length > 0 ? (
                  avatars.map(avatar => (
                    <SelectItem key={avatar.id} value={avatar.id}>
                      {avatar.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-avatar" disabled>
                    No avatars available. Please create one first.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.length > 0 ? (
                  voices.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-voice" disabled>
                    No voices available. Using default voice.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Script Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Script</label>
            <Select value={selectedScript} onValueChange={setSelectedScript}>
              <SelectTrigger>
                <SelectValue placeholder="Select a script" />
              </SelectTrigger>
              <SelectContent>
                {availableScripts.map(script => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Outfit Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Outfit</label>
            <Select value={selectedOutfit} onValueChange={setSelectedOutfit}>
              <SelectTrigger>
                <SelectValue placeholder="Select an outfit" />
              </SelectTrigger>
              <SelectContent>
                {outfitOptions.map(outfit => (
                  <SelectItem key={outfit.value} value={outfit.value}>
                    {outfit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Background</label>
            <Select value={selectedBackground} onValueChange={setSelectedBackground}>
              <SelectTrigger>
                <SelectValue placeholder="Select a background" />
              </SelectTrigger>
              <SelectContent>
                {backgroundOptions.map(background => (
                  <SelectItem key={background.value} value={background.value}>
                    {background.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Generation Progress */}
          {loading && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Generating Video</span>
                <span className="text-sm font-medium">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                This process typically takes 2-5 minutes. Please don't close this page.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          Reset
        </Button>
        <Button 
          onClick={handleGenerateVideo} 
          disabled={loading || !selectedAvatar || !selectedScript}
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Generate Video
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HeyGenVideoGeneration;
