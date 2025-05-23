'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, Send, Clock, CheckCircle, AlertCircle, RefreshCw, Download, Upload, Plus, Trash2, Edit, MessageSquare, Users, Calendar as CalendarIcon2, BarChart2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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
  },
  {
    id: "behaviour-concern",
    category: "behaviour",
    title: "Behaviour Concern - Restorative Approach",
    content: "Dear [Parent/Guardian],\n\nI am writing regarding a situation that occurred at school involving [Student]. Today, [brief description of incident].\n\nWe have addressed this using our restorative approach, which involved [description of restorative process]. [Student] had the opportunity to reflect on their actions and consider how to make things right.\n\nOur next steps include [follow-up actions]. Your support in discussing this at home would be valuable in reinforcing our restorative approach.\n\nPlease contact me if you would like to discuss this further.\n\nKind regards,\n[Teacher Name]",
    tags: ["concern", "restorative", "reflection"]
  },
  {
    id: "attendance-concern",
    category: "attendance",
    title: "Attendance Concern",
    content: "Dear [Parent/Guardian],\n\nI am writing regarding [Student]'s recent attendance. Our records show that [Student] has missed [number] days in the past [timeframe], which may impact their educational progress.\n\nRegular attendance is crucial for academic success and social development. When students miss school, they miss important learning opportunities and can find it challenging to catch up.\n\nIf there are specific circumstances affecting [Student]'s attendance, please let us know so we can provide appropriate support. We are committed to working with you to ensure [Student]'s regular attendance and continued progress.\n\nKind regards,\n[Teacher Name]",
    tags: ["attendance", "concern", "support"]
  },
  {
    id: "parent-meeting",
    category: "meetings",
    title: "Parent-Teacher Meeting Request",
    content: "Dear [Parent/Guardian],\n\nI would like to invite you to a meeting to discuss [Student]'s [progress/specific topic]. This would be an opportunity for us to share insights and develop strategies to support [Student]'s learning and development.\n\nThe meeting would focus on [specific topics/areas] and would last approximately [duration].\n\nPlease let me know which of the following times would be convenient for you:\n- [date and time option 1]\n- [date and time option 2]\n- [date and time option 3]\n\nIf none of these times are suitable, please suggest alternatives that would work better for you.\n\nKind regards,\n[Teacher Name]",
    tags: ["meeting", "collaboration", "planning"]
  },
  {
    id: "sen-update",
    category: "sen",
    title: "SEN Support Update",
    content: "Dear [Parent/Guardian],\n\nI am writing to update you on the support [Student] is receiving for their special educational needs.\n\nCurrently, [Student] is accessing [specific interventions/support] which focus on [specific areas]. We have observed [recent observations/progress].\n\nOur next steps include [planned actions/adjustments]. We would value your insights on how [Student] is responding to these supports and any strategies that have been effective at home.\n\nPlease feel free to contact me to discuss this further or share any additional information that might help us better support [Student].\n\nKind regards,\n[Teacher Name]",
    tags: ["SEN", "support", "collaboration"]
  }
];

// Sample students for demonstration
const sampleStudents = [
  { id: "s1", name: "Emma Thompson", yearGroup: "Year 3", parent: "Mr & Mrs Thompson", email: "thompson@example.com", lastContact: "2025-05-10" },
  { id: "s2", name: "James Wilson", yearGroup: "Year 5", parent: "Ms Wilson", email: "wilson@example.com", lastContact: "2025-05-15" },
  { id: "s3", name: "Sophia Ahmed", yearGroup: "Year 2", parent: "Dr Ahmed", email: "ahmed@example.com", lastContact: "2025-05-01" },
  { id: "s4", name: "Oliver Patel", yearGroup: "Year 6", parent: "Mr Patel", email: "patel@example.com", lastContact: "2025-05-12" },
  { id: "s5", name: "Amelia Johnson", yearGroup: "Year 4", parent: "Mrs Johnson", email: "johnson@example.com", lastContact: "2025-04-28" }
];

// Sample communication history
const sampleCommunicationHistory = [
  { id: "c1", studentId: "s1", date: "2025-05-10", subject: "Weekly Progress Update", type: "Email", status: "Sent", response: true },
  { id: "c2", studentId: "s1", date: "2025-04-25", subject: "Maths Support Resources", type: "Email", status: "Sent", response: true },
  { id: "c3", studentId: "s2", date: "2025-05-15", subject: "Reading Challenge Achievement", type: "Email", status: "Sent", response: false },
  { id: "c4", studentId: "s3", date: "2025-05-01", subject: "Attendance Concern", type: "Email", status: "Sent", response: true },
  { id: "c5", studentId: "s4", date: "2025-05-12", subject: "Science Project Feedback", type: "Email", status: "Sent", response: false },
  { id: "c6", studentId: "s5", date: "2025-04-28", subject: "Parent-Teacher Meeting Request", type: "Email", status: "Sent", response: true }
];

