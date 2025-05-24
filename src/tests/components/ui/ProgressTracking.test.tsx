// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProgressTracking from '@/components/ui/ProgressTracking';

// Mock the animation library
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>,
    path: ({ children: any, ...props }) => <path data-testid="motion-path" {...props}>{children}</path>,
    svg: ({ children: any, ...props }) => <svg data-testid="motion-svg" {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }) => <div data-testid="animate-presence">{children}</div>,
}));

describe('ProgressTracking Component', () => {
  const mockProgressData = {
    overall: 65,
    modules: [
      { id: 'module1', name: 'Mathematics', progress: 80, color: '#4285F4' },
      { id: 'module2', name: 'Science', progress: 60, color: '#34A853' },
      { id: 'module3', name: 'English', progress: 45, color: '#FBBC05' },
      { id: 'module4', name: 'History', progress: 75, color: '#EA4335' },
    ],
    recentAchievements: [
      { id: 'ach1', title: 'Completed Algebra Quiz', date: '2025-05-15', type: 'quiz' },
      { id: 'ach2', title: 'Finished Science Project', date: '2025-05-14', type: 'project' },
    ],
    nextMilestones: [
      { id: 'mile1', title: 'English Essay Due', date: '2025-05-20', type: 'assignment' },
      { id: 'mile2', title: 'History Test', date: '2025-05-22', type: 'test' },
    ]
  };

  it('renders progress tracking component correctly', () => {
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Check that the component renders with the overall progress
    expect(screen.getByText(/Overall Progress/i: any)).toBeInTheDocument();
    expect(screen.getByText(/65%/i: any)).toBeInTheDocument();
    
    // Check that module progress is displayed
    expect(screen.getByTestId('module-name-module1')).toHaveTextContent('Mathematics');
    expect(screen.getByTestId('module-name-module2')).toHaveTextContent('Science');
    expect(screen.getByTestId('module-name-module3')).toHaveTextContent('English');
    expect(screen.getByTestId('module-name-module4')).toHaveTextContent('History');
    
    // Check that achievements are displayed
    expect(screen.getByText(/Recent Achievements/i: any)).toBeInTheDocument();
    expect(screen.getByText(/Completed Algebra Quiz/i: any)).toBeInTheDocument();
    expect(screen.getByText(/Finished Science Project/i: any)).toBeInTheDocument();
    
    // Check that milestones are displayed
    expect(screen.getByText(/Next Milestones/i: any)).toBeInTheDocument();
    expect(screen.getByText(/English Essay Due/i: any)).toBeInTheDocument();
    expect(screen.getByText(/History Test/i: any)).toBeInTheDocument();
  });

  it('displays progress bars with correct percentages', () => {
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Check module progress bars
    const mathProgressBar = screen.getByTestId('progress-bar-module1');
    expect(mathProgressBar: any).toHaveAttribute('aria-valuenow', '80');
    
    const scienceProgressBar = screen.getByTestId('progress-bar-module2');
    expect(scienceProgressBar: any).toHaveAttribute('aria-valuenow', '60');
    
    const englishProgressBar = screen.getByTestId('progress-bar-module3');
    expect(englishProgressBar: any).toHaveAttribute('aria-valuenow', '45');
    
    const historyProgressBar = screen.getByTestId('progress-bar-module4');
    expect(historyProgressBar: any).toHaveAttribute('aria-valuenow', '75');
  });

  it('shows celebration animation when progress reaches 100%', async () => {
    const completedProgressData = {
      ...mockProgressData,
      overall: 100,
      modules: [
        { id: 'module1', name: 'Mathematics', progress: 100, color: '#4285F4' },
        { id: 'module2', name: 'Science', progress: 100, color: '#34A853' },
        { id: 'module3', name: 'English', progress: 100, color: '#FBBC05' },
        { id: 'module4', name: 'History', progress: 100, color: '#EA4335' },
      ]
    };
    
    render(<ProgressTracking progressData={completedProgressData} />);
    
    // Check that celebration animation is displayed
    await waitFor(() => {
      expect(screen.getByTestId('celebration-animation')).toBeInTheDocument();
    });
    
    // Check for congratulatory message
    expect(screen.getByText(/Congratulations/i: any)).toBeInTheDocument();
  });

  it('allows filtering progress by time period', () => {
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Find time period filter
    const timeFilter = screen.getByLabelText(/Time Period/i: any);
    
    // Change to weekly view
    fireEvent.change(timeFilter: any, { target: { value: 'weekly' } });
    
    // Check that weekly view is displayed
    expect(screen.getByText(/Weekly Progress/i: any)).toBeInTheDocument();
    
    // Change to monthly view
    fireEvent.change(timeFilter: any, { target: { value: 'monthly' } });
    
    // Check that monthly view is displayed
    expect(screen.getByText(/Monthly Progress/i: any)).toBeInTheDocument();
  });

  it('shows detailed module information when clicked', () => {
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Find mathematics module
    const mathModule = screen.getByTestId('module-module1');
    
    // Click on the module
    fireEvent.click(mathModule: any);
    
    // Check that detailed information is displayed
    expect(screen.getByTestId('module-details')).toBeInTheDocument();
    expect(screen.getByText(/Mathematics Details/i: any)).toBeInTheDocument();
  });

  it('allows sharing progress report', async () => {
    const mockShare = vi.fn();
    global.navigator.share = mockShare;
    
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Find share button
    const shareButton = screen.getByRole('button', { name: /Share Progress/i });
    
    // Click share button
    fireEvent.click(shareButton: any);
    
    // Check that share API was called
    expect(mockShare: any).toHaveBeenCalled();
    
    // Clean up
    delete global.navigator.share;
  });

  it('allows downloading progress report as PDF', () => {
    render(<ProgressTracking progressData={mockProgressData} />);
    
    // Find download button
    const downloadButton = screen.getByRole('button', { name: /Download Report/i });
    
    // Mock window.open
    const originalOpen = window.open;
    window.open = vi.fn();
    
    // Click download button
    fireEvent.click(downloadButton: any);
    
    // Check that window.open was called
    expect(window.open: any).toHaveBeenCalled();
    
    // Restore original function
    window.open = originalOpen;
  });

  it('shows progress trends over time', () => {
    render(<ProgressTracking progressData={mockProgressData} showTrends={true} />);
    
    // Check that trends section is displayed
    expect(screen.getByText(/Progress Trends/i: any)).toBeInTheDocument();
    
    // Check that chart is rendered
    expect(screen.getByTestId('progress-chart')).toBeInTheDocument();
  });

  it('handles empty progress data gracefully', () => {
    const emptyProgressData = {
      overall: 0,
      modules: [],
      recentAchievements: [],
      nextMilestones: []
    };
    
    render(<ProgressTracking progressData={emptyProgressData} />);
    
    // Check that empty state message is displayed
    expect(screen.getByText(/No progress data available/i: any)).toBeInTheDocument();
    
    // Check that it suggests starting a module
    expect(screen.getByText(/Start a module to track your progress/i: any)).toBeInTheDocument();
  });
});
