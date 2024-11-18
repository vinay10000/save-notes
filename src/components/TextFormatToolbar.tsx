'use client';

import React from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link, Image 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextFormatToolbarProps {
  onFormat: (command: string, value?: string) => void;
  formatState: Record<string, boolean>;
  className?: string;
}

export function TextFormatToolbar({ onFormat, formatState, className }: TextFormatToolbarProps) {
  const formatButtons = [
    { icon: Bold, command: 'bold', tooltip: 'Bold (Ctrl+B)', group: 'basic' },
    { icon: Italic, command: 'italic', tooltip: 'Italic (Ctrl+I)', group: 'basic' },
    { icon: Underline, command: 'underline', tooltip: 'Underline (Ctrl+U)', group: 'basic' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List', group: 'list' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List', group: 'list' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Align Left', group: 'align' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Align Center', group: 'align' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Align Right', group: 'align' },
  ];

  const buttonGroups = {
    basic: formatButtons.filter(btn => btn.group === 'basic'),
    list: formatButtons.filter(btn => btn.group === 'list'),
    align: formatButtons.filter(btn => btn.group === 'align'),
  };

  const renderButtonGroup = (buttons: typeof formatButtons) => (
    <div className="flex items-center gap-0.5">
      {buttons.map((button) => (
        <button
          key={button.command}
          onClick={() => onFormat(button.command)}
          className={cn(
            'p-1.5 rounded-sm transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            'focus:outline-none focus:ring-1 focus:ring-blue-500',
            formatState[button.command] && 'bg-gray-100 dark:bg-gray-700'
          )}
          title={button.tooltip}
        >
          <button.icon 
            className={cn(
              'w-4 h-4',
              formatState[button.command] && 'text-blue-600 dark:text-blue-400'
            )} 
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
      className
    )}>
      {renderButtonGroup(buttonGroups.basic)}
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
      {renderButtonGroup(buttonGroups.list)}
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
      {renderButtonGroup(buttonGroups.align)}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => {
          const url = window.prompt('Enter link URL:');
          if (url) onFormat('createLink', url);
        }}
        className={cn(
          'p-1 rounded transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
        title="Insert Link (Ctrl+K)"
      >
        <Link className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) onFormat('insertImage', url);
        }}
        className={cn(
          'p-1 rounded transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
        title="Insert Image"
      >
        <Image className="w-4 h-4" />
      </button>
    </div>
  );
}
