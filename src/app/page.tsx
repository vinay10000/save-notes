import { LandingHero } from '@/components/LandingHero';
import { DemoSection } from '@/components/DemoSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Save Notes - Your Modern Note-Taking App',
  description: 'A beautiful and intuitive note-taking application with rich text editing and workspace organization.',
};

export default function Home() {
  return (
    <main>
      <LandingHero />
      <DemoSection />
    </main>
  );
}
