'use client'

import { useState, useEffect } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'

type SplashIntroProps = {
  showSplash?: boolean;
  onSplashComplete?: () => void;
}

export function SplashIntro({ showSplash = true, onSplashComplete }: SplashIntroProps) {
  const [isVisible, setIsVisible] = useState(showSplash)
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    // Reset animation when showSplash changes
    if (showSplash) {
      setIsVisible(true)
      setAnimationStage(0)
      
      // Initial delay before starting animations
      const initialDelay = setTimeout(() => {
        // Step 1: Initial logo appearance
        const stageOne = setTimeout(() => {
          setAnimationStage(1)
        }, 1200)
        
        // Step 2: Show tagline
        const stageTwo = setTimeout(() => {
          setAnimationStage(2)
        }, 2000)
        
        // Step 3: Fade out the entire splash screen
        const stageThree = setTimeout(() => {
          setIsVisible(false)
          if (onSplashComplete) {
            onSplashComplete()
          }
        }, 3500)

        return () => {
          clearTimeout(stageOne)
          clearTimeout(stageTwo)
          clearTimeout(stageThree)
        }
      }, 300)

      return () => clearTimeout(initialDelay)
    }
  }, [showSplash, onSplashComplete])

  // If not visible, don't render anything
  if (!isVisible) return null

  // Use a global variable to control body overflow
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
  }

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      zIndex="9999"
      bg="white"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className={!isVisible ? "fadeOut" : ""}
    >


      <Box
        width={{ base: "70%", md: "35%" }}
        maxWidth="350px"
        className="logoAnimation"
        mb={8}
      >
        <Image 
          src="/lexlogolight-400.webp" 
          alt="Lex Consulting" 
          width="100%"
          htmlWidth="350"
          htmlHeight="350"
          filter="drop-shadow(0 0 15px rgba(0, 123, 255, 0.2))"
        />
      </Box>

      {animationStage > 0 && (
        <Box 
          className="taglineAnimation"
          fontFamily="mono"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="300"
          letterSpacing="0.2em"
          textTransform="uppercase"
          color="brand.primary"
          mb={10}
          textAlign="center"
        >
          Empowering Strategic Investors
        </Box>
      )}

      {animationStage > 1 && (
        <Box 
          className="lineAnimation"
          width="100px"
          height="2px"
          bg="brand.accent"
          mt={4}
        />
      )}

      <Box
        position="absolute"
        bottom="2rem"
        width="60px"
        height="2px"
        bg="rgba(10, 35, 66, 0.1)"
        my={4}
        borderRadius="full"
        overflow="hidden"
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bg: 'brand.accent',
          className: 'loading-bar',
          borderRadius: 'full',
        }}
      />
    </Flex>
  )
} 
