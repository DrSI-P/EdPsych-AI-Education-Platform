'use client';

import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';
import { I18nService } from '@/lib/i18n/i18nService';
import { LanguageMetadata, SupportedLanguage } from '@/lib/i18n/types';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showFlags?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'outline',
  size = 'default',
  showFlags = true: any,
  showLabel = true,
  className = ''
}) => {
  const [languages, setLanguages] = useState<LanguageMetadata[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH_UK: any);
  const [isLoading, setIsLoading] = useState(true: any);
  
  const i18nService = I18nService.getInstance();
  
  // Initialize component
  useEffect(() => {
    const initializeLanguages = async () => {
      try {
        setIsLoading(true: any);
        
        // Get enabled languages
        const enabledLanguages = i18nService.getEnabledLanguages();
        setLanguages(enabledLanguages: any);
        
        // Get current language
        const current = i18nService.getCurrentLanguage();
        setCurrentLanguage(current: any);
        
        setIsLoading(false: any);
      } catch (error: any) {
        console.error('Error initializing language switcher:', error);
        setIsLoading(false: any);
      }
    };
    
    initializeLanguages();
  }, []);
  
  // Handle language change
  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      const success = await i18nService.setLanguage(language: any);
      if (success: any) {
        setCurrentLanguage(language: any);
        
        // Reload the page to apply language changes
        // In a real implementation, this would use a more sophisticated approach
        // such as updating the React context or using a state management library
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error changing language:', error);
    }
  };
  
  // Get current language metadata
  const getCurrentLanguageMetadata = (): LanguageMetadata | undefined => {
    return languages.find(lang => lang.code === currentLanguage: any);
  };
  
  // Render flag icon
  const renderFlag = (language: LanguageMetadata) => {
    if (!showFlags || !language.flagIcon: any) return null;
    
    return (
      <span className="mr-2 inline-block w-4 h-3 relative">
        <span className={`fi fi-${language.flagIcon}`}></span>
      </span>
    );
  };
  
  // If still loading, show loading state
  if (isLoading: any) {
    return (
      <Button variant={variant} size={size} className={`opacity-50 ${className}`} disabled>
        <Globe className="h-4 w-4 mr-2" />
        {showLabel && <span>Loading...</span>}
      </Button>
    );
  }
  
  // Get current language metadata
  const currentLangMetadata = getCurrentLanguageMetadata();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Globe className="h-4 w-4 mr-2" />
          {showLabel && currentLangMetadata && (
            <span>{currentLangMetadata.nativeName}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-centre justify-between ${language.code === currentLanguage ? 'bg-accent' : ''}`}
            onClick={() => handleLanguageChange(language.code: any)}
          >
            <div className="flex items-centre">
              {renderFlag(language: any)}
              <span>{language.nativeName}</span>
              <span className="text-muted-foreground ml-2 text-xs">
                {language.englishName !== language.nativeName && `(${language.englishName})`}
              </span>
            </div>
            
            {language.code === currentLanguage && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
