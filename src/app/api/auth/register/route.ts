import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/security/password-utils';
import { z } from 'zod';

// Registration schemas for different user types
const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'SENCO']),
});

const studentSchema = baseSchema.extend({
  role: z.literal('STUDENT'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const age = (new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return age >= 13; // Minimum age 13 for COPPA compliance
  }, 'You must be at least 13 years old to register'),
  parentEmail: z.string().email('Valid parent email required for students under 16').optional(),
  schoolCode: z.string().optional(),
});

const teacherSchema = baseSchema.extend({
  role: z.literal('TEACHER'),
  schoolCode: z.string().min(1, 'School code is required for teachers'),
  subjects: z.array(z.string()).optional(),
});

const parentSchema = baseSchema.extend({
  role: z.literal('PARENT'),
  childEmail: z.string().email('Valid child email required').optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(body.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ 
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors 
      }, { status: 400 });
    }
    
    // Validate based on role
    let validatedData: any;
    try {
      switch (body.role) {
        case 'STUDENT':
          validatedData = studentSchema.parse(body);
          break;
        case 'TEACHER':
        case 'SENCO':
          validatedData = teacherSchema.parse(body);
          break;
        case 'PARENT':
          validatedData = parentSchema.parse(body);
          break;
        default:
          return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: 'Validation failed',
          details: error.errors 
        }, { status: 400 });
      }
      throw error;
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'An account with this email already exists' 
      }, { status: 409 });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Determine age verification status for students
    let ageVerified = true;
    let requiresParentalConsent = false;
    
    if (validatedData.role === 'STUDENT') {
      const dob = new Date(validatedData.dateOfBirth);
      const age = (new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      
      if (age < 16) {
        requiresParentalConsent = true;
        ageVerified = false; // Will be verified after parental consent
      }
    }
    
    // Create user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          password: hashedPassword,
          role: validatedData.role,
          isActive: validatedData.role !== 'STUDENT' || !requiresParentalConsent,
          ageVerified,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        },
      });
      
      // Create role-specific profile
      switch (validatedData.role) {
        case 'STUDENT':
          await tx.studentProfile.create({
            data: {
              userId: user.id,
              schoolId: validatedData.schoolCode || null,
            },
          });
          
          // If requires parental consent, create pending consent record
          if (requiresParentalConsent && validatedData.parentEmail) {
            await tx.parentalConsent.create({
              data: {
                studentId: user.id,
                parentEmail: validatedData.parentEmail,
                status: 'PENDING',
                token: generateConsentToken(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              },
            });
          }
          break;
          
        case 'TEACHER':
        case 'SENCO':
          await tx.teacherProfile.create({
            data: {
              userId: user.id,
              schoolId: validatedData.schoolCode,
              subjects: validatedData.subjects || [],
            },
          });
          break;
          
        case 'PARENT':
          await tx.parentProfile.create({
            data: {
              userId: user.id,
              childrenIds: [],
            },
          });
          break;
      }
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTRATION',
          details: {
            role: user.role,
            requiresParentalConsent,
          },
        },
      });
      
      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          type: 'WELCOME',
          title: 'Welcome to EdPsych Connect!',
          message: getWelcomeMessage(user.role),
          priority: 'NORMAL',
        },
      });
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        requiresParentalConsent,
      };
    });
    
    // Send verification email (in production)
    // await sendVerificationEmail(result.user.email, result.user.name);
    
    // If student requires parental consent, send consent email
    if (requiresParentalConsent && validatedData.parentEmail) {
      // await sendParentalConsentEmail(validatedData.parentEmail, result.user.name);
    }
    
    return NextResponse.json({
      success: true,
      user: result.user,
      requiresParentalConsent: result.requiresParentalConsent,
      message: result.requiresParentalConsent 
        ? 'Registration successful. Parental consent required before account activation.'
        : 'Registration successful. Please check your email to verify your account.',
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Registration failed. Please try again.' 
    }, { status: 500 });
  }
}

function generateConsentToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.random().toString(36).charAt(2)
  ).join('');
}

function getWelcomeMessage(role: string): string {
  switch (role) {
    case 'STUDENT':
      return 'Get ready to explore amazing learning opportunities!';
    case 'TEACHER':
      return 'Welcome! Discover powerful tools to enhance your teaching.';
    case 'PARENT':
      return 'Stay connected with your child\'s educational journey.';
    case 'SENCO':
      return 'Access specialized tools for supporting diverse learners.';
    default:
      return 'Welcome to our educational platform!';
  }
}
