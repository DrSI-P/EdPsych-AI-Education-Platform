import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Schema for notes generation request
const generateNotesSchema = z.object({
  videoId: z.string().uuid(),
  noteType: z.enum(['summary', 'key-points', 'revision-guide', 'concept-map', 'questions', 'custom']),
  options: z.object({
    focusAreas: z.array(z.string()).optional(),
    detailLevel: z.enum(['brief', 'standard', 'detailed']).optional(),
    includeTimestamps: z.boolean().optional(),
    includeExamples: z.boolean().optional(),
    includeDefinitions: z.boolean().optional(),
    format: z.enum(['paragraphs', 'bullet-points', 'numbered-list', 'outline']).optional(),
    tone: z.enum(['academic', 'conversational', 'simplified']).optional(),
    customPrompt: z.string().optional(),
  }),
});

/**
 * POST /api/video/notes
 * Generate AI notes for a video
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = generateNotesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { videoId, noteType, options } = validationResult.data;

    // Check if video exists
    const video = await db.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Get video transcript
    // In a real implementation, this would fetch the transcript from a service or database
    // For now, we'll simulate this with a placeholder
    const transcript = await getVideoTranscript(videoId);
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Video transcript not available' },
        { status: 404 }
      );
    }

    // Generate notes using AI
    const notes = await generateAINotes(transcript, noteType, options, video.title);

    // Log the notes generation for analytics
    await logNotesGeneration(userId, videoId, noteType);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error generating video notes:', error);
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
}

/**
 * Get video transcript
 * In a real implementation, this would fetch from a database or service
 */
async function getVideoTranscript(videoId: string): Promise<string | null> {
  // Simulate fetching transcript
  // In a real implementation, this would query a database or service
  
  // For demo purposes, return a placeholder transcript
  return `
    Welcome to this educational video on photosynthesis.
    
    Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy.
    
    During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.
    
    The process can be summarized by the equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
    
    Photosynthesis occurs in the chloroplasts, specifically in the chlorophyll pigments that give plants their green color.
    
    The process has two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).
    
    In the light-dependent reactions, which take place in the thylakoid membrane, light energy is converted into chemical energy in the form of ATP and NADPH.
    
    Water molecules are split, releasing oxygen as a byproduct.
    
    In the Calvin cycle, which takes place in the stroma, carbon dioxide is incorporated into organic molecules in a process called carbon fixation.
    
    The enzyme RuBisCO plays a crucial role in this process, attaching carbon dioxide to a 5-carbon sugar called RuBP.
    
    The resulting 6-carbon compound is unstable and immediately breaks down into two 3-carbon molecules called 3-PGA.
    
    Through a series of reactions using the ATP and NADPH from the light-dependent reactions, 3-PGA is converted into G3P, a 3-carbon sugar.
    
    Most G3P molecules are used to regenerate RuBP, maintaining the cycle, but some exit the cycle to form glucose and other organic compounds.
    
    Factors affecting the rate of photosynthesis include light intensity, carbon dioxide concentration, and temperature.
    
    Photosynthesis is essential for life on Earth as it produces oxygen and serves as the primary source of energy for most ecosystems.
    
    Thank you for watching this educational video on photosynthesis.
  `;
}

/**
 * Generate AI notes based on transcript and options
 */
async function generateAINotes(
  transcript: string,
  noteType: string,
  options: unknown,
  videoTitle: string
): Promise<string> {
  // In a real implementation, this would call an AI service like OpenAI
  // For now, we'll simulate the response based on the note type and options
  
  // Build prompt based on note type and options
  let prompt = `Generate ${noteType.replace('-', ' ')} notes for a video titled "${videoTitle}" with the following transcript:\n\n${transcript}\n\n`;
  
  // Add options to prompt
  if (options.detailLevel) {
    prompt += `Detail level: ${options.detailLevel}\n`;
  }
  
  if (options.format) {
    prompt += `Format: ${options.format}\n`;
  }
  
  if (options.tone) {
    prompt += `Tone: ${options.tone}\n`;
  }
  
  if (options.includeTimestamps) {
    prompt += `Include timestamps for key points.\n`;
  }
  
  if (options.includeExamples) {
    prompt += `Include examples to illustrate concepts.\n`;
  }
  
  if (options.includeDefinitions) {
    prompt += `Include definitions for key terms.\n`;
  }
  
  if (options.focusAreas && options.focusAreas.length > 0) {
    prompt += `Focus on these specific areas: ${options.focusAreas.join(', ')}\n`;
  }
  
  if (options.customPrompt) {
    prompt += `Additional instructions: ${options.customPrompt}\n`;
  }
  
  // Simulate AI response based on note type
  let response = '';
  
  switch (noteType) {
    case 'summary':
      response = generateSummary(transcript, options);
      break;
    case 'key-points':
      response = generateKeyPoints(transcript, options);
      break;
    case 'revision-guide':
      response = generateRevisionGuide(transcript, options);
      break;
    case 'concept-map':
      response = generateConceptMap(transcript, options);
      break;
    case 'questions':
      response = generateQuestions(transcript, options);
      break;
    case 'custom':
      // For custom, we'll combine elements from different note types
      response = `# Custom Notes for "${videoTitle}"\n\n`;
      response += generateSummary(transcript, options, true);
      response += '\n\n';
      response += generateKeyPoints(transcript, options, true);
      break;
  }
  
  return response;
}

