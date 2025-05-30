import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload fonts */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600;7..72,700&display=swap"
            rel="stylesheet"
          />
          
          {/* Direct CSS link to ensure styles are loaded */}
          <link 
            rel="stylesheet" 
            href="/styles/global.css" 
          />
          
          {/* Inline critical CSS */}
          <style dangerouslySetInnerHTML={{ __html: `
            /* Critical button styles */
            .btn-primary {
              background-color: #6366f1;
              color: white;
              border-radius: 0.375rem;
              padding: 0.625rem 1.25rem;
              font-weight: 500;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            
            .btn-primary:hover {
              background-color: #4f46e5;
            }
            
            .btn-secondary {
              background-color: #f5f5f5;
              color: #171717;
              border-radius: 0.375rem;
              padding: 0.625rem 1.25rem;
              font-weight: 500;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            
            /* Critical text gradient */
            .text-gradient {
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              background-image: linear-gradient(135deg, #6366f1, #3b82f6);
            }
            
            /* Critical navigation styles */
            .nav-item {
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              transition: background-color 0.2s ease, color 0.2s ease;
            }
            
            .nav-item:hover {
              background-color: #f5f5f5;
              color: #171717;
            }
            
            .nav-item.active {
              background-color: #6366f1;
              color: white;
            }
            
            /* Critical animation classes */
            .animate-fade-in {
              animation: fade-in 0.6s ease-out;
            }
            
            .animate-slide-up {
              animation: slide-up 0.6s ease-out;
            }
            
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slide-up {
              from { transform: translateY(25px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}} />
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