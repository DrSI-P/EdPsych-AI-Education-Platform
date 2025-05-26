'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAIService } from '@/lib/ai/ai-service';
import { 
  FileText, 
  Users, 
  Calendar, 
  Download, 
  Edit, 
  Eye, 
  Settings, 
  Save, 
  Trash, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  BarChart, 
  BookOpen, 
  Clock, 
  Smile, 
  Award, 
  Target, 
  HelpCircle,
  Printer,
  Share2
} from 'lucide-react';

// Sample student data
const sampleStudents = [
  { id: 1, name: 'Emma Thompson', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'History', 'Art'] },
  { id: 2, name: 'James Wilson', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'Music'] },
  { id: 3, name: 'Olivia Davis', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'French', 'Physical Education'] },
  { id: 4, name: 'Noah Martin', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Computer Science', 'Drama'] },
  { id: 5, name: 'Sophia Roberts', year: 8, class: '8A', subjects: ['English', 'Mathematics', 'Science', 'Religious Studies', 'Design Technology'] },
  { id: 6, name: 'William Brown', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'History', 'Art'] },
  { id: 7, name: 'Charlotte Taylor', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'Music'] },
  { id: 8, name: 'Ethan Johnson', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'French', 'Physical Education'] },
  { id: 9, name: 'Amelia White', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Computer Science', 'Drama'] },
  { id: 10, name: 'Alexander Lee', year: 7, class: '7B', subjects: ['English', 'Mathematics', 'Science', 'Religious Studies', 'Design Technology'] },
];

// Sample assessment data
const sampleAssessmentData = {
  1: { // Emma Thompson
    English: { 
      currentScore: 78, 
      previousScore: 72, 
      classAverage: 74, 
      strengths: ['Creative writing', 'Reading comprehension'], 
      areasForDevelopment: ['Analytical writing', 'Grammar and punctuation'],
      effort: 'Good',
      attendance: 97,
      behaviour: 'Excellent',
      comments: 'Emma continues to show strong engagement in English lessons. Her creative writing is particularly impressive, with rich vocabulary and imaginative storylines. To progress further, Emma should focus on developing her analytical writing skills, particularly when responding to non-fiction texts.'
    },
    Mathematics: { 
      currentScore: 65, 
      previousScore: 61, 
      classAverage: 68, 
      strengths: ['Number operations', 'Data handling'], 
      areasForDevelopment: ['Algebra', 'Problem-solving'],
      effort: 'Satisfactory',
      attendance: 95,
      behaviour: 'Good',
      comments: 'Emma has made steady progress in Mathematics this term. She demonstrates good understanding of number operations and data handling. Emma would benefit from additional practise with algebraic concepts and applying mathematical knowledge to solve complex problems.'
    },
    Science: { 
      currentScore: 82, 
      previousScore: 79, 
      classAverage: 75, 
      strengths: ['Scientific investigation', 'Biology topics'], 
      areasForDevelopment: ['Physics concepts', 'Scientific vocabulary'],
      effort: 'Excellent',
      attendance: 98,
      behaviour: 'Excellent',
      comments: 'Emma shows genuine enthusiasm for Science, particularly in practical investigations and biology topics. She asks thoughtful questions and contributes well to class discussions. To enhance her understanding further, Emma should work on consolidating physics concepts and expanding her use of scientific vocabulary.'
    },
    History: { 
      currentScore: 74, 
      previousScore: 70, 
      classAverage: 72, 
      strengths: ['Historical knowledge', 'Source analysis'], 
      areasForDevelopment: ['Extended writing', 'Chronological understanding'],
      effort: 'Good',
      attendance: 96,
      behaviour: 'Good',
      comments: 'Emma demonstrates good historical knowledge and is developing her skills in analysing historical sources. Her contributions to class discussions show thoughtful engagement with the subject. To progress further, Emma should focus on structuring extended writing more effectively and developing a more secure chronological understanding of historical periods.'
    },
    Art: { 
      currentScore: 88, 
      previousScore: 85, 
      classAverage: 76, 
      strengths: ['Creativity', 'Drawing skills'], 
      areasForDevelopment: ['Art history knowledge', 'Critical analysis'],
      effort: 'Excellent',
      attendance: 100,
      behaviour: 'Excellent',
      comments: 'Emma shows exceptional talent in Art, with particularly strong drawing skills and creative approaches to projects. Her portfolio demonstrates a good range of techniques and thoughtful development of ideas. To enhance her work further, Emma should develop her knowledge of art history and practise analysing the work of other artists more critically.'
    }
  },
  // Additional student data would be included here
};

