function SaveBttn({saveData }) {
  return (
    <button
    onClick={() => {
      saveData();
    }}
    className="z-20 fixed bg-neutral-900 border-neutral-800 stroke-neutral-900 text-neutral-600 top-20 left-2 cursor-pointer rounded-sm bg-mainBackgroundColor border-2 borde border-columnBackgroundColor px-1 py-0.5 items-center clerk-press ring-blue-300 hover:text-blue-300 hover:border-blue-300 transition-colors flex gap-1 text-xs">
    {/* <PokeIcon/> */}
    <img className="rounded-full p-2 border-2 " src={`../../2.png`} alt=""/>
    <div className="">
      save
    </div>
  </button> 
  )
}

export default SaveBttn