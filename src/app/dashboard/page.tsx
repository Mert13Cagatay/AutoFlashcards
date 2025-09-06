'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Play,
  BookOpen,
  Brain,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Flashcard from '@/components/flashcard/flashcard';
import { useFlashcards, useAppStore } from '@/lib/store';
import { useConfirmDialog } from '@/components/ui/confirm-dialog';
import { confirmationPreferences } from '@/lib/utils';
import { getFlashcards } from '@/lib/supabase';
import Navbar from '@/components/layout/navbar';
import Mascot from '@/components/ui/mascot';

const DashboardPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    flashcards,
    categories,
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setSortOrder,
  } = useFlashcards();

  // Get setFlashcards from main store
  const setFlashcards = useAppStore((state) => state.setFlashcards);

  // Actions'ları ayrı ayrı al - shallow kullanma
  const startStudySession = useAppStore((state) => state.startStudySession);
  const removeFlashcard = useAppStore((state) => state.removeFlashcard);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Confirmation dialog
  const { showConfirm, ConfirmDialogComponent } = useConfirmDialog();

  // Load user's flashcards on mount
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!isLoaded) {
        return;
      }
      
      if (!user?.id) {
        // Clear any existing flashcards if user is not logged in
        setFlashcards([]);
        setIsLoading(false);
        return;
      }

      try {
        const userFlashcards = await getFlashcards(user.id);
        setFlashcards(userFlashcards);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [isLoaded, user?.id, setFlashcards]);

  // Filter and sort flashcards
  const filteredFlashcards = useMemo(() => {
    let filtered = [...flashcards];

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(card => card.difficulty === selectedDifficulty);
    }

    return filtered;
  }, [flashcards, selectedDifficulty]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = flashcards.length;
    const easy = flashcards.filter(card => card.difficulty === 'easy').length;
    const medium = flashcards.filter(card => card.difficulty === 'medium').length;
    const hard = flashcards.filter(card => card.difficulty === 'hard').length;
    const totalReviews = flashcards.reduce((sum, card) => sum + card.review_count, 0);
    const totalSuccess = flashcards.reduce((sum, card) => sum + card.success_count, 0);
    const averageAccuracy = totalReviews > 0 ? (totalSuccess / totalReviews) * 100 : 0;

    return { total, easy, medium, hard, totalReviews, averageAccuracy };
  }, [flashcards]);

  const handleStartStudySession = (cards: typeof flashcards) => {
    if (cards.length > 0) {
      startStudySession(cards, `Study Session - ${cards.length} cards`);
      router.push('/study');
    }
  };

  const handleDeleteFlashcard = (id: string) => {
    // Check if user has disabled confirmation
    if (confirmationPreferences.getDontAskDeleteFlashcard()) {
      removeFlashcard(id);
      return;
    }

    // Show custom confirmation dialog
    showConfirm({
      title: 'Delete Flashcard',
      description: 'Are you sure you want to delete this flashcard? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      showDontAskAgain: true,
      onConfirm: (dontAskAgain) => {
        if (dontAskAgain) {
          confirmationPreferences.setDontAskDeleteFlashcard(true);
        }
        removeFlashcard(id);
      },
    });
  };

  // Show loading state
  if (isLoading || !isLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center animate-pulse">
              <BookOpen className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Loading your flashcards...
            </p>
          </div>
        </div>
        </div>
      </>
    );
  }

  // Redirect to sign-in if not authenticated
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  // Show empty state if no flashcards
  if (flashcards.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto relative">
              <Mascot
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Study Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Upload your notes to start creating AI-powered flashcards
              </p>
            </div>

            <Button
              onClick={() => router.push('/upload')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Flashcards
            </Button>
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Study Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your flashcards and track your progress
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push('/upload')}
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Flashcards
              </Button>
              
              {/* Debug button to reset preferences (geliştirme amaçlı) */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={() => {
                    confirmationPreferences.clearAllPreferences();
                    alert('Confirmation preferences reset!');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Reset Preferences
                </Button>
              )}
              
              <Button
                onClick={() => handleStartStudySession(filteredFlashcards)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={filteredFlashcards.length === 0}
              >
                <div className="flex items-center">
                  <Mascot width={16} height={16} className="mr-2" />
                  <Play className="mr-2 h-4 w-4" />
                  Start Studying
                </div>
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cards</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Difficulty Distribution */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Difficulty Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Easy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.easy}</span>
              </div>
              <Progress value={(stats.easy / stats.total) * 100} className="h-2 bg-green-100" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.medium}</span>
              </div>
              <Progress value={(stats.medium / stats.total) * 100} className="h-2 bg-yellow-100" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hard</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.hard}</span>
              </div>
              <Progress value={(stats.hard / stats.total) * 100} className="h-2 bg-red-100" />
            </div>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* View Mode and Sort */}
            <div className="flex items-center space-x-2">
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as 'created_at' | 'difficulty' | 'category' | 'review_count');
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="difficulty-asc">Easy to Hard</option>
                <option value="difficulty-desc">Hard to Easy</option>
                <option value="category-asc">Category A-Z</option>
                <option value="review_count-desc">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flashcards Grid/List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedCategory ? (
                <>
                  Flashcards in &quot;{selectedCategory}&quot; ({filteredFlashcards.length})
                </>
              ) : (
                <>
                  All Flashcards ({filteredFlashcards.length})
                </>
              )}
            </h2>
            
            <div className="flex space-x-2">
              {selectedCategory && filteredFlashcards.length > 0 && (
                <Button
                  onClick={() => handleStartStudySession(filteredFlashcards)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <div className="flex items-center">
                    <Mascot width={14} height={14} className="mr-1" />
                    <Play className="mr-2 h-4 w-4" />
                    Study &quot;{selectedCategory}&quot; ({filteredFlashcards.length})
                  </div>
                </Button>
              )}
              
              {filteredFlashcards.length > 0 && (
                <Button
                  onClick={() => handleStartStudySession(filteredFlashcards)}
                  variant="outline"
                  size="sm"
                >
                  <div className="flex items-center">
                    <Mascot width={14} height={14} className="mr-1" />
                    <Play className="mr-2 h-4 w-4" />
                    Study All Filtered ({filteredFlashcards.length})
                  </div>
                </Button>
              )}
            </div>
          </div>

          {filteredFlashcards.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No flashcards match your current filters.
              </p>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredFlashcards.map((flashcard) => (
                <Flashcard
                  key={flashcard.id}
                  flashcard={flashcard}
                  size={viewMode === 'list' ? 'small' : 'medium'}
                  onDelete={handleDeleteFlashcard}
                  className={viewMode === 'list' ? 'w-full' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {ConfirmDialogComponent}
      </div>
    </>
  );
};

export default DashboardPage;