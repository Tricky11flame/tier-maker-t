import "./index.css";
import {Routes, Route} from 'react-router'
import MainBody from "./components/MainBody";
function App() {

  return(
  <>
    <Routes>
      <Route path="/" element={<MainBody/>} />
    </Routes>
  </>)
}

export default App;