// Report template options
const reportTemplates = [
  { 
    id: 'end-of-term', 
    name: 'End of Term Report', 
    description: 'Comprehensive report covering all subjects and aspects of school life',
    sections: ['Academic Progress', 'Attendance and Punctuality', 'Behaviour and Attitude', 'Extra-Curricular Activities', 'Targets for Next Term']
  },
  { 
    id: 'mid-term', 
    name: 'Mid-Term Progress Update', 
    description: 'Brief update on progress since the last full report',
    sections: ['Current Attainment', 'Progress Towards Targets', 'Areas for Focus']
  },
  { 
    id: 'parent-evening', 
    name: 'Parent Evening Summary', 
    description: 'Summary report to support parent-teacher consultations',
    sections: ['Current Attainment', 'Strengths and Achievements', 'Areas for Development', 'Suggested Support Strategies']
  },
  { 
    id: 'subject-specific', 
    name: 'Subject Specific Report', 
    description: 'Detailed report focusing on a single subject area',
    sections: ['Attainment', 'Progress', 'Skills Development', 'Knowledge Acquisition', 'Next Steps']
  },
  { 
    id: 'sen', 
    name: 'Special Educational Needs Report', 
    description: 'Specialised report focusing on progress against IEP/504 targets',
    sections: ['Target Progress', 'Intervention Effectiveness', 'Social and Emotional Development', 'Recommended Adjustments']
  },
  { 
    id: 'custom', 
    name: 'Custom Report Template', 
    description: 'Create your own report structure',
    sections: ['Custom Section 1', 'Custom Section 2', 'Custom Section 3']
  }
];

