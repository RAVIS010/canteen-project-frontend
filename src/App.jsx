import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/login/Login';
import AdminDashboard from './components/admin/Tabs/DashboardTab';
import MessDashboard from './components/mess/Tabs/DashboardTab';
import UserDashboard from './components/User/Tabs/UserDashboardTab';
import BillingPOS from './components/billing/Tabs/BillingPOS';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#f8fafc', fontSize: '15px', fontWeight: 'bold' } }} />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/mess-dashboard" element={<ProtectedRoute><MessDashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/billing-pos" element={<ProtectedRoute><BillingPOS /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
