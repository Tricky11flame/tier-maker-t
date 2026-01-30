import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import type { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
// import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { cn } from "../utills/cn";
// import { createPortal } from "react-dom";

//prop to root component i guess :3
interface Props {
  column: Column;
  // function definition
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  deleteTask: (id: Id) => void;

  // arr of Task type
  tasks: Task[];
}


// lets take a look at the props being passed down from parent :3
function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  deleteTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const colourEx="bg-rose-100 bg-rose-500 bg-red-100 bg-red-500 bg-orange-100 bg-orange-500 bg-yellow-100 bg-yellow-300 bg-green-100 bg-green-500 bg-blue-100 bg-blue-500 bg-blue-100 bg-blue-500 bg-indigo-100 bg-indigo-500 bg-violet-100 bg-violet-500 bg-grey-100 bg-grey-500 bg-pink-100 bg-pink-500";
  console.log(colourEx)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //special case for isDraging = True; 
  if (isDragging) {
    return (
      <div
        title={`${column.id}`}
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor  border bg-white/5 clerk border-blue-400 rounded-md flex min-h-[120px] " >
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      title="regular tiers"
      className={cn("bg-neutral-900 uppercase flex min-w-[30vw] max-w-[60vw] divide-x-4 divide-neutral-950 item-start ")}>
      {/* Column title */}
      <div
        {...attributes}
        {...listeners} 
        style={{ backgroundColor: column.color }}
        className={cn( "min-h-full px-4 py-2 flex items-start justify-between ")}>
        <div className="flex ">
          <div className= " uppercase rounded-sm clerk bg-white/10 border-neutral-200 border-dotted py-1 px-2 cursor-cell w-30  overflow-x-clip" onClick={() => {setEditMode(true);}} >
          {!editMode && 
            <div className=" ">
              {column.title}
            </div>
          }
          {editMode && (
            <input  autoFocus
              className=" uppercase relative w-27 size-fit focus:ring-0"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(!editMode);
              }}
            />
          )}
        
        </div>
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="stroke-neutral-900 bg-white/10 clerk  rounded-full 
        hover:stroke-red-600 hover:bg-columnBackgroundColor
        p-1 mx-2 my-1">
          <TrashIcon />
        </button>
      </div>

      {/* Column task container */}
      <div className="grid grid-cols-6 p-1 w-full h-fit">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default ColumnContainer;
