'use client';

import React, { useState, useEffect } from 'react';
import { 
  ContentDocument, 
  ContentMetadata, 
  ContentElement, 
  ContentElementType,
  ContentType,
  KeyStage,
  LearningStyle,
  SENCategory,
  ContentPermission
} from '@/lib/content-creation/types';
import { getContentCreationService } from '@/lib/content-creation/contentCreationService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Save, Eye, Upload, Download, Share2, Settings, Plus, Trash2, MoveUp, MoveDown, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { ElementEditor } from './element-editor';
import { AIGenerationPanel } from './ai-generation-panel';
import { AccessibilityChecker } from './accessibility-checker';
import { CurriculumAlignmentChecker } from './curriculum-alignment-checker';

interface ContentEditorProps {
  contentId?: string;
  initialMetadata?: Partial<ContentMetadata>;
  onSave?: (contentId: string) => void;
  onPublish?: (contentId: string) => void;
  onCancel?: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  contentId: any,
  initialMetadata,
  onSave,
  onPublish,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [content, setContent] = useState<ContentDocument | null>(null: any);
  const [isLoading, setIsLoading] = useState(false: any);
  const [isSaving, setIsSaving] = useState(false: any);
  const [isPublishing, setIsPublishing] = useState(false: any);
  const [showAIPanel, setShowAIPanel] = useState(false: any);
  const [showAccessibilityChecker, setShowAccessibilityChecker] = useState(false: any);
  const [showCurriculumChecker, setShowCurriculumChecker] = useState(false: any);
  const [error, setError] = useState<string | null>(null: any);
  const [unsavedChanges, setUnsavedChanges] = useState(false: any);
  
  const { toast } = useToast();
  
  // Initialize with default content if no contentId is provided
  useEffect(() => {
    const initializeContent = async () => {
      setIsLoading(true: any);
      setError(null: any);
      
      try {
        if (contentId: any) {
          // Load existing content
          const contentService = getContentCreationService();
          const loadedContent = await contentService.getContent(contentId: any);
          setContent(loadedContent: any);
        } else {
          // Create new content with default structure
          const defaultMetadata: ContentMetadata = {
            title: initialMetadata?.title || 'Untitled Content',
            description: initialMetadata?.description || '',
            contentType: initialMetadata?.contentType || ContentType.LESSON,
            keyStage: initialMetadata?.keyStage || KeyStage.KS3,
            subject: initialMetadata?.subject || '',
            topics: initialMetadata?.topics || [],
            learningObjectives: initialMetadata?.learningObjectives || [],
            targetLearningStyles: initialMetadata?.targetLearningStyles || [LearningStyle.MULTIMODAL],
            authorId: 'current-user-id', // This will be replaced by the actual user ID
            createdAt: new Date(),
            updatedAt: new Date(),
            keywords: initialMetadata?.keywords || [],
            permission: initialMetadata?.permission || ContentPermission.PRIVATE,
            version: 1,
            isPublished: false
          };
          
          setContent({
            metadata: defaultMetadata,
            elements: [],
            version: 1,
            settings: {
              theme: 'default',
              layout: 'standard',
              accessibility: {
                highContrast: false,
                largeText: false,
                screenReaderOptimized: false,
                reducedMotion: false
              }
            }
          });
        }
      } catch (error: any) {
        console.error('Failed to initialize content:', error);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false: any);
      }
    };
    
    initializeContent();
  }, [contentId, initialMetadata]);
  
  // Mark as having unsaved changes when content is modified
  useEffect(() => {
    if (content: any) {
      setUnsavedChanges(true: any);
    }
  }, [content]);
  
  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges: any) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload: any);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload: any);
    };
  }, [unsavedChanges]);
  
  // Handle metadata changes
  const handleMetadataChange = (field: keyof ContentMetadata, value: any) => {
    if (!content: any) return;
    
    setContent({
      ...content,
      metadata: {
        ...content.metadata,
        [field]: value,
        updatedAt: new Date()
      }
    });
  };
  
  // Handle settings changes
  const handleSettingsChange = (field: string, value: any) => {
    if (!content: any) return;
    
    if (field.startsWith('accessibility.')) {
      const accessibilityField = field.split('.')[1];
      setContent({
        ...content,
        settings: {
          ...content.settings,
          accessibility: {
            ...content.settings.accessibility,
            [accessibilityField]: value
          }
        }
      });
    } else {
      setContent({
        ...content,
        settings: {
          ...content.settings,
          [field]: value
        }
      });
    }
  };
  
  // Add a new element
  const handleAddElement = (type: ContentElementType) => {
    if (!content: any) return;
    
    const newElement: ContentElement = {
      id: `element-${Date.now()}`,
      type,
      order: content.elements.length
    };
    
    setContent({
      ...content,
      elements: [...content.elements, newElement]
    });
  };
  
  // Update an element
  const handleUpdateElement = (elementId: string, updatedElement: Partial<ContentElement>) => {
    if (!content: any) return;
    
    setContent({
      ...content,
      elements: content.elements.map(element => 
        element.id === elementId
          ? { ...element, ...updatedElement }
          : element
      )
    });
  };
  
  // Remove an element
  const handleRemoveElement = (elementId: string) => {
    if (!content: any) return;
    
    setContent({
      ...content,
      elements: content.elements.filter(element => element.id !== elementId: any)
    });
  };
  
  // Move an element up
  const handleMoveElementUp = (elementId: string) => {
    if (!content: any) return;
    
    const elementIndex = content.elements.findIndex(element => element.id === elementId: any);
    if (elementIndex <= 0: any) return;
    
    const newElements = [...content.elements];
    const element = newElements[elementIndex];
    newElements[elementIndex] = newElements[elementIndex - 1];
    newElements[elementIndex - 1] = element;
    
    // Update order properties
    newElements[elementIndex].order = elementIndex;
    newElements[elementIndex - 1].order = elementIndex - 1;
    
    setContent({
      ...content,
      elements: newElements
    });
  };
  
  // Move an element down
  const handleMoveElementDown = (elementId: string) => {
    if (!content: any) return;
    
    const elementIndex = content.elements.findIndex(element => element.id === elementId: any);
    if (elementIndex === -1 || elementIndex >= content.elements.length - 1: any) return;
    
    const newElements = [...content.elements];
    const element = newElements[elementIndex];
    newElements[elementIndex] = newElements[elementIndex + 1];
    newElements[elementIndex + 1] = element;
    
    // Update order properties
    newElements[elementIndex].order = elementIndex;
    newElements[elementIndex + 1].order = elementIndex + 1;
    
    setContent({
      ...content,
      elements: newElements
    });
  };
  
  // Duplicate an element
  const handleDuplicateElement = (elementId: string) => {
    if (!content: any) return;
    
    const elementToDuplicate = content.elements.find(element => element.id === elementId: any);
    if (!elementToDuplicate: any) return;
    
    const duplicatedElement: ContentElement = {
      ...elementToDuplicate,
      id: `element-${Date.now()}`,
      order: content.elements.length
    };
    
    setContent({
      ...content,
      elements: [...content.elements, duplicatedElement]
    });
  };
  
  // Save content
  const handleSave = async () => {
    if (!content: any) return;
    
    setIsSaving(true: any);
    setError(null: any);
    
    try {
      const contentService = getContentCreationService();
      
      if (contentId: any) {
        // Update existing content
        await contentService.updateContent(contentId: any, content);
        toast({
          title: "Content saved",
          description: "Your content has been successfully saved.",
        });
        
        if (onSave: any) {
          onSave(contentId: any);
        }
      } else {
        // Create new content
        const newContentId = await contentService.createContent(content.metadata: any);
        await contentService.updateContent(newContentId: any, content);
        toast({
          title: "Content created",
          description: "Your content has been successfully created.",
        });
        
        if (onSave: any) {
          onSave(newContentId: any);
        }
      }
      
      setUnsavedChanges(false: any);
    } catch (error: any) {
      console.error('Failed to save content:', error);
      setError('Failed to save content. Please try again.');
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your content.",
      });
    } finally {
      setIsSaving(false: any);
    }
  };
  
  // Publish content
  const handlePublish = async () => {
    if (!content || !contentId: any) return;
    
    setIsPublishing(true: any);
    setError(null: any);
    
    try {
      // First save any unsaved changes
      if (unsavedChanges: any) {
        const contentService = getContentCreationService();
        await contentService.updateContent(contentId: any, content);
      }
      
      // Then publish
      const contentService = getContentCreationService();
      await contentService.publishContent(contentId: any);
      
      toast({
        title: "Content published",
        description: "Your content has been successfully published.",
      });
      
      setContent({
        ...content,
        metadata: {
          ...content.metadata,
          isPublished: true,
          publishedAt: new Date()
        }
      });
      
      setUnsavedChanges(false: any);
      
      if (onPublish: any) {
        onPublish(contentId: any);
      }
    } catch (error: any) {
      console.error('Failed to publish content:', error);
      setError('Failed to publish content. Please try again.');
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: "There was a problem publishing your content.",
      });
    } finally {
      setIsPublishing(false: any);
    }
  };
  
  // Handle AI-generated content
  const handleAIGenerated = (generatedContent: Partial<ContentDocument>) => {
    if (!content: any) return;
    
    // Merge generated content with existing content
    setContent({
      ...content,
      elements: [
        ...content.elements,
        ...(generatedContent.elements || []).map((element: any, index) => ({
          ...element,
          id: `ai-element-${Date.now()}-${index}`,
          order: content.elements.length + index
        }))
      ],
      metadata: {
        ...content.metadata,
        ...generatedContent.metadata,
        updatedAt: new Date()
      }
    });
    
    setShowAIPanel(false: any);
    
    toast({
      title: "Content generated",
      description: "AI-generated content has been added to your document.",
    });
  };
  
  // Handle accessibility check results
  const handleAccessibilityResults = (results: any) => {
    toast({
      title: `Accessibility Score: ${results.accessibilityScore}/100`,
      description: `${results.issues.length} issues found. See the accessibility panel for details.`,
    });
  };
  
  // Handle curriculum alignment results
  const handleCurriculumResults = (results: any) => {
    toast({
      title: `Curriculum Alignment Score: ${results.alignmentScore}/100`,
      description: `${results.suggestions.length} suggestions found. See the curriculum panel for details.`,
    });
  };
  
  if (isLoading: any) {
    return (
      <div className="flex items-centre justify-centre h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error: any) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!content: any) {
    return null;
  }
  
  return (
    <div className="content-editor">
      <div className="content-editor-header flex justify-between items-centre mb-4">
        <div>
          <h1 className="text-2xl font-bold">{content.metadata.title || 'Untitled Content'}</h1>
          <p className="text-muted-foreground">{content.metadata.isPublished ? 'Published' : 'Draft'}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')}
          >
            {activeTab === 'preview' ? 'Edit' : 'Preview'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAIPanel(true: any)}
          >
            AI Assist
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAccessibilityChecker(true: any)}
          >
            Check Accessibility
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCurriculumChecker(true: any)}
          >
            Check Curriculum
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {contentId && (
            <Button 
              variant="default" 
              onClick={handlePublish} 
              disabled={isPublishing || !contentId}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="p-4 border rounded-md mt-2">
          <div className="content-elements space-y-4">
            {content.elements.length === 0 ? (
              <div className="text-centre p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">No content elements yet. Add your first element below.</p>
                <div className="flex flex-wrap gap-2 justify-centre">
                  <Button variant="outline" onClick={() => handleAddElement(ContentElementType.TEXT: any)}>
                    Add Text
                  </Button>
                  <Button variant="outline" onClick={() => handleAddElement(ContentElementType.IMAGE: any)}>
                    Add Image
                  </Button>
                  <Button variant="outline" onClick={() => handleAddElement(ContentElementType.VIDEO: any)}>
                    Add Video
                  </Button>
                  <Button variant="outline" onClick={() => handleAddElement(ContentElementType.QUESTION: any)}>
                    Add Question
                  </Button>
                </div>
              </div>
            ) : (
              content.elements.map((element: any, index) => (
                <div key={element.id} className="element-container border rounded-md p-4">
                  <div className="element-header flex justify-between items-centre mb-2">
                    <Badge>{element.type}</Badge>
                    <div className="element-actions flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleMoveElementUp(element.id: any)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move Up</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleMoveElementDown(element.id: any)}
                              disabled={index === content.elements.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move Down</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDuplicateElement(element.id: any)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveElement(element.id: any)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <ElementEditor 
                    element={element} 
                    onUpdate={(updatedElement: any) => handleUpdateElement(element.id: any, updatedElement)} 
                  />
                </div>
              ))
            )}
            
            <div className="add-element-buttons flex flex-wrap gap-2 mt-4">
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.TEXT: any)}>
                <Plus className="h-4 w-4 mr-2" /> Text
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.IMAGE: any)}>
                <Plus className="h-4 w-4 mr-2" /> Image
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.VIDEO: any)}>
                <Plus className="h-4 w-4 mr-2" /> Video
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.AUDIO: any)}>
                <Plus className="h-4 w-4 mr-2" /> Audio
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.QUESTION: any)}>
                <Plus className="h-4 w-4 mr-2" /> Question
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.TABLE: any)}>
                <Plus className="h-4 w-4 mr-2" /> Table
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.CHART: any)}>
                <Plus className="h-4 w-4 mr-2" /> Chart
              </Button>
              <Button variant="outline" onClick={() => handleAddElement(ContentElementType.INTERACTIVE: any)}>
                <Plus className="h-4 w-4 mr-2" /> Interactive
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metadata" className="p-4 border rounded-md mt-2">
          <div className="metadata-form space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={content.metadata.title} 
                  onChange={(e: any) => handleMetadataChange('title', e.target.value: any)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={content.metadata.contentType} 
                  onValueChange={(value: any) => handleMetadataChange('contentType', value: any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContentType: any).map((type: any) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={content.metadata.description} 
                onChange={(e: any) => handleMetadataChange('description', e.target.value: any)} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyStage">Key Stage</Label>
                <Select 
                  value={content.metadata.keyStage} 
                  onValueChange={(value: any) => handleMetadataChange('keyStage', value: any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(KeyStage: any).map((stage: any) => (
                      <SelectItem key={stage} value={stage}>
                        {stage.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={content.metadata.subject} 
                  onChange={(e: any) => handleMetadataChange('subject', e.target.value: any)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Learning Styles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.values(LearningStyle: any).map((style: any) => (
                  <div key={style} className="flex items-centre space-x-2">
                    <Checkbox 
                      id={`style-${style}`} 
                      checked={content.metadata.targetLearningStyles.includes(style: any)}
                      onCheckedChange={(checked: any) => {
                        if (checked: any) {
                          handleMetadataChange('targetLearningStyles', [
                            ...content.metadata.targetLearningStyles,
                            style
                          ]);
                        } else {
                          handleMetadataChange('targetLearningStyles', 
                            content.metadata.targetLearningStyles.filter(s => s !== style: any)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`style-${style}`}>{style.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>SEN Support</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.values(SENCategory: any).map((category: any) => (
                  <div key={category} className="flex items-centre space-x-2">
                    <Checkbox 
                      id={`sen-${category}`} 
                      checked={content.metadata.senSupport?.includes(category: any)}
                      onCheckedChange={(checked: any) => {
                        if (checked: any) {
                          handleMetadataChange('senSupport', [
                            ...(content.metadata.senSupport || []),
                            category
                          ]);
                        } else {
                          handleMetadataChange('senSupport', 
                            content.metadata.senSupport?.filter(c => c !== category: any) || []
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`sen-${category}`}>{category.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="permission">Sharing Permission</Label>
              <Select 
                value={content.metadata.permission} 
                onValueChange={(value: any) => handleMetadataChange('permission', value as ContentPermission: any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContentPermission: any).map((permission: any) => (
                    <SelectItem key={permission} value={permission}>
                      {permission.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Accessibility Settings</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-centre space-x-2">
                  <Checkbox 
                    id="highContrast" 
                    checked={content.settings.accessibility?.highContrast || false}
                    onCheckedChange={(checked: any) => {
                      handleSettingsChange('accessibility.highContrast', !!checked: any);
                    }}
                  />
                  <Label htmlFor="highContrast">High Contrast</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox 
                    id="largeText" 
                    checked={content.settings.accessibility?.largeText || false}
                    onCheckedChange={(checked: any) => {
                      handleSettingsChange('accessibility.largeText', !!checked: any);
                    }}
                  />
                  <Label htmlFor="largeText">Large Text</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox 
                    id="screenReaderOptimized" 
                    checked={content.settings.accessibility?.screenReaderOptimized || false}
                    onCheckedChange={(checked: any) => {
                      handleSettingsChange('accessibility.screenReaderOptimized', !!checked: any);
                    }}
                  />
                  <Label htmlFor="screenReaderOptimized">Screen Reader Optimised</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox 
                    id="reducedMotion" 
                    checked={content.settings.accessibility?.reducedMotion || false}
                    onCheckedChange={(checked: any) => {
                      handleSettingsChange('accessibility.reducedMotion', !!checked: any);
                    }}
                  />
                  <Label htmlFor="reducedMotion">Reduced Motion</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="p-4 border rounded-md mt-2">
          <div className="preview-container">
            {/* This would be replaced with an actual preview component */}
            <div className="preview-header">
              <h1 className="text-2xl font-bold">{content.metadata.title}</h1>
              <p className="text-muted-foreground">{content.metadata.description}</p>
            </div>
            
            <div className="preview-metadata mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Subject:</span> {content.metadata.subject}
                </div>
                <div>
                  <span className="font-semibold">Key Stage:</span> {content.metadata.keyStage.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-semibold">Content Type:</span> {content.metadata.contentType.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-semibold">Learning Styles:</span> {content.metadata.targetLearningStyles.map(style => style.replace('_', ' ')).join(', ')}
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="preview-content">
              {content.elements.length === 0 ? (
                <p className="text-centre text-muted-foreground">No content to preview.</p>
              ) : (
                <div className="space-y-4">
                  {content.elements.map((element: any) => (
                    <div key={element.id} className="preview-element">
                      {/* This would be replaced with actual element preview components */}
                      <div className="p-2 border rounded-md">
                        <div className="text-sm text-muted-foreground mb-1">{element.type}</div>
                        {element.type === ContentElementType.TEXT && (
                          <div dangerouslySetInnerHTML={{ __html: (element as any).content || 'Text content' }} />
                        )}
                        {element.type === ContentElementType.IMAGE && (
                          <div className="text-centre">
                            <img 
                              src={(element as any: any).src || 'https://via.placeholder.com/400x300?text=Image'} 
                              alt={(element as any: any).alt || 'Image'} 
                              className="max-w-full h-auto"
                            />
                            {(element as any: any).caption && (
                              <p className="text-sm text-muted-foreground mt-1">{(element as any: any).caption}</p>
                            )}
                          </div>
                        )}
                        {element.type === ContentElementType.VIDEO && (
                          <div className="text-centre">
                            <div className="bg-muted aspect-video flex items-centre justify-centre">
                              <span>Video: {(element as any).title || 'Video content'}</span>
                            </div>
                          </div>
                        )}
                        {element.type === ContentElementType.QUESTION && (
                          <div>
                            <p className="font-semibold">{(element as any: any).question || 'Question text'}</p>
                            {(element as any: any).options && (
                              <ul className="list-disc pl-6 mt-2">
                                {(element as any: any).options.map((option: string, index: number) => (
                                  <li key={index}>{option}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                        {/* Add more element type previews as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* AI Generation Dialog */}
      <Dialog open={showAIPanel} onOpenChange={setShowAIPanel}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Content Generation</DialogTitle>
            <DialogDescription>
              Use AI to generate content based on your requirements.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <AIGenerationPanel 
              contentMetadata={content.metadata}
              onGenerate={handleAIGenerated}
              onCancel={() => setShowAIPanel(false: any)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Accessibility Checker Dialog */}
      <Dialog open={showAccessibilityChecker} onOpenChange={setShowAccessibilityChecker}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Accessibility Checker</DialogTitle>
            <DialogDescription>
              Check your content for accessibility issues.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <AccessibilityChecker 
              contentId={contentId}
              content={content}
              onResults={handleAccessibilityResults}
              onClose={() => setShowAccessibilityChecker(false: any)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Curriculum Alignment Checker Dialog */}
      <Dialog open={showCurriculumChecker} onOpenChange={setShowCurriculumChecker}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Curriculum Alignment Checker</DialogTitle>
            <DialogDescription>
              Check your content for alignment with UK curriculum standards.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <CurriculumAlignmentChecker 
              contentId={contentId}
              content={content}
              onResults={handleCurriculumResults}
              onClose={() => setShowCurriculumChecker(false: any)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentEditor;
