/**
 * Group Viewing Service
 * 
 * This service manages group viewing sessions for educational videos,
 * allowing multiple users to watch videos together with synchronized
 * playback, shared controls, and real-time communication.
 */

// Types of messages that can be sent in a group viewing session
export enum GroupViewingMessageType {
  CHAT = 'chat',                 // Regular chat message
  SYSTEM = 'system',             // System notification
  PLAYBACK_CONTROL = 'control',  // Playback control action
  REACTION = 'reaction',         // Emoji reaction
  QUESTION = 'question',         // Question for the group
  POLL = 'poll',                 // Poll for the group
  POLL_RESPONSE = 'poll_response' // Response to a poll
}

// Types of playback control actions
export enum PlaybackControlAction {
  PLAY = 'play',
  PAUSE = 'pause',
  SEEK = 'seek',
  SPEED = 'speed'
}

// Types of reactions
export enum ReactionType {
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
  CLAP = 'clap',
  HEART = 'heart',
  LAUGH = 'laugh',
  CONFUSED = 'confused',
  LIGHTBULB = 'lightbulb'
}

// Structure for a group viewing session
export interface GroupViewingSession {
  id: string;
  name: string;
  videoId: string;
  hostId: string;
  hostName: string;
  hostRole: 'student' | 'instructor' | 'admin';
  status: 'scheduled' | 'active' | 'ended';
  startTime: number;
  endTime?: number;
  participants: GroupViewingParticipant[];
  messages: GroupViewingMessage[];
  settings: GroupViewingSettings;
  polls: GroupViewingPoll[];
  courseId?: string;
  groupId?: string;
  description?: string;
  tags?: string[];
}

// Structure for a participant in a group viewing session
export interface GroupViewingParticipant {
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  joinTime: number;
  leaveTime?: number;
  isActive: boolean;
  hasControl: boolean;
  raisedHand: boolean;
  lastActivity: number;
  lastPosition?: number;
}

// Structure for a message in a group viewing session
export interface GroupViewingMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  type: GroupViewingMessageType;
  content: string;
  timestamp: number;
  timeCode?: number;
  replyTo?: string;
  reactions: {
    [key in ReactionType]?: string[]; // Array of userIds
  };
  data?: unknown; // Additional data specific to message type
}

// Structure for a poll in a group viewing session
export interface GroupViewingPoll {
  id: string;
  sessionId: string;
  creatorId: string;
  question: string;
  options: string[];
  created: number;
  expires?: number;
  isAnonymous: boolean;
  isMultiSelect: boolean;
  responses: {
    userId: string;
    userName: string;
    selectedOptions: number[];
    timestamp: number;
  }[];
}

// Settings for a group viewing session
export interface GroupViewingSettings {
  allowParticipantControl: boolean;
  allowChat: boolean;
  allowReactions: boolean;
  allowQuestions: boolean;
  allowPolls: boolean;
  allowAnonymousPolls: boolean;
  requireHandRaise: boolean;
  autoAcceptHandRaise: boolean;
  showParticipantCursors: boolean;
  showParticipantNames: boolean;
  recordSession: boolean;
  maxParticipants?: number;
  accessCode?: string;
  waitingRoom: boolean;
}

// Filter options for retrieving sessions
export interface SessionFilter {
  hostId?: string;
  participantId?: string;
  videoId?: string;
  status?: 'scheduled' | 'active' | 'ended';
  courseId?: string;
  groupId?: string;
  startAfter?: number;
  startBefore?: number;
  searchText?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Service for managing group viewing sessions
 */
export class GroupViewingService {
  private sessions: GroupViewingSession[] = [];
  
