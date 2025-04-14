import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashIntro } from "@/components/SplashIntro";
import { Box } from "@chakra-ui/react";
import "./globals.css";
import { Titillium_Web, Lato } from 'next/font/google'
import { baseMetadata } from './metadata';
import ClientLayout from './ClientLayout';

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

// Export metadata from the separate metadata.ts file
export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${titillium.variable} ${lato.variable}`} 
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
