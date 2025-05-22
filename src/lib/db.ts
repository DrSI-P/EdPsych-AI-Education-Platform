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
  
  // Circle Template operations
  circleTemplate: {
    findMany: async (params: any = {}) => {
      return prisma.circleTemplate.findMany(params);
    },
    findUnique: async (params: any = {}) => {
      return prisma.circleTemplate.findUnique(params);
    },
    create: async (params: any = {}) => {
      return prisma.circleTemplate.create(params);
    },
    update: async (params: any = {}) => {
      return prisma.circleTemplate.update(params);
    },
    delete: async (params: any = {}) => {
      return prisma.circleTemplate.delete(params);
    }
  },
  
  // Reflection Prompt operations
  reflectionPrompt: {
    findMany: async (params: any = {}) => {
      return prisma.reflectionPrompt.findMany(params);
    },
    findUnique: async (params: any = {}) => {
      return prisma.reflectionPrompt.findUnique(params);
    },
    create: async (params: any = {}) => {
      return prisma.reflectionPrompt.create(params);
    },
    update: async (params: any = {}) => {
      return prisma.reflectionPrompt.update(params);
    },
    delete: async (params: any = {}) => {
      return prisma.reflectionPrompt.delete(params);
    }
  },
  
  // Restorative Training Module operations
  restorativeTrainingModule: {
    findMany: async (params: any = {}) => {
      return prisma.restorativeTrainingModule.findMany(params);
    },
    findUnique: async (params: any = {}) => {
      return prisma.restorativeTrainingModule.findUnique(params);
    },
    create: async (params: any = {}) => {
      return prisma.restorativeTrainingModule.create(params);
    },
    update: async (params: any = {}) => {
      return prisma.restorativeTrainingModule.update(params);
    },
    delete: async (params: any = {}) => {
      return prisma.restorativeTrainingModule.delete(params);
    }
  },
  
  // Restorative Training Progress operations
  restorativeTrainingProgress: {
    findMany: async (params: any = {}) => {
      return prisma.restorativeTrainingProgress.findMany(params);
    },
    findFirst: async (params: any = {}) => {
      return prisma.restorativeTrainingProgress.findFirst(params);
    },
    create: async (params: any = {}) => {
      return prisma.restorativeTrainingProgress.create(params);
    },
    update: async (params: any = {}) => {
      return prisma.restorativeTrainingProgress.update(params);
    }
  },
  
  // Restorative Training Quiz Attempt operations
  restorativeTrainingQuizAttempt: {
    create: async (params: any = {}) => {
      return prisma.restorativeTrainingQuizAttempt.create(params);
    }
  },
  
  // Mindfulness Settings operations
  mindfulnessSettings: {
    findUnique: async (params: any = {}) => {
      return prisma.mindfulnessSettings.findUnique(params);
    },
    upsert: async (params: any = {}) => {
      return prisma.mindfulnessSettings.upsert(params);
    }
  },
  
  // Mindfulness Log operations
  mindfulnessLog: {
    findMany: async (params: any = {}) => {
      return prisma.mindfulnessLog.findMany(params);
    },
    create: async (params: any = {}) => {
      return prisma.mindfulnessLog.create(params);
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
