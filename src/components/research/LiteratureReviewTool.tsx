'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  Star, 
  StarOff,
  Edit,
  Download,
  Folder
} from 'lucide-react';

interface LiteratureReviewToolProps {
  userId?: string;
  userRole: 'student' | 'instructor' | 'researcher' | 'admin';
  className?: string;
}

interface Source {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  journal?: string;
  abstract?: string;
  tags: string[];
  collections: string[];
  starred: boolean;
  dateAdded: number;
}

interface Collection {
  id: string;
  name: string;
  sources: string[]; // Source IDs
}

const LiteratureReviewTool: React.FC<LiteratureReviewToolProps> = ({
  userId,
  userRole,
  className = '',
}) => {
  // State
  const [sources, setSources] = useState<Source[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock sources
        const mockSources: Source[] = [
          {
            id: 'source-1',
            title: 'The Impact of Artificial Intelligence on Educational Outcomes: A Meta-Analysis',
            authors: ['Johnson, A.', 'Smith, B.', 'Williams, C.'],
            publicationYear: 2023,
            journal: 'Journal of Educational Technology',
            abstract: 'This meta-analysis examines the impact of artificial intelligence tools on educational outcomes across K-12 and higher education settings.',
            tags: ['AI', 'meta-analysis', 'educational outcomes'],
            collections: ['collection-1'],
            starred: true,
            dateAdded: Date.now() - 20 * 24 * 60 * 60 * 1000
          },
          {
            id: 'source-2',
            title: 'Personalized Learning Pathways: A Framework for Adaptive Educational Systems',
            authors: ['Garcia, D.', 'Chen, E.'],
            publicationYear: 2022,
            journal: 'Educational Psychology Review',
            abstract: 'This paper presents a comprehensive framework for designing adaptive educational systems.',
            tags: ['personalized learning', 'adaptive systems', 'framework'],
            collections: ['collection-1', 'collection-2'],
            starred: false,
            dateAdded: Date.now() - 25 * 24 * 60 * 60 * 1000
          }
        ];
        
        // Mock collections
        const mockCollections: Collection[] = [
          {
            id: 'collection-1',
            name: 'AI in Education',
            sources: ['source-1', 'source-2']
          },
          {
            id: 'collection-2',
            name: 'Learning Design Principles',
            sources: ['source-2']
          }
        ];
        
        setSources(mockSources);
        setCollections(mockCollections);
        setSelectedSource(mockSources[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching literature review data:', err);
        setError('Failed to load literature review data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, userRole]);
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Filter sources
  const filteredSources = sources.filter(source => {
    // Filter by search query
    const matchesSearch = 
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by collection
    const matchesCollection = !selectedCollection || 
      source.collections.includes(selectedCollection);
    
    return matchesSearch && matchesCollection;
  });
  
  // Toggle star on a source
  const toggleStar = (sourceId: string) => {
    setSources(prev => 
      prev.map(source => 
        source.id === sourceId 
          ? { ...source, starred: !source.starred } 
          : source
      )
    );
    
    if (selectedSource?.id === sourceId) {
      setSelectedSource(prev => 
        prev ? { ...prev, starred: !prev.starred } : null
      );
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Literature Review Tool</h2>
          <div className="animate-pulse h-4 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-pulse h-64 bg-gray-800 rounded"></div>
          <div className="animate-pulse h-64 bg-gray-800 rounded md:col-span-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0 flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-purple-400" />
          Literature Review Tool
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-800 text-white rounded pl-10 pr-4 py-2 text-sm w-full"
              placeholder="Search literature..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Add Source Button */}
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Source</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Collections</h3>
          
          <div className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                selectedCollection === null 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCollection(null)}
            >
              All Sources ({sources.length})
            </button>
            
            {collections.map(collection => (
              <button
                key={collection.id}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedCollection === collection.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <div className="flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  <span>{collection.name}</span>
                  <span className="ml-auto text-xs">
                    {collection.sources.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Source List */}
        <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              {selectedCollection 
                ? collections.find(c => c.id === selectedCollection)?.name 
                : 'All Sources'}
            </h3>
            
            <div className="flex items-center space-x-2">
              <button
                className="text-gray-400 hover:text-white p-1"
              >
                <Calendar className="h-4 w-4" />
              </button>
              
              <button
                className="text-gray-400 hover:text-white p-1"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {filteredSources.length > 0 ? (
            <div className="space-y-3">
              {filteredSources.map(source => (
                <div 
                  key={source.id} 
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSource?.id === source.id 
                      ? 'bg-gray-700 border-l-4 border-purple-500' 
                      : 'bg-gray-750 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedSource(source)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-white font-medium">{source.title}</h4>
                        {source.starred && (
                          <Star className="h-4 w-4 text-yellow-400 ml-2 fill-current" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {source.authors.join(', ')} ({source.publicationYear})
                      </div>
                      {source.journal && (
                        <div className="text-gray-500 text-xs mt-1 italic">
                          {source.journal}
                        </div>
                      )}
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        toggleStar(source.id);
                      }}
                    >
                      {source.starred ? (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {source.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {source.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No sources found</p>
              <button
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCollection(null);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Source Details */}
        {selectedSource ? (
          <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-white">{selectedSource.title}</h3>
                  <button 
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => toggleStar(selectedSource.id)}
                  >
                    {selectedSource.starred ? (
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="text-gray-300 mt-1">
                  {selectedSource.authors.join(', ')} ({selectedSource.publicationYear})
                </div>
                {selectedSource.journal && (
                  <div className="text-gray-400 text-sm mt-1 italic">
                    {selectedSource.journal}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Download className="h-4 w-4" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Source Content */}
            <div className="space-y-4">
              {selectedSource.abstract && (
                <div>
                  <h4 className="text-white font-medium mb-2">Abstract</h4>
                  <p className="text-gray-300 text-sm">{selectedSource.abstract}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-white font-medium mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-400">Added</div>
                    <div className="text-white">{formatDate(selectedSource.dateAdded)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Publication Year</div>
                    <div className="text-white">{selectedSource.publicationYear}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Collections</h4>
                <div className="space-y-1">
                  {selectedSource.collections.length > 0 ? (
                    selectedSource.collections.map(collectionId => {
                      const collection = collections.find(c => c.id === collectionId);
                      return collection ? (
                        <div key={collectionId} className="flex items-center text-sm">
                          <Folder className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="text-white">{collection.name}</span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="text-gray-400 text-sm">Not in any collection</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Select a source to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiteratureReviewTool;