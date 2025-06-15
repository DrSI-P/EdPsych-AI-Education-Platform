'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { EnhancedAccessibilityPanel } from '@/components/accessibility/EnhancedAccessibilityPanel';
// This prevents Next.js from trying to statically generate this page

/**
 * Enhanced Accessibility Page
 * 
 * This page provides access to the comprehensive enhanced accessibility features
 * of the EdPsych-AI-Education-Platform, including UK curriculum-specific accessibility,
 * AI-powered adaptations, and AI avatar video accessibility.
 */

// Original component
function EnhancedAccessibilityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Enhanced Accessibility</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive accessibility features designed for UK educational contexts
      </p>
      
      <EnhancedAccessibilityPanel />
    </div>
  );
}


export default EnhancedAccessibilityPage;