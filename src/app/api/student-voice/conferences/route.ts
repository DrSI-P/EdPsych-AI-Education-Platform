import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for portfolio request
const portfolioSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  studentId: z.string(),
});

// Define schema for artifact request
const artifactSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  artifactType: z.enum(["document", "image", "video", "audio", "link"]),
  content: z.string(),
  portfolioId: z.string(),
});

// Define schema for reflection request
const reflectionSchema = z.object({
  prompt: z.string(),
  response: z.string().min(1, "Response cannot be empty"),
  portfolioId: z.string(),
});

// Define schema for conference request
const conferenceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string().datetime(),
  studentId: z.string(),
  portfolioId: z.string().optional(),
  participants: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(["student", "teacher", "parent", "other"]),
    })
  ).optional(),
});

// Define schema for conference note request
const conferenceNoteSchema = z.object({
  content: z.string().min(1, "Note content cannot be empty"),
  conferenceId: z.string(),
  createdBy: z.string(),
});

// Mock portfolios data
const mockPortfolios = [
  {
    id: "1",
    title: "My Learning Journey 2024-2025",
    description: "A collection of my best work and reflections from this academic year",
    studentId: "student123",
    createdAt: "2025-05-10T14:30:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Science Project Portfolio",
    description: "Documentation of my ecosystem research project",
    studentId: "student123",
    createdAt: "2025-04-22T09:15:00Z",
    updatedAt: "2025-04-22T09:15:00Z",
  },
];

// Mock artifacts data
const mockArtifacts = [
  {
    id: "1",
    title: "Math Problem Solving",
    description: "My work on complex word problems",
    artifactType: "document",
    content: "/documents/math_problems.pdf",
    portfolioId: "1",
    createdAt: "2025-05-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Science Experiment Results",
    description: "Photos and data from my plant growth experiment",
    artifactType: "image",
    content: "/images/plant_experiment.jpg",
    portfolioId: "1",
    createdAt: "2025-04-15T14:30:00Z",
  },
];

// Mock reflections data
const mockReflections = [
  {
    id: "1",
    prompt: "What are you most proud of this term?",
    response: "I'm most proud of how I improved my problem-solving skills in math. At the beginning of the term, I struggled with word problems, but now I can break them down and solve them step by step.",
    portfolioId: "1",
    createdAt: "2025-05-05T15:45:00Z",
  },
  {
    id: "2",
    prompt: "What has been your biggest challenge?",
    response: "My biggest challenge was staying organised with all my assignments. I've been using a planner more consistently now, which has helped me keep track of deadlines.",
    portfolioId: "1",
    createdAt: "2025-04-20T11:20:00Z",
  },
];

// Mock conferences data
const mockConferences = [
  {
    id: "1",
    title: "End of Year Conference",
    description: "Review of progress and achievements for the academic year",
    date: "2025-06-15T15:00:00Z",
    status: "planned",
    studentId: "student123",
    portfolioId: "1",
    createdAt: "2025-05-01T09:00:00Z",
    updatedAt: "2025-05-01T09:00:00Z",
  },
  {
    id: "2",
    title: "Science Project Review",
    description: "Discussion of science project outcomes and learning",
    date: "2025-04-30T14:00:00Z",
    status: "completed",
    studentId: "student123",
    portfolioId: "2",
    createdAt: "2025-04-15T10:30:00Z",
    updatedAt: "2025-04-30T15:15:00Z",
  },
];

