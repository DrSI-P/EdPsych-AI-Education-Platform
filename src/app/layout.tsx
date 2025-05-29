import '@/styles/globals.css';
import '@/styles/enhanced-globals.css'; // Added enhanced-globals.css import
import '@/styles/enhanced-brand.css';
import '@/styles/brand.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider'; // Updated to use enhanced ThemeProvider
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { RootLayoutWrapper } from '@/components/root-layout-wrapper';
// Import the CSS loader to ensure CSS files are included in the build
import '@/styles/ensure-css-loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EdPsych-AI-Education-Platform',
  description: 'A comprehensive AI-powered education platform for educational psychologists, teachers, students, and parents.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RootLayoutWrapper>
              {children}
            </RootLayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
