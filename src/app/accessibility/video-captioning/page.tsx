'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

/**
 * Video Captioning System Component
 * Provides tools for adding, editing, and managing captions for video content
 */
export default function VideoCaptioningSystem() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('upload');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [captionLanguage, setCaptionLanguage] = useState<string>('en-GB');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(false);
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['en-GB']);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Caption segment interface
  interface CaptionSegment {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
    speakerName?: string;
  }
  
  // Language options
  const languageOptions = [
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'cy-GB', label: 'Welsh' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pl-PL', label: 'Polish' },
    { value: 'ur-PK', label: 'Urdu' },
    { value: 'bn-BD', label: 'Bengali' },
    { value: 'ar-SA', label: 'Arabic' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
  ];
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setCaptions([]);
      setCurrentTab('generate');
    }
  };
  
  // Handle URL input
  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (videoUrl) {
      setCaptions([]);
      setCurrentTab('generate');
    }
  };
  
  // Generate captions
  const generateCaptions = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate caption generation with progress updates
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationProgress(Math.floor((step / totalSteps) * 100));
    }
    
    // Generate mock captions
    const mockCaptions: CaptionSegment[] = [
      {
        id: '1',
        startTime: 0,
        endTime: 3.5,
        text: 'Welcome to our lesson on photosynthesis.',
        speakerName: 'Teacher',
      },
      {
        id: '2',
        startTime: 4,
        endTime: 7.2,
        text: 'Photosynthesis is the process used by plants to convert light energy into chemical energy.',
        speakerName: 'Teacher',
      },
      {
        id: '3',
        startTime: 7.5,
        endTime: 12,
        text: 'This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water.',
        speakerName: 'Teacher',
      },
      {
        id: '4',
        startTime: 12.5,
        endTime: 16,
        text: 'Can anyone tell me what the main inputs for photosynthesis are?',
        speakerName: 'Teacher',
      },
      {
        id: '5',
        startTime: 16.5,
        endTime: 18,
        text: 'Carbon dioxide, water, and sunlight!',
        speakerName: 'Student',
      },
      {
        id: '6',
        startTime: 18.5,
        endTime: 22,
        text: 'Excellent! Those are the three main ingredients plants need for photosynthesis.',
        speakerName: 'Teacher',
      },
    ];
    
    setCaptions(mockCaptions);
    setIsGenerating(false);
    setCurrentTab('edit');
  };
  
  // Format time (seconds to MM:SS.ms)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };
  
  // Parse time (MM:SS.ms to seconds)
  const parseTime = (timeString: string): number => {
    const [minutesSeconds, milliseconds] = timeString.split('.');
    const [minutes, seconds] = minutesSeconds.split(':');
    
    return (
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      (milliseconds ? parseInt(milliseconds) / 1000 : 0)
    );
  };
  
  // Add new caption segment
  const addCaptionSegment = () => {
    const lastCaption = captions[captions.length - 1];
    const newStartTime = lastCaption ? lastCaption.endTime + 0.5 : 0;
    const newEndTime = newStartTime + 3;
    
    const newSegment: CaptionSegment = {
      id: Date.now().toString(),
      startTime: newStartTime,
      endTime: newEndTime,
      text: '',
      speakerName: '',
    };
    
    setCaptions([...captions, newSegment]);
    setEditingIndex(captions.length);
  };
  
  // Update caption segment
  const updateCaptionSegment = (index: number, field: keyof CaptionSegment, value: string | number) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index] = {
      ...updatedCaptions[index],
      [field]: value,
    };
    setCaptions(updatedCaptions);
  };
  
  // Delete caption segment
  const deleteCaptionSegment = (index: number) => {
    const updatedCaptions = captions.filter((_, i) => i !== index);
    setCaptions(updatedCaptions);
    if (editingIndex === index) {
      setEditingIndex(-1);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };
  
  // Export captions
  const exportCaptions = (format: 'vtt' | 'srt' | 'json') => {
    let content = '';
    let filename = `captions_${new Date().toISOString().slice(0, 10)}`;
    
    if (format === 'vtt') {
      content = 'WEBVTT\n\n';
      captions.forEach((caption, index) => {
        content += `${index + 1}\n`;
        content += `${formatTime(caption.startTime)} --> ${formatTime(caption.endTime)}\n`;
        if (caption.speakerName) {
          content += `<v ${caption.speakerName}>${caption.text}</v>\n\n`;
        } else {
          content += `${caption.text}\n\n`;
        }
      });
      filename += '.vtt';
    } else if (format === 'srt') {
      captions.forEach((caption, index) => {
        content += `${index + 1}\n`;
        content += `${formatTime(caption.startTime).replace('.', ',')} --> ${formatTime(caption.endTime).replace('.', ',')}\n`;
        if (caption.speakerName) {
          content += `${caption.speakerName}: ${caption.text}\n\n`;
        } else {
          content += `${caption.text}\n\n`;
        }
      });
      filename += '.srt';
    } else if (format === 'json') {
      content = JSON.stringify(captions, null, 2);
      filename += '.json';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Seek video to specific time
  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (videoRef.current.paused) {
        videoRef.current.play();
      }
    }
  };
  
  // Get current caption based on video time
  const getCurrentCaption = (): CaptionSegment | null => {
    if (!videoRef.current) return null;
    
    const currentTime = videoRef.current.currentTime;
    return captions.find(
      caption => currentTime >= caption.startTime && currentTime <= caption.endTime
    ) || null;
  };
  
  // Update caption display during video playback
  useEffect(() => {
    if (!videoRef.current || !previewMode) return;
    
    const updateCaptionDisplay = () => {
      const currentCaption = getCurrentCaption();
      const captionDisplay = document.getElementById('caption-display');
      
      if (captionDisplay) {
        if (currentCaption) {
          captionDisplay.textContent = currentCaption.text;
          captionDisplay.style.display = 'block';
        } else {
          captionDisplay.style.display = 'none';
        }
      }
    };
    
    const videoElement = videoRef.current;
    videoElement.addEventListener('timeupdate', updateCaptionDisplay);
    
    return () => {
      videoElement.removeEventListener('timeupdate', updateCaptionDisplay);
    };
  }, [captions, previewMode]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Video Captioning System</h1>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="generate" disabled={!videoUrl}>Generate Captions</TabsTrigger>
          <TabsTrigger value="edit" disabled={!captions.length}>Edit Captions</TabsTrigger>
          <TabsTrigger value="preview" disabled={!captions.length}>Preview & Export</TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload from Computer</h3>
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileUpload}
                  />
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    MP4, MOV, or WebM up to 500MB
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Enter Video URL</h3>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input
                      id="video-url"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={!videoUrl}>
                    Use This Video
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Captions</h2>
            
            <div className="mb-6">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="caption-language">Primary Caption Language</Label>
                  <Select
                    value={captionLanguage}
                    onValueChange={setCaptionLanguage}
                  >
                    <SelectTrigger id="caption-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-translate"
                    checked={autoTranslate}
                    onCheckedChange={setAutoTranslate}
                  />
                  <Label htmlFor="auto-translate">
                    Auto-translate to additional languages
                  </Label>
                </div>
                
                {autoTranslate && (
                  <div>
                    <Label htmlFor="target-languages">Target Languages</Label>
                    <Select
                      value={targetLanguages[0]}
                      onValueChange={(value) => setTargetLanguages([value])}
                    >
                      <SelectTrigger id="target-languages">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions
                          .filter((option) => option.value !== captionLanguage)
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Multi-language selection coming soon
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="speaker-identification">Speaker Identification</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger id="speaker-identification">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="caption-style">Caption Style</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="caption-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="simplified">Simplified Language</SelectItem>
                      <SelectItem value="educational">Educational (Key Terms Highlighted)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex justify-between mb-1">
                  <span>Generating captions...</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} />
                <p className="text-sm text-gray-500">
                  This may take a few minutes depending on video length.
                </p>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setCurrentTab('upload')}>
                  Back
                </Button>
                <Button onClick={generateCaptions}>
                  Generate Captions
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Edit Tab */}
        <TabsContent value="edit" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Captions</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg mb-4"
                  style={{ maxHeight: '300px' }}
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Caption Segments</h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {captions.map((caption, index) => (
                      <div
                        key={caption.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          editingIndex === index
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setEditingIndex(index);
                          seekToTime(caption.startTime);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium">
                              {formatTime(caption.startTime)} - {formatTime(caption.endTime)}
                            </div>
                            {caption.speakerName && (
                              <div className="text-xs text-gray-500">
                                Speaker: {caption.speakerName}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCaptionSegment(index);
                            }}
                          >
                            <svg
                              className="h-4 w-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-sm mt-1 line-clamp-2">{caption.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={addCaptionSegment} className="w-full">
                    Add Caption Segment
                  </Button>
                </div>
              </div>
              
              <div>
                {editingIndex >= 0 && editingIndex < captions.length && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Edit Segment</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="text"
                          value={formatTime(captions[editingIndex].startTime)}
                          onChange={(e) => {
                            try {
                              const time = parseTime(e.target.value);
                              updateCaptionSegment(editingIndex, 'startTime', time);
                            } catch (error) {
                              // Invalid time format
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="text"
                          value={formatTime(captions[editingIndex].endTime)}
                          onChange={(e) => {
                            try {
                              const time = parseTime(e.target.value);
                              updateCaptionSegment(editingIndex, 'endTime', time);
                            } catch (error) {
                              // Invalid time format
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="speaker-name">Speaker Name (Optional)</Label>
                      <Input
                        id="speaker-name"
                        type="text"
                        value={captions[editingIndex].speakerName || ''}
                        onChange={(e) =>
                          updateCaptionSegment(editingIndex, 'speakerName', e.target.value)
                        }
                        placeholder="e.g., Teacher, Student 1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="caption-text">Caption Text</Label>
                      <Textarea
                        id="caption-text"
                        value={captions[editingIndex].text}
                        onChange={(e) =>
                          updateCaptionSegment(editingIndex, 'text', e.target.value)
                        }
                        rows={4}
                        placeholder="Enter caption text here..."
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => seekToTime(captions[editingIndex].startTime)}
                      >
                        Play From Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (editingIndex > 0) {
                            setEditingIndex(editingIndex - 1);
                            seekToTime(captions[editingIndex - 1].startTime);
                          }
                        }}
                        disabled={editingIndex <= 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (editingIndex < captions.length - 1) {
                            setEditingIndex(editingIndex + 1);
                            seekToTime(captions[editingIndex + 1].startTime);
                          }
                        }}
                        disabled={editingIndex >= captions.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                
                {editingIndex === -1 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      <p className="text-gray-500 mb-4">
                        Select a caption segment to edit or add a new one.
                      </p>
                      <Button onClick={addCaptionSegment}>
                        Add Caption Segment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setCurrentTab('generate')}>
                Back
              </Button>
              <Button onClick={() => setCurrentTab('preview')}>
                Preview & Export
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preview & Export</h2>
            
            <div className="mb-6 relative">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '400px' }}
              />
              
              {previewMode && (
                <div
                  id="caption-display"
                  className="absolute bottom-16 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center"
                  style={{ display: 'none' }}
                ></div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <Switch
                id="preview-mode"
                checked={previewMode}
                onCheckedChange={setPreviewMode}
              />
              <Label htmlFor="preview-mode">
                Enable caption preview
              </Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Caption Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Total Segments:</span>
                    <span className="font-medium">{captions.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Duration:</span>
                    <span className="font-medium">
                      {formatTime(
                        captions.length > 0
                          ? captions[captions.length - 1].endTime
                          : 0
                      )}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Primary Language:</span>
                    <span className="font-medium">
                      {languageOptions.find(l => l.value === captionLanguage)?.label || captionLanguage}
                    </span>
                  </li>
                  {autoTranslate && (
                    <li className="flex justify-between">
                      <span>Additional Languages:</span>
                      <span className="font-medium">
                        {targetLanguages
                          .map(
                            lang =>
                              languageOptions.find(l => l.value === lang)?.label || lang
                          )
                          .join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => exportCaptions('vtt')}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export as WebVTT (.vtt)
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => exportCaptions('srt')}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export as SubRip (.srt)
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => exportCaptions('json')}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export as JSON
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Caption Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {captions.map((caption, index) => (
                  <div key={caption.id} className="mb-4">
                    <div className="text-sm text-gray-500">
                      {index + 1} • {formatTime(caption.startTime)} → {formatTime(caption.endTime)}
                    </div>
                    {caption.speakerName && (
                      <div className="text-sm font-medium">{caption.speakerName}:</div>
                    )}
                    <p className="text-base">{caption.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setCurrentTab('edit')}>
                Back to Editing
              </Button>
              <Button onClick={() => alert('Captions saved successfully!')}>
                Save Captions
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
