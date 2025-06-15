import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Video, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlaceholderProps {
  title: string;
  description: string;
  duration?: string;
  category?: 'orientation' | 'feature-demo' | 'tutorial' | 'overview';
  thumbnailText?: string;
}

export default function VideoPlaceholder({
  title,
  description,
  duration = '2-5 minutes',
  category = 'orientation',
  thumbnailText
}: VideoPlaceholderProps) {
  const getCategoryColor = () => {
    switch (category) {
      case 'orientation': return 'from-blue-600 to-purple-600';
      case 'feature-demo': return 'from-green-600 to-teal-600';
      case 'tutorial': return 'from-orange-600 to-red-600';
      case 'overview': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'orientation': return 'Navigation Guide';
      case 'feature-demo': return 'Feature Demo';
      case 'tutorial': return 'Tutorial';
      case 'overview': return 'Platform Overview';
      default: return 'Video';
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`relative h-48 bg-gradient-to-r ${getCategoryColor()} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center text-white">
          <Video className="w-16 h-16 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium opacity-90">{thumbnailText || 'Video Coming Soon'}</p>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            {getCategoryLabel()}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            disabled
          >
            <Play className="w-3 h-3" />
            Coming Soon
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <p className="text-xs text-gray-500">
              This video is being created to help you navigate and understand this feature without feeling overwhelmed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}