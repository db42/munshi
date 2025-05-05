import React from 'react';
import { Button } from './button';
import { Pencil, Save, X } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';

interface EditModeToggleButtonProps {
  onSave?: () => Promise<void>;
}

export const EditModeToggleButton: React.FC<EditModeToggleButtonProps> = ({ onSave }) => {
  const { isEditMode, toggleEditMode, hasUnsavedChanges } = useEditMode();

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave();
        toggleEditMode();
      } catch (error) {
        console.error('Error saving data:', error);
        // Show error message to user - could be enhanced with a toast notification
        alert('Failed to save changes. Please try again.');
      }
    } else {
      toggleEditMode();
    }
  };

  if (!isEditMode) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleEditMode}
        className="flex items-center gap-1"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleSave}
        disabled={onSave ? !hasUnsavedChanges : false}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleEditMode}
        className="flex items-center gap-1"
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
}; 