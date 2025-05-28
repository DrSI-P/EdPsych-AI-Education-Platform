"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Feature section variants using the new design system
const featureSectionVariants = cva(
  "w-full py-16 md:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        primary: "bg-primary/5",
        secondary: "bg-secondary/5",
        accent: "bg-accent/5",
        muted: "bg-muted",
        alternate: "bg-gradient-to-br from-background to-muted",
      },
      layout: {
        grid: "",
        list: "",
        cards: "",
        zigzag: "",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "grid",
    },
  }
);

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  link?: {
    text: string;
    href: string;
  };
}

export interface FeatureSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof featureSectionVariants> {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 1 | 2 | 3 | 4;
  withDividers?: boolean;
  withBackground?: boolean;
  iconSize?: "sm" | "md" | "lg";
  alignment?: "left" | "center";
}

export function FeatureSection({
  className,
  variant,
  layout,
  title,
  subtitle,
  features,
  columns = 3,
  withDividers = false,
  withBackground = false,
  iconSize = "md",
  alignment = "left",
  ...props
}: FeatureSectionProps) {
  // Determine grid columns based on columns prop
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  // Determine icon size
  const iconSizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <section
      className={cn(featureSectionVariants({ variant, layout }), className)}
      {...props}
    >
      <div className="container">
        {/* Section header */}
        {(title || subtitle) && (
          <div className={cn(
            "max-w-3xl mb-12",
            alignment === "center" ? "mx-auto text-center" : ""
          )}>
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Features grid layout */}
        {layout === "grid" && (
          <div className={cn(
            "grid gap-8 md:gap-12",
            gridCols[columns]
          )}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col",
                  withBackground && "p-6 rounded-lg bg-background shadow-sm border border-border",
                  alignment === "center" && "items-center text-center"
                )}
              >
                {feature.icon && (
                  <div className={cn(
                    "mb-4 text-primary",
                    iconSizeClass[iconSize]
                  )}>
                    {feature.icon}
                  </div>
                )}
                {feature.image && (
                  <div className="mb-4">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="rounded-lg h-auto max-w-full"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                {feature.link && (
                  <a 
                    href={feature.link.href}
                    className="text-primary font-medium hover:underline mt-auto"
                  >
                    {feature.link.text}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Features list layout */}
        {layout === "list" && (
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-4",
                  withDividers && index !== features.length - 1 && "pb-8 border-b border-border",
                  withBackground && "p-6 rounded-lg bg-background shadow-sm border border-border"
                )}
              >
                {feature.icon && (
                  <div className={cn(
                    "flex-shrink-0 text-primary",
                    iconSizeClass[iconSize]
                  )}>
                    {feature.icon}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  {feature.link && (
                    <a 
                      href={feature.link.href}
                      className="text-primary font-medium hover:underline"
                    >
                      {feature.link.text}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features cards layout */}
        {layout === "cards" && (
          <div className={cn(
            "grid gap-8",
            gridCols[columns]
          )}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="rounded-lg border border-border bg-background p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className={cn(
                  "flex flex-col",
                  alignment === "center" && "items-center text-center"
                )}>
                  {feature.icon && (
                    <div className={cn(
                      "mb-4 text-primary",
                      iconSizeClass[iconSize]
                    )}>
                      {feature.icon}
                    </div>
                  )}
                  {feature.image && (
                    <div className="mb-4 w-full">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="rounded-lg h-auto w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  {feature.link && (
                    <a 
                      href={feature.link.href}
                      className="text-primary font-medium hover:underline mt-auto"
                    >
                      {feature.link.text}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features zigzag layout */}
        {layout === "zigzag" && (
          <div className="space-y-16 md:space-y-24">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
                  index % 2 === 1 && "md:flex-row-reverse"
                )}
              >
                <div className={cn(
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12",
                  alignment === "center" && "text-center"
                )}>
                  {feature.icon && (
                    <div className={cn(
                      "mb-4 text-primary",
                      iconSizeClass[iconSize],
                      alignment === "center" && "mx-auto"
                    )}>
                      {feature.icon}
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  {feature.link && (
                    <a 
                      href={feature.link.href}
                      className="text-primary font-medium hover:underline inline-flex items-center"
                    >
                      {feature.link.text}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </a>
                  )}
                </div>
                {feature.image && (
                  <div className={cn(
                    "rounded-lg overflow-hidden shadow-lg",
                    withBackground && "border border-border"
                  )}>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { featureSectionVariants };
