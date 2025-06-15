"use client";

import React from 'react';
// This is a server component (no directive)


// Next.js optimization exports

export default function TestStaticPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Static Test Page
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        This is a server component that doesn't use any client-side code or database connections.
        If you can see this content, it means the basic server rendering is working.
      </p>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#d1fae5', 
        border: '1px solid #34d399',
        borderRadius: '0.25rem'
      }}>
        <p style={{ color: '#065f46' }}>
          ✅ Server component rendering is working correctly!
        </p>
      </div>
    </div>
  );
}