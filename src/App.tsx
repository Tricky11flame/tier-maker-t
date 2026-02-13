import "./index.css";
import {Routes, Route, BrowserRouter} from 'react-router'
import MainPage from "./pages/MainPage";
function App() {

  return(
  <BrowserRouter>
    <Routes>
      <Route path="/:id" element={<MainPage/>} />
    </Routes>
  </BrowserRouter>)
}

export default App;
