import React from 'react';
import Navbar from '@/components/layout/navbar';
import { Card } from '@/components/ui/card';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get in touch with our team
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Email Support
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Send us an email and we&apos;ll get back to you
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    For any questions, feedback, or support requests, you can reach us at:
                  </p>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <a 
                      href="mailto:mertcagatay4@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      mertcagatay4@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Quick Response
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Technical support questions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Feature requests and feedback</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Account and billing inquiries</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>General questions about AutoFlashcards</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Contact Form Alternative */}
            <div className="space-y-8">
              <Card className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Send us an email with your questions or feedback. We&apos;re here to help you 
                    make the most of your study experience with AutoFlashcards.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-left">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        What to include in your email:
                      </h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <li>• Brief description of your question or issue</li>
                        <li>• Your account email (if applicable)</li>
                        <li>• Any error messages you&apos;re seeing</li>
                        <li>• Screenshots if relevant</li>
                      </ul>
                    </div>
                    
                    <a
                      href="mailto:mertcagatay4@gmail.com?subject=AutoFlashcards Support"
                      className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

