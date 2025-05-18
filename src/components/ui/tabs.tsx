'use client';

import React, { useState } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

// Radix UI based components that are imported in other files
export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Custom Tabs implementation - renamed to CustomTabs to avoid conflicts
interface CustomTabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function CustomTabs({ children, defaultTab, className = '' }: CustomTabsProps) {
  // Find the first tab's id if no default is provided
  const firstTabId = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TabList
  );
  
  const firstId = React.isValidElement(firstTabId) && 
    React.Children.toArray(firstTabId.props.children).find(
      (child) => React.isValidElement(child) && child.type === CustomTab
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

interface CustomTabProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function CustomTab({ children, id, className = '' }: CustomTabProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('CustomTab must be used within a CustomTabs component');
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

interface CustomTabPanelProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function CustomTabPanel({ children, id, className = '' }: CustomTabPanelProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('CustomTabPanel must be used within a CustomTabs component');
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
