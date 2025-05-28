"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Footer variants using the new design system
const footerVariants = cva(
  "w-full bg-background border-t border-border",
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-primary/5 border-primary/20",
        secondary: "bg-secondary/5 border-secondary/20",
        accent: "bg-accent/5 border-accent/20",
        muted: "bg-muted",
        dark: "bg-neutral-900 text-neutral-100 border-neutral-800",
      },
      size: {
        default: "py-8",
        sm: "py-4",
        lg: "py-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  logo?: React.ReactNode;
  navigation?: {
    title: string;
    items: { title: string; href: string }[];
  }[];
  socialLinks?: {
    icon: React.ReactNode;
    href: string;
    label: string;
  }[];
  copyright?: string;
  newsletter?: boolean;
}

export function Footer({
  className,
  variant,
  size,
  logo,
  navigation,
  socialLinks,
  copyright,
  newsletter,
  ...props
}: FooterProps) {
  const [email, setEmail] = React.useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic
    console.log(`Subscribed with email: ${email}`);
    setEmail("");
    // Show success message or toast
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer
      className={cn(footerVariants({ variant, size }), className)}
      {...props}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and description */}
          <div className="flex flex-col space-y-4">
            <div>
              {logo || (
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary">EdPsych</span>
                  <span className="text-xl font-medium">Connect</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering learners through tailored, evidence-based support and inclusive education for all children and young people.
            </p>
            
            {/* Social links */}
            {socialLinks && (
              <div className="flex space-x-4 mt-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Navigation sections */}
          {navigation?.map((section, index) => (
            <div key={index} className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Newsletter subscription */}
          {newsletter && (
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for the latest updates and resources.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 min-w-0 rounded-l-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-r-md border border-l-0 border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          )}
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {copyright || `© ${currentYear} EdPsych Connect. All rights reserved.`}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="/accessibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { footerVariants };
