'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { FaChevronDown, FaGlobe } from 'react-icons/fa';
import { useI18n, useTranslation } from '@/providers/I18nProvider';
import { Locale } from '@/types/i18n';

interface LanguageSwitcherProps {
  variant?: 'button' | 'minimal' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  showNativeName?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'dropdown',
  size = 'md',
  showFlag = true,
  showNativeName = true
}: LanguageSwitcherProps) {
  const { currentLocale, setLocale, availableLocales } = useI18n();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentLocaleConfig = availableLocales.find(locale => locale.code === currentLocale);

  const handleLocaleChange = (locale: Locale) => {
    setLocale(locale);
    onClose();
    
    // Optionally reload the page to apply locale changes
    // In a more sophisticated setup, you might want to update the URL
    if (typeof window !== 'undefined') {
      // You could implement URL-based locale switching here
      // window.location.pathname = localizeUrl(window.location.pathname, locale);
    }
  };

  if (variant === 'minimal') {
    return (
      <HStack spacing={2}>
        {availableLocales.map((locale) => (
          <Button
            key={locale.code}
            variant={currentLocale === locale.code ? 'solid' : 'ghost'}
            size="sm"
            onClick={() => handleLocaleChange(locale.code)}
            aria-label={`Switch to ${locale.name}`}
            minW="auto"
            px={2}
          >
            {showFlag && <Text mr={1}>{locale.flag}</Text>}
            <Text fontSize="sm" fontWeight={currentLocale === locale.code ? 'bold' : 'normal'}>
              {locale.code.toUpperCase()}
            </Text>
          </Button>
        ))}
      </HStack>
    );
  }

  if (variant === 'button') {
    return (
      <HStack spacing={1} flexWrap="wrap">
        {availableLocales.map((locale) => (
          <Button
            key={locale.code}
            variant={currentLocale === locale.code ? 'solid' : 'outline'}
            size={size}
            onClick={() => handleLocaleChange(locale.code)}
            aria-label={`Switch to ${locale.name}`}
            colorScheme={currentLocale === locale.code ? 'brand' : 'gray'}
          >
            {showFlag && <Text mr={2}>{locale.flag}</Text>}
            <Text>
              {showNativeName ? locale.nativeName : locale.name}
            </Text>
          </Button>
        ))}
      </HStack>
    );
  }

  // Default dropdown variant using Popover
  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          rightIcon={<Icon as={FaChevronDown} />}
          leftIcon={<Icon as={FaGlobe} />}
          variant="outline"
          size={size}
          aria-label={t('navigation.language_selector')}
        >
          <HStack spacing={2}>
            {showFlag && currentLocaleConfig && (
              <Text>{currentLocaleConfig.flag}</Text>
            )}
            <Text>
              {currentLocaleConfig && showNativeName 
                ? currentLocaleConfig.nativeName 
                : currentLocaleConfig?.name || currentLocale.toUpperCase()
              }
            </Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent width="auto" minW="200px">
        <PopoverBody p={2}>
          <VStack spacing={1} align="stretch">
            {availableLocales.map((locale) => (
              <Button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                variant={currentLocale === locale.code ? 'solid' : 'ghost'}
                colorScheme={currentLocale === locale.code ? 'brand' : 'gray'}
                justifyContent="flex-start"
                size="sm"
                aria-label={`Switch to ${locale.name}`}
              >
                <HStack spacing={3} width="100%">
                  {showFlag && <Text>{locale.flag}</Text>}
                  <Box textAlign="left">
                    <Text fontWeight={currentLocale === locale.code ? 'bold' : 'normal'}>
                      {showNativeName ? locale.nativeName : locale.name}
                    </Text>
                    {showNativeName && locale.nativeName !== locale.name && (
                      <Text fontSize="xs" color="gray.500">
                        {locale.name}
                      </Text>
                    )}
                  </Box>
                  {currentLocale === locale.code && (
                    <Text ml="auto" color="white" fontSize="sm">
                      ✓
                    </Text>
                  )}
                </HStack>
              </Button>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

// Compact version for mobile/header use
export function CompactLanguageSwitcher() {
  return (
    <LanguageSwitcher 
      variant="minimal" 
      size="sm" 
      showFlag={true} 
      showNativeName={false} 
    />
  );
}

// Full version for settings/footer use
export function FullLanguageSwitcher() {
  return (
    <LanguageSwitcher 
      variant="button" 
      size="md" 
      showFlag={true} 
      showNativeName={true} 
    />
  );
}