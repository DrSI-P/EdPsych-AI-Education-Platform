/**
 * Gateway Manager
 * Manages API gateway configuration and connections
 */

import { prisma } from '@/lib/prisma';

export interface ExternalSystem {
  id: string;
  name: string;
  type: 'LMS' | 'RESEARCH' | 'ASSESSMENT' | 'CONTENT' | 'OTHER';
  baseUrl: string;
  apiKey?: string;
  authType: 'API_KEY' | 'OAUTH' | 'BASIC' | 'NONE';
  credentials?: Record<string, string>;
  isActive: boolean;
}

export interface ApiEndpoint {
  id: string;
  systemId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: Record<string, string>;
  responseMapping?: Record<string, string>;
}

export class GatewayManager {
  /**
   * Get all registered external systems
   */
  async getSystems(): Promise<ExternalSystem[]> {
    const systems = await prisma.externalSystem.findMany({
      where: { isActive: true }
    });
    
    return systems.map(system => ({
      id: system.id,
      name: system.name,
      type: system.type as any,
      baseUrl: system.baseUrl,
      apiKey: system.credentials?.apiKey,
      authType: system.authType as any,
      credentials: system.credentials as any,
      isActive: system.isActive
    }));
  }
  
  /**
   * Register a new external system
   */
  async registerSystem(system: Omit<ExternalSystem, 'id'>): Promise<ExternalSystem> {
    const newSystem = await prisma.externalSystem.create({
      data: {
        name: system.name,
        type: system.type,
        baseUrl: system.baseUrl,
        authType: system.authType,
        credentials: system.credentials,
        isActive: system.isActive
      }
    });
    
    return {
      id: newSystem.id,
      name: newSystem.name,
      type: newSystem.type as any,
      baseUrl: newSystem.baseUrl,
      authType: newSystem.authType as any,
      credentials: newSystem.credentials as any,
      isActive: newSystem.isActive
    };
  }
  
  /**
   * Get API endpoints for a system
   */
  async getEndpoints(systemId: string): Promise<ApiEndpoint[]> {
    const endpoints = await prisma.apiEndpoint.findMany({
      where: { systemId }
    });
    
    return endpoints.map(endpoint => ({
      id: endpoint.id,
      systemId: endpoint.systemId,
      path: endpoint.path,
      method: endpoint.method as any,
      description: endpoint.description,
      parameters: endpoint.parameters as any,
      responseMapping: endpoint.responseMapping as any
    }));
  }
}