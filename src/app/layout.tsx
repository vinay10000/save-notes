import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Save Notes - A Modern Note Taking App',
  description: 'A feature-rich note-taking application with rich text editing and dark mode support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster 
            position="bottom-right" 
            theme="system"
            closeButton
            richColors
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
