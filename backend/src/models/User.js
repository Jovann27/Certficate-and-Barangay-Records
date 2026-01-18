const bcrypt = require('bcryptjs');
const BaseModel = require('./BaseModel');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async createUser(userData) {
    const { password, ...otherData } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      ...otherData,
      password: hashedPassword,
      is_active: true,
      created_at: new Date()
    };

    return await this.create(data);
  }

  async findByUsername(username) {
    const users = await this.findByConditions({ username, is_active: 1 });
    return users[0] || null;
  }

  async findByEmail(email) {
    const users = await this.findByConditions({ email, is_active: 1 });
    return users[0] || null;
  }

  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    return await this.update(id, {
      password: hashedPassword,
      updated_at: new Date()
    });
  }

  async deactivateUser(id) {
    return await this.update(id, {
      is_active: false,
      updated_at: new Date()
    });
  }

  async updateUser(id, userData) {
    const { password, ...otherData } = userData;
    const data = {
      ...otherData,
      updated_at: new Date()
    };

    // If password is provided and not empty, hash and update it
    if (password && password.trim() !== '') {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      data.password = hashedPassword;
    }

    return await this.update(id, data);
  }

  async getActiveUsers() {
    const [rows] = await this.pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC'
    );
    return rows;
  }
}

module.exports = new User();
