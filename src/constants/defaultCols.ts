import type { Column } from "../types";

const defaultCols: Column[] = [
    {
      id: "tierS",
      title: "Tier S",
      color: "red",
    },
    {
      id: "tierA",
      title: "Tier A",
      color: "yellow",
    },
    {
      id: "tierB",
      title: "Tier B",
      color: "yellow",
    },
  ];
 export default defaultCols.concat({
  id: "default",
  title: "your topics",
  color: "red",
});