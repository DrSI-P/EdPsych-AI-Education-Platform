"use client";

import * as React from 'react';
import { cn } from "@/lib/utils";

/**
 * AlertTitle Component
 * 
 * A styled heading component for use within Alert components.
 * This component is exported separately to ensure it's available for direct imports.
 */
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export { AlertTitle };
export default AlertTitle;
