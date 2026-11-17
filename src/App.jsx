import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import LevelDashboard from './pages/LevelDashboard/LevelDashboard';
import ActivityPage from './pages/ActivityPage/ActivityPage';

/**
 * Application Router.
 *
 * Preserves the required `/Lvl-Dashboard` route (case-insensitive alias included)
 * and `/Lvl-Dashboard/activity` route from the reference build (PDF §54).
 */
export default function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Lvl-Dashboard" replace />} />
          <Route path="/Lvl-Dashboard" element={<LevelDashboard />} />
          <Route path="/lvl-dashboard" element={<LevelDashboard />} />
          <Route path="/Lvl-Dashboard/activity" element={<ActivityPage />} />
          <Route path="/lvl-dashboard/activity" element={<ActivityPage />} />
          <Route path="*" element={<Navigate to="/Lvl-Dashboard" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}
