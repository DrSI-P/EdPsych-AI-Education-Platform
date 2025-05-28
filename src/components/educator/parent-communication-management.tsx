'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Unused import
// import { Badge } from "@/components/ui/badge"; // Unused import
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send, Calendar as CalendarIcon2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast"; // Unused import
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Template categories for parent communications
const templateCategories = [
  { id: "academic", name: "Academic Progress" },
  { id: "behaviour", name: "Behaviour" },
  { id: "attendance", name: "Attendance" },
  { id: "events", name: "School Events" },
  { id: "meetings", name: "Parent Meetings" },
  { id: "general", name: "General Updates" },
  { id: "sen", name: "Special Educational Needs" },
  { id: "restorative", name: "Restorative Approaches" }
];

// Sample communication templates
const communicationTemplates = [
  {
    id: "academic-progress",
    category: "academic",
    title: "Positive Academic Progress",
    content: "Dear [Parent/Guardian],\n\nI am writing to share some positive news about [Student]'s academic progress. [He/She/They] has shown significant improvement in [Subject] over the past [timeframe]. [Student] has demonstrated [specific achievements/skills].\n\nThis progress reflects [Student]'s dedication and hard work. We would like to encourage this continued effort and growth.\n\nPlease feel free to contact me if you would like to discuss [Student]'s progress further.\n\nKind regards,\n[Teacher Name]",
    tags: ["positive", "progress", "achievement"]
  },
  {
    id: "academic-support",
    category: "academic",
    title: "Academic Support Needed",
    content: "Dear [Parent/Guardian],\n\nI am writing regarding [Student]'s recent performance in [Subject]. I've noticed that [Student] may benefit from some additional support with [specific concept/skill].\n\nIn class, we are working on [current topic], and I've observed that [specific observations]. To support [Student]'s learning, I would recommend [suggested strategies/resources].\n\nI would welcome the opportunity to discuss this further and develop a collaborative approach to supporting [Student]'s learning. Please let me know if you would be available for a brief meeting.\n\nKind regards,\n[Teacher Name]",
    tags: ["support", "intervention", "collaboration"]
  },
  {
    id: "behaviour-positive",
    category: "behaviour",
    title: "Positive Behaviour Recognition",
    content: "Dear [Parent/Guardian],\n\nI wanted to take a moment to recognise [Student]'s excellent behaviour in class. Recently, [Student] has [specific positive behaviour], which has had a positive impact on both their learning and our classroom community.\n\nThis demonstrates [Student]'s growing [values/skills] and contributes significantly to our positive learning environment.\n\nThank you for your support in fostering these important values at home.\n\nKind regards,\n[Teacher Name]",
    tags: ["positive", "behaviour", "recognition"]
  }
];

// Sample students for demonstration
const sampleStudents = [
  { id: "s1", name: "Emma Thompson", yearGroup: "Year 3", parent: "Mr & Mrs Thompson", email: "thompson@example.com", lastContact: "2025-05-10" },
  { id: "s2", name: "James Wilson", yearGroup: "Year 5", parent: "Ms Wilson", email: "wilson@example.com", lastContact: "2025-05-15" },
  { id: "s3", name: "Sophia Ahmed", yearGroup: "Year 2", parent: "Dr Ahmed", email: "ahmed@example.com", lastContact: "2025-05-01" }
];

export function ParentCommunicationManagement() : React.ReactNode {
  // State for selected tab
  const [activeTab, setActiveTab] = useState("compose");
  
  // State for compose form
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [scheduledDate, setScheduledDate] = useState(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState(communicationTemplates);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  
  // Filter templates when category or search term changes
  useEffect(() => {
    let filtered = communicationTemplates;
    
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(lowerSearchTerm) || 
        template.content.toLowerCase().includes(lowerSearchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    setFilteredTemplates(filtered);
  }, [selectedCategory, searchTerm]);
  
  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    const template = communicationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessageContent(template.content);
      setSubject(template.title);
    }
  };
  
  // Render message composition section
  const renderMessageComposition = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
          <CardDescription>Customize your message and select recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message Content</Label>
              <Textarea 
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message here..."
                className="mt-1 min-h-[200px]"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Schedule (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Schedule for later"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={() => /* eslint-disable-next-line no-console */ console.log("Send message")}>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Parent Communication Management</h1>
      <p className="text-muted-foreground mb-6">
        Create, manage, and track communications with parents and guardians
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">Communication History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-6">
          {renderTemplateSelection()}
          {renderMessageComposition()}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>View and manage previous communications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Communication history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Communication Analytics</CardTitle>
              <CardDescription>Insights and statistics about parent communications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
