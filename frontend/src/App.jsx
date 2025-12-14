import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Participant from './pages/Participant'
import Snowflakes from './components/Snowflakes'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      <Snowflakes />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="/p/:token" element={<Participant />} />
      </Routes>
    </div>
  )
}

export default App
