import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { FlashcardData } from './openai';
import { DatabaseFlashcard, StudySession } from './supabase';

export interface AppFlashcard extends FlashcardData {
  id: string;
  created_at: string;
  updated_at: string;
  last_reviewed_at?: string;
  review_count: number;
  success_count: number;
  next_review_date?: string;
}

export interface StudySessionState {
  currentSession: StudySession | null;
  currentCardIndex: number;
  studyCards: AppFlashcard[];
  showAnswer: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  sessionStartTime: string | null;
  sessionEndTime: string | null;
}

export interface AppState {
  // UI State
  darkMode: boolean;
  sidebarOpen: boolean;
  currentView: 'home' | 'upload' | 'dashboard' | 'study' | 'profile';
  
  // Flashcards
  flashcards: AppFlashcard[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  sortBy: 'created_at' | 'difficulty' | 'category' | 'review_count';
  sortOrder: 'asc' | 'desc';
  
  // Study
  studySession: StudySessionState;
  
  // Upload/Generation
  isGenerating: boolean;
  generationProgress: number;
  lastUploadedText: string;
  
  // Actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Flashcard actions
  setFlashcards: (flashcards: AppFlashcard[]) => void;
  addFlashcard: (flashcard: AppFlashcard) => void;
  addFlashcards: (flashcards: AppFlashcard[]) => void;
  updateFlashcard: (id: string, updates: Partial<AppFlashcard>) => void;
  removeFlashcard: (id: string) => void;
  setCategories: (categories: string[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: AppState['sortBy']) => void;
  setSortOrder: (order: AppState['sortOrder']) => void;
  
  // Study actions
  startStudySession: (cards: AppFlashcard[], sessionName?: string) => void;
  endStudySession: () => void;
  showAnswer: () => void;
  hideAnswer: () => void;
  nextCard: () => void;
  previousCard: () => void;
  markCardCorrect: () => void;
  markCardIncorrect: () => void;
  resetStudySession: () => void;
  
  // Generation actions
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setLastUploadedText: (text: string) => void;
  clearUserData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      darkMode: false,
      sidebarOpen: false,
      currentView: 'home',
      
      flashcards: [],
      categories: [],
      selectedCategory: null,
      searchQuery: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      
      studySession: {
        currentSession: null,
        currentCardIndex: 0,
        studyCards: [],
        showAnswer: false,
        correctAnswers: 0,
        incorrectAnswers: 0,
        sessionStartTime: null,
        sessionEndTime: null,
      },
      
      isGenerating: false,
      generationProgress: 0,
      lastUploadedText: '',
      
      // UI Actions
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCurrentView: (view) => set({ currentView: view }),
      
      // Flashcard actions
      setFlashcards: (flashcards) => set((state) => {
        const allCategories = [...new Set(flashcards.map(card => card.category))];
        return {
          flashcards,
          categories: allCategories
        };
      }),
      
      addFlashcard: (flashcard) => set((state) => {
        const updatedFlashcards = [flashcard, ...state.flashcards];
        const allCategories = [...new Set(updatedFlashcards.map(card => card.category))];
        return {
          flashcards: updatedFlashcards,
          categories: allCategories
        };
      }),
      
      addFlashcards: (newFlashcards) => set((state) => {
        const updatedFlashcards = [...newFlashcards, ...state.flashcards];
        const allCategories = [...new Set(updatedFlashcards.map(card => card.category))];
        return {
          flashcards: updatedFlashcards,
          categories: allCategories
        };
      }),
      
      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(card => 
          card.id === id ? { ...card, ...updates } : card
        )
      })),
      
      removeFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(card => card.id !== id)
      })),
      
      setCategories: (categories) => set({ categories }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),
      
      // Study actions
      startStudySession: (cards, sessionName = 'Quick Study') => set((state) => ({
        studySession: {
          currentSession: {
            id: crypto.randomUUID(),
            name: sessionName,
            flashcard_ids: cards.map(c => c.id),
            created_at: new Date().toISOString(),
            total_cards: cards.length,
            completed_cards: 0,
            accuracy_rate: 0,
          },
          currentCardIndex: 0,
          studyCards: cards,
          showAnswer: false,
          correctAnswers: 0,
          incorrectAnswers: 0,
          sessionStartTime: new Date().toISOString(),
          sessionEndTime: null,
        },
        currentView: 'study'
      })),
      
      endStudySession: () => set((state) => ({
        studySession: {
          ...state.studySession,
          sessionEndTime: new Date().toISOString(),
        }
      })),
      
      showAnswer: () => set((state) => {
        if (state.studySession.showAnswer) return {};
        return {
          studySession: { ...state.studySession, showAnswer: true }
        };
      }),
      
      hideAnswer: () => set((state) => {
        if (!state.studySession.showAnswer) return {};
        return {
          studySession: { ...state.studySession, showAnswer: false }
        };
      }),
      
      nextCard: () => set((state) => {
        const nextIndex = Math.min(
          state.studySession.currentCardIndex + 1,
          state.studySession.studyCards.length - 1
        );
        return {
          studySession: {
            ...state.studySession,
            currentCardIndex: nextIndex,
            showAnswer: false,
          }
        };
      }),
      
      previousCard: () => set((state) => {
        const prevIndex = Math.max(state.studySession.currentCardIndex - 1, 0);
        return {
          studySession: {
            ...state.studySession,
            currentCardIndex: prevIndex,
            showAnswer: false,
          }
        };
      }),
      
      markCardCorrect: () => set((state) => ({
        studySession: {
          ...state.studySession,
          correctAnswers: state.studySession.correctAnswers + 1,
        }
      })),
      
      markCardIncorrect: () => set((state) => ({
        studySession: {
          ...state.studySession,
          incorrectAnswers: state.studySession.incorrectAnswers + 1,
        }
      })),
      
      resetStudySession: () => set((state) => ({
        studySession: {
          currentSession: null,
          currentCardIndex: 0,
          studyCards: [],
          showAnswer: false,
          correctAnswers: 0,
          incorrectAnswers: 0,
          sessionStartTime: null,
          sessionEndTime: null,
        }
      })),
      
        // Generation actions
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
      setLastUploadedText: (text) => set({ lastUploadedText: text }),
      
      // Clear all user data on logout
      clearUserData: () => set({
        flashcards: [],
        categories: [],
        selectedCategory: null,
        searchQuery: '',
        studySession: {
          currentSession: null,
          currentCardIndex: 0,
          studyCards: [],
          showAnswer: false,
          correctAnswers: 0,
          incorrectAnswers: 0,
          sessionStartTime: null,
          sessionEndTime: null,
        },
        lastUploadedText: '',
        isGenerating: false,
        generationProgress: 0,
      }),
    }),
    {
      name: 'flashcard-app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        flashcards: state.flashcards,
        categories: state.categories,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        lastUploadedText: state.lastUploadedText,
      }),
    }
  )
);

