"use client";

import React from 'react';

interface SimpleTabsProps {
  tabs: Array<{
    label: string;
    content: React.ReactNode;
  }>;
  activeTab: number;
  onChange: (index: number) => void;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({ 
  tabs, 
  activeTab, 
  onChange 
}) => {
  return (
    <div className="border-b">
      <div className="flex space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`py-2 px-4 font-medium ${activeTab === index ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default SimpleTabs;
