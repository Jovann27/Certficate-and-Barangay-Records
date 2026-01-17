import React, { useState } from 'react';

const PersonalDetailsForm = ({ onBack, onLogout }) => {
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
      const response = await fetch('http://localhost:3001/api/personal-details', {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barangay Kalusugan</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Staff User</p>
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
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Dashboard</button>
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold">
            👤 Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-4">
            <div>
              <label className="block text-sm mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input name="first_name" onChange={handleChange} value={formData.first_name || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input name="last_name" onChange={handleChange} value={formData.last_name || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Middle Name <span className="text-red-500">*</span>
              </label>
              <input name="middle_name" onChange={handleChange} value={formData.middle_name || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Suffix <span className="text-red-500">*</span>
              </label>
              <input name="suffix" onChange={handleChange} value={formData.suffix || ''} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-4">
          <div>
            <label className="block text-sm mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input name="age" onChange={handleChange} value={formData.age || ''} type="number" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select name="gender" onChange={handleChange} value={formData.gender || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Religion <span className="text-red-500">*</span>
            </label>
            <input name="religion" onChange={handleChange} value={formData.religion || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Civil Status <span className="text-red-500">*</span>
            </label>
            <select name="civil_status" onChange={handleChange} value={formData.civil_status || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          <div>
            <label className="block text-sm mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input name="address" onChange={handleChange} value={formData.address || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input name="occupation" onChange={handleChange} value={formData.occupation || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
          <div>
            <label className="block text-sm mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input name="date_of_birth" onChange={handleChange} value={formData.date_of_birth || ''} type="date" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Place of Birth <span className="text-red-500">*</span>
            </label>
            <input name="place_of_birth" onChange={handleChange} value={formData.place_of_birth || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Employment Status <span className="text-red-500">*</span>
            </label>
            <select name="employment_status" onChange={handleChange} value={formData.employment_status || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
          <div>
            <label className="block text-sm mb-2">
              Contact No <span className="text-red-500">*</span>
            </label>
            <input name="contact_no" onChange={handleChange} value={formData.contact_no || ''} type="tel" className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Province <span className="text-red-500">*</span>
            </label>
            <input name="province" onChange={handleChange} value={formData.province || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <select name="educational_attainment" onChange={handleChange} value={formData.educational_attainment || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Education</option>
              <option value="elementary">Elementary</option>
              <option value="high_school">High School</option>
              <option value="college">College</option>
              <option value="vocational">Vocational</option>
              <option value="post_graduate">Post Graduate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div>
            <label className="block text-sm mb-2">
              Certificate Type <span className="text-red-500">*</span>
            </label>
            <select name="certificate_type" onChange={handleChange} value={formData.certificate_type || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Type</option>
              <option value="indigency">Certificate of Indigency</option>
              <option value="residency">Certificate of Residency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <select name="purpose" onChange={handleChange} value={formData.purpose || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select Purpose</option>
              <option value="employment">Employment</option>
              <option value="school">School Requirements</option>
              <option value="loan">Loan Application</option>
              <option value="legal">Legal Purposes</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Are you belong to PWD? <span className="text-red-500">*</span>
            </label>
            <select name="pwd" onChange={handleChange} value={formData.pwd || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Resident ID (if registered)
            </label>
            <input name="resident_id" onChange={handleChange} value={formData.resident_id || ''} type="number" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Optional" />
          </div>
        </div>

        <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold">
          📋 Other Information
        </h2>

        <div className="border border-gray-300 p-5 rounded-lg mb-5">
          <label className="block text-sm mb-3">
            Are you a Tenant? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5 mb-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="is_tenant" value="yes" onChange={handleChange} checked={formData.is_tenant === 'yes'} required /> Yes / Oo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="is_tenant" value="no" onChange={handleChange} checked={formData.is_tenant === 'no'} required /> No / Hindi
            </label>
          </div>
          {formData.is_tenant === 'yes' && (
            <>
              <label className="block text-sm mb-2">
                Name of House Owner <span className="text-red-500">*</span>
              </label>
              <input name="house_owner_name" onChange={handleChange} value={formData.house_owner_name || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
            </>
          )}
        </div>

        <div className="border border-gray-300 p-5 rounded-lg mb-5">
          <label className="block text-sm mb-3">
            Are you living with a relative? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5 mb-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="living_with_relative" value="yes" onChange={handleChange} checked={formData.living_with_relative === 'yes'} required /> Yes / Oo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="living_with_relative" value="no" onChange={handleChange} checked={formData.living_with_relative === 'no'} required /> No / Hindi
            </label>
          </div>
          {formData.living_with_relative === 'yes' && (
            <>
              <label className="block text-sm mb-2">
                Name of Relative <span className="text-red-500">*</span>
              </label>
              <input name="relative_name" onChange={handleChange} value={formData.relative_name || ''} className="w-full p-3 border border-gray-300 rounded-md mb-3" required />
              <label className="block text-sm mb-2">
                Relationship with Relative <span className="text-red-500">*</span>
              </label>
              <select name="relative_relationship" onChange={handleChange} value={formData.relative_relationship || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="">Select Relationship</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="other">Other</option>
              </select>
            </>
          )}
        </div>

        <div className="border border-gray-300 p-5 rounded-lg mb-5">
          <label className="block text-sm mb-2">
            How long have you lived in Barangay Kalusugan? <span className="text-red-500">*</span>
          </label>
          <select name="years_residing" onChange={handleChange} value={formData.years_residing || ''} className="w-full p-3 border border-gray-300 rounded-md" required>
            <option value="">Select Duration</option>
            <option value="less_than_1">Less than 1 year</option>
            <option value="1-5">1-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-20">11-20 years</option>
            <option value="more_than_20">More than 20 years</option>
            <option value="since_birth">Since birth</option>
          </select>
        </div>

        <div className="border border-gray-300 p-5 rounded-lg mb-5">
          <label className="block text-sm mb-3">
            Registered voter in this barangay? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5">
            <label className="flex items-center gap-2">
              <input type="radio" name="registered_voter" value="yes" onChange={handleChange} checked={formData.registered_voter === 'yes'} required /> Yes / Oo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="registered_voter" value="no" onChange={handleChange} checked={formData.registered_voter === 'no'} required /> No / Hindi
            </label>
          </div>
        </div>

        <div className="border border-gray-300 p-5 rounded-lg mb-5">
          <label className="block text-sm mb-3">
            Are you a house owner? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5">
            <label className="flex items-center gap-2">
              <input type="radio" name="house_owner" value="yes" onChange={handleChange} checked={formData.house_owner === 'yes'} required /> Yes / Oo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="house_owner" value="no" onChange={handleChange} checked={formData.house_owner === 'no'} required /> No / Hindi
            </label>
          </div>
        </div>

        <div className="border border-gray-300 p-5 rounded-lg mb-8">
          <label className="block text-sm mb-3">
            Are you a house worker (Kasambahay)? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5">
            <label className="flex items-center gap-2">
              <input type="radio" name="is_kasambahay" value="yes" onChange={handleChange} checked={formData.is_kasambahay === 'yes'} required /> Yes / Oo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="is_kasambahay" value="no" onChange={handleChange} checked={formData.is_kasambahay === 'no'} required /> No / Hindi
            </label>
          </div>
        </div>

        {formData.is_kasambahay === 'yes' && (
          <>
            <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold">
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
                <input type="checkbox" name="kasambahay_agree_terms" onChange={handleChange} checked={formData.kasambahay_agree_terms || false} required /> I agree to the Terms and Conditions
              </label>
            </div>
          </>
        )}

        <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold">
          ✅ Consent and Agreement
        </h2>

        <div className="border border-blue-300 bg-blue-50 p-4 rounded-lg mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="agree_privacy" onChange={handleChange} checked={formData.agree_privacy || false} required /> I agree to the Data Privacy Statement of Barangay Kalusugan.
          </label>
        </div>

        <div className="border border-green-300 bg-green-50 p-4 rounded-lg mb-8">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="agree_terms" onChange={handleChange} checked={formData.agree_terms || false} required /> I agree to the Terms and Conditions of Barangay Kalusugan.
          </label>
        </div>

          {message && <p className="mb-4 text-green-600">{message}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onBack} className="px-6 py-3 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {loading ? 'Submitting...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default PersonalDetailsForm;
