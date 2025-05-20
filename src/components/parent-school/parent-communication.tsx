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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Globe, 
  Bell, 
  Calendar, 
  Users, 
  BookOpen, 
  Settings,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Image,
  Video,
  Mic,
  Link,
  Smile,
  PlusCircle,
  X,
  RefreshCw
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'Ms. Johnson (Year 4 Teacher)',
    avatar: '/avatars/teacher1.png',
    lastMessage: 'Thank you for sharing those reading strategies. I\'ve noticed improvement already!',
    time: '10:32 AM',
    unread: 0,
    online: true
  },
  {
    id: '2',
    name: 'Mr. Williams (Maths Coordinator)',
    avatar: '/avatars/teacher2.png',
    lastMessage: 'Could we schedule a meeting to discuss the new numeracy approach?',
    time: 'Yesterday',
    unread: 2,
    online: false
  },
  {
    id: '3',
    name: 'Mrs. Patel (SENCO)',
    avatar: '/avatars/teacher3.png',
    lastMessage: 'I\'ve attached the updated support plan for review.',
    time: 'Monday',
    unread: 0,
    online: true
  },
  {
    id: '4',
    name: 'Mr. Thompson (Headteacher)',
    avatar: '/avatars/teacher4.png',
    lastMessage: 'Looking forward to seeing you at the school community event!',
    time: 'Last week',
    unread: 0,
    online: false
  },
  {
    id: '5',
    name: 'Ms. Chen (Art Teacher)',
    avatar: '/avatars/teacher5.png',
    lastMessage: 'Emma\'s artwork was exceptional this week. I\'ve shared some photos.',
    time: 'Last week',
    unread: 0,
    online: true
  }
];

// Mock data for messages in a conversation
const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'teacher',
    name: 'Ms. Johnson',
    avatar: '/avatars/teacher1.png',
    content: 'Good morning! I wanted to share some observations about Oliver\'s reading progress this week.',
    time: '10:02 AM',
    translated: false,
    attachments: []
  },
  {
    id: '2',
    sender: 'parent',
    name: 'You',
    avatar: '/avatars/parent1.png',
    content: 'Good morning Ms. Johnson! That would be great, we\'ve been practicing at home as well.',
    time: '10:05 AM',
    translated: false,
    attachments: []
  },
  {
    id: '3',
    sender: 'teacher',
    name: 'Ms. Johnson',
    avatar: '/avatars/teacher1.png',
    content: 'I\'ve noticed he\'s much more confident with decoding unfamiliar words. The strategies we discussed at parents\' evening seem to be working well. He finished his first chapter book yesterday and was so proud!',
    time: '10:08 AM',
    translated: false,
    attachments: [
      {
        id: '1',
        type: 'image',
        name: 'reading_progress.jpg',
        url: '/attachments/reading_progress.jpg'
      }
    ]
  },
  {
    id: '4',
    sender: 'parent',
    name: 'You',
    avatar: '/avatars/parent1.png',
    content: 'That\'s wonderful news! He\'s been very excited about reading at home too. The visual bookmarks with the decoding strategies have been really helpful. He uses them every time he gets stuck.',
    time: '10:15 AM',
    translated: false,
    attachments: []
  },
  {
    id: '5',
    sender: 'teacher',
    name: 'Ms. Johnson',
    avatar: '/avatars/teacher1.png',
    content: 'I\'m so glad to hear that! Would you be interested in some additional resources to support his growing interest in reading? I have some book recommendations and activities that might be engaging for him.',
    time: '10:20 AM',
    translated: false,
    attachments: []
  },
  {
    id: '6',
    sender: 'parent',
    name: 'You',
    avatar: '/avatars/parent1.png',
    content: 'Yes, that would be fantastic! He particularly enjoys adventure stories and books about space. Any recommendations along those lines would be perfect.',
    time: '10:25 AM',
    translated: false,
    attachments: []
  },
  {
    id: '7',
    sender: 'teacher',
    name: 'Ms. Johnson',
    avatar: '/avatars/teacher1.png',
    content: 'Perfect! I\'ll put together a list of space and adventure books at his reading level. I\'ll also include some comprehension activities that you can try at home. These will help reinforce his understanding while keeping it fun and engaging.',
    time: '10:30 AM',
    translated: false,
    attachments: []
  },
  {
    id: '8',
    sender: 'parent',
    name: 'You',
    avatar: '/avatars/parent1.png',
    content: 'Thank you for sharing those reading strategies. I\'ve noticed improvement already!',
    time: '10:32 AM',
    translated: false,
    attachments: []
  }
];

