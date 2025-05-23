'use client';

import React, { useState, useEffect } from 'react';
import { VoiceInput } from '@/components/ui/voice-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic } from 'lucide-react';

interface VoiceInputFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}

export function VoiceInputField({
  id,
  name,
  label,
  placeholder = 'Type or use voice input...',
  value = '',
  onChange,
  className = '',
  disabled = false,
  required = false,
  maxLength,
  rows = 3
}: VoiceInputFieldProps) {
  const [text, setText] = useState(value);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  // Update internal state when value prop changes
  useEffect(() => {
    setText(value);
  }, [value]);
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    const newValue = text ? `${text} ${transcript}` : transcript;
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    setShowVoiceInput(!showVoiceInput);
  };
  
  return (
    <div className={`voice-input-field ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Textarea
          id={id}
          name={name}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className="pr-10"
          aria-label={label || placeholder}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={toggleVoiceInput}
          disabled={disabled}
          aria-label="Toggle voice input"
        >
          <Mic className={showVoiceInput ? "text-primary" : "text-muted-foreground"} size={16} />
        </Button>
      </div>
      
      {showVoiceInput && (
        <div className="mt-2">
          <VoiceInput
            onTranscriptChange={handleVoiceInput}
            placeholder="Click the microphone to start speaking..."
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export default VoiceInputField;
