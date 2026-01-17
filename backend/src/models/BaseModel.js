const { getPool } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = getPool();
  }

  async findAll(options = {}) {
    const { limit, offset, orderBy, orderDirection = 'DESC' } = options;
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (orderBy) {
      sql += ` ORDER BY ${orderBy} ${orderDirection}`;
    }

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(limit);
    }

    if (offset) {
      sql += ` OFFSET ?`;
      params.push(offset);
    }

    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findByConditions(conditions, options = {}) {
    const { limit, offset, orderBy, orderDirection = 'DESC' } = options;
    const keys = Object.keys(conditions);
    const placeholders = keys.map(key => `${key} = ?`).join(' AND ');
    const params = Object.values(conditions);

    let sql = `SELECT * FROM ${this.tableName} WHERE ${placeholders}`;

    if (orderBy) {
      sql += ` ORDER BY ${orderBy} ${orderDirection}`;
    }

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(limit);
    }

    if (offset) {
      sql += ` OFFSET ?`;
      params.push(offset);
    }

    // Debug logging
    console.log('findByConditions Debug:');
    console.log('Table:', this.tableName);
    console.log('Conditions:', conditions);
    console.log('Keys:', keys);
    console.log('Params:', params);
    console.log('SQL:', sql);

    const [rows] = await this.pool.execute(sql, params);
    console.log('Rows found:', rows.length);
    return rows;
  }

  async create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    const [result] = await this.pool.execute(sql, values);

    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const [result] = await this.pool.execute(sql, values);

    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await this.pool.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  async count(conditions = {}) {
    const keys = Object.keys(conditions);
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];

    if (keys.length > 0) {
      const placeholders = keys.map(key => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${placeholders}`;
      params.push(...Object.values(conditions));
    }

    const [rows] = await this.pool.execute(sql, params);
    return rows[0].count;
  }
}

module.exports = BaseModel;
