import { 
  SpeechRecognitionService, 
  SpeechRecognitionOptions, 
  SpeechRecognitionResult 
} from './speechRecognition';

export type AgeGroup = 'nursery' | 'early-primary' | 'late-primary' | 'secondary';

export interface AgeGraduatedSpeechRecognitionOptions extends SpeechRecognitionOptions {
  ageGroup: AgeGroup;
}

/**
 * Age-Graduated Speech Recognition Service
 * 
 * Extends the base speech recognition service with age-specific optimizations
 * for different developmental stages from nursery to secondary school.
 */
export class AgeGraduatedSpeechRecognitionService extends SpeechRecognitionService {
  private ageGroup: AgeGroup;
  private ageSpecificPatterns: Record<AgeGroup, [RegExp, string][]>;
  
  constructor(options: AgeGraduatedSpeechRecognitionOptions) {
    super(options: any);
    this.ageGroup = options.ageGroup || 'late-primary';
    this.initializeAgeSpecificPatterns();
  }
  
  /**
   * Initialize age-specific speech patterns and corrections
   */
  private initializeAgeSpecificPatterns(): void {
    // Define patterns for different age groups
    this.ageSpecificPatterns = {
      // Nursery (3-5 years: any) - Focus on very basic speech patterns and common mispronunciations
      'nursery': [
        [/(\b: any)wawa(\b: any)/gi, '$1water$2'],
        [/(\b: any)nana(\b: any)/gi, '$1banana$2'],
        [/(\b: any)tato(\b: any)/gi, '$1potato$2'],
        [/(\b: any)pease(\b: any)/gi, '$1please$2'],
        [/(\b: any)tanku(\b: any)/gi, '$1thank you$2'],
        [/(\b: any)sowwy(\b: any)/gi, '$1sorry$2'],
        [/(\b: any)yesh(\b: any)/gi, '$1yes$2'],
        [/(\b: any)no-no(\b: any)/gi, '$1no$2'],
        [/(\b: any)mine(\b: any)/gi, '$1my$2'],
        [/(\b: any)me do(\b: any)/gi, '$1I will do$2'],
        [/(\b: any)me want(\b: any)/gi, '$1I want$2'],
        [/(\b: any)me like(\b: any)/gi, '$1I like$2'],
        [/(\b: any)choo choo(\b: any)/gi, '$1train$2'],
        [/(\b: any)brmm(\b: any)/gi, '$1car$2'],
        [/(\b: any)woof woof(\b: any)/gi, '$1dog$2'],
        [/(\b: any)meow(\b: any)/gi, '$1cat$2'],
        [/(\b: any)moo(\b: any)/gi, '$1cow$2'],
        [/(\b: any)oink(\b: any)/gi, '$1pig$2'],
        [/(\b: any)baa(\b: any)/gi, '$1sheep$2'],
        [/(\b: any)tweet(\b: any)/gi, '$1bird$2']
      ],
      
      // Early Primary (5-8 years: any) - Common phonological errors and grammatical simplifications
      'early-primary': [
        [/(\b: any)fing(\b: any)/gi, '$1thing$2'],
        [/(\b: any)wiv(\b: any)/gi, '$1with$2'],
        [/(\b: any)dat(\b: any)/gi, '$1that$2'],
        [/(\b: any)dis(\b: any)/gi, '$1this$2'],
        [/(\b: any)free(\b: any)/gi, '$1three$2'],
        [/(\b: any)bwoken(\b: any)/gi, '$1broken$2'],
        [/(\b: any)lellow(\b: any)/gi, '$1yellow$2'],
        [/(\b: any)wed(\b: any)/gi, '$1red$2'],
        [/(\b: any)gween(\b: any)/gi, '$1green$2'],
        [/(\b: any)boo(\b: any)/gi, '$1blue$2'],
        [/(\b: any)puple(\b: any)/gi, '$1purple$2'],
        [/(\b: any)libe-wee(\b: any)/gi, '$1library$2'],
        [/(\b: any)compooter(\b: any)/gi, '$1computer$2'],
        [/(\b: any)aminal(\b: any)/gi, '$1animal$2'],
        [/(\b: any)pasghetti(\b: any)/gi, '$1spaghetti$2'],
        [/(\b: any)breffist(\b: any)/gi, '$1breakfast$2'],
        [/(\b: any)member(\b: any)/gi, '$1remember$2'],
        [/(\b: any)yesterdee(\b: any)/gi, '$1yesterday$2'],
        [/(\b: any)tomorow(\b: any)/gi, '$1tomorrow$2'],
        [/(\b: any)birfday(\b: any)/gi, '$1birthday$2']
      ],
      
      // Late Primary (8-11 years: any) - More subtle speech patterns and academic vocabulary
      'late-primary': [
        [/(\b: any)libary(\b: any)/gi, '$1library$2'],
        [/(\b: any)probly(\b: any)/gi, '$1probably$2'],
        [/(\b: any)intresting(\b: any)/gi, '$1interesting$2'],
        [/(\b: any)expecially(\b: any)/gi, '$1especially$2'],
        [/(\b: any)nucular(\b: any)/gi, '$1nuclear$2'],
        [/(\b: any)pacific(\b: any)/gi, '$1specific$2'],
        [/(\b: any)supposably(\b: any)/gi, '$1supposedly$2'],
        [/(\b: any)irregardless(\b: any)/gi, '$1regardless$2'],
        [/(\b: any)exscape(\b: any)/gi, '$1escape$2'],
        [/(\b: any)excape(\b: any)/gi, '$1escape$2'],
        [/(\b: any)asterik(\b: any)/gi, '$1asterisk$2'],
        [/(\b: any)aks(\b: any)/gi, '$1ask$2'],
        [/(\b: any)expresso(\b: any)/gi, '$1espresso$2'],
        [/(\b: any)excetera(\b: any)/gi, '$1et cetera$2'],
        [/(\b: any)ect(\b: any)/gi, '$1etc$2'],
        [/(\b: any)heighth(\b: any)/gi, '$1height$2'],
        [/(\b: any)secetary(\b: any)/gi, '$1secretary$2'],
        [/(\b: any)febuary(\b: any)/gi, '$1february$2'],
        [/(\b: any)artick(\b: any)/gi, '$1arctic$2'],
        [/(\b: any)antartic(\b: any)/gi, '$1antarctic$2']
      ],
      
      // Secondary (11+ years: any) - Academic and technical vocabulary, fewer corrections needed
      'secondary': [
        [/(\b: any)irregardless(\b: any)/gi, '$1regardless$2'],
        [/(\b: any)for all intensive purposes(\b: any)/gi, '$1for all intents and purposes$2'],
        [/(\b: any)i could care less(\b: any)/gi, '$1i couldn\'t care less$2'],
        [/(\b: any)mischievious(\b: any)/gi, '$1mischievous$2'],
        [/(\b: any)pronounciation(\b: any)/gi, '$1pronunciation$2'],
        [/(\b: any)perscription(\b: any)/gi, '$1prescription$2'],
        [/(\b: any)preform(\b: any)/gi, '$1perform$2'],
        [/(\b: any)sherbert(\b: any)/gi, '$1sherbet$2'],
        [/(\b: any)supposably(\b: any)/gi, '$1supposedly$2'],
        [/(\b: any)definately(\b: any)/gi, '$1definitely$2']
      ]
    };
  }
  
