// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeygenVideoLibrary } from '@/components/heygen/heygen-video-library';

// Mock the heygen service
vi.mock('@/lib/heygen/heygen-service', () => ({
  getVideos: vi.fn().mockResolvedValue([
    { 
      id: 'video1', 
      title: 'Introduction to Mathematics',
      thumbnail: 'https://example.com/thumb1.jpg',
      url: 'https://example.com/video1.mp4',
      created_at: '2025-05-15T10:30:00Z',
      avatar: { name: 'Teacher Emma' },
      duration: 120
    },
    { 
      id: 'video2', 
      title: 'Science Lesson',
      thumbnail: 'https://example.com/thumb2.jpg',
      url: 'https://example.com/video2.mp4',
      created_at: '2025-05-16T14:45:00Z',
      avatar: { name: 'Professor James' },
      duration: 180
    }
  ]),
  deleteVideo: vi.fn().mockResolvedValue({ success: true })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => {
      return store[key] || null;
    }),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.open
const originalOpen = window.open;
window.open = vi.fn();

// Mock navigator.share
const mockShare = vi.fn().mockResolvedValue({});
global.navigator.share = mockShare;

describe('HeygenVideoLibrary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up localStorage mock for saved videos
    localStorageMock.getItem.mockReturnValue(JSON.stringify([
      { 
        id: 'saved1', 
        title: 'Saved Video 1',
        thumbnail: 'https://example.com/saved1.jpg',
        url: 'https://example.com/saved1.mp4',
        created_at: '2025-05-10T09:15:00Z',
        avatar: { name: 'Teacher Emma' },
        duration: 90
      }
    ]));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders video library component correctly', async () => {
    render(<HeygenVideoLibrary />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/AI Avatar Video Library/i)).toBeInTheDocument();
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Science Lesson/i)).toBeInTheDocument();
    
    // Check that saved videos are displayed
    expect(screen.getByText(/Saved Video 1/i)).toBeInTheDocument();
  });

  it('loads videos on mount', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    render(<HeygenVideoLibrary />);
    
    // Check that video service was called
    expect(heygenService.getVideos).toHaveBeenCalled();
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Science Lesson/i)).toBeInTheDocument();
  });

  it('plays video when clicked', async () => {
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find and click on a video
    const videoCard = screen.getByText(/Introduction to Mathematics/i).closest('div');
    fireEvent.click(videoCard);
    
    // Check that video player is displayed
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('video-player')).toHaveAttribute('src', 'https://example.com/video1.mp4');
    
    // Check that video details are displayed
    expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
    expect(screen.getByText(/2 minutes/i)).toBeInTheDocument();
  });

  it('allows filtering videos by search term', async () => {
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Science Lesson/i)).toBeInTheDocument();
    
    // Find search input
    const searchInput = screen.getByPlaceholderText(/Search videos/i);
    
    // Search for "Science"
    fireEvent.change(searchInput, { target: { value: 'Science' } });
    
    // Check that only matching videos are displayed
    await waitFor(() => {
      expect(screen.queryByText(/Introduction to Mathematics/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Science Lesson/i)).toBeInTheDocument();
  });

  it('allows sorting videos by different criteria', async () => {
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Science Lesson/i)).toBeInTheDocument();
    
    // Find sort selector
    const sortSelector = screen.getByLabelText(/Sort by/i);
    
    // Sort by newest first (default)
    const videoCards = screen.getAllByTestId('video-card');
    expect(videoCards[0]).toHaveTextContent(/Science Lesson/i);
    
    // Sort by oldest first
    fireEvent.change(sortSelector, { target: { value: 'oldest' } });
    
    // Check that order is reversed
    await waitFor(() => {
      const updatedCards = screen.getAllByTestId('video-card');
      expect(updatedCards[0]).toHaveTextContent(/Introduction to Mathematics/i);
    });
    
    // Sort by title
    fireEvent.change(sortSelector, { target: { value: 'title' } });
    
    // Check that videos are sorted alphabetically
    await waitFor(() => {
      const sortedCards = screen.getAllByTestId('video-card');
      expect(sortedCards[0]).toHaveTextContent(/Introduction to Mathematics/i);
    });
  });

  it('allows deleting videos', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find and click delete button for a video
    const deleteButtons = screen.getAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);
    
    // Check for confirmation dialogue
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete this video/i)).toBeInTheDocument();
    });
    
    // Confirm deletion
    const confirmButton = screen.getByText(/Confirm/i);
    fireEvent.click(confirmButton);
    
    // Check that delete service was called
    await waitFor(() => {
      expect(heygenService.deleteVideo).toHaveBeenCalled();
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Video deleted successfully/i)).toBeInTheDocument();
    });
  });

  it('allows downloading videos', async () => {
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find and click download button for a video
    const downloadButtons = screen.getAllByText(/Download/i);
    fireEvent.click(downloadButtons[0]);
    
    // Check that window.open was called
    expect(window.open).toHaveBeenCalled();
  });

  it('allows sharing videos', async () => {
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Introduction to Mathematics/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find and click share button for a video
    const shareButtons = screen.getAllByText(/Share/i);
    fireEvent.click(shareButtons[0]);
    
    // Check that share API was called
    expect(mockShare).toHaveBeenCalled();
  });

  it('displays empty state when no videos are available', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    heygenService.getVideos.mockResolvedValueOnce([]);
    
    // Clear localStorage mock
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]));
    
    render(<HeygenVideoLibrary />);
    
    // Check that empty state is displayed
    await waitFor(() => {
      expect(screen.getByText(/No videos found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Create your first AI avatar video/i)).toBeInTheDocument();
    
    // Check that create button is displayed
    expect(screen.getByText(/Create Video/i)).toBeInTheDocument();
  });

  it('handles pagination for large video collections', async () => {
    // Mock a large collection of videos
    const heygenService = await import('@/lib/heygen/heygen-service');
    const manyVideos = Array(20).fill(0).map((_, i) => ({
      id: `video${i}`,
      title: `Video ${i}`,
      thumbnail: `https://example.com/thumb${i}.jpg`,
      url: `https://example.com/video${i}.mp4`,
      created_at: `2025-05-${15 + i}T10:30:00Z`,
      avatar: { name: i % 2 === 0 ? 'Teacher Emma' : 'Professor James' },
      duration: 120 + i
    }));
    heygenService.getVideos.mockResolvedValueOnce(manyVideos);
    
    render(<HeygenVideoLibrary />);
    
    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText(/Video 0/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check that pagination controls are displayed
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
    
    // Check that only the first page of videos is displayed
    expect(screen.getByText(/Video 0/i)).toBeInTheDocument();
    expect(screen.queryByText(/Video 15/i)).not.toBeInTheDocument();
    
    // Go to next page
    fireEvent.click(screen.getByText(/Next/i));
    
    // Check that second page of videos is displayed
    await waitFor(() => {
      expect(screen.queryByText(/Video 0/i)).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Video 15/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
