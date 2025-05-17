'use client';

import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({ children, defaultTab, className = '' }: TabsProps) {
  // Find the first tab's id if no default is provided
  const firstTabId = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TabList
  );
  
  const firstId = React.isValidElement(firstTabId) && 
    React.Children.toArray(firstTabId.props.children).find(
      (child) => React.isValidElement(child) && child.type === Tab
    );
  
  const initialTab = defaultTab || 
    (React.isValidElement(firstId) ? firstId.props.id : '');

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function Tab({ children, id, className = '' }: TabProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      id={`tab-${id}`}
      aria-controls={`panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      className={`
        py-2 px-4 text-sm font-medium border-b-2 -mb-px
        ${isActive 
          ? 'text-blue-600 border-blue-600' 
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}
        ${className}
      `}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function TabPanel({ children, id, className = '' }: TabPanelProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  const isActive = activeTab === id;
  
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={`py-4 ${className}`}
    >
      {children}
    </div>
  );
}

interface VerticalTabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

export function VerticalTabs({ children, defaultTab, className = '' }: VerticalTabsProps) {
  // Find the first tab's id if no default is provided
  const firstTabId = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === VerticalTabList
  );
  
  const firstId = React.isValidElement(firstTabId) && 
    React.Children.toArray(firstTabId.props.children).find(
      (child) => React.isValidElement(child) && child.type === VerticalTab
    );
  
  const initialTab = defaultTab || 
    (React.isValidElement(firstId) ? firstId.props.id : '');

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface VerticalTabListProps {
  children: React.ReactNode;
  className?: string;
}

export function VerticalTabList({ children, className = '' }: VerticalTabListProps) {
  return (
    <div className={`flex flex-col border-r border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface VerticalTabProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function VerticalTab({ children, id, className = '' }: VerticalTabProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('VerticalTab must be used within a VerticalTabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      id={`tab-${id}`}
      aria-controls={`panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      className={`
        py-2 px-4 text-sm font-medium text-left border-l-2 -ml-px
        ${isActive 
          ? 'text-blue-600 border-blue-600 bg-blue-50' 
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}
        ${className}
      `}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

interface VerticalTabPanelProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function VerticalTabPanel({ children, id, className = '' }: VerticalTabPanelProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('VerticalTabPanel must be used within a VerticalTabs component');
  }
  
  const { activeTab } = context;
  const isActive = activeTab === id;
  
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={`p-4 flex-1 ${className}`}
    >
      {children}
    </div>
  );
}
