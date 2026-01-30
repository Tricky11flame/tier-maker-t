import {  useEffect, useMemo, useState } from "react";
import type { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import defaultCols from "../constants/defaultCols";
import defaultTasks from "../constants/defaultTask";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import TheVoid from "./TheVoid";
import SaveBttn from "./SaveBttn";
import CreateBttn from "./CreateBttn";
import ColorPicker from "./ColorPicker";

function TierBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // 🌂 #1
  const columnsId = useMemo(() => columns?.map((col) => col.id), [columns]);

  useEffect(() => {
    const savedCols = localStorage.getItem("cols");
    const savedTasks = localStorage.getItem("tasks");
    if (savedCols) {
      try {
        const parsedCols: Column[] = JSON.parse(savedCols);
        setColumns(parsedCols);
      } catch {
        setColumns(defaultCols);
      }
    }
    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch {
        setTasks(defaultTasks);
      }
    }
  }, []);
 // 🌂 #2
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div className="flex-1 mx-auto my-3 flex text-xl " >
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} >
        {/* <div className="m-auto "> */}
          <div className="p-2 flex flex-col rounded-lg border-neutral-800 divide-neutral-950 divide-y-4 border-2 clerk  mb-auto" title="board container">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                col.id!="thevoid"&&
                <ColumnContainer deleteColumn={deleteColumn} updateColumn={updateColumn} deleteTask={deleteTask}
                key={col.id} column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />))}
            </SortableContext>
            <TheVoid
              column={{id: "thevoid",title: "THE VOID",color: "red",}} deleteTask={deleteTask} tasks={tasks.filter((task) => task.columnId === "thevoid")} />
          </div>
        {/* </div> */}
        <SaveBttn saveData = {saveData} />
        <CreateBttn createNewColumn = {createNewColumn}  />

          <DragOverlay>
            {activeColumn && (
            <ColumnContainer column={activeColumn} deleteColumn={deleteColumn}   
              updateColumn={updateColumn} deleteTask={deleteTask}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />)}
            {activeTask && ( <TaskCard task={activeTask} deleteTask={deleteTask} />)}
          </DragOverlay>
      </DndContext>
      <ColorPicker />
    </div>
  );
  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      color:"rose"
    };
    setColumns([...columns, columnToAdd]);
  }
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    
    console.log("DRAG END");
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

const saveData = (columns: Column[] , tasks : Task[]) => {
  localStorage.setItem("cols",JSON.stringify(columns) );
  localStorage.setItem("tasks",JSON.stringify(tasks));
  const temp: boolean = columns ==  JSON.parse(localStorage.getItem("cols")|| "");
  const temp2 : boolean = tasks == JSON.parse(localStorage.getItem("tasks") || "");
  console.log("cols Status sent :",columns," upload ..",temp);
  console.log("tasks Status sent :",tasks," upload ..",temp2);
};

export default TierBoard;
