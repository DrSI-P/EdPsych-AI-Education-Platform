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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  BarChart2, 
  Users, 
  BookOpen, 
  Award,
  PlusCircle,
  Camera,
  FileText,
  MessageSquare,
  Star,
  Sparkles,
  ThumbsUp,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Share2
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

// Mock data for goals
const MOCK_GOALS = [
  {
    id: '1',
    title: 'Improve Reading Fluency',
    description: 'Work on reading with expression and appropriate pace',
    category: 'Academic',
    subject: 'English',
    status: 'in-progress',
    progress: 65,
    startDate: '2025-05-01',
    targetDate: '2025-07-31',
    createdBy: 'teacher',
    creatorName: 'Ms. Johnson',
    strategies: [
      { id: '1', text: 'Daily reading practise for 15 minutes', source: 'school' },
      { id: '2', text: 'Use reading bookmarks with decoding strategies', source: 'school' },
      { id: '3', text: 'Record reading and listen back to identify areas for improvement', source: 'home' }
    ],
    evidence: [
      { id: '1', type: 'note', title: 'Reading assessment', date: '2025-05-15', addedBy: 'teacher' },
      { id: '2', type: 'photo', title: 'Reading practise chart', date: '2025-06-01', addedBy: 'parent' },
      { id: '3', type: 'audio', title: 'Reading recording', date: '2025-06-20', addedBy: 'parent' }
    ],
    updates: [
      { id: '1', date: '2025-05-15', content: 'Initial assessment completed. Oliver is reading at 70 words per minute with 85% accuracy.', author: 'Ms. Johnson' },
      { id: '2', date: '2025-06-01', content: 'We\'ve been practicing daily at home. Oliver is enjoying the new space books.', author: 'Parent' },
      { id: '3', date: '2025-06-20', content: 'Mid-term assessment shows improvement to 85 words per minute with 90% accuracy.', author: 'Ms. Johnson' }
    ],
    progressData: [
      { date: '2025-05-01', value: 0 },
      { date: '2025-05-15', value: 20 },
      { date: '2025-06-01', value: 35 },
      { date: '2025-06-20', value: 65 }
    ]
  },
  {
    id: '2',
    title: 'Develop Confidence in Mathematics',
    description: 'Build confidence in approaching mathematical problems independently',
    category: 'Academic',
    subject: 'Mathematics',
    status: 'in-progress',
    progress: 40,
    startDate: '2025-05-10',
    targetDate: '2025-08-15',
    createdBy: 'teacher',
    creatorName: 'Mr. Williams',
    strategies: [
      { id: '1', text: 'Use visual aids and manipulatives for problem-solving', source: 'school' },
      { id: '2', text: 'Practise math games that build confidence', source: 'school' },
      { id: '3', text: 'Relate math to real-life situations at home', source: 'home' }
    ],
    evidence: [
      { id: '1', type: 'note', title: 'Math confidence survey', date: '2025-05-20', addedBy: 'teacher' },
      { id: '2', type: 'photo', title: 'Working with manipulatives', date: '2025-06-05', addedBy: 'teacher' }
    ],
    updates: [
      { id: '1', date: '2025-05-20', content: 'Initial confidence survey completed. Oliver rated his math confidence as 4/10.', author: 'Mr. Williams' },
      { id: '2', date: '2025-06-05', content: 'Oliver is responding well to visual approaches. He successfully completed 3 problems independently today.', author: 'Mr. Williams' }
    ],
    progressData: [
      { date: '2025-05-10', value: 0 },
      { date: '2025-05-20', value: 15 },
      { date: '2025-06-05', value: 40 }
    ]
  },
  {
    id: '3',
    title: 'Develop Social Skills in Group Settings',
    description: 'Improve turn-taking and collaborative skills in group activities',
    category: 'Social',
    subject: 'Personal Development',
    status: 'completed',
    progress: 100,
    startDate: '2025-03-15',
    targetDate: '2025-05-30',
    createdBy: 'teacher',
    creatorName: 'Ms. Johnson',
    strategies: [
      { id: '1', text: 'Use visual timers for turn-taking activities', source: 'school' },
      { id: '2', text: 'Practise collaborative games with clear rules', source: 'school' },
      { id: '3', text: 'Arrange playdates with one friend at a time', source: 'home' }
    ],
    evidence: [
      { id: '1', type: 'note', title: 'Social skills observation', date: '2025-03-20', addedBy: 'teacher' },
      { id: '2', type: 'photo', title: 'Group project participation', date: '2025-04-15', addedBy: 'teacher' },
      { id: '3', type: 'note', title: 'Playdate feedback', date: '2025-05-10', addedBy: 'parent' },
      { id: '4', type: 'note', title: 'Final assessment', date: '2025-05-30', addedBy: 'teacher' }
    ],
    updates: [
      { id: '1', date: '2025-03-20', content: 'Initial observation completed. Oliver struggles with waiting for his turn and tends to dominate conversations.', author: 'Ms. Johnson' },
      { id: '2', date: '2025-04-15', content: 'Improvement noted in group project. Oliver waited for his turn 7/10 times.', author: 'Ms. Johnson' },
      { id: '3', date: '2025-05-10', content: 'Playdate with Sam went well. They took turns choosing activities and shared toys appropriately.', author: 'Parent' },
      { id: '4', date: '2025-05-30', content: 'Goal achieved! Oliver consistently demonstrates appropriate turn-taking and collaboration in group settings.', author: 'Ms. Johnson' }
    ],
    progressData: [
      { date: '2025-03-15', value: 0 },
      { date: '2025-03-20', value: 10 },
      { date: '2025-04-15', value: 45 },
      { date: '2025-05-10', value: 75 },
      { date: '2025-05-30', value: 100 }
    ]
  }
];

