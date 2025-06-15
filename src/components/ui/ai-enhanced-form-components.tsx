'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Button, 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Textarea, 
  Badge, 
  Alert 
} from '@/components/ui/enhanced-form-components';
import { Sparkles, AlertCircle, Check, X } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

// Type for field validation rules
interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: unknown; // For minLength, maxLength, pattern, etc.
  validator?: (value: unknown) => boolean; // For custom validation
}

// Type for field suggestions
interface FieldSuggestion {
  value: string;
  label: string;
  confidence: number; // 0-1 score indicating AI confidence
}

// Type for contextual help
interface ContextualHelp {
  text: string;
  examples?: string[];
  links?: { label: string; url: string }[];
}

// Common props for all AI-enhanced form components
interface AIEnhancedFormComponentProps {
  validationRules?: ValidationRule[];
  suggestions?: FieldSuggestion[];
  contextualHelp?: ContextualHelp;
  adaptivePlaceholder?: boolean;
  predictiveInput?: boolean;
  intelligentDefaults?: boolean;
  userRole?: string;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  fieldUsageHistory?: any[]; // Previous interactions with this field
}

/**
 * AI-Enhanced Input Component
 * 
 * Extends the base Input component with AI-driven features:
 * - Smart validation with contextual error messages
 * - Predictive input suggestions based on user behavior
 * - Adaptive placeholders that change based on user experience
 * - Contextual help that provides guidance based on user role and experience
 */
