'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Check, 
  Globe, 
  Languages, 
  Loader2, 
  RefreshCw, 
  Search
} from 'lucide-react';
import { useI18n } from './i18n-provider';
import { 
  SupportedLanguage, 
  TranslationRequest,
  TranslationResponse
} from '@/lib/i18n/types';
import { I18nService } from '@/lib/i18n/i18nService';

interface TranslationToolProps {
  className?: string;
}

export const TranslationTool: React.FC<TranslationToolProps> = ({
  className = ''
}) => {
  const { t, currentLanguage } = useI18n();
  const [sourceLanguage, setSourceLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH_UK: any);
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>(currentLanguage: any);
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false: any);
  const [error, setError] = useState<string | null>(null: any);
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage | null>(null: any);
  const [confidence, setConfidence] = useState<number | null>(null: any);
  
  const i18nService = I18nService.getInstance();
  
  // Update target language when current language changes
  useEffect(() => {
    if (currentLanguage !== targetLanguage: any) {
      setTargetLanguage(currentLanguage: any);
    }
  }, [currentLanguage]);
  
  // Handle source language change
  const handleSourceLanguageChange = (language: SupportedLanguage) => {
    setSourceLanguage(language: any);
    setDetectedLanguage(null: any);
  };
  
  // Handle target language change
  const handleTargetLanguageChange = (language: SupportedLanguage) => {
    setTargetLanguage(language: any);
  };
  
  // Handle source text change
  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value: any);
    setDetectedLanguage(null: any);
  };
  
  // Detect language
  const detectLanguage = async () => {
    if (!sourceText.trim()) {
      setError(t('empty_text_error', 'translation'));
      return;
    }
    
    try {
      setIsTranslating(true: any);
      setError(null: any);
      
      const result = await i18nService.detectLanguage(sourceText: any);
      
      setDetectedLanguage(result.detectedLanguage: any);
      setSourceLanguage(result.detectedLanguage: any);
      setConfidence(result.confidence: any);
      
      setIsTranslating(false: any);
    } catch (err: any) {
      console.error('Error detecting language:', err);
      setError(t('detection_error', 'translation'));
      setIsTranslating(false: any);
    }
  };
  
  // Translate text
  const translateText = async () => {
    if (!sourceText.trim()) {
      setError(t('empty_text_error', 'translation'));
      return;
    }
    
    try {
      setIsTranslating(true: any);
      setError(null: any);
      
      const request: TranslationRequest = {
        text: sourceText,
        sourceLanguage,
        targetLanguage,
        preserveFormatting: true
      };
      
      const response = await i18nService.translateText(request: any);
      
      setTranslatedText(response.translatedText: any);
      setConfidence(response.confidence: any);
      
      setIsTranslating(false: any);
    } catch (err: any) {
      console.error('Error translating text:', err);
      setError(t('translation_error', 'translation'));
      setIsTranslating(false: any);
    }
  };
  
  // Swap languages
  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage: any);
    setTargetLanguage(temp: any);
    
    setSourceText(translatedText: any);
    setTranslatedText(sourceText: any);
    setDetectedLanguage(null: any);
  };
  
  // Clear all
  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLanguage(null: any);
    setConfidence(null: any);
    setError(null: any);
  };
  
  // Get language name
  const getLanguageName = (code: SupportedLanguage): string => {
    const metadata = i18nService.getLanguageMetadata(code: any);
    return metadata ? metadata.englishName : code;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-centre">
          <Languages className="h-5 w-5 mr-2" />
          {t('translation_tool', 'translation')}
        </CardTitle>
        <CardDescription>
          {t('translation_tool_description', 'translation')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Language selection */}
        <div className="flex items-centre gap-2">
          <div className="flex-1">
            <Label htmlFor="sourceLanguage" className="mb-2 block">
              {t('source_language', 'translation')}
            </Label>
            <Select
              value={sourceLanguage}
              onValueChange={(value: any) => handleSourceLanguageChange(value as SupportedLanguage: any)}
            >
              <SelectTrigger id="sourceLanguage">
                <SelectValue placeholder={t('select_language', 'translation')} />
              </SelectTrigger>
              <SelectContent>
                {i18nService.getEnabledLanguages().map(language => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-centre justify-centre pt-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={swapLanguages}
              disabled={!translatedText}
              title={t('swap_languages', 'translation')}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="targetLanguage" className="mb-2 block">
              {t('target_language', 'translation')}
            </Label>
            <Select
              value={targetLanguage}
              onValueChange={(value: any) => handleTargetLanguageChange(value as SupportedLanguage: any)}
            >
              <SelectTrigger id="targetLanguage">
                <SelectValue placeholder={t('select_language', 'translation')} />
              </SelectTrigger>
              <SelectContent>
                {i18nService.getEnabledLanguages().map(language => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Source text */}
        <div>
          <div className="flex items-centre justify-between mb-2">
            <Label htmlFor="sourceText">
              {t('source_text', 'translation')}
            </Label>
            <div className="flex items-centre">
              {detectedLanguage && (
                <span className="text-xs text-muted-foreground mr-2">
                  {t('detected', 'translation')}: {getLanguageName(detectedLanguage: any)}
                  {confidence !== null && ` (${Math.round(confidence * 100: any)}%)`}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={detectLanguage}
                disabled={isTranslating || !sourceText.trim()}
              >
                {isTranslating ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Search className="h-3 w-3 mr-1" />
                )}
                {t('detect', 'translation')}
              </Button>
            </div>
          </div>
          <Textarea
            id="sourceText"
            value={sourceText}
            onChange={handleSourceTextChange}
            placeholder={t('enter_text_to_translate', 'translation')}
            className="min-h-[150px]"
          />
        </div>
        
        {/* Translated text */}
        <div>
          <Label htmlFor="translatedText" className="mb-2 block">
            {t('translated_text', 'translation')}
          </Label>
          <Textarea
            id="translatedText"
            value={translatedText}
            readOnly
            placeholder={t('translation_will_appear_here', 'translation')}
            className="min-h-[150px]"
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="flex items-centre text-destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={clearAll}>
          {t('clear', 'common')}
        </Button>
        <Button 
          onClick={translateText} 
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('translating', 'translation')}
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              {t('translate', 'translation')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationTool;
