const { getDatabase, saveDatabase } = require('../config/database');
const crypto = require('crypto');

class UserModel {
  // 生成安全的随机token
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // 简单的密码强度验证
  static isPasswordStrong(password) {
    // 密码至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  // 验证用户凭据
  static async validateUser(username, password) {
    const db = getDatabase();
    const result = db.exec(`SELECT id, username, name FROM users WHERE username = ? AND password = ?`, [username, password]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const row = result[0].values[0];
      const columns = result[0].columns;
      const user = {};
      columns.forEach((col, index) => {
        user[col] = row[index];
      });
      return user;
    }
    
    return null;
  }

  // 获取所有用户
  static async getAllUsers() {
    const db = getDatabase();
    const result = db.exec('SELECT id, username, name, created_at FROM users');
    
    if (result.length > 0) {
      const columns = result[0].columns;
      const users = result[0].values.map(row => {
        const user = {};
        columns.forEach((col, index) => {
          user[col] = row[index];
        });
        return user;
      });
      return users;
    }
    
    return [];
  }

  // 根据ID获取用户
  static async getUserById(id) {
    const db = getDatabase();
    const result = db.exec('SELECT id, username, name, created_at FROM users WHERE id = ?', [id]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const row = result[0].values[0];
      const columns = result[0].columns;
      const user = {};
      columns.forEach((col, index) => {
        user[col] = row[index];
      });
      return user;
    }
    
    return null;
  }

  // 更新用户账号密码
  static async updateUserAccount(userId, newUsername, newPassword) {
    const db = getDatabase();
    
    // 检查新用户名是否已存在（排除当前用户）
    const existingUser = db.exec(
      'SELECT id FROM users WHERE username = ? AND id != ?', 
      [newUsername, userId]
    );
    
    if (existingUser.length > 0 && existingUser[0].values.length > 0) {
      throw new Error('用户名已存在');
    }
    
    // 更新用户信息
    db.run(
      'UPDATE users SET username = ?, password = ? WHERE id = ?',
      [newUsername, newPassword, userId]
    );
    
    // 保存数据库
    saveDatabase();
    
    return true;
  }

  // 重置用户表（删除所有用户，下次登录时从环境变量重新初始化）
  static async resetUsers() {
    const db = getDatabase();
    db.run('DELETE FROM users');
    
    // 从环境变量获取默认用户名和密码
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    db.run(`INSERT INTO users (username, password, name) VALUES (?, ?, ?)`, 
      [defaultUsername, defaultPassword, '管理员']);
    
    // 保存数据库
    saveDatabase();
    
    return true;
  }
}

module.exports = UserModel;