/**
 * AvatarVideo Component for Working Memory Support
 * 
 * This component provides a placeholder for AI avatar videos that will explain
 * working memory concepts and provide guidance on using the tools and exercises.
 */

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useTranslation } from '@/components/i18n';

interface AvatarVideoProps {
  src: string;
  title: string;
  onClose: () => void;
}

export default function AvatarVideo({ src, title, onClose }: AvatarVideoProps) {
  const { t } = useTranslation('working-memory');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  return (
    <Card className="avatar-video-container p-4 border-2 border-blue-200 bg-blue-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-medium">{title}</h4>
        <Button 
          onClick={onClose}
          variant="ghost"
          size="sm"
          aria-label={t('close')}
        >
          ×
        </Button>
      </div>
      
      <div className="relative bg-gray-200 rounded-md aspect-video flex items-center justify-center">
        {/* This is a placeholder for the actual video that will be added later */}
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">
            {t('avatarVideo.placeholder')}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t('avatarVideo.willBeAdded')}
          </p>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p>{t('avatarVideo.description')}</p>
      </div>
    </Card>
  );
}
