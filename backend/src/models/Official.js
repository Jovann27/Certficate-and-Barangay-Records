const BaseModel = require('./BaseModel');

class Official extends BaseModel {
  constructor() {
    super('officials');
  }

  async getAllOfficials() {
    const [rows] = await this.pool.execute(
      'SELECT * FROM officials ORDER BY position_order ASC'
    );
    return rows;
  }

  async updateOfficial(id, data) {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    return await this.update(id, updateData);
  }

  async createOfficial(data) {
    const officialData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await this.create(officialData);
  }

  async getOfficialByPosition(position) {
    const officials = await this.findByConditions({ position });
    return officials[0] || null;
  }
}

module.exports = new Official();
