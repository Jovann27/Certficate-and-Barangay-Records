import React from "react";
import { toast } from 'react-toastify';

export default function Residency2({ formData = {}, onBack, onLogout }) {


  const handlePrint = async () => {
    try {
      // Save resident data to database first
      const response = await fetch('/api/personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        <div className="bg-white w-full max-w-5xl shadow-lg relative">
          
          {/* MAIN LAYOUT - TWO COLUMNS */}
          <div className="grid grid-cols-[200px_1fr]">
            
            {/* LEFT SIDEBAR - OFFICIALS LIST */}
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-r-4 border-blue-600 p-4">
              
              {/* Barangay Logo/Seal */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-pink-400 flex items-center justify-center bg-white">
                  <div className="text-center">
                    <div className="text-pink-500 text-3xl">⚕️</div>
                  </div>
                </div>
              </div>

              {/* Barangay Header in Sidebar */}
              <div className="text-center mb-6">
                <h2 className="text-blue-700 font-bold text-sm mb-1">BARANGAY KALUSUGAN</h2>
                <p className="text-[10px] text-blue-600">Hon. Rocky DC. Rabanal</p>
                <p className="text-[10px] text-red-500 font-semibold">Punong Barangay</p>
              </div>

              {/* Officials List */}
              <div className="space-y-4 text-[9px]">
                <div className="text-center">
                  <p className="font-bold text-blue-700 mb-1">Kagawad</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Roderick M. Hara</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Civil Works</p>
                  <p className="text-[8px] text-gray-600">COOPERATIVE, INDUSTRY, TRADE BUSINESS, AND LIVELIHOOD</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Christopher C. Serrano</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Public Order, Peace and Safety</p>
                  <p className="text-[8px] text-gray-600">TRAFFIC, STREETS AND SAFETY</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Margaret Lyra Maruzza</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Health, Education, Family Planning and Social Welfare</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Ferdison D. Barbon</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Sports</p>
                  <p className="text-[8px] text-gray-600">and Good Government, Human Rights and Justice</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Elissa R. Fayanes</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Budget and Appropriations</p>
                  <p className="text-[8px] text-gray-600">Tourism, Parks and Recreation</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Robin C. Portaje</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Infrastructure</p>
                  <p className="text-[8px] text-gray-600">Public Planning, Buildings, etc.</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-semibold text-blue-800">Reynaldo SJ. Sara</p>
                  <p className="text-[8px] text-gray-600 uppercase">Committee on Sanitation and Environmental Management</p>
                </div>

                <div className="border-t border-blue-300 pt-2 mt-4">
                  <p className="font-bold text-blue-700 mb-1">SK Chairperson</p>
                  <p className="font-semibold text-blue-800">John Vincent D. Aliado</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-bold text-blue-700 mb-1">Kalihim</p>
                  <p className="font-semibold text-blue-800">Corazon L. Prado</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-bold text-blue-700 mb-1">Ingat Yaman</p>
                  <p className="font-semibold text-blue-800">Fritzie U. Ubpardo</p>
                </div>

                <div className="border-t border-blue-300 pt-2">
                  <p className="font-bold text-red-600 mb-1">B.P.S.O. Executive Officer</p>
                  <p className="font-semibold text-blue-800">Elmer Z. Pinca</p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="p-8">
              
              {/* HEADER WITH THREE LOGOS */}
              <div className="flex justify-between items-start mb-4">
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
                      <div className="text-orange-500 text-sm font-bold">SAGONG</div>
                      <div className="text-orange-500 text-[8px]">PILIPINAS</div>
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
              <h1 className="text-center font-bold text-xl mb-6 tracking-wide">
                CERTIFICATE OF RESIDENCY
              </h1>

              <hr className="border-t-2 border-gray-800 mb-4" />

              {/* BODY CONTENT */}
              <div className="text-[12px] leading-relaxed space-y-3">
                
                <p className="font-semibold italic">To Whom This May Concern:</p>

                <div className="space-y-2">
                  <p className="indent-8">
                    This is to certify that{' '}
                    <span className="inline-block border-b border-black min-w-[300px] px-1">
                      {formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}
                    </span>,
                  </p>
                  
                  <p>
                    born on{' '}
                    <span className="inline-block border-b border-black min-w-[200px] px-1">
                      {formatDate(formData.date_of_birth)}
                    </span>, is a bonafide resident of
                  </p>
                  
                  <p>
                    <span className="inline-block border-b border-black w-full px-1">
                      {formData.address || 'Quezon City, this barangay'}
                    </span>.
                  </p>

                  <p className="indent-8 mt-4">
                    Further certify that{' '}
                    <span className="inline-block border-b border-black min-w-[300px] px-1">
                      {formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim()}
                    </span>{' '}is
                  </p>
                  
                  <p>
                    a resident in this barangay for{' '}
                    <span className="inline-block border-b border-black min-w-[150px] px-1">
                      {formData.years_residing || ''}
                    </span>{' '}
                    years/months now up to present.
                  </p>

                  <p className="indent-8 mt-4">
                    That of my own personal knowledge he / she did not commit any unlawful acts and has no derogatory record in our barangay.
                  </p>

                  <p className="indent-8 mt-4">
                    This certification is being issued upon the request of the above-named applicant for{' '}
                    <span className="inline-block border-b border-black min-w-[250px] px-1"></span>.
                  </p>

                  <p className="mt-6">
                    Issued this{' '}
                    <span className="inline-block border-b border-black min-w-[80px] px-1 text-center"></span>{' '}
                    day of{' '}
                    <span className="inline-block border-b border-black min-w-[150px] px-1 text-center"></span>{' '}
                    in Barangay Kalusugan, Quezon City.
                  </p>
                </div>

                {/* SIGNATURE SECTION */}
                <div className="mt-12 flex justify-center">
                  <div className="text-center">
                    <div className="mb-16"></div>
                    <div className="border-t-2 border-black w-64 mx-auto mb-1"></div>
                    <p className="font-bold text-[13px]">HON. ROCKY DC. RABANAL</p>
                    <p className="text-[11px]">Punong Barangay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER STRIP */}
          <div className="border-t-4 border-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 h-3"></div>

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
      <style jsx>{`
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
