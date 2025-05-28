"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Hero section variants using the new design system
const heroVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "bg-primary/10 text-foreground",
        secondary: "bg-secondary/10 text-foreground",
        accent: "bg-accent/10 text-foreground",
        dark: "bg-neutral-900 text-neutral-100",
        gradient: "bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground",
      },
      size: {
        default: "py-16 md:py-24",
        sm: "py-8 md:py-12",
        lg: "py-24 md:py-32",
        xl: "py-32 md:py-40",
        full: "min-h-screen py-16",
      },
      alignment: {
        center: "text-center",
        left: "text-left",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      alignment: "center",
    },
  }
);

export interface HeroProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroVariants> {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "background";
  actions?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  waveEffect?: boolean;
}

export function Hero({
  className,
  variant,
  size,
  alignment,
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = "background",
  actions,
  overlay = false,
  overlayOpacity = 0.5,
  waveEffect = false,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn(
        heroVariants({ variant, size, alignment }),
        className
      )}
      {...props}
    >
      {/* Background image with optional overlay */}
      {image && imagePosition === "background" && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={imageAlt || "Hero background"}
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div 
              className="absolute inset-0 bg-black" 
              style={{ opacity: overlayOpacity }}
            />
          )}
        </div>
      )}
      
      {/* Wave effect */}
      {waveEffect && (
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              fillOpacity="0.1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      )}
      
      <div className="container relative z-10">
        {/* Content with image on left/right */}
        <div className={cn(
          "grid gap-8",
          imagePosition === "left" && image ? "md:grid-cols-2 md:gap-12" : "",
          imagePosition === "right" && image ? "md:grid-cols-2 md:gap-12" : "",
        )}>
          {/* Image (left position) */}
          {image && imagePosition === "left" && (
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt={imageAlt || "Hero image"}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* Content */}
          <div className={cn(
            "flex flex-col justify-center",
            alignment === "center" && "items-center",
            alignment === "right" && "items-end",
          )}>
            <h1 className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
              (imagePosition === "background" && overlay) && "text-white"
            )}>
              {title}
            </h1>
            
            {subtitle && (
              <p className={cn(
                "mt-4 text-lg sm:text-xl text-muted-foreground max-w-prose",
                (imagePosition === "background" && overlay) && "text-white/80"
              )}>
                {subtitle}
              </p>
            )}
            
            {actions && (
              <div className={cn(
                "mt-8 flex flex-wrap gap-4",
                alignment === "center" && "justify-center",
                alignment === "right" && "justify-end",
              )}>
                {actions}
              </div>
            )}
          </div>
          
          {/* Image (right position) */}
          {image && imagePosition === "right" && (
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt={imageAlt || "Hero image"}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { heroVariants };
