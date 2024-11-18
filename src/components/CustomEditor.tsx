'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TextFormatToolbar } from './TextFormatToolbar';
import { cn } from '@/lib/utils';

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomEditor({ value, onChange, placeholder, className = '' }: CustomEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [formatState, setFormatState] = useState<Record<string, boolean>>({});
  const isInternalChange = useRef(false);

  // Update format state on selection change
  useEffect(() => {
    const updateFormatState = () => {
      const formats = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      };
      setFormatState(formats);
    };

    document.addEventListener('selectionchange', updateFormatState);
    return () => document.removeEventListener('selectionchange', updateFormatState);
  }, []);

  // Sync the content with the editable div
  useEffect(() => {
    if (!editorRef.current || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const editor = editorRef.current;
    if (editor.innerHTML !== value) {
      const selection = window.getSelection();
      let cursorOffset = 0;

      // Only try to get cursor position if there is a valid selection
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editor.contains(range.startContainer)) {
          cursorOffset = range.startOffset;
        }
      }

      // Only set content if it's different from current value
      if (value === '') {
        editor.innerHTML = '<p><br></p>';
      } else {
        editor.innerHTML = value;
      }

      // Restore cursor position if possible
      if (selection && selection.rangeCount > 0 && editor.firstChild) {
        try {
          const range = document.createRange();
          range.setStart(editor.firstChild, cursorOffset);
          range.setEnd(editor.firstChild, cursorOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.warn('Failed to restore cursor position:', e);
        }
      }
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    if (newContent !== value) {
      isInternalChange.current = true;
      onChange(newContent);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;
    
    try {
      document.execCommand(command, false, value);
      const content = editorRef.current.innerHTML;
      isInternalChange.current = true;
      onChange(content);
      
      setFormatState(prev => ({
        ...prev,
        [command]: document.queryCommandState(command),
      }));
    } catch (error) {
      console.error('Error applying format:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Add your keydown event handling logic here
  };

  return (
    <div className="relative flex flex-col flex-1">
      <TextFormatToolbar
        onFormat={handleFormat}
        formatState={formatState}
        className={cn(
          'sticky top-0 z-10',
          'flex flex-wrap gap-0.5 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
          'border-b border-gray-200 dark:border-gray-800'
        )}
      />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'flex-1 outline-none overflow-auto px-4 py-2',
          'prose prose-sm sm:prose-base max-w-none prose-neutral dark:prose-invert',
          '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400',
          'break-words min-h-[200px]',
          className
        )}
        data-placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
