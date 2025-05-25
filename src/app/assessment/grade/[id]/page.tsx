'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs } from '@/components/ui/tabs';
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

export default function ManualGradingPage(): React.ReactNode {
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
      try {
        // Fetch the response with assessment and answers
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
      } catch (err: any) {
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
      const updatedRes = await fetch(`/api/assessment/response/${params.id}`);
      const updatedData = await updatedRes.json();
      setResponse(updatedData);
    } catch (err: any) {
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
    } catch (err: any) {
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
                <p className="p-3 bg-grey-50 rounded-md">{question.expectedAnswer}</p>
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
      return <p className="text-grey-500">No answer provided</p>;
    }
    
    switch (question.type) {
      case 'multiple-choice':
        if (!Array.isArray(answer.content) || answer.content.length === 0) {
          return <p className="text-grey-500">No option selected</p>;
        }
        
        return (
          <ul className="list-disc pl-5">
            {answer.content.map((optionId) => {
              const option = question.options?.find(o => o.id === optionId);
              return option ? (
                <li key={optionId} className={option.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {option.text} {option.isCorrect ? '✓' : '✗'}
                </li>
              ) : null;
            })}
          </ul>
        );
        
      case 'open-ended':
        return typeof answer.content === 'string' ? (
          <div className="p-3 bg-grey-50 rounded-md whitespace-pre-wrap">
            {answer.content || <span className="text-grey-500">No answer provided</span>}
          </div>
        ) : (
          <p className="text-grey-500">Invalid answer format</p>
        );
        
      case 'matching':
        if (!answer.content || Object.keys(answer.content).length === 0) {
          return <p className="text-grey-500">No matches provided</p>;
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
                  {leftItem.left} → {rightItem.right} {isCorrect ? '✓' : '✗'}
                </li>
              ) : null;
            })}
          </ul>
        );
        
      case 'file-upload':
        if (!answer.content) {
          return <p className="text-grey-500">No file uploaded</p>;
        }
        
        if (typeof answer.content === 'object' && answer.content.filename) {
          return (
            <div className="flex items-centre">
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
        
        return <p className="text-grey-500">File information not available</p>;
        
      default:
        return <p className="text-grey-500">Unsupported answer format</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
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
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Grade Assessment Response</h1>
          <div className="flex items-centre space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPassing ? 'Passing' : 'Not Passing'}
            </span>
          </div>
        </div>
        <p className="mt-2 text-grey-600">
          {assessment.title} - Submitted by {response.user.name}
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success" className="mb-6">
          Grades saved successfully!
        </Alert>
      )}

      <div className="mb-6">
        <SimpleTabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'grade', label: 'Grade Questions' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        {activeTab === 'overview' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Assessment Overview</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Assessment Details</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Title:</dt>
                      <dd>{assessment.title}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Subject:</dt>
                      <dd>{assessment.subject}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Key Stage:</dt>
                      <dd>{assessment.keyStage}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Type:</dt>
                      <dd>{assessment.type}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Questions:</dt>
                      <dd>{assessment.questions.length}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Total Points:</dt>
                      <dd>{totalPoints}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Passing Score:</dt>
                      <dd>{assessment.passingScore}%</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Response Details</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Student:</dt>
                      <dd>{response.user.name}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Email:</dt>
                      <dd>{response.user.email}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Started:</dt>
                      <dd>{new Date(response.startedAt).toLocaleString()}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Completed:</dt>
                      <dd>{new Date(response.completedAt).toLocaleString()}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Current Score:</dt>
                      <dd className="font-semibold">
                        {currentTotalScore} / {totalPoints} ({scorePercentage}%)
                      </dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium text-grey-600">Status:</dt>
                      <dd>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isPassing ? 'Passing' : 'Not Passing'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Questions Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-grey-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Question</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Points</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-grey-200">
                      {assessment.questions.map((question, index) => {
                        const answer = response.answers.find(a => a.questionId === question.id);
                        const grade = grades[question.id] || { score: 0, feedback: '' };
                        const isGraded = answer && (answer.isCorrect !== null || grade.score > 0);
                        
                        return (
                          <tr key={question.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-grey-900">
                                Question {index + 1}
                              </div>
                              <div className="text-sm text-grey-500 truncate max-w-xs">
                                {question.content.length > 50 ? `${question.content.substring(0, 50)}...` : question.content}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-grey-500">
                              {question.type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-grey-500">
                              {question.points}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {grade.score} / {question.points}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {isGraded ? (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  grade.score > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {grade.score > 0 ? 'Correct' : 'Incorrect'}
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Needs Grading
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setCurrentQuestionIndex(index);
                                  setActiveTab('grade');
                                }}
                              >
                                {isGraded ? 'Review' : 'Grade'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => setActiveTab('grade')}
                className="ml-2"
              >
                Grade Questions
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'grade' && currentQuestion && (
          <div className="space-y-6">
            <div className="flex items-centre justify-between mb-4">
              <div className="flex items-centre">
                <span className="text-lg font-medium">
                  Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-grey-100 text-grey-800">
                  {currentQuestion.type}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(assessment.questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === assessment.questions.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Question</h3>
              </CardHeader>
              <CardContent>
                {renderQuestionContent(currentQuestion)}
                <div className="mt-4">
                  <p className="font-medium text-grey-600">
                    Points: {currentQuestion.points}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Student&apos;s Answer</h3>
              </CardHeader>
              <CardContent>
                {renderStudentAnswer(currentQuestion, currentAnswer)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <h3 className="text-lg font-semibold">Grading</h3>
                  {currentQuestion.type === 'open-ended' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateAiFeedback(currentQuestion.id)}
                      disabled={isGeneratingAiSuggestion === currentQuestion.id}
                    >
                      {isGeneratingAiSuggestion === currentQuestion.id ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Generating...
                        </>
                      ) : (
                        'Generate AI Feedback'
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {aiSuggestions[currentQuestion.id] && (
                  <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-centre mb-2">
                      <h4 className="font-medium text-blue-800">AI Suggested Grading</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyAiSuggestion(currentQuestion.id)}
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-grey-600">Suggested Score:</p>
                      <p>{aiSuggestions[currentQuestion.id].score} / {currentQuestion.points}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-grey-600">Suggested Feedback:</p>
                      <p className="text-sm">{aiSuggestions[currentQuestion.id].feedback}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="score" className="block text-sm font-medium text-grey-700 mb-1">
                      Score (0-{currentQuestion.points})
                    </label>
                    <input
                      type="number"
                      id="score"
                      min="0"
                      max={currentQuestion.points}
                      value={grades[currentQuestion.id]?.score || 0}
                      onChange={(e) => handleScoreChange(currentQuestion.id, parseInt(e.target.value, 10))}
                      className="w-24 px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-grey-700 mb-1">
                      Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      value={grades[currentQuestion.id]?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(currentQuestion.id, e.target.value)}
                      className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Provide feedback to the student..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('overview')}
              >
                Back to Overview
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(assessment.questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === assessment.questions.length - 1}
                >
                  Next Question
                </Button>
                <Button
                  onClick={handleSaveGrades}
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" /> : 'Save All Grades'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
