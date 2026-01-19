import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function BarangayInhabitantsList({ onNavigate, onLogout }) {
  const [inhabitants, setInhabitants] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedResident, setDraggedResident] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [showCertificateOptions, setShowCertificateOptions] = useState(false);
  const [showDataForm, setShowDataForm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [additionalData, setAdditionalData] = useState({});
  const [missingFields, setMissingFields] = useState([]);

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
      } else {
        toast.error('Failed to load inhabitants data');
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
      } else {
        toast.error('Failed to load residents data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
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

    // Check if resident is already in inhabitants list
    const isAlreadyInhabitant = inhabitants.some(inhabitant =>
      inhabitant.first_name === draggedResident.first_name &&
      inhabitant.last_name === draggedResident.last_name &&
      inhabitant.date_of_birth === draggedResident.date_of_birth
    );

    if (isAlreadyInhabitant) {
      toast.error('This resident is already in the barangay inhabitants list');
      setDraggedResident(null);
      return;
    }

    try {
      // Convert resident to barangay inhabitant
      const inhabitantData = {
        region: 'NCR',
        province: 'Metro Manila',
        city_municipality: 'Quezon City',
        barangay: 'Kalusugan',
        household_no: draggedResident.address, // Use address as household identifier
        address: draggedResident.address,
        last_name: draggedResident.last_name,
        first_name: draggedResident.first_name,
        middle_name: draggedResident.middle_name || '',
        qualifier: draggedResident.suffix || '',
        date_of_birth: draggedResident.date_of_birth,
        place_of_birth: draggedResident.place_of_birth,
        gender: draggedResident.gender,
        civil_status: draggedResident.civil_status,
        citizenship: draggedResident.citizenship,
        occupation: draggedResident.occupation,
        housing_status: 'Owned', // Default assumption
        years_residing: 5, // Default assumption
        registered_voter: draggedResident.registered_voter ? 'Yes' : 'No',
        health_problem: '',
        septic_tank: 'Not Applicable', // Default assumption
        relationship_to_head: 'Head', // Default to head for now
        date_accomplished: new Date().toISOString().split('T')[0]
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
        toast.success('Resident successfully added to barangay inhabitants!');
      } else {
        toast.error('Failed to add resident to barangay inhabitants');
      }
    } catch (error) {
      console.error('Error adding resident:', error);
      toast.error('Error occurred while adding resident');
    }

    setDraggedResident(null);
  };

  // Group inhabitants by address (family grouping)
  const groupedInhabitants = inhabitants.reduce((groups, inhabitant) => {
    const address = inhabitant.address || 'No Address';
    if (!groups[address]) {
      groups[address] = [];
    }
    groups[address].push(inhabitant);
    return groups;
  }, {});

  // Filter grouped inhabitants based on search term
  const filteredGroupedInhabitants = Object.entries(groupedInhabitants).reduce((filtered, [address, members]) => {
    const hasMatchingMember = members.some(inhabitant =>
      inhabitant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (hasMatchingMember) {
      filtered[address] = members;
    }
    return filtered;
  }, {});

  // Filter out residents who are already in inhabitants list
  const availableResidents = residents.filter(resident =>
    !inhabitants.some(inhabitant =>
      inhabitant.first_name === resident.first_name &&
      inhabitant.last_name === resident.last_name &&
      inhabitant.date_of_birth === resident.date_of_birth
    )
  );

  const filteredResidents = availableResidents.filter(resident =>
    resident.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResidentSelect = (inhabitant) => {
    setSelectedResident(inhabitant);
    setShowCertificateOptions(false);
  };

  const getAutoPopulatedData = (certificateType, resident) => {
    const baseData = {
      first_name: resident.first_name || '',
      middle_name: resident.middle_name || '',
      last_name: resident.last_name || '',
      date_of_birth: resident.date_of_birth || '',
      gender: resident.gender || '',
      civil_status: resident.civil_status || '',
      address: resident.address || '',
      occupation: resident.occupation || '',
      citizenship: resident.citizenship || 'Filipino',
      contact_no: resident.contact_no || '',
      province: resident.province || 'Metro Manila',
      city_municipality: resident.city_municipality || 'Quezon City',
      barangay: resident.barangay || 'Kalusugan',
      region: resident.region || 'NCR',
    };

    switch (certificateType) {
      case 'residency':
        return {
          ...baseData,
          purpose: 'Certificate of Residency',
          years_residing: resident.years_residing || calculateYearsResiding(resident.date_of_birth),
        };

      case 'business-permit':
        return {
          ...baseData,
          proprietor_name: `${resident.first_name || ''} ${resident.middle_name || ''} ${resident.last_name || ''}`.trim(),
          business_address: resident.address || '',
        };

      case 'certificate-of-indigency':
        return {
          ...baseData,
          purpose: 'Certificate of Indigency',
        };

      case 'certificate-of-employment':
        return {
          ...baseData,
          purpose: 'Certificate of Employment',
        };

      default:
        return baseData;
    }
  };

  const handleGenerateCertificate = (certificateType) => {
    if (!selectedResident) {
      toast.error('Please select a resident first');
      return;
    }

    // Auto-populate resident data into certificate fields
    const autoPopulatedData = getAutoPopulatedData(certificateType, selectedResident);

    // Check what additional data is needed for this certificate type
    const missingData = getMissingData(certificateType, selectedResident);

    if (missingData.length > 0) {
      // Show form to collect missing data
      setSelectedCertificate(certificateType);
      setMissingFields(missingData);
      setShowDataForm(true);
      setShowCertificateOptions(false);
      setAdditionalData(autoPopulatedData); // Pre-populate with available data
    } else {
      // All data is available, proceed directly with auto-populated data
      const completeData = prepareCertificateData(certificateType, selectedResident, {});
      onNavigate(`certificate-${certificateType}`, completeData);
      setShowCertificateOptions(false);
    }
  };

  const getMissingData = (certificateType, resident) => {
    const missing = [];

    switch (certificateType) {
      case 'residency':
        if (!resident.first_name && !resident.middle_name && !resident.last_name) missing.push('full_name');
        if (!resident.date_of_birth) missing.push('date_of_birth');
        if (!resident.civil_status) missing.push('civil_status');
        if (!resident.address) missing.push('address');
        break;

      case 'business-permit':
        if (!resident.first_name && !resident.middle_name && !resident.last_name) missing.push('proprietor_name');
        missing.push('business_name'); // Always required
        missing.push('nature_of_business'); // Always required
        missing.push('business_address'); // Always required
        break;

      case 'certificate-of-indigency':
        if (!resident.first_name && !resident.middle_name && !resident.last_name) missing.push('full_name');
        if (!resident.date_of_birth) missing.push('date_of_birth');
        if (!resident.civil_status) missing.push('civil_status');
        if (!resident.address) missing.push('address');
        missing.push('monthly_income'); // Always required for indigency
        break;

      case 'certificate-of-employment':
        if (!resident.first_name && !resident.middle_name && !resident.last_name) missing.push('full_name');
        if (!resident.date_of_birth) missing.push('date_of_birth');
        if (!resident.civil_status) missing.push('civil_status');
        if (!resident.address) missing.push('address');
        if (!resident.occupation) missing.push('occupation');
        // Certificate of Employment doesn't require employer details - it's a general certification
        break;

      default:
        break;
    }

    return missing;
  };

  const prepareCertificateData = (certificateType, resident, additionalData) => {
    // Start with resident data, then add/override with additional data
    const baseData = {
      ...resident,
      ...additionalData,
    };

    switch (certificateType) {
      case 'residency':
        return {
          ...baseData,
          first_name: resident.first_name || additionalData.first_name || '',
          middle_name: resident.middle_name || additionalData.middle_name || '',
          last_name: resident.last_name || additionalData.last_name || '',
          purpose: additionalData.purpose || 'Certificate of Residency',
          years_residing: resident.years_residing || calculateYearsResiding(resident.date_of_birth),
        };

      case 'business-permit':
        return {
          ...baseData,
          proprietor_name: additionalData.proprietor_name || `${resident.first_name || ''} ${resident.middle_name || ''} ${resident.last_name || ''}`.trim(),
          business_name: additionalData.business_name || '',
          nature_of_business: additionalData.nature_of_business || '',
          business_address: additionalData.business_address || resident.address || '',
          amount_paid: additionalData.amount_paid || '',
          date_paid: additionalData.date_paid || new Date().toISOString().split('T')[0],
          or_number: additionalData.or_number || '',
        };

      case 'certificate-of-indigency':
        return {
          ...baseData,
          first_name: resident.first_name || additionalData.first_name || '',
          middle_name: resident.middle_name || additionalData.middle_name || '',
          last_name: resident.last_name || additionalData.last_name || '',
          monthly_income: additionalData.monthly_income || '',
          purpose: additionalData.purpose || 'Certificate of Indigency',
        };

      case 'certificate-of-employment':
        return {
          ...baseData,
          first_name: resident.first_name || additionalData.first_name || '',
          middle_name: resident.middle_name || additionalData.middle_name || '',
          last_name: resident.last_name || additionalData.last_name || '',
          occupation: resident.occupation || additionalData.occupation || '',
          employer_name: additionalData.employer_name || '',
          employer_address: additionalData.employer_address || '',
          purpose: additionalData.purpose || 'Certificate of Employment',
        };

      default:
        return baseData;
    }
  };

  const calculateYearsResiding = (dateOfBirth) => {
    if (!dateOfBirth) return '5'; // Default
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    // Assume they've been residing since they were 18
    return Math.max(1, age - 18).toString();
  };

  const handleAdditionalDataSubmit = () => {
    if (!selectedCertificate || !selectedResident) return;

    const completeData = prepareCertificateData(selectedCertificate, selectedResident, additionalData);
    onNavigate(`certificate-${selectedCertificate}`, completeData);
    setShowDataForm(false);
    setSelectedCertificate(null);
    setAdditionalData({});
  };

  const handleAdditionalDataCancel = () => {
    setShowDataForm(false);
    setSelectedCertificate(null);
    setAdditionalData({});
  };

  const certificates = [
    { id: 'residency', name: 'Certificate of Residency' },
    { id: 'business-permit', name: 'Business Permit Certificate' },
    { id: 'certificate-of-indigency', name: 'Certificate of Indigency' },
    { id: 'certificate-of-employment', name: 'Certificate of Employment' },
  ];

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
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600" onClick={() => onNavigate('barangay-inhabitants-list')}>Records</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('certificate-logs')}>Certificate Logs</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-users')}>User Management</span>
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

        {/* SEARCH BAR */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search residents by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
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
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(filteredGroupedInhabitants).map(([address, members]) => (
                <div key={address} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🏠</span>
                    Family at {address}
                  </div>
                  <div className="space-y-2">
                    {members.map((inhabitant) => (
                      <div
                        key={inhabitant.id}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedResident?.id === inhabitant.id
                            ? 'bg-purple-100 border-purple-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleResidentSelect(inhabitant)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="resident-select"
                            checked={selectedResident?.id === inhabitant.id}
                            onChange={() => handleResidentSelect(inhabitant)}
                            className="mt-1 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{inhabitant.name}</div>
                            <div className="text-sm text-gray-600">{inhabitant.relationship_to_head || 'Head'}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Added: {new Date(inhabitant.date_issued).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(filteredGroupedInhabitants).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No inhabitants found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MISSING DATA FORM MODAL */}
        {showDataForm && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Complete {certificates.find(c => c.id === selectedCertificate)?.name} Data
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please provide the missing information required for this certificate.
                </p>

                <div className="space-y-4">
                  {missingFields.includes('business_name') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={additionalData.business_name || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, business_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter business name"
                      />
                    </div>
                  )}

                  {missingFields.includes('nature_of_business') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nature of Business *
                      </label>
                      <input
                        type="text"
                        value={additionalData.nature_of_business || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, nature_of_business: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Retail Store, Restaurant, Service"
                      />
                    </div>
                  )}

                  {missingFields.includes('business_address') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address *
                      </label>
                      <input
                        type="text"
                        value={additionalData.business_address || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, business_address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter business address"
                      />
                    </div>
                  )}

                  {missingFields.includes('monthly_income') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Income *
                      </label>
                      <input
                        type="number"
                        value={additionalData.monthly_income || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, monthly_income: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter monthly income in PHP"
                      />
                    </div>
                  )}

                  {missingFields.includes('employer_name') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employer Name *
                      </label>
                      <input
                        type="text"
                        value={additionalData.employer_name || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, employer_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter employer name"
                      />
                    </div>
                  )}

                  {missingFields.includes('employer_address') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employer Address *
                      </label>
                      <input
                        type="text"
                        value={additionalData.employer_address || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, employer_address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter employer address"
                      />
                    </div>
                  )}

                  {/* Additional fields for business permit */}
                  {selectedCertificate === 'business-permit' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount Paid (PHP)
                        </label>
                        <input
                          type="number"
                          value={additionalData.amount_paid || ''}
                          onChange={(e) => setAdditionalData(prev => ({ ...prev, amount_paid: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount paid"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Paid
                        </label>
                        <input
                          type="date"
                          value={additionalData.date_paid || ''}
                          onChange={(e) => setAdditionalData(prev => ({ ...prev, date_paid: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OR Number
                        </label>
                        <input
                          type="text"
                          value={additionalData.or_number || ''}
                          onChange={(e) => setAdditionalData(prev => ({ ...prev, or_number: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter OR number"
                        />
                      </div>
                    </>
                  )}

                  {/* Purpose field for residency and indigency */}
                  {(selectedCertificate === 'residency' || selectedCertificate === 'certificate-of-indigency') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose
                      </label>
                      <input
                        type="text"
                        value={additionalData.purpose || getAutoPopulatedData(selectedCertificate, selectedResident).purpose || ''}
                        onChange={(e) => setAdditionalData(prev => ({ ...prev, purpose: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter purpose"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleAdditionalDataCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdditionalDataSubmit}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Generate Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
