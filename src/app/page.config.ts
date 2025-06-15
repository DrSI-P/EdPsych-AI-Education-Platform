// Server-side configuration options for the home page

// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';

// Disable static generation
export const revalidate = 0;

// Disable fetch caching
export const fetchCache = "force-no-store";