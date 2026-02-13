import React, { useState, type DragEvent } from 'react';
import type { Task, DragItem, DropTarget } from './types';
import { KanbanTask } from './KanbanTask';
import { cn } from '../utills/cn.ts';

interface KanbanRowProps {
  rowId: string;
  tasks: Task[];
  activeDrop: DropTarget | null;
  draggedItem: DragItem | null;
  isBacklog?: boolean;
  onDragStart: (e: DragEvent, item: DragItem) => void;
  onDragOverRow: (e: DragEvent, rowId: string) => void;
  onToggleInput?: (dir: 'up' | 'down') => void;
  onWipe?: () => void;
  onUpdateTask: (id: string, content: string) => void;
  onContextMenu: (e: React.MouseEvent, taskId: string) => void;
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string, rowId: string) => void;
  onRowClick: (rowId: string) => void;
  onMenuHoverChange: (isHovering: boolean) => void;
  editingTaskId: string | null;
  onSetEditingTaskId: (id: string | null) => void;
  isDarkMode?: boolean;
}

export const KanbanRow: React.FC<KanbanRowProps> = ({
  rowId, tasks, activeDrop, draggedItem, isBacklog = false,
  onDragStart, onDragOverRow, onToggleInput, onWipe,
  onUpdateTask, onContextMenu,
  selectedTaskId, onTaskSelect, onRowClick,
  onMenuHoverChange, editingTaskId, onSetEditingTaskId,
  isDarkMode = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRowDragging = draggedItem?.type === 'ROW' && draggedItem.id === rowId;

  return (
    <div 
      className={cn(
        "flex flex-col gap-2 transition-all duration-300",
        isRowDragging ? "opacity-20 scale-95" : "opacity-100"
      )} 
      data-row-id={rowId}
    >
      {/* HEADER */}
      {!isBacklog && (
        <div className="flex items-center gap-2 pl-1 group">
          <div 
            draggable 
            onDragStart={(e) => onDragStart(e, { type: 'ROW', id: rowId })} 
            className={cn(
              "cursor-grab px-1 transition-colors",
              isDarkMode ? "text-gray-700 hover:text-gray-400" : "text-neutral-300 hover:text-neutral-500"
            )}
          >
            ⋮⋮
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center gap-2 rounded px-2 py-0.5 transition-colors",
              isDarkMode ? "hover:bg-gray-900" : "hover:bg-neutral-200"
            )}
          >
             <span className={cn(
               "text-[10px] transition-transform duration-200",
               isDarkMode ? "text-gray-600" : "text-neutral-400",
               isCollapsed ? "-rotate-90" : "rotate-0"
             )}>▼</span>
             <h2 className={cn(
               "text-xs font-black uppercase tracking-widest select-none",
               isDarkMode ? "text-gray-500" : "text-neutral-500"
             )}>{rowId}</h2>
             {isCollapsed && (
               <span className={cn(
                 "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                 isDarkMode ? "bg-gray-800 text-gray-500" : "bg-neutral-200 text-neutral-600"
               )}>
                 {tasks.length}
               </span>
             )}
          </button>
          
          {!isCollapsed && (
            <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity items-center">
              <button 
                onClick={() => onToggleInput?.('up')} 
                className={cn(
                  "px-2 text-[10px] font-bold border rounded transition-colors",
                  isDarkMode ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700" : "bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50 shadow-sm"
                )}
              >
                ↑
              </button>
              <button 
                onClick={() => onToggleInput?.('down')} 
                className={cn(
                  "px-2 text-[10px] font-bold border rounded transition-colors",
                  isDarkMode ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700" : "bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50 shadow-sm"
                )}
              >
                ↓
              </button>
              <button 
                onDoubleClick={onWipe} 
                className={cn(
                  "ml-2 px-2 text-[10px] font-bold border rounded transition-all",
                  isDarkMode 
                    ? "bg-gray-950 border-red-900/30 text-red-500/50 hover:bg-red-900/20 hover:text-red-400" 
                    : "bg-white border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 shadow-sm"
                )}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* TASK LIST AREA */}
      <div
        onClick={() => onRowClick(rowId)}
        className={cn(
          "flex items-center gap-3 rounded-2xl transition-all duration-500 ease-in-out scrollbar-hide",
          isDarkMode 
            ? (isBacklog ? "bg-gray-900/20 border border-gray-900" : "bg-gray-900/40 border border-gray-800 shadow-inner") 
            : (isBacklog ? "bg-neutral-100 border border-neutral-200" : "bg-white border border-neutral-200 shadow-sm"),
          isCollapsed ? "h-0 p-0 overflow-hidden border-0 opacity-0" : "p-4 min-h-[140px] overflow-x-auto opacity-100",
          selectedTaskId ? "ring-2 ring-blue-500/20 ring-offset-2 border-blue-500/50" : ""
        )}
        onDragOver={(e) => onDragOverRow(e, rowId)}
      >
        {!isCollapsed && tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            {activeDrop?.type === 'TASK' && activeDrop.row === rowId && activeDrop.index === index && (
              <div className="w-1.5 h-20 bg-blue-500 rounded-full animate-pulse flex-shrink-0 mx-1" />
            )}
            
            <KanbanTask 
              isDarkMode={isDarkMode}
              task={task} 
              rowId={rowId} 
              draggedItem={draggedItem} 
              onDragStart={onDragStart}
              onUpdate={(newContent) => onUpdateTask(task.id, newContent)}
              onContextMenu={onContextMenu}
              isEditing={editingTaskId === task.id}
              onSetEditing={(isEditing) => onSetEditingTaskId(isEditing ? task.id : null)}
              onMenuHoverChange={onMenuHoverChange}
              isSelected={selectedTaskId === task.id}
              onSelect={onTaskSelect}
            />
          </React.Fragment>
        ))}

        {!isCollapsed && activeDrop?.type === 'TASK' && activeDrop.row === rowId && activeDrop.index === tasks.length && (
          <div className="w-1.5 h-20 bg-blue-500 rounded-full animate-pulse flex-shrink-0 mx-1" />
        )}
      </div>
    </div>
  );
};