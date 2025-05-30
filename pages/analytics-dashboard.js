import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';

const AnalyticsDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Analytics Dashboard | EdPsych Connect</title>
        <meta name="description" content="Track learning progress and generate insights with the EdPsych Connect analytics dashboard." />
      </Head>
      
      <MainNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient animate-fade-in">
            Analytics Dashboard
          </h1>
          <p className="text-lg mt-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Track learning progress and generate insights to support educational development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Learning Progress Section */}
          <div className="bg-card rounded-lg p-6 shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
            <p>Track individual and group progress across different subjects and skills.</p>
            <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Progress visualization will appear here</p>
            </div>
            <button className="btn-primary mt-4 w-full">View Detailed Reports</button>
          </div>
          
          {/* User Activity Section */}
          <div className="bg-card rounded-lg p-6 shadow-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-4">User Activity</h2>
            <p>Monitor engagement levels and time spent on different learning resources.</p>
            <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Activity charts will appear here</p>
            </div>
            <button className="btn-primary mt-4 w-full">View Activity Details</button>
          </div>
          
          {/* Custom Reports Section */}
          <div className="bg-card rounded-lg p-6 shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold mb-4">Custom Reports</h2>
            <p>Generate tailored reports based on specific metrics and time periods.</p>
            <div className="mt-4 h-40 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Report generator will appear here</p>
            </div>
            <button className="btn-primary mt-4 w-full">Create New Report</button>
          </div>
        </div>
        
        <div className="mt-8 bg-card rounded-lg p-6 shadow-md animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-semibold mb-4">Analytics Settings</h2>
          <p>Configure your analytics preferences and data visualization options.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Refresh Rate</label>
              <select className="w-full p-2 border rounded">
                <option>Real-time</option>
                <option>Hourly</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default View</label>
              <select className="w-full p-2 border rounded">
                <option>Individual Student</option>
                <option>Class Overview</option>
                <option>Subject Performance</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          <button className="btn-primary mt-4">Save Settings</button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalyticsDashboardPage;
