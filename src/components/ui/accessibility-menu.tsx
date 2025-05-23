'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VoiceInput } from '@/components/ui/voice-input';
import { AccessibilitySettings } from '@/components/ui/accessibility-settings';
import { Settings, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Keyboard shortcut for accessibility menu (Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        setIsOpen(!isOpen);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  return (
    <>
      {/* Floating accessibility button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
              aria-label="Accessibility Options"
            >
              <Settings size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle>Accessibility Options</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X size={24} />
              </Button>
            </SheetHeader>
            
            <div className="py-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Voice Input</h3>
                <p className="text-sm text-gray-500">
                  Use your voice to input text throughout the platform
                </p>
                <VoiceInput 
                  onTranscriptChange={(text) => console.log('Voice input:', text)} 
                  placeholder="Try voice input here..."
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility Settings</h3>
                <AccessibilitySettings />
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Keyboard shortcut: <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Alt + A</kbd>
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AccessibilityMenu;
