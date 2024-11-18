'use client';

import { useState, useRef, useEffect } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { CustomEditor } from './CustomEditor';
import {Smile, FileText } from 'lucide-react';
import { NoteTemplates } from './NoteTemplates';
import cn from 'classnames';
import type { Note } from '../store/useNoteStore';

interface NoteEditorProps {
  note: Note;
}

const emojis = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍',
  '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎',
  '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
  '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓',
  '✨', '💫', '🌟', '⭐', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️',
  '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈',
];

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, addTag, removeTag } = useNoteStore();
  const [newTag, setNewTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save functionality
  const handleContentChange = (content: string) => {
    if (!note) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Clean content if it's just a placeholder
    const cleanContent = content === '<p><br></p>' ? '' : content;

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      updateNote({
        ...note,
        content: cleanContent,
        updatedAt: Date.now(),
      });
    }, 500);
  };

  const handleTemplateSelect = (template: any) => {
    if (!note) return;
    const currentTime = Date.now();
    updateNote({
      ...note,
      content: template.content,
      updatedAt: currentTime,
      createdAt: currentTime,
      isPinned: false,
      isFavorite: false,
      workspace: note.workspace,
      color: note.color,
      folder: note.folder,
      star: note.star,
      pin: note.pin
    });
    setShowTemplates(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setNewTag('');
  }, [note?.id]);

  const handleEmojiSelect = (emoji: string) => {
    if (!note) return;
    
    updateNote({
      ...note,
      content: note.content + emoji,
      updatedAt: Date.now()
    });
    
    setShowEmojiPicker(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    updateNote({
      ...note,
      title: e.target.value,
      updatedAt: Date.now()
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!note) return;
    removeTag(note.id, tagToRemove);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && note) {
      e.preventDefault();
      addTag(note.id, newTag.trim());
      setNewTag('');
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a note or create a new one to start editing
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled Note"
          className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-lg font-medium"
        />
        <div className="flex gap-1">
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <Smile className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <CustomEditor
          value={note.content}
          onChange={handleContentChange}
          placeholder="Enter a note..."
          className="h-full"
        />
      </div>

      {/* Tag input and emoji picker */}
      <div className="border-t bg-white dark:bg-gray-900">
        <div className="p-2 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(note.id, tag)}
                className="hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tag..."
            className="flex-1 min-w-[120px] px-2 py-1 text-sm bg-transparent border rounded"
          />
        </div>

        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full right-0 mb-2 z-20 bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-2 max-h-[300px] overflow-auto"
          >
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {showTemplates && (
          <div className="absolute bottom-full right-0 mb-2 z-20 bg-white dark:bg-gray-900 border rounded-lg shadow-lg">
            <NoteTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
