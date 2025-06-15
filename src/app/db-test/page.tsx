import React from 'react';
import { db } from '@/lib/db';

// Next.js optimization exports
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour
export const fetchCache = 'default-cache';

// Next.js optimization exports


export default async function DbTestPage() {
  let userCount = 0;
  let dbError = null;
  let dbSuccess = false;

  try {
    // Try to count users in the database
    const users = await db.user.findMany();
    userCount = users.length;
    dbSuccess = true;
  } catch (error) {
    dbError = error instanceof Error ? error.message : String(error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Database Connection Test
      </h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>Database URL:</strong> {process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}</p>
        <p><strong>Connection Status:</strong> {dbSuccess ? '✅ Connected' : '❌ Failed'}</p>
        <p><strong>User Count:</strong> {dbSuccess ? userCount : 'N/A'}</p>
      </div>
      
      {dbError && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444',
          borderRadius: '0.25rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#7f1d1d' }}>
            <strong>Error:</strong> {dbError}
          </p>
        </div>
      )}
      
      {dbSuccess && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#d1fae5', 
          border: '1px solid #34d399',
          borderRadius: '0.25rem'
        }}>
          <p style={{ color: '#065f46' }}>
            ✅ Database connection is working correctly!
          </p>
        </div>
      )}
    </div>
  );
}