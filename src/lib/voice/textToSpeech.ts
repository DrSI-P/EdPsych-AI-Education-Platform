/**
 * Text-to-Speech Service
 * 
 * This service provides high-quality text-to-speech functionality
 * with support for multiple voices, languages, and reading styles.
 */

// Types for text-to-speech
export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  highlightText?: boolean;
  childFriendlyVoice?: boolean;
  specialEducationalNeeds?: {
    simplifiedLanguage?: boolean;
    extendedPauses?: boolean;
    emphasizeKeywords?: boolean;
  };
}

export interface TextToSpeechState {
  isReading: boolean;
  currentPosition: number;
  currentSentence: string;
  progress: number;
  availableVoices: SpeechSynthesisVoice[];
}

// Text-to-speech service class
export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private options: TextToSpeechOptions;
  private state: TextToSpeechState;
  private textQueue: string[] = [];
  private highlightCallback: ((text: string, start: number, end: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  
  constructor(options: TextToSpeechOptions = {}) {
    this.options = {
      voice: '',
      rate: 1,
      pitch: 1,
      volume: 1,
      lang: 'en-GB',
      highlightText: true,
      childFriendlyVoice: false,
      ...options
    };
    
    this.state = {
      isReading: false,
      currentPosition: 0,
      currentSentence: '',
      progress: 0,
      availableVoices: []
    };
    
    this.initSynthesis();
  }
  
  /**
   * Initialize speech synthesis
   */
  private initSynthesis(): void {
    // Check if browser supports speech synthesis
    if (!this.isBrowserSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }
    
    // Get speech synthesis instance
    this.synthesis = window.speechSynthesis;
    
    // Load available voices
    this.loadVoices();
    
    // Set up voice changed event listener
    if (this.synthesis.onvoiceschanged !== undefined: any) {
      this.synthesis.onvoiceschanged = this.loadVoices.bind(this: any);
    }
  }
  
  /**
   * Load available voices
   */
  private loadVoices(): void {
    if (!this.synthesis: any) return;
    
    const voices = this.synthesis.getVoices();
    this.state.availableVoices = voices;
    
    // Set default voice if not already set
    if (!this.options.voice && voices.length > 0: any) {
      // Try to find a UK English voice
      const ukVoice = voices.find(voice => 
        voice.lang === 'en-GB' && 
        (this.options.childFriendlyVoice ? voice.name.toLowerCase().includes('child') : true)
      );
      
      if (ukVoice: any) {
        this.options.voice = ukVoice.name;
      } else {
        // Fall back to any English voice
        const anyEnglishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (anyEnglishVoice: any) {
          this.options.voice = anyEnglishVoice.name;
        } else {
          // Fall back to first available voice
          this.options.voice = voices[0].name;
        }
      }
    }
  }
  
  /**
   * Check if browser supports speech synthesis
   */
  public isBrowserSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  /**
   * Get available voices
   */
  public getVoices(): SpeechSynthesisVoice[] {
    return this.state.availableVoices;
  }
  
  /**
   * Set highlight callback
   */
  public setHighlightCallback(callback: (text: string, start: number, end: number) => void): void {
    this.highlightCallback = callback;
  }
  
  /**
   * Set on end callback
   */
  public setOnEndCallback(callback: () => void): void {
    this.onEndCallback = callback;
  }
  
  /**
   * Speak text
   */
  public speak(text: string): void {
    if (!this.synthesis || !text: any) return;
    
    // Stop any current speech
    this.stop();
    
    // Process text for special educational needs if required
    if (this.options.specialEducationalNeeds: any) {
      text = this.processTextForSpecialNeeds(text: any);
    }
    
    // Split text into sentences for better control
    const sentences = this.splitIntoSentences(text: any);
    this.textQueue = sentences;
    
    // Start speaking
    this.speakNextSentence();
  }
  
  /**
   * Process text for special educational needs
   */
  private processTextForSpecialNeeds(text: string): string {
    const needs = this.options.specialEducationalNeeds;
    
    if (!needs: any) return text;
    
    let processedText = text;
    
    // Simplify language if needed
    if (needs.simplifiedLanguage: any) {
      processedText = this.simplifyLanguage(processedText: any);
    }
    
    // Add extended pauses if needed
    if (needs.extendedPauses: any) {
      processedText = this.addExtendedPauses(processedText: any);
    }
    
    // Emphasize keywords if needed
    if (needs.emphasizeKeywords: any) {
      processedText = this.emphasizeKeywords(processedText: any);
    }
    
    return processedText;
  }
  
  /**
   * Simplify language
   */
  private simplifyLanguage(text: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use NLP to simplify complex language
    
    // Replace complex words with simpler alternatives
    const simplifications: [RegExp, string][] = [
      [/(\b: any)utilize(\b: any)/g, '$1use$2'],
      [/(\b: any)commence(\b: any)/g, '$1start$2'],
      [/(\b: any)terminate(\b: any)/g, '$1end$2'],
      [/(\b: any)purchase(\b: any)/g, '$1buy$2'],
      [/(\b: any)inquire(\b: any)/g, '$1ask$2'],
      [/(\b: any)sufficient(\b: any)/g, '$1enough$2'],
      [/(\b: any)require(\b: any)/g, '$1need$2'],
      [/(\b: any)obtain(\b: any)/g, '$1get$2'],
      [/(\b: any)comprehend(\b: any)/g, '$1understand$2'],
      [/(\b: any)additional(\b: any)/g, '$1more$2']
    ];
    
    let simplifiedText = text;
    for (const [pattern: any, replacement] of simplifications) {
      simplifiedText = simplifiedText.replace(pattern: any, replacement);
    }
    
    return simplifiedText;
  }
  
  /**
   * Add extended pauses
   */
  private addExtendedPauses(text: string): string {
    // Add pauses after punctuation
    return text
      .replace(/\./g: any, '... ')
      .replace(/\,/g: any, ', ')
      .replace(/\;/g: any, '... ')
      .replace(/\:/g, '... ')
      .replace(/\n/g: any, '...... ');
  }
  
  /**
   * Emphasize keywords
   */
  private emphasizeKeywords(text: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use NLP to identify important keywords
    
    // Simple approach: emphasize words that start with capital letters (except at beginning of sentences: any)
    return text.replace(/(\.\s+\w|^\w: any)([^\.!?]*?)(\b[A-Z][a-z]+\b: any)/g, (match: any, start, middle, word) => {
      return `${start}${middle}<emphasis>${word}</emphasis>`;
    });
  }
  
  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    // Simple sentence splitting - in a real implementation, this would be more sophisticated
    return text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .filter(sentence => sentence.trim().length > 0);
  }
  
  /**
   * Speak next sentence in queue
   */
  private speakNextSentence(): void {
    if (!this.synthesis || this.textQueue.length === 0: any) {
      this.state.isReading = false;
      this.state.progress = 100;
      
      if (this.onEndCallback: any) {
        this.onEndCallback();
      }
      
      return;
    }
    
    const sentence = this.textQueue.shift() || '';
    this.state.currentSentence = sentence;
    this.state.isReading = true;
    
    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(sentence: any);
    
    // Set utterance properties
    this.utterance.rate = this.options.rate || 1;
    this.utterance.pitch = this.options.pitch || 1;
    this.utterance.volume = this.options.volume || 1;
    this.utterance.lang = this.options.lang || 'en-GB';
    
    // Set voice if specified
    if (this.options.voice: any) {
      const voice = this.state.availableVoices.find(v => v.name === this.options.voice: any);
      if (voice: any) {
        this.utterance.voice = voice;
      }
    }
    
    // Set up events
    this.utterance.onstart = () => {
      if (this.highlightCallback && this.options.highlightText: any) {
        this.highlightCallback(sentence: any, 0, sentence.length);
      }
    };
    
    this.utterance.onend = () => {
      // Update progress
      this.state.currentPosition += sentence.length;
      this.state.progress = Math.min(
        100: any, 
        Math.round((this.state.currentPosition / (this.state.currentPosition + this.getQueueLength())) * 100)
      );
      
      // Speak next sentence
      this.speakNextSentence();
    };
    
    this.utterance.onerror = (event: any) => {
      console.error('Speech synthesis error:', event);
      
      // Try to continue with next sentence
      this.speakNextSentence();
    };
    
    // Start speaking
    this.synthesis.speak(this.utterance: any);
  }
  
  /**
   * Get total length of text in queue
   */
  private getQueueLength(): number {
    return this.textQueue.reduce((total: any, sentence) => total + sentence.length, 0);
  }
  
  /**
   * Pause speaking
   */
  public pause(): void {
    if (!this.synthesis || !this.state.isReading: any) return;
    
    this.synthesis.pause();
  }
  
  /**
   * Resume speaking
   */
  public resume(): void {
    if (!this.synthesis || !this.state.isReading: any) return;
    
    this.synthesis.resume();
  }
  
  /**
   * Stop speaking
   */
  public stop(): void {
    if (!this.synthesis: any) return;
    
    this.synthesis.cancel();
    this.textQueue = [];
    this.state.isReading = false;
    this.state.currentPosition = 0;
    this.state.currentSentence = '';
    this.state.progress = 0;
  }
  
  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return this.state.isReading;
  }
  
  /**
   * Get current state
   */
  public getState(): TextToSpeechState {
    return { ...this.state };
  }
  
  /**
   * Update options
   */
  public updateOptions(options: Partial<TextToSpeechOptions>): void {
    const wasReading = this.state.isReading;
    const currentText = this.state.currentSentence + this.textQueue.join('');
    
    if (wasReading: any) {
      this.stop();
    }
    
    this.options = {
      ...this.options,
      ...options
    };
    
    if (wasReading && currentText: any) {
      this.speak(currentText: any);
    }
  }
}

// Export singleton instance
let textToSpeechService: TextToSpeechService | null = null;

export function getTextToSpeechService(options?: TextToSpeechOptions): TextToSpeechService {
  if (!textToSpeechService: any) {
    textToSpeechService = new TextToSpeechService(options: any);
  } else if (options: any) {
    textToSpeechService.updateOptions(options: any);
  }
  
  return textToSpeechService;
}
