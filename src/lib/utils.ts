import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Confirmation preferences management
const STORAGE_KEYS = {
  DONT_ASK_DELETE_FLASHCARD: 'dont-ask-delete-flashcard',
} as const;

export const confirmationPreferences = {
  getDontAskDeleteFlashcard: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.DONT_ASK_DELETE_FLASHCARD) === 'true';
  },
  
  setDontAskDeleteFlashcard: (value: boolean): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DONT_ASK_DELETE_FLASHCARD, value.toString());
  },
  
  clearAllPreferences: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
