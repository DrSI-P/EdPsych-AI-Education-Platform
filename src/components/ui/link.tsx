import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import NextLink from "next/link";

const linkVariants = cva(
  "inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
        subtle: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        muted: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
        accent: "text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300",
        destructive: "text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300",
        success: "text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300",
        warning: "text-warning-600 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-300",
        info: "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
      },
      size: {
        default: "text-base",
        sm: "text-sm",
        lg: "text-lg",
        xl: "text-xl",
      },
      underline: {
        none: "",
        hover: "no-underline hover:underline",
        always: "underline",
      },
      weight: {
        default: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      animation: {
        none: "",
        subtle: "transition-all duration-300",
        bounce: "transform transition-transform duration-200 hover:translate-y-[-2px]",
        grow: "transform transition-transform duration-200 hover:scale-105",
        glow: "hover:text-shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      underline: "hover",
      weight: "default",
      animation: "subtle",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
}

/**
 * Enhanced Link component with various styling options
 * 
 * Features:
 * - Multiple visual variants (default, subtle, muted, accent, etc.)
 * - Size options
 * - Underline control
 * - Font weight options
 * - Animation effects
 * - Icon support (left or right positioned)
 * - External link detection with appropriate attributes
 * - Next.js integration for client-side navigation
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className, 
    href, 
    variant, 
    size, 
    underline, 
    weight,
    animation,
    external = false,
    prefetch,
    icon,
    iconPosition = "left",
    disabled = false,
    children,
    ...props 
  }, ref) => {
    // Determine if link is external based on href or explicit prop
    const isExternal = external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    
    // Common props for both internal and external links
    const commonProps = {
      className: cn(
        linkVariants({ variant, size, underline, weight, animation }),
        disabled && "pointer-events-none opacity-50",
        className
      ),
      ref,
      "aria-disabled": disabled,
      ...props,
    };
    
    // Additional props for external links
    const externalProps = isExternal ? {
      target: "_blank",
      rel: "noopener noreferrer",
    } : {};
    
    // Render content with icon if provided
    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );
    
    // Use Next Link for internal navigation, regular anchor for external
    if (isExternal) {
      return (
        <a 
          href={href}
          {...commonProps}
          {...externalProps}
        >
          {content}
        </a>
      );
    }
    
    return (
      <NextLink
        href={href}
        prefetch={prefetch}
        {...commonProps}
      >
        {content}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