// Mock data for message templates
const MESSAGE_TEMPLATES = [
  { id: '1', title: 'Absence Notification', content: 'I would like to inform you that [Student Name] will be absent on [Date] due to [Reason].' },
  { id: '2', title: 'Homework Question', content: 'I have a question regarding the homework assigned on [Date]. [Question Details]' },
  { id: '3', title: 'Meeting Request', content: 'I would like to schedule a meeting to discuss [Topic]. I am available on [Dates/Times].' },
  { id: '4', title: 'Thank You Note', content: 'I wanted to express my appreciation for [Reason]. Thank you for your support and dedication.' },
  { id: '5', title: 'Progress Update Request', content: 'I would appreciate an update on [Student Name]\'s progress in [Subject/Area].' }
];

// Mock data for language options
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'it', label: 'Italian (Italiano)' },
  { value: 'pl', label: 'Polish (Polski)' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'ur', label: 'Urdu (اردو)' },
  { value: 'bn', label: 'Bengali (বাংলা)' },
  { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { value: 'so', label: 'Somali (Soomaali)' },
  { value: 'ro', label: 'Romanian (Română)' }
];

export default function ParentCommunicationManagement() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [showTemplates, setShowTemplates] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(false);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  
  // Filter conversations based on search term
  const filteredConversations = MOCK_CONVERSATIONS.filter(
    conversation => conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMessageObj = {
      id: (messages.length + 1).toString(),
      sender: 'parent',
      name: 'You',
      avatar: '/avatars/parent1.png',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      translated: false,
      attachments: []
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    
    // Simulate teacher response after a delay
    setTimeout(() => {
      const teacherResponse = {
        id: (messages.length + 2).toString(),
        sender: 'teacher',
        name: selectedConversation.name.split(' ')[0] + ' ' + selectedConversation.name.split(' ')[1],
        avatar: selectedConversation.avatar,
        content: 'Thank you for your message. I\'ll follow up on this shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        translated: false,
        attachments: []
      };
      
      setMessages(prevMessages => [...prevMessages, teacherResponse]);
    }, 3000);
  };
  
  // Handle using a message template
  const handleUseTemplate = (template) => {
    setNewMessage(template.content);
    setShowTemplates(false);
  };
  
  // Handle language change
  const handleLanguageChange = (value) => {
    setPreferredLanguage(value);
    toast({
      title: "Language Updated",
      description: `Your preferred language has been set to ${LANGUAGE_OPTIONS.find(lang => lang.value === value).label}.`,
    });
  };
  
  // Toggle translation for a message
  const handleToggleTranslation = (messageId) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, translated: !message.translated } 
          : message
      )
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent-School Communication</h1>
          <p className="text-muted-foreground">
            Connect with teachers and staff to support your child's education
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={preferredLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(language => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Communication Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="notifications" className="flex-1">Notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="auto-translate" className="flex-1">Auto-translate messages</Label>
                  <Switch 
                    id="auto-translate" 
                    checked={autoTranslateEnabled}
                    onCheckedChange={setAutoTranslateEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="read-receipts" className="flex-1">Send read receipts</Label>
                  <Switch 
                    id="read-receipts" 
                    checked={readReceiptsEnabled}
                    onCheckedChange={setReadReceiptsEnabled}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <Card className="col-span-4">
              <CardHeader className="p-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`flex items-start p-4 hover:bg-muted cursor-pointer ${selectedConversation.id === conversation.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="relative mr-3">
                          <Avatar>
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No conversations found
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Conversation Messages */}
            <Card className="col-span-8">
              <CardHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                      <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedConversation.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.online ? 'Online' : 'Last active: ' + selectedConversation.time}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Schedule meeting</DropdownMenuItem>
                      <DropdownMenuItem>Share resources</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mute conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-450px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${message.sender === 'parent' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                          <Avatar className={`h-8 w-8 ${message.sender === 'parent' ? 'ml-2' : 'mr-2'}`}>
                            <AvatarImage src={message.avatar} alt={message.name} />
                            <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`rounded-lg p-3 ${message.sender === 'parent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              {message.translated ? (
                                <p className="text-sm">
                                  <span className="block italic text-xs mb-1">[Translated from English]</span>
                                  {message.content} (Translated content would appear here)
                                </p>
                              ) : (
                                <p className="text-sm">{message.content}</p>
                              )}
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map(attachment => (
                                    <div 
                                      key={attachment.id}
                                      className={`flex items-center p-2 rounded ${message.sender === 'parent' ? 'bg-primary-foreground/20' : 'bg-background'}`}
                                    >
                                      {attachment.type === 'image' ? (
                                        <Image className="h-4 w-4 mr-2" />
                                      ) : attachment.type === 'document' ? (
                                        <FileText className="h-4 w-4 mr-2" />
                                      ) : (
                                        <Paperclip className="h-4 w-4 mr-2" />
                                      )}
                                      <span className="text-xs">{attachment.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className={`flex items-center mt-1 text-xs text-muted-foreground ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                              <span>{message.time}</span>
                              {preferredLanguage !== 'en' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5 ml-1"
                                  onClick={() => handleToggleTranslation(message.id)}
                                >
                                  <Globe className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="relative w-full">
                  {showTemplates && (
                    <div className="absolute bottom-full mb-2 w-full bg-background border rounded-md shadow-md z-10">
                      <div className="p-2 border-b">
                        <h4 className="font-medium text-sm">Message Templates</h4>
                      </div>
                      <ScrollArea className="h-60">
                        {MESSAGE_TEMPLATES.map(template => (
                          <div 
                            key={template.id}
                            className="p-3 hover:bg-muted cursor-pointer border-b"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <h5 className="font-medium text-sm">{template.title}</h5>
                            <p className="text-xs text-muted-foreground truncate">{template.content}</p>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowTemplates(!showTemplates)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1 min-h-[60px] max-h-[200px]"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>
                Important updates and announcements from the school
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/teacher4.png" alt="Mr. Thompson" />
                        <AvatarFallback>MT</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">End of Term Arrangements</h3>
                        <p className="text-sm text-muted-foreground">From Mr. Thompson, Headteacher</p>
                        <div className="mt-2">
                          <p className="text-sm">Dear Parents and Carers,</p>
                          <p className="text-sm mt-2">
                            As we approach the end of term, I wanted to share some important information about our closing arrangements and upcoming events.
                          </p>
                          <p className="text-sm mt-2">
                            The last day of term will be Friday, 21st July. School will finish at the normal time of 3:30pm. Our end-of-year assembly will take place at 2:00pm, and parents are welcome to attend.
                          </p>
                          <p className="text-sm mt-2">
                            Reports will be sent home with students on Monday, 17th July. If you would like to discuss your child's report, please contact their class teacher to arrange a meeting.
                          </p>
                          <p className="text-sm mt-2">
                            The new academic year will begin on Wednesday, 6th September for all students.
                          </p>
                          <p className="text-sm mt-2">
                            Thank you for your continued support throughout this academic year.
                          </p>
                          <p className="text-sm mt-2">
                            Best regards,<br />
                            Mr. Thompson<br />
                            Headteacher
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">10 July 2025</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      <span>Read</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/teacher6.png" alt="Mrs. Roberts" />
                        <AvatarFallback>LR</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Sports Day Information</h3>
                        <p className="text-sm text-muted-foreground">From Mrs. Roberts, PE Coordinator</p>
                        <div className="mt-2">
                          <p className="text-sm">Dear Parents and Carers,</p>
                          <p className="text-sm mt-2">
                            Our annual Sports Day will take place on Tuesday, 18th July, weather permitting. The event will run from 10:00am to 2:30pm on the school field.
                          </p>
                          <p className="text-sm mt-2">
                            Children should come to school in their PE kit and house colours. Please ensure they have a water bottle, sun hat, and sun cream applied before school if the weather is warm.
                          </p>
                          <p className="text-sm mt-2">
                            Parents are welcome to attend and support. Refreshments will be available from the PTA.
                          </p>
                          <p className="text-sm mt-2">
                            In case of poor weather, we will make a decision by 8:30am on the day and notify you via the school app.
                          </p>
                          <p className="text-sm mt-2">
                            Kind regards,<br />
                            Mrs. Roberts<br />
                            PE Coordinator
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">5 July 2025</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      <span>Read</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                Schedule and manage parent-teacher meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-3 text-center">
                        <p className="text-sm font-medium">JUL</p>
                        <p className="text-xl font-bold">15</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Parents' Evening</h3>
                        <p className="text-sm text-muted-foreground">15 July 2025, 4:00 PM - 7:00 PM</p>
                        <p className="text-sm mt-2">
                          End of year parents' evening to discuss your child's progress and achievements.
                        </p>
                      </div>
                    </div>
                    <Badge>Confirmed</Badge>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/avatars/teacher1.png" alt="Ms. Johnson" />
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Ms. Johnson (Year 4 Teacher)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Clock className="h-3 w-3 mr-1" />
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-3 w-3 mr-1" />
                        Join Online
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-3 text-center">
                        <p className="text-sm font-medium">JUL</p>
                        <p className="text-xl font-bold">20</p>
                      </div>
                      <div>
                        <h3 className="font-medium">SEND Review Meeting</h3>
                        <p className="text-sm text-muted-foreground">20 July 2025, 10:30 AM - 11:30 AM</p>
                        <p className="text-sm mt-2">
                          End of year review of support plan and progress.
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/avatars/teacher3.png" alt="Mrs. Patel" />
                        <AvatarFallback>MP</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Mrs. Patel (SENCO)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Confirm
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Request New Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Shared Resources</CardTitle>
              <CardDescription>
                Resources shared between home and school
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search resources..." className="pl-8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Resources</SelectItem>
                        <SelectItem value="school">From School</SelectItem>
                        <SelectItem value="home">From Home</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="maths">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Share Resource
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-lg mr-3 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Reading Strategies Guide</h3>
                          <p className="text-sm text-muted-foreground">Shared by Ms. Johnson on 5 July 2025</p>
                          <p className="text-sm mt-2">
                            A guide to supporting reading comprehension at home, with strategies for decoding unfamiliar words.
                          </p>
                        </div>
                      </div>
                      <Badge>PDF</Badge>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Viewed 3 days ago</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-3 rounded-lg mr-3 flex items-center justify-center">
                          <Image className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Home Reading Environment Photos</h3>
                          <p className="text-sm text-muted-foreground">Shared by you on 10 July 2025</p>
                          <p className="text-sm mt-2">
                            Photos of the reading corner we've set up at home to support Oliver's reading development.
                          </p>
                        </div>
                      </div>
                      <Badge>Images</Badge>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>2 comments</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-3 rounded-lg mr-3 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Summer Reading Challenge</h3>
                          <p className="text-sm text-muted-foreground">Shared by Ms. Johnson on 12 July 2025</p>
                          <p className="text-sm mt-2">
                            Information about the summer reading challenge at the local library, with recommended books for Year 4 students.
                          </p>
                        </div>
                      </div>
                      <Badge>PDF</Badge>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Shared yesterday</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-3 rounded-lg mr-3 flex items-center justify-center">
                          <Video className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Phonics Practice Video</h3>
                          <p className="text-sm text-muted-foreground">Shared by Ms. Johnson on 8 July 2025</p>
                          <p className="text-sm mt-2">
                            A video demonstrating phonics techniques used in class, to help with consistent practice at home.
                          </p>
                        </div>
                      </div>
                      <Badge>Video</Badge>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Viewed 5 days ago</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

