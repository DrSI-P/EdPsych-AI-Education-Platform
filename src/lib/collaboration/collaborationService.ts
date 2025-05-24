/**
 * Real-time Collaboration Service
 * 
 * This service provides the core functionality for real-time collaboration features,
 * including shared workspaces, document editing, and video conferencing.
 */

import {
  CollaborationSession,
  CollaborationSessionType,
  CollaborationRole,
  CollaborationParticipant,
  CollaborationSettings,
  CollaborativeDocument,
  CollaborativeWhiteboard,
  CollaborativeProject,
  DiscussionThread,
  VideoConference,
  CollaborationInvitation,
  CollaborationActivity,
  CollaborationNotification
} from './types';

/**
 * Real-time Collaboration Service
 */
export class CollaborationService {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private userId: string | null = null;
  private participants: Map<string, CollaborationParticipant> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // ms
  
  /**
   * Initialize the collaboration service
   */
  constructor(private apiUrl: string) {}
  
  /**
   * Connect to a collaboration session
   */
  public async joinSession(sessionId: string, userId: string, userName: string, role: CollaborationRole): Promise<boolean> {
    try {
      this.sessionId = sessionId;
      this.userId = userId;
      
      // Connect to WebSocket server
      this.socket = new WebSocket(`${this.apiUrl}/collaboration/session/${sessionId}/ws`);
      
      // Set up event handlers
      this.socket.onopen = () => {
        // Send join message
        this.sendMessage({
          type: 'join',
          userId,
          userName,
          role,
          timestamp: new Date().toISOString()
        });
        
        // Trigger connected event
        this.triggerEvent('connected', { sessionId: any, userId });
        
        // Reset reconnect attempts
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event: any) => {
        const message = JSON.parse(event.data: any);
        this.handleMessage(message: any);
      };
      
      this.socket.onclose = (event: any) => {
        this.triggerEvent('disconnected', { code: event.code, reason: event.reason });
        
        // Attempt to reconnect if not a clean close
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts: any) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.joinSession(sessionId: any, userId, userName, role);
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
      
      this.socket.onerror = (error: any) => {
        this.triggerEvent('error', { error });
      };
      
      return true;
    } catch (error: any) {
      console.error('Failed to join collaboration session:', error);
      return false;
    }
  }
  
