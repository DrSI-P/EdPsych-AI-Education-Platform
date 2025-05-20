'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, RefreshCw, User, UserPlus, Users, Lock, Unlock } from 'lucide-react';

// Mock data for suggestion categories
const suggestionCategories = [
  { id: 'learning', label: 'Learning Experience' },
  { id: 'teaching', label: 'Teaching Methods' },
  { id: 'curriculum', label: 'Curriculum Content' },
  { id: 'environment', label: 'Learning Environment' },
  { id: 'resources', label: 'Resources & Materials' },
  { id: 'support', label: 'Support & Help' },
  { id: 'wellbeing', label: 'Wellbeing & Inclusion' },
  { id: 'other', label: 'Other' }
];

// Mock data for year groups
const yearGroups = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

// Interface for suggestion
interface Suggestion {
  id: string;
  category: string;
  title: string;
  content: string;
  yearGroup?: string;
  status: 'pending' | 'reviewing' | 'implemented' | 'declined';
  visibility: 'private' | 'public';
  votes: {
    up: number;
    down: number;
  };
  responses: {
    id: string;
    content: string;
    fromStaff: boolean;
    createdAt: string;
  }[];
  createdAt: string;
}

export default function AnonymousSuggestionSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('submit');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Suggestion form state
  const [suggestionForm, setSuggestionForm] = useState({
    category: '',
    title: '',
    content: '',
    yearGroup: '',
    visibility: 'private'
  });
  
  // Response form state
  const [responseForm, setResponseForm] = useState({
    suggestionId: '',
    content: ''
  });
  
  // Load mock data on component mount
  React.useEffect(() => {
    // Mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        category: 'environment',
        title: 'Quiet reading area in the classroom',
        content: 'It would be helpful to have a designated quiet area in the classroom for reading or working independently. Sometimes it\'s hard to concentrate with all the noise.',
        yearGroup: 'Year 5',
        status: 'implemented',
        visibility: 'public',
        votes: {
          up: 15,
          down: 2
        },
        responses: [
          {
            id: '1-1',
            content: 'Thank you for your suggestion! We\'ve created a reading corner with cushions and a small bookshelf in the back of the classroom.',
            fromStaff: true,
            createdAt: '2025-05-10T14:30:00Z'
          }
        ],
        createdAt: '2025-05-08T09:15:00Z'
      },
      {
        id: '2',
        category: 'curriculum',
        title: 'More practical science experiments',
        content: 'I think we should do more hands-on science experiments instead of just reading from textbooks. It would make the lessons more interesting and help us understand the concepts better.',
        yearGroup: 'Year 8',
        status: 'reviewing',
        visibility: 'public',
        votes: {
          up: 23,
          down: 1
        },
        responses: [
          {
            id: '2-1',
            content: 'I agree! Practical experiments are much more fun and help me remember what we learn.',
            fromStaff: false,
            createdAt: '2025-05-12T10:45:00Z'
          },
          {
            id: '2-2',
            content: 'We\'re currently reviewing this suggestion and looking at ways to incorporate more practical work into our science curriculum. Thank you for your input!',
            fromStaff: true,
            createdAt: '2025-05-13T16:20:00Z'
          }
        ],
        createdAt: '2025-05-12T08:30:00Z'
      },
      {
        id: '3',
        category: 'support',
        title: 'Homework help club',
        content: 'Could we start an after-school homework club where students can get help from teachers or older students? Sometimes I struggle with homework and don\'t have anyone to ask at home.',
        yearGroup: 'Year 7',
        status: 'pending',
        visibility: 'private',
        votes: {
          up: 8,
          down: 0
        },
        responses: [],
        createdAt: '2025-05-14T15:45:00Z'
      }
    ];
    
    setSuggestions(mockSuggestions);
    setFilteredSuggestions(mockSuggestions);
  }, []);
  
  // Filter suggestions based on selected filters and search term
  React.useEffect(() => {
    let filtered = [...suggestions];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.category === selectedCategory);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.status === selectedStatus);
    }
    
    // Filter by visibility
    if (selectedVisibility !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.visibility === selectedVisibility);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(suggestion => 
        suggestion.title.toLowerCase().includes(term) || 
        suggestion.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredSuggestions(filtered);
  }, [suggestions, selectedCategory, selectedStatus, selectedVisibility, searchTerm]);
  
  // Handle suggestion form change
  const handleSuggestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSuggestionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle visibility change
  const handleVisibilityChange = (visibility: 'private' | 'public') => {
    setSuggestionForm(prev => ({ ...prev, visibility }));
  };
  
  // Handle response form change
  const handleResponseFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseForm(prev => ({ ...prev, content: e.target.value }));
  };
  
  // Handle suggestion submission
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!suggestionForm.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    if (!suggestionForm.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    if (!suggestionForm.content.trim()) {
      toast({
        title: "Content required",
        description: "Please provide details for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the suggestion to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new suggestion
      const newSuggestion: Suggestion = {
        id: Date.now().toString(),
        category: suggestionForm.category,
        title: suggestionForm.title,
        content: suggestionForm.content,
        yearGroup: suggestionForm.yearGroup || undefined,
        status: 'pending',
        visibility: suggestionForm.visibility as 'private' | 'public',
        votes: {
          up: 0,
          down: 0
        },
        responses: [],
        createdAt: new Date().toISOString()
      };
      
      // Add to suggestions
      setSuggestions(prev => [newSuggestion, ...prev]);
      
      // Reset form
      setSuggestionForm({
        category: '',
        title: '',
        content: '',
        yearGroup: '',
        visibility: 'private'
      });
      
      setIsLoading(false);
      
      toast({
        title: "Suggestion submitted",
        description: "Thank you for your suggestion! It has been submitted anonymously.",
      });
      
      // Switch to browse tab
      setActiveTab('browse');
    }, 1500);
  };
  
  // Handle response submission
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!responseForm.content.trim()) {
      toast({
        title: "Response required",
        description: "Please provide a response.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the response to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new response
      const newResponse = {
        id: Date.now().toString(),
        content: responseForm.content,
        fromStaff: false,
        createdAt: new Date().toISOString()
      };
      
      // Add response to the suggestion
      setSuggestions(prev => 
        prev.map(suggestion => {
          if (suggestion.id === responseForm.suggestionId) {
            return {
              ...suggestion,
              responses: [...suggestion.responses, newResponse]
            };
          }
          return suggestion;
        })
      );
      
      // Reset form
      setResponseForm({
        suggestionId: '',
        content: ''
      });
      
      setIsLoading(false);
      
      toast({
        title: "Response submitted",
        description: "Your response has been added to the suggestion.",
      });
    }, 1000);
  };
  
  // Handle voting
  const handleVote = (suggestionId: string, voteType: 'up' | 'down') => {
    setSuggestions(prev => 
      prev.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            votes: {
              ...suggestion.votes,
              [voteType]: suggestion.votes[voteType] + 1
            }
          };
        }
        return suggestion;
      })
    );
    
    toast({
      title: "Vote recorded",
      description: `You ${voteType === 'up' ? 'upvoted' : 'downvoted'} this suggestion.`,
    });
  };
  
  // Set up response form for a suggestion
  const setupResponseForm = (suggestionId: string) => {
    setResponseForm({
      suggestionId,
      content: ''
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: Suggestion['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="secondary">Reviewing</Badge>;
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Implemented</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Anonymous Suggestion System</h1>
      <p className="text-muted-foreground mb-6">
        Share your ideas and suggestions anonymously to help improve our school
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="submit">Submit Suggestion</TabsTrigger>
          <TabsTrigger value="browse">Browse Suggestions</TabsTrigger>
        </TabsList>
        
        {/* Submit Suggestion Tab */}
        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Share Your Ideas</CardTitle>
              <CardDescription>
                Your suggestions are anonymous and help make our school better
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={suggestionForm.category} 
                      onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {suggestionCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="yearGroup">Year Group (Optional)</Label>
                    <Select 
                      value={suggestionForm.yearGroup} 
                      onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, yearGroup: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {yearGroups.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Suggestion Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={suggestionForm.title}
                    onChange={handleSuggestionFormChange}
                    placeholder="Enter a brief title for your suggestion"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Suggestion Details</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={suggestionForm.content}
                    onChange={handleSuggestionFormChange}
                    placeholder="Describe your suggestion in detail..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={suggestionForm.visibility === 'private' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVisibilityChange('private')}
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Private (Staff Only)</span>
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Only school staff can see your suggestion
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={suggestionForm.visibility === 'public' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVisibilityChange('public')}
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        <span>Public (Everyone)</span>
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        All students and staff can see and comment on your suggestion
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="bg-muted/20 p-4 rounded-md mb-4">
                    <h4 className="font-medium mb-2">Important Information</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Your suggestion will be submitted anonymously</li>
                      <li>• Staff will review all suggestions</li>
                      <li>• Inappropriate content will be removed</li>
                      <li>• You can track the status of your suggestion in the Browse tab</li>
                    </ul>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !suggestionForm.title.trim() || !suggestionForm.content.trim() || !suggestionForm.category}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Suggestion
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Browse Suggestions Tab */}
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Browse Suggestions</CardTitle>
              <CardDescription>
                View and interact with suggestions from the school community
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:flex-1">
                    <Input
                      placeholder="Search suggestions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {suggestionCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={selectedStatus} 
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="implemented">Implemented</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={selectedVisibility} 
                      onValueChange={setSelectedVisibility}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Visibility</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {filteredSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No suggestions found matching your criteria.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSuggestions.map(suggestion => (
                      <Card key={suggestion.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{suggestion.title}</CardTitle>
                              <CardDescription>
                                {formatDate(suggestion.createdAt)}
                                {suggestion.yearGroup && ` • ${suggestion.yearGroup}`}
                                {` • ${suggestionCategories.find(c => c.id === suggestion.category)?.label || suggestion.category}`}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {suggestion.visibility === 'private' ? (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Lock className="h-3 w-3" />
                                  Private
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Public
                                </Badge>
                              )}
                              {getStatusBadge(suggestion.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-4">
                            <p className="text-sm">{suggestion.content}</p>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote(suggestion.id, 'up')}
                                  className="h-8 px-2"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  <span>{suggestion.votes.up}</span>
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote(suggestion.id, 'down')}
                                  className="h-8 px-2"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  <span>{suggestion.votes.down}</span>
                                </Button>
                              </div>
                              
                              {suggestion.visibility === 'public' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setupResponseForm(suggestion.id)}
                                  className="h-8 px-2 ml-auto"
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  <span>Respond</span>
                                </Button>
                              )}
                            </div>
                            
                            {suggestion.responses.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <h4 className="text-sm font-medium">Responses</h4>
                                
                                <div className="space-y-3">
                                  {suggestion.responses.map(response => (
                                    <div key={response.id} className="bg-muted/20 p-3 rounded-md">
                                      <div className="flex items-center gap-2 mb-1">
                                        {response.fromStaff ? (
                                          <Badge variant="outline" className="text-xs">Staff</Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-xs">Student</Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(response.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm">{response.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {responseForm.suggestionId === suggestion.id && (
                              <div className="pt-2">
                                <form onSubmit={handleSubmitResponse} className="space-y-3">
                                  <Textarea
                                    value={responseForm.content}
                                    onChange={handleResponseFormChange}
                                    placeholder="Add your response..."
                                    className="min-h-[100px]"
                                  />
                                  
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setResponseForm({ suggestionId: '', content: '' })}
                                    >
                                      Cancel
                                    </Button>
                                    
                                    <Button
                                      type="submit"
                                      size="sm"
                                      disabled={isLoading || !responseForm.content.trim()}
                                    >
                                      {isLoading ? (
                                        <>
                                          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                          Submitting...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="mr-2 h-3 w-3" />
                                          Submit Response
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

