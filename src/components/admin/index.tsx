'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock } from 'lucide-react';

export function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Admin Portal</h1>
        <p className="text-gray-300 mb-8">
          The admin portal requires special authentication. Please use the dashboard for administrative functions.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <Lock className="w-4 h-4" />
            <span>Protected by Role-Based Access Control</span>
          </div>
        </div>
      </div>
    </div>
  );
}