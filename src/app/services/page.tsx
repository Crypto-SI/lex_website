'use client'

import { useState } from 'react'
import {
  Box, Container, VStack, Heading, Text, SimpleGrid, Button,
  HStack, Icon, Badge, Flex
} from '@chakra-ui/react'
import { FaCheckCircle, FaArrowRight, FaSync, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa'
import Link from 'next/link'

// This would eventually come from a CMS or API
const clientCapacity = {
  status: 'Limited', // 'Standard', 'Limited', 'Full'
};

export default function ServicesPage() {
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({
    quarterly: false,
    sixMonth: false
  });

  const handleCardFlip = (cardId: string, e: React.MouseEvent) => {
    // Stop any event bubbling
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log(`Flipping card: ${cardId}, current state:`, flippedCards[cardId]);
    
    // Toggle the card state
    setFlippedCards(prev => {
      const updated = {
        ...prev,
        [cardId]: !prev[cardId]
      };
      console.log("Updated state:", updated);
      return updated;
    });
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      {/* Hero Section with enhanced background */}
      <Box 
        bg="var(--lex-deep-blue)" 
        color="white" 
        pt={28}
        pb={16}
        position="relative"
        width="100%"
        backgroundImage="linear-gradient(to right, rgba(10, 35, 66, 0.97), rgba(10, 35, 66, 0.92))"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        {/* Background pattern overlay */}
        <Box 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.08}
          className="dots-pattern"
          zIndex={0}
        />
        
        <Container 
          maxW="container.xl" 
          position="relative" 
          zIndex="1" 
          width="100%"
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={6} alignItems="center" textAlign="center">
            <Heading 
              as="h1" 
              size="2xl" 
              className="heading-text"
              mb={4}
              textShadow="0 2px 8px rgba(0,0,0,0.5)"
              maxW="container.lg"
              mx="auto"
              color="white"
              fontWeight="bold"
              letterSpacing="0.5px"
            >
              Helping You Build a Long-Term, Stress-Free Investment Strategy
            </Heading>
            <Text 
              fontSize="xl" 
              maxW="container.lg" 
              className="body-text"
              lineHeight="1.7"
              mx="auto"
            >
              Our Financial Education Consulting program is designed to help individuals navigate the complexities of investing and wealth-building with a structured, long-term approach.
            </Text>
            
            {/* Capacity Badge */}
            <Box mt={4} textAlign="center">
              <Badge 
                colorScheme={clientCapacity.status === 'Standard' ? 'green' : clientCapacity.status === 'Limited' ? 'orange' : 'red'}
                fontSize="md"
                py={2}
                px={4}
                borderRadius="full"
                bg={clientCapacity.status === 'Standard' ? 'green.500' : clientCapacity.status === 'Limited' ? 'orange.500' : 'red.500'}
                color="white"
                className="ui-text"
                fontWeight="600"
                boxShadow="0 2px 6px rgba(0,0,0,0.2)"
              >
                {clientCapacity.status === 'Standard' ? 'Open Enrollment' : 
                 clientCapacity.status === 'Limited' ? 'Limited Availability' : 'Full - Waitlist Only'}
              </Badge>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Add animations for the cards */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.1); }
          50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.3); }
          100% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.1); }
        }
        
        .service-card {
          animation: fadeInScale 0.8s ease-out forwards;
          transition: all 0.3s ease;
          perspective: 1000px;
        }
        
        /* Stagger the animations for each box */
        .service-card:nth-of-type(1) {
          animation-delay: 0.2s;
        }
        
        .service-card:nth-of-type(2) {
          animation-delay: 0.4s;
        }
        
        /* Card Flip Animation - Fixed Version */
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }
        
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          transition: transform 0.6s, opacity 0.6s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-front {
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          transform: rotateY(0deg);
          opacity: 1;
          z-index: 2;
        }
        
        .card-back {
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2.5rem;
          overflow-y: auto;
          opacity: 0;
          transform: rotateY(-180deg);
          z-index: 1;
        }
        
        /* When card is flipped */
        .card-flipped .card-front {
          transform: rotateY(180deg);
          opacity: 0;
          z-index: 1;
        }
        
        .card-flipped .card-back {
          transform: rotateY(0deg);
          opacity: 1;
          z-index: 2;
        }
        
        /* Add back hover animations */
        .service-card:hover:not(.card-flipped) .card-front {
          transform: translateY(-10px) rotateY(0deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .service-card:not(.card-flipped) .card-front {
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.6s;
        }
        
        .quarterly-card-front {
          background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
          border-top: 5px solid var(--lex-insight-blue);
        }
        
        .quarterly-card-front::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: radial-gradient(circle at 10px 10px, rgba(0, 123, 255, 0.05) 3px, transparent 4px);
          background-size: 20px 20px;
          opacity: 0.4;
          pointer-events: none;
          border-radius: 12px;
        }
        
        .sixmonth-card-front {
          background: linear-gradient(135deg, #ffffff 0%, #eef7ff 100%);
          border-top: 5px solid var(--lex-deep-blue);
        }
        
        .sixmonth-card-front::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: linear-gradient(45deg, rgba(0, 60, 120, 0.03) 25%, transparent 25%, transparent 50%, rgba(0, 60, 120, 0.03) 50%, rgba(0, 60, 120, 0.03) 75%, transparent 75%, transparent);
          background-size: 20px 20px;
          opacity: 0.6;
          pointer-events: none;
          border-radius: 12px;
        }
        
        .flip-hint {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: var(--lex-insight-blue);
          font-weight: 500;
          animation: pulseOpacity 2s infinite;
        }
        
        @keyframes pulseOpacity {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        /* Back flip hint */
        .back-flip-hint {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: var(--lex-insight-blue);
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 20px;
          background-color: rgba(0, 123, 255, 0.1);
          z-index: 10;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-flip-hint:hover {
          background-color: rgba(0, 123, 255, 0.2);
        }
      `}} />

      {/* About the Service Section */}
      <Box 
        py={16} 
        background="white"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <Container 
          maxW="container.xl" 
          position="relative" 
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={8} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">About the Service</Heading>
            <Text fontSize="lg" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto" textAlign="left">
              Our Financial Education Consulting program is designed to help individuals navigate the complexities of investing and wealth-building with a structured, long-term approach. Whether you're new to investing or looking to refine your strategy, we provide tailored guidance based on your financial goals and risk tolerance.
            </Text>
            <Text fontSize="lg" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto" textAlign="left">
              We focus on education, strategy, and ongoing support to ensure you feel confident in your financial decisions. This is not financial advice, but a roadmap to help you take control of your wealth-building journey.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Service Plans Section */}
      <Box 
        py={16} 
        background="linear-gradient(180deg, white 0%, rgba(248, 248, 248, 0.5) 100%)"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        {/* Subtle background designs */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          opacity={0.05}
          className="subtle-pattern-bg"
          zIndex={0}
        />
        <Container maxW="container.xl">
          <VStack gap={10} alignItems="stretch">
            <VStack gap={6} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
              <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Our Consulting Plans</Heading>
              <VStack gap={0} width="100%">
                <Text fontSize="xl" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                  Choose from our structured consulting plans that provide comprehensive education on traditional and digital asset investment strategies.
                </Text>
                <Text fontSize="md" mt={2} fontStyle="italic" color="var(--lex-slate-grey)">
                  Click on a plan to reveal details
                </Text>
              </VStack>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} py={8} position="relative" zIndex={1}>
              {/* Quarterly Plan */}
              <Box 
                minH="700px"
                position="relative"
                className={`service-card ${flippedCards.quarterly ? 'card-flipped' : ''}`}
                onClick={(e) => {
                  handleCardFlip('quarterly', e);
                }}
              >
                <Box className="card-inner">
                  {/* Front of Card */}
                  <Box 
                    className="card-front quarterly-card-front"
                    borderRadius="xl" 
                    boxShadow="xl" 
                    bg="white" 
                    border="1px solid"
                    borderColor="var(--lex-light-grey)"
                  >
                    <VStack gap={8} alignItems="center" justifyContent="center">
                      <Heading as="h3" size="xl" className="heading-text" color="var(--lex-deep-blue)">
                        Quarterly Plan
                      </Heading>
                      
                      <Box textAlign="center">
                        <Heading size="4xl" color="var(--lex-insight-blue)" className="heading-text" lineHeight="1">
                          $850
                        </Heading>
                        <Text fontSize="xl" color="var(--lex-slate-grey)" className="body-text">
                          per quarter
                        </Text>
                      </Box>
                      
                      <Text mt={4} color="var(--lex-slate-grey)" fontSize="md" fontStyle="italic">
                        Click to view details
                      </Text>
                    </VStack>
                    
                    <Box className="flip-hint">
                      <Text fontSize="sm">Click to flip</Text>
                      <Icon as={FaSync} boxSize={3} />
                    </Box>
                  </Box>
                  
                  {/* Back of Card */}
                  <Box 
                    className="card-back"
                    p={10} 
                    borderRadius="xl" 
                    boxShadow="xl" 
                    bg="white"
                    border="2px solid"
                    borderColor="var(--lex-insight-blue)"
                  >
                    <Box 
                      className="back-flip-hint"
                      onClick={(e) => {
                        handleCardFlip('quarterly', e);
                      }}
                    >
                      <Text fontSize="sm">Flip back</Text>
                      <Icon as={FaSync} boxSize={3} />
                    </Box>
                    
                    <VStack gap={8} alignItems="flex-start">
                      <Box>
                        <Heading as="h3" size="lg" mb={3} className="heading-text" color="var(--lex-deep-blue)">Quarterly Consulting Plan</Heading>
                        <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                          Three months of structured educational consulting
                        </Text>
                      </Box>
                      
                      <HStack alignItems="flex-end" gap={4}>
                        <Heading size="2xl" color="var(--lex-insight-blue)" className="heading-text">
                          $850
                        </Heading>
                        <Text fontSize="lg" color="var(--lex-slate-grey)" pb={1} className="body-text">per quarter</Text>
                      </HStack>
                      
                      <VStack width="100%" py={4} gap={4} alignItems="flex-start">
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">2 Calls per Month with Expert Consultants (Up to 1 hour each)</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Market insights and trade discussions</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Market Update Reports and Risk Management Strategies</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Direct Q&A Support via Telegram</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Continuous support throughout the plan duration</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to in-person meetups (where possible)</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to trade alerts</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to expert consultants</Text>
                        </HStack>
                      </VStack>
                      
                      <Box width="100%" pt={4}>
                        <Link 
                          href="/contact" 
                          style={{ width: '100%', display: 'block' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button 
                            bg="var(--lex-insight-blue)"
                            color="white"
                            size="lg"
                            className="ui-text"
                            width="100%"
                            height="60px"
                            fontSize="md"
                            fontWeight="600"
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HStack gap={2} width="100%" justifyContent="center">
                              <Text>Get Started</Text>
                              <Icon as={FaArrowRight} />
                            </HStack>
                          </Button>
                        </Link>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>
              
              {/* 6-Month Plan */}
              <Box 
                minH="700px"
                position="relative"
                className={`service-card ${flippedCards.sixMonth ? 'card-flipped' : ''}`}
                onClick={(e) => {
                  handleCardFlip('sixMonth', e);
                }}
              >
                <Box className="card-inner">
                  {/* Front of Card */}
                  <Box 
                    className="card-front sixmonth-card-front"
                    borderRadius="xl" 
                    boxShadow="xl" 
                    bg="white" 
                    border="2px solid"
                    borderColor="var(--lex-insight-blue)"
                  >
                    <Badge 
                      position="absolute" 
                      top={5} 
                      right={5} 
                      colorScheme="blue"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      className="ui-text"
                    >
                      MOST POPULAR
                    </Badge>
                    
                    <VStack gap={8} alignItems="center" justifyContent="center">
                      <Heading as="h3" size="xl" className="heading-text" color="var(--lex-deep-blue)">
                        6-Month Plan
                      </Heading>
                      
                      <Box textAlign="center">
                        <Heading size="4xl" color="var(--lex-insight-blue)" className="heading-text" lineHeight="1">
                          $1,500
                        </Heading>
                        <Text fontSize="xl" color="var(--lex-slate-grey)" className="body-text">
                          for 6 months
                        </Text>
                      </Box>
                      
                      <Text mt={4} color="var(--lex-slate-grey)" fontSize="md" fontStyle="italic">
                        Click to view details
                      </Text>
                    </VStack>
                    
                    <Box className="flip-hint">
                      <Text fontSize="sm">Click to flip</Text>
                      <Icon as={FaSync} boxSize={3} />
                    </Box>
                  </Box>
                  
                  {/* Back of Card */}
                  <Box 
                    className="card-back"
                    p={10} 
                    borderRadius="xl" 
                    boxShadow="xl" 
                    bg="white"
                    border="2px solid"
                    borderColor="var(--lex-insight-blue)"
                  >
                    <Box 
                      className="back-flip-hint"
                      onClick={(e) => {
                        handleCardFlip('sixMonth', e);
                      }}
                    >
                      <Text fontSize="sm">Flip back</Text>
                      <Icon as={FaSync} boxSize={3} />
                    </Box>
                    
                    <VStack gap={8} alignItems="flex-start">
                      <Box>
                        <Heading as="h3" size="lg" mb={3} className="heading-text" color="var(--lex-deep-blue)">6-Month Consulting Plan</Heading>
                        <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                          Six months of comprehensive educational support
                        </Text>
                      </Box>
                      
                      <HStack alignItems="flex-end" gap={4}>
                        <Heading size="2xl" color="var(--lex-insight-blue)" className="heading-text">
                          $1,500
                        </Heading>
                        <Text fontSize="lg" color="var(--lex-slate-grey)" pb={1} className="body-text">for 6 months</Text>
                      </HStack>
                      
                      <VStack width="100%" py={4} gap={4} alignItems="flex-start">
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" fontWeight="600" color="var(--lex-slate-grey)">Everything in the Quarterly Plan, plus:</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">3 Calls per Month with Expert Consultants (Up to 1 hour each)</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Strategic Wealth Allocation & Review</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Ongoing Portfolio Adjustments & Strategic Reviews</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to Crypto AI Consultant</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to over $50,000 worth of paid data</Text>
                        </HStack>
                        <HStack alignItems="flex-start" gap={3}>
                          <Box color="var(--lex-insight-blue)" mt={1}><FaCheckCircle /></Box>
                          <Text className="body-text" color="var(--lex-slate-grey)">Access to Portfolio Management Assistant Services</Text>
                        </HStack>
                      </VStack>
                      
                      <Box width="100%" pt={4}>
                        <Link 
                          href="/contact" 
                          style={{ width: '100%', display: 'block' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button 
                            bg="var(--lex-deep-blue)"
                            color="white"
                            size="lg"
                            className="ui-text"
                            width="100%"
                            height="60px"
                            fontSize="md"
                            fontWeight="600"
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HStack gap={2} width="100%" justifyContent="center">
                              <Text>Get Started</Text>
                              <Icon as={FaArrowRight} />
                            </HStack>
                          </Button>
                        </Link>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>
            </SimpleGrid>

            {/* Custom Solutions Section */}
            <Box 
              py={12} 
              px={{ base: 8, md: 12 }} 
              bg="white" 
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="var(--lex-light-grey)"
              position="relative"
              overflow="hidden"
              transition="all 0.3s ease"
              mt={10}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                opacity={0.03}
                className="custom-pattern"
                zIndex={0}
              />
              
              <VStack gap={8} alignItems="center" textAlign="center" position="relative" zIndex={1}>
                <Heading as="h3" size="xl" className="heading-text" color="var(--lex-deep-blue)">Custom Solutions</Heading>
                <Text className="body-text" fontSize="xl" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                  Beyond our standard plans, we offer custom educational solutions for family offices, financial advisory firms, and institutions requiring specialized knowledge frameworks.
                </Text>
                <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                  Please contact us directly to discuss your specific educational needs and how we can design a curriculum tailored to your organization's goals.
                </Text>
                <Link 
                  href="/contact" 
                  style={{ textDecoration: 'none' }}
                >
                  <Button 
                    variant="outline" 
                    borderColor="var(--lex-deep-blue)"
                    color="var(--lex-deep-blue)"
                    borderWidth="2px"
                    size="lg"
                    className="ui-text"
                    fontWeight="600"
                    px={8}
                    py={7}
                    borderRadius="full"
                    _hover={{
                      bg: "rgba(10, 35, 66, 0.05)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    _active={{
                      bg: "rgba(10, 35, 66, 0.1)",
                      transform: "translateY(0)"
                    }}
                    transition="all 0.2s ease"
                  >
                    Contact Us to Discuss Custom Options
                  </Button>
                </Link>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Why Work With Us Section */}
      <Box 
        py={16} 
        background="white"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <Container 
          maxW="container.xl" 
          position="relative" 
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={10} alignItems="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Why Work With Us</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} width="100%" mx="auto">
              <Box 
                p={8} 
                bg="var(--lex-off-white)" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                className="approach-box"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="flex-start" gap={4} position="relative" zIndex={1}>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Structured & Simplified Approach</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" textAlign="left">
                    No complicated jargon, just a clear automated step-by-step framework.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="var(--lex-off-white)" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                className="approach-box"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="flex-start" gap={4} position="relative" zIndex={1}>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Long-Term Strategy</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" textAlign="left">
                    We focus on sustainable investing, not short-term speculation.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="var(--lex-off-white)" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                className="approach-box"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="flex-start" gap={4} position="relative" zIndex={1}>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Exclusive Access to CryptoSI</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" textAlign="left">
                    Gain insights from Crypto.Si, a veteran in the crypto space since 2012 with a background in computer science. He specialises in the fundamental side of crypto investing, offering deep research and strategic insights.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="var(--lex-off-white)" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                className="approach-box"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="flex-start" gap={4} position="relative" zIndex={1}>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Exclusive Access to Financial Navigator</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" textAlign="left">
                    Gain insights from Alex, the creator of Financial Navigator. With years of experience in long-term investing and financial education, Alex helps clients simplify their journey with real-world strategies tailored for busy lifestyles.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="var(--lex-off-white)" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                className="approach-box"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
                gridColumn={{ base: "auto", md: "span 2" }}
              >
                <VStack alignItems="flex-start" gap={4} position="relative" zIndex={1}>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Personalised Support</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)" textAlign="left">
                    Each session is tailored to your specific goals and risk tolerance.
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Disclaimer Section */}
      <Box 
        py={12} 
        background="var(--lex-off-white)"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <Container 
          maxW="container.xl" 
          position="relative" 
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={6} alignItems="center" width="100%" maxW="container.lg" mx="auto">
            <HStack alignItems="center" gap={3}>
              <Icon as={FaInfoCircle} color="var(--lex-deep-blue)" boxSize={6} />
              <Heading as="h2" size="lg" className="heading-text" color="var(--lex-deep-blue)">Important Disclaimer</Heading>
            </HStack>
            
            <Box 
              p={8} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              width="100%"
              border="1px solid"
              borderColor="var(--lex-light-grey)"
            >
              <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                This is not financial advice. All information provided is for educational purposes only. We are not legally qualified to provide financial advice. Please conduct your own research and consult a licensed professional before making investment decisions.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
} 