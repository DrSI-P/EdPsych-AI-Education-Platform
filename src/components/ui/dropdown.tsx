'use client';

import React, { useState, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    danger?: boolean;
  }[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'left', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className={`relative inline-block text-left ${className}`} data-dropdown>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`origin-top-${align} absolute ${align}-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <div key={index}>
                {item.href ? (
                  <a
                    href={item.disabled ? undefined : item.href}
                    className={`
                      ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}
                      group flex items-center px-4 py-2 text-sm
                    `}
                    role="menuitem"
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        return;
                      }
                      setIsOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`
                      ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}
                      group flex w-full items-center px-4 py-2 text-sm
                    `}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
