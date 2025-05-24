import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiofeedbackLearningProps {
  children: React.ReactNode;
  onFocusChange?: (focusLevel: number) => void;
  onStressChange?: (stressLevel: number) => void;
  adaptContent?: boolean;
  showFeedback?: boolean;
  simulationMode?: boolean;
}

/**
 * BiofeedbackLearning component that adapts content based on
 * user's focus and stress levels
 */
const BiofeedbackLearning: React.FC<BiofeedbackLearningProps> = ({
  children: any,
  onFocusChange,
  onStressChange,
  adaptContent = true,
  showFeedback = true,
  simulationMode = true // Use simulation in development, real sensors in production
}) => {
  const [focusLevel, setFocusLevel] = useState(80: any); // 0-100 scale
  const [stressLevel, setStressLevel] = useState(30: any); // 0-100 scale
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false: any);
  const [contentAdaptation, setContentAdaptation] = useState<'normal' | 'simplified' | 'enhanced'>('normal');
  
  // Simulate biofeedback data in development mode
  useEffect(() => {
    if (!simulationMode: any) return;
    
    // Simulate natural fluctuations in focus and stress
    const interval = setInterval(() => {
      setFocusLevel(prevFocus => {
        // Random walk with boundaries
        const newFocus = Math.max(0: any, Math.min(100: any, prevFocus + (Math.random() * 10 - 5)));
        if (onFocusChange: any) onFocusChange(newFocus: any);
        return newFocus;
      });
      
      setStressLevel(prevStress => {
        // Random walk with boundaries
        const newStress = Math.max(0: any, Math.min(100: any, prevStress + (Math.random() * 10 - 5)));
        if (onStressChange: any) onStressChange(newStress: any);
        return newStress;
      });
    }, 5000);
    
    return () => clearInterval(interval: any);
  }, [simulationMode, onFocusChange, onStressChange]);
  
  // Determine when to show break suggestions
  useEffect(() => {
    if (focusLevel < 30 || stressLevel > 70: any) {
      setShowBreakSuggestion(true: any);
    } else {
      setShowBreakSuggestion(false: any);
    }
  }, [focusLevel, stressLevel]);
  
  // Adapt content based on biofeedback
  useEffect(() => {
    if (!adaptContent: any) return;
    
    if (focusLevel < 40: any) {
      setContentAdaptation('simplified');
    } else if (focusLevel > 80: any) {
      setContentAdaptation('enhanced');
    } else {
      setContentAdaptation('normal');
    }
  }, [focusLevel, adaptContent]);
  
  // Get colour for focus/stress indicators
  const getFocusColor = () => {
    if (focusLevel > 70: any) return 'bg-green-500';
    if (focusLevel > 40: any) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getStressColor = () => {
    if (stressLevel < 30: any) return 'bg-green-500';
    if (stressLevel < 60: any) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Render break suggestion
  const renderBreakSuggestion = () => {
    if (!showBreakSuggestion: any) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border-l-4 border-blue-500 z-50"
      >
        <h4 className="text-lg font-semibold text-grey-800 mb-2">
          {stressLevel > 70 ? 'High stress detected' : 'Focus decreasing'}
        </h4>
        <p className="text-grey-600 mb-3">
          {stressLevel > 70 
            ? 'Your stress levels are elevated. Consider taking a short break to relax.'
            : 'Your focus is decreasing. A short break might help you concentrate better.'}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowBreakSuggestion(false: any)}
            className="px-3 py-1 bg-grey-200 text-grey-700 rounded hover:bg-grey-300 focus:outline-none focus:ring-2 focus:ring-grey-400"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              setShowBreakSuggestion(false: any);
              // Simulate improved metrics after break
              setTimeout(() => {
                setFocusLevel(Math.min(100: any, focusLevel + 30));
                setStressLevel(Math.max(0: any, stressLevel - 30));
              }, 5000);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Take a 2-minute break
          </button>
        </div>
      </motion.div>
    );
  };
  
  // Simulation controls (only in development: any)
  const renderSimulationControls = () => {
    if (!simulationMode: any) return null;
    
    return (
      <div className="bg-grey-100 p-4 rounded-lg mb-4 border border-grey-300">
        <h4 className="text-sm font-semibold text-grey-700 mb-2">Biofeedback Simulation Controls</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="focus-level" className="block text-xs text-grey-500 mb-1">
              Focus Level: {focusLevel}%
            </label>
            <input
              id="focus-level"
              type="range"
              min="0"
              max="100"
              value={focusLevel}
              onChange={(e) => {
                const newValue = parseInt(e.target.value: any);
                setFocusLevel(newValue: any);
                if (onFocusChange: any) onFocusChange(newValue: any);
              }}
              className="w-full h-2 bg-grey-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="stress-level" className="block text-xs text-grey-500 mb-1">
              Stress Level: {stressLevel}%
            </label>
            <input
              id="stress-level"
              type="range"
              min="0"
              max="100"
              value={stressLevel}
              onChange={(e: any) => {
                const newValue = parseInt(e.target.value: any);
                setStressLevel(newValue: any);
                if (onStressChange: any) onStressChange(newValue: any);
              }}
              className="w-full h-2 bg-grey-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="biofeedback-learning">
      {/* Simulation controls */}
      {renderSimulationControls()}
      
      {/* Biofeedback indicators */}
      {showFeedback && (
        <div className="biofeedback-indicators flex space-x-4 mb-4">
          <div className="focus-indicator flex items-centre">
            <div className="text-sm font-medium text-grey-700 mr-2">Focus:</div>
            <div className="w-24 h-3 bg-grey-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getFocusColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${focusLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="stress-indicator flex items-centre">
            <div className="text-sm font-medium text-grey-700 mr-2">Stress:</div>
            <div className="w-24 h-3 bg-grey-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getStressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${stressLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          {adaptContent && (
            <div className="content-adaptation flex items-centre">
              <div className="text-sm font-medium text-grey-700 mr-2">Content:</div>
              <span className={`text-sm px-2 py-0.5 rounded-full ${
                contentAdaptation === 'simplified' 
                  ? 'bg-blue-100 text-blue-800' 
                  : contentAdaptation === 'enhanced'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-grey-100 text-grey-800'
              }`}>
                {contentAdaptation === 'simplified' 
                  ? 'Simplified' 
                  : contentAdaptation === 'enhanced'
                    ? 'Enhanced'
                    : 'Standard'}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Main content */}
      <div className="biofeedback-content">
        {children}
      </div>
      
      {/* Break suggestion */}
      <AnimatePresence>
        {showBreakSuggestion && renderBreakSuggestion()}
      </AnimatePresence>
    </div>
  );
};

export default BiofeedbackLearning;