/**
 * Generate a summary of the transcript
 */
function generateSummary(transcript: string, options: unknown, isPartOfCustom = false): string {
  const title = isPartOfCustom ? '## Summary\n\n' : `# Summary\n\n`;
  
  let summary = `${title}Photosynthesis is the fundamental biological process by which plants convert light energy into chemical energy. This process takes place in the chloroplasts of plant cells, specifically within the chlorophyll pigments that give plants their green color. During photosynthesis, plants use light energy to transform water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds, primarily glucose.`;
  
  if (options.detailLevel === 'detailed') {
    summary += `\n\nThe process occurs in two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions). In the light-dependent reactions, which take place in the thylakoid membrane, light energy is converted into chemical energy in the form of ATP and NADPH, while water molecules are split to release oxygen. In the Calvin cycle, which occurs in the stroma, carbon dioxide is incorporated into organic molecules through carbon fixation, ultimately producing glucose and other organic compounds.`;
  }
  
  if (options.includeExamples) {
    summary += `\n\nThe overall chemical equation for photosynthesis can be represented as: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂. This equation shows that six molecules of carbon dioxide and six molecules of water, combined with light energy, produce one molecule of glucose and six molecules of oxygen.`;
  }
  
  if (options.detailLevel === 'detailed') {
    summary += `\n\nPhotosynthesis is essential for life on Earth as it produces oxygen for respiration and serves as the primary source of energy for most ecosystems. The rate of photosynthesis is affected by various factors including light intensity, carbon dioxide concentration, and temperature.`;
  }
  
  return summary;
}

/**
 * Generate key points from the transcript
 */
