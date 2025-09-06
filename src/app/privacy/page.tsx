import React from 'react';
import Navbar from '@/components/layout/navbar';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  upload study materials, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Email address, username, and profile information</li>
                  <li><strong>Study Content:</strong> Notes, documents, and flashcards you create</li>
                  <li><strong>Usage Data:</strong> How you interact with our service, study patterns, and performance metrics</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and IP address</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our AI flashcard service</li>
                  <li>Generate personalized flashcards using AI technology</li>
                  <li>Track your study progress and provide analytics</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Ensure the security of our platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Information Sharing
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With OpenAI for AI-powered flashcard generation</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We implement appropriate security measures to protect your information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Secure authentication through Clerk</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Your Rights
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your flashcards and study data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request correction of inaccurate information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                  and provide personalized content. You can control cookie settings through your browser.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Contact Us
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p><strong>Email:</strong> mertcagatay4@gmail.com</p>
                  <p><strong>Address:</strong> AutoFlashcards</p>
                </div>
              </div>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
