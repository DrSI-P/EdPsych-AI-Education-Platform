'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { UKCurriculumAlignment } from '@/components/curriculum-content/alignment/UKCurriculumAlignment';
/**
 * Curriculum Content Alignment Page
 * 
 * Renders the UK curriculum alignment component as a standalone page
 */

// Original component
function CurriculumAlignmentPage() {
  return <UKCurriculumAlignment />;
}


export default CurriculumAlignmentPage;