// import React from 'react'; // Unused import
import AgeAppropriateReflectionPrompts from '@/components/restorative-justice/reflection-prompts/age-appropriate-reflection-prompts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age-Appropriate Reflection Prompts | EdPsych Connect',
  description: 'Developmentally appropriate prompts to support reflection within the restorative justice framework',
};

/**
 * Age-Appropriate Reflection Prompts Page
 * 
 * This page provides developmentally appropriate reflection prompts
 * for students at different age levels within the restorative justice framework.
 */
export default function ReflectionPromptsPage() : React.ReactNode {
  return (
    <div className="container mx-auto py-8">
      <AgeAppropriateReflectionPrompts />
    </div>
  );
}
