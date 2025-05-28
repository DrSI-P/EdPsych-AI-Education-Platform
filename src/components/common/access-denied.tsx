import React from 'react';
import { Button } from '@/components/ui/button';

interface AccessDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You don't have permission to access this page.",
  redirectPath = "/",
  redirectLabel = "Return to Home"
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
      data-testid="access-denied-component"
    >
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Access Denied
      </h1>
      
      <p className="mb-6 text-gray-700 max-w-md">
        {message}
      </p>
      
      <Button
        onClick={() => window.location.href = redirectPath}
        className="px-6 py-2 rounded-md"
      >
        {redirectLabel}
      </Button>
    </div>
  );
};

export default AccessDenied;
