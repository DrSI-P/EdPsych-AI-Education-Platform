/**
 * UK Educational Standards Middleware for EdPsych AI Education Platform
 * This middleware ensures all API responses align with UK educational standards
 */

import { NextResponse } from 'next/server';
import { convertToUKSpelling, convertToUKEducationalTerminology } from '@/lib/uk-standards';
import { ApiResponse } from '@/lib/api-utils';

/**
 * Process API response content to ensure UK educational standards compliance
 * @param content Content to process
 * @returns Content aligned with UK educational standards
 */
function processContentForUKStandards(content: any): any {
  if (typeof content === 'string') {
    // Apply UK spelling and terminology to string content
    return convertToUKEducationalTerminology(convertToUKSpelling(content));
  } else if (Array.isArray(content)) {
    // Process each item in the array
    return content.map(item => processContentForUKStandards(item));
  } else if (content !== null && typeof content === 'object') {
    // Process each property in the object
    const processed: Record<string, any> = {};
    for (const [key, value] of Object.entries(content)) {
      processed[key] = processContentForUKStandards(value);
    }
    return processed;
  }
  
  // Return unchanged for other types
  return content;
}

/**
 * Middleware to ensure API responses align with UK educational standards
 * @param response NextResponse to process
 * @returns Processed NextResponse with UK standards compliance
 */
export function withUKStandardsCompliance<T>(
  response: NextResponse<ApiResponse<T>>
): NextResponse<ApiResponse<T>> {
  // Clone the response to avoid modifying the original
  const clonedResponse = response.clone();
  
  // Parse the response body
  const body = clonedResponse.json();
  
  // Process the response data if it exists
  if (body && body.success && body.data) {
    body.data = processContentForUKStandards(body.data);
  }
  
  // Create a new response with the processed body
  return NextResponse.json(body, {
    status: clonedResponse.status,
    headers: clonedResponse.headers
  });
}

/**
 * Higher-order function to wrap API handlers with UK standards compliance
 * @param handler API handler function
 * @returns Wrapped handler with UK standards compliance
 */
export function withUKStandards<T>(
  handler: (...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
): (...args: any[]) => Promise<NextResponse<ApiResponse<T>>> {
  return async (...args: any[]) => {
    const response = await handler(...args);
    return withUKStandardsCompliance(response);
  };
}
