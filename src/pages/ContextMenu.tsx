/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useLayoutEffect, useRef, useState } from 'react';
import ColorPicker from './ColorPicker'; // Import your component
import { LucideCopy, LucidePenLine, LucideTrash } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  currentColor: string; // Pass the current task color
  onEdit: () => void;
  onDuplicate: () => void;
  onClose: () => void;
  onDelete: () => void;
  onColor: (color: string) => void;
  isDarkMode?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, y, currentColor, onEdit, onDuplicate, onDelete, onColor,
  isDarkMode
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: y, left: x });
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const margin = 12;

      let finalLeft = x;
      let finalTop = y;

      if (x + rect.width > screenW) {
        finalLeft = Math.max(margin, screenW - rect.width - margin);
      }
      
      // Since ColorPicker makes the menu taller, this check is vital
      if (y + rect.height > screenH) {
        finalTop = Math.max(margin, y - rect.height - 10);
      }

      setCoords({ top: finalTop, left: finalLeft });
      setIsReady(true);
    }
  }, [x, y]);

  return (
    <div 
      ref={menuRef}
      style={{ 
        top: coords.top, 
        left: coords.left,
        opacity: isReady ? 1 : 0,
        transform: isReady ? 'scale(1)' : 'scale(0.95)',
        pointerEvents: isReady ? 'auto' : 'none'
      }}
      className="fixed z-[100] w-56 bg-gray-950 border border-neutral-800 rounded-xl shadow-2xl py-2 transition-all duration-75 ease-out"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex flex-col px-1">
        <div className='flex text-neutral-300'>
          <button onClick={onEdit} className="my-auto text-left p-1   hover:bg-blue-400/60 rounded-md text-blue-200 transition-colors">
            <LucidePenLine size={16}/>
          </button>
          <button onClick={onDuplicate} className="text-left p-1 hover:bg-green-400/60 rounded-md text-green-200 transition-colors">
            <LucideCopy size={16} />
          </button>
          <div className='flex-1'></div>
          <button 
            onClick={onDelete} 
            className="text-left p-1 text-sm text-red-200 hover:bg-red-400/60 rounded-md transition-colors font-medium"
          >
            <LucideTrash size={16}/>
          </button>
        </div>
        
        {/* INTEGRATED COLOR PICKER */}
        <ColorPicker
          isDarkMode={isDarkMode} 
          selected={currentColor || 'transparent'} 
          onColorSelect={onColor} 
        />
      </div>
    </div>
  );
};