import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Onboarding from './components/Onboarding';
import Game from './components/Game';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/play" element={<Game />} />
      <Route path="/onboard" element={<Onboarding />} />
    </Routes>
  </Router>
);
