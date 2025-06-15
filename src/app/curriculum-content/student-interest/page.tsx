'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { StudentInterestPersonalization } from '@/components/curriculum-content/student-interest/StudentInterestPersonalization';
/**
 * Student Interest Personalization Page
 * 
 * Renders the student interest personalization component as a standalone page
 */

// Original component
function StudentInterestPersonalizationPage() {
  return <StudentInterestPersonalization />;
}


export default StudentInterestPersonalizationPage;