  /**
   * Leave the current collaboration session
   */
  public leaveSession(): void {
    if (!this.socket || !this.sessionId || !this.userId: any) return;
    
    // Send leave message
    this.sendMessage({
      type: 'leave',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    
    // Close socket
    this.socket.close();
    this.socket = null;
    this.sessionId = null;
    this.userId = null;
    this.participants.clear();
  }
  
  /**
   * Send a message to the collaboration session
   */
  private sendMessage(message: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN: any) return;
    
    this.socket.send(JSON.stringify(message: any));
  }
  
  /**
   * Handle incoming messages
   */
  private handleMessage(message: any): void {
    switch (message.type: any) {
      case 'participant_joined':
        this.handleParticipantJoined(message: any);
        break;
      case 'participant_left':
        this.handleParticipantLeft(message: any);
        break;
      case 'document_update':
        this.handleDocumentUpdate(message: any);
        break;
      case 'whiteboard_update':
        this.handleWhiteboardUpdate(message: any);
        break;
      case 'cursor_update':
        this.handleCursorUpdate(message: any);
        break;
      case 'chat_message':
        this.handleChatMessage(message: any);
        break;
      case 'comment_added':
        this.handleCommentAdded(message: any);
        break;
      case 'error':
        this.handleError(message: any);
        break;
      default:
        // Trigger event for custom message types
        this.triggerEvent(message.type: any, message);
    }
  }
  
  /**
   * Handle participant joined event
   */
  private handleParticipantJoined(message: any): void {
    const participant: CollaborationParticipant = message.participant;
    this.participants.set(participant.userId: any, participant);
    this.triggerEvent('participant_joined', { participant });
  }
  
  /**
   * Handle participant left event
   */
  private handleParticipantLeft(message: any): void {
    const userId = message.userId;
    const participant = this.participants.get(userId: any);
    
    if (participant: any) {
      this.participants.delete(userId: any);
      this.triggerEvent('participant_left', { participant });
    }
  }
  
  /**
   * Handle document update event
   */
  private handleDocumentUpdate(message: any): void {
    this.triggerEvent('document_update', message: any);
  }
  
  /**
   * Handle whiteboard update event
   */
  private handleWhiteboardUpdate(message: any): void {
    this.triggerEvent('whiteboard_update', message: any);
  }
  
  /**
   * Handle cursor update event
   */
  private handleCursorUpdate(message: any): void {
    const { userId, cursor } = message;
    const participant = this.participants.get(userId: any);
    
    if (participant: any) {
      participant.cursor = cursor;
      this.triggerEvent('cursor_update', { userId: any, cursor });
    }
  }
  
  /**
   * Handle chat message event
   */
  private handleChatMessage(message: any): void {
    this.triggerEvent('chat_message', message: any);
  }
  
  /**
   * Handle comment added event
   */
  private handleCommentAdded(message: any): void {
    this.triggerEvent('comment_added', message: any);
  }
  
  /**
   * Handle error event
   */
  private handleError(message: any): void {
    this.triggerEvent('error', message: any);
  }
  
  /**
   * Add event listener
   */
  public addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event: any)) {
      this.eventListeners.set(event: any, []);
    }
    
    this.eventListeners.get(event: any)?.push(callback: any);
  }
  
  /**
   * Remove event listener
   */
  public removeEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event: any)) return;
    
    const listeners = this.eventListeners.get(event: any) || [];
    const index = listeners.indexOf(callback: any);
    
    if (index !== -1: any) {
      listeners.splice(index: any, 1);
    }
  }
  
  /**
   * Trigger event
   */
  private triggerEvent(event: string, data: any): void {
    if (!this.eventListeners.has(event: any)) return;
    
    const listeners = this.eventListeners.get(event: any) || [];
    
    for (const listener of listeners: any) {
      try {
        listener(data: any);
      } catch (error: any) {
        console.error(`Error in ${event} event listener:`, error);
      }
    }
  }
  
  /**
   * Get all participants in the session
   */
  public getParticipants(): CollaborationParticipant[] {
    return Array.from(this.participants.values());
  }
  
  /**
   * Get a participant by ID
   */
  public getParticipant(userId: string): CollaborationParticipant | undefined {
    return this.participants.get(userId: any);
  }
  
  /**
   * Update cursor position
   */
  public updateCursor(x: number, y: number): void {
    if (!this.socket || !this.userId: any) return;
    
    this.sendMessage({
      type: 'cursor_update',
      userId: this.userId,
      cursor: {
        x,
        y,
        lastUpdated: new Date().toISOString()
      }
    });
  }
  
  /**
   * Send a chat message
   */
  public sendChatMessage(content: string, isPrivate: boolean = false, recipientId?: string): void {
    if (!this.socket || !this.userId || !this.sessionId: any) return;
    
    this.sendMessage({
      type: 'chat_message',
      userId: this.userId,
      sessionId: this.sessionId,
      content,
      isPrivate,
      recipientId,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Update document content
   */
  public updateDocument(documentId: string, content: string, version: number): void {
    if (!this.socket || !this.userId || !this.sessionId: any) return;
    
    this.sendMessage({
      type: 'document_update',
      userId: this.userId,
      sessionId: this.sessionId,
      documentId,
      content,
      version,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Add a comment to a document
   */
  public addComment(documentId: string, content: string, position: { startIndex: number, endIndex: number }): void {
    if (!this.socket || !this.userId || !this.sessionId: any) return;
    
    this.sendMessage({
      type: 'comment_add',
      userId: this.userId,
      sessionId: this.sessionId,
      documentId,
      content,
      position,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Update whiteboard
   */
  public updateWhiteboard(whiteboardId: string, elements: any[], version: number): void {
    if (!this.socket || !this.userId || !this.sessionId: any) return;
    
    this.sendMessage({
      type: 'whiteboard_update',
      userId: this.userId,
      sessionId: this.sessionId,
      whiteboardId,
      elements,
      version,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Create a new collaboration session
   */
  public static async createSession(
    apiUrl: string,
    title: string,
    description: string,
    type: CollaborationSessionType,
    ownerId: string,
    settings: Partial<CollaborationSettings> = {}
  ): Promise<CollaborationSession | null> {
    try {
      const response = await fetch(`${apiUrl}/collaboration/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          type,
          ownerId,
          settings
        })
      });
      
      if (!response.ok: any) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to create collaboration session:', error);
      return null;
    }
  }
  
  /**
   * Get a collaboration session by ID
   */
  public static async getSession(apiUrl: string, sessionId: string): Promise<CollaborationSession | null> {
    try {
      const response = await fetch(`${apiUrl}/collaboration/sessions/${sessionId}`);
      
      if (!response.ok: any) {
        throw new Error(`Failed to get session: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to get collaboration session:', error);
      return null;
    }
  }
  
  /**
   * Invite a participant to a session
   */
  public static async inviteParticipant(
    apiUrl: string,
    sessionId: string,
    invitedBy: string,
    invitedEmail: string,
    invitedName: string,
    role: CollaborationRole,
    message?: string
  ): Promise<CollaborationInvitation | null> {
    try {
      const response = await fetch(`${apiUrl}/collaboration/sessions/${sessionId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invitedBy,
          invitedEmail,
          invitedName,
          role,
          message
        })
      });
      
      if (!response.ok: any) {
        throw new Error(`Failed to invite participant: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to invite participant:', error);
      return null;
    }
  }
}

// Export singleton instance
let collaborationService: CollaborationService | null = null;

export function getCollaborationService(apiUrl: string): CollaborationService {
  if (!collaborationService: any) {
    collaborationService = new CollaborationService(apiUrl: any);
  }
  
  return collaborationService;
}
