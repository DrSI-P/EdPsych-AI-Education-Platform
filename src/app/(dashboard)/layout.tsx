import React from 'react';
import { auth } from '@/lib/auth/auth-compat';
import { redirect } from 'next/navigation';
// import Link from 'next/link'; // Unused import
import { Button } from '@/components/ui/button';
import { UILink } from '@/components/ui';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Redirect to sign in if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-grey-900 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">EdPsych Platform</h2>
        </div>
        
        <nav className="space-y-2">
          <UILink href="/dashboard" className="block py-2 px-4 rounded hover:bg-grey-800">
            Dashboard
          </UILink>
          <UILink href="/assessment" className="block py-2 px-4 rounded hover:bg-grey-800">
            Assessments
          </UILink>
          <UILink href="/resources" className="block py-2 px-4 rounded hover:bg-grey-800">
            Resources
          </UILink>
          <UILink href="/curriculum" className="block py-2 px-4 rounded hover:bg-grey-800">
            Curriculum
          </UILink>
          <UILink href="/immersive" className="block py-2 px-4 rounded hover:bg-grey-800">
            Immersive Learning
          </UILink>
          
          {/* Admin-only links */}
          {session.user?.role === 'ADMIN' && (
            <UILink href="/admin" className="block py-2 px-4 rounded hover:bg-grey-800">
              Admin Panel
            </UILink>
          )}
          
          {/* Educator-only links */}
          {(session.user?.role === 'EDUCATOR' || session.user?.role === 'ADMIN') && (
            <UILink href="/educator" className="block py-2 px-4 rounded hover:bg-grey-800">
              Educator Tools
            </UILink>
          )}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <form action={async () => {
            'use server';
            await auth.signOut();
            redirect('/');
          }}>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
