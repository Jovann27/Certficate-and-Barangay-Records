import React from "react";
import { toast } from 'react-toastify';

export default function Residency({ formData = {}, onBack, onLogout }) {


  const handlePrint = async () => {
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
        // Transform certificate type (always 'Residency' for this component)
        certificate_type: 'Residency',
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
        purpose: formData.purpose || 'Certificate of Residency',
      };

      // Save resident data to database first
      const response = await fetch('/api/personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Resident data saved successfully');
        // Then print the certificate
        window.print();
      } else {
        toast.error(result.message || 'Failed to save resident data');
      }
    } catch (error) {
      console.error('Error saving resident data:', error);
      toast.error('Failed to save resident data. Please try again.');
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get day of month
  const getDayOfMonth = () => {
    const date = new Date();
    return date.getDate();
  };

  // Get month and year
  const getMonthYear = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {onLogout && (
        <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <span className="text-xl font-bold">🏛️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Barangay Kalusugan</h1>
                  <p className="text-sm text-gray-600">Certificate Generator</p>
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
      )}

      <div className="flex justify-center p-6">
        <div className="bg-white w-full max-w-4xl shadow-lg p-8 relative">
          
          {/* WATERMARK - BACKGROUND SEAL */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="text-[200px] font-bold text-blue-300 transform rotate-[-20deg]">
              QUEZON CITY
            </div>
          </div>

          {/* HEADER WITH THREE LOGOS */}
          <div className="flex justify-between items-start mb-3 relative z-10">
            {/* Left Logo */}
            <div className="w-20 h-20 flex-shrink-0">
              <div className="w-full h-full rounded-full border-4 border-purple-400 flex items-center justify-center bg-white relative">
                <div className="absolute inset-0 rounded-full border-4 border-pink-300" style={{ margin: '4px' }}></div>
                <div className="text-center z-10">
                  <div className="text-pink-500 text-2xl">⚕️</div>
                </div>
              </div>
            </div>

            {/* Center Text */}
            <div className="text-center flex-1 mx-4">
              <p className="text-[10px] font-medium text-gray-700">Republika ng Pilipinas</p>
              <p className="text-[10px] font-bold text-red-600 tracking-wide">Tanggapan ng Sangguniang Barangay</p>
              <p className="text-[12px] font-extrabold text-red-600 tracking-wider">BARANGAY KALUSUGAN</p>
              <p className="text-[9px] text-gray-600 mt-0.5">Area 21, District IV, Quezon City</p>
              <p className="text-[9px] text-gray-600">☎ 252-96-21</p>
              <p className="text-[9px] text-gray-600">Email: kalusugan2014@gmail.com</p>
            </div>

            {/* Right Logos */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-lg border-2 border-orange-400 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
                <div className="text-center">
                  <div className="text-orange-500 text-xl">🕊️</div>
                  <div className="text-[6px] font-bold text-orange-600">BAGONG</div>
                  <div className="text-[6px] font-bold text-orange-600">PILIPINAS</div>
                </div>
              </div>
              <div className="w-16 h-16 rounded-lg border-2 border-blue-400 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-center">
                  <div className="text-blue-600 text-xl">🏛️</div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-gray-800 mb-4 relative z-10" />

          {/* TITLE */}
          <h1 className="text-center font-bold text-lg mb-4 tracking-wide relative z-10">
            CERTIFICATE OF RESIDENCY
          </h1>

          {/* BODY CONTENT */}
          <div className="text-[11px] leading-relaxed relative z-10">
            
            <p className="font-semibold mb-3">TO WHOM IT MAY CONCERN:</p>

            <p className="text-justify indent-8 mb-3">
              This is to certify that{' '}
              <span className="font-bold uppercase">
                {formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim()}
              </span>, born on{' '}
              <span className="font-bold uppercase">{formatDate(formData.date_of_birth) || 'APRIL 26, 1964'}</span>,{' '}
              <span className="font-bold capitalize">{formData.civil_status || 'Married'}</span> is a{' '}
              <span className="font-bold">bonafide</span> resident of{' '}
              <span className="font-bold uppercase">{formData.address || '21-J Broadway St., Barangay Kalusugan, Quezon City'}</span> since{' '}
              <span className="font-bold">{formData.years_residing || '1970'}</span> up to present.
            </p>

            <p className="text-justify indent-8 mb-3">
              The undersigned has certified that after a reasonable inquiry, I have verified the authenticity of barangay residency showing that the applicant has been residing in the barangay for at least six (6) months prior to the application of this Affidavit of Residency.
            </p>

            <p className="text-justify indent-8 mb-4">
              This certification is issued upon the request of the above-named person as a supporting document for{' '}
              <span className="font-bold uppercase">senior id purpose</span>.
            </p>

            <p className="mb-6">
              Issued this <span className="font-bold">{getDayOfMonth()}</span> day of{' '}
              <span className="font-bold">{getMonthYear()}</span> at Barangay Kalusugan, District IV, Quezon City.
            </p>

            {/* PHOTO AND THUMBMARK SECTION */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="border-2 border-blue-400 w-32 h-40 mb-2 bg-white"></div>
                <p className="text-[9px] font-semibold text-center">APPLICANT PHOTO</p>
              </div>
              <div>
                <div className="border-2 border-blue-400 w-32 h-40 mb-2 bg-blue-50"></div>
                <p className="text-[9px] font-semibold text-center">APPLICANT THUMBMARK</p>
              </div>
            </div>

            {/* ISSUANCE DETAILS */}
            <div className="mb-6 text-[9px]">
              <p><span className="font-bold">Issued At:</span> Barangay Kalusugan Hall</p>
              <p><span className="font-bold">Issued On:</span> {getCurrentDate()}</p>
              <p><span className="font-bold">Valid Until:</span> {getCurrentDate()} (6 months)</p>
            </div>

            {/* NOTES */}
            <div className="mb-6 text-[9px]">
              <p className="mb-1">• This certification is not valid without Original Barangay Dry Seal, Barangay Chairman Signature / Stamp.</p>
              <p>• OTHERS and without Photograph Valid Identification or certification or proof of residency for administrative or criminal liabilities.</p>
            </div>

            {/* SIGNATURE SECTION */}
            <div className="flex justify-end mb-6">
              <div className="text-center">
                <p className="text-[9px] mb-1">Applicant's Signature</p>
                <div className="border-b-2 border-black w-48 h-12 mb-1"></div>
                <p className="font-bold text-[11px] mt-8">HON. ROCKY DC. RABANAL</p>
                <p className="text-[10px]">Punong Barangay</p>
              </div>
            </div>

            {/* WATERMARK SEAL */}
            <div className="flex justify-end mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-purple-200 opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-purple-400 text-3xl">⚕️</div>
                </div>
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="grid grid-cols-2 gap-8 mb-4 text-[9px]">
              <div>
                <p className="font-bold mb-1">Prepared by: Analyn Rose</p>
                <p>Reference Number: UC-2023-23</p>
                <p>Document File: UC-2023-01</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Not Valid Without Official Barangay Seal</p>
              </div>
            </div>

            {/* BARANGAY OFFICIALS FOOTER */}
            <div className="border-t-2 border-gray-300 pt-3">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-2 text-[8px] mb-2">
                <div>
                  <p className="font-bold text-blue-700">HON. ROCKY DC. RABANAL</p>
                  <p className="text-[7px] text-gray-600">Punong Barangay</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Roderick M. Hara</p>
                  <p className="text-[7px] text-gray-600">Committee On Livelihood</p>
                  <p className="text-[7px] text-gray-600">Cooperative, Industry, And Senior Citizen Affairs</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Christopher C. Serrano</p>
                  <p className="text-[7px] text-gray-600">Committee On Public Order, And</p>
                  <p className="text-[7px] text-gray-600 text-red-600">And</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Margaret Lyra Maruzza</p>
                  <p className="text-[7px] text-gray-600">Committee On Health, Education,</p>
                  <p className="text-[7px] text-gray-600">Gender, and Development, And</p>
                  <p className="text-[7px] text-red-600 font-bold">And</p>
                  <p className="text-[7px] text-gray-600">Livelihood</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-2 text-[8px] mb-2">
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Ferdison D. Barbon</p>
                  <p className="text-[7px] text-gray-600">Committee On Ethics and Good</p>
                  <p className="text-[7px] text-gray-600">Government, Human Rights and Advocacy</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Eloisa R. Fayanes</p>
                  <p className="text-[7px] text-gray-600">Committee On Infrastructure,</p>
                  <p className="text-[7px] text-gray-600">Urban Plans, Public Services, And</p>
                  <p className="text-[7px] text-gray-600">Communication</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Robin C. Portaje</p>
                  <p className="text-[7px] text-gray-600">Committee On Appropriation,</p>
                  <p className="text-[7px] text-gray-600">Budget, Finance, Ways And</p>
                  <p className="text-[7px] text-gray-600">Means</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">Kgd.</p>
                  <p className="font-bold text-blue-700">Reynaldo SJ. Sara</p>
                  <p className="text-[7px] text-gray-600">Committee On Beautification,</p>
                  <p className="text-[7px] text-gray-600 text-red-600 font-bold">and</p>
                  <p className="text-[7px] text-gray-600">(000000)</p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-2 text-[8px]">
                <div>
                  <p className="font-bold text-blue-700">Secretary</p>
                  <p className="font-bold text-blue-700">Corazon L. Prado</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700">Treasurer</p>
                  <p className="font-bold text-blue-700">Fritzie P. Ubpardo</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">BPSO Ex-O</p>
                  <p className="font-bold text-blue-700">Elmer Z. Pinca</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">SK Chairperson</p>
                  <p className="font-bold text-blue-700">John Vincent D. Aliado</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-8 relative z-10 print:hidden">
            <button onClick={onBack} className="px-4 py-2 border border-gray-400 rounded-md bg-white hover:bg-gray-50">
              Back
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Continue Generate
            </button>
          </div>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
