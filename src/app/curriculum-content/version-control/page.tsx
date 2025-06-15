'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { ContentVersionControl } from '@/components/curriculum-content/version-control/ContentVersionControl';
/**
 * Content Version Control Page
 * 
 * Renders the content version control component as a standalone page
 */

// Original component
function ContentVersionControlPage() {
  return <ContentVersionControl />;
}


export default ContentVersionControlPage;