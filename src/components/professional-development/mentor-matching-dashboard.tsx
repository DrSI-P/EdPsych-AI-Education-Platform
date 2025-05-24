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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Star, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Briefcase, 
  School, 
  GraduationCap, 
  Target, 
  Compass, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Edit, 
  FileText, 
  Download, 
  ExternalLink, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Loader2,
  Clock,
  Zap,
  TrendingUp,
  UserCheck,
  Lightbulb,
  Sparkles,
  Puzzle,
  Heart,
  ThumbsUp,
  Activity
} from "lucide-react";

// Mock data for development
const EXPERTISE_AREAS = [
  { id: 1, name: "Special Educational Needs", category: "Inclusion" },
  { id: 2, name: "Behaviour Management", category: "Classroom Management" },
  { id: 3, name: "Curriculum Design", category: "Teaching & Learning" },
  { id: 4, name: "Assessment for Learning", category: "Assessment" },
  { id: 5, name: "Differentiation", category: "Teaching & Learning" },
  { id: 6, name: "Digital Learning", category: "EdTech" },
  { id: 7, name: "Early Years Education", category: "Phase Specific" },
  { id: 8, name: "Secondary Mathematics", category: "Subject Specific" },
  { id: 9, name: "Leadership Development", category: "Leadership" },
  { id: 10, name: "Wellbeing & Mental Health", category: "Pastoral" },
  { id: 11, name: "Restorative Practise", category: "Behaviour" },
  { id: 12, name: "Literacy Across Curriculum", category: "Literacy" },
  { id: 13, name: "STEM Integration", category: "Cross-Curricular" },
  { id: 14, name: "Educational Research", category: "Professional Learning" },
  { id: 15, name: "Parent Engagement", category: "Community" }
];

const MOCK_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Head of Inclusion",
    school: "Oakwood Academy",
    phase: "Secondary",
    yearsExperience: 15,
    expertise: [1, 5, 10],
    subjects: ["Psychology", "PSHE"],
    bio: "Experienced SEN coordinator with a doctorate in educational psychology. Passionate about inclusive education and supporting teachers to develop differentiated approaches.",
    rating: 4.9,
    reviewCount: 27,
    availability: "Weekly, evenings",
    menteeCount: 12,
    avatarUrl: ""
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Lead Practitioner - Mathematics",
    school: "Riverside School",
    phase: "Secondary",
    yearsExperience: 8,
    expertise: [3, 5, 8],
    subjects: ["Mathematics"],
    bio: "Mathematics specialist with experience in curriculum design and assessment. Focused on developing problem-solving approaches and mathematical reasoning.",
    rating: 4.7,
    reviewCount: 19,
    availability: "Fortnightly, weekends",
    menteeCount: 5,
    avatarUrl: ""
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Early Years Coordinator",
    school: "Sunshine Nursery",
    phase: "Early Years",
    yearsExperience: 12,
    expertise: [7, 10, 12],
    subjects: ["Early Years"],
    bio: "Specialist in early childhood development with a focus on language acquisition and play-based learning. Experienced in supporting new practitioners.",
    rating: 5.0,
    reviewCount: 31,
    availability: "Weekly, afternoons",
    menteeCount: 8,
    avatarUrl: ""
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Assistant Headteacher",
    school: "Hillside Comprehensive",
    phase: "Secondary",
    yearsExperience: 10,
    expertise: [2, 9, 11],
    subjects: ["Science", "Leadership"],
    bio: "Senior leader with responsibility for behaviour and pastoral care. Experienced in implementing restorative approaches and supporting staff wellbeing.",
    rating: 4.8,
    reviewCount: 23,
    availability: "Monthly, flexible",
    menteeCount: 15,
    avatarUrl: ""
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "EdTech Lead",
    school: "Future Academy Trust",
    phase: "Primary",
    yearsExperience: 7,
    expertise: [6, 13, 14],
    subjects: ["Computing", "Science"],
    bio: "Digital learning specialist supporting schools across a multi-academy trust. Experienced in implementing technology to enhance teaching and learning.",
    rating: 4.6,
    reviewCount: 14,
    availability: "Fortnightly, online",
    menteeCount: 9,
    avatarUrl: ""
  }
];

