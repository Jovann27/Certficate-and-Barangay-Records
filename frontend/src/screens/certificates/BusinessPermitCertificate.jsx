import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import qc from '../../assets/qc.png';
import logo from '../../assets/kalusugan.png';

const BusinessPermitCertificate = ({ data, formData, onSuccess, onBack, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [officials, setOfficials] = useState({});

  // Use formData if available (auto-populated from resident), otherwise fall back to data or defaults
  const certificateData = formData || data || {
    proprietor_name: '',
    business_name: '',
    nature_of_business: '',
    business_address: '',
    amount_paid: '',
    date_paid: '',
    or_number: '',
    received_by: '',
    applicant_signature: '',
    date_received: '',
    valid_until: '',
    control_number: ''
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportPDF = async () => {
    if (!certificateData || !certificateData.proprietor_name || !certificateData.business_name) {
      toast.error('Certificate data is incomplete. Please fill out the form completely.');
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

      const response = await fetch('/api/business-permit/generate-pdf', {
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
        toast.success('PDF exported successfully');
      } else {
        toast.error('Failed to export PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error exporting PDF');
    }
    setLoading(false);
  };

  const handlePrint = async () => {
    if (!certificateData || !certificateData.proprietor_name || !certificateData.business_name) {
      toast.error('Certificate data is incomplete. Please fill out the form completely.');
      return;
    }

    try {
      // Prepare complete business permit data for database storage
      const businessPermitData = {
        // Application details
        application_type: formData?.applicationType || 'NEW',
        application_date: formData?.date || new Date().toISOString().split('T')[0],

        // Business details
        business_name: formData?.businessName || '',
        nature_of_business: formData?.natureOfBusiness || '',
        proprietor_name: formData?.proprietorName || '',
        business_address: formData?.businessAddress || '',

        // Registration details
        brn_number: formData?.brnNumber || '',
        dti_number: formData?.dtiNumber || '',
        mayors_permit_number: formData?.mayorsPermitNumber || '',

        // Issuance details
        date_issued: formData?.dateIssued || new Date().toISOString().split('T')[0],
        email_address: formData?.emailAddress || '',
        contact_number: formData?.contactNumber || '',

        // Representation
        representative_name: formData?.representativeName || '',
        position: formData?.position || '',

        // Payment details
        amount_paid: parseFloat(formData?.amountPaid) || 0,
        date_paid: formData?.datePaid || new Date().toISOString().split('T')[0],
        or_number: formData?.orNumber || '',

        // Certificate details
        received_by: formData?.representativeName || '',
        date_received: formData?.dateIssued || new Date().toISOString().split('T')[0],
        valid_until: certificateData.valid_until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

        // Additional fields
        control_number: certificateData.control_number || '',
        applicant_signature: certificateData.applicant_signature || '',
        privacy_consent: formData?.privacyConsent || true
      };

      // Save business permit data to database
      const response = await fetch('/api/business-permit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessPermitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Business permit saved successfully');
        // Then print the certificate
        window.print();
      } else {
        toast.error(result.message || 'Failed to save business permit');
      }
    } catch (error) {
      console.error('Error saving business permit:', error);
      toast.error('Error saving business permit. Please try again.');
    }
  };

  return (
      <div className="flex justify-center pt-0 pr-6 pb-6 pl-6 print:p-0 print:m-0 print:-mt-2">
        <div className="bg-white w-full max-w-4xl shadow-lg p-8 relative print:shadow-none print:pt-0 print:px-1 print:pb-1 print:m-0 print:max-w-full print:min-h-[200mm]">
          
          {/* HEADER WITH THREE LOGOS */}
          <div className="flex justify-between items-start mb-[6px] relative z-10 print:mb-[6px]">
            {/* Left Logo */}
            <div className="w-[82px] h-[82px] flex-shrink-0">
              <div className="w-full h-full rounded-full  flex items-center justify-center bg-white relative">
                <div className="absolute inset-0 rounded-full border-[6px] border-pink-300" style={{ margin: '6px' }}></div>
                <div className="text-center z-10">
                  <div className="text-pink-500 text-3xl">
                    <img src={logo} alt="" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center Text */}
            <div className="text-center flex-1 mx-[18px]">
              <p className="text-[13px] font-medium text-gray-700">Republika ng Pilipinas</p>
              <p className="text-[13px] font-medium text-gray-700">Lungsod Quezon</p>
              <p className="text-[13px] font-bold text-red-600 tracking-wide">Tanggapan ng Punong Barangay</p>
              <p className="text-[15px] font-extrabold text-blue-700 tracking-wider">BARANGAY KALUSUGAN</p>
              <p className="text-[12px] text-gray-600 mt-[4px]">Area 21, District IV</p>
              <p className="text-[12px] text-gray-600">Quezon City</p>
              <p className="text-[12px] text-gray-600">Email: kalusugan2014@gmail.com</p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0">
              <div className="w-[82px] h-[82px] rounded-lg  flex items-center justify-center  from-blue-100 to-red-100">
                <div className="text-center">
                  <div className="text-blue-600 text-2xl">
                    <img src={qc} alt="Quezon City Logo" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t-[4px] border-gray-800 mb-[6px] relative z-10 print:mb-[6px]" />

          {/* CONTROL NUMBER BOX */}
          <div className="flex justify-end mb-[6px] relative z-10 print:mb-[4px]">
            <div className="text-right">
              <p className="text-[12px] italic mb-[6px]">Control Number:</p>
              <div className="border-[4px] border-gray-800 w-[162px] h-[26px]"></div>
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-center font-bold text-[18px] mb-0 tracking-wide relative z-10 print:mb-0">
            BARANGAY CLEARANCE
          </h1>
          <p className="text-center text-[11px] font-semibold mb-[6px] relative z-10 print:mb-[6px]">
            For BUSINESS
          </p>

          {/* BODY */}
          <div className="text-[12px] leading-relaxed relative z-10 print:text-[11px] print:leading-loose">

            <p className="italic mb-[4px] print:mb-[4px]">To Whom It May Concern:</p>

            <p className="text-justify indent-[18px] mb-[6px] text-[11px] print:mb-2">
              This is to certify that the undersigned approved / disapproved the application for a permit to operate / renew the business of:
            </p>

            {/* INFORMATION FIELDS */}
            <div className="space-y-[4px] mb-[6px] print:mb-3 print:space-y-1">
              <div className="flex items-baseline gap-[8px]">
                <span className="font-semibold whitespace-nowrap min-w-[142px] italic">Name of Proprietor</span>
                <div className="flex-1 border-b border-black pb-[4px]">
                  <span className="text-[13px]">{certificateData.proprietor_name}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-[8px]">
                <span className="font-semibold whitespace-nowrap min-w-[142px] italic">Business Name</span>
                <div className="flex-1 border-b border-black pb-[4px]">
                  <span className="text-[13px]">{certificateData.business_name}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-[8px]">
                <span className="font-semibold whitespace-nowrap min-w-[142px] italic">Nature / Type of Business</span>
                <div className="flex-1 border-b border-black pb-[4px]">
                  <span className="text-[13px]">{certificateData.nature_of_business}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-[8px]">
                <span className="font-semibold whitespace-nowrap min-w-[142px] italic">Address of Business</span>
                <div className="flex-1 border-b border-black pb-[4px]">
                  <span className="text-[13px]">{certificateData.business_address}</span>
                </div>
              </div>
            </div>

            <p className="text-justify indent-[18px] mb-[4px] text-[11px] print:mb-2">
              It is further certified that the subject business establishment is nuisance / not nuisance to public order and safety. Moreover, the above – named business establishment abides all applicable barangay ordinances to avoid any violations concerning said business.
            </p>

            <p className="text-justify indent-[18px] mb-[6px] text-[11px] print:mb-3">
              This is being issued upon the request of the above-named applicant for presentation to the Business Permit and Licensing Office, this City, prior to the issuance of permit as granted for said business activity pursuant to Chapter II, Act IV, Section 152, Part of the Local Government Code.
            </p>

            {/* DATE ISSUED */}
            <div className="flex items-baseline gap-[8px] mb-[10px] print:mb-3">
              <span className="font-semibold italic text-[11px]">Date Issued :</span>
              <div className="flex-1 border-b border-black pb-[4px] text-center">
                <span className="text-[11px]"></span>
              </div>
              <span className="ml-2 text-[10px]">in Barangay Kalusugan, Quezon City</span>
            </div>

            {/* VALIDITY */}
            <p className="text-center text-red-600 font-semibold mb-[10px] text-[11px] print:mb-3">
              Valid on the date of issue until <span className="border-b border-red-600 inline-block w-[130px] text-center"></span>
            </p>

            {/* SIGNATURE */}
            <div className="flex justify-center mb-[10px] print:mb-4">
              <div className="text-center">
                <div className="mb-[14px] print:mb-8"></div>
                <p className="font-bold text-[13px]">{officials[1]?.name || 'HON. ROCKY DELA CRUZ RABANAL'}</p>
                <p className="text-[12px]">Punong Barangay</p>
              </div>
            </div>

            {/* PAYMENT AND SIGNATURE SECTION */}
            <div className="grid grid-cols-2 gap-[18px] mb-[6px] border-t border-gray-400 pt-[6px] print:mb-2 print:pt-3 print:gap-6">
              <div className="space-y-[4px]">
                <div className="flex items-baseline gap-[6px]">
                  <span className="font-semibold whitespace-nowrap italic text-[10px]">Amount Paid:</span>
                  <div className="flex-1 border-b border-black pb-[4px]"></div>
                </div>
                <div className="flex items-baseline gap-[6px]">
                  <span className="font-semibold whitespace-nowrap italic text-[10px]">Date Paid:</span>
                  <div className="flex-1 border-b border-black pb-[4px]"></div>
                </div>
                <div className="flex items-baseline gap-[6px]">
                  <span className="font-semibold whitespace-nowrap italic text-[10px]">O.R. Number:</span>
                  <div className="flex-1 border-b border-black pb-[4px]"></div>
                </div>
                <div className="flex items-baseline gap-[6px]">
                  <span className="font-semibold whitespace-nowrap italic text-[10px]">Received By:</span>
                  <div className="flex-1 border-b border-black pb-[4px]"></div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-[10px] mb-[6px]">Received By:</p>
                <div className="border-b border-black h-[34px] mb-[4px] print:h-12"></div>
                <p className="text-[9px] text-center italic">Signature over Printed Name of Applicant/Representative</p>
                <div className="flex items-baseline gap-[6px] mt-[6px]">
                  <span className="font-semibold whitespace-nowrap italic text-[10px]">Date:</span>
                  <div className="flex-1 border-b border-black pb-[4px]"></div>
                </div>
              </div>
            </div>

            {/* BARANGAY OFFICIALS FOOTER */}
            <div className="border-t-[4px] border-gray-800 pt-[4px] print:pt-2">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-[6px] text-[9px] text-center mb-[4px] print:mb-1">
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[2]?.name || 'Kgd. Roderick M. Hara'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[2]?.committee?.split(',')[0] || 'Committee On Livelihood'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[2]?.committee?.split(',')[1]?.trim() || 'Cooperative, Industry, And Senior Citizen Affairs'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[3]?.name || 'Kgd. Christopher C. Serrano'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[3]?.committee?.split(',')[0] || 'Committee On Public Order, Public Safety, And'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[3]?.committee?.split(',')[1]?.trim() || 'Traffic, Welfare And Light'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[4]?.name || 'Kgd. Margaret Lyra Maruzza'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[4]?.committee?.split(',')[0] || 'Committee On Health, Education,'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[4]?.committee?.split(',')[1]?.trim() || 'Livelihood And Services'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[5]?.name || 'Kgd. Ferdison D. Barbon'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[5]?.committee || 'Committee On Streets And Roads, Good Pavement, Animal Rights Advocacy And Justice'}</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-[6px] text-[9px] text-center mb-[4px] print:mb-1">
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[6]?.name || 'Kgd. Eloisa R. Fayanes'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[6]?.committee?.split(',')[0] || 'Committee On Sanitation, Beautification, Solid Waste'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[6]?.committee?.split(',')[1]?.trim() || 'Mgmt, Parks, Public Services, and Communication'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[7]?.name || 'Kgd. Robin C. Portaje'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[7]?.committee?.split(',')[0] || 'Committee On Infrastructure, Public Planning, Building,'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[7]?.committee?.split(',')[1]?.trim() || 'Finance, And Utilities'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[8]?.name || 'Kgd. Reynaldo SJ. Sara'}</p>
                  <p className="text-[8px] text-gray-600 leading-tight">{officials[8]?.committee || 'Committee On Sanitation And Environmental Protection'}</p>
                </div>
                <div>
                  <p className="font-bold text-red-600 leading-tight">{officials[9]?.title || 'SK Chairman'}</p>
                  <p className="font-bold text-blue-700 leading-tight">{officials[9]?.name || 'John Vincent D. Aliado'}</p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-[6px] text-[9px] text-center">
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[10]?.title || 'Barangay Secretary'}</p>
                  <p className="font-bold text-blue-700 leading-tight">{officials[10]?.name || 'Corazon L. Prado'}</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 leading-tight">{officials[11]?.title || 'Barangay Treasurer'}</p>
                  <p className="font-bold text-blue-700 leading-tight">{officials[11]?.name || 'Fritzie P. Ubpardo'}</p>
                </div>
                <div>
                  <p className="font-bold text-red-600 leading-tight">{officials[12]?.title || 'BPSO Executive Officer'}</p>
                  <p className="font-bold text-blue-700 leading-tight">{officials[12]?.name || 'Elmer Z. Pinca'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-semibold text-right leading-tight">Not Valid Without Official Barangay Seal</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-6 relative z-10 print:hidden">
            {onBack && (
              <button onClick={onBack} className="px-4 py-2 border border-gray-400 rounded-md bg-white hover:bg-gray-50">
                Back
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Generate
            </button>
            
          </div>
        </div>
      </div>
  );
};

export default BusinessPermitCertificate;
