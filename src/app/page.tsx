'use client'

import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  Icon, 
  VStack 
} from '@chakra-ui/react'
import { FaChartLine, FaChartPie, FaHandshake, FaArrowRight, FaPhoneAlt } from 'react-icons/fa'
import Link from 'next/link'
import { LazySection, OptimizedImage, OptimizedYouTubePlayer } from '@/components/media'
import { ScreenReaderOnly } from '@/components/accessibility'
import { StructuredData } from '@/components/seo'
import { generateBusinessStructuredData, generateFAQStructuredData } from './metadata'

// Custom FAQ Item component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Create deterministic ID based on question to avoid hydration mismatch
  const faqId = `faq-${question.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
  const contentId = `${faqId}-content`;
  
  return (
    <Box 
      border="1px solid" 
      borderColor="gray.200" 
      borderRadius="lg"
      overflow="hidden"
      mb={4}
      bg="white"
      shadow="sm"
    >
      <Box 
        as="button" 
        onClick={() => setIsOpen(!isOpen)}
        py={4} 
        px={5}
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        _hover={{ bg: "gray.50" }}
        _focus={{
          outline: "2px solid",
          outlineColor: "brand.accent",
          outlineOffset: "2px"
        }}
        transition="all 0.2s"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={faqId}
      >
        <Box textAlign="center" fontWeight="600" fontFamily="heading" color="brand.900" flex="1">
          {question}
        </Box>
        <Box 
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.3s ease"
          aria-hidden="true"
          position="absolute"
          right="20px"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9L12 16L21 9L12 2Z" fill="#007BFF" fillOpacity="0.8" />
            <path d="M3 9V20L12 16V9L3 9Z" fill="#007BFF" fillOpacity="0.6" />
            <path d="M12 9V16L21 20V9L12 9Z" fill="#007BFF" fillOpacity="0.4" />
          </svg>
        </Box>
        <ScreenReaderOnly>
          {isOpen ? 'Collapse' : 'Expand'} FAQ item
        </ScreenReaderOnly>
      </Box>
      <Box 
        height={isOpen ? "auto" : "0"}
        opacity={isOpen ? 1 : 0}
        py={isOpen ? 5 : 0}
        px={5}
        overflow="hidden"
        transition="all 0.3s"
        id={contentId}
        role="region"
        aria-labelledby={faqId}
      >
        <Text fontFamily="body" fontSize="lg" color="gray.600" lineHeight="relaxed">
          {answer}
        </Text>
      </Box>
    </Box>
  );
};

// Optimized Video Player Component using the new OptimizedYouTubePlayer
const VideoPlayer = () => {
  return (
    <OptimizedYouTubePlayer
      videoId="796cT8bt1P8"
      title="Lex Consulting Introduction"
      maxWidth="100%"
      aspectRatio={16/9} // Standard video aspect ratio
      thumbnailQuality="medium"
      showTitle={true}
      autoPlay={true}
    />
  );
};

export default function Home() {
  const heroRef = React.useRef<HTMLDivElement | null>(null)
  const heroImageRef = React.useRef<HTMLDivElement | null>(null)
  const heroSubheadRef = React.useRef<HTMLParagraphElement | null>(null)

  const heroHeading = 'Navigate Complex Markets with Expert Guidance'

  useEffect(() => {
    if (!heroRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let ctx: { revert: () => void } | null = null
    let isCancelled = false

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (isCancelled) return

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(heroRef)
        const headingWords = q('.hero-word')
        const ctaButtons = q('.hero-cta')
        const trustMarkers = q('.hero-trust')
        const heroWipe = q('.hero-wipe')

        gsap.set(heroImageRef.current, { opacity: 0, scale: 1.05 })
        gsap.set(heroWipe, { scaleX: 1, transformOrigin: 'left center' })
        gsap.set(headingWords, { y: 16, opacity: 0 })
        gsap.set(heroSubheadRef.current, { y: 10, opacity: 0 })
        gsap.set(ctaButtons, { y: 8, opacity: 0 })
        gsap.set(trustMarkers, { y: 6, opacity: 0 })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
        tl.to(heroImageRef.current, { opacity: 1, scale: 1, duration: 0.9 }, 0)
          .to(heroWipe, { scaleX: 0, duration: 0.8, ease: 'power2.out' }, 0.05)
          .to(headingWords, { y: 0, opacity: 1, stagger: 0.05 }, 0.12)
          .to(heroSubheadRef.current, { y: 0, opacity: 1, duration: 0.6 }, 0.48)
          .to(ctaButtons, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, 0.62)

        if (trustMarkers.length) {
          tl.to(trustMarkers, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 }, 0.8)
        }

        const parallaxItems = gsap.utils.toArray<HTMLElement>('[data-parallax]')
        parallaxItems.forEach((element) => {
          const distance = Number(element.dataset.parallax || 0)
          if (!distance) return
          gsap.to(element, {
            y: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }, heroRef)
    }

    initAnimations()

    return () => {
      isCancelled = true
      ctx?.revert()
    }
  }, [])

  // FAQ data for structured data
  const faqData = [
    {
      question: "How is Lex Consulting different from traditional investment advisors?",
      answer: "Unlike traditional advisors who focus on selling products, Lex Consulting takes an education-first approach. We empower you with knowledge, frameworks, and strategic understanding that enables confident, independent decision-making in complex investment landscapes including cryptocurrency and alternative assets."
    },
    {
      question: "Do I need prior knowledge of cryptocurrency to benefit from your services?",
      answer: "No prior knowledge is required. Our educational approach is designed to meet you where you are, whether you're completely new to digital assets or looking to enhance your existing knowledge. We translate complex concepts into clear, actionable insights tailored to your level of understanding."
    },
    {
      question: "How do your services help Financial Advisors specifically?",
      answer: "Financial Advisors gain specialized knowledge to confidently address client questions about crypto and alternative assets, offering a competitive edge in the marketplace. Our frameworks help you evaluate opportunities, manage risks, and integrate these assets into broader portfolio strategies for your clients."
    },
    {
      question: "What is your approach to investment education?",
      answer: "Our three-step approach includes Strategic Assessment (understanding your goals and knowledge gaps), Knowledge Building (structured educational sessions with actionable insights), and Empowered Decision-Making (equipping you with frameworks that enable independent strategy development long after our engagement)."
    },
    {
      question: "What types of investments do you provide education on?",
      answer: "We focus on long-term investment strategies across traditional markets, cryptocurrency, and alternative assets. Our education covers portfolio construction principles, risk management frameworks, market analysis methodologies, and emerging asset integration strategies."
    },
    {
      question: "How long does the educational process typically take?",
      answer: "The timeline varies based on your goals and existing knowledge. Most clients engage with us for 3-6 months to build a comprehensive understanding. We offer flexible engagement options from intensive workshops to longer-term strategic partnerships."
    }
  ];

  return (
    <>
      {/* Structured Data for Business and FAQ */}
      <StructuredData data={generateBusinessStructuredData()} id="business-data" />
      <StructuredData data={generateFAQStructuredData(faqData)} id="faq-data" />
      
      {/* Hero Section */}
      <Box
        color="white"
        position="relative"
        overflow="hidden"
        minH={{ base: '80vh', md: '85vh', lg: '90vh' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        ref={heroRef}
      >
        <Box position="absolute" inset="0" zIndex="0">
          <OptimizedImage
            src="/lexhero2.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={72}
            lazy={false}
            unoptimized={false}
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            containerProps={{ width: '100%', height: '100%' }}
          />
        </Box>
        {/* Enhanced overlay with blue tint for better brand integration */}
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          bgGradient="linear(135deg, brand.900, brand.accent)"
          opacity={0.7}
          zIndex="1"
        />
        
        {/* Additional blue tint layer for enhanced brand feel */}
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          bg="brand.accent"
          opacity={0.15}
          zIndex="2"
          mixBlendMode="multiply"
        />

        {/* Hero Content */}
        <Container 
          maxW="container.xl" 
          position="relative" 
          zIndex={3} 
          py={{ base: 8, md: 12 }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={{ base: 8, lg: 12 }}
            minH={{ base: 'auto', lg: '50vh' }}
          >
            {/* Left Content - Text and Buttons */}
            <Box 
              flex="1"
              maxW={{ base: '100%', lg: '55%' }}
              textAlign={{ base: 'center', lg: 'left' }}
              position="relative"
            >
              {/* Professional Glass Background for Text */}
              <Box
                position="absolute"
                top="-20px"
                left="-20px"
                right="-20px"
                bottom="-20px"
                bg="blackAlpha.300"
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
                zIndex="-1"
                display={{ base: 'none', lg: 'block' }}
              />
              
              <Heading 
                as="h1" 
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold" 
                fontFamily="heading"
                letterSpacing="wide"
                mb={6}
                lineHeight="shorter"
                textShadow="2px 2px 4px rgba(0,0,0,0.8)"
                position="relative"
                zIndex="1"
                aria-label={heroHeading}
              >
                {heroHeading.split(' ').map((word, index, words) => (
                  <Box
                    as="span"
                    key={`${word}-${index}`}
                    className="hero-word"
                    display="inline-block"
                    mr={index < words.length - 1 ? 2 : 0}
                    aria-hidden="true"
                  >
                    {word}
                  </Box>
                ))}
              </Heading>
              
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }}
                mb={8} 
                color="white" 
                fontFamily="body"
                lineHeight="relaxed"
                maxW={{ base: '100%', lg: '90%' }}
                textShadow="1px 1px 3px rgba(0,0,0,0.8)"
                position="relative"
                zIndex="1"
                bg={{ base: 'blackAlpha.400', lg: 'transparent' }}
                p={{ base: 4, lg: 0 }}
                borderRadius={{ base: 'lg', lg: 'none' }}
                backdropFilter={{ base: 'blur(5px)', lg: 'none' }}
                ref={heroSubheadRef}
              >
                Lex Consulting provides premium education on long-term investment strategy, crypto, and alternative assets for discerning High Net Worth Individuals and Financial Advisors.
              </Text>
              
              <Flex 
                direction={{ base: 'column', sm: 'row' }} 
                gap={{ base: 3, sm: 4 }}
                justify={{ base: 'center', lg: 'flex-start' }}
                align="center"
                width="100%"
                maxW={{ base: '100%', sm: '500px', lg: '100%' }}
                mx={{ base: 'auto', lg: '0' }}
              >
                <Link href="/services" style={{ textDecoration: 'none', flex: '1' }}>
                  <Button 
                    className="hero-cta"
                    bg="brand.accent"
                    color="white"
                    size="lg"
                    fontFamily="mono"
                    fontWeight="600"
                    px={6}
                    borderRadius="full"
                    shadow="lg"
                    width="100%"
                    _hover={{
                      bg: "blue.600",
                      transform: "translateY(-2px)",
                      shadow: "xl"
                    }}
                    _active={{
                      bg: "blue.700",
                      transform: "translateY(0)",
                      shadow: "md"
                    }}
                    _focus={{
                      outline: "2px solid white",
                      outlineOffset: "2px"
                    }}
                    transition="all 0.2s ease"
                    aria-label="Explore our services and offerings"
                  >
                    Explore Services <Icon as={FaArrowRight} ml={2} aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none', flex: '1' }}>
                  <Button 
                    className="hero-cta"
                    variant="outline" 
                    borderColor="white"
                    color="white"
                    size="lg"
                    fontFamily="mono"
                    fontWeight="600"
                    px={6}
                    borderRadius="full"
                    borderWidth="2px"
                    width="100%"
                    _hover={{
                      bg: "whiteAlpha.200",
                      borderColor: "brand.accent",
                      color: "brand.accent",
                      transform: "translateY(-2px)",
                      shadow: "lg"
                    }}
                    _active={{
                      bg: "whiteAlpha.100",
                      transform: "translateY(0)"
                    }}
                    _focus={{
                      outline: "2px solid white",
                      outlineOffset: "2px"
                    }}
                    transition="all 0.2s ease"
                    aria-label="Schedule a consultation call"
                  >
                    <Icon as={FaPhoneAlt} mr={2} aria-hidden="true" /> Schedule Call
                  </Button>
                </Link>
              </Flex>
            </Box>
            
            {/* Right Content - Video Player */}
            <Box 
              flex="1"
              maxW={{ base: '100%', lg: '45%' }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              ref={heroImageRef}
            >
              <Box
                w="100%"
                maxW={{ base: "400px", md: "450px", lg: "500px" }}
                position="relative"
                overflow="hidden"
                borderRadius="xl"
                data-parallax="12"
              >
                <Box
                  className="hero-wipe"
                  position="absolute"
                  inset="0"
                  bg="brand.900"
                  zIndex="2"
                />
                <VideoPlayer />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Services Section */}
      <LazySection
        minH={{ base: "520px", md: "600px" }}
        fallback={<Box minH={{ base: "520px", md: "600px" }} bg="gray.50" />}
      >
        <Box 
          py={{ base: 12, md: 16, lg: 20 }} 
          bg="gray.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={{ base: "-60px", md: "-80px" }}
            right={{ base: "-80px", md: "-120px" }}
            width={{ base: "220px", md: "320px" }}
            height={{ base: "220px", md: "320px" }}
            bgGradient="radial(brand.accent 0%, transparent 70%)"
            opacity={0.2}
            borderRadius="full"
            pointerEvents="none"
            aria-hidden="true"
            data-parallax="8"
          />
          <Container 
            maxW="container.xl" 
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
          >
            <VStack 
              spacing={{ base: 8, md: 12 }} 
              align="center" 
              w="100%"
              maxW="container.xl"
              mx="auto"
            >
              <VStack 
                spacing={4} 
                align="center" 
                maxW="container.md"
                mx="auto"
                textAlign="center"
                w="100%"
              >
                <Heading 
                  as="h2" 
                  fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                  fontFamily="heading" 
                  color="brand.900"
                  textAlign="center"
                  w="100%"
                >
                  Expert Educational Consulting
                </Heading>
                <Text 
                  fontSize={{ base: 'md', md: 'lg' }} 
                  color="gray.600" 
                  fontFamily="body" 
                  lineHeight="relaxed"
                  textAlign="center"
                  w="100%"
                >
                  Empowering HNWIs and FAs with clarity and strategy in complex investment landscapes including crypto and alternatives.
                </Text>
              </VStack>
              
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                gap={{ base: 6, md: 8, lg: 10 }}
                w="100%"
                placeItems="center"
                justifyItems="center"
                alignItems="center"
              >
                <Box 
                  p={{ base: 4, md: 6 }} 
                  bg="white" 
                  borderRadius="xl" 
                  shadow="md" 
                  height="100%" 
                  width="100%"
                  maxW="400px"
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  mx="auto"
                >
                  <Icon as={FaChartLine} w={10} h={10} color="brand.accent" mb={4} aria-hidden="true" />
                  <Heading as="h3" size="md" mb={3} fontFamily="heading" color="brand.900">
                    Strategic Investment Education
                  </Heading>
                  <Text color="gray.600" fontFamily="body" lineHeight="relaxed">
                    Deep dives into long-term strategies, market analysis, and portfolio construction principles.
                  </Text>
                </Box>
                
                <Box 
                  p={{ base: 4, md: 6 }} 
                  bg="white" 
                  borderRadius="xl" 
                  shadow="md" 
                  height="100%" 
                  width="100%"
                  maxW="400px"
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  mx="auto"
                >
                  <Icon as={FaChartPie} w={10} h={10} color="brand.accent" mb={4} aria-hidden="true" />
                  <Heading as="h3" size="md" mb={3} fontFamily="heading" color="brand.900">
                    Crypto & Alternative Assets
                  </Heading>
                  <Text color="gray.600" fontFamily="body" lineHeight="relaxed">
                    Navigating the complexities of digital assets, private equity, and other alternative investments.
                  </Text>
                </Box>
                
                <Box 
                  p={{ base: 4, md: 6 }} 
                  bg="white" 
                  borderRadius="xl" 
                  shadow="md" 
                  height="100%" 
                  width="100%"
                  maxW="400px"
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  mx="auto"
                >
                  <Icon as={FaHandshake} w={10} h={10} color="brand.accent" mb={4} aria-hidden="true" />
                  <Heading as="h3" size="md" mb={3} fontFamily="heading" color="brand.900">
                    Advisor & HNWI Focus
                  </Heading>
                  <Text color="gray.600" fontFamily="body" lineHeight="relaxed">
                    Tailored frameworks and insights specifically designed for Financial Advisors and their HNWI clients.
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </LazySection>

      {/* FAQ Section */}
      <LazySection
        minH={{ base: "520px", md: "640px" }}
        fallback={<Box minH={{ base: "520px", md: "640px" }} bg="white" />}
      >
        <Box 
          py={{ base: 12, md: 16 }} 
          bg="white"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            bottom={{ base: "-80px", md: "-120px" }}
            left={{ base: "-60px", md: "-100px" }}
            width={{ base: "200px", md: "280px" }}
            height={{ base: "200px", md: "280px" }}
            bgGradient="radial(brand.900 0%, transparent 70%)"
            opacity={0.1}
            borderRadius="full"
            pointerEvents="none"
            aria-hidden="true"
            data-parallax="6"
          />
          <Container 
            maxW="container.xl" 
            px={{ base: 4, md: 6 }}
            textAlign="center"
          >
            <VStack 
              spacing={{ base: 8, md: 10 }} 
              align="center" 
              w="100%" 
              maxW="container.lg" 
              mx="auto"
            >
              <Heading 
                as="h2" 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontFamily="heading" 
                color="brand.900"
                textAlign="center"
              >
                Frequently Asked Questions
              </Heading>
              
              <Box w="100%" maxW="container.md">
                <FAQItem 
                  question="How is Lex Consulting different from traditional investment advisors?"
                  answer="Unlike traditional advisors who focus on selling products, Lex Consulting takes an education-first approach. We empower you with knowledge, frameworks, and strategic understanding that enables confident, independent decision-making in complex investment landscapes including cryptocurrency and alternative assets."
                />
                
                <FAQItem 
                  question="Do I need prior knowledge of cryptocurrency to benefit from your services?"
                  answer="No prior knowledge is required. Our educational approach is designed to meet you where you are, whether you're completely new to digital assets or looking to enhance your existing knowledge. We translate complex concepts into clear, actionable insights tailored to your level of understanding."
                />
                
                <FAQItem 
                  question="How do your services help Financial Advisors specifically?"
                  answer="Financial Advisors gain specialized knowledge to confidently address client questions about crypto and alternative assets, offering a competitive edge in the marketplace. Our frameworks help you evaluate opportunities, manage risks, and integrate these assets into broader portfolio strategies for your clients."
                />
                
                <FAQItem 
                  question="What is your approach to investment education?"
                  answer="Our three-step approach includes Strategic Assessment (understanding your goals and knowledge gaps), Knowledge Building (structured educational sessions with actionable insights), and Empowered Decision-Making (equipping you with frameworks that enable independent strategy development long after our engagement)."
                />
                
                <FAQItem 
                  question="What types of investments do you provide education on?"
                  answer="We focus on long-term investment strategies across traditional markets, cryptocurrency, and alternative assets. Our education covers portfolio construction principles, risk management frameworks, market analysis methodologies, and emerging asset integration strategies."
                />
                
                <FAQItem 
                  question="How long does the educational process typically take?"
                  answer="The timeline varies based on your goals and existing knowledge. Most clients engage with us for 3-6 months to build a comprehensive understanding. We offer flexible engagement options from intensive workshops to longer-term strategic partnerships."
                />
              </Box>
            </VStack>
          </Container>
        </Box>
      </LazySection>
    </>
  )
}
