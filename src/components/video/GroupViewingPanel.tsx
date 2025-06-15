'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Hand, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Settings,
  BarChart,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Clock,
  AlertCircle,
  Info,
  User,
  Crown,
  Share2
} from 'lucide-react';
import { 
  GroupViewingSession, 
  GroupViewingParticipant,
  GroupViewingMessage,
  GroupViewingMessageType,
  PlaybackControlAction,
  ReactionType,
  getActiveGroupViewingSessions
} from '@/lib/group-viewing-service';

interface GroupViewingPanelProps {
  videoId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlaybackControl: (action: PlaybackControlAction, value?: number) => void;
  courseId?: string;
  groupId?: string;
  className?: string;
}

const GroupViewingPanel: React.FC<GroupViewingPanelProps> = ({
  videoId,
  userId,
  userName,
  userRole,
  currentTime,
  duration,
  isPlaying,
  onPlaybackControl,
  courseId,
  groupId,
  className = '',
}) => {
  // State
  const [sessions, setSessions] = useState<GroupViewingSession[]>([]);
  const [activeSession, setActiveSession] = useState<GroupViewingSession | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'chat' | 'participants' | 'polls' | null>('chat');
  const [hasRequestedControl, setHasRequestedControl] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        
        const fetchedSessions = await getActiveGroupViewingSessions(videoId);
        
        setSessions(fetchedSessions);
        
        // If there's only one session, set it as active
        if (fetchedSessions.length === 1) {
          setActiveSession(fetchedSessions[0]);
          
          // Simulate joining the session
          console.log(`Joining session: ${fetchedSessions[0].id}`);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching group viewing sessions:', err);
        setError('Failed to load group viewing sessions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, [videoId]);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && activeSession) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeSession?.messages.length]);
  
  // Create a new session
  const createSession = (): void => {
    if (!newSessionName.trim()) return;
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll just simulate it
      
      const now = Date.now();
      const newSession: GroupViewingSession = {
        id: `session_${now}_${Math.random().toString(36).substring(2, 9)}`,
        name: newSessionName,
        videoId,
        hostId: userId,
        hostName: userName,
        hostRole: userRole,
        status: 'active',
        startTime: now,
        participants: [
          {
            userId,
            userName,
            userRole,
            joinTime: now,
            isActive: true,
            hasControl: true,
            raisedHand: false,
            lastActivity: now
          }
        ],
        messages: [
          {
            id: `msg_${now}_${Math.random().toString(36).substring(2, 9)}`,
            sessionId: `session_${now}`,
            userId: 'system',
            userName: 'System',
            userRole: 'admin',
            type: GroupViewingMessageType.SYSTEM,
            content: `${userName} created the session`,
            timestamp: now,
            reactions: {}
          }
        ],
        settings: {
          allowParticipantControl: userRole === 'instructor',
          allowChat: true,
          allowReactions: true,
          allowQuestions: true,
          allowPolls: userRole === 'instructor',
          allowAnonymousPolls: userRole === 'instructor',
          requireHandRaise: userRole === 'instructor',
          autoAcceptHandRaise: userRole !== 'instructor',
          showParticipantCursors: true,
          showParticipantNames: true,
          recordSession: userRole === 'instructor',
          waitingRoom: userRole === 'instructor'
        },
        polls: [],
        courseId,
        groupId,
        description: newSessionDescription
      };
      
      setSessions(prev => [...prev, newSession]);
      setActiveSession(newSession);
      setIsCreatingSession(false);
      setNewSessionName('');
      setNewSessionDescription('');
      
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session');
    }
  };
  
  // Join a session
  const joinSession = (session: GroupViewingSession) => {
    setActiveSession(session);
  };
  
  // Leave a session
  const leaveSession = (): void => {
    setActiveSession(null);
  };
  
  // Send a chat message
  const sendChatMessage = (): void => {
    if (!activeSession || !newChatMessage.trim()) return;
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll just simulate it
      
      const now = Date.now();
      
      const newMessage: GroupViewingMessage = {
        id: `msg_${now}_${Math.random().toString(36).substring(2, 9)}`,
        sessionId: activeSession.id,
        userId,
        userName,
        userRole,
        type: GroupViewingMessageType.CHAT,
        content: newChatMessage,
        timestamp: now,
        timeCode: currentTime,
        reactions: {}
      };
      
      const updatedSession = {
        ...activeSession,
        messages: [...activeSession.messages, newMessage]
      };
      
      // Update sessions
      setSessions(prev => 
        prev.map(s => s.id === activeSession.id ? updatedSession : s)
      );
      setActiveSession(updatedSession);
      setNewChatMessage('');
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };
  
  // Send a playback control action
  const sendPlaybackControl = (action: PlaybackControlAction, value?: number) => {
    if (!activeSession) return;
    
    // Call the onPlaybackControl callback to actually control the video
    onPlaybackControl(action, value);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Render loading state
  if (isLoading && sessions.length === 0) {
    return (
      <div className={`bg-gray-900 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Group Viewing</h3>
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
            <Users className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Group Viewing</h3>
          </div>
          {!activeSession ? (
            <button
              className="p-1 bg-blue-600 rounded text-white hover:bg-blue-500"
              onClick={() => setIsCreatingSession(true)}
              aria-label="Create session"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <button
              className="p-1 bg-red-600 rounded text-white hover:bg-red-500"
              onClick={leaveSession}
              aria-label="Leave session"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-2 m-2 rounded">
          {error}
        </div>
      )}
      
      {/* Session Selection or Creation */}
      {!activeSession && !isCreatingSession && (
        <div className="p-3">
          <h4 className="text-white font-medium mb-2">Available Sessions</h4>
          
          {sessions.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active sessions for this video.</p>
              <button
                className="mt-2 px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-500"
                onClick={() => setIsCreatingSession(true)}
              >
                Create a session
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => joinSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">{session.name}</h5>
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="h-3 w-3 mr-1" />
                        <span>Host: {session.hostName}</span>
                        {session.hostRole === 'instructor' && (
                          <span className="ml-1 bg-blue-600/20 text-blue-400 px-1 rounded text-xs">Instructor</span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{session.participants.filter(p => p.isActive).length} participants</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Started {new Date(session.startTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  {session.description && (
                    <p className="text-gray-300 text-sm mt-2">{session.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Create Session Form */}
      {isCreatingSession && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Create Session</h4>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsCreatingSession(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-300 text-sm mb-1">Session Name</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white rounded p-2 text-sm"
              placeholder="Enter session name..."
              value={newSessionName}
              onChange={(e: any) => setNewSessionName(e.target.value)}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-300 text-sm mb-1">Description (optional)</label>
            <textarea
              className="w-full bg-gray-800 text-white rounded p-2 text-sm"
              rows={3}
              placeholder="Enter session description..."
              value={newSessionDescription}
              onChange={(e: any) => setNewSessionDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => setIsCreatingSession(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
              onClick={createSession}
              disabled={!newSessionName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      )}
      
      {/* Active Session */}
      {activeSession && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-medium">{activeSession.name}</h4>
              <div className="flex items-center text-gray-400 text-xs">
                <User className="h-3 w-3 mr-1" />
                <span>Host: {activeSession.hostName}</span>
                {activeSession.hostRole === 'instructor' && (
                  <span className="ml-1 bg-blue-600/20 text-blue-400 px-1 rounded text-xs">Instructor</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`p-1 rounded ${isPlaying ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
                onClick={() => sendPlaybackControl(isPlaying ? PlaybackControlAction.PAUSE : PlaybackControlAction.PLAY)}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                className="p-1 bg-gray-700 text-white rounded"
                onClick={() => sendPlaybackControl(PlaybackControlAction.SEEK, Math.max(0, currentTime - 10))}
                aria-label="Skip backward"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                className="p-1 bg-gray-700 text-white rounded"
                onClick={() => sendPlaybackControl(PlaybackControlAction.SEEK, Math.min(duration, currentTime + 10))}
                aria-label="Skip forward"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-3">
            <button
              className={`px-3 py-1 text-sm ${
                expandedSection === 'chat' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setExpandedSection('chat')}
            >
              Chat
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                expandedSection === 'participants' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setExpandedSection('participants')}
            >
              Participants
            </button>
          </div>
          
          {/* Chat Section */}
          {expandedSection === 'chat' && (
            <>
              <div 
                ref={chatContainerRef}
                className="h-60 overflow-y-auto mb-3 space-y-2"
              >
                {activeSession.messages.map(message => (
                  <div 
                    key={message.id}
                    className={`p-2 rounded ${
                      message.type === GroupViewingMessageType.SYSTEM 
                        ? 'bg-gray-800/50' 
                        : message.userId === userId 
                          ? 'bg-blue-600/20' 
                          : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-white text-xs font-medium">{message.userName}</span>
                        {message.userRole === 'instructor' && (
                          <span className="ml-1 bg-blue-600/20 text-blue-400 px-1 rounded text-xs">Instructor</span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        {message.timeCode !== undefined && (
                          <button
                            className="hover:text-white mr-2"
                            onClick={() => sendPlaybackControl(PlaybackControlAction.SEEK, message.timeCode)}
                          >
                            {formatTime(message.timeCode)}
                          </button>
                        )}
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <p className="text-white text-sm mt-1">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 text-white rounded-l px-2 py-1 text-sm"
                  placeholder="Type a message..."
                  value={newChatMessage}
                  onChange={(e: any) => setNewChatMessage(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-r px-2 py-1"
                  onClick={sendChatMessage}
                  disabled={!newChatMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
          
          {/* Participants Section */}
          {expandedSection === 'participants' && (
            <div className="space-y-2">
              {activeSession.participants
                .filter(p => p.isActive)
                .map(participant => (
                  <div 
                    key={participant.userId}
                    className="bg-gray-800 rounded p-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full ${participant.isActive ? 'bg-green-500' : 'bg-gray-500'} mr-2`}></div>
                      <span className="text-white text-sm">{participant.userName}</span>
                      {participant.userRole === 'instructor' && (
                        <span className="ml-1 bg-blue-600/20 text-blue-400 px-1 rounded text-xs">Instructor</span>
                      )}
                      {participant.userId === activeSession.hostId && (
                        <span className="ml-1 text-yellow-400 flex items-center">
                          <Crown className="h-3 w-3 mr-1" />
                          <span className="text-xs">Host</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {participant.hasControl && (
                        <span className="text-blue-400 text-xs flex items-center">
                          <Settings className="h-3 w-3 mr-1" />
                          <span>Control</span>
                        </span>
                      )}
                      {participant.raisedHand && (
                        <span className="text-yellow-400 text-xs flex items-center">
                          <Hand className="h-3 w-3 mr-1" />
                          <span>Hand Raised</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupViewingPanel;