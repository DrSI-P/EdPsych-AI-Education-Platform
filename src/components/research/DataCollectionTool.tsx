'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  BarChart, 
  PieChart, 
  FileText, 
  Download, 
  Plus, 
  Edit, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  CheckSquare,
  Eye
} from 'lucide-react';

interface DataCollectionToolProps {
  userId?: string;
  userRole: 'student' | 'instructor' | 'researcher' | 'admin';
  className?: string;
}

type DatasetStatus = 'active' | 'completed' | 'draft' | 'archived';
type DatasetType = 'survey' | 'observation' | 'interview' | 'experiment' | 'secondary';

interface Dataset {
  id: string;
  title: string;
  description: string;
  type: DatasetType;
  status: DatasetStatus;
  createdAt: number;
  updatedAt: number;
  startDate?: number;
  endDate?: number;
  participants: number;
  responses: number;
  targetResponses?: number;
  tags: string[];
  instruments: Instrument[];
}

interface Instrument {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  responseCount: number;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'scale' | 'checkbox' | 'dropdown';
  required: boolean;
  options?: string[];
}

const DataCollectionTool: React.FC<DataCollectionToolProps> = ({
  userId,
  userRole,
  className = '',
}) => {
  // State
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DatasetStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'instruments'>('overview');
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock datasets
        const mockDatasets: Dataset[] = [
          {
            id: 'dataset-1',
            title: 'Student Engagement in Online Learning Environments',
            description: 'A survey to measure student engagement levels in various online learning environments.',
            type: 'survey',
            status: 'active',
            createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
            updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
            startDate: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
            endDate: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
            participants: 120,
            responses: 78,
            targetResponses: 200,
            tags: ['engagement', 'online learning', 'survey'],
            instruments: [
              {
                id: 'instrument-1',
                title: 'Student Engagement Survey',
                description: 'Measures cognitive, emotional, and behavioral engagement in online learning environments.',
                questions: [
                  {
                    id: 'q1',
                    text: 'How often do you participate in online discussions?',
                    type: 'multiple-choice',
                    required: true,
                    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
                  },
                  {
                    id: 'q2',
                    text: 'Rate your level of interest in the course content.',
                    type: 'scale',
                    required: true,
                    options: ['1', '2', '3', '4', '5']
                  }
                ],
                responseCount: 78
              }
            ]
          },
          {
            id: 'dataset-2',
            title: 'Teacher Perceptions of AI in Education',
            description: 'A survey to understand teacher perceptions regarding AI in educational settings.',
            type: 'survey',
            status: 'draft',
            createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
            updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
            participants: 0,
            responses: 0,
            targetResponses: 100,
            tags: ['AI', 'teacher perceptions', 'survey'],
            instruments: [
              {
                id: 'instrument-2',
                title: 'Teacher AI Perception Survey',
                description: 'Measures teacher attitudes regarding AI in education.',
                questions: [
                  {
                    id: 'q4',
                    text: 'How familiar are you with AI applications in education?',
                    type: 'multiple-choice',
                    required: true,
                    options: ['Not at all familiar', 'Slightly familiar', 'Moderately familiar', 'Very familiar', 'Extremely familiar']
                  }
                ],
                responseCount: 0
              }
            ]
          }
        ];
        
        setDatasets(mockDatasets);
        setSelectedDataset(mockDatasets[0]);
        setSelectedInstrument(mockDatasets[0].instruments[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching data collection data:', err);
        setError('Failed to load data collection tools');
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
  
  // Get status color
  const getStatusColor = (status: DatasetStatus): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get dataset type icon
  const getDatasetTypeIcon = (type: DatasetType) => {
    switch (type) {
      case 'survey':
        return <CheckSquare className="h-4 w-4 text-blue-400" />;
      case 'observation':
        return <Eye className="h-4 w-4 text-green-400" />;
      case 'interview':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'experiment':
        return <FileText className="h-4 w-4 text-orange-400" />;
      case 'secondary':
        return <Database className="h-4 w-4 text-red-400" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Filter datasets
  const filteredDatasets = datasets.filter(dataset => {
    // Filter by search query
    const matchesSearch = 
      dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate progress percentage
  const calculateProgress = (dataset: Dataset): number => {
    if (!dataset.targetResponses || dataset.targetResponses === 0) return 0;
    return Math.min(100, Math.round((dataset.responses / dataset.targetResponses) * 100));
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Data Collection Tool</h2>
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
          <Database className="h-6 w-6 mr-2 text-green-400" />
          Data Collection Tool
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
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* New Dataset Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Dataset</span>
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
        {/* Dataset List */}
        <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Your Datasets</h3>
            
            <div className="flex items-center space-x-2">
              {/* Status Filter */}
              <select
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value as DatasetStatus | 'all')}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          {filteredDatasets.length > 0 ? (
            <div className="space-y-3">
              {filteredDatasets.map(dataset => (
                <div 
                  key={dataset.id} 
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedDataset?.id === dataset.id 
                      ? 'bg-gray-700 border-l-4 border-green-500' 
                      : 'bg-gray-750 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedDataset(dataset);
                    setSelectedInstrument(dataset.instruments[0] || null);
                    setActiveTab('overview');
                  }}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {getDatasetTypeIcon(dataset.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{dataset.title}</h4>
                      <div className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {dataset.description}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(dataset.status)} mr-2`}></span>
                          <span className="text-gray-300 text-xs capitalize">{dataset.status}</span>
                        </div>
                        <div className="text-gray-400 text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{dataset.responses} / {dataset.targetResponses || '∞'}</span>
                        </div>
                      </div>
                      
                      {dataset.targetResponses && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-300">{calculateProgress(dataset)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${calculateProgress(dataset)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No datasets found</p>
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
        
        {/* Dataset Details */}
        {selectedDataset ? (
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 max-h-[600px] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-white">{selectedDataset.title}</h3>
                  <span className={`ml-3 inline-block px-2 py-0.5 rounded-full text-xs capitalize ${
                    selectedDataset.status === 'active' ? 'bg-green-900/30 text-green-400' :
                    selectedDataset.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                    selectedDataset.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {selectedDataset.status}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {getDatasetTypeIcon(selectedDataset.type)}
                  <span className="ml-1 capitalize">{selectedDataset.type}</span>
                  {selectedDataset.startDate && (
                    <span className="ml-3">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {formatDate(selectedDataset.startDate)}
                      {selectedDataset.endDate && ` - ${formatDate(selectedDataset.endDate)}`}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Download className="h-4 w-4" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Dataset Tabs */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'text-green-400 border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'instruments' 
                    ? 'text-green-400 border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('instruments')}
              >
                Instruments ({selectedDataset.instruments.length})
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300">{selectedDataset.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Participation</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Responses</span>
                          <span className="text-white">{selectedDataset.responses} / {selectedDataset.targetResponses || '∞'}</span>
                        </div>
                        {selectedDataset.targetResponses && (
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${calculateProgress(selectedDataset)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400 text-sm">Participants</div>
                          <div className="text-white">{selectedDataset.participants}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Instruments</div>
                          <div className="text-white">{selectedDataset.instruments.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-sm">Created</div>
                        <div className="text-white text-sm">{formatDate(selectedDataset.createdAt)}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-sm">Last Updated</div>
                        <div className="text-white text-sm">{formatDate(selectedDataset.updatedAt)}</div>
                      </div>
                      {selectedDataset.startDate && (
                        <div className="flex justify-between">
                          <div className="text-gray-400 text-sm">Start Date</div>
                          <div className="text-white text-sm">{formatDate(selectedDataset.startDate)}</div>
                        </div>
                      )}
                      {selectedDataset.endDate && (
                        <div className="flex justify-between">
                          <div className="text-gray-400 text-sm">End Date</div>
                          <div className="text-white text-sm">{formatDate(selectedDataset.endDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDataset.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-xs flex items-center">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'instruments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Data Collection Instruments</h4>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1 text-sm flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Instrument
                  </button>
                </div>
                
                {selectedDataset.instruments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDataset.instruments.map(instrument => (
                      <div 
                        key={instrument.id} 
                        className={`bg-gray-750 rounded-lg p-4 cursor-pointer ${
                          selectedInstrument?.id === instrument.id ? 'border border-green-500' : ''
                        }`}
                        onClick={() => setSelectedInstrument(instrument)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-white font-medium">{instrument.title}</h5>
                            <p className="text-gray-400 text-sm mt-1">{instrument.description}</p>
                          </div>
                          <div className="text-gray-300 text-sm flex items-center">
                            <CheckSquare className="h-4 w-4 mr-1" />
                            {instrument.questions.length} questions
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-gray-400 text-xs">
                            {instrument.responseCount} responses
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-white p-1">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-750 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No instruments created yet</p>
                    <p className="text-gray-500 text-sm mt-2">Create an instrument to start collecting data</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 flex items-center justify-center">
            <div className="text-center">
              <Database className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Select a dataset to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollectionTool;