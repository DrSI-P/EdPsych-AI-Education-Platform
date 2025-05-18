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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Award, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Copy, 
  Download, 
  ExternalLink, 
  Eye, 
  FileText, 
  Filter, 
  HelpCircle, 
  Info, 
  Key, 
  Link, 
  Loader2, 
  Lock, 
  MoreHorizontal, 
  Plus, 
  QrCode, 
  Search, 
  Settings, 
  Share2, 
  Shield, 
  ShieldCheck, 
  Tag, 
  Upload, 
  User, 
  Users, 
  Verified
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

// Mock data for credentials
const mockCredentials = [
  {
    id: 'cred-001',
    title: 'Advanced Differentiation Strategies',
    issuer: 'EdPsych Professional Development',
    recipient: 'Jane Smith',
    issueDate: '2025-03-15',
    expiryDate: '2028-03-15',
    type: 'Certificate',
    skills: ['Differentiated Instruction', 'Inclusive Education', 'Assessment Design'],
    description: 'Awarded for completing 30 hours of professional development in advanced differentiation strategies for inclusive classrooms.',
    image: '/certificates/differentiation.png',
    blockchainId: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    blockchainNetwork: 'Polygon',
    verificationUrl: 'https://verify.edpsych.io/cred-001',
    status: 'active',
    cpd: {
      points: 30,
      category: 'Teaching and Learning'
    }
  },
  {
    id: 'cred-002',
    title: 'SEND Specialist Qualification',
    issuer: 'National SEND Association',
    recipient: 'Jane Smith',
    issueDate: '2024-11-10',
    expiryDate: '2027-11-10',
    type: 'Qualification',
    skills: ['SEND Support', 'IEP Development', 'Assistive Technology', 'Behaviour Management'],
    description: 'Professional qualification recognizing expertise in supporting students with special educational needs and disabilities.',
    image: '/certificates/send-specialist.png',
    blockchainId: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    blockchainNetwork: 'Ethereum',
    verificationUrl: 'https://verify.edpsych.io/cred-002',
    status: 'active',
    cpd: {
      points: 100,
      category: 'Special Educational Needs'
    }
  },
  {
    id: 'cred-003',
    title: 'Educational Assessment Mastery',
    issuer: 'Assessment Excellence Institute',
    recipient: 'Jane Smith',
    issueDate: '2025-01-22',
    expiryDate: null,
    type: 'Badge',
    skills: ['Formative Assessment', 'Summative Assessment', 'Data Analysis', 'Feedback Techniques'],
    description: 'Digital badge awarded for demonstrating mastery in educational assessment methodologies and practices.',
    image: '/badges/assessment-mastery.png',
    blockchainId: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    blockchainNetwork: 'Polygon',
    verificationUrl: 'https://verify.edpsych.io/cred-003',
    status: 'active',
    cpd: {
      points: 15,
      category: 'Assessment and Feedback'
    }
  }
];

