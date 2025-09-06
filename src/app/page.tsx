'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/layout/hero-section';
import FeatureCard from '@/components/layout/feature-card';
import Mascot from '@/components/ui/mascot';
import { 
  Upload, 
  Brain, 
  BarChart3, 
  Zap,
  BookOpen,
  Target,
  Clock,
  Award
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: 'Smart Upload',
      description: 'Upload text files, PDFs, or paste your notes directly. Our AI instantly analyzes your content and understands the key concepts.',
      icon: Upload,
      gradient: 'blue' as const,
    },
    {
      title: 'AI Generation',
      description: 'Advanced AI creates personalized flashcards with intelligent questions, categorization, and difficulty levels tailored to your content.',
      icon: Brain,
      gradient: 'red' as const,
    },
    {
      title: 'Smart Study',
      description: 'Study with spaced repetition algorithm, track your progress, and focus on areas that need improvement with adaptive learning.',
      icon: Target,
      gradient: 'yellow' as const,
    },
    {
      title: 'Analytics',
      description: 'Comprehensive analytics show your learning patterns, success rates, and provide insights to optimize your study sessions.',
      icon: BarChart3,
      gradient: 'green' as const,
    },
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate hundreds of flashcards in seconds with our optimized AI pipeline.'
    },
    {
      icon: BookOpen,
      title: 'Multi-Format Support',
      description: 'Works with PDFs, text files, images, and direct text input.'
    },
    {
      icon: Clock,
      title: 'Spaced Repetition',
      description: 'Built-in spaced repetition algorithm maximizes long-term retention.'
    },
    {
      icon: Award,
      title: 'Progress Tracking',
      description: 'Detailed analytics and progress tracking keep you motivated.'
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="gradient-google bg-clip-text text-transparent">
                Study Smarter
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From content upload to mastery tracking, our AI-powered platform provides 
              all the tools you need for effective learning.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 200}
              />
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-6 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-google relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who have already improved their study efficiency with AI-powered flashcards.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/upload')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Mascot
                    width={40}
                    height={40}
                  />
                </div>
                <span className="text-xl font-bold">AutoFlashcards</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your study notes with AI-powered flashcards. Study smarter with spaced repetition and intelligent progress tracking.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/upload" className="hover:text-white transition-colors">Upload Notes</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Powered by Advanced AI Technology & OpenAI
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 AutoFlashcards. All rights reserved. Built with Next.js, Tailwind CSS, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
