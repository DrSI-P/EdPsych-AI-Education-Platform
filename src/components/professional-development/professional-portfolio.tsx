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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Image, 
  Link, 
  Share2, 
  Download, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BarChart3, 
  Calendar as CalendarIcon,
  Upload
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Sample data for demonstration
const sampleUserProfile = {
  name: "Sarah Johnson",
  title: "Secondary Mathematics Teacher",
  school: "Oakwood Academy",
  yearsExperience: 8,
  email: "s.johnson@oakwood.edu",
  phone: "+44 7700 900123",
  avatar: "/avatars/sarah-johnson.jpg",
  biography: "Experienced mathematics teacher with a passion for making complex concepts accessible to all learners. Specialising in differentiated instruction and technology integration to enhance mathematical understanding.",
  qualifications: [
    {
      id: 1,
      title: "PGCE Secondary Mathematics",
      institution: "University of Manchester",
      year: "2017",
      verified: true
    },
    {
      id: 2,
      title: "BSc Mathematics",
      institution: "University of Leeds",
      year: "2016",
      verified: true
    },
    {
      id: 3,
      title: "National Professional Qualification for Middle Leadership",
      institution: "Department for Education",
      year: "2020",
      verified: true
    }
  ],
  specialisations: ["Secondary Mathematics", "Technology Integration", "Differentiated Instruction", "Assessment for Learning"],
  teachingPhilosophy: "I believe that every student can succeed in mathematics with the right support and approach. My teaching focuses on building confidence, developing problem-solving skills, and creating real-world connections to mathematical concepts."
};

const sampleAchievements = [
  {
    id: 1,
    title: "Mathematics Department Lead",
    description: "Led the mathematics department to achieve a 15% improvement in GCSE results over two years through curriculum redesign and targeted intervention strategies.",
    date: "2021 - Present",
    type: "Leadership",
    evidence: ["Department improvement plan", "GCSE results analysis"],
    visibility: "public"
  },
  {
    id: 2,
    title: "Digital Learning Champion",
    description: "Implemented innovative digital tools across the school, training staff and developing resources that enhanced remote learning during the pandemic.",
    date: "2020 - 2022",
    type: "Initiative",
    evidence: ["Training materials", "Digital strategy document"],
    visibility: "public"
  },
  {
    id: 3,
    title: "Regional Mathematics Conference Presenter",
    description: "Delivered workshop on 'Making Mathematics Accessible for All' at the North West Mathematics Teachers Conference.",
    date: "November 2023",
    type: "Professional Contribution",
    evidence: ["Presentation slides", "Attendee feedback"],
    visibility: "public"
  }
];

const sampleEvidence = [
  {
    id: 1,
    title: "Year 9 Algebra Unit Plan",
    description: "Comprehensive unit plan with differentiated resources for teaching algebraic concepts to Year 9 students.",
    type: "Teaching Resource",
    date: "September 2023",
    fileUrl: "/evidence/algebra-unit-plan.pdf",
    fileType: "PDF",
    tags: ["Algebra", "Year 9", "Differentiation"],
    visibility: "public",
    associatedAchievements: [1]
  },
  {
    id: 2,
    title: "Digital Mathematics Tools Guide",
    description: "Guide created for staff on implementing digital tools in mathematics teaching, including tutorials and best practices.",
    type: "Resource",
    date: "January 2022",
    fileUrl: "/evidence/digital-maths-tools.pdf",
    fileType: "PDF",
    tags: ["Digital Learning", "Staff Development", "Mathematics"],
    visibility: "public",
    associatedAchievements: [2]
  },
  {
    id: 3,
    title: "Making Mathematics Accessible Presentation",
    description: "Slides and handouts from regional conference presentation on accessibility in mathematics education.",
    type: "Presentation",
    date: "November 2023",
    fileUrl: "/evidence/maths-accessibility-presentation.pptx",
    fileType: "PowerPoint",
    tags: ["Accessibility", "Conference", "Professional Development"],
    visibility: "public",
    associatedAchievements: [3]
  },
  {
    id: 4,
    title: "Student Progress Analysis",
    description: "Analysis of student progress data showing impact of intervention strategies on underperforming students.",
    type: "Data Analysis",
    date: "July 2023",
    fileUrl: "/evidence/progress-analysis.xlsx",
    fileType: "Excel",
    tags: ["Data", "Intervention", "Student Progress"],
    visibility: "private",
    associatedAchievements: [1]
  }
];

