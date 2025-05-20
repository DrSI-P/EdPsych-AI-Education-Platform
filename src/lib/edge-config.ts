/**
 * Vercel Edge Config Utility
 * 
 * This module provides utilities for working with Vercel Edge Config,
 * which allows for storing and retrieving configuration values at the edge.
 * 
 * Edge Config is ideal for:
 * - Feature flags
 * - Remote configuration
 * - A/B testing
 * - Content management
 */

import { createEdgeConfig } from '@vercel/edge-config';

// Initialize Edge Config
const edgeConfig = createEdgeConfig();

/**
 * Get a feature flag value
 * @param key The feature flag key
 * @param defaultValue The default value if the key doesn't exist
 * @returns The feature flag value
 */
export async function getFeatureFlag(key: string, defaultValue: boolean = false): Promise<boolean> {
  try {
    const value = await edgeConfig.get<boolean>(`features.${key}`);
    return value ?? defaultValue;
  } catch (error) {
    console.error(`Error getting feature flag ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Get a configuration value
 * @param key The configuration key
 * @param defaultValue The default value if the key doesn't exist
 * @returns The configuration value
 */
export async function getConfig<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await edgeConfig.get<T>(key);
    return value ?? defaultValue;
  } catch (error) {
    console.error(`Error getting config ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Get all feature flags
 * @returns All feature flags
 */
export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const features = await edgeConfig.get<Record<string, boolean>>('features');
    return features ?? {};
  } catch (error) {
    console.error('Error getting all feature flags:', error);
    return {};
  }
}

/**
 * Check if a feature is enabled for a specific user
 * @param key The feature flag key
 * @param userId The user ID
 * @param percentage The percentage of users to enable the feature for (0-100)
 * @returns Whether the feature is enabled for the user
 */
export async function isFeatureEnabledForUser(
  key: string,
  userId: string,
  percentage: number = 100
): Promise<boolean> {
  try {
    // First check if the feature is globally enabled
    const isGloballyEnabled = await getFeatureFlag(key, false);
    if (isGloballyEnabled) return true;
    
    // If not globally enabled, check if it's enabled for this user based on percentage
    if (percentage <= 0) return false;
    if (percentage >= 100) return true;
    
    // Generate a hash from the user ID and feature key
    const hash = await generateHash(`${userId}:${key}`);
    const hashPercentage = (parseInt(hash.substring(0, 8), 16) / 0xffffffff) * 100;
    
    return hashPercentage <= percentage;
  } catch (error) {
    console.error(`Error checking if feature ${key} is enabled for user ${userId}:`, error);
    return false;
  }
}

/**
 * Generate a hash from a string
 * @param str The string to hash
 * @returns The hash as a hex string
 */
async function generateHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default edgeConfig;