// Languages supported for translation
const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "cy", name: "Welsh" },
  { code: "pl", name: "Polish" },
  { code: "ur", name: "Urdu" },
  { code: "bn", name: "Bengali" },
  { code: "gu", name: "Gujarati" },
  { code: "so", name: "Somali" },
  { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ro", name: "Romanian" },
  { code: "lt", name: "Lithuanian" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" }
];

export function ParentCommunicationManagement() {
  // State for selected tab
  const [activeTab, setActiveTab] = useState("compose");
  
  // State for compose form
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTemplates, setFilteredTemplates] = useState(communicationTemplates);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  const [selectedStudent, setSelectedStudent] = useState<typeof sampleStudents[0] | null>(null);
  const [studentCommunications, setStudentCommunications] = useState<typeof sampleCommunicationHistory>([]);
  
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
  
  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(sampleStudents);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = sampleStudents.filter(student => 
      student.name.toLowerCase().includes(lowerSearchTerm) || 
      student.yearGroup.toLowerCase().includes(lowerSearchTerm) ||
      student.parent.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredStudents(filtered);
  }, [searchTerm]);
  
  // Update student communications when selected student changes
  useEffect(() => {
    if (!selectedStudent) {
      setStudentCommunications([]);
      return;
    }
    
    const communications = sampleCommunicationHistory.filter(
      comm => comm.studentId === selectedStudent.id
    );
    
    setStudentCommunications(communications);
  }, [selectedStudent]);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = communicationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessageContent(template.content);
      setSubject(template.title);
    }
  };
  
  // Handle student selection for communication
  const handleStudentSelect = (studentId: string) => {
    const isSelected = selectedStudents.includes(studentId);
    
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  // Handle student selection for history view
  const handleStudentHistorySelect = (student: typeof sampleStudents[0]) => {
    setSelectedStudent(student);
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!subject || !messageContent || selectedStudents.length === 0) {
      toast("Please complete all required fields before sending.");
      return;
    }
    
    // In a real implementation, this would send the message via API
    toast(`Message sent to ${selectedStudents.length} recipient(s)${scheduledDate ? ' scheduled for ' + format(scheduledDate, 'PPP') : ''}.`);
    
    // Reset form
    setSubject("");
    setMessageContent("");
    setSelectedStudents([]);
    setSelectedTemplate("");
    setScheduledDate(null);
  };
  
  // Render template selection section
  const renderTemplateSelection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Communication Templates</CardTitle>
        <CardDescription>Select a template to use as a starting point</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-centre space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {templateCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors",
                  selectedTemplate === template.id ? "border-primary bg-accent" : "border-border"
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="font-medium">{template.title}</div>
                <div className="text-sm text-muted-foreground truncate">{template.content.substring(0, 100)}...</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="text-centre py-4 text-muted-foreground">
                No templates match your search criteria
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Render message composition section
  const renderMessageComposition = () => (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>Customise your message and select recipients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input 
              placeholder="Enter subject..." 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea 
              placeholder="Enter your message..." 
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Translation Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(language => (
                  <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Messages will be automatically translated for parents who prefer this language
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Schedule (Optional)</label>
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
                  {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate || undefined}
                  onSelect={(date: Date | undefined) => setScheduledDate(date || null)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {scheduledDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1"
                onClick={() => setScheduledDate(null)}
              >
                Clear date
              </Button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Recipients</label>
            <div className="border rounded-md max-h-[200px] overflow-y-auto">
              <div className="p-2 border-b bg-muted/50">
                <Input 
                  placeholder="Search students..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="divide-y">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id}
                    className="flex items-centre p-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.yearGroup} • {student.parent}</div>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="p-4 text-centre text-muted-foreground">
                    No students match your search
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {selectedStudents.length} recipient(s) selected
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setSubject("");
          setMessageContent("");
          setSelectedStudents([]);
          setSelectedTemplate("");
          setScheduledDate(null);
        }}>
          Clear
        </Button>
        <Button onClick={handleSendMessage}>
          {scheduledDate ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Schedule
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Render communication history section
  const renderCommunicationHistory = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Select a student to view communication history</CardDescription>
          <div className="mt-2">
            <Input 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredStudents.map(student => (
              <div 
                key={student.id}
                className={cn(
                  "p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                  selectedStudent?.id === student.id ? "bg-accent" : ""
                )}
                onClick={() => handleStudentHistorySelect(student)}
              >
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-muted-foreground">{student.yearGroup}</div>
                <div className="text-xs text-muted-foreground">Last contact: {student.lastContact}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedStudent ? `${selectedStudent.name}'s Communication History` : "Communication History"}
          </CardTitle>
          <CardDescription>
            {selectedStudent 
              ? `View all communications with ${selectedStudent.parent}`
              : "Select a student to view their communication history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedStudent ? (
            <div>
              <div className="mb-4 p-3 bg-muted rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm font-medium">Parent/Guardian:</span>
                    <span className="text-sm ml-2">{selectedStudent.parent}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm ml-2">{selectedStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Year Group:</span>
                    <span className="text-sm ml-2">{selectedStudent.yearGroup}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Last Contact:</span>
                    <span className="text-sm ml-2">{selectedStudent.lastContact}</span>
                  </div>
                </div>
              </div>
              
              {studentCommunications.length > 0 ? (
                <div className="space-y-3">
                  {studentCommunications.map(comm => (
                    <div key={comm.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{comm.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {comm.date} • {comm.type}
                          </div>
                        </div>
                        <Badge variant={comm.response ? "default" : "outline"}>
                          {comm.response ? "Responded" : "No Response"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-centre py-8 text-muted-foreground">
                  No communication history found
                </div>
              )}
            </div>
          ) : (
            <div className="text-centre py-12 text-muted-foreground">
              Select a student to view their communication history
            </div>
          )}
        </CardContent>
        {selectedStudent && (
          <CardFooter>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Communication
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
  
  // Render analytics section
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "67%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Communications Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-8 bg-primary/20 rounded-sm" 
                  style={{ 
                    opacity: 0.3 + Math.random() * 0.7,
                    height: `${20 + Math.random() * 30}px`
                  }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Parent Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">+12% from last term</p>
            <div className="mt-4 flex items-centre">
              <span className="text-xs text-muted-foreground w-20">High</span>
              <div className="flex-1 h-2 bg-green-500 rounded-l-full"></div>
              <div className="flex-1 h-2 bg-yellow-500"></div>
              <div className="flex-1 h-2 bg-red-500 rounded-r-full"></div>
              <span className="text-xs text-muted-foreground w-20 text-right">Low</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Insights</CardTitle>
          <CardDescription>Analysis of parent communication patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-2">Communication by Category</h4>
              <div className="space-y-2">
                {templateCategories.map((category, index) => (
                  <div key={category.id} className="flex items-centre">
                    <span className="text-sm w-40">{category.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full" 
                        style={{ width: `${10 + Math.random() * 70}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-12 text-right">
                      {Math.floor(5 + Math.random() * 30)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Response Time Analysis</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-3 bg-muted rounded-md text-centre">
                  <div className="text-2xl font-bold">4.2h</div>
                  <div className="text-xs text-muted-foreground">Average Response Time</div>
                </div>
                <div className="p-3 bg-muted rounded-md text-centre">
                  <div className="text-2xl font-bold">83%</div>
                  <div className="text-xs text-muted-foreground">Same-Day Response</div>
                </div>
                <div className="p-3 bg-muted rounded-md text-centre">
                  <div className="text-2xl font-bold">12%</div>
                  <div className="text-xs text-muted-foreground">Next-Day Response</div>
                </div>
                <div className="p-3 bg-muted rounded-md text-centre">
                  <div className="text-2xl font-bold">5%</div>
                  <div className="text-xs text-muted-foreground">Delayed Response</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Engagement Opportunities</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Low Engagement Alert</div>
                    <div className="text-sm text-muted-foreground">
                      5 families have not responded to communications in the last 30 days
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Families
                    </Button>
                  </div>
                </div>
                <div className="p-3 border rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">High Engagement Opportunity</div>
                    <div className="text-sm text-muted-foreground">
                      12 families consistently respond within 1 hour and may be good candidates for parent representatives
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Families
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-centre sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parent Communication</h2>
          <p className="text-muted-foreground">
            Manage and streamline communications with parents and guardians
          </p>
        </div>
        <div className="flex items-centre gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="compose">
            <MessageSquare className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="history">
            <Users className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-6 mt-6">
          {renderTemplateSelection()}
          {renderMessageComposition()}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          {renderCommunicationHistory()}
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
