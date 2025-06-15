'use client';

import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  FileText, 
  Users, 
  Calendar, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Star,
  BarChart,
  PieChart
} from 'lucide-react';

interface ResearchProjectManagerProps {
  userId?: string;
  userRole: 'student' | 'instructor' | 'researcher' | 'admin';
  className?: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'analysis' | 'writing' | 'review' | 'completed';
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  tags: string[];
  collaborators: Collaborator[];
  tasks: ResearchTask[];
  documents: ResearchDocument[];
  methodology: string;
  progress: number;
  starred: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  role: 'lead' | 'researcher' | 'advisor' | 'participant';
  avatar?: string;
}

interface ResearchTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
  completedAt?: number;
}

interface ResearchDocument {
  id: string;
  title: string;
  type: 'literature' | 'data' | 'analysis' | 'draft' | 'final';
  createdAt: number;
  updatedAt: number;
  url: string;
  author: string;
}

const ResearchProjectManager: React.FC<ResearchProjectManagerProps> = ({
  userId,
  userRole,
  className = '',
}) => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents' | 'methodology'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, these would be API calls
        // For now, we'll use mock data
        
        // Mock research projects
        const mockProjects: ResearchProject[] = [
          {
            id: 'project-1',
            title: 'Impact of Gamification on Student Engagement',
            description: 'This research examines how gamification elements in educational software affect student engagement and learning outcomes in middle school mathematics.',
            status: 'in-progress',
            createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
            updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
            dueDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
            tags: ['gamification', 'student engagement', 'mathematics', 'middle school'],
            collaborators: [
              {
                id: 'user-1',
                name: 'Alex Johnson',
                role: 'lead',
                avatar: '/avatars/alex.jpg'
              },
              {
                id: 'user-2',
                name: 'Jamie Smith',
                role: 'researcher',
                avatar: '/avatars/jamie.jpg'
              }
            ],
            tasks: [
              {
                id: 'task-1',
                title: 'Literature Review',
                description: 'Review existing literature on gamification in education',
                status: 'completed',
                assignedTo: 'user-1',
                dueDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
                priority: 'high',
                completedAt: Date.now() - 18 * 24 * 60 * 60 * 1000
              },
              {
                id: 'task-2',
                title: 'Develop Research Instruments',
                description: 'Create surveys and observation protocols',
                status: 'completed',
                assignedTo: 'user-2',
                dueDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
                priority: 'high',
                completedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
              }
            ],
            documents: [
              {
                id: 'doc-1',
                title: 'Literature Review Summary',
                type: 'literature',
                createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
                url: '/documents/lit-review.pdf',
                author: 'Alex Johnson'
              }
            ],
            methodology: 'Mixed methods approach using a quasi-experimental design.',
            progress: 0.35,
            starred: true
          },
          {
            id: 'project-2',
            title: 'Effectiveness of Peer Learning in Online Environments',
            description: 'This study investigates how structured peer learning activities in online courses affect knowledge retention and student satisfaction.',
            status: 'planning',
            createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
            updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
            dueDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days from now
            tags: ['peer learning', 'online education', 'knowledge retention'],
            collaborators: [
              {
                id: 'user-2',
                name: 'Jamie Smith',
                role: 'lead',
                avatar: '/avatars/jamie.jpg'
              }
            ],
            tasks: [
              {
                id: 'task-6',
                title: 'Literature Review',
                description: 'Review existing literature on peer learning in online environments',
                status: 'in-progress',
                assignedTo: 'user-2',
                dueDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
                priority: 'high'
              }
            ],
            documents: [
              {
                id: 'doc-5',
                title: 'Initial Research Concept',
                type: 'draft',
                createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
                url: '/documents/peer-learning-concept.docx',
                author: 'Jamie Smith'
              }
            ],
            methodology: 'Randomized controlled trial with three conditions.',
            progress: 0.10,
            starred: false
          }
        ];
        
        setProjects(mockProjects);
        setSelectedProject(mockProjects[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching research project data:', err);
        setError('Failed to load research projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, userRole]);
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (dueDate?: number): string => {
    if (!dueDate) return 'No due date';
    
    const now = Date.now();
    const days = Math.ceil((dueDate - now) / (24 * 60 * 60 * 1000));
    
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return '1 day remaining';
    } else {
      return `${days} days remaining`;
    }
  };
  
  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'planning':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'analysis':
        return 'bg-purple-500';
      case 'writing':
        return 'bg-indigo-500';
      case 'review':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get document type icon
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'literature':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'data':
        return <BarChart className="h-4 w-4 text-green-400" />;
      case 'analysis':
        return <PieChart className="h-4 w-4 text-purple-400" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-yellow-400" />;
      case 'final':
        return <FileText className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Filter projects
  const filteredProjects = projects.filter(project => {
    // Filter by search query
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Toggle star project
  const toggleStarProject = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, starred: !project.starred } 
          : project
      )
    );
    
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => 
        prev ? { ...prev, starred: !prev.starred } : null
      );
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Research Project Manager</h2>
          <div className="animate-pulse h-4 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-pulse h-64 bg-gray-800 rounded"></div>
          <div className="animate-pulse h-64 bg-gray-800 rounded md:col-span-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0 flex items-center">
          <Microscope className="h-6 w-6 mr-2 text-purple-400" />
          Research Project Manager
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-800 text-white rounded pl-10 pr-4 py-2 text-sm w-full"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* New Project Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-medium text-white mb-4">Your Research Projects</h3>
          
          {filteredProjects.length > 0 ? (
            <div className="space-y-3">
              {filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedProject?.id === project.id 
                      ? 'bg-gray-700 border-l-4 border-blue-500' 
                      : 'bg-gray-750 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-white font-medium">{project.title}</h4>
                        {project.starred && (
                          <Star className="h-4 w-4 text-yellow-400 ml-2 fill-current" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {project.description}
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        toggleStarProject(project.id);
                      }}
                    >
                      <Star className={`h-4 w-4 ${project.starred ? 'text-yellow-400 fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(project.status)} mr-2`}></span>
                      <span className="text-gray-300 text-xs capitalize">{project.status.replace('-', ' ')}</span>
                    </div>
                    <div className="text-gray-400 text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{project.dueDate ? getDaysRemaining(project.dueDate) : 'No due date'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Microscope className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No research projects found</p>
              <button
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Project Details */}
        {selectedProject ? (
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 max-h-[600px] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-white">{selectedProject.title}</h3>
                  <button 
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => toggleStarProject(selectedProject.id)}
                  >
                    <Star className={`h-5 w-5 ${selectedProject.starred ? 'text-yellow-400 fill-current' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(selectedProject.status)} mr-2`}></span>
                  <span className="text-gray-300 text-sm capitalize">{selectedProject.status.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Project Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'tasks' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'documents' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Progress</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${selectedProject.progress * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-white font-medium">{Math.round(selectedProject.progress * 100)}%</div>
                  </div>
                </div>
                
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Team</h4>
                  <div className="space-y-3">
                    {selectedProject.collaborators.map(collaborator => (
                      <div key={collaborator.id} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden mr-3">
                          {collaborator.avatar ? (
                            <img src={collaborator.avatar} alt={collaborator.name} className="w-full h-full object-cover" />
                          ) : (
                            collaborator.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-white">{collaborator.name}</div>
                          <div className="text-gray-400 text-xs capitalize">{collaborator.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {selectedProject.tasks.map(task => (
                  <div key={task.id} className="bg-gray-750 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-medium">{task.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        task.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        task.status === 'in-progress' ? 'bg-yellow-900/30 text-yellow-400' :
                        task.status === 'blocked' ? 'bg-red-900/30 text-red-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {selectedProject.documents.map(document => (
                  <div key={document.id} className="bg-gray-750 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getDocumentTypeIcon(document.type)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{document.title}</h4>
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <span className="mr-3">By: {document.author}</span>
                          <span>Updated: {formatDate(document.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 flex items-center justify-center">
            <div className="text-center">
              <Microscope className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Select a project to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchProjectManager;