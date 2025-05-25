'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, X, Plus, FileText, Image, FileVideo, FileAudio, File } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function CreateResource(): React.ReactNode {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin?callbackUrl=/resources/create');
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    keyStage: '',
    type: '',
    isPublic: true,
    allowDownload: true,
    requireAttribution: true,
    curriculumLinks: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean): void => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Generate preview for the first image file
      if (!previewUrl) {
        const imageFile = [...files, ...newFiles].find(file => file.type.startsWith('image/'));
        if (imageFile) {
          const url = URL.createObjectURL(imageFile);
          setPreviewUrl(url);
        }
      }
    }
  };

  const handleRemoveFile = (fileToRemove: File): void => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    
    // Update preview if needed
    if (previewUrl && files.indexOf(fileToRemove) === 0) {
      URL.revokeObjectURL(previewUrl);
      const imageFile = updatedFiles.find(file => file.type.startsWith('image/'));
      if (imageFile) {
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.keyStage) errors.keyStage = 'Key Stage is required';
    if (!formData.type) errors.type = 'Resource type is required';
    if (files.length === 0) errors.files = 'At least one file is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error message and switch to the tab with errors
      if (formErrors.files) {
        setActiveTab('files');
      } else {
        setActiveTab('details');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be a FormData submission with files
      // const formDataToSubmit = new FormData();
      // formDataToSubmit.append('title', formData.title);
      // formDataToSubmit.append('description', formData.description);
      // ... other form fields
      // files.forEach(file => formDataToSubmit.append('files', file));
      
      // const response = await fetch('/api/resources', {
      //   method: 'POST',
      //   body: formDataToSubmit,
      // });
      
      // if (!response.ok) throw new Error('Failed to create resource');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the resource library
      router.push('/resources');
    } catch (error) {
      // Avoid console.error in production
      setFormErrors((prev) => ({ ...prev, submit: 'Failed to create resource. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file: File): React.ReactNode => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="h-5 w-5" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Create Resource</h1>
        <p className="text-muted-foreground mt-2">
          Share your educational resources with the EdPsych community
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="details">Resource Details</TabsTrigger>
                <TabsTrigger value="files">Files &amp; Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6 space-y-6">
                {formErrors.submit && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formErrors.submit}</AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Provide details about your educational resource
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a descriptive title"
                        className={formErrors.title ? 'border-destructive' : ''}
                      />
                      {formErrors.title && (
                        <p className="text-sm text-destructive">{formErrors.title}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your resource and how it can be used"
                        className={`min-h-[120px] ${formErrors.description ? 'border-destructive' : ''}`}
                      />
                      {formErrors.description && (
                        <p className="text-sm text-destructive">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => handleSelectChange('subject', value)}
                        >
                          <SelectTrigger id="subject" className={formErrors.subject ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Geography">Geography</SelectItem>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Physical Education">Physical Education</SelectItem>
                            <SelectItem value="Computing">Computing</SelectItem>
                            <SelectItem value="Design and Technology">Design and Technology</SelectItem>
                            <SelectItem value="Languages">Languages</SelectItem>
                            <SelectItem value="Religious Education">Religious Education</SelectItem>
                            <SelectItem value="PSHE">PSHE</SelectItem>
                            <SelectItem value="Cross-curricular">Cross-curricular</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.subject && (
                          <p className="text-sm text-destructive">{formErrors.subject}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="keyStage">Key Stage</Label>
                        <Select
                          value={formData.keyStage}
                          onValueChange={(value) => handleSelectChange('keyStage', value)}
                        >
                          <SelectTrigger id="keyStage" className={formErrors.keyStage ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select key stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EYFS">Early Years (EYFS)</SelectItem>
                            <SelectItem value="KS1">Key Stage 1</SelectItem>
                            <SelectItem value="KS2">Key Stage 2</SelectItem>
                            <SelectItem value="KS3">Key Stage 3</SelectItem>
                            <SelectItem value="KS4">Key Stage 4</SelectItem>
                            <SelectItem value="KS5">Key Stage 5</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.keyStage && (
                          <p className="text-sm text-destructive">{formErrors.keyStage}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Resource Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger id="type" className={formErrors.type ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Worksheet">Worksheet</SelectItem>
                          <SelectItem value="Guide">Guide</SelectItem>
                          <SelectItem value="Activity">Activity</SelectItem>
                          <SelectItem value="Presentation">Presentation</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                          <SelectItem value="Interactive">Interactive</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Audio">Audio</SelectItem>
                          <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                          <SelectItem value="Scheme of Work">Scheme of Work</SelectItem>
                          <SelectItem value="Display">Display</SelectItem>
                          <SelectItem value="Game">Game</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.type && (
                        <p className="text-sm text-destructive">{formErrors.type}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-centre gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type tag and press Enter"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add tags to help others find your resource
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sharing Options</CardTitle>
                    <CardDescription>
                      Control how your resource can be accessed and used
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic">Public Resource</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this resource visible to all users
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowDownload">Allow Downloads</Label>
                        <p className="text-sm text-muted-foreground">
                          Let users download this resource
                        </p>
                      </div>
                      <Switch
                        id="allowDownload"
                        checked={formData.allowDownload}
                        onCheckedChange={(checked) => handleSwitchChange('allowDownload', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireAttribution">Require Attribution</Label>
                        <p className="text-sm text-muted-foreground">
                          Users must credit you when using this resource
                        </p>
                      </div>
                      <Switch
                        id="requireAttribution"
                        checked={formData.requireAttribution}
                        onCheckedChange={(checked) => handleSwitchChange('requireAttribution', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="files" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Files</CardTitle>
                    <CardDescription>
                      Add the files for your educational resource
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-centre justify-centre text-centre ${
                            formErrors.files ? 'border-destructive' : 'border-muted-foreground/25'
                          }`}
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="font-medium">Upload Files</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Drag and drop files or click to browse
                          </p>
                          <Input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Select Files
                          </Button>
                          {formErrors.files && (
                            <p className="text-sm text-destructive mt-2">{formErrors.files}</p>
                          )}
                        </div>
                        
                        {files.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Uploaded Files</h4>
                            <ul className="space-y-2">
                              {files.map((file, index) => (
                                <li key={index} className="flex items-centre justify-between bg-muted p-2 rounded-md">
                                  <div className="flex items-centre">
                                    {getFileIcon(file)}
                                    <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFile(file)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Preview</h4>
                        {previewUrl ? (
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                              src={previewUrl}
                              className="w-full h-full object-contain"
                              alt="Resource preview"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-muted rounded-lg flex flex-col items-centre justify-centre text-centre">
                            <Image className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Upload an image to see a preview
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          The first image you upload will be used as the resource thumbnail
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resource Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Title</h4>
                  <p className="text-sm">
                    {formData.title || 'No title provided'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Type</h4>
                  <p className="text-sm">
                    {formData.type || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Subject</h4>
                  <p className="text-sm">
                    {formData.subject || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Key Stage</h4>
                  <p className="text-sm">
                    {formData.keyStage || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Files</h4>
                  <p className="text-sm">
                    {files.length > 0 ? `${files.length} file(s) uploaded` : 'No files uploaded'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags added</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Sharing</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-centre gap-2">
                      <div className={`h-2 w-2 rounded-full ${formData.isPublic ? 'bg-green-500' : 'bg-red-500'}`} />
                      {formData.isPublic ? 'Public' : 'Private'}
                    </li>
                    <li className="flex items-centre gap-2">
                      <div className={`h-2 w-2 rounded-full ${formData.allowDownload ? 'bg-green-500' : 'bg-red-500'}`} />
                      {formData.allowDownload ? 'Downloads allowed' : 'No downloads'}
                    </li>
                    <li className="flex items-centre gap-2">
                      <div className={`h-2 w-2 rounded-full ${formData.requireAttribution ? 'bg-green-500' : 'bg-red-500'}`} />
                      {formData.requireAttribution ? 'Attribution required' : 'No attribution needed'}
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Resource'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
