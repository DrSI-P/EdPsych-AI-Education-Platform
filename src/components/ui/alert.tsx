"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Alert variants using the new design system
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "border-primary/50 bg-primary/10 text-primary [&>svg]:text-primary",
        secondary: "border-secondary/50 bg-secondary/10 text-secondary [&>svg]:text-secondary",
        accent: "border-accent/50 bg-accent/10 text-accent [&>svg]:text-accent",
        destructive: "border-error/50 bg-error/10 text-error [&>svg]:text-error",
        success: "border-success/50 bg-success/10 text-success [&>svg]:text-success",
        warning: "border-warning/50 bg-warning/10 text-warning [&>svg]:text-warning",
        info: "border-info/50 bg-info/10 text-info [&>svg]:text-info",
        ghost: "border-transparent bg-transparent",
      },
      animation: {
        none: "",
        fadeIn: "animate-fade-in",
        slideUp: "animate-slide-up",
        slideDown: "animate-slide-down",
        scale: "animate-scale",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, animation, icon, dismissible, onDismiss, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, animation }), className)}
      {...props}
    >
      {icon && icon}
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-md p-1 hover:bg-muted"
          aria-label="Dismiss alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
