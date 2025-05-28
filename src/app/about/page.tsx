'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Flex, Center, Image, Link } from '@chakra-ui/react'
import { FaLinkedin, FaTwitter, FaUser, FaGithub, FaInstagram } from 'react-icons/fa'

export default function AboutPage() {
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
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={6} alignItems="center" textAlign="center" maxW="container.lg" width="100%" mx="auto">
            <Heading 
              as="h1" 
              size="2xl" 
              className="heading-text"
              mb={4}
              textShadow="0 2px 8px rgba(0,0,0,0.5)"
              color="white"
              fontWeight="bold"
              letterSpacing="0.5px"
            >
              About Lex Consulting
            </Heading>
            <Text 
              fontSize="xl" 
              maxW="container.md" 
              className="body-text"
              lineHeight="1.7"
            >
              Founded with a clear mission: to demystify complex investment landscapes for Financial Advisors 
              and High Net Worth Individuals through education-first consulting.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Company Overview Section */}
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
        
        <Container 
          maxW="container.xl" 
          position="relative" 
          zIndex={1}
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={12} alignItems="center" width="100%" maxW="container.lg" mx="auto">
            <VStack gap={6} alignItems="center" textAlign="center" width="100%">
              <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Our Story</Heading>
              <Text fontSize="xl" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                Our team brings decades of combined experience across traditional finance, digital assets, and alternative investments. We believe in empowering our clients with knowledge, frameworks, and strategies that enable confident decision-making in rapidly evolving markets.
              </Text>
              <Text fontSize="xl" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                At Lex Consulting, we understand that the intersection of traditional finance and emerging digital assets creates unique challenges and opportunities. Our approach focuses on education rather than sales, ensuring our clients develop the foundational understanding needed to navigate complex investment landscapes with confidence.
              </Text>
            </VStack>

            <Box borderTop="1px solid" borderColor="var(--lex-light-grey)" py={2} width="100%" maxW="container.md" mx="auto" />

            {/* Team Section */}
            <VStack gap={8} alignItems="center" textAlign="center" width="100%">
              <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Our Experts</Heading>
              <Text fontSize="xl" className="body-text" color="var(--lex-slate-grey)" maxW="container.md" mx="auto">
                Meet the team dedicated to elevating your investment knowledge and strategy.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} width="100%" pt={6} mx="auto">
                {/* CryptoSI */}
                <Box 
                  p={8} 
                  boxShadow="lg" 
                  borderRadius="lg" 
                  bg="white"
                  border="1px solid"
                  borderColor="var(--lex-light-grey)"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl"
                  }}
                >
                  <VStack gap={6} alignItems="center" textAlign="center">
                    <Flex 
                      justifyContent="center" 
                      alignItems="center"
                      width="100%" 
                      height="385px" 
                      mb={4}
                      overflow="hidden"
                      bg="white"
                      p={0}
                    >
                      <Box
                        width="100%"
                        height="100%"
                        position="relative"
                        overflow="hidden"
                      >
                        <Image 
                          src="/crylex.png" 
                          alt="CryptoSI" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 8%',
                            imageRendering: 'auto',
                          }}
                        />
                      </Box>
                    </Flex>
                    <Heading as="h3" size="lg" className="heading-text" color="var(--lex-deep-blue)">CryptoSI</Heading>
                    <Text fontWeight="medium" className="ui-text" color="var(--lex-insight-blue)">Co-Founder & DAO Specialist</Text>
                    <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                      Visionary in decentralized finance with extensive experience across high-impact DAO ecosystems including PIVX, Sentinel DVPN, and MakerDAO. Author of The Ultimate DAO Handbook, bridging complex blockchain concepts with actionable insights for long-term value creation.
                    </Text>
                    <HStack gap={4} justifyContent="center" width="100%">
                      <a 
                        href="https://x.com/Crypto_SI"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--lex-insight-blue)', display: 'flex' }}
                      >
                        <Icon as={FaTwitter} boxSize={5} cursor="pointer" />
                      </a>
                      <a 
                        href="https://github.com/Crypto-SI"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--lex-insight-blue)', display: 'flex' }}
                      >
                        <Icon as={FaGithub} boxSize={5} cursor="pointer" />
                      </a>
                      <a 
                        href="https://www.instagram.com/cryptosi.eth/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--lex-insight-blue)', display: 'flex' }}
                      >
                        <Icon as={FaInstagram} boxSize={5} cursor="pointer" />
                      </a>
                    </HStack>
                  </VStack>
                </Box>

                {/* Financial Navigator */}
                <Box 
                  p={8} 
                  boxShadow="lg" 
                  borderRadius="lg" 
                  bg="white"
                  border="1px solid"
                  borderColor="var(--lex-light-grey)"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl"
                  }}
                >
                  <VStack gap={6} alignItems="center" textAlign="center">
                    <Flex 
                      justifyContent="center" 
                      alignItems="center"
                      width="100%" 
                      height="385px" 
                      mb={4}
                      overflow="hidden"
                      bg="white"
                      p={0}
                    >
                      <Box
                        width="100%"
                        height="100%"
                        position="relative"
                        overflow="hidden"
                      >
                        <Image 
                          src="/FNlex.png" 
                          alt="Financial Navigator" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 12%',
                            imageRendering: 'auto',
                          }}
                        />
                      </Box>
                    </Flex>
                    <Heading as="h3" size="lg" className="heading-text" color="var(--lex-deep-blue)">Financial Navigator</Heading>
                    <Text fontWeight="medium" className="ui-text" color="var(--lex-insight-blue)">Co-Founder & Financial Strategist</Text>
                    <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                      A seasoned financial consultant with deep expertise in financial modeling, risk assessment, and multi-jurisdictional compliance. Brings a rare dual fluency in both traditional finance and blockchain systems, focusing on capital efficiency and sustainable strategy.
                    </Text>
                    <HStack gap={4} justifyContent="center" width="100%">
                      <a 
                        href="https://www.linkedin.com/in/alex-codling-637b22244/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--lex-insight-blue)', display: 'flex' }}
                      >
                        <Icon as={FaLinkedin} boxSize={5} cursor="pointer" />
                      </a>
                      <a 
                        href="https://x.com/Alex_Codling_"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--lex-insight-blue)', display: 'flex' }}
                      >
                        <Icon as={FaTwitter} boxSize={5} cursor="pointer" />
                      </a>
                    </HStack>
                  </VStack>
                </Box>
              </SimpleGrid>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Values Section */}
      <Box 
        py={16} 
        background="linear-gradient(180deg, rgba(248, 248, 248, 0.5) 0%, rgba(248, 248, 248, 1) 100%)"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        {/* Subtle background pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          opacity={0.04}
          className="grid-pattern"
          zIndex={0}
        />
        
        <Container 
          maxW="container.xl" 
          position="relative" 
          zIndex={1}
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={10} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Our Values</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} width="100%" mx="auto">
              <Box 
                p={8} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="center" gap={4} textAlign="center">
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Education First</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    We believe in empowering through knowledge, not dependency. Our success is measured by your independent confidence.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="center" gap={4} textAlign="center">
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Intellectual Honesty</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    We present balanced perspectives, acknowledge uncertainties, and maintain transparency about the evolving nature of markets.
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="md"
                height="100%"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg"
                }}
              >
                <VStack alignItems="center" gap={4} textAlign="center">
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-insight-blue)">Long-term Orientation</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    We focus on sustainable strategies and principles that withstand market cycles, not short-term tactics or speculation.
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Our Approach Section */}
      <Box 
        py={16} 
        background="white"
        width="100%"
        position="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        {/* Add animation keyframes for the images */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.85); }
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
          
          .approach-image {
            animation: fadeInScale 0.8s ease-out forwards, float 6s ease-in-out infinite;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            max-width: 100%;
            height: auto;
            filter: drop-shadow(0 5px 15px rgba(0, 123, 255, 0.15));
          }
          
          .approach-image:hover {
            animation: pulse 2s ease-in-out infinite;
            transform: scale(1.05);
            filter: drop-shadow(0 8px 25px rgba(0, 123, 255, 0.25));
          }
          
          .image-container {
            margin-bottom: 24px;
            border-radius: 12px;
            overflow: hidden;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            position: relative;
            transition: all 0.3s ease;
          }
          
          .image-container:hover {
            animation: glow 2s ease-in-out infinite;
          }
          
          /* Stagger the animations for each box */
          .approach-box:nth-of-type(1) .image-container {
            animation-delay: 0.2s;
          }
          
          .approach-box:nth-of-type(2) .image-container {
            animation-delay: 0.4s;
          }
          
          .approach-box:nth-of-type(3) .image-container {
            animation-delay: 0.6s;
          }
          
          .watermark-number {
            position: absolute;
            font-size: 220px;
            font-weight: bold;
            opacity: 0.12;
            color: var(--lex-insight-blue);
            z-index: 0;
            line-height: 0.8;
            font-family: var(--font-heading);
            pointer-events: none;
            top: 50%;
            left: 80%;
            transform: translate(-50%, -50%);
            overflow: hidden;
          }
          
          /* Responsive adjustments for the watermark numbers */
          @media (max-width: 1024px) {
            .watermark-number {
              font-size: 180px;
            }
          }
          
          @media (max-width: 768px) {
            .watermark-number {
              font-size: 150px;
              left: 75%;
            }
          }
        `}} />
        
        <Container 
          maxW="container.xl" 
          position="relative" 
          width="100%"
          centerContent
          px={{ base: 4, md: 6 }}
        >
          <VStack gap={10} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Our Approach</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} width="100%" mx="auto">
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
                <Box className="watermark-number">1</Box>
                <VStack alignItems="center" gap={4} textAlign="center" position="relative" zIndex={1}>
                  <Box className="image-container">
                    <Image 
                      src="/app1.png" 
                      alt="Strategic Assessment" 
                      width={180}
                      height={180}
                      className="approach-image"
                    />
                  </Box>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-deep-blue)">Strategic Assessment</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    We begin with a deep dive into your current investment approach, goals, and knowledge gaps to create a customized educational roadmap.
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
                <Box className="watermark-number">2</Box>
                <VStack alignItems="center" gap={4} textAlign="center" position="relative" zIndex={1}>
                  <Box className="image-container">
                    <Image 
                      src="/app2.png" 
                      alt="Knowledge Building" 
                      width={180}
                      height={180}
                      className="approach-image"
                    />
                  </Box>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-deep-blue)">Knowledge Building</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    Through structured educational sessions, we provide clear, actionable insights on complex investment topics tailored to your specific needs.
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
                <Box className="watermark-number">3</Box>
                <VStack alignItems="center" gap={4} textAlign="center" position="relative" zIndex={1}>
                  <Box className="image-container">
                    <Image 
                      src="/app3.png" 
                      alt="Empowered Decision-Making" 
                      width={180}
                      height={180}
                      className="approach-image"
                    />
                  </Box>
                  <Heading as="h3" size="md" className="heading-text" color="var(--lex-deep-blue)">Empowered Decision-Making</Heading>
                  <Text className="body-text" fontSize="lg" color="var(--lex-slate-grey)">
                    Our goal is your independence—equipping you with frameworks and understanding that enable confident strategy development long after our engagement.
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        py={16} 
        background="linear-gradient(180deg, white 0%, rgba(248, 248, 248, 0.5) 100%)"
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
          <VStack gap={10} alignItems="center" textAlign="center" width="100%" maxW="container.lg" mx="auto">
            <Heading as="h2" size="xl" className="heading-text" color="var(--lex-deep-blue)">Client Perspectives</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} width="100%" mx="auto">
              <Box 
                p={8} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="lg"
                height="100%"
                position="relative"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
              >
                <Box 
                  position="absolute" 
                  top={4} 
                  left={4} 
                  fontSize="5xl" 
                  color="var(--lex-insight-blue)" 
                  opacity={0.2} 
                  lineHeight={1}
                >
                  "
                </Box>
                <VStack alignItems="flex-start" gap={6} textAlign="left" pt={6}>
                  <Text className="body-text" fontSize="lg" fontStyle="italic" color="var(--lex-slate-grey)">
                    "Highly recommend Financial Navigator! Alex helped me cut through the noise in my memecoin portfolio, narrowing it down to four strong picks with clear, technical reasoning and take-profit targets. He even provided exclusive insights and a detailed follow-up report. Alex's structured approach and deep knowledge made a real difference. I'll definitely work with him again."
                  </Text>
                  <Box>
                    <Text fontWeight="bold" className="heading-text" color="var(--lex-deep-blue)">Singh</Text>
                    <Text className="ui-text" color="var(--lex-insight-blue)">Memecoin Investor</Text>
                  </Box>
                </VStack>
              </Box>
              
              <Box 
                p={8} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="lg"
                height="100%"
                position="relative"
                border="1px solid"
                borderColor="var(--lex-light-grey)"
              >
                <Box 
                  position="absolute" 
                  top={4} 
                  left={4} 
                  fontSize="5xl" 
                  color="var(--lex-insight-blue)" 
                  opacity={0.2} 
                  lineHeight={1}
                >
                  "
                </Box>
                <VStack alignItems="flex-start" gap={6} textAlign="left" pt={6}>
                  <Text className="body-text" fontSize="lg" fontStyle="italic" color="var(--lex-slate-grey)">
                    "What sets Lex apart is their commitment to education rather than pushing products. They helped me develop a comprehensive understanding of alternative investments that I can apply independently to my portfolio decisions."
                  </Text>
                  <Box>
                    <Text fontWeight="bold" className="heading-text" color="var(--lex-deep-blue)">Sarah J.</Text>
                    <Text className="ui-text" color="var(--lex-insight-blue)">Private Investor, Singapore</Text>
                  </Box>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
} 