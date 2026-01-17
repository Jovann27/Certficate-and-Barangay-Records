import React, { useState } from 'react';
import logo from '../../assets/kalusugan.png';
import logo2 from '../../assets/qc.png';

const BusinessPermitCertificate = ({ data }) => {
  const [loading, setLoading] = useState(false);

  // Default data if none provided
  const defaultData = {
    proprietor_name: 'JUAN DELA CRUZ',
    business_name: 'DELA CRUZ STORE',
    nature_of_business: 'RETAIL TRADE',
    business_address: '123 Main Street, Barangay Kalusugan, Quezon City',
    amount_paid: '500.00',
    date_paid: '2024-01-15',
    or_number: 'OR-2024-001',
    received_by: 'MARIA SANTOS',
    applicant_signature: '',
    date_received: '2024-01-15',
    valid_until: '2024-12-31',
    control_number: 'BP-2024-001'
  };

  const certificateData = data || defaultData;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportPDF = async () => {
    if (!certificateData || !certificateData.proprietor_name || !certificateData.business_name) {
      alert('Certificate data is incomplete. Please fill out the form completely.');
      return;
    }

    setLoading(true);
    try {
      const pdfData = {
        proprietor_name: certificateData.proprietor_name,
        business_name: certificateData.business_name,
        nature_of_business: certificateData.nature_of_business,
        business_address: certificateData.business_address,
        amount_paid: certificateData.amount_paid,
        date_paid: certificateData.date_paid,
        or_number: certificateData.or_number,
        received_by: certificateData.received_by,
        date_received: certificateData.date_received,
        valid_until: certificateData.valid_until,
        control_number: certificateData.control_number
      };

      const response = await fetch('http://localhost:5000/api/business-permit/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `business-permit-${certificateData.control_number || 'certificate'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Action Buttons - Hidden on Print */}
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <button
          onClick={handleExportPDF}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Exporting...' : 'Export as PDF'}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Print
        </button>
      </div>

      {/* Certificate Container */}
      <div className="w-full max-w-4xl mx-auto bg-white p-6 font-serif text-xs leading-tight">
        {/* HEADER SECTION */}
        <div className="text-center mb-3 pb-3 border-b-4 border-black">
          {/* Logos and Header */}
          <div className="flex justify-between items-start mb-2">
            {/* Left Logo */}
            <div className="w-20 h-20 border-4 border-blue-900 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
              <img src={logo} alt="Logo" className="w-18 h-18 object-contain" />
            </div>

            {/* Center Header */}
            <div className="text-center flex-1 px-4">
              <div className="font-bold text-xs mb-0.5">Republika ng Pilipinas</div>
              <div className="text-red-600 font-bold text-xs mb-1">Lungsod Quezon</div>
              <div className="text-blue-700 font-bold text-sm underline mb-0.5">BARANGAY KALUSUGAN</div>
              <div className="text-xs mb-0.5">Area 25, District IV</div>
              <div className="text-xs">Email: kalusugan@gmail.com</div>
            </div>

            {/* Right Logo */}
            <div className="w-20 h-20 border-4 border-blue-900 flex items-center justify-center flex-shrink-0 bg-white">
              <img src={logo2} alt="Logo" className="w-18 h-18 object-contain" />
            </div>
          </div>

          {/* Control Number */}
          <div className="text-right mb-2 pr-2">
            <span className="font-bold text-xs">Control Number: ________________</span>
          </div>

          {/* Title */}
          <div className="font-bold text-base underline mb-0.5">BARANGAY CLEARANCE</div>
          <div className="font-bold text-xs italic">For BUSINESS</div>
        </div>

        {/* CONTENT */}
        <div className="mb-2">
          <div className="text-xs italic mb-2">To Whom It May Concern:</div>

          <div className="mb-2 text-justify text-xs leading-snug">
            This is to certify that the undersigned approved / disapproved the application for a permit to operate / renew the business of:
          </div>

          {/* Business Details */}
          <div className="mb-2 text-xs space-y-0.5">
            <div><span className="font-bold">Owner/ Proprietor:</span> <span className="border-b border-black ml-1">{certificateData.proprietor_name}</span></div>
            <div><span className="font-bold">Business Name:</span> <span className="border-b border-black ml-1">{certificateData.business_name}</span></div>
            <div><span className="font-bold">Nature / Type of Business:</span> <span className="border-b border-black ml-1">{certificateData.nature_of_business}</span></div>
            <div><span className="font-bold">Address of Business:</span> <span className="border-b border-black ml-1">{certificateData.business_address}</span></div>
          </div>

          <div className="mb-2 text-justify text-xs leading-snug">
            It is further certified that the subject business establishment is nuisance / not nuisance to public order and safety. Holder of this clearance is not delinquent in the payment of taxes/occupancy fee to the Barangay.
          </div>

          <div className="mb-2 text-justify text-xs leading-snug">
            This is being issued upon the request of the above-named applicant for presentation to the Business Permit and Licensing Office. This City, prior to the issuance of any license or permit for said business activity pursuant to Chapter II, Art. IV, Section 131, Par. C of the Local Government Code.
          </div>

          {/* Date Section */}
          <div className="mb-2 text-xs">
            <div className="mb-0.5">
              <span className="font-bold">Date Issued:</span>
              <span className="border-b border-black inline-block w-40 text-center mx-1">{formatDate(certificateData.date_received)}</span>
              <span className="text-xs">in Barangay Kalusugan, Quezon City</span>
            </div>
            <div>
              <span className="font-bold">Valid on the date of issue until</span>
              <span className="border-b border-black inline-block w-40 text-center mx-1">{formatDate(certificateData.valid_until)}</span>
            </div>
          </div>

          {/* Signature Section */}
          <div className="text-center mb-3 py-2">
            <div className="font-bold text-xs">HON. ROCKY DELA CRUZ RABANAL</div>
            <div className="font-bold text-xs">Punong Barangay</div>
          </div>

          {/* Payment and Receiver Section */}
          <div className="flex justify-between mb-3 text-xs gap-6">
            <div className="w-1/2">
              <div className="mb-0.5"><span className="font-bold">Amount Paid:</span> <span className="border-b border-black inline-block w-20">₱{certificateData.amount_paid}</span></div>
              <div className="mb-0.5"><span className="font-bold">Date Paid:</span> <span className="border-b border-black inline-block w-20">{formatDate(certificateData.date_paid)}</span></div>
              <div className="mb-0.5"><span className="font-bold">O.R. Number:</span> <span className="border-b border-black inline-block w-20">{certificateData.or_number}</span></div>
              <div className="mb-0.5"><span className="font-bold">Received By:</span> <span className="border-b border-black inline-block w-20">{certificateData.received_by}</span></div>
            </div>
            <div className="w-1/2">
              <div className="border-2 border-black h-14 mb-1 relative flex items-end justify-center pb-1">
                <span className="absolute -top-2 left-1 bg-white text-xs px-1 font-bold">Signature</span>
              </div>
              <div className="text-xs"><span className="font-bold">Date:</span> <span className="border-b border-black inline-block w-20">{formatDate(certificateData.date_received)}</span></div>
            </div>
          </div>

          {/* Authorized Signatories */}
          <div className="border-t-2 border-black pt-2 mb-2">
            <div className="text-xs font-bold text-center mb-1">AUTHORIZED SIGNATORIES</div>
            <div className="grid grid-cols-5 gap-1 text-xs">
              <div className="border-2 border-gray-500 p-1 text-center">
                <div className="font-bold text-xs">Redrick M. Hara</div>
                <div className="text-xs">Punong Barangay</div>
              </div>
              <div className="border-2 border-gray-500 p-1 text-center">
                <div className="font-bold text-xs">Christopher C. Serrano</div>
                <div className="text-xs">SK Chairperson</div>
              </div>
              <div className="border-2 border-gray-500 p-1 text-center">
                <div className="font-bold text-xs">Margaret Lyra Marcos</div>
                <div className="text-xs">Barangay Secretary</div>
              </div>
              <div className="border-2 border-gray-500 p-1 text-center">
                <div className="font-bold text-xs">Edyliza D. Darion</div>
                <div className="text-xs">Barangay Treasurer</div>
              </div>
              <div className="border-2 border-gray-500 p-1 text-center">
                <div className="text-xs font-bold">SK Chairman</div>
                <div className="font-bold text-xs">John Vincent D. Abaño</div>
              </div>
            </div>
          </div>

          {/* Footer Signatories */}
          <div className="grid grid-cols-4 gap-1 text-xs mt-2">
            <div className="text-center">
              <div className="font-bold text-xs">Elna R. Tercero</div>
              <div className="text-xs">Barangay Health Office</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xs">Robin C. Burbaje</div>
              <div className="text-xs">Barangay Tanod</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xs">Reynaldo SY. Sera</div>
              <div className="text-xs">Business Permit Officer</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold">SK Chairman</div>
              <div className="font-bold text-xs">John Vincent D. Abaño</div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="grid grid-cols-3 gap-1 text-xs mt-2 text-center border-t-2 border-gray-400 pt-1">
            <div>
              <div className="font-bold text-xs">Secretary</div>
              <div className="text-xs">Frinio F. Ubando</div>
            </div>
            <div>
              <div className="text-xs">Not valid without Official Issued Seal</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPermitCertificate;
