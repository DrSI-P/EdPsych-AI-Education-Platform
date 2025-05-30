// Import premium CSS files for the enhanced design
import '../src/styles/enhanced-globals.css';
import '../src/styles/brand.css';
import '../src/styles/enhanced-brand.css';
import { ThemeProvider } from 'next-themes';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
