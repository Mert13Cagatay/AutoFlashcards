'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/lib/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isSignedIn, isLoaded } = useUser();
  const clearUserData = useAppStore((state) => state.clearUserData);

  useEffect(() => {
    // Only clear data when auth is loaded and user is not signed in
    if (isLoaded && !isSignedIn) {
      clearUserData();
    }
  }, [isSignedIn, isLoaded, clearUserData]);

  return <>{children}</>;
}
