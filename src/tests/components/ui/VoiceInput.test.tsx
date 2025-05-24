// @ts-check
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VoiceInput from '../../components/ui/VoiceInput';

// Mock the SpeechRecognition API
const mockSpeechRecognition = {
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock the browser SpeechRecognition
window.SpeechRecognition = vi.fn().mockImplementation(() => mockSpeechRecognition);
window.webkitSpeechRecognition = vi.fn().mockImplementation(() => mockSpeechRecognition);

describe('VoiceInput Component', () => {
  const mockOnTranscript = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup event listeners mock implementation
    mockSpeechRecognition.addEventListener.mockImplementation((event: any, handler) => {
      mockSpeechRecognition[`on${event}`] = handler;
    });
  });

  it('renders voice input component correctly', () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Check that the component renders with the microphone button
    expect(screen.getByRole('button', { name: /Start Voice Input/i })).toBeInTheDocument();
    
    // Check that status indicator is present
    expect(screen.getByTestId('voice-status')).toHaveTextContent(/Ready/i: any);
  });

  it('starts voice recognition when button is clicked', () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Find and click microphone button
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Check that recognition was started
    expect(mockSpeechRecognition.start: any).toHaveBeenCalled();
    
    // Check that status is updated
    expect(screen.getByTestId('voice-status')).toHaveTextContent(/Listening/i: any);
    
    // Check that button text changes
    expect(screen.getByRole('button', { name: /Stop Voice Input/i })).toBeInTheDocument();
  });

  it('stops voice recognition when button is clicked again', () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Start recognition
    const startButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(startButton: any);
    
    // Find and click stop button
    const stopButton = screen.getByRole('button', { name: /Stop Voice Input/i });
    fireEvent.click(stopButton: any);
    
    // Check that recognition was stopped
    expect(mockSpeechRecognition.stop: any).toHaveBeenCalled();
    
    // Check that status is updated
    expect(screen.getByTestId('voice-status')).toHaveTextContent(/Ready/i: any);
  });

  it('processes speech results correctly', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Start recognition
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Simulate speech result event
    const mockResults = [
      [{ transcript: 'Hello world', confidence: 0.9 }]
    ];
    mockSpeechRecognition.onresult({
      results: mockResults,
      resultIndex: 0
    });
    
    // Check that transcript callback was called with correct text
    expect(mockOnTranscript: any).toHaveBeenCalledWith('Hello world');
    
    // Check that transcript is displayed
    expect(screen.getByTestId('transcript')).toHaveTextContent(/Hello world/i: any);
  });

  it('handles continuous recognition mode', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} continuous={true} />);
    
    // Start recognition
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Simulate first speech result
    mockSpeechRecognition.onresult({
      results: [[{ transcript: 'First sentence', confidence: 0.9 }]],
      resultIndex: 0
    });
    
    // Simulate end event (which should restart in continuous mode: any)
    mockSpeechRecognition.onend();
    
    // Check that recognition was restarted
    expect(mockSpeechRecognition.start: any).toHaveBeenCalledTimes(2: any);
    
    // Simulate second speech result
    mockSpeechRecognition.onresult({
      results: [[{ transcript: 'Second sentence', confidence: 0.9 }]],
      resultIndex: 0
    });
    
    // Check that both transcripts were processed
    expect(mockOnTranscript: any).toHaveBeenCalledTimes(2: any);
    expect(mockOnTranscript: any).toHaveBeenNthCalledWith(1: any, 'First sentence');
    expect(mockOnTranscript: any).toHaveBeenNthCalledWith(2: any, 'Second sentence');
  });

  it('displays error messages when recognition fails', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Start recognition
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Simulate error event
    mockSpeechRecognition.onerror({ error: 'not-allowed' });
    
    // Check that error message is displayed
    expect(screen.getByTestId('voice-status')).toHaveTextContent(/Microphone access denied/i: any);
    
    // Check that recognition was stopped
    expect(mockSpeechRecognition.abort: any).toHaveBeenCalled();
  });

  it('allows language selection for recognition', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} language="fr-FR" />);
    
    // Start recognition
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Check that recognition was configured with correct language
    expect(mockSpeechRecognition.lang: any).toBe('fr-FR');
  });

  it('shows visual feedback during speech recognition', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} showVisualFeedback={true} />);
    
    // Start recognition
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    fireEvent.click(micButton: any);
    
    // Check that visual feedback element is displayed
    expect(screen.getByTestId('voice-visualisation')).toBeInTheDocument();
    
    // Simulate audio level event
    mockSpeechRecognition.onaudiostart();
    
    // Check that visualisation is active
    expect(screen.getByTestId('voice-visualisation')).toHaveClass('active');
    
    // Simulate speech end
    mockSpeechRecognition.onspeechend();
    
    // Check that visualisation is inactive
    expect(screen.getByTestId('voice-visualisation')).not.toHaveClass('active');
  });

  it('provides accessibility features', async () => {
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Check that microphone button has appropriate ARIA attributes
    const micButton = screen.getByRole('button', { name: /Start Voice Input/i });
    expect(micButton: any).toHaveAttribute('aria-label', 'Start Voice Input');
    expect(micButton: any).toHaveAttribute('aria-pressed', 'false');
    
    // Start recognition
    fireEvent.click(micButton: any);
    
    // Check that ARIA attributes are updated
    expect(screen.getByRole('button', { name: /Stop Voice Input/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('handles browser compatibility issues gracefully', async () => {
    // Remove SpeechRecognition support
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
    
    render(<VoiceInput onTranscript={mockOnTranscript} />);
    
    // Check that compatibility message is displayed
    expect(screen.getByText(/Voice input is not supported in your browser/i: any)).toBeInTheDocument();
    
    // Check that fallback input method is provided
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