// Mock data for progress over time
const MOCK_PROGRESS_DATA = [
  { month: 'Jan', academic: 20, social: 30, emotional: 25 },
  { month: 'Feb', academic: 35, social: 40, emotional: 30 },
  { month: 'Mar', academic: 45, social: 55, emotional: 40 },
  { month: 'Apr', academic: 60, social: 70, emotional: 55 },
  { month: 'May', academic: 75, social: 90, emotional: 65 },
  { month: 'Jun', academic: 85, social: 100, emotional: 80 },
];

export default function SharedGoalTracking() {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedGoal, setSelectedGoal] = useState(MOCK_GOALS[0]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  
  // Filter goals based on active tab
  const filteredGoals = MOCK_GOALS.filter(goal => {
    if (activeTab === 'current') return goal.status === 'in-progress';
    if (activeTab === 'completed') return goal.status === 'completed';
    return true; // 'all' tab
  });
  
  // Handle adding a new update
  const handleAddUpdate = () => {
    if (newUpdate.trim() === '') return;
    
    toast({
      title: "Update Added",
      description: "Your update has been added to the goal.",
    });
    
    setNewUpdate('')    
    setShowAddUpdate(false);};
  
  // Calculate days remaining for a goal
  const calculateDaysRemaining = (targetDate) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Goal Tracking</h1>
          <p className="text-muted-foreground">
            Collaborate on setting and tracking educational goals
          </p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Goal Overview</CardTitle>
              <CardDescription>
                Track progress across all goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-centre mb-1">
                    <h4 className="text-sm font-medium">Academic Goals</h4>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-centre mb-1">
                    <h4 className="text-sm font-medium">Social Goals</h4>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-centre mb-1">
                    <h4 className="text-sm font-medium">Emotional Goals</h4>
                    <span className="text-sm text-muted-foreground">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Progress Over Time</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MOCK_PROGRESS_DATA}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="academic" stroke="#4f46e5" strokeWidth={2} />
                      <Line type="monotone" dataKey="social" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="emotional" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3 text-centre">
                  <h4 className="text-sm font-medium text-muted-foreground">Active Goals</h4>
                  <p className="text-2xl font-bold mt-1">2</p>
                </div>
                
                <div className="bg-muted rounded-lg p-3 text-centre">
                  <h4 className="text-sm font-medium text-muted-foreground">Completed</h4>
                  <p className="text-2xl font-bold mt-1">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Goal List</CardTitle>
              <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {filteredGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className={`p-4 border-b hover:bg-muted cursor-pointer ${selectedGoal.id === goal.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.subject}</p>
                      </div>
                      {goal.status === 'completed' ? (
                        <Badge variant="success" className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge variant="outline">{goal.progress}%</Badge>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="mt-2 flex justify-between items-centre text-xs text-muted-foreground">
                      <div className="flex items-centre">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {goal.status === 'completed' 
                            ? 'Completed on ' + new Date(goal.targetDate).toLocaleDateString() 
                            : calculateDaysRemaining(goal.targetDate) + ' days remaining'}
                        </span>
                      </div>
                      <div className="flex items-centre">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{goal.updates.length} updates</span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-centre">
                    <CardTitle>{selectedGoal.title}</CardTitle>
                    <Badge className="ml-2" variant={selectedGoal.status === 'completed' ? 'default' : 'outline'}>
                      {selectedGoal.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {selectedGoal.description}
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
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Goal
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Goal
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Goal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Progress</h3>
                    <span className="text-sm font-medium">{selectedGoal.progress}%</span>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-3" />
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(selectedGoal.startDate: any).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Target Date</p>
                      <p className="font-medium">{new Date(selectedGoal.targetDate: any).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Days Remaining</p>
                      <p className="font-medium">
                        {selectedGoal.status === 'completed' 
                          ? 'Completed' 
                          : calculateDaysRemaining(selectedGoal.targetDate: any) + ' days'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Strategies</h3>
                    <Button variant="ghost" size="sm">
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add Strategy
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedGoal.strategies.map((strategy: any) => (
                      <div key={strategy.id} className="flex items-start p-3 bg-muted rounded-lg">
                        <div className="mr-3">
                          {strategy.source === 'school' ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">School</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Home</Badge>
                          )}
                        </div>
                        <p className="text-sm">{strategy.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Evidence</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddEvidence(true: any)}>
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add Evidence
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedGoal.evidence.map((evidence: any) => (
                      <div key={evidence.id} className="flex items-start p-3 bg-muted rounded-lg">
                        <div className="mr-3">
                          {evidence.type === 'note' && <FileText className="h-8 w-8 text-blue-500" />}
                          {evidence.type === 'photo' && <Camera className="h-8 w-8 text-green-500" />}
                          {evidence.type === 'audio' && <Mic className="h-8 w-8 text-amber-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{evidence.title}</p>
                          <div className="flex items-centre mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(evidence.date: any).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>Added by {evidence.addedBy === 'teacher' ? 'Teacher' : 'Parent'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-centre mb-2">
                    <h3 className="text-sm font-medium">Updates</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddUpdate(true: any)}>
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add Update
                    </Button>
                  </div>
                  
                  {showAddUpdate && (
                    <div className="mb-4 p-4 border rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Add New Update</h4>
                      <Textarea 
                        placeholder="Enter your update here..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value: any)}
                        className="mb-3"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAddUpdate(false: any)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddUpdate}>
                          Save Update
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {selectedGoal.updates.map((update: any) => (
                      <div key={update.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{update.content}</p>
                        </div>
                        <div className="flex items-centre mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(update.date: any).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{update.author}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Progress Timeline</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedGoal.progressData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date: any) => new Date(date: any).toLocaleDateString(undefined: any, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value: any) => [`${value}%`, 'Progress']}
                          labelFormatter={(date: any) => new Date(date: any).toLocaleDateString()}
                        />
                        <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Goal Modal would be implemented here */}
      {/* Add Evidence Modal would be implemented here */}
    </div>
  );
}
