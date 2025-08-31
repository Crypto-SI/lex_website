'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Code,
  SimpleGrid
} from '@chakra-ui/react';
import { useI18n, useTranslation, useLocale, useFormatting } from '@/providers/I18nProvider';
import { LanguageSwitcher, CompactLanguageSwitcher, FullLanguageSwitcher } from '@/components/i18n';

export default function DemoI18nPage() {
  const { currentLocale, isRTL } = useI18n();
  const { t } = useTranslation();
  const { availableLocales } = useLocale();
  const { formatDate, formatNumber, formatCurrency } = useFormatting();

  const sampleDate = new Date();
  const sampleNumber = 1234567.89;
  const sampleCurrency = 5999;

  return (
    <Box py={20} dir={isRTL ? 'rtl' : 'ltr'}>
      <Container maxW="container.xl">
        <VStack gap={8} alignItems="flex-start">
          <Box>
            <Heading as="h1" size="xl" mb={4}>
              Internationalization (i18n) Demo
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              This page demonstrates the internationalization system with live translation switching.
            </Text>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Current Locale Information <Badge colorScheme="green">Working</Badge>
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <VStack alignItems="flex-start" gap={2}>
                <Text><strong>Current Locale:</strong> {currentLocale}</Text>
                <Text><strong>Text Direction:</strong> {isRTL ? 'Right-to-Left' : 'Left-to-Right'}</Text>
                <Text><strong>Available Locales:</strong> {availableLocales.length}</Text>
              </VStack>
              <VStack alignItems="flex-start" gap={2}>
                <Text><strong>Supported Languages:</strong></Text>
                <Box ml={4}>
                  {availableLocales.map((locale) => (
                    <Text key={locale.code} fontSize="sm">
                      {locale.flag} {locale.nativeName} ({locale.code})
                    </Text>
                  ))}
                </Box>
              </VStack>
            </SimpleGrid>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Language Switchers <Badge colorScheme="blue">Interactive</Badge>
            </Heading>
            <VStack gap={6} alignItems="flex-start">
              <Box>
                <Text fontWeight="bold" mb={2}>Dropdown Switcher:</Text>
                <LanguageSwitcher />
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>Compact Switcher:</Text>
                <CompactLanguageSwitcher />
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>Full Button Switcher:</Text>
                <FullLanguageSwitcher />
              </Box>
            </VStack>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Translation Examples <Badge colorScheme="purple">Dynamic</Badge>
            </Heading>
            <Text mb={4} color="gray.600">
              These translations change automatically when you switch languages:
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <VStack alignItems="flex-start" gap={3}>
                <Text><strong>Navigation:</strong></Text>
                <Box ml={4}>
                  <Text>• {t('common.home')}</Text>
                  <Text>• {t('common.about')}</Text>
                  <Text>• {t('common.services')}</Text>
                  <Text>• {t('common.contact')}</Text>
                </Box>
              </VStack>
              
              <VStack alignItems="flex-start" gap={3}>
                <Text><strong>Common Actions:</strong></Text>
                <Box ml={4}>
                  <Text>• {t('common.loading')}</Text>
                  <Text>• {t('common.submit')}</Text>
                  <Text>• {t('common.cancel')}</Text>
                  <Text>• {t('common.save')}</Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Locale-Aware Formatting <Badge colorScheme="orange">Localized</Badge>
            </Heading>
            <Text mb={4} color="gray.600">
              Numbers, dates, and currencies are formatted according to the selected locale:
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <VStack alignItems="flex-start" gap={2}>
                <Text fontWeight="bold">Date Formatting:</Text>
                <Code p={2} borderRadius="md">{formatDate(sampleDate)}</Code>
                <Text fontSize="sm" color="gray.500">
                  Today's date in {currentLocale} format
                </Text>
              </VStack>
              
              <VStack alignItems="flex-start" gap={2}>
                <Text fontWeight="bold">Number Formatting:</Text>
                <Code p={2} borderRadius="md">{formatNumber(sampleNumber)}</Code>
                <Text fontSize="sm" color="gray.500">
                  Large number with locale separators
                </Text>
              </VStack>
              
              <VStack alignItems="flex-start" gap={2}>
                <Text fontWeight="bold">Currency Formatting:</Text>
                <Code p={2} borderRadius="md">{formatCurrency(sampleCurrency)}</Code>
                <Text fontSize="sm" color="gray.500">
                  Price in local currency format
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>

          <Box p={6} bg="white" borderRadius="lg" boxShadow="md" width="100%">
            <Heading as="h2" size="lg" mb={4}>
              Technical Implementation <Badge colorScheme="green">Complete</Badge>
            </Heading>
            <VStack alignItems="flex-start" gap={3}>
              <Text><strong>✅ I18n Provider</strong> - React context for managing locale state</Text>
              <Text><strong>✅ Translation Loading</strong> - Dynamic import of locale-specific JSON files</Text>
              <Text><strong>✅ Language Switching</strong> - Multiple UI components for language selection</Text>
              <Text><strong>✅ Locale Detection</strong> - Browser, URL, and cookie-based locale detection</Text>
              <Text><strong>✅ Formatting Utilities</strong> - Date, number, and currency formatting</Text>
              <Text><strong>✅ Content Integration</strong> - Content management system supports localization</Text>
              <Text><strong>✅ Type Safety</strong> - Full TypeScript support for all i18n features</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}