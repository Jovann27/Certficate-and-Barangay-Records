import React, { useState } from "react";

export default function CertificateOfEmployment({ formData = {}, onBack, onLogout }) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const handleCheckboxChange = (id) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExport = (type) => {
    alert(`Exporting Certificate as ${type.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
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

  const idOptions = [
    "Application for (NEW / RENEWAL) of PWD ID / SENIOR CITIZEN ID / SOLO PARENT ID",
    "PHILHEALTH / OPEN BANK ACCOUNT / POSTAL ID / T.I.N.",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {onLogout && (
        <header className="bg-white shadow-sm border-b border-gray-200">
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
          <div className="absolute inset-0 flex items-center justify-end opacity-10 pointer-events-none mr-20">
            <div className="w-48 h-48 rounded-full border-8 border-blue-400"></div>
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-center">
              LOGO
            </div>

            <div className="text-center flex-1 mx-4">
              <p className="text-xs font-semibold">Republika ng Pilipinas</p>
              <p className="text-xs font-semibold text-red-600">Tanggapan ng Sangguniang Barangay</p>
              <p className="text-xs font-semibold text-red-600">BARANGAY KALUSUGAN</p>
              <p className="text-xs">Area 21, District IV, Quezon City</p>
              <p className="text-xs">6 252-96-21</p>
              <p className="text-xs">Email: barangayskkalusugan@gmail.com</p>
            </div>

            <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
              LOGO
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-center font-bold text-lg mb-4 tracking-widest relative z-10">
            CERTIFICATION
          </h1>

          <hr className="mb-4 relative z-10" />

          {/* BODY */}
          <div className="text-sm leading-relaxed relative z-10 space-y-3">
            
            <p className="font-semibold">To Whom It May Concern:</p>

            <p className="text-justify">
              This is to certify that below name is a bonafide resident of this Barangay and who is personally known to me to be a law-abiding citizen and of good moral character. That of my own personal knowledge, he / she has not committed, nor been charged to any kind of unlawful activities in the Barangay.
            </p>

            {/* INFORMATION SECTION */}
            <div className="space-y-2 mt-4">
              <div className="flex gap-2">
                <span className="font-semibold min-w-[80px]">Name:</span>
                <div className="flex-1 border-b border-gray-400">
                  <p className="text-sm pb-1">{formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[80px]">Signature:</span>
                <div className="flex-1 border-b border-gray-400"></div>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[80px]">Civil Status:</span>
                <div className="flex-1 border-b border-gray-400">
                  <p className="text-sm pb-1 capitalize">{formData.civil_status || ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[80px]">Birthday/Age:</span>
                <div className="flex-1 border-b border-gray-400">
                  <p className="text-sm pb-1">{formData.date_of_birth && `${formatDate(formData.date_of_birth)} / ${formData.age || ''}`}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[80px]">Address:</span>
                <div className="flex-1 border-b border-gray-400">
                  <p className="text-sm pb-1">{formData.address || ''}</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-justify">
              This certification is being issued upon the request of the above – named applicant for:
            </p>

            {/* CHECKBOX SECTION */}
          <div className="border-2 border-gray-400 p-3 mt-3 space-y-2 relative z-10">
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="employment"
                onChange={() => handleCheckboxChange("employment")}
                className="mt-1"
              />
              <label htmlFor="employment" className="font-semibold text-sm">
                EMPLOYMENT (Local / Abroad)
              </label>
            </div>
            
            {idOptions.map((option, index) => (
              <div key={index} className="flex items-start gap-2 ml-6">
                <input 
                  type="checkbox" 
                  id={`option-${index}`}
                  onChange={() => handleCheckboxChange(`option-${index}`)}
                  className="mt-1"
                />
                <label htmlFor={`option-${index}`} className="text-xs">
                  {option}
                </label>
              </div>
            ))}
          </div>

          {/* DATE AND PLACE */}
          <div className="mt-6 space-y-2 relative z-10">
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="font-semibold text-sm">Date Issued:</span>
                <div className="border-b border-gray-400 mt-1">
                  <p className="text-sm pb-1">{getCurrentDate()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold text-sm">Place Issued:</span>
              <span className="text-sm">Barangay Kalusugan, Quezon City</span>
            </div>
          </div>
        </div>

        {/* SIGNATURE AUTHORIZATION */}
        <p className="text-xs mt-4 relative z-10 font-semibold">
          Signed FOR and BY the approval of Kap. ROCKY DLA. CRUZ RABANAL<br/>
          as cited in Among Barangay's records/File)
        </p>

        {/* SIGNATURE SECTION */}
        <div className="grid grid-cols-2 gap-8 mt-8 relative z-10">
          <div>
            <p className="text-xs mb-2">HON:</p>
            <div className="border-b border-gray-400 h-12 mb-2"></div>
            <p className="text-xs font-semibold">Apparent Kap./Truthful</p>
          </div>

          <div className="text-right">
            <div className="h-20 mb-2"></div>
            <p className="font-semibold text-sm">
              HON. ROCKY DC. RABANAL
            </p>
            <p className="text-xs">Punong Barangay</p>
          </div>
        </div>

        {/* RECEIVED BY SECTION */}
        <div className="mt-8 relative z-10">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold mb-4">Received by:</p>
              <div className="border-b border-gray-400 h-12 mb-2"></div>
              <p className="text-xs">Name</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-4">Date:</p>
              <div className="border-b border-gray-400"></div>
            </div>
          </div>
        </div>

        {/* OFFICIALS SECTION */}
        <div className="mt-8 border-t border-gray-300 pt-4 relative z-10">
          <div className="grid grid-cols-5 gap-2 text-xs text-center">
            <div>
              <p className="font-semibold">HON. ROCKY DC. RABANAL</p>
              <p className="text-xs">Punong Barangay</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Roderick M. Hara</p>
              <p className="text-xs">Committee on Finance</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Christopher C. Serrano</p>
              <p className="text-xs">Committee on Public Order</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Margaret Lyra Maruzza</p>
              <p className="text-xs">Committee on Health and Sanitation</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Ferdison D. Barbon</p>
              <p className="text-xs">Committee on Streets and Roads</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-xs text-center mt-4">
            <div>
              <p className="font-semibold">Kap. Marlon A. Buenaventura</p>
              <p className="text-xs">Committee on Peace Order</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Robin C. Portaje</p>
              <p className="text-xs">Committee on Infrastructure</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Kap. Reynaldo SJ. Sara</p>
              <p className="text-xs">Committee on Beautification</p>
              <p className="text-xs">Barangay Kagawad</p>
            </div>
            <div>
              <p className="font-semibold">Secretary:</p>
              <p className="text-xs">Corazon L. Prado</p>
            </div>
            <div>
              <p className="font-semibold">Treasurer:</p>
              <p className="text-xs">Florentine P. Estrada</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-xs text-center mt-4">
            <div>
              <p className="font-semibold">BPSO Ex-O</p>
              <p className="text-xs">Elmer Z. Pinca</p>
            </div>
            <div>
              <p className="font-semibold">SK Chairperson</p>
              <p className="text-xs">John Vincent D. Aliado</p>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-8 relative z-10">
          <button onClick={onBack} className="px-4 py-2 border border-gray-400 rounded-md bg-white hover:bg-gray-50">
            Back
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Print
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("image")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export Image
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
