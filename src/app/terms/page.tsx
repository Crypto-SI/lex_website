'use client'

import { Box, Container, Heading, Text, VStack, Center, Stack } from '@chakra-ui/react'

export default function TermsOfServicePage() {
  return (
    <Box 
      py={{ base: 20, md: 24 }} 
      width="100%"
    >
      <Container 
        maxW="container.md" 
        centerContent
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        <Box 
          width="100%" 
          maxW="700px"
          mx="auto"
          textAlign="center"
        >
          <Heading 
            as="h1" 
            size="2xl" 
            mb={12} 
            textAlign="center"
            scrollMarginTop="80px"
            mt={2}
          >
            Terms of Service
          </Heading>
          
          <VStack align="center" gap={10} width="100%">
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Introduction</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                These Terms of Service ("Terms") govern your use of the Lex Consulting website and services. By accessing our 
                website or engaging our services, you agree to be bound by these Terms. If you disagree with any part of the 
                Terms, you may not access the website or use our services.
              </Text>
              <Text fontSize="lg" textAlign="center">
                Please read these Terms carefully before engaging our services. Your access to and use of our services is conditioned 
                on your acceptance of and compliance with these Terms.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Educational Nature of Services</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                Lex Consulting provides educational and consulting services related to financial markets and investments. Our services 
                are educational in nature and do not constitute financial advice, investment advice, or recommendations to purchase, 
                sell, or hold any securities or investments.
              </Text>
              <Text fontSize="lg" textAlign="center">
                Our goal is to educate clients about investment vehicles, risk management, wealth preservation, and alternative investments. 
                Clients are solely responsible for their investment decisions and should consult with licensed financial advisors before 
                making investment decisions.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Service Agreements</Heading>
              <Text fontSize="lg" textAlign="center">
                All client engagements are governed by individual service agreements. These agreements outline the scope of services, 
                duration, fees, and other specific terms related to your engagement with Lex Consulting. In the event of any conflict 
                between these Terms and your individual service agreement, the service agreement shall prevail for matters specifically 
                addressed therein.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Intellectual Property</Heading>
              <Text fontSize="lg" textAlign="center">
                All content provided by Lex Consulting, including but not limited to educational materials, presentations, reports, 
                documents, and communications, is the intellectual property of Lex Consulting and is protected by copyright and other 
                intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                publicly perform, republish, download, store, transmit, or otherwise exploit any content provided by Lex Consulting 
                without our explicit written consent.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Client Obligations</Heading>
              <Text fontSize="lg" textAlign="center">
                As a client of Lex Consulting, you agree to: (1) provide accurate and complete information as requested during the 
                engagement; (2) use our services for lawful purposes only; (3) not share, distribute, or resell our educational materials 
                or services; (4) maintain confidentiality of any proprietary information shared during the engagement; and (5) acknowledge 
                that all investment decisions made based on our educational services are your sole responsibility.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Limitation of Liability</Heading>
              <Text fontSize="lg" textAlign="center">
                Lex Consulting shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of our services or any investments made based on information provided during our educational 
                services. By engaging our services, you acknowledge and agree that we are not liable for any losses, damages, or negative 
                outcomes resulting from your investment decisions.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Modifications to Terms</Heading>
              <Text fontSize="lg" textAlign="center">
                Lex Consulting reserves the right to modify these Terms at any time. Changes will be effective upon posting to our website. 
                Your continued use of our services after any modifications to the Terms constitutes your acceptance of the revised Terms.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Governing Law</Heading>
              <Text fontSize="lg" textAlign="center">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Lex Consulting 
                operates, without regard to its conflict of law provisions.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Contact Us</Heading>
              <Text fontSize="lg" textAlign="center">
                If you have any questions about these Terms, please contact us at info@lexconsulting.com.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto" pt={4}>
              <Text fontSize="sm" color="gray.500">Last Updated: May 2023</Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
} 