function generateKeyPoints(transcript: string, options: unknown, isPartOfCustom = false): string {
  const title = isPartOfCustom ? '## Key Points\n\n' : `# Key Points\n\n`;
  
  let keyPoints = title;
  
  if (options.format === 'bullet-points' || options.format === 'outline') {
    keyPoints += `• Photosynthesis is the process by which plants convert light energy into chemical energy.\n`;
    keyPoints += `• The process takes place in chloroplasts, specifically in chlorophyll pigments.\n`;
    keyPoints += `• The chemical equation is: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n`;
    
    if (options.includeTimestamps) {
      keyPoints += `• [00:45] Photosynthesis has two main stages: light-dependent reactions and the Calvin cycle.\n`;
    } else {
      keyPoints += `• Photosynthesis has two main stages: light-dependent reactions and the Calvin cycle.\n`;
    }
    
    if (options.detailLevel === 'detailed' || options.detailLevel === 'standard') {
      keyPoints += `• Light-dependent reactions occur in the thylakoid membrane and produce ATP, NADPH, and oxygen.\n`;
      keyPoints += `• The Calvin cycle takes place in the stroma and incorporates CO₂ into organic molecules.\n`;
      keyPoints += `• RuBisCO is a key enzyme in carbon fixation during the Calvin cycle.\n`;
    }
    
    if (options.includeTimestamps) {
      keyPoints += `• [01:30] Factors affecting photosynthesis include light intensity, CO₂ concentration, and temperature.\n`;
    } else {
      keyPoints += `• Factors affecting photosynthesis include light intensity, CO₂ concentration, and temperature.\n`;
    }
    
    keyPoints += `• Photosynthesis is essential for life on Earth, producing oxygen and energy for ecosystems.\n`;
  } else if (options.format === 'numbered-list') {
    keyPoints += `1. Photosynthesis is the process by which plants convert light energy into chemical energy.\n`;
    keyPoints += `2. The process takes place in chloroplasts, specifically in chlorophyll pigments.\n`;
    keyPoints += `3. The chemical equation is: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n`;
    
    if (options.includeTimestamps) {
      keyPoints += `4. [00:45] Photosynthesis has two main stages: light-dependent reactions and the Calvin cycle.\n`;
    } else {
      keyPoints += `4. Photosynthesis has two main stages: light-dependent reactions and the Calvin cycle.\n`;
    }
    
    if (options.detailLevel === 'detailed' || options.detailLevel === 'standard') {
      keyPoints += `5. Light-dependent reactions occur in the thylakoid membrane and produce ATP, NADPH, and oxygen.\n`;
      keyPoints += `6. The Calvin cycle takes place in the stroma and incorporates CO₂ into organic molecules.\n`;
      keyPoints += `7. RuBisCO is a key enzyme in carbon fixation during the Calvin cycle.\n`;
    }
    
    if (options.includeTimestamps) {
      keyPoints += `8. [01:30] Factors affecting photosynthesis include light intensity, CO₂ concentration, and temperature.\n`;
    } else {
      keyPoints += `8. Factors affecting photosynthesis include light intensity, CO₂ concentration, and temperature.\n`;
    }
    
    keyPoints += `9. Photosynthesis is essential for life on Earth, producing oxygen and energy for ecosystems.\n`;
  } else {
    // Paragraphs format
    keyPoints += `Photosynthesis is the fundamental process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts, specifically within the chlorophyll pigments that give plants their green color.\n\n`;
    
    if (options.includeTimestamps) {
      keyPoints += `[00:30] The overall chemical equation for photosynthesis is: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂, showing that carbon dioxide and water combine with light energy to produce glucose and oxygen.\n\n`;
    } else {
      keyPoints += `The overall chemical equation for photosynthesis is: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂, showing that carbon dioxide and water combine with light energy to produce glucose and oxygen.\n\n`;
    }
    
    keyPoints += `Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions). The light-dependent reactions produce ATP, NADPH, and oxygen, while the Calvin cycle uses these products to fix carbon dioxide into organic compounds.\n\n`;
    
    keyPoints += `The rate of photosynthesis is influenced by several factors, including light intensity, carbon dioxide concentration, and temperature. Photosynthesis is vital for life on Earth, as it produces oxygen and serves as the primary energy source for most ecosystems.`;
  }
  
  return keyPoints;
}

/**
 * Generate a revision guide from the transcript
 */
