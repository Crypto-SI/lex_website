"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { lexSystem } from "@/theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={lexSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
