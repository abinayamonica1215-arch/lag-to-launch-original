import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './components/common/CustomCursor';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ArrearDetailsPage from './pages/ArrearDetailsPage';
import RoadmapPage from './pages/RoadmapPage';
import TrainingPage from './pages/TrainingPage';
import PlacementReadinessPage from './pages/PlacementReadinessPage';
import MockInterviewPage from './pages/MockInterviewPage';
import CareerPage from './pages/CareerPage';
import FinalAssessmentPage from './pages/FinalAssessmentPage';
import PlacementRoadmapPage from './pages/PlacementRoadmapPage';

export const App = () => {
  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student Dashboard Shell & Features */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/arrear-details" element={<ArrearDetailsPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/placement-readiness" element={<PlacementReadinessPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/final-assessment" element={<FinalAssessmentPage />} />
          <Route path="/placement-roadmap" element={<PlacementRoadmapPage />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
