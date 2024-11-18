import { Pin, Star, Palette, Folder } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { useState } from 'react';

const COLORS = [
  { name: 'Default', value: undefined },
  { name: 'Red', value: '#fecaca' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Purple', value: '#ddd6fe' },
  { name: 'Yellow', value: '#fef08a' },
];

const FOLDERS = [
  'Personal',
  'Work',
  'Ideas',
  'Projects',
  'Archive',
];

interface NoteActionsProps {
  noteId: string;
  isPinned: boolean;
  isFavorite: boolean;
  color?: string;
  folder?: string;
}

export function NoteActions({ noteId, isPinned, isFavorite, color, folder }: NoteActionsProps) {
  const { togglePin, toggleFavorite, setNoteColor, moveToFolder } = useNoteStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFolders, setShowFolders] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => togglePin(noteId)}
        className={`rounded-lg p-1.5 transition-colors ${
          isPinned
            ? 'bg-gray-100 text-gray-900 dark:bg-[#1a1a1a] dark:text-[#fafafa]'
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
        }`}
        aria-label={isPinned ? 'Unpin note' : 'Pin note'}
      >
        <Pin className="h-4 w-4" />
      </button>

      <button
        onClick={() => toggleFavorite(noteId)}
        className={`rounded-lg p-1.5 transition-colors ${
          isFavorite
            ? 'bg-gray-100 text-yellow-500 dark:bg-[#1a1a1a]'
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
        }`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`rounded-lg p-1.5 transition-colors ${
            color
              ? 'bg-gray-100 text-gray-900 dark:bg-[#1a1a1a] dark:text-[#fafafa]'
              : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
          }`}
          aria-label="Change note color"
        >
          <Palette className="h-4 w-4" />
        </button>

        {showColorPicker && (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-[#333333] dark:bg-[#111111]">
            <div className="grid grid-cols-3 gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setNoteColor(noteId, c.value as string);
                    setShowColorPicker(false);
                  }}
                  className={`rounded p-2 text-sm ${
                    color === c.value
                      ? 'bg-gray-100 font-medium dark:bg-[#1a1a1a]'
                      : 'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                  }`}
                  style={c.value ? { backgroundColor: c.value } : undefined}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowFolders(!showFolders)}
          className={`rounded-lg p-1.5 transition-colors ${
            folder
              ? 'bg-gray-100 text-gray-900 dark:bg-[#1a1a1a] dark:text-[#fafafa]'
              : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
          }`}
          aria-label="Move to folder"
        >
          <Folder className="h-4 w-4" />
        </button>

        {showFolders && (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-[#333333] dark:bg-[#111111]">
            {FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => {
                  moveToFolder(noteId, f);
                  setShowFolders(false);
                }}
                className={`block w-full rounded px-3 py-1.5 text-left text-sm ${
                  folder === f
                    ? 'bg-gray-100 font-medium dark:bg-[#1a1a1a]'
                    : 'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
