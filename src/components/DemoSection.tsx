'use client';

import { motion } from 'framer-motion';
import { FileText, FolderKanban, Search, Star } from 'lucide-react';

export function DemoSection() {
  const features = [
    {
      icon: FileText,
      title: 'Rich Text Editing',
      description: 'Format your notes with bold, italic, lists, and more. Our editor makes it easy to create beautiful notes.'
    },
    {
      icon: FolderKanban,
      title: 'Workspace Organization',
      description: 'Keep your notes organized in custom workspaces. Perfect for different projects or areas of your life.'
    },
    {
      icon: Search,
      title: 'Quick Search',
      description: 'Find any note instantly with our powerful search. Never lose track of your important information.'
    },
    {
      icon: Star,
      title: 'Priority Notes',
      description: 'Star your most important notes for quick access. Keep your priorities always within reach.'
    }
  ];

  return (
    <section className="relative py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 4px 4px, rgba(0,0,0,0.1) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything you need to capture your thoughts
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            A powerful yet simple note-taking experience that adapts to your workflow
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
            {/* Window Controls */}
            <div className="h-8 bg-gray-100 dark:bg-gray-900 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>

            {/* App Interface */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                Coming Soon
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
