'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, BookOpen, User } from 'lucide-react';

interface SocialLinks {
  linkedin?: string;
  email?: string;
  publications?: string;
  [key: string]: string | undefined;
}

interface TeamMemberProps {
  name: string;
  title: string;
  qualifications: string;
  bio: string;
  imageSrc: string;
  specialties: any[];
  imagePosition?: string;
  avatarVideo?: {
    src: string;
    context: 'homepage' | 'dashboard' | 'feature' | 'help' | 'navigation';
    script?: string;
  };
}

import { AvatarVideoPlayer } from '@/components/Avatar/AvatarVideoPlayer';

export function TeamMember({
  name,
  title,
  qualifications,
  bio,
  imageSrc,
  specialties,
  imagePosition = 'center',
  avatarVideo
}: TeamMemberProps) {
  const [imageError, setImageError] = useState(false);
  
  // Create fallback image path
  const fallbackImageSrc = `/images/team/${name.split(' ')[0]}.jpg`;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg" data-feature="team-member">
      <div className="relative h-96 w-full overflow-hidden bg-gray-100">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            style={{
              objectPosition: imagePosition,
              objectFit: 'cover'
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/20">
            <User className="w-32 h-32 text-primary/30" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{qualifications}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Connect with {name.split(' ')[0]} via the platform
        </div>
        
        {avatarVideo && (
          <div className="w-full mt-4">
            <AvatarVideoPlayer
              avatarId={name.toLowerCase().includes('scott') ? 'dr-scott' : 'professor-maya'}
              videoScript={avatarVideo.script || `Hello, I'm ${name}. Welcome to my profile on EdPsych Connect.`}
              context={avatarVideo.context}
              userRole="professional"
              className="w-full"
              showControls={true}
              responsive={true}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
