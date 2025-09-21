// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Landing";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import CitizenDashboard from "./CitizenDashboard";
import AdminDashboard from "./AdminDashboard";

// Protected Route Component for Citizens
const CitizenProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin tries to access citizen dashboard, redirect to admin dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return children;
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If citizen tries to access admin dashboard, redirect to citizen dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/citizen-dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        
        {/* Protected Citizen Route */}
        <Route 
          path="/citizen-dashboard" 
          element={
            <CitizenProtectedRoute>
              <CitizenDashboard />
            </CitizenProtectedRoute>
          } 
        />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;