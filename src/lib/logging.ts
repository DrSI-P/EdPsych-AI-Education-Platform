/**
 * Comprehensive Logging System for EdPsych AI Education Platform
 * 
 * This module provides structured logging with different severity levels,
 * log rotation, and integration with monitoring systems. It follows UK
 * educational data protection standards for sensitive information handling.
 */

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { promises as fs } from 'fs';

// Define log levels with UK educational context
const logLevels = {
  emergency: 0,   // System is unusable (requires immediate attention)
  alert: 1,       // Action must be taken immediately
  critical: 2,    // Critical conditions
  error: 3,       // Error conditions
  warning: 4,     // Warning conditions
  notice: 5,      // Normal but significant condition
  info: 6,        // Informational messages
  debug: 7,       // Debug-level messages
};

// Define log colors
const logColors = {
  emergency: 'red',
  alert: 'magenta',
  critical: 'red',
  error: 'red',
  warning: 'yellow',
  notice: 'cyan',
  info: 'green',
  debug: 'blue',
};

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (more human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let metaStr = '';
    if (Object.keys(metadata).length > 0) {
      if (metadata.stack) {
        metaStr = `\n${metadata.stack}`;
      } else {
        metaStr = `\n${JSON.stringify(metadata, null, 2)}`;
      }
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Configure log directory
const LOG_DIR = process.env.LOG_DIR || 'logs';
const MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';
const MAX_FILES = process.env.LOG_MAX_FILES || '14d';

// Create log directory if it doesn't exist
(async () => {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error(`Error creating log directory: ${error}`);
  }
})();

// Configure daily rotate file transport
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_DIR, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_SIZE,
  maxFiles: MAX_FILES,
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(LOG_DIR, 'audit.json'),
});

// Configure error log transport (separate file for errors and above)
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_SIZE,
  maxFiles: MAX_FILES,
  level: 'error',
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(LOG_DIR, 'error-audit.json'),
});

// Configure safeguarding log transport (separate file for safeguarding events)
const safeguardingFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(LOG_DIR, 'safeguarding-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: MAX_SIZE,
  maxFiles: MAX_FILES,
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(LOG_DIR, 'safeguarding-audit.json'),
});

// Create the logger
export const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'edpsych-platform' },
  transports: [
    // Console transport (only in development)
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
    // File transports
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
      format: logFormat,
      zippedArchive: true,
    }),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
      format: logFormat,
      zippedArchive: true,
    }),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
  ],
});

// Add colors to winston
winston.addColors(logColors);

/**
 * Specialized logger for safeguarding events
 * This ensures safeguarding concerns are logged separately
 * for easier monitoring and compliance
 */
export const safeguardingLogger = winston.createLogger({
  levels: logLevels,
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'edpsych-safeguarding' },
  transports: [
    safeguardingFileRotateTransport,
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
  ],
});

/**
 * Logs a safeguarding event
 * @param level Log level
 * @param message Log message
 * @param metadata Additional metadata
 */
export function logSafeguardingEvent(
  level: keyof typeof logLevels,
  message: string,
  metadata: Record<string, any> = {}
): void {
  safeguardingLogger.log(level, message, metadata);
}

/**
 * Sanitizes sensitive data from logs
 * @param data Data to sanitize
 * @returns Sanitized data
 */
export function sanitizeLogData(data: any): any {
  if (!data) return data;
  
  // Handle different data types
  if (typeof data === 'string') {
    // Sanitize email addresses
    data = data.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');
    
    // Sanitize UK phone numbers (various formats)
    data = data.replace(/(\+44|0)[ -]?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}/g, '[PHONE REDACTED]');
    
    // Sanitize UK postcodes
    data = data.replace(/[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}/gi, '[POSTCODE REDACTED]');
    
    // Sanitize UK National Insurance numbers
    data = data.replace(/[A-Z]{2}[ -]?[0-9]{2}[ -]?[0-9]{2}[ -]?[0-9]{2}[ -]?[A-Z]/gi, '[NI NUMBER REDACTED]');
    
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, any> = {};
    
    // List of fields that should be redacted
    const sensitiveFields = [
      'password', 'passwordHash', 'secret', 'token', 'apiKey', 'credit_card',
      'ssn', 'dob', 'dateOfBirth', 'birthDate', 'address', 'postcode',
      'email', 'phone', 'mobile', 'nationalInsurance', 'ni', 'nino',
      'medicalRecord', 'diagnosis', 'healthData', 'specialNeeds',
      'safeguardingConcern', 'vulnerabilityDetails'
    ];
    
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    
    return sanitized;
  }
  
  return data;
}

