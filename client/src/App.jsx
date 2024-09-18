import './App.css'
import { BrowserRouter,  Routes, Route} from 'react-router-dom';
import DashBoard from './pages/DashBoard';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<DashBoard/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