function generateRevisionGuide(transcript: string, options: unknown): string {
  let guide = `# Photosynthesis Revision Guide\n\n`;
  
  guide += `## Introduction\n\n`;
  guide += `Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. This guide covers the key concepts, processes, and significance of photosynthesis.\n\n`;
  
  guide += `## Key Concepts\n\n`;
  
  if (options.format === 'outline') {
    guide += `### Definition\n`;
    guide += `- Photosynthesis: The process by which plants convert light energy into chemical energy\n`;
    guide += `- Location: Chloroplasts, specifically in chlorophyll pigments\n`;
    guide += `- Equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n`;
    
    guide += `### Stages of Photosynthesis\n`;
    guide += `- Light-Dependent Reactions\n`;
    guide += `  - Location: Thylakoid membrane\n`;
    guide += `  - Process: Converts light energy into chemical energy (ATP and NADPH)\n`;
    guide += `  - Products: ATP, NADPH, and oxygen (byproduct)\n\n`;
    
    guide += `- Calvin Cycle (Light-Independent Reactions)\n`;
    guide += `  - Location: Stroma\n`;
    guide += `  - Process: Carbon fixation and synthesis of organic compounds\n`;
    guide += `  - Key Enzyme: RuBisCO\n`;
    guide += `  - Steps:\n`;
    guide += `    - Carbon dioxide attaches to RuBP (5-carbon sugar)\n`;
    guide += `    - Forms unstable 6-carbon compound\n`;
    guide += `    - Breaks down into two 3-PGA molecules\n`;
    guide += `    - 3-PGA converted to G3P using ATP and NADPH\n`;
    guide += `    - Some G3P used to form glucose, rest regenerates RuBP\n\n`;
  } else {
    guide += `### Definition\n\n`;
    guide += `Photosynthesis is the process by which plants convert light energy into chemical energy. It takes place in the chloroplasts, specifically in the chlorophyll pigments that give plants their green color. The overall equation for photosynthesis is: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n`;
    
    guide += `### Stages of Photosynthesis\n\n`;
    guide += `**Light-Dependent Reactions**\n\n`;
    guide += `These reactions occur in the thylakoid membrane of the chloroplasts. Light energy is converted into chemical energy in the form of ATP and NADPH. Water molecules are split, releasing oxygen as a byproduct.\n\n`;
    
    guide += `**Calvin Cycle (Light-Independent Reactions)**\n\n`;
    guide += `The Calvin cycle takes place in the stroma of the chloroplasts. Carbon dioxide is incorporated into organic molecules in a process called carbon fixation. The enzyme RuBisCO attaches carbon dioxide to a 5-carbon sugar called RuBP, forming an unstable 6-carbon compound that immediately breaks down into two 3-carbon molecules (3-PGA). Through a series of reactions using ATP and NADPH from the light-dependent reactions, 3-PGA is converted into G3P, a 3-carbon sugar. Most G3P molecules are used to regenerate RuBP, maintaining the cycle, but some exit to form glucose and other organic compounds.\n\n`;
  }
  
  if (options.includeDefinitions) {
    guide += `## Key Terms\n\n`;
    guide += `- **Chloroplast**: Plant cell organelle where photosynthesis occurs\n`;
    guide += `- **Chlorophyll**: Green pigment that absorbs light energy\n`;
    guide += `- **Thylakoid**: Membrane-bound compartment inside chloroplasts\n`;
    guide += `- **Stroma**: Fluid-filled space inside chloroplasts surrounding the thylakoids\n`;
    guide += `- **RuBisCO**: Enzyme that catalyzes the first major step of carbon fixation\n`;
    guide += `- **Carbon Fixation**: Process of converting inorganic carbon (CO₂) into organic compounds\n`;
    guide += `- **ATP**: Adenosine triphosphate, energy currency of cells\n`;
    guide += `- **NADPH**: Electron carrier used in biosynthetic reactions\n\n`;
  }
  
  if (options.includeExamples) {
    guide += `## Real-World Applications\n\n`;
    guide += `- **Agriculture**: Understanding photosynthesis helps optimize crop yields\n`;
    guide += `- **Climate Change**: Plants act as carbon sinks through photosynthesis\n`;
    guide += `- **Renewable Energy**: Artificial photosynthesis research for sustainable energy\n`;
    guide += `- **Ecosystem Services**: Photosynthesis produces oxygen and is the base of food chains\n\n`;
  }
  
  guide += `## Factors Affecting Photosynthesis\n\n`;
  guide += `- **Light Intensity**: Higher intensity increases rate up to a point (light saturation)\n`;
  guide += `- **Carbon Dioxide Concentration**: Higher CO₂ levels increase rate up to a point\n`;
  guide += `- **Temperature**: Optimal range typically 25-30°C; too high or too low reduces efficiency\n`;
  guide += `- **Water Availability**: Drought stress reduces photosynthetic rate\n\n`;
  
  guide += `## Significance\n\n`;
  guide += `Photosynthesis is essential for life on Earth as it:\n`;
  guide += `- Produces oxygen required for aerobic respiration\n`;
  guide += `- Creates glucose and other organic compounds that form the base of food chains\n`;
  guide += `- Removes carbon dioxide from the atmosphere\n`;
  guide += `- Provides renewable resources (food, fuel, fiber)\n\n`;
  
  if (options.detailLevel === 'detailed') {
    guide += `## Common Misconceptions\n\n`;
    guide += `- Plants only perform photosynthesis (they also perform cellular respiration)\n`;
    guide += `- Photosynthesis only occurs during the day (light-independent reactions continue at night)\n`;
    guide += `- Only plants perform photosynthesis (some bacteria and algae also photosynthesize)\n`;
    guide += `- Plants get most of their mass from soil (most comes from carbon dioxide in the air)\n\n`;
    
    guide += `## Exam Tips\n\n`;
    guide += `- Know the equation for photosynthesis and be able to balance it\n`;
    guide += `- Understand the relationship between the light-dependent reactions and Calvin cycle\n`;
    guide += `- Be able to explain limiting factors and their effects on photosynthetic rate\n`;
    guide += `- Connect photosynthesis to ecological concepts like energy flow and carbon cycling\n`;
  }
  
  return guide;
}

