'use client'

import { 
  Box, Container, Heading, Text, VStack, 
  HStack, Circle, Button, Flex, Icon, SimpleGrid, Accordion
} from '@chakra-ui/react'
import { 
  FaCalendarCheck, FaClipboardList, FaLightbulb, 
  FaChartLine, FaArrowRight, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaArrowDown
} from 'react-icons/fa'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SlideData {
  image: string;
  heading: string;
  text: string;
}

export default function OnboardingPage() {
  // Slideshow data
  const slides: SlideData[] = [
    {
      image: "/1.png",
      heading: "Welcome to Lex Consulting",
      text: "Your journey to structured financial education and long-term investment strategies begins here. Let's walk through our simple onboarding process."
    },
    {
      image: "/2.png",
      heading: "Getting Started",
      text: "Reach out to us through our website contact form, email (info@lexconsulting.com), or LinkedIn. We'll respond within 24 hours with information about our services and a complimentary discovery call offer."
    },
    {
      image: "/3.png",
      heading: "Discovery Call",
      text: "During this brief 15-20 minute complimentary call, we'll discuss your educational goals and determine if our services align with your needs. This is where we begin to understand your unique situation."
    },
    {
      image: "/4.png",
      heading: "Service Agreement",
      text: "If we're a good match, you'll receive our formal service agreement and proposal outlining the specific educational support we'll provide. Review at your convenience and sign digitally."
    },
    {
      image: "/5.png",
      heading: "Simple Payment Process",
      text: "After signing, you'll receive an invoice based on your selected plan. We accept both traditional and crypto payment methods for your convenience."
    },
    {
      image: "/6.png",
      heading: "Official Welcome",
      text: "Once payment is confirmed, you'll receive a welcome confirmation. This marks the beginning of your journey with Lex Consulting and the official start of our service term."
    },
    {
      image: "/7.png",
      heading: "Scheduling Your First Session",
      text: "Using our scheduling tool, you'll book your first consulting session at a time convenient for you. You'll also receive instructions for joining our secure Telegram communication channel."
    },
    {
      image: "/8.png",
      heading: "Your First Consulting Session",
      text: "Your initial one-hour educational session sets the foundation for your learning journey. Our experts will begin addressing your specific knowledge gaps with structured guidance."
    },
    {
      image: "/9.png",
      heading: "Continuous Educational Support",
      text: "Throughout your membership, you'll receive regular consulting sessions, market insights, and direct support via Telegram, all designed to build your investment knowledge and confidence."
    },
    {
      image: "/10.png",
      heading: "Ready to Begin?",
      text: "Start your financial education journey today by contacting us for your complimentary discovery call. We look forward to helping you build a structured, long-term investment strategy."
    }
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 50);
    }, 50);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 50);
    }, 50);
  };
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 50);
  };
  
  // Get the previous, current, and next slide indices with wrapping
  const getPrevIndex = () => (currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const getNextIndex = () => (currentSlide === slides.length - 1 ? 0 : currentSlide + 1);

  const steps = [
    {
      title: "Discovery Call",
      description: "A no-obligation 30-minute call to understand your needs and determine if our services are a good fit for your goals.",
      icon: FaCalendarCheck,
      color: "var(--lex-insight-blue)"
    },
    {
      title: "Initial Assessment",
      description: "Complete a detailed questionnaire about your experience, goals, and areas of interest to help us customize your educational path.",
      icon: FaClipboardList,
      color: "var(--lex-insight-blue)"
    },
    {
      title: "Plan Creation",
      description: "We develop a tailored educational roadmap designed specifically for your knowledge gaps and objectives.",
      icon: FaLightbulb,
      color: "var(--lex-insight-blue)"
    },
    {
      title: "Implementation",
      description: "Regular consulting sessions, resources, and guidance to help you navigate the investment landscape with confidence.",
      icon: FaChartLine,
      color: "var(--lex-insight-blue)"
    }
  ];

  return (
    <>
      <style jsx global>{`
        /* Reset box model and positioning for this page */
        body {
          overflow-x: hidden;
        }
        
        /* Override any chakra containers to be properly centered */
        .chakra-container {
          margin-left: auto !important;
          margin-right: auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          max-width: 80rem !important; /* Matches container.xl */
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        /* Force full width on all root boxes */
        .full-width-box {
          width: 100vw !important;
          max-width: 100% !important;
          margin-left: calc(-50vw + 50%) !important;
          margin-right: calc(-50vw + 50%) !important;
          position: relative !important;
          left: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Ensure center container is properly centered */
        .center-container {
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
          max-width: var(--container-max-width) !important;
        }
        
        /* Reset any potential alignment issues */
        .chakra-stack {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        /* Force text alignment center */
        .text-center {
          text-align: center !important;
        }
        
        /* Slideshow styles */
        .slide-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
          perspective: 1200px;
        }
        
        /* Slideshow frame styling */
        .slideshow-frame {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        
        .slideshow-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(112, 128, 144, 0.2); /* Slate Grey with transparency */
          border-radius: 16px;
          background: linear-gradient(to right, 
            rgba(10, 35, 66, 0.05) 0%, /* Deep Blue with transparency */
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(10, 35, 66, 0.05) 100%
          );
          box-shadow: 
            0 4px 30px rgba(10, 35, 66, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .slideshow-frame::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 123, 255, 0.05); /* Insight Blue with transparency */
          filter: blur(30px);
          z-index: 1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        /* Subtle page counter */
        .slide-counter {
          position: absolute;
          top: 15px;
          right: 50px;
          font-family: var(--font-heading);
          font-size: 14px;
          color: rgba(10, 35, 66, 0.6);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .slide-counter::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: rgba(0, 123, 255, 0.3);
          margin-right: 4px;
        }
        
        /* Corner accents for the frame */
        .slideshow-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-style: solid;
          border-color: rgba(0, 123, 255, 0.2); /* Insight Blue with transparency */
          z-index: 3;
        }
        
        .corner-top-left {
          top: 15px;
          left: 15px;
          border-width: 1px 0 0 1px;
          border-top-left-radius: 4px;
        }
        
        .corner-top-right {
          top: 15px;
          right: 15px;
          border-width: 1px 1px 0 0;
          border-top-right-radius: 4px;
        }
        
        .corner-bottom-left {
          bottom: 15px;
          left: 15px;
          border-width: 0 0 1px 1px;
          border-bottom-left-radius: 4px;
        }
        
        .corner-bottom-right {
          bottom: 15px;
          right: 15px;
          border-width: 0 1px 1px 0;
          border-bottom-right-radius: 4px;
        }
        
        .slideshow-inner {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
        
        .slideshow-decorative-line {
          position: absolute;
          height: 2px;
          width: 40%;
          background: linear-gradient(to right, 
            transparent, 
            rgba(0, 123, 255, 0.3) 50%, /* Insight Blue with transparency */
            transparent
          );
          bottom: 25px;
          left: 30%;
          z-index: 1;
        }
        
        .slide {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          background: white;
          overflow: hidden;
          transform-origin: center center;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          transition: transform 650ms cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 650ms cubic-bezier(0.4, 0, 0.2, 1),
                      filter 650ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .slide.current {
          z-index: 10;
          opacity: 1;
          transform: translateX(0%) scale(1) rotateY(0deg);
          width: 75%;
          max-width: 800px;
          height: 520px;
          filter: blur(0);
        }
        
        .slide.prev {
          z-index: 5;
          opacity: 0.7;
          transform: translateX(-70%) scale(0.85) rotateY(10deg);
          filter: blur(2px);
          width: 60%;
          max-width: 600px;
          height: 420px;
          pointer-events: none;
        }
        
        .slide.next {
          z-index: 5;
          opacity: 0.7;
          transform: translateX(70%) scale(0.85) rotateY(-10deg);
          filter: blur(2px);
          width: 60%;
          max-width: 600px;
          height: 420px;
          pointer-events: none;
        }
        
        .slide:not(.current):not(.prev):not(.next) {
          opacity: 0;
          transform: translateX(-100%);
          pointer-events: none;
        }
        
        .slide-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .slide-nav-button:hover {
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .slide-nav-button.prev {
          left: 20px;
        }
        
        .slide-nav-button.next {
          right: 20px;
        }
        
        .slide-indicators {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          width: 100%;
        }
        
        .slide-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slide-indicator.active {
          background: var(--lex-insight-blue);
          width: 30px;
          border-radius: 10px;
        }
        
        @media (max-width: 768px) {
          .slide.current {
            width: 90%;
            max-width: none;
            height: 300px;
          }
          
          .slide.prev, .slide.next {
            opacity: 0;
            pointer-events: none;
          }
        }
      `}</style>
      
      <Box pt={24} pb={12}>
        <Container maxW="container.xl" centerContent>
          <div className="center-container">
            <VStack gap={10} width="100%" alignItems="center" mx="auto" className="text-center">
              <VStack textAlign="center" gap={4} maxW="container.lg" className="text-center">
                <Heading as="h1" size="2xl" className="heading-text text-center" color="var(--lex-deep-blue)">
                  Onboarding Process
            </Heading>
                <Text className="body-text" color="var(--lex-slate-grey)" fontSize="lg" maxW="container.md">
                  At Lex Consulting, we've designed a streamlined onboarding experience that prioritizes your time and goals. Our focus is on getting to know your educational needs so we can provide the most effective guidance from day one.
            </Text>
          </VStack>
            </VStack>
          </div>
        </Container>
      </Box>
      
      {/* Slideshow Section */}
      <Box py={16} bg="white" width="100%" className="full-width-box">
        <Container maxW="container.xl" centerContent className="text-center">
          <div className="center-container">
            <VStack gap={10} width="100%" alignItems="center" mx="auto" className="text-center">
              <VStack textAlign="center" gap={4} maxW="2xl" className="text-center">
                <Heading as="h2" size="xl" className="heading-text text-center" color="var(--lex-deep-blue)">
                  Your Journey With Lex Consulting
                </Heading>
                <Text className="body-text" color="var(--lex-slate-grey)" fontSize="lg">
                  A visual walkthrough of our onboarding process
                </Text>
                  </VStack>
                  
              {/* Slideshow Container */}
              <Box width="100%" position="relative" height={{ base: "450px", md: "650px" }} overflow="hidden">
                <div className="slideshow-frame">
                  <div className="slideshow-corner corner-top-left"></div>
                  <div className="slideshow-corner corner-top-right"></div>
                  <div className="slideshow-corner corner-bottom-left"></div>
                  <div className="slideshow-corner corner-bottom-right"></div>
                  <div className="slideshow-decorative-line"></div>
                  <div className="slide-counter">{currentSlide + 1}/{slides.length}</div>
                  <div className="slideshow-inner">
                    <div className="slide-container">
                      {/* Current Slide */}
                      <div 
                        className={`slide current`} 
                      >
                        <div className="image-container" style={{ height: '100%' }}>
                          <Image
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].heading}
                            fill
                            unoptimized={true}
                            style={{ objectFit: 'contain' }}
                            priority
                          />
                        </div>
                      </div>
                      
                      {/* Previous Slide (Blurred) */}
                      <div 
                        className={`slide prev`} 
                      >
                        <div className="image-container">
                          <Image
                            src={slides[getPrevIndex()].image}
                            alt={slides[getPrevIndex()].heading}
                            fill
                            unoptimized={true}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                      
                      {/* Next Slide (Blurred) */}
                      <div 
                        className={`slide next`} 
                      >
                        <div className="image-container">
                          <Image
                            src={slides[getNextIndex()].image}
                            alt={slides[getNextIndex()].heading}
                            fill
                            unoptimized={true}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                      
                      {/* Navigation Buttons */}
                      <button className="slide-nav-button prev" onClick={prevSlide} aria-label="Previous slide">
                        <Icon as={FaChevronLeft} color="var(--lex-deep-blue)" boxSize={5} />
                      </button>
                      <button className="slide-nav-button next" onClick={nextSlide} aria-label="Next slide">
                        <Icon as={FaChevronRight} color="var(--lex-deep-blue)" boxSize={5} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Slide Indicators */}
                <div className="slide-indicators">
                  {slides.map((_, index) => (
                    <div 
                      key={index} 
                      className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </Box>
              
              {/* Call to Action */}
              <Box mt={8} width="100%" display="flex" justifyContent="center">
                        <Link href="/contact" style={{ textDecoration: 'none' }}>
                          <Button 
                            bg="var(--lex-insight-blue)"
                            color="white"
                            size="lg"
                            className="ui-text"
                            fontWeight="600"
                            px={8}
                            borderRadius="full"
                            boxShadow="0 4px 15px rgba(0, 123, 255, 0.3)"
                            _hover={{
                              bg: "#0069d9",
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 20px rgba(0, 123, 255, 0.4)"
                            }}
                            _active={{
                              bg: "#0056b3",
                              transform: "translateY(0)",
                              boxShadow: "0 2px 10px rgba(0, 123, 255, 0.3)"
                            }}
                            transition="all 0.2s ease"
                          >
                            <HStack gap={2}>
                      <Text>Start Your Journey Today</Text>
                      <Icon as={FaArrowRight} />
                            </HStack>
                          </Button>
                        </Link>
              </Box>
          </VStack>
          </div>
        </Container>
      </Box>
      
      {/* FAQ Section */}
      <Box id="faq-section" py={{ base: 12, md: 16 }} bg="var(--lex-off-white)" width="100%" className="full-width-box">
        <Container maxW="container.xl" centerContent className="text-center">
          <div className="center-container">
            <VStack gap={12} alignItems="center" mx="auto" className="text-center">
              <VStack gap={4} alignItems="center" textAlign="center" maxW="2xl" className="text-center">
                <Heading size="xl" className="heading-text text-center" color="var(--lex-deep-blue)">
                  Frequently Asked Questions
                </Heading>
                <Text className="body-text" color="var(--lex-slate-grey)" fontSize="lg">
                  Find answers to common questions about our onboarding process
                </Text>
              </VStack>

              <VStack gap={6} alignItems="stretch" width="100%" maxW="3xl">
              <Box 
                p={8} 
                  width="100%" 
                  borderRadius="lg" 
                bg="white" 
                boxShadow="md" 
                borderWidth="1px" 
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              >
                <Heading as="h3" size="md" mb={3} className="heading-text" color="var(--lex-deep-blue)">How long does the onboarding process take?</Heading>
                <Text className="body-text" color="var(--lex-slate-grey)">
                  From your initial discovery call to your first consulting session typically takes 1-2 weeks, depending on your availability and how quickly you complete the initial assessment.
                </Text>
              </Box>
              
              <Box 
                p={8} 
                  width="100%" 
                  borderRadius="lg" 
                bg="white" 
                boxShadow="md" 
                borderWidth="1px" 
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              >
                <Heading as="h3" size="md" mb={3} className="heading-text" color="var(--lex-deep-blue)">What happens during the discovery call?</Heading>
                <Text className="body-text" color="var(--lex-slate-grey)">
                  We'll discuss your background, experience level, specific areas of interest, and goals. This helps us determine if our services align with your needs and gives you a chance to ask questions about our approach.
                </Text>
              </Box>
              
              <Box 
                p={8} 
                  width="100%"
                  borderRadius="lg" 
                bg="white" 
                boxShadow="md" 
                borderWidth="1px" 
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              >
                <Heading as="h3" size="md" mb={3} className="heading-text" color="var(--lex-deep-blue)">Can I change my educational focus as we progress?</Heading>
                <Text className="body-text" color="var(--lex-slate-grey)">
                  Absolutely. Markets and interests evolve, and we're flexible in adapting your educational journey as needed. We regularly review progress and can shift focus areas based on your developing needs.
                </Text>
              </Box>
            </VStack>
            
              <Box width="100%" pt={6} display="flex" justifyContent="center">
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Button 
                  bg="var(--lex-deep-blue)"
                  color="white"
                  size="lg"
                  className="ui-text"
                  fontWeight="600"
                  px={8}
                  borderRadius="full"
                  boxShadow="0 4px 15px rgba(10, 35, 66, 0.3)"
                  _hover={{
                    bg: "#133c76",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(10, 35, 66, 0.4)"
                  }}
                  _active={{
                    bg: "#0d2954",
                    transform: "translateY(0)",
                    boxShadow: "0 2px 10px rgba(10, 35, 66, 0.3)"
                  }}
                  transition="all 0.2s ease"
                >
                  <HStack gap={2}>
                      <Text>Have more questions?</Text>
                    <Icon as={FaArrowRight} />
                  </HStack>
                </Button>
              </Link>
            </Box>
          </VStack>
          </div>
        </Container>
      </Box>
    </>
  )
} 