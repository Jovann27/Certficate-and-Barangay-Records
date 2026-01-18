import React, { useState, useEffect } from 'react';

const Documents = ({ onNavigate, onLogout, residentId }) => {
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (residentId) {
      fetchResidentData();
    } else {
      setLoading(false);
    }
  }, [residentId]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchResidentData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/residents/${residentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const residentData = data.data.resident; // The API returns { resident, certificateHistory }
        // Calculate age and add years_residing (assuming they've been there for a while)
        const age = calculateAge(residentData.date_of_birth);
        setResident({
          ...residentData,
          age,
          years_residing: age ? Math.max(1, age - 5) : '' // Rough estimate, can be adjusted
        });
      }
    } catch (error) {
      console.error('Error fetching resident data:', error);
    } finally {
      setLoading(false);
    }
  };

  const certificates = [
    { id: 'residency', name: 'Certificate of Residency', description: 'Official residency certificate for barangay residents' },
    { id: 'business-permit', name: 'Business Permit Certificate', description: 'Certificate for business permit applications' },
    { id: 'certificate-of-indigency', name: 'Certificate of Indigency', description: 'Indigency certificate for residents' },
    { id: 'certificate-of-employment', name: 'Certificate of Employment', description: 'Employment certification for residents' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading resident data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">📄</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barangay Kalusugan</h1>
                <p className="text-sm text-gray-600">Document Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
              <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => onNavigate('barangay-inhabitants-list')} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            ← Back to Records
          </button>

          {resident && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Resident Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {resident.first_name} {resident.middle_name || ''} {resident.last_name} {resident.suffix || ''}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {resident.address}
                </div>
                <div>
                  <span className="font-medium">Age:</span> {resident.age || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Civil Status:</span> {resident.civil_status}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Generate Certificate</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cert.description}</p>
                  <button
                    onClick={() => onNavigate(`certificate-${cert.id}`, resident)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    disabled={!resident}
                  >
                    {resident ? 'Generate Certificate' : 'Select Resident First'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
