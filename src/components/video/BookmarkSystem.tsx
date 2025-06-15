"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark, Folder, X, Edit, Trash, Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

export interface VideoBookmark {
  id: string;
  videoId: string;
  userId: string;
  timeCode: number; // in seconds
  title: string;
  notes?: string;
  category?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BookmarkCategory {
  id: string;
  userId: string;
  name: string;
  color?: string;
  icon?: string;
}

interface BookmarkSystemProps {
  videoId: string;
  userId: string;
  currentTime: number;
  duration: number;
  onAddBookmark: (timeCode: number, title: string, notes?: string, category?: string) => Promise<VideoBookmark>;
  onUpdateBookmark: (bookmark: VideoBookmark) => Promise<VideoBookmark>;
  onDeleteBookmark: (bookmarkId: string) => Promise<boolean>;
  onSeekToBookmark: (timeCode: number) => void;
  bookmarks?: VideoBookmark[];
  categories?: BookmarkCategory[];
  className?: string;
}

const BookmarkSystem: React.FC<BookmarkSystemProps> = ({
  videoId,
  userId,
  currentTime,
  duration,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark,
  onSeekToBookmark,
  bookmarks = [],
  categories = [],
  className = ''
}) => {
  // State
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<VideoBookmark | null>(null);
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [newBookmarkNotes, setNewBookmarkNotes] = useState('');
  const [newBookmarkCategory, setNewBookmarkCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookmarks, setFilteredBookmarks] = useState<VideoBookmark[]>(bookmarks);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'time' | 'name' | 'category'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isExpanded, setIsExpanded] = useState(false);

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Filter and sort bookmarks
  useEffect(() => {
    let filtered = [...bookmarks];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.title.toLowerCase().includes(term) || 
        (bookmark.notes && bookmark.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(bookmark => bookmark.category === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOrder) {
        case 'time':
          comparison = a.timeCode - b.timeCode;
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          const catA = a.category || '';
          const catB = b.category || '';
          comparison = catA.localeCompare(catB);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, selectedCategory, sortOrder, sortDirection]);

  // Handle adding a new bookmark
  const handleAddBookmark = async () => {
    if (!newBookmarkTitle.trim()) {
      // Set a default title if none provided
      setNewBookmarkTitle(`Bookmark at ${formatTime(currentTime)}`);
    }
    
    try {
      await onAddBookmark(
        currentTime,
        newBookmarkTitle.trim() || `Bookmark at ${formatTime(currentTime)}`,
        newBookmarkNotes.trim() || undefined,
        newBookmarkCategory
      );
      
      // Reset form
      setNewBookmarkTitle('');
      setNewBookmarkNotes('');
      setNewBookmarkCategory(undefined);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      // Handle error (could show an error message to the user)
    }
  };

  // Handle updating a bookmark
  const handleUpdateBookmark = async () => {
    if (!selectedBookmark) return;
    
    try {
      const updatedBookmark: VideoBookmark = {
        ...selectedBookmark,
        title: newBookmarkTitle.trim() || selectedBookmark.title,
        notes: newBookmarkNotes.trim() || selectedBookmark.notes,
        category: newBookmarkCategory,
        updatedAt: new Date()
      };
      
      await onUpdateBookmark(updatedBookmark);
      
      // Reset form
      setSelectedBookmark(null);
      setNewBookmarkTitle('');
      setNewBookmarkNotes('');
      setNewBookmarkCategory(undefined);
      setShowEditDialog(false);
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      // Handle error
    }
  };

  // Handle deleting a bookmark
  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await onDeleteBookmark(bookmarkId);
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
      // Handle error
    }
  };

  // Open edit dialog for a bookmark
  const openEditDialog = (bookmark: VideoBookmark) => {
    setSelectedBookmark(bookmark);
    setNewBookmarkTitle(bookmark.title);
    setNewBookmarkNotes(bookmark.notes || '');
    setNewBookmarkCategory(bookmark.category);
    setShowEditDialog(true);
  };