// Mock data for copyright registrations
const mockCopyrightRegistrations = [
  {
    id: 'cr-001',
    title: 'Inclusive Classroom Strategies Guide',
    creator: 'Jane Smith',
    creationDate: '2025-02-10',
    registrationDate: '2025-02-12',
    type: 'Document',
    description: 'A comprehensive guide to creating inclusive classroom environments for students with diverse needs.',
    tags: ['Inclusion', 'Classroom Management', 'Differentiation', 'Accessibility'],
    blockchainId: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    blockchainNetwork: 'Polygon',
    verificationUrl: 'https://verify.edpsych.io/copyright/cr-001',
    status: 'registered',
    license: 'Creative Commons BY-NC-SA',
    usageRights: [
      'Educational use permitted',
      'Modification allowed with attribution',
      'Commercial use prohibited',
      'Must share derivative works under same license'
    ]
  },
  {
    id: 'cr-002',
    title: 'Executive Function Development Activities',
    creator: 'Jane Smith',
    creationDate: '2025-01-05',
    registrationDate: '2025-01-07',
    type: 'Activity Set',
    description: 'A collection of 50 classroom activities designed to develop executive function skills in primary school students.',
    tags: ['Executive Function', 'Cognitive Development', 'Primary Education', 'Classroom Activities'],
    blockchainId: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    blockchainNetwork: 'Ethereum',
    verificationUrl: 'https://verify.edpsych.io/copyright/cr-002',
    status: 'registered',
    license: 'All Rights Reserved',
    usageRights: [
      'Personal educational use permitted',
      'Modification prohibited',
      'Distribution prohibited',
      'Commercial use prohibited'
    ]
  },
  {
    id: 'cr-003',
    title: 'Trauma-Informed Teaching Framework',
    creator: 'Jane Smith',
    creationDate: '2025-03-20',
    registrationDate: '2025-03-22',
    type: 'Framework',
    description: 'A structured framework for implementing trauma-informed teaching practices in educational settings.',
    tags: ['Trauma-Informed', 'Mental Health', 'Wellbeing', 'Teaching Practice'],
    blockchainId: '0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    blockchainNetwork: 'Polygon',
    verificationUrl: 'https://verify.edpsych.io/copyright/cr-003',
    status: 'registered',
    license: 'Creative Commons BY',
    usageRights: [
      'Educational use permitted',
      'Modification allowed with attribution',
      'Commercial use permitted with attribution',
      'Distribution permitted with attribution'
    ]
  }
];

