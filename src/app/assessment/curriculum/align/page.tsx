import { Suspense } from 'react';
import AlignAssessmentWithParams from './align-with-params';

export default function AlignAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-grey-900">Align Assessments to Curriculum Standard</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <AlignAssessmentWithParams />
    </Suspense>
  );
}
