import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's merge utility
 * @param inputs - Class values to be combined
 * @returns Merged class string
 */
export function cn(...inputs[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a localized string
 * @param input - Date to format (string, number, or Date object)
 * @param locale - Locale to use for formatting (defaults to en-GB)
 * @returns Formatted date string
 */
export function formatDate(
  input: string | number | Date,
  locale: string = "en-GB"
): string {
  const date = new Date(input);
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Creates an absolute URL by combining the base app URL with a path
 * @param path - Path to append to the base URL
 * @returns Complete absolute URL
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  // Ensure path starts with a slash and baseUrl doesn't end with one
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedBaseUrl = baseUrl.endsWith("/") 
    ? baseUrl.slice(0, -1) 
    : baseUrl;
  
  return `${normalizedBaseUrl}${normalizedPath}`;
}

/**
 * Safely parses JSON with error handling
 * @param jsonString - JSON string to parse
 * @param fallback - Default value to return if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