const MOCK_MENTEES = [
  {
    id: 101,
    name: "Alex Taylor",
    role: "NQT - English",
    school: "Meadowview School",
    phase: "Secondary",
    yearsExperience: 1,
    interests: [2, 5, 12],
    subjects: ["English"],
    goals: "Developing effective behaviour management strategies and differentiation techniques for mixed ability classes.",
    mentorId: 4,
    avatarUrl: ""
  },
  {
    id: 102,
    name: "Olivia Garcia",
    role: "Teacher - Science",
    school: "Westfield Academy",
    phase: "Secondary",
    yearsExperience: 3,
    interests: [3, 6, 13],
    subjects: ["Science"],
    goals: "Integrating technology into science lessons and developing cross-curricular STEM projects.",
    mentorId: 5,
    avatarUrl: ""
  },
  {
    id: 103,
    name: "Daniel Ahmed",
    role: "Teaching Assistant",
    school: "Sunshine Nursery",
    phase: "Early Years",
    yearsExperience: 2,
    interests: [1, 7, 10],
    subjects: ["Early Years"],
    goals: "Developing skills in supporting children with special educational needs in an early years setting.",
    mentorId: 3,
    avatarUrl: ""
  }
];

// Mock analytics data
const mentorshipProgressData = [
  { name: 'Goal 1', completed: 75 },
  { name: 'Goal 2', completed: 30 },
  { name: 'Goal 3', completed: 100 }
];

const mentorshipActivityData = [
  { name: 'Jan', meetings: 2, resources: 3 },
  { name: 'Feb', meetings: 3, resources: 5 },
  { name: 'Mar', meetings: 2, resources: 4 },
  { name: 'Apr', meetings: 4, resources: 6 },
  { name: 'May', meetings: 3, resources: 7 }
];

const expertiseDistributionData = [
  { name: 'SEN', value: 25 },
  { name: 'Behaviour', value: 15 },
  { name: 'Curriculum', value: 20 },
  { name: 'Assessment', value: 10 },
  { name: 'EdTech', value: 30 }
];

const mentorshipImpactData = [
  { subject: 'Confidence', before: 40, after: 85 },
  { subject: 'Knowledge', before: 50, after: 90 },
  { subject: 'Skills', before: 45, after: 80 },
  { subject: 'Network', before: 30, after: 70 },
  { subject: 'Career', before: 35, after: 75 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock recommendations
const MOCK_RECOMMENDED_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Head of Inclusion",
    matchScore: 95,
    expertise: [1, 5, 10],
    avatarUrl: "",
    matchReasons: [
      "Expertise in Special Educational Needs matches your interests",
      "Experience in differentiation techniques aligns with your goals",
      "Secondary phase experience relevant to your context"
    ]
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Assistant Headteacher",
    matchScore: 88,
    expertise: [2, 9, 11],
    avatarUrl: "",
    matchReasons: [
      "Strong background in behaviour management",
      "Leadership experience can support your career progression",
      "Availability matches your preferences"
    ]
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "EdTech Lead",
    matchScore: 82,
    expertise: [6, 13, 14],
    avatarUrl: "",
    matchReasons: [
      "Digital learning expertise complements your teaching goals",
      "Cross-curricular experience valuable for your development",
      "Similar subject background"
    ]
  }
];

