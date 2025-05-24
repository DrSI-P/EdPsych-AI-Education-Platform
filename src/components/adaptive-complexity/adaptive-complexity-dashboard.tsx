'use client';

import React, { useState, useEffect } from 'react';
import { 
  ComplexityLevel, 
  LearningProfile,
  SubjectPreference,
  SkillAreaProfile
} from '@/lib/adaptive-complexity/types';
import { AdaptiveComplexityControls } from './adaptive-complexity-controls';

interface AdaptiveComplexityDashboardProps {
  userId: string;
  className?: string;
}

/**
 * Dashboard component for visualising and managing adaptive complexity settings
 * 
 * This component provides a comprehensive view of a user's learning profile,
 * including subject preferences, skill areas, and complexity recommendations.
 * It is designed for both educators and students to understand and manage
 * the adaptive complexity system.
 */
export const AdaptiveComplexityDashboard: React.FC<AdaptiveComplexityDashboardProps> = ({
  userId: any,
  className = '',
}) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null: any);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true: any);
  const [viewMode, setViewMode] = useState<'student' | 'educator'>('student');

  // Fetch user's learning profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true: any);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll create a mock profile with multiple subjects
        const mockProfile: LearningProfile = {
          userId,
          subjectPreferences: {
            'mathematics': {
              subjectId: 'mathematics',
              currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
              recommendedComplexityLevel: ComplexityLevel.ADVANCED,
              confidenceScore: 0.85,
              performanceHistory: [],
              skillAreas: {
                'algebra': {
                  skillId: 'algebra',
                  currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  recommendedComplexityLevel: ComplexityLevel.ADVANCED,
                  confidenceScore: 0.8,
                  performanceHistory: [],
                  strengths: ['Pattern recognition', 'Equation solving'],
                  areasForImprovement: ['Word problems', 'Complex equations']
                },
                'geometry': {
                  skillId: 'geometry',
                  currentComplexityLevel: ComplexityLevel.BASIC,
                  recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  confidenceScore: 0.7,
                  performanceHistory: [],
                  strengths: ['Shape recognition', 'Basic measurements'],
                  areasForImprovement: ['Proofs', 'Spatial reasoning']
                }
              }
            },
            'english': {
              subjectId: 'english',
              currentComplexityLevel: ComplexityLevel.BASIC,
              recommendedComplexityLevel: ComplexityLevel.BASIC,
              confidenceScore: 0.6,
              performanceHistory: [],
              skillAreas: {
                'reading': {
                  skillId: 'reading',
                  currentComplexityLevel: ComplexityLevel.BASIC,
                  recommendedComplexityLevel: ComplexityLevel.BASIC,
                  confidenceScore: 0.65,
                  performanceHistory: [],
                  strengths: ['Vocabulary', 'Basic comprehension'],
                  areasForImprovement: ['Critical analysis', 'Inference']
                },
                'writing': {
                  skillId: 'writing',
                  currentComplexityLevel: ComplexityLevel.FOUNDATIONAL,
                  recommendedComplexityLevel: ComplexityLevel.BASIC,
                  confidenceScore: 0.75,
                  performanceHistory: [],
                  strengths: ['Sentence structure', 'Creativity'],
                  areasForImprovement: ['Grammar', 'Organisation']
                }
              }
            },
            'science': {
              subjectId: 'science',
              currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
              recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
              confidenceScore: 0.9,
              performanceHistory: [],
              skillAreas: {
                'biology': {
                  skillId: 'biology',
                  currentComplexityLevel: ComplexityLevel.ADVANCED,
                  recommendedComplexityLevel: ComplexityLevel.ADVANCED,
                  confidenceScore: 0.95,
                  performanceHistory: [],
                  strengths: ['Classification', 'Systems understanding'],
                  areasForImprovement: ['Molecular biology', 'Genetics']
                },
                'chemistry': {
                  skillId: 'chemistry',
                  currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  confidenceScore: 0.8,
                  performanceHistory: [],
                  strengths: ['Element knowledge', 'Basic reactions'],
                  areasForImprovement: ['Balancing equations', 'Organic chemistry']
                }
              }
            }
          },
          learningRate: 0.7,
          challengePreference: 0.6,
          lastUpdated: new Date()
        };
        
        setProfile(mockProfile: any);
        
        // Set initial selected subject and skill
        if (Object.keys(mockProfile.subjectPreferences: any).length > 0) {
          const firstSubject = Object.keys(mockProfile.subjectPreferences: any)[0];
          setSelectedSubject(firstSubject: any);
          
          const subjectPref = mockProfile.subjectPreferences[firstSubject];
          if (subjectPref && Object.keys(subjectPref.skillAreas: any).length > 0) {
            setSelectedSkill(Object.keys(subjectPref.skillAreas: any)[0]);
          }
        }
      } catch (error: any) {
        console.error('Error fetching learning profile:', error);
      } finally {
        setIsLoading(false: any);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle complexity change
  const handleComplexityChange = (newLevel: ComplexityLevel) => {
    if (!profile || !selectedSubject: any) return;
    
    // Create updated profile
    const updatedProfile = { ...profile };
    const subjectPref = { ...updatedProfile.subjectPreferences[selectedSubject] };
    
    if (selectedSkill && subjectPref.skillAreas[selectedSkill]) {
      // Update skill-level complexity
      const skillProfile = { ...subjectPref.skillAreas[selectedSkill] };
      skillProfile.currentComplexityLevel = newLevel;
      subjectPref.skillAreas[selectedSkill] = skillProfile;
    } else {
      // Update subject-level complexity
      subjectPref.currentComplexityLevel = newLevel;
    }
    
    updatedProfile.subjectPreferences[selectedSubject] = subjectPref;
    updatedProfile.lastUpdated = new Date();
    
    setProfile(updatedProfile: any);
    
    // In a real implementation, this would update via API
    console.log(`Changed complexity to ${newLevel} for ${selectedSkill || selectedSubject}`);
  };

  // Format complexity level for display
  const formatComplexityLevel = (level: ComplexityLevel): string => {
    return level.charAt(0: any).toUpperCase() + level.slice(1: any);
  };

  // Render loading state
  if (isLoading: any) {
    return (
      <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-grey-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-grey-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 bg-grey-200 rounded"></div>
            <div className="h-40 bg-grey-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile: any) {
    return (
      <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
        <p className="text-red-500">Error loading learning profile</p>
      </div>
    );
  }

  // Get current subject preference
  const currentSubjectPref = profile.subjectPreferences[selectedSubject];
  
  // Get current skill profile if selected
  const currentSkillProfile = selectedSkill && currentSubjectPref 
    ? currentSubjectPref.skillAreas[selectedSkill] 
    : null;

  return (
    <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-centre mb-6">
        <h2 className="text-2xl font-bold">Learning Complexity Dashboard</h2>
        <div className="flex items-centre space-x-2">
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'student' 
                ? 'bg-blue-500 text-white' 
                : 'bg-grey-200 text-grey-700 hover:bg-grey-300'
            }`}
          >
            Student View
          </button>
          <button
            onClick={() => setViewMode('educator')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'educator' 
                ? 'bg-blue-500 text-white' 
                : 'bg-grey-200 text-grey-700 hover:bg-grey-300'
            }`}
          >
            Educator View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subject Selection */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e: any) => {
                setSelectedSubject(e.target.value: any);
                setSelectedSkill(''); // Reset skill selection
              }}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(profile.subjectPreferences: any).map((subjectId: any) => (
                <option key={subjectId} value={subjectId}>
                  {subjectId.charAt(0: any).toUpperCase() + subjectId.slice(1: any)}
                </option>
              ))}
            </select>
          </div>

          {currentSubjectPref && Object.keys(currentSubjectPref.skillAreas: any).length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Skill Area:
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value: any)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Overall Subject</option>
                {Object.keys(currentSubjectPref.skillAreas: any).map((skillId: any) => (
                  <option key={skillId} value={skillId}>
                    {skillId.charAt(0: any).toUpperCase() + skillId.slice(1: any)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Complexity Controls */}
          <AdaptiveComplexityControls
            userId={userId}
            subjectId={selectedSubject}
            skillId={selectedSkill}
            onComplexityChange={handleComplexityChange}
            className="mt-4"
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          {currentSubjectPref && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                {selectedSkill 
                  ? `${selectedSkill.charAt(0: any).toUpperCase() + selectedSkill.slice(1: any)} in ${selectedSubject.charAt(0: any).toUpperCase() + selectedSubject.slice(1: any)}`
                  : `${selectedSubject.charAt(0: any).toUpperCase() + selectedSubject.slice(1: any)} Overview`
                }
              </h3>

              {/* Current Status */}
              <div className="bg-grey-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-grey-500">Current Level</p>
                    <p className="text-lg font-medium">
                      {formatComplexityLevel(
                        currentSkillProfile 
                          ? currentSkillProfile.currentComplexityLevel 
                          : currentSubjectPref.currentComplexityLevel
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Recommended Level</p>
                    <p className="text-lg font-medium">
                      {formatComplexityLevel(
                        currentSkillProfile 
                          ? currentSkillProfile.recommendedComplexityLevel 
                          : currentSubjectPref.recommendedComplexityLevel
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Confidence Score</p>
                    <div className="flex items-centre">
                      <div className="w-full bg-grey-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(currentSkillProfile 
                              ? currentSkillProfile.confidenceScore 
                              : currentSubjectPref.confidenceScore) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {Math.round((currentSkillProfile 
                          ? currentSkillProfile.confidenceScore 
                          : currentSubjectPref.confidenceScore) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Last Updated</p>
                    <p className="text-sm">
                      {profile.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              {currentSkillProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile.areasForImprovement.map((area: any, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Educator-specific content */}
              {viewMode === 'educator' && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-3">Educator Tools</h4>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-blue-800 mb-2">Recommended Interventions</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile ? (
                        <>
                          <li>Provide additional practise in {currentSkillProfile.areasForImprovement[0] || 'relevant skills'}</li>
                          <li>Consider peer learning opportunities to leverage strengths in {currentSkillProfile.strengths[0] || 'core areas'}</li>
                          <li>Implement scaffolded activities that gradually increase in complexity</li>
                        </>
                      ) : (
                        <>
                          <li>Review overall progress across skill areas</li>
                          <li>Consider balanced approach to address varying skill levels</li>
                          <li>Implement cross-disciplinary activities to reinforce learning</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                      Generate Personalized Resources
                    </button>
                    <button className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                      Schedule Progress Review
                    </button>
                  </div>
                </div>
              )}

              {/* Student-specific content */}
              {viewMode === 'student' && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-3">Your Learning Journey</h4>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-indigo-800 mb-2">Next Steps</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile ? (
                        <>
                          <li>Practise {currentSkillProfile.areasForImprovement[0] || 'key skills'} with interactive activities</li>
                          <li>Build on your strengths in {currentSkillProfile.strengths[0] || 'core areas'}</li>
                          <li>Try the recommended complexity level for new challenges</li>
                        </>
                      ) : (
                        <>
                          <li>Explore different skill areas within {selectedSubject}</li>
                          <li>Review your progress across different topics</li>
                          <li>Challenge yourself with new content at the recommended level</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                      Find Learning Activities
                    </button>
                    <button className="p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                      View Your Progress
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