// Selector hooks for better performance
// Selector hooks for better performance
export const useFlashcards = () => {
  // Her değeri ayrı ayrı al - shallow comparison için
  const flashcards = useAppStore((state) => state.flashcards);
  const categories = useAppStore((state) => state.categories);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const sortBy = useAppStore((state) => state.sortBy);
  const sortOrder = useAppStore((state) => state.sortOrder);
  
  // Actions'ları ayrı al
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setSortBy = useAppStore((state) => state.setSortBy);
  const setSortOrder = useAppStore((state) => state.setSortOrder);

  // Use React.useMemo to memoize the filtered flashcards
  const filteredFlashcards = React.useMemo(() => {
    let filtered = [...flashcards];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [flashcards, selectedCategory, searchQuery, sortBy, sortOrder]);

  return {
    flashcards: filteredFlashcards,
    categories,
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setSortOrder,
  };
};

export const useStudySession = () => {
  // Her değeri ayrı ayrı al
  const studySession = useAppStore((state) => state.studySession);
  const startStudySession = useAppStore((state) => state.startStudySession);
  const endStudySession = useAppStore((state) => state.endStudySession);
  const showAnswerAction = useAppStore((state) => state.showAnswer);
  const hideAnswer = useAppStore((state) => state.hideAnswer);
  const nextCard = useAppStore((state) => state.nextCard);
  const previousCard = useAppStore((state) => state.previousCard);
  const markCardCorrect = useAppStore((state) => state.markCardCorrect);
  const markCardIncorrect = useAppStore((state) => state.markCardIncorrect);
  const resetStudySession = useAppStore((state) => state.resetStudySession);

  // Compute values from stable references
  const { currentCardIndex, studyCards, correctAnswers, incorrectAnswers, showAnswer } = studySession;
  
  const currentCard = React.useMemo(() => {
    return studyCards[currentCardIndex] || null;
  }, [studyCards, currentCardIndex]);
  
  const progress = React.useMemo(() => {
    return studyCards.length === 0 ? 0 : ((currentCardIndex + 1) / studyCards.length) * 100;
  }, [currentCardIndex, studyCards.length]);
  
  const accuracy = React.useMemo(() => {
    const total = correctAnswers + incorrectAnswers;
    return total === 0 ? 0 : (correctAnswers / total) * 100;
  }, [correctAnswers, incorrectAnswers]);

  return {
    // Study session state (direct properties)
    currentSession: studySession.currentSession,
    currentCardIndex,
    studyCards,
    showAnswer,
    correctAnswers,
    incorrectAnswers,
    sessionStartTime: studySession.sessionStartTime,
    sessionEndTime: studySession.sessionEndTime,
    // Computed values
    currentCard,
    progress,
    accuracy,
    // Actions
    startStudySession,
    endStudySession,
    showAnswerAction,
    hideAnswer,
    nextCard,
    previousCard,
    markCardCorrect,
    markCardIncorrect,
    resetStudySession,
  };
};


export const useGeneration = () => useAppStore((state) => ({
  isGenerating: state.isGenerating,
  generationProgress: state.generationProgress,
  lastUploadedText: state.lastUploadedText,
  setIsGenerating: state.setIsGenerating,
  setGenerationProgress: state.setGenerationProgress,
  setLastUploadedText: state.setLastUploadedText,
}), shallow);