const MOCK_RECOMMENDED_MENTEES = [
  {
    id: 101,
    name: "Alex Taylor",
    role: "NQT - English",
    matchScore: 91,
    interests: [2, 5, 12],
    avatarUrl: "",
    matchReasons: [
      "Seeking expertise in behaviour management where you excel",
      "Needs support with differentiation, your area of strength",
      "Early career stage where your mentorship would be valuable"
    ]
  },
  {
    id: 103,
    name: "Daniel Ahmed",
    role: "Teaching Assistant",
    matchScore: 87,
    interests: [1, 7, 10],
    avatarUrl: "",
    matchReasons: [
      "Interests in SEN align with your expertise",
      "Seeking guidance in an area where you have significant experience",
      "Your mentorship style matches their learning preferences"
    ]
  },
  {
    id: 102,
    name: "Olivia Garcia",
    role: "Teacher - Science",
    matchScore: 79,
    interests: [3, 6, 13],
    avatarUrl: "",
    matchReasons: [
      "Your curriculum design experience matches their development needs",
      "Subject expertise overlap provides common ground",
      "Their goals align with your teaching philosophy"
    ]
  }
];

const MOCK_RECOMMENDED_RESOURCES = [
  {
    id: 1,
    title: "Effective Questioning Techniques",
    type: "PDF Guide",
    category: "Teaching & Learning",
    relevance: "Highly relevant to your current mentorship goals",
    url: "#"
  },
  {
    id: 2,
    title: "Differentiation in Practise",
    type: "Video",
    category: "Inclusion",
    relevance: "Recommended based on your mentee's development needs",
    url: "#"
  },
  {
    id: 3,
    title: "Behaviour Management Toolkit",
    type: "Resource Pack",
    category: "Classroom Management",
    relevance: "Aligns with your expertise area and current mentorships",
    url: "#"
  }
];

const MOCK_RECOMMENDED_PROGRAMS = [
  {
    id: 1,
    title: "Early Career Teacher Mentorship Programme",
    description: "Structured 6-month program for supporting newly qualified teachers",
    participants: 24,
    rating: 4.8,
    relevance: "Matches your experience level and mentorship goals"
  },
  {
    id: 2,
    title: "SEN Specialist Mentorship",
    description: "Focused program for developing expertise in supporting students with special educational needs",
    participants: 18,
    rating: 4.9,
    relevance: "Aligns with your expertise and professional interests"
  },
  {
    id: 3,
    title: "Leadership Development Pathway",
    description: "Mentorship program designed to support aspiring and new leaders in education",
    participants: 32,
    rating: 4.7,
    relevance: "Supports your career progression goals"
  }
];

