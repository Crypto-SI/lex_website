'use client' // Add use client for potential future interactive elements

import { useState, useEffect } from 'react'
import { 
  Box, Flex, HStack, Button, VStack, Image 
} from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Add type declaration for Calendly
declare global {
  interface Window {
    Calendly?: any;
  }
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  isTransparent?: boolean;
  isHomePage?: boolean;
};

const NavLink = ({ href, children, isActive, onClick, isTransparent, isHomePage }: NavLinkProps) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Box
        px={3}
        py={2}
        rounded="md"
        fontWeight={isActive ? "bold" : "medium"}
        color={isHomePage ? "white" : (isActive ? "var(--lex-insight-blue)" : "var(--lex-deep-blue)")}
        position="relative"
        className="ui-text"
        textShadow={isHomePage ? "0 1px 3px rgba(0,0,0,0.5)" : "none"}
        _hover={{
          color: isHomePage ? "var(--lex-insight-blue)" : 'var(--lex-insight-blue)',
          textShadow: isHomePage ? "0 1px 5px rgba(0,0,0,0.7)" : "none"
        }}
        cursor="pointer"
        onClick={onClick}
      >
        {children}
        {isActive && (
          <Box
            position="absolute"
            height="2px"
            bg="var(--lex-insight-blue)"
            left={0}
            right={0}
            bottom="-2px"
          />
        )}
      </Box>
    </Link>
  );
};

type HeaderProps = {
  onShowSplash: () => void;
};

export function Header({ onShowSplash }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Onboarding', path: '/onboarding' },
    { name: 'Contact', path: '/contact' },
  ];

  // Function to open Calendly popup
  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/d/cq4j-vcb-th4'
      });
      return false;
    }
  };

  // Check if current page is homepage
  useEffect(() => {
    setIsHomePage(pathname === '/');
  }, [pathname]);

  // Handle scroll effect for transparent/solid header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Immediate check on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine header background based on scroll state and current page
  const headerBg = isHomePage 
    ? (scrolled ? "rgba(10, 35, 66, 0.85)" : "transparent")
    : (scrolled ? "white" : "rgba(255, 255, 255, 0.9)");

  // Determine text color based on homepage and scroll state
  const logoColor = isHomePage ? "white" : "var(--lex-deep-blue)";
  const mobileIconColor = isHomePage ? "white" : "var(--lex-deep-blue)";
  const logoTextShadow = isHomePage ? "0 2px 4px rgba(0,0,0,0.5)" : "none";

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      width="100%"
      zIndex={10}
      transition="all 0.3s ease"
      bg={headerBg}
      boxShadow={scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none"}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      borderBottom={scrolled ? "1px solid rgba(0,0,0,0.05)" : "none"}
    >
      <Box className="container">
        <Flex
          py={6}
          align="center"
          justify="space-between"
        >
          {/* Logo with Image */}
          <Flex align="center" gap={3}>
            <Box 
              cursor="pointer" 
              onClick={onShowSplash}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              height="40px"
              width="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image 
                src="/lexlogodark.png" 
                alt="Lex Logo" 
                height="36px"
                filter={isHomePage ? "brightness(10)" : "none"}
                transition="all 0.3s ease"
              />
            </Box>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                className="heading-text"
                fontWeight="bold"
                fontSize={{ base: "xl", md: "2xl" }}
                color={logoColor}
                textShadow={logoTextShadow}
              >
                LEX CONSULTING
              </Box>
            </Link>
          </Flex>

          {/* Desktop Navigation */}
          <HStack gap={6} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                href={item.path}
                isActive={pathname === item.path}
                isHomePage={isHomePage}
              >
                {item.name}
              </NavLink>
            ))}
            {/* CTA Button - changed to use Calendly popup */}
            <Button 
              bg={isHomePage ? "var(--lex-insight-blue)" : "var(--lex-deep-blue)"}
              color="white"
              _hover={{
                bg: isHomePage ? "#0069d9" : "#133c76"
              }}
              size="md"
              className="ui-text"
              boxShadow={isHomePage ? "0 2px 6px rgba(0,0,0,0.3)" : "none"}
              onClick={openCalendly}
            >
              Schedule Call
            </Button>
          </HStack>

          {/* Mobile Navigation Icon */}
          <Box 
            display={{ base: "flex", md: "none" }} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            cursor="pointer"
            p={2}
          >
            <FaBars size={24} color={mobileIconColor} />
          </Box>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <Box 
              position="absolute" 
              top="100%" 
              right={0} 
              left={0}
              bg={isHomePage ? "rgba(10, 35, 66, 0.95)" : "white"}
              boxShadow="md"
              py={4}
              display={{ base: "block", md: "none" }}
              zIndex={20}
              backdropFilter="blur(10px)"
            >
              <Box className="container">
                <VStack gap={4} alignItems="stretch">
                  {navItems.map((item) => (
                    <NavLink 
                      key={item.path} 
                      href={item.path}
                      isActive={pathname === item.path}
                      onClick={() => setIsMenuOpen(false)}
                      isHomePage={isHomePage}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  {/* CTA Button - Changed to use Calendly popup */}
                  <Button 
                    bg={isHomePage ? "var(--lex-insight-blue)" : "var(--lex-deep-blue)"}
                    color="white"
                    _hover={{
                      bg: isHomePage ? "#0069d9" : "#133c76"
                    }}
                    size="md"
                    width="100%"
                    mt={2}
                    className="ui-text"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openCalendly();
                    }}
                  >
                    Schedule Call
                  </Button>
                </VStack>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
} 