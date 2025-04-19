'use client'

import { 
  Box, Container, Heading, Text, VStack, 
  Input, Textarea, Button
} from '@chakra-ui/react'
import { useEffect } from 'react'

// Add a type declaration for the Calendly global
declare global {
  interface Window {
    Calendly?: any;
  }
}

export default function ContactPage() {
  // Function to open Calendly popup
  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/d/cq4j-vcb-th4'
      });
      return false;
    }
  };
  
  // No need for Calendly styles useEffect as it's now in the global layout

  return (
    <>
      <Box py={{ base: 20, md: 24 }} width="100%">
        <Container 
          maxW="container.xl" 
          centerContent 
          mx="auto"
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <VStack gap={10} alignItems="center" width="100%" maxW="1200px">
            {/* Header Section */}
            <VStack gap={4} alignItems="center" textAlign="center">
              <Heading as="h1" size="2xl" className="heading-text text-center">Contact Us</Heading>
              <Text fontSize="xl" maxW="container.lg" textAlign="center">
                Ready to discuss your needs? Use the form below for general inquiries or schedule a discovery call.
              </Text>
            </VStack>
            
            {/* Simplified Form Section without FormControl */}
            <Box 
              py={8} 
              px={{ base: 6, md: 10 }} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              border="1px solid"
              borderColor="gray.100"
              width="100%"
              maxW="container.lg"
              textAlign="left" 
            >
              <Heading as="h2" size="lg" mb={6} textAlign="center">General Inquiries</Heading>
              <Text mb={6} textAlign="center">Have a question not related to scheduling? Send us a message here.</Text>
              <form action="https://formspree.io/f/meoaygjn" method="POST">
                <VStack gap={6} alignItems="stretch" width="100%"> 
                  {/* Name Field */}
                  <Box>
                    <label htmlFor="name" style={{ fontWeight: "medium", marginBottom: "8px", display: "block" }}>Name*</label>
                    <Input
                      id="name"
                      name="name" 
                      placeholder="Your name"
                      required
                    />
                  </Box>
                  
                  {/* Email Field */}
                  <Box>
                    <label htmlFor="email" style={{ fontWeight: "medium", marginBottom: "8px", display: "block" }}>Email*</label>
                    <Input
                      id="email"
                      name="email" 
                      type="email"
                      placeholder="Your email address"
                      required
                    />
                  </Box>

                  {/* Message Field */}
                  <Box>
                    <label htmlFor="message" style={{ fontWeight: "medium", marginBottom: "8px", display: "block" }}>Message*</label>
                    <Textarea
                      id="message"
                      name="message" 
                      placeholder="Your question or message"
                      rows={5}
                      required
                    />
                  </Box>
                  
                  <Button 
                    type="submit"
                    colorScheme="brand" 
                    size="lg"
                    width="full"
                    mt={4}
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </Box>
            
            {/* Simple horizontal rule instead of Divider */}
            <Box as="hr" my={8} width="100%" borderColor="gray.200" />
            
            {/* Calendly Button Section */}
            <Box 
              width="100%" 
              maxW="800px"
              mx="auto" 
              textAlign="center"
              py={12}
            >
              <VStack gap={6}>
                <Heading as="h2" size="xl" mb={2}>Ready to Talk?</Heading>
                <Text fontSize="lg" maxW="600px">
                  Schedule a no-obligation discovery call to discuss how we can help you navigate complex investment landscapes.
                </Text>
                <Button 
                  size="lg" 
                  height="70px"
                  px={12}
                  fontSize="xl"
                  bg="var(--lex-deep-blue)" 
                  color="white"
                  _hover={{ bg: "#133c76", transform: "translateY(-3px)" }}
                  _active={{ bg: "#0a2342" }}
                  boxShadow="md"
                  transition="all 0.3s ease"
                  onClick={openCalendly}
                >
                  Schedule a Discovery Call
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* No need for Calendly script here anymore as it's loaded in the ClientLayout */}
    </>
  )
} 