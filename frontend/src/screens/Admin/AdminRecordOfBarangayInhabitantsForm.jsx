import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AdminRecordOfBarangayInhabitantsForm = ({ onBack, onLogout }) => {
  const [formData, setFormData] = useState({
    household_members: [{
      last_name: '',
      first_name: '',
      middle_name: '',
      qualifier: '',
      date_of_birth: '',
      place_of_birth: '',
      gender: '',
      civil_status: '',
      citizenship: '',
      occupation: '',
      housing_status: '',
      years_residing: '',
      registered_voter: '',
      health_problem: '',
      septic_tank: '',
      relationship_to_head: '',
      date_accomplished: ''
    }]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e, memberIndex = null) => {
    const { name, value, type, checked } = e.target;

    if (memberIndex !== null) {
      // Handle household member changes
      const updatedMembers = [...formData.household_members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        [name]: type === 'checkbox' ? checked : value
      };
      setFormData({
        ...formData,
        household_members: updatedMembers
      });
    } else {
      // Handle main form changes
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/barangay-inhabitants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || 'Submitted successfully');
      } else {
        toast.error(result.message || 'Failed to submit');
      }
    } catch (error) {
      toast.error('Error submitting form');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barangay Kalusugan</h1>
                <p className="text-sm text-gray-600">Management System</p>
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
        <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Dashboard</button>
        <div className="bg-white p-10 rounded-xl shadow-2xl my-10">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold">
            👥 Record of Barangay Inhabitants
          </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Region <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Province <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">City / Municipality <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Barangay <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Household No. <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-8">
          <label className="block text-sm mb-1">Address <span className="text-red-500">*</span></label>
          <input className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div className="mt-10">
          <div className="font-bold mb-2">Household Members / Mga Miyembro ng Sambahayan</div>
          <div className="text-red-500 mb-4">Member #1</div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Last Name <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">First Name <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Middle Name <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Qualifier <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Place of Birth <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Civil Status <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Citizenship <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Occupation <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Housing Status <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">No. of Years Residing in Brgy <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Registered Voter <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Health Problem (if any) <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Septic Tank <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm mb-1">Relationship to Household Head <span className="text-red-500">*</span></label>
              <input className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Date Accomplished <span className="text-red-500">*</span></label>
              <input type="date" className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <div className="border border-blue-300 bg-blue-50 p-5 rounded-lg mb-8 text-sm">
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            I have read and agree to the Data Privacy Statement for the Registry of Barangay Inhabitants (RBI). I certify that all information provided is true and accurate. <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button className="bg-green-600 text-white px-5 py-3 rounded-lg">+ Add Member</button>
          <div className="flex gap-4">
            <button className="bg-gray-200 px-5 py-3 rounded-lg">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminRecordOfBarangayInhabitantsForm;
