// Basic authentication utilities for EdPsych Connect
import { NextAuthOptions } from "next-auth";

// Simple authentication options
export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
};

// Helper function to check if user is authenticated
export function isAuthenticated(session: any) {
  return !!session?.user;
}

// Helper function to check if user has specific role
export function hasRole(session: any, role: string) {
  return session?.user?.role === role;
}

// Helper function to get current user
export function getCurrentUser(session: any) {
  return session?.user || null;
}
