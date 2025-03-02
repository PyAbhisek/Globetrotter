import { useState } from 'react'
import Onboarding from './components/Onboarding'
import Game from './components/Game'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
 

  return (
    <>
    <Router>
      <Routes>
        {/* <Route path="/" element={<Onboarding />} /> */}
        <Route path="/play" element={<Game />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