export default function AutomatedProgressReportGeneration() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [reportPeriod, setReportPeriod] = useState('current-term');
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeBehavior, setIncludeBehavior] = useState(true);
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeNextSteps, setIncludeNextSteps] = useState(true);
  const [commentStyle, setCommentStyle] = useState('balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [editingReport, setEditingReport] = useState(false);
  const [editedComments, setEditedComments] = useState<Record<string, string>>({});
  
  // Load saved reports from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedProgressReports');
      if (saved) {
        setSavedReports(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  }, []);
  
  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  // Handle student selection
  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  // Handle subject selection
  const handleSubjectSelection = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };
  
  // Select all students in a class
  const selectAllStudentsInClass = (className: string) => {
    const studentsInClass = sampleStudents.filter(student => student.class === className);
    const studentIds = studentsInClass.map(student => student.id);
    setSelectedStudents(studentIds);
  };
  
  // Select all subjects
  const selectAllSubjects = () => {
    const allSubjects = Array.from(new Set(sampleStudents.flatMap(student => student.subjects)));
    setSelectedSubjects(allSubjects);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelectedStudents([]);
    setSelectedSubjects([]);
  };
  
  // Generate reports
  const generateReports = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to generate reports.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedSubjects.length === 0) {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject to include in the reports.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate report generation with a delay
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reports = selectedStudents.map(studentId => {
        const student = sampleStudents.find(s => s.id === studentId);
        if (!student) return null;
        
        const studentData = sampleAssessmentData[studentId as keyof typeof sampleAssessmentData] || {};
        const template = reportTemplates.find(t => t.id === selectedTemplate);
        
        // Filter subjects based on selection and available data
        const reportSubjects = selectedSubjects.filter(subject => 
          student.subjects.includes(subject) && studentData[subject as keyof typeof studentData]
        );
        
        // Generate report content
        const subjectReports = reportSubjects.map(subject => {
          const data = studentData[subject as keyof typeof studentData];
          if (!data) return null;
          
          // Calculate progress indicators
          const progress = data.currentScore - data.previousScore;
          const comparisonToAverage = data.currentScore - data.classAverage;
          
          // Generate AI-enhanced comments
          // In a real implementation, this would use the AI service
          const aiEnhancedComment = data.comments;
          
          return {
            subject,
            currentScore: data.currentScore,
            previousScore: data.previousScore,
            progress,
            classAverage: data.classAverage,
            comparisonToAverage,
            strengths: data.strengths,
            areasForDevelopment: data.areasForDevelopment,
            effort: data.effort,
            attendance: data.attendance,
            behaviour: data.behaviour,
            comments: aiEnhancedComment
          };
        }).filter(Boolean);
        
        // Generate overall summary
        // In a real implementation, this would use the AI service
        const overallComments = generateOverallComments(student, subjectReports, commentStyle);
        
        // Generate next steps
        const nextSteps = includeNextSteps ? generateNextSteps(subjectReports) : [];
        
        return {
          id: Date.now() + studentId,
          student,
          template: template?.name || 'Custom Report',
          date: new Date().toISOString(),
          period: reportPeriod,
          subjects: subjectReports,
          overallComments,
          nextSteps,
          includeAttendance,
          includeBehavior,
          includeGraphs
        };
      }).filter(Boolean);
      
      setGeneratedReports(reports as any[]);
      setActiveTab('preview');
      
      toast({
        title: "Reports generated",
        description: `Successfully generated ${reports.length} student reports.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating reports:', error);
      toast({
        title: "Error generating reports",
        description: "An error occurred while generating the reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate overall comments based on subject reports
  const generateOverallComments = (student, subjectReports[], style: string) => {
    // Calculate average scores and progress
    const averageCurrentScore = Math.round(
      subjectReports.reduce((sum, report) => sum + report.currentScore, 0) / subjectReports.length
    );
    
    const averageProgress = Math.round(
      subjectReports.reduce((sum, report) => sum + report.progress, 0) / subjectReports.length
    );
    
    // Count strengths in effort and behaviour
    const goodEffortCount = subjectReports.filter(report => 
      ['Good', 'Excellent'].includes(report.effort)
    ).length;
    
    const goodBehaviorCount = subjectReports.filter(report => 
      ['Good', 'Excellent'].includes(report.behaviour)
    ).length;
    
    const effortRatio = goodEffortCount / subjectReports.length;
    const behaviorRatio = goodBehaviorCount / subjectReports.length;
    
    // Generate comment based on style preference
    let comment = '';
    
    switch (style) {
      case 'positive':
        comment = `${student.name} has demonstrated ${averageProgress > 0 ? 'positive' : 'steady'} progress this term, with an average attainment of ${averageCurrentScore}%. `;
        comment += effortRatio > 0.7 ? `${student.name}'s effort has been consistently good across most subjects. ` : `${student.name} has shown good effort in some subject areas. `;
        comment += behaviorRatio > 0.7 ? `Behaviour has been exemplary throughout the term. ` : `Behaviour has been generally appropriate. `;
        comment += `${student.name} has particular strengths in ${subjectReports.sort((a, b) => b.currentScore - a.currentScore)[0].subject} and should be encouraged to continue developing these skills.`;
        break;
        
      case 'constructive':
        comment = `${student.name} has achieved an average attainment of ${averageCurrentScore}% this term. `;
        comment += averageProgress > 0 ? `While showing improvement of ${averageProgress}% on average, ` : `While maintaining similar levels to previous assessments, `;
        comment += `there are several areas where focused effort could yield significant improvements. `;
        comment += `Particular attention should be given to ${subjectReports.sort((a, b) => a.currentScore - b.currentScore)[0].subject}, where targeted support could help address current challenges. `;
        comment += effortRatio < 0.7 ? `Consistent effort across all subjects would benefit overall progress. ` : `The good effort shown in most subjects should be maintained. `;
        break;
        
      case 'balanced':
      default:
        comment = `${student.name} has achieved an average attainment of ${averageCurrentScore}% this term, representing a ${averageProgress > 0 ? 'positive change' : 'slight change'} of ${Math.abs(averageProgress)}% from previous assessments. `;
        comment += `Particular strengths are evident in ${subjectReports.sort((a, b) => b.currentScore - a.currentScore)[0].subject}, while additional support in ${subjectReports.sort((a, b) => a.currentScore - b.currentScore)[0].subject} could help address current challenges. `;
        comment += effortRatio > 0.7 ? `Effort has been consistently good across most subjects. ` : `Effort has been variable across different subjects. `;
        comment += behaviorRatio > 0.7 ? `Behaviour has been positive throughout the term. ` : `Behaviour has been generally appropriate with some inconsistencies. `;
        comment += `Overall, ${student.name} ${averageProgress > 3 ? 'is making excellent progress' : averageProgress > 0 ? 'is making steady progress' : 'would benefit from additional support'} at this stage of the academic year.`;
        break;
    }
    
    return comment;
  };
  
  // Generate next steps based on subject reports
  const generateNextSteps = (subjectReports: any[]) => {
    // Find subjects with lowest scores for targeted improvement
    const lowestSubjects = [...subjectReports].sort((a, b) => a.currentScore - b.currentScore).slice(0, 2);
    
    // Collect areas for development from these subjects
    const developmentAreas = lowestSubjects.flatMap(subject => 
      subject.areasForDevelopment.map(area => ({
        subject: subject.subject,
        area
      }))
    );
    
    // Generate specific next steps
    return developmentAreas.map(({ subject, area }) => {
      return `Focus on improving ${area} in ${subject} through regular practise and targeted support.`;
    });
  };
  
  // View a specific report
  const viewReport = (report) => {
    setCurrentReport(report);
    setEditingReport(false);
    setEditedComments({});
    setActiveTab('view');
  };
  
  // Edit a report
  const editReport = () => {
    if (!currentReport) return;
    
    // Initialize edited comments with current values
    const initialComments: Record<string, string> = {};
    currentReport.subjects.forEach((subject) => {
      initialComments[subject.subject] = subject.comments;
    });
    initialComments['overall'] = currentReport.overallComments;
    
    setEditedComments(initialComments);
    setEditingReport(true);
  };
  
  // Save edited report
  const saveEditedReport = () => {
    if (!currentReport) return;
    
    // Update subject comments
    const updatedSubjects = currentReport.subjects.map((subject) => ({
      ...subject,
      comments: editedComments[subject.subject] || subject.comments
    }));
    
    // Update overall comments
    const updatedReport = {
      ...currentReport,
      subjects: updatedSubjects,
      overallComments: editedComments['overall'] || currentReport.overallComments
    };
    
    // Update in generated reports list
    setGeneratedReports(prev => 
      prev.map(report => report.id === updatedReport.id ? updatedReport : report)
    );
    
    setCurrentReport(updatedReport);
    setEditingReport(false);
    
    toast({
      title: "Report updated",
      description: "Your changes to the report have been saved.",
      variant: "default"
    });
  };
  
  // Save report to localStorage
  const saveReport = (report) => {
    const updatedSavedReports = [...savedReports, report];
    setSavedReports(updatedSavedReports);
    
    // Save to localStorage
    try {
      localStorage.setItem('savedProgressReports', JSON.stringify(updatedSavedReports));
      
      toast({
        title: "Report saved",
        description: "The report has been saved to your collection.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error saving report",
        description: "An error occurred while saving the report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Delete report from saved collection
  const deleteReport = (reportId) => {
    const updatedReports = savedReports.filter(report => report.id !== reportId);
    setSavedReports(updatedReports);
    
    // Update localStorage
    try {
      localStorage.setItem('savedProgressReports', JSON.stringify(updatedReports));
      
      toast({
        title: "Report deleted",
        description: "The report has been removed from your collection.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };
  
  // Generate PDF report
  const generatePDF = (report) => {
    // In a real implementation, this would call a backend API to generate a PDF
    // For now, we'll simulate PDF generation with a toast notification
    
    toast({
      title: "Generating PDF",
      description: "Your PDF report is being generated and will download shortly.",
      variant: "default"
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "PDF Generated",
        description: "Your PDF report has been generated successfully.",
        variant: "default"
      });
    }, 2000);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get period display name
  const getPeriodDisplayName = (period: string) => {
    const periodMap: Record<string, string> = {
      'current-term': 'Current Term',
      'previous-term': 'Previous Term',
      'full-year': 'Full Academic Year',
      'custom': 'Custom Period'
    };
    
    return periodMap[period] || period;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <FileText className="mr-2 h-5 w-5" />
            Automated Progress Report Generation
          </CardTitle>
          <CardDescription>
            Create comprehensive, data-driven student progress reports with minimal effort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            {/* Create Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Template</CardTitle>
                  <CardDescription>
                    Select a template for your progress reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reportTemplates.map(template => (
                      <div 
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedTemplate === template.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleTemplateChange(template.id)}
                      >
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {template.sections.length} sections
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-centre">
                      <Users className="mr-2 h-5 w-5" />
                      Select Students
                    </CardTitle>
                    <CardDescription>
                      Choose which students to include in the reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => selectAllStudentsInClass('8A')}
                        >
                          Select 8A
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => selectAllStudentsInClass('7B')}
                        >
                          Select 7B
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={clearSelections}
                        >
                          Clear All
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {sampleStudents.map(student => (
                          <div key={student.id} className="flex items-centre space-x-2">
                            <Checkbox 
                              id={`student-${student.id}`} 
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => handleStudentSelection(student.id)}
                            />
                            <Label 
                              htmlFor={`student-${student.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              {student.name}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              Year {student.year}, {student.class}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {selectedStudents.length} students selected
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-centre">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Select Subjects
                    </CardTitle>
                    <CardDescription>
                      Choose which subjects to include in the reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={selectAllSubjects}
                        >
                          Select All Subjects
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSubjects([])}
                        >
                          Clear All
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from(new Set(sampleStudents.flatMap(student => student.subjects))).map(subject => (
                          <div key={subject} className="flex items-centre space-x-2">
                            <Checkbox 
                              id={`subject-${subject}`} 
                              checked={selectedSubjects.includes(subject)}
                              onCheckedChange={() => handleSubjectSelection(subject)}
                            />
                            <Label 
                              htmlFor={`subject-${subject}`}
                              className="cursor-pointer"
                            >
                              {subject}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {selectedSubjects.length} subjects selected
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-centre">
                    <Settings className="mr-2 h-5 w-5" />
                    Report Options
                  </CardTitle>
                  <CardDescription>
                    Customise the content and style of your reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="report-period">Reporting Period</Label>
                        <Select value={reportPeriod} onValueChange={setReportPeriod}>
                          <SelectTrigger id="report-period">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current-term">Current Term</SelectItem>
                            <SelectItem value="previous-term">Previous Term</SelectItem>
                            <SelectItem value="full-year">Full Academic Year</SelectItem>
                            <SelectItem value="custom">Custom Period</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="comment-style">Comment Style</Label>
                        <Select value={commentStyle} onValueChange={setCommentStyle}>
                          <SelectTrigger id="comment-style">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="positive">Positive Focus</SelectItem>
                            <SelectItem value="constructive">Constructive Focus</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          {commentStyle === 'balanced' && "Provides a balanced view of achievements and areas for development"}
                          {commentStyle === 'positive' && "Emphasizes strengths and positive achievements"}
                          {commentStyle === 'constructive' && "Focuses on specific areas for improvement and growth"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="include-attendance" 
                          checked={includeAttendance}
                          onCheckedChange={(checked) => setIncludeAttendance(checked as boolean)}
                        />
                        <Label htmlFor="include-attendance">Include attendance data</Label>
                      </div>
                      
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="include-behaviour" 
                          checked={includeBehavior}
                          onCheckedChange={(checked) => setIncludeBehavior(checked as boolean)}
                        />
                        <Label htmlFor="include-behaviour">Include behaviour information</Label>
                      </div>
                      
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="include-graphs" 
                          checked={includeGraphs}
                          onCheckedChange={(checked) => setIncludeGraphs(checked as boolean)}
                        />
                        <Label htmlFor="include-graphs">Include visual progress graphs</Label>
                      </div>
                      
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="include-next-steps" 
                          checked={includeNextSteps}
                          onCheckedChange={(checked) => setIncludeNextSteps(checked as boolean)}
                        />
                        <Label htmlFor="include-next-steps">Include suggested next steps</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={generateReports}
                    disabled={isGenerating || selectedTemplate === '' || selectedStudents.length === 0 || selectedSubjects.length === 0}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Reports'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              {generatedReports.length > 0 ? (
                <>
                  <div className="flex justify-between items-centre">
                    <h2 className="text-xl font-bold">Generated Reports</h2>
                    <div className="text-sm text-muted-foreground">
                      {generatedReports.length} reports generated
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedReports.map(report => (
                      <Card key={report.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle>{report.student.name}</CardTitle>
                          <CardDescription>
                            {report.template} • {getPeriodDisplayName(report.period)} • {formatDate(report.date)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-sm font-medium">Subjects Included:</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.subjects.map((subject) => (
                                  <Badge key={subject.subject} variant="outline">
                                    {subject.subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium">Overall Comments:</h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {report.overallComments}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewReport(report)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => saveReport(report)}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-centre py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No reports generated yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Configure your report settings in the Create tab and generate reports to see them here
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Go to Create
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* View Tab */}
            <TabsContent value="view" className="space-y-6">
              {currentReport ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-centre">
                    <div>
                      <h2 className="text-2xl font-bold">{currentReport.student.name}</h2>
                      <p className="text-muted-foreground">
                        Year {currentReport.student.year}, {currentReport.student.class} • {currentReport.template} • {getPeriodDisplayName(currentReport.period)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!editingReport ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={editReport}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generatePDF(currentReport)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingReport(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={saveEditedReport}
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!editingReport ? (
                        <p>{currentReport.overallComments}</p>
                      ) : (
                        <Textarea 
                          value={editedComments['overall'] || currentReport.overallComments}
                          onChange={(e) => setEditedComments({...editedComments, overall: e.target.value})}
                          className="min-h-[100px]"
                        />
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Subject Reports</h3>
                    
                    {currentReport.subjects.map((subject) => (
                      <Card key={subject.subject}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{subject.subject}</CardTitle>
                            <Badge className={
                              subject.progress > 3 ? "bg-green-100 text-green-800" : 
                              subject.progress > 0 ? "bg-blue-100 text-blue-800" : 
                              "bg-amber-100 text-amber-800"
                            }>
                              {subject.progress > 0 ? `+${subject.progress}%` : `${subject.progress}%`}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Current Score</span>
                                <span className="text-sm font-medium">{subject.currentScore}%</span>
                              </div>
                              <div className="w-full bg-grey-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${subject.currentScore}%` }}
                                ></div>
                              </div>
                              
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-1">Strengths:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {subject.strengths.map((strength: string, index: number) => (
                                    <li key={index}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Comparison to Class Average</span>
                                <span className="text-sm font-medium">
                                  {subject.comparisonToAverage > 0 ? `+${subject.comparisonToAverage}%` : `${subject.comparisonToAverage}%`}
                                </span>
                              </div>
                              <div className="flex items-centre space-x-2">
                                <span className="text-sm">Class: {subject.classAverage}%</span>
                                <div className="flex-1 h-0.5 bg-grey-200"></div>
                                <span className="text-sm">Student: {subject.currentScore}%</span>
                              </div>
                              
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-1">Areas for Development:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {subject.areasForDevelopment.map((area: string, index: number) => (
                                    <li key={index}>{area}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-1">Teacher Comments:</h4>
                            {!editingReport ? (
                              <p className="text-sm text-muted-foreground">{subject.comments}</p>
                            ) : (
                              <Textarea 
                                value={editedComments[subject.subject] || subject.comments}
                                onChange={(e) => setEditedComments({...editedComments, [subject.subject]: e.target.value})}
                                className="min-h-[80px] text-sm"
                              />
                            )}
                          </div>
                          
                          {currentReport.includeAttendance && (
                            <div className="mt-4 flex items-centre">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">Attendance: {subject.attendance}%</span>
                            </div>
                          )}
                          
                          {currentReport.includeBehavior && (
                            <div className="mt-2 flex items-centre">
                              <Smile className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">Behaviour: {subject.behaviour}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {currentReport.nextSteps && currentReport.nextSteps.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-centre">
                          <Target className="mr-2 h-5 w-5" />
                          Next Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {currentReport.nextSteps.map((step: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('preview')}
                    >
                      Back to Preview
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => generatePDF(currentReport)}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Simulate sharing functionality
                          toast({
                            title: "Share options",
                            description: "Sharing functionality would open here.",
                            variant: "default"
                          });
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      
                      {!savedReports.some(report => report.id === currentReport.id) && (
                        <Button 
                          onClick={() => saveReport(currentReport)}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-centre py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No report selected</h3>
                  <p className="mt-2 text-muted-foreground">
                    Select a report from the Preview or Saved tabs to view it in detail
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Saved Tab */}
            <TabsContent value="saved" className="space-y-6">
              {savedReports.length > 0 ? (
                <>
                  <div className="flex justify-between items-centre">
                    <h2 className="text-xl font-bold">Saved Reports</h2>
                    <div className="text-sm text-muted-foreground">
                      {savedReports.length} reports saved
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedReports.map(report => (
                      <Card key={report.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle>{report.student.name}</CardTitle>
                          <CardDescription>
                            {report.template} • {getPeriodDisplayName(report.period)} • {formatDate(report.date)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-sm font-medium">Subjects Included:</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.subjects.map((subject) => (
                                  <Badge key={subject.subject} variant="outline">
                                    {subject.subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewReport(report)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteReport(report.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-centre py-12">
                  <Save className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No saved reports</h3>
                  <p className="mt-2 text-muted-foreground">
                    Generate and save reports to access them here for future reference
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Create New Reports
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline"
            onClick={() => {
              // Open help documentation
              toast({
                title: "Help & Documentation",
                description: "Documentation would open here.",
                variant: "default"
              });
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
