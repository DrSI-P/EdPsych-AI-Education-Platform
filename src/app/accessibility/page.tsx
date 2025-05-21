'use client';

import AccessibilityControls from '@/components/ai/accessibility/accessibility-controls';

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
        <p className="text-muted-foreground">
          Customise your experience to meet your individual needs and preferences. These settings will be applied across the entire platform.
        </p>
      </div>
      
      <AccessibilityControls />
    </div>
  );
}
