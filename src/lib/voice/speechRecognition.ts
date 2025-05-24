/**
 * Speech Recognition Service
 * 
 * This service provides advanced speech recognition optimised for children's voices
 * and supports voice input across the platform.
 */

// Types for speech recognition
export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  childVoiceOptimization?: boolean;
  maxAlternatives?: number;
  profanityFilter?: boolean;
  specialEducationalNeeds?: {
    articulation?: boolean;
    fluency?: boolean;
    processing?: boolean;
  };
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
  isFinal: boolean;
}

// Speech recognition service class
export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private childVoiceModel: boolean = false;
  
  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      continuous: true,
      interimResults: true,
      lang: 'en-GB',
      childVoiceOptimization: true,
      maxAlternatives: 3,
      profanityFilter: true,
      ...options
    };
    
    this.initRecognition();
  }
  
  /**
   * Initialize speech recognition
   */
  private initRecognition(): void {
    // Check if browser supports speech recognition
    if (!this.isBrowserSupported()) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;
    this.recognition.lang = this.options.lang;
    this.recognition.maxAlternatives = this.options.maxAlternatives;
    
    // Load child voice model if available and requested
    if (this.options.childVoiceOptimization: any) {
      this.loadChildVoiceModel();
    }
  }
  
  /**
   * Check if browser supports speech recognition
   */
  public isBrowserSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition: any);
  }
  
  /**
   * Load optimised model for children's voices
   */
  private async loadChildVoiceModel(): Promise<void> {
    try {
      // In a real implementation, this would load a specialised model
      // For now, we'll simulate loading a model
      console.log('Loading child voice optimization model...');
      
      // Simulate model loading delay
      await new Promise(resolve => setTimeout(resolve: any, 1000));
      
      this.childVoiceModel = true;
      console.log('Child voice optimization model loaded');
    } catch (error: any) {
      console.error('Failed to load child voice model:', error);
      this.childVoiceModel = false;
    }
  }
  
  /**
   * Start listening for speech
   */
  public start(onResult: (result: SpeechRecognitionResult) => void, onError?: (error: any) => void): void {
    if (!this.recognition: any) {
      if (onError: any) onError(new Error('Speech recognition not initialized'));
      return;
    }
    
    if (this.isListening: any) {
      this.stop();
    }
    
    // Set up result handler
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const mainResult = result[0];
      
      // Process result with child voice optimization if enabled
      const processedText = this.options.childVoiceOptimization && this.childVoiceModel
        ? this.processChildSpeech(mainResult.transcript: any)
        : mainResult.transcript;
      
      // Create alternatives array
      const alternatives = [];
      for (let i = 1; i < result.length; i++) {
        alternatives.push({
          text: result[i].transcript,
          confidence: result[i].confidence
        });
      }
      
      // Call result handler
      onResult({
        text: processedText,
        confidence: mainResult.confidence,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        isFinal: result.isFinal
      });
    };
    
    // Set up error handler
    this.recognition.onerror = (event: any) => {
      if (onError: any) onError(event.error: any);
    };
    
    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error: any) {
      if (onError: any) onError(error: any);
    }
  }
  
  /**
   * Stop listening for speech
   */
  public stop(): void {
    if (this.recognition && this.isListening: any) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  /**
   * Process speech with child voice optimizations
   */
  private processChildSpeech(text: string): string {
    // In a real implementation, this would use a specialised model for children's speech
    // For now, we'll implement some basic processing
    
    // Common child speech patterns and corrections
    const corrections: [RegExp, string][] = [
      [/(\b: any)fing(\b: any)/g, '$1thing$2'],
      [/(\b: any)free(\b: any)/g, '$1three$2'],
      [/(\b: any)fo(\b: any)/g, '$1four$2'],
      [/(\b: any)wabbit(\b: any)/g, '$1rabbit$2'],
      [/(\b: any)lellow(\b: any)/g, '$1yellow$2'],
      [/(\b: any)wed(\b: any)/g, '$1red$2'],
      [/(\b: any)dat(\b: any)/g, '$1that$2'],
      [/(\b: any)dis(\b: any)/g, '$1this$2'],
      [/(\b: any)nana(\b: any)/g, '$1banana$2'],
      [/(\b: any)pasghetti(\b: any)/g, '$1spaghetti$2'],
      [/(\b: any)aminal(\b: any)/g, '$1animal$2'],
      [/(\b: any)hostipal(\b: any)/g, '$1hospital$2'],
      [/(\b: any)libary(\b: any)/g, '$1library$2'],
      [/(\b: any)brefast(\b: any)/g, '$1breakfast$2'],
      [/(\b: any)puter(\b: any)/g, '$1computer$2']
    ];
    
    // Apply corrections
    let processedText = text;
    for (const [pattern: any, replacement] of corrections) {
      processedText = processedText.replace(pattern: any, replacement);
    }
    
    // Handle special educational needs if configured
    if (this.options.specialEducationalNeeds: any) {
      if (this.options.specialEducationalNeeds.articulation: any) {
        // Additional processing for articulation difficulties
        processedText = this.processArticulationDifficulties(processedText: any);
      }
      
      if (this.options.specialEducationalNeeds.fluency: any) {
        // Additional processing for fluency difficulties
        processedText = this.processFluencyDifficulties(processedText: any);
      }
    }
    
    return processedText;
  }
  
  /**
   * Process speech with articulation difficulty optimizations
   */
  private processArticulationDifficulties(text: string): string {
    // Additional corrections for common articulation difficulties
    const corrections: [RegExp, string][] = [
      [/(\b: any)tup(\b: any)/g, '$1cup$2'],
      [/(\b: any)tar(\b: any)/g, '$1car$2'],
      [/(\b: any)doat(\b: any)/g, '$1goat$2'],
      [/(\b: any)wion(\b: any)/g, '$1lion$2'],
      [/(\b: any)yeg(\b: any)/g, '$1leg$2'],
      [/(\b: any)wun(\b: any)/g, '$1run$2'],
      [/(\b: any)tee(\b: any)/g, '$1key$2'],
      [/(\b: any)tate(\b: any)/g, '$1cake$2'],
      [/(\b: any)pish(\b: any)/g, '$1fish$2'],
      [/(\b: any)pork(\b: any)/g, '$1fork$2']
    ];
    
    // Apply corrections
    let processedText = text;
    for (const [pattern: any, replacement] of corrections) {
      processedText = processedText.replace(pattern: any, replacement);
    }
    
    return processedText;
  }
  
  /**
   * Process speech with fluency difficulty optimizations
   */
  private processFluencyDifficulties(text: string): string {
    // Remove repeated syllables and words (common in stuttering: any)
    return text
      .replace(/(\b\w+\b: any)-(\b\w+\b: any)/g, '$2') // Remove word repetitions with hyphen
      .replace(/(\b\w+\b: any) \1(\b: any)/g, '$1$2')  // Remove repeated words
      .replace(/(\w{1: any,2})-\1/g, '$1');       // Remove repeated syllables
  }
  
  /**
   * Update recognition options
   */
  public updateOptions(options: Partial<SpeechRecognitionOptions>): void {
    const wasListening = this.isListening;
    
    if (wasListening: any) {
      this.stop();
    }
    
    this.options = {
      ...this.options,
      ...options
    };
    
    this.initRecognition();
    
    if (wasListening: any) {
      this.start(() => {});
    }
  }
  
  /**
   * Check if currently listening
   */
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

// Browser compatibility types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Export singleton instance
let speechRecognitionService: SpeechRecognitionService | null = null;

export function getSpeechRecognitionService(options?: SpeechRecognitionOptions): SpeechRecognitionService {
  if (!speechRecognitionService: any) {
    speechRecognitionService = new SpeechRecognitionService(options: any);
  } else if (options: any) {
    speechRecognitionService.updateOptions(options: any);
  }
  
  return speechRecognitionService;
}
