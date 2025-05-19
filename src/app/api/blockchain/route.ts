import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for credential verification
const VerificationSchema = z.object({
  credentialId: z.string().optional(),
  transactionId: z.string().optional(),
  verificationCode: z.string().optional(),
  type: z.enum(["credential", "copyright"]),
  network: z.enum(["ethereum", "polygon"]).optional()
});

// Schema for credential issuance
const CredentialIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  recipientId: z.string(),
  recipientName: z.string(),
  issuerName: z.string(),
  type: z.enum(["Certificate", "Badge", "Qualification"]),
  skills: z.array(z.string()),
  expiryDate: z.string().optional(),
  cpdPoints: z.number().optional(),
  cpdCategory: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Schema for copyright registration
const CopyrightRegistrationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  creatorId: z.string(),
  creatorName: z.string(),
  type: z.string(),
  tags: z.array(z.string()),
  license: z.string(),
  contentHash: z.string(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Mock blockchain interaction function
const mockBlockchainInteraction = async (action: string, data: Record<string, any>) => {
  // Simulate blockchain delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock transaction ID
  const transactionId = `0x${Math.random().toString(16).substr(2, 40)}`;
  
  return {
    success: true,
    transactionId,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    timestamp: new Date().toISOString(),
    network: data.network || 'polygon',
    data: {
      ...data,
      verified: true
    }
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'credential';
    const transactionId = searchParams.get('transactionId');
    const verificationCode = searchParams.get('code');
    
    // If no identifiers provided, return error
    if (!id && !transactionId && !verificationCode) {
      return NextResponse.json({ error: 'No identifier provided for verification' }, { status: 400 });
    }
    
    // Mock verification response
    const verificationResult = await mockBlockchainInteraction('verify', {
      id: id || 'unknown',
      type,
      transactionId,
      verificationCode
    });
    
    return NextResponse.json({
      verified: true,
      verificationData: {
        id: id || 'cred-001',
        title: type === 'credential' ? 'Advanced Differentiation Strategies' : 'Inclusive Classroom Strategies Guide',
        issuer: type === 'credential' ? 'EdPsych Professional Development' : null,
        creator: type === 'copyright' ? 'Jane Smith' : null,
        recipient: type === 'credential' ? 'Jane Smith' : null,
        issueDate: '2025-03-15T00:00:00Z',
        expiryDate: type === 'credential' ? '2028-03-15T00:00:00Z' : null,
        registrationDate: type === 'copyright' ? '2025-02-12T00:00:00Z' : null,
        type: type === 'credential' ? 'Certificate' : 'Document',
        skills: type === 'credential' ? ['Differentiated Instruction', 'Inclusive Education', 'Assessment Design'] : null,
        tags: type === 'copyright' ? ['Inclusion', 'Classroom Management', 'Differentiation', 'Accessibility'] : null,
        description: type === 'credential' 
          ? 'Awarded for completing 30 hours of professional development in advanced differentiation strategies for inclusive classrooms.'
          : 'A comprehensive guide to creating inclusive classroom environments for students with diverse needs.',
        license: type === 'copyright' ? 'Creative Commons BY-NC-SA' : null,
        blockchainData: {
          transactionId: transactionId || verificationResult.transactionId,
          blockNumber: verificationResult.blockNumber,
          timestamp: verificationResult.timestamp,
          network: verificationResult.network
        }
      }
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a verification request
    if (body.isVerification) {
      try {
        const validatedData = VerificationSchema.parse(body);
        
        // Mock verification response
        const verificationResult = await mockBlockchainInteraction('verify', validatedData);
        
        return NextResponse.json({
          success: true,
          verified: true,
          verificationData: {
            ...verificationResult.data,
            blockchainData: {
              transactionId: verificationResult.transactionId,
              blockNumber: verificationResult.blockNumber,
              timestamp: verificationResult.timestamp,
              network: verificationResult.network
            }
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Check if this is a credential issuance request
    if (body.isCredentialIssuance) {
      try {
        const validatedData = CredentialIssueSchema.parse(body);
        
        // Mock credential issuance
        const issuanceResult = await mockBlockchainInteraction('issue', validatedData);
        
        return NextResponse.json({
          success: true,
          credential: {
            id: `cred-${Math.floor(Math.random() * 1000)}`,
            ...validatedData,
            issueDate: new Date().toISOString(),
            status: 'active',
            blockchainData: {
              transactionId: issuanceResult.transactionId,
              blockNumber: issuanceResult.blockNumber,
              timestamp: issuanceResult.timestamp,
              network: issuanceResult.network
            },
            verificationUrl: `https://verify.edpsych.io/credential/${issuanceResult.transactionId}`
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Check if this is a copyright registration request
    if (body.isCopyrightRegistration) {
      try {
        const validatedData = CopyrightRegistrationSchema.parse(body);
        
        // Mock copyright registration
        const registrationResult = await mockBlockchainInteraction('register', validatedData);
        
        return NextResponse.json({
          success: true,
          copyright: {
            id: `cr-${Math.floor(Math.random() * 1000)}`,
            ...validatedData,
            creationDate: body.creationDate || new Date().toISOString(),
            registrationDate: new Date().toISOString(),
            status: 'registered',
            blockchainData: {
              transactionId: registrationResult.transactionId,
              blockNumber: registrationResult.blockNumber,
              timestamp: registrationResult.timestamp,
              network: registrationResult.network
            },
            verificationUrl: `https://verify.edpsych.io/copyright/${registrationResult.transactionId}`
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing blockchain request:', error);
    return NextResponse.json({ error: 'Failed to process blockchain request' }, { status: 500 });
  }
}
