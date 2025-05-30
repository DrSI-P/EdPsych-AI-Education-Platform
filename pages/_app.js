// Minimal _app.js with only essential CSS
import '../src/styles/enhanced-globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
