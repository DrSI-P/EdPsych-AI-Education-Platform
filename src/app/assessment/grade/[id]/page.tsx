'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs } from '@/components/ui/tabs';
import { aiService } from '@/lib/ai/ai-service';

interface Question {
  id: string;
  type: string;
  content: string;
  options?: any[];
  items?: any[];
  allowedFileTypes?: string[];
  maxFileSize?: number;
  wordLimit?: number;
  points: number;
  order: number;
  expectedAnswer?: string;
}

interface Answer {
  id: string;
  questionId: string;
  content: any;
  isCorrect: boolean | null;
  feedback: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Response {
  id: string;
  userId: string;
  assessmentId: string;
  score: number | null;
  feedback: string | null;
  startedAt: string;
  completedAt: string;
  user: User;
  answers: Answer[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  keyStage: string;
  timeLimit: number;
  passingScore: number;
  showResults: boolean;
  randomizeQuestions: boolean;
  allowRetakes: boolean;
  status: string;
  questions: Question[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManualGradingPage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [grades, setGrades] = useState<Record<string, { score: number; feedback: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, { score: number; feedback: string }>>({});
  const [isGeneratingAiSuggestion, setIsGeneratingAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params || !params.id) {
        setError('Assessment ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch the response with assessment and answers
        if (!params || !params.id) {
          throw new Error('Assessment ID is missing');
        }
        
        const responseRes = await fetch(`/api/assessment/response/${params.id}`);
        
        if (!responseRes.ok) {
          throw new Error('Failed to fetch response');
        }
        
        const responseData = await responseRes.json();
        setResponse(responseData);
        
        // Fetch the assessment with questions
        const assessmentRes = await fetch(`/api/assessment/${responseData.assessmentId}`);
        
        if (!assessmentRes.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const assessmentData = await assessmentRes.json();
        setAssessment(assessmentData);
        
        // Initialize grades from existing answers
        const initialGrades: Record<string, { score: number; feedback: string }> = {};
        
        responseData.answers.forEach((answer: Answer) => {
          const question = assessmentData.questions.find((q: Question) => q.id === answer.questionId);
          
          if (question) {
            initialGrades[answer.questionId] = {
              score: answer.isCorrect === true ? question.points : 
                     answer.isCorrect === false ? 0 : 
                     answer.isCorrect === null ? 0 : 0,
              feedback: answer.feedback || ''
            };
          }
        });
        
        setGrades(initialGrades);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching the data');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleScoreChange = (questionId: string, score: number) => {
    const question = assessment?.questions.find(q => q.id === questionId);
    
    if (question) {
      // Ensure score is within valid range
      const validScore = Math.min(Math.max(0, score), question.points);
      
      setGrades(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          score: validScore
        }
      }));
    }
  };

  const handleFeedbackChange = (questionId: string, feedback: string) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        feedback
      }
    }));
  };

  const handleSaveGrades = async () => {
    if (!assessment || !response) return;
    
    setIsSaving(true);
    setError('');
    setSaveSuccess(false);
    
    try {
      // Calculate total score
      const totalScore = Object.entries(grades).reduce((sum, [questionId, grade]) => {
        return sum + grade.score;
      }, 0);
      
      // Prepare data for submission
      const gradesData = Object.entries(grades).map(([questionId, grade]) => ({
        answerId: response.answers.find(a => a.questionId === questionId)?.id,
        score: grade.score,
        feedback: grade.feedback,
        isCorrect: grade.score > 0
      }));
      
      // Submit grades
      const res = await fetch(`/api/assessment/response/${response.id}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grades: gradesData,
          totalScore
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to save grades');
      }
      
      setSaveSuccess(true);
      
      // Refresh response data
      if (params && params.id) {
        const responseId = params.id; // Store in a local variable to satisfy TypeScript
        const updatedRes = await fetch(`/api/assessment/response/${responseId}`);
        const updatedData = await updatedRes.json();
        setResponse(updatedData);
      }
    } catch (err) {
      console.error('Error saving grades:', err);
      setError('An error occurred while saving the grades');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAiFeedback = async (questionId: string) => {
    if (!assessment || !response) return;
    
    const question = assessment.questions.find(q => q.id === questionId);
    const answer = response.answers.find(a => a.questionId === questionId);
    
    if (!question || !answer) return;
    
    setIsGeneratingAiSuggestion(questionId);
    
    try {
      // Only generate AI feedback for open-ended questions
      if (question.type === 'open-ended' && typeof answer.content === 'string') {
        const aiEvaluation = await aiService.evaluateOpenEndedAnswer({
          question: question.content,
          expectedAnswer: question.expectedAnswer || '',
          studentAnswer: answer.content,
          maxScore: question.points
        });
        
        setAiSuggestions(prev => ({
          ...prev,
          [questionId]: {
            score: aiEvaluation.score,
            feedback: aiEvaluation.feedback
          }
        }));
      }
    } catch (err) {
      console.error('Error generating AI feedback:', err);
    } finally {
      setIsGeneratingAiSuggestion(null);
    }
  };

  const handleApplyAiSuggestion = (questionId: string) => {
    const suggestion = aiSuggestions[questionId];
    
    if (suggestion) {
      setGrades(prev => ({
        ...prev,
        [questionId]: {
          score: suggestion.score,
          feedback: suggestion.feedback
        }
      }));
    }
  };

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="mb-4">{question.content}</p>
            <p className="font-medium mb-2">Options:</p>
            <ul className="list-disc pl-5 mb-4">
              {question.options?.map((option) => (
                <li key={option.id} className={option.isCorrect ? 'text-green-600 font-medium' : ''}>
                  {option.text} {option.isCorrect && '(Correct)'}
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'open-ended':
        return (
          <div className="mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="mb-4">{question.content}</p>
            {question.expectedAnswer && (
              <div className="mb-4">
                <p className="font-medium mb-2">Expected Answer:</p>
                <p className="p-3 bg-gray-50 rounded-md">{question.expectedAnswer}</p>
              </div>
            )}
          </div>
        );
        
      case 'matching':
        return (
          <div className="mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="mb-4">{question.content}</p>
            <p className="font-medium mb-2">Matching Pairs:</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium mb-2">Left Items</p>
                <ul className="list-disc pl-5">
                  {question.items?.map((item) => (
                    <li key={item.id}>{item.left}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Right Items</p>
                <ul className="list-disc pl-5">
                  {question.items?.map((item) => (
                    <li key={item.id}>{item.right}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'file-upload':
        return (
          <div className="mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="mb-4">{question.content}</p>
            <p className="font-medium mb-2">Allowed File Types:</p>
            <p>{question.allowedFileTypes?.join(', ')}</p>
          </div>
        );
        
      default:
        return (
          <div className="mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p>{question.content}</p>
          </div>
        );
    }
  };

  const renderStudentAnswer = (question: Question, answer: Answer | undefined) => {
    if (!answer) {
      return <p className="text-gray-500">No answer provided</p>;
    }
    
    switch (question.type) {
      case 'multiple-choice':
        if (!Array.isArray(answer.content) || answer.content.length === 0) {
          return <p className="text-gray-500">No option selected</p>;
        }
        
        return (
          <ul className="list-disc pl-5">
            {answer.content.map((optionId) => {
              const option = question.options?.find(o => o.id === optionId);
              return option ? (
                <li key={optionId} className={option.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {option.text} {option.isCorrect ? '\u2713' : '\u2717'}
                </li>
              ) : null;
            })}
          </ul>
        );
        
      case 'open-ended':
        return typeof answer.content === 'string' ? (
          <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
            {answer.content || <span className="text-gray-500">No answer provided</span>}
          </div>
        ) : (
          <p className="text-gray-500">Invalid answer format</p>
        );
        
      case 'matching':
        if (!answer.content || Object.keys(answer.content).length === 0) {
          return <p className="text-gray-500">No matches provided</p>;
        }
        
        return (
          <ul className="list-disc pl-5">
            {Object.entries(answer.content).map(([leftId, rightId]) => {
              const leftItem = question.items?.find(item => item.id === leftId);
              const rightItem = question.items?.find(item => item.id === rightId);
              const correctRightId = question.items?.find(item => item.id === leftId)?.id;
              const isCorrect = rightId === correctRightId;
              
              return leftItem && rightItem ? (
                <li key={leftId} className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {leftItem.left} -&gt; {rightItem.right} {isCorrect ? '\u2713' : '\u2717'}
                </li>
              ) : null;
            })}
          </ul>
        );
        
      case 'file-upload':
        if (!answer.content) {
          return <p className="text-gray-500">No file uploaded</p>;
        }
        
        if (typeof answer.content === 'object' && answer.content.filename) {
          return (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{answer.content.filename}</span>
              {answer.content.data && (
                <a 
                  href={answer.content.data} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  View
                </a>
              )}
            </div>
          );
        }
        
        return <p className="text-gray-500">File information not available</p>;
        
      default:
        return <p className="text-gray-500">Unsupported answer format</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!assessment || !response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" className="mb-6">
          Assessment response not found
        </Alert>
        <Button onClick={() => router.push('/assessment')}>
          Go to Assessments
        </Button>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const currentAnswer = response.answers.find(a => a.questionId === currentQuestion?.id);
  const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const currentTotalScore = Object.values(grades).reduce((sum, grade) => sum + grade.score, 0);
  const scorePercentage = Math.round((currentTotalScore / totalPoints) * 100);
  const isPassing = scorePercentage >= assessment.passingScore;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Grade Assessment Response</h1>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPassing ? 'Passing' : 'Not Passing'}
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          {assessment.title} - Submitted by {response.user.name}
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success" className="mb-6">
          Grades saved successfully!
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'question-by-question', label: 'Question by Question' },
            ]}
            activeTab={activeTab}
            onChange={(value) => {
              if (typeof value === 'string') {
                setActiveTab(value);
              }
            }}
            className="mb-6"
          />

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Student</p>
                    <p className="text-base font-medium text-gray-900">{response.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(response.completedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Score</p>
                    <p className="text-base font-medium text-gray-900">
                      {currentTotalScore}/{totalPoints} ({scorePercentage}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Questions Overview</h2>
                
                {assessment.questions.map((question, index) => {
                  const answer = response.answers.find(a => a.questionId === question.id);
                  const grade = grades[question.id];
                  
                  return (
                    <div key={question.id} className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {grade?.score || 0}/{question.points} points
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentQuestionIndex(index);
                              setActiveTab('question-by-question');
                            }}
                          >
                            Grade
                          </Button>
                        </div>
                      </div>
                      
                      <p className="mb-2 line-clamp-1">{question.content}</p>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span> {question.type.replace('-', ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t">
                <div className="mb-4">
                  <label htmlFor="overall-feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Feedback
                  </label>
                  <textarea
                    id="overall-feedback"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide overall feedback for the student"
                    value={response.feedback || ''}
                    onChange={(e) => {
                      // This would need an API endpoint to update overall feedback
                      // For now, just update the local state
                      setResponse({
                        ...response,
                        feedback: e.target.value
                      });
                    }}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveGrades}
                    disabled={isSaving}
                  >
                    {isSaving ? <Spinner size="sm" className="mr-2" /> : null}
                    Save Grades
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'question-by-question' && currentQuestion && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Question {currentQuestionIndex + 1} of {assessment.questions.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.min(assessment.questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === assessment.questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {currentQuestion.type.replace('-', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Question</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    {renderQuestionContent(currentQuestion)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Student's Answer</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    {renderStudentAnswer(currentQuestion, currentAnswer)}
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-4">Grading</h3>
                
                <div className="mb-4">
                  <label htmlFor="question-score" className="block text-sm font-medium text-gray-700 mb-1">
                    Score (out of {currentQuestion.points})
                  </label>
                  <input
                    id="question-score"
                    type="number"
                    min="0"
                    max={currentQuestion.points}
                    value={grades[currentQuestion.id]?.score || 0}
                    onChange={(e) => handleScoreChange(currentQuestion.id, parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="question-feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    id="question-feedback"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide feedback for this answer"
                    value={grades[currentQuestion.id]?.feedback || ''}
                    onChange={(e) => handleFeedbackChange(currentQuestion.id, e.target.value)}
                  ></textarea>
                </div>
                
                {currentQuestion.type === 'open-ended' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-800">AI Grading Assistance</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateAiFeedback(currentQuestion.id)}
                        disabled={isGeneratingAiSuggestion === currentQuestion.id}
                      >
                        {isGeneratingAiSuggestion === currentQuestion.id ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : null}
                        Generate AI Suggestion
                      </Button>
                    </div>
                    
                    {aiSuggestions[currentQuestion.id] ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-blue-800">Suggested Score:</span>
                          <span className="ml-2">{aiSuggestions[currentQuestion.id].score}/{currentQuestion.points}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-800">Suggested Feedback:</span>
                          <p className="text-sm mt-1 p-2 bg-white rounded">
                            {aiSuggestions[currentQuestion.id].feedback}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplyAiSuggestion(currentQuestion.id)}
                        >
                          Apply AI Suggestion
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-800">
                        Generate AI suggestions to help grade this open-ended response.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('overview')}
                >
                  Back to Overview
                </Button>
                <Button
                  onClick={handleSaveGrades}
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" className="mr-2" /> : null}
                  Save Grades
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
