'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiagnosticPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Capture console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, `[LOG] ${logMessage}`]);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setErrors(prev => [...prev, `[ERROR] ${errorMessage}`]);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      const warnMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, `[WARN] ${warnMessage}`]);
    };

    console.log('Diagnostic page mounted');

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Diagnostic Page Content
        </h2>
        <p>
          This page is used to diagnose provider loading issues. If you can see this content,
          the basic page rendering is working. Check the provider status above to see which
          providers are loading successfully and which are failing.
        </p>
      </div>

      {errors.length > 0 && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Errors Detected:
          </h3>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: '#f87171',
            padding: '1rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {errors.map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Test Pages:
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { title: 'Home', path: '/', description: 'Main page with all providers' },
            { title: 'Fixed Layout', path: '/fixed-layout', description: 'Page with simplified layout' },
            { title: 'No Providers', path: '/no-providers', description: 'Page without providers' },
            { title: 'Simple Page', path: '/simple', description: 'Basic Next.js page' },
            { title: 'Static Test', path: '/test-static', description: 'Server component test' },
            { title: 'Database Test', path: '/db-test', description: 'Database connection test' }
          ].map((link, index) => (
            <Link href={link.path} key={index} style={{ textDecoration: 'none' }}>
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#3b82f6' }}>
                  {link.title}
                </h3>
                <p style={{ color: '#4b5563' }}>{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Console Logs:
        </h3>
        <div style={{ 
          backgroundColor: '#1e293b', 
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))
          ) : (
            <div>No logs captured yet...</div>
          )}
        </div>
      </div>

      <footer style={{ 
        padding: '1.5rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <p>EdPsych Connect - Diagnostic Tools</p>
      </footer>
    </div>
  );
}