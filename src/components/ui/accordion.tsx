'use client';

import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ title, children, defaultOpen = false, className = '' }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 px-2">
          <div className="text-sm text-gray-500">{children}</div>
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  return (
    <div className={`divide-y divide-gray-200 border border-gray-200 rounded-md ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          defaultOpen={item.defaultOpen}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
