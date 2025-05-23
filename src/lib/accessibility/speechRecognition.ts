/**
 * Speech Recognition Service
 * 
 * This service provides advanced speech recognition capabilities optimized for children's voices
 * and users with special educational needs.
 */

// Define types for speech recognition
export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  childVoiceOptimization?: boolean;
  specialNeedsSupport?: {
    articulationSupport?: boolean;
    fluencySupport?: boolean;
    processingSupport?: boolean;
  };
  profanityFilter?: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

// Define event types
type RecognitionStartCallback = () => void;
type RecognitionResultCallback = (result: SpeechRecognitionResult) => void;
type RecognitionErrorCallback = (error: SpeechRecognitionError) => void;
type RecognitionEndCallback = () => void;

// Check if browser supports the Web Speech API
const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

// Create a class for speech recognition
export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private onStartCallback: RecognitionStartCallback | null = null;
  private onResultCallback: RecognitionResultCallback | null = null;
  private onErrorCallback: RecognitionErrorCallback | null = null;
  private onEndCallback: RecognitionEndCallback | null = null;

  constructor(options: SpeechRecognitionOptions = {}) {
    // Set default options
    this.options = {
      language: 'en-GB', // Default to UK English
      continuous: false,
      interimResults: true,
      childVoiceOptimization: true,
      specialNeedsSupport: {
        articulationSupport: false,
        fluencySupport: false,
        processingSupport: false,
      },
      profanityFilter: true,
      ...options
    };

    // Initialize speech recognition if supported
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.configureRecognition();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }

  // Configure the recognition instance with current options
  private configureRecognition(): void {
    if (!this.recognition) return;

    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    this.recognition.onresult = (event: any) => {
      if (!this.onResultCallback) return;

      const resultIndex = event.resultIndex;
      const results = event.results;
      
      // Get the transcript and confidence
      const transcript = results[resultIndex][0].transcript;
      const confidence = results[resultIndex][0].confidence;
      const isFinal = results[resultIndex].isFinal;

      // Apply child voice optimization if enabled
      let optimizedTranscript = transcript;
      if (this.options.childVoiceOptimization) {
        optimizedTranscript = this.applyChildVoiceOptimization(transcript);
      }

      // Apply special needs support if enabled
      if (this.options.specialNeedsSupport) {
        if (this.options.specialNeedsSupport.articulationSupport) {
          optimizedTranscript = this.applyArticulationSupport(optimizedTranscript);
        }
        if (this.options.specialNeedsSupport.fluencySupport) {
          optimizedTranscript = this.applyFluencySupport(optimizedTranscript);
        }
        if (this.options.specialNeedsSupport.processingSupport) {
          optimizedTranscript = this.applyProcessingSupport(optimizedTranscript);
        }
      }

      // Apply profanity filter if enabled
      if (this.options.profanityFilter) {
        optimizedTranscript = this.applyProfanityFilter(optimizedTranscript);
      }

      // Send the result to the callback
      this.onResultCallback({
        transcript: optimizedTranscript,
        isFinal,
        confidence
      });
    };

    this.recognition.onerror = (event: any) => {
      if (this.onErrorCallback) {
        this.onErrorCallback({
          error: event.error,
          message: this.getErrorMessage(event.error)
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) this.onEndCallback();
    };
  }

  // Start speech recognition
  public start(): boolean {
    if (!this.recognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback({
          error: 'not-supported',
          message: 'Speech recognition is not supported in this browser.'
        });
      }
      return false;
    }

    if (this.isListening) {
      return true; // Already listening
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (this.onErrorCallback) {
        this.onErrorCallback({
          error: 'start-error',
          message: 'Error starting speech recognition.'
        });
      }
      return false;
    }
  }

  // Stop speech recognition
  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Update options
  public updateOptions(options: Partial<SpeechRecognitionOptions>): void {
    this.options = { ...this.options, ...options };
    
    // If we're currently listening, we need to stop and restart with new options
    const wasListening = this.isListening;
    if (wasListening) {
      this.stop();
    }
    
    this.configureRecognition();
    
    if (wasListening) {
      this.start();
    }
  }

  // Event handlers
  public onStart(callback: RecognitionStartCallback): void {
    this.onStartCallback = callback;
  }

  public onResult(callback: RecognitionResultCallback): void {
    this.onResultCallback = callback;
  }

  public onError(callback: RecognitionErrorCallback): void {
    this.onErrorCallback = callback;
  }

  public onEnd(callback: RecognitionEndCallback): void {
    this.onEndCallback = callback;
  }

  // Check if speech recognition is supported
  public isSupported(): boolean {
    return isSpeechRecognitionSupported();
  }

  // Check if currently listening
  public getIsListening(): boolean {
    return this.isListening;
  }

  // Helper methods for processing speech
  private applyChildVoiceOptimization(transcript: string): string {
    // This would be enhanced with ML models in a production environment
    // For now, implement basic corrections for common child speech patterns
    
    // Common phonological processes in children
    const corrections: [RegExp, string][] = [
      // Fronting (k/g → t/d)
      [/\btate\b/gi, 'cake'],
      [/\bdat\b/gi, 'gap'],
      
      // Stopping (f/s → p/t)
      [/\bpish\b/gi, 'fish'],
      [/\btun\b/gi, 'sun'],
      
      // Cluster reduction
      [/\btop\b/gi, 'stop'],
      [/\bpoon\b/gi, 'spoon'],
      
      // Final consonant deletion
      [/\bca\b/gi, 'cat'],
      [/\bdo\b/gi, 'dog'],
      
      // Common word replacements
      [/\blellow\b/gi, 'yellow'],
      [/\bwabbit\b/gi, 'rabbit'],
      [/\bfwog\b/gi, 'frog']
    ];
    
    let optimized = transcript;
    corrections.forEach(([pattern, replacement]) => {
      optimized = optimized.replace(pattern, replacement);
    });
    
    return optimized;
  }

  private applyArticulationSupport(transcript: string): string {
    // Enhanced support for articulation difficulties
    // This would be more sophisticated in production
    
    // Common articulation challenges
    const corrections: [RegExp, string][] = [
      // R sounds
      [/\bwed\b/gi, 'red'],
      [/\bwain\b/gi, 'rain'],
      
      // L sounds
      [/\byight\b/gi, 'light'],
      [/\byion\b/gi, 'lion'],
      
      // S sounds
      [/\bthoup\b/gi, 'soup'],
      [/\bthun\b/gi, 'sun'],
      
      // TH sounds
      [/\bfink\b/gi, 'think'],
      [/\bfree\b/gi, 'three']
    ];
    
    let optimized = transcript;
    corrections.forEach(([pattern, replacement]) => {
      optimized = optimized.replace(pattern, replacement);
    });
    
    return optimized;
  }

  private applyFluencySupport(transcript: string): string {
    // Support for fluency challenges (stuttering)
    // Remove repeated syllables and sounds
    
    // Remove repeated single letters with hyphen (e.g., "t-t-today")
    let optimized = transcript.replace(/([a-z])-\1(-\1)*/gi, '$1');
    
    // Remove repeated syllables (e.g., "to-to-today")
    const syllablePattern = /\b(\w{1,3})-(\1-)+(\1)\b/gi;
    optimized = optimized.replace(syllablePattern, '$3');
    
    // Remove word repetitions (e.g., "I I want")
    const wordPattern = /\b(\w+)(\s+\1)+\b/gi;
    optimized = optimized.replace(wordPattern, '$1');
    
    return optimized;
  }

  private applyProcessingSupport(transcript: string): string {
    // Support for processing difficulties
    // Simplify complex sentences and correct common confusions
    
    // Simplify complex conjunctions
    const simplifications: [RegExp, string][] = [
      [/\bin order to\b/gi, 'to'],
      [/\bdue to the fact that\b/gi, 'because'],
      [/\bprior to\b/gi, 'before'],
      [/\bsubsequent to\b/gi, 'after'],
      [/\bnotwithstanding\b/gi, 'despite'],
      [/\bnevertheless\b/gi, 'however']
    ];
    
    let optimized = transcript;
    simplifications.forEach(([pattern, replacement]) => {
      optimized = optimized.replace(pattern, replacement);
    });
    
    return optimized;
  }

  private applyProfanityFilter(transcript: string): string {
    // Basic profanity filter
    // In production, this would use a comprehensive list
    const profanities = [
      'damn', 'hell', 'ass', 'crap', 'shit', 'fuck', 'bitch', 'bastard'
    ];
    
    let filtered = transcript;
    profanities.forEach(word => {
      const pattern = new RegExp(`\\b${word}\\b`, 'gi');
      filtered = filtered.replace(pattern, '****');
    });
    
    return filtered;
  }

  private getErrorMessage(error: string): string {
    // Provide user-friendly error messages
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'No microphone was found or microphone access was denied.',
      'not-allowed': 'Microphone access was denied. Please allow microphone access to use speech recognition.',
      'network': 'A network error occurred. Please check your internet connection.',
      'aborted': 'Speech recognition was aborted.',
      'language-not-supported': 'The selected language is not supported.',
      'service-not-allowed': 'The speech recognition service is not allowed.',
      'bad-grammar': 'There was an error with the speech grammar.',
      'not-supported': 'Speech recognition is not supported in this browser.'
    };
    
    return errorMessages[error] || 'An unknown error occurred with speech recognition.';
  }
}

// Create a hook for using speech recognition in React components
export const createSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  return new SpeechRecognitionService(options);
};

export default createSpeechRecognition;
