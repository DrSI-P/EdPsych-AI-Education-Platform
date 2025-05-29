import '@/styles/globals.css';
// Import as CSS module instead of global CSS
import styles from '@/styles/enhanced-globals.module.css';
import '@/styles/enhanced-brand.css';
import '@/styles/brand.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider'; // Updated to use enhanced ThemeProvider
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { RootLayoutWrapper } from '@/components/root-layout-wrapper';

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
  // Use a dummy class to prevent tree-shaking
  const preventTreeShaking = styles ? true : false;
  
  return (
    <html lang="en" suppressHydrationWarning className={styles.html || ''}>
      <body className={`${inter.className} ${styles.body || ''}`}>
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