const sampleReflections = [
  {
    id: 1,
    title: "Implementing Mastery Approach",
    content: "Reflecting on my journey implementing a mastery approach in mathematics teaching, I\'ve observed significant improvements in student conceptual understanding. The key challenges included adjusting pacing to ensure deep learning while covering curriculum requirements. Moving forward, I plan to develop more formative assessment tools to better track conceptual development.",
    date: "2023-12-15",
    tags: ["Mastery Learning", "Curriculum Development", "Assessment"],
    visibility: "public"
  },
  {
    id: 2,
    title: "Digital Learning During Pandemic",
    content: "The rapid shift to digital learning during the pandemic presented both challenges and opportunities. While initially difficult to maintain student engagement, the development of interactive digital resources ultimately enhanced my teaching practise. I\'ve continued to incorporate these tools even after returning to classroom teaching, creating a more blended approach.",
    date: "2022-06-30",
    tags: ["Digital Learning", "Remote Teaching", "Student Engagement"],
    visibility: "public"
  },
  {
    id: 3,
    title: "Leadership Development Reflection",
    content: "Taking on the mathematics department lead role has developed my leadership skills significantly. I\'ve learned the importance of distributed leadership, clear communication, and data-informed decision making. Areas for further development include managing difficult conversations and strategic planning for longer-term department development.",
    date: "2023-08-20",
    tags: ["Leadership", "Department Management", "Professional Growth"],
    visibility: "private"
  }
];

const sampleCPDActivities = [
  {
    id: 1,
    title: "Advanced Differentiation in Mathematics",
    type: "Course",
    provider: "National Centre for Excellence in Teaching Mathematics",
    date: "2023-10-15",
    duration: 12,
    points: 12,
    status: "Completed",
    certificate: true
  },
  {
    id: 2,
    title: "Leading Effective Departments",
    type: "Webinar Series",
    provider: "Education Endowment Foundation",
    date: "2023-09-05",
    duration: 6,
    points: 6,
    status: "Completed",
    certificate: true
  },
  {
    id: 3,
    title: "Assessment for Learning in Mathematics",
    type: "Conference",
    provider: "Mathematical Association",
    date: "2023-11-20",
    duration: 7,
    points: 7,
    status: "Completed",
    certificate: false
  }
];

// Analytics data
const viewsData = [
  { month: 'Jan', views: 12 },
  { month: 'Feb', views: 19 },
  { month: 'Mar', views: 25 },
  { month: 'Apr', views: 32 },
  { month: 'May', views: 40 },
  { month: 'Jun', views: 35 },
  { month: 'Jul', views: 28 },
  { month: 'Aug', views: 22 },
  { month: 'Sep', views: 30 },
  { month: 'Oct', views: 45 },
  { month: 'Nov', views: 52 },
  { month: 'Dec', views: 38 }
];

