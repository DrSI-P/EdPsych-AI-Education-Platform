"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import '@/styles/globals.css';
import '@/styles/mobile-fixes.css';

// Import providers individually for diagnostic purposes
import { SessionProvider } from 'next-auth/react';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { TenantProvider } from '@/lib/tenant-context';
import { EnhancedThemeProvider } from '@/components/enhanced-theme-provider';
import { AvatarProvider } from '@/components/Avatar/AvatarProvider';
import { Analytics } from '@/components/analytics';
import { VoiceAccessibilityProvider } from '@/components/accessibility/VoiceAccessibilityProvider';
import { FloatingVoiceControls } from '@/components/accessibility/VoiceAccessibilityControls';
import { FloatingAvatar } from '@/components/Avatar/FloatingAvatar';

// Diagnostic wrapper component to catch errors in each provider
function DiagnosticWrapper({ 
  children, 
  name 
}: { 
  children: React.ReactNode, 
  name: string 
}) {
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(`[DIAGNOSTIC] ${name} provider mounted`);
    setMounted(true);
    
    return () => {
      console.log(`[DIAGNOSTIC] ${name} provider unmounted`);
    };
  }, [name]);

  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        margin: '1rem', 
        backgroundColor: '#fee2e2', 
        border: '1px solid #ef4444',
        borderRadius: '0.5rem' 
      }}>
        <h3>Error in {name} Provider:</h3>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  try {
    return (
      <>
        {mounted && (
          <div style={{ 
            padding: '0.5rem', 
            margin: '0.5rem 0', 
            backgroundColor: '#d1fae5', 
            border: '1px solid #34d399',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>
            ✅ {name} Provider Loaded Successfully
          </div>
        )}
        {children}
      </>
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[DIAGNOSTIC] Error in ${name} provider:`, error);
    setError(error);
    return (
      <div style={{ 
        padding: '1rem', 
        margin: '1rem', 
        backgroundColor: '#fee2e2', 
        border: '1px solid #ef4444',
        borderRadius: '0.5rem' 
      }}>
        <h3>Error in {name} Provider:</h3>
        <pre>{error.message}</pre>
      </div>
    );
  }
}

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  // Override console.log to capture logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      setLogs(prev => [...prev, `[LOG] ${args.map(arg => String(arg)).join(' ')}`]);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      setLogs(prev => [...prev, `[ERROR] ${args.map(arg => String(arg)).join(' ')}`]);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      setLogs(prev => [...prev, `[WARN] ${args.map(arg => String(arg)).join(' ')}`]);
    };

    console.log('[DIAGNOSTIC] Diagnostic layout initialized');

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>EdPsych Connect - Diagnostic Layout</title>
        <meta name="description" content="Diagnostic Layout for Troubleshooting" />
      </head>
      <body>
        <div style={{ padding: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            EdPsych Connect - Diagnostic Layout
          </h1>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <p>This is a diagnostic layout that loads each provider individually with error tracking.</p>
            <p>Check the console for detailed logs.</p>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              {showLogs ? 'Hide Logs' : 'Show Logs'}
            </button>
          </div>

          {showLogs && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#1e293b', 
              color: '#e2e8f0',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Provider Status:
            </h2>
            
            <DiagnosticWrapper name="VoiceAccessibility">
              <VoiceAccessibilityProvider>
                <DiagnosticWrapper name="Session">
                  <SessionProvider>
                    <DiagnosticWrapper name="Supabase">
                      <SupabaseProvider>
                        <DiagnosticWrapper name="Tenant">
                          <TenantProvider>
                            <DiagnosticWrapper name="Theme">
                              <EnhancedThemeProvider>
                                <DiagnosticWrapper name="Avatar">
                                  <AvatarProvider>
                                    <DiagnosticWrapper name="Analytics">
                                      <Analytics />
                                    </DiagnosticWrapper>
                                    {children}
                                    <FloatingAvatar />
                                    <FloatingVoiceControls />
                                  </AvatarProvider>
                                </DiagnosticWrapper>
                              </EnhancedThemeProvider>
                            </DiagnosticWrapper>
                          </TenantProvider>
                        </DiagnosticWrapper>
                      </SupabaseProvider>
                    </DiagnosticWrapper>
                  </SessionProvider>
                </DiagnosticWrapper>
              </VoiceAccessibilityProvider>
            </DiagnosticWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}