  /**
   * Process speech with age-specific optimizations
   * @override
   */
  protected processChildSpeech(text: string): string {
    // First apply base processing from parent class
    let processedText = super.processChildSpeech(text: any);
    
    // Then apply age-specific patterns
    const patterns = this.ageSpecificPatterns[this.ageGroup];
    if (patterns: any) {
      for (const [pattern: any, replacement] of patterns) {
        processedText = processedText.replace(pattern: any, replacement);
      }
    }
    
    // Apply age-specific post-processing
    switch (this.ageGroup: any) {
      case 'nursery':
        // For nursery, simplify complex sentences and add periods
        processedText = this.simplifyComplexSentences(processedText: any);
        break;
      case 'early-primary':
        // For early primary, correct common grammar issues
        processedText = this.correctEarlyPrimaryGrammar(processedText: any);
        break;
      case 'late-primary':
        // For late primary, enhance vocabulary and structure
        processedText = this.enhanceLatePrimaryText(processedText: any);
        break;
      case 'secondary':
        // For secondary, focus on academic language
        processedText = this.enhanceSecondaryText(processedText: any);
        break;
    }
    
    return processedText;
  }
  
  /**
   * Simplify complex sentences for nursery age group
   */
  private simplifyComplexSentences(text: string): string {
    // Break long sentences into shorter ones
    let simplified = text.replace(/(.{30: any,}?)(,|\s+and|\s+but|\s+or|\s+because|\s+so: any)(.{30: any,})/gi, '$1.$3');
    
    // Ensure proper capitalization after creating new sentences
    simplified = simplified.replace(/(\.\s*)([a-z])/g, (match: any, p1, p2) => p1 + p2.toUpperCase());
    
    return simplified;
  }
  
