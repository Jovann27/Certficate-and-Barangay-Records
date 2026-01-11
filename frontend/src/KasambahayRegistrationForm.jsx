import React, { useState } from 'react';

const KasambahayRegistrationForm = ({ onBack }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/kasambahay-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setMessage(result.message || 'Submitted successfully');
    } catch (error) {
      setMessage('Error submitting form');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Dashboard</button>
        <div className="bg-white p-10 rounded-lg shadow-lg my-10">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center text-3xl font-bold mb-10">KASAMBAHAY Registration</h1>

        <h2 className="flex items-center gap-3 mb-6 text-lg font-semibold">
          🧳 Work Information
        </h2>

        <div className="mb-6">
          <label className="block text-sm mb-2">
            Name of Employer <span className="text-red-500">*</span>
          </label>
          <input name="employer_name" onChange={handleChange} value={formData.employer_name || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">
            Employer Address <span className="text-red-500">*</span>
          </label>
          <input name="employer_address" onChange={handleChange} value={formData.employer_address || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="block text-sm mb-2">
              Monthly Salary <span className="text-red-500">*</span>
            </label>
            <select name="monthly_salary" onChange={handleChange} value={formData.monthly_salary || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Salary Range</option>
              <option value="5000-10000">₱5,000 - ₱10,000</option>
              <option value="10000-15000">₱10,000 - ₱15,000</option>
              <option value="15000-25000">₱15,000 - ₱25,000</option>
              <option value="25000+">₱25,000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Nature of Work <span className="text-red-500">*</span>
            </label>
            <select name="nature_of_work" onChange={handleChange} value={formData.nature_of_work || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Nature of Work</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="cooking">Cooking</option>
              <option value="childcare">Childcare</option>
              <option value="gardening">Gardening</option>
              <option value="driving">Driving</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Employment Arrangement <span className="text-red-500">*</span>
            </label>
            <select name="employment_arrangement" onChange={handleChange} value={formData.employment_arrangement || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Arrangement</option>
              <option value="live-in">Live-in</option>
              <option value="live-out">Live-out</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div>
            <label className="block text-sm mb-2">
              SSS No. <span className="text-red-500">*</span>
            </label>
            <input name="sss_no" onChange={handleChange} value={formData.sss_no || ''} type="text" placeholder="00-0000000-0" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              PAG-IBIG No. <span className="text-red-500">*</span>
            </label>
            <input name="pagibig_no" onChange={handleChange} value={formData.pagibig_no || ''} type="text" placeholder="0000-0000-0000" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              PhilHealth No. <span className="text-red-500">*</span>
            </label>
            <input name="philhealth_no" onChange={handleChange} value={formData.philhealth_no || ''} type="text" placeholder="00-000000000-0" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
        </div>

        <h2 className="flex items-center gap-3 mb-6 text-lg font-semibold">
          👪 Family Information
        </h2>

        <div className="mb-6">
          <label className="block text-sm mb-2">
            Name of Spouse <span className="text-red-500">*</span>
          </label>
          <input name="spouse_name" onChange={handleChange} value={formData.spouse_name || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm mb-2">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input name="father_name" onChange={handleChange} value={formData.father_name || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Father's Address <span className="text-red-500">*</span>
            </label>
            <input name="father_address" onChange={handleChange} value={formData.father_address || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div>
            <label className="block text-sm mb-2">
              Mother's Name <span className="text-red-500">*</span>
            </label>
            <input name="mother_name" onChange={handleChange} value={formData.mother_name || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Mother's Address <span className="text-red-500">*</span>
            </label>
            <input name="mother_address" onChange={handleChange} value={formData.mother_address || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
        </div>

        <h2 className="flex items-center gap-3 mb-6 text-lg font-semibold">
          🚨 Emergency Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div>
            <label className="block text-sm mb-2">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input name="emergency_contact_person" onChange={handleChange} value={formData.emergency_contact_person || ''} type="text" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Contact No. <span className="text-red-500">*</span>
            </label>
            <input name="emergency_contact_no" onChange={handleChange} value={formData.emergency_contact_no || ''} type="tel" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
        </div>

        <h2 className="flex items-center gap-3 mb-6 text-lg font-semibold">
          📄 Contract Documents
        </h2>
        <div className="border-2 border-dashed border-gray-400 p-10 text-center text-gray-600 rounded-lg mb-8">
          Click to upload Documents<br />or drag and drop
        </div>

        <div className="mb-8">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="agree_terms" onChange={handleChange} checked={formData.agree_terms || false} required /> I agree to the Terms and Conditions
          </label>
        </div>

            <div className="flex justify-end">
              {message && <p className="mb-4 text-green-600 mr-4">{message}</p>}
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KasambahayRegistrationForm;
