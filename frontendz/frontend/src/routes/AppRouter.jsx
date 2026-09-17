import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Top-level Pages adhering to Section 7 Route Mapping
import { HomeRoute } from './HomeRoute';
import { Login } from '../pages/Login.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { Projects } from '../pages/Projects.jsx';
import { ProjectDetail } from '../pages/ProjectDetail.jsx';
import { ModuleDetail } from '../pages/ModuleDetail.jsx';
import { VerificationRequests } from '../pages/VerificationRequests.jsx';
import { Profile } from '../pages/Profile.jsx';
import { PublicVerification } from '../pages/PublicVerification.jsx';

export function AppRouter() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify/:contributionId" element={<PublicVerification />} />

      {/* Authenticated Platform Routes (Enclosed in ProtectedRoute & AppLayout) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/:moduleId"
        element={
          <ProtectedRoute>
            <ModuleDetail />
          </ProtectedRoute>
        }
      />
      {/* Route alias for nested project module paths */}
      <Route
        path="/projects/:projectId/modules/:moduleId"
        element={
          <ProtectedRoute>
            <ModuleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verifications"
        element={
          <ProtectedRoute>
            <VerificationRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