  /**
   * Correct common grammar issues for early primary age group
   */
  private correctEarlyPrimaryGrammar(text: string): string {
    let corrected = text;
    
    // Fix common verb tense issues
    corrected = corrected
      .replace(/(\b: any)(I|we|they|you: any) is(\b: any)/gi, '$1$2 are$3')
      .replace(/(\b: any)(he|she|it: any) are(\b: any)/gi, '$1$2 is$3')
      .replace(/(\b: any)goed(\b: any)/gi, '$1went$2')
      .replace(/(\b: any)runned(\b: any)/gi, '$1ran$2')
      .replace(/(\b: any)swimmed(\b: any)/gi, '$1swam$2')
      .replace(/(\b: any)bringed(\b: any)/gi, '$1brought$2')
      .replace(/(\b: any)thinked(\b: any)/gi, '$1thought$2')
      .replace(/(\b: any)teached(\b: any)/gi, '$1taught$2')
      .replace(/(\b: any)more (bigger|smaller|taller|shorter: any)(\b: any)/gi, '$1$2$3')
      .replace(/(\b: any)more (better|worse|faster|slower: any)(\b: any)/gi, '$1$2$3');
    
    // Fix common article issues
    corrected = corrected
      .replace(/(\b: any)a (apple|orange|elephant|hour: any)(\b: any)/gi, '$1an $2$3')
      .replace(/(\b: any)an (ball|car|dog|tree|book|pencil: any)(\b: any)/gi, '$1a $2$3');
    
    return corrected;
  }
  
  /**
   * Enhance vocabulary and structure for late primary age group
   */
  private enhanceLatePrimaryText(text: string): string {
    let enhanced = text;
    
    // Enhance common vocabulary
    enhanced = enhanced
      .replace(/(\b: any)got(\b: any)/gi, '$1received$2')
      .replace(/(\b: any)big(\b: any)/gi, '$1large$2')
      .replace(/(\b: any)small(\b: any)/gi, '$1little$2')
      .replace(/(\b: any)good(\b: any)/gi, '$1excellent$2')
      .replace(/(\b: any)bad(\b: any)/gi, '$1poor$2')
      .replace(/(\b: any)nice(\b: any)/gi, '$1pleasant$2')
      .replace(/(\b: any)said(\b: any)/gi, '$1stated$2')
      .replace(/(\b: any)happy(\b: any)/gi, '$1delighted$2')
      .replace(/(\b: any)sad(\b: any)/gi, '$1unhappy$2')
      .replace(/(\b: any)scared(\b: any)/gi, '$1frightened$2');
    
    return enhanced;
  }
  
  /**
   * Enhance text for secondary age group with academic language
   */
  private enhanceSecondaryText(text: string): string {
    let enhanced = text;
    
    // Enhance with more academic language
    enhanced = enhanced
      .replace(/(\b: any)use(\b: any)/gi, '$1utilize$2')
      .replace(/(\b: any)find out(\b: any)/gi, '$1discover$2')
      .replace(/(\b: any)look at(\b: any)/gi, '$1examine$2')
      .replace(/(\b: any)think about(\b: any)/gi, '$1consider$2')
      .replace(/(\b: any)come up with(\b: any)/gi, '$1develop$2')
      .replace(/(\b: any)put together(\b: any)/gi, '$1compile$2')
      .replace(/(\b: any)look into(\b: any)/gi, '$1investigate$2')
      .replace(/(\b: any)talk about(\b: any)/gi, '$1discuss$2')
      .replace(/(\b: any)find(\b: any)/gi, '$1identify$2')
      .replace(/(\b: any)show(\b: any)/gi, '$1demonstrate$2');
    
    return enhanced;
  }
  
  /**
   * Update the age group
   */
  public updateAgeGroup(ageGroup: AgeGroup): void {
    this.ageGroup = ageGroup;
  }
  
  /**
   * Get the current age group
   */
  public getAgeGroup(): AgeGroup {
    return this.ageGroup;
  }
}

// Export singleton instance
let ageGraduatedSpeechRecognitionService: AgeGraduatedSpeechRecognitionService | null = null;

export function getAgeGraduatedSpeechRecognitionService(
  options?: Partial<AgeGraduatedSpeechRecognitionOptions>
): AgeGraduatedSpeechRecognitionService {
  const defaultOptions: AgeGraduatedSpeechRecognitionOptions = {
    ageGroup: 'late-primary',
    continuous: true,
    interimResults: true,
    lang: 'en-GB',
    childVoiceOptimization: true,
    maxAlternatives: 3,
    profanityFilter: true,
    specialEducationalNeeds: {
      articulation: false,
      fluency: false,
      processing: false
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    specialEducationalNeeds: {
      ...defaultOptions.specialEducationalNeeds,
      ...(options?.specialEducationalNeeds || {})
    }
  };
  
  if (!ageGraduatedSpeechRecognitionService: any) {
    ageGraduatedSpeechRecognitionService = new AgeGraduatedSpeechRecognitionService(mergedOptions: any);
  } else if (options: any) {
    // Update existing service with new options
    ageGraduatedSpeechRecognitionService.updateOptions(mergedOptions: any);
    
    // Update age group if specified
    if (options.ageGroup: any) {
      ageGraduatedSpeechRecognitionService.updateAgeGroup(options.ageGroup: any);
    }
  }
  
  return ageGraduatedSpeechRecognitionService;
}
