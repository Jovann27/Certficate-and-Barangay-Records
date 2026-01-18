import React from "react";

export default function Residency2({ formData = {}, onBack, onLogout }) {
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
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-4xl shadow-lg p-8 relative">
        
        {/* WATERMARK - BACKGROUND */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full border-8 border-gray-400"></div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-center">
            LOGO
          </div>

          <div className="text-center flex-1 mx-4">
            <p className="text-xs font-semibold">Republika ng Pilipinas</p>
            <p className="text-xs font-semibold text-red-600">Tanggapan ng Sangguniang Barangay</p>
            <p className="text-xs font-semibold text-red-600">BARANGAY KALUSUGAN</p>
            <p className="text-xs">Area 21, District IV, Quezon City</p>
            <p className="text-xs">6 253-00-21</p>
            <p className="text-xs">Email: barangayskkalusugan@gmail.com</p>
          </div>

          <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
            LOGO
          </div>
        </div>

        <div className="flex justify-center mb-4 relative z-10">
          <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
            LOGO
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-center font-bold text-xl mb-6 relative z-10">
          CERTIFICATE OF RESIDENCY
        </h1>

        {/* BODY */}
        <div className="text-sm leading-relaxed relative z-10 space-y-3">
          
          <p className="font-semibold uppercase">
            TO WHOM IT MAY CONCERN:
          </p>

          <p>
            This is to certify that <strong>{formData.first_name && `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`.trim()}</strong>, born on <strong>{formatDate(formData.date_of_birth)}, {formData.civil_status || 'Single'}</strong> is a bonafide resident of <strong>{formData.address}</strong> since {formData.years_residing || 'many years'} up to present.
          </p>

          <p>
            The undersigned has certified that after a reasonable inquiry, I have verified the authenticity of barangay residency showing that the applicant has been residing in the barangay for at least six (6) months prior to the application of this affidavit of residency.
          </p>

          <p>
            This certification is issued upon the request of the above-named person as a supporting document for <strong>SENIOR IN PURPOSE.</strong>
          </p>

          <p>
            Issued this <strong>{getCurrentDate()}</strong> at Barangay Kalusugan, District IV, Quezon City.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="grid grid-cols-2 gap-8 mt-8 mb-8 relative z-10">
          <div className="text-center">
            <div className="border-2 border-blue-400 bg-blue-50 h-32 mb-2 flex items-center justify-center">
              <p className="text-xs text-gray-500">APPLICANT PHOTO</p>
            </div>
            <p className="font-semibold text-sm uppercase">APPLICANT PHOTO</p>
          </div>

          <div className="text-center">
            <div className="border-2 border-blue-400 h-32 mb-2"></div>
            <p className="text-xs text-gray-600">Applicant's Signature</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="text-center">
            <div className="border-2 border-blue-400 h-32 mb-2"></div>
            <p className="text-sm uppercase font-semibold">APPLICANT THUMBMARK</p>
          </div>

          <div className="text-center">
            <div className="h-16 mb-2"></div>
            <p className="font-semibold uppercase text-sm">
              HON. ROCKY DC. RABANAL
            </p>
            <p className="text-xs">Punong Barangay</p>
          </div>
        </div>

        {/* OFFICIALS SECTION */}
        <div className="relative z-10">
          <div className="text-xs mb-4">
            <p><strong>Issued By:</strong> Barangay Kalusugan Hall</p>
            <p><strong>Issued On:</strong> January 01, 2025</p>
            <p><strong>Valid Until:</strong> July 01, 2025 (6 months)</p>
          </div>

          <div className="text-xs mb-6 space-y-1">
            <p>• This certificate is not valid without official Barangay Dry Seal.</p>
            <p>• Not valid without Punong Barangay Signature / Thumbmark or Official Stamp, this document is not valid certification or proof of residency. Changes thereof or criminal liabilities.</p>
          </div>
        </div>

        {/* OFFICIALS GRID */}
        <div className="grid grid-cols-5 gap-2 text-xs border-t border-gray-300 pt-4 relative z-10">
          <div className="text-center">
            <p className="font-semibold uppercase">HON. ROCKY DC. RABANAL</p>
            <p className="text-xs">Punong Barangay</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Roderick M. Hara</p>
            <p className="text-xs">Committee on Finance</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Christopher C. Serrano</p>
            <p className="text-xs">Committee on Public Order</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Margaret Lyra Maruzza</p>
            <p className="text-xs">Committee on Health and Sanitation</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Ferdison D. Barbon</p>
            <p className="text-xs">Committee on Streets and Roads</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-xs border-t border-gray-300 pt-4 mt-4 relative z-10">
          <div className="text-center">
            <p className="text-xs">Barangay Officials</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Marlon A. Buenaventura</p>
            <p className="text-xs">Committee on Peace Order</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Robin C. Portaje</p>
            <p className="text-xs">Committee on Infrastructure</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Kap. Filamela S. Ayan</p>
            <p className="text-xs">Committee on Sanitation and Environmental Management</p>
            <p className="text-xs">Barangay Kagawad</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Secretary:</p>
            <p className="text-xs">Florentino P. Estrada</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-xs border-t border-gray-300 pt-4 mt-4 relative z-10">
          <div className="text-center">
            <p className="text-xs">Treasurer:</p>
            <p className="text-xs">Florete P. Estrada</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">BPSO Ex-O</p>
            <p className="text-xs">Elmer Z. Pinca</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">SK Chairperson</p>
            <p className="text-xs">John Vincent D. Aliado</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Prepared by: Analyn Rose</p>
            <p className="text-xs">Reference Number: RS-KLG-001</p>
            <p className="text-xs">Document File: VK-2023-001</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold">Not valid Without Official Barangay Seal</p>
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
  );
}
