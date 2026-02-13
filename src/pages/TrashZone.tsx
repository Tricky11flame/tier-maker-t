import React, { type DragEvent } from 'react';
import type { DragItem } from './types.ts';
import { cn } from '../utills/cn.ts';
import { LucideTrash2 } from 'lucide-react';

interface TrashZoneProps {
  isOverTrash: boolean;
  draggedItem: DragItem | null;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onLeave: () => void;
  isDarkMode?: boolean;
}

export const TrashZone: React.FC<TrashZoneProps> = ({ 
  isOverTrash, 
  draggedItem, 
  onDrop, 
  onDragOver, 
  onLeave, 
  isDarkMode = true 
}) => {
  
  const getTrashText = () => {
    if (!isOverTrash) return "Drop here to Delete";
    if (draggedItem?.type === 'ROW') return "Archive Tasks & Delete Row";
    return "Permanently Delete Task";
  };

  return (
    <div 
      className={cn(
        "mx-auto mb-8 w-72 h-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 gap-1",
        // Active "Over Trash" State
        isOverTrash 
          ? "border-red-500 bg-red-500/10 scale-105 shadow-xl ring-4 ring-red-500/20" 
          : (isDarkMode 
              ? "border-gray-800 bg-gray-900/50 text-gray-500" 
              : "border-neutral-200 bg-white text-neutral-400 shadow-sm"),
        // Show/Hide logic: Only show if something is being dragged
        draggedItem ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      onDragOver={onDragOver}
      onDragLeave={onLeave}
      onDrop={onDrop}
    >
      <LucideTrash2 
        size={18} 
        className={cn(
          "transition-transform duration-200",
          isOverTrash ? "text-red-500 scale-110" : "text-current"
        )} 
      />
      <span className={cn(
        "font-black text-[10px] uppercase tracking-[0.2em] text-center px-4 pointer-events-none",
        isOverTrash && "text-red-500"
      )}>
        {getTrashText()}
      </span>
    </div>
  );
};