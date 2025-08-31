'use client' // Add use client for potential future interactive elements

import { Box, Text, VStack, HStack, Grid, GridItem } from '@chakra-ui/react'
import Link from 'next/link'
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { ScreenReaderOnly } from '@/components/accessibility'

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navGroups = [
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Onboarding Process', path: '/onboarding' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com' },
    { icon: FaLinkedin, href: 'https://linkedin.com' },
    { icon: FaEnvelope, href: 'mailto:info@lexconsulting.com' },
  ];

  return (
    <Box as="footer" bg="brand.primary" color="gray.100" py={10} mt={10}> 
      <Box className="container">
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} 
          gap={8}
        >
          {/* Company Info */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack alignItems="flex-start" gap={4}>
              <Box mb={2}>
                <Text color="white" fontWeight="bold" fontSize="xl" mb={1} className="heading-text">
                  LEX CONSULTING
                </Text>
                <Text fontSize="sm" className="body-text">
                  Premium education on long-term investment strategy, crypto, and alternative assets 
                  for High Net Worth Individuals and Financial Advisors.
                </Text>
              </Box>
              
              {/* Social Links */}
              <HStack gap={4}>
                {socialLinks.map((link, index) => {
                  const getAriaLabel = (icon: any) => {
                    if (icon === FaTwitter) return 'Follow us on Twitter';
                    if (icon === FaLinkedin) return 'Connect with us on LinkedIn';
                    if (icon === FaEnvelope) return 'Send us an email';
                    return 'Social media link';
                  };

                  if (link.href.startsWith('http') || link.href.startsWith('mailto')) {
                    return (
                      <a 
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#A0AEC0', 
                          display: 'flex',
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'all 0.2s'
                        }}
                        aria-label={getAriaLabel(link.icon)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--chakra-colors-brand-accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#A0AEC0';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = '2px solid var(--chakra-colors-brand-accent)';
                          e.currentTarget.style.outlineOffset = '2px';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.outline = 'none';
                        }}
                      >
                        <link.icon size={20} aria-hidden="true" />
                        <ScreenReaderOnly>
                          {getAriaLabel(link.icon)}
                        </ScreenReaderOnly>
                      </a>
                    );
                  } else {
                    return (
                      <Link 
                        key={index} 
                        href={link.href}
                        style={{ 
                          color: '#A0AEC0', 
                          display: 'flex',
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Box
                          _hover={{ color: 'brand.accent' }}
                          _focus={{
                            outline: '2px solid',
                            outlineColor: 'brand.accent',
                            outlineOffset: '2px'
                          }}
                          aria-label={getAriaLabel(link.icon)}
                        >
                          <link.icon size={20} aria-hidden="true" />
                          <ScreenReaderOnly>
                            {getAriaLabel(link.icon)}
                          </ScreenReaderOnly>
                        </Box>
                      </Link>
                    );
                  }
                })}
              </HStack>
            </VStack>
          </GridItem>

          {/* Navigation Sections */}
          {navGroups.map((group, idx) => (
            <GridItem key={idx}>
              <VStack alignItems="flex-start" gap={3}>
                <Text fontWeight="bold" color="white" mb={1} className="ui-text">
                  {group.title}
                </Text>
                {group.links.map((link, linkIdx) => (
                  <Link 
                    key={linkIdx} 
                    href={link.path}
                    style={{ 
                      color: '#A0AEC0', 
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                  >
                    <Box 
                      _hover={{ color: 'brand.accent' }}
                      _focus={{
                        outline: '2px solid',
                        outlineColor: 'brand.accent',
                        outlineOffset: '2px'
                      }}
                      className="ui-text"
                      p={1}
                      borderRadius="sm"
                    >
                      {link.name}
                    </Box>
                  </Link>
                ))}
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* Divider line */}
        <Box borderTop="1px solid" borderColor="gray.700" my={8}></Box>
        
        <Box 
          display="flex" 
          flexDirection={{ base: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          fontSize="xs"
        >
          <Text mb={{ base: 2, sm: 0 }} className="ui-text">
            &copy; {currentYear} Lex Consulting. All rights reserved.
          </Text>
          <Text className="ui-text tagline">
            EMPOWERING STRATEGIC INVESTORS
          </Text>
        </Box>
      </Box>
    </Box>
  )
} 