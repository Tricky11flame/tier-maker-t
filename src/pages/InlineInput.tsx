/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { cn } from '../utills/cn.ts';

interface InlineInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const InlineInput: React.FC<InlineInputProps> = ({ 
  value, onChange, onSubmit, onCancel, isDarkMode = true 
}) => (
  <div className="pl-8 mb-2 animate-in fade-in slide-in-from-left-4 duration-200">
    <input 
      autoFocus 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSubmit(); 
        if (e.key === 'Escape') onCancel();
      }} 
      className={cn(
        "border-b-2 border-blue-500 text-sm py-1 px-2 w-64 outline-none transition-colors",
        isDarkMode 
          ? "bg-gray-800 text-gray-100 placeholder-gray-600" 
          : "bg-white text-gray-900 placeholder-gray-400 border-b-blue-600 shadow-sm"
      )} 
      placeholder="Row Name..." 
    />
    <div className={cn(
      "text-[10px] mt-1 pl-1 font-medium tracking-tight",
      isDarkMode ? "text-gray-500" : "text-gray-400"
    )}>
      Enter to Create • Esc to Cancel
    </div>
  </div>
);