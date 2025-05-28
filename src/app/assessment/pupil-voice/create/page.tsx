import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';

// Import the client component that uses useSearchParams
import { PupilVoiceCreateWithParams } from './pupil-voice-create-with-params';

// Main page component with Suspense boundary
export default function CreatePupilVoiceSurveyPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-centre justify-between">
            <h1 className="text-2xl font-bold text-grey-900">Create Pupil Voice Survey</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" className="mb-4" />
              <p className="text-grey-600">Loading survey creator...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <PupilVoiceCreateWithParams />
    </Suspense>
  );
}
