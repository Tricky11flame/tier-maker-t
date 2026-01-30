import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Id, Task } from "../types";
// hmm intersting useSortable :3
import { useSortable } from "@dnd-kit/sortable";
// h,,, css from utilities 
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

function TaskCard({ task, deleteTask}: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  // Use Less for me :3
  const [editMode, setEditMode] = useState(false);


  // use Sortable "abstractions"
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    } = 
    useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => prev);
    setMouseIsOver(false);
  };
  return (
  <>
    {isDragging && (
      <div
        ref={setNodeRef}
        style={style}
        /* flex-shrink-0 prevents the card from getting smaller than 120px */
        className=" bg-mainBackgroundColor p-1  cursor-grab relative border rounded-md bg-white/20 clerk border-blue-400"
      />
    )}

    {!isDragging && (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        /* Added h-[120px] and flex-shrink-0 to keep shape static */
        className="items-center justify-center flex rounded-md hover:clerk hover:ring-1 hover:ring-inset hover:ring-blue-300 cursor-grab relative task "
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
      >
        <img
          /* object-contain ensures the image fits inside the 120px box without distorting */
          className=" size-24  pointer-events-none text-xs "
          src={`https://img.pokemondb.net/sprites/black-white/normal/${task.content.toLowerCase()}.png`}
        
          alt={task.content}
        />
        

        {mouseIsOver && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="stroke-black absolute right-1 top-1 bg-black/40 clerk rounded-full p-1  hover:opacity-100 hover:stroke-red-500 hover:bg-black/20"
          >
            <TrashIcon  />
          </button>
        )}
      </div>
    )}
  </>
);
}

export default TaskCard;
