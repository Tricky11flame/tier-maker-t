function Head() {
    return (
      <header className="bg-neutral-900  text-white px-4 py-2 shadow-md flex justify-between items-center border border-dotted border-neutral-600 clerk ">
        <div className="flex-1">
          <div className="w-fit"> 
            <h1 className="text-3xl font-bold mx-auto">Decision Analysis</h1>
            <div className="h-1 bg-blue-600 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-end gap-4 ">
          {/* <span className="text-sm font-extrathin ">welcome aboard</span> */}
          <div className="h-8 w-8 rounded-lg bg-sky-600 border-dotted border-blue-300 border clerk "></div>
        </div>
      </header>
    );
  }

export default Head