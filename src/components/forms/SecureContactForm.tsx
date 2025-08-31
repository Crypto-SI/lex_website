'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  Text,
  Heading
} from '@chakra-ui/react'
import { CSRFManager, RateLimiter, FormSecurityManager } from '@/utils/security'

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

interface SecureContactFormProps {
  endpoint?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SecureContactForm({ 
  endpoint = 'https://formspree.io/f/meoaygjn',
  onSuccess,
  onError 
}: SecureContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  const formId = 'contact-form';

  // Initialize CSRF token and check rate limits
  useEffect(() => {
    // Set CSRF token if not exists
    if (!CSRFManager.getToken()) {
      CSRFManager.setToken();
    }

    // Update rate limit status
    const updateRateLimit = () => {
      setRemainingAttempts(RateLimiter.getRemainingAttempts(formId));
      setTimeUntilReset(RateLimiter.getTimeUntilReset(formId));
    };

    updateRateLimit();

    // Update rate limit status every minute
    const interval = setInterval(updateRateLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  // Real-time validation
  const validateField = useCallback((name: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.name = 'Name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s\-'\.]+$/.test(value.trim())) {
          newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (value.length > 254) {
          newErrors.email = 'Email address is too long';
        } else {
          delete newErrors.email;
        }
        break;

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else if (value.trim().length > 2000) {
          newErrors.message = 'Message must be less than 2000 characters';
        } else {
          delete newErrors.message;
        }
        break;
    }

    setErrors(newErrors);
  }, [errors]);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    
    // Clear submit status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setStatusMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if form can be submitted
    if (!RateLimiter.canSubmit(formId)) {
      const minutes = Math.ceil(timeUntilReset / (60 * 1000));
      setSubmitStatus('error');
      setStatusMessage(`Too many attempts. Please try again in ${minutes} minutes.`);
      onError?.(`Rate limit exceeded. Try again in ${minutes} minutes.`);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate all fields
      Object.entries(formData).forEach(([key, value]) => {
        validateField(key as keyof FormData, value);
      });

      // Check if there are any validation errors
      if (Object.keys(errors).length > 0) {
        setSubmitStatus('error');
        setStatusMessage('Please correct the errors above');
        return;
      }

      // Submit form securely
      const result = await FormSecurityManager.submitSecureForm(
        formData,
        formId,
        endpoint
      );

      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage(result.message);
        setFormData({ name: '', email: '', message: '' });
        onSuccess?.();
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message);
        if (result.errors) {
          setErrors(result.errors);
        }
        onError?.(result.message);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again.');
      onError?.('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      // Update rate limit status
      setRemainingAttempts(RateLimiter.getRemainingAttempts(formId));
      setTimeUntilReset(RateLimiter.getTimeUntilReset(formId));
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.name.trim() && 
    formData.email.trim() && 
    formData.message.trim();

  const canSubmit = remainingAttempts > 0 && !isSubmitting && isFormValid;

  return (
    <Box 
      as="section"
      py={8} 
      px={{ base: 6, md: 10 }} 
      bg="white" 
      borderRadius="lg" 
      boxShadow="md"
      border="1px solid"
      borderColor="gray.100"
      width="100%"
      maxW="container.lg"
      mx="auto"
      textAlign="left"
      aria-labelledby="contact-form-heading"
    >
      <Heading as="h2" id="contact-form-heading" size="lg" mb={6} textAlign="center">
        General Inquiries
      </Heading>
      <Text mb={6} textAlign="center">
        Have a question not related to scheduling? Send us a message here.
      </Text>

      {/* Rate Limit Warning */}
      {remainingAttempts <= 2 && remainingAttempts > 0 && (
        <Box 
          p={4} 
          mb={4} 
          bg="orange.50" 
          border="1px solid" 
          borderColor="orange.200" 
          borderRadius="md"
        >
          <Text fontWeight="bold" color="orange.800">Limited attempts remaining!</Text>
          <Text color="orange.700">
            You have {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} left.
          </Text>
        </Box>
      )}

      {/* Rate Limit Exceeded */}
      {remainingAttempts === 0 && (
        <Box 
          p={4} 
          mb={4} 
          bg="red.50" 
          border="1px solid" 
          borderColor="red.200" 
          borderRadius="md"
        >
          <Text fontWeight="bold" color="red.800">Too many attempts</Text>
          <Text color="red.700">
            Please wait {Math.ceil(timeUntilReset / (60 * 1000))} minutes before trying again.
          </Text>
        </Box>
      )}

      {/* Submit Status Messages */}
      {submitStatus === 'success' && (
        <Box 
          p={4} 
          mb={4} 
          bg="green.50" 
          border="1px solid" 
          borderColor="green.200" 
          borderRadius="md"
        >
          <Text fontWeight="bold" color="green.800">Success!</Text>
          <Text color="green.700">{statusMessage}</Text>
        </Box>
      )}

      {submitStatus === 'error' && (
        <Box 
          p={4} 
          mb={4} 
          bg="red.50" 
          border="1px solid" 
          borderColor="red.200" 
          borderRadius="md"
        >
          <Text fontWeight="bold" color="red.800">Error</Text>
          <Text color="red.700">{statusMessage}</Text>
        </Box>
      )}

      <Box 
        as="form" 
        onSubmit={handleSubmit}
        role="form"
        aria-label="Contact form for general inquiries"
        noValidate
      >
        <VStack gap={6} alignItems="stretch" width="100%">
          {/* Name Field */}
          <Box>
            <Text as="label" htmlFor="name" fontWeight="medium" mb={2} display="block">
              Name <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
              aria-describedby="name-help"
              maxLength={50}
              borderColor={errors.name ? 'red.300' : 'gray.200'}
              _focus={{
                borderColor: errors.name ? 'red.500' : 'blue.500',
                boxShadow: errors.name ? '0 0 0 1px red.500' : '0 0 0 1px blue.500'
              }}
            />
            <Text id="name-help" fontSize="sm" color="gray.600" mt={1}>
              Enter your full name (2-50 characters)
            </Text>
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.name}</Text>
            )}
          </Box>

          {/* Email Field */}
          <Box>
            <Text as="label" htmlFor="email" fontWeight="medium" mb={2} display="block">
              Email <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              aria-describedby="email-help"
              maxLength={254}
              borderColor={errors.email ? 'red.300' : 'gray.200'}
              _focus={{
                borderColor: errors.email ? 'red.500' : 'blue.500',
                boxShadow: errors.email ? '0 0 0 1px red.500' : '0 0 0 1px blue.500'
              }}
            />
            <Text id="email-help" fontSize="sm" color="gray.600" mt={1}>
              We'll use this to respond to your inquiry
            </Text>
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
            )}
          </Box>

          {/* Message Field */}
          <Box>
            <Text as="label" htmlFor="message" fontWeight="medium" mb={2} display="block">
              Message <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please describe your inquiry or question..."
              rows={5}
              aria-describedby="message-help"
              maxLength={2000}
              resize="vertical"
              borderColor={errors.message ? 'red.300' : 'gray.200'}
              _focus={{
                borderColor: errors.message ? 'red.500' : 'blue.500',
                boxShadow: errors.message ? '0 0 0 1px red.500' : '0 0 0 1px blue.500'
              }}
            />
            <Text id="message-help" fontSize="sm" color="gray.600" mt={1}>
              Provide details about your inquiry (10-2000 characters)
              <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                {formData.message.length}/2000
              </Text>
            </Text>
            {errors.message && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.message}</Text>
            )}
          </Box>

          {/* Submit Button */}
          <Button 
            type="submit"
            colorScheme="brand"
            size="lg"
            width="full"
            mt={4}
            isLoading={isSubmitting}
            loadingText="Sending..."
            isDisabled={!canSubmit}
            aria-describedby="submit-help"
          >
            Send Message
          </Button>
          
          <Text id="submit-help" fontSize="sm" color="gray.600" textAlign="center">
            Your message will be sent securely to our team
          </Text>

          {/* Security Info */}
          <Text fontSize="xs" color="gray.500" textAlign="center">
            This form is protected by CSRF tokens and rate limiting for your security.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}