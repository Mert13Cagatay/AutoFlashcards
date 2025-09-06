'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/ui/mascot';
import { ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-google opacity-10" />
      <div className="absolute inset-0">
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-red-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-500/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Powered by Advanced AI Technology
          </span>
        </div>

        {/* Main Headline */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-6">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight text-center lg:text-left">
            Transform Your{' '}
            <span className="gradient-google bg-clip-text text-transparent">
              Study Notes
            </span>
            <br />
            Into Smart Flashcards
          </h1>
          <div className="flex-shrink-0">
            <Mascot 
              width={120} 
              height={120} 
              className="animate-float hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Upload your notes and let AI create personalized flashcards that adapt to your learning style. 
          Study smarter with spaced repetition and intelligent progress tracking.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <span>AI-Powered Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            <span>Smart Study Sessions</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/upload')}
            className="
              bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg
              shadow-xl hover:shadow-2xl 
              transition-all duration-300 hover:scale-105
              flex items-center space-x-2
            "
          >
            <Mascot width={20} height={20} />
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="
              border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg
              hover:bg-blue-50 dark:hover:bg-blue-900/20
              transition-all duration-300
            "
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">10k+</div>
            <div className="text-gray-600 dark:text-gray-400">Flashcards Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">Study Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">AI Availability</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
