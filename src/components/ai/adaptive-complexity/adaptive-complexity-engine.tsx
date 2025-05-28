"use client";

import React from 'react';

/**
 * AdaptiveComplexityEngine component
 * This component provides an interface for the adaptive complexity system
 */
export const AdaptiveComplexityEngine = ({ 
  initialLevel = 'medium',
  onLevelChange,
  children,
  className = ''
}) => {
  const [complexityLevel, setComplexityLevel] = React.useState(initialLevel);
  
  const handleLevelChange = (newLevel) => {
    setComplexityLevel(newLevel);
    if (onLevelChange) {
      onLevelChange(newLevel);
    }
  };
  
  return (
    <div className={`adaptive-complexity-container ${className}`}>
      <div className="adaptive-complexity-controls mb-4">
        <h3 className="text-lg font-medium mb-2">Content Complexity</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleLevelChange('simple')}
            className={`px-3 py-1 rounded ${complexityLevel === 'simple' ? 'bg-blue-500 text-white' : 'border'}`}
          >
            Simple
          </button>
          <button 
            onClick={() => handleLevelChange('medium')}
            className={`px-3 py-1 rounded ${complexityLevel === 'medium' ? 'bg-blue-500 text-white' : 'border'}`}
          >
            Medium
          </button>
          <button 
            onClick={() => handleLevelChange('advanced')}
            className={`px-3 py-1 rounded ${complexityLevel === 'advanced' ? 'bg-blue-500 text-white' : 'border'}`}
          >
            Advanced
          </button>
        </div>
      </div>
      <div className="adaptive-complexity-content">
        {children}
      </div>
    </div>
  );
};



export default AdaptiveComplexityEngine;