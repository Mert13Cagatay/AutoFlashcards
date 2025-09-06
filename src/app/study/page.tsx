'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trophy,
  BarChart3,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Flashcard from '@/components/flashcard/flashcard';
import { useStudySession, useAppStore } from '@/lib/store';

const StudyPage = () => {
  const router = useRouter();
  const {
    currentCard,
    currentCardIndex,
    studyCards,
    showAnswer: isAnswerVisible,
    correctAnswers,
    incorrectAnswers,
    sessionStartTime,
    progress,
    accuracy,
    showAnswerAction,
    hideAnswer,
    nextCard,
    previousCard,
    markCardCorrect,
    markCardIncorrect,
    resetStudySession,
    endStudySession,
  } = useStudySession();

  const { flashcards, startStudySession } = useAppStore();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [studyTime, setStudyTime] = useState(0);

  // Redirect to dashboard if no study session exists
  useEffect(() => {
    if (!currentCard && studyCards.length === 0) {
      // No active study session, redirect to dashboard
      router.push('/dashboard');
    }
  }, [currentCard, studyCards.length, router]);

  // Track study time
  useEffect(() => {
    if (sessionStartTime && !sessionEnded) {
      const startTime = new Date(sessionStartTime);
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setStudyTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionStartTime, sessionEnded]);

  // Check if session is complete
  useEffect(() => {
    if (studyCards.length > 0 && 
        currentCardIndex >= studyCards.length - 1 && 
        (correctAnswers + incorrectAnswers) >= studyCards.length &&
        !sessionEnded) {
      setSessionEnded(true);
    }
  }, [currentCardIndex, studyCards.length, correctAnswers, incorrectAnswers, sessionEnded]);

  // Handle session end
  useEffect(() => {
    if (sessionEnded) {
      endStudySession();
    }
  }, [sessionEnded, endStudySession]);

  const handleCorrect = () => {
    markCardCorrect();
    hideAnswer();
    setTimeout(() => {
      if (currentCardIndex < studyCards.length - 1) {
        nextCard();
      }
    }, 300);
  };

  const handleIncorrect = () => {
    markCardIncorrect();
    hideAnswer();
    setTimeout(() => {
      if (currentCardIndex < studyCards.length - 1) {
        nextCard();
      }
    }, 300);
  };

  const handleRestart = () => {
    resetStudySession();
    setSessionEnded(false);
    setStudyTime(0);
    if (flashcards.length > 0) {
      startStudySession(flashcards.slice(0, 10), 'Quick Study Session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show setup screen if no cards
  if (!currentCard && flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto relative">
              <Image
                src="/mascot.png"
                alt="AutoFlashcards Mascot"
                width={64}
                height={64}
                className="rounded-full object-contain"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                No Flashcards to Study
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload some notes first to generate flashcards and start studying.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.push('/upload')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Upload Notes
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show session complete screen
  if (sessionEnded) {
    const finalAccuracy = correctAnswers + incorrectAnswers > 0 ? (correctAnswers / (correctAnswers + incorrectAnswers)) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Card className="p-8 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full gradient-green flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Study Session Complete!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Great job! Here&apos;s how you performed:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {studyCards.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cards Studied</div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(finalAccuracy)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {formatTime(studyTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-left">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Correct Answers</span>
                  <span>{correctAnswers} / {studyCards.length}</span>
                </div>
                <Progress value={(correctAnswers / studyCards.length) * 100} className="h-2" />
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Progress
              </Button>
              
              <Button
                onClick={handleRestart}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Study Again
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Main study interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(studyTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>{Math.round(accuracy)}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Card {currentCardIndex + 1} of {studyCards.length}</span>
              <span>{correctAnswers} correct, {incorrectAnswers} incorrect</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Flashcard Display */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-2xl">
            {currentCard && (
              <Flashcard
                flashcard={currentCard}
                showAnswer={isAnswerVisible}
                onFlip={() => isAnswerVisible ? hideAnswer() : showAnswerAction()}
                size="large"
                className="transform transition-all duration-300 hover:scale-[1.02]"
              />
            )}
          </div>
        </div>

        {/* Study Controls */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {/* Previous Card */}
            <Button
              variant="outline"
              onClick={previousCard}
              disabled={currentCardIndex === 0}
              className="h-12 w-12 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Flip Card */}
            <Button
              variant="outline"
              onClick={() => isAnswerVisible ? hideAnswer() : showAnswerAction()}
              className="h-12 px-6"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {isAnswerVisible ? 'Show Question' : 'Show Answer'}
            </Button>

            {/* Answer Buttons (only show when answer is visible) */}
            {isAnswerVisible && (
              <>
                <Button
                  onClick={handleIncorrect}
                  variant="outline"
                  className="h-12 px-6 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Incorrect
                </Button>
                
                <Button
                  onClick={handleCorrect}
                  className="h-12 px-6 bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Correct
                </Button>
              </>
            )}

            {/* Next Card */}
            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentCardIndex >= studyCards.length - 1}
              className="h-12 w-12 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Tip: Be honest with yourself when marking answers correct or incorrect
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
