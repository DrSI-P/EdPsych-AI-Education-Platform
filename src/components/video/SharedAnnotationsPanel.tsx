'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Edit, 
  Trash2, 
  ThumbsUp, 
  Share2, 
  Plus,
  Filter,
  Tag,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  MoreHorizontal,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Users
} from 'lucide-react';
import { 
  Annotation, 
  AnnotationType, 
  AnnotationVisibility,
  AnnotationFilter,
  getVideoAnnotations
} from '@/lib/shared-annotation-service';

interface SharedAnnotationsPanelProps {
  videoId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onPause: () => void;
  groupId?: string;
  courseId?: string;
  className?: string;
}

const SharedAnnotationsPanel: React.FC<SharedAnnotationsPanelProps> = ({
  videoId,
  userId,
  userName,
  userRole,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onPause,
  groupId,
  courseId,
  className = '',
}) => {
  // State
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([]);
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isCreatingAnnotation, setIsCreatingAnnotation] = useState(false);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [newAnnotationType, setNewAnnotationType] = useState<AnnotationType>(AnnotationType.NOTE);
  const [newAnnotationVisibility, setNewAnnotationVisibility] = useState<AnnotationVisibility>(AnnotationVisibility.COURSE);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Partial<AnnotationFilter>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAnnotations, setExpandedAnnotations] = useState<Record<string, boolean>>({});
  
  const annotationListRef = useRef<HTMLDivElement>(null);
  
  // Fetch annotations
  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        setIsLoading(true);
        
        const fetchedAnnotations = await getVideoAnnotations(videoId, userId, {
          groupId,
          courseId
        });
        
        setAnnotations(fetchedAnnotations);
        setError(null);
      } catch (err) {
        console.error('Error fetching annotations:', err);
        setError('Failed to load annotations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnotations();
  }, [videoId, userId, groupId, courseId]);
  
  // Apply filters
  useEffect(() => {
    let result = [...annotations];
    
    if (filter.type) {
      result = result.filter(a => a.type === filter.type);
    }
    
    if (filter.visibility) {
      result = result.filter(a => a.visibility === filter.visibility);
    }
    
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter(a => 
        a.content.toLowerCase().includes(searchLower) ||
        a.replies.some(r => r.content.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.userId) {
      result = result.filter(a => a.userId === filter.userId);
    }
    
    setFilteredAnnotations(result);
  }, [annotations, filter]);
  
  // Determine visible annotations based on current time
  useEffect(() => {
    // Show annotations within 5 seconds of current time
    const timeWindow = 5;
    const visible = filteredAnnotations.filter(
      a => Math.abs(a.timeCode - currentTime) <= timeWindow
    );
    
    setVisibleAnnotations(visible);
    
    // Auto-expand new visible annotations
    const newExpanded = { ...expandedAnnotations };
    visible.forEach(a => {
      if (newExpanded[a.id] === undefined) {
        newExpanded[a.id] = true;
      }
    });
    setExpandedAnnotations(newExpanded);
    
  }, [filteredAnnotations, currentTime, expandedAnnotations]);
  
  // Create a new annotation
  const createAnnotation = async () => {
    if (!newAnnotationContent.trim()) return;
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll just update the local state
      
      const now = Date.now();
      const newAnnotation: Annotation = {
        id: `ann_${now}_${Math.random().toString(36).substring(2, 9)}`,
        videoId,
        userId,
        userName,
        userRole,
        timeCode: currentTime,
        type: newAnnotationType,
        content: newAnnotationContent,
        visibility: newAnnotationVisibility,
        groupId: newAnnotationVisibility === AnnotationVisibility.GROUP ? groupId : undefined,
        courseId: newAnnotationVisibility === AnnotationVisibility.COURSE ? courseId : undefined,
        created: now,
        updated: now,
        likes: 0,
        replies: [],
        tags: []
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setNewAnnotationContent('');
      setIsCreatingAnnotation(false);
      
      // Auto-expand the new annotation
      setExpandedAnnotations(prev => ({
        ...prev,
        [newAnnotation.id]: true
      }));
      
      // Select the new annotation
      setSelectedAnnotation(newAnnotation);
      
    } catch (err) {
      console.error('Error creating annotation:', err);
      setError('Failed to create annotation');
    }
  };
  
  // Add a reply to an annotation
  const addReply = async (annotationId: string) => {
    if (!newReplyContent.trim()) return;
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll just update the local state
      
      const now = Date.now();
      const reply = {
        id: `reply_${now}_${Math.random().toString(36).substring(2, 9)}`,
        annotationId,
        userId,
        userName,
        userRole,
        content: newReplyContent,
        created: now,
        updated: now,
        likes: 0
      };
      
      setAnnotations(prev => prev.map(a => {
        if (a.id === annotationId) {
          return {
            ...a,
            replies: [...a.replies, reply],
            updated: now
          };
        }
        return a;
      }));
      
      setNewReplyContent('');
      
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply');
    }
  };
  
  // Like an annotation
  const likeAnnotation = async (annotationId: string) => {
    try {
      // In a real implementation, this would call an API
      // For now, we'll just update the local state
      
      setAnnotations(prev => prev.map(a => {
        if (a.id === annotationId) {
          return {
            ...a,
            likes: a.likes + 1
          };
        }
        return a;
      }));
      
    } catch (err) {
      console.error('Error liking annotation:', err);
      setError('Failed to like annotation');
    }
  };
  
  // Delete an annotation
  const deleteAnnotation = async (annotationId: string) => {
    try {
      // In a real implementation, this would call an API
      // For now, we'll just update the local state
      
      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
      
      if (selectedAnnotation?.id === annotationId) {
        setSelectedAnnotation(null);
      }
      
    } catch (err) {
      console.error('Error deleting annotation:', err);
      setError('Failed to delete annotation');
    }
  };
  
  // Toggle annotation expansion
  const toggleAnnotationExpansion = (annotationId: string) => {
    setExpandedAnnotations(prev => ({
      ...prev,
      [annotationId]: !prev[annotationId]
    }));
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Get icon for annotation type
  const getAnnotationTypeIcon = (type: AnnotationType) => {
    switch (type) {
      case AnnotationType.NOTE:
        return <MessageSquare className="h-4 w-4" />;
      case AnnotationType.QUESTION:
        return <AlertCircle className="h-4 w-4" />;
      case AnnotationType.INSIGHT:
        return <Lightbulb className="h-4 w-4" />;
      case AnnotationType.REFERENCE:
        return <BookOpen className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  // Get color for annotation type
  const getAnnotationTypeColor = (type: AnnotationType) => {
    switch (type) {
      case AnnotationType.NOTE:
        return 'text-blue-500';
      case AnnotationType.QUESTION:
        return 'text-yellow-500';
      case AnnotationType.INSIGHT:
        return 'text-green-500';
      case AnnotationType.REFERENCE:
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };
  
  // Get icon for annotation visibility
  const getAnnotationVisibilityIcon = (visibility: AnnotationVisibility) => {
    switch (visibility) {
      case AnnotationVisibility.PRIVATE:
        return <EyeOff className="h-4 w-4" />;
      case AnnotationVisibility.GROUP:
        return <Users className="h-4 w-4" />;
      case AnnotationVisibility.COURSE:
        return <BookOpen className="h-4 w-4" />;
      case AnnotationVisibility.PUBLIC:
        return <Eye className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };
  
  // Get label for annotation visibility
  const getAnnotationVisibilityLabel = (visibility: AnnotationVisibility) => {
    switch (visibility) {
      case AnnotationVisibility.PRIVATE:
        return 'Only Me';
      case AnnotationVisibility.GROUP:
        return 'Group';
      case AnnotationVisibility.COURSE:
        return 'Course';
      case AnnotationVisibility.PUBLIC:
        return 'Public';
      default:
        return 'Unknown';
    }
  };
  
  // Render loading state
  if (isLoading && annotations.length === 0) {
    return (
      <div className={`bg-gray-900 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Shared Annotations</h3>
          <div className="animate-pulse h-2 w-24 bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="animate-pulse h-20 bg-gray-800 rounded"></div>
          <div className="animate-pulse h-20 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Shared Annotations</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 text-gray-400 hover:text-white"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Filter annotations"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              className="p-1 bg-blue-600 rounded text-white hover:bg-blue-500"
              onClick={() => {
                if (isPlaying) {
                  onPause();
                }
                setIsCreatingAnnotation(true);
              }}
              aria-label="Create annotation"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-2 p-2 bg-gray-700 rounded">
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                className={`px-2 py-1 text-xs rounded ${
                  !filter.type ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}
                onClick={() => setFilter(prev => ({ ...prev, type: undefined }))}
              >
                All Types
              </button>
              {Object.values(AnnotationType).map(type => (
                <button
                  key={type}
                  className={`px-2 py-1 text-xs rounded flex items-center ${
                    filter.type === type ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => setFilter(prev => ({ ...prev, type }))}
                >
                  <span className={getAnnotationTypeColor(type)}>
                    {getAnnotationTypeIcon(type)}
                  </span>
                  <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}s</span>
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-2 py-1 text-xs rounded ${
                  !filter.visibility ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}
                onClick={() => setFilter(prev => ({ ...prev, visibility: undefined }))}
              >
                All Visibility
              </button>
              {Object.values(AnnotationVisibility).map(visibility => (
                <button
                  key={visibility}
                  className={`px-2 py-1 text-xs rounded flex items-center ${
                    filter.visibility === visibility ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => setFilter(prev => ({ ...prev, visibility }))}
                >
                  {getAnnotationVisibilityIcon(visibility)}
                  <span className="ml-1">{getAnnotationVisibilityLabel(visibility)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Annotation List */}
      <div 
        ref={annotationListRef}
        className="p-3 h-80 overflow-y-auto"
      >
        {error && (
          <div className="text-red-500 mb-3">
            {error}
          </div>
        )}
        
        {visibleAnnotations.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            {filteredAnnotations.length === 0 ? (
              <>
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No annotations for this video yet.</p>
                <button
                  className="mt-2 px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-500"
                  onClick={() => {
                    if (isPlaying) {
                      onPause();
                    }
                    setIsCreatingAnnotation(true);
                  }}
                >
                  Create the first annotation
                </button>
              </>
            ) : (
              <>
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No annotations at this time.</p>
                <p className="text-sm mt-1">
                  There are {filteredAnnotations.length} annotations in other parts of the video.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAnnotations.map(annotation => (
              <div 
                key={annotation.id}
                className={`bg-gray-800 rounded-lg overflow-hidden ${
                  selectedAnnotation?.id === annotation.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Annotation Header */}
                <div 
                  className="p-2 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleAnnotationExpansion(annotation.id)}
                >
                  <div className="flex items-center">
                    <div className={`mr-2 ${getAnnotationTypeColor(annotation.type)}`}>
                      {getAnnotationTypeIcon(annotation.type)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-sm">{annotation.userName}</span>
                        <span className="text-gray-400 text-xs ml-2">
                          {annotation.userRole === 'instructor' && (
                            <span className="bg-blue-600/20 text-blue-400 px-1 rounded">Instructor</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <button
                          className="hover:text-white"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onSeek(annotation.timeCode);
                          }}
                        >
                          {formatTime(annotation.timeCode)}
                        </button>
                        <span className="mx-1">•</span>
                        <span>{new Date(annotation.created).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-400 mr-2">
                      {getAnnotationVisibilityIcon(annotation.visibility)}
                    </div>
                    {expandedAnnotations[annotation.id] ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Annotation Content */}
                {expandedAnnotations[annotation.id] && (
                  <div className="px-3 pb-3">
                    <p className="text-white mb-2">{annotation.content}</p>
                    
                    {/* Tags */}
                    {annotation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {annotation.tags.map(tag => (
                          <span 
                            key={tag}
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded flex items-center"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          className="flex items-center text-gray-400 hover:text-white text-xs"
                          onClick={() => likeAnnotation(annotation.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{annotation.likes}</span>
                        </button>
                        <button
                          className="flex items-center text-gray-400 hover:text-white text-xs"
                          onClick={() => {
                            setSelectedAnnotation(annotation);
                            setNewReplyContent('');
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>{annotation.replies.length}</span>
                        </button>
                        {annotation.userId === userId && (
                          <button
                            className="flex items-center text-gray-400 hover:text-red-500 text-xs"
                            onClick={() => deleteAnnotation(annotation.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                      <button
                        className="flex items-center text-gray-400 hover:text-white text-xs"
                        onClick={() => {
                          // In a real implementation, this would copy a link to the annotation
                          console.log(`Share annotation: ${annotation.id}`);
                        }}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {selectedAnnotation?.id === annotation.id && (
                      <div className="mt-3 border-t border-gray-700 pt-2">
                        {annotation.replies.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {annotation.replies.map(reply => (
                              <div key={reply.id} className="bg-gray-700 rounded p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="text-white text-xs font-medium">{reply.userName}</span>
                                    <span className="text-gray-400 text-xs ml-2">
                                      {reply.userRole === 'instructor' && (
                                        <span className="bg-blue-600/20 text-blue-400 px-1 rounded">Instructor</span>
                                      )}
                                    </span>
                                  </div>
                                  <span className="text-gray-400 text-xs">
                                    {new Date(reply.created).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-white text-sm mt-1">{reply.content}</p>
                                <div className="flex items-center mt-1">
                                  <button
                                    className="flex items-center text-gray-400 hover:text-white text-xs"
                                    onClick={() => {
                                      // In a real implementation, this would call an API
                                      console.log(`Like reply: ${reply.id}`);
                                    }}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Reply Form */}
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="flex-1 bg-gray-700 text-white rounded-l px-2 py-1 text-sm"
                            placeholder="Add a reply..."
                            value={newReplyContent}
                            onChange={(e: any) => setNewReplyContent(e.target.value)}
                            onKeyDown={(e: any) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addReply(annotation.id);
                              }
                            }}
                          />
                          <button
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-r px-2 py-1"
                            onClick={() => addReply(annotation.id)}
                            disabled={!newReplyContent.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Annotation Form */}
      {isCreatingAnnotation && (
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Create Annotation</h4>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsCreatingAnnotation(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-2">
            <textarea
              className="w-full bg-gray-800 text-white rounded p-2 text-sm"
              rows={3}
              placeholder="Add your annotation..."
              value={newAnnotationContent}
              onChange={(e: any) => setNewAnnotationContent(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <select
                className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                value={newAnnotationType}
                onChange={(e: any) => setNewAnnotationType(e.target.value as AnnotationType)}
              >
                {Object.values(AnnotationType).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                value={newAnnotationVisibility}
                onChange={(e: any) => setNewAnnotationVisibility(e.target.value as AnnotationVisibility)}
              >
                {Object.values(AnnotationVisibility).map(visibility => (
                  <option key={visibility} value={visibility}>
                    {getAnnotationVisibilityLabel(visibility)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                onClick={() => setIsCreatingAnnotation(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
                onClick={createAnnotation}
                disabled={!newAnnotationContent.trim()}
              >
                Create
              </button>
            </div>
          </div>
          
          <div className="text-gray-400 text-xs">
            Creating annotation at {formatTime(currentTime)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedAnnotationsPanel;