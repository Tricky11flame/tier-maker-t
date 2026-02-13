import { cn } from '../utills/cn.ts';
import { CSS_NAMED_COLORS } from '../constants/named.ts';
import { useEffect } from 'react';
import clsx from 'clsx';

interface ColorPickerProps {
  selected: string;
  onColorSelect: (color: string) => void;
  isDarkMode?: boolean; // New prop to control the "Bright/Dark" split
}

export default function ColorPicker({ selected, onColorSelect, isDarkMode }: ColorPickerProps) {
  useEffect(()=>{
    console.log("toggled at ColorPicker",isDarkMode);
  },[isDarkMode])
  return (
    <div className='mx-1 mt-2'>
      <div className={clsx(
        "p-2 border rounded-lg shadow-sm transition-colors duration-200",
        `${isDarkMode 
          ? "border-neutral-700 bg-neutral-900" 
          : "border-neutral-300 bg-white"      }`
      )}>
        <h4 className={cn(
          "text-[10px] uppercase font-bold tracking-widest mb-2",
          isDarkMode ? "text-neutral-500" : "text-neutral-400"
        )}>
          Select Color
        </h4>
        
        <div className={cn(
          "grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto p-1 scrollbar-thin",
          isDarkMode ? "scrollbar-thumb-neutral-700" : "scrollbar-thumb-neutral-300"
        )}>
          {CSS_NAMED_COLORS.map((color) => (
            <button
              key={color}
              title={color}
              onClick={(e) => {
                e.stopPropagation();
                onColorSelect(color);
              }}
              style={{ backgroundColor: color }}
              className={cn(
                "size-5 rounded-sm border transition-all hover:scale-110",
                isDarkMode ? "border-neutral-800" : "border-neutral-200",
                selected === color 
                  ? (isDarkMode ? "ring-2 ring-blue-500 border-white" : "ring-2 ring-blue-600 border-black") 
                  : ""
              )}
            />
          ))}
        </div>

        <div className={cn(
          "mt-2 flex items-center gap-2 pt-2 border-t",
          isDarkMode ? "border-neutral-800" : "border-neutral-200"
        )}>
          <div 
            className={cn(
              "size-4 rounded-full border",
              isDarkMode ? "border-neutral-600" : "border-neutral-300"
            )} 
            style={{ backgroundColor: selected }} 
          />
          <span className={cn(
            "text-[10px] font-mono truncate",
            isDarkMode ? "text-neutral-400" : "text-neutral-600"
          )}>
            {selected}
          </span>
        </div>
      </div>
    </div>
  );
}