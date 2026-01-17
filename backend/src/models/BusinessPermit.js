const BaseModel = require('./BaseModel');

class BusinessPermit extends BaseModel {
  constructor() {
    super('business_permits');
  }

  async getRecentRecords(limit = 50) {
    const sql = `
      SELECT
        id,
        proprietor_name,
        business_name,
        nature_of_business,
        business_address,
        created_at as date_issued
      FROM business_permits
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
        proprietor_name,
        business_name,
        nature_of_business,
        business_address,
        created_at as date_issued
      FROM business_permits
      WHERE proprietor_name LIKE ? OR business_name LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(sql, [`%${name}%`, `%${name}%`, limit]);
    return rows;
  }

  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total
      FROM business_permits
    `;
    const [rows] = await this.pool.execute(sql);
    return rows[0];
  }

  async getByResidentId(residentId) {
    const sql = `
      SELECT
        id,
        'Business Permit' as type,
        business_name as category,
        created_at as date_issued
      FROM business_permits
      WHERE resident_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await this.pool.execute(sql, [residentId]);
    return rows;
  }
}

module.exports = new BusinessPermit();
