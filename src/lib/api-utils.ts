/**
 * API response wrapper for consistent error handling and type safety
 * This utility ensures all API responses follow a consistent structure
 */

import { NextResponse } from 'next/server';
import { TypedError } from './type-utils';

// Define standard response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Create a successful API response
 * @param data The data to return in the response
 * @returns NextResponse with standardized success structure
 */
export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data
  });
}

/**
 * Create an error API response
 * @param message Error message
 * @param code Error code
 * @param details Additional error details
 * @param status HTTP status code
 * @returns NextResponse with standardized error structure
 */
export function errorResponse(
  message: string,
  code: string = 'UNKNOWN_ERROR',
  details?: Record<string, unknown>,
  status: number = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

/**
 * Handle errors in API routes
 * @param error The error to handle
 * @returns NextResponse with appropriate error structure
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error('API Error:', error);
  
  // Handle TypedError
  if (error instanceof TypedError) {
    return errorResponse(error.message, error.code, error.details);
  }
  
  // Handle standard Error
  if (error instanceof Error) {
    return errorResponse(error.message);
  }
  
  // Handle unknown errors
  return errorResponse('An unexpected error occurred', 'INTERNAL_SERVER_ERROR', undefined, 500);
}

/**
 * Wrap an API handler with error handling
 * @param handler The API handler function
 * @returns A wrapped handler with error handling
 */
export function withErrorHandling<T>(
  handler: (...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
): (...args: any[]) => Promise<NextResponse<ApiResponse<T>>> {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
