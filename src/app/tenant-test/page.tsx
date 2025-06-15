"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useTenant } from '../../lib/tenant-context-railway';

export default function TenantTestPage() {
  const { currentTenantId, setCurrentTenant, isLoading, error } = useTenant();
  const [newTenantId, setNewTenantId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()}: ${message}`]);
  };

  // Log when the component mounts
  useEffect(() => {
    addLog(`Component mounted. Current tenant ID: ${currentTenantId}`);
  }, []);

  // Log when the tenant ID changes
  useEffect(() => {
    if (!isLoading) {
      addLog(`Tenant ID changed to: ${currentTenantId}`);
    }
  }, [currentTenantId, isLoading]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTenantId) {
      addLog(`Setting tenant ID to: ${newTenantId}`);
      setCurrentTenant(newTenantId);
      setNewTenantId('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tenant Provider Test Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Current Tenant Status</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Loading:</div>
          <div>{isLoading ? 'Yes' : 'No'}</div>
          
          <div className="font-medium">Current Tenant ID:</div>
          <div className="break-all">{currentTenantId || 'None'}</div>
          
          <div className="font-medium">Error:</div>
          <div className="text-red-500">{error ? error.message : 'None'}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Set Tenant ID</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newTenantId}
            onChange={(e: any) => setNewTenantId(e.target.value)}
            placeholder="Enter new tenant ID"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!newTenantId}
          >
            Set Tenant ID
          </button>
        </form>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Actions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              addLog('Clearing localStorage tenant ID');
              localStorage.removeItem('currentTenantId');
              window.location.reload();
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Clear Stored Tenant ID
          </button>
          
          <button
            onClick={() => {
              addLog('Generating random tenant ID');
              const randomId = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);
              setCurrentTenant(randomId);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Generate Random Tenant ID
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1 font-mono text-sm">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}