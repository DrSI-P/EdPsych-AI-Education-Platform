'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { CurriculumContentManager } from '@/components/curriculum-content/manager/CurriculumContentManager';
/**
 * Curriculum Content Manager Page
 * 
 * Renders the curriculum content manager component as a standalone page
 */

// Original component
function CurriculumContentManagerPage() {
  return <CurriculumContentManager />;
}


export default CurriculumContentManagerPage;