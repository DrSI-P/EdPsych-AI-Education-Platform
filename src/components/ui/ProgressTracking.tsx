import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressTrackingProps {
  learningObjectives: Array<{
    id: string;
    title: string;
    description?: string;
    completed?: boolean;
    progress?: number;
  }>;
  onObjectiveComplete?: (objectiveId: string) => void;
  onProgressUpdate?: (objectiveId: string, progress: number) => void;
  showCelebration?: boolean;
  userProfile?: {
    name?: string;
  };
  allowSelfAssessment?: boolean;
}

/**
 * ProgressTracking component that visualizes learning progress
 * and celebrates achievements
 */
const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  learningObjectives,
  onObjectiveComplete,
  onProgressUpdate,
  showCelebration = true,
  userProfile,
  allowSelfAssessment = true,
}) => {
  const [objectives, setObjectives] = useState(learningObjectives);
  const [showingCelebration, setShowingCelebration] = useState(false);
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);
  
  // Calculate overall progress
  const overallProgress = objectives.length > 0
    ? objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / objectives.length
    : 0;
  
  // Update objectives when props change
  useEffect(() => {
    setObjectives(learningObjectives);
  }, [learningObjectives]);
  
  // Handle objective completion
  const handleCompleteObjective = (objectiveId: string) => {
    const updatedObjectives = objectives.map(obj => 
      obj.id === objectiveId ? { ...obj, completed: true, progress: 100 } : obj
    );
    
    setObjectives(updatedObjectives);
    setRecentlyCompleted(objectiveId);
    
    if (showCelebration) {
      setShowingCelebration(true);
      setTimeout(() => setShowingCelebration(false), 3000);
    }
    
    if (onObjectiveComplete) {
      onObjectiveComplete(objectiveId);
    }
    
    if (onProgressUpdate) {
      onProgressUpdate(objectiveId, 100);
    }
  };
  
  // Handle progress update
  const handleProgressUpdate = (objectiveId: string, progress: number) => {
    const updatedObjectives = objectives.map(obj => 
      obj.id === objectiveId ? { ...obj, progress } : obj
    );
    
    setObjectives(updatedObjectives);
    
    if (onProgressUpdate) {
      onProgressUpdate(objectiveId, progress);
    }
    
    // Auto-complete if progress reaches 100%
    if (progress >= 100 && onObjectiveComplete) {
      onObjectiveComplete(objectiveId);
    }
  };
  
  return (
    <div className="progress-tracking">
      {/* Overall progress */}
      <div className="overall-progress mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
          <span className="text-lg font-bold text-blue-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Learning objectives */}
      <div className="learning-objectives space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Objectives</h3>
        
        {objectives.map((objective) => (
          <div 
            key={objective.id} 
            className={`p-4 border rounded-lg ${
              objective.completed 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
            } transition-colors duration-200`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">{objective.title}</h4>
                {objective.description && (
                  <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                )}
              </div>
              
              {objective.completed ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              ) : (
                allowSelfAssessment && (
                  <button
                    onClick={() => handleCompleteObjective(objective.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Mark Complete
                  </button>
                )
              )}
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{objective.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${objective.completed ? 'bg-green-500' : 'bg-blue-600'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${objective.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Self-assessment slider */}
            {allowSelfAssessment && !objective.completed && (
              <div className="mt-3">
                <label htmlFor={`progress-${objective.id}`} className="text-xs text-gray-500">
                  Update your progress:
                </label>
                <input
                  id={`progress-${objective.id}`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={objective.progress || 0}
                  onChange={(e) => handleProgressUpdate(objective.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Celebration animation */}
      {showingCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Congratulations{userProfile?.name ? `, ${userProfile.name}` : ''}!
            </h3>
            <p className="text-gray-600">
              You've completed: <span className="font-medium text-blue-600">
                {objectives.find(obj => obj.id === recentlyCompleted)?.title}
              </span>
            </p>
          </motion.div>
          
          {/* Confetti effect */}
          <div className="confetti-container absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  top: '-10%',
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: ['#FFC700', '#FF0055', '#2D95BF', '#00CC88'][Math.floor(Math.random() * 4)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                }}
                animate={{
                  top: '100%',
                  rotate: Math.random() * 360,
                  x: Math.random() * 100 - 50,
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
