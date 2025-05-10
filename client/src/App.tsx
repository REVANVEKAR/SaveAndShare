import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import React from 'react';

// Auth components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const UserLogin = lazy(() => import('./pages/auth/UserLogin'));
const UserRegister = lazy(() => import('./pages/auth/UserRegister'));

// NGO Dashboard components
const NGOLayout = lazy(() => import('./components/layouts/NGOLayout'));
const ResourceClaimPage = lazy(() => import('./pages/ngo/ResourceClaimPage'));
const ClaimedResourcesPage = lazy(() => import('./pages/ngo/ClaimedResourcesPage'));
const PostDrivesPage = lazy(() => import('./pages/ngo/PostDrivesPage'));

// User Dashboard components
const UserLayout = lazy(() => import('./components/layouts/UserLayout'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));

// Public components
const Home = lazy(() => import('./pages/Home'));

// Protected route component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: 'ngo' | 'user' }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={role === 'ngo' ? '/ngo/login' : '/user/login'} />;
  }
  
  if (userRole !== role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* NGO Auth Routes */}
        <Route path="/ngo/login" element={<Login />} />
        <Route path="/ngo/register" element={<Register />} />
        
        {/* NGO Dashboard Routes */}
        <Route 
          path="/ngo" 
          element={
            <ProtectedRoute role="ngo">
              <NGOLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/ngo/claim" />} />
          <Route path="claim" element={<ResourceClaimPage />} />
          <Route path="claimed" element={<ClaimedResourcesPage />} />
          <Route path="post" element={<PostDrivesPage />} />
        </Route>
        
        {/* User Auth Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        
        {/* User Dashboard Routes */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;