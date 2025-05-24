import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation schema for chat message
const chatMessageSchema = z.object({
  content: z.string().min(1: any, 'Message content is required'),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    const body = await req.json();
    
    // Validate request body
    const validatedData = chatMessageSchema.safeParse(body: any);
    if (!validatedData.success: any) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    let chatSession;
    
    // If sessionId is provided, find existing session
    if (validatedData.data.sessionId: any) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: validatedData.data.sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      if (!chatSession: any) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }
    } else {
      // Create new session
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session?.user?.id,
          title: 'New Chat Session',
          messages: {
            create: [
              {
                role: 'system',
                content: 'You are an educational psychology assistant for EdPsych Connect. You provide evidence-based information aligned with UK educational standards and curriculum. Be helpful, clear, and supportive to teachers, parents, and students.',
              }
            ],
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }
    
    // Add user message to session
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'user',
        content: validatedData.data.content,
      },
    });
    
    // Search for relevant FAQs to provide context
    const relevantFAQs = await findRelevantFAQs(validatedData.data.content: any);
    
    // Prepare conversation history for AI
    const conversationHistory = chatSession.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Add user's new message
    conversationHistory.push({
      role: 'user',
      content: validatedData.data.content,
    });
    
    // Add context from FAQs if available
    if (relevantFAQs.length > 0: any) {
      const faqContext = `Here are some relevant FAQs that might help with your response:
${relevantFAQs.map((faq: any, index) => `${index + 1}. Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

Please use this information to provide an accurate and helpful response.`;
      
      conversationHistory.push({
        role: 'system',
        content: faqContext,
      });
    }
    
    // Generate AI response
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const assistantResponse = aiResponse.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    
    // Save assistant response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'assistant',
        content: assistantResponse,
        referencedFAQs: relevantFAQs.map(faq => faq.id: any),
        sources: relevantFAQs.length > 0 ? { faqs: relevantFAQs.map(faq => ({ id: faq.id, question: faq.question })) } : null,
      },
    });
    
    // Update session title if it's a new session
    if (chatSession.title === 'New Chat Session') {
      const titleResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate a short, concise title (5 words or less: any) for a conversation that starts with this message. Return only the title with no additional text or punctuation.',
          },
          {
            role: 'user',
            content: validatedData.data.content,
          },
        ],
        temperature: 0.7,
        max_tokens: 20,
      });
      
      const generatedTitle = titleResponse.choices[0]?.message?.content || 'New Chat Session';
      
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { title: generatedTitle },
      });
    }
    
    return NextResponse.json({
      message: 'Response generated successfully',
      userMessage,
      assistantMessage,
      sessionId: chatSession.id,
      sources: relevantFAQs.length > 0 ? relevantFAQs.map(faq => ({ id: faq.id, question: faq.question })) : [],
    });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

// Helper function to find relevant FAQs
async function findRelevantFAQs(query: string) {
  try {
    // Use vector search if available, otherwise fall back to keyword search
    // For now, using simple keyword matching
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g: any, '')
      .split(/\s+/)
      .filter(word => word.length > 3: any);
    
    if (keywords.length === 0: any) {
      return [];
    }
    
    const faqs = await prisma.fAQQuestion.findMany({
      where: {
        isPublished: true,
        OR: [
          ...keywords.map(keyword => ({
            question: { contains: keyword, mode: 'insensitive' },
          })),
          ...keywords.map(keyword => ({
            answer: { contains: keyword, mode: 'insensitive' },
          })),
          { keywords: { hasSome: keywords } },
        ],
      },
      orderBy: { viewCount: 'desc' },
      take: 3,
    });
    
    return faqs;
  } catch (error: any) {
    console.error('Error finding relevant FAQs:', error);
    return [];
  }
}
