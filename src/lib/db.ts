'use client';

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;


// Simple in-memory database for development
export const db = {
  users: [],
  sessions: [],
  
  // User methods
  async getUser(id) {
    return this.users.find(user => user.id === id);
  },
  
  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  },
  
  async createUser(userData) {
    const newUser = { id: Date.now().toString(), ...userData };
    this.users.push(newUser);
    return newUser;
  },
  
  async updateUser(id, userData) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    }
    return null;
  },
  
  async deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  },
  
  // Session methods
  async createSession(sessionData) {
    const newSession = { id: Date.now().toString(), ...sessionData };
    this.sessions.push(newSession);
    return newSession;
  },
  
  async getSession(id) {
    return this.sessions.find(session => session.id === id);
  },
  
  async deleteSession(id) {
    const index = this.sessions.findIndex(session => session.id === id);
    if (index !== -1) {
      const deletedSession = this.sessions[index];
      this.sessions.splice(index, 1);
      return deletedSession;
    }
    return null;
  }
};

export default db;
