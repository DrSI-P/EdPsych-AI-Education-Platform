/**
 * Data Protection Module for EdPsych AI Education Platform
 * Implements secure data handling and encryption features
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Encryption algorithm and settings
 */
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Data sensitivity levels
 */
export enum DataSensitivity {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

/**
 * Interface for encrypted data
 */
export interface EncryptedData {
  iv: string;
  encryptedData: string;
  authTag: string;
}

/**
 * Generate a secure encryption key from a password and salt
 * @param password Password to derive key from
 * @param salt Salt for key derivation
 * @returns Derived key
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 * @param data Data to encrypt
 * @param password Password for encryption
 * @returns Encrypted data object
 */
export function encryptData(data: string, password: string): EncryptedData {
  // Generate random salt and IV
  const salt = randomBytes(16);
  const iv = randomBytes(IV_LENGTH);
  
  // Derive key from password and salt
  const key = deriveKey(password, salt);
  
  // Create cipher
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt data
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  
  // Get authentication tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    encryptedData,
    authTag,
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData Encrypted data object
 * @param password Password for decryption
 * @param salt Salt used for key derivation
 * @returns Decrypted data
 */
export function decryptData(
  encryptedData: EncryptedData,
  password: string,
  salt: Buffer
): string {
  // Derive key from password and salt
  const key = deriveKey(password, salt);
  
  // Convert IV and auth tag from hex to Buffer
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const authTag = Buffer.from(encryptedData.authTag, 'hex');
  
  // Create decipher
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  // Decrypt data
  let decryptedData = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  
  return decryptedData;
}

/**
 * Generate a secure random password
 * @param length Password length
 * @returns Random password
 */
export function generateSecurePassword(length = 32): string {
  return randomBytes(length).toString('base64').slice(0, length);
}

/**
 * Store encrypted data in the database
 * @param userId User ID
 * @param dataType Type of data
 * @param data Data to encrypt and store
 * @param sensitivity Data sensitivity level
 * @returns Stored data record
 */
export async function storeEncryptedData(
  userId: string,
  dataType: string,
  data: string,
  sensitivity: DataSensitivity
): Promise<any> {
  // Generate encryption password and salt
  const password = generateSecurePassword();
  const salt = randomBytes(16);
  
  // Encrypt the data
  const encryptedData = encryptData(data, password);
  
  // Store encrypted data and metadata
  const storedData = await prisma.encryptedData.create({
    data: {
      userId,
      dataType,
      iv: encryptedData.iv,
      encryptedData: encryptedData.encryptedData,
      authTag: encryptedData.authTag,
      salt: salt.toString('hex'),
      sensitivity,
      createdAt: new Date(),
    },
  });
  
  // Store the encryption password in a separate secure storage
  // In a production environment, this would use a secure key management service
  await prisma.encryptionKey.create({
    data: {
      dataId: storedData.id,
      key: password,
      createdAt: new Date(),
    },
  });
  
  return {
    id: storedData.id,
    dataType: storedData.dataType,
    sensitivity: storedData.sensitivity,
    createdAt: storedData.createdAt,
  };
}

/**
 * Retrieve and decrypt data from the database
 * @param dataId Data record ID
 * @param userId User ID requesting the data
 * @returns Decrypted data
 */
export async function retrieveDecryptedData(
  dataId: string,
  userId: string
): Promise<string> {
  // Retrieve encrypted data
  const encryptedDataRecord = await prisma.encryptedData.findUnique({
    where: { id: dataId },
  });
  
  if (!encryptedDataRecord) {
    throw new Error('Data not found');
  }
  
  // Check if user has access to this data
  if (encryptedDataRecord.userId !== userId) {
    // Check if user has been granted access
    const accessGrant = await prisma.dataAccessGrant.findFirst({
      where: {
        dataId,
        granteeId: userId,
        active: true,
      },
    });
    
    if (!accessGrant) {
      throw new Error('Access denied');
    }
  }
  
  // Log access for audit purposes
  await prisma.dataAccessLog.create({
    data: {
      dataId,
      userId,
      accessedAt: new Date(),
      purpose: 'user_request',
    },
  });
  
  // Retrieve encryption key
  const encryptionKey = await prisma.encryptionKey.findFirst({
    where: { dataId },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!encryptionKey) {
    throw new Error('Encryption key not found');
  }
  
  // Decrypt the data
  const encryptedData: EncryptedData = {
    iv: encryptedDataRecord.iv,
    encryptedData: encryptedDataRecord.encryptedData,
    authTag: encryptedDataRecord.authTag,
  };
  
  const salt = Buffer.from(encryptedDataRecord.salt, 'hex');
  
  return decryptData(encryptedData, encryptionKey.key, salt);
}

/**
 * Grant access to data for another user
 * @param dataId Data record ID
 * @param ownerId Owner user ID
 * @param granteeId User ID to grant access to
 * @param expiresAt Optional expiration date
 * @returns Access grant record
 */
export async function grantDataAccess(
  dataId: string,
  ownerId: string,
  granteeId: string,
  expiresAt?: Date
): Promise<any> {
  // Check if user owns the data
  const dataRecord = await prisma.encryptedData.findUnique({
    where: { id: dataId },
  });
  
  if (!dataRecord) {
    throw new Error('Data not found');
  }
  
  if (dataRecord.userId !== ownerId) {
    throw new Error('Only the data owner can grant access');
  }
  
  // Create access grant
  const accessGrant = await prisma.dataAccessGrant.create({
    data: {
      dataId,
      grantorId: ownerId,
      granteeId,
      grantedAt: new Date(),
      expiresAt,
      active: true,
    },
  });
  
  return {
    id: accessGrant.id,
    dataId: accessGrant.dataId,
    granteeId: accessGrant.granteeId,
    grantedAt: accessGrant.grantedAt,
    expiresAt: accessGrant.expiresAt,
  };
}

/**
 * Revoke access to data
 * @param grantId Access grant ID
 * @param userId User ID revoking access
 * @returns Success status
 */
export async function revokeDataAccess(
  grantId: string,
  userId: string
): Promise<{ success: boolean }> {
  // Retrieve access grant
  const accessGrant = await prisma.dataAccessGrant.findUnique({
    where: { id: grantId },
    include: {
      data: true,
    },
  });
  
  if (!accessGrant) {
    throw new Error('Access grant not found');
  }
  
  // Check if user has permission to revoke
  if (accessGrant.grantorId !== userId && accessGrant.data.userId !== userId) {
    throw new Error('Only the grantor or data owner can revoke access');
  }
  
  // Revoke access
  await prisma.dataAccessGrant.update({
    where: { id: grantId },
    data: {
      active: false,
      revokedAt: new Date(),
      revokedById: userId,
    },
  });
  
  return { success: true };
}

/**
 * Anonymize sensitive data for analytics
 * @param data Data to anonymize
 * @param sensitiveFields Fields to anonymize
 * @returns Anonymized data
 */
export function anonymizeData(
  data: Record<string, any>,
  sensitiveFields: string[]
): Record<string, any> {
  const anonymizedData = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in anonymizedData) {
      const fieldValue = anonymizedData[field];
      
      if (typeof fieldValue === 'string') {
        // Hash string values
        const hash = require('crypto')
          .createHash('sha256')
          .update(fieldValue)
          .digest('hex');
        anonymizedData[field] = hash.substring(0, 8); // Use first 8 chars of hash
      } else if (typeof fieldValue === 'number') {
        // Round numbers to reduce precision
        anonymizedData[field] = Math.round(fieldValue / 10) * 10;
      } else if (fieldValue instanceof Date) {
        // Reduce date precision to month
        const date = new Date(fieldValue);
        date.setDate(1); // First day of month
        anonymizedData[field] = date;
      } else {
        // Remove other types
        delete anonymizedData[field];
      }
    }
  }
  
  return anonymizedData;
}

/**
 * Schema for data access request
 */
const dataAccessRequestSchema = z.object({
  dataId: z.string(),
});

/**
 * Schema for data access grant request
 */
const dataAccessGrantSchema = z.object({
  dataId: z.string(),
  granteeId: z.string(),
  expiresAt: z.string().optional(),
});

/**
 * API route handler for data access
 * @param req Request object
 * @returns API response
 */
export async function handleDataAccess(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    
    // Validate request
    const validatedData = dataAccessRequestSchema.parse(body);
    
    // Retrieve data
    const data = await retrieveDecryptedData(validatedData.dataId, userId);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error accessing data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to access data' },
      { status: 500 }
    );
  }
}

/**
 * API route handler for granting data access
 * @param req Request object
 * @returns API response
 */
export async function handleGrantDataAccess(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    
    // Validate request
    const validatedData = dataAccessGrantSchema.parse(body);
    
    // Parse expiration date if provided
    let expiresAt: Date | undefined;
    if (validatedData.expiresAt) {
      expiresAt = new Date(validatedData.expiresAt);
    }
    
    // Grant access
    const result = await grantDataAccess(
      validatedData.dataId,
      userId,
      validatedData.granteeId,
      expiresAt
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error granting data access:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to grant data access' },
      { status: 500 }
    );
  }
}
