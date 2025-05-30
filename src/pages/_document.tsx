import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

/**
 * Custom Document component to ensure proper CSS loading
 * This helps prevent CSS optimization issues in production
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
          {/* Force critical CSS to be included */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --primary: #6366f1;
              --primary-dark: #4f46e5;
              --secondary: #8b5cf6;
              --secondary-dark: #7c3aed;
              --accent: #f97316;
              --accent-dark: #ea580c;
            }
            
            .text-gradient {
              background: linear-gradient(to right, var(--primary), var(--secondary));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }
            
            .nav-item {
              background-color: var(--primary);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              transition: all 0.3s ease;
            }
            
            .btn-primary {
              background-color: var(--primary);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              border: none;
              transition: all 0.3s ease;
            }
          `}} />
          
          {/* Preload fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
