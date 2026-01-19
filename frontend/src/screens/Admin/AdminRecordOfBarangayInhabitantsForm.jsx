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
      // Combine household data with first member data
      const inhabitantData = {
        ...formData,
        ...formData.household_members[0],
      };
      delete inhabitantData.household_members; // Remove the array

      const response = await fetch('http://localhost:3001/api/barangay-inhabitants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(inhabitantData),
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
          <input name="region" onChange={handleChange} value={formData.region || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Province <span className="text-red-500">*</span></label>
          <input name="province" onChange={handleChange} value={formData.province || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">City / Municipality <span className="text-red-500">*</span></label>
          <input name="city_municipality" onChange={handleChange} value={formData.city_municipality || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Barangay <span className="text-red-500">*</span></label>
          <input name="barangay" onChange={handleChange} value={formData.barangay || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Household No. <span className="text-red-500">*</span></label>
          <input name="household_no" onChange={handleChange} value={formData.household_no || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-8">
          <label className="block text-sm mb-1">Address <span className="text-red-500">*</span></label>
          <input name="address" onChange={handleChange} value={formData.address || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>

        <div className="mt-10">
          <div className="font-bold mb-2">Household Members / Mga Miyembro ng Sambahayan</div>
          <div className="text-red-500 mb-4">Member #1</div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Last Name <span className="text-red-500">*</span></label>
              <input name="last_name" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.last_name || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">First Name <span className="text-red-500">*</span></label>
              <input name="first_name" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.first_name || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Middle Name <span className="text-red-500">*</span></label>
              <input name="middle_name" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.middle_name || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Qualifier <span className="text-red-500">*</span></label>
              <input name="qualifier" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.qualifier || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <input name="date_of_birth" type="date" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.date_of_birth || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Place of Birth <span className="text-red-500">*</span></label>
              <input name="place_of_birth" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.place_of_birth || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender <span className="text-red-500">*</span></label>
              <select name="gender" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.gender || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Civil Status <span className="text-red-500">*</span></label>
              <select name="civil_status" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.civil_status || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Citizenship <span className="text-red-500">*</span></label>
              <input name="citizenship" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.citizenship || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Occupation <span className="text-red-500">*</span></label>
              <input name="occupation" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.occupation || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Housing Status <span className="text-red-500">*</span></label>
              <select name="housing_status" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.housing_status || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select Status</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Mortgaged">Mortgaged</option>
                <option value="Living with relatives">Living with relatives</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">No. of Years Residing in Brgy <span className="text-red-500">*</span></label>
              <input name="years_residing" type="number" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.years_residing || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-1">Registered Voter <span className="text-red-500">*</span></label>
              <select name="registered_voter" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.registered_voter || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Health Problem (if any) <span className="text-red-500">*</span></label>
              <input name="health_problem" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.health_problem || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Septic Tank <span className="text-red-500">*</span></label>
              <select name="septic_tank" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.septic_tank || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm mb-1">Relationship to Household Head <span className="text-red-500">*</span></label>
              <input name="relationship_to_head" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.relationship_to_head || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Date Accomplished <span className="text-red-500">*</span></label>
              <input name="date_accomplished" type="date" onChange={(e) => handleChange(e, 0)} value={formData.household_members[0]?.date_accomplished || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
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