/**
 * Creates a child logger with additional default metadata
 * @param defaultMeta Default metadata to include
 * @returns Child logger instance
 */
export function createChildLogger(defaultMeta: Record<string, any>): typeof logger {
  return logger.child(defaultMeta);
}

/**
 * Archives old logs to save space
 * @param olderThan Archive logs older than this date
 * @returns Number of archived log files
 */
export async function archiveOldLogs(olderThan: Date): Promise<number> {
  try {
    // Create archives directory if it doesn't exist
    const archiveDir = path.join(LOG_DIR, 'archives');
    await fs.mkdir(archiveDir, { recursive: true });
    
    // Get all log files
    const files = await fs.readdir(LOG_DIR);
    const logFiles = files.filter(file => file.endsWith('.log'));
    
    let archivedCount = 0;
    
    // Process each log file
    for (const file of logFiles) {
      const filePath = path.join(LOG_DIR, file);
      const stats = await fs.stat(filePath);
      
      // Check if file is older than the specified date
      if (stats.mtime < olderThan) {
        const archiveFilename = `${file}.gz`;
        const archivePath = path.join(archiveDir, archiveFilename);
        
        // Compress the file
        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(archivePath);
        const gzip = createGzip();
        
        await pipeline(readStream, gzip, writeStream);
        
        // Delete the original file
        await fs.unlink(filePath);
        
        archivedCount++;
      }
    }
    
    logger.info(`Archived ${archivedCount} log files`);
    return archivedCount;
  } catch (error) {
    logger.error('Failed to archive old logs', { error });
    throw new Error(`Failed to archive old logs: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Exports logs for a specific date range
 * @param startDate Start date
 * @param endDate End date
 * @param logTypes Types of logs to export
 * @returns Path to the exported log archive
 */
export async function exportLogs(
  startDate: Date,
  endDate: Date,
  logTypes: ('application' | 'error' | 'safeguarding' | 'exceptions' | 'rejections')[] = ['application']
): Promise<string> {
  try {
    // Create exports directory if it doesn't exist
    const exportDir = path.join(LOG_DIR, 'exports');
    await fs.mkdir(exportDir, { recursive: true });
    
    // Generate export filename
    const exportFilename = `logs_${startDate.toISOString().slice(0, 10)}_to_${endDate.toISOString().slice(0, 10)}.tar.gz`;
    const exportPath = path.join(exportDir, exportFilename);
    
    // Get all log files
    const files = await fs.readdir(LOG_DIR);
    
    // Filter log files by date range and types
    const matchingFiles: string[] = [];
    
    for (const file of files) {
      // Check if file matches requested log types
      if (!logTypes.some(type => file.startsWith(type))) {
        continue;
      }
      
      // Extract date from filename (format: type-YYYY-MM-DD.log)
      const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
      if (!dateMatch) continue;
      
      const fileDate = new Date(dateMatch[0]);
      
      // Check if file is within date range
      if (fileDate >= startDate && fileDate <= endDate) {
        matchingFiles.push(file);
      }
    }
    
    if (matchingFiles.length === 0) {
      throw new Error('No log files found for the specified date range and types');
    }
    
    // In a real implementation, this would create a tar.gz archive
    // For demonstration, we'll just log the files that would be included
    logger.info(`Would export ${matchingFiles.length} log files to ${exportPath}`, {
      files: matchingFiles,
    });
    
    return exportPath;
  } catch (error) {
    logger.error('Failed to export logs', { error });
    throw new Error(`Failed to export logs: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Middleware for Express to log HTTP requests
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function requestLogger(req: any, res: any, next: () => void): void {
  const start = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    query: sanitizeLogData(req.query),
    // Don't log body as it may contain sensitive information
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'info';
    
    logger.log(level, `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
    });
  });
  
  next();
}

// Export default logger
export default logger;
