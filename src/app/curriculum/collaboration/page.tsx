'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Check, Clock, MessageSquare, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

export default function CurriculumCollaboration() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [collaborationData, setCollaborationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState('viewer');
  const [newComment, setNewComment] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Load collaboration data
  useEffect(() => {
    if (!planId || status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    const fetchCollaborationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/curriculum/collaboration?planId=${planId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch collaboration data');
        }
        
        const data = await response.json();
        setCollaborationData(data);
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollaborationData();
  }, [planId, status, router]);

  // Handle adding a collaborator
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!newCollaboratorEmail) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_collaborator',
          planId,
          email: newCollaboratorEmail,
          role: newCollaboratorRole,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add collaborator');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, data.collaborator],
      }));
      
      setNewCollaboratorEmail('');
      setNewCollaboratorRole('viewer');
      setIsAddingCollaborator(false);
      
      toast({
        title: 'Success',
        description: `${data.collaborator.user.name || data.collaborator.user.email} added as a collaborator`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle removing a collaborator
  const handleRemoveCollaborator = async (userId) => {
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove_collaborator',
          planId,
          userId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove collaborator');
      }
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        collaborators: prev.collaborators.filter(c => c.user.id !== userId),
      }));
      
      toast({
        title: 'Success',
        description: 'Collaborator removed',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_comment',
          planId,
          content: newComment,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        comments: [data.comment, ...prev.comments],
      }));
      
      setNewComment('');
      
      toast({
        title: 'Success',
        description: 'Comment added',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_comment',
          planId,
          taskId: commentId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
      }));
      
      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle adding a task
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle || !newTaskDescription) {
      toast({
        title: 'Error',
        description: 'Title and description are required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_task',
          planId,
          title: newTaskTitle,
          description: newTaskDescription,
          assignedToId: newTaskAssignee || null,
          dueDate: newTaskDueDate ? newTaskDueDate.toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        tasks: [data.task, ...prev.tasks],
      }));
      
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssignee('');
      setNewTaskDueDate(null);
      setIsAddingTask(false);
      
      toast({
        title: 'Success',
        description: 'Task added',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle updating a task status
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_task',
          planId,
          taskId,
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
      
      const data = await response.json();
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? data.task : t),
      }));
      
      toast({
        title: 'Success',
        description: 'Task updated',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch('/api/curriculum/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_task',
          planId,
          taskId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }
      
      // Update local state
      setCollaborationData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
      }));
      
      toast({
        title: 'Success',
        description: 'Task deleted',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading collaboration data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!collaborationData) {
    return null;
  }

  const { plan, collaborators, comments, tasks, userRole } = collaborationData;
  const canEdit = userRole === 'owner' || userRole === 'editor' || session?.user?.role === 'ADMIN';
  const canManageCollaborators = userRole === 'owner' || session?.user?.role === 'ADMIN';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{plan.title}</h1>
          <p className="text-muted-foreground mt-2">
            Curriculum Plan Collaboration
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/curriculum/plans/${plan.id}`}>
              View Plan
            </Link>
          </Button>
          {canEdit && (
            <Button asChild>
              <Link href={`/curriculum/plans/${plan.id}/edit`}>
                Edit Plan
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                  <CardDescription>
                    {plan.subject} • {plan.keyStage}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground mt-1">{plan.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Owner</h3>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={plan.author.image} alt={plan.author.name} />
                          <AvatarFallback>{plan.author.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{plan.author.name}</p>
                          <p className="text-xs text-muted-foreground">{plan.author.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <Badge className="mt-1" variant={plan.status === 'published' ? 'default' : 'secondary'}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Your Role</h3>
                      <Badge className="mt-1" variant="outline">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Collaborators</p>
                      <p className="text-2xl font-bold mt-1">{collaborators.length + 1}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold mt-1">{comments.length}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Tasks</p>
                      <p className="text-2xl font-bold mt-1">{tasks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Collaborators</CardTitle>
                    <CardDescription>People with access to this plan</CardDescription>
                  </div>
                  {canManageCollaborators && (
                    <Dialog open={isAddingCollaborator} onOpenChange={setIsAddingCollaborator}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Collaborator</DialogTitle>
                          <DialogDescription>
                            Invite someone to collaborate on this curriculum plan.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddCollaborator}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">
                                Email
                              </label>
                              <Input
                                id="email"
                                placeholder="colleague@example.com"
                                value={newCollaboratorEmail}
                                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="role" className="text-sm font-medium">
                                Role
                              </label>
                              <Select value={newCollaboratorRole} onValueChange={setNewCollaboratorRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="editor">Editor (can edit)</SelectItem>
                                  <SelectItem value="viewer">Viewer (can view only)</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Editors can make changes to the plan. Viewers can only view and comment.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddingCollaborator(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Collaborator</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Owner */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={plan.author.image} alt={plan.author.name} />
                          <AvatarFallback>{plan.author.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{plan.author.name}</p>
                          <p className="text-xs text-muted-foreground">Owner</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Collaborators */}
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={collaborator.user.image} alt={collaborator.user.name} />
                            <AvatarFallback>{collaborator.user.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{collaborator.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                            </p>
                          </div>
                        </div>
                        {canManageCollaborators && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveCollaborator(collaborator.user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {collaborators.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No additional collaborators yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Comments Tab */}
        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                Discuss this curriculum plan with collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit">Post Comment</Button>
                  </div>
                </div>
              </form>
              
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No comments yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Be the first to start the discussion
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={comment.user.image} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{comment.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {(comment.userId === session?.user?.id || userRole === 'owner' || session?.user?.role === 'ADMIN') && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage and track tasks for this curriculum plan
                </CardDescription>
              </div>
              {canEdit && (
                <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Task</DialogTitle>
                      <DialogDescription>
                        Create a new task for this curriculum plan.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTask}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="title" className="text-sm font-medium">
                            Title
                          </label>
                          <Input
                            id="title"
                            placeholder="Task title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="description" className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            id="description"
                            placeholder="Task description"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="assignee" className="text-sm font-medium">
                            Assign To
                          </label>
                          <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Unassigned</SelectItem>
                              <SelectItem value={plan.author.id}>{plan.author.name}</SelectItem>
                              {collaborators.map((collaborator) => (
                                <SelectItem key={collaborator.user.id} value={collaborator.user.id}>
                                  {collaborator.user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="dueDate" className="text-sm font-medium">
                            Due Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newTaskDueDate ? format(newTaskDueDate, "PPP") : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newTaskDueDate}
                                onSelect={setNewTaskDueDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddingTask(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Task</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No tasks yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Create tasks to track work on this curriculum plan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pending Tasks */}
                    <div>
                      <h3 className="font-medium mb-3">Pending Tasks</h3>
                      {tasks.filter(t => t.status === 'pending').length === 0 ? (
                        <p className="text-sm text-muted-foreground">No pending tasks</p>
                      ) : (
                        tasks
                          .filter(t => t.status === 'pending')
                          .map((task) => (
                            <div key={task.id} className="border rounded-lg p-4 mb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                </div>
                                {canEdit && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-4">
                                {task.assignedTo && (
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-1">
                                      <AvatarImage src={task.assignedTo.image} alt={task.assignedTo.name} />
                                      <AvatarFallback>{task.assignedTo.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs">{task.assignedTo.name}</span>
                                  </div>
                                )}
                                {task.dueDate && (
                                  <Badge variant="outline" className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span className="text-xs">
                                      Due {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </Badge>
                                )}
                                {canEdit && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="ml-auto"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                  >
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                    
                    {/* Completed Tasks */}
                    <div>
                      <h3 className="font-medium mb-3">Completed Tasks</h3>
                      {tasks.filter(t => t.status === 'completed').length === 0 ? (
                        <p className="text-sm text-muted-foreground">No completed tasks</p>
                      ) : (
                        tasks
                          .filter(t => t.status === 'completed')
                          .map((task) => (
                            <div key={task.id} className="border rounded-lg p-4 mb-3 bg-muted/30">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium line-through">{task.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                </div>
                                {canEdit && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-4">
                                {task.assignedTo && (
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-1">
                                      <AvatarImage src={task.assignedTo.image} alt={task.assignedTo.name} />
                                      <AvatarFallback>{task.assignedTo.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs">{task.assignedTo.name}</span>
                                  </div>
                                )}
                                <Badge variant="secondary">Completed</Badge>
                                {canEdit && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="ml-auto"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'pending')}
                                  >
                                    Reopen
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
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