  // Toggle sort order
  const toggleSort = (order: 'time' | 'name' | 'category') => {
    if (sortOrder === order) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder(order);
      setSortDirection('asc');
    }
  };

  // Get category color
  const getCategoryColor = (categoryId?: string): string => {
    if (!categoryId) return 'bg-gray-200';
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-200';
  };

  // Get category name
  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  // Render bookmark timeline indicators
  const renderBookmarkIndicators = (): void => {
    return bookmarks.map(bookmark => {
      const position = (bookmark.timeCode / duration) * 100;
      return (
        <div 
          key={bookmark.id}
          className={`absolute w-1 h-4 ${getCategoryColor(bookmark.category)} hover:h-5 transition-all cursor-pointer`}
          style={{ left: `${position}%`, bottom: '0' }}
          onClick={() => onSeekToBookmark(bookmark.timeCode)}
          title={`${bookmark.title} (${formatTime(bookmark.timeCode)})`}
        />
      );
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center">
          <Bookmark className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">Video Bookmarks</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse bookmark panel" : "Expand bookmark panel"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setShowAddDialog(true)}
            aria-label="Add bookmark"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Search and Filter Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm flex items-center"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <Folder className="h-4 w-4 mr-1" />
                  <span>{selectedCategory ? getCategoryName(selectedCategory) : 'All Categories'}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg">
                    <ul className="py-1">
                      <li>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            setSelectedCategory(null);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          All Categories
                        </button>
                      </li>
                      {categories.map(category => (
                        <li key={category.id}>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowCategoryDropdown(false);
                            }}
                          >
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
                              {category.name}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 text-xs text-gray-500">
            <button 
              className="flex items-center hover:text-gray-700"
              onClick={() => toggleSort('time')}
            >
              Time
              {sortOrder === 'time' && (
                sortDirection === 'asc' ? 
                <ChevronUp className="h-3 w-3 ml-1" /> : 
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button 
              className="flex items-center hover:text-gray-700"
              onClick={() => toggleSort('name')}
            >
              Title
              {sortOrder === 'name' && (
                sortDirection === 'asc' ? 
                <ChevronUp className="h-3 w-3 ml-1" /> : 
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button 
              className="flex items-center hover:text-gray-700"
              onClick={() => toggleSort('category')}
            >
              Category
              {sortOrder === 'category' && (
                sortDirection === 'asc' ? 
                <ChevronUp className="h-3 w-3 ml-1" /> : 
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>

          {/* Bookmark List */}
          <div className="overflow-y-auto max-h-64">
            {filteredBookmarks.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No bookmarks found. Add your first bookmark by clicking the + button.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredBookmarks.map(bookmark => (
                  <li key={bookmark.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-grow cursor-pointer"
                        onClick={() => onSeekToBookmark(bookmark.timeCode)}
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(bookmark.category)} mr-2`} />
                          <span className="font-medium text-gray-800">{bookmark.title}</span>
                          <span className="ml-2 text-xs text-gray-500">{formatTime(bookmark.timeCode)}</span>
                        </div>
                        {bookmark.notes && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{bookmark.notes}</p>
                        )}
                        {bookmark.category && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {getCategoryName(bookmark.category)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => openEditDialog(bookmark)}
                          aria-label="Edit bookmark"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          aria-label="Delete bookmark"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Timeline View (always visible) */}
      <div className="p-3 border-t border-gray-200">
        <div className="relative h-4 bg-gray-200 rounded">
          <div className="absolute inset-0 flex items-center justify-between px-1">
            <span className="text-xs text-gray-500">0:00</span>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
          {renderBookmarkIndicators()}
          <div 
            className="absolute w-1 h-full bg-red-500"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Add Bookmark Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Add Bookmark</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="text-gray-800 font-medium">
                  {formatTime(currentTime)}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="bookmark-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="bookmark-title"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Bookmark at ${formatTime(currentTime)}`}
                  value={newBookmarkTitle}
                  onChange={(e: any) => setNewBookmarkTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="bookmark-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="bookmark-notes"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add notes about this bookmark..."
                  value={newBookmarkNotes}
                  onChange={(e: any) => setNewBookmarkNotes(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="bookmark-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category (optional)
                </label>
                <select
                  id="bookmark-category"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBookmarkCategory || ''}
                  onChange={(e: any) => setNewBookmarkCategory(e.target.value || undefined)}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleAddBookmark}
                >
                  Add Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bookmark Dialog */}
      {showEditDialog && selectedBookmark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Edit Bookmark</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowEditDialog(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="text-gray-800 font-medium">
                  {formatTime(selectedBookmark.timeCode)}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="edit-bookmark-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="edit-bookmark-title"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBookmarkTitle}
                  onChange={(e: any) => setNewBookmarkTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-bookmark-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="edit-bookmark-notes"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add notes about this bookmark..."
                  value={newBookmarkNotes}
                  onChange={(e: any) => setNewBookmarkNotes(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-bookmark-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category (optional)
                </label>
                <select
                  id="edit-bookmark-category"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBookmarkCategory || ''}
                  onChange={(e: any) => setNewBookmarkCategory(e.target.value || undefined)}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleUpdateBookmark}
                >
                  Update Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkSystem;