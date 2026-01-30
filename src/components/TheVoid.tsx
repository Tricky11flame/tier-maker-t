import {  SortableContext, useSortable } from "@dnd-kit/sortable";
import type { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
// import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
// import { createPortal } from "react-dom";

//prop to root component i guess :3
interface Props {
  column: Column;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}


// lets take a look at the props being passed down from parent :3
function TheVoid({
  column,
  tasks,
  deleteTask,
}: Props) {
  // const [ create, setCreate] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  // kinda like destructuring useSortable 
  const {
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      title="TheVoid"
      ref={setNodeRef}
      style={style}
      className="bg-gray-400  divide-x-4 divide-neutral-950 p-0  flex w-full "
    >
      {/* Column title */}
      <div
        title = "Col Title"
        className={` bg-neutral-600  text-ms min-h-full cursor-grab  px-2  clerk py-1 flex items-center justify-between `}
      >
        {/* {column.title} */}
        <div className="clerk bg-white/5 clerk px-2 py-1 rounded-sm ">
        your topics
        </div>
      </div>

      {/* Column task container */}
      <div 
        title = " Task Container "
        className="flex flex-grow  gap-1 p-1 
        overflow-x-auto overflow-y-hidden"
      >
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

export default TheVoid;
