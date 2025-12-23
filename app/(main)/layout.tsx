'use client';

import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LevelUpModal from '../components/LevelUpModal'; // Import the new modal

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { character } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If onboarding is not completed, redirect to home page
    if (!character) {
      router.push('/');
    }
  }, [character, router]);

  // If character is null, we show a loading or blank screen while redirecting
  if (!character) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <p className="font-press-start text-primary">Loading...</p>
      </div>
    );
  }

  // If onboarding is complete, show the main app layout
  return (
    <div className="flex flex-col min-h-screen bg-background text-text font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <Footer />
      <LevelUpModal /> {/* Render the LevelUpModal here */}
    </div>
  );
}