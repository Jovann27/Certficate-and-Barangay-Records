import React, { useState } from 'react';
import BusinessPermitCertificate from './certificates/BusinessPermitCertificate';

const BusinessPermitForm = ({ onBack, onLogout }) => {
  const [formData, setFormData] = useState({
    applicationType: 'NEW',
    date: '',
    businessName: '',
    natureOfBusiness: '',
    proprietorName: '',
    businessAddress: '',
    brnNumber: '',
    dtiNumber: '',
    mayorsPermitNumber: '',
    dateIssued: '',
    emailAddress: '',
    contactNumber: '',
    representativeName: '',
    position: '',
    // amountPaid: '',
    // datePaid: '',
    // orNumber: '',
    privacyConsent: false
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      setMessage('Error: Please consent to the privacy statement');
      return;
    }
    setShowCertificate(true);
  };

  const certificateData = {
    proprietor_name: formData.proprietorName,
    business_name: formData.businessName,
    nature_of_business: formData.natureOfBusiness,
    business_address: formData.businessAddress,
    date_received: formData.dateIssued,
    received_by: formData.representativeName,
    valid_until: formData.date ? `${new Date(formData.date).getFullYear()}-12-31` : '2024-12-31',
    control_number: `BP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    amount_paid: formData.amountPaid,
    date_paid: formData.datePaid,
    or_number: formData.orNumber
  };

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-blue-50 py-10">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setShowCertificate(false)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Form</button>
          <BusinessPermitCertificate data={certificateData} />
        </div>
      </div>
    );
  }

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
        <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Dashboard</button>
        <div className="bg-white rounded-lg shadow-md p-8">

        {/* Form Title */}
        <h1 className="text-center text-lg font-bold mb-2">Application for Barangay Business Clearance</h1>
        <h2 className="text-center text-base font-semibold mb-8 text-gray-700">BUSINESS PROFILE</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Application Type Section */}
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium mb-2">
                  Application type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applicationType"
                      value="NEW"
                      checked={formData.applicationType === 'NEW'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">NEW</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applicationType"
                      value="OLD"
                      checked={formData.applicationType === 'OLD'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">OLD</span>
                  </label>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-600 text-lg">◉</span>
              <h3 className="font-semibold text-gray-800">Business Information</h3>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name of Business <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nature of Business <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name of Proprietor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="proprietorName"
                  value={formData.proprietorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address of Business <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Registration Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-600 text-lg">◉</span>
              <h3 className="font-semibold text-gray-800">Registration Details</h3>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-2">
                  BRN Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brnNumber"
                  value={formData.brnNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  DTI Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dtiNumber"
                  value={formData.dtiNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mayor's Permit Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mayorsPermitNumber"
                  value={formData.mayorsPermitNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date Issued <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Representation Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-600 text-lg">◉</span>
              <h3 className="font-semibold text-gray-800">Representation Information</h3>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name Of Representative <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          {/* <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-600 text-lg">◉</span>
              <h3 className="font-semibold text-gray-800">Payment Information</h3>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="datePaid"
                    value={formData.datePaid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    O.R. Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orNumber"
                    value={formData.orNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="OR-2024-001"
                    required
                  />
                </div>
              </div>
            </div>
          </div> */}
          {/* Privacy Consent */}
          <div>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={handleChange}
                className="w-4 h-4 mt-1"
              />
              <span className="text-xs text-gray-700">
                I here-seek and agree to the Data Privacy Statement and certify that all information provided is true, accurate, and complete.
              </span>
            </label>
          </div>

          {message && (
            <div className={`p-4 rounded text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-blue-700 text-white rounded text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Business Permit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
    </div>
  );
};

export default BusinessPermitForm;
