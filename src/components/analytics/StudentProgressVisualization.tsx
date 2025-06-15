'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  User,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Activity,
  TrendingDown
} from 'lucide-react';

interface StudentProgressVisualizationProps {
  userId?: string;
  courseId?: string;
  userRole: 'student' | 'instructor' | 'admin';
  className?: string;
}

// Define additional interfaces for the component
interface StudentProgress {
  userId: string;
  studentName: string;
  overallProgress: number;
  moduleProgress: ModuleProgress[];
  skillMastery: SkillMastery[];
  learningPath: LearningPathItem[];
  milestones: Milestone[];
}

interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lastActivity?: number;
}

interface SkillMastery {
  skillId: string;
  skillName: string;
  mastery: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface LearningPathItem {
  timestamp: number;
  activity: string;
  progress: number;
  milestone?: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate?: number;
  completedDate?: number;
  status: 'upcoming' | 'current' | 'completed' | 'overdue';
}

const StudentProgressVisualization: React.FC<StudentProgressVisualizationProps> = ({
  userId,
  courseId,
  userRole,
  className = '',
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'skills'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'progress-overview': true,
    'milestones': true
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(userId);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'semester'>('month');
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to get student progress data
        // For now, we'll generate mock data
        
        // For student view, only show their own data
        if (userRole === 'student' && userId) {
          const progress = generateMockStudentProgress(userId);
          setStudentProgress(progress);
        } 
        // For instructors and admins, show multiple students
        else if ((userRole === 'instructor' || userRole === 'admin')) {
          const students = ['student-1', 'student-2', 'student-3', 'student-4'];
          const progressData = students.map(id => generateMockStudentProgress(id));
          setStudentsProgress(progressData);
          
          // If a specific student is selected, set their data as the current student
          if (selectedStudentId) {
            const selectedStudent = progressData.find(s => s.userId === selectedStudentId);
            if (selectedStudent) {
              setStudentProgress(selectedStudent);
            } else if (progressData.length > 0) {
              setStudentProgress(progressData[0]);
              setSelectedStudentId(progressData[0].userId);
            }
          } else if (progressData.length > 0) {
            setStudentProgress(progressData[0]);
            setSelectedStudentId(progressData[0].userId);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching student progress data:', err);
        setError('Failed to load student progress data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, userRole, selectedStudentId, timeframe]);
  
  // Generate mock student progress data
  const generateMockStudentProgress = (id: string): StudentProgress => {
    const studentNames: Record<string, string> = {
      'student-1': 'Alex Johnson',
      'student-2': 'Jamie Smith',
      'student-3': 'Taylor Williams',
      'student-4': 'Riley Brown'
    };
    
    const moduleNames = [
      'Introduction to Psychology',
      'Cognitive Development',
      'Learning Theories',
      'Educational Assessment',
      'Classroom Management',
      'Special Education'
    ];
    
    const skillNames = [
      'Critical Thinking',
      'Research Methods',
      'Data Analysis',
      'Theory Application',
      'Case Study Analysis',
      'Academic Writing'
    ];
    
    // Generate random progress between 0.3 and 1.0 based on student ID
    const baseProgress = 0.3 + (parseInt(id.replace('student-', '')) * 0.15);
    const overallProgress = Math.min(baseProgress, 0.95);
    
    // Generate module progress
    const moduleProgress: ModuleProgress[] = moduleNames.map((name, index) => {
      // Calculate progress with some variation
      const progress = Math.min(
        Math.max(0, overallProgress - 0.1 + (Math.random() * 0.2)),
        1
      );
      
      let status: 'not-started' | 'in-progress' | 'completed';
      if (progress < 0.1) status = 'not-started';
      else if (progress < 0.95) status = 'in-progress';
      else status = 'completed';
      
      return {
        moduleId: `module-${index + 1}`,
        moduleName: name,
        progress,
        status,
        lastActivity: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in the last week
      };
    });
    
    // Generate skill mastery
    const skillMastery: SkillMastery[] = skillNames.map((name, index) => {
      // Calculate mastery with some variation
      const mastery = Math.min(
        Math.max(0, overallProgress - 0.15 + (Math.random() * 0.3)),
        1
      );
      
      // Determine trend
      const trendValue = Math.random();
      let trend: 'improving' | 'stable' | 'declining';
      if (trendValue > 0.7) trend = 'improving';
      else if (trendValue > 0.3) trend = 'stable';
      else trend = 'declining';
      
      return {
        skillId: `skill-${index + 1}`,
        skillName: name,
        mastery,
        trend
      };
    });
    
    // Generate learning path
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const learningPath: LearningPathItem[] = [];
    
    // Add data points for the past 30 days
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * oneDay);
      const progress = Math.min(
        Math.max(0, (overallProgress * (30 - i) / 30) - 0.05 + (Math.random() * 0.1)),
        overallProgress
      );
      
      const item: LearningPathItem = {
        timestamp,
        activity: 'Course activity',
        progress
      };
      
      // Add some milestones
      if (i === 25) {
        item.milestone = 'Started course';
      } else if (i === 15) {
        item.milestone = 'Completed first assessment';
      } else if (i === 5) {
        item.milestone = 'Midterm exam';
      }
      
      learningPath.push(item);
    }
    
    // Generate milestones
    const milestones: Milestone[] = [
      {
        id: 'milestone-1',
        name: 'Course Introduction',
        description: 'Complete the course introduction module',
        completedDate: now - (25 * oneDay),
        status: 'completed'
      },
      {
        id: 'milestone-2',
        name: 'First Assessment',
        description: 'Complete the first major assessment',
        completedDate: now - (15 * oneDay),
        status: 'completed'
      },
      {
        id: 'milestone-3',
        name: 'Midterm Exam',
        description: 'Complete the midterm examination',
        completedDate: now - (5 * oneDay),
        status: 'completed'
      },
      {
        id: 'milestone-4',
        name: 'Research Project',
        description: 'Submit the research project',
        targetDate: now + (5 * oneDay),
        status: 'current'
      },
      {
        id: 'milestone-5',
        name: 'Final Exam',
        description: 'Complete the final examination',
        targetDate: now + (15 * oneDay),
        status: 'upcoming'
      }
    ];
    
    return {
      userId: id,
      studentName: studentNames[id] || `Student ${id}`,
      overallProgress,
      moduleProgress,
      skillMastery,
      learningPath,
      milestones
    };
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Student Progress Visualization</h2>
          <div className="animate-pulse h-4 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse h-64 bg-gray-800 rounded"></div>
          <div className="animate-pulse h-64 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Student Progress Visualization</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Student Selector for instructors and admins */}
          {(userRole === 'instructor' || userRole === 'admin') && studentsProgress.length > 0 && (
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <select
                className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
                value={selectedStudentId}
                onChange={(e: any) => setSelectedStudentId(e.target.value)}
              >
                {studentsProgress.map(student => (
                  <option key={student.userId} value={student.userId}>
                    {student.studentName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
              value={timeframe}
              onChange={(e: any) => setTimeframe(e.target.value as any)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">Semester</option>
            </select>
          </div>
          
          {/* Export Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Progress</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          <span>Overview</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'modules' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('modules')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Module Progress</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'skills' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('skills')}
        >
          <Target className="h-4 w-4 mr-2" />
          <span>Skill Mastery</span>
        </button>
      </div>
      
      {/* Content */}
      {studentProgress && (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('progress-overview')}
                >
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                    <span>Progress Overview</span>
                  </h3>
                  {expandedSections['progress-overview'] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                {expandedSections['progress-overview'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Overall Progress Card */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">{studentProgress.studentName}</h4>
                          <div className="text-sm text-gray-400">
                            {timeframe === 'week' ? 'Last 7 days' : 
                             timeframe === 'month' ? 'Last 30 days' : 'Current Semester'}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-1">Overall Progress</div>
                          <div className="flex items-center">
                            <div className="text-2xl font-semibold text-white mr-2">
                              {formatPercentage(studentProgress.overallProgress)}
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${studentProgress.overallProgress * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Modules Completed</div>
                            <div className="text-xl font-semibold text-white">
                              {studentProgress.moduleProgress.filter(m => m.status === 'completed').length} / {studentProgress.moduleProgress.length}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Milestones Reached</div>
                            <div className="text-xl font-semibold text-white">
                              {studentProgress.milestones.filter(m => m.status === 'completed').length} / {studentProgress.milestones.length}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Learning Path Chart */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-4">Progress Over Time</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={studentProgress.learningPath.map(item => ({
                                date: new Date(item.timestamp).toLocaleDateString(),
                                progress: item.progress
                              }))}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                              <XAxis dataKey="date" stroke="#999" />
                              <YAxis stroke="#999" />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Progress']}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="progress" 
                                stroke="#0088FE" 
                                fill="#0088FE" 
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Milestones */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('milestones')}
                >
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-400" />
                    <span>Milestones</span>
                  </h3>
                  {expandedSections['milestones'] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                {expandedSections['milestones'] && (
                  <div className="mt-4">
                    <div className="space-y-4">
                      {studentProgress.milestones.map((milestone, index) => (
                        <div 
                          key={milestone.id} 
                          className={`p-4 rounded-lg border ${
                            milestone.status === 'completed' ? 'bg-green-900/20 border-green-700' :
                            milestone.status === 'current' ? 'bg-blue-900/20 border-blue-700' :
                            milestone.status === 'overdue' ? 'bg-red-900/20 border-red-700' :
                            'bg-gray-700 border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{milestone.name}</h4>
                              <p className="text-gray-300 text-sm mt-1">{milestone.description}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${
                                milestone.status === 'completed' ? 'text-green-400' :
                                milestone.status === 'current' ? 'text-blue-400' :
                                milestone.status === 'overdue' ? 'text-red-400' :
                                'text-gray-400'
                              }`}>
                                {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {milestone.completedDate ? 
                                  `Completed: ${formatDate(milestone.completedDate)}` : 
                                  milestone.targetDate ? 
                                    `Target: ${formatDate(milestone.targetDate)}` : 
                                    'No date set'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Module Progress Tab */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white flex items-center mb-4">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Module Progress</span>
                </h3>
                
                <div className="space-y-4">
                  {studentProgress.moduleProgress.map((module) => (
                    <div key={module.moduleId} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{module.moduleName}</h4>
                        <div className={`text-sm font-medium ${
                          module.status === 'completed' ? 'text-green-400' :
                          module.status === 'in-progress' ? 'text-blue-400' :
                          'text-gray-400'
                        }`}>
                          {module.status === 'not-started' ? 'Not Started' :
                           module.status === 'in-progress' ? 'In Progress' :
                           'Completed'
                          }
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{formatPercentage(module.progress)}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              module.status === 'completed' ? 'bg-green-500' :
                              'bg-blue-600'
                            }`}
                            style={{ width: `${module.progress * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {module.lastActivity && (
                        <div className="text-gray-400 text-xs">
                          Last activity: {formatDate(module.lastActivity)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Skill Mastery Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white flex items-center mb-4">
                  <Target className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Skill Mastery</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skill Radar Chart */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Skill Distribution</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart 
                          outerRadius={90} 
                          data={studentProgress.skillMastery.map(skill => ({
                            subject: skill.skillName,
                            mastery: skill.mastery,
                            fullMark: 1
                          }))}
                        >
                          <PolarGrid stroke="#555" />
                          <PolarAngleAxis dataKey="subject" stroke="#999" />
                          <PolarRadiusAxis angle={30} domain={[0, 1]} stroke="#999" />
                          <Radar 
                            name="Mastery" 
                            dataKey="mastery" 
                            stroke="#0088FE" 
                            fill="#0088FE" 
                            fillOpacity={0.6} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#333', border: 'none' }}
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Mastery']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Skill List */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Skill Details</h4>
                    <div className="space-y-4">
                      {studentProgress.skillMastery.map((skill) => (
                        <div key={skill.skillId} className="bg-gray-750 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-white font-medium">{skill.skillName}</h5>
                            <div className="flex items-center">
                              {skill.trend === 'improving' && (
                                <span className="flex items-center text-green-400 text-sm">
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                  Improving
                                </span>
                              )}
                              {skill.trend === 'stable' && (
                                <span className="flex items-center text-yellow-400 text-sm">
                                  <Activity className="h-4 w-4 mr-1" />
                                  Stable
                                </span>
                              )}
                              {skill.trend === 'declining' && (
                                <span className="flex items-center text-red-400 text-sm">
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                  Declining
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-400">Mastery Level</span>
                              <span className="text-white">{formatPercentage(skill.mastery)}</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  skill.trend === 'improving' ? 'bg-green-500' :
                                  skill.trend === 'stable' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${skill.mastery * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentProgressVisualization;