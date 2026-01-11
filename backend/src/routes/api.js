const express = require('express');
const PersonalDetails = require('../models/PersonalDetails');
const Kasambahay = require('../models/Kasambahay');
const BarangayInhabitants = require('../models/BarangayInhabitants');
const { validatePersonalDetails, validateKasambahay, validateBarangayInhabitants } = require('../middleware/validation');
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

// Get dashboard records (recent submissions)
router.get('/records', optionalAuth, async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    let personalDetailsRecords = [];
    let kasambahayRecords = [];
    let inhabitantsRecords = [];

    if (search) {
      // Search functionality
      personalDetailsRecords = await PersonalDetails.searchByName(search, Math.ceil(limit / 3));
      kasambahayRecords = await Kasambahay.searchByEmployer(search, Math.ceil(limit / 3));
      inhabitantsRecords = await BarangayInhabitants.searchByName(search, Math.ceil(limit / 3));
    } else {
      // Recent records
      personalDetailsRecords = await PersonalDetails.getRecentRecords(Math.ceil(limit / 3));
      kasambahayRecords = await Kasambahay.getRecentRecords(Math.ceil(limit / 3));
      inhabitantsRecords = await BarangayInhabitants.getRecentRecords(Math.ceil(limit / 3));
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
    const [personalStats, kasambahayStats, inhabitantsStats] = await Promise.all([
      PersonalDetails.getStats(),
      Kasambahay.getStats(),
      BarangayInhabitants.getStats()
    ]);

    res.json({
      success: true,
      data: {
        personal_details: personalStats,
        kasambahay: kasambahayStats,
        barangay_inhabitants: inhabitantsStats,
        total_records: personalStats.total + kasambahayStats.total + inhabitantsStats.total
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

module.exports = router;
