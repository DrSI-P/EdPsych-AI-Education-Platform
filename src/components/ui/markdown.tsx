'use client';

import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  // Simple function to convert markdown to HTML
  const formatMarkdown = (text: string) => {
    // Replace headers
    let formatted = text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold my-2">$1</h4>');

    // Replace bold and italic
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    // Replace lists
    formatted = formatted
      .replace(/^\* (.*$)/gm, '<ul class="list-disc pl-6 my-2"><li class="my-1">$1</li></ul>')
      .replace(/^- (.*$)/gm, '<ul class="list-disc pl-6 my-2"><li class="my-1">$1</li></ul>')
      .replace(/^\d+\. (.*$)/gm, '<ol class="list-decimal pl-6 my-2"><li class="my-1">$1</li></ol>');

    // Fix list items (combine consecutive list items)
    formatted = formatted
      .replace(/<\/ul>\s*<ul class="list-disc pl-6 my-2">/g, '')
      .replace(/<\/ol>\s*<ol class="list-decimal pl-6 my-2">/g, '');

    // Replace code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>');
    
    // Replace inline code
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded text-sm">$1</code>');

    // Replace blockquotes
    formatted = formatted.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary/20 pl-4 italic my-2">$1</blockquote>');

    // Replace links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Replace paragraphs (any line that doesn't start with a special character)
    formatted = formatted.replace(/^(?!<[h|u|o|b|p|a])(.+)$/gm, '<p class="my-2">$1</p>');

    // Replace line breaks
    formatted = formatted.replace(/\n\n/g, '<br />');

    return formatted;
  };

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  );
}