import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { SocialIcon } from '../ui/icons';

export interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  specialties?: string[];
  education?: string[];
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  bio,
  imageUrl,
  socialLinks,
  specialties,
  education
}) => {
  return (
    <Card className="team-member-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={`${name} - ${role}`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-lg font-medium text-primary">{role}</CardDescription>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{bio}</p>
          
          {specialties && specialties.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold">Specialties:</h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {specialties.map((specialty, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {education && education.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold">Education:</h4>
              <ul className="mt-1 list-inside list-disc text-xs text-gray-600 dark:text-gray-300">
                {education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      
      {socialLinks && Object.values(socialLinks).some(link => !!link) && (
        <CardFooter className="flex justify-start gap-2 border-t bg-muted/50 px-6 py-3">
          {socialLinks.twitter && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Twitter`}>
                <SocialIcon type="twitter" className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.linkedin && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn`}>
                <SocialIcon type="linkedin" className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.github && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s GitHub`}>
                <SocialIcon type="github" className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.website && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Website`}>
                <SocialIcon type="website" className="h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TeamMember;