/**
 * Generate a concept map from the transcript
 */
function generateConceptMap(transcript: string, options: unknown): string {
  let conceptMap = `# Photosynthesis Concept Map\n\n`;
  
  conceptMap += `PHOTOSYNTHESIS\n`;
  conceptMap += `├── Definition\n`;
  conceptMap += `│   └── Process by which plants convert light energy into chemical energy\n`;
  conceptMap += `│\n`;
  conceptMap += `├── Location\n`;
  conceptMap += `│   ├── Chloroplasts\n`;
  conceptMap += `│   │   ├── Thylakoid membrane (light-dependent reactions)\n`;
  conceptMap += `│   │   └── Stroma (Calvin cycle)\n`;
  conceptMap += `│   └── Chlorophyll pigments\n`;
  conceptMap += `│\n`;
  conceptMap += `├── Equation\n`;
  conceptMap += `│   └── 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n`;
  conceptMap += `│\n`;
  conceptMap += `├── Stages\n`;
  conceptMap += `│   ├── Light-Dependent Reactions\n`;
  conceptMap += `│   │   ├── Inputs: Light energy, H₂O\n`;
  conceptMap += `│   │   ├── Processes: Photolysis of water, electron transport\n`;
  conceptMap += `│   │   └── Outputs: ATP, NADPH, O₂\n`;
  conceptMap += `│   │\n`;
  conceptMap += `│   └── Calvin Cycle (Light-Independent Reactions)\n`;
  conceptMap += `│       ├── Inputs: CO₂, ATP, NADPH\n`;
  conceptMap += `│       ├── Processes: Carbon fixation, reduction, regeneration\n`;
  conceptMap += `│       │   └── Key Enzyme: RuBisCO\n`;
  conceptMap += `│       └── Outputs: G3P → glucose and other organic compounds\n`;
  conceptMap += `│\n`;
  
  if (options.detailLevel === 'detailed') {
    conceptMap += `├── Factors Affecting Rate\n`;
    conceptMap += `│   ├── Light Intensity\n`;
    conceptMap += `│   ├── CO₂ Concentration\n`;
    conceptMap += `│   ├── Temperature\n`;
    conceptMap += `│   └── Water Availability\n`;
    conceptMap += `│\n`;
    conceptMap += `├── Ecological Significance\n`;
    conceptMap += `│   ├── Oxygen Production\n`;
    conceptMap += `│   ├── Carbon Fixation\n`;
    conceptMap += `│   ├── Base of Food Chains\n`;
    conceptMap += `│   └── Climate Regulation\n`;
    conceptMap += `│\n`;
  }
  
  if (options.includeDefinitions) {
    conceptMap += `└── Key Terms\n`;
    conceptMap += `    ├── Chloroplast: Plant cell organelle where photosynthesis occurs\n`;
    conceptMap += `    ├── Chlorophyll: Green pigment that absorbs light energy\n`;
    conceptMap += `    ├── Thylakoid: Membrane-bound compartment inside chloroplasts\n`;
    conceptMap += `    ├── Stroma: Fluid-filled space inside chloroplasts\n`;
    conceptMap += `    ├── RuBisCO: Enzyme that catalyzes carbon fixation\n`;
    conceptMap += `    ├── Carbon Fixation: Converting inorganic carbon to organic compounds\n`;
    conceptMap += `    ├── ATP: Adenosine triphosphate, energy currency of cells\n`;
    conceptMap += `    └── NADPH: Electron carrier used in biosynthetic reactions\n`;
  } else {
    conceptMap += `└── Applications\n`;
    conceptMap += `    ├── Agriculture\n`;
    conceptMap += `    ├── Climate Change Mitigation\n`;
    conceptMap += `    ├── Renewable Energy Research\n`;
    conceptMap += `    └── Ecosystem Services\n`;
  }
  
  return conceptMap;
}

/**
 * Generate questions from the transcript
 */
