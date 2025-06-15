import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/security/password-utils';

// Define user roles as constants
const UserRole = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  SENCO: 'SENCO',
  ADMIN: 'ADMIN',
  PARENT: 'PARENT',
  DSL: 'DSL'
} as const;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        
        // Check if user is active
        if (!user?.isActive) {
          throw new Error('Account deactivated');
        }
        
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }
        
        const isValidPassword = await verifyPassword(credentials.password, user.password);
        
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }
        
        // Check if student needs age verification
        if (user.role === UserRole.STUDENT && !user.ageVerified) {
          throw new Error('Age verification required');
        }
        
        return {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: user.role,
          image: user.image || null,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes for students, will be adjusted in callbacks
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        
        // Set different session duration based on role
        if (user.role === UserRole.STUDENT) {
          token.maxAge = 30 * 60; // 30 minutes
        } else if (user.role === UserRole.PARENT) {
          token.maxAge = 2 * 60 * 60; // 2 hours
        } else {
          token.maxAge = 8 * 60 * 60; // 8 hours for teachers/admin
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Log sign-in attempts for audit
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'SIGN_IN',
            details: {
              provider: account?.provider || 'credentials',
              timestamp: new Date().toISOString(),
            },
          }
        });
      } catch (error) {
        console.error('Failed to log sign-in:', error);
      }
      
      return true;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async signOut({ token }) {
      // Log sign-out for audit
      if (token?.id) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: token.id as string,
              action: 'SIGN_OUT',
              details: {
                timestamp: new Date().toISOString(),
              },
            }
          });
        } catch (error) {
          console.error('Failed to log sign-out:', error);
        }
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };