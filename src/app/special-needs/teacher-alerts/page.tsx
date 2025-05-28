// import React from 'react'; // Unused import
import { Metadata } from 'next';
import TeacherAlertSystem from '@/components/special-needs/teacher-alerts/teacher-alert-system';

export const metadata: Metadata = {
  title: 'Teacher Alert System for Concerning Patterns | EdPsych Connect',
  description: 'Monitor student behaviour patterns, create ABCC charts, and receive alerts for potential concerns.',
};

export default function TeacherAlertsPage() : React.ReactNode {
  return (
    <div className="container mx-auto py-8">
      <TeacherAlertSystem />
    </div>
  );
}
