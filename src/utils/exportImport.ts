import { Note } from '../store/useNoteStore';

export const exportNotes = (notes: Note[]) => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `notes-backup-${new Date().toISOString()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importNotes = (file: File): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const notes = JSON.parse(event.target?.result as string);
        if (Array.isArray(notes) && notes.every(isValidNote)) {
          resolve(notes);
        } else {
          reject(new Error('Invalid notes format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

const isValidNote = (note: any): note is Note => {
  return (
    typeof note === 'object' &&
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    Array.isArray(note.tags) &&
    note.tags.every((tag: any) => typeof tag === 'string') &&
    typeof note.createdAt === 'number' &&
    typeof note.updatedAt === 'number'
  );
};
