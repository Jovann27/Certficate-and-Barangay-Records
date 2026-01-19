import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import kalusugan from '../../assets/kalusugan.png';
import qc from '../../assets/qc.png';
import bgp from '../../assets/bgp.png';

export default function CertificateOfIndigency({ formData = {}, onBack, onLogout }) {
  const [officials, setOfficials] = useState({});

  // Fetch officials data
  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await fetch('/api/officials');
        if (response.ok) {
          const data = await response.json();
          const officialsMap = {};
          data.data.forEach(official => {
            officialsMap[official.position_order] = official;
          });
          setOfficials(officialsMap);
        }
      } catch (error) {
        console.error('Error fetching officials:', error);
      }
    };

    fetchOfficials();
  }, []);


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
        // Transform certificate type (always 'Indigency' for this component)
        certificate_type: 'Indigency',
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
        purpose: formData.purpose || 'Certificate of Indigency',
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
                <div className=" text-white p-2 rounded-lg">
                  <span className="text-xl font-bold">
                  </span>
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
        <div className="bg-white w-full max-w-5xl shadow-lg relative">
          
          {/* MAIN LAYOUT - TWO COLUMNS */}
          <div className="grid grid-cols-[180px_1fr]">
            
            {/* LEFT SIDEBAR - OFFICIALS LIST */}
            <div className="bg-white border-r-2 border-blue-400 p-3">
              
              {/* Barangay Logo/Seal */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 rounded-full border-4 border-purple-400 flex items-center justify-center bg-white relative">
                  <div className="absolute inset-0 rounded-full border-4 border-pink-300" style={{ margin: '4px' }}></div>
                  <div className="text-center z-10">
                    <div className="text-pink-500 text-2xl">
                      <img src={kalusugan} alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Barangay Header in Sidebar */}
              <div className="text-center mb-4">
                <h2 className="text-blue-600 font-bold text-[11px] mb-1">BARANGAY KALUSUGAN</h2>
                <p className="text-[9px] text-gray-700">{officials[1]?.name || 'Hon. Rocky DC. Rabanal'}</p>
                <p className="text-[9px] text-red-500 font-semibold">Punong Barangay</p>
              </div>

              <hr className="border-blue-300 mb-3" />

              {/* Officials List */}
              <div className="space-y-3 text-center text-[8px] leading-tight">
                
                <div>
                  <p className="font-bold text-blue-600 mb-0.5">Kagawad</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Roderick M. Hara</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON LIVELIHOOD</p>
                  <p className="text-gray-600 text-[7px]">COOPERATIVE, INDUSTRY, AND SENIOR CITIZEN AFFAIRS</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Christopher C. Serrano</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON PUBLIC ORDER, PUBLIC SAFETY, AND</p>
                  <p className="text-gray-600 text-[7px]">TRAFFIC, WELFARE AND LIGHT</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Margaret Lyra Maruzza</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON HEALTH, EDUCATION,</p>
                  <p className="text-gray-600 text-[7px]">LIVELIHOOD AND SERVICES</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Ferdison D. Barbon</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON STREETS</p>
                  <p className="text-gray-600 text-[7px]">AND ROADS, GOOD PAVEMENT, ANIMAL RIGHTS ADVOCACY AND JUSTICE</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Eloisa R. Fayanes</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON SANITATION,</p>
                  <p className="text-gray-600 text-[7px]">BEAUTIFICATION, SOLID WASTE MANAGEMENT, PARKS AND RECREATION</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Robin C. Portaje</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON INFRASTRUCTURE,</p>
                  <p className="text-gray-600 text-[7px]">PUBLIC PLANNING, BUILDING, FINANCE, AND UTILITIES</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700 text-[9px]">Reynaldo SJ. Sara</p>
                  <p className="text-gray-600 uppercase text-[7px]">COMMITTEE ON SANITATION AND</p>
                  <p className="text-gray-600 text-[7px]">ENVIRONMENTAL MANAGEMENT</p>
                </div>

                <div className="pt-2">
                  <p className="font-bold text-red-600 mb-0.5 text-[8px]">SK Chairman</p>
                  <p className="font-semibold text-blue-700 text-[9px]">John Vincent D. Aliado</p>
                </div>

                <div>
                  <p className="font-bold text-blue-600 mb-0.5 text-[8px]">Kalihim</p>
                  <p className="font-semibold text-blue-700 text-[9px]">Corazon L. Prado</p>
                </div>

                <div>
                  <p className="font-bold text-blue-600 mb-0.5 text-[8px]">Ingat Yaman</p>
                  <p className="font-semibold text-blue-700 text-[9px]">Fritzie U. Ubpardo</p>
                </div>

                <div>
                  <p className="font-bold text-red-600 mb-0.5 text-[8px]">B.P.S.O. Executive Officer</p>
                  <p className="font-semibold text-blue-700 text-[9px]">Elmer Z. Pinca</p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="p-6">
              
              {/* HEADER WITH THREE LOGOS */}
              <div className="flex justify-between items-start mb-3">
                {/* Left Logo - Main Barangay Seal */}

                {/* Center Text */}
                <div className="text-center flex-1 mx-4">
                  <p className="text-[10px] font-medium text-gray-700">Republika ng Pilipinas</p>
                  <p className="text-[10px] font-bold text-red-600 tracking-wide">Tanggapan ng Sangguniang Barangay</p>
                  <p className="text-[12px] font-extrabold text-red-600 tracking-wider">BARANGAY KALUSUGAN</p>
                  <p className="text-[9px] text-gray-600 mt-0.5">Area 21, District IV, Quezon City</p>
                  <p className="text-[9px] text-gray-600">☎ 252-96-21</p>
                  <p className="text-[9px] text-gray-600">Email: barangayskkalusugan@gmail.com</p>
                </div>

                {/* Right Logos */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg border-2 border-orange-400 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
                    <div className="text-center">
                      <div className="text-orange-500 text-2xl">
                        <img src={bgp} alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-lg border-2 border-blue-400 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="text-center">
                      <div className="text-blue-600 text-xl">
                        <img src={qc} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-t border-gray-300 mb-4" />

              {/* TITLE */}
              <h1 className="text-center font-bold text-lg mb-4 tracking-wide">
                CERTIFICATE OF INDIGENCY
              </h1>

              {/* BODY CONTENT */}
              <div className="text-[11px] leading-relaxed">
                
                <p className="text-center mb-4">
                  This is to certify that below name is a resident of this Barangay.
                </p>

                {/* INFORMATION FIELDS */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Name:</span>
                    <div className="flex-1 border-b border-black pb-0.5">
                      <span className="text-[11px]">
                        {formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Birthday/Age:</span>
                    <div className="flex-1 border-b border-black pb-0.5">
                      <span className="text-[11px]">
                        {formData.date_of_birth && `${formatDate(formData.date_of_birth)} / ${formData.age || ''}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Civil Status:</span>
                    <div className="flex-1 border-b border-black pb-0.5">
                      <span className="text-[11px] capitalize">{formData.civil_status || ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Address:</span>
                    <div className="flex-1 border-b border-black pb-0.5">
                      <span className="text-[11px]">{formData.address || ''}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-semibold whitespace-nowrap min-w-[90px]">Purpose:</span>
                  <div className="flex-1 border-b border-black pb-0.5">
                    <span className="text-[11px]">{formData.purpose || ''}</span>
                  </div>
                </div>

                <p className="text-justify indent-8 mb-4">
                  Further certify that the above-named applicant has low/no income and belongs to one of the many indigent families in our barangay.
                </p>

                {/* DATE AND PLACE */}
                <div className="space-y-1 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Date Issued:</span>
                    <div className="flex-1 border-b border-black pb-0.5">
                      <span className="text-[11px]">{getCurrentDate()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap min-w-[90px]">Place Issued:</span>
                    <span className="text-[11px] font-semibold">Barangay Kalusugan, Quezon City</span>
                  </div>
                </div>

                {/* SIGNATURE SECTION */}
                <div className="mt-12 flex justify-center">
                  <div className="text-center">
                    <div className="mb-16"></div>
                    <p className="font-bold text-[12px]">{officials[1]?.name || 'HON. ROCKY DELA CRUZ RABANAL'}</p>
                    <p className="text-[10px]">Punong Barangay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER STRIP */}
          <div className="border-t-4 border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 h-3"></div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 p-4 print:hidden">
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
