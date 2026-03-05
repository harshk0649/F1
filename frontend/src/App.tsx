import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GridPage from './pages/GridPage';
import TeamsPage from './pages/TeamsPage';
import TrackViewer from './pages/TrackViewer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-600 selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/drivers" element={<GridPage />} />
          <Route path="/track" element={<TrackViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
