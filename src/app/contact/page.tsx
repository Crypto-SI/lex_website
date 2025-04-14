'use client'

import { useState } from 'react'
import { 
  Box, Container, Heading, Text, VStack, HStack, 
  Input, Textarea, Button
} from '@chakra-ui/react'
import { FaPhone, FaEnvelope, FaUser, FaBuilding, FaCheck } from 'react-icons/fa'

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  honeypot: string;
  agreed: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  agreed?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    honeypot: '', // Spam prevention field - should remain empty
    agreed: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    // Validate agreement
    if (!formData.agreed) {
      newErrors.agreed = 'You must agree to be contacted'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if the honeypot field was filled (indicates bot)
    if (formData.honeypot) {
      setSubmitSuccess(true)
      return
    }
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real implementation, this would be an API call
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        honeypot: '',
        agreed: false
      })
      
      // Show success message
      setSubmitSuccess(true)
      
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
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
        <Box 
          width="100%" 
          maxW="1200px" 
          mx="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <VStack gap={10} alignItems="center" width="100%" maxW="1200px">
            {/* Header Section */}
            <VStack gap={4} alignItems="center" textAlign="center">
              <Heading as="h1" size="2xl" className="heading-text text-center">Contact Us</Heading>
              <Text fontSize="xl" maxW="container.md" textAlign="center">
                Have questions about our services or interested in scheduling a discovery call? 
                We&apos;d love to hear from you. Fill out the form below and our team will get back to you promptly.
              </Text>
            </VStack>
            
            {submitSuccess ? (
              <Box 
                py={12} 
                px={{ base: 6, md: 10 }} 
                bg="green.50" 
                borderRadius="lg" 
                textAlign="center"
                borderColor="green.200"
                border="1px solid"
              >
                <VStack gap={4}>
                  <Heading size="lg" color="green.500">Thank You!</Heading>
                  <Text fontSize="lg">
                    Your message has been sent successfully. We&apos;ll get back to you as soon as possible.
                  </Text>
                  <Button 
                    colorScheme="brand" 
                    mt={4}
                    onClick={() => setSubmitSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </VStack>
              </Box>
            ) : (
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
              >
                <form onSubmit={handleSubmit}>
                  <VStack gap={6} alignItems="center" width="100%">
                    {/* Name Field */}
                    <Box width="100%">
                      <Text fontWeight="medium" mb={2} textAlign="center">Name*</Text>
                      <Box position="relative">
                        <Box 
                          position="absolute" 
                          left={3} 
                          top="50%" 
                          transform="translateY(-50%)" 
                          zIndex={2} 
                          color="gray.400"
                        >
                          <FaUser />
                        </Box>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          pl={10}
                        />
                      </Box>
                      {errors.name && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.name}
                        </Text>
                      )}
                    </Box>
                    
                    {/* Email Field */}
                    <Box width="100%">
                      <Text fontWeight="medium" mb={2} textAlign="center">Email*</Text>
                      <Box position="relative">
                        <Box 
                          position="absolute" 
                          left={3} 
                          top="50%" 
                          transform="translateY(-50%)" 
                          zIndex={2} 
                          color="gray.400"
                        >
                          <FaEnvelope />
                        </Box>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={handleChange}
                          pl={10}
                        />
                      </Box>
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email}
                        </Text>
                      )}
                    </Box>
                    
                    {/* Phone and Company (side by side on larger screens) */}
                    <HStack gap={6} alignItems="center" flexDirection={{ base: 'column', md: 'row' }} width="100%">
                      <Box flex="1" width="100%">
                        <Text fontWeight="medium" mb={2} textAlign="center">Phone (Optional)</Text>
                        <Box position="relative">
                          <Box 
                            position="absolute" 
                            left={3} 
                            top="50%" 
                            transform="translateY(-50%)" 
                            zIndex={2} 
                            color="gray.400"
                          >
                            <FaPhone />
                          </Box>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            pl={10}
                          />
                        </Box>
                      </Box>
                      
                      <Box flex="1" width="100%">
                        <Text fontWeight="medium" mb={2} textAlign="center">Company/Organization (Optional)</Text>
                        <Box position="relative">
                          <Box 
                            position="absolute" 
                            left={3} 
                            top="50%" 
                            transform="translateY(-50%)" 
                            zIndex={2} 
                            color="gray.400"
                          >
                            <FaBuilding />
                          </Box>
                          <Input
                            id="company"
                            name="company"
                            placeholder="Your company name"
                            value={formData.company}
                            onChange={handleChange}
                            pl={10}
                          />
                        </Box>
                      </Box>
                    </HStack>
                    
                    {/* Message Field */}
                    <Box width="100%">
                      <Text fontWeight="medium" mb={2} textAlign="center">Message*</Text>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                      />
                      {errors.message && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.message}
                        </Text>
                      )}
                    </Box>
                    
                    {/* Honeypot field - hidden from users, but bots might fill it out */}
                    <Box display="none">
                      <Input
                        name="honeypot"
                        type="text"
                        value={formData.honeypot}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </Box>
                    
                    {/* Agreement Checkbox */}
                    <Box width="100%">
                      <HStack alignItems="flex-start" gap={2} justifyContent="center">
                        <input
                          type="checkbox"
                          id="agreed"
                          name="agreed"
                          checked={formData.agreed}
                          onChange={handleChange}
                          style={{ marginTop: '5px' }}
                        />
                        <Text>
                          I agree to be contacted about my inquiry
                        </Text>
                      </HStack>
                      {errors.agreed && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.agreed}
                        </Text>
                      )}
                    </Box>
                    
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      width={{ base: '100%', md: 'auto' }}
                      alignSelf="center"
                      disabled={isSubmitting}
                    >
                      <HStack gap={2}>
                        <Text>{isSubmitting ? "Sending..." : "Send Message"}</Text>
                        <FaCheck />
                      </HStack>
                    </Button>
                  </VStack>
                </form>
              </Box>
            )}
            
            {/* Additional Contact Info */}
            <Box py={8} bg="gray.50" borderRadius="lg" px={8} width="100%" maxW="container.lg">
              <VStack gap={6} alignItems="center" textAlign="center">
                <Heading as="h2" size="lg">Connect With Us</Heading>
                
                <VStack gap={3} alignItems="center">
                  <HStack>
                    <Box as={FaEnvelope} color="brand.500" />
                    <Text fontWeight="medium">info@lexconsulting.com</Text>
                  </HStack>
                  
                  <Text mt={4} textAlign="center">
                    For scheduling a discovery call, please use the form above or email us directly. 
                    We typically respond within 1 business day.
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
} 