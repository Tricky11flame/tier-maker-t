/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, type DragEvent } from 'react';
// ... (Types remain same) ...
type Task = { id: string; content: string };
type Rows = { [key: string]: Task[] };
// type DragType = 'ROW' | 'TASK';
type DragItem = { type: 'ROW'; id: string } | { type: 'TASK'; id: string; sourceRow: string };
type DropTarget = { type: 'ROW'; index: number } | { type: 'TASK'; row: string; index: number };

const initialData: Rows = {
  todo: [{ id: '1', content: 'Design DB' }],
  doing: [],
  done: [],
  unassigned: [{ id: '4', content: 'Backlog Item' }]
};

export default function HorizontalKanban() {
  const [rows, setRows] = useState<Rows>(initialData);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [activeDrop, setActiveDrop] = useState<DropTarget | null>(null);
  const [activeRowInput, setActiveRowInput] = useState<{ rowId: string; direction: 'up' | 'down' } | null>(null);
  const [newRowName, setNewRowName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [isOverTrash, setIsOverTrash] = useState(false);

  // --- NEW: AUTO-CREATE ROW LOGIC ---
  const createUntitledRow = () => {
    setRows(prev => {
      // 1. Find a unique name
      let name = "Untitled";
      let counter = 2;
      while (prev[name]) {
        name = `Untitled ${counter}`;
        counter++;
      }

      // 2. Insert it BEFORE 'unassigned' to keep backlog at bottom
      const entries = Object.entries(prev);
      const unassignedEntry = entries.find(([key]) => key === 'unassigned');
      const otherEntries = entries.filter(([key]) => key !== 'unassigned');

      // 3. Reconstruct
      return {
        ...Object.fromEntries(otherEntries),
        [name]: [], // The new empty row
        ...(unassignedEntry ? { unassigned: unassignedEntry[1] } : { unassigned: [] })
      };
    });
  };

  // --- EXISTING LOGIC (Unchanged) ---
  const wipeRow = (rowId: string) => {
    if (!confirm(`Permanently delete all tasks in "${rowId}"?`)) return;
    setRows(prev => ({ ...prev, [rowId]: [] }));
  };

  const onTrashDrop = (e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!draggedItem) return;
    if (draggedItem.type === 'TASK') {
      setRows(prev => {
        const newRows = { ...prev };
        newRows[draggedItem.sourceRow] = newRows[draggedItem.sourceRow].filter(t => t.id !== draggedItem.id);
        return newRows;
      });
    }
    if (draggedItem.type === 'ROW') {
      if (draggedItem.id === 'unassigned') return;
      setRows(prev => {
        const newRows = { ...prev };
        const rowTasks = newRows[draggedItem.id] || [];
        newRows.unassigned = [...newRows.unassigned, ...rowTasks];
        delete newRows[draggedItem.id];
        return newRows;
      });
    }
    cleanup();
  };

  const handleTaskDrop = (targetRow: string, targetIndex: number) => {
    if (!draggedItem || draggedItem.type !== 'TASK') return;
    setRows(prev => {
      const newRows = { ...prev };
      const sourceList = [...newRows[draggedItem.sourceRow]];
      const taskIdx = sourceList.findIndex(t => t.id === draggedItem.id);
      if (taskIdx === -1) return prev;
      const [task] = sourceList.splice(taskIdx, 1);
      if (draggedItem.sourceRow === targetRow) {
        const adjustedIndex = targetIndex > taskIdx ? targetIndex - 1 : targetIndex;
        sourceList.splice(adjustedIndex, 0, task);
        newRows[targetRow] = sourceList;
      } else {
        const targetList = [...newRows[targetRow]];
        targetList.splice(targetIndex, 0, task);
        newRows[targetRow] = targetList;
        newRows[draggedItem.sourceRow] = sourceList;
      }
      return newRows;
    });
  };

  const handleRowDrop = (targetIndex: number) => {
    if (!draggedItem || draggedItem.type !== 'ROW') return;
    setRows(prev => {
      const entries = Object.entries(prev);
      const oldIndex = entries.findIndex(([key]) => key === draggedItem.id);
      const [movedEntry] = entries.splice(oldIndex, 1);
      const adjustedIndex = targetIndex > oldIndex ? targetIndex - 1 : targetIndex;
      entries.splice(adjustedIndex, 0, movedEntry);
      return Object.fromEntries(entries);
    });
  };

  const onDragStart = (e: DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.stopPropagation();
  };

  const onDragOverContainer = (e: DragEvent) => {
    e.preventDefault();
    if (draggedItem?.type === 'ROW') {
      const container = e.currentTarget as HTMLDivElement;
      const children = Array.from(container.querySelectorAll('[data-row-id]'));
      let index = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) { index = i; break; }
      }
      if (!activeDrop || activeDrop.type !== 'ROW' || activeDrop.index !== index) setActiveDrop({ type: 'ROW', index });
    }
  };

  const onDragOverRow = (e: DragEvent, rowId: string) => {
    if (draggedItem?.type === 'TASK') {
      e.preventDefault(); e.stopPropagation();
      const rowEl = e.currentTarget as HTMLDivElement;
      const children = Array.from(rowEl.querySelectorAll('[data-task-id]'));
      let index = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (e.clientX < rect.left + rect.width / 2) { index = i; break; }
      }
      if (!activeDrop || activeDrop.type !== 'TASK' || activeDrop.row !== rowId || activeDrop.index !== index) setActiveDrop({ type: 'TASK', row: rowId, index });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (activeDrop?.type === 'ROW') handleRowDrop(activeDrop.index);
    else if (activeDrop?.type === 'TASK') handleTaskDrop(activeDrop.row, activeDrop.index);
    cleanup();
  };

  const cleanup = () => {
    setDraggedItem(null); setActiveDrop(null); setIsOverTrash(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setRows(prev => ({ ...prev, unassigned: [...prev.unassigned, { id: Date.now().toString(), content: newTaskText }] }));
    setNewTaskText("");
  };

  const submitNewRow = () => {
    if (!newRowName.trim() || !activeRowInput) return;
    if (rows[newRowName]) { alert("Exists!"); return; }
    setRows(prev => {
      const entries = Object.entries(prev);
      const index = entries.findIndex(([key]) => key === activeRowInput.rowId);
      const newEntry: [string, Task[]] = [newRowName, []];
      const insertAt = activeRowInput.direction === 'up' ? index : index + 1;
      entries.splice(insertAt, 0, newEntry);
      return Object.fromEntries(entries);
    });
    setNewRowName(""); setActiveRowInput(null);
  };

  const sortedRowKeys = Object.keys(rows).filter(k => k !== 'unassigned');
  const getTrashText = () => (!isOverTrash ? "Drop here to Delete/Archive" : draggedItem?.type === 'ROW' ? "Archive Tasks & Delete Row" : "Permanently Delete Task");

  return (
    <div className="flex flex-col p-8 min-h-screen bg-gray-950 text-gray-100 font-sans relative" onDragOver={onDragOverContainer} onDrop={onDrop}>
      
      {/* DELETE ZONE */}
      <div 
        className={`mx-auto mb-8 w-64 h-24 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-200
                   ${isOverTrash ? 'border-red-500 bg-red-500/20 scale-110' : 'border-gray-700 bg-gray-900 text-gray-500'}`}
        onDragOver={(e) => { e.preventDefault(); setIsOverTrash(true); }}
        onDragLeave={() => setIsOverTrash(false)}
        onDrop={onTrashDrop}
      >
        <span className="font-bold text-xs uppercase tracking-widest text-center px-4">{getTrashText()}</span>
      </div>

      <div className="flex flex-col gap-6">
        {sortedRowKeys.map((rowId, rowIndex) => (
          <React.Fragment key={rowId}>
            {activeDrop?.type === 'ROW' && activeDrop.index === rowIndex && <div className="h-1 w-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
            {activeRowInput?.rowId === rowId && activeRowInput.direction === 'up' && <InlineInput value={newRowName} onChange={setNewRowName} onSubmit={submitNewRow} onCancel={()=>setActiveRowInput(null)} />}
            
            <Row 
              rowId={rowId} tasks={rows[rowId]} activeDrop={activeDrop} draggedItem={draggedItem}
              onDragStart={onDragStart} onDragOverRow={onDragOverRow} onToggleInput={(dir) => setActiveRowInput({ rowId, direction: dir })}
              onWipe={() => wipeRow(rowId)}
            />
            
            {activeRowInput?.rowId === rowId && activeRowInput.direction === 'down' && <InlineInput value={newRowName} onChange={setNewRowName} onSubmit={submitNewRow} onCancel={()=>setActiveRowInput(null)} />}
          </React.Fragment>
        ))}
        {activeDrop?.type === 'ROW' && activeDrop.index === sortedRowKeys.length && <div className="h-1 w-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
      </div>

      {/* --- NEW: THE "CREATE ROW" BUTTON --- */}
      {/* Places itself dynamically between standard rows and backlog */}
      <div className="mt-6 mb-2">
        <button 
          onClick={createUntitledRow}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-400 hover:bg-gray-900 rounded transition-colors w-full border border-transparent hover:border-gray-800 border-dashed"
        >
          <span className="text-lg leading-none">+</span> Create New Row
        </button>
      </div>

      {/* UNASSIGNED BACKLOG */}
      <div className="mt-auto border-t-2 border-dashed border-gray-800 pt-6">
         <div className="flex items-center gap-4 mb-4">
            <h2 className="text-gray-400 font-bold uppercase">Backlog</h2>
            <form onSubmit={handleAddItem} className="flex-1"><input className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-sm w-full outline-none" value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} placeholder="Add task..." /></form>
         </div>
         <Row rowId="unassigned" tasks={rows.unassigned} activeDrop={activeDrop} draggedItem={draggedItem} onDragStart={onDragStart} onDragOverRow={onDragOverRow} isBacklog={true} />
      </div>
    </div>
  );
}

// ... (Sub-components Row and InlineInput remain exactly the same) ...
const Row = ({ rowId, tasks, activeDrop, draggedItem, onDragStart, onDragOverRow, onToggleInput, onWipe, isBacklog }: any) => {
  return (
    <div className={`flex flex-col gap-2 ${draggedItem?.type === 'ROW' && draggedItem.id === rowId ? 'opacity-20' : 'opacity-100'}`} data-row-id={rowId}>
      {!isBacklog && (
        <div className="flex items-center gap-2 pl-1 group">
          <div draggable onDragStart={(e) => onDragStart(e, { type: 'ROW', id: rowId })} className="cursor-grab text-gray-600 hover:text-gray-300 px-1">⋮⋮</div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">{rowId}</h2>
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity items-center">
            <button onClick={() => onToggleInput('up')} className="px-2 text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded hover:bg-gray-700">↑</button>
            <button onClick={() => onToggleInput('down')} className="px-2 text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded hover:bg-gray-700">↓</button>
            <button onClick={onWipe} className="ml-2 px-2 text-xs bg-gray-900 border border-red-900/30 text-red-500/50 rounded hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/50 transition-all" title="Clear all tasks in this row">Clear</button>
          </div>
        </div>
      )}
      <div className={`flex items-center gap-3 rounded-xl p-4 min-h-[120px] overflow-x-auto transition-colors ${isBacklog ? 'bg-gray-900/30 border border-gray-800' : 'bg-gray-900/50 border border-gray-700'}`} onDragOver={(e) => onDragOverRow(e, rowId)}>
        {tasks.map((task: Task, index: number) => (
          <React.Fragment key={task.id}>
            {activeDrop?.type === 'TASK' && activeDrop.row === rowId && activeDrop.index === index && <div className="w-1 h-16 bg-blue-500 rounded animate-pulse flex-shrink-0" />}
            <div draggable data-task-id={task.id} onDragStart={(e) => onDragStart(e, { type: 'TASK', id: task.id, sourceRow: rowId })} className={`flex-shrink-0 w-48 h-24 bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm cursor-grab active:cursor-grabbing flex items-center justify-center text-center hover:border-gray-500 transition-all ${draggedItem?.type === 'TASK' && draggedItem.id === task.id ? 'opacity-20 border-dashed' : 'opacity-100'}`}>
              <div className="text-sm font-medium text-gray-200">{task.content}</div>
            </div>
          </React.Fragment>
        ))}
        {activeDrop?.type === 'TASK' && activeDrop.row === rowId && activeDrop.index === tasks.length && <div className="w-1 h-16 bg-blue-500 rounded animate-pulse flex-shrink-0" />}
      </div>
    </div>
  );
};

const InlineInput = ({ value, onChange, onSubmit, onCancel }: any) => (
  <div className="pl-8 mb-2"><input autoFocus type="text" value={value} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') onSubmit(); if(e.key==='Escape') onCancel();}} className="bg-gray-800 border-b-2 border-blue-500 text-gray-100 text-sm py-1 px-2 w-64 outline-none" placeholder="Row Name..." /></div>
);