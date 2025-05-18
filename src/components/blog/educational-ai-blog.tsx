'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Edit, 
  Eye, 
  Filter, 
  Heart, 
  MessageSquare, 
  MoreHorizontal, 
  Search, 
  Share2, 
  Tag, 
  ThumbsUp, 
  Bookmark,
  BookmarkPlus,
  Sparkles,
  Lightbulb,
  Zap,
  Award,
  TrendingUp,
  User,
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for demonstration
const featuredPosts = [
  {
    id: 1,
    title: "AI-Powered Differentiation: Transforming Inclusive Education",
    excerpt: "Explore how artificial intelligence is revolutionizing differentiated instruction in UK classrooms, providing personalized support for all learners.",
    author: {
      name: "Dr. Emma Wilson",
      avatar: "/avatars/emma-wilson.jpg",
      role: "Educational Psychologist"
    },
    publishedAt: "2025-05-15",
    readTime: "8 min read",
    category: "Inclusive Education",
    tags: ["AI", "Differentiation", "Inclusion", "Personalized Learning"],
    featured: true,
    image: "/blog/ai-differentiation.jpg",
    likes: 124,
    comments: 32,
    views: 1850,
    curriculum: ["SEND", "Inclusive Practice"],
    ageRange: ["KS2", "KS3", "KS4"]
  },
  {
    id: 2,
    title: "Evidence-Based Approaches to Supporting Executive Function",
    excerpt: "A comprehensive review of research-backed strategies for developing executive function skills in primary and secondary education.",
    author: {
      name: "Prof. James Thompson",
      avatar: "/avatars/james-thompson.jpg",
      role: "Cognitive Psychologist"
    },
    publishedAt: "2025-05-10",
    readTime: "12 min read",
    category: "Cognitive Development",
    tags: ["Executive Function", "Working Memory", "Self-Regulation", "Metacognition"],
    featured: true,
    image: "/blog/executive-function.jpg",
    likes: 98,
    comments: 27,
    views: 1420,
    curriculum: ["PSHE", "Learning Skills"],
    ageRange: ["KS1", "KS2", "KS3"]
  },
  {
    id: 3,
    title: "The Future of Assessment: Beyond Traditional Testing",
    excerpt: "How innovative assessment approaches are providing richer insights into student learning while reducing test anxiety and promoting growth mindset.",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "/avatars/sarah-chen.jpg",
      role: "Assessment Specialist"
    },
    publishedAt: "2025-05-08",
    readTime: "10 min read",
    category: "Assessment",
    tags: ["Formative Assessment", "Alternative Assessment", "Growth Mindset", "Feedback"],
    featured: true,
    image: "/blog/future-assessment.jpg",
    likes: 87,
    comments: 19,
    views: 1280,
    curriculum: ["Assessment", "Pedagogy"],
    ageRange: ["All Phases"]
  }
];

const recentPosts = [
  {
    id: 4,
    title: "Building Emotional Literacy Through Digital Storytelling",
    excerpt: "Practical strategies for using digital storytelling tools to develop emotional vocabulary and self-awareness in primary students.",
    author: {
      name: "Olivia Parker",
      avatar: "/avatars/olivia-parker.jpg",
      role: "Primary Educator"
    },
    publishedAt: "2025-05-05",
    readTime: "7 min read",
    category: "Social-Emotional Learning",
    tags: ["Emotional Literacy", "Digital Storytelling", "Primary Education"],
    image: "/blog/emotional-literacy.jpg",
    likes: 76,
    comments: 15,
    views: 980,
    curriculum: ["PSHE", "English"],
    ageRange: ["EYFS", "KS1", "KS2"]
  },
  {
    id: 5,
    title: "Neurodiversity in the Digital Classroom: Creating Inclusive Spaces",
    excerpt: "Best practices for designing digital learning environments that support and celebrate neurodivergent learners.",
    author: {
      name: "Dr. Michael Rivera",
      avatar: "/avatars/michael-rivera.jpg",
      role: "Neurodiversity Specialist"
    },
    publishedAt: "2025-05-03",
    readTime: "9 min read",
    category: "Neurodiversity",
    tags: ["ADHD", "Autism", "Dyslexia", "Digital Accessibility"],
    image: "/blog/neurodiversity-classroom.jpg",
    likes: 112,
    comments: 28,
    views: 1560,
    curriculum: ["SEND", "Digital Literacy"],
    ageRange: ["All Phases"]
  },
  {
    id: 6,
    title: "Restorative Practices in the Digital Age",
    excerpt: "How technology can enhance restorative approaches to behavior and relationship-building in schools.",
    author: {
      name: "Aisha Johnson",
      avatar: "/avatars/aisha-johnson.jpg",
      role: "Restorative Practice Consultant"
    },
    publishedAt: "2025-05-01",
    readTime: "11 min read",
    category: "Behavior Management",
    tags: ["Restorative Justice", "Digital Tools", "School Culture"],
    image: "/blog/restorative-practices.jpg",
    likes: 94,
    comments: 22,
    views: 1320,
    curriculum: ["PSHE", "Citizenship"],
    ageRange: ["KS2", "KS3", "KS4"]
  },
  {
    id: 7,
    title: "Metacognition: Teaching Students How to Learn",
    excerpt: "Research-informed strategies for developing metacognitive skills across the curriculum.",
    author: {
      name: "Prof. David Williams",
      avatar: "/avatars/david-williams.jpg",
      role: "Learning Scientist"
    },
    publishedAt: "2025-04-28",
    readTime: "10 min read",
    category: "Learning Strategies",
    tags: ["Metacognition", "Self-Regulation", "Study Skills"],
    image: "/blog/metacognition.jpg",
    likes: 88,
    comments: 17,
    views: 1240,
    curriculum: ["Cross-Curricular"],
    ageRange: ["KS2", "KS3", "KS4"]
  }
];

