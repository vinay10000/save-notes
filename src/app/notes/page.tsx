'use client';

import { NoteEditor } from '@/components/NoteEditor';
import { NotesList } from '@/components/NotesList';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WorkspaceSelector } from '@/components/WorkspaceSelector';
import { useNoteStore } from '@/store/useNoteStore';
import { Download, FileText, Menu, Plus, Upload, X } from 'lucide-react';
import { exportNotes, importNotes } from '@/utils/exportImport';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function NotesPage() {
  const { notes, addNote, setActiveNote, activeNote } = useNoteStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedNotes = await importNotes(file);
      importedNotes.forEach(note => {
        addNote(note);
      });
      toast.success(`Successfully imported ${importedNotes.length} notes`);
    } catch (error) {
      console.error('Error importing notes:', error);
      toast.error('Failed to import notes. Please check the file format.');
    }
  };

  const handleExport = () => {
    if (notes.length === 0) {
      toast.error('No notes to export');
      return;
    }
    exportNotes(notes);
    toast.success('Notes exported successfully');
  };

  const handleNewNote = () => {
    const note = addNote({
      title: 'Untitled Note',
      content: '',
      tags: [],
    });
    setActiveNote(note);
    toast.success('New note created');
  };

  return (
    <main className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Mobile sidebar toggle and theme toggle */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 md:hidden">
        <ThemeToggle />
        <button
          className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:relative md:transform-none',
          'w-[85vw] md:w-72 lg:w-80',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800">
            <WorkspaceSelector />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Import/Export and New Note buttons */}
          <div className="p-2 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={() => document.getElementById('import-input')?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <input
                id="import-input"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
            <Button
              onClick={handleNewNote}
              className="w-full h-8"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Note
            </Button>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-hidden">
            <NotesList />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-200 ease-in-out',
        isSidebarOpen && 'md:ml-0 ml-0'
      )}>
        {activeNote ? (
          <NoteEditor note={activeNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400">
            <div>
              <FileText className="w-12 h-12 mx-auto mb-4 stroke-1" />
              <p className="text-lg font-medium">No note selected</p>
              <p className="text-sm">Select a note or create a new one to get started</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
