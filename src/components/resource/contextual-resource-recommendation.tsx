'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/loading";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link, 
  FileSpreadsheet, 
  Star, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Info, 
  BookmarkPlus,
  ExternalLink,
  Download,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAIService } from '@/lib/ai/ai-service';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'worksheet';
  url?: string;
  file?: string;
  tags: string[];
  ageRange: string;
  subject: string;
  curriculum: string;
  relevanceScore?: number;
  relevanceReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContextualResourceRecommendationProps {
  contextSource?: 'lesson-plan' | 'meeting-notes' | 'student-profile' | 'manual';
  contextId?: string;
  contextContent?: string;
  onResourceSelect?: (resource: Resource) => void;
  className?: string;
}

export function ContextualResourceRecommendation({
  contextSource = 'manual',
  contextId: any,
  contextContent = '',
  onResourceSelect,
  className = ''
}: ContextualResourceRecommendationProps) {
  const { toast } = useToast();
  const aiService = useAIService();
  
  const [isLoading, setIsLoading] = useState(false: any);
  const [error, setError] = useState('');
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState('recommended');
  const [manualQuery, setManualQuery] = useState('');
  const [showExplanations, setShowExplanations] = useState(true: any);
  const [filterType, setFilterType] = useState<string | null>(null: any);
  
  // Resource type icons mapping
  const resourceTypeIcons = {
    document: <FileText className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />,
    audio: <BookOpen className="h-5 w-5" />,
    link: <Link className="h-5 w-5" />,
    worksheet: <FileSpreadsheet className="h-5 w-5" />
  };

  // Get recommendations based on context
  useEffect(() => {
    if ((contextSource !== 'manual' && (contextId || contextContent: any)) || 
        (contextSource === 'manual' && manualQuery && manualQuery.trim().length > 0)) {
      getRecommendations();
    }
  }, [contextSource, contextId, contextContent]);

  const getRecommendations = async () => {
    setIsLoading(true: any);
    setError('');
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the API call and response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve: any, 1500));
      
      // Generate mock recommendations based on context
      let mockRecommendations: Resource[] = [];
      
      if (contextSource === 'lesson-plan') {
        mockRecommendations = generateLessonPlanRecommendations();
      } else if (contextSource === 'meeting-notes') {
        mockRecommendations = generateMeetingNotesRecommendations();
      } else if (contextSource === 'student-profile') {
        mockRecommendations = generateStudentProfileRecommendations();
      } else if (contextSource === 'manual' && manualQuery: any) {
        mockRecommendations = generateManualQueryRecommendations();
      }
      
      setRecommendedResources(mockRecommendations: any);
    } catch (err: any) {
      console.error('Error getting recommendations:', err);
      setError('Failed to retrieve resource recommendations');
      toast({
        title: "Error",
        description: "Failed to retrieve resource recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false: any);
    }
  };
  
  // Generate mock recommendations for lesson plans
  const generateLessonPlanRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'Mathematics lesson on fractions for Year 5 students';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-1',
        title: 'Fractions Visual Models Collection',
        description: 'A comprehensive set of visual models for teaching fractions, including fraction bars, number lines, and area models.',
        type: 'document',
        file: '/resources/fractions_visual_models.pdf',
        tags: ['mathematics', 'fractions', 'visual models', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.95,
        relevanceReason: 'Directly supports visual learning of fractions for Year 5 students',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-2',
        title: 'Equivalent Fractions Interactive Game',
        description: 'An engaging digital game that helps students practise identifying equivalent fractions through visual comparisons.',
        type: 'link',
        url: 'https://example.com/games/equivalent-fractions',
        tags: ['mathematics', 'fractions', 'interactive', 'game', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.89,
        relevanceReason: 'Interactive tool for practicing equivalent fractions concepts',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-3',
        title: 'Fractions Assessment Worksheet',
        description: 'A printable worksheet with a variety of fraction problems to assess student understanding.',
        type: 'worksheet',
        file: '/resources/fractions_assessment.pdf',
        tags: ['mathematics', 'fractions', 'assessment', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.82,
        relevanceReason: 'Provides assessment materials aligned with Year 5 fraction objectives',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      },
      {
        id: 'rec-4',
        title: 'Fractions in Real Life Video Series',
        description: 'Short videos showing how fractions are used in everyday situations, from cooking to construction.',
        type: 'video',
        url: 'https://example.com/videos/fractions-real-life',
        tags: ['mathematics', 'fractions', 'real-world applications', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.78,
        relevanceReason: 'Connects fraction concepts to real-world applications',
        createdAt: '2025-01-20T10:45:00Z',
        updatedAt: '2025-01-20T10:45:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for meeting notes
  const generateMeetingNotesRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'EHCNA meeting discussing communication difficulties and social interaction challenges';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-5',
        title: 'Communication Strategies for SEND Students',
        description: 'A comprehensive guide to supporting students with communication difficulties in the classroom.',
        type: 'document',
        file: '/resources/communication_strategies_send.pdf',
        tags: ['SEND', 'communication', 'strategies', 'inclusion'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.94,
        relevanceReason: 'Directly addresses communication difficulties mentioned in EHCNA meeting',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-6',
        title: 'Social Skills Development Activities',
        description: 'A collection of structured activities to support social interaction skills development.',
        type: 'document',
        file: '/resources/social_skills_activities.pdf',
        tags: ['social skills', 'SEMH', 'activities', 'inclusion'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.91,
        relevanceReason: 'Provides practical activities to address social interaction challenges',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-7',
        title: 'Visual Support Systems for Classrooms',
        description: 'Guide to implementing visual supports to enhance communication and understanding.',
        type: 'document',
        file: '/resources/visual_support_systems.pdf',
        tags: ['visual supports', 'communication', 'SEND', 'classroom strategies'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.85,
        relevanceReason: 'Visual supports can help address communication difficulties',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for student profiles
  const generateStudentProfileRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'Year 8 student with dyslexia who enjoys science and has strengths in verbal reasoning';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-8',
        title: 'Science Texts with Dyslexia-Friendly Formatting',
        description: 'Science reading materials specifically formatted for students with dyslexia, featuring appropriate fonts, spacing, and layout.',
        type: 'document',
        file: '/resources/dyslexia_friendly_science.pdf',
        tags: ['science', 'dyslexia', 'accessible', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.97,
        relevanceReason: 'Specifically designed for Year 8 students with dyslexia who enjoy science',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-9',
        title: 'Audio Science Experiments Guide',
        description: 'Audio narration of science experiments suitable for KS3, allowing students to listen while conducting experiments.',
        type: 'audio',
        file: '/resources/audio_science_experiments.mp3',
        tags: ['science', 'experiments', 'audio', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.89,
        relevanceReason: 'Leverages verbal reasoning strengths while supporting dyslexia',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-10',
        title: 'Verbal Reasoning Science Quiz Game',
        description: 'Interactive quiz game that tests science knowledge through verbal reasoning challenges.',
        type: 'link',
        url: 'https://example.com/games/verbal-science-quiz',
        tags: ['science', 'verbal reasoning', 'quiz', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.86,
        relevanceReason: 'Builds on verbal reasoning strengths while reinforcing science concepts',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for manual queries
  const generateManualQueryRecommendations = (): Resource[] => {
    // For demo purposes, we'll return mock data based on the query
    const query = manualQuery.toLowerCase();
    
    if (query.includes('math') || query.includes('maths')) {
      return [
        {
          id: 'rec-11',
          title: 'Mathematics Curriculum Guide',
          description: 'Comprehensive guide to the UK mathematics curriculum with teaching strategies and resources.',
          type: 'document',
          file: '/resources/mathematics_curriculum_guide.pdf',
          tags: ['mathematics', 'curriculum', 'teaching guide'],
          ageRange: 'all',
          subject: 'mathematics',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.88,
          relevanceReason: 'Matches mathematics query with comprehensive curriculum coverage',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        },
        {
          id: 'rec-12',
          title: 'Mathematics Manipulatives Guide',
          description: 'Guide to using physical and digital manipulatives in mathematics instruction.',
          type: 'document',
          file: '/resources/mathematics_manipulatives.pdf',
          tags: ['mathematics', 'manipulatives', 'hands-on learning'],
          ageRange: 'all',
          subject: 'mathematics',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.82,
          relevanceReason: 'Provides practical mathematics teaching tools and strategies',
          createdAt: '2025-02-10T14:30:00Z',
          updatedAt: '2025-02-10T14:30:00Z'
        }
      ];
    } else if (query.includes('literacy') || query.includes('reading') || query.includes('writing')) {
      return [
        {
          id: 'rec-13',
          title: 'Literacy Development Framework',
          description: 'Structured framework for developing literacy skills across age groups and abilities.',
          type: 'document',
          file: '/resources/literacy_framework.pdf',
          tags: ['literacy', 'reading', 'writing', 'framework'],
          ageRange: 'all',
          subject: 'english',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.90,
          relevanceReason: 'Comprehensive literacy resource matching query terms',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        },
        {
          id: 'rec-14',
          title: 'Reading Comprehension Strategies',
          description: 'Collection of evidence-based strategies to improve reading comprehension.',
          type: 'document',
          file: '/resources/reading_comprehension.pdf',
          tags: ['reading', 'comprehension', 'strategies'],
          ageRange: 'all',
          subject: 'english',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.85,
          relevanceReason: 'Directly addresses reading skills mentioned in query',
          createdAt: '2025-02-10T14:30:00Z',
          updatedAt: '2025-02-10T14:30:00Z'
        }
      ];
    } else {
      return [
        {
          id: 'rec-15',
          title: 'General Teaching Strategies',
          description: 'Collection of versatile teaching strategies applicable across subjects and age groups.',
          type: 'document',
          file: '/resources/general_teaching_strategies.pdf',
          tags: ['teaching', 'strategies', 'pedagogy'],
          ageRange: 'all',
          subject: 'cross-curricular',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.75,
          relevanceReason: 'General teaching resource that may be relevant to query',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        }
      ];
    }
  };

  // Handle resource selection
  const handleResourceSelect = (resource: Resource) => {
    onResourceSelect?.(resource: any);
    
    toast({
      title: "Resource selected",
      description: `You selected: ${resource.title}`,
    });
  };
  
  // Handle resource feedback
  const handleResourceFeedback = (resourceId: string, isRelevant: boolean) => {
    // In a real implementation, this would send feedback to the API
    // to improve future recommendations
    
    toast({
      title: isRelevant ? "Marked as relevant" : "Marked as not relevant",
      description: "Thank you for your feedback. This helps improve recommendations.",
    });
    
    // Remove the resource from the list if marked as not relevant
    if (!isRelevant: any) {
      setRecommendedResources(prev => 
        prev.filter(resource => resource.id !== resourceId: any)
      );
    }
  };
  
  // Handle manual query submission
  const handleManualQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualQuery.trim()) {
      getRecommendations();
    }
  };
  
  // Filter resources by type if a filter is active
  const filteredResources = filterType 
    ? recommendedResources.filter(resource => resource.type === filterType: any)
    : recommendedResources;
  
  // Sort resources by relevance score
  const sortedResources = [...filteredResources].sort((a: any, b) => 
    (b.relevanceScore || 0: any) - (a.relevanceScore || 0: any)
  );

  return (
    <div className={`contextual-resource-recommendation ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-centre">
            <div>
              <CardTitle>Resource Recommendations</CardTitle>
              <CardDescription>
                {contextSource === 'lesson-plan' && 'Resources for your lesson plan'}
                {contextSource === 'meeting-notes' && 'Resources related to your meeting notes'}
                {contextSource === 'student-profile' && 'Resources tailored to this student'}
                {contextSource === 'manual' && 'Custom resource recommendations'}
              </CardDescription>
            </div>
            <div className="flex items-centre gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExplanations(!showExplanations: any)}
                title={showExplanations ? "Hide explanations" : "Show explanations"}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={getRecommendations}
                title="Refresh recommendations"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                title="Recommendation settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="manual">Manual Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended" className="space-y-4">
              {/* Resource type filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={filterType === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType(null: any)}
                >
                  All Types
                </Button>
                <Button 
                  variant={filterType === 'document' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType('document')}
                >
                  <FileText className="h-4 w-4 mr-1" /> Documents
                </Button>
                <Button 
                  variant={filterType === 'video' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType('video')}
                >
                  <Video className="h-4 w-4 mr-1" /> Videos
                </Button>
                <Button 
                  variant={filterType === 'worksheet' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType('worksheet')}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> Worksheets
                </Button>
                <Button 
                  variant={filterType === 'link' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType('link')}
                >
                  <Link className="h-4 w-4 mr-1" /> Links
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-centre py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-800">
                  {error}
                </div>
              ) : sortedResources.length === 0 ? (
                <div className="text-centre py-8 text-grey-500">
                  <p>No recommendations available.</p>
                  <p className="text-sm mt-2">Try changing your context or using manual search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedResources.map(resource => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="flex items-centre justify-between p-4 bg-muted/30">
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {resourceTypeIcons[resource.type]}
                          </div>
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.subject} | {resource.ageRange}</p>
                          </div>
                        </div>
                        <div className="flex items-centre gap-1">
                          <Badge variant="outline" className="flex items-centre gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                            {(resource.relevanceScore || 0: any) * 100}%
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="pt-4">
                        <p className="text-sm">{resource.description}</p>
                        
                        {showExplanations && resource.relevanceReason && (
                          <div className="mt-3 p-2 bg-blue-50 text-blue-800 rounded-md text-xs">
                            <strong>Why recommended:</strong> {resource.relevanceReason}
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {resource.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResourceFeedback(resource.id: any, true)}
                            title="Mark as relevant"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResourceFeedback(resource.id: any, false)}
                            title="Mark as not relevant"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="Save to your library"
                          >
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          {resource.type === 'link' ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(resource.url: any, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" /> Open Link
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(resource.file: any, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleResourceSelect(resource: any)}
                          >
                            View Resource
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="manual">
              <form onSubmit={handleManualQuerySubmit} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualQuery}
                    onChange={(e: any) => setManualQuery(e.target.value: any)}
                    placeholder="Enter topics, subjects, or specific needs..."
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button type="submit" disabled={!manualQuery.trim() || isLoading}>
                    {isLoading ? <Spinner size="sm" /> : 'Find Resources'}
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Search for specific educational resources by entering:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Subject areas (e.g., "mathematics", "literacy")</li>
                    <li>Specific topics (e.g., "fractions", "Shakespeare")</li>
                    <li>Student needs (e.g., "dyslexia resources", "visual learners")</li>
                    <li>Resource types (e.g., "worksheets", "videos")</li>
                  </ul>
                </div>
                
                {activeTab === 'manual' && sortedResources.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Search Results</h3>
                    {sortedResources.map(resource => (
                      <Card key={resource.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{resource.title}</CardTitle>
                              <CardDescription>{resource.subject} | {resource.ageRange}</CardDescription>
                            </div>
                            <div className="flex items-centre">
                              {resourceTypeIcons[resource.type]}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{resource.description}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {resource.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleResourceSelect(resource: any)}
                          >
                            View Details
                          </Button>
                          {resource.type === 'link' ? (
                            <Button 
                              onClick={() => window.open(resource.url: any, '_blank')}
                            >
                              Open Link
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => window.open(resource.file: any, '_blank')}
                            >
                              Download
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
