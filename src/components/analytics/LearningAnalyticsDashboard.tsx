'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  Video,
  Calendar,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  getUserEngagementMetrics,
  getContentEngagementMetrics,
  getPlatformUsageMetrics,
  AnalyticsFilter,
  UserEngagementMetrics,
  ContentEngagementMetrics,
  PlatformUsageMetrics
} from '@/lib/learning-analytics-service';
import PredictivePerformancePanel from './PredictivePerformancePanel';

interface LearningAnalyticsDashboardProps {
  userId?: string;
  courseId?: string;
  userRole: 'student' | 'instructor' | 'admin';
  className?: string;
}

const LearningAnalyticsDashboard: React.FC<LearningAnalyticsDashboardProps> = ({
  userId,
  courseId,
  userRole,
  className = '',
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'content' | 'performance'>('overview');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'semester' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEngagementData, setUserEngagementData] = useState<UserEngagementMetrics[]>([]);
  const [contentEngagementData, setContentEngagementData] = useState<ContentEngagementMetrics[]>([]);
  const [platformUsageData, setPlatformUsageData] = useState<PlatformUsageMetrics | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'overview-summary': true,
    'engagement-metrics': true,
    'content-effectiveness': true
  });
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Create filter based on props and state
        const filter: AnalyticsFilter = {
          ...(userId && { userIds: [userId] }),
          ...(courseId && { courseIds: [courseId] }),
          timeframe: getTimeframeFilter(timeframe)
        };
        
        // Fetch data based on user role and active tab
        if (userRole === 'student') {
          // For students, only show their own data
          if (userId) {
            const userMetrics = await getUserEngagementMetrics([userId], filter);
            setUserEngagementData(userMetrics);
          }
        } else {
          // For instructors and admins, show more comprehensive data
          if (activeTab === 'overview' || activeTab === 'engagement') {
            const userMetrics = await getUserEngagementMetrics(['user-1', 'user-2', 'user-3'], filter);
            setUserEngagementData(userMetrics);
          }
          
          if (activeTab === 'overview' || activeTab === 'content') {
            const contentMetrics = await getContentEngagementMetrics(['video-1', 'video-2'], filter);
            setContentEngagementData(contentMetrics);
          }
          
          // For all tabs, fetch platform usage data
          const usageData = await getPlatformUsageMetrics(filter);
          setPlatformUsageData(usageData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, courseId, userRole, activeTab, timeframe]);
  
  // Helper function to get timeframe filter
  const getTimeframeFilter = (timeframe: 'week' | 'month' | 'semester' | 'year'): AnalyticsFilter['timeframe'] => {
    const now = Date.now();
    let start: number;
    
    switch (timeframe) {
      case 'week':
        start = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago
        break;
      case 'month':
        start = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
        break;
      case 'semester':
        start = now - 120 * 24 * 60 * 60 * 1000; // 120 days ago
        break;
      case 'year':
        start = now - 365 * 24 * 60 * 60 * 1000; // 365 days ago
        break;
      default:
        start = now - 30 * 24 * 60 * 60 * 1000; // Default to 30 days
    }
    
    return {
      start,
      end: now
    };
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Learning Analytics Dashboard</h2>
          <div className="animate-pulse h-4 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-pulse h-64 bg-gray-800 rounded"></div>
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
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Learning Analytics Dashboard</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
              <option value="year">Last Year</option>
            </select>
          </div>
          
          {/* Export Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
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
          <BarChart2 className="h-4 w-4 mr-2" />
          <span>Overview</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'engagement' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('engagement')}
        >
          <Users className="h-4 w-4 mr-2" />
          <span>User Engagement</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'content' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('content')}
        >
          <Video className="h-4 w-4 mr-2" />
          <span>Content Effectiveness</span>
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'performance' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('performance')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          <span>Performance Insights</span>
        </button>
      </div>
      
      {/* Dashboard Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('overview-summary')}
            >
              <h3 className="text-lg font-medium text-white flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                <span>Summary Metrics</span>
              </h3>
              {expandedSections['overview-summary'] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections['overview-summary'] && platformUsageData && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Active Users</div>
                  <div className="text-white text-2xl font-semibold">{platformUsageData.activeUsers}</div>
                  <div className="text-green-400 text-xs mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{platformUsageData.newUsers} new users</span>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Avg. Session Duration</div>
                  <div className="text-white text-2xl font-semibold">{formatTime(platformUsageData.averageSessionDuration)}</div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Content Views</div>
                  <div className="text-white text-2xl font-semibold">
                    {platformUsageData.featureUsage['video-playback'] || 0}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Engagement Rate</div>
                  <div className="text-white text-2xl font-semibold">
                    {userEngagementData.length > 0 
                      ? formatPercentage(userEngagementData.reduce((sum, user) => sum + user.interactionRate, 0) / userEngagementData.length)
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          {/* User Engagement Metrics */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('engagement-metrics')}
            >
              <h3 className="text-lg font-medium text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                <span>User Engagement Metrics</span>
              </h3>
              {expandedSections['engagement-metrics'] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections['engagement-metrics'] && (
              <div className="mt-4">
                {userEngagementData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Watch Time</th>
                          <th className="px-4 py-3">Completion Rate</th>
                          <th className="px-4 py-3">Interaction Rate</th>
                          <th className="px-4 py-3">Annotations</th>
                          <th className="px-4 py-3">Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userEngagementData.map(user => (
                          <tr key={user.userId} className="bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-3 text-white">{user.userId}</td>
                            <td className="px-4 py-3 text-white">{formatTime(user.totalWatchTime)}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(user.completionRate)}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(user.interactionRate)}</td>
                            <td className="px-4 py-3 text-white">{user.annotationCount}</td>
                            <td className="px-4 py-3 text-white">{new Date(user.lastActive).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No user engagement data available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Content Effectiveness */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('content-effectiveness')}
            >
              <h3 className="text-lg font-medium text-white flex items-center">
                <Video className="h-5 w-5 mr-2 text-blue-400" />
                <span>Content Effectiveness</span>
              </h3>
              {expandedSections['content-effectiveness'] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections['content-effectiveness'] && (
              <div className="mt-4">
                {contentEngagementData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                          <th className="px-4 py-3">Content</th>
                          <th className="px-4 py-3">Views</th>
                          <th className="px-4 py-3">Unique Viewers</th>
                          <th className="px-4 py-3">Avg. Watch Time</th>
                          <th className="px-4 py-3">Completion Rate</th>
                          <th className="px-4 py-3">Difficulty</th>
                          <th className="px-4 py-3">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentEngagementData.map(content => (
                          <tr key={content.videoId} className="bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-3 text-white">{content.title}</td>
                            <td className="px-4 py-3 text-white">{content.totalViews}</td>
                            <td className="px-4 py-3 text-white">{content.uniqueViewers}</td>
                            <td className="px-4 py-3 text-white">{formatTime(content.averageWatchTime)}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(content.completionRate)}</td>
                            <td className="px-4 py-3 text-white">{formatPercentage(content.averageDifficulty)}</td>
                            <td className="px-4 py-3 text-white">{content.averageRating.toFixed(1)}/5.0</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content engagement data available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Predictive Performance Panel */}
          <PredictivePerformancePanel
            userId={userId}
            userRole={userRole}
            courseId={courseId}
          />
        </div>
      )}
    </div>
  );
};

export default LearningAnalyticsDashboard;