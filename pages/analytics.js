import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';

const AnalyticsPage = () => {
  return (
    <>
      <Head>
        <title>Analytics Dashboard | EdPsych Connect</title>
        <meta name="description" content="Track learning progress, user activity, and generate custom reports with the EdPsych Connect analytics dashboard." />
      </Head>
      
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient animate-fade-in">
            Analytics Dashboard
          </h1>
          <p className="text-xl mt-4 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Track learning progress, monitor user activity, and generate custom reports to optimize educational outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in animation-delay-300">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Learning Progress</h2>
            <p>Track individual and group progress across curriculum areas and learning objectives.</p>
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
              <p className="text-gray-500">Progress visualization will appear here</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Activity</h2>
            <p>Monitor engagement metrics, resource usage, and platform interaction patterns.</p>
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
              <p className="text-gray-500">Activity charts will appear here</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Custom Reports</h2>
            <p>Generate tailored reports for different stakeholders with flexible data visualization options.</p>
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
              <p className="text-gray-500">Report generator will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-card p-8 rounded-lg shadow-md animate-fade-in animation-delay-400">
          <h2 className="text-3xl font-semibold mb-6">Performance Dashboard</h2>
          <p className="mb-6">View comprehensive performance metrics across all platform activities and learning objectives.</p>
          <div className="p-8 bg-gray-100 rounded-md text-center">
            <p className="text-gray-500">Interactive dashboard will appear here</p>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in animation-delay-500">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Data Export</h2>
            <p>Export analytics data in multiple formats for further analysis or reporting.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary">CSV Export</button>
              <button className="btn-primary">PDF Report</button>
              <button className="btn-primary">Excel Export</button>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Scheduled Reports</h2>
            <p>Set up automated reports to be delivered on your preferred schedule.</p>
            <div className="mt-4">
              <button className="btn-primary">Configure Reports</button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AnalyticsPage;
