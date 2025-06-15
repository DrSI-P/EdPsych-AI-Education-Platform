'use client';

import React from 'react';

export default function NoProvidersPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        EdPsych Connect - No Providers
      </h1>
      
      <p style={{ marginBottom: '1rem' }}>
        This is a simplified version of the main page that doesn't use any providers or complex components.
        If you can see this content, it means the basic page structure works without providers.
      </p>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#d1fae5', 
        border: '1px solid #34d399',
        borderRadius: '0.25rem',
        marginBottom: '2rem'
      }}>
        <p style={{ color: '#065f46' }}>
          ✅ Basic page rendering without providers is working correctly!
        </p>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Platform Features
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { title: 'Educator Dashboard', description: 'Comprehensive analytics and insights' },
          { title: 'Student Management', description: 'Sophisticated tools for managing student profiles' },
          { title: 'Curriculum Design', description: 'Evidence-based curriculum design' },
          { title: 'Assessment Tools', description: 'Comprehensive assessment and evaluation systems' },
          { title: 'AI-Powered Learning', description: 'Advanced algorithms that personalize education' },
          { title: 'Restorative Justice', description: 'Building relationships and understanding' }
        ].map((feature, index) => (
          <div key={index} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {feature.title}
            </h3>
            <p style={{ color: '#4b5563' }}>{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        textAlign: 'center' as const
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Founded by Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
        </p>
        <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
          Qualified Chartered Educational Psychologist • HCPC Registered: PYL042340 • 20+ Years Education Experience
        </p>
      </div>
    </div>
  );
}