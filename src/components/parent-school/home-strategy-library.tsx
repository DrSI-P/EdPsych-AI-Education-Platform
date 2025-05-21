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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Download, 
  PlusCircle,
  Star,
  Clock,
  Users,
  Tag,
  Eye,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Play,
  ExternalLink,
  Printer,
  Heart
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

// Mock data for strategies
const MOCK_STRATEGIES = [
  {
    id: '1',
    title: 'Reading Comprehension Strategies',
    description: 'Effective techniques to improve reading comprehension for primary school children.',
    category: 'Literacy',
    subject: 'English',
    ageRange: '7-11',
    format: 'document',
    source: 'school',
    author: 'Ms. Johnson',
    authorRole: 'Year 4 Teacher',
    dateAdded: '2025-06-15',
    rating: 4.8,
    reviewCount: 24,
    usageCount: 156,
    tags: ['reading', 'comprehension', 'primary', 'literacy'],
    url: '/strategies/reading_comprehension.pdf',
    thumbnail: '/thumbnails/reading_comprehension.jpg',
    relatedGoals: ['Improve Reading Fluency'],
    isRecommended: true
  },
  {
    id: '2',
    title: 'Visual Math Techniques',
    description: 'Visual approaches to help children understand mathematical concepts.',
    category: 'Numeracy',
    subject: 'Mathematics',
    ageRange: '5-9',
    format: 'video',
    source: 'school',
    author: 'Mr. Williams',
    authorRole: 'Maths Coordinator',
    dateAdded: '2025-06-10',
    rating: 4.6,
    reviewCount: 18,
    usageCount: 132,
    tags: ['mathematics', 'visual learning', 'primary', 'numeracy'],
    url: '/strategies/visual_math.mp4',
    thumbnail: '/thumbnails/visual_math.jpg',
    relatedGoals: ['Develop Confidence in Mathematics'],
    isRecommended: true
  },
  {
    id: '3',
    title: 'Social Skills Games for Home',
    description: 'Fun games to play at home that develop turn-taking and social interaction skills.',
    category: 'Social Development',
    subject: 'Personal Development',
    ageRange: '4-11',
    format: 'document',
    source: 'school',
    author: 'Mrs. Patel',
    authorRole: 'SENCO',
    dateAdded: '2025-05-20',
    rating: 4.9,
    reviewCount: 32,
    usageCount: 187,
    tags: ['social skills', 'games', 'turn-taking', 'SEND'],
    url: '/strategies/social_skills_games.pdf',
    thumbnail: '/thumbnails/social_skills_games.jpg',
    relatedGoals: ['Develop Social Skills in Group Settings'],
    isRecommended: false
  },
  {
    id: '4',
    title: 'Creating a Reading-Friendly Home Environment',
    description: 'Tips for setting up spaces at home that encourage reading and literacy development.',
    category: 'Literacy',
    subject: 'English',
    ageRange: '3-11',
    format: 'document',
    source: 'school',
    author: 'Ms. Johnson',
    authorRole: 'Year 4 Teacher',
    dateAdded: '2025-06-05',
    rating: 4.7,
    reviewCount: 15,
    usageCount: 98,
    tags: ['reading', 'home environment', 'literacy', 'parent support'],
    url: '/strategies/reading_environment.pdf',
    thumbnail: '/thumbnails/reading_environment.jpg',
    relatedGoals: ['Improve Reading Fluency'],
    isRecommended: true
  },
  {
    id: '5',
    title: 'Everyday Math Activities',
    description: 'Simple activities that incorporate mathematics into daily routines.',
    category: 'Numeracy',
    subject: 'Mathematics',
    ageRange: '4-11',
    format: 'document',
    source: 'school',
    author: 'Mr. Williams',
    authorRole: 'Maths Coordinator',
    dateAdded: '2025-05-25',
    rating: 4.5,
    reviewCount: 22,
    usageCount: 145,
    tags: ['mathematics', 'daily activities', 'practical math', 'numeracy'],
    url: '/strategies/everyday_math.pdf',
    thumbnail: '/thumbnails/everyday_math.jpg',
    relatedGoals: ['Develop Confidence in Mathematics'],
    isRecommended: false
  },
  {
    id: '6',
    title: 'Phonics Practise at Home',
    description: 'Structured phonics activities to reinforce school learning at home.',
    category: 'Literacy',
    subject: 'English',
    ageRange: '4-7',
    format: 'video',
    source: 'school',
    author: 'Ms. Roberts',
    authorRole: 'Year 1 Teacher',
    dateAdded: '2025-06-12',
    rating: 4.9,
    reviewCount: 28,
    usageCount: 176,
    tags: ['phonics', 'early reading', 'literacy', 'KS1'],
    url: '/strategies/phonics_practice.mp4',
    thumbnail: '/thumbnails/phonics_practice.jpg',
    relatedGoals: [],
    isRecommended: false
  },
  {
    id: '7',
    title: 'Emotional Regulation Techniques',
    description: 'Strategies to help children recognise and manage their emotions effectively.',
    category: 'Emotional Development',
    subject: 'Personal Development',
    ageRange: '5-11',
    format: 'document',
    source: 'school',
    author: 'Mrs. Patel',
    authorRole: 'SENCO',
    dateAdded: '2025-05-18',
    rating: 4.8,
    reviewCount: 35,
    usageCount: 210,
    tags: ['emotions', 'self-regulation', 'wellbeing', 'SEMH'],
    url: '/strategies/emotional_regulation.pdf',
    thumbnail: '/thumbnails/emotional_regulation.jpg',
    relatedGoals: [],
    isRecommended: false
  },
  {
    id: '8',
    title: 'Our Family Reading Routine',
    description: 'A structured approach to daily reading that has worked well for our family.',
    category: 'Literacy',
    subject: 'English',
    ageRange: '5-11',
    format: 'document',
    source: 'parent',
    author: 'Sarah Thompson',
    authorRole: 'Parent',
    dateAdded: '2025-06-08',
    rating: 4.6,
    reviewCount: 12,
    usageCount: 67,
    tags: ['reading', 'routines', 'family', 'parent tips'],
    url: '/strategies/family_reading_routine.pdf',
    thumbnail: '/thumbnails/family_reading_routine.jpg',
    relatedGoals: ['Improve Reading Fluency'],
    isRecommended: false
  }
];

