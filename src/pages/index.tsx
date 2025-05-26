import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Simple index page for Vercel deployment verification
 * 
 * This page is created to help resolve the 404 issue on the root URL.
 */
export default function IndexPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Head>
        <title>EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect Platform" />
      </Head>

      <h1 style={{ color: '#0369a1' }}>EdPsych Connect</h1>
      <h2 style={{ color: '#666', fontWeight: 'normal' }}>Platform Home</h2>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>Welcome to the EdPsych Connect platform. This is a temporary index page to resolve routing issues.</p>
        <p>If you can see this page, the deployment is working correctly.</p>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>Test Pages</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><a href="/test-deployment" style={{ color: '#0ea5e9' }}>Test Deployment Page</a></li>
          <li><a href="/minimal-test" style={{ color: '#0ea5e9' }}>Minimal Test Page</a></li>
          <li><a href="/ultra-minimal" style={{ color: '#0ea5e9' }}>Ultra Minimal Page</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}