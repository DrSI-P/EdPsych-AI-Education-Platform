import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for consent submission
const consentSchema = z.object({
  token: z.string().min(1, 'Consent token is required'),
  consent: z.boolean(),
  parentName: z.string().min(2, 'Parent name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
});

// GET - Verify consent token and get student info
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    const consentRecord = await prisma.parentalConsent.findUnique({
      where: { token },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
          },
        },
      },
    });
    
    if (!consentRecord) {
      return NextResponse.json({ error: 'Invalid or expired consent token' }, { status: 404 });
    }
    
    // Check if expired
    if (new Date() > consentRecord.expiresAt) {
      await prisma.parentalConsent.update({
        where: { id: consentRecord.id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ error: 'Consent token has expired' }, { status: 410 });
    }
    
    // Check if already processed
    if (consentRecord.status !== 'PENDING') {
      return NextResponse.json({ 
        error: `Consent has already been ${consentRecord.status.toLowerCase()}` 
      }, { status: 409 });
    }
    
    // Calculate student age
    const dob = consentRecord.student.dateOfBirth;
    const age = dob ? Math.floor((new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
    
    return NextResponse.json({
      student: {
        name: consentRecord.student.name,
        email: consentRecord.student.email,
        age,
      },
      parentEmail: consentRecord.parentEmail,
      expiresAt: consentRecord.expiresAt,
    });
  } catch (error) {
    console.error('Error verifying consent token:', error);
    return NextResponse.json({ 
      error: 'Failed to verify consent token' 
    }, { status: 500 });
  }
}

// POST - Submit parental consent decision
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = consentSchema.parse(body);
    
    // Get consent record
    const consentRecord = await prisma.parentalConsent.findUnique({
      where: { token: validatedData.token },
      include: {
        student: true,
      },
    });
    
    if (!consentRecord) {
      return NextResponse.json({ error: 'Invalid consent token' }, { status: 404 });
    }
    
    // Check if expired
    if (new Date() > consentRecord.expiresAt) {
      return NextResponse.json({ error: 'Consent token has expired' }, { status: 410 });
    }
    
    // Check if already processed
    if (consentRecord.status !== 'PENDING') {
      return NextResponse.json({ 
        error: `Consent has already been ${consentRecord.status.toLowerCase()}` 
      }, { status: 409 });
    }
    
    // Process consent in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update consent record
      const updatedConsent = await tx.parentalConsent.update({
        where: { id: consentRecord.id },
        data: {
          status: validatedData.consent ? 'APPROVED' : 'REJECTED',
          consentedAt: new Date(),
        },
      });
      
      // If approved, activate student account
      if (validatedData.consent) {
        await tx.user.update({
          where: { id: consentRecord.studentId },
          data: {
            isActive: true,
            ageVerified: true,
          },
        });
        
        // Create parent profile note
        await tx.parentalConsentLog.create({
          data: {
            studentId: consentRecord.studentId,
            parentEmail: consentRecord.parentEmail,
            parentName: validatedData.parentName,
            relationship: validatedData.relationship,
            action: 'CONSENT_GRANTED',
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown',
          },
        });
        
        // Send welcome notification to student
        await tx.notification.create({
          data: {
            userId: consentRecord.studentId,
            type: 'ACCOUNT_ACTIVATED',
            title: 'Your account is now active!',
            message: 'Your parent or guardian has given consent. You can now access all features.',
            priority: 'HIGH' as any,
          },
        });
      } else {
        // If rejected, log the rejection
        await tx.parentalConsentLog.create({
          data: {
            studentId: consentRecord.studentId,
            parentEmail: consentRecord.parentEmail,
            parentName: validatedData.parentName,
            relationship: validatedData.relationship,
            action: 'CONSENT_REJECTED',
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown',
          },
        });
      }
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: consentRecord.studentId,
          action: validatedData.consent ? 'PARENTAL_CONSENT_GRANTED' : 'PARENTAL_CONSENT_REJECTED',
          details: {
            parentEmail: consentRecord.parentEmail,
            parentName: validatedData.parentName,
            relationship: validatedData.relationship,
          },
        },
      });
      
      return {
        success: true,
        consent: validatedData.consent,
        student: {
          name: consentRecord.student.name,
          email: consentRecord.student.email,
        },
      };
    });
    
    // Send confirmation emails (in production)
    // if (result.consent) {
    //   await sendConsentApprovedEmail(consentRecord.parentEmail, result.student.name);
    //   await sendAccountActivatedEmail(result.student.email, result.student.name);
    // } else {
    //   await sendConsentRejectedEmail(consentRecord.parentEmail, result.student.name);
    // }
    
    return NextResponse.json({
      success: true,
      message: result.consent 
        ? 'Parental consent granted. The student account has been activated.'
        : 'Parental consent rejected. The student account remains inactive.',
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid input',
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('Error processing parental consent:', error);
    return NextResponse.json({ 
      error: 'Failed to process consent' 
    }, { status: 500 });
  }
}

// PUT - Resend consent email
export async function PUT(req: NextRequest) {
  try {
    const { studentEmail, newParentEmail } = await req.json();
    
    if (!studentEmail) {
      return NextResponse.json({ error: 'Student email is required' }, { status: 400 });
    }
    
    // Find student
    const student = await prisma.user.findUnique({
      where: {
        email: studentEmail,
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        ageVerified: true,
        parentalConsents: {
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    if (student.isActive && student.ageVerified) {
      return NextResponse.json({ 
        error: 'Student account is already active' 
      }, { status: 409 });
    }
    
    const existingConsent = student.parentalConsents[0];
    
    // Create new consent request
    const newConsent = await prisma.parentalConsent.create({
      data: {
        studentId: student.id,
        parentEmail: newParentEmail || existingConsent?.parentEmail || '',
        token: generateConsentToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    
    // Expire old consent if exists
    if (existingConsent) {
      await prisma.parentalConsent.update({
        where: { id: existingConsent.id },
        data: { status: 'EXPIRED' },
      });
    }
    
    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: student.id,
        action: 'PARENTAL_CONSENT_RESENT',
        details: {
          parentEmail: newConsent.parentEmail,
          previousEmail: existingConsent?.parentEmail,
        },
      },
    });
    
    // Send consent email (in production)
    // await sendParentalConsentEmail(newConsent.parentEmail, student.name || 'Student');
    
    return NextResponse.json({
      success: true,
      message: 'Parental consent email has been resent',
      parentEmail: newConsent.parentEmail,
    });
    
  } catch (error) {
    console.error('Error resending consent email:', error);
    return NextResponse.json({ 
      error: 'Failed to resend consent email' 
    }, { status: 500 });
  }
}

function generateConsentToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.random().toString(36).charAt(2)
  ).join('');
}