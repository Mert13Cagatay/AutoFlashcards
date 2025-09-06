'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FileText, Brain, Sparkles, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DragDropZone from '@/components/upload/drag-drop-zone';
import { generateFlashcards } from '@/lib/openai';
import { useAppStore, AppFlashcard } from '@/lib/store';
import { saveFlashcards } from '@/lib/supabase';
import Navbar from '@/components/layout/navbar';

const UploadPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { addFlashcards, setIsGenerating, setGenerationProgress, generationProgress, startStudySession } = useAppStore();
  
  const [currentStep, setCurrentStep] = useState<'upload' | 'options' | 'generating' | 'complete'>('upload');
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [generationOptions, setGenerationOptions] = useState({
    count: 10,
    difficulty: 'mixed' as 'easy' | 'medium' | 'hard' | 'mixed',
    categories: [] as string[],
  });
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);

  const handleFilesAccepted = async (files: File[]) => {
    setIsGenerating(true);
    setGenerationProgress(10);

    try {
      // Process files to extract text
      let extractedText = '';
      
      for (const file of files) {
        setGenerationProgress(20);
        
        if (file.type === 'text/plain' || file.type === 'text/markdown') {
          const text = await file.text();
          extractedText += text + '\n\n';
        } else if (file.type === 'application/pdf') {
          // For now, show a message that PDF processing needs additional setup
          extractedText += `[PDF File: ${file.name}]\nPDF text extraction requires additional setup. Please copy and paste the text content instead.\n\n`;
        } else {
          extractedText += `[File: ${file.name}]\nUnsupported file type. Please copy and paste the text content.\n\n`;
        }
      }

      setUploadedContent(extractedText);
      setGenerationProgress(30);
      setCurrentStep('options');
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleTextInput = (text: string) => {
    setUploadedContent(text);
    setCurrentStep('options');
  };

  const handleGenerateFlashcards = async () => {
    if (!uploadedContent.trim()) return;

    setCurrentStep('generating');
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      setGenerationProgress(20);
      
      // Check if OpenAI API key is available
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.');
      }

      setGenerationProgress(40);

      const flashcards = await generateFlashcards({
        text: uploadedContent,
        count: generationOptions.count,
        difficulty: generationOptions.difficulty,
        categories: generationOptions.categories,
      });

      setGenerationProgress(80);

      // Save to database with user_id
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const flashcardsForDB = flashcards.map(card => ({
        ...card,
        user_id: user.id,
        review_count: 0,
        success_count: 0,
      }));

      const savedFlashcards = await saveFlashcards(flashcardsForDB);
      
      if (savedFlashcards.length === 0) {
        throw new Error('Failed to save flashcards to database');
      }

      // Convert to app format and add to store
      const appFlashcards = savedFlashcards.map(card => ({
        ...card,
        id: card.id,
        created_at: card.created_at,
        updated_at: card.updated_at,
        review_count: card.review_count,
        success_count: card.success_count,
      }));

      setGeneratedFlashcards(appFlashcards);
      addFlashcards(appFlashcards);

      setGenerationProgress(100);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate flashcards. Please try again.');
      setCurrentStep('options');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleStartStudying = () => {
    if (generatedFlashcards.length > 0) {
      // Start study session with only the newly generated flashcards
      const flashcardsAsAppFlashcards = generatedFlashcards as AppFlashcard[];
      startStudySession(
        flashcardsAsAppFlashcards, 
        `New Flashcards Study - ${flashcardsAsAppFlashcards.length} cards`
      );
      router.push('/study');
    }
  };

  const steps = [
    { id: 'upload', label: 'Upload Notes', icon: FileText },
    { id: 'options', label: 'Options', icon: Settings },
    { id: 'generating', label: 'AI Processing', icon: Brain },
    { id: 'complete', label: 'Ready to Study', icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : isCompleted 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    isActive || isCompleted 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-8 w-12 h-0.5 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Upload Your Study Notes
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Transform your notes into smart flashcards with AI
                </p>
              </div>
              
              <DragDropZone
                onFilesAccepted={handleFilesAccepted}
                onTextInput={handleTextInput}
                isProcessing={false}
              />
            </div>
          )}

          {currentStep === 'options' && (
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Customize Your Flashcards
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Adjust settings to create the perfect study set
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Flashcards
                    </label>
                    <select
                      value={generationOptions.count}
                      onChange={(e) => setGenerationOptions(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value={5}>5 cards</option>
                      <option value={10}>10 cards</option>
                      <option value={15}>15 cards</option>
                      <option value={20}>20 cards</option>
                      <option value={30}>30 cards</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={generationOptions.difficulty}
                      onChange={(e) => setGenerationOptions(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="mixed">Mixed Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Preview
                  </label>
                  <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded border text-sm text-gray-700 dark:text-gray-300">
                    {uploadedContent.substring(0, 500)}
                    {uploadedContent.length > 500 && '...'}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('upload')}
                  >
                    Back to Upload
                  </Button>
                  <Button
                    onClick={handleGenerateFlashcards}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Generate Flashcards
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 'generating' && (
            <Card className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-blue flex items-center justify-center animate-pulse">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    AI is Creating Your Flashcards
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    This usually takes 30-60 seconds...
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {generationProgress}% complete
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>🧠 Analyzing your content...</p>
                  <p>📝 Generating questions and answers...</p>
                  <p>🏷️ Categorizing and tagging...</p>
                  <p>✨ Optimizing for learning...</p>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 'complete' && (
            <Card className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-green flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Flashcards Are Ready!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Successfully generated {generatedFlashcards.length} flashcards from your notes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {generatedFlashcards.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cards Generated</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {new Set(generatedFlashcards.map(card => card.category)).size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      AI
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Powered</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                  >
                    View Dashboard
                  </Button>
                  <Button
                    onClick={handleStartStudying}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Start Studying
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default UploadPage;