// GET handler for retrieving data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const studentId = searchParams.get('studentId');
  
  // Return data based on requested type
  switch (type) {
    case 'portfolios':
      if (id) {
        const portfolio = mockPortfolios.find(p => p.id === id);
        if (!portfolio) {
          return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
        }
        return NextResponse.json({ portfolio });
      } else {
        let filteredPortfolios = [...mockPortfolios];
        if (studentId) {
          filteredPortfolios = filteredPortfolios.filter(p => p.studentId === studentId);
        }
        return NextResponse.json({ portfolios: filteredPortfolios });
      }
      
    case 'artifacts':
      if (id) {
        const artifact = mockArtifacts.find(a => a.id === id);
        if (!artifact) {
          return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
        }
        return NextResponse.json({ artifact });
      } else {
        const portfolioId = searchParams.get('portfolioId');
        let filteredArtifacts = [...mockArtifacts];
        if (portfolioId) {
          filteredArtifacts = filteredArtifacts.filter(a => a.portfolioId === portfolioId);
        }
        return NextResponse.json({ artifacts: filteredArtifacts });
      }
      
    case 'reflections':
      if (id) {
        const reflection = mockReflections.find(r => r.id === id);
        if (!reflection) {
          return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
        }
        return NextResponse.json({ reflection });
      } else {
        const portfolioId = searchParams.get('portfolioId');
        let filteredReflections = [...mockReflections];
        if (portfolioId) {
          filteredReflections = filteredReflections.filter(r => r.portfolioId === portfolioId);
        }
        return NextResponse.json({ reflections: filteredReflections });
      }
      
    case 'conferences':
      if (id) {
        const conference = mockConferences.find(c => c.id === id);
        if (!conference) {
          return NextResponse.json({ error: "Conference not found" }, { status: 404 });
        }
        return NextResponse.json({ conference });
      } else {
        let filteredConferences = [...mockConferences];
        if (studentId) {
          filteredConferences = filteredConferences.filter(c => c.studentId === studentId);
        }
        const status = searchParams.get('status');
        if (status) {
          filteredConferences = filteredConferences.filter(c => c.status === status);
        }
        return NextResponse.json({ conferences: filteredConferences });
      }
      
    default:
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }
}

// POST handler for creating new data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type;
    
    switch (type) {
      case 'portfolio':
        const portfolioData = portfolioSchema.parse(body);
        const newPortfolio = {
          id: Date.now().toString(),
          ...portfolioData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Portfolio created successfully", 
          portfolio: newPortfolio 
        });
        
      case 'artifact':
        const artifactData = artifactSchema.parse(body);
        const newArtifact = {
          id: Date.now().toString(),
          ...artifactData,
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Artifact added successfully", 
          artifact: newArtifact 
        });
        
      case 'reflection':
        const reflectionData = reflectionSchema.parse(body);
        const newReflection = {
          id: Date.now().toString(),
          ...reflectionData,
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Reflection added successfully", 
          reflection: newReflection 
        });
        
      case 'conference':
        const conferenceData = conferenceSchema.parse(body);
        const newConference = {
          id: Date.now().toString(),
          ...conferenceData,
          status: "planned",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Conference scheduled successfully", 
          conference: newConference 
        });
        
      case 'conference-note':
        const noteData = conferenceNoteSchema.parse(body);
        const newNote = {
          id: Date.now().toString(),
          ...noteData,
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Note added successfully", 
          note: newNote 
        });
        
      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid type parameter" 
        }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while processing your request" 
    }, { status: 500 });
  }
}

// PUT handler for updating existing data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type } = body;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: "ID is required for updates" 
      }, { status: 400 });
    }
    
    switch (type) {
      case 'portfolio':
        const portfolioData = portfolioSchema.parse(body);
        const updatedPortfolio = {
          id,
          ...portfolioData,
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Portfolio updated successfully", 
          portfolio: updatedPortfolio 
        });
        
      case 'artifact':
        const artifactData = artifactSchema.parse(body);
        const updatedArtifact = {
          id,
          ...artifactData,
        };
        return NextResponse.json({ 
          success: true, 
          message: "Artifact updated successfully", 
          artifact: updatedArtifact 
        });
        
      case 'reflection':
        const reflectionData = reflectionSchema.parse(body);
        const updatedReflection = {
          id,
          ...reflectionData,
        };
        return NextResponse.json({ 
          success: true, 
          message: "Reflection updated successfully", 
          reflection: updatedReflection 
        });
        
      case 'conference':
        const conferenceData = conferenceSchema.parse(body);
        const updatedConference = {
          id,
          ...conferenceData,
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Conference updated successfully", 
          conference: updatedConference 
        });
        
      case 'conference-status':
        const { status } = body;
        if (!status || !['planned', 'completed', 'cancelled'].includes(status)) {
          return NextResponse.json({ 
            success: false, 
            message: "Invalid status value" 
          }, { status: 400 });
        }
        
        const statusUpdatedConference = {
          id,
          status,
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ 
          success: true, 
          message: "Conference status updated successfully", 
          conference: statusUpdatedConference 
        });
        
      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid type parameter" 
        }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while processing your request" 
    }, { status: 500 });
  }
}
