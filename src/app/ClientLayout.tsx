'use client'

import { useState, useEffect } from 'react'
import { Box, Link } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashIntro } from "@/components/SplashIntro";
import { ScreenReaderOnly } from "@/components/accessibility";
import { PageErrorBoundary } from "@/components/error-boundaries";
import { Breadcrumbs } from "@/components/seo";
import { useLocalStorage } from "@/utils/stateManagement";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [hasVisitedBefore, setHasVisitedBefore, isLoaded] = useLocalStorage('hasVisitedLex', false);
  const [showSplash, setShowSplash] = useState(true);

  // Initialize splash state based on visit history
  useEffect(() => {
    if (isLoaded) {
      if (hasVisitedBefore) {
        setShowSplash(false);
      } else {
        // Mark as visited for future visits
        setHasVisitedBefore(true);
      }
    }
  }, [isLoaded, hasVisitedBefore, setHasVisitedBefore]);



  const handleShowSplash = () => {
    setShowSplash(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {/* Skip Links for Keyboard Navigation */}
      <ScreenReaderOnly>
        <Link
          href="#main-content"
          className="skip-link"
          _focus={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            zIndex: 9999,
            background: 'var(--lex-deep-blue)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Skip to main content
        </Link>
        <Link
          href="#navigation"
          className="skip-link"
          _focus={{
            position: 'absolute',
            top: '6px',
            left: '140px',
            zIndex: 9999,
            background: 'var(--lex-deep-blue)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Skip to navigation
        </Link>
      </ScreenReaderOnly>
      
      <Header onShowSplash={handleShowSplash} />
      {isLoaded && showSplash && <SplashIntro showSplash={showSplash} onSplashComplete={handleSplashComplete} />}
      <Breadcrumbs />
      <Box as="main" id="main-content" flexGrow={1} width="100%" pt="0" tabIndex={-1}>
        <PageErrorBoundary pageName="Main Content">
          {children}
        </PageErrorBoundary>
      </Box>
      <Footer />
    </>
  );
} 