import React, { useState } from "react";
import { toast } from 'react-toastify';

export default function CertificateOfEmployment({ formData = {}, onBack, onLogout }) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const handleCheckboxChange = (id) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };



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
        // Transform certificate type (always 'Clearance' for this component)
        certificate_type: 'Clearance',
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
        purpose: formData.purpose || 'Certificate of Employment',
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
            <div className="w-96 h-96 rounded-full border-[20px] border-blue-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">⚕️</div>
              </div>
            </div>
          </div>

          {/* HEADER WITH THREE LOGOS */}
          <div className="flex justify-between items-start mb-3 relative z-10">
            {/* Left Logo */}
            <div className="w-20 h-20 flex-shrink-0">
              <div className="w-full h-full rounded-full border-4 border-pink-400 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-pink-500 text-2xl">⚕️</div>
                </div>
              </div>
            </div>

            {/* Center Text */}
            <div className="text-center flex-1 mx-4">
              <p className="text-[11px] font-medium text-gray-700">Republika ng Pilipinas</p>
              <p className="text-[11px] font-bold text-red-600 tracking-wide">Tanggapan ng Sangguniang Barangay</p>
              <p className="text-[13px] font-extrabold text-red-600 tracking-wider">BARANGAY KALUSUGAN</p>
              <p className="text-[10px] text-gray-600 mt-0.5">Area 21, District IV, Quezon City</p>
              <p className="text-[10px] text-gray-600">☎ 252-96-21</p>
              <p className="text-[10px] text-gray-600">Email: barangayskkalusugan@gmail.com</p>
            </div>

            {/* Right Logos */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-lg border-2 border-orange-400 flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
                <div className="text-center">
                  <div className="text-orange-500 text-xl">🕊️</div>
                </div>
              </div>
              <div className="w-16 h-16 rounded-lg border-2 border-blue-400 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-center">
                  <div className="text-blue-600 text-xl">🏛️</div>
                </div>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-center font-bold text-xl mb-3 tracking-[0.3em] relative z-10">
            CERTIFICATION
          </h1>

          <hr className="border-t-2 border-gray-800 mb-3 relative z-10" />

          {/* BODY */}
          <div className="text-[12px] leading-relaxed relative z-10">
            
            <p className="font-semibold mb-2 italic">To Whom It May Concern:</p>

            <p className="text-justify mb-3 indent-8">
              This is to certify that below name is a bonafide resident of this Barangay and who is personally known to me to be a law-abiding citizen and of good moral character. That of my own personal knowledge, he / she has not committed, nor been charged to any kind of unlawful activities in the Barangay.
            </p>

            {/* INFORMATION FIELDS */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">Name:</span>
                <div className="flex-1 border-b border-black pb-0.5">
                  <span className="text-[12px]">{formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">Civil Status:</span>
                <div className="flex-1 border-b border-black pb-0.5">
                  <span className="text-[12px] capitalize">{formData.civil_status || ''}</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">Address:</span>
                <div className="flex-1 border-b border-black pb-0.5">
                  <span className="text-[12px]">{formData.address || ''}</span>
                </div>
              </div>
            </div>

            <p className="mb-2 text-justify">
              This certification is being issued upon the request of the above – named applicant for:
            </p>

            {/* CHECKBOX SECTION */}
            <div className="space-y-1 mb-3">
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="employment"
                  checked={selectedCheckboxes.employment || false}
                  onChange={() => handleCheckboxChange("employment")}
                  className="mt-0.5 print:appearance-auto"
                />
                <label htmlFor="employment" className="font-semibold text-[11px] cursor-pointer">
                  EMPLOYMENT (Local / Abroad)
                </label>
              </div>
              
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="pwd"
                  checked={selectedCheckboxes.pwd || false}
                  onChange={() => handleCheckboxChange("pwd")}
                  className="mt-0.5 print:appearance-auto"
                />
                <label htmlFor="pwd" className="text-[11px] cursor-pointer">
                  Application for (NEW / RENEWAL) of PWD ID / SENIOR CITIZEN ID / SOLO PARENT ID
                </label>
              </div>
              
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="philhealth"
                  checked={selectedCheckboxes.philhealth || false}
                  onChange={() => handleCheckboxChange("philhealth")}
                  className="mt-0.5 print:appearance-auto"
                />
                <label htmlFor="philhealth" className="text-[11px] cursor-pointer">
                  PHILHEALTH / OPEN BANK ACCOUNT / POSTAL ID / T.I.N.
                </label>
              </div>
              
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="others"
                  checked={selectedCheckboxes.others || false}
                  onChange={() => handleCheckboxChange("others")}
                  className="mt-0.5 print:appearance-auto"
                />
                <label htmlFor="others" className="text-[11px] cursor-pointer">
                  OTHERS:
                  <span className="inline-block border-b border-black w-64 ml-2"></span>
                </label>
              </div>
            </div>

            {/* DATE AND PLACE */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[11px] whitespace-nowrap">Date Issued:</span>
                  <div className="flex-1 border-b border-black pb-0.5">
                    <span className="text-[11px]">{getCurrentDate()}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[11px] whitespace-nowrap">Place Issued:</span>
                  <span className="text-[11px]">Barangay Kalusugan, Quezon City</span>
                </div>
              </div>
            </div>

            {/* AUTHORIZATION TEXT */}
            <p className="text-[10px] mb-4 italic">
              Signed FOR and BY the approval of Kap. ROCKY DLA. CRUZ RABANAL<br/>
              (as cited in Among Barangay's records/File)
            </p>

            {/* SIGNATURE SECTION */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-[10px] mb-1">HON:</p>
                <div className="border-b border-black h-16 mb-1 flex items-end justify-center">
                  {/* Signature placeholder */}
                </div>
                <p className="text-[10px] font-semibold text-center">Kagawad, Officer-On-Duty</p>
              </div>

              <div className="text-center">
                <div className="h-16 mb-1 flex items-end justify-center">
                  <div className="text-right">
                    <p className="font-bold text-[13px]">HON. ROCKY DC. RABANAL</p>
                    <p className="text-[11px] border-t border-black pt-1 mt-1">Punong Barangay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RECEIVED BY SECTION */}
            <div className="border-t border-gray-300 pt-3 mb-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-semibold mb-2">Received by:</p>
                  <div className="border-b border-black h-12 mb-1"></div>
                  <p className="text-[10px] text-center">(Applicant Sign Here)</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold mb-2">Date:</p>
                  <div className="border-b border-black h-12"></div>
                </div>
              </div>
            </div>

            {/* BARANGAY OFFICIALS FOOTER */}
            <div className="border-t-2 border-gray-300 pt-3">
              {/* Row 1 */}
              <div className="grid grid-cols-5 gap-2 text-[9px] text-center mb-2">
                <div>
                  <p className="font-bold">HON. ROCKY DC. RABANAL</p>
                  <p className="text-[8px]">Punong Barangay</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Roderick M. Hara</p>
                  <p className="text-[8px]">Committee on Finance</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Christopher C. Serrano</p>
                  <p className="text-[8px]">Committee on Public Order</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Margaret Lyra Maruzza</p>
                  <p className="text-[8px]">Committee on Health and Sanitation</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Ferdison D. Barbon</p>
                  <p className="text-[8px]">Committee on Streets and Roads</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-5 gap-2 text-[9px] text-center mb-2">
                <div>
                  <p className="font-bold">Kap. Marlon A. Buenaventura</p>
                  <p className="text-[8px]">Committee on Peace Order</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Robin C. Portaje</p>
                  <p className="text-[8px]">Committee on Infrastructure</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Kap. Reynaldo SJ. Sara</p>
                  <p className="text-[8px]">Committee on Beautification</p>
                  <p className="text-[8px]">Barangay Kagawad</p>
                </div>
                <div>
                  <p className="font-bold">Secretary:</p>
                  <p className="text-[8px]">Corazon L. Prado</p>
                </div>
                <div>
                  <p className="font-bold">Treasurer:</p>
                  <p className="text-[8px]">Florentine P. Estrada</p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-5 gap-2 text-[9px] text-center">
                <div>
                  <p className="font-bold">BPSO Ex-O</p>
                  <p className="text-[8px]">Elmer Z. Pinca</p>
                </div>
                <div>
                  <p className="font-bold">SK Chairperson</p>
                  <p className="text-[8px]">John Vincent D. Aliado</p>
                </div>
                <div></div>
                <div></div>
                <div></div>
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
