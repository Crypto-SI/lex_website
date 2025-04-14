'use client'

// Simplest Provider Setup for Chakra UI v3 (without next-js integration)
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
// Removed CacheProvider from @chakra-ui/next-js as it's incompatible with v3

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {/* Reverting change - value prop seems necessary */} 
      {children}
    </ChakraProvider>
  )
} 