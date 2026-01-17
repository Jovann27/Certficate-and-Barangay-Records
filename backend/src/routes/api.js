const express = require('express');
const puppeteer = require('puppeteer');
const PersonalDetails = require('../models/PersonalDetails');
const Kasambahay = require('../models/Kasambahay');
const BarangayInhabitants = require('../models/BarangayInhabitants');
const BusinessPermit = require('../models/BusinessPermit');
const { validatePersonalDetails, validateKasambahay, validateBarangayInhabitants, validateBusinessPermit } = require('../middleware/validation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Personal Details Form
router.post('/personal-details', optionalAuth, validatePersonalDetails, async (req, res) => {
  try {
    const result = await PersonalDetails.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Personal details submitted successfully',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Personal details submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Kasambahay Registration Form
router.post('/kasambahay-registration', optionalAuth, validateKasambahay, async (req, res) => {
  try {
    const result = await Kasambahay.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Kasambahay registration submitted successfully',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Kasambahay registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Barangay Inhabitants Record Form
router.post('/barangay-inhabitants', optionalAuth, validateBarangayInhabitants, async (req, res) => {
  try {
    const result = await BarangayInhabitants.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Barangay inhabitant record submitted successfully',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Barangay inhabitants record error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Business Permit Form
router.post('/business-permit', optionalAuth, validateBusinessPermit, async (req, res) => {
  try {
    const result = await BusinessPermit.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Business permit submitted successfully',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Business permit submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Generate Business Permit PDF
router.post('/business-permit/generate-pdf', optionalAuth, async (req, res) => {
  try {
    const data = req.body;

    // Generate HTML content for the certificate
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Business Permit Certificate</title>
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }

          body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            background-color: white;
            font-size: 12pt;
            line-height: 1.15;
            color: #000;
          }

          .document {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            box-sizing: border-box;
          }

          .header {
            text-align: center;
            margin-bottom: 0.4in;
            position: relative;
          }

          .logo-left, .logo-right {
            position: absolute;
            top: 0;
            width: 90px;
            height: auto;
          }

          .logo-left { left: 0; }
          .logo-right { right: 0; }

          .republic {
            font-weight: bold;
            font-size: 13pt;
            letter-spacing: 0.5px;
            margin-bottom: 0.04in;
          }

          .city {
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 0.12in;
          }

          .office {
            font-size: 10.5pt;
            margin-bottom: 0.08in;
          }

          .barangay-name {
            font-weight: bold;
            font-size: 16pt;
            text-decoration: underline;
            margin-bottom: 0.04in;
            letter-spacing: 0.5px;
          }

          .barangay-details {
            font-size: 10.5pt;
            margin: 0;
            line-height: 1.1;
          }

          .control-number {
            text-align: right;
            font-weight: bold;
            margin-bottom: 0.35in;
            font-size: 10.5pt;
          }

          .clearance-title {
            text-align: center;
            font-weight: bold;
            font-size: 16pt;
            text-decoration: underline;
            margin-bottom: 0.08in;
            letter-spacing: 0.5px;
          }

          .business-subtitle {
            text-align: center;
            font-weight: bold;
            font-size: 13pt;
            font-style: italic;
            margin-bottom: 0.25in;
          }

          .salutation {
            font-style: italic;
            margin-bottom: 0.12in;
          }

          .certification {
            text-align: justify;
            margin-bottom: 0.15in;
            font-size: 11.5pt;
          }

          .business-table td {
            padding: 0.06in 0;
            vertical-align: top;
          }

          .business-table td:first-child {
            width: 1.6in;
            font-weight: bold;
            padding-right: 0.08in;
          }

          .business-table td:last-child {
            border-bottom: 1px solid black;
          }

          .underline-space {
            min-height: 0.18in;
            display: block;
          }

          .date-section {
            margin: 0.25in 0 0.35in 0;
          }

          .date-line {
            margin-bottom: 0.12in;
          }

          .date-line span:first-child {
            font-weight: bold;
            display: inline-block;
            width: 0.9in;
          }

          .underline-long {
            display: inline-block;
            width: 2.2in;
            border-bottom: 1px solid black;
            margin: 0 0.08in;
            vertical-align: bottom;
          }

          .valid-until {
            margin-top: 0.15in;
          }

          .valid-until span:first-child {
            font-weight: bold;
            display: inline-block;
            width: 2in;
          }

          .signature-area {
            text-align: center;
            margin: 0.5in 0 0.35in 0;
          }

          .punong-name {
            font-weight: bold;
            font-size: 13pt;
            letter-spacing: 0.5px;
          }

          .punong-title {
            font-weight: bold;
            margin-top: 0.04in;
            font-size: 11.5pt;
          }

          .payment-table {
            width: 48%;
            float: left;
            border-collapse: collapse;
          }

          .payment-table td {
            padding: 0.06in 0;
            vertical-align: top;
          }

          .payment-table td:first-child {
            width: 0.9in;
            font-weight: bold;
            padding-right: 0.08in;
            font-size: 11.5pt;
          }

          .payment-table td:last-child {
            border-bottom: 1px solid black;
            width: 1.8in;
          }

          .receiver-section {
            width: 48%;
            float: right;
          }

          .receiver-line {
            margin-bottom: 0.06in;
          }

          .receiver-line span:first-child {
            font-weight: bold;
            display: inline-block;
            width: 0.9in;
            font-size: 11.5pt;
          }

          .receiver-underline {
            display: inline-block;
            width: 2.2in;
            border-bottom: 1px solid black;
          }

          .signature-box {
            width: 100%;
            height: 0.6in;
            border: 1px solid black;
            margin: 0.12in 0 0.08in 0;
            position: relative;
          }

          .signature-label {
            position: absolute;
            top: 0.04in;
            left: 0.08in;
            font-size: 9.5pt;
            color: #333;
          }

          .date-field {
            margin-top: 0.08in;
          }

          .date-field span:first-child {
            font-weight: bold;
            display: inline-block;
            width: 0.45in;
            font-size: 11.5pt;
          }

          .underline-short {
            display: inline-block;
            width: 1.3in;
            border-bottom: 1px solid black;
            margin-left: 0.08in;
          }

          .clearfix::after {
            content: "";
            clear: both;
            display: table;
          }
        </style>
      </head>

      <body>
        <div class="document">
          <!-- HEADER SECTION -->
          <div class="header">
            <!-- LOGOS ADDED -->
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" class="logo-left">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" class="logo-right">

            <div class="republic">REPUBLIKA NG PILIPINAS</div>
            <div class="city">Lungsod Quezon</div>
            <div class="office">Tanggapan ng Punong Barangay</div>
            <div class="barangay-name">BARANGAY KALUSUGAN</div>
            <div class="barangay-details">Area 25, District IV</div>
            <div class="barangay-details">4 325-90-25</div>
            <div class="barangay-details">Email: kalusugan.3942@gmail.com</div>
          </div>

          <!-- CONTROL NUMBER -->
          <div class="control-number">
            Control Number: BP-${Date.now()}
          </div>

          <!-- MAIN TITLE -->
          <div class="clearance-title">BARANGAY CLEARANCE</div>
          <div class="business-subtitle">For BUSINESS</div>

          <!-- SALUTATION -->
          <div class="salutation">To Whom It May Concern:</div>

          <!-- CERTIFICATION TEXT -->
          <div class="certification">
            This is to certify that the undersigned approved / disapproved the application
            for a permit to operate / renew the business of:
          </div>

          <!-- BUSINESS TABLE -->
          <table class="business-table" style="width: 100%; margin: 0.15in 0 0.25in 0; border-collapse: collapse;">
            <tr><td>Name of Proprietor</td><td><div class="underline-space">${data.proprietor_name || ''}</div></td></tr>
            <tr><td>Business Name</td><td><div class="underline-space">${data.business_name || ''}</div></td></tr>
            <tr><td>Nature / Type of Business</td><td><div class="underline-space">${data.nature_of_business || ''}</div></td></tr>
            <tr><td>Address of Business</td><td><div class="underline-space">${data.business_address || ''}</div></td></tr>
          </table>

          <div class="certification">
            It is further certified that the subject business establishment is nuisance /
            not nuisance to public order and safety.
          </div>

          <div class="certification">
            This is being issued upon the request of the above-named applicant for
            presentation to the Business Permit and Licensing Office.
          </div>

          <div class="date-section">
            <div class="date-line">
              <span>Date Issued:</span>
              <span class="underline-long">${data.date_received ? new Date(data.date_received).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
              in Barangay Kalusugan, Quezon City
            </div>

            <div class="valid-until">
              <span>Valid on the date of issue until</span>
              <span class="underline-long">${data.valid_until ? new Date(data.valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            </div>
          </div>

          <div class="signature-area">
            <div class="punong-name">HON. ROCKY DELA CRUZ RABANAL</div>
            <div class="punong-title">Punong Barangay</div>
          </div>

          <div class="clearfix">
            <table class="payment-table">
              <tr><td>Amount Paid:</td><td><div class="underline-space">₱${data.amount_paid || ''}</div></td></tr>
              <tr><td>Date Paid:</td><td><div class="underline-space">${data.date_paid ? new Date(data.date_paid).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</div></td></tr>
              <tr><td>O.R. Number:</td><td><div class="underline-space">${data.or_number || ''}</div></td></tr>
              <tr><td>Received By:</td><td><div class="underline-space">${data.received_by || ''}</div></td></tr>
            </table>

            <div class="receiver-section">
              <div class="receiver-line">
                <span>Received By:</span>
                <span class="receiver-underline">${data.received_by || ''}</span>
              </div>

              <div class="signature-box">
                <div class="signature-label">Signature over Printed Name of Applicant/Representative</div>
              </div>

              <div class="date-field">
                <span>Date:</span>
                <span class="underline-short">${data.date_received ? new Date(data.date_received).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
              </div>
            </div>
          </div>

        </div>
      </body>
      </html>
    `;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="business-permit-${Date.now()}.pdf"`);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
});

// Get dashboard records (recent submissions)
router.get('/records', optionalAuth, async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    let personalDetailsRecords = [];
    let kasambahayRecords = [];
    let inhabitantsRecords = [];
    let businessPermitRecords = [];

    if (search) {
      // Search functionality
      personalDetailsRecords = await PersonalDetails.searchByName(search, Math.ceil(limit / 4));
      kasambahayRecords = await Kasambahay.searchByEmployer(search, Math.ceil(limit / 4));
      inhabitantsRecords = await BarangayInhabitants.searchByName(search, Math.ceil(limit / 4));
      businessPermitRecords = await BusinessPermit.searchByName(search, Math.ceil(limit / 4));
    } else {
      // Recent records
      personalDetailsRecords = await PersonalDetails.getRecentRecords(Math.ceil(limit / 4));
      kasambahayRecords = await Kasambahay.getRecentRecords(Math.ceil(limit / 4));
      inhabitantsRecords = await BarangayInhabitants.getRecentRecords(Math.ceil(limit / 4));
      businessPermitRecords = await BusinessPermit.getRecentRecords(Math.ceil(limit / 4));
    }

    // Format and combine results
    const formattedRecords = [
      ...personalDetailsRecords.map(record => ({
        id: `personal-${record.id}`,
        name: record.full_name || record.name,
        address: record.address,
        type: record.type || 'Personal Details',
        category: record.certificate_type || record.category,
        date_issued: record.date_issued
      })),
      ...kasambahayRecords.map(record => ({
        id: `kasambahay-${record.id}`,
        name: record.name,
        address: record.address,
        type: record.type,
        category: record.category,
        date_issued: record.date_issued
      })),
      ...inhabitantsRecords.map(record => ({
        id: `rbi-${record.id}`,
        name: record.name,
        address: record.address,
        type: record.type,
        category: record.category,
        date_issued: record.date_issued
      })),
      ...businessPermitRecords.map(record => ({
        id: `business-${record.id}`,
        name: record.proprietor_name,
        address: record.business_address,
        type: 'Business Permit',
        category: 'Business Permit',
        date_issued: record.date_issued
      }))
    ];

    // Sort by date and limit
    const sortedRecords = formattedRecords
      .sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sortedRecords
    });
  } catch (error) {
    console.error('Records fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Get dashboard statistics
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    const [personalStats, kasambahayStats, inhabitantsStats, businessPermitStats] = await Promise.all([
      PersonalDetails.getStats(),
      Kasambahay.getStats(),
      BarangayInhabitants.getStats(),
      BusinessPermit.getStats()
    ]);

    res.json({
      success: true,
      data: {
        personal_details: personalStats,
        kasambahay: kasambahayStats,
        barangay_inhabitants: inhabitantsStats,
        business_permits: businessPermitStats,
        total_records: personalStats.total + kasambahayStats.total + inhabitantsStats.total + businessPermitStats.total
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Get individual record details (authenticated users only)
router.get('/records/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    let record = null;

    switch (type) {
      case 'personal':
        record = await PersonalDetails.findById(id);
        break;
      case 'kasambahay':
        record = await Kasambahay.findById(id);
        break;
      case 'rbi':
        record = await BarangayInhabitants.findById(id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid record type'
        });
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Record detail fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Get resident details with certificate history
router.get('/residents/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BarangayInhabitants.getWithCertificateHistory(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Resident detail fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

// Search residents
router.get('/residents', authenticateToken, async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;

    let residents = [];

    if (search) {
      residents = await BarangayInhabitants.searchByName(search, limit);
    } else {
      residents = await BarangayInhabitants.getRecentRecords(limit);
    }

    res.json({
      success: true,
      data: residents
    });
  } catch (error) {
    console.error('Residents search error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }
});

module.exports = router;