const categories = [
  { name: "Inclusive Education", count: 24 },
  { name: "Assessment", count: 18 },
  { name: "Social-Emotional Learning", count: 32 },
  { name: "Cognitive Development", count: 15 },
  { name: "Behavior Management", count: 21 },
  { name: "Learning Strategies", count: 27 },
  { name: "Neurodiversity", count: 19 },
  { name: "Educational Technology", count: 23 },
  { name: "Professional Development", count: 16 }
];

const popularTags = [
  { name: "AI", count: 42 },
  { name: "Inclusion", count: 38 },
  { name: "Differentiation", count: 35 },
  { name: "Growth Mindset", count: 31 },
  { name: "Metacognition", count: 29 },
  { name: "Feedback", count: 27 },
  { name: "SEND", count: 25 },
  { name: "Wellbeing", count: 24 },
  { name: "Assessment", count: 22 },
  { name: "Digital Literacy", count: 21 }
];

const curriculumAreas = [
  { name: "SEND", count: 45 },
  { name: "PSHE", count: 38 },
  { name: "English", count: 32 },
  { name: "Mathematics", count: 28 },
  { name: "Science", count: 25 },
  { name: "Digital Literacy", count: 22 },
  { name: "Cross-Curricular", count: 37 }
];

const ageRanges = [
  { name: "EYFS", count: 28 },
  { name: "KS1", count: 35 },
  { name: "KS2", count: 42 },
  { name: "KS3", count: 38 },
  { name: "KS4", count: 31 },
  { name: "Post-16", count: 24 },
  { name: "All Phases", count: 29 }
];

const EducationalAIBlog = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would trigger a search
    console.log("Searching for:", searchQuery);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const handleCurriculumSelect = (curriculum) => {
    setSelectedCurriculum(curriculum === selectedCurriculum ? null : curriculum);
  };

  const handleAgeRangeSelect = (ageRange) => {
    setSelectedAgeRange(ageRange === selectedAgeRange ? null : ageRange);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSelectedCurriculum(null);
    setSelectedAgeRange(null);
    setSearchQuery("");
  };

  const renderFeaturedPosts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{post.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {post.publishedAt}
                </div>
              </div>
              <CardTitle className="text-xl mt-2 line-clamp-2">
                <a href={`/blog/post/${post.id}`} className="hover:underline">
                  {post.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPostList = (posts) => (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 h-48 md:h-auto relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-3/4 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.publishedAt}
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">
                  <a href={`/blog/post/${post.id}`} className="hover:underline">
                    {post.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.comments}
                  </div>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSidebar = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.name} 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    selectedCategory === category.name ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <span className="text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag.name} 
                variant={selectedTag === tag.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagSelect(tag.name)}
              >
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {curriculumAreas.map((area) => (
              <div 
                key={area.name} 
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                  selectedCurriculum === area.name ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleCurriculumSelect(area.name)}
              >
                <span className="text-sm">{area.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {area.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Ranges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ageRanges.map((range) => (
              <Badge 
                key={range.name} 
                variant={selectedAgeRange === range.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleAgeRangeSelect(range.name)}
              >
                {range.name} ({range.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {(selectedCategory || selectedTag || selectedCurriculum || selectedAgeRange || searchQuery) && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Educational AI Blog</h1>
        <p className="text-muted-foreground mt-2">
          Evidence-based insights, research, and best practices for educational professionals
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Most Popular</DropdownMenuItem>
              <DropdownMenuItem>Most Commented</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-8">
            {activeTab === "featured" && renderFeaturedPosts()}
            {activeTab === "all" && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Featured Posts</h2>
                    <Button variant="link" className="text-sm">
                      View all featured
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  {renderFeaturedPosts()}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Recent Posts</h2>
                    <Button variant="link" className="text-sm">
                      View all recent
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  {renderPostList(recentPosts)}
                </div>
              </>
            )}
            {activeTab === "recent" && renderPostList(recentPosts)}
            {activeTab === "popular" && renderPostList([...recentPosts].sort((a, b) => b.views - a.views))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </div>
        
        <div>
          {renderSidebar()}
        </div>
      </div>
      
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI-Assisted Content Creation
            </CardTitle>
            <CardDescription>
              Use our AI tools to help create, edit, and enhance your educational blog posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    Topic Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Generate evidence-based topic ideas aligned with educational trends
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Try It</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Content Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Get AI help with drafting, editing, and enhancing your blog content
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Try It</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-500" />
                    Research Helper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Find relevant research, citations, and evidence to support your writing
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Try It</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Contribute to the Educational Community</CardTitle>
            <CardDescription>
              Share your expertise, research, and best practices with educators across the UK
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Submit an Article</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your educational insights and research findings
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Become a Regular Contributor</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply to join our team of educational experts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Suggest Topics</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommend topics you'd like to see covered
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline">
                Learn More About Contributing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationalAIBlog;
