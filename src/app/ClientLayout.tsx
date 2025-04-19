'use client'

import { useState, useEffect } from 'react'
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashIntro } from "@/components/SplashIntro";
import Script from 'next/script';

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

  // Initialize Calendly styles
  useEffect(() => {
    // Add Calendly styles (typically done by the Calendly script, but adding manually for completeness)
    if (typeof window !== 'undefined' && !document.getElementById('calendly-styles')) {
      const style = document.createElement('link');
      style.id = 'calendly-styles';
      style.rel = 'stylesheet';
      style.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(style);
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
      
      {/* Calendly widget script - load it globally but lazyOnload to not block rendering */}
      <Script 
        src="https://assets.calendly.com/assets/external/widget.js" 
        strategy="lazyOnload" 
      />
    </>
  );
} 