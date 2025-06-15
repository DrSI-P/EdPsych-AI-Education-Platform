import React from 'react';
// This is a simple Next.js page with minimal dependencies


// Next.js optimization exports

export default function SimplePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Simple Next.js Page
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        This is a simple Next.js page with minimal dependencies.
        If you can see this content, it means the basic Next.js rendering is working.
      </p>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#d1fae5', 
        border: '1px solid #34d399',
        borderRadius: '0.25rem'
      }}>
        <p style={{ color: '#065f46' }}>
          ✅ Next.js rendering is working correctly!
        </p>
      </div>
    </div>
  );
}