  /**
   * Create a new group viewing session
   */
  public createSession(
    name: string,
    videoId: string,
    hostId: string,
    hostName: string,
    hostRole: 'student' | 'instructor' | 'admin',
    settings: Partial<GroupViewingSettings> = {},
    options?: {
      courseId?: string;
      groupId?: string;
      description?: string;
      tags?: string[];
      scheduledStartTime?: number;
    }
  ): GroupViewingSession {
    const now = Date.now();
    
    // Default settings
    const defaultSettings: GroupViewingSettings = {
      allowParticipantControl: hostRole === 'instructor',
      allowChat: true,
      allowReactions: true,
      allowQuestions: true,
      allowPolls: hostRole === 'instructor',
      allowAnonymousPolls: hostRole === 'instructor',
      requireHandRaise: hostRole === 'instructor',
      autoAcceptHandRaise: hostRole !== 'instructor',
      showParticipantCursors: true,
      showParticipantNames: true,
      recordSession: hostRole === 'instructor',
      waitingRoom: hostRole === 'instructor'
    };
    
    const session: GroupViewingSession = {
      id: `session_${now}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      videoId,
      hostId,
      hostName,
      hostRole,
      status: options?.scheduledStartTime && options.scheduledStartTime > now ? 'scheduled' : 'active',
      startTime: options?.scheduledStartTime || now,
      participants: [
        {
          userId: hostId,
          userName: hostName,
          userRole: hostRole,
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
          content: `${hostName} created the session`,
          timestamp: now,
          reactions: {}
        }
      ],
      settings: {
        ...defaultSettings,
        ...settings
      },
      polls: [],
      courseId: options?.courseId,
      groupId: options?.groupId,
      description: options?.description,
      tags: options?.tags
    };
    
    this.sessions.push(session);
    
    return session;
  }
  
  /**
   * Get sessions based on filter criteria
   */
  public getSessions(filter: SessionFilter): GroupViewingSession[] {
    let result = [...this.sessions];
    
    // Apply filters
    if (filter.hostId) {
      result = result.filter(s => s.hostId === filter.hostId);
    }
    
    if (filter.participantId) {
      result = result.filter(s => 
        s.participants.some(p => p.userId === filter.participantId)
      );
    }
    
    if (filter.videoId) {
      result = result.filter(s => s.videoId === filter.videoId);
    }
    
    if (filter.status) {
      result = result.filter(s => s.status === filter.status);
    }
    
    if (filter.courseId) {
      result = result.filter(s => s.courseId === filter.courseId);
    }
    
    if (filter.groupId) {
      result = result.filter(s => s.groupId === filter.groupId);
    }
    
    if (filter.startAfter !== undefined) {
      result = result.filter(s => s.startTime >= filter.startAfter!);
    }
    
    if (filter.startBefore !== undefined) {
      result = result.filter(s => s.startTime <= filter.startBefore!);
    }
    
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(s => 
        s.tags && filter.tags!.some(tag => s.tags!.includes(tag))
      );
    }
    
    // Apply pagination
    if (filter.limit !== undefined) {
      const offset = filter.offset || 0;
      result = result.slice(offset, offset + filter.limit);
    }
    
    return result;
  }
  
  /**
   * Get a specific session by ID
   */
  public getSession(id: string): GroupViewingSession | undefined {
    return this.sessions.find(s => s.id === id);
  }
  
  /**
   * Update a session
   */
  public updateSession(
    id: string,
    updates: Partial<Omit<GroupViewingSession, 'id' | 'hostId' | 'startTime' | 'participants' | 'messages' | 'polls'>>
  ): GroupViewingSession | undefined {
    const index = this.sessions.findIndex(s => s.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const session = this.sessions[index];
    
    // Apply updates
    this.sessions[index] = {
      ...session,
      ...updates
    };
    
    return this.sessions[index];
  }
  
  /**
   * End a session
   */
  public endSession(id: string): boolean {
    const session = this.sessions.find(s => s.id === id);
    
    if (!session) {
      return false;
    }
    
    session.status = 'ended';
    session.endTime = Date.now();
    
    // Mark all participants as inactive
    session.participants.forEach(p => {
      if (p.isActive) {
        p.isActive = false;
        p.leaveTime = Date.now();
      }
    });
    
    // Add system message
    this.addMessage(
      id,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      'Session ended'
    );
    
    return true;
  }
  
  /**
   * Join a session
   */
  public joinSession(
    sessionId: string,
    userId: string,
    userName: string,
    userRole: 'student' | 'instructor' | 'admin'
  ): GroupViewingParticipant | undefined {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return undefined;
    }
    
    // Check if user is already a participant
    const existingParticipant = session.participants.find(p => p.userId === userId);
    
    if (existingParticipant) {
      // Update existing participant
      existingParticipant.isActive = true;
      existingParticipant.lastActivity = Date.now();
      
      if (existingParticipant.leaveTime) {
        // Add system message for rejoining
        this.addMessage(
          sessionId,
          'system',
          'System',
          'admin',
          GroupViewingMessageType.SYSTEM,
          `${userName} rejoined the session`
        );
      }
      
      return existingParticipant;
    }
    
    // Create new participant
    const now = Date.now();
    const participant: GroupViewingParticipant = {
      userId,
      userName,
      userRole,
      joinTime: now,
      isActive: true,
      hasControl: !session.settings.requireHandRaise || userRole === 'instructor',
      raisedHand: false,
      lastActivity: now
    };
    
    session.participants.push(participant);
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${userName} joined the session`
    );
    
    return participant;
  }
  
