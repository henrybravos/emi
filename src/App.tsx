import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      {/* Ruta comodín para enlaces personalizados */}
      <Route path="/:hash" element={<HomePage />} />
    </Routes>
  )
}

export default App
