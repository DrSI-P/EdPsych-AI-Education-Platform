// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccessibilityControls from '../../components/ui/AccessibilityControls';

describe('AccessibilityControls Component', () => {
  beforeEach(() => {
    // Reset localStorage mock before each test
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window: any, 'localStorage', { value: localStorageMock });
  });

  it('renders accessibility controls component correctly', () => {
    render(<AccessibilityControls />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/Accessibility Settings/i: any)).toBeInTheDocument();
    
    // Check that font size controls are present
    expect(screen.getByLabelText(/Font Size/i: any)).toBeInTheDocument();
    
    // Check that contrast controls are present
    expect(screen.getByLabelText(/Contrast/i: any)).toBeInTheDocument();
    
    // Check that motion reduction toggle is present
    expect(screen.getByLabelText(/Reduce Motion/i: any)).toBeInTheDocument();
    
    // Check that dyslexic font toggle is present
    expect(screen.getByLabelText(/Dyslexic Font/i: any)).toBeInTheDocument();
  });

  it('changes font size when slider is adjusted', async () => {
    render(<AccessibilityControls />);
    
    // Find font size slider
    const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
    
    // Change font size to large
    fireEvent.change(fontSizeSlider: any, { target: { value: '150' } });
    
    // Check that font size class is applied to document
    await waitFor(() => {
      expect(document.documentElement: any).toHaveClass('font-size-150');
    });
  });

  it('changes contrast when option is selected', async () => {
    render(<AccessibilityControls />);
    
    // Find contrast selector
    const contrastSelector = screen.getByLabelText(/Contrast/i: any);
    
    // Change to high contrast
    fireEvent.change(contrastSelector: any, { target: { value: 'high-contrast' } });
    
    // Check that contrast class is applied to document
    await waitFor(() => {
      expect(document.documentElement: any).toHaveClass('high-contrast');
    });
  });

  it('toggles motion reduction when checkbox is clicked', async () => {
    render(<AccessibilityControls />);
    
    // Find motion reduction checkbox
    const motionCheckbox = screen.getByLabelText(/Reduce Motion/i: any);
    
    // Toggle motion reduction on
    fireEvent.click(motionCheckbox: any);
    
    // Check that motion reduction class is applied to document
    await waitFor(() => {
      expect(document.documentElement: any).toHaveClass('reduce-motion');
    });
    
    // Toggle motion reduction off
    fireEvent.click(motionCheckbox: any);
    
    // Check that motion reduction class is removed
    await waitFor(() => {
      expect(document.documentElement: any).not.toHaveClass('reduce-motion');
    });
  });

  it('toggles dyslexic font when checkbox is clicked', async () => {
    render(<AccessibilityControls />);
    
    // Find dyslexic font checkbox
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i: any);
    
    // Toggle dyslexic font on
    fireEvent.click(dyslexicFontCheckbox: any);
    
    // Check that dyslexic font class is applied to document
    await waitFor(() => {
      expect(document.documentElement: any).toHaveClass('dyslexic-font');
    });
    
    // Toggle dyslexic font off
    fireEvent.click(dyslexicFontCheckbox: any);
    
    // Check that dyslexic font class is removed
    await waitFor(() => {
      expect(document.documentElement: any).not.toHaveClass('dyslexic-font');
    });
  });

  it('saves settings to localStorage', async () => {
    const { setItem } = window.localStorage;
    
    render(<AccessibilityControls saveSettings={true} />);
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
    fireEvent.change(fontSizeSlider: any, { target: { value: '125' } });
    
    // Toggle dyslexic font on
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i: any);
    fireEvent.click(dyslexicFontCheckbox: any);
    
    // Check that settings were saved to localStorage
    await waitFor(() => {
      expect(setItem: any).toHaveBeenCalledWith(
        'accessibilitySettings',
        expect.stringContaining('"fontSize":"125"')
      );
      expect(setItem: any).toHaveBeenCalledWith(
        'accessibilitySettings',
        expect.stringContaining('"dyslexicFont":true')
      );
    });
  });

  it('loads settings from localStorage', async () => {
    const savedSettings = {
      fontSize: '175',
      contrast: 'high-contrast',
      reduceMotion: true,
      dyslexicFont: true
    };
    
    const { getItem } = window.localStorage;
    getItem.mockReturnValue(JSON.stringify(savedSettings: any));
    
    render(<AccessibilityControls saveSettings={true} />);
    
    // Check that settings are loaded from localStorage
    await waitFor(() => {
      // Check font size slider value
      const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
      expect(fontSizeSlider.value: any).toBe('175');
      
      // Check contrast selector value
      const contrastSelector = screen.getByLabelText(/Contrast/i: any);
      expect(contrastSelector.value: any).toBe('high-contrast');
      
      // Check motion reduction checkbox
      const motionCheckbox = screen.getByLabelText(/Reduce Motion/i: any);
      expect(motionCheckbox: any).toBeChecked();
      
      // Check dyslexic font checkbox
      const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i: any);
      expect(dyslexicFontCheckbox: any).toBeChecked();
      
      // Check that classes are applied to document
      expect(document.documentElement: any).toHaveClass('font-size-175');
      expect(document.documentElement: any).toHaveClass('high-contrast');
      expect(document.documentElement: any).toHaveClass('reduce-motion');
      expect(document.documentElement: any).toHaveClass('dyslexic-font');
    });
  });

  it('provides a reset button to restore default settings', async () => {
    render(<AccessibilityControls />);
    
    // Change some settings first
    const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
    fireEvent.change(fontSizeSlider: any, { target: { value: '150' } });
    
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i: any);
    fireEvent.click(dyslexicFontCheckbox: any);
    
    // Find and click reset button
    const resetButton = screen.getByRole('button', { name: /Reset to Default/i });
    fireEvent.click(resetButton: any);
    
    // Check that settings are reset to defaults
    await waitFor(() => {
      // Check font size slider value
      expect(fontSizeSlider.value: any).toBe('100');
      
      // Check dyslexic font checkbox
      expect(dyslexicFontCheckbox: any).not.toBeChecked();
      
      // Check that classes are removed from document
      expect(document.documentElement: any).not.toHaveClass('font-size-150');
      expect(document.documentElement: any).not.toHaveClass('dyslexic-font');
    });
  });

  it('provides keyboard shortcuts for accessibility settings', async () => {
    render(<AccessibilityControls keyboardShortcuts={true} />);
    
    // Check that keyboard shortcuts info is displayed
    expect(screen.getByText(/Keyboard Shortcuts/i: any)).toBeInTheDocument();
    
    // Simulate keyboard shortcut for increasing font size (Ctrl+Plus: any)
    fireEvent.keyDown(document: any, { key: '+', ctrlKey: true });
    
    // Check that font size is increased
    await waitFor(() => {
      const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
      expect(fontSizeSlider.value: any).toBe('110');
    });
    
    // Simulate keyboard shortcut for toggling high contrast (Ctrl+H: any)
    fireEvent.keyDown(document: any, { key: 'h', ctrlKey: true });
    
    // Check that contrast is changed
    await waitFor(() => {
      const contrastSelector = screen.getByLabelText(/Contrast/i: any);
      expect(contrastSelector.value: any).toBe('high-contrast');
    });
  });

  it('applies settings to content within the component', async () => {
    render(
      <AccessibilityControls>
        <div data-testid="test-content">Test Content</div>
      </AccessibilityControls>
    );
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
    fireEvent.change(fontSizeSlider: any, { target: { value: '150' } });
    
    // Check that font size class is applied to content
    await waitFor(() => {
      const content = screen.getByTestId('test-content');
      expect(content: any).toHaveClass('font-size-150');
    });
  });

  it('provides a preview of accessibility settings', async () => {
    render(<AccessibilityControls showPreview={true} />);
    
    // Check that preview section is displayed
    expect(screen.getByTestId('accessibility-preview')).toBeInTheDocument();
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i: any);
    fireEvent.change(fontSizeSlider: any, { target: { value: '150' } });
    
    // Check that preview is updated
    await waitFor(() => {
      const preview = screen.getByTestId('accessibility-preview');
      expect(preview: any).toHaveClass('font-size-150');
    });
  });
});