  /**
   * Leave a session
   */
  public leaveSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return false;
    }
    
    const participant = session.participants.find(p => p.userId === userId);
    
    if (!participant || !participant.isActive) {
      return false;
    }
    
    participant.isActive = false;
    participant.leaveTime = Date.now();
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${participant.userName} left the session`
    );
    
    // If host leaves, end session or transfer host role
    if (userId === session.hostId) {
      // Find another active participant to be the host
      const newHost = session.participants.find(p => p.isActive && p.userId !== userId);
      
      if (newHost) {
        // Transfer host role
        session.hostId = newHost.userId;
        session.hostName = newHost.userName;
        session.hostRole = newHost.userRole;
        newHost.hasControl = true;
        
        // Add system message
        this.addMessage(
          sessionId,
          'system',
          'System',
          'admin',
          GroupViewingMessageType.SYSTEM,
          `${newHost.userName} is now the host`
        );
      } else {
        // End session if no active participants
        this.endSession(sessionId);
      }
    }
    
    return true;
  }
  
  /**
   * Add a message to a session
   */
  public addMessage(
    sessionId: string,
    userId: string,
    userName: string,
    userRole: 'student' | 'instructor' | 'admin',
    type: GroupViewingMessageType,
    content: string,
    options?: {
      timeCode?: number;
      replyTo?: string;
      data?: unknown;
    }
  ): GroupViewingMessage | undefined {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return undefined;
    }
    
    // Check if chat is allowed
    if (type === GroupViewingMessageType.CHAT && !session.settings.allowChat) {
      return undefined;
    }
    
    // Check if reactions are allowed
    if (type === GroupViewingMessageType.REACTION && !session.settings.allowReactions) {
      return undefined;
    }
    
    // Check if questions are allowed
    if (type === GroupViewingMessageType.QUESTION && !session.settings.allowQuestions) {
      return undefined;
    }
    
    // Check if polls are allowed
    if (type === GroupViewingMessageType.POLL && !session.settings.allowPolls) {
      return undefined;
    }
    
    const now = Date.now();
    
    const message: GroupViewingMessage = {
      id: `msg_${now}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId,
      userId,
      userName,
      userRole,
      type,
      content,
      timestamp: now,
      timeCode: options?.timeCode,
      replyTo: options?.replyTo,
      reactions: {},
      data: options?.data
    };
    
    session.messages.push(message);
    
    // Update participant last activity
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.lastActivity = now;
    }
    
    return message;
  }
  
  /**
   * Add a reaction to a message
   */
  public addReaction(
    sessionId: string,
    messageId: string,
    userId: string,
    reaction: ReactionType
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended' || !session.settings.allowReactions) {
      return false;
    }
    
    const message = session.messages.find(m => m.id === messageId);
    
    if (!message) {
      return false;
    }
    
    // Initialize reaction array if it doesn't exist
    if (!message.reactions[reaction]) {
      message.reactions[reaction] = [];
    }
    
    // Add user to reaction if not already added
    if (!message.reactions[reaction]!.includes(userId)) {
      message.reactions[reaction]!.push(userId);
    }
    
    // Update participant last activity
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.lastActivity = Date.now();
    }
    
    return true;
  }
  
  /**
   * Remove a reaction from a message
   */
  public removeReaction(
    sessionId: string,
    messageId: string,
    userId: string,
    reaction: ReactionType
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return false;
    }
    
    const message = session.messages.find(m => m.id === messageId);
    
    if (!message || !message.reactions[reaction]) {
      return false;
    }
    
    // Remove user from reaction
    message.reactions[reaction] = message.reactions[reaction]!.filter(id => id !== userId);
    
    // Update participant last activity
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.lastActivity = Date.now();
    }
    
    return true;
  }
  
  /**
   * Create a poll in a session
   */
  public createPoll(
    sessionId: string,
    creatorId: string,
    question: string,
    options: string[],
    settings?: {
      isAnonymous?: boolean;
      isMultiSelect?: boolean;
      expires?: number;
    }
  ): GroupViewingPoll | undefined {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended' || !session.settings.allowPolls) {
      return undefined;
    }
    
    // Check if creator is a participant
    const creator = session.participants.find(p => p.userId === creatorId);
    
    if (!creator) {
      return undefined;
    }
    
    // Check if anonymous polls are allowed
    if (settings?.isAnonymous && !session.settings.allowAnonymousPolls) {
      return undefined;
    }
    
    const now = Date.now();
    
    const poll: GroupViewingPoll = {
      id: `poll_${now}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId,
      creatorId,
      question,
      options,
      created: now,
      expires: settings?.expires,
      isAnonymous: settings?.isAnonymous || false,
      isMultiSelect: settings?.isMultiSelect || false,
      responses: []
    };
    
    session.polls.push(poll);
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${creator.userName} created a poll: ${question}`,
      {
        data: {
          pollId: poll.id
        }
      }
    );
    
    // Update participant last activity
    creator.lastActivity = now;
    
    return poll;
  }
  
  /**
   * Respond to a poll
   */
  public respondToPoll(
    sessionId: string,
    pollId: string,
    userId: string,
    userName: string,
    selectedOptions: number[]
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return false;
    }
    
    const poll = session.polls.find(p => p.id === pollId);
    
    if (!poll) {
      return false;
    }
    
    // Check if poll has expired
    if (poll.expires && poll.expires < Date.now()) {
      return false;
    }
    
    // Check if options are valid
    if (selectedOptions.some(o => o < 0 || o >= poll.options.length)) {
      return false;
    }
    
    // Check if multi-select is allowed
    if (!poll.isMultiSelect && selectedOptions.length > 1) {
      return false;
    }
    
    // Remove previous response if exists
    poll.responses = poll.responses.filter(r => r.userId !== userId);
    
    // Add new response
    poll.responses.push({
      userId,
      userName,
      selectedOptions,
      timestamp: Date.now()
    });
    
    // Update participant last activity
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.lastActivity = Date.now();
    }
    
    return true;
  }
  
  /**
   * Send a playback control action
   */
  public sendPlaybackControl(
    sessionId: string,
    userId: string,
    action: PlaybackControlAction,
    value?: number
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return false;
    }
    
    // Check if user has control
    const participant = session.participants.find(p => p.userId === userId);
    
    if (!participant || !participant.hasControl) {
      return false;
    }
    
    // Add control message
    this.addMessage(
      sessionId,
      userId,
      participant.userName,
      participant.userRole,
      GroupViewingMessageType.PLAYBACK_CONTROL,
      `${participant.userName} ${action === PlaybackControlAction.PLAY ? 'played' : 
                               action === PlaybackControlAction.PAUSE ? 'paused' : 
                               action === PlaybackControlAction.SEEK ? 'seeked to' : 
                               'changed speed to'} ${value !== undefined ? value : ''}`,
      {
        data: {
          action,
          value
        }
      }
    );
    
    // Update participant position if seeking
    if (action === PlaybackControlAction.SEEK && value !== undefined) {
      participant.lastPosition = value;
    }
    
    return true;
  }
  
  /**
   * Request control in a session
   */
  public requestControl(sessionId: string, userId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return false;
    }
    
    // Check if participant control is allowed
    if (!session.settings.allowParticipantControl) {
      return false;
    }
    
    const participant = session.participants.find(p => p.userId === userId);
    
    if (!participant) {
      return false;
    }
    
    // If auto-accept hand raise is enabled, grant control immediately
    if (session.settings.autoAcceptHandRaise) {
      participant.hasControl = true;
      participant.raisedHand = false;
      
      // Add system message
      this.addMessage(
        sessionId,
        'system',
        'System',
        'admin',
        GroupViewingMessageType.SYSTEM,
        `${participant.userName} now has control`
      );
      
      return true;
    }
    
    // Otherwise, raise hand
    participant.raisedHand = true;
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${participant.userName} requested control`
    );
    
    return true;
  }
  
  /**
   * Grant control to a participant
   */
  public grantControl(sessionId: string, hostId: string, participantId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return false;
    }
    
    // Check if user is the host
    if (session.hostId !== hostId) {
      return false;
    }
    
    const participant = session.participants.find(p => p.userId === participantId);
    
    if (!participant) {
      return false;
    }
    
    participant.hasControl = true;
    participant.raisedHand = false;
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${participant.userName} was granted control by ${session.hostName}`
    );
    
    return true;
  }
  
  /**
   * Revoke control from a participant
   */
  public revokeControl(sessionId: string, hostId: string, participantId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (!session || session.status === 'ended') {
      return false;
    }
    
    // Check if user is the host
    if (session.hostId !== hostId) {
      return false;
    }
    
    const participant = session.participants.find(p => p.userId === participantId);
    
    if (!participant) {
      return false;
    }
    
    participant.hasControl = false;
    
    // Add system message
    this.addMessage(
      sessionId,
      'system',
      'System',
      'admin',
      GroupViewingMessageType.SYSTEM,
      `${session.hostName} revoked control from ${participant.userName}`
    );
    
    return true;
  }
  
  /**
   * Simulate a group viewing session for demo purposes
   * This would be replaced by real data in production
   */
  public simulateGroupViewingSession(
    videoId: string,
    hostId: string = 'instructor1',
    participantCount: number = 5
  ): GroupViewingSession {
    const userIds = ['student1', 'student2', 'student3', 'student4', 'student5', 'instructor1'];
    const userNames = ['John Smith', 'Jane Doe', 'Alex Johnson', 'Maria Garcia', 'Raj Patel', 'Prof. Williams'];
    const userRoles: Array<'student' | 'instructor'> = ['student', 'student', 'student', 'student', 'student', 'instructor'];
    
    // Create session
    const session = this.createSession(
      'Educational Psychology Discussion',
      videoId,
      hostId,
      userNames[userIds.indexOf(hostId)],
      userRoles[userIds.indexOf(hostId)] as 'student' | 'instructor',
      {
        allowParticipantControl: true,
        allowChat: true,
        allowReactions: true,
        allowQuestions: true,
        allowPolls: true,
        requireHandRaise: true
      },
      {
        courseId: 'course1',
        description: 'Group viewing session for discussing educational psychology concepts',
        tags: ['psychology', 'education', 'group-discussion']
      }
    );
    
    // Add participants
    const participantIndices = Array.from({ length: userIds.length }, (_, i) => i)
      .filter(i => userIds[i] !== hostId)
      .slice(0, participantCount);
    
    for (const i of participantIndices) {
      this.joinSession(
        session.id,
        userIds[i],
        userNames[i],
        userRoles[i]
      );
    }
    
    // Add some chat messages
    const sampleMessages = [
      'Hello everyone!',
      'I found the section on cognitive development particularly interesting.',
      'Can someone explain the difference between behaviorism and cognitivism?',
      'The video explains it around the 5-minute mark.',
      'I think this relates to what we discussed in last week\'s lecture.',
      'Does anyone have notes from the previous session?',
      'I\'m confused about the concept of scaffolding.',
      'Great explanation by the professor!',
      'This will definitely be on the exam.',
      'Can we pause and discuss this point?'
    ];
    
    // Add messages with timestamps spread over the last hour
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    
    for (let i = 0; i < 15; i++) {
      const randomParticipantIndex = Math.floor(Math.random() * session.participants.length);
      const participant = session.participants[randomParticipantIndex];
      
      this.addMessage(
        session.id,
        participant.userId,
        participant.userName,
        participant.userRole,
        GroupViewingMessageType.CHAT,
        sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        {
          timeCode: Math.floor(Math.random() * 600) // Random time within 10 minutes
        }
      );
    }
    
    // Add a poll
    if (session.participants.some(p => p.userRole === 'instructor')) {
      const instructor = session.participants.find(p => p.userRole === 'instructor')!;
      
      this.createPoll(
        session.id,
        instructor.userId,
        'Which learning theory do you find most applicable to your own learning?',
        [
          'Behaviorism',
          'Cognitivism',
          'Constructivism',
          'Social Learning Theory',
          'Connectivism'
        ],
        {
          isMultiSelect: false,
          isAnonymous: true
        }
      );
      
      // Add some responses
      const studentParticipants = session.participants.filter(p => p.userRole === 'student');
      for (const student of studentParticipants) {
        this.respondToPoll(
          session.id,
          session.polls[0].id,
          student.userId,
          student.userName,
          [Math.floor(Math.random() * 5)] // Random option
        );
      }
    }
    
    // Add some playback control actions
    const hostParticipant = session.participants.find(p => p.userId === hostId)!;
    
    this.sendPlaybackControl(
      session.id,
      hostId,
      PlaybackControlAction.PLAY,
      undefined
    );
    
    this.sendPlaybackControl(
      session.id,
      hostId,
      PlaybackControlAction.SEEK,
      120 // 2 minutes in
    );
    
    // Add some reactions
    const messageIds = session.messages
      .filter(m => m.type === GroupViewingMessageType.CHAT)
      .map(m => m.id);
    
    if (messageIds.length > 0) {
      for (let i = 0; i < 5; i++) {
        const randomMessageId = messageIds[Math.floor(Math.random() * messageIds.length)];
        const randomParticipantIndex = Math.floor(Math.random() * session.participants.length);
        const participant = session.participants[randomParticipantIndex];
        const randomReaction = Object.values(ReactionType)[Math.floor(Math.random() * Object.values(ReactionType).length)];
        
        this.addReaction(
          session.id,
          randomMessageId,
          participant.userId,
          randomReaction
        );
      }
    }
    
    return session;
  }
}

// Singleton instance
export const groupViewingService = new GroupViewingService();

/**
 * Get active group viewing sessions for a video
 * In a real implementation, this would fetch from a database
 */
export async function getActiveGroupViewingSessions(
  videoId: string,
  userId?: string
): Promise<GroupViewingSession[]> {
  // For demo purposes, simulate a session if none exist
  const existingSessions = groupViewingService.getSessions({
    videoId,
    status: 'active'
  });
  
  if (existingSessions.length === 0) {
    groupViewingService.simulateGroupViewingSession(videoId);
  }
  
  // Get all active sessions for this video
  return groupViewingService.getSessions({
    videoId,
    status: 'active'
  });
}