'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeyGenService, VideoGenerationParams } from '@/lib/heygen/heygen-service';
import { Loader2, Upload, Check, AlertCircle } from 'lucide-react';

const HeyGenVideoGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedVoice, setUploadedVoice] = useState<File | null>(null);
  const [avatarName, setAvatarName] = useState('Dr. Scott Ighavongbe-Patrick');
  const [scriptContent, setScriptContent] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [availableScripts, setAvailableScripts] = useState<{id: string, title: string, content: string}[]>([
    { id: 'executive_summary', title: 'Executive Summary', content: 'Welcome to EdPsych Connect, where educational psychology meets cutting-edge technology...' },
    { id: 'platform_features', title: 'Platform Features Overview', content: 'EdPsych Connect offers a comprehensive suite of features designed to transform education...' },
    { id: 'educational_psychology', title: 'Educational Psychology Foundations', content: 'At the heart of EdPsych Connect is a deep commitment to educational psychology principles...' },
    { id: 'educator_onboarding', title: 'Educator Onboarding', content: 'Welcome to EdPsych Connect! This platform has been designed with educators like you in mind...' },
    { id: 'parent_onboarding', title: 'Parent Onboarding', content: 'Welcome to EdPsych Connect! As a parent, you play a crucial role in your child\'s educational journey...' },
    { id: 'student_onboarding', title: 'Student Onboarding', content: 'Hello and welcome to EdPsych Connect! This is your personal learning space...' },
  ]);

  // Initialize HeyGen service
  useEffect(() => {
    const initializeHeyGen = async () => {
      try {
        const heygenService = HeyGenService.getInstance({
          apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo_key',
          baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
        });
        
        await heygenService.initialize();
        
        // Fetch avatars, voices, and scripts
        const fetchedAvatars = await heygenService.getAvatars();
        const fetchedVoices = await heygenService.getVoices();
        
        setAvatars(fetchedAvatars);
        setVoices(fetchedVoices);
        
        // If we have Dr. Scott's avatar and voice already, select them by default
        const drScottAvatar = fetchedAvatars.find(a => a.name.includes('Scott'));
        const drScottVoice = fetchedVoices.find(v => v.name.includes('Scott'));
        
        if (drScottAvatar) setSelectedAvatar(drScottAvatar.id);
        if (drScottVoice) setSelectedVoice(drScottVoice.id);
        
      } catch (error) {
        console.error('Failed to initialize HeyGen service:', error);
        setError('Failed to initialize video generation service. Please try again later.');
      }
    };
    
    initializeHeyGen();
  }, []);

  const handleScriptSelect = (scriptId: string) => {
    const script = availableScripts.find(s => s.id === scriptId);
    if (script) {
      setSelectedScript(scriptId);
      setScriptTitle(script.title);
      setScriptContent(script.content);
      setVideoTitle(script.title + ' - AI Avatar Video');
      setVideoDescription('Educational video featuring Dr. Scott Ighavongbe-Patrick explaining ' + script.title.toLowerCase());
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedVoice(e.target.files[0]);
    }
  };

  const createAvatar = async () => {
    if (!uploadedImage) {
      setError('Please upload an image for the avatar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would upload the image to a storage service
      // and then pass the URL to the HeyGen API
      const imageUrl = URL.createObjectURL(uploadedImage);
      
      const heygenService = HeyGenService.getInstance();
      const newAvatar = await heygenService.createAvatar({
        name: avatarName,
        imageUrls: [imageUrl],
        voiceSampleUrl: uploadedVoice ? URL.createObjectURL(uploadedVoice) : undefined
      });
      
      setAvatars([...avatars, newAvatar]);
      setSelectedAvatar(newAvatar.id);
      setSuccess(true);
      setActiveTab('generate');
      
      // If voice was also uploaded, create a voice clone
      if (uploadedVoice) {
        const voiceUrl = URL.createObjectURL(uploadedVoice);
        const newVoice = await heygenService.createVoice(avatarName + "'s Voice", voiceUrl);
        setVoices([...voices, newVoice]);
        setSelectedVoice(newVoice.id);
      }
      
    } catch (error) {
      console.error('Failed to create avatar:', error);
      setError('Failed to create avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadScript = async () => {
    if (!scriptTitle || !scriptContent) {
      setError('Please provide a title and content for the script');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const heygenService = HeyGenService.getInstance();
      const scriptId = await heygenService.uploadScript(scriptTitle, scriptContent);
      
      const newScript = {
        id: scriptId,
        title: scriptTitle,
        content: scriptContent
      };
      
      setAvailableScripts([...availableScripts, newScript]);
      setSelectedScript(scriptId);
      setSuccess(true);
      
    } catch (error) {
      console.error('Failed to upload script:', error);
      setError('Failed to upload script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!selectedAvatar || !selectedScript || !videoTitle) {
      setError('Please select an avatar, script, and provide a title for the video');
      return;
    }
    
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const heygenService = HeyGenService.getInstance();
      
      const params: VideoGenerationParams = {
        avatarId: selectedAvatar,
        scriptId: selectedScript,
        title: videoTitle,
        description: videoDescription,
        voiceId: selectedVoice || undefined
      };
      
      const video = await heygenService.generateVideo(params);
      setGeneratedVideoId(video.id);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Check video status periodically
      const statusCheckInterval = setInterval(async () => {
        const status = await heygenService.getVideoStatus(video.id);
        
        if (status && status.status === 'completed') {
          clearInterval(statusCheckInterval);
          clearInterval(progressInterval);
          setProgress(100);
          setSuccess(true);
          setLoading(false);
        } else if (status && status.status === 'failed') {
          clearInterval(statusCheckInterval);
          clearInterval(progressInterval);
          setError('Video generation failed. Please try again.');
          setLoading(false);
        } else if (!status) {
          clearInterval(statusCheckInterval);
          clearInterval(progressInterval);
          setError('Failed to get video status. Please try again.');
          setLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to generate video:', error);
      setError('Failed to generate video. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Avatar Video Generation</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Avatar</TabsTrigger>
          <TabsTrigger value="script">Select Script</TabsTrigger>
          <TabsTrigger value="generate">Generate Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Create Your AI Avatar</CardTitle>
              <CardDescription>
                Upload your image and voice sample to create a personalized AI avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar-name">Avatar Name</Label>
                <Input 
                  id="avatar-name" 
                  value={avatarName} 
                  onChange={(e) => setAvatarName(e.target.value)} 
                  placeholder="Dr. Scott Ighavongbe-Patrick"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar-image">Upload Image</Label>
                <div className="flex items-centre gap-4">
                  <Input 
                    id="avatar-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                  {uploadedImage && (
                    <div className="h-12 w-12 rounded-full bg-grey-200 overflow-hidden">
                      <img 
                        src={URL.createObjectURL(uploadedImage)} 
                        alt="Avatar preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice-sample">Upload Voice Sample (Optional)</Label>
                <Input 
                  id="voice-sample" 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleVoiceUpload}
                />
                {uploadedVoice && (
                  <audio controls className="w-full mt-2">
                    <source src={URL.createObjectURL(uploadedVoice)} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('script')}>
                Skip
              </Button>
              <Button onClick={createAvatar} disabled={loading || !uploadedImage}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Avatar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="script">
          <Card>
            <CardHeader>
              <CardTitle>Select or Upload Script</CardTitle>
              <CardDescription>
                Choose from existing scripts or create your own
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="script-select">Select Existing Script</Label>
                <Select 
                  value={selectedScript} 
                  onValueChange={handleScriptSelect}
                >
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
              
              <div className="space-y-2">
                <Label htmlFor="script-title">Script Title</Label>
                <Input 
                  id="script-title" 
                  value={scriptTitle} 
                  onChange={(e) => setScriptTitle(e.target.value)} 
                  placeholder="Enter script title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="script-content">Script Content</Label>
                <Textarea 
                  id="script-content" 
                  value={scriptContent} 
                  onChange={(e) => setScriptContent(e.target.value)} 
                  placeholder="Enter script content"
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('upload')}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={uploadScript} disabled={loading || !scriptTitle || !scriptContent}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Script
                    </>
                  )}
                </Button>
                <Button onClick={() => setActiveTab('generate')} disabled={!selectedScript}>
                  Continue
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Avatar Video</CardTitle>
              <CardDescription>
                Configure and generate your AI avatar video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {avatars.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="avatar-select">Select Avatar</Label>
                  <Select 
                    value={selectedAvatar} 
                    onValueChange={setSelectedAvatar}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an avatar" />
                    </SelectTrigger>
                    <SelectContent>
                      {avatars.map(avatar => (
                        <SelectItem key={avatar.id} value={avatar.id}>
                          {avatar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {voices.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Select Voice</Label>
                  <Select 
                    value={selectedVoice} 
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="video-title">Video Title</Label>
                <Input 
                  id="video-title" 
                  value={videoTitle} 
                  onChange={(e) => setVideoTitle(e.target.value)} 
                  placeholder="Enter video title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-description">Video Description (Optional)</Label>
                <Textarea 
                  id="video-description" 
                  value={videoDescription} 
                  onChange={(e) => setVideoDescription(e.target.value)} 
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>
              
              {loading && (
                <div className="space-y-2">
                  <Label>Generation Progress</Label>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-grey-500 text-centre">{progress}% complete</p>
                </div>
              )}
              
              {error && (
                <Alert variant="error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && generatedVideoId && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Video generated successfully! View it in the <a href="/ai-avatar-videos/view/{generatedVideoId}" className="font-medium underline">video library</a>.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('script')}>
                Back
              </Button>
              <Button 
                onClick={generateVideo} 
                disabled={loading || !selectedAvatar || !selectedScript || !videoTitle}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeyGenVideoGeneration;
