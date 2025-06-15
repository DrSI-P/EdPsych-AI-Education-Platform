'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { ContentSearchFiltering } from '@/components/curriculum-content/search/ContentSearchFiltering';
/**
 * Content Search and Filtering Page
 * 
 * Renders the content search and filtering component as a standalone page
 */

// Original component
function ContentSearchFilteringPage() {
  return <ContentSearchFiltering />;
}


export default ContentSearchFilteringPage;