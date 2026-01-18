import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginSystem from './screens/LoginSystem';
import AdminDashboard from './screens/Admin/AdminDashboard';
import Dashboard from './screens/Staff/Dashboard';
import ResidentDetailsForm from './screens/Staff/ResidentDetailsForm';
import AdminResidentDetailsForm from './screens/Admin/AdminResidentDetailsForm';
import BusinessPermitForm from './screens/Staff/BusinessPermitForm';
import RecordOfBarangayInhabitantsForm from './screens/Staff/RecordOfBarangayInhabitantsForm';
import AdminRecordOfBarangayInhabitantsForm from './screens/Admin/AdminRecordOfBarangayInhabitantsForm';
import BarangayInhabitantsList from './screens/Admin/BarangayInhabitantsList';
import ManageUsers from './screens/Admin/ManageUsers';
import Documents from './screens/Admin/Documents';
import Residency from './screens/certificates/Residency';
import BusinessPermitCertificate from './screens/certificates/BusinessPermitCertificate';
import CertificateOfIndigency from './screens/certificates/CertificateOfIndigency';
import CertificateOfEmployment from './screens/certificates/CertificateOfEmployment';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewData, setViewData] = useState(null);

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

  const handleNavigate = (view, data = null) => {
    setCurrentView(view);
    setViewData(data);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginSystem onLogin={handleLogin} />;
  }

  // Render current view for authenticated users (including admins)
  const renderView = () => {
    switch (currentView) {
      case 'personal':
        return <ResidentDetailsForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      case 'admin-resident-details':
        return <AdminResidentDetailsForm onBack={() => setCurrentView('admin-dashboard')} onLogout={handleLogout} />;
      case 'business':
        return <BusinessPermitForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      case 'rbi':
        if (user?.role === 'admin') {
          return <AdminRecordOfBarangayInhabitantsForm onBack={() => setCurrentView('admin-dashboard')} onLogout={handleLogout} />;
        }
        return <RecordOfBarangayInhabitantsForm onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />;
      case 'barangay-inhabitants-list':
        return <BarangayInhabitantsList onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'manage-users':
        return <ManageUsers onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'documents':
        return <Documents onNavigate={handleNavigate} onLogout={handleLogout} residentId={viewData?.residentId} />;
      case 'certificate-residency':
        return <Residency onBack={() => setCurrentView('documents')} onLogout={handleLogout} formData={viewData} />;
      case 'certificate-business-permit':
        return <BusinessPermitCertificate onBack={() => setCurrentView('documents')} onLogout={handleLogout} formData={viewData} />;
      case 'certificate-of-indigency':
        return <CertificateOfIndigency onBack={() => setCurrentView('documents')} onLogout={handleLogout} formData={viewData} />;
      case 'certificate-of-employment':
        return <CertificateOfEmployment onBack={() => setCurrentView('documents')} onLogout={handleLogout} formData={viewData} />;
      default:
        if (user?.role === 'admin') {
          return <AdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
        }
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  return (
    <>
      {renderView()}
      <ToastContainer />
    </>
  );
}

export default App;
