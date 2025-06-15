"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Check, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';

export interface VideoQuestion {
  id: string;
  videoId: string;
  timeCode: number; // in seconds
  question: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching';
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  userId: string;
  videoId: string;
  answer: string | string[];
  isCorrect: boolean;
  attemptCount: number;
  timeSpent: number; // in seconds
  createdAt: Date;
}

interface VideoQuestionSystemProps {
  videoId: string;
  userId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  questions: VideoQuestion[];
  onPause: () => void;
  onPlay: () => void;
  onQuestionAnswered: (response: QuestionResponse) => Promise<void>;
  onQuestionSkipped: (questionId: string) => void;
  previousResponses?: QuestionResponse[];
  showAnswers?: boolean;
  allowSkip?: boolean;
  className?: string;
}

const VideoQuestionSystem: React.FC<VideoQuestionSystemProps> = ({
  videoId,
  userId,
  currentTime,
  duration,
  isPlaying,
  questions,
  onPause,
  onPlay,
  onQuestionAnswered,
  onQuestionSkipped,
  previousResponses = [],
  showAnswers = true,
  allowSkip = true,
  className = ''
}) => {
  // State
  const [activeQuestion, setActiveQuestion] = useState<VideoQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Check for questions at current time
  useEffect(() => {
    if (activeQuestion || !isPlaying) return;

    const questionAtCurrentTime = questions.find(q => {
      // Check if we're within 0.5 seconds of the question timecode
      return Math.abs(q.timeCode - currentTime) < 0.5;
    });

    if (questionAtCurrentTime) {
      // Check if this question has already been answered
      const alreadyAnswered = previousResponses.some(
        response => response.questionId === questionAtCurrentTime.id
      );

      if (!alreadyAnswered) {
        setActiveQuestion(questionAtCurrentTime);
        setStartTime(new Date());
        setAttemptCount(0);
        setSelectedAnswer('');
        setShowFeedback(false);
        setShowHint(false);
        onPause();
      }
    }
  }, [currentTime, isPlaying, questions, activeQuestion, previousResponses, onPause]);

  // Handle answer selection for multiple choice
  const handleMultipleChoiceSelection = (option: string) => {
    setSelectedAnswer(option);
  };

  // Handle answer selection for true/false
  const handleTrueFalseSelection = (value: boolean) => {
    setSelectedAnswer(value ? 'true' : 'false');
  };

  // Handle text input for short answer
  const handleShortAnswerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(e.target.value);
  };

  // Handle matching answers
  const handleMatchingSelection = (index: number, value: string) => {
    const currentAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
    currentAnswers[index] = value;
    setSelectedAnswer(currentAnswers);
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!activeQuestion || !startTime) return;

    setIsSubmitting(true);
    setAttemptCount(prev => prev + 1);

    // Calculate time spent
    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    // Check if answer is correct
    let correct = false;
    if (activeQuestion.questionType === 'multiple-choice' || activeQuestion.questionType === 'true-false') {
      correct = selectedAnswer === activeQuestion.correctAnswer;
    } else if (activeQuestion.questionType === 'short-answer') {
      // For short answer, we'll do a case-insensitive comparison
      // In a real implementation, this might use more sophisticated matching
      const userAnswer = String(selectedAnswer).toLowerCase().trim();
      const correctAnswers = Array.isArray(activeQuestion.correctAnswer)
        ? activeQuestion.correctAnswer.map(a => a.toLowerCase().trim())
        : [String(activeQuestion.correctAnswer).toLowerCase().trim()];
      
      correct = correctAnswers.includes(userAnswer);
    } else if (activeQuestion.questionType === 'matching') {
      // For matching, all pairs must match
      const userAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      const correctAnswers = Array.isArray(activeQuestion.correctAnswer) ? activeQuestion.correctAnswer : [];
      correct = userAnswers.length === correctAnswers.length && 
                userAnswers.every((answer, index) => answer === correctAnswers[index]);
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    // Create response object
    const response: QuestionResponse = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a temporary ID
      questionId: activeQuestion.id,
      userId,
      videoId,
      answer: selectedAnswer,
      isCorrect: correct,
      attemptCount,
      timeSpent,
      createdAt: new Date()
    };

    // Send response to parent component
    try {
      await onQuestionAnswered(response);
    } catch (error) {
      console.error('Failed to record question response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Continue after answering
  const handleContinue = (): void => {
    setActiveQuestion(null);
    setShowFeedback(false);
    onPlay();
  };

  // Skip question
  const handleSkipQuestion = (): void => {
    if (!activeQuestion) return;
    onQuestionSkipped(activeQuestion.id);
    setActiveQuestion(null);
    onPlay();
  };

  // Retry question
  const handleRetryQuestion = (): void => {
    setShowFeedback(false);
    setSelectedAnswer('');
    setStartTime(new Date());
  };

  // Render question based on type
  const renderQuestionContent = (): void => {
    if (!activeQuestion) return null;

    switch (activeQuestion.questionType) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            <p className="text-gray-800 font-medium mb-4">{activeQuestion.question}</p>
            {activeQuestion.options?.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-lg ${
                  selectedAnswer === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } ${
                  showFeedback && option === activeQuestion.correctAnswer
                    ? 'ring-2 ring-green-500'
                    : ''
                } ${
                  showFeedback && selectedAnswer === option && option !== activeQuestion.correctAnswer
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                onClick={() => handleMultipleChoiceSelection(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            <p className="text-gray-800 font-medium mb-4">{activeQuestion.question}</p>
            <div className="flex space-x-4">
              <button
                className={`flex-1 p-3 rounded-lg ${
                  selectedAnswer === 'true'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } ${
                  showFeedback && activeQuestion.correctAnswer === 'true'
                    ? 'ring-2 ring-green-500'
                    : ''
                } ${
                  showFeedback && selectedAnswer === 'true' && activeQuestion.correctAnswer !== 'true'
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                onClick={() => handleTrueFalseSelection(true)}
                disabled={showFeedback}
              >
                True
              </button>
              <button
                className={`flex-1 p-3 rounded-lg ${
                  selectedAnswer === 'false'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } ${
                  showFeedback && activeQuestion.correctAnswer === 'false'
                    ? 'ring-2 ring-green-500'
                    : ''
                } ${
                  showFeedback && selectedAnswer === 'false' && activeQuestion.correctAnswer !== 'false'
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                onClick={() => handleTrueFalseSelection(false)}
                disabled={showFeedback}
              >
                False
              </button>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-3">
            <p className="text-gray-800 font-medium mb-4">{activeQuestion.question}</p>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg ${
                showFeedback && isCorrect
                  ? 'border-green-500 bg-green-50'
                  : showFeedback && !isCorrect
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="Type your answer here..."
              value={selectedAnswer as string}
              onChange={handleShortAnswerInput}
              disabled={showFeedback}
            />
            {showFeedback && (
              <div className="mt-2">
                <p className="font-medium">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && showAnswers && (
                  <p className="text-sm text-gray-600 mt-1">
                    Correct answer: {Array.isArray(activeQuestion.correctAnswer) 
                      ? activeQuestion.correctAnswer.join(' or ') 
                      : activeQuestion.correctAnswer}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-3">
            <p className="text-gray-800 font-medium mb-4">{activeQuestion.question}</p>
            {activeQuestion.options?.map((option, index) => {
              // Assuming options are in format "left|right" for matching pairs
              const [left, right] = option.split('|');
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1/2 p-2 bg-gray-100 rounded">{left}</div>
                  <div className="w-1/2">
                    <select
                      className={`w-full p-2 border rounded ${
                        showFeedback && Array.isArray(activeQuestion.correctAnswer) && 
                        Array.isArray(selectedAnswer) && 
                        selectedAnswer[index] === activeQuestion.correctAnswer[index]
                          ? 'border-green-500 bg-green-50'
                          : showFeedback && Array.isArray(activeQuestion.correctAnswer) && 
                            Array.isArray(selectedAnswer) && 
                            selectedAnswer[index] !== activeQuestion.correctAnswer[index]
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      value={Array.isArray(selectedAnswer) ? selectedAnswer[index] || '' : ''}
                      onChange={(e: any) => handleMatchingSelection(index, e.target.value)}
                      disabled={showFeedback}
                    >
                      <option value="">Select a match</option>
                      {activeQuestion.options?.map((opt, i) => {
                        const [, rightOption] = opt.split('|');
                        return (
                          <option key={i} value={rightOption}>
                            {rightOption}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return <p>Unsupported question type</p>;
    }
  };

  // Render feedback
  const renderFeedback = (): void => {
    if (!activeQuestion || !showFeedback) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-start">
          {isCorrect ? (
            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          ) : (
            <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          )}
          <div>
            <h4 className="font-medium text-gray-800">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
            {activeQuestion.explanation && (
              <p className="text-sm text-gray-600 mt-1">{activeQuestion.explanation}</p>
            )}
            {!isCorrect && showAnswers && activeQuestion.questionType !== 'short-answer' && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Correct answer: </span>
                {Array.isArray(activeQuestion.correctAnswer) 
                  ? activeQuestion.correctAnswer.join(', ') 
                  : activeQuestion.correctAnswer}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render question indicators on timeline
  const renderQuestionIndicators = (): void => {
    return questions.map(question => {
      const position = (question.timeCode / duration) * 100;
      const isAnswered = previousResponses.some(response => response.questionId === question.id);
      
      return (
        <div 
          key={question.id}
          className={`absolute w-3 h-3 rounded-full ${
            isAnswered ? 'bg-green-500' : 'bg-yellow-500'
          } hover:scale-125 transition-all cursor-pointer -translate-x-1/2 -translate-y-1/2`}
          style={{ left: `${position}%`, top: '50%' }}
          title={`Question at ${formatTime(question.timeCode)}`}
        />
      );
    });
  };

  // If no active question, just render the timeline
  if (!activeQuestion) {
    return (
      <div className={`relative ${className}`}>
        <div className="h-6 bg-gray-200 rounded-full relative">
          {renderQuestionIndicators()}
        </div>
      </div>
    );
  }

  // Render the question dialog
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Question at {formatTime(activeQuestion.timeCode)}</h3>
          </div>
          {allowSkip && (
            <button 
              className="text-white hover:text-gray-200"
              onClick={handleSkipQuestion}
              aria-label="Skip question"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          {renderQuestionContent()}
          {renderFeedback()}
          
          {!showFeedback && (
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmitAnswer}
                disabled={
                  isSubmitting || 
                  selectedAnswer === '' || 
                  (Array.isArray(selectedAnswer) && selectedAnswer.some(a => !a))
                }
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          )}
          
          {showHint && !showFeedback && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start">
              <HelpCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {activeQuestion.questionType === 'multiple-choice' && 'Consider the key concepts discussed in this section of the video.'}
                {activeQuestion.questionType === 'true-false' && 'Think about whether the statement aligns with what was presented in the video.'}
                {activeQuestion.questionType === 'short-answer' && 'Try to recall the specific terminology used in the video.'}
                {activeQuestion.questionType === 'matching' && 'Focus on the relationships between concepts presented in the video.'}
              </p>
            </div>
          )}
          
          {showFeedback && (
            <div className="flex justify-end mt-6">
              {!isCorrect && attemptCount < 2 && (
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-3"
                  onClick={handleRetryQuestion}
                >
                  Try Again
                </button>
              )}
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                onClick={handleContinue}
              >
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoQuestionSystem;