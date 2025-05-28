import { Suspense } from 'react';
import ProgressPacingWithParams from './progress-pacing-with-params';

export default function ProgressPacingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Progress-Adaptive Pacing</h1>
            <p className="text-muted-foreground">
              Loading progress pacing tools...
            </p>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <ProgressPacingWithParams />
    </Suspense>
  );
}
