import React from "react";

export default function CertificateExport() {
  const handleExport = (type) => {
    alert(`Exporting Certificate as ${type.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-5xl p-10 shadow-lg text-sm leading-relaxed">

        {/* HEADER LOGOS */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-16 h-16 border rounded-full flex items-center justify-center text-xs">
            LOGO
          </div>

          <div className="text-center">
            <p className="font-bold uppercase">Republic of the Philippines</p>
            <p className="font-semibold uppercase">Barangay Kalusugan</p>
            <p>District IV, Quezon City</p>
          </div>

          <div className="w-16 h-16 border rounded-full flex items-center justify-center text-xs">
            LOGO
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border rounded-full flex items-center justify-center text-xs">
            LOGO
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center font-bold uppercase underline mb-6">
          Certificate of Residency
        </h2>

        {/* BODY */}
        <p className="mb-4 font-semibold uppercase">To whom it may concern:</p>

        <p className="mb-4">
          This is to certify that <strong>________________________</strong>,
          Filipino, of legal age, single/married, is a bonafide resident of
          <strong> ________________________</strong>, Barangay Kalusugan,
          District IV, Quezon City.
        </p>

        <p className="mb-4">
          This certification is issued upon the request of the above-named
          person for whatever legal purpose it may serve.
        </p>

        <p className="mb-8">
          Issued this <strong>_____</strong> day of
          <strong> ______________ 2023</strong> at Barangay Kalusugan,
          District IV, Quezon City.
        </p>

        {/* SIGNATURE SECTION */}
        <div className="grid grid-cols-3 gap-6 mb-10 text-center">
          <div>
            <div className="h-20 border mb-2"></div>
            <p className="font-semibold">Applicant Signature</p>
          </div>

          <div>
            <div className="h-20 border mb-2"></div>
            <p className="font-semibold">Applicant Thumbmark</p>
          </div>

          <div>
            <div className="h-20 border-b mb-2"></div>
            <p className="font-semibold uppercase">
              Hon. Rocky D. Rabanal
            </p>
            <p className="text-xs">Punong Barangay</p>
          </div>
        </div>

        {/* FOOTER NOTES */}
        <div className="text-xs mb-6">
          <p>• Not valid without official Barangay Dry Seal.</p>
          <p>• Not valid without official signature.</p>
          <p>• Any alteration renders this certificate void.</p>
        </div>

        {/* OFFICIALS */}
        <div className="grid grid-cols-3 gap-4 text-xs border-t pt-4">
          <div>
            <p className="font-semibold uppercase">Barangay Officials</p>
            <p>Hon. Rocky D. Rabanal</p>
            <p>Punong Barangay</p>
          </div>

          <div>
            <p className="font-semibold">Barangay Kagawad</p>
            <p>Kap. Richard M. Santos</p>
            <p>Kap. Christopher C. Serrano</p>
            <p>Kap. Margaret Lyn M. Navarro</p>
          </div>

          <div>
            <p className="font-semibold">Barangay Staff</p>
            <p>Barangay Treasurer</p>
            <p>Barangay Secretary</p>
            <p>SK Chairperson</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("image")}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Export Image
          </button>
        </div>
      </div>
    </div>
  );
}
