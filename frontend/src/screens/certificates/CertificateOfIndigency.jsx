import React from "react";

export default function CertificateOfIndigency({ formData = {}, onBack, onLogout }) {
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
        <div className="bg-white w-full max-w-6xl shadow-lg flex">
          
          {/* LEFT SIDEBAR */}
          <div className="w-48 bg-blue-50 border-r-2 border-blue-300 p-6 text-xs leading-relaxed">
            <p className="font-bold text-center mb-2 text-sm text-blue-700">BARANGAY KALUSUGAN</p>
            <p className="text-center font-semibold mb-1 text-xs">Hon. Rocky DC. Rabanal</p>
            <p className="text-center text-red-600 font-semibold text-xs mb-4">Punong Barangay</p>
            
            <hr className="border-blue-300 mb-4" />
            
            <div className="space-y-3 text-center">
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Roderick M. Hara</p>
                <p className="text-xs text-gray-600">COMMITTEE ON FINANCE</p>
                <p className="text-xs text-gray-600">AGRICULTURAL COMMERCE, AND SENIOR CITIZEN AFFAIRS</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Christopher C. Serrano</p>
                <p className="text-xs text-gray-600">COMMITTEE ON PUBLIC ORDER, PUBLIC SAFETY, URBAN PLANNING, TRAFFIC WELFARE AND LIGHT</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Margaret Lyra Maruzza</p>
                <p className="text-xs text-gray-600">COMMITTEE ON HEALTH EDUCATION, LIVELIHOOD AND SERVICES</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Ferdison D. Barbon</p>
                <p className="text-xs text-gray-600">COMMITTEE ON STREETS, ROADS AND GOOD PAVEMENT, ANIMAL RIGHTS ADVOCACY AND DISCIPLINE</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Eloisa R. Forturon</p>
                <p className="text-xs text-gray-600">COMMITTEE ON SANITATION, BEAUTIFICATION, SOLID WASTE AND</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Robin C. Portaje</p>
                <p className="text-xs text-gray-600">COMMITTEE ON INFRASTRUCTURE, PUBLIC WORKS, STREETS, FINANCE AND UTILITIES</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kap.</p>
                <p className="text-xs">Reynaldo SJ. Sara</p>
                <p className="text-xs text-gray-600">COMMITTEE ON BEAUTIFICATION AND ENVIRONMENTAL MANAGEMENT</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 text-xs">SK Chairperson</p>
                <p className="text-xs">John Vincent D. Aliado</p>
              </div>
              
              <div>
                <p className="font-semibold text-xs">Kalhim</p>
                <p className="text-xs">Corazon L. Prado</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 text-xs">Jigal Venson</p>
                <p className="text-xs">Fridie U. Uigado</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 text-xs">B.P.S.O. Executive Officer</p>
                <p className="text-xs">Elmer Z. Pinca</p>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-10">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-2">
              <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
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

              <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                LOGO
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                LOGO
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-center font-bold text-xl mb-6 tracking-wide">
              CERTIFICATE OF INDIGENCY
            </h1>

            {/* BODY */}
            <div className="text-sm leading-relaxed space-y-3">
              
              <p className="text-center text-sm">
                This is to certify that below name is a resident of this Barangay.
              </p>

              {/* INFORMATION SECTION */}
              <div className="space-y-2 mt-4">
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[100px] text-sm">Name:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1">
                      {formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[100px] text-sm">Birthday/Age:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1">
                      {formData.date_of_birth && `${formatDate(formData.date_of_birth)} / ${formData.age || ''}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[100px] text-sm">Civil Status:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1 capitalize">{formData.civil_status || ''}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[100px] text-sm">Address:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1">{formData.address || ''}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <span className="font-semibold min-w-[100px] text-sm">Purpose:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1 capitalize">{formData.purpose || ''}</p>
                  </div>
                </div>
              </div>

              {/* CERTIFICATION TEXT */}
              <p className="text-justify text-sm mt-6">
                Further certify that the above-named applicant has low/no income and belongs to one of the most indigent families in our barangay.
              </p>

              {/* DATE AND PLACE */}
              <div className="mt-6 space-y-2">
                <div className="flex gap-4">
                  <span className="font-semibold text-sm min-w-[100px]">Date Issued:</span>
                  <div className="flex-1 border-b border-gray-400">
                    <p className="text-sm pb-1">{getCurrentDate()}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold text-sm min-w-[100px]">Place Issued:</span>
                  <span className="text-sm">Barangay Kalusugan, Quezon City</span>
                </div>
              </div>
            </div>

            {/* SIGNATURE SECTION */}
            <div className="mt-12">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="h-20 mb-2"></div>
                  <p className="font-bold text-sm">
                    HON. ROCKY DELA CRUZ RABANAL
                  </p>
                  <p className="text-xs">Punong Barangay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 ml-6 h-fit">
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
  );
}
