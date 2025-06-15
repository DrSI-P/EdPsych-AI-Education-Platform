'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Mic, MicOff, MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AskDrScottAvatarProps {
  avatarId?: string;
  initialMessage?: string;
  className?: string;
}

export const AskDrScottAvatar: React.FC<AskDrScottAvatarProps> = ({
  avatarId = 'e12f05f24ead42619b4aa8124d98880d',
  initialMessage = "Hello, I'm Dr. Scott I-Patrick. How can I help you today?",
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'avatar', timestamp: Date}>>([]);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([
        {
          text: initialMessage,
          sender: 'avatar',
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    const messageText = userInput.trim();
    setUserInput('');
    
    // Add user message to the chat
    setMessages(prev => [
      ...prev,
      {
        text: messageText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate AI response (replace with actual AI integration when ready)
      setTimeout(() => {
        const responses = [
          "That's a great question about educational psychology. Let me share some insights...",
          "I understand your concern. In my experience working with children and families...",
          "Thank you for asking. This is an important topic in special educational needs...",
          "Based on research and best practices in educational psychology...",
          "I'd be happy to help you with that. Let's explore this together..."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [
          ...prev,
          {
            text: randomResponse,
            sender: 'avatar',
            timestamp: new Date()
          }
        ]);
        
        setIsLoading(false);
        inputRef.current?.focus();
      }, 1500);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Unable to send message. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Speech recognition would be implemented here
  };

  return (
    <div className={`ask-dr-scott-avatar ${className}`}>
      <Card className="border shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-xl flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask Dr. Scott
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {error && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {/* Avatar Video Placeholder */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
                <img 
                  src="/images/team/Scott.jpg" 
                  alt="Dr. Scott I-Patrick"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">
                Interactive avatar coming soon
              </p>
            </div>
            
            {/* Chat Messages */}
            <div className="bg-gray-50 rounded-lg p-3 h-48 overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${message.sender === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block px-3 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder={isLoading ? "Dr. Scott is thinking..." : "Type your question..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={toggleListening}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button 
                type="submit" 
                disabled={!userInput.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskDrScottAvatar;
