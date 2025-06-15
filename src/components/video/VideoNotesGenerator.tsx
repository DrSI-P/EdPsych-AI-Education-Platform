"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Copy, Download, Save, FileText, List, CheckSquare, Map, HelpCircle, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { Markdown } from '@/components/ui/markdown';

interface VideoNotesGeneratorProps {
  videoId: string;
  videoTitle: string;
}

type NoteType = 'summary' | 'key-points' | 'revision-guide' | 'concept-map' | 'questions' | 'custom';

interface NotesOptions {
  focusAreas: string[];
  detailLevel: 'brief' | 'standard' | 'detailed';
  includeTimestamps: boolean;
  includeExamples: boolean;
  includeDefinitions: boolean;
  format: 'paragraphs' | 'bullet-points' | 'numbered-list' | 'outline';
  tone: 'academic' | 'conversational' | 'simplified';
  customPrompt: string;
}

const defaultOptions: NotesOptions = {
  focusAreas: [],
  detailLevel: 'standard',
  includeTimestamps: false,
  includeExamples: true,
  includeDefinitions: true,
  format: 'paragraphs',
  tone: 'academic',
  customPrompt: '',
};

export default function VideoNotesGenerator({ videoId, videoTitle }: VideoNotesGeneratorProps) {
  const [activeTab, setActiveTab] = useState<NoteType>('summary');
  const [options, setOptions] = useState<NotesOptions>(defaultOptions);
  const [notes, setNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [focusAreaInput, setFocusAreaInput] = useState('');
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; type: NoteType; content: string; date: Date }>>([]);
  const { showToast } = useToast();

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(`video-notes-${videoId}`);
    if (saved) {
      try {
        setSavedNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, [videoId]);

  // Save notes to localStorage when savedNotes changes
  useEffect(() => {
    if (savedNotes.length > 0) {
      localStorage.setItem(`video-notes-${videoId}`, JSON.stringify(savedNotes));
    }
  }, [savedNotes, videoId]);

  const generateNotes = async () => {
    setIsGenerating(true);
    setNotes('');

    try {
      const response = await fetch('/api/video/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          noteType: activeTab,
          options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate notes');
      }

      const data = await response.json();
      setNotes(data.notes);
      showToast({
        message: `${activeTab.replace('-', ' ')} notes have been generated successfully.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error generating notes:', error);
      showToast({
        message: error instanceof Error ? error.message : 'Failed to generate notes',
        type: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCurrentNotes = (): void => {
    if (!notes) {
      showToast({
        message: 'Please generate notes first before saving.',
        type: 'error'
      });
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      type: activeTab,
      content: notes,
      date: new Date(),
    };

    setSavedNotes((prev) => [newNote, ...prev]);
    showToast({
      message: 'Your notes have been saved successfully.',
      type: 'success'
    });
  };

  const copyToClipboard = (): void => {
    if (!notes) {
      showToast({
        message: 'Please generate notes first before copying.',
        type: 'error'
      });
      return;
    }

    navigator.clipboard.writeText(notes);
    showToast({
      message: 'Notes have been copied to your clipboard.',
      type: 'success'
    });
  };

  const downloadNotes = (): void => {
    if (!notes) {
      showToast({
        message: 'Please generate notes first before downloading.',
        type: 'error'
      });
      return;
    }

    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle.replace(/\s+/g, '-').toLowerCase()}-${activeTab}-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      message: 'Your notes have been downloaded as a Markdown file.',
      type: 'success'
    });
  };

  const addFocusArea = (): void => {
    if (focusAreaInput.trim()) {
      setOptions((prev) => ({
        ...prev,
        focusAreas: [...prev.focusAreas, focusAreaInput.trim()],
      }));
      setFocusAreaInput('');
    }
  };

  const removeFocusArea = (area: string) => {
    setOptions((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((a) => a !== area),
    }));
  };

  const loadSavedNote = (noteId: string) => {
    const note = savedNotes.find((n) => n.id === noteId);
    if (note) {
      setActiveTab(note.type);
      setNotes(note.content);
      showToast({
        message: `${note.type.replace('-', ' ')} notes from ${new Date(note.date).toLocaleDateString()} have been loaded.`,
        type: 'info'
      });
    }
  };

  const deleteSavedNote = (noteId: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast({
      message: 'The saved notes have been deleted.',
      type: 'info'
    });
  };

  const getTabIcon = (tab: NoteType) => {
    switch (tab) {
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'key-points':
        return <List className="h-4 w-4" />;
      case 'revision-guide':
        return <BookOpen className="h-4 w-4" />;
      case 'concept-map':
        return <Map className="h-4 w-4" />;
      case 'questions':
        return <HelpCircle className="h-4 w-4" />;
      case 'custom':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Notes Generator</CardTitle>
        <CardDescription>
          Generate AI-powered notes from this video to enhance your learning experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NoteType)}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="summary" className="flex items-center gap-1">
              {getTabIcon('summary')} Summary
            </TabsTrigger>
            <TabsTrigger value="key-points" className="flex items-center gap-1">
              {getTabIcon('key-points')} Key Points
            </TabsTrigger>
            <TabsTrigger value="revision-guide" className="flex items-center gap-1">
              {getTabIcon('revision-guide')} Revision
            </TabsTrigger>
            <TabsTrigger value="concept-map" className="flex items-center gap-1">
              {getTabIcon('concept-map')} Concept Map
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-1">
              {getTabIcon('questions')} Questions
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-1">
              {getTabIcon('custom')} Custom
            </TabsTrigger>
          </TabsList>

          {/* Options Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-md bg-muted/20">
            <div>
              <h3 className="text-sm font-medium mb-2">Note Options</h3>
              
              <div className="space-y-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="detailLevel">Detail Level</Label>
                  <Select
                    value={options.detailLevel}
                    onValueChange={(value) => setOptions((prev) => ({ ...prev, detailLevel: value as any }))}
                  >
                    <SelectTrigger id="detailLevel">
                      <SelectValue placeholder="Select detail level" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="format">Format</Label>
                  <Select
                    value={options.format}
                    onValueChange={(value) => setOptions((prev) => ({ ...prev, format: value as any }))}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="bullet-points">Bullet Points</SelectItem>
                      <SelectItem value="numbered-list">Numbered List</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={options.tone}
                    onValueChange={(value) => setOptions((prev) => ({ ...prev, tone: value as any }))}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="simplified">Simplified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Additional Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTimestamps"
                    checked={options.includeTimestamps}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, includeTimestamps: checked === true }))
                    }
                  />
                  <Label htmlFor="includeTimestamps">Include Timestamps</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeExamples"
                    checked={options.includeExamples}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, includeExamples: checked === true }))
                    }
                  />
                  <Label htmlFor="includeExamples">Include Examples</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDefinitions"
                    checked={options.includeDefinitions}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, includeDefinitions: checked === true }))
                    }
                  />
                  <Label htmlFor="includeDefinitions">Include Definitions</Label>
                </div>

                {activeTab === 'custom' && (
                  <div className="flex flex-col space-y-1.5 mt-3">
                    <Label htmlFor="customPrompt">Custom Instructions</Label>
                    <Textarea
                      id="customPrompt"
                      placeholder="Add specific instructions for the AI..."
                      value={options.customPrompt}
                      onChange={(e: any) => setOptions((prev) => ({ ...prev, customPrompt: e.target.value }))}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="focusAreas">Focus Areas (Optional)</Label>
                <div className="flex space-x-2">
                  <Textarea
                    id="focusAreas"
                    placeholder="Add specific topics to focus on..."
                    value={focusAreaInput}
                    onChange={(e: any) => setFocusAreaInput(e.target.value)}
                    className="resize-none"
                    rows={1}
                  />
                  <Button type="button" onClick={addFocusArea} variant="outline">
                    Add
                  </Button>
                </div>
                {options.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.focusAreas.map((area) => (
                      <div
                        key={area}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => removeFocusArea(area)}
                          className="text-primary hover:text-primary/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Button onClick={generateNotes} disabled={isGenerating} className="w-full md:w-auto">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Notes...
                </>
              ) : (
                'Generate Notes'
              )}
            </Button>
          </div>

          {/* Notes Display */}
          {notes ? (
            <div className="border rounded-md p-4 bg-card">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown content={notes} />
              </div>
            </div>
          ) : (
            <div className="border rounded-md p-8 bg-muted/20 flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Notes Generated Yet</h3>
              <p className="text-sm text-muted-foreground">
                Configure your options and click &quot;Generate Notes&quot; to create AI-powered notes from this video.
              </p>
            </div>
          )}

          {/* Saved Notes */}
          {savedNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Saved Notes</h3>
              <div className="space-y-2">
                {savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                  >
                    <div>
                      <span className="font-medium capitalize">{note.type.replace('-', ' ')}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadSavedNote(note.id)}
                        title="Load notes"
                      >
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedNote(note.id)}
                        title="Delete notes"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
      
      {notes && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadNotes}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={saveCurrentNotes}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}