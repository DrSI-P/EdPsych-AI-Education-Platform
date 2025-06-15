'use client';

import React from 'react';
import Link from 'next/link';

export default function FixedLayoutPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3b82f6' }}>
          EdPsych Connect
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
          Educational Psychology Platform with Fixed Layout
        </p>
      </header>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#d1fae5', 
        border: '1px solid #34d399',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <p style={{ color: '#065f46' }}>
          ✅ This page uses a fixed layout without problematic providers!
        </p>
      </div>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Platform Features
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
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
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Test Pages
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { title: 'Simple Page', path: '/simple', description: 'Basic Next.js page' },
            { title: 'No Providers', path: '/no-providers', description: 'Page without providers' },
            { title: 'Static Test', path: '/test-static', description: 'Server component test' },
            { title: 'HTML Test', path: '/test.html', description: 'Static HTML test' },
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
      </section>
      
      <footer style={{ 
        padding: '1.5rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Founded by Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
        </p>
        <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
          Qualified Chartered Educational Psychologist • HCPC Registered: PYL042340 • 20+ Years Education Experience
        </p>
      </footer>
    </div>
  );
}