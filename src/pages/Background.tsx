import { cn } from "../utills/cn";
import { motion } from "motion/react"

type KanbanBackgroundType = {
  isDarkMode:boolean;
}

function KanbanBackground({isDarkMode}:KanbanBackgroundType) {
  return (
    <motion.div 
      // Handling the background color via Framer Motion for superior smoothness
      animate={{
        backgroundColor: isDarkMode ? "#070705" : "#9090FF", // neutral-900 : neutral-300
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
    >
    <motion.div
        animate={{x: [0, 40, 0],y: [0, 60, 0],scale: [1, 1.2, 1],}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]",
          isDarkMode?"bg-blue-600/15":"bg-blue-600/50"
        )}
      />
      <motion.div
      animate={{x: [0, 40, 0],y: [0, 60, 0],scale: [1, 1.2, 1],}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute -bottom-[5%] -right-[5%] w-[30vw] h-[30vw] rounded-full blur-[120px]",
          isDarkMode?"bg-blue-400/40":"bg-blue-400/70"
        )}
      />

      {/* Bottom Right Orb */}
      <motion.div
        animate={{x: [0, -40, 0],y: [0, -60, 0],}}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute -top-[10%] -left-[10%] w-[30vw] h-[30vw] rounded-full blur-[130px]",
          isDarkMode?"bg-purple-900/10":"bg-purple-500/50"
        )}
      />
      <motion.div
        animate={{x: [0, -40, 0],y: [0, -60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute -top-[2%] -left-[2%] w-[10vw] h-[10vw] rounded-full blur-[130px]",
          isDarkMode?"bg-purple-500":"dark:bg-purple-500/70"
        )}
      />
      </motion.div>
  )
}



// style={{
    //   position: "fixed",
    //   top: 0,
    //   left: 0,
    //   width: "100%",
    //   height: "100%",
    //   zIndex: -1, // Places it behind content
    // }}
    // animate={{
    //   backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ff0000"],
    // }}
    // transition={{
    //   duration: 10,
    //   ease: "linear",
    //   repeat: Infinity,
    // }}

    // animate={{
    // background: [
    //     "linear-gradient(45deg, #ff0000, #00ff00)",
    //     "linear-gradient(135deg, #00ff00, #0000ff)",
    //     "linear-gradient(225deg, #0000ff, #ff0000)",
    //     "linear-gradient(45deg, #ff0000, #00ff00)"
    // ]
    // }}
    // transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}

    // animate={{
    // opacity: [0.3, 0.6, 0.3],
    // scale: [1, 1.05, 1] // Optional slight zoom for depth
    // }}
    // transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}

    //     animate={{
    //   backgroundPosition: ["0px 0px", "100px 100px"]
    // }}
    // transition={{
    //   duration: 20,
    //   ease: "linear",
    //   repeat: Infinity
    // }}
    // style={{
    //   backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
    //   backgroundSize: "20px 20px"
    // }}

    // animate={{
    //   filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
    // }}
    // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    // style={{ backgroundColor: "#ff0000" }}

    // animate={{
    //   backgroundPosition: ["200% 0", "-200% 0"],
    // }}
    // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    // style={{
    //   background: "linear-gradient(90deg, #111 40%, #222 50%, #111 60%)",
    //   backgroundSize: "200% 100%",
    // }}


export {KanbanBackground}