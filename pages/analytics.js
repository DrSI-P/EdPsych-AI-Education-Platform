import React from 'react';
import Head from 'next/head';

const AnalyticsPage = () => {
  return (
    <>
      <Head>
        <title>Analytics Dashboard | EdPsych Connect</title>
        <meta name="description" content="Track learning progress, user activity, and generate custom reports with the EdPsych Connect analytics dashboard." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-purple-600">EdPsych Connect</a>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-purple-600">Home</a>
              <a href="/student" className="text-gray-600 hover:text-purple-600">Student Portal</a>
              <a href="/educator" className="text-gray-600 hover:text-purple-600">Educator Resources</a>
              <a href="/analytics" className="text-purple-600 font-medium">Analytics</a>
              <a href="/settings" className="text-gray-600 hover:text-purple-600">Settings</a>
            </nav>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Sign In</button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-xl mt-4 max-w-3xl mx-auto">
              Track learning progress, monitor user activity, and generate custom reports to optimize educational outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Learning Progress</h2>
              <p>Track individual and group progress across curriculum areas and learning objectives.</p>
              <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-500">Progress visualization will appear here</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">User Activity</h2>
              <p>Monitor engagement metrics, resource usage, and platform interaction patterns.</p>
              <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-500">Activity charts will appear here</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Custom Reports</h2>
              <p>Generate tailored reports for different stakeholders with flexible data visualization options.</p>
              <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-500">Report generator will appear here</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6">Performance Dashboard</h2>
            <p className="mb-6">View comprehensive performance metrics across all platform activities and learning objectives.</p>
            <div className="p-8 bg-gray-100 rounded-md text-center">
              <p className="text-gray-500">Interactive dashboard will appear here</p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Data Export</h2>
              <p>Export analytics data in multiple formats for further analysis or reporting.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">CSV Export</button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">PDF Report</button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Excel Export</button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Scheduled Reports</h2>
              <p>Set up automated reports to be delivered on your preferred schedule.</p>
              <div className="mt-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Configure Reports</button>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">EdPsych Connect</h3>
                <p>Revolutionizing educational psychology through personalized, evidence-based support.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="/resources/learning-styles" className="hover:text-purple-300">Learning Styles</a></li>
                  <li><a href="/resources/adaptive-learning" className="hover:text-purple-300">Adaptive Learning</a></li>
                  <li><a href="/resources/restorative-justice" className="hover:text-purple-300">Restorative Justice</a></li>
                  <li><a href="/resources/special-needs" className="hover:text-purple-300">Special Needs Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact</h3>
                <p>Email: info@edpsychconnect.com</p>
                <p>Phone: +44 (0)20 1234 5678</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p>&copy; {new Date().getFullYear()} EdPsych Connect Limited. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AnalyticsPage;
