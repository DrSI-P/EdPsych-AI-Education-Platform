'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialogue";
import { 
  Dialogue,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogue";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Image, 
  Link, 
  List, 
  ListChecks, 
  Loader2, 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Save, 
  Search, 
  Settings, 
  Share2, 
  Sparkles, 
  Tag, 
  Trash, 
  Upload, 
  X, 
  Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

// Mock data for categories, tags, etc.
const categories = [
  "Inclusive Education",
  "Assessment",
  "Social-Emotional Learning",
  "Cognitive Development",
  "Behaviour Management",
  "Learning Strategies",
  "Neurodiversity",
  "Educational Technology",
  "Professional Development"
];

const tags = [
  "AI",
  "Inclusion",
  "Differentiation",
  "Growth Mindset",
  "Metacognition",
  "Feedback",
  "SEND",
  "Wellbeing",
  "Assessment",
  "Digital Literacy",
  "Executive Function",
  "Working Memory",
  "Self-Regulation",
  "Emotional Literacy",
  "Restorative Practise"
];

const curriculumAreas = [
  "SEND",
  "PSHE",
  "English",
  "Mathematics",
  "Science",
  "Digital Literacy",
  "Cross-Curricular",
  "Inclusive Practise",
  "Assessment",
  "Pedagogy"
];

const ageRanges = [
  "EYFS",
  "KS1",
  "KS2",
  "KS3",
  "KS4",
  "Post-16",
  "All Phases"
];

const BlogPostEditor = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCurriculumAreas, setSelectedCurriculumAreas] = useState([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  
  // Form state
  const [postData, setPostData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: null,
    publishDate: new Date().toISOString().split('T')[0],
    isDraft: true,
    allowComments: true,
    isPrivate: false,
    isFeatured: false
  });

  const handleInputChange = (field, value) => {
    setPostData({
      ...postData,
      [field]: value
    });
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCurriculumToggle = (area) => {
    if (selectedCurriculumAreas.includes(area)) {
      setSelectedCurriculumAreas(selectedCurriculumAreas.filter(a => a !== area));
    } else {
      setSelectedCurriculumAreas([...selectedCurriculumAreas, area]);
    }
  };

  const handleAgeRangeToggle = (range) => {
    if (selectedAgeRanges.includes(range)) {
      setSelectedAgeRanges(selectedAgeRanges.filter(r => r !== range));
    } else {
      setSelectedAgeRanges([...selectedAgeRanges, range]);
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Draft saved",
        description: "Your blog post draft has been saved successfully.",
      });
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Post published",
        description: "Your blog post has been published successfully.",
      });
    }, 2000);
  };

  const handleAIGenerate = () => {
    setIsGeneratingWithAI(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGeneratingWithAI(false);
      setShowAIDialog(false);
      
      // Example AI-generated content based on the prompt
      if (aiPrompt.toLowerCase().includes("title")) {
        setPostData({
          ...postData,
          title: "AI-Enhanced Approaches to Supporting Executive Function in the Classroom"
        });
      } else if (aiPrompt.toLowerCase().includes("excerpt")) {
        setPostData({
          ...postData,
          excerpt: "Discover evidence-based strategies for supporting executive function development in students, enhanced by artificial intelligence tools that can provide personalized scaffolding and real-time feedback."
        });
      } else if (aiPrompt.toLowerCase().includes("content")) {
        setPostData({
          ...postData,
          content: postData.content + "\n\n## AI-Enhanced Executive Function Support\n\nExecutive function skills are critical for academic success and lifelong learning. These cognitive processes include working memory, cognitive flexibility, and inhibitory control. Recent research has demonstrated that targeted interventions, particularly when enhanced with AI-driven personalization, can significantly improve these skills in students of all ages.\n\n### Evidence-Based Approaches\n\nMultiple studies have shown that explicit instruction in executive function strategies, combined with regular practise and feedback, leads to measurable improvements in student performance across subject areas. For example, a 2023 study by Thompson et al. found that students who received structured executive function training showed a 27% improvement in task completion and a 32% reduction in off-task behaviour."
        });
      } else if (aiPrompt.toLowerCase().includes("tags")) {
        setSelectedTags(["Executive Function", "Working Memory", "AI", "Cognitive Development", "Self-Regulation"]);
      }
      
      toast({
        title: "AI content generated",
        description: "The AI has generated content based on your prompt.",
      });
    }, 3000);
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input 
          id="title" 
          placeholder="Enter a compelling title..." 
          value={postData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea 
          id="excerpt" 
          placeholder="Write a brief summary of your post..." 
          rows={3}
          value={postData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-centre justify-between">
          <Label htmlFor="content">Content</Label>
          <div className="flex items-centre space-x-2">
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" size="sm">
              <Link className="h-4 w-4 mr-2" />
              Add Link
            </Button>
            <Button variant="outline" size="sm">
              <List className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        </div>
        <Textarea 
          id="content" 
          placeholder="Write your blog post content here... You can use Markdown formatting." 
          rows={15}
          value={postData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          className="font-mono"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Dialogue open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Content Assistant</DialogTitle>
              <DialogDescription>
                Describe what you'd like the AI to help you with. Be specific about the type of content, tone, and educational focus.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea 
                placeholder="e.g., Generate an introduction about executive function development in primary school children, focusing on evidence-based strategies..." 
                rows={5}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Prompts:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Generate a title for a blog post about executive function support strategies")}
                  >
                    Generate title
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Write an excerpt for a blog post about AI-enhanced learning strategies")}
                  >
                    Write excerpt
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Suggest relevant tags for a post about executive function and working memory")}
                  >
                    Suggest tags
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setAiPrompt("Draft a section about evidence-based approaches to supporting executive function")}
                  >
                    Draft content section
                  </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button>
              <Button onClick={handleAIGenerate} disabled={isGeneratingWithAI}>
                {isGeneratingWithAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialogue>
        
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderMetadataTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={postData.category} 
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="border rounded-md p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <Badge key={tag} className="flex items-centre gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleTagToggle(tag)}
                />
              </Badge>
            ))}
            {selectedTags.length === 0 && (
              <div className="text-sm text-muted-foreground">No tags selected</div>
            )}
          </div>
          <Separator className="my-2" />
          <div className="mt-2">
            <Label className="text-sm">Available Tags</Label>
            <ScrollArea className="h-[200px] mt-2">
              <div className="space-y-2">
                {tags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                  <div 
                    key={tag} 
                    className="flex items-centre space-x-2"
                  >
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Curriculum Areas</Label>
          <div className="border rounded-md p-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {curriculumAreas.map((area) => (
                  <div 
                    key={area} 
                    className="flex items-centre space-x-2"
                  >
                    <Checkbox 
                      id={`curriculum-${area}`} 
                      checked={selectedCurriculumAreas.includes(area)}
                      onCheckedChange={() => handleCurriculumToggle(area)}
                    />
                    <Label 
                      htmlFor={`curriculum-${area}`}
                      className="text-sm cursor-pointer"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Age Ranges</Label>
          <div className="border rounded-md p-4">
            <div className="space-y-2">
              {ageRanges.map((range) => (
                <div 
                  key={range} 
                  className="flex items-centre space-x-2"
                >
                  <Checkbox 
                    id={`age-${range}`} 
                    checked={selectedAgeRanges.includes(range)}
                    onCheckedChange={() => handleAgeRangeToggle(range)}
                  />
                  <Label 
                    htmlFor={`age-${range}`}
                    className="text-sm cursor-pointer"
                  >
                    {range}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="featured-image">Featured Image</Label>
        <div className="border-2 border-dashed rounded-md p-6 text-centre">
          {postData.featuredImage ? (
            <div className="space-y-2">
              <img 
                src={URL.createObjectURL(postData.featuredImage)} 
                alt="Featured" 
                className="max-h-[200px] mx-auto object-contain"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleInputChange("featuredImage", null)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-centre">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image, or click to browse
              </p>
              <Input 
                id="featured-image" 
                type="file" 
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInputChange("featuredImage", e.target.files[0]);
                  }
                }}
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById("featured-image").click()}
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="publish-date">Publish Date</Label>
        <Input 
          id="publish-date" 
          type="date" 
          value={postData.publishDate}
          onChange={(e) => handleInputChange("publishDate", e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-centre justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="draft-switch">Save as Draft</Label>
            <p className="text-sm text-muted-foreground">
              Post will not be published until you're ready
            </p>
          </div>
          <Switch 
            id="draft-switch" 
            checked={postData.isDraft}
            onCheckedChange={(checked) => handleInputChange("isDraft", checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-centre justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="comments-switch">Allow Comments</Label>
            <p className="text-sm text-muted-foreground">
              Enable readers to comment on this post
            </p>
          </div>
          <Switch 
            id="comments-switch" 
            checked={postData.allowComments}
            onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-centre justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="private-switch">Private Post</Label>
            <p className="text-sm text-muted-foreground">
              Only visible to you and editors
            </p>
          </div>
          <Switch 
            id="private-switch" 
            checked={postData.isPrivate}
            onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-centre justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="featured-switch">Featured Post</Label>
            <p className="text-sm text-muted-foreground">
              Highlight this post on the blog homepage
            </p>
          </div>
          <Switch 
            id="featured-switch" 
            checked={postData.isFeatured}
            onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete Post
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your post and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <div className="border rounded-md p-6">
        {postData.title ? (
          <>
            <div className="space-y-4">
              <div>
                {postData.category && (
                  <Badge variant="outline" className="mb-2">
                    {postData.category}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold">{postData.title}</h1>
                <div className="flex items-centre space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-centre">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(postData.publishDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-centre">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.max(1, Math.ceil(postData.content.length / 1000))} min read
                  </div>
                </div>
              </div>
              
              {postData.featuredImage && (
                <div className="my-6">
                  <img 
                    src={URL.createObjectURL(postData.featuredImage)} 
                    alt={postData.title} 
                    className="w-full max-h-[400px] object-cover rounded-md"
                  />
                </div>
              )}
              
              {postData.excerpt && (
                <div className="my-4 text-lg font-medium text-muted-foreground">
                  {postData.excerpt}
                </div>
              )}
              
              <Separator />
              
              <div className="prose prose-slate max-w-none">
                {postData.content ? (
                  <div dangerouslySetInnerHTML={{ __html: postData.content.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-6 mt-6">
                {selectedCurriculumAreas.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Curriculum Areas:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCurriculumAreas.map(area => (
                        <Badge key={area} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedAgeRanges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Age Ranges:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgeRanges.map(range => (
                        <Badge key={range} variant="outline">
                          {range}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-centre py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Nothing to preview yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add a title and content to see a preview of your blog post
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-centre justify-between">
        <div className="flex items-centre space-x-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-2xl font-bold">
            {postData.title || "New Blog Post"}
          </h1>
        </div>
        <div className="flex items-centre space-x-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          {renderContentTab()}
        </TabsContent>
        
        <TabsContent value="metadata" className="space-y-4 pt-4">
          {renderMetadataTab()}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          {renderSettingsTab()}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 pt-4">
          {renderPreviewTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostEditor;
