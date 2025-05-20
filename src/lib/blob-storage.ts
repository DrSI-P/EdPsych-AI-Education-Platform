/**
 * Vercel Blob Storage Utility
 * 
 * This module provides utilities for working with Vercel Blob,
 * which is a file storage solution optimized for the Vercel platform.
 * 
 * Vercel Blob is ideal for:
 * - User uploads
 * - Educational resources
 * - Images and media
 * - Documents and PDFs
 */

import { put, list, del, head } from '@vercel/blob';
import { getSignedUrl } from '@vercel/blob/client';

/**
 * Upload a file to Blob storage
 * @param file The file to upload
 * @param filename The filename to use
 * @param options Additional options
 * @returns The blob URL
 */
export async function uploadFile(
  file: File | Blob | ArrayBuffer | Buffer,
  filename: string,
  options?: {
    access?: 'public' | 'private';
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
    contentType?: string;
    multipart?: boolean;
    tags?: Record<string, string>;
  }
): Promise<string> {
  try {
    const blob = await put(filename, file, {
      access: options?.access || 'public',
      addRandomSuffix: options?.addRandomSuffix ?? true,
      cacheControlMaxAge: options?.cacheControlMaxAge,
      contentType: options?.contentType,
      multipart: options?.multipart,
      tags: options?.tags,
    });
    
    return blob.url;
  } catch (error) {
    console.error(`Error uploading file ${filename}:`, error);
    throw error;
  }
}

/**
 * Get a signed URL for uploading a file directly from the client
 * @param filename The filename to use
 * @param options Additional options
 * @returns The signed URL and blob URL
 */
export async function getUploadUrl(
  filename: string,
  options?: {
    access?: 'public' | 'private';
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
    contentType?: string;
    maxSize?: number;
    tags?: Record<string, string>;
  }
): Promise<{ signedUrl: string; blobUrl: string; uploadExpiry: Date }> {
  try {
    const { signedUrl, url, uploadExpiry } = await getSignedUrl({
      filename,
      access: options?.access || 'public',
      addRandomSuffix: options?.addRandomSuffix ?? true,
      cacheControlMaxAge: options?.cacheControlMaxAge,
      contentType: options?.contentType,
      maxSize: options?.maxSize,
      tags: options?.tags,
    });
    
    return { signedUrl, blobUrl: url, uploadExpiry };
  } catch (error) {
    console.error(`Error getting signed URL for ${filename}:`, error);
    throw error;
  }
}

/**
 * List files in Blob storage
 * @param prefix The prefix to filter by
 * @param limit The maximum number of files to return
 * @param cursor The cursor for pagination
 * @returns The list of files
 */
export async function listFiles(prefix?: string, limit?: number, cursor?: string) {
  try {
    return await list({ prefix, limit, cursor });
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Delete a file from Blob storage
 * @param url The URL of the file to delete
 * @returns True if the file was deleted successfully
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${url}:`, error);
    return false;
  }
}

/**
 * Check if a file exists in Blob storage
 * @param url The URL of the file to check
 * @returns The file metadata if it exists, null otherwise
 */
export async function fileExists(url: string) {
  try {
    return await head(url);
  } catch (error) {
    return null;
  }
}

/**
 * Generate a unique filename with a timestamp
 * @param originalFilename The original filename
 * @returns The unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const extension = originalFilename.split('.').pop();
  const baseName = originalFilename.split('.').slice(0, -1).join('.');
  
  return `${baseName}-${timestamp}.${extension}`;
}

/**
 * Get the file type from a filename
 * @param filename The filename
 * @returns The file type
 */
export function getFileType(filename: string): 'image' | 'document' | 'video' | 'audio' | 'other' {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension as string)) {
    return 'image';
  }
  
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(extension as string)) {
    return 'document';
  }
  
  if (['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(extension as string)) {
    return 'video';
  }
  
  if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension as string)) {
    return 'audio';
  }
  
  return 'other';
}