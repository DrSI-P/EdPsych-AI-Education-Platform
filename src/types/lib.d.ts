/**
 * Type definitions for lib
 * 
 * This file provides type definitions for the lib module
 * used throughout the EdPsych AI Platform.
 */

declare module 'lib' {
  /**
   * Authentication utilities
   */
  export namespace auth {
    export interface User {
      id: string;
      name?: string;
      email: string;
      image?: string;
      role: UserRole;
      createdAt: Date;
      updatedAt: Date;
    }

    export enum UserRole {
      STUDENT = 'student',
      TEACHER = 'teacher',
      ADMIN = 'admin',
      RESEARCHER = 'researcher',
      PARENT = 'parent'
    }

    export interface Session {
      user: User;
      expires: Date;
      accessToken?: string;
    }

    export function getCurrentUser(): Promise<User | null>;
    export function signIn(credentials: { email: string; password: string }): Promise<Session>;
    export function signOut(): Promise<void>;
    export function isAuthenticated(): Promise<boolean>;
  }

  /**
   * Database utilities
   */
  export namespace db {
    export interface Connection {
      connect(): Promise<void>;
      disconnect(): Promise<void>;
      isConnected(): boolean;
    }

    export interface Transaction {
      begin(): Promise<void>;
      commit(): Promise<void>;
      rollback(): Promise<void>;
    }

    export interface QueryResult<T> {
      rows: T[];
      count: number;
    }

    export function getConnection(): Connection;
    export function query<T>(sql: string, params?: any[]): Promise<QueryResult<T>>;
    export function transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T>;
  }

  /**
   * API utilities
   */
  export namespace api {
    export interface ApiResponse<T> {
      data?: T;
      error?: ApiError;
      meta?: Record<string, any>;
    }

    export interface ApiError {
      code: string;
      message: string;
      details?: Record<string, any>;
    }

    export interface RequestOptions {
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
      timeout?: number;
      cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
    }

    export function get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    export function post<T>(url: string, data: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
    export function put<T>(url: string, data: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
    export function del<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  }

  /**
   * AI utilities
   */
  export namespace ai {
    export interface AIModel {
      id: string;
      name: string;
      version: string;
      description: string;
      capabilities: string[];
      parameters: Record<string, any>;
    }

    export interface CompletionRequest {
      prompt: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
      stop?: string[];
      model?: string;
    }

    export interface CompletionResponse {
      id: string;
      text: string;
      usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
      model: string;
      createdAt: Date;
    }

    export interface EmbeddingRequest {
      input: string | string[];
      model?: string;
    }

    export interface EmbeddingResponse {
      id: string;
      embeddings: number[][];
      usage: {
        promptTokens: number;
        totalTokens: number;
      };
      model: string;
      createdAt: Date;
    }

    export function getAvailableModels(): Promise<AIModel[]>;
    export function createCompletion(request: CompletionRequest): Promise<CompletionResponse>;
    export function createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  }

  /**
   * Analytics utilities
   */
  export namespace analytics {
    export interface Event {
      name: string;
      properties?: Record<string, any>;
      userId?: string;
      timestamp?: Date;
    }

    export interface UserProfile {
      userId: string;
      traits?: Record<string, any>;
    }

    export interface AnalyticsOptions {
      batchSize?: number;
      flushInterval?: number;
      disabled?: boolean;
    }

    export function initialize(options?: AnalyticsOptions): void;
    export function trackEvent(event: Event): Promise<void>;
    export function identifyUser(profile: UserProfile): Promise<void>;
    export function flush(): Promise<void>;
  }

  /**
   * Utility functions
   */
  export namespace utils {
    export function formatDate(date: Date, format?: string): string;
    export function parseDate(dateString: string, format?: string): Date;
    export function generateId(length?: number): string;
    export function debounce<T extends (...args: any[]) => any>(
      func: T,
      wait: number
    ): (...args: Parameters<T>) => void;
    export function throttle<T extends (...args: any[]) => any>(
      func: T,
      wait: number
    ): (...args: Parameters<T>) => void;
    export function deepClone<T>(obj: T): T;
    export function deepMerge<T>(...objects: Partial<T>[]): T;
  }

  /**
   * Validation utilities
   */
  export namespace validation {
    export interface ValidationResult {
      valid: boolean;
      errors?: ValidationError[];
    }

    export interface ValidationError {
      field: string;
      message: string;
      code: string;
    }

    export interface ValidationSchema {
      [field: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: any[];
        validate?: (value: unknown) => boolean | string;
      };
    }

    export function validate(data: unknown, schema: ValidationSchema): ValidationResult;
    export function isEmail(value: string): boolean;
    export function isURL(value: string): boolean;
    export function isStrongPassword(value: string): boolean;
  }

  /**
   * Storage utilities
   */
  export namespace storage {
    export interface StorageOptions {
      prefix?: string;
      expiry?: number; // in seconds
    }

    export function setItem(key: string, value: unknown, options?: StorageOptions): void;
    export function getItem<T>(key: string): T | null;
    export function removeItem(key: string): void;
    export function clear(prefix?: string): void;
    export function hasItem(key: string): boolean;
  }

  /**
   * Logger utilities
   */
  export namespace logger {
    export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

    export interface LogOptions {
      level?: LogLevel;
      tags?: string[];
      context?: Record<string, any>;
    }

    export function setLevel(level: LogLevel): void;
    export function debug(message: string, options?: LogOptions): void;
    export function info(message: string, options?: LogOptions): void;
    export function warn(message: string, options?: LogOptions): void;
    export function error(message: string | Error, options?: LogOptions): void;
  }

  /**
   * Configuration utilities
   */
  export namespace config {
    export function get<T>(key: string, defaultValue?: T): T;
    export function set(key: string, value: unknown): void;
    export function load(configObject: Record<string, any>): void;
    export function loadFromEnv(prefix?: string): void;
    export function has(key: string): boolean;
  }

  /**
   * Event utilities
   */
  export namespace events {
    export type EventHandler<T = any> = (data: T) => void | Promise<void>;

    export function on<T = any>(eventName: string, handler: EventHandler<T>): () => void;
    export function off<T = any>(eventName: string, handler: EventHandler<T>): void;
    export function once<T = any>(eventName: string, handler: EventHandler<T>): void;
    export function emit<T = any>(eventName: string, data: T): Promise<void>;
  }
}