const BaseModel = require('./BaseModel');

class Kasambahay extends BaseModel {
  constructor() {
    super('kasambahay_registration');
  }

  async getRecentRecords(limit = 50) {
    const sql = `
      SELECT
        id,
        employer_name as name,
        employer_address as address,
        'Kasambahay Registration' as type,
        nature_of_work as category,
        created_at as date_issued
      FROM kasambahay_registration
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(sql, [limit]);
    return rows;
  }

  async searchByEmployer(employerName, limit = 20) {
    const sql = `
      SELECT
        id,
        employer_name as name,
        employer_address as address,
        'Kasambahay Registration' as type,
        nature_of_work as category,
        created_at as date_issued
      FROM kasambahay_registration
      WHERE employer_name LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(sql, [`%${employerName}%`, limit]);
    return rows;
  }

  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN employment_arrangement = 'Full-time' THEN 1 END) as full_time_count,
        COUNT(CASE WHEN employment_arrangement = 'Part-time' THEN 1 END) as part_time_count,
        AVG(CAST(REPLACE(REPLACE(monthly_salary, '₱', ''), ',', '') AS DECIMAL(10,2))) as avg_salary
      FROM kasambahay_registration
    `;
    const [rows] = await this.pool.execute(sql);
    return rows[0];
  }
}

module.exports = new Kasambahay();
