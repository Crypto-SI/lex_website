'use client'

import { Box, Container, Flex, Heading, Text, Button, Stack, SimpleGrid, Icon, VStack, ButtonGroup } from '@chakra-ui/react'
import { FaCheckCircle, FaChartLine, FaChartPie, FaHandshake, FaArrowRight, FaPhoneAlt } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const clientCapacity = {
  status: 'Limited Availability', 
};

// Custom FAQ Item component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Box 
      border="1px solid" 
      borderColor="var(--lex-light-grey)" 
      borderRadius="md"
      overflow="hidden"
      mb={4}
    >
      <Box 
        as="button" 
        onClick={() => setIsOpen(!isOpen)}
        py={4} 
        px={5}
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        _hover={{ bg: "var(--lex-off-white)" }}
        transition="all 0.2s"
      >
        <Box textAlign="left" fontWeight="600" className="heading-text">
          {question}
        </Box>
        <Box className={`prism-icon ${isOpen ? 'rotated' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9L12 16L21 9L12 2Z" fill="var(--lex-insight-blue)" fillOpacity="0.8" />
            <path d="M3 9V20L12 16V9L3 9Z" fill="var(--lex-insight-blue)" fillOpacity="0.6" />
            <path d="M12 9V16L21 20V9L12 9Z" fill="var(--lex-insight-blue)" fillOpacity="0.4" />
          </svg>
        </Box>
      </Box>
      <Box 
        className="faq-answer"
        height={isOpen ? "auto" : "0"}
        opacity={isOpen ? 1 : 0}
        py={isOpen ? 5 : 0}
        px={5}
        overflow="hidden"
        transition="all 0.3s"
      >
        <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
          {answer}
        </Text>
      </Box>
    </Box>
  );
};

export default function Home() {
  return (
    <Box> 
      <Box 
        className="hero-video-container"
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video-bg"
          poster="/poster-frame.jpg" // Optional: Add a poster image if needed
        >
          <source src="/loop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to ensure text readability */}
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          bg="var(--lex-deep-blue)" 
          opacity="0.5" 
          zIndex="0"
        />

        {/* Hero Content */}
        <Box className="container hero-content">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box maxW={{ base: '100%', md: '60%' }} pr={{ md: 12 }} mb={{ base: 10, md: 0 }}>
              <Box
                display="inline-block"
                position="relative"
                mb={6}
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(0, 0, 0, 0.4)"
                  backdropFilter="blur(8px)"
                  borderRadius="lg"
                  zIndex={-1}
                  transform="scaleX(1.02) scaleY(1.1)"
                />
                <Heading 
                  as="h1" 
                  size="2xl" 
                  fontWeight="bold" 
                  className="heading-text hero-heading"
                  letterSpacing="wider"
                  p={3}
                >
                  Navigate Complex Markets with Expert Guidance
                </Heading>
              </Box>
              <Text 
                fontSize="xl" 
                mb={8} 
                color="white" 
                className="body-text hero-text"
                lineHeight="1.6"
                textShadow="0 1px 3px rgba(0,0,0,0.9)"
                bg="rgba(0, 0, 0, 0.2)"
                p={3}
                borderRadius="md"
              >
                Lex Consulting provides premium education on long-term investment strategy, crypto, and alternative assets for discerning High Net Worth Individuals and Financial Advisors.
              </Text>
              <Box 
                display="flex" 
                flexDirection={{ base: 'column', sm: 'row' }} 
                gap={{ base: 3, sm: 6 }}
                justifyContent={{ base: 'center', md: 'flex-start' }}
                width="100%"
              >
                <Link href="/services" style={{ textDecoration: 'none', width: '100%' }}>
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
                    Explore Our Services <Icon as={FaArrowRight} ml={2} />
                  </Button>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none', width: '100%' }}>
                  <Button 
                    variant="outline" 
                    borderColor="white"
                    color="white"
                    size="lg"
                    className="ui-text"
                    fontWeight="600"
                    px={8}
                    borderRadius="full"
                    borderWidth="2px"
                    _hover={{
                      bg: "rgba(255,255,255,0.15)",
                      borderColor: "var(--lex-insight-blue)",
                      color: "var(--lex-insight-blue)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
                    }}
                    _active={{
                      bg: "rgba(255,255,255,0.1)",
                      transform: "translateY(0)"
                    }}
                    transition="all 0.2s ease"
                  >
                    <Icon as={FaPhoneAlt} mr={2} /> Schedule Discovery Call
                  </Button>
                </Link>
              </Box>
            </Box>
            {/* Removed empty box since video background fills the space */}
          </Flex>
        </Box>
      </Box>

      <Box py={20} bg="var(--lex-off-white)">
        <Box className="container">
          <Box textAlign="center" mb={12}>
            <Heading as="h2" size="xl" className="heading-text" mb={4}>Expert Educational Consulting</Heading>
            <Text maxW="container.md" fontSize="lg" color="var(--lex-slate-grey)" className="body-text" mx="auto">
              Empowering HNWIs and FAs with clarity and strategy in complex investment landscapes including crypto and alternatives.
            </Text>
          </Box>
          
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={10} textAlign="center">
            <Box p={6} bg="white" borderRadius="lg" boxShadow="base" height="100%" display="flex" flexDirection="column" alignItems="center">
              <Icon as={FaChartLine} w={10} h={10} color="var(--lex-insight-blue)" mb={4} />
              <Heading as="h3" size="md" mb={2} className="heading-text">Strategic Investment Education</Heading>
              <Text color="var(--lex-slate-grey)" className="body-text">Deep dives into long-term strategies, market analysis, and portfolio construction principles.</Text>
            </Box>
            
            <Box p={6} bg="white" borderRadius="lg" boxShadow="base" height="100%" display="flex" flexDirection="column" alignItems="center">
              <Icon as={FaChartPie} w={10} h={10} color="var(--lex-insight-blue)" mb={4} />
              <Heading as="h3" size="md" mb={2} className="heading-text">Crypto & Alternative Assets</Heading>
              <Text color="var(--lex-slate-grey)" className="body-text">Navigating the complexities of digital assets, private equity, and other alternative investments.</Text>
            </Box>
            
            <Box p={6} bg="white" borderRadius="lg" boxShadow="base" height="100%" display="flex" flexDirection="column" alignItems="center">
              <Icon as={FaHandshake} w={10} h={10} color="var(--lex-insight-blue)" mb={4} />
              <Heading as="h3" size="md" mb={2} className="heading-text">Advisor & HNWI Focus</Heading>
              <Text color="var(--lex-slate-grey)" className="body-text">Tailored frameworks and insights specifically designed for Financial Advisors and their HNWI clients.</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box 
        py={16} 
        bg="white"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <style jsx global>{`
          .prism-icon {
            transition: transform 0.3s ease;
          }
          
          .prism-icon.rotated {
            transform: rotate(180deg);
          }
        `}</style>
        
        <Container 
          maxW="container.xl" 
          position="relative" 
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={10} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Frequently Asked Questions</Heading>
            
            <Box width="100%">
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
    </Box>
  )
}
