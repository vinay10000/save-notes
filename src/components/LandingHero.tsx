'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Edit3, Folder, Star } from 'lucide-react';
import Link from 'next/link';

export function LandingHero() {
  const features = [
    {
      icon: Edit3,
      title: 'Rich Text Editor',
      description: 'Format your notes with style using our powerful editor'
    },
    {
      icon: Folder,
      title: 'Smart Organization',
      description: 'Keep everything organized in custom workspaces'
    },
    {
      icon: Star,
      title: 'Quick Access',
      description: 'Star important notes for instant access'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
        >
          <Edit3 className="w-8 h-8 text-white" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Save Notes
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your thoughts, organized beautifully. The modern way to take and manage notes.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/notes"
            className="inline-flex items-center px-8 py-4 rounded-full text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center px-8 py-4 rounded-full text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Learn More
          </a>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
          id="features"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-10" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-10" />
      <div className="absolute bottom-1/2 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-10" />
    </div>
  );
}
