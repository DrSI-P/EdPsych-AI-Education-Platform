import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Define metadata directly in layout.tsx
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
        <Providers children={children}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