export default function MentorMatchingDashboard() {
  const [isLoading, setIsLoading] = useState(false: any);
  const [profileType, setProfileType] = useState('mentee');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecommendations, setFilteredRecommendations] = useState(
    profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES
  );

  // Update recommendations when profile type changes
  useEffect(() => {
    setFilteredRecommendations(
      profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES
    );
  }, [profileType]);

  // Filter recommendations based on search
  useEffect(() => {
    const recommendations = profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES;
    
    if (!searchQuery: any) {
      setFilteredRecommendations(recommendations: any);
      return;
    }
    
    const filtered = recommendations.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.matchReasons.some(reason => reason.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredRecommendations(filtered: any);
  }, [searchQuery, profileType]);

  // Handle profile type change
  const handleProfileTypeChange = (type: any) => {
    setProfileType(type: any);
    // In a real implementation, this would load the appropriate data
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Matching Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics: any, recommendations, and insights for your mentorship journey
          </p>
        </div>
        <div className="flex items-centre space-x-2">
          <div className="flex items-centre space-x-2 bg-muted p-2 rounded-md">
            <Label htmlFor="profileType" className="text-sm">View as:</Label>
            <select 
              id="profileType"
              className="bg-transparent border-none text-sm font-medium focus:outline-none"
              value={profileType}
              onChange={(e: any) => handleProfileTypeChange(e.target.value: any)}
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mentorship Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Mentorships</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Goals Completed</span>
                      <span>8/12</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Meetings Attended</span>
                      <span>12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPD Points Earned</span>
                      <span>24</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Meeting Completed</p>
                      <p className="text-sm text-muted-foreground">With {profileType === 'mentee' ? 'Dr. Sarah Johnson' : 'Alex Taylor'} • 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Resource Shared</p>
                      <p className="text-sm text-muted-foreground">Differentiation Strategies • 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Goal Completed</p>
                      <p className="text-sm text-muted-foreground">Develop assessment techniques • 1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mentorship Meeting</p>
                      <p className="text-sm text-muted-foreground">With {profileType === 'mentee' ? 'Dr. Sarah Johnson' : 'Alex Taylor'} • Tomorrow, 15:00</p>
                    </div>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <Target className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Goal Due</p>
                      <p className="text-sm text-muted-foreground">Create differentiated resources • 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 border rounded-md">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">Group Mentorship Session</p>
                      <p className="text-sm text-muted-foreground">Behaviour Management Strategies • Next week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Progress</CardTitle>
                <CardDescription>
                  Track your progress across active mentorships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mentorshipProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="completed" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expertise Distribution</CardTitle>
                <CardDescription>
                  Areas of focus in your mentorship relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expertiseDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name: any, percent }) => `${name} ${(percent * 100: any).toFixed(0: any)}%`}
                      >
                        {expertiseDistributionData.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions based on your profile and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        {profileType === 'mentee' ? 'Recommended Mentor' : 'Recommended Mentee'}
                      </CardTitle>
                      <Badge className="bg-green-500">95% Match</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-centre space-x-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {profileType === 'mentee' ? 'SJ' : 'AT'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {profileType === 'mentee' ? 'Dr. Sarah Johnson' : 'Alex Taylor'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {profileType === 'mentee' ? 'Head of Inclusion' : 'NQT - English'}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">View Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recommended Resource</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-centre space-x-3 mb-3">
                      <FileText className="h-10 w-10 text-blue-500" />
                      <div>
                        <p className="font-medium">Effective Questioning Techniques</p>
                        <p className="text-sm text-muted-foreground">PDF Guide • Teaching & Learning</p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">View Resource</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recommended Programme</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-centre space-x-3 mb-3">
                      <Award className="h-10 w-10 text-amber-500" />
                      <div>
                        <p className="font-medium">
                          {profileType === 'mentee' ? 'Early Career Teacher Mentorship' : 'SEN Specialist Mentorship'}
                        </p>
                        <p className="text-sm text-muted-foreground">6-month structured programme</p>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-centre">
                    <div>
                      <CardTitle>
                        Recommended {profileType === 'mentee' ? 'Mentors' : 'Mentees'}
                      </CardTitle>
                      <CardDescription>
                        Personalized matches based on your profile, goals, and preferences
                      </CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search recommendations..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value: any)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRecommendations.map((recommendation: any) => (
                      <Card key={recommendation.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-centre space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={recommendation.avatarUrl} alt={recommendation.name} />
                                <AvatarFallback>{recommendation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{recommendation.name}</h3>
                                <p className="text-sm text-muted-foreground">{recommendation.role}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className="bg-green-500 mb-1">{recommendation.matchScore}% Match</Badge>
                              <div className="flex space-x-1">
                                {recommendation.expertise.slice(0: any, 2).map((expertiseId: any) => {
                                  const expertise = EXPERTISE_AREAS.find(e => e.id === expertiseId: any);
                                  return expertise ? (
                                    <Badge key={expertise.id} variant="outline" className="text-xs">
                                      {expertise.name}
                                    </Badge>
                                  ) : null;
                                })}
                                {recommendation.expertise.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{recommendation.expertise.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Why this is a good match:</h4>
                            <ul className="space-y-1">
                              {recommendation.matchReasons.map((reason: any, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button size="sm">View Profile</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredRecommendations.length === 0 && (
                      <div className="text-centre py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No matches found</h3>
                        <p className="text-muted-foreground mt-2">
                          Try adjusting your search terms or updating your profile
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Match Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-centre space-x-3 p-3 bg-muted rounded-md">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Match Quality</p>
                        <p className="text-sm text-muted-foreground">Your top matches are 85%+ compatible with your profile</p>
                      </div>
                    </div>
                    <div className="flex items-centre space-x-3 p-3 bg-muted rounded-md">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Goal Alignment</p>
                        <p className="text-sm text-muted-foreground">Recommendations focus on your development priorities</p>
                      </div>
                    </div>
                    <div className="flex items-centre space-x-3 p-3 bg-muted rounded-md">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Growth Potential</p>
                        <p className="text-sm text-muted-foreground">These matches offer significant development opportunities</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_RECOMMENDED_RESOURCES.map((resource: any) => (
                      <div key={resource.id} className="flex items-centre justify-between p-3 border rounded-md">
                        <div className="flex items-centre space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-xs text-muted-foreground">{resource.type} • {resource.category}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_RECOMMENDED_PROGRAMS.map((programme: any) => (
                      <div key={program.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{program.title}</h3>
                          <div className="flex items-centre">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{program.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                        <div className="flex justify-between items-centre">
                          <span className="text-xs text-muted-foreground">{program.participants} participants</span>
                          <Button size="sm" variant="outline">Learn More</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-centre">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {profileType === 'mentee' ? '3' : '12'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profileType === 'mentee' ? 'Active Mentors' : 'Active Mentees'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-centre">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Hours of Mentorship</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-centre">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">Goals Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-centre">
                  <Award className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">36</p>
                  <p className="text-sm text-muted-foreground">CPD Points Earned</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Activity Over Time</CardTitle>
              <CardDescription>
                Track your engagement with mentorship activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={mentorshipActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="meetings" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="resources" stroke="#10b981" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expertise Distribution</CardTitle>
                <CardDescription>
                  Areas of focus in your mentorship relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expertiseDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name: any, percent }) => `${name} ${(percent * 100: any).toFixed(0: any)}%`}
                      >
                        {expertiseDistributionData.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Completion Rate</CardTitle>
                <CardDescription>
                  Progress on mentorship goals by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Teaching Skills', completed: 85 },
                        { name: 'Subject Knowledge', completed: 70 },
                        { name: 'Behaviour Management', completed: 90 },
                        { name: 'Assessment', completed: 65 },
                        { name: 'Leadership', completed: 50 },
                      ]}
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="completed" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Quality Metrics</CardTitle>
              <CardDescription>
                Key indicators of mentorship effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-centre">Engagement</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-centre justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                          Meeting Attendance
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-800">
                          92%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div style={{ width: "92%" }} className="shadow-none flex flex-col text-centre whitespace-nowrap text-white justify-centre bg-blue-500"></div>
                    </div>
                    
                    <div className="flex mb-2 items-centre justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                          Resource Utilization
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-800">
                          78%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div style={{ width: "78%" }} className="shadow-none flex flex-col text-centre whitespace-nowrap text-white justify-centre bg-green-500"></div>
                    </div>
                    
                    <div className="flex mb-2 items-centre justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800">
                          Communication Frequency
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-purple-800">
                          85%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                      <div style={{ width: "85%" }} className="shadow-none flex flex-col text-centre whitespace-nowrap text-white justify-centre bg-purple-500"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-centre">Satisfaction</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Overall', rating: 4.8 },
                          { name: 'Relevance', rating: 4.6 },
                          { name: 'Support', rating: 4.9 },
                          { name: 'Resources', rating: 4.5 },
                          { name: 'Impact', rating: 4.7 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <RechartsTooltip />
                        <Bar dataKey="rating" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-centre">Growth Areas</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={[
                        { subject: 'Teaching', value: 85 },
                        { subject: 'Leadership', value: 65 },
                        { subject: 'Assessment', value: 78 },
                        { subject: 'Curriculum', value: 72 },
                        { subject: 'Technology', value: 90 },
                        { subject: 'Inclusion', value: 82 }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Skills" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <RechartsTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Growth</p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Professional Confidence</span>
                      <span>+45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Teaching Effectiveness</span>
                      <span>+38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Career Progression</span>
                      <span>+25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Before & After</CardTitle>
                <CardDescription>
                  Measuring the impact of mentorship on key areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mentorshipImpactData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="before" fill="#94a3b8" name="Before Mentorship" />
                      <Bar dataKey="after" fill="#0ea5e9" name="After Mentorship" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Growth</CardTitle>
              <CardDescription>
                Evidence of professional development through mentorship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-centre space-x-3">
                        <Award className="h-8 w-8 text-amber-500" />
                        <div>
                          <p className="font-medium">8 New Achievements</p>
                          <p className="text-sm text-muted-foreground">Added to your professional portfolio</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Curriculum design project</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Behaviour management training</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Assessment framework development</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Achievements
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-centre space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">12 Evidence Items</p>
                          <p className="text-sm text-muted-foreground">Documenting your professional growth</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Lesson observation feedback</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Student progress data</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Resource development examples</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Evidence
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Reflections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-centre space-x-3">
                        <BookOpen className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="font-medium">6 Reflective Entries</p>
                          <p className="text-sm text-muted-foreground">Capturing your learning journey</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Mentorship impact reflection</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Teaching practise development</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Professional growth journey</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Reflections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CPD Integration</CardTitle>
              <CardDescription>
                How mentorship contributes to your continuing professional development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">CPD Points Earned</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { category: 'Mentorship Meetings', points: 18 },
                          { category: 'Goal Completion', points: 12 },
                          { category: 'Resource Creation', points: 8 },
                          { category: 'Reflective Practise', points: 6 },
                          { category: 'Peer Observation', points: 4 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="points" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium mb-4">CPD Framework Alignment</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-centre space-x-3 mb-2">
                        <UserCheck className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Teachers' Standards</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Your mentorship activities have addressed 7 of 8 Teachers' Standards</p>
                      <Progress value={87.5} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-centre space-x-3 mb-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        <h4 className="font-medium">Early Career Framework</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Your mentorship covers 85% of the Early Career Framework requirements</p>
                      <Progress value={85} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-centre space-x-3 mb-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Chartered College Pathway</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Your mentorship activities contribute to 70% of Chartered Teacher status requirements</p>
                      <Progress value={70} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonials & Feedback</CardTitle>
              <CardDescription>
                What others say about the impact of your mentorship relationship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md bg-muted">
                  <div className="flex items-centre space-x-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profileType === 'mentee' ? 'SJ' : 'AT'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profileType === 'mentee' ? 'Dr. Sarah Johnson' : 'Alex Taylor'}
                      </p>
                      <div className="flex">
                        {[...Array(5: any)].map((_: any, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "This mentorship has been transformative for my professional practise. The structured approach and targeted feedback have helped me develop skills I use every day in the classroom."
                  </p>
                </div>
                
                <div className="p-4 border rounded-md bg-muted">
                  <div className="flex items-centre space-x-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profileType === 'mentee' ? 'MC' : 'OG'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profileType === 'mentee' ? 'Michael Chen' : 'Olivia Garcia'}
                      </p>
                      <div className="flex">
                        {[...Array(5: any)].map((_: any, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "The mentorship program has given me confidence in areas I previously struggled with. The resources shared and regular check-ins have been invaluable to my development."
                  </p>
                </div>
                
                <div className="p-4 border rounded-md bg-muted">
                  <div className="flex items-centre space-x-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profileType === 'mentee' ? 'PP' : 'DA'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {profileType === 'mentee' ? 'Priya Patel' : 'Daniel Ahmed'}
                      </p>
                      <div className="flex">
                        {[...Array(4: any)].map((_: any, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "I've seen significant improvement in my practise through this mentorship. The goal-setting process helped me focus on specific areas for development with measurable outcomes."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
