import React, { useState, useEffect } from 'react';
import LoginSystem from './screens/LoginSystem';
import AdminDashboard from './screens/AdminDashboard';
import Dashboard from './screens/Dashboard';
import PersonalDetailsForm from './screens/PersonalDetailsForm';
import BusinessPermitForm from './screens/BusinessPermitForm';
import RecordOfBarangayInhabitantsForm from './screens/RecordOfBarangayInhabitantsForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  // Check for existing authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginSystem onLogin={handleLogin} />;
  }

  // Show admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Render current view for authenticated users
  const renderView = () => {
    switch (currentView) {
      case 'personal':
        return <PersonalDetailsForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      case 'business':
        return <BusinessPermitForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      case 'rbi':
        return <RecordOfBarangayInhabitantsForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  return renderView();
}

export default App;
