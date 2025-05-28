
CLIENT_COMPONENT_IMPORTS_PLACEHOLDER

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps): React.ReactNode {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-4 md:pb-6 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}

// Ensure 'use client' directive is at the very top if this is a client component
// For now, assuming it might be used in both contexts, so adding a placeholder that a script could replace or remove.
// If it's definitively a client component, the 'use client' directive should be uncommented or added at the top.
const finalContent = `
'use client';
${content.replace("CLIENT_COMPONENT_IMPORTS_PLACEHOLDER", "")}
`;
print(finalContent);

