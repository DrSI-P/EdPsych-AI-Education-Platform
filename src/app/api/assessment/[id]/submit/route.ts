import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { aiService } from '@/lib/ai/ai-service';

// POST handler for submitting assessment responses
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const assessmentId = params.id;
    
    // Fetch the assessment with questions
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,

            type: true,
            options: true,
            correctAnswer: true,
            expectedAnswer: true,
            points: true,
            order: true,
            assessmentId: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
    });
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Parse request body
    const body = await request.json();
    const { answers } = body;
    
    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }
    
    // Check if user has already completed this assessment
    const existingResponse = await prisma.assessmentResponse.findFirst({
      where: {
        assessmentId,
        userId: session.user.id,
        completedAt: { not: null },
      },
    });
    
    if (existingResponse && !assessment.allowRetakes) {
      return NextResponse.json(
        { error: 'You have already completed this assessment and retakes are not allowed' },
        { status: 400 }
      );
    }
    
    // Create a new response
    const response = await prisma.assessmentResponse.create({
      data: {
        assessment: { connect: { id: assessmentId } },
        user: { connect: { id: session.user.id } },
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });
    
    // Process each answer and calculate score
    let totalScore = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      const { questionId, content } = answer;
      
      // Find the corresponding question
      const question = assessment.questions.find(q => q.id === questionId);
      
      if (!question) {
        continue; // Skip if question not found
      }
      
      let isCorrect = false;
      let feedback = '';
      
      // Grade the answer based on question type
      switch (question.type) {
        case 'multiple-choice':
          // For multiple choice, check if selected options match correct answers
          const correctOptions = question.correctAnswer as string[];
          isCorrect = Array.isArray(content) && 
                     Array.isArray(correctOptions) && 
                     content.length === correctOptions.length && 
                     content.every(option => correctOptions.includes(option));
          
          if (isCorrect) {
            feedback = 'Correct answer!';
          } else {
            feedback = 'Incorrect answer. Please review the correct options.';
          }
          break;
          
        case 'matching':
          // For matching, check if all pairs match correctly
          const correctPairs = question.correctAnswer as Record<string, string>;
          isCorrect = typeof content === 'object' && 
                     content !== null && 
                     Object.entries(correctPairs).every(([key, value]) => content[key] === value);
          
          if (isCorrect) {
            feedback = 'All matches are correct!';
          } else {
            feedback = 'Some matches are incorrect. Please review the correct pairs.';
          }
          break;
          
        case 'open-ended':
          // For open-ended questions, use AI to evaluate the answer if available
          if (question.expectedAnswer && typeof content === 'string' && content.trim()) {
            try {
              const aiEvaluation = await aiService.evaluateOpenEndedAnswer({
                question: question.question || "",
                expectedAnswer: question.expectedAnswer as string,
                studentAnswer: content,
                maxScore: question.points
              });
              
              // AI returns a score between 0 and max points
              const score = Math.min(Math.max(aiEvaluation.score, 0), question.points);
              totalScore += score;
              
              // Determine if the answer is correct (at least 70% of max points)
              isCorrect = score >= (question.points * 0.7);
              feedback = aiEvaluation.feedback;
              
              // Save the answer with AI evaluation
              await prisma.assessmentAnswer.create({
                data: {
                  question: { connect: { id: questionId } },
                  response: { connect: { id: response.id } },
                  answer: { 
                    text: content,
                    isCorrect,
                    feedback
                  }
                },
              });
              
              processedAnswers.push({
                questionId,
                isCorrect,
                score,
                feedback,
                correctAnswer: question.expectedAnswer,
              });
              
              continue; // Skip the rest of the loop for this answer
            } catch (error) {
              console.error('Error evaluating open-ended answer with AI:', error);
              // Fall back to manual grading (marked as needing review)
              isCorrect = false; // Use false instead of null for manual review
              feedback = 'This answer requires manual review.';
            }
          } else {
            // No expected answer or empty student answer
            isCorrect = false; // Use false instead of null for manual review
            feedback = 'This answer requires manual review.';
          }
          break;
          
        case 'file-upload':
          // File uploads always need manual review
          isCorrect = false; // Use false instead of null for manual review
          feedback = 'Your file has been submitted and will be reviewed.';
          break;
          
        default:
          isCorrect = false; // Use false instead of null for manual grading
          feedback = 'This question type requires manual grading.';
      }
      
      // If the answer is correct, add points to total score
      if (isCorrect === true) {
        totalScore += question.points;
      }
      
      // Save the answer
      await prisma.assessmentAnswer.create({
        data: {
          question: { connect: { id: questionId } },
          response: { connect: { id: response.id } },
          answer: {
            text: content,
            isCorrect,
            feedback
          }
        },
      });
      
      processedAnswers.push({
        questionId,
        isCorrect,
        feedback,
        correctAnswer: question.correctAnswer,
      });
    }
    
    // Calculate percentage score
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    
    // Generate overall feedback based on score
    let overallFeedback = '';
    if (percentage >= 90) {
      overallFeedback = 'Excellent work! You have demonstrated a thorough understanding of the material.';
    } else if (percentage >= 80) {
      overallFeedback = 'Very good! You have a strong grasp of most concepts.';
    } else if (percentage >= 70) {
      overallFeedback = 'Good job! You understand the key concepts but might benefit from reviewing some areas.';
    } else if (percentage >= 60) {
      overallFeedback = 'You have passed, but there are several areas that need improvement.';
    } else {
      overallFeedback = 'You need to review this material more thoroughly. Focus on the areas where you struggled.';
    }
    
    // Update the response with the score and feedback
    await prisma.assessmentResponse.update({
      where: { id: response.id },
      data: {
        score: totalScore,
        feedback: overallFeedback,
      },
    });
    
    // Return the results
    return NextResponse.json({
      score: totalScore,
      totalPoints,
      percentage,
      passed: percentage >= (assessment.passingScore ?? 70), // Default to 70% if passingScore is null
      feedback: overallFeedback,
      answers: processedAnswers,
    });
    
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the assessment' },
      { status: 500 }
    );
  }
}
