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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  BarChart, 
  BookOpen, 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Flag, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  MoreHorizontal, 
  Search, 
  Settings, 
  Shield, 
  ThumbsDown, 
  ThumbsUp, 
  Trash, 
  User, 
  Users, 
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

// Mock data for comments awaiting moderation
const pendingComments = [
  {
    id: '101',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'This article provides valuable insights! I\'ve been struggling with effective differentiation in my Year 4 class, especially with the wide range of abilities. I\'m going to look into the LiteracyLens platform mentioned - has anyone here had experience with it?',
    author: {
      id: '201',
      name: 'Jane Smith',
      avatar: '/avatars/jane-smith.jpg',
      role: 'Primary Teacher'
    },
    publishedAt: '2025-05-16T09:23:00',
    status: 'pending',
    flags: 0,
    reports: []
  },
  {
    id: '102',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'As a SENCO, I\'m both excited and cautious about AI-powered differentiation. The potential benefits are clear, but I worry about over-reliance on technology and the potential loss of teacher intuition in the differentiation process. How do we ensure we\'re using these tools to enhance rather than replace professional judgment?',
    author: {
      id: '202',
      name: 'Robert Johnson',
      avatar: '/avatars/robert-johnson.jpg',
      role: 'SENCO'
    },
    publishedAt: '2025-05-16T11:42:00',
    status: 'pending',
    flags: 0,
    reports: []
  },
  {
    id: '103',
    postId: '1',
    postTitle: 'AI-Powered Differentiation: Transforming Inclusive Education',
    content: 'Check out my website for more information on AI tools for education! [spam link removed]',
    author: {
      id: '203',
      name: 'Marketing Bot',
      avatar: '/avatars/default.jpg',
      role: 'User'
    },
    publishedAt: '2025-05-16T14:30:00',
    status: 'pending',
    flags: 2,
    reports: [
      {
        id: '301',
        reason: 'spam',
        details: 'Contains promotional links',
        reporterId: '201',
        createdAt: '2025-05-16T14:35:00'
      }
    ]
  },
  {
    id: '104',
    postId: '2',
    postTitle: 'Evidence-Based Approaches to Supporting Executive Function',
    content: 'I found this article quite misleading. The research cited doesn\'t actually support the conclusions drawn, and there\'s a significant body of contradictory evidence that\'s completely ignored.',
    author: {
      id: '204',
      name: 'Dr. Patricia Lee',
      avatar: '/avatars/patricia-lee.jpg',
      role: 'Researcher'
    },
    publishedAt: '2025-05-16T16:20:00',
    status: 'pending',
    flags: 1,
    reports: [
      {
        id: '302',
        reason: 'misinformation',
        details: 'This comment makes claims about research without providing evidence',
        reporterId: '205',
        createdAt: '2025-05-16T16:45:00'
      }
    ]
  },
  {
    id: '105',
    postId: '3',
    postTitle: 'The Future of Assessment: Beyond Traditional Testing',
    content: 'This is a terrible article and the author clearly doesn\'t know what they\'re talking about. Anyone who believes this nonsense is an idiot.',
    author: {
      id: '206',
      name: 'Anonymous User',
      avatar: '/avatars/default.jpg',
      role: 'User'
    },
    publishedAt: '2025-05-16T18:10:00',
    status: 'pending',
    flags: 3,
    reports: [
      {
        id: '303',
        reason: 'harassment',
        details: 'Insulting language directed at author and readers',
        reporterId: '207',
        createdAt: '2025-05-16T18:15:00'
      }
    ]
  }
];

// Mock data for moderation statistics
const moderationStats = {
  pending: 12,
  approved: 87,
  rejected: 23,
  flagged: 8,
  totalReports: 31,
  averageResponseTime: '1.4 hours',
  topReportReasons: [
    { reason: 'spam', count: 14 },
    { reason: 'harassment', count: 9 },
    { reason: 'misinformation', count: 5 },
    { reason: 'inappropriate', count: 3 }
  ],
  moderationByDay: [
    { day: 'Mon', approved: 12, rejected: 3 },
    { day: 'Tue', approved: 15, rejected: 4 },
    { day: 'Wed', approved: 18, rejected: 5 },
    { day: 'Thu', approved: 14, rejected: 3 },
    { day: 'Fri', approved: 16, rejected: 6 },
    { day: 'Sat', approved: 8, rejected: 1 },
    { day: 'Sun', approved: 4, rejected: 1 }
  ]
};

const CommentModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedComment, setSelectedComment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredComments, setFilteredComments] = useState(pendingComments);
  
  // Filter comments based on search query
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = pendingComments.filter(comment => 
      comment.content.toLowerCase().includes(query) || 
      comment.author.name.toLowerCase().includes(query) ||
      comment.postTitle.toLowerCase().includes(query)
    );
    setFilteredComments(filtered);
  };
  
  // Clear search filters
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredComments(pendingComments);
  };
  
  // Handle comment approval
  const handleApprove = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Remove from list
      setFilteredComments(filteredComments.filter(c => c.id !== comment.id));
      toast({
        title: "Comment approved",
        description: "The comment has been published successfully.",
      });
    }, 1000);
  };
  
  // Open rejection dialog
  const openRejectionDialog = (comment) => {
    setSelectedComment(comment);
    setRejectionReason("");
    setShowRejectionDialog(true);
  };
  
  // Handle comment rejection
  const handleReject = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowRejectionDialog(false);
      // Remove from list
      setFilteredComments(filteredComments.filter(c => c.id !== selectedComment.id));
      toast({
        title: "Comment rejected",
        description: "The comment has been rejected and will not be published.",
      });
    }, 1000);
  };
  
  // Handle comment flagging for review
  const handleFlag = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Update status in list
      const updatedComments = filteredComments.map(c => 
        c.id === comment.id ? { ...c, status: 'flagged' } : c
      );
      setFilteredComments(updatedComments);
      toast({
        title: "Comment flagged",
        description: "The comment has been flagged for further review.",
      });
    }, 1000);
  };
  
  // Handle comment deletion
  const handleDelete = (comment) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Remove from list
      setFilteredComments(filteredComments.filter(c => c.id !== comment.id));
      toast({
        title: "Comment deleted",
        description: "The comment has been permanently deleted.",
      });
    }, 1000);
  };
  
  // Render comment list
  const renderCommentList = () => (
    <div className="space-y-4">
      {filteredComments.length > 0 ? (
        filteredComments.map((comment) => (
          <Card key={comment.id} className={comment.flags > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {comment.flags > 0 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Flag className="h-3 w-3 mr-1" />
                      {comment.flags} {comment.flags === 1 ? 'flag' : 'flags'}
                    </Badge>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(comment.publishedAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                On post: <span className="font-medium">{comment.postTitle}</span>
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm">{comment.content}</p>
              
              {comment.reports && comment.reports.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Reported Content
                  </h4>
                  <div className="mt-2 space-y-2">
                    {comment.reports.map((report) => (
                      <div key={report.id} className="text-xs text-red-700">
                        <p className="font-medium">Reason: {report.reason}</p>
                        {report.details && <p>Details: {report.details}</p>}
                        <p className="text-xs text-red-500">
                          Reported on {new Date(report.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleFlag(comment)}
                disabled={isProcessing}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(comment)}
                disabled={isProcessing}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => openRejectionDialog(comment)}
                disabled={isProcessing}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleApprove(comment)}
                disabled={isProcessing}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No comments to moderate</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? "No comments match your search criteria" : "All comments have been moderated"}
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
  
  // Render statistics dashboard
  const renderStatsDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold">{moderationStats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-green-600">{moderationStats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-red-600">{moderationStats.rejected}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Flagged</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-yellow-600">{moderationStats.flagged}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Moderation Activity</CardTitle>
            <CardDescription>
              Comments moderated over the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto mb-2" />
                <p>Chart visualization would appear here</p>
                <p className="text-sm">Showing approved vs rejected comments by day</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Report Reasons</CardTitle>
            <CardDescription>
              Most common reasons for reporting comments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {moderationStats.topReportReasons.map((item) => (
                <div key={item.reason} className="flex items-center">
                  <div className="w-1/3 text-sm capitalize">{item.reason}</div>
                  <div className="w-2/3 flex items-center">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ 
                        width: `${(item.count / Math.max(...moderationStats.topReportReasons.map(r => r.count))) * 100}%` 
                      }}
                    />
                    <span className="ml-2 text-sm">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Moderation Performance</CardTitle>
          <CardDescription>
            Key metrics for comment moderation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Average Response Time</h3>
              <p className="text-2xl font-bold">{moderationStats.averageResponseTime}</p>
              <p className="text-xs text-muted-foreground">Time from submission to moderation</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Total Reports</h3>
              <p className="text-2xl font-bold">{moderationStats.totalReports}</p>
              <p className="text-xs text-muted-foreground">Reports submitted by users</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Approval Rate</h3>
              <p className="text-2xl font-bold">
                {Math.round((moderationStats.approved / (moderationStats.approved + moderationStats.rejected)) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Percentage of comments approved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Render settings panel
  const renderSettingsPanel = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Automated Moderation Settings</CardTitle>
          <CardDescription>
            Configure AI-powered moderation tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-flag">Auto-Flag Suspicious Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically flag comments that may violate community guidelines
                </p>
              </div>
              <Switch id="auto-flag" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approve">Auto-Approve Safe Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve comments that are deemed safe by AI
                </p>
              </div>
              <Switch id="auto-approve" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reject">Auto-Reject Harmful Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically reject comments that contain harmful content
                </p>
              </div>
              <Switch id="auto-reject" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sensitivity">AI Sensitivity Level</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="sensitivity">
                <SelectValue placeholder="Select sensitivity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Only flag clearly problematic content</SelectItem>
                <SelectItem value="medium">Medium - Balanced approach (Recommended)</SelectItem>
                <SelectItem value="high">High - Flag potentially problematic content</SelectItem>
                <SelectItem value="very-high">Very High - Strict moderation</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Higher sensitivity may result in more false positives
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Comment Policy Settings</CardTitle>
          <CardDescription>
            Configure comment policies and guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="approval-mode">Comment Approval Mode</Label>
            <Select defaultValue="moderated">
              <SelectTrigger id="approval-mode">
                <SelectValue placeholder="Select approval mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatic - Post immediately, moderate after</SelectItem>
                <SelectItem value="moderated">Pre-moderated - Approve before posting</SelectItem>
                <SelectItem value="trusted">Trusted Users - Auto-approve for trusted users only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment-guidelines">Comment Guidelines</Label>
            <Textarea 
              id="comment-guidelines" 
              rows={5}
              defaultValue="Comments should be respectful, relevant to the topic, and contribute to the educational discussion. We do not allow promotional content, personal attacks, or misinformation. All comments are moderated according to our community guidelines."
            />
            <p className="text-xs text-muted-foreground">
              These guidelines will be displayed to users before they comment
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rejection-templates">Rejection Message Templates</Label>
            <Textarea 
              id="rejection-templates" 
              rows={5}
              defaultValue="1. Your comment has been rejected as it contains promotional content.\n2. Your comment has been rejected as it contains inappropriate language.\n3. Your comment has been rejected as it contains misinformation.\n4. Your comment has been rejected as it violates our community guidelines."
            />
            <p className="text-xs text-muted-foreground">
              One template per line, used when rejecting comments
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  // Render help and guidelines panel
  const renderHelpPanel = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Moderation Guidelines</CardTitle>
          <CardDescription>
            Best practices for moderating educational content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">General Principles</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Focus on maintaining a constructive educational environment</li>
              <li>Encourage evidence-based discussion and critical thinking</li>
              <li>Apply consistent standards across all content</li>
              <li>Consider educational context and intent</li>
              <li>Prioritize child safety and wellbeing</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">What to Approve</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Constructive feedback and questions</li>
              <li>Evidence-based perspectives, even if challenging</li>
              <li>Relevant personal experiences</li>
              <li>Thoughtful disagreement that remains respectful</li>
              <li>Additional resources that enhance the discussion</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">What to Reject</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Promotional content and spam</li>
              <li>Personal attacks or disrespectful language</li>
              <li>Clearly false information presented as fact</li>
              <li>Content that violates privacy or confidentiality</li>
              <li>Inappropriate content for educational context</li>
              <li>Irrelevant or off-topic discussions</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">When to Flag for Review</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Content in grey areas that requires additional consideration</li>
              <li>Comments that may contain subtle misinformation</li>
              <li>Content that may be inappropriate but isn't clearly violating guidelines</li>
              <li>Comments that may need fact-checking</li>
              <li>Potentially controversial but possibly valuable perspectives</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>AI Moderation Assistance</CardTitle>
          <CardDescription>
            How AI helps with comment moderation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">AI Capabilities</h3>
            <p className="text-sm">
              Our AI moderation system helps identify potentially problematic content by analyzing:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Toxic language and personal attacks</li>
              <li>Promotional content and spam patterns</li>
              <li>Potentially misleading information</li>
              <li>Content relevance to educational topics</li>
              <li>Privacy concerns and personal information</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <h4 className="text-sm font-medium text-yellow-800 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              Important Limitations
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              AI moderation is a tool to assist human moderators, not replace them. The system may miss nuanced issues or incorrectly flag legitimate content. Always review AI recommendations before taking action.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Understanding AI Confidence Scores</h3>
            <p className="text-sm">
              Each AI moderation recommendation includes a confidence score:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li><span className="font-medium text-green-600">High confidence (80-100%)</span>: AI is very certain of its assessment</li>
              <li><span className="font-medium text-yellow-600">Medium confidence (50-79%)</span>: AI has detected potential issues but is less certain</li>
              <li><span className="font-medium text-red-600">Low confidence (0-49%)</span>: AI has flagged content but is uncertain, requiring careful human review</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comment Moderation</h1>
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
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
                <Users className="h-4 w-4 mr-2" />
                Manage Moderators
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export Moderation Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <BarChart className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge className="ml-2 bg-primary text-primary-foreground">{pendingComments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="help">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 pt-4">
          {renderCommentList()}
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4 pt-4">
          {renderStatsDashboard()}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          {renderSettingsPanel()}
        </TabsContent>
        
        <TabsContent value="help" className="space-y-4 pt-4">
          {renderHelpPanel()}
        </TabsContent>
      </Tabs>
      
      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Comment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this comment. This will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea 
                id="rejection-reason" 
                placeholder="Explain why this comment is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Common Reasons</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setRejectionReason("Your comment has been rejected as it contains promotional content.")}
                >
                  Promotional content
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setRejectionReason("Your comment has been rejected as it contains inappropriate language.")}
                >
                  Inappropriate language
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setRejectionReason("Your comment has been rejected as it contains misinformation.")}
                >
                  Misinformation
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setRejectionReason("Your comment has been rejected as it violates our community guidelines.")}
                >
                  Violates guidelines
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject Comment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentModerationDashboard;

