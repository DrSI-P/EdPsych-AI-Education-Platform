'use client';

import prisma from './prisma';

// Export prisma client directly for API routes
export { prisma };

// Database utility functions
export const db = {
  // User operations
  user: {
    findById: async (id: string) => {
      return prisma.user.findUnique({
        where: { id }
      });
    },
    findByEmail: async (email: string) => {
      return prisma.user.findUnique({
        where: { email }
      });
    },
    create: async (data: any) => {
      return prisma.user.create({
        data
      });
    },
    update: async (id: string, data: any) => {
      return prisma.user.update({
        where: { id },
        data
      });
    }
  },
  
  // Resource operations
  resource: {
    findById: async (id: string) => {
      return prisma.resource.findUnique({
        where: { id }
      });
    },
    findMany: async (filters: any = {}) => {
      return prisma.resource.findMany({
        where: filters
      });
    },
    create: async (data: any) => {
      return prisma.resource.create({
        data
      });
    },
    update: async (id: string, data: any) => {
      return prisma.resource.update({
        where: { id },
        data
      });
    }
  },
  
  // Generic query function
  query: async (model: string, operation: string, params: any = {}) => {
    if (!prisma[model]) {
      throw new Error(`Model ${model} not found`);
    }
    
    if (!prisma[model][operation]) {
      throw new Error(`Operation ${operation} not found on model ${model}`);
    }
    
    return prisma[model][operation](params);
  }
};

export default db;
