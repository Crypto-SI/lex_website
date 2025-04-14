'use client'

import { useState, useEffect } from 'react'
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashIntro } from "@/components/SplashIntro";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  // Check if user has visited before
  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem('hasVisitedLex') === 'true';
      
      // If they've visited before, don't show splash
      if (hasVisitedBefore) {
        setShowSplash(false);
      } else {
        // Mark as visited for future
        localStorage.setItem('hasVisitedLex', 'true');
      }
      
      setHasVisited(true);
    }
  }, []);

  const handleShowSplash = () => {
    setShowSplash(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <Header onShowSplash={handleShowSplash} />
      {hasVisited && showSplash && <SplashIntro showSplash={showSplash} onSplashComplete={handleSplashComplete} />}
      <Box as="main" flexGrow={1} width="100%" pt="0">
        {children}
      </Box>
      <Footer />
    </>
  );
} 