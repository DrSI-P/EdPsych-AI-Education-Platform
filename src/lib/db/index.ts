/**
 * Database Interface Layer
 * 
 * This module provides a unified interface for database operations,
 * abstracting the underlying Prisma client implementation.
 * 
 * It serves as a compatibility layer for code that expects methods like
 * findByEmail, findById, etc., while using the Prisma client underneath.
 */

import prisma from '../prisma';
import { User, Prisma } from '@prisma/client';

// Export prisma for backward compatibility
export { prisma };

// User model interface
const user = {
  /**
   * Find a user by email
   */
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Find a user by ID
   */
  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  /**
   * Create a new user
   */
  create: async (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
      data
    });
  },

  /**
   * Update a user
   */
  update: async (id: string, data: Partial<Prisma.UserUpdateInput>) => {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  /**
   * Delete a user
   */
  delete: async (id: string) => {
    return prisma.user.delete({
      where: { id }
    });
  },

  /**
   * Find many users with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) => {
    return prisma.user.findMany(params);
  }
};

// CircleTemplate model interface
const circleTemplate = {
  /**
   * Find a circle template by ID
   */
  findUnique: async (params: {
    where: Prisma.CircleTemplateWhereUniqueInput;
  }) => {
    return prisma.circleTemplate.findUnique(params);
  },

  /**
   * Find many circle templates with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CircleTemplateWhereInput;
    orderBy?: Prisma.CircleTemplateOrderByWithRelationInput;
  }) => {
    return prisma.circleTemplate.findMany(params);
  },

  /**
   * Create a new circle template
   */
  create: async (params: {
    data: Prisma.CircleTemplateCreateInput;
  }) => {
    return prisma.circleTemplate.create(params);
  },

  /**
   * Update a circle template
   */
  update: async (params: {
    where: Prisma.CircleTemplateWhereUniqueInput;
    data: Prisma.CircleTemplateUpdateInput;
  }) => {
    return prisma.circleTemplate.update(params);
  },

  /**
   * Delete a circle template
   */
  delete: async (params: {
    where: Prisma.CircleTemplateWhereUniqueInput;
  }) => {
    return prisma.circleTemplate.delete(params);
  }
};

// ReflectionPrompt model interface
const reflectionPrompt = {
  /**
   * Find a reflection prompt by ID
   */
  findUnique: async (params: {
    where: Prisma.ReflectionPromptWhereUniqueInput;
  }) => {
    return prisma.reflectionPrompt.findUnique(params);
  },

  /**
   * Find many reflection prompts with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ReflectionPromptWhereInput;
    orderBy?: Prisma.ReflectionPromptOrderByWithRelationInput;
  }) => {
    return prisma.reflectionPrompt.findMany(params);
  },

  /**
   * Create a new reflection prompt
   */
  create: async (params: {
    data: Prisma.ReflectionPromptCreateInput;
  }) => {
    return prisma.reflectionPrompt.create(params);
  },

  /**
   * Update a reflection prompt
   */
  update: async (params: {
    where: Prisma.ReflectionPromptWhereUniqueInput;
    data: Prisma.ReflectionPromptUpdateInput;
  }) => {
    return prisma.reflectionPrompt.update(params);
  },

  /**
   * Delete a reflection prompt
   */
  delete: async (params: {
    where: Prisma.ReflectionPromptWhereUniqueInput;
  }) => {
    return prisma.reflectionPrompt.delete(params);
  }
};

// MindfulnessSettings model interface
const mindfulnessSettings = {
  /**
   * Find mindfulness settings by ID
   */
  findUnique: async (params: {
    where: Prisma.MindfulnessSettingsWhereUniqueInput;
  }) => {
    return prisma.mindfulnessSettings.findUnique(params);
  },

  /**
   * Find many mindfulness settings with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.MindfulnessSettingsWhereInput;
    orderBy?: Prisma.MindfulnessSettingsOrderByWithRelationInput;
  }) => {
    return prisma.mindfulnessSettings.findMany(params);
  },

  /**
   * Create or update mindfulness settings
   */
  upsert: async (params: {
    where: Prisma.MindfulnessSettingsWhereUniqueInput;
    create: Prisma.MindfulnessSettingsCreateInput;
    update: Prisma.MindfulnessSettingsUpdateInput;
  }) => {
    return prisma.mindfulnessSettings.upsert(params);
  },

  /**
   * Update mindfulness settings
   */
  update: async (params: {
    where: Prisma.MindfulnessSettingsWhereUniqueInput;
    data: Prisma.MindfulnessSettingsUpdateInput;
  }) => {
    return prisma.mindfulnessSettings.update(params);
  }
};

// MindfulnessLog model interface
const mindfulnessLog = {
  /**
   * Find a mindfulness log by ID
   */
  findUnique: async (params: {
    where: Prisma.MindfulnessLogWhereUniqueInput;
  }) => {
    return prisma.mindfulnessLog.findUnique(params);
  },

  /**
   * Find many mindfulness logs with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.MindfulnessLogWhereInput;
    orderBy?: Prisma.MindfulnessLogOrderByWithRelationInput;
  }) => {
    return prisma.mindfulnessLog.findMany(params);
  },

  /**
   * Create a new mindfulness log
   */
  create: async (params: {
    data: Prisma.MindfulnessLogCreateInput;
  }) => {
    return prisma.mindfulnessLog.create(params);
  }
};

// Export the database interface
const db = {
  user,
  circleTemplate,
  reflectionPrompt,
  mindfulnessSettings,
  mindfulnessLog,
  // Expose the raw prisma client for direct access when needed
  prisma
};

export default db;
