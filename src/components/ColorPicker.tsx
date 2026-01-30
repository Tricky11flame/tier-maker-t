import { useState } from 'react';
import { cn } from '../utills/cn.ts';
import { CSS_NAMED_COLORS } from '../constants/named.ts';

export default function ColorPicker() {
  const [selected, setSelected] = useState("white");

  const handleColorChange = (color: string) => {
    setSelected(color);
    
  };

  return (
    <div className=' mx-2'>
    <div className=' flex flex-col border-neutral-400 '>
      <div>

      
    <div className="mx-auto p-2 border rounded-lg border-neutral-600 g-neutral-900 shadow-sm h-auto clerk ">
      <h4 className="text-sm font-bold tracking-tight text-neutral-200">Select Color</h4>
      
      {/* Scrollable container for the large list of colors */}
      <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 border rounded border-neutral-600">
        {CSS_NAMED_COLORS.map((color) => (
          <button
            key={color}
            title={color}
            onClick={() => handleColorChange(color)}
            style={{ backgroundColor: color }}
            className={cn(
              "size-6 rounded-md border transition-all hover:scale-120 hover:ring-blue-600 hover:ring-1 ",
              selected === color ? "border-black ring-2 ring-offset-1 ring-blue-400" : "border-gray-200"
            )}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div 
          className="size-8 rounded border border-neutral-600" 
          style={{ backgroundColor: selected }} 
        />
        <span className="text-sm font-mono font-medium text-neutral-200">{selected}</span>
      </div>
    </div>
    <div className=''>
      {/* // make this a container that takes input for text format  */}
    </div>
    <div>
      {/*  make  */}
    </div>
    </div>
    <div className='flex-1'></div>
    </div>
    </div>
    
    
  );
}