export function AIEnhancedInput({
  validationRules = [],
  suggestions = [],
  contextualHelp,
  adaptivePlaceholder = false,
  predictiveInput = false,
  intelligentDefaults = false,
  userRole = 'educator',
  userExperience = 'intermediate',
  fieldUsageHistory = [],
  label,
  placeholder,
  onChange,
  onBlur,
  value,
  ...props
}: AIEnhancedFormComponentProps & React.ComponentProps<typeof Input>) {
  // State for validation
  const [error, setError] = useState<string | undefined>(undefined);
  const [isTouched, setIsTouched] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [activeSuggestions, setActiveSuggestions] = useState<FieldSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Generate adaptive placeholder based on user experience
  const getAdaptivePlaceholder = (): void => {
    if (!adaptivePlaceholder) return placeholder;
    
    switch (userExperience) {
      case 'beginner':
        return `Enter ${label?.toLowerCase()} (e.g., ${suggestions[0]?.label || 'example'})`;
      case 'intermediate':
        return placeholder || `Enter ${label?.toLowerCase()}`;
      case 'advanced':
        return placeholder || '';
      default:
        return placeholder;
    }
  };
  
  // Validate input against rules
  const validateInput = (value: unknown): string | undefined => {
    for (const rule of validationRules) {
      switch (rule.type) {
        case 'required':
          if (!value || value.trim() === '') return rule.message;
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return rule.message;
          break;
        case 'minLength':
          if (value && value.length < rule.value) return rule.message;
          break;
        case 'maxLength':
          if (value && value.length > rule.value) return rule.message;
          break;
        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) return rule.message;
          break;
        case 'custom':
          if (rule.validator && !rule.validator(value)) return rule.message;
          break;
      }
    }
    return undefined;
  };
  
  // Filter suggestions based on input
  const filterSuggestions = (input: string) => {
    if (!predictiveInput || !input) {
      setActiveSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filtered = suggestions
      .filter((suggestion: FieldSuggestion) =>
        suggestion.value.toLowerCase().includes(input.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(input.toLowerCase())
      )
      .sort((a: FieldSuggestion, b: FieldSuggestion) => b.confidence - a.confidence)
      .slice(0, 5); // Limit to top 5 suggestions
    
    setActiveSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    filterSuggestions(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    setError(validateInput(e.target.value));
    setShowSuggestions(false);
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: FieldSuggestion) => {
    setInputValue(suggestion.value);
    setShowSuggestions(false);
    
    // Create a synthetic event to pass to onChange
    const syntheticEvent = {
      target: {
        name: props.name,
        value: suggestion.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (onChange) {
      onChange(syntheticEvent);
    }
  };
  
  // Set intelligent default value on initial render
  useEffect(() => {
    if (intelligentDefaults && !value && suggestions.length > 0) {
      // Find the suggestion with the highest confidence
      const bestSuggestion = suggestions.reduce(
        (prev: FieldSuggestion, current: FieldSuggestion) => (current.confidence > prev.confidence ? current : prev),
        suggestions[0]
      );
      
      setInputValue(bestSuggestion.value);
      
      // Create a synthetic event to pass to onChange
      const syntheticEvent = {
        target: {
          name: props.name,
          value: bestSuggestion.value
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange) {
        onChange(syntheticEvent);
      }
    }
  }, []);
  
  return (
    <div className="relative">
      <Input
        label={label}
        placeholder={getAdaptivePlaceholder()}
        error={isTouched ? error : undefined}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        rightIcon={
          contextualHelp ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div>
                    <p className="font-medium">{contextualHelp.text}</p>
                    {contextualHelp.examples && contextualHelp.examples.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Examples:</p>
                        <ul className="list-disc pl-4 mt-1">
                          {contextualHelp.examples.map((example: string, index: number) => (
                            <li key={index}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : undefined
        }
        {...props}
      />
      
      {/* Suggestions popover */}
      {showSuggestions && activeSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {activeSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <span>{suggestion.label}</span>
                <Sparkles className="h-4 w-4 text-primary ml-2" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * AI-Enhanced Select Component
 * 
 * Extends the base Select component with AI-driven features:
 * - Smart option recommendations based on user role and behavior
 * - Contextual help for making appropriate selections
 * - Intelligent default selection based on user history
 */
export function AIEnhancedSelect({
  validationRules = [],
  suggestions = [],
  contextualHelp,
  intelligentDefaults = false,
  userRole = 'educator',
  userExperience = 'intermediate',
  fieldUsageHistory = [],
  label,
  options,
  onChange,
  onBlur,
  value,
  ...props
}: AIEnhancedFormComponentProps & React.ComponentProps<typeof Select>) {
  // State for validation
  const [error, setError] = useState<string | undefined>(undefined);
  const [isTouched, setIsTouched] = useState(false);
  const [selectValue, setSelectValue] = useState(value || '');
  
  // Enhance options with AI recommendations
  const enhancedOptions = options.map((option: { value: string; label: string }) => {
    // Check if this option is recommended by AI
    const recommendation = suggestions.find((s: FieldSuggestion) => s.value === option.value);
    
    return {
      ...option,
      isRecommended: !!recommendation,
      confidence: recommendation?.confidence || 0
    };
  }).sort((a: unknown, b: unknown) => {
    // Sort by recommendation confidence, but keep the original order as a secondary sort
    if (a.isRecommended && b.isRecommended) {
      return b.confidence - a.confidence;
    }
    if (a.isRecommended) return -1;
    if (b.isRecommended) return 1;
    return 0;
  });
  
  // Validate select against rules
  const validateSelect = (value: unknown): string | undefined => {
    for (const rule of validationRules) {
      switch (rule.type) {
        case 'required':
          if (!value || value.trim() === '') return rule.message;
          break;
        case 'custom':
          if (rule.validator && !rule.validator(value)) return rule.message;
          break;
      }
    }
    return undefined;
  };
  
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle select blur
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsTouched(true);
    setError(validateSelect(e.target.value));
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Set intelligent default value on initial render
  useEffect(() => {
    if (intelligentDefaults && !value && suggestions.length > 0) {
      // Find the suggestion with the highest confidence
      const bestSuggestion = suggestions.reduce(
        (prev: FieldSuggestion, current: FieldSuggestion) => (current.confidence > prev.confidence ? current : prev),
        suggestions[0]
      );
      
      setSelectValue(bestSuggestion.value);
      
      // Create a synthetic event to pass to onChange
      const syntheticEvent = {
        target: {
          name: props.name,
          value: bestSuggestion.value
        }
      } as React.ChangeEvent<HTMLSelectElement>;
      
      if (onChange) {
        onChange(syntheticEvent);
      }
    }
  }, []);
  
  // Create enhanced option elements with recommendation indicators
  const optionElements = enhancedOptions.map((option: unknown) => (
    <option key={option.value} value={option.value}>
      {option.label} {option.isRecommended ? '✨' : ''}
    </option>
  ));
  
  return (
    <div className="relative">
      <Select
        label={
          <div className="flex items-center gap-2">
            <span>{label}</span>
            {suggestions.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI-recommended options are highlighted with ✨</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        }
        error={isTouched ? error : undefined}
        value={selectValue}
        onChange={handleChange}
        onBlur={handleBlur}
        options={enhancedOptions}
        {...props}
      />
      
      {/* Contextual help */}
      {contextualHelp && (
        <div className="mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Need help choosing?</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div>
                  <p className="font-medium">{contextualHelp.text}</p>
                  {contextualHelp.examples && contextualHelp.examples.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Recommended for your role:</p>
                      <ul className="list-disc pl-4 mt-1">
                        {contextualHelp.examples.map((example: string, index: number) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

/**
 * AI-Enhanced Form Component
 * 
 * A smart form container that provides:
 * - Intelligent form validation
 * - Adaptive form layout based on user experience
 * - Predictive field completion
 * - Smart default values
 */
interface AIEnhancedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: (data: unknown) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  intelligentValidation?: boolean;
  adaptiveLayout?: boolean;
  predictiveCompletion?: boolean;
  userRole?: string;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  formUsageHistory?: any[];
  validationRules?: Record<string, ValidationRule[]>;
}

export function AIEnhancedForm({
  children,
  onSubmit,
  onValidationError,
  intelligentValidation = true,
  adaptiveLayout = false,
  predictiveCompletion = false,
  userRole = 'educator',
  userExperience = 'intermediate',
  formUsageHistory = [],
  validationRules = {},
  className,
  ...props
}: AIEnhancedFormProps) {
  // State for form data and errors
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionSuggestions, setCompletionSuggestions] = useState<Record<string, any>>({});
  const [showCompletionSuggestion, setShowCompletionSuggestion] = useState(false);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    if (intelligentValidation) {
      const errors: Record<string, string> = {};
      
      Object.entries(validationRules).forEach(([fieldName, rules]) => {
        const value = formData[fieldName];
        
        for (const rule of rules) {
          let isValid = true;
          
          switch (rule.type) {
            case 'required':
              isValid = !!value && value.trim() !== '';
              break;
            case 'email':
              isValid = !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
              break;
            case 'minLength':
              isValid = !value || value.length >= rule.value;
              break;
            case 'maxLength':
              isValid = !value || value.length <= rule.value;
              break;
            case 'pattern':
              isValid = !value || new RegExp(rule.value).test(value);
              break;
            case 'custom':
              isValid = !rule.validator || rule.validator(value);
              break;
          }
          
          if (!isValid) {
            errors[fieldName] = rule.message;
            break;
          }
        }
      });
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        
        if (onValidationError) {
          onValidationError(errors);
        }
        
        return;
      }
    }
    
    // Submit the form
    if (onSubmit) {
      onSubmit(formData);
    }
    
    setIsSubmitting(false);
  };
  
  // Handle field change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Generate predictive completion suggestions
  useEffect(() => {
    if (predictiveCompletion && formUsageHistory.length > 0) {
      // This would typically be an AI-driven suggestion based on user history
      // For now, we'll simulate it with the most recent form submission
      const mostRecentSubmission = formUsageHistory[formUsageHistory.length - 1];
      
      // Only suggest fields that haven't been filled yet
      const suggestions: Record<string, any> = {};
      Object.entries(mostRecentSubmission).forEach(([key, value]) => {
        if (!formData[key] && value) {
          suggestions[key] = value;
        }
      });
      
      if (Object.keys(suggestions).length > 0) {
        setCompletionSuggestions(suggestions);
        setShowCompletionSuggestion(true);
      }
    }
  }, [formData, predictiveCompletion, formUsageHistory]);
  
  // Apply completion suggestions
  const applyCompletionSuggestions = (): void => {
    setFormData(prev => ({
      ...prev,
      ...completionSuggestions
    }));
    
    setShowCompletionSuggestion(false);
  };
  
  // Dismiss completion suggestions
  const dismissCompletionSuggestions = (): void => {
    setShowCompletionSuggestion(false);
  };
  
  // Clone children with enhanced props
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    
    // Only enhance form elements
    if (
      child.type === Input ||
      child.type === Select ||
      child.type === Textarea ||
      child.type === Checkbox ||
      child.type === Radio ||
      child.type === AIEnhancedInput ||
      child.type === AIEnhancedSelect
    ) {
      const name = child.props.name;
      
      return React.cloneElement(child, {
        onChange: (e: React.ChangeEvent<any>) => {
          handleFieldChange(e);
          if (child.props.onChange) {
            child.props.onChange(e);
          }
        },
        value: formData[name] || child.props.value || '',
        error: formErrors[name],
      });
    }
    
    // Recursively enhance nested children
    if (child.props.children) {
      return React.cloneElement(child, {
        children: enhancedChildren(child.props.children)
      });
    }
    
    return child;
  });
  
  return (
    <form 
      className={cn('space-y-4', className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      {/* Predictive completion suggestion */}
      {showCompletionSuggestion && (
        <Alert 
          variant="info"
          title="Smart Form Completion"
          icon={<Sparkles className="h-5 w-5" />}
          onClose={dismissCompletionSuggestions}
          className="mb-4"
        >
          <p>We can fill some fields based on your previous submissions.</p>
          <div className="mt-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={applyCompletionSuggestions}
              leftIcon={<Check className="h-4 w-4" />}
            >
              Apply Suggestions
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Form content */}
      <div className={cn(
        adaptiveLayout && userExperience === 'beginner' ? 'space-y-6' : '',
        adaptiveLayout && userExperience === 'advanced' ? 'grid grid-cols-2 gap-4' : ''
      )}>
        {enhancedChildren}
      </div>
      
      {/* Form errors */}
      {Object.keys(formErrors).length > 0 && (
        <Alert 
          variant="error"
          title="Please fix the following errors:"
          icon={<X className="h-5 w-5" />}
          className="mt-4"
        >
          <ul className="list-disc pl-5 mt-2">
            {Object.values(formErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </form>
  );
}