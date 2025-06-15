'use client';

import dynamic from 'next/dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

// Type definition for PupilVoiceSurvey
interface PupilVoiceSurvey {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  responseCount: number;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

// Original component
export default function PupilVoicePage() {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('surveys');
  const [surveys, setSurveys] = useState<PupilVoiceSurvey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<PupilVoiceSurvey[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/assessment/pupil-voice', { cache: "no-store" });
        
        if (!response.ok) {
          throw new Error('Failed to fetch pupil voice surveys');
        }
        
        const data = await response.json();
        setSurveys(data);
        setFilteredSurveys(data);
      } catch (err) {
        console.error('Error fetching pupil voice surveys:', err);
        setError('An error occurred whilst fetching the pupil voice surveys');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveys();
  }, []);

  useEffect(() => {
    // Filter surveys based on search query and status
    let filtered = [...surveys];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((survey: PupilVoiceSurvey) =>
        survey.title.toLowerCase().includes(query) ||
        survey.description?.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((survey: PupilVoiceSurvey) => survey.status === selectedStatus);
    }
    
    setFilteredSurveys(filtered);
  }, [surveys, searchQuery, selectedStatus]);

  const handleCreateSurvey = (): void => {
    router?.push('/assessment/pupil-voice/create');
  };

  const handleViewResults = (surveyId: string) => {
    router?.push(`/assessment/pupil-voice/results/${surveyId}` as any);
  };

  const handleEditSurvey = (surveyId: string) => {
    router?.push(`/assessment/pupil-voice/edit/${surveyId}` as any);
  };

  const handlePreviewSurvey = (surveyId: string) => {
    router?.push(`/assessment/pupil-voice/preview/${surveyId}` as any);
  };

  const renderSurveysTab = () => {
    console.log('[DEBUG] renderSurveysTab called, returning JSX element');
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    if (filteredSurveys.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No pupil voice surveys found matching your criteria.</p>
          <Button onClick={handleCreateSurvey}>
            Create New Survey
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredSurveys.map((survey: PupilVoiceSurvey) => (
          <Card key={survey.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{survey.title}</h3>
                  {survey.description && (
                    <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="mr-2">{survey.questionCount} questions</span>
                    <span className="mr-2">•</span>
                    <span>{survey.responseCount} responses</span>
                    <span className="mr-2">•</span>
                    <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      survey.status === 'draft' 
                        ? 'bg-gray-100 text-gray-800' 
                        : survey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {survey.status === 'draft' 
                        ? 'Draft' 
                        : survey.status === 'active' 
                        ? 'Active' 
                        : 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {survey.status !== 'draft' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResults(survey.id)}
                    >
                      View Results
                    </Button>
                  )}
                  {survey.status === 'draft' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSurvey(survey.id)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    onClick={() => handlePreviewSurvey(survey.id)}
                  >
                    {survey.status === 'draft' ? 'Preview' : 'View'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTemplatesTab = () => {
    console.log('[DEBUG] renderTemplatesTab called, returning JSX element');
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pupil Voice Templates</h2>
          <p className="text-gray-600">
            Use pre-designed templates to quickly create pupil voice surveys for common scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Classroom Environment</h3>
              <p className="text-sm text-gray-600 mt-1">
                Gather feedback about the classroom environment, teaching methods, and learning experience.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router?.push('/assessment/pupil-voice/create?template=classroom' as any)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Wellbeing Check-in</h3>
              <p className="text-sm text-gray-600 mt-1">
                Monitor student wellbeing, emotional health, and identify potential support needs.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router?.push('/assessment/pupil-voice/create?template=wellbeing' as any)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Subject Feedback</h3>
              <p className="text-sm text-gray-600 mt-1">
                Collect subject-specific feedback to improve curriculum delivery and student engagement.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router?.push('/assessment/pupil-voice/create?template=subject' as any)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderInsightsTab = () => {
    console.log('[DEBUG] renderInsightsTab called, returning JSX element');
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pupil Voice Insights</h2>
          <p className="text-gray-600">
            Analyze trends and patterns across multiple pupil voice surveys to gain deeper insights.
          </p>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">1,245</div>
              <p className="text-sm text-gray-600">Total Responses</p>
              <p className="text-xs text-gray-500 mt-1">+23% from last term</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">4.2/5</div>
              <p className="text-sm text-gray-600">Average Satisfaction</p>
              <p className="text-xs text-gray-500 mt-1">+0.3 from last term</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-xs text-gray-500 mt-1">Above target (80%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-sm text-gray-600">Active Surveys</p>
              <p className="text-xs text-gray-500 mt-1">Across all year groups</p>
            </CardContent>
          </Card>
        </div>

        {/* Key Themes */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Key Themes from Recent Surveys</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">Positive Themes</h4>
                  <span className="text-sm text-green-600">73% positive sentiment</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Supportive teachers and staff (mentioned 342 times)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Enjoyable extracurricular activities (mentioned 289 times)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Good friendships and peer support (mentioned 256 times)</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-orange-800">Areas for Improvement</h4>
                  <span className="text-sm text-orange-600">27% improvement suggestions</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">More quiet study spaces needed (mentioned 178 times)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Homework load balance (mentioned 156 times)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">More diverse lunch options (mentioned 134 times)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellbeing Trends */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Student Wellbeing Trends</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Happiness</span>
                  <span className="text-sm text-gray-600">8.2/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '82%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Feeling Supported</span>
                  <span className="text-sm text-gray-600">7.8/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Academic Confidence</span>
                  <span className="text-sm text-gray-600">7.5/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stress Levels</span>
                  <span className="text-sm text-gray-600">6.3/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '63%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Response Rate by Year Group</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { year: 'Year 7', rate: 92, count: 245 },
                  { year: 'Year 8', rate: 88, count: 223 },
                  { year: 'Year 9', rate: 85, count: 198 },
                  { year: 'Year 10', rate: 83, count: 187 },
                  { year: 'Year 11', rate: 79, count: 156 },
                  { year: 'Year 12/13', rate: 87, count: 236 }
                ].map((group) => (
                  <div key={group.year}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{group.year}</span>
                      <span className="text-sm text-gray-600">{group.rate}% ({group.count} students)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{width: `${group.rate}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Survey Completion Times</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-blue-600">6:45</div>
                  <p className="text-sm text-gray-600">Average completion time</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Quick responses (under 5 min)</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Standard responses (5-10 min)</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Detailed responses (over 10 min)</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recommended Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Address Study Space Concerns</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    178 students mentioned the need for more quiet study spaces. Consider converting underutilized rooms or extending library hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Review Homework Policy</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Multiple year groups reported concerns about homework load. Schedule a review with department heads to ensure balance.
                  </p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Celebrate Positive Feedback</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Share the positive feedback about supportive staff with teachers. Consider a staff recognition program based on student nominations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Generate Full Report</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pupil Voice</h1>
          <Button
            onClick={handleCreateSurvey}
          >
            Create New Survey
          </Button>
        </div>
        <p className="mt-2 text-gray-600">
          Create and manage pupil voice surveys to gather valuable feedback from students.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="surveys">My Surveys</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search surveys..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/4">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedStatus}
                  onChange={(e: any) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {renderSurveysTab()}
          </div>
        )}

        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>
    </div>
  );
}


// Removed invalid standalone statement: PupilVoicePage