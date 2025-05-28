"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Avatar variants using the new design system
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
        "3xl": "h-24 w-24",
      },
      variant: {
        default: "bg-muted",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        accent: "bg-accent/20",
        outline: "ring-2 ring-border",
        ghost: "bg-transparent",
      },
      status: {
        none: "",
        online: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-success after:ring-1 after:ring-background",
        offline: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-neutral-400 after:ring-1 after:ring-background",
        busy: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-error after:ring-1 after:ring-background",
        away: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-warning after:ring-1 after:ring-background",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      status: "none",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  fallbackDelay?: number;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, status, src, alt, fallback, fallbackDelay = 600, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [showFallback, setShowFallback] = React.useState(!src);

    React.useEffect(() => {
      if (!src) {
        setShowFallback(true);
        return;
      }

      setShowFallback(false);
      setImageError(false);

      const timer = setTimeout(() => {
        if (imageError) {
          setShowFallback(true);
        }
      }, fallbackDelay);

      return () => clearTimeout(timer);
    }, [src, imageError, fallbackDelay]);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, status, className }))}
        {...props}
      >
        {!showFallback && src && (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {showFallback && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {fallback || (
              <span className="text-foreground font-medium">
                {alt ? getInitials(alt) : "?"}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// Helper function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Avatar Image component
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, ...props }, ref) => {
  return (
    <img
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      alt={alt || "Avatar"}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

// Avatar Fallback component
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className
      )}
      {...props}
    >
      {children || <span className="text-foreground font-medium">?</span>}
    </div>
  );
});

AvatarFallback.displayName = "AvatarFallback";

// Avatar Group component for displaying multiple avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<Omit<AvatarProps, "className">>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
  variant?: VariantProps<typeof avatarVariants>["variant"];
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", variant = "default", ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            size={size}
            variant={variant}
            className="ring-2 ring-background"
            {...avatar}
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size, variant }),
              "ring-2 ring-background flex items-center justify-center bg-muted"
            )}
          >
            <span className="text-xs font-medium text-foreground">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, AvatarImage, AvatarFallback, avatarVariants };
