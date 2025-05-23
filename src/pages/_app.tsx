import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieConsentProvider } from '@/components/legal/CookieConsentProvider';
import { Toaster } from '@/components/ui/toaster';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CookieConsentProvider>
        <Navbar />
        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Toaster />
      </CookieConsentProvider>
    </SessionProvider>
  );
}
