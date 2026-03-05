import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CalendarView from './pages/CalendarView'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
