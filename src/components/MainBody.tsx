import TierBoard from "./TierBoard.tsx"
import Head from "./Head.tsx"
import Foot from "./Foot.tsx"
function MainBody() {
  return (
    <div className="min-h-[100vh] bg-zinc-900 p-2 overflow-x-auto flex flex-col">
        <Head/>
        <TierBoard />
        {/* <ColorPicker /> */}
        <Foot/>
    </div>
  )
}

export default MainBody