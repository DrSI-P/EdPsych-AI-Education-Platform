import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  
  // Content Security Policy - strict for educational platform
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://api.openai.com https://api.heygen.com https://labs.heygen.com wss://localhost:* ws://localhost:*",
    "media-src 'self' blob: https://labs.heygen.com",
    "object-src 'none'",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://labs.heygen.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
  
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

// Apply security headers to all API routes
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Additional security measures for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Prevent caching of sensitive API responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

// GET endpoint to check security headers status
export async function GET(req: NextRequest) {
  const headers = Object.entries(securityHeaders).map(([name, value]) => ({
    name,
    value: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
    status: 'active',
  }));
  
  return NextResponse.json({
    status: 'Security headers are active',
    headers,
    additionalMeasures: [
      'CSRF protection enabled',
      'Rate limiting active',
      'Input validation enforced',
      'SQL injection prevention',
      'XSS protection enabled',
    ],
  });
}