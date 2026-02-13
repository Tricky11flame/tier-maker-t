/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router'; // or 'next/navigation'
import React, { useState, useRef, type DragEvent, useEffect } from 'react';
import type { Rows, DragItem, DropTarget } from './types';
import { KanbanRow } from './KanbanRow';
import { TrashZone } from './TrashZone';
import { InlineInput } from './InlineInput';
import { ContextMenu } from './ContextMenu';
import { cn } from '../utills/cn.ts';
import { LucideSun, LucideMoon, LucideCheckCircle, LucideSave, LucideAlertCircle, LucideLoader2, LucideCheck, LucideShare2 } from 'lucide-react';
import { KanbanBackground } from './Background.tsx';
// import { Database, RefreshCcw, Check, AlertTriangle } from 'lucide-react';
const initialData: Rows = {
  todo: [{ id: '1', content: 'Double click to edit me!' }],
  doing: [],
  done: [],
  unassigned: [{ id: '4', content: 'Click the dots for menu!' }]
};

// Status tracking for UX feedback
// type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

export default function KanbanBoard() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>(); // e.g., /board/123 -> id = "123"
  const [rows, setRows] = useState<Rows>(initialData);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // AUTOMATIC FETCH ON LOAD
  useEffect(() => {
  const autoFetch = async () => {
    // 1. Guard: If ID is missing, don't even try.
    if (!id || id === "undefined") {
      console.log("undefined")
      return;
    }

    setSyncStatus('loading');
    try {
      const url = `${API_BASE}/kanban/${id}`;
      const res = await fetch(url);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📦 Data received from DB:", data);
        
        // 2. Ensure data isn't empty before setting state
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setRows(data);
          setSyncStatus('idle');
        }
      } else {
        console.log(`⚠️ Server responded with ${res.status}. Keeping initial layout.`);
        setSyncStatus('idle');
      }
    } catch (e) {
      console.error("❌ Network error during fetch:", e);
      setSyncStatus('error');
    }
  };

  autoFetch();
}, []); // Dependencies are critical here

  // SAVE HANDLER FOR THE BUTTON
  const handleSave = async () => {
    setSyncStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/kanban/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      if (!res.ok) throw new Error();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e) {
      setSyncStatus('error');
    }
  };
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Captures the exact URL from the address bar
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      
      // Reset icon after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };


  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [activeDrop, setActiveDrop] = useState<DropTarget | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [activeRowInput, setActiveRowInput] = useState<{ rowId: string; direction: 'up' | 'down' } | null>(null);
  const [newRowName, setNewRowName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // --- THEME HANDLER ---
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  // --- HOVER TIMER LOGIC ---
  const handleMenuHoverChange = (isHovering: boolean) => {
    if (isHovering) {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    } else {
      menuTimeoutRef.current = setTimeout(() => setMenu(null), 300);
    }
  };
  // --- MOVE LOGIC ---
  const moveTask = (taskId: string, targetRowId: string, targetIndex: number) => {
    setRows(prev => {
      const next = { ...prev };
      const sourceRowId = Object.keys(next).find(k => next[k].some(t => t.id === taskId));
      if (!sourceRowId) return prev;
      const sourceList = [...next[sourceRowId]];
      const taskIdx = sourceList.findIndex(t => t.id === taskId);
      const [task] = sourceList.splice(taskIdx, 1);
      if (sourceRowId === targetRowId) {
        const adjIndex = targetIndex > taskIdx ? targetIndex - 1 : targetIndex;
        sourceList.splice(adjIndex, 0, task);
        next[sourceRowId] = sourceList;
      } else {
        const targetList = [...next[targetRowId]];
        targetList.splice(targetIndex, 0, task);
        next[targetRowId] = targetList;
        next[sourceRowId] = sourceList;
      }
      return next;
    });
  };
  // --- TASK & ROW HANDLERS ---
  const handleTaskSelect = (taskId: string, rowId: string) => {
    if (!selectedTaskId) setSelectedTaskId(taskId);
    else if (selectedTaskId === taskId) setSelectedTaskId(null); 
    else {
      const targetIndex = rows[rowId].findIndex(t => t.id === taskId);
      moveTask(selectedTaskId, rowId, targetIndex);
      setSelectedTaskId(null);
    }
  };
  const handleRowClick = (rowId: string) => {
    if (!selectedTaskId) return;
    moveTask(selectedTaskId, rowId, rows[rowId].length);
    setSelectedTaskId(null);
  };
  const handleUpdateTask = (taskId: string, newContent: string) => {
    setRows(prev => {
      const next = { ...prev };
      for (const r in next) {
        next[r] = next[r].map(t => t.id === taskId ? { ...t, content: newContent } : t);
      }
      return next;
    });
  };
  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ id: taskId, x: rect.left, y: rect.bottom });
  };
  const executeMenuAction = (action: 'DUPLICATE' | 'DELETE' | 'COLOR', payload?: any) => {
    if (!menu) return;
    const { id } = menu;
    setRows(prev => {
      const next = { ...prev };
      const rowId = Object.keys(next).find(k => next[k].some(t => t.id === id));
      if (!rowId) return prev;
      if (action === 'DELETE') next[rowId] = next[rowId].filter(t => t.id !== id);
      else if (action === 'DUPLICATE') {
        const idx = next[rowId].findIndex(t => t.id === id);
        const task = next[rowId][idx];
        const newList = [...next[rowId]];
        newList.splice(idx + 1, 0, { ...task, id: Date.now().toString(), content: `${task.content} (Copy)` });
        next[rowId] = newList;
      } else if (action === 'COLOR') {
        next[rowId] = next[rowId].map(t => t.id === id ? { ...t, color: payload } : t);
      }
      return next;
    });
    setMenu(null);
  };
  const createUntitledRow = () => {
    setRows(prev => {
      let name = "Untitled"; let counter = 2;
      while (prev[name]) { name = `Untitled ${counter}`; counter++; }
      const entries = Object.entries(prev);
      const un = entries.find(([k]) => k === 'unassigned');
      const others = entries.filter(([k]) => k !== 'unassigned');
      return { ...Object.fromEntries(others), [name]: [], unassigned: un ? un[1] : [] };
    });
  };
  const wipeRow = (id: string) => setRows(prev => ({ ...prev, [id]: [] }));
  const submitNewRow = () => {
    if (!newRowName.trim() || !activeRowInput) return;
    const entries = Object.entries(rows);
    const idx = entries.findIndex(([k]) => k === activeRowInput.rowId);
    entries.splice(activeRowInput.direction === 'up' ? idx : idx + 1, 0, [newRowName, []]);
    setRows(Object.fromEntries(entries));
    setNewRowName(""); setActiveRowInput(null);
  };
  // --- DRAG LOGIC ---
  const onDragStart = (e: DragEvent, item: DragItem) => {
    setDraggedItem(item); setSelectedTaskId(null);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };
  const onDragOverContainer = (e: DragEvent) => {
    e.preventDefault();
    if (draggedItem?.type === 'ROW') {
      const children = Array.from((e.currentTarget as HTMLElement).querySelectorAll('[data-row-id]'));
      let index = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) { index = i; break; }
      }
      if (!activeDrop || activeDrop.index !== index) setActiveDrop({ type: 'ROW', index });
    }
  };
  const onDragOverRow = (e: DragEvent, rowId: string) => {
    if (draggedItem?.type === 'TASK') {
      e.preventDefault(); e.stopPropagation();
      const children = Array.from((e.currentTarget as HTMLElement).querySelectorAll('[data-task-id]'));
      let index = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (e.clientX < rect.left + rect.width / 2) { index = i; break; }
      }
      if (!activeDrop || activeDrop.type !== 'TASK' || (activeDrop as any).row !== rowId || activeDrop.index !== index) {
        setActiveDrop({ type: 'TASK', row: rowId, index } as any);
      }
    }
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (activeDrop?.type === 'ROW' && draggedItem?.type === 'ROW') {
      const entries = Object.entries(rows);
      const oldIdx = entries.findIndex(([k]) => k === draggedItem.id);
      const [moved] = entries.splice(oldIdx, 1);
      entries.splice(activeDrop.index > oldIdx ? activeDrop.index - 1 : activeDrop.index, 0, moved);
      setRows(Object.fromEntries(entries));
    } else if (activeDrop?.type === 'TASK' && draggedItem?.type === 'TASK') {
      moveTask(draggedItem.id, (activeDrop as any).row, activeDrop.index);
    }
    setDraggedItem(null); setActiveDrop(null); setIsOverTrash(false);
  };
  const sortedRowKeys = Object.keys(rows).filter(k => k !== 'unassigned');

  return (
    <div 
      className={cn(
        "flex flex-col p-8 min-h-screen transition-colors duration-500 font-sans relative",
        isDarkMode ? " text-gray-100" : " text-gray-900"
        ,"w-5/6 mx-auto"
      )} 
      onDragOver={onDragOverContainer} 
      onDrop={onDrop}
    >
      <KanbanBackground isDarkMode={isDarkMode}/>
      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={toggleTheme}
        className={cn(
          "fixed z-[200] top-4 left-4 p-2 rounded-full border transition-all active:scale-90",
          isDarkMode 
            ? "bg-gray-900 border-gray-700 text-yellow-400 hover:bg-gray-800" 
            : "bg-white border-neutral-300 text-indigo-600 hover:bg-neutral-100 shadow-lg"
        )}
      >
        {isDarkMode ? <LucideSun size={20} /> : <LucideMoon size={20} />}
      </button>

      {/* SYNC BUTTON */}
      <button
        onClick={handleSave}
        disabled={syncStatus === 'loading'}
        className={cn(
          "fixed z-[200] top-4 left-16 p-2 rounded-full border transition-all active:scale-90 flex items-center justify-center",
          isDarkMode 
            ? "bg-gray-900 border-gray-700 text-emerald-400 hover:bg-gray-800" 
            : "bg-white border-neutral-300 text-emerald-600 hover:bg-neutral-100 shadow-lg",
          syncStatus === 'error' && "border-red-500 text-red-500",
          syncStatus === 'loading' && "opacity-50 cursor-not-allowed"
        )}
        title="Save to MongoDB"
      >
        {syncStatus === 'loading' ? (
          <LucideLoader2 size={20} className="animate-spin" />
        ) : syncStatus === 'error' ? (
          <LucideAlertCircle size={20} />
        ) : syncStatus === 'success' ? (
          <LucideCheckCircle size={20} />
        ) : (
          <LucideSave size={20} />
        )}
      </button>

      <button
        onClick={handleShare}
        className={cn(
          "fixed z-[200] top-4 left-28 p-2 rounded-full border transition-all active:scale-90 flex items-center justify-center",
          isDarkMode 
            ? "bg-gray-900 border-gray-700 text-blue-400 hover:bg-gray-800" 
            : "bg-white border-neutral-300 text-blue-600 hover:bg-neutral-100 shadow-lg",
          copied && "border-emerald-500 text-emerald-500"
        )}
        title="Copy Board URL"
      >
        {copied ? (
          <LucideCheck size={20} className="animate-in zoom-in duration-200" />
        ) : (
          <LucideShare2 size={20} />
        )}
      </button>
      {menu && (
        <div onMouseEnter={() => handleMenuHoverChange(true)} onMouseLeave={() => handleMenuHoverChange(false)}>
          <ContextMenu
            isDarkMode={isDarkMode}
            x={menu.x} y={menu.y} 
            currentColor={Object.values(rows).flat().find(t => t.id === menu.id)?.color || ''}
            onClose={() => setMenu(null)}
            onEdit={() => { setEditingTaskId(menu.id); setMenu(null); }}
            onDuplicate={() => executeMenuAction('DUPLICATE')}
            onDelete={() => executeMenuAction('DELETE')}
            onColor={(c) => executeMenuAction('COLOR', c)}
          />
        </div>
      )}

      <TrashZone 
        isDarkMode={isDarkMode} 
        isOverTrash={isOverTrash} 
        draggedItem={draggedItem} 
        onDragOver={(e) => { e.preventDefault(); setIsOverTrash(true); }} 
        onLeave={() => setIsOverTrash(false)} 
        onDrop={(e) => {
          e.preventDefault(); e.stopPropagation();
          if (draggedItem?.type === 'TASK') {
            setRows(prev => ({ ...prev, [draggedItem.sourceRow]: prev[draggedItem.sourceRow].filter(t => t.id !== draggedItem.id) }));
          } else if (draggedItem?.type === 'ROW' && draggedItem.id !== 'unassigned') {
            setRows(prev => {
              const n = { ...prev };
              n.unassigned = [...n.unassigned, ...n[draggedItem.id]];
              delete n[draggedItem.id]; return n;
            });
          }
          setDraggedItem(null); setIsOverTrash(false);
        }} 
      />

      <div className="flex flex-col gap-6">
        {sortedRowKeys.map((rowId, rowIndex) => (
          <React.Fragment key={rowId}>
            {activeDrop?.type === 'ROW' && activeDrop.index === rowIndex && <div className="h-1 w-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
            {activeRowInput?.rowId === rowId && activeRowInput.direction === 'up' && <InlineInput isDarkMode={isDarkMode} value={newRowName} onChange={setNewRowName} onSubmit={submitNewRow} onCancel={()=>setActiveRowInput(null)} />}
            
            <KanbanRow 
              isDarkMode={isDarkMode} rowId={rowId} tasks={rows[rowId]} activeDrop={activeDrop} draggedItem={draggedItem}
              onDragStart={onDragStart} onDragOverRow={onDragOverRow}
              onToggleInput={(dir) => setActiveRowInput({ rowId, direction: dir })}
              onWipe={() => wipeRow(rowId)}
              onUpdateTask={handleUpdateTask}
              onContextMenu={handleContextMenu}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
              onRowClick={handleRowClick}
              onMenuHoverChange={handleMenuHoverChange}
              editingTaskId={editingTaskId}
              onSetEditingTaskId={setEditingTaskId}
            />

            {activeRowInput?.rowId === rowId && activeRowInput.direction === 'down' && <InlineInput isDarkMode={isDarkMode} value={newRowName} onChange={setNewRowName} onSubmit={submitNewRow} onCancel={()=>setActiveRowInput(null)} />}
          </React.Fragment>
        ))}
        {activeDrop?.type === 'ROW' && activeDrop.index === sortedRowKeys.length && <div className="h-1 w-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
      </div>

      <div className="mt-6">
        <button 
          onClick={createUntitledRow} 
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all border-2 border-dashed",
            isDarkMode 
              ? "text-gray-500 border-gray-800 hover:text-blue-400 hover:border-blue-900/50 hover:bg-gray-900/50" 
              : "text-neutral-400 border-neutral-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
          )}
        >
          + Add Section
        </button>
      </div>

      <div className={cn("mt-auto border-t-2 border-dashed pt-8", isDarkMode ? "border-gray-900" : "border-neutral-200")}>
         <div className="flex items-center gap-4 mb-4">
            <h2 className={cn("font-black uppercase tracking-tighter text-2xl", isDarkMode ? "text-gray-800" : "text-neutral-300")}>Backlog</h2>
            <form onSubmit={(e) => { e.preventDefault(); if(newTaskText.trim()) { setRows(prev => ({ ...prev, unassigned: [...prev.unassigned, { id: Date.now().toString(), content: newTaskText }] })); setNewTaskText(""); } }} className="flex-1">
              <input 
                className={cn(
                  "border rounded-xl px-4 py-2 text-sm w-full outline-none transition-all",
                  isDarkMode 
                    ? "bg-gray-900 border-gray-800 text-white focus:border-blue-500" 
                    : "bg-white border-neutral-200 text-gray-900 focus:border-indigo-500 shadow-sm"
                )} 
                value={newTaskText} 
                onChange={e=>setNewTaskText(e.target.value)} 
                placeholder="What needs to be done?" 
              />
            </form>
         </div>
         <KanbanRow 
           isDarkMode={isDarkMode} rowId="unassigned" tasks={rows.unassigned} 
           activeDrop={activeDrop} draggedItem={draggedItem} 
           onDragStart={onDragStart} onDragOverRow={onDragOverRow} 
           isBacklog={true} onUpdateTask={handleUpdateTask} 
           onContextMenu={handleContextMenu}
           selectedTaskId={selectedTaskId}
           onTaskSelect={handleTaskSelect}
           onRowClick={handleRowClick}
           onMenuHoverChange={handleMenuHoverChange}
           editingTaskId={editingTaskId}
           onSetEditingTaskId={setEditingTaskId}
         />
      </div>
    </div>
  );
}