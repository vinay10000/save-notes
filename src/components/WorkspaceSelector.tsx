'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function WorkspaceSelector() {
  const { workspaces, currentWorkspace, addWorkspace, setCurrentWorkspace, deleteWorkspace } = useNoteStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState<string | null>(null);

  const handleWorkspaceChange = (value: string) => {
    setCurrentWorkspace(value);
    toast.success(`Switched to ${value} workspace`);
  };

  const handleAddWorkspace = (name: string) => {
    try {
      addWorkspace(name);
      toast.success('Workspace created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
    }
  };

  const handleDeleteWorkspace = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setDeleteWorkspaceName(name);
  };

  const confirmDeleteWorkspace = () => {
    if (deleteWorkspaceName) {
      try {
        deleteWorkspace(deleteWorkspaceName);
        toast.success('Workspace deleted');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete workspace');
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={currentWorkspace} onValueChange={handleWorkspaceChange}>
          <SelectTrigger className="w-[140px] md:w-[180px]">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((workspace) => (
              <div key={workspace} className="flex items-center justify-between">
                <SelectItem value={workspace}>
                  {workspace}
                </SelectItem>
                {workspace !== 'default' && workspace === currentWorkspace && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={(e) => handleDeleteWorkspace(e, workspace)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 md:h-10 md:w-10"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <CreateWorkspaceDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleAddWorkspace}
      />

      <DeleteConfirmDialog
        isOpen={deleteWorkspaceName !== null}
        onClose={() => setDeleteWorkspaceName(null)}
        onConfirm={confirmDeleteWorkspace}
        title="Delete Workspace"
        message={`Are you sure you want to delete workspace "${deleteWorkspaceName}"? All notes in this workspace will be permanently deleted.`}
      />
    </>
  );
}
