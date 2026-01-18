import React, { useState, useEffect } from 'react';

export default function BarangayInhabitantsList({ onNavigate, onLogout }) {
  const [inhabitants, setInhabitants] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedResident, setDraggedResident] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch barangay inhabitants
      const inhabitantsResponse = await fetch('http://localhost:3001/api/residents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const inhabitantsData = await inhabitantsResponse.json();
      if (inhabitantsData.success) {
        setInhabitants(inhabitantsData.data);
      }

      // Fetch residents for drag and drop
      const residentsResponse = await fetch('http://localhost:3001/api/resident-details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const residentsData = await residentsResponse.json();
      if (residentsData.success) {
        setResidents(residentsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, resident) => {
    setDraggedResident(resident);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!draggedResident) return;

    try {
      // Convert resident to barangay inhabitant
      const inhabitantData = {
        first_name: draggedResident.first_name,
        middle_name: draggedResident.middle_name || '',
        last_name: draggedResident.last_name,
        qualifier: draggedResident.suffix || '',
        date_of_birth: draggedResident.date_of_birth,
        place_of_birth: draggedResident.place_of_birth,
        gender: draggedResident.gender,
        civil_status: draggedResident.civil_status,
        citizenship: draggedResident.citizenship,
        occupation: draggedResident.occupation,
        address: draggedResident.address,
        registered_voter: draggedResident.registered_voter ? 'Yes' : 'No',
        relationship_to_head: 'Head', // Default to head for now
        household_no: '', // Will need to be set
        barangay: 'Kalusugan',
        city_municipality: 'Quezon City',
        province: 'Metro Manila',
        region: 'NCR'
      };

      const response = await fetch('http://localhost:3001/api/barangay-inhabitants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(inhabitantData)
      });

      if (response.ok) {
        // Remove from residents list and add to inhabitants
        setResidents(prev => prev.filter(r => r.id !== draggedResident.id));
        fetchData(); // Refresh inhabitants list
        alert('Resident successfully added to barangay inhabitants!');
      } else {
        alert('Failed to add resident to barangay inhabitants');
      }
    } catch (error) {
      console.error('Error adding resident:', error);
      alert('Error occurred while adding resident');
    }

    setDraggedResident(null);
  };

  const filteredInhabitants = inhabitants.filter(inhabitant =>
    inhabitant.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResidents = residents.filter(resident =>
    resident.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow border-b-4 border-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ◆
          </div>
          <span className="font-semibold text-lg">Barangay Kalusugan</span>
        </div>

        <nav className="flex gap-8 text-gray-600">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('admin-dashboard')}>Dashboard</span>
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600">Records</span>
          <span className="cursor-pointer hover:text-blue-600">User Management</span>
        </nav>

        <div className="text-sm flex items-center gap-3">
          <span>Admin User</span>
          <button onClick={onLogout} className="text-red-500 cursor-pointer hover:text-red-700 text-lg">
            ⎋
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Barangay Inhabitants Records</h1>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('admin-resident-details')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              + Add Resident
            </button>
            <button
              onClick={() => onNavigate('rbi')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              + Add New Record
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search inhabitants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DRAG AND DROP CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RESIDENTS LIST (DRAGGABLE) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Available Residents</h2>
            <p className="text-sm text-gray-600 mb-4">Drag residents to add them to barangay inhabitants</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredResidents.map((resident) => (
                <div
                  key={resident.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, resident)}
                  className="p-3 bg-gray-50 rounded-md border cursor-move hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-gray-800">{resident.full_name}</div>
                  <div className="text-sm text-gray-600">{resident.address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {resident.gender} • {resident.civil_status}
                  </div>
                </div>
              ))}
              {filteredResidents.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No residents found
                </div>
              )}
            </div>
          </div>

          {/* BARANGAY INHABITANTS LIST (DROP TARGET) */}
          <div
            className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Barangay Inhabitants</h2>
            <p className="text-sm text-gray-600 mb-4">Drop residents here to add them to the records</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredInhabitants.map((inhabitant) => (
                <div
                  key={inhabitant.id}
                  className="p-3 bg-blue-50 rounded-md border border-blue-200"
                >
                  <div className="font-medium text-gray-800">{inhabitant.name}</div>
                  <div className="text-sm text-gray-600">{inhabitant.address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Added: {new Date(inhabitant.date_issued).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => onNavigate('documents', { residentId: inhabitant.id })}
                    className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    View Documents
                  </button>
                </div>
              ))}
              {filteredInhabitants.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No inhabitants found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
