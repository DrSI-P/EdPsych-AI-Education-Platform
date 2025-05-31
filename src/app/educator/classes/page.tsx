'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart,
  PieChart,
  Download,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/lib/multi-tenant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * Class Management Dashboard component
 * Provides comprehensive tools for managing classes, students, and resources
 */
export default function ClassManagementDashboard() {
  const router = useRouter();
  const { currentTenant, currentUser, isTenantFeatureEnabled, hasPermission } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for classes
  const classes = [
    { id: 1, name: 'Year 7 Mathematics', subject: 'Mathematics', students: 28, progress: 72, status: 'active' },
    { id: 2, name: 'Year 8 English', subject: 'English', students: 26, progress: 68, status: 'active' },
    { id: 3, name: 'Year 9 Science', subject: 'Science', students: 30, progress: 81, status: 'active' },
    { id: 4, name: 'Year 10 History', subject: 'History', students: 24, progress: 65, status: 'active' },
    { id: 5, name: 'Year 11 Geography', subject: 'Geography', students: 22, progress: 70, status: 'active' },
    { id: 6, name: 'Year 7 Art', subject: 'Art', students: 28, progress: 88, status: 'archived' }
  ];
  
  // Mock data for students
  const students = [
    { id: 1, name: 'Emma Thompson', year: 7, classes: ['Mathematics', 'English', 'Science'], progress: 85, status: 'active', learningStyle: 'Visual' },
    { id: 2, name: 'James Wilson', year: 7, classes: ['Mathematics', 'English', 'Science'], progress: 62, status: 'at-risk', learningStyle: 'Auditory' },
    { id: 3, name: 'Sarah Johnson', year: 7, classes: ['Mathematics', 'English', 'Science'], progress: 78, status: 'active', learningStyle: 'Kinesthetic' },
    { id: 4, name: 'Michael Brown', year: 7, classes: ['Mathematics', 'English', 'Science'], progress: 91, status: 'excelling', learningStyle: 'Read/Write' },
    { id: 5, name: 'David Lee', year: 7, classes: ['Mathematics', 'English', 'Science'], progress: 73, status: 'active', learningStyle: 'Visual' }
  ];
  
  // Mock data for resources
  const resources = [
    { id: 1, title: 'Algebra Fundamentals', type: 'lesson', subject: 'Mathematics', usage: 'high', lastUsed: '2 days ago' },
    { id: 2, name: 'Creative Writing Templates', type: 'worksheet', subject: 'English', usage: 'medium', lastUsed: '1 week ago' },
    { id: 3, name: 'Scientific Method Interactive', type: 'interactive', subject: 'Science', usage: 'high', lastUsed: 'Yesterday' },
    { id: 4, name: 'Tudor Period Timeline', type: 'presentation', subject: 'History', usage: 'low', lastUsed: '3 weeks ago' }
  ];
  
  // Filter classes based on search term and filters
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || cls.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || cls.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });
  
  // Get unique subjects for filter
  const subjects = ['all', ...new Set(classes.map(cls => cls.subject))];
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      case 'at-risk':
        return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      case 'excelling':
        return <Badge className="bg-blue-100 text-blue-800">Excelling</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Helper function to get resource type icon
  const getResourceTypeIcon = (type) => {
    switch(type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'worksheet':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'interactive':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'presentation':
        return <BarChart className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Check if advanced class management is enabled for the current tenant
  const hasAdvancedClassManagement = currentTenant && 
    isTenantFeatureEnabled('advancedClassManagement');
  
  // Check if the user has permission to manage classes
  const canManageClasses = currentUser && 
    hasPermission('edit:classes');
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Loading Class Management</h1>
          <p className="text-muted-foreground mb-4">Preparing your class management dashboard...</p>
          <div className="w-64 mx-auto">
            <Progress value={80} className="h-2" />
          </div>
        </div>
      </div>
    );
  }
  
  // Render subscription warning if needed
  const renderSubscriptionWarning = () => {
    if (!currentTenant) return null;
    
    if (currentTenant.subscriptionTier === 'free' || currentTenant.subscriptionTier === 'basic') {
      return (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Limited Features Available</AlertTitle>
          <AlertDescription className="text-amber-700">
            Advanced class management features are limited on your current plan. 
            <Button variant="link" className="p-0 h-auto text-amber-700 font-semibold" 
              onClick={() => router.push(`/admin/tenants/${currentTenant.id}/subscription/pricing`)}>
              Upgrade your subscription
            </Button> to access all features.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Class Management</h1>
            <p className="text-muted-foreground text-lg">
              Manage your classes, students, and teaching resources
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {canManageClasses && (
              <Button className="flex items-center" asChild>
                <Link href="/educator/classes/create">
                  <Users className="mr-2 h-4 w-4" />
                  Create New Class
                </Link>
              </Button>
            )}
            <Button variant="outline" className="flex items-center" asChild>
              <Link href="/educator/dashboard">
                <ChevronRight className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Subscription warning */}
      {renderSubscriptionWarning()}
      
      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Classes Tab Content */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search classes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Classes table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map(cls => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>{cls.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={cls.progress} className="h-2 w-20" />
                            <span>{cls.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cls.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/educator/classes/${cls.id}`}>
                                View
                              </Link>
                            </Button>
                            {canManageClasses && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/educator/classes/${cls.id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/educator/classes/${cls.id}/students`}>
                                    Manage Students
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/educator/classes/${cls.id}/resources`}>
                                    Assign Resources
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/educator/classes/${cls.id}/analytics`}>
                                    View Analytics
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {cls.status === 'active' ? (
                                  <DropdownMenuItem className="text-red-600">
                                    Archive Class
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">
                                    Restore Class
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No classes found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Students Tab Content */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                View and manage students across all your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Student management content will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Resources Tab Content */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Resources</CardTitle>
              <CardDescription>
                Access and manage your teaching resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Resource management content will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
