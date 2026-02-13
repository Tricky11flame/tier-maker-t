import "./index.css";
import {Routes, Route, BrowserRouter} from 'react-router'
import MainPage from "./pages/MainPage";
import { HomeRedirect } from "./pages/HomeRedirect";
function App() {

  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/:id" element={<MainPage/>} />
    </Routes>
  </BrowserRouter>)
}

export default App;
