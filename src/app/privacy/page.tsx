'use client'

import { Box, Container, Heading, Text, VStack, Center, Stack } from '@chakra-ui/react'

export default function PrivacyPolicyPage() {
  return (
    <Box 
      width="100%" 
      py={{ base: 20, md: 24 }}
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
            mt={2}   // Minimal top margin for spacing
            textAlign="center"
          >
            Privacy Policy
          </Heading>
          
          <VStack align="center" gap={10} width="100%">
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Introduction</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                At Lex Consulting, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </Text>
              <Text fontSize="lg" textAlign="center">
                This privacy policy aims to give you information on how Lex Consulting collects and processes your personal data 
                through your use of this website, including any data you may provide through this website when you 
                sign up to our newsletter, purchase a service, or contact us.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Information We Collect</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </Text>
              <Center>
                <Stack gap={3} textAlign="center">
                  <Text fontSize="lg">• Identity Data includes first name, last name, username or similar identifier, title.</Text>
                  <Text fontSize="lg">• Contact Data includes email address and telephone numbers.</Text>
                  <Text fontSize="lg">• Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</Text>
                  <Text fontSize="lg">• Usage Data includes information about how you use our website and services.</Text>
                  <Text fontSize="lg">• Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.</Text>
                </Stack>
              </Center>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">How We Use Your Information</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </Text>
              <Center>
                <Stack gap={3} textAlign="center" mb={4}>
                  <Text fontSize="lg">• Where we need to perform the contract we are about to enter into or have entered into with you.</Text>
                  <Text fontSize="lg">• Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</Text>
                  <Text fontSize="lg">• Where we need to comply with a legal obligation.</Text>
                </Stack>
              </Center>
              <Text fontSize="lg" textAlign="center">
                Generally, we do not rely on consent as a legal basis for processing your personal data although we will get your consent before sending third party direct marketing communications to you via email or text message. You have the right to withdraw consent to marketing at any time by contacting us.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Data Security</Heading>
              <Text fontSize="lg" textAlign="center">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Data Retention</Heading>
              <Text fontSize="lg" textAlign="center">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Your Legal Rights</Heading>
              <Text fontSize="lg" mb={4} textAlign="center">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
              </Text>
              <Center>
                <Stack gap={3} textAlign="center">
                  <Text fontSize="lg">• Request access to your personal data.</Text>
                  <Text fontSize="lg">• Request correction of your personal data.</Text>
                  <Text fontSize="lg">• Request erasure of your personal data.</Text>
                  <Text fontSize="lg">• Object to processing of your personal data.</Text>
                  <Text fontSize="lg">• Request restriction of processing your personal data.</Text>
                  <Text fontSize="lg">• Request transfer of your personal data.</Text>
                  <Text fontSize="lg">• Right to withdraw consent.</Text>
                </Stack>
              </Center>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Contact Us</Heading>
              <Text fontSize="lg" textAlign="center">
                If you have any questions about this privacy policy or our privacy practices, please contact us at info@lexconsulting.com.
              </Text>
            </Box>
            
            <Box width="100%" textAlign="center" mx="auto">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Changes to the Privacy Policy</Heading>
              <Text fontSize="lg" textAlign="center">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this privacy policy.
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