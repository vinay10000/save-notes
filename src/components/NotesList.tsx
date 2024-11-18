'use client';

import { useState, useMemo } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { Search, Trash2, Pin, Star, Folder, Palette, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const COLORS = {
  default: '',
  red: 'bg-red-50/80 hover:bg-red-100/90 dark:bg-red-900/20 dark:hover:bg-red-900/30',
  yellow: 'bg-yellow-50/80 hover:bg-yellow-100/90 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30',
  green: 'bg-green-50/80 hover:bg-green-100/90 dark:bg-green-900/20 dark:hover:bg-green-900/30',
  blue: 'bg-blue-50/80 hover:bg-blue-100/90 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
  purple: 'bg-purple-50/80 hover:bg-purple-100/90 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
};

const COLOR_INDICATORS = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
};

export function NotesList({ onNoteSelect }: { onNoteSelect?: () => void }) {
  const {
    notes,
    activeNote,
    setActiveNote,
    deleteNote,
    currentWorkspace,
    togglePin,
    toggleFavorite,
    setNoteColor,
  } = useNoteStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    const filtered = notes.filter(
      (note) =>
        note.workspace === currentWorkspace &&
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, searchQuery, currentWorkspace]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteNoteId(id);
  };

  const confirmDelete = () => {
    if (deleteNoteId) {
      deleteNote(deleteNoteId);
      if (activeNote?.id === deleteNoteId) {
        setActiveNote(null);
      }
    }
  };

  const handleColorChange = (e: React.MouseEvent, noteId: string, color: string | undefined) => {
    e.stopPropagation();
    setNoteColor(noteId, color);
  };

  const handleTogglePin = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    togglePin(noteId);
  };

  const handleToggleFavorite = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    toggleFavorite(noteId);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col bg-white dark:bg-black">
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mb-4 stroke-1" />
              <p className="text-lg font-medium">No notes found</p>
              <p className="text-sm">Try adjusting your search or create a new note</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    'group relative p-4 cursor-pointer border rounded-lg',
                    'hover:border-blue-500 dark:hover:border-blue-400',
                    'hover:shadow-sm transition-all duration-200',
                    note.id === activeNote?.id && 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500 dark:ring-blue-400',
                    note.color && COLORS[note.color as keyof typeof COLORS]
                  )}
                  onClick={() => {
                    setActiveNote(note);
                    onNoteSelect?.();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <button
                        onClick={(e) => handleTogglePin(e, note.id)}
                        className={cn(
                          'p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200',
                          note.isPinned ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                        )}
                        title={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleToggleFavorite(e, note.id)}
                        className={cn(
                          'p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200',
                          note.isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'
                        )}
                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {note.color && (
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              COLOR_INDICATORS[note.color as keyof typeof COLOR_INDICATORS]
                            )}
                          />
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {note.title || 'Untitled Note'}
                        </h3>
                      </div>
                      {note.content && (
                        <div className="prose dark:prose-invert max-w-none text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-2 overflow-hidden">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: note.content
                                .replace(/<[^>]*>?/gm, '') // Remove HTML tags
                                .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
                                .substring(0, 200) // Limit to 200 characters
                                + (note.content.length > 200 ? '...' : '') // Add ellipsis if needed
                            }} 
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {note.folder && (
                          <div className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            <span>{note.folder}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(note.updatedAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Palette className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={(e) => handleColorChange(e, note.id, undefined)}>
                            <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700 mr-2" />
                            Default
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {Object.entries(COLOR_INDICATORS).map(([color, indicator]) => (
                            <DropdownMenuItem
                              key={color}
                              onClick={(e) => handleColorChange(e, note.id, color)}
                            >
                              <div className={cn('w-4 h-4 rounded-full mr-2', indicator)} />
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={(e) => handleDelete(e, note.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmDialog
        isOpen={deleteNoteId !== null}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
}
