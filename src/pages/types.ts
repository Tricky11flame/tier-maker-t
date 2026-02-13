export type Task = { 
  id: string; 
  content: string; 
  color?: string; // New: Hex code or Tailwind class
  img?:string;
};

export type Rows = { [key: string]: Task[] };
export type DragType = 'ROW' | 'TASK';
export type DragItem = { type: 'ROW'; id: string } | { type: 'TASK'; id: string; sourceRow: string };
export type DropTarget = { type: 'ROW'; index: number } | { type: 'TASK'; row: string; index: number };