import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashIntro } from "@/components/SplashIntro";
import { Box } from "@chakra-ui/react";
import "./globals.css";
import { Titillium_Web, Lato } from 'next/font/google'
import { baseMetadata, baseViewport } from './metadata';
import ClientLayout from './ClientLayout';
import { AppErrorBoundary } from "@/components/error-boundaries";
import { AnimationProvider } from "@/components/ui/AnimationProvider";
import { SecurityProvider } from "@/components/security";

// Initialize fonts
const titillium = Titillium_Web({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  variable: '--font-titillium'
})

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato'
})

// Export metadata and viewport from the separate metadata.ts file
export const metadata = baseMetadata;
export const viewport = baseViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${titillium.variable} ${lato.variable}`}
      >
        <SecurityProvider>
          <Providers>
            <AppErrorBoundary>
              <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                width="100%"
              >
                <AnimationProvider>
                  <ClientLayout>
                    {children}
                  </ClientLayout>
                </AnimationProvider>
              </Box>
            </AppErrorBoundary>
          </Providers>
        </SecurityProvider>
      </body>
    </html>
  );
}
