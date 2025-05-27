import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

/**
 * Custom Document component for EdPsych Connect
 * 
 * This component customizes the HTML document structure for better SEO,
 * accessibility, and performance in production.
 */
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Character set and viewport settings */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          
          {/* Preconnect to domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Font loading */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
            rel="stylesheet"
          />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* DNS prefetch for external services */}
          <link rel="dns-prefetch" href="https://api.edpsychconnect.com" />
          
          {/* Preload critical assets */}
          <link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          
          {/* SEO meta tags */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          
          {/* Open Graph / Social Media */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="EdPsych Connect" />
          <meta property="og:url" content="https://edpsychconnect.com" />
          <meta property="og:image" content="https://edpsychconnect.com/images/og-image.jpg" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@edpsychconnect" />
          
          {/* PWA color theme */}
          <meta name="theme-color" content="#6366f1" />
        </Head>
        <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;