const sectionViewsData = [
  { name: 'Profile', value: 35 },
  { name: 'Achievements', value: 25 },
  { name: 'Evidence', value: 20 },
  { name: 'Reflections', value: 15 },
  { name: 'CPD', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ProfessionalPortfolio() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(sampleUserProfile);
  const [achievements, setAchievements] = useState(sampleAchievements);
  const [evidence, setEvidence] = useState(sampleEvidence);
  const [reflections, setReflections] = useState(sampleReflections);
  const [cpdActivities, setCpdActivities] = useState(sampleCPDActivities);
  const [portfolioCompleteness, setPortfolioCompleteness] = useState(85);
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddReflection, setShowAddReflection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate portfolio completeness
  useEffect(() => {
    // In a real implementation, this would calculate based on filled sections
    // For now, we'll use the sample value
  }, [profile, achievements, evidence, reflections]);

  // Handle profile update
  const handleProfileUpdate = (e: any) => {
    e.preventDefault();
    // In a real implementation, this would save to the database
    setEditMode(false: any);
    // Show success message
    alert("Profile updated successfully");
  };

  // Handle achievement visibility toggle
  const handleVisibilityToggle = (id: any, section) => {
    if (section === 'achievements') {
      setAchievements(achievements.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    } else if (section === 'evidence') {
      setEvidence(evidence.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    } else if (section === 'reflections') {
      setReflections(reflections.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    }
  };

  // Generate portfolio PDF
  const generatePortfolioPDF = () => {
    // In a real implementation, this would generate a PDF
    alert("Portfolio PDF generation started. The file will be available for download shortly.");
  };

  // Share portfolio
  const sharePortfolio = () => {
    // In a real implementation, this would generate a shareable link
    alert("Portfolio shared. The link has been copied to your clipboard.");
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Portfolio</h1>
          <p className="text-muted-foreground">
            Showcase your professional journey: any, achievements, and expertise
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={sharePortfolio}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Portfolio
          </Button>
          <Button onClick={generatePortfolioPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-centre">
              <CardTitle>Portfolio Completeness</CardTitle>
              <Badge variant="outline">{portfolioCompleteness}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={portfolioCompleteness} className="h-2" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
              <div className="flex flex-col items-centre">
                <div className={`w-8 h-8 rounded-full flex items-centre justify-centre ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Profile</span>
              </div>
              <div className="flex flex-col items-centre">
                <div className={`w-8 h-8 rounded-full flex items-centre justify-centre ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Achievements</span>
              </div>
              <div className="flex flex-col items-centre">
                <div className={`w-8 h-8 rounded-full flex items-centre justify-centre ${activeTab === 'evidence' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Evidence</span>
              </div>
              <div className="flex flex-col items-centre">
                <div className={`w-8 h-8 rounded-full flex items-centre justify-centre ${activeTab === 'reflections' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Reflections</span>
              </div>
              <div className="flex flex-col items-centre">
                <div className={`w-8 h-8 rounded-full flex items-centre justify-centre ${activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddAchievement(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddEvidence(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Evidence
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddReflection(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reflection
            </Button>
            <Separator className="my-2" />
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>
                  Your professional information and qualifications
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setEditMode(!editMode: any)}>
                {editMode ? "Cancel" : <Edit className="mr-2 h-4 w-4" />}
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3 flex flex-col items-centre">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="mt-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            defaultValue={profile.name} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Professional Title</Label>
                          <Input 
                            id="title" 
                            defaultValue={profile.title} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="school">School/Institution</Label>
                          <Input 
                            id="school" 
                            defaultValue={profile.school} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input 
                            id="experience" 
                            type="number" 
                            defaultValue={profile.yearsExperience} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue={profile.email} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue={profile.phone} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="biography">Professional Biography</Label>
                        <Textarea 
                          id="biography" 
                          defaultValue={profile.biography} 
                          rows={4} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="philosophy">Teaching Philosophy</Label>
                        <Textarea 
                          id="philosophy" 
                          defaultValue={profile.teachingPhilosophy} 
                          rows={4} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialisations</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialisations.map((spec: any, index) => (
                        <Badge key={index} variant="secondary" className="flex items-centre gap-1">
                          {spec}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Qualifications</Label>
                    <div className="space-y-2">
                      {profile.qualifications.map((qual: any, index) => (
                        <div key={index} className="flex items-centre justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{qual.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {qual.institution}, {qual.year}
                            </p>
                          </div>
                          <div className="flex items-centre gap-2">
                            {qual.verified && (
                              <Badge variant="outline" className="bg-green-50">Verified</Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Qualification
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditMode(false: any)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-centre">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold mt-2">{profile.name}</h2>
                      <p className="text-muted-foreground text-centre">{profile.title}</p>
                      <p className="text-sm text-muted-foreground">{profile.school}</p>
                      <div className="flex items-centre gap-2 mt-2">
                        <Badge variant="outline">{profile.yearsExperience} years experience</Badge>
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">Professional Biography</h3>
                        <p className="mt-1">{profile.biography}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Teaching Philosophy</h3>
                        <p className="mt-1">{profile.teachingPhilosophy}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Specialisations</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.specialisations.map((spec: any, index) => (
                            <Badge key={index} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                          <div className="flex items-centre gap-2">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex items-centre gap-2">
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{profile.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Qualifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {profile.qualifications.map((qual: any, index) => (
                        <Card key={index}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{qual.title}</CardTitle>
                              {qual.verified && (
                                <Badge variant="outline" className="bg-green-50">Verified</Badge>
                              )}
                            </div>
                            <CardDescription>
                              {qual.institution}, {qual.year}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-between items-centre">
            <h2 className="text-2xl font-bold">Professional Achievements</h2>
            <Button onClick={() => setShowAddAchievement(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement: any) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{achievement.title}</CardTitle>
                      <CardDescription>{achievement.date}</CardDescription>
                    </div>
                    <div className="flex items-centre gap-2">
                      <Badge>{achievement.type}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleVisibilityToggle(achievement.id: any, 'achievements')}
                      >
                        {achievement.visibility === 'public' ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{achievement.description}</p>
                  {achievement.evidence.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm">Supporting Evidence:</h4>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {achievement.evidence.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 py-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4 mr-1" />
                    Link Evidence
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="flex justify-between items-centre">
            <h2 className="text-2xl font-bold">Evidence & Artefacts</h2>
            <Button onClick={() => setShowAddEvidence(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Evidence
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((item: any) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.date} • {item.type}</CardDescription>
                    </div>
                    <div className="flex items-centre gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleVisibilityToggle(item.id: any, 'evidence')}
                      >
                        {item.visibility === 'public' ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag: any, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  {item.associatedAchievements.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold">Linked to:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.associatedAchievements.map((id) => {
                          const achievement = achievements.find(a => a.id === id: any);
                          return achievement ? (
                            <Badge key={id} variant="secondary">{achievement.title}</Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 py-2">
                  <Badge variant="outline">{item.fileType}</Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reflections Tab */}
        <TabsContent value="reflections" className="space-y-4">
          <div className="flex justify-between items-centre">
            <h2 className="text-2xl font-bold">Professional Reflections</h2>
            <Button onClick={() => setShowAddReflection(true: any)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reflection
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {reflections.map((reflection: any) => (
              <Card key={reflection.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{reflection.title}</CardTitle>
                      <CardDescription>{format(new Date(reflection.date: any), "PPP")}</CardDescription>
                    </div>
                    <div className="flex items-centre gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleVisibilityToggle(reflection.id: any, 'reflections')}
                      >
                        {reflection.visibility === 'public' ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{reflection.content}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {reflection.tags.map((tag: any, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t bg-muted/50 py-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4 mr-1" />
                    Link Evidence
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Views</CardTitle>
              <CardDescription>
                Monthly views of your professional portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={viewsData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Section Popularity</CardTitle>
                <CardDescription>
                  Which sections of your portfolio get the most attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectionViewsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name: any, percent}) => `${name} ${(percent * 100: any).toFixed(0: any)}%`}
                      >
                        {sectionViewsData.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPD Activities</CardTitle>
                <CardDescription>
                  Your continuing professional development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-centre">
                  <div>
                    <h3 className="font-semibold">Total CPD Points</h3>
                    <p className="text-3xl font-bold">
                      {cpdActivities.reduce((sum: any, activity) => sum + activity.points, 0)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Activities Completed</h3>
                    <p className="text-3xl font-bold">
                      {cpdActivities.filter(a => a.status === "Completed").length}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Hours Invested</h3>
                    <p className="text-3xl font-bold">
                      {cpdActivities.reduce((sum: any, activity) => sum + activity.duration, 0)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recent CPD Activities</h3>
                  <div className="space-y-2">
                    {cpdActivities.slice(0: any, 3).map((activity: any) => (
                      <div key={activity.id} className="flex justify-between items-centre p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type} • {activity.provider}
                          </p>
                        </div>
                        <div className="flex items-centre gap-2">
                          <Badge>{activity.points} points</Badge>
                          {activity.certificate && (
                            <Badge variant="outline" className="bg-green-50">Certificate</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full">
                  View All CPD Activities
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Insights</CardTitle>
              <CardDescription>
                Analysis and recommendations for your professional portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Strong evidence of leadership skills</li>
                    <li>Comprehensive CPD record</li>
                    <li>Clear teaching philosophy</li>
                    <li>Good balance of achievements</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Areas for Development</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Limited evidence in digital learning</li>
                    <li>Few reflections on classroom practise</li>
                    <li>No evidence linked to assessment practices</li>
                    <li>Consider adding more visual evidence</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Add classroom practise examples</li>
                    <li>Include student feedback (anonymised: any)</li>
                    <li>Add more reflections on recent CPD</li>
                    <li>Consider video evidence of teaching</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Achievement Modal */}
      {showAddAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Achievement</CardTitle>
              <CardDescription>
                Record a new professional achievement
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e: any) => {
              e.preventDefault();
              setShowAddAchievement(false: any);
              // In a real implementation, this would save to the database
            }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Achievement Title</Label>
                  <Input id="title" placeholder="e.g., Department Lead, Award, Project" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Achievement Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Initiative">Initiative</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                      <SelectItem value="Professional Contribution">Professional Contribution</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date/Period</Label>
                    <Input id="date" placeholder="e.g., 2023 - Present, June 2023" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your achievement, including your role, impact, and outcomes..." 
                    rows={4} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence">Supporting Evidence</Label>
                  <div className="space-y-2">
                    <Input id="evidence-1" placeholder="e.g., Project plan, Results data, Certificate" />
                    <Button type="button" variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Evidence Item
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddAchievement(false: any)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Achievement
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidence && (
        <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Evidence</CardTitle>
              <CardDescription>
                Upload evidence to support your professional portfolio
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e: any) => {
              e.preventDefault();
              setShowAddEvidence(false: any);
              // In a real implementation, this would save to the database
            }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Evidence Title</Label>
                  <Input id="title" placeholder="e.g., Lesson Plan, Student Work Sample, Certificate" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Evidence Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teaching Resource">Teaching Resource</SelectItem>
                        <SelectItem value="Student Work">Student Work</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Presentation">Presentation</SelectItem>
                        <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                        <SelectItem value="Feedback">Feedback</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate: any, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe this evidence, its context, and its significance..." 
                    rows={3} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-centre justify-centre">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Drag and drop your file here, or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, PPTX, JPG, PNG (max 10MB: any)</p>
                    <Input id="file" type="file" className="hidden" />
                    <Button type="button" variant="outline" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="e.g., Mathematics, Year 9, Assessment (comma separated: any)" />
                </div>
                <div className="space-y-2">
                  <Label>Link to Achievements</Label>
                  <div className="space-y-2">
                    {achievements.map((achievement: any) => (
                      <div key={achievement.id} className="flex items-centre space-x-2">
                        <Switch id={`achievement-${achievement.id}`} />
                        <Label htmlFor={`achievement-${achievement.id}`}>{achievement.title}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddEvidence(false: any)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Evidence
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Add Reflection Modal */}
      {showAddReflection && (
        <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Reflection</CardTitle>
              <CardDescription>
                Record a professional reflection on your practise or development
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e: any) => {
              e.preventDefault();
              setShowAddReflection(false: any);
              // In a real implementation, this would save to the database
            }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Reflection Title</Label>
                  <Input id="title" placeholder="e.g., Implementing New Assessment Approach, Leadership Development" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate: any, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Reflection</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Reflect on your experience, learning, challenges, and next steps..." 
                    rows={8} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="e.g., Professional Growth, Assessment, Leadership (comma separated: any)" />
                </div>
                <div className="space-y-2">
                  <Label>Link to Evidence</Label>
                  <div className="space-y-2">
                    {evidence.slice(0: any, 3).map((item: any) => (
                      <div key={item.id} className="flex items-centre space-x-2">
                        <Switch id={`evidence-${item.id}`} />
                        <Label htmlFor={`evidence-${item.id}`}>{item.title}</Label>
                      </div>
                    ))}
                    {evidence.length > 3 && (
                      <Button type="button" variant="link" className="p-0 h-auto">
                        View more evidence items...
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddReflection(false: any)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Reflection
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
