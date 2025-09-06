'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { 
  BookOpen, 
  Upload, 
  BarChart3, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { 
    darkMode, 
    sidebarOpen, 
    toggleDarkMode, 
    toggleSidebar, 
  } = useAppStore();

  const navigationItems = [
    { id: '/', label: 'Home', icon: BookOpen },
    ...(isSignedIn ? [
      { id: '/upload', label: 'Upload', icon: Upload },
      { id: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    ] : [])
  ] as const;

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => router.push('/')}
              >
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  AutoFlashcards
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.push(item.id)}
                    className={`
                      flex items-center space-x-2 transition-all duration-300
                      ${isActive 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                        : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 hover:bg-white/10 text-gray-700 dark:text-gray-300"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Profile/User Menu */}
              {isSignedIn ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full hover:scale-105 transition-transform"
                    }
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 dark:text-gray-300 hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/20 p-4">
                          <div className="mt-16 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`
                        w-full justify-start space-x-3 transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                          : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
                        }
                      `}
                      onClick={() => {
                        router.push(item.id);
                        toggleSidebar();
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
