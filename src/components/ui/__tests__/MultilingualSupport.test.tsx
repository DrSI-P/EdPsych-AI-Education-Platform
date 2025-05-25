import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MultilingualSupport from '@/components/ui/MultilingualSupport';

// Add Jest globals
declare global {
  namespace NodeJS {
    interface Global {
      jest: typeof jest;
      describe: typeof describe;
      beforeEach: typeof beforeEach;
      it: typeof it;
      expect: typeof expect;
      test: typeof test;
    }
  }
}

describe('MultilingualSupport', () => {
  const mockContent = {
    en: <div>English content</div>,
    fr: <div>Contenu français</div>,
    es: <div>Contenido español</div>,
  };
  
  const mockLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  it('renders with default language content', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
      />
    );
    
    expect(screen.getByText('English content')).toBeInTheDocument();
  });
  
  it('renders language selector with available languages', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        showLanguageSelector={true}
      />
    );
    
    // Language selector button should be visible with current language
    const selectorButton = screen.getByRole('button', { name: /English/i });
    expect(selectorButton).toBeInTheDocument();
    expect(selectorButton).toHaveTextContent('🇬🇧');
    expect(selectorButton).toHaveTextContent('English');
  });
  
  it('opens language dropdown when selector is clicked', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
      />
    );
    
    // Click the language selector
    const selectorButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(selectorButton);
    
    // Dropdown should show all available languages
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });
  
  it('changes language when a different language is selected', async () => {
    const mockOnLanguageChange = jest.fn();
    
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        onLanguageChange={mockOnLanguageChange}
      />
    );
    
    // Initially shows English content
    expect(screen.getByText('English content')).toBeInTheDocument();
    
    // Click the language selector
    const selectorButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(selectorButton);
    
    // Click on French option
    const frenchOption = screen.getByText('Français');
    fireEvent.click(frenchOption);
    
    // Should now show French content
    await waitFor(() => {
      expect(screen.getByText('Contenu français')).toBeInTheDocument();
    });
    
    // Callback should be called with the new language code
    expect(mockOnLanguageChange).toHaveBeenCalledWith('fr');
  });
  
  it('saves selected language to localStorage', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
      />
    );
    
    // Click the language selector
    const selectorButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(selectorButton);
    
    // Click on Spanish option
    const spanishOption = screen.getByText('Español');
    fireEvent.click(spanishOption);
    
    // Check if language preference was saved to localStorage
    expect(localStorage.getItem('preferredLanguage')).toBe('es');
  });
  
  it('uses user preferred language when provided', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        userPreferredLanguage="fr"
      />
    );
    
    // Should show French content based on user preference
    expect(screen.getByText('Contenu français')).toBeInTheDocument();
  });
  
  it('falls back to default language when preferred language has no content', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={[...mockLanguages, { code: 'de', name: 'Deutsch', flag: '🇩🇪' }]}
        userPreferredLanguage="de" // German content doesn't exist
      />
    );
    
    // Should fall back to English content
    expect(screen.getByText('English content')).toBeInTheDocument();
  });
  
  it('hides language selector when showLanguageSelector is false', () => {
    render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        showLanguageSelector={false}
      />
    );
    
    // Language selector should not be visible
    const selectorButton = screen.queryByRole('button', { name: /English/i });
    expect(selectorButton).not.toBeInTheDocument();
  });
  
  it('filters available languages to only those with content', () => {
    render(
      <MultilingualSupport 
        content={mockContent} // Only en, fr, es have content
        defaultLanguage="en"
        availableLanguages={[
          ...mockLanguages,
          { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, // No content for German
          { code: 'it', name: 'Italiano', flag: '🇮🇹' }  // No content for Italian
        ]}
      />
    );
    
    // Click the language selector
    const selectorButton = screen.getByRole('button', { name: /English/i });
    fireEvent.click(selectorButton);
    
    // Should only show languages that have content
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.queryByText('Deutsch')).not.toBeInTheDocument();
    expect(screen.queryByText('Italiano')).not.toBeInTheDocument();
  });
  
  it('positions language selector at the top by default', () => {
    const { container } = render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        position="top"
      />
    );
    
    // Language selector should have mb-4 class (margin-bottom)
    const languageSelector = container.querySelector('.language-selector');
    expect(languageSelector).toHaveClass('mb-4');
  });
  
  it('positions language selector at the bottom when position is bottom', () => {
    const { container } = render(
      <MultilingualSupport 
        content={mockContent} 
        defaultLanguage="en"
        availableLanguages={mockLanguages}
        position="bottom"
      />
    );
    
    // Language selector should have mt-4 class (margin-top)
    const languageSelector = container.querySelector('.language-selector');
    expect(languageSelector).toHaveClass('mt-4');
  });
});
