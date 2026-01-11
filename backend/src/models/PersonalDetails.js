const BaseModel = require('./BaseModel');

class PersonalDetails extends BaseModel {
  constructor() {
    super('personal_details');
  }

  async getRecentRecords(limit = 50) {
    const sql = `
      SELECT
        id,
        CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name, COALESCE(CONCAT(' ', suffix), '')) as full_name,
        address,
        certificate_type as type,
        purpose,
        created_at as date_issued
      FROM personal_details
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
        CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name, COALESCE(CONCAT(' ', suffix), '')) as full_name,
        address,
        certificate_type as type,
        purpose,
        created_at as date_issued
      FROM personal_details
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
        COUNT(CASE WHEN pwd = 1 THEN 1 END) as pwd_count,
        COUNT(CASE WHEN registered_voter = 1 THEN 1 END) as voter_count,
        COUNT(CASE WHEN kasambahay = 1 THEN 1 END) as kasambahay_count
      FROM personal_details
    `;
    const [rows] = await this.pool.execute(sql);
    return rows[0];
  }
}

module.exports = new PersonalDetails();
