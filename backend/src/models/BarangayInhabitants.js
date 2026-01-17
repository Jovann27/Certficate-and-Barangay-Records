const BaseModel = require('./BaseModel');

class BarangayInhabitants extends BaseModel {
  constructor() {
    super('barangay_inhabitants');
  }

  async getRecentRecords(limit = 50) {
    const sql = `
      SELECT
        id,
        CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name, COALESCE(CONCAT(' ', qualifier), '')) as name,
        address,
        'Barangay Inhabitants Record' as type,
        relationship_to_head as category,
        created_at as date_issued
      FROM barangay_inhabitants
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(sql, [limit]);
    return rows;
  }

  async searchByName(name, limit = 20) {
    const sql = `
      SELECT
        id,
        CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name, COALESCE(CONCAT(' ', qualifier), '')) as name,
        address,
        'Barangay Inhabitants Record' as type,
        relationship_to_head as category,
        created_at as date_issued
      FROM barangay_inhabitants
      WHERE CONCAT(first_name, ' ', last_name) LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(sql, [`%${name}%`, limit]);
    return rows;
  }

  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female_count,
        AVG(years_residing) as avg_years_residing,
        COUNT(CASE WHEN registered_voter = 'Yes' THEN 1 END) as voter_count
      FROM barangay_inhabitants
    `;
    const [rows] = await this.pool.execute(sql);
    return rows[0];
  }

  async getByHousehold(householdNo) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM barangay_inhabitants WHERE household_no = ? ORDER BY relationship_to_head',
      [householdNo]
    );
    return rows;
  }

  async getWithCertificateHistory(residentId) {
    const PersonalDetails = require('./PersonalDetails');
    const Kasambahay = require('./Kasambahay');
    const BusinessPermit = require('./BusinessPermit');

    // Get resident details
    const resident = await this.findById(residentId);
    if (!resident) return null;

    // Get certificate history
    const personalCertificates = await PersonalDetails.getByResidentId(residentId);
    const kasambahayCertificates = await Kasambahay.getByResidentId(residentId);
    const businessCertificates = await BusinessPermit.getByResidentId(residentId);

    const certificateHistory = [
      ...personalCertificates.map(cert => ({ ...cert, source: 'personal_details' })),
      ...kasambahayCertificates.map(cert => ({ ...cert, source: 'kasambahay' })),
      ...businessCertificates.map(cert => ({ ...cert, source: 'business_permit' }))
    ].sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued));

    return {
      resident,
      certificateHistory
    };
  }
}

module.exports = new BarangayInhabitants();
