import React from "react";

export default function Residency({ formData = {}, onBack, onLogout }) {
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
          <div className="w-40 bg-gray-50 border-r border-gray-300 p-6 text-xs leading-relaxed">
            <p className="font-bold text-center mb-4 text-sm">BARANGAY KALUSUGAN</p>
            <p className="text-center font-semibold mb-4 text-xs">Hon. Rocky DC. Rabanal<br/>Punong Barangay</p>

            <div className="space-y-3 text-center">
              <div>
                <p className="font-semibold">Kap.</p>
                <p>Roderick M. Hara</p>
                <p className="text-xs text-gray-600">COMMITTEE ON FINANCE</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Christopher C. Serrano</p>
                <p className="text-xs text-gray-600">COMMITTEE ON PUBLIC ORDER AND SAFETY</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Margaret Lyra Maruzza</p>
                <p className="text-xs text-gray-600">COMMITTEE ON HEALTH AND SANITATION</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Ferdison D. Barbon</p>
                <p className="text-xs text-gray-600">COMMITTEE ON STREETS, ROADS AND LIVELIHOOD</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Marlon A. Buenaventura</p>
                <p className="text-xs text-gray-600">COMMITTEE ON PEACE AND ORDER AND JUSTICE</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Robin C. Portaje</p>
                <p className="text-xs text-gray-600">COMMITTEE ON INFRA STRUCTURE, PUBLIC WORKS AND UTILITIES</p>
              </div>

              <div>
                <p className="font-semibold">Kap.</p>
                <p>Filamela S. Ayan</p>
                <p className="text-xs text-gray-600">COMMITTEE ON SANITATION AND BEAUTIFICATION OF THE BARANGAY</p>
              </div>

              <div>
                <p className="font-semibold text-red-600">SK Chairperson</p>
                <p>John Vincent D. Aliado</p>
              </div>

              <div>
                <p className="font-semibold">Kalhim</p>
                <p>Corazon L. Prado</p>
              </div>

              <div>
                <p className="font-semibold text-red-600">Jigal Venson</p>
                <p>Fridie U. Uigado</p>
              </div>

              <div>
                <p className="font-semibold text-blue-600">B.P.S.O. Executive Officer</p>
                <p>Elmer Z. Pinca</p>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-12">
            {/* HEADER LOGOS */}
            <div className="flex justify-between items-center mb-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs">
                LOGO
              </div>

              <div className="text-center flex-1">
                <p className="text-xs font-semibold text-red-600">Republika ng Pilipinas</p>
                <p className="text-xs font-semibold text-red-600">Tanggapan ng Sangguniang Barangay</p>
                <p className="text-xs font-semibold text-red-600">BARANGAY KALUSUGAN</p>
                <p className="text-xs">Area 21, District IV, Quezon City</p>
              </div>

              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs">
                LOGO
              </div>
            </div>

            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs">
                LOGO
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-center font-bold text-lg mb-6">
              CERTIFICATE OF RESIDENCY
            </h2>

            {/* BODY */}
            <p className="mb-4 text-sm">To Whom This May Concern:</p>

            <p className="mb-4 text-sm leading-relaxed">
              This is to certify that <u>&nbsp;{formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}&nbsp;</u><br/>
              <u>&nbsp;{formData.age || ''} years old, {formData.civil_status || 'Single'}&nbsp;</u> is a bonafide resident of <u>&nbsp;{formData.address || ''}&nbsp;</u>
            </p>

            <p className="mb-4 text-sm leading-relaxed">
              Quezon City, this barangay.
            </p>

            <p className="mb-4 text-sm leading-relaxed">
              Further certify that <u>&nbsp;{formData.first_name && `${formData.first_name} ${formData.last_name || ''}`.trim()}&nbsp;</u> is<br/>
              a resident in this barangay for <u>&nbsp;{formData.years_residing || ''}&nbsp;</u> now up to present.
            </p>

            <p className="mb-4 text-sm leading-relaxed">
              That of my own personal knowledge he / she did not commit any unlawful acts and has no derogatory record in our barangay.
            </p>

            <p className="mb-4 text-sm leading-relaxed">
              This certification is being issued upon the request of the above-<br/>
              named person for whatever legal purpose it may serve.
            </p>

            <p className="mb-8 text-sm leading-relaxed">
              Issued this <u>&nbsp;{getCurrentDate()}&nbsp;</u> in<br/>
              Barangay Kalusugan, Quezon City.
            </p>

            {/* SIGNATURE SECTION */}
            <div className="text-center">
              <div className="h-16 mb-2"></div>
              <p className="font-bold uppercase text-sm">
                HON. ROCKY DC. RABANAL
              </p>
              <p className="text-sm">Punong Barangay</p>
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
