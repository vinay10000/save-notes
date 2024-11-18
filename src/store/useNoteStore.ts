import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isFavorite: boolean;
  color?: string;
  workspace: string;
  folder?: string;
  star?: boolean;
  pin?: boolean;
}

interface NoteStore {
  notes: Note[];
  activeNote: Note | null;
  workspaces: string[];
  currentWorkspace: string;
  setActiveNote: (note: Note | null) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'isFavorite' | 'workspace'>) => Note;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  searchNotes: (query: string) => Note[];
  addTag: (noteId: string, tag: string) => void;
  removeTag: (noteId: string, tag: string) => void;
  togglePin: (noteId: string) => void;
  toggleFavorite: (noteId: string) => void;
  setNoteColor: (noteId: string, color: string | undefined) => void;
  addWorkspace: (name: string) => void;
  setCurrentWorkspace: (name: string) => void;
  deleteWorkspace: (name: string) => void;
  moveToFolder: (noteId: string, folder: string) => void;
  toggleStar: (noteId: string) => void;
  togglePinNote: (noteId: string) => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNote: null,
      workspaces: ['Personal', 'Work', 'Projects'],
      currentWorkspace: 'Personal',
      setActiveNote: (note) => set({ activeNote: note }),
      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isPinned: false,
          isFavorite: false,
          tags: note.tags || [],
          workspace: get().currentWorkspace,
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNote: newNote,
        }));
        return newNote;
      },
      updateNote: (updatedNote) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note
          ),
          activeNote: state.activeNote?.id === updatedNote.id ? updatedNote : state.activeNote,
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNote: state.activeNote?.id === id ? null : state.activeNote,
        }));
      },
      searchNotes: (query) => {
        const state = get();
        const searchTerm = query.toLowerCase();
        return state.notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      },
      addTag: (noteId, tag) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) =>
            note.id === noteId && !note.tags.includes(tag)
              ? { ...note, tags: [...note.tags, tag], updatedAt: Date.now() }
              : note
          );
          const updatedNote = updatedNotes.find((note) => note.id === noteId);
          return {
            notes: updatedNotes,
            activeNote: updatedNote || state.activeNote
          };
        });
      },
      removeTag: (noteId, tag) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) =>
            note.id === noteId
              ? { ...note, tags: note.tags.filter((t) => t !== tag), updatedAt: Date.now() }
              : note
          );
          const updatedNote = updatedNotes.find((note) => note.id === noteId);
          return {
            notes: updatedNotes,
            activeNote: updatedNote || state.activeNote
          };
        });
      },
      togglePin: (noteId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      toggleFavorite: (noteId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      setNoteColor: (noteId, color) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, color, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      addWorkspace: (name) => {
        set((state) => ({
          workspaces: [...state.workspaces, name]
        }));
      },
      setCurrentWorkspace: (name) => {
        set({ currentWorkspace: name });
      },
      deleteWorkspace: (name: string) => {
        const { workspaces, currentWorkspace, notes } = get();
        if (workspaces.length <= 1) {
          throw new Error("Cannot delete the last workspace");
        }
        if (name === "default") {
          throw new Error("Cannot delete the default workspace");
        }
        
        // Switch to default workspace if deleting current workspace
        if (name === currentWorkspace) {
          set({ currentWorkspace: "default" });
        }
        
        // Delete all notes in the workspace
        const updatedNotes = notes.filter(note => note.workspace !== name);
        
        set(state => ({
          workspaces: state.workspaces.filter(w => w !== name),
          notes: updatedNotes
        }));
      },
      moveToFolder: (noteId, folder) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, folder, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      toggleStar: (noteId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, star: !note.star, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      togglePinNote: (noteId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, pin: !note.pin, updatedAt: Date.now() }
              : note
          ),
        }));
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);
