import React, { useState } from 'react';
import Dashboard from './Dashboard';
import PersonalDetailsForm from './PersonalDetailsForm';
import KasambahayRegistrationForm from './KasambahayRegistrationForm';
import RecordOfBarangayInhabitantsForm from './RecordOfBarangayInhabitantsForm';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'personal':
        return <PersonalDetailsForm onBack={() => setCurrentView('dashboard')} />;
      case 'kasambahay':
        return <KasambahayRegistrationForm onBack={() => setCurrentView('dashboard')} />;
      case 'rbi':
        return <RecordOfBarangayInhabitantsForm onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return renderView();
}

export default App;