// Mock data for parent feedback
const MOCK_FEEDBACK = [
  {
    id: '1',
    strategyId: '1',
    author: 'Parent',
    rating: 5,
    comment: 'These strategies have made a huge difference to my son\'s reading comprehension. The visualisation techniques are particularly effective.',
    date: '2025-06-20',
    helpful: 8
  },
  {
    id: '2',
    strategyId: '1',
    author: 'Parent',
    rating: 4,
    comment: 'Very useful approaches. We\'ve been using the question prompts during reading time and they\'ve helped my daughter think more deeply about the text.',
    date: '2025-06-18',
    helpful: 5
  },
  {
    id: '3',
    strategyId: '2',
    author: 'Parent',
    rating: 5,
    comment: 'The visual math techniques have transformed how my child approaches math problems. The video format made it easy to understand and implement at home.',
    date: '2025-06-15',
    helpful: 10
  }
];

export default function HomeStrategyLibrary() {
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState(MOCK_STRATEGIES[0]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: '' });
  
  // Filter strategies based on active tab, search term, and filters
  const filteredStrategies = MOCK_STRATEGIES.filter(strategy => {
    // Filter by tab
    if (activeTab === 'recommended' && !strategy.isRecommended) return false;
    if (activeTab === 'school' && strategy.source !== 'school') return false;
    if (activeTab === 'parent' && strategy.source !== 'parent') return false;
    
    // Filter by search term
    if (searchTerm && !strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && strategy.category !== selectedCategory) return false;
    
    // Filter by format
    if (selectedFormat !== 'all' && strategy.format !== selectedFormat) return false;
    
    return true;
  });
  
  // Handle submitting feedback
  const handleSubmitFeedback = () => {
    if (newFeedback.comment.trim() === '') return;
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for sharing your experience with this strategy.",
    });
    
    setNewFeedback({ rating: 5, comment: '' });
    setShowFeedback(false);
  };
  
  // Get feedback for selected strategy
  const strategyFeedback = MOCK_FEEDBACK.filter(feedback => feedback.strategyId === selectedStrategy.id);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Strategy Library</h1>
          <p className="text-muted-foreground">
            Discover and share effective strategies for supporting learning at home
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Share Your Strategy
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Find Strategies</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search strategies..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="school">From School</TabsTrigger>
                  <TabsTrigger value="parent">From Parents</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Literacy">Literacy</SelectItem>
                      <SelectItem value="Numeracy">Numeracy</SelectItem>
                      <SelectItem value="Social Development">Social Development</SelectItem>
                      <SelectItem value="Emotional Development">Emotional Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="link">Links</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Strategy List</CardTitle>
              <CardDescription>
                {filteredStrategies.length} strategies found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredStrategies.length > 0 ? (
                  filteredStrategies.map((strategy) => (
                    <div 
                      key={strategy.id}
                      className={`p-4 border-b hover:bg-muted cursor-pointer ${selectedStrategy.id === strategy.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      <div className="flex items-start">
                        <div className="h-16 w-16 rounded-md overflow-hidden mr-3 bg-muted flex items-centre justify-centre">
                          {strategy.thumbnail ? (
                            <img src={strategy.thumbnail} alt={strategy.title} className="h-full w-full object-cover" />
                          ) : (
                            strategy.format === 'document' ? (
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            ) : strategy.format === 'video' ? (
                              <Video className="h-8 w-8 text-muted-foreground" />
                            ) : strategy.format === 'image' ? (
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            ) : (
                              <LinkIcon className="h-8 w-8 text-muted-foreground" />
                            )
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm truncate">{strategy.title}</h3>
                            {strategy.isRecommended && (
                              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 hover:bg-amber-50">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {strategy.description}
                          </p>
                          <div className="flex items-centre mt-2 text-xs text-muted-foreground">
                            <div className="flex items-centre">
                              <Star className="h-3 w-3 text-amber-500 mr-1" />
                              <span>{strategy.rating}</span>
                            </div>
                            <span className="mx-2">•</span>
                            <div className="flex items-centre">
                              {strategy.source === 'school' ? (
                                <BookOpen className="h-3 w-3 mr-1" />
                              ) : (
                                <Users className="h-3 w-3 mr-1" />
                              )}
                              <span>
                                {strategy.source === 'school' ? 'School' : 'Parent'}
                              </span>
                            </div>
                            <span className="mx-2">•</span>
                            <div className="flex items-centre">
                              <Tag className="h-3 w-3 mr-1" />
                              <span>{strategy.subject}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-centre text-muted-foreground">
                    No strategies found matching your criteria
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedStrategy.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedStrategy.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save for Later
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Strategy
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Strategy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Provide Feedback
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-centre justify-centre">
                  {selectedStrategy.thumbnail ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={selectedStrategy.thumbnail} 
                        alt={selectedStrategy.title} 
                        className="w-full h-full object-cover" 
                      />
                      {selectedStrategy.format === 'video' && (
                        <div className="absolute inset-0 flex items-centre justify-centre">
                          <Button size="icon" className="h-12 w-12 rounded-full bg-primary/90 hover:bg-primary">
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-centre p-6">
                      {selectedStrategy.format === 'document' ? (
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      ) : selectedStrategy.format === 'video' ? (
                        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      ) : selectedStrategy.format === 'image' ? (
                        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      ) : (
                        <LinkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      )}
                      <p className="text-muted-foreground">Preview not available</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedStrategy.category}</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedStrategy.subject}</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Age Range</p>
                    <p className="font-medium">{selectedStrategy.ageRange}</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Format</p>
                    <p className="font-medium capitalize">{selectedStrategy.format}</p>
                  </div>
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src={`/avatars/${selectedStrategy.source === 'school' ? 'teacher' : 'parent'}.png`} />
                      <AvatarFallback>{selectedStrategy.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedStrategy.author}</p>
                      <p className="text-xs text-muted-foreground">{selectedStrategy.authorRole}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-centre space-x-4">
                    <div className="flex items-centre">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">{selectedStrategy.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({selectedStrategy.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-centre">
                      <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedStrategy.usageCount}</span>
                    </div>
                    
                    <div className="flex items-centre">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(selectedStrategy.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Related Goals</h3>
                  {selectedStrategy.relatedGoals.length > 0 ? (
                    <div className="space-y-2">
                      {selectedStrategy.relatedGoals.map((goal, index) => (
                        <div key={index} className="flex items-centre p-3 bg-muted rounded-lg">
                          <Target className="h-5 w-5 mr-2 text-primary" />
                          <p className="text-sm">{goal}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No related goals found</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Tags</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedStrategy.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setShowFeedback(true)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Feedback
                    </Button>
                    
                    <Button>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Strategy
                    </Button>
                  </div>
                </div>
                
                {showFeedback && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Share Your Experience</h4>
                    <div className="mb-3">
                      <Label htmlFor="rating" className="text-xs">Rating</Label>
                      <div className="flex items-centre mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1"
                            onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                          >
                            <Star 
                              className={`h-5 w-5 ${star <= newFeedback.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="comment" className="text-xs">Your Feedback</Label>
                      <Textarea 
                        id="comment"
                        placeholder="Share how this strategy worked for you..."
                        value={newFeedback.comment}
                        onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setShowFeedback(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSubmitFeedback}>
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Parent Feedback</h3>
                  </div>
                  
                  {strategyFeedback.length > 0 ? (
                    <div className="space-y-4">
                      {strategyFeedback.map((feedback) => (
                        <div key={feedback.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex items-centre">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>P</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{feedback.author}</span>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`h-4 w-4 ${star <= feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm mt-2">{feedback.comment}</p>
                          <div className="flex justify-between items-centre mt-2 text-xs text-muted-foreground">
                            <span>{new Date(feedback.date).toLocaleDateString()}</span>
                            <div className="flex items-centre">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <span>{feedback.helpful}</span>
                              <span className="ml-1">found this helpful</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No feedback yet. Be the first to share your experience!</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
