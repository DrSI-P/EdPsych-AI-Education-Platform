'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Search, Grid3X3, List, Filter, Plus, VrHeadset, Gamepad2, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';

export default function ImmersiveLearning() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('experiences');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedKeyStage, setSelectedKeyStage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data for immersive learning experiences
  const mockExperiences = [
    {
      id: '1',
      title: 'Ancient Egypt Virtual Tour',
      description: 'Explore the pyramids, temples, and daily life in ancient Egypt through an interactive 3D environment.',
      subject: 'History',
      keyStage: 'KS2',
      type: 'Virtual Reality',
      author: 'Dr. Emma Johnson',
      lastUpdated: '2025-03-15',
      duration: 25,
      interactions: 12,
      rating: 4.8,
      reviews: 24,
      thumbnail: '/images/ancient-egypt.jpg',
      accessibility: ['Screen Reader Compatible', 'Subtitles', 'Audio Description']
    },
    {
      id: '2',
      title: 'Cell Biology Explorer',
      description: 'Journey inside a human cell to discover organelles and cellular processes through interactive 3D models.',
      subject: 'Science',
      keyStage: 'KS3',
      type: 'Augmented Reality',
      author: 'Prof. Michael Smith',
      lastUpdated: '2025-02-20',
      duration: 30,
      interactions: 15,
      rating: 4.7,
      reviews: 18,
      thumbnail: '/images/cell-biology.jpg',
      accessibility: ['Screen Reader Compatible', 'Color Blind Mode']
    },
    {
      id: '3',
      title: 'Shakespearean Theatre Experience',
      description: 'Step onto the stage of the Globe Theatre and experience Shakespeare\'s plays as they were originally performed.',
      subject: 'English',
      keyStage: 'KS4',
      type: 'Virtual Reality',
      author: 'Dr. Sarah Williams',
      lastUpdated: '2025-01-05',
      duration: 40,
      interactions: 8,
      rating: 4.9,
      reviews: 32,
      thumbnail: '/images/shakespeare.jpg',
      accessibility: ['Subtitles', 'Audio Description', 'Simplified Controls']
    },
    {
      id: '4',
      title: 'Geometry in Motion',
      description: 'Manipulate 3D shapes and explore geometric principles through interactive puzzles and challenges.',
      subject: 'Mathematics',
      keyStage: 'KS2',
      type: 'Interactive 3D',
      author: 'Prof. James Thompson',
      lastUpdated: '2025-04-10',
      duration: 20,
      interactions: 25,
      rating: 4.6,
      reviews: 15,
      thumbnail: '/images/geometry.jpg',
      accessibility: ['Screen Reader Compatible', 'Voice Control']
    },
    {
      id: '5',
      title: 'Chemical Reactions Lab',
      description: 'Conduct virtual chemistry experiments and observe reactions in a safe, interactive environment.',
      subject: 'Chemistry',
      keyStage: 'KS4',
      type: 'Simulation',
      author: 'Dr. Rebecca Brown',
      lastUpdated: '2025-03-22',
      duration: 35,
      interactions: 18,
      rating: 4.5,
      reviews: 22,
      thumbnail: '/images/chemistry-lab.jpg',
      accessibility: ['Color Blind Mode', 'Simplified Controls']
    },
    {
      id: '6',
      title: 'Early Years Phonics Adventure',
      description: 'A playful, immersive world where young learners can explore letter sounds and early reading skills.',
      subject: 'English',
      keyStage: 'EYFS',
      type: 'Gamified Learning',
      author: 'Ms. Laura Davies',
      lastUpdated: '2025-02-28',
      duration: 15,
      interactions: 30,
      rating: 4.9,
      reviews: 28,
      thumbnail: '/images/phonics.jpg',
      accessibility: ['Audio Description', 'Voice Control', 'Simplified Controls']
    }
  ];

  // Mock data for learning tools
  const mockTools = [
    {
      id: '1',
      title: 'AI Learning Companion',
      description: 'Personalized AI tutor that adapts to individual learning styles and provides tailored support.',
      subject: 'Cross-curricular',
      keyStage: 'All',
      type: 'AI Tool',
      author: 'EdPsych AI Team',
      lastUpdated: '2025-04-05',
      features: ['Personalized Feedback', 'Progress Tracking', 'Voice Interaction'],
      rating: 4.8,
      reviews: 42,
      thumbnail: '/images/ai-companion.jpg'
    },
    {
      id: '2',
      title: 'Concept Mapper Pro',
      description: 'Interactive tool for creating visual mind maps and concept connections with 3D visualization.',
      subject: 'Cross-curricular',
      keyStage: 'KS3-KS5',
      type: 'Visualization Tool',
      author: 'Learning Tech Solutions',
      lastUpdated: '2025-03-12',
      features: ['3D Visualization', 'Collaboration', 'Export Options'],
      rating: 4.6,
      reviews: 35,
      thumbnail: '/images/concept-mapper.jpg'
    },
    {
      id: '3',
      title: 'Science Simulation Kit',
      description: 'Create and run virtual science experiments across physics, chemistry, and biology.',
      subject: 'Science',
      keyStage: 'KS2-KS4',
      type: 'Simulation Tool',
      author: 'Virtual Labs Inc.',
      lastUpdated: '2025-02-18',
      features: ['Experiment Builder', 'Data Analysis', 'Safety Controls'],
      rating: 4.7,
      reviews: 29,
      thumbnail: '/images/science-kit.jpg'
    },
    {
      id: '4',
      title: 'Historical Timeline Creator',
      description: 'Build interactive, multimedia timelines for historical events and periods.',
      subject: 'History',
      keyStage: 'KS2-KS5',
      type: 'Visualization Tool',
      author: 'Chronos Educational',
      lastUpdated: '2025-01-25',
      features: ['Media Integration', 'Comparative Analysis', 'Presentation Mode'],
      rating: 4.5,
      reviews: 31,
      thumbnail: '/images/timeline.jpg'
    }
  ];

  // Filter experiences based on selected filters
  const filteredExperiences = mockExperiences.filter(exp => {
    const matchesSubject = selectedSubject === 'all' || exp.subject === selectedSubject;
    const matchesKeyStage = selectedKeyStage === 'all' || exp.keyStage === selectedKeyStage;
    const matchesType = selectedType === 'all' || exp.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesKeyStage && matchesType && matchesSearch;
  });

  // Filter tools based on selected filters
  const filteredTools = mockTools.filter(tool => {
    const matchesSubject = selectedSubject === 'all' || tool.subject === selectedSubject || tool.subject === 'Cross-curricular';
    const matchesKeyStage = selectedKeyStage === 'all' || tool.keyStage === selectedKeyStage || tool.keyStage === 'All';
    const matchesType = selectedType === 'all' || tool.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesKeyStage && matchesType && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would trigger an API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Immersive Learning</h1>
          <p className="text-muted-foreground mt-2">
            Explore interactive, immersive learning experiences and tools
          </p>
        </div>
        
        {session && (
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/immersive-learning/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Experience
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                    <SelectItem value="Computing">Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Key Stage</label>
                <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Key Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Key Stages</SelectItem>
                    <SelectItem value="EYFS">Early Years (EYFS)</SelectItem>
                    <SelectItem value="KS1">Key Stage 1</SelectItem>
                    <SelectItem value="KS2">Key Stage 2</SelectItem>
                    <SelectItem value="KS3">Key Stage 3</SelectItem>
                    <SelectItem value="KS4">Key Stage 4</SelectItem>
                    <SelectItem value="KS5">Key Stage 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Virtual Reality">Virtual Reality</SelectItem>
                    <SelectItem value="Augmented Reality">Augmented Reality</SelectItem>
                    <SelectItem value="Interactive 3D">Interactive 3D</SelectItem>
                    <SelectItem value="Simulation">Simulation</SelectItem>
                    <SelectItem value="Gamified Learning">Gamified Learning</SelectItem>
                    <SelectItem value="AI Tool">AI Tool</SelectItem>
                    <SelectItem value="Visualization Tool">Visualization Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Accessibility Features</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Features" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Features</SelectItem>
                    <SelectItem value="screen-reader">Screen Reader Compatible</SelectItem>
                    <SelectItem value="subtitles">Subtitles</SelectItem>
                    <SelectItem value="audio-description">Audio Description</SelectItem>
                    <SelectItem value="color-blind">Color Blind Mode</SelectItem>
                    <SelectItem value="voice-control">Voice Control</SelectItem>
                    <SelectItem value="simplified">Simplified Controls</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => {
                  setSelectedSubject('all');
                  setSelectedKeyStage('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search immersive learning experiences..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs for Content Types */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="experiences" className="flex items-center">
                <VrHeadset className="mr-2 h-4 w-4" />
                Learning Experiences
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Interactive Tools
              </TabsTrigger>
              {session && (
                <TabsTrigger value="my-content" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Content
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Learning Experiences Tab */}
            <TabsContent value="experiences" className="mt-6">
              {filteredExperiences.length === 0 ? (
                <div className="text-center py-12">
                  <VrHeadset className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No learning experiences found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExperiences.map((exp) => (
                    <Card key={exp.id} className="overflow-hidden flex flex-col h-full">
                      <div className="h-48 bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <VrHeadset className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="flex items-center">
                            <VrHeadset className="mr-1 h-3 w-3" />
                            {exp.type}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            <Link href={`/immersive-learning/experiences/${exp.id}`} className="hover:underline">
                              {exp.title}
                            </Link>
                          </CardTitle>
                        </div>
                        <CardDescription>{exp.subject} • {exp.keyStage}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {exp.description}
                        </p>
                        <div className="flex items-center mt-4 space-x-4">
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {exp.duration} min
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {exp.rating} ★
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground mb-1">Accessibility:</p>
                          <div className="flex flex-wrap gap-1">
                            {exp.accessibility.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {exp.accessibility.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{exp.accessibility.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {exp.lastUpdated}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/immersive-learning/experiences/${exp.id}`}>
                              Launch
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExperiences.map((exp) => (
                    <Card key={exp.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-32 md:h-auto bg-muted relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <VrHeadset className="h-12 w-12 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold">
                                  <Link href={`/immersive-learning/experiences/${exp.id}`} className="hover:underline">
                                    {exp.title}
                                  </Link>
                                </h3>
                                <Badge className="ml-2" variant="secondary">
                                  {exp.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {exp.subject} • {exp.keyStage} • {exp.duration} min
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm">
                              <Badge variant="outline">{exp.rating} ★ ({exp.reviews} reviews)</Badge>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-muted-foreground">
                            {exp.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {exp.accessibility.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/immersive-learning/experiences/${exp.id}`}>
                                Launch Experience
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredExperiences.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center mx-4">
                      <span className="text-sm">
                        Page {currentPage} of {Math.ceil(filteredExperiences.length / 6)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredExperiences.length / 6), currentPage + 1))}
                      disabled={currentPage === Math.ceil(filteredExperiences.length / 6)}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            {/* Interactive Tools Tab */}
            <TabsContent value="tools" className="mt-6">
              {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                  <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No interactive tools found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="overflow-hidden flex flex-col h-full">
                      <div className="h-48 bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="flex items-center">
                            {tool.type}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            <Link href={`/immersive-learning/tools/${tool.id}`} className="hover:underline">
                              {tool.title}
                            </Link>
                          </CardTitle>
                        </div>
                        <CardDescription>{tool.subject} • {tool.keyStage}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground mb-1">Key Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {tool.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tool.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex justify-between items-center w-full">
                          <Badge variant="outline">{tool.rating} ★</Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/immersive-learning/tools/${tool.id}`}>
                              Open Tool
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-32 md:h-auto bg-muted relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="h-12 w-12 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-semibold">
                                  <Link href={`/immersive-learning/tools/${tool.id}`} className="hover:underline">
                                    {tool.title}
                                  </Link>
                                </h3>
                                <Badge className="ml-2" variant="secondary">
                                  {tool.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {tool.subject} • {tool.keyStage}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm">
                              <Badge variant="outline">{tool.rating} ★ ({tool.reviews} reviews)</Badge>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {tool.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/immersive-learning/tools/${tool.id}`}>
                                Open Tool
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredTools.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center mx-4">
                      <span className="text-sm">
                        Page {currentPage} of {Math.ceil(filteredTools.length / 4)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredTools.length / 4), currentPage + 1))}
                      disabled={currentPage === Math.ceil(filteredTools.length / 4)}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            {/* My Content Tab */}
            {session && (
              <TabsContent value="my-content" className="mt-6">
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">My Immersive Learning Content</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your created experiences and tools will be displayed here.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/immersive-learning/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Experience
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
