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
   * Find a user by unique criteria
   */
  findUnique: async (params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }) => {
    return prisma.user.findUnique(params);
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

// BlogPost model interface
const blogPost = {
  /**
   * Find a blog post by ID
   */
  findUnique: async (params: {
    where: Prisma.BlogPostWhereUniqueInput;
    include?: Prisma.BlogPostInclude;
  }) => {
    return prisma.blogPost.findUnique(params);
  },

  /**
   * Find many blog posts with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.BlogPostWhereInput;
    orderBy?: Prisma.BlogPostOrderByWithRelationInput;
    include?: Prisma.BlogPostInclude;
  }) => {
    return prisma.blogPost.findMany(params);
  },

  /**
   * Create a new blog post
   */
  create: async (params: {
    data: Prisma.BlogPostCreateInput;
  }) => {
    return prisma.blogPost.create(params);
  },

  /**
   * Update a blog post
   */
  update: async (params: {
    where: Prisma.BlogPostWhereUniqueInput;
    data: Prisma.BlogPostUpdateInput;
  }) => {
    return prisma.blogPost.update(params);
  },

  /**
   * Delete a blog post
   */
  delete: async (params: {
    where: Prisma.BlogPostWhereUniqueInput;
  }) => {
    return prisma.blogPost.delete(params);
  },

  /**
   * Count blog posts
   */
  count: async (params?: {
    where?: Prisma.BlogPostWhereInput;
  }) => {
    return prisma.blogPost.count(params);
  }
};

// UserCredits model interface
const userCredits = {
  /**
   * Find user credits by ID
   */
  findUnique: async (params: {
    where: Prisma.UserCreditsWhereUniqueInput;
  }) => {
    return prisma.userCredits.findUnique(params);
  },

  /**
   * Create or update user credits
   */
  upsert: async (params: {
    where: Prisma.UserCreditsWhereUniqueInput;
    create: Prisma.UserCreditsCreateInput;
    update: Prisma.UserCreditsUpdateInput;
  }) => {
    return prisma.userCredits.upsert(params);
  },

  /**
   * Update user credits
   */
  update: async (params: {
    where: Prisma.UserCreditsWhereUniqueInput;
    data: Prisma.UserCreditsUpdateInput;
  }) => {
    return prisma.userCredits.update(params);
  }
};

// CreditPurchase model interface
const creditPurchase = {
  /**
   * Find a credit purchase by ID
   */
  findUnique: async (params: {
    where: Prisma.CreditPurchaseWhereUniqueInput;
  }) => {
    return prisma.creditPurchase.findUnique(params);
  },

  /**
   * Find many credit purchases with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CreditPurchaseWhereInput;
    orderBy?: Prisma.CreditPurchaseOrderByWithRelationInput;
  }) => {
    return prisma.creditPurchase.findMany(params);
  },

  /**
   * Create a new credit purchase
   */
  create: async (params: {
    data: Prisma.CreditPurchaseCreateInput;
  }) => {
    return prisma.creditPurchase.create(params);
  }
};


// UserVideos model interface
const userVideos = {
  /**
   * Find user videos by ID
   */
  findUnique: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
  }) => {
    return prisma.userVideos.findUnique(params);
  },

  /**
   * Find many user videos with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserVideosWhereInput;
    orderBy?: Prisma.UserVideosOrderByWithRelationInput;
    include?: Prisma.UserVideosInclude;
  }) => {
    return prisma.userVideos.findMany(params);
  },

  /**
   * Create a new user video
   */
  create: async (params: {
    data: Prisma.UserVideosCreateInput;
  }) => {
    return prisma.userVideos.create(params);
  },

  /**
   * Update user videos
   */
  update: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
    data: Prisma.UserVideosUpdateInput;
  }) => {
    return prisma.userVideos.update(params);
  },

  /**
   * Delete user videos
   */
  delete: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
  }) => {
    return prisma.userVideos.delete(params);
  }
};


// ActivityLogs model interface
const activityLogs = {
  /**
   * Find activity logs by ID
   */
  findUnique: async (params: {
    where: Prisma.ActivityLogWhereUniqueInput;
  }) => {
    return prisma.activityLog.findUnique(params);
  },

  /**
   * Find many activity logs with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput;
  }) => {
    return prisma.activityLog.findMany(params);
  },

  /**
   * Create a new activity log
   */
  create: async (params: {
    data: Prisma.ActivityLogCreateInput;
  }) => {
    return prisma.activityLog.create(params);
  }
};

// Export the database interface
const db = {
  userVideos,
  activityLogs,
  user,
  circleTemplate,
  reflectionPrompt,
  mindfulnessSettings,
  mindfulnessLog,
  blogPost,
  userCredits,
  creditPurchase,
  // Expose the raw prisma client for direct access when needed
  prisma
};

export default db;
