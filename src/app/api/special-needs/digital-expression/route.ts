import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Schema for journal entry
const JournalEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string(),
  tags: z.array(z.string()),
  isPrivate: z.boolean().default(true),
});

// Schema for artwork
const ArtworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  medium: z.string(),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  tags: z.array(z.string()),
  isPrivate: z.boolean().default(true),
});

// Schema for media project
const MediaProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  type: z.enum(["video", "audio", "interactive"]),
  duration: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  thumbnailData: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaData: z.string().optional(),
  tags: z.array(z.string()),
  isPrivate: z.boolean().default(true),
});

// Schema for group message
const GroupMessageSchema = z.object({
  groupId: z.string(),
  content: z.string().min(1, "Message content is required"),
});

// Schema for response
const ResponseSchema = z.object({
  entryId: z.string(),
  entryType: z.enum(["journal", "artwork", "media", "group"]),
  content: z.string().min(1, "Response content is required"),
});

// GET handler for retrieving digital expression data
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const privacyLevel = searchParams.get('privacy');
    const expressionType = searchParams.get('expressionType');
    const searchQuery = searchParams.get('search');
    
    // Build base query with user filter
    const baseQuery: any = {
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
    };
    
    // Add privacy filter if specified
    if (privacyLevel && privacyLevel !== 'all') {
      baseQuery.where = {
        ...baseQuery.where,
        isPrivate: privacyLevel === 'private',
      };
    }
    
    // Add search filter if specified
    if (searchQuery) {
      const searchFilter = {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' as const } },
          { content: { contains: searchQuery, mode: 'insensitive' as const } },
          { description: { contains: searchQuery, mode: 'insensitive' as const } },
          { tags: { has: searchQuery } },
        ],
      };
      baseQuery.where = {
        ...baseQuery.where,
        ...searchFilter,
      };
    }
    
    // Determine what data to fetch based on type parameter
    let responseData: any = {};
    
    switch (type) {
      case 'journal':
        const journalEntries = await (prisma as any).digitalJournalEntry.findMany({
          ...baseQuery,
          include: {
            responses: {
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            },
          },
        });
        responseData = { journalEntries };
        break;
        
      case 'artwork':
        const artworks = await (prisma as any).digitalArtwork.findMany({
          ...baseQuery,
          include: {
            responses: {
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            },
          },
        });
        responseData = { artworks };
        break;
        
      case 'media':
        // Add expression type filter if specified
        if (expressionType && expressionType !== 'all') {
          baseQuery.where = {
            ...baseQuery.where,
            type: expressionType,
          };
        }
        
        const mediaProjects = await (prisma as any).digitalMediaProject.findMany({
          ...baseQuery,
          include: {
            responses: {
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            },
          },
        });
        responseData = { mediaProjects };
        break;
        
      case 'groups':
        // For groups, we need to fetch groups the user is a member of
        const groups = await (prisma as any).peerSupportGroup.findMany({
          where: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
            ...(searchQuery ? {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' as const } },
                { description: { contains: searchQuery, mode: 'insensitive' as const } },
                { tags: { has: searchQuery } },
              ],
            } : {}),
          },
          include: {
            facilitator: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
            members: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
                responses: {
                  orderBy: {
                    createdAt: 'asc',
                  },
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                        role: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        responseData = { groups };
        break;
        
      default:
        // Return all data types if no specific type is requested
        const [allJournalEntries, allArtworks, allMediaProjects, allGroups] = await Promise.all([
          (prisma as any).digitalJournalEntry.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
          }),
          (prisma as any).digitalArtwork.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
          }),
          (prisma as any).digitalMediaProject.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
          }),
          (prisma as any).peerSupportGroup.findMany({
            where: {
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
            take: 5,
            include: {
              facilitator: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
              _count: {
                select: { members: true, messages: true },
              },
            },
          }),
        ]);
        
        responseData = {
          journalEntries: allJournalEntries,
          artworks: allArtworks,
          mediaProjects: allMediaProjects,
          groups: allGroups,
        };
    }
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error in digital expression API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for creating and updating digital expression content
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { type } = body;
    
    switch (type) {
      case 'journal':
        // Validate journal entry data
        const journalData = JournalEntrySchema.parse(body.data);
        
        // Create journal entry
        const journalEntry = await (prisma as any).digitalJournalEntry.create({
          data: {
            userId: session.user.id,
            title: journalData.title,
            content: journalData.content,
            mood: journalData.mood,
            tags: journalData.tags,
            isPrivate: journalData.isPrivate,
          },
        });
        
        return NextResponse.json({ journalEntry });
        
      case 'artwork':
        // Validate artwork data
        const artworkData = ArtworkSchema.parse(body.data);
        
        // Create artwork entry
        const artwork = await (prisma as any).digitalArtwork.create({
          data: {
            userId: session.user.id,
            title: artworkData.title,
            description: artworkData.description,
            medium: artworkData.medium,
            imageUrl: artworkData.imageUrl,
            tags: artworkData.tags,
            isPrivate: artworkData.isPrivate,
          },
        });
        
        return NextResponse.json({ artwork });
        
      case 'media':
        // Validate media project data
        const mediaData = MediaProjectSchema.parse(body.data);
        
        // Create media project
        const mediaProject = await (prisma as any).digitalMediaProject.create({
          data: {
            userId: session.user.id,
            title: mediaData.title,
            description: mediaData.description,
            type: mediaData.type,
            duration: mediaData.duration,
            thumbnailUrl: mediaData.thumbnailUrl,
            mediaUrl: mediaData.mediaUrl,
            tags: mediaData.tags,
            isPrivate: mediaData.isPrivate,
          },
        });
        
        return NextResponse.json({ mediaProject });
        
      case 'group-message':
        // Validate group message data
        const messageData = GroupMessageSchema.parse(body.data);
        
        // Check if user is a member of the group
        const groupMembership = await (prisma as any).peerSupportGroupMember.findFirst({
          where: {
            userId: session.user.id,
            groupId: messageData.groupId,
          },
        });
        
        if (!groupMembership) {
          return NextResponse.json(
            { error: 'You are not a member of this group' },
            { status: 403 }
          );
        }
        
        // Create group message
        const groupMessage = await (prisma as any).peerSupportGroupMessage.create({
          data: {
            groupId: messageData.groupId,
            authorId: session.user.id,
            content: messageData.content,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        });
        
        return NextResponse.json({ groupMessage });
        
      case 'response':
        // Validate response data
        const responseData = ResponseSchema.parse(body.data);
        
        // Create response based on entry type
        let response;
        
        switch (responseData.entryType) {
          case 'journal':
            response = await (prisma as any).digitalJournalResponse.create({
              data: {
                journalEntryId: responseData.entryId,
                authorId: session.user.id,
                content: responseData.content,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            });
            break;
            
          case 'artwork':
            response = await (prisma as any).digitalArtworkResponse.create({
              data: {
                artworkId: responseData.entryId,
                authorId: session.user.id,
                content: responseData.content,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            });
            break;
            
          case 'media':
            response = await (prisma as any).digitalMediaResponse.create({
              data: {
                mediaProjectId: responseData.entryId,
                authorId: session.user.id,
                content: responseData.content,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            });
            break;
            
          case 'group':
            response = await (prisma as any).peerSupportGroupMessageResponse.create({
              data: {
                messageId: responseData.entryId,
                authorId: session.user.id,
                content: responseData.content,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            });
            break;
            
          default:
            return NextResponse.json(
              { error: 'Invalid entry type' },
              { status: 400 }
            );
        }
        
        return NextResponse.json({ response });
        
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Error in digital expression API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
