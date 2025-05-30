import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';

const SettingsPage = () => {
  return (
    <>
      <Head>
        <title>Settings | EdPsych Connect</title>
        <meta name="description" content="Customize your EdPsych Connect experience with personalized settings and preferences." />
      </Head>
      
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient animate-fade-in">
            Platform Settings
          </h1>
          <p className="text-xl mt-4 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Customize your EdPsych Connect experience with personalized settings and preferences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-card p-6 rounded-lg shadow-md sticky top-24 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Settings Menu</h2>
              <nav className="space-y-2">
                <a href="#account" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Account Settings</a>
                <a href="#appearance" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Appearance</a>
                <a href="#notifications" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Notifications</a>
                <a href="#accessibility" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Accessibility</a>
                <a href="#privacy" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Privacy & Data</a>
                <a href="#integrations" className="block p-3 rounded-md hover:bg-purple-100 transition-colors font-medium">Integrations</a>
              </nav>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <section id="account" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-300">
              <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" className="w-full p-2 border rounded-md" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Student</option>
                    <option>Educator</option>
                    <option>Parent</option>
                    <option>Professional</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </section>
            
            <section id="appearance" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-400">
              <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border p-3 rounded-md text-center cursor-pointer bg-white">Light</div>
                    <div className="border p-3 rounded-md text-center cursor-pointer bg-gray-800 text-white">Dark</div>
                    <div className="border p-3 rounded-md text-center cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white">System</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size</label>
                  <input type="range" className="w-full" min="1" max="5" step="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age-Appropriate UI</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Nursery (Ages 3-5)</option>
                    <option>Early Primary (Ages 5-8)</option>
                    <option>Late Primary (Ages 8-11)</option>
                    <option>Secondary (Ages 11+)</option>
                    <option>Standard (Professional)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </section>
            
            <section id="notifications" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-500">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>In-App Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </section>
            
            <section id="accessibility" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-600">
              <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Screen Reader Support</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>High Contrast Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reduced Motion</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </section>
            
            <section id="privacy" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-700">
              <h2 className="text-2xl font-semibold mb-4">Privacy & Data</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Data Collection Consent</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Share Progress with Educators</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
                <div className="pt-4">
                  <button className="text-red-600 hover:text-red-800">Download My Data</button>
                  <span className="mx-2">|</span>
                  <button className="text-red-600 hover:text-red-800">Delete My Account</button>
                </div>
              </div>
            </section>
            
            <section id="integrations" className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-800">
              <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Google Classroom</span>
                  <button className="btn-primary">Connect</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Microsoft Teams</span>
                  <button className="btn-primary">Connect</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Canvas LMS</span>
                  <button className="btn-primary">Connect</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SettingsPage;