function generateQuestions(transcript: string, options: unknown): string {
  let questions = `# Study Questions on Photosynthesis\n\n`;
  
  if (options.format === 'numbered-list') {
    questions += `1. What is photosynthesis and where does it occur in plant cells?\n\n`;
    questions += `2. Write the balanced chemical equation for photosynthesis.\n\n`;
    questions += `3. Describe the two main stages of photosynthesis and where each takes place.\n\n`;
    questions += `4. What are the inputs and outputs of the light-dependent reactions?\n\n`;
    questions += `5. What role does the enzyme RuBisCO play in photosynthesis?\n\n`;
    
    if (options.detailLevel === 'detailed') {
      questions += `6. Explain how ATP and NADPH from the light-dependent reactions are used in the Calvin cycle.\n\n`;
      questions += `7. What happens to the G3P molecules produced in the Calvin cycle?\n\n`;
      questions += `8. Describe three factors that affect the rate of photosynthesis and explain how each factor influences the process.\n\n`;
      questions += `9. Why is photosynthesis considered essential for life on Earth?\n\n`;
      questions += `10. Compare and contrast photosynthesis and cellular respiration in terms of their inputs, outputs, and cellular locations.\n\n`;
    }
  } else {
    questions += `## Multiple Choice Questions\n\n`;
    
    questions += `1. Where does photosynthesis take place in plant cells?\n`;
    questions += `   a) Mitochondria\n`;
    questions += `   b) Chloroplasts\n`;
    questions += `   c) Nucleus\n`;
    questions += `   d) Ribosomes\n\n`;
    
    questions += `2. Which of the following is NOT a product of photosynthesis?\n`;
    questions += `   a) Glucose\n`;
    questions += `   b) Oxygen\n`;
    questions += `   c) Carbon dioxide\n`;
    questions += `   d) ATP\n\n`;
    
    questions += `3. The light-dependent reactions of photosynthesis occur in the:\n`;
    questions += `   a) Stroma\n`;
    questions += `   b) Thylakoid membrane\n`;
    questions += `   c) Cell wall\n`;
    questions += `   d) Cytoplasm\n\n`;
    
    questions += `4. Which enzyme is crucial for carbon fixation in the Calvin cycle?\n`;
    questions += `   a) ATP synthase\n`;
    questions += `   b) RuBisCO\n`;
    questions += `   c) Photosystem II\n`;
    questions += `   d) Catalase\n\n`;
    
    questions += `5. What is the primary source of the oxygen released during photosynthesis?\n`;
    questions += `   a) Carbon dioxide\n`;
    questions += `   b) Glucose\n`;
    questions += `   c) Water\n`;
    questions += `   d) Chlorophyll\n\n`;
    
    if (options.detailLevel === 'detailed') {
      questions += `## Short Answer Questions\n\n`;
      
      questions += `1. Explain the relationship between the light-dependent reactions and the Calvin cycle in photosynthesis.\n\n`;
      
      questions += `2. Describe how the following factors affect the rate of photosynthesis:\n`;
      questions += `   a) Light intensity\n`;
      questions += `   b) Carbon dioxide concentration\n`;
      questions += `   c) Temperature\n\n`;
      
      questions += `3. Why is photosynthesis considered essential for life on Earth? Provide at least three reasons.\n\n`;
      
      questions += `4. Trace the path of an electron during the light-dependent reactions of photosynthesis.\n\n`;
      
      questions += `5. Explain how the products of the Calvin cycle are used to synthesize glucose and other organic compounds.\n\n`;
    }
  }
  
  if (options.includeDefinitions) {
    questions += `## Key Terms to Define\n\n`;
    questions += `1. Photosynthesis\n`;
    questions += `2. Chloroplast\n`;
    questions += `3. Chlorophyll\n`;
    questions += `4. Thylakoid\n`;
    questions += `5. Stroma\n`;
    questions += `6. Calvin cycle\n`;
    questions += `7. RuBisCO\n`;
    questions += `8. Carbon fixation\n`;
    questions += `9. Light-dependent reactions\n`;
    questions += `10. Photolysis\n`;
  }
  
  return questions;
}

/**
 * Log notes generation for analytics
 */
async function logNotesGeneration(userId: string, videoId: string, noteType: string): Promise<void> {
  // In a real implementation, this would log to a database or analytics service
  console.log(`Notes generation - User: ${userId}, Video: ${videoId}, Type: ${noteType}, Timestamp: ${new Date().toISOString()}`);
  
  // Example of how this could be implemented with a database model:
  // await db.notesGenerationLog.create({
  //   data: {
  //     userId,
  //     videoId,
  //     noteType,
  //     timestamp: new Date(),
  //   },
  // });
}