'use client';

import React from 'react';

// Create a stub VrHeadset icon component to fix build warnings
export const VrHeadset = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2,
  className = '',
  ...props 
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-vr-headset ${className}`}
      {...props}
    >
      <path d="M3 12.5h18" />
      <path d="M5 8.5h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
      <path d="M5.5 13.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M18.5 13.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M7.5 16.5a1.5 1.5 0 0 0 3 0v-2h3v2a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
};

export default VrHeadset;
