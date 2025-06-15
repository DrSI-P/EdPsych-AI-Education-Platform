'use client';

import React, { useState, useEffect } from 'react';
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
  Video, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { getContentEngagementMetrics, ContentEngagementMetrics } from '@/lib/learning-analytics-service';

interface ContentEffectivenessAnalysisProps {
  courseId?: string;
  userRole: 'student' | 'instructor' | 'admin';
  className?: string;
}

// Define additional interfaces for the component
interface ContentMetricsExtended extends ContentEngagementMetrics {
  engagementScore: number;
  difficultyRating: number;
  completionTrend: 'increasing' | 'stable' | 'decreasing';
  keyInsights: ContentInsight[];
  improvementSuggestions: string[];
}

interface ContentInsight {
  type: 'positive' | 'negative' | 'neutral';
  message: string;
}

const ContentEffectivenessAnalysis: React.FC<ContentEffectivenessAnalysisProps> = ({
  courseId,
  userRole,
  className = '',
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentData, setContentData] = useState<ContentMetricsExtended[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'content-overview': true,
    'engagement-patterns': true
  });
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'views' | 'completion' | 'difficulty' | 'rating'>('views');
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch basic content metrics
        const contentMetrics = await getContentEngagementMetrics(
          ['video-1', 'video-2', 'video-3'], 
          { courseIds: courseId ? [courseId] : undefined }
        );
        
        // Enhance with additional metrics
        const enhancedData: ContentMetricsExtended[] = contentMetrics.map(content => {
          // Calculate engagement score
          const engagementScore = (
            content.completionRate * 0.4 + 
            (1 - content.averageDifficulty) * 0.3 + 
            (content.averageRating / 5) * 0.3
          );
          
          // Determine completion trend
          const completionTrend: 'increasing' | 'stable' | 'decreasing' = 
            Math.random() > 0.6 ? 'increasing' : 
            Math.random() > 0.3 ? 'stable' : 'decreasing';
          
          // Generate insights based on metrics
          const keyInsights: ContentInsight[] = [];
          
          if (content.completionRate < 0.6) {
            keyInsights.push({
              type: 'negative',
              message: 'Low completion rate indicates students may not be finishing the content'
            });
          } else if (content.completionRate > 0.85) {
            keyInsights.push({
              type: 'positive',
              message: 'High completion rate shows strong student engagement'
            });
          }
          
          if (content.averageDifficulty > 0.7) {
            keyInsights.push({
              type: 'negative',
              message: 'Content is rated as difficult by most students'
            });
          }
          
          // Generate improvement suggestions
          const improvementSuggestions: string[] = [];
          
          if (content.completionRate < 0.7) {
            improvementSuggestions.push('Break content into smaller, more digestible segments');
            improvementSuggestions.push('Add more interactive elements to maintain engagement');
          }
          
          if (content.averageDifficulty > 0.65) {
            improvementSuggestions.push('Provide additional supporting materials for complex concepts');
            improvementSuggestions.push('Include more examples and simplified explanations');
          }
          
          return {
            ...content,
            engagementScore,
            difficultyRating: content.averageDifficulty,
            completionTrend,
            keyInsights,
            improvementSuggestions
          };
        });
        
        // Sort data based on selected sort option
        const sortedData = sortContentData(enhancedData, sortBy);
        
        setContentData(sortedData);
        
        // Set first content as selected if none is selected
        if (!selectedContentId && sortedData.length > 0) {
          setSelectedContentId(sortedData[0].videoId);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching content effectiveness data:', err);
        setError('Failed to load content effectiveness data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, userRole, sortBy, selectedContentId]);
  
  // Helper function to sort content data
  const sortContentData = (data: ContentMetricsExtended[], sortBy: string): ContentMetricsExtended[] => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.totalViews - a.totalViews;
        case 'completion':
          return b.completionRate - a.completionRate;
        case 'difficulty':
          return a.difficultyRating - b.difficultyRating;
        case 'rating':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });
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
  
  // Get selected content
  const getSelectedContent = (): ContentMetricsExtended | null => {
    if (!selectedContentId) return null;
    return contentData.find(content => content.videoId === selectedContentId) || null;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Content Effectiveness Analysis</h2>
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
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Content Effectiveness Analysis</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value as any)}
            >
              <option value="views">Sort by Views</option>
              <option value="completion">Sort by Completion</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
          
          {/* Export Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Analysis</span>
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
          <Activity className="h-4 w-4 mr-2" />
          <span>Overview</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'detailed' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('detailed')}
        >
          <Video className="h-4 w-4 mr-2" />
          <span>Detailed Analysis</span>
        </button>
      </div>
      
      {/* Content Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Content Overview */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('content-overview')}
            >
              <h3 className="text-lg font-medium text-white flex items-center">
                <Video className="h-5 w-5 mr-2 text-blue-400" />
                <span>Content Overview</span>
              </h3>
              {expandedSections['content-overview'] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections['content-overview'] && (
              <div className="mt-4">
                {contentData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                          <th className="px-4 py-3">Content</th>
                          <th className="px-4 py-3">Views</th>
                          <th className="px-4 py-3">Completion</th>
                          <th className="px-4 py-3">Difficulty</th>
                          <th className="px-4 py-3">Rating</th>
                          <th className="px-4 py-3">Engagement</th>
                          <th className="px-4 py-3">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentData.map(content => (
                          <tr 
                            key={content.videoId} 
                            className={`border-b border-gray-700 cursor-pointer hover:bg-gray-750 ${
                              selectedContentId === content.videoId ? 'bg-gray-750' : 'bg-gray-800'
                            }`}
                            onClick={() => setSelectedContentId(content.videoId)}
                          >
                            <td className="px-4 py-3 text-white">{content.title}</td>
                            <td className="px-4 py-3 text-white">{content.totalViews}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(content.completionRate)}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(content.difficultyRating)}</td>
                            <td className="px-4 py-3 text-white">{content.averageRating.toFixed(1)}/5.0</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(content.engagementScore)}</td>
                            <td className="px-4 py-3 text-white">
                              {content.completionTrend === 'increasing' && (
                                <span className="flex items-center text-green-400">
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                  Increasing
                                </span>
                              )}
                              {content.completionTrend === 'stable' && (
                                <span className="flex items-center text-yellow-400">
                                  <Activity className="h-4 w-4 mr-1" />
                                  Stable
                                </span>
                              )}
                              {content.completionTrend === 'decreasing' && (
                                <span className="flex items-center text-red-400">
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                  Decreasing
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content data available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Engagement Patterns */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('engagement-patterns')}
            >
              <h3 className="text-lg font-medium text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-400" />
                <span>Engagement Patterns</span>
              </h3>
              {expandedSections['engagement-patterns'] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections['engagement-patterns'] && (
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Completion Rate Chart */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Completion Rates</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={contentData.map(content => ({
                            name: content.title.length > 20 ? content.title.substring(0, 20) + '...' : content.title,
                            completion: content.completionRate
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#999" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis stroke="#999" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#333', border: 'none' }}
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Completion Rate']}
                          />
                          <Bar dataKey="completion" fill="#0088FE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Engagement Score Chart */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Engagement Scores</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={contentData.map(content => ({
                            name: content.title.length > 20 ? content.title.substring(0, 20) + '...' : content.title,
                            engagement: content.engagementScore
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#999" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis stroke="#999" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#333', border: 'none' }}
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Engagement Score']}
                          />
                          <Bar dataKey="engagement" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Detailed Analysis Tab */}
      {activeTab === 'detailed' && selectedContentId && getSelectedContent() && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white flex items-center mb-4">
              <Video className="h-5 w-5 mr-2 text-blue-400" />
              <span>{getSelectedContent()?.title}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Views</div>
                <div className="text-white text-2xl font-semibold">{getSelectedContent()?.totalViews}</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Completion Rate</div>
                <div className="text-white text-2xl font-semibold">
                  {formatPercentage(getSelectedContent()?.completionRate || 0)}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Difficulty Rating</div>
                <div className="text-white text-2xl font-semibold">
                  {formatPercentage(getSelectedContent()?.difficultyRating || 0)}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">User Rating</div>
                <div className="text-white text-2xl font-semibold">
                  {getSelectedContent()?.averageRating.toFixed(1)}/5.0
                </div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-4">Key Insights</h4>
              <div className="space-y-3">
                {getSelectedContent()?.keyInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg flex items-start ${
                      insight.type === 'positive' ? 'bg-green-900/30 border border-green-700' :
                      insight.type === 'negative' ? 'bg-red-900/30 border border-red-700' :
                      'bg-gray-600/30 border border-gray-500'
                    }`}
                  >
                    {insight.type === 'positive' && <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />}
                    {insight.type === 'negative' && <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />}
                    {insight.type === 'neutral' && <Activity className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />}
                    <span className="text-white">{insight.message}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Improvement Suggestions */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Improvement Suggestions</h4>
              <ul className="list-disc pl-5 space-y-2 text-white">
                {getSelectedContent()?.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEffectivenessAnalysis;
