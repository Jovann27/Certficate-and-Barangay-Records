import React, { useState } from 'react';

const AdminResidentDetailsForm = ({ onBack, onLogout }) => {
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
      // Transform form data to match API schema
      const transformedData = {
        ...formData,
        // Transform boolean fields
        pwd: formData.pwd === 'yes',
        tenant: formData.is_tenant === 'yes',
        living_with_relative: formData.living_with_relative === 'yes',
        registered_voter: formData.registered_voter === 'yes',
        house_owner: formData.house_owner === 'yes',
        kasambahay: formData.is_kasambahay === 'yes',
        // Transform gender to match schema
        gender: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Male',
        // Transform civil status
        civil_status: formData.civil_status ? formData.civil_status.charAt(0).toUpperCase() + formData.civil_status.slice(1) : 'Single',
        // Transform residency length to match schema
        residency_length: formData.years_residing === 'less_than_1' ? 'Less than 1 year' :
                         formData.years_residing === '1-5' ? '1-5 years' :
                         formData.years_residing === '6-10' ? '6-10 years' :
                         formData.years_residing === '11-20' ? 'More than 10 years' :
                         formData.years_residing === 'more_than_20' ? 'More than 10 years' :
                         formData.years_residing === 'since_birth' ? 'More than 10 years' :
                         formData.years_residing,
        // Transform employment status to match schema
        employment_status: formData.employment_status === 'employed' ? 'Employed' :
                          formData.employment_status === 'unemployed' ? 'Unemployed' :
                          formData.employment_status === 'self-employed' ? 'Self-Employed' :
                          formData.employment_status === 'student' ? 'Student' :
                          formData.employment_status === 'retired' ? 'Retired' :
                          'Employed',
        // Transform educational attainment to match schema
        educational_attainment: formData.educational_attainment === 'elementary' ? 'Elementary' :
                               formData.educational_attainment === 'high_school' ? 'High School' :
                               formData.educational_attainment === 'college' ? 'College' :
                               formData.educational_attainment === 'vocational' ? 'Vocational' :
                               formData.educational_attainment === 'post_graduate' ? 'Postgraduate' :
                               'High School',
        // Add missing required fields
        citizenship: formData.citizenship || 'Filipino',
        // Calculate age from date of birth if available
        age: formData.date_of_birth ? Math.floor((new Date() - new Date(formData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : 25,
        religion: formData.religion || 'Catholic',
        contact_no: formData.contact_no || '+63-999-999-9999',
        province: formData.province || 'Quezon City',
      };

      // Create residentData object with only the fields that are in the schema
      const residentData = {
        resident_id: transformedData.resident_id,
        first_name: transformedData.first_name,
        last_name: transformedData.last_name,
        middle_name: transformedData.middle_name,
        suffix: transformedData.suffix,
        age: transformedData.age,
        gender: transformedData.gender,
        religion: transformedData.religion,
        civil_status: transformedData.civil_status,
        address: transformedData.address,
        occupation: transformedData.occupation,
        date_of_birth: transformedData.date_of_birth,
        place_of_birth: transformedData.place_of_birth,
        citizenship: transformedData.citizenship,
        employment_status: transformedData.employment_status,
        contact_no: transformedData.contact_no,
        province: transformedData.province,
        educational_attainment: transformedData.educational_attainment,
        certificate_type: transformedData.certificate_type,
        purpose: transformedData.purpose,
        pwd: transformedData.pwd,
        tenant: transformedData.tenant,
        house_owner_name: transformedData.house_owner_name,
        living_with_relative: transformedData.living_with_relative,
        relative_name: transformedData.relative_name,
        relative_relationship: transformedData.relative_relationship,
        residency_length: transformedData.residency_length,
        registered_voter: transformedData.registered_voter,
        house_owner: transformedData.house_owner,
        kasambahay: transformedData.kasambahay
      };



      // Save resident data to database
      const response = await fetch('http://localhost:3001/api/personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(residentData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Resident data saved successfully');
        setTimeout(() => {
          onBack(); // Go back to dashboard after successful save
        }, 2000);
      } else {
        console.error('Validation errors:', result.errors);
        result.errors.forEach((error, index) => {
          console.error(`Error ${index + 1}:`, error.field, error.message);
        });
        setMessage(result.message || 'Failed to save resident data');
      }
    } catch (error) {
      console.error('Error saving resident data:', error);
      setMessage('Failed to save resident data. Please try again.');
    } finally {
      setLoading(false);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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
              {loading ? 'Submitting...' : 'Save Resident Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default AdminResidentDetailsForm;
