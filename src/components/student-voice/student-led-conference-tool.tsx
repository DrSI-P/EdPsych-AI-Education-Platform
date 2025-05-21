'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, FileText, Image, Video, Mic, Link2, CheckCircle2, Calendar as CalendarIcon2, Award } from "lucide-react";

export default function StudentLedConferenceTool() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [portfolios, setPortfolios] = useState([
    {
      id: "1",
      title: "My Learning Journey 2024-2025",
      description: "A collection of my best work and reflections from this academic year",
      artifactCount: 12,
      reflectionCount: 5,
      lastUpdated: "2025-05-10T14:30:00Z"
    },
    {
      id: "2",
      title: "Science Project Portfolio",
      description: "Documentation of my ecosystem research project",
      artifactCount: 8,
      reflectionCount: 3,
      lastUpdated: "2025-04-22T09:15:00Z"
    }
  ]);
  
  const [conferences, setConferences] = useState([
    {
      id: "1",
      title: "End of Year Conference",
      date: new Date("2025-06-15T15:00:00Z"),
      status: "planned",
      participants: [
        { name: "Ms. Johnson", role: "Teacher" },
        { name: "Mr. Smith", role: "Parent" }
      ]
    },
    {
      id: "2",
      title: "Science Project Review",
      date: new Date("2025-04-30T14:00:00Z"),
      status: "completed",
      participants: [
        { name: "Mr. Williams", role: "Science Teacher" },
        { name: "Mrs. Smith", role: "Parent" }
      ]
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Sample artifacts for the portfolio view
  const artifacts = [
    {
      id: "1",
      title: "Math Problem Solving",
      type: "document",
      description: "My work on complex word problems",
      date: "2025-05-01"
    },
    {
      id: "2",
      title: "Science Experiment Results",
      type: "image",
      description: "Photos and data from my plant growth experiment",
      date: "2025-04-15"
    },
    {
      id: "3",
      title: "Book Report Presentation",
      type: "video",
      description: "My video presentation on 'The Giver'",
      date: "2025-03-22"
    },
    {
      id: "4",
      title: "Reading Reflection",
      type: "audio",
      description: "My thoughts on the themes in our class novel",
      date: "2025-02-18"
    }
  ];
  
  // Sample reflections for the portfolio view
  const reflections = [
    {
      id: "1",
      prompt: "What are you most proud of this term?",
      response: "I'm most proud of how I improved my problem-solving skills in math. At the beginning of the term, I struggled with word problems, but now I can break them down and solve them step by step.",
      date: "2025-05-05"
    },
    {
      id: "2",
      prompt: "What has been your biggest challenge?",
      response: "My biggest challenge was staying organised with all my assignments. I've been using a planner more consistently now, which has helped me keep track of deadlines.",
      date: "2025-04-20"
    },
    {
      id: "3",
      prompt: "What is one goal you have for next term?",
      response: "I want to participate more in class discussions. I often have ideas but don't always share them. My goal is to contribute at least once in each class every week.",
      date: "2025-05-10"
    }
  ];
  
  // Conference preparation steps
  const prepSteps = [
    { id: "1", title: "Select Portfolio Items", completed: true },
    { id: "2", title: "Complete Reflection Questions", completed: true },
    { id: "3", title: "Practise Presentation", completed: false },
    { id: "4", title: "Prepare Questions for Discussion", completed: false },
    { id: "5", title: "Review Goals and Progress", completed: true }
  ];
  
  // Function to render the appropriate icon for artifact type
  const getArtifactIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Mic className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student-Led Conference Tools</CardTitle>
          <CardDescription>
            Prepare for, conduct, and follow up on student-led conferences with teachers and parents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="portfolio">Digital Portfolio</TabsTrigger>
              <TabsTrigger value="conference">Conference Preparation</TabsTrigger>
              <TabsTrigger value="presentation">Presentation Mode</TabsTrigger>
            </TabsList>
            
            {/* Digital Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">My Portfolios</h3>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Portfolio
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{portfolio.title}</CardTitle>
                      <CardDescription>{portfolio.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{portfolio.artifactCount} artifacts</span>
                        <span>{portfolio.reflectionCount} reflections</span>
                        <span>Updated: {new Date(portfolio.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Edit</Button>
                      <Button>View</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="border rounded-lg p-4 mt-6">
                <h3 className="text-lg font-medium mb-4">Portfolio Content: My Learning Journey 2024-2025</h3>
                
                <Tabs defaultValue="artifacts" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                    <TabsTrigger value="reflections">Reflections</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="artifacts" className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <h4 className="font-medium">My Learning Artifacts</h4>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Artifact
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {artifacts.map((artifact) => (
                        <div key={artifact.id} className="flex items-start p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <div className="bg-primary/10 p-2 rounded-md mr-3">
                            {getArtifactIcon(artifact.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{artifact.title}</h5>
                              <span className="text-sm text-muted-foreground">{artifact.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{artifact.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reflections" className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <h4 className="font-medium">My Reflections</h4>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Reflection
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {reflections.map((reflection) => (
                        <Card key={reflection.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">{reflection.prompt}</CardTitle>
                              <span className="text-sm text-muted-foreground">{reflection.date}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{reflection.response}</p>
                          </CardContent>
                          <CardFooter className="flex justify-end">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            {/* Conference Preparation Tab */}
            <TabsContent value="conference" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">My Conferences</h3>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule New Conference
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conferences.map((conference) => (
                  <Card key={conference.id} className={conference.status === "completed" ? "opacity-70" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{conference.title}</CardTitle>
                        <Badge variant={conference.status === "planned" ? "default" : "outline"}>
                          {conference.status === "planned" ? "Upcoming" : "Completed"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {conference.date.toLocaleDateString()} at {conference.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Participants:</p>
                        <ul className="text-sm">
                          {conference.participants.map((participant, index) => (
                            <li key={index}>{participant.name} ({participant.role})</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      {conference.status === "planned" ? (
                        <>
                          <Button variant="outline">Prepare</Button>
                          <Button>Start Conference</Button>
                        </>
                      ) : (
                        <Button variant="outline">View Summary</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="border rounded-lg p-4 mt-6">
                <h3 className="text-lg font-medium mb-4">Conference Preparation: End of Year Conference</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Conference Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="conf-title">Conference Title</Label>
                        <Input id="conf-title" value="End of Year Conference" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Conference Date & Time</Label>
                        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                setSelectedDate(date);
                                setShowCalendar(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="conf-portfolio">Select Portfolio</Label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a portfolio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">My Learning Journey 2024-2025</SelectItem>
                            <SelectItem value="2">Science Project Portfolio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="conf-participants">Participants</Label>
                        <div className="flex flex-wrap gap-2 border rounded-md p-2">
                          <Badge>Ms. Johnson (Teacher)</Badge>
                          <Badge>Mr. Smith (Parent)</Badge>
                          <Button variant="ghost" size="sm" className="h-6">
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Preparation Checklist</h4>
                    <div className="space-y-2">
                      {prepSteps.map((step) => (
                        <div key={step.id} className="flex items-centre space-x-2">
                          <Checkbox id={`step-${step.id}`} checked={step.completed} />
                          <label
                            htmlFor={`step-${step.id}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              step.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {step.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Conference Notes</h4>
                    <Textarea 
                      placeholder="Add any notes or talking points you want to remember during the conference..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Complete Preparation</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Presentation Mode Tab */}
            <TabsContent value="presentation" className="space-y-6">
              <div className="bg-primary-foreground p-6 rounded-lg border">
                <div className="text-centre mb-8">
                  <h2 className="text-2xl font-bold">My Learning Journey 2024-2025</h2>
                  <p className="text-muted-foreground">Presented by Jamie Smith</p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">My Strengths</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Problem-solving in mathematics</li>
                      <li>Creative writing and storytelling</li>
                      <li>Scientific investigations</li>
                      <li>Working collaboratively in groups</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Areas for Growth</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Time management with longer projects</li>
                      <li>Participating more in class discussions</li>
                      <li>Organising my notes more effectively</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">My Favourite Work This Year</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Science Experiment Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted h-40 flex items-centre justify-centre">
                            <Image className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <p className="mt-2 text-sm">Photos and data from my plant growth experiment</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Book Report Presentation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted h-40 flex items-centre justify-centre">
                            <Video className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <p className="mt-2 text-sm">My video presentation on 'The Giver'</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">My Goals for Next Year</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Improve my public speaking skills</li>
                      <li>Develop better study habits for tests</li>
                      <li>Read at least 15 books throughout the year</li>
                      <li>Take more leadership roles in group projects</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 text-centre">
                  <p className="font-medium mb-2">Questions or Comments?</p>
                  <p className="text-sm text-muted-foreground">I'd be happy to discuss any aspect of my learning in more detail.</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">Exit Presentation Mode</Button>
                <div className="space-x-2">
                  <Button variant="outline">Previous Slide</Button>
                  <Button>Next Slide</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
