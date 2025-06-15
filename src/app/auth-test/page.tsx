'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthTestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    console.log('[AuthTest] Auth test page loaded');
    addLog('Auth test page loaded');
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testLoginPage = (): void => {
    addLog('Testing login page...');
    window.location.href = '/auth/login';
  };

  const testRegisterPage = (): void => {
    addLog('Testing register page...');
    window.location.href = '/auth/register';
  };

  const testSigninPage = (): void => {
    addLog('Testing signin page...');
    window.location.href = '/auth/signin';
  };

  const testSignupPage = (): void => {
    addLog('Testing signup page...');
    window.location.href = '/auth/signup';
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Auth System Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testLoginPage}>
                Test Login Page
              </Button>
              <Button onClick={testRegisterPage}>
                Test Register Page
              </Button>
              <Button onClick={testSigninPage}>
                Test Signin Page
              </Button>
              <Button onClick={testSignupPage}>
                Test Signup Page
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Navigation Links</h3>
              <div className="space-y-2">
                <div>
                  <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Login Page
                  </Link>
                </div>
                <div>
                  <Link href="/auth/register" className="text-blue-600 hover:underline">
                    Register Page
                  </Link>
                </div>
                <div>
                  <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    Signin Page
                  </Link>
                </div>
                <div>
                  <Link href="/auth/signup" className="text-blue-600 hover:underline">
                    Signup Page
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Logs</h3>
              <div className="bg-gray-100 p-4 rounded-md h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}