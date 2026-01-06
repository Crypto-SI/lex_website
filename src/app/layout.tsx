import { Providers } from "./providers";
import { Box } from "@chakra-ui/react";
import "./globals.css";
import { Cinzel, EB_Garamond, Lato } from 'next/font/google'
import { baseMetadata, baseViewport } from './metadata';
import ClientLayout from './ClientLayout';
import { AppErrorBoundary } from "@/components/error-boundaries";
import { AnimationProvider } from "@/components/ui/AnimationProvider";
import { SecurityProvider } from "@/components/security";
import { loadSiteContent } from "@/utils/contentLoader";

// Initialize fonts
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cinzel'
})

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-garamond'
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-lato'
})

// Export metadata and viewport from the separate metadata.ts file
export const metadata = baseMetadata;
export const viewport = baseViewport;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await loadSiteContent();

  return (
    <html lang="en">
      <body 
        className={`${cinzel.variable} ${garamond.variable} ${lato.variable}`}
      >
        <SecurityProvider>
          <Providers content={siteContent}>
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
