import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DatabaseFlashcard {
  id: string;
  user_id: string; // Made required
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  created_at: string;
  updated_at: string;
  last_reviewed_at?: string;
  review_count: number;
  success_count: number;
  next_review_date?: string;
}

export interface StudySession {
  id: string;
  user_id: string; // Made required
  name: string;
  flashcard_ids: string[];
  created_at: string;
  last_studied_at?: string;
  total_cards: number;
  completed_cards: number;
  accuracy_rate: number;
}

// Flashcard operations
export async function saveFlashcard(flashcard: Omit<DatabaseFlashcard, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseFlashcard | null> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{
        ...flashcard,
        review_count: 0,
        success_count: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving flashcard:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving flashcard:', error);
    return null;
  }
}

export async function saveFlashcards(flashcards: Omit<DatabaseFlashcard, 'id' | 'created_at' | 'updated_at'>[]): Promise<DatabaseFlashcard[]> {
  try {
    console.log('Attempting to save flashcards:', flashcards.length);
    
    const flashcardsWithDefaults = flashcards.map(card => ({
      ...card,
      review_count: 0,
      success_count: 0,
    }));

    console.log('Prepared flashcards for insert:', flashcardsWithDefaults);

    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcardsWithDefaults)
      .select();

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      return [];
    }

    console.log('Successfully saved flashcards:', data);
    return data || [];
  } catch (error) {
    console.error('Unexpected error saving flashcards:', error);
    return [];
  }
}

export async function getFlashcards(userId: string): Promise<DatabaseFlashcard[]> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching flashcards:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
}

export async function getFlashcardsByCategory(category: string, userId: string): Promise<DatabaseFlashcard[]> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('category', category)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching flashcards by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching flashcards by category:', error);
    return [];
  }
}

export async function updateFlashcardReview(
  flashcardId: string, 
  success: boolean, 
  nextReviewDate?: Date
): Promise<boolean> {
  try {
    const { data: existing } = await supabase
      .from('flashcards')
      .select('review_count, success_count')
      .eq('id', flashcardId)
      .single();

    if (!existing) {
      console.error('Flashcard not found');
      return false;
    }

    const updateData: any = {
      last_reviewed_at: new Date().toISOString(),
      review_count: existing.review_count + 1,
      success_count: success ? existing.success_count + 1 : existing.success_count,
    };

    if (nextReviewDate) {
      updateData.next_review_date = nextReviewDate.toISOString();
    }

    const { error } = await supabase
      .from('flashcards')
      .update(updateData)
      .eq('id', flashcardId);

    if (error) {
      console.error('Error updating flashcard review:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating flashcard review:', error);
    return false;
  }
}

export async function deleteFlashcard(flashcardId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);

    if (error) {
      console.error('Error deleting flashcard:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return false;
  }
}

// Study session operations
export async function createStudySession(
  name: string, 
  flashcardIds: string[], 
  userId: string
): Promise<StudySession | null> {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([{
        user_id: userId,
        name,
        flashcard_ids: flashcardIds,
        total_cards: flashcardIds.length,
        completed_cards: 0,
        accuracy_rate: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating study session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating study session:', error);
    return null;
  }
}

export async function updateStudySession(
  sessionId: string, 
  completedCards: number, 
  accuracyRate: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('study_sessions')
      .update({
        completed_cards: completedCards,
        accuracy_rate: accuracyRate,
        last_studied_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating study session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating study session:', error);
    return false;
  }
}

export async function getStudySessions(userId: string): Promise<StudySession[]> {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching study sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return [];
  }
}

// Utility functions
export async function getCategories(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('category')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories.filter(Boolean);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getFlashcardStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('difficulty, review_count, success_count')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching flashcard stats:', error);
      return null;
    }

    const stats = {
      total: data?.length || 0,
      easy: data?.filter(card => card.difficulty === 'easy').length || 0,
      medium: data?.filter(card => card.difficulty === 'medium').length || 0,
      hard: data?.filter(card => card.difficulty === 'hard').length || 0,
      totalReviews: data?.reduce((sum, card) => sum + card.review_count, 0) || 0,
      totalSuccess: data?.reduce((sum, card) => sum + card.success_count, 0) || 0,
    };

    return {
      ...stats,
      successRate: stats.totalReviews > 0 ? (stats.totalSuccess / stats.totalReviews) * 100 : 0,
    };
  } catch (error) {
    console.error('Error fetching flashcard stats:', error);
    return null;
  }
}
