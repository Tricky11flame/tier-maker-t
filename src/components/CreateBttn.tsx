import PlusIcon from "../icons/PlusIcon";

function CreateBttn({createNewColumn}) {
  return (
    <button
    onClick={() => {
      createNewColumn();
    }}
    className="z-20 fixed border-neutral-800 stroke-neutral-900 text-neutral-600 top-20 right-2.5 cursor-pointer rounded-sm bg-mainBackgroundColor border-2 borde border-columnBackgroundColor px-1 py-0.5 items-center clerk-press ring-blue-300 hover:text-blue-300 hover:border-blue-300 transition-colors flex gap-1 ">
    <PlusIcon />
    <span className=" text-sm ">add</span>
  </button>
  )
}

export default CreateBttn