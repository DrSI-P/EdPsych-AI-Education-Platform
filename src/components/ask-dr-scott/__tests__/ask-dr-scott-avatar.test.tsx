import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AskDrScottAvatar } from '../ask-dr-scott-avatar';

// Mock fetch
global.fetch = jest.fn();

// Mock the AIAvatarVideoPlayer component
jest.mock('@/components/ai-avatar/ai-avatar-video-player', () => ({
  AIAvatarVideoPlayer: jest.fn().mockImplementation(({ videoId }) => (
    <div data-testid="mock-video-player">
      Mock Video Player (ID: {videoId})
    </div>
  ))
}));

describe('AskDrScottAvatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful session creation
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/heygen/streaming/new')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            session_id: 'test-session-123',
            status: 'created'
          })
        });
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });
  });
  
  it('renders loading state initially', () => {
    render(<AskDrScottAvatar />);
    expect(screen.getByText(/Ask Dr. Scott/i)).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
  
  it('initializes a session on mount', async () => {
    render(<AskDrScottAvatar />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/heygen/streaming/new', expect.any(Object));
    });
  });
  
  it('displays the initial message', async () => {
    render(<AskDrScottAvatar initialMessage="Test initial message" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test initial message')).toBeInTheDocument();
    });
  });
  
  it('allows sending a message', async () => {
    // Mock message response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/message')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            text: 'This is a response from Dr. Scott',
            sessionId: 'test-session-123'
          })
        });
      }
      
      if (url.includes('/api/heygen/streaming/new')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            session_id: 'test-session-123',
            status: 'created'
          })
        });
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });
    
    render(<AskDrScottAvatar />);
    
    // Wait for component to initialize
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
    
    // Type a message
    const input = screen.getByPlaceholderText(/Type your question/i);
    fireEvent.change(input, { target: { value: 'Test question' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check that the message was sent
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/message'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Test question')
        })
      );
    });
    
    // Check that the response is displayed
    await waitFor(() => {
      expect(screen.getByText('This is a response from Dr. Scott')).toBeInTheDocument();
    });
  });
  
  it('handles session initialization errors', async () => {
    // Mock failed session creation
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          error: 'Failed to initialize avatar session'
        })
      })
    );
    
    render(<AskDrScottAvatar />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error Loading Avatar/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed to initialize avatar session/i)).toBeInTheDocument();
    });
  });
  
  it('closes the session on unmount', async () => {
    const { unmount } = render(<AskDrScottAvatar />);
    
    // Wait for session to be created
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/heygen/streaming/new', expect.any(Object));
    });
    
    // Reset mock to check for close call
    (global.fetch as jest.Mock).mockClear();
    
    // Unmount component
    unmount();
    
    // Check that close was called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/close'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
});