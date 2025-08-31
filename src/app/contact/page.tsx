'use client'

import { 
  Box, Container, Heading, Text, VStack, Button
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { StructuredData } from '@/components/seo'

// Lazy load heavy components
const CalendlyPopup = dynamic(() => import('@/components/media').then(mod => ({ default: mod.CalendlyPopup })), {
  ssr: false,
  loading: () => <Box p={8} textAlign="center">Loading calendar...</Box>
});

const SecureContactForm = dynamic(() => import('@/components/forms').then(mod => ({ default: mod.SecureContactForm })), {
  ssr: false,
  loading: () => <Box p={8} textAlign="center">Loading form...</Box>
});
import { generateBreadcrumbStructuredData, businessInfo } from '../metadata'

export default function ContactPage() {
  const calendlyUrl = 'https://calendly.com/d/cq4j-vcb-th4'

  // Structured data for contact page
  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'FinancialService',
      name: businessInfo.name,
      url: businessInfo.url,
      telephone: businessInfo.telephone,
      email: businessInfo.email,
      address: {
        '@type': 'PostalAddress',
        ...businessInfo.address
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: businessInfo.telephone,
        email: businessInfo.email,
        contactType: 'Customer Service',
        availableLanguage: ['English'],
        areaServed: 'US'
      }
    }
  };

  // Breadcrumb structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://lexconsulting.com' },
    { name: 'Contact', url: 'https://lexconsulting.com/contact' }
  ]);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={contactStructuredData} id="contact-data" />
      <StructuredData data={breadcrumbData} id="breadcrumb-data" />
      <Box py={{ base: 20, md: 24 }} width="100%" display="flex" justifyContent="center">
        <Container 
          maxW="container.xl" 
          centerContent 
          mx="auto"
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={10} alignItems="center" width="100%" maxW="1200px" mx="auto">
            {/* Header Section */}
            <VStack gap={4} alignItems="center" textAlign="center">
              <Heading as="h1" size="2xl" className="heading-text text-center">Contact Us</Heading>
              <Text fontSize="xl" maxW="container.lg" textAlign="center">
                Ready to discuss your needs? Use the form below for general inquiries or schedule a discovery call.
              </Text>
            </VStack>
            
            {/* Secure Contact Form */}
            <SecureContactForm 
              onSuccess={() => {
                console.log('Form submitted successfully');
              }}
              onError={(error) => {
                console.error('Form submission error:', error);
              }}
            />
            
            {/* Simple horizontal rule instead of Divider */}
            <Box as="hr" my={8} width="100%" borderColor="gray.200" />
            
            {/* Calendly Button Section */}
            <Box 
              as="section"
              width="100%" 
              maxW="800px"
              mx="auto" 
              textAlign="center"
              py={12}
              aria-labelledby="scheduling-heading"
            >
              <VStack gap={6}>
                <Heading as="h2" id="scheduling-heading" size="xl" mb={2}>Ready to Talk?</Heading>
                <Text fontSize="lg" maxW="600px">
                  Schedule a no-obligation discovery call to discuss how we can help you navigate complex investment landscapes.
                </Text>
                <CalendlyPopup 
                  url={calendlyUrl}
                  onError={(error) => {
                    console.error('Calendly error:', error)
                    window.open(calendlyUrl, '_blank', 'width=800,height=600')
                  }}
                >
                  {({ onClick, isLoading }) => (
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
                      onClick={onClick}
                      loading={isLoading}
                      loadingText="Loading..."
                      aria-describedby="calendly-description"
                    >
                      Schedule a Discovery Call
                    </Button>
                  )}
                </CalendlyPopup>
                <Text id="calendly-description" fontSize="sm" color="gray.600" display="none">
                  Opens Calendly scheduling widget in a popup window
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* No need for Calendly script here anymore as it's loaded in the ClientLayout */}
    </>
  )
} 