const BlockchainCredentialsWallet = () => {
  const [activeTab, setActiveTab] = useState("credentials");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedCopyright, setSelectedCopyright] = useState(null);
  const [showCredentialDetail, setShowCredentialDetail] = useState(false);
  const [showCopyrightDetail, setShowCopyrightDetail] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCredentials, setFilteredCredentials] = useState(mockCredentials);
  const [filteredCopyrights, setFilteredCopyrights] = useState(mockCopyrightRegistrations);
  
  // New content registration form state
  const [newContent, setNewContent] = useState({
    title: '',
    type: '',
    description: '',
    tags: [],
    license: '',
    file: null
  });
  
  // Filter credentials based on search query
  const handleCredentialSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = mockCredentials.filter(credential => 
      credential.title.toLowerCase().includes(query) || 
      credential.issuer.toLowerCase().includes(query) ||
      credential.skills.some(skill => skill.toLowerCase().includes(query))
    );
    setFilteredCredentials(filtered);
  };
  
  // Filter copyright registrations based on search query
  const handleCopyrightSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = mockCopyrightRegistrations.filter(copyright => 
      copyright.title.toLowerCase().includes(query) || 
      copyright.tags.some(tag => tag.toLowerCase().includes(query)) ||
      copyright.description.toLowerCase().includes(query)
    );
    setFilteredCopyrights(filtered);
  };
  
  // Clear search filters
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredCredentials(mockCredentials);
    setFilteredCopyrights(mockCopyrightRegistrations);
  };
  
  // Open credential detail dialog
  const openCredentialDetail = (credential) => {
    setSelectedCredential(credential);
    setShowCredentialDetail(true);
  };
  
  // Open copyright detail dialog
  const openCopyrightDetail = (copyright) => {
    setSelectedCopyright(copyright);
    setShowCopyrightDetail(true);
  };
  
  // Open share dialog
  const openShareDialog = (item) => {
    if (activeTab === "credentials") {
      setSelectedCredential(item);
    } else {
      setSelectedCopyright(item);
    }
    setShowShareDialog(true);
  };
  
  // Handle share action
  const handleShare = (method) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowShareDialog(false);
      toast({
        title: "Shared successfully",
        description: `Your ${activeTab === "credentials" ? "credential" : "copyright"} has been shared via ${method}.`,
      });
    }, 1000);
  };
  
  // Handle download certificate/badge
  const handleDownload = (item) => {
    setIsProcessing(true);
    // Simulate download
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Download complete",
        description: `Your ${item.type.toLowerCase()} has been downloaded successfully.`,
      });
    }, 1000);
  };
  
  // Handle verification
  const handleVerify = (item) => {
    setIsProcessing(true);
    // Simulate verification
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Verification successful",
        description: `This ${activeTab === "credentials" ? "credential" : "copyright"} has been verified on the blockchain.`,
      });
    }, 1500);
  };
  
  // Open register new content dialog
  const openRegisterDialog = () => {
    setNewContent({
      title: '',
      type: '',
      description: '',
      tags: [],
      license: '',
      file: null
    });
    setShowRegisterDialog(true);
  };
  
  // Handle content registration
  const handleRegisterContent = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowRegisterDialog(false);
      
      // Create new mock copyright registration
      const newRegistration = {
        id: `cr-00${mockCopyrightRegistrations.length + 1}`,
        title: newContent.title,
        creator: 'Jane Smith',
        creationDate: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0],
        type: newContent.type,
        description: newContent.description,
        tags: newContent.tags,
        blockchainId: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockchainNetwork: 'Polygon',
        verificationUrl: `https://verify.edpsych.io/copyright/cr-00${mockCopyrightRegistrations.length + 1}`,
        status: 'registered',
        license: newContent.license,
        usageRights: [
          'Educational use permitted',
          newContent.license.includes('BY') ? 'Attribution required' : 'Attribution not required',
          newContent.license.includes('NC') ? 'Commercial use prohibited' : 'Commercial use permitted',
          newContent.license.includes('SA') ? 'Must share derivative works under same license' : 'No share-alike requirement'
        ]
      };
      
      // Add to list and update filtered list
      const updatedRegistrations = [...mockCopyrightRegistrations, newRegistration];
      setFilteredCopyrights(updatedRegistrations);
      
      toast({
        title: "Content registered successfully",
        description: "Your content has been registered on the blockchain and is now protected.",
      });
    }, 2000);
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    setNewContent({
      ...newContent,
      file: e.target.files[0]
    });
  };
  
  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!newContent.tags.includes(newTag)) {
        setNewContent({
          ...newContent,
          tags: [...newContent.tags, newTag]
        });
      }
      e.target.value = '';
    }
  };
  
  // Remove tag
  const removeTag = (tagToRemove) => {
    setNewContent({
      ...newContent,
      tags: newContent.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Render credentials list
  const renderCredentialsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Digital Credentials</h2>
        <form onSubmit={handleCredentialSearch} className="flex space-x-2">
          <Input
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </form>
      </div>
      
      {filteredCredentials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCredentials.map((credential) => (
            <Card key={credential.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={credential.type === 'Certificate' ? 'default' : credential.type === 'Qualification' ? 'secondary' : 'outline'}>
                    {credential.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openCredentialDetail(credential)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(credential)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openShareDialog(credential)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerify(credential)}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Verify
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{credential.title}</CardTitle>
                <CardDescription>
                  Issued by {credential.issuer}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Issued: {new Date(credential.issueDate).toLocaleDateString('en-GB')}
                  {credential.expiryDate && (
                    <span className="ml-2">
                      • Expires: {new Date(credential.expiryDate).toLocaleDateString('en-GB')}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {credential.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {skill}
                    </Badge>
                  ))}
                  {credential.skills.length > 3 && (
                    <Badge variant="outline" className="bg-primary/5">
                      +{credential.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-2 pb-2 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center">
                          <Verified className="h-3 w-3 mr-1 text-green-600" />
                          Blockchain Verified
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified on {credential.blockchainNetwork}</p>
                        <p className="text-xs">{credential.blockchainId.substring(0, 10)}...</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => openCredentialDetail(credential)}
                >
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No credentials found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? "No credentials match your search criteria" : "You don't have any digital credentials yet"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearSearch}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
  
  // Render copyright registrations list
  const renderCopyrightsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Copyright Registrations</h2>
        <div className="flex space-x-2">
          <form onSubmit={handleCopyrightSearch} className="flex space-x-2">
            <Input
              placeholder="Search registrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>
          <Button onClick={openRegisterDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Register New
          </Button>
        </div>
      </div>
      
      {filteredCopyrights.length > 0 ? (
        <div className="space-y-4">
          {filteredCopyrights.map((copyright) => (
            <Card key={copyright.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {copyright.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openCopyrightDetail(copyright)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openShareDialog(copyright)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Proof
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerify(copyright)}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Verify
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{copyright.title}</CardTitle>
                <CardDescription>
                  Created: {new Date(copyright.creationDate).toLocaleDateString('en-GB')} • Registered: {new Date(copyright.registrationDate).toLocaleDateString('en-GB')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {copyright.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {copyright.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                  {copyright.tags.length > 4 && (
                    <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200">
                      +{copyright.tags.length - 4} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-2 pb-2 flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-1 text-blue-600" />
                          {copyright.license}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>License: {copyright.license}</p>
                        <ul className="text-xs list-disc pl-4 mt-1">
                          {copyright.usageRights.slice(0, 2).map((right, index) => (
                            <li key={index}>{right}</li>
                          ))}
                          {copyright.usageRights.length > 2 && <li>+ more rights</li>}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => openCopyrightDetail(copyright)}
                >
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No copyright registrations found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? "No registrations match your search criteria" : "You haven't registered any content yet"}
          </p>
          <div className="mt-4 space-x-4">
            {searchQuery && (
              <Button 
                variant="outline"
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            )}
            <Button onClick={openRegisterDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Register New Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render verification portal
  const renderVerificationPortal = () => (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Credential Verification Portal</h2>
        <p className="text-muted-foreground">
          Verify the authenticity of any credential or copyright registration issued through the EdPsych platform.
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verify a Credential or Registration</CardTitle>
          <CardDescription>
            Enter a verification code, scan a QR code, or upload a credential file to verify its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Verification Code</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Enter Verification Code</Label>
                <Input id="verification-code" placeholder="e.g., VC-1234-5678-ABCD" />
                <p className="text-xs text-muted-foreground">
                  The verification code can be found on the credential or in the verification link.
                </p>
              </div>
              <Button className="w-full">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verify Credential
              </Button>
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4 pt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <QrCode className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">Scan QR Code</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Position the QR code from the credential in front of your camera
                </p>
                <Button variant="outline" className="mt-4">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4 pt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">Upload Credential File</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop a credential file or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-medium mb-4">Recently Verified</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-100">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Advanced Differentiation Strategies</p>
                <p className="text-sm text-muted-foreground">Verified 5 minutes ago</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              Authentic
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-100">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Trauma-Informed Teaching Framework</p>
                <p className="text-sm text-muted-foreground">Verified 2 hours ago</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              Authentic
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-100">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium">Digital Learning Specialist</p>
                <p className="text-sm text-muted-foreground">Verification failed 1 day ago</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
              Not Authentic
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render help and information
  const renderHelpInfo = () => (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Blockchain Credentials Help</h2>
        <p className="text-muted-foreground">
          Learn how blockchain technology secures your credentials and protects your intellectual property.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Understanding Blockchain Credentials</CardTitle>
            <CardDescription>
              How blockchain technology secures your professional achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What are blockchain credentials?</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain credentials are digital certificates, badges, or qualifications that are secured using blockchain technology. Unlike traditional paper certificates or simple digital files, blockchain credentials are tamper-proof, instantly verifiable, and remain under your control.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How does blockchain verification work?</h3>
              <p className="text-sm text-muted-foreground">
                When a credential is issued, a unique digital fingerprint (hash) of the credential is stored on the blockchain. This creates a permanent, tamper-proof record that can be used to verify the authenticity of the credential at any time, without needing to contact the issuer.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Benefits of blockchain credentials</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Tamper-proof and secure</li>
                <li>Instantly verifiable by employers or institutions</li>
                <li>Remain valid even if the issuer ceases operations</li>
                <li>You control who can access your credentials</li>
                <li>Reduce credential fraud and misrepresentation</li>
                <li>Streamline hiring and verification processes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Copyright Protection on Blockchain</CardTitle>
            <CardDescription>
              How blockchain technology protects your intellectual property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What is blockchain copyright protection?</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain copyright protection creates a tamper-proof record of your intellectual property, establishing proof of creation and ownership. By registering your content on the blockchain, you create a timestamped record that can be used as evidence in copyright disputes.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How does it work?</h3>
              <p className="text-sm text-muted-foreground">
                When you register content, a unique digital fingerprint of your work is created and stored on the blockchain along with timestamp and ownership information. This creates an immutable record that proves you possessed the content at a specific time, which can be crucial for establishing copyright priority.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Benefits of blockchain copyright</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Establishes proof of creation and ownership</li>
                <li>Creates a timestamped record that can't be altered</li>
                <li>Simplifies licensing and rights management</li>
                <li>Helps prevent plagiarism and unauthorized use</li>
                <li>Provides evidence for copyright disputes</li>
                <li>Enables secure sharing with clear usage rights</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Is blockchain registration a substitute for formal copyright registration?</h3>
            <p className="text-sm text-muted-foreground">
              While blockchain registration provides strong evidence of creation and ownership, it doesn't replace formal copyright registration with government authorities. However, it can complement formal registration by providing additional proof of creation date and content integrity.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">How do I share my credentials with employers?</h3>
            <p className="text-sm text-muted-foreground">
              You can share your credentials by generating a verification link, downloading the credential file, or creating a QR code that links to the verification page. Recipients can instantly verify the authenticity of your credentials without contacting the issuer.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What happens if I lose access to my credentials?</h3>
            <p className="text-sm text-muted-foreground">
              Your credentials are securely stored on the blockchain and can be recovered using your account credentials. Additionally, you can download backup copies of your credentials for safekeeping.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Which blockchain networks are used?</h3>
            <p className="text-sm text-muted-foreground">
              The platform primarily uses Polygon for its low transaction costs and energy efficiency, with Ethereum as an alternative for specific use cases requiring its additional security features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blockchain Credentials & Copyright</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Options
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Key className="h-4 w-4 mr-2" />
              Manage Blockchain Keys
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export Credential History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Manage Access Permissions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="credentials">My Credentials</TabsTrigger>
          <TabsTrigger value="copyright">Copyright Protection</TabsTrigger>
          <TabsTrigger value="verify">Verification Portal</TabsTrigger>
          <TabsTrigger value="help">Help & Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="space-y-4 pt-4">
          {renderCredentialsList()}
        </TabsContent>
        
        <TabsContent value="copyright" className="space-y-4 pt-4">
          {renderCopyrightsList()}
        </TabsContent>
        
        <TabsContent value="verify" className="space-y-4 pt-4">
          {renderVerificationPortal()}
        </TabsContent>
        
        <TabsContent value="help" className="space-y-4 pt-4">
          {renderHelpInfo()}
        </TabsContent>
      </Tabs>
      
      {/* Credential Detail Dialog */}
      <Dialog open={showCredentialDetail} onOpenChange={setShowCredentialDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCredential?.title}</DialogTitle>
            <DialogDescription>
              Issued by {selectedCredential?.issuer} on {selectedCredential && new Date(selectedCredential.issueDate).toLocaleDateString('en-GB')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedCredential?.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Skills & Competencies</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCredential?.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CPD Information</h3>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <div className="border rounded p-2">
                    <span className="text-xs text-muted-foreground">Points</span>
                    <p className="font-medium">{selectedCredential?.cpd.points} CPD Points</p>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-muted-foreground">Category</span>
                    <p className="font-medium">{selectedCredential?.cpd.category}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Blockchain Verification</h3>
                <div className="mt-1 border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Verified on {selectedCredential?.blockchainNetwork}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Transaction ID:</span>
                    <code className="bg-muted p-1 rounded text-xs">{selectedCredential?.blockchainId}</code>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={() => {
                      navigator.clipboard.writeText(selectedCredential?.blockchainId);
                      toast({
                        title: "Copied to clipboard",
                        description: "Transaction ID copied to clipboard",
                      });
                    }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground mr-2">Verification URL:</span>
                    <a href={selectedCredential?.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                      {selectedCredential?.verificationUrl}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="bg-muted rounded-lg p-4 mb-3">
                  <Award className="h-16 w-16 mx-auto text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Certificate Preview</p>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" onClick={() => handleDownload(selectedCredential)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  setShowCredentialDetail(false);
                  openShareDialog(selectedCredential);
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Credential
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleVerify(selectedCredential)}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify on Blockchain
                </Button>
              </div>
              
              <div className="border rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Credential Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{selectedCredential?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{selectedCredential && new Date(selectedCredential.issueDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  {selectedCredential?.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span>{new Date(selectedCredential.expiryDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={selectedCredential?.status === 'active' ? 'default' : 'secondary'}>
                      {selectedCredential?.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCredentialDetail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Copyright Detail Dialog */}
      <Dialog open={showCopyrightDetail} onOpenChange={setShowCopyrightDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCopyright?.title}</DialogTitle>
            <DialogDescription>
              Created on {selectedCopyright && new Date(selectedCopyright.creationDate).toLocaleDateString('en-GB')} • Registered on {selectedCopyright && new Date(selectedCopyright.registrationDate).toLocaleDateString('en-GB')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedCopyright?.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCopyright?.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">License & Usage Rights</h3>
                <div className="mt-1 border rounded-lg p-3">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">{selectedCopyright?.license}</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Usage Rights:</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                      {selectedCopyright?.usageRights.map((right, index) => (
                        <li key={index}>{right}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Blockchain Verification</h3>
                <div className="mt-1 border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Registered on {selectedCopyright?.blockchainNetwork}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Transaction ID:</span>
                    <code className="bg-muted p-1 rounded text-xs">{selectedCopyright?.blockchainId}</code>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={() => {
                      navigator.clipboard.writeText(selectedCopyright?.blockchainId);
                      toast({
                        title: "Copied to clipboard",
                        description: "Transaction ID copied to clipboard",
                      });
                    }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground mr-2">Verification URL:</span>
                    <a href={selectedCopyright?.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                      {selectedCopyright?.verificationUrl}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="bg-muted rounded-lg p-4 mb-3">
                  <FileText className="h-16 w-16 mx-auto text-blue-600" />
                </div>
                <p className="text-sm text-muted-foreground">{selectedCopyright?.type} Preview</p>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => {
                  setShowCopyrightDetail(false);
                  openShareDialog(selectedCopyright);
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Proof of Registration
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleVerify(selectedCopyright)}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify on Blockchain
                </Button>
              </div>
              
              <div className="border rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Registration Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{selectedCopyright?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{selectedCopyright && new Date(selectedCopyright.creationDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registered:</span>
                    <span>{selectedCopyright && new Date(selectedCopyright.registrationDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={selectedCopyright?.status === 'registered' ? 'default' : 'secondary'} className="bg-blue-500">
                      {selectedCopyright?.status === 'registered' ? 'Registered' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyrightDetail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share {activeTab === "credentials" ? "Credential" : "Copyright Proof"}</DialogTitle>
            <DialogDescription>
              Choose how you want to share your {activeTab === "credentials" ? "credential" : "copyright proof"} with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4 text-center">
              <QrCode className="h-16 w-16 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Verification QR Code</p>
              <p className="text-xs text-muted-foreground mt-1">
                Scan to verify this {activeTab === "credentials" ? "credential" : "registration"}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Verification Link</Label>
              <div className="flex space-x-2">
                <Input 
                  value={activeTab === "credentials" ? selectedCredential?.verificationUrl : selectedCopyright?.verificationUrl} 
                  readOnly
                />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(activeTab === "credentials" ? selectedCredential?.verificationUrl : selectedCopyright?.verificationUrl);
                  toast({
                    title: "Copied to clipboard",
                    description: "Verification link copied to clipboard",
                  });
                }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with anyone who needs to verify your {activeTab === "credentials" ? "credential" : "copyright registration"}.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Share via</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start" onClick={() => handleShare('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
            
            {activeTab === "credentials" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-personal-info">Include personal information</Label>
                  <Switch id="include-personal-info" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">
                  When enabled, your name and personal details will be included in the shared credential.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Sharing options ready",
                description: "Use any of the methods above to share your verification information.",
              });
            }}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Register New Content Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Register New Content</DialogTitle>
            <DialogDescription>
              Register your original content on the blockchain to establish proof of creation and ownership.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-title">Title</Label>
                <Input 
                  id="content-title" 
                  placeholder="Enter content title" 
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select 
                  value={newContent.type}
                  onValueChange={(value) => setNewContent({...newContent, type: value})}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Activity Set">Activity Set</SelectItem>
                    <SelectItem value="Framework">Framework</SelectItem>
                    <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Research Paper">Research Paper</SelectItem>
                    <SelectItem value="Educational Resource">Educational Resource</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-description">Description</Label>
              <Textarea 
                id="content-description" 
                placeholder="Describe your content" 
                rows={3}
                value={newContent.description}
                onChange={(e) => setNewContent({...newContent, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-tags">Tags</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {newContent.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1 text-blue-700 hover:text-blue-900"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input 
                id="content-tags" 
                placeholder="Add tags (press Enter after each tag)" 
                onKeyDown={handleTagInput}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags to help categorize your content (e.g., "Primary Education", "SEND", "Mathematics").
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-license">License Type</Label>
              <Select 
                value={newContent.license}
                onValueChange={(value) => setNewContent({...newContent, license: value})}
              >
                <SelectTrigger id="content-license">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Rights Reserved">All Rights Reserved</SelectItem>
                  <SelectItem value="Creative Commons BY">Creative Commons Attribution (CC BY)</SelectItem>
                  <SelectItem value="Creative Commons BY-SA">CC Attribution-ShareAlike (CC BY-SA)</SelectItem>
                  <SelectItem value="Creative Commons BY-NC">CC Attribution-NonCommercial (CC BY-NC)</SelectItem>
                  <SelectItem value="Creative Commons BY-NC-SA">CC Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)</SelectItem>
                  <SelectItem value="Creative Commons BY-ND">CC Attribution-NoDerivs (CC BY-ND)</SelectItem>
                  <SelectItem value="Public Domain">Public Domain</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how others can use your content. <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more about licenses</a>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-file">Upload Content</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {newContent.file ? newContent.file.name : "Upload your content file"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {newContent.file ? `${(newContent.file.size / 1024 / 1024).toFixed(2)} MB` : "Drag and drop or click to browse"}
                </p>
                <Input 
                  id="content-file" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Button variant="outline" className="mt-4" onClick={() => document.getElementById('content-file').click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {newContent.file ? "Change File" : "Select File"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX, PPTX, XLSX, ZIP (for multiple files), images, and videos.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">About Blockchain Registration</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Registering your content on the blockchain creates a tamper-proof record of your work, establishing proof of creation and ownership. This can be valuable evidence in copyright disputes and simplifies licensing and rights management.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleRegisterContent}
              disabled={isProcessing || !newContent.title || !newContent.type || !newContent.description || !newContent.license}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Register on Blockchain
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Missing components for the component to work
const Camera = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
};

const Mail = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
};

const Linkedin = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
};

const Twitter = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
};

const Facebook = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
};

const Calendar = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
};

export default BlockchainCredentialsWallet;
