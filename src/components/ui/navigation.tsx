/**
 * Navigation component with enhanced visual design
 * 
 * This component provides a responsive navigation bar with support for
 * mobile menu, user authentication, and theme switching.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  userMenu?: React.ReactNode;
  className?: string;
}

export function Navigation({ 
  items, 
  logo, 
  userMenu,
  className 
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-background",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          {logo || (
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">EdPsych</span>
              <span className="text-xl font-medium">Connect</span>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {items.map((item, index) => (
            <NavItem 
              key={index} 
              item={item} 
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {userMenu}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-6 w-6 transition-transform",
                isOpen ? "rotate-90" : ""
              )}
            >
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] border-b" : "max-h-0"
        )}
      >
        <div className="container py-4 space-y-3">
          {items.map((item, index) => (
            <MobileNavItem
              key={index}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

// Desktop navigation item
function NavItem({ 
  item, 
  isActive 
}: { 
  item: NavigationItem; 
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary relative py-2",
        isActive 
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary" 
          : "text-foreground/70"
      )}
    >
      {item.title}
    </Link>
  );
}

// Mobile navigation item
function MobileNavItem({ 
  item, 
  isActive 
}: { 
  item: NavigationItem; 
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-muted"
      )}
    >
      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
      <span>{item.title}</span>
    </Link>
  );
}

// Theme toggle component
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  
  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    setTheme(savedTheme || "system");
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light, dark, and system
  const toggleTheme = () => {
    setTheme(current => {
      if (current === "light") return "dark";
      if (current === "dark") return "system";
      return "light";
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      )}
      {theme === "dark" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
      {theme === "system" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      )}
    </Button>
  );
}
