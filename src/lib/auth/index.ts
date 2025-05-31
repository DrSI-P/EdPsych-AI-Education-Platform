// Barrel file for auth module
// This file serves as the main entry point for auth-related imports

export * from './auth-options';
export * from './auth';
export * from './session';
export * from './users';

// Re-export the auth function directly for API routes
import { auth } from './auth';
export { auth };
