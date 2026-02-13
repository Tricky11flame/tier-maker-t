/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Task, DragItem } from './types.ts';
import { cn } from '../utills/cn.ts';

interface KanbanTaskProps {
  task: Task;
  rowId: string;
  draggedItem: DragItem | null;
  onDragStart: (e: React.DragEvent, item: DragItem) => void;
  onUpdate: (newContent: string) => void;
  onContextMenu: (e: React.MouseEvent, taskId: string) => void;
  isSelected: boolean;
  onSelect: (taskId: string, rowId: string) => void;
  onMenuHoverChange: (isHovering: boolean) => void;
  isEditing: boolean; 
  onSetEditing: (isEditing: boolean) => void;
  isDarkMode?: boolean;
}

const getContrastColor = (color: string) => {
  if (!color || color === '#1f2937' || color === 'transparent') return 'white';

  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const rgb = window.getComputedStyle(temp).color; 
  document.body.removeChild(temp);

  const match = rgb.match(/\d+/g);
  if (!match) return 'white';

  const [r, g, b] = match.map(Number);
  // YIQ brightness formula: helps determine if text should be black or white
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

export const KanbanTask: React.FC<KanbanTaskProps> = ({ 
  task, rowId, draggedItem, onDragStart, onUpdate, onContextMenu,
  isSelected, onSelect, onMenuHoverChange,
  isEditing, onSetEditing,
  isDarkMode = true
}) => {
  const [editContent, setEditContent] = useState(task.content);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const contrastColor = useMemo(() => getContrastColor(task.color || ''), [task.color]);
  
  // Dynamic classes based on background luminance
  const textClass = contrastColor === 'black' ? 'text-gray-950' : 'text-white';
  const dotClass = contrastColor === 'black' ? 'text-black/50 hover:text-black' : 'text-white/60 hover:text-white';

  const isDragging = draggedItem?.type === 'TASK' && draggedItem.id === task.id;
  const isCustomColor = !!(task.color && task.color !== '#1f2937' && task.color !== 'transparent');

  useEffect(() => {
    setEditContent(task.content);
  }, [task.content]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editContent.trim() && editContent !== task.content) {
      onUpdate(editContent);
    }
    onSetEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditContent(task.content);
      onSetEditing(false);
    }
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, { type: 'TASK', id: task.id, sourceRow: rowId })}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditing) onSelect(task.id, rowId);
      }}
      style={isCustomColor ? { backgroundColor: task.color } : {}}
      className={cn(
        "shrink-0 w-48 h-24 p-3 rounded-xl border transition-all group relative",
        "shadow-sm cursor-pointer active:cursor-grabbing flex items-center justify-center text-center",
        // Theme split for default background
        !isCustomColor && (isDarkMode 
          ? "bg-gray-800 border-gray-700 text-gray-200" 
          : "bg-white border-neutral-200 text-gray-900 shadow-md hover:shadow-lg"),
        // Selection/Dragging states
        isDragging ? "opacity-20 border-dashed" : "opacity-100",
        isSelected ? "ring-4 ring-blue-500 border-blue-400 scale-105 z-10" : "hover:border-blue-300/50",
        // Apply contrast text if custom color is active
        isCustomColor && textClass
      )}
    >
      {!isEditing && (
        <button 
          onMouseEnter={() => onMenuHoverChange(true)}
          onMouseLeave={() => onMenuHoverChange(false)}
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, task.id);
          }}
          className={cn(
            "absolute top-2 right-2 p-1 rounded-lg transition-colors",
            isCustomColor 
              ? (contrastColor === 'black' ? "hover:bg-black/10" : "hover:bg-white/10")
              : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-neutral-100"),
            isCustomColor ? dotClass : "text-gray-500 hover:text-blue-500"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      )}

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full h-full bg-transparent resize-none outline-none text-sm text-center font-bold",
            isCustomColor ? textClass : (isDarkMode ? "text-white" : "text-gray-950")
          )}
        />
      ) : (
        <div className={cn(
          "text-sm font-bold pointer-events-none line-clamp-3 leading-tight tracking-tight px-1",
          isCustomColor ? textClass : (isDarkMode ? "text-gray-200" : "text-gray-800")
        )}>
          {task.content}
        </div>
      )}
    